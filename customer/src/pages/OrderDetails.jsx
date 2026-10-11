import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



const [showCancelModal, setShowCancelModal] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [cancelNote, setCancelNote] = useState("");
const [cancelling, setCancelling] = useState(false);



const [showRefundModal, setShowRefundModal] = useState(false);
const [refundReason, setRefundReason] = useState("");
const [refundNote, setRefundNote] = useState("");
const [refundAmount, setRefundAmount] = useState("");
const [requestingRefund, setRequestingRefund] = useState(false);




  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/orders/${orderId}`);

        setOrder(response.data.order);
      } catch (error) {
        console.error("Order details error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);








const handleCancelOrder = async () => {
  if (!cancelReason) {
    setError("Please select a cancellation reason.");
    return;
  }

  if (
    cancelReason === "OTHER" &&
    !cancelNote.trim()
  ) {
    setError("Please provide a cancellation note.");
    return;
  }

  try {
    setCancelling(true);
    setError("");

    const response = await api.patch(
      `/orders/${orderId}/cancel`,
      {
        reason: cancelReason,
        note: cancelNote.trim(),
      }
    );

    setOrder(response.data.order);

    setShowCancelModal(false);
    setCancelReason("");
    setCancelNote("");
  } catch (error) {
    console.error("Cancel order error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to cancel order."
    );
  } finally {
    setCancelling(false);
  }
};












const handleRefundRequest = async () => {
  if (!refundReason) {
    setError("Please select a refund reason.");
    return;
  }

  if (!refundAmount || Number(refundAmount) <= 0) {
    setError("Please enter a valid refund amount.");
    return;
  }

  if (refundReason === "OTHER" && !refundNote.trim()) {
    setError("Please provide a refund note.");
    return;
  }

  try {
    setRequestingRefund(true);
    setError("");

    const response = await api.post(
      `/orders/${orderId}/refund-request`,
      {
        reason: refundReason,
        note: refundNote.trim(),
        amount: Number(refundAmount),
      }
    );

    setOrder((prev) => ({
      ...prev,
      refundRequests: [
        ...(prev.refundRequests || []),
        response.data.refundRequest,
      ],
    }));

    setShowRefundModal(false);
    setRefundReason("");
    setRefundNote("");
    setRefundAmount("");
  } catch (error) {
    console.error("Refund request error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to submit refund request."
    );
  } finally {
    setRequestingRefund(false);
  }
};




  if (loading) {
    return (
      <main className="order-details-message">
        Loading order...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-details-message">
        <h2>{error || "Order not found"}</h2>

        <button onClick={() => navigate("/orders")}>
          My Orders
        </button>
      </main>
    );
  }

  const items = order.items || [];
  const deliveries = order.deliveries || [];
  const delivery = deliveries[0];
  const rider = delivery?.rider;

  const statusSteps = [
    {
      key: "PENDING",
      title: "Order Placed",
      description: "Your order has been received.",
    },
    {
      key: "CONFIRMED",
      title: "Order Confirmed",
      description: "The shop has confirmed your order.",
    },
    {
      key: "PREPARING",
      title: "Preparing",
      description: "Your order is being prepared.",
    },
    {
      key: "READY_FOR_PICKUP",
      title: "Ready for Pickup",
      description: "Your order is ready for delivery.",
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Out for Delivery",
      description: "Your order is on the way.",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      description: "Your order has been delivered.",
    },
  ];

  const statusOrder = statusSteps.map((step) => step.key);

  const currentStatusIndex =
    statusOrder.indexOf(order.status);

  return (
    <main className="order-details-page">

      <div className="order-details-header">
        <button
          className="back-button"
          onClick={() => navigate("/orders")}
        >
          ← My Orders
        </button>

        <div>
          <span>MYKASHO</span>
          <h1>Order Details</h1>
        </div>
      </div>

      {/* Order header */}

      <section className="order-card order-main-card">

        <div className="order-main-top">
          <div>
            <small>ORDER NUMBER</small>

            <h2>
              {order.orderNumber || order.id}
            </h2>
          </div>

          <div className="order-status-badge">
            {order.status}
          </div>
        </div>







{["PENDING", "CONFIRMED"].includes(order.status) && (
  <button
    className="cancel-order-button"
    onClick={() => {
      setError("");
      setShowCancelModal(true);
    }}
  >
    Cancel Order
  </button>
)}








{order.payment?.status === "PAID" &&
  order.payment?.provider === "RAZORPAY" &&
  !["CANCELLED", "DELIVERED"].includes(order.status) && (
    <button
      className="refund-order-button"
      onClick={() => {
        setError("");
        setRefundAmount(
          Number(order.payment.amount || order.totalAmount || 0).toString()
        );
        setShowRefundModal(true);
      }}
    >
      Request Refund
    </button>
  )}







        {order.shop?.name && (
          <div className="order-shop">
            <span>🏪</span>

            <div>
              <small>SHOP</small>
              <strong>{order.shop.name}</strong>
            </div>
          </div>
        )}

      </section>

      {/* Tracking */}

      <section className="order-card">

        <div className="section-heading">
          <div>
            <span>LIVE STATUS</span>
            <h2>Track Your Order</h2>
          </div>
        </div>

        <div className="tracking-timeline">

          {statusSteps.map((step, index) => {

            const completed =
              currentStatusIndex >= index;

            const active =
              currentStatusIndex === index;

            return (
              <div
                className={`tracking-step ${
                  completed ? "completed" : ""
                } ${active ? "active" : ""}`}
                key={step.key}
              >

                <div className="tracking-dot">
                  {completed ? "✓" : index + 1}
                </div>

                <div className="tracking-content">
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>

              </div>
            );
          })}

        </div>

        {rider && (
          <div className="rider-card">

            <div className="rider-icon">
              🛵
            </div>

            <div>
              <small>DELIVERY PARTNER</small>

              <strong>
                Your rider has been assigned
              </strong>

              <span>
                Vehicle: {rider.vehicleType || "Delivery vehicle"}
              </span>
            </div>

          </div>
        )}

      </section>

      {/* Products */}

      <section className="order-card">

        <div className="section-heading">
          <div>
            <span>YOUR ORDER</span>
            <h2>Items</h2>
          </div>
        </div>

        <div className="order-items">

          {items.map((item) => (
            <article
              className="order-item"
              key={item.id}
            >

              <div className="order-item-image">
                📦
              </div>

              <div className="order-item-info">
                <strong>
                  {item.productName}
                </strong>

                <span>
                  ₹{Number(item.unitPrice).toFixed(2)}
                  {" × "}
                  {item.quantity}
                </span>
              </div>

              <strong className="order-item-total">
                ₹{Number(item.lineTotal).toFixed(2)}
              </strong>

            </article>
          ))}

        </div>

      </section>

      {/* Delivery + payment */}

      <div className="order-two-column">

        <section className="order-card">

          <div className="section-heading">
            <div>
              <span>DELIVERY</span>
              <h2>Delivery Address</h2>
            </div>
          </div>

          <div className="address-box">

            <strong>
              {order.deliveryName}
            </strong>

            <span>
              {order.deliveryPhone}
            </span>

            <p>
              {order.deliveryFullAddress}
            </p>

            <p>
              {order.deliveryCity},{" "}
              {order.deliveryState}
              {order.deliveryPincode
                ? ` - ${order.deliveryPincode}`
                : ""}
            </p>

          </div>

        </section>

        <section className="order-card">

          <div className="section-heading">
            <div>
              <span>PAYMENT</span>
              <h2>Payment Summary</h2>
            </div>
          </div>

          <div className="payment-info">

            <div>
              <span>Method</span>
              <strong>
                {order.paymentMethod}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {order.paymentStatus}
              </strong>
            </div>

            {order.payment && (
              <div>
                <span>Payment</span>
                <strong>
                  {order.payment.status}
                </strong>
              </div>
            )}

          </div>

        </section>

      </div>

      {/* Price summary */}

      <section className="order-card order-summary-card">

        <div className="section-heading">
          <div>
            <span>SUMMARY</span>
            <h2>Order Total</h2>
          </div>
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <strong>
            ₹{Number(order.subtotal).toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>Delivery Fee</span>
          <strong>
            ₹{Number(order.deliveryFee).toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>Platform Fee</span>
          <strong>
            ₹{Number(order.platformFee).toFixed(2)}
          </strong>
        </div>

        <div className="summary-divider" />

        <div className="summary-total">
          <span>Total</span>
          <strong>
            ₹{Number(order.total).toFixed(2)}
          </strong>
        </div>

      </section>








{showCancelModal && (
  <div className="cancel-modal-overlay">

    <div className="cancel-modal">

      <div className="cancel-modal-header">
        <div>
          <span>CANCEL ORDER</span>
          <h2>Why are you cancelling?</h2>
        </div>

        <button
          className="cancel-modal-close"
          onClick={() => {
            setShowCancelModal(false);
            setCancelReason("");
            setCancelNote("");
            setError("");
          }}
        >
          ×
        </button>
      </div>

      <div className="cancel-reasons">

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="CHANGED_MIND"
            checked={
              cancelReason === "CHANGED_MIND"
            }
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Changed my mind</span>
        </label>

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="ORDERED_BY_MISTAKE"
            checked={
              cancelReason === "ORDERED_BY_MISTAKE"
            }
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Ordered by mistake</span>
        </label>

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="BETTER_PRICE"
            checked={
              cancelReason === "BETTER_PRICE"
            }
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Found a better price</span>
        </label>

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="DELIVERY_TAKING_TOO_LONG"
            checked={
              cancelReason ===
              "DELIVERY_TAKING_TOO_LONG"
            }
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Delivery is taking too long</span>
        </label>

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="PRODUCT_NOT_NEEDED"
            checked={
              cancelReason ===
              "PRODUCT_NOT_NEEDED"
            }
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Product is no longer needed</span>
        </label>

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="WRONG_PRODUCT_OR_QUANTITY"
            checked={
              cancelReason ===
              "WRONG_PRODUCT_OR_QUANTITY"
            }
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Wrong product or quantity</span>
        </label>

        <label>
          <input
            type="radio"
            name="cancelReason"
            value="OTHER"
            checked={cancelReason === "OTHER"}
            onChange={(e) =>
              setCancelReason(e.target.value)
            }
          />
          <span>Other</span>
        </label>

      </div>

      {cancelReason === "OTHER" && (
        <textarea
          className="cancel-note"
          placeholder="Please tell us why you want to cancel..."
          value={cancelNote}
          onChange={(e) =>
            setCancelNote(e.target.value)
          }
        />
      )}

      {error && (
        <div className="cancel-error">
          {error}
        </div>
      )}

      <div className="cancel-modal-actions">

        <button
          className="keep-order-button"
          onClick={() => {
            setShowCancelModal(false);
            setCancelReason("");
            setCancelNote("");
            setError("");
          }}
          disabled={cancelling}
        >
          Keep Order
        </button>

        <button
          className="confirm-cancel-button"
          onClick={handleCancelOrder}
          disabled={cancelling}
        >
          {cancelling
            ? "Cancelling..."
            : "Cancel Order"}
        </button>

      </div>

    </div>

  </div>
)}











{showRefundModal && (
  <div className="cancel-modal-overlay">
    <div className="cancel-modal">
      <div className="cancel-modal-header">
        <div>
          <span>REFUND REQUEST</span>
          <h2>Request a refund</h2>
        </div>

        <button
          className="cancel-modal-close"
          onClick={() => {
            setShowRefundModal(false);
            setRefundReason("");
            setRefundNote("");
            setRefundAmount("");
            setError("");
          }}
        >
          ×
        </button>
      </div>

      <div className="cancel-reasons">
        {[
          ["PRODUCT_NOT_RECEIVED", "Product was not received"],
          ["WRONG_PRODUCT", "Wrong product received"],
          ["DAMAGED_PRODUCT", "Product was damaged"],
          ["PRODUCT_NOT_AS_DESCRIBED", "Product was not as described"],
          ["OTHER", "Other"],
        ].map(([value, label]) => (
          <label key={value} className="cancel-reason-option">
            <input
              type="radio"
              name="refundReason"
              value={value}
              checked={refundReason === value}
              onChange={(e) => {
                setRefundReason(e.target.value);
                setError("");
              }}
            />

            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="refund-amount-section">
        <label>Refund Amount</label>

        <input
          type="number"
          min="1"
          max={Number(order.payment?.amount || order.totalAmount || 0)}
          value={refundAmount}
          onChange={(e) => setRefundAmount(e.target.value)}
          placeholder="Enter refund amount"
        />

        <small>
          Maximum refundable amount: ₹
          {Number(
            order.payment?.amount || order.totalAmount || 0
          ).toFixed(2)}
        </small>
      </div>

      {refundReason === "OTHER" && (
        <textarea
          className="cancel-note"
          placeholder="Please tell us why you want a refund..."
          value={refundNote}
          onChange={(e) => setRefundNote(e.target.value)}
        />
      )}

      {error && <div className="cancel-error">{error}</div>}

      <div className="cancel-modal-actions">
        <button
          className="keep-order-button"
          onClick={() => {
            setShowRefundModal(false);
            setRefundReason("");
            setRefundNote("");
            setRefundAmount("");
            setError("");
          }}
        >
          Go Back
        </button>

        <button
          className="confirm-cancel-button"
          onClick={handleRefundRequest}
          disabled={requestingRefund}
        >
          {requestingRefund ? "Submitting..." : "Submit Refund Request"}
        </button>
      </div>
    </div>
  </div>
)}
















    </main>
  );
}

export default OrderDetails;