










import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [retryingOrderId, setRetryingOrderId] = useState(null);
  const [retryError, setRetryError] = useState("");
  const [retrySuccess, setRetrySuccess] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(
        response.data.orders ||
          response.data.data?.orders ||
          []
      );
    } catch (error) {
      console.error("Orders error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    return status?.toLowerCase().replaceAll("_", "-") || "";
  };




  const getPaymentStatus = (order) =>
  (
    order.paymentStatus ||
    order.payment?.status ||
    "PENDING"
  ).toUpperCase();










  const loadRazorpayScript = () =>
    new Promise((resolve) => {
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

  const handleRetryPayment = async (order) => {
    const checkoutPaymentId = order.checkoutPayment?.id;

    if (!checkoutPaymentId) {
      setRetryError("Checkout payment details are unavailable.");
      return;
    }

    try {
      setRetryingOrderId(checkoutPaymentId);
      setRetryError("");
      setRetrySuccess("");

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const response = await api.post(
        `/orders/checkout/${checkoutPaymentId}/retry-payment`
      );

      const { razorpay, checkoutPayment } = response.data;

      if (!razorpay?.keyId || !razorpay?.orderId) {
        throw new Error("Razorpay payment details are missing.");
      }

      const options = {
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency || "INR",
        name: "MyKasho",
        description: `Checkout ${checkoutPayment.checkoutNumber}`,
        order_id: razorpay.orderId,

        handler: async (paymentResponse) => {
          try {
            const verification = await api.post(
              "/orders/payment/verify",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }
            );

            if (!verification.data?.success) {
              throw new Error(
                verification.data?.message ||
                  "Payment verification failed."
              );
            }

            setRetrySuccess("Payment verified successfully.");
            await fetchOrders();
          } catch (err) {
            setRetryError(
              err.response?.data?.message ||
                err.message ||
                "Payment may have completed, but verification failed."
            );
          } finally {
            setRetryingOrderId(null);
          }
        },

        modal: {
          ondismiss: () => {
            setRetryingOrderId(null);
          },
        },
      };

      const paymentWindow = new window.Razorpay(options);

      paymentWindow.on("payment.failed", (event) => {
        setRetryError(
          event.error?.description ||
            "Payment failed. Please try again."
        );
        setRetryingOrderId(null);
      });

      paymentWindow.open();
    } catch (err) {
      setRetryError(
        err.response?.data?.message ||
          err.message ||
          "Unable to retry payment."
      );
      setRetryingOrderId(null);
    }
  };








  if (loading) {
    return (
      <main className="orders-message">
        Loading your orders...
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-message">
        <h2>{error}</h2>

        <button onClick={fetchOrders}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="orders-header">
        <div>
          <span>MYKASHO</span>
          <h1>My Orders</h1>
          <p>
            View and track all your orders in one place.
          </p>
        </div>

        <button
          className="shop-more-button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>



      {retryError && (
        <p role="alert" style={{ color: "red" }}>
          {retryError}
        </p>
      )}

      {retrySuccess && (
        <p role="status" style={{ color: "green" }}>
          {retrySuccess}
        </p>
      )}



      {orders.length === 0 ? (
        <section className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            Your orders will appear here after you
            place your first order.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>

        </section>
      ) : (
        <section className="orders-list">

          {orders.map((order) => {

        const items = order.items || [];

const checkout = order.checkoutPayment;

const isFirstCheckoutOrder =
  !checkout ||
  orders.findIndex(
    (item) => item.checkoutPayment?.id === checkout.id
  ) === orders.findIndex(
    (item) => item.id === order.id
  );

const isRetryable =
  isFirstCheckoutOrder &&
  checkout?.method === "ONLINE" &&
  checkout?.status === "PENDING" &&
  getPaymentStatus(order) !== "PAID";



            return (
              <article
                className="order-card"
                key={order.id}
              >

                {/* Order header */}

                <div className="order-card-header">

                  <div>
                    <small>ORDER NUMBER</small>

                    <h2>
                      {order.orderNumber || order.id}
                    </h2>
                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Shop */}

                {order.shop?.name && (
                  <div className="order-shop">

                    <span className="shop-icon">
                      🏪
                    </span>

                    <div>
                      <small>SHOP</small>

                      <strong>
                        {order.shop.name}
                      </strong>
                    </div>

                  </div>
                )}

                {/* Items */}

                <div className="order-items">

                  {items.slice(0, 3).map((item) => (
                    <div
                      className="order-item"
                      key={item.id}
                    >

                      <div className="order-item-icon">
                        📦
                      </div>

                      <div className="order-item-info">

                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          ₹
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}
                          {" × "}
                          {item.quantity}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {Number(
                          item.lineTotal
                        ).toFixed(2)}
                      </strong>

                    </div>
                  ))}

                  {items.length > 3 && (
                    <div className="more-items">
                      +{items.length - 3} more item
                      {items.length - 3 > 1
                        ? "s"
                        : ""}
                    </div>
                  )}

                </div>

                {/* Order footer */}

                <div className="order-card-footer">

                  <div className="order-total">

                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount ?? order.total ?? 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div className="order-payment">

                    <span>
                      {order.paymentMethod ||
                        order.payment?.provider ||
                        "Payment"}
                    </span>

                    <small>
                      Payment:{" "}
                      {order.paymentStatus ||
                        order.payment?.status ||
                        "PENDING"}
                    </small>

                  </div>



{isRetryable && (
  <button
    className="view-order-button"
    disabled={retryingOrderId === checkout.id}
    onClick={() => handleRetryPayment(order)}
  >
    {retryingOrderId === checkout.id
      ? "Opening Payment..."
      : "Retry Payment"}
  </button>
)}



                  <button
                    className="view-order-button"
                    onClick={() =>
                      navigate(
                        `/orders/${order.id}`
                      )
                    }
                  >
                    View Order →
                  </button>

                </div>

              </article>
            );
          })}

        </section>
      )}

    </main>
  );
}

export default Orders;
