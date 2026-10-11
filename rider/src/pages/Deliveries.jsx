import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Deliveries.css";

function Deliveries() {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/riders/deliveries");

      setDeliveries(
        response.data?.deliveries || []
      );
    } catch (error) {
      console.error(
        "Failed to load deliveries:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const filteredDeliveries = deliveries.filter(
    (delivery) => {
      if (filter === "ALL") {
        return true;
      }

      if (filter === "ACTIVE") {
        return [
          "ASSIGNED",
          "ACCEPTED",
          "PICKED_UP",
          "OUT_FOR_DELIVERY",
        ].includes(delivery.status);
      }

      if (filter === "COMPLETED") {
        return delivery.status === "DELIVERED";
      }

      if (filter === "CANCELLED") {
        return delivery.status === "CANCELLED";
      }

      return true;
    }
  );

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
      <main className="rider-deliveries-page">
        <div className="rider-deliveries-loading">
          Loading deliveries...
        </div>
      </main>
    );
  }

  return (
    <main className="rider-deliveries-page">
      <div className="rider-deliveries-container">
        <div className="rider-deliveries-header">
          <div>
            <h1>Deliveries</h1>

            <p>
              View and manage your delivery assignments.
            </p>
          </div>

          <button
            type="button"
            className="rider-refresh-button"
            onClick={fetchDeliveries}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="rider-deliveries-error">
            {error}
          </div>
        )}

        <div className="rider-delivery-filters">
          <button
            type="button"
            className={
              filter === "ALL"
                ? "active"
                : ""
            }
            onClick={() => setFilter("ALL")}
          >
            All
            <span>{deliveries.length}</span>
          </button>

          <button
            type="button"
            className={
              filter === "ACTIVE"
                ? "active"
                : ""
            }
            onClick={() => setFilter("ACTIVE")}
          >
            Active
            <span>
              {
                deliveries.filter((delivery) =>
                  [
                    "ASSIGNED",
                    "ACCEPTED",
                    "PICKED_UP",
                    "OUT_FOR_DELIVERY",
                  ].includes(delivery.status)
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            className={
              filter === "COMPLETED"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("COMPLETED")
            }
          >
            Completed
            <span>
              {
                deliveries.filter(
                  (delivery) =>
                    delivery.status ===
                    "DELIVERED"
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            className={
              filter === "CANCELLED"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("CANCELLED")
            }
          >
            Cancelled
            <span>
              {
                deliveries.filter(
                  (delivery) =>
                    delivery.status ===
                    "CANCELLED"
                ).length
              }
            </span>
          </button>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="rider-deliveries-empty">
            <div className="rider-deliveries-empty-icon">
              🚴
            </div>

            <h2>No deliveries found</h2>

            <p>
              There are no deliveries in this category.
            </p>
          </div>
        ) : (
          <div className="rider-deliveries-list">
            {filteredDeliveries.map(
              (delivery) => {
                const order =
                  delivery.order || {};

                return (
                  <div
                    key={delivery.id}
                    className="rider-delivery-item"
                    onClick={() =>
                      navigate(
                        `/deliveries/${delivery.id}`
                      )
                    }
                  >
                    <div className="rider-delivery-item-main">
                      <div className="rider-delivery-item-top">
                        <span className="rider-order-number">
                          {order.orderNumber ||
                            "Order"}
                        </span>

                        <span
                          className={`rider-delivery-status ${getStatusClass(
                            delivery.status
                          )}`}
                        >
                          {getStatusLabel(
                            delivery.status
                          )}
                        </span>
                      </div>

                      <h2>
                        {order.deliveryName ||
                          "Customer"}
                      </h2>

                      <p className="rider-customer-phone">
                        {order.deliveryPhone ||
                          "Phone not available"}
                      </p>

                      <p className="rider-delivery-address">
                        {order.deliveryFullAddress ||
                          "Delivery address not available"}
                      </p>

                      {order.deliveryCity && (
                        <p className="rider-delivery-location">
                          {order.deliveryCity}
                          {order.deliveryState
                            ? `, ${order.deliveryState}`
                            : ""}
                          {order.deliveryPincode
                            ? ` - ${order.deliveryPincode}`
                            : ""}
                        </p>
                      )}
                    </div>

                    <div className="rider-delivery-item-side">
                      <div>
                        <span>
                          Order Total
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.total || 0
                          ).toFixed(2)}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Your Earning
                        </span>

                        <strong className="rider-earning">
                          ₹
                          {Number(
                            delivery.riderEarning ||
                              order.deliveryFee ||
                              0
                          ).toFixed(2)}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          navigate(
                            `/deliveries/${delivery.id}`
                          );
                        }}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Deliveries;