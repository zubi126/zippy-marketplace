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


const [updatingStatus, setUpdatingStatus] = useState(false);
const [statusError, setStatusError] = useState("");




  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/shop/orders");

      const orders = response.data.orders || [];

      const foundOrder = orders.find(
        (item) => item.id === orderId
      );

      if (!foundOrder) {
        setError("Order not found.");
        return;
      }

      setOrder(foundOrder);
    } catch (error) {
      console.error("Failed to fetch order:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const statusLabels = {
      PENDING: "New",
      CONFIRMED: "Accepted",
      PREPARING: "Preparing",
      READY_FOR_PICKUP: "Ready",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };

    return statusLabels[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentStatus = () => {
    if (!order?.payment) {
      return "Not Available";
    }

    return order.payment.status || "Pending";
  };

  if (loading) {
    return (
      <main className="seller-content order-details-page">
        <div className="order-details-loading">
          Loading order details...
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="seller-content order-details-page">
        <div className="order-details-error">
          <h2>Unable to load order</h2>

          <p>{error || "Order not found."}</p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </main>
    );
  }










const handleStatusChange = async (newStatus) => {
  try {
    setUpdatingStatus(true);
    setStatusError("");

    const response = await api.patch(
      `/orders/shop/${order.id}/status`,
      {
        status: newStatus,
      }
    );

    if (response.data?.order) {
      setOrder((currentOrder) => ({
        ...currentOrder,
        ...response.data.order,
      }));
    } else {
      setOrder((currentOrder) => ({
        ...currentOrder,
        status: newStatus,
      }));
    }
  } catch (error) {
    console.error("Failed to update order status:", error);

    setStatusError(
      error.response?.data?.message ||
        "Unable to update order status."
    );
  } finally {
    setUpdatingStatus(false);
  }
};





  return (
    <main className="seller-content order-details-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="order-details-header">
        <div>
          <button
            type="button"
            className="back-to-orders"
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>

          <p className="order-details-eyebrow">
            ORDER DETAILS
          </p>

          <h1>
            {order.orderNumber || order.id}
          </h1>

          <p>
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`order-details-status status-${order.status?.toLowerCase()}`}
        >
          {formatStatus(order.status)}
        </span>






<div className="order-status-actions">
  {order.status === "PENDING" && (
    <button
      type="button"
      disabled={updatingStatus}
      onClick={() => handleStatusChange("CONFIRMED")}
    >
      {updatingStatus ? "Updating..." : "Accept Order"}
    </button>
  )}

  {order.status === "CONFIRMED" && (
    <button
      type="button"
      disabled={updatingStatus}
      onClick={() => handleStatusChange("PREPARING")}
    >
      {updatingStatus ? "Updating..." : "Start Preparing"}
    </button>
  )}

  {order.status === "PREPARING" && (
    <button
      type="button"
      disabled={updatingStatus}
      onClick={() => handleStatusChange("READY_FOR_PICKUP")}
    >
      {updatingStatus ? "Updating..." : "Mark Ready"}
    </button>
  )}
</div>

{statusError && (
  <div className="order-status-error">
    {statusError}
  </div>
)}






      </div>

      {/* =========================
          ORDER INFORMATION
      ========================= */}

      <section className="order-details-grid">
        {/* Customer */}
        <div className="order-details-card">
          <div className="order-details-card-header">
            <h2>Customer</h2>
          </div>

          <div className="order-info-list">
            <div>
              <span>Name</span>
              <strong>
                {order.customer?.name || "-"}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {order.customer?.phone || "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="order-details-card">
          <div className="order-details-card-header">
            <h2>Payment</h2>
          </div>

          <div className="order-info-list">
            <div>
              <span>Method</span>
              <strong>
                {order.payment?.provider ||
                  order.paymentMethod ||
                  "COD"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {getPaymentStatus()}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PRODUCTS
      ========================= */}

      <section className="order-details-card">
        <div className="order-details-card-header">
          <h2>Order Items</h2>

          <span>
            {order.items?.length || 0} item
            {order.items?.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="order-items">
          {order.items?.map((item) => (
            <div
              className="order-item"
              key={item.id}
            >
              <div className="order-item-main">
                <strong>
                  {item.productName}
                </strong>

                <span>
                  ₹{Number(item.unitPrice || 0).toFixed(2)}
                  {" × "}
                  {item.quantity}
                </span>
              </div>

              <strong>
                ₹{Number(item.lineTotal || 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          DELIVERY
      ========================= */}

      <section className="order-details-card">
        <div className="order-details-card-header">
          <h2>Delivery</h2>
        </div>

        {order.deliveries?.length > 0 ? (
          <div className="order-info-list">
            <div>
              <span>Delivery Status</span>

              <strong>
                {order.deliveries[0]?.status || "-"}
              </strong>
            </div>

            <div>
              <span>Rider</span>

              <strong>
                {order.deliveries[0]?.riderId
                  ? "Assigned"
                  : "Not Assigned"}
              </strong>
            </div>

            <div>
              <span>Delivery Fee</span>

              <strong>
                ₹
                {Number(
                  order.deliveries[0]?.deliveryFee || 0
                ).toFixed(2)}
              </strong>
            </div>
          </div>
        ) : (
          <div className="no-delivery">
            No delivery assigned yet.
          </div>
        )}
      </section>

      {/* =========================
          ORDER SUMMARY
      ========================= */}

      <section className="order-details-card order-summary-card">
        <div className="order-details-card-header">
          <h2>Order Summary</h2>
        </div>

        <div className="order-summary">
          <div>
            <span>Subtotal</span>

            <strong>
              ₹{Number(order.subtotal || 0).toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Delivery Fee</span>

            <strong>
              ₹
              {Number(order.deliveryFee || 0).toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Platform Fee</span>

            <strong>
              ₹
              {Number(order.platformFee || 0).toFixed(2)}
            </strong>
          </div>

          <div className="order-summary-total">
            <span>Total</span>

            <strong>
              ₹{Number(order.total || 0).toFixed(2)}
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;