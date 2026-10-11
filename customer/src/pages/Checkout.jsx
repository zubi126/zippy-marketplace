import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";





const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};
















function Checkout() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    label: "Home",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");



const [checkoutSummary, setCheckoutSummary] = useState({
  subtotal: 0,
  deliveryFee: 0,
  platformFee: 0,
  total: 0,
});

const [loadingSummary, setLoadingSummary] = useState(true);


  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);


useEffect(() => {
  fetchCheckoutSummary(paymentMethod);
}, [paymentMethod]);


  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      setError("");

      const response = await api.get("/addresses");

      const addressList =
        response.data.addresses ||
        response.data.data ||
        [];

      setAddresses(addressList);

      const defaultAddress = addressList.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (addressList.length > 0) {
        setSelectedAddress(addressList[0].id);
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your addresses."
      );
    } finally {
      setLoadingAddresses(false);
    }
  };



  const fetchCheckoutSummary = async (method = paymentMethod) => {
  try {
    setLoadingSummary(true);

    const response = await api.get(
      `/orders/summary?paymentMethod=${method}`
    );

    if (response.data?.success) {
      setCheckoutSummary(response.data.summary);
    }
  } catch (error) {
    console.error("Checkout summary error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to calculate checkout total."
    );
  } finally {
    setLoadingSummary(false);
  }
};




  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      setSavingAddress(true);
      setError("");

      const response = await api.post(
        "/addresses",
        addressForm
      );

      const newAddress =
        response.data.address ||
        response.data.data;

      if (newAddress) {
        setAddresses((prev) => [...prev, newAddress]);
        setSelectedAddress(newAddress.id);
      } else {
        await fetchAddresses();
      }

      setAddressForm({
        label: "Home",
        fullAddress: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowAddressForm(false);
    } catch (error) {
      console.error("Add address error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to add address."
      );
    } finally {
      setSavingAddress(false);
    }
  };















// const handleContinue = async () => {
//   if (!selectedAddress) {
//     setError("Please select a delivery address.");
//     return;
//   }

//   if (!paymentMethod) {
//     setError("Please select a payment method.");
//     return;
//   }

//   try {
//     setError("");
//     setSavingAddress(true);

//     const response = await api.post("/orders", {
//       addressId: selectedAddress,
//       paymentMethod,
//     });

//     const order = response.data.order;

//     if (!order) {
//       throw new Error("Order was not returned by the server.");
//     }

//     // COD
//     if (paymentMethod === "COD") {
//       navigate(`/order-success/${order.id}`);
//       return;
//     }

//     // ONLINE PAYMENT
//     const razorpay = response.data.razorpay;

//     if (!razorpay) {
//       throw new Error("Razorpay payment details were not returned.");
//     }

//     const scriptLoaded = await loadRazorpayScript();

//     if (!scriptLoaded) {
//       throw new Error("Unable to load Razorpay checkout.");
//     }

//     const options = {
//       key: razorpay.keyId,
//       amount: razorpay.amount,
//       currency: razorpay.currency,
//       name: "MyKasho",
//       description: `Order ${order.orderNumber}`,
//       order_id: razorpay.orderId,

//       handler: async function (paymentResponse) {
//         try {
//           setError("");
//           setSavingAddress(true);

//           const verifyResponse = await api.post(
//             "/orders/payment/verify",
//             {
//               razorpay_order_id:
//                 paymentResponse.razorpay_order_id,

//               razorpay_payment_id:
//                 paymentResponse.razorpay_payment_id,

//               razorpay_signature:
//                 paymentResponse.razorpay_signature,
//             }
//           );

//           if (verifyResponse.data?.success) {
//             navigate(`/order-success/${order.id}`);
//           } else {
//             throw new Error(
//               verifyResponse.data?.message ||
//                 "Payment verification failed."
//             );
//           }
//         } catch (error) {
//           console.error("Payment verification error:", error);

//           setError(
//             error.response?.data?.message ||
//               "Payment was completed but verification failed."
//           );
//         } finally {
//           setSavingAddress(false);
//         }
//       },

//      modal: {
//   ondismiss: async function () {
//     try {
//       await api.patch(`/orders/${order.id}/cancel`, {
//         reason: "ORDERED_BY_MISTAKE",
//         note: "Online payment was cancelled by the customer.",
//       });

//       setError("Payment cancelled. Your order has been cancelled.");
//     } catch (error) {
//       console.error("Cancel online order error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Payment was cancelled, but the order could not be cancelled."
//       );
//     } finally {
//       setSavingAddress(false);
//     }
//   },
// },
//     };

//     const razorpayCheckout = new window.Razorpay(options);

//     razorpayCheckout.on("payment.failed", function (response) {
//       console.error("Razorpay payment failed:", response.error);

//       setError(
//         response.error?.description ||
//           "Payment failed. Please try again."
//       );

//       setSavingAddress(false);
//     });

//     razorpayCheckout.open();
//   } catch (error) {
//     console.error("Create order error:", error);

//     setError(
//       error.response?.data?.message ||
//         error.message ||
//         "Unable to place order. Please try again."
//     );

//     setSavingAddress(false);
//   }
// };







// changed handlecontune



const handleContinue = async () => {
  if (!selectedAddress) {
    setError("Please select a delivery address.");
    return;
  }

  if (!paymentMethod) {
    setError("Please select a payment method.");
    return;
  }

  try {
    setError("");
    setSavingAddress(true);

    const response = await api.post("/orders", {
      addressId: selectedAddress,
      paymentMethod,
    });

 
const order = response.data.order;
const orders = response.data.orders || (order ? [order] : []);
const checkoutPaymentId = response.data.checkoutPayment?.id;

if (!order || orders.length === 0) {
  throw new Error("Order was not returned by the server.");
}

// Preserve the shared checkout ID so the success page
// can load every shop order belonging to this checkout.
const successUrl = `/order-success/${order.id}${
  checkoutPaymentId
    ? `?checkoutPaymentId=${encodeURIComponent(checkoutPaymentId)}`
    : ""
}`;


    // COD: all shop orders are created by the backend.
    if (paymentMethod === "COD") {
     navigate(successUrl);
      return;
    }

    // ONLINE: one Razorpay payment for the combined checkout.
    const razorpay = response.data.razorpay;

    if (!razorpay) {
      throw new Error("Razorpay payment details were not returned.");
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error("Unable to load Razorpay checkout.");
    }

    const options = {
      key: razorpay.keyId,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: "MyKasho",
      description: `Checkout ${response.data.checkoutPayment?.checkoutNumber || order.orderNumber}`,
      order_id: razorpay.orderId,

      handler: async function (paymentResponse) {
        try {
          setError("");
          setSavingAddress(true);

          const verifyResponse = await api.post(
            "/orders/payment/verify",
            {
              razorpay_order_id:
                paymentResponse.razorpay_order_id,
              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,
              razorpay_signature:
                paymentResponse.razorpay_signature,
            }
          );

          if (verifyResponse.data?.success) {
           navigate(successUrl);
          } else {
            throw new Error(
              verifyResponse.data?.message ||
                "Payment verification failed."
            );
          }
        } catch (error) {
          console.error("Payment verification error:", error);

          setError(
            error.response?.data?.message ||
              "Payment may have completed, but verification failed. Please contact support before trying to pay again."
          );
        } finally {
          setSavingAddress(false);
        }
      },

      modal: {
        ondismiss: function () {
          // Do not cancel only the first order in a multi-shop checkout.
          // Shared-checkout cancellation needs a dedicated backend flow.
          setError(
            "Payment window closed. Your orders may still be pending. Please check your order status before trying again."
          );
          setSavingAddress(false);
        },
      },
    };

    const razorpayCheckout = new window.Razorpay(options);

    razorpayCheckout.on("payment.failed", function (response) {
      console.error("Razorpay payment failed:", response.error);

      setError(
        response.error?.description ||
          "Payment failed. Please check your order status before trying again."
      );

      setSavingAddress(false);
    });

    razorpayCheckout.open();
  } catch (error) {
    console.error("Create order error:", error);

    setError(
      error.response?.data?.message ||
        error.message ||
        "Unable to place order. Please try again."
    );

    setSavingAddress(false);
  }
};





  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* Header */}
        <div className="checkout-header">
          <button
            className="back-button"
            onClick={() => navigate("/cart")}
          >
            ← Back to Cart
          </button>

          <h1>Checkout</h1>

          <p>
            Confirm your delivery address and payment method.
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-layout">

          {/* Left Side */}
          <div className="checkout-main">

            {/* Delivery Address */}
            <section className="checkout-card">

              <div className="section-heading">
                <div>
                  <span className="section-number">
                    1
                  </span>

                  <div>
                    <h2>Delivery Address</h2>

                    <p>
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="no-address">

                  <div className="no-address-icon">
                    📍
                  </div>

                  <h3>No saved addresses</h3>

                  <p>
                    Add an address to continue with your
                    order.
                  </p>

                </div>
              ) : (
                <div className="address-list">

                  {addresses.map((address) => (
                    <label
                      className={`address-card ${
                        selectedAddress === address.id
                          ? "selected"
                          : ""
                      }`}
                      key={address.id}
                    >

                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={
                          selectedAddress === address.id
                        }
                        onChange={(e) =>
                          setSelectedAddress(
                            e.target.value
                          )
                        }
                      />

                      <div className="address-content">

                        <div className="address-top">

                          <strong>
                            {address.label}
                          </strong>

                          {address.isDefault && (
                            <span className="default-badge">
                              Default
                            </span>
                          )}

                        </div>

                        <p>
                          {address.fullAddress}
                        </p>

                        <p>
                          {address.city},{" "}
                          {address.state} -{" "}
                          {address.pincode}
                        </p>

                      </div>

                    </label>
                  ))}

                </div>
              )}

              <button
                className="add-address-button"
                onClick={() =>
                  setShowAddressForm(
                    !showAddressForm
                  )
                }
              >
                {showAddressForm
                  ? "Cancel"
                  : "+ Add New Address"}
              </button>

              {showAddressForm && (
                <form
                  className="address-form"
                  onSubmit={handleAddAddress}
                >

                  <h3>Add New Address</h3>

                  <div className="form-group">

                    <label>Address Type</label>

                    <select
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressChange}
                    >
                      <option value="Home">
                        Home
                      </option>

                      <option value="Work">
                        Work
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                  </div>

                  <div className="form-group">

                    <label>Full Address</label>

                    <textarea
                      name="fullAddress"
                      placeholder="House number, street, locality..."
                      value={
                        addressForm.fullAddress
                      }
                      onChange={handleAddressChange}
                      required
                    />

                  </div>

                  <div className="form-row">

                    <div className="form-group">

                      <label>City</label>

                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>State</label>

                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>Pincode</label>

                    <input
                      type="text"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressChange}
                      maxLength={6}
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="save-address-button"
                    disabled={savingAddress}
                  >
                    {savingAddress
                      ? "Saving..."
                      : "Save Address"}
                  </button>

                </form>
              )}

            </section>

            {/* Payment Method */}
            <section className="checkout-card">

              <div className="section-heading">

                <div>
                  <span className="section-number">
                    2
                  </span>

                  <div>
                    <h2>Payment Method</h2>

                    <p>
                      Choose how you want to pay.
                    </p>
                  </div>
                </div>

              </div>

              <div className="payment-options">

                <label
                  className={`payment-card ${
                    paymentMethod === "COD"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    💵
                  </div>

                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Pay when your order arrives.
                    </p>

                  </div>

                </label>

                <label
                  className={`payment-card ${
                    paymentMethod === "ONLINE"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={
                      paymentMethod === "ONLINE"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    💳
                  </div>

                  <div>

                    <strong>
                      Online Payment
                    </strong>

                    <p>
                      Pay securely using Razorpay.
                    </p>

                  </div>

                </label>

              </div>

            </section>

          </div>

          {/* Right Side */}
          <aside className="checkout-summary">

            <div className="summary-card">

              <h2>Order Summary</h2>

              <div className="summary-row">

                <span>Items</span>

                <span>
                  From your cart
                </span>

              </div>






<div className="summary-row">
  <span>Subtotal</span>

  <strong>
    {loadingSummary
      ? "Calculating..."
      : `₹${Number(checkoutSummary.subtotal).toFixed(2)}`}
  </strong>
</div>

<div className="summary-row">
  <span>Delivery Fee</span>

  <strong>
    {loadingSummary
      ? "Calculating..."
      : `₹${Number(checkoutSummary.deliveryFee).toFixed(2)}`}
  </strong>
</div>

<div className="summary-row">
  <span>Platform Fee</span>

  <strong>
    {loadingSummary
      ? "Calculating..."
      : `₹${Number(checkoutSummary.platformFee).toFixed(2)}`}
  </strong>
</div>

<div className="summary-divider"></div>

<div className="summary-total">
  <span>Total</span>

  <strong>
    {loadingSummary
      ? "Calculating..."
      : `₹${Number(checkoutSummary.total).toFixed(2)}`}
  </strong>
</div>






              <button
  className="place-order-button"
  onClick={handleContinue}
  disabled={savingAddress || !selectedAddress}
>
  {savingAddress ? "Placing Order..." : "Place Order"}
</button>

              <div className="secure-checkout">
                🔒 Secure Checkout
              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Checkout;