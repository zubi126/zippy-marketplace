import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./DeliveryDetails.css";

function DeliveryDetails() {
  const { deliveryId } = useParams();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDelivery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/riders/deliveries");

      const deliveries =
        response.data?.deliveries || [];

      const foundDelivery = deliveries.find(
        (item) => String(item.id) === String(deliveryId)
      );

      if (!foundDelivery) {
        setError("Delivery not found.");
        setDelivery(null);
        return;
      }

      setDelivery(foundDelivery);
    } catch (error) {
      console.error(
        "Failed to load delivery:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load delivery details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, [deliveryId]);

  const handleAction = async (action) => {
    if (!delivery) return;

    try {
      setActionLoading(true);
      setError("");

      let response;

      if (action === "accept") {
        response = await api.patch(
          `/riders/deliveries/${deliveryId}/accept`
        );
      }

      if (action === "reject") {
        response = await api.patch(
          `/riders/deliveries/${deliveryId}/reject`
        );
      }

      if (action === "pickup") {
        response = await api.patch(
          `/riders/deliveries/${deliveryId}/pickup`
        );
      }

      if (action === "deliver") {
        response = await api.patch(
          `/riders/deliveries/${deliveryId}/deliver`
        );
      }

      if (response?.data) {
        await fetchDelivery();
      }
    } catch (error) {
      console.error(
        `Delivery ${action} error:`,
        error
      );

      setError(
        error.response?.data?.message ||
          `Unable to ${action} delivery.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    return String(status || "UNKNOWN")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "assigned";

      case "ACCEPTED":
        return "accepted";

      case "PICKED_UP":
        return "picked-up";

      case "DELIVERED":
        return "delivered";

      case "CANCELLED":
        return "cancelled";

      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <main className="rider-delivery-details-page">
        <div className="rider-delivery-details-loading">
          Loading delivery...
        </div>
      </main>
    );
  }

  if (!delivery) {
    return (
      <main className="rider-delivery-details-page">
        <div className="rider-delivery-details-container">
          <button
            type="button"
            className="delivery-back-button"
            onClick={() => navigate("/deliveries")}
          >
            ← Back to Deliveries
          </button>

          <div className="delivery-details-error-card">
            <h2>Delivery Not Found</h2>

            <p>
              {error ||
                "This delivery could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const order = delivery.order || {};

  const canAccept =
    delivery.status === "ASSIGNED";

  const canReject =
    delivery.status === "ASSIGNED";

  const canPickup =
    delivery.status === "ACCEPTED";

  const canDeliver =
    delivery.status === "PICKED_UP";

  return (
    <main className="rider-delivery-details-page">
      <div className="rider-delivery-details-container">
        <button
          type="button"
          className="delivery-back-button"
          onClick={() => navigate("/deliveries")}
        >
          ← Back to Deliveries
        </button>

        {error && (
          <div className="delivery-details-error">
            {error}
          </div>
        )}

        <div className="delivery-details-header">
          <div>
            <p className="delivery-details-order-number">
              {order.orderNumber || "Order"}
            </p>

            <h1>Delivery Details</h1>

            <p>
              Review the order and update delivery status.
            </p>
          </div>

          <span
            className={`delivery-details-status ${getStatusClass(
              delivery.status
            )}`}
          >
            {getStatusLabel(delivery.status)}
          </span>
        </div>

        <div className="delivery-details-grid">
          <section className="delivery-details-card">
            <div className="delivery-card-title">
              <h2>Customer</h2>
            </div>

            <div className="delivery-info-list">
              <div className="delivery-info-row">
                <span>Name</span>
                <strong>
                  {order.deliveryName ||
                    "Not available"}
                </strong>
              </div>

              <div className="delivery-info-row">
                <span>Phone</span>
                <strong>
                  {order.deliveryPhone ||
                    "Not available"}
                </strong>
              </div>

              <div className="delivery-info-row address-row">
                <span>Address</span>

                <strong>
                  {order.deliveryFullAddress ||
                    "Not available"}
                </strong>
              </div>

              {(order.deliveryCity ||
                order.deliveryState ||
                order.deliveryPincode) && (
                <div className="delivery-info-row">
                  <span>Location</span>

                  <strong>
                    {order.deliveryCity || ""}
                    {order.deliveryState
                      ? `, ${order.deliveryState}`
                      : ""}
                    {order.deliveryPincode
                      ? ` - ${order.deliveryPincode}`
                      : ""}
                  </strong>
                </div>
              )}
            </div>

            {order.deliveryPhone && (
              <a
                href={`tel:${order.deliveryPhone}`}
                className="call-customer-button"
              >
                📞 Call Customer
              </a>
            )}
          </section>

          <section className="delivery-details-card">
            <div className="delivery-card-title">
              <h2>Order Summary</h2>
            </div>

            <div className="delivery-info-list">
              <div className="delivery-info-row">
                <span>Order Number</span>

                <strong>
                  {order.orderNumber || "—"}
                </strong>
              </div>

              <div className="delivery-info-row">
                <span>Payment Method</span>

                <strong>
                  {order.paymentMethod || "—"}
                </strong>
              </div>

              <div className="delivery-info-row">
                <span>Payment Status</span>

                <strong>
                  {order.paymentStatus || "—"}
                </strong>
              </div>

              <div className="delivery-info-row">
                <span>Subtotal</span>

                <strong>
                  ₹
                  {Number(
                    order.subtotal || 0
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="delivery-info-row">
                <span>Delivery Fee</span>

                <strong>
                  ₹
                  {Number(
                    order.deliveryFee || 0
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="delivery-info-row">
                <span>Platform Fee</span>

                <strong>
                  ₹
                  {Number(
                    order.platformFee || 0
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="delivery-total-row">
                <span>Total</span>

                <strong>
                  ₹
                  {Number(
                    order.total || 0
                  ).toFixed(2)}
                </strong>
              </div>
            </div>
          </section>

          <section className="delivery-details-card">
            <div className="delivery-card-title">
              <h2>Your Earning</h2>
            </div>

            <div className="delivery-earning-box">
              <span>Delivery Earning</span>

              <strong>
                ₹
                {Number(
                  delivery.riderEarning ||
                    order.deliveryFee ||
                    0
                ).toFixed(2)}
              </strong>
            </div>
          </section>

          <section className="delivery-details-card">
            <div className="delivery-card-title">
              <h2>Delivery Progress</h2>
            </div>

            <div className="delivery-timeline">
              <div
                className={`timeline-item ${
                  [
                    "ASSIGNED",
                    "ACCEPTED",
                    "PICKED_UP",
                    "DELIVERED",
                  ].includes(
                    delivery.status
                  )
                    ? "completed"
                    : ""
                }`}
              >
                <div className="timeline-dot"></div>

                <div>
                  <strong>Assigned</strong>
                  <span>
                    Delivery assigned to you
                  </span>
                </div>
              </div>

              <div
                className={`timeline-item ${
                  [
                    "ACCEPTED",
                    "PICKED_UP",
                    "DELIVERED",
                  ].includes(
                    delivery.status
                  )
                    ? "completed"
                    : ""
                }`}
              >
                <div className="timeline-dot"></div>

                <div>
                  <strong>Accepted</strong>
                  <span>
                    Delivery accepted
                  </span>
                </div>
              </div>

              <div
                className={`timeline-item ${
                  [
                    "PICKED_UP",
                    "DELIVERED",
                  ].includes(
                    delivery.status
                  )
                    ? "completed"
                    : ""
                }`}
              >
                <div className="timeline-dot"></div>

                <div>
                  <strong>Picked Up</strong>
                  <span>
                    Order picked up from shop
                  </span>
                </div>
              </div>

              <div
                className={`timeline-item ${
                  delivery.status ===
                  "DELIVERED"
                    ? "completed"
                    : ""
                }`}
              >
                <div className="timeline-dot"></div>

                <div>
                  <strong>Delivered</strong>
                  <span>
                    Order delivered to customer
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {(canAccept ||
          canReject ||
          canPickup ||
          canDeliver) && (
          <section className="delivery-action-card">
            <h2>Delivery Action</h2>

            <p>
              Update the delivery status after completing
              each step.
            </p>

            <div className="delivery-action-buttons">
              {canAccept && (
                <button
                  type="button"
                  className="accept-delivery-button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleAction("accept")
                  }
                >
                  {actionLoading
                    ? "Processing..."
                    : "✓ Accept Delivery"}
                </button>
              )}

              {canReject && (
                <button
                  type="button"
                  className="reject-delivery-button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleAction("reject")
                  }
                >
                  {actionLoading
                    ? "Processing..."
                    : "✕ Reject Delivery"}
                </button>
              )}

              {canPickup && (
                <button
                  type="button"
                  className="pickup-delivery-button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleAction("pickup")
                  }
                >
                  {actionLoading
                    ? "Processing..."
                    : "📦 Mark as Picked Up"}
                </button>
              )}

              {canDeliver && (
                <button
                  type="button"
                  className="deliver-delivery-button"
                  disabled={actionLoading}
                  onClick={() =>
                    handleAction("deliver")
                  }
                >
                  {actionLoading
                    ? "Processing..."
                    : "✓ Mark as Delivered"}
                </button>
              )}
            </div>
          </section>
        )}

        {delivery.status === "DELIVERED" && (
          <div className="delivery-completed-card">
            <div className="completed-icon">
              ✓
            </div>

            <div>
              <h2>Delivery Completed</h2>

              <p>
                This order has been successfully delivered.
              </p>
            </div>
          </div>
        )}

        {delivery.status === "CANCELLED" && (
          <div className="delivery-cancelled-card">
            <div className="cancelled-icon">
              ✕
            </div>

            <div>
              <h2>Delivery Cancelled</h2>

              <p>
                This delivery is no longer assigned to you.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default DeliveryDetails;