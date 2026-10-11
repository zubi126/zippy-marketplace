import { useEffect, useState } from "react";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("ALL");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchOrders = async (page = 1, selectedStatus = status) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders", {
        params: {
          status: selectedStatus,
          page,
          limit: 10,
        },
      });

      const data = response.data;

      setOrders(data.orders || []);

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, status);
  }, [status]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePrevious = () => {
    if (pagination.hasPreviousPage) {
      fetchOrders(pagination.page - 1, status);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      fetchOrders(pagination.page + 1, status);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "₹0";

    return `₹${Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusClass = (orderStatus) => {
    switch (orderStatus) {
      case "PENDING":
        return "order-status pending";

      case "CONFIRMED":
        return "order-status confirmed";

      case "PREPARING":
        return "order-status preparing";

      case "READY_FOR_PICKUP":
        return "order-status ready";

      case "OUT_FOR_DELIVERY":
        return "order-status out-for-delivery";

      case "DELIVERED":
        return "order-status delivered";

      case "CANCELLED":
        return "order-status cancelled";

      default:
        return "order-status";
    }
  };

  const formatStatus = (orderStatus) => {
    if (!orderStatus) return "Unknown";

    return orderStatus
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getPaymentClass = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return "payment-status paid";

      case "PENDING":
        return "payment-status pending";

      case "FAILED":
        return "payment-status failed";

      case "REFUNDED":
        return "payment-status refunded";

      case "PARTIALLY_REFUNDED":
        return "payment-status partial";

      default:
        return "payment-status";
    }
  };

  const formatPaymentStatus = (paymentStatus) => {
    if (!paymentStatus) return "Unknown";

    return paymentStatus
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="admin-orders-page">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and monitor all customer orders.</p>
        </div>

        <div className="orders-header-count">
          <span>{pagination.total}</span>
          <small>Total Orders</small>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="orders-filter">
          <label htmlFor="order-status">Status</label>

          <select
            id="order-status"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <button
          type="button"
          className="orders-refresh-button"
          onClick={() => fetchOrders(pagination.page, status)}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="orders-state-card">
          <div className="orders-spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="orders-state-card orders-error-card">
          <div className="orders-state-icon">!</div>
          <h3>Unable to load orders</h3>
          <p>{error}</p>

          <button
            type="button"
            className="orders-retry-button"
            onClick={() => fetchOrders(pagination.page, status)}
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-state-card">
          <div className="orders-state-icon">📦</div>
          <h3>No orders found</h3>
          <p>There are no orders for the selected status.</p>
        </div>
      ) : (
        <>
          <div className="orders-table-card">
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Shop</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Rider</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const delivery = order.deliveries?.[0];
                    const rider = delivery?.rider;

                    return (
                      <tr key={order.id}>
                        <td>
                          <div className="order-number">
                            #{order.orderNumber}
                          </div>

                          <div className="order-method">
                            {order.paymentMethod === "COD"
                              ? "Cash on Delivery"
                              : "Online Payment"}
                          </div>
                        </td>

                        <td>
                          <div className="customer-info">
                            <strong>
                              {order.customer?.name || "Unknown Customer"}
                            </strong>

                            <span>
                              {order.customer?.phone || "No phone"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="shop-info">
                            <strong>
                              {order.shop?.name || "Unknown Shop"}
                            </strong>

                            {order.shop?.phone && (
                              <span>{order.shop.phone}</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="items-info">
                            <strong>
                              {order.items?.length || 0} item
                              {order.items?.length === 1 ? "" : "s"}
                            </strong>

                            {order.items?.length > 0 && (
                              <span>
                                Qty:{" "}
                                {order.items.reduce(
                                  (total, item) =>
                                    total + Number(item.quantity || 0),
                                  0
                                )}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="amount-info">
                            <strong>{formatAmount(order.total)}</strong>

                            <span>
                              Subtotal {formatAmount(order.subtotal)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="payment-info">
                            <strong>
                              {order.paymentMethod === "COD"
                                ? "COD"
                                : "Online"}
                            </strong>

                            <span className={getPaymentClass(order.paymentStatus)}>
                              {formatPaymentStatus(order.paymentStatus)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className={getStatusClass(order.status)}>
                            {formatStatus(order.status)}
                          </span>
                        </td>

                        <td>
                          {rider ? (
                            <div className="rider-info">
                              <strong>
                                {rider.user?.name || "Rider"}
                              </strong>

                              <span>
                                {rider.user?.phone || "No phone"}
                              </span>
                            </div>
                          ) : (
                            <span className="no-rider">Not Assigned</span>
                          )}
                        </td>

                        <td>
                          <div className="date-info">
                            <strong>
                              {formatDate(order.createdAt)}
                            </strong>

                            <span>
                              {formatTime(order.createdAt)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="orders-pagination">
            <div className="pagination-info">
              Showing page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong>
              <span>
                ({pagination.total} order
                {pagination.total === 1 ? "" : "s"})
              </span>
            </div>

            <div className="pagination-buttons">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!pagination.hasPreviousPage || loading}
              >
                ← Previous
              </button>

              <div className="pagination-current">
                {pagination.page}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!pagination.hasNextPage || loading}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;