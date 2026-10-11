import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {


 const navigate = useNavigate();


  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/shop/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch shop orders:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // Order statistics
  const orderStats = useMemo(() => {
    return {
      newOrders: orders.filter(
        (order) => order.status === "PENDING"
      ).length,

      preparing: orders.filter(
        (order) => order.status === "PREPARING"
      ).length,

      ready: orders.filter(
        (order) => order.status === "READY_FOR_PICKUP"
      ).length,

      completed: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,
    };
  }, [orders]);

  // Filter + search + sort
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter((order) => {
        return (
          order.orderNumber?.toLowerCase().includes(query) ||
          order.customer?.name?.toLowerCase().includes(query) ||
          order.customer?.phone?.includes(query)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      const statusMap = {
        new: "PENDING",
        accepted: "CONFIRMED",
        preparing: "PREPARING",
        ready: "READY_FOR_PICKUP",
        delivered: "DELIVERED",
        cancelled: "CANCELLED",
      };

      result = result.filter(
        (order) => order.status === statusMap[statusFilter]
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === "latest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortOrder]);

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

  return (
    <main className="seller-content orders-page">
      {/* Page Header */}
      <div className="orders-page-header">
        <div>
          <p className="orders-page-eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p>
            Manage and track orders received by your shop.
          </p>
        </div>
      </div>

      {/* Order Stats */}
      <section className="orders-stats">
        <div className="order-stat-card">
          <span>NEW ORDERS</span>

          <strong>{orderStats.newOrders}</strong>

          <p>Waiting for acceptance</p>
        </div>

        <div className="order-stat-card">
          <span>PREPARING</span>

          <strong>{orderStats.preparing}</strong>

          <p>Orders being prepared</p>
        </div>

        <div className="order-stat-card">
          <span>READY</span>

          <strong>{orderStats.ready}</strong>

          <p>Ready for pickup</p>
        </div>

        <div className="order-stat-card">
          <span>COMPLETED</span>

          <strong>{orderStats.completed}</strong>

          <p>Successfully delivered</p>
        </div>
      </section>

      {/* Orders Card */}
      <section className="orders-card">
        {/* Toolbar */}
        <div className="orders-toolbar">
          <div className="orders-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search order..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">All Orders</option>
            <option value="new">New</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="orders-loading">
            Loading orders...
          </div>
        ) : (
          /* Orders Table */
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="orders-empty-state">
                        <div className="orders-empty-icon">
                          ▱
                        </div>

                        <h3>
                          {orders.length === 0
                            ? "No orders yet"
                            : "No matching orders"}
                        </h3>

                        <p>
                          {orders.length === 0
                            ? "Orders from your customers will appear here."
                            : "Try changing your search or filters."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>
                          {order.orderNumber || order.id}
                        </strong>
                      </td>

                      <td>
                        <div>
                          <strong>
                            {order.customer?.name || "-"}
                          </strong>

                          <small>
                            {order.customer?.phone || ""}
                          </small>
                        </div>
                      </td>

                      <td>
                        {order.items?.length || 0}
                      </td>

                      <td>
                        ₹{Number(order.total || 0).toFixed(2)}
                      </td>

                      <td>
                        <span
                          className={`order-status status-${order.status?.toLowerCase()}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      <td>
                        {formatDate(order.createdAt)}
                      </td>

                      <td>
                      <button
                     type="button"
                     className="order-action-button"
                     onClick={() => navigate(`/orders/${order.id}`)}
             >
                       View
                      </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;