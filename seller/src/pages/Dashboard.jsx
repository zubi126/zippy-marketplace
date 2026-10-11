import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);

  const [shop, setShop] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

     const [
  productsResponse,
  earningsResponse,
  ordersResponse,
  shopResponse,
] = await Promise.all([
  api.get("/products/my"),
  api.get("/shops/earnings/summary"),
  api.get("/shops/earnings/orders?limit=5"),
  api.get("/shops/me"),
]);

      setProducts(productsResponse.data.products || []);

      setEarnings(
        earningsResponse.data.earnings ||
          earningsResponse.data.summary ||
          earningsResponse.data
      );

      setOrders(ordersResponse.data.orders || []);

     setShop(shopResponse.data.shop || shopResponse.data);

    } catch (error) {
      console.error(
        "Failed to fetch dashboard data:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;

  const totalOrders =
    earnings?.totalOrders || 0;

  const totalEarnings =
    earnings?.totalSellerEarnings || 0;

  const pendingOrders = orders.filter((order) =>
    [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
     "READY_FOR_PICKUP",
    ].includes(order.status)
  ).length;

  return (
    <main className="seller-content dashboard-page">
      {/* Welcome */}
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">
            SELLER DASHBOARD
          </p>

          <h1>
            Welcome back, {user?.name || "Seller"} 👋
          </h1>

          <p>
            Here’s what’s happening with your shop today.
          </p>
        </div>

       <div className="shop-status">
  <span className="status-dot"></span>
  {shop?.isOpen ? "Shop Active" : "Shop Closed"}
</div>
      </section>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              TOTAL PRODUCTS
            </span>

            <span className="stat-icon">▤</span>
          </div>

          <h2>
            {loading ? "—" : totalProducts}
          </h2>

          <p>
            Products listed in your shop
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              TOTAL ORDERS
            </span>

            <span className="stat-icon">▱</span>
          </div>

          <h2>
            {loading ? "—" : totalOrders}
          </h2>

          <p>
            Orders received so far
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              PENDING ORDERS
            </span>

            <span className="stat-icon">◷</span>
          </div>

          <h2>
            {loading ? "—" : pendingOrders}
          </h2>

          <p>
            Orders waiting for action
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              TOTAL EARNINGS
            </span>

            <span className="stat-icon">₹</span>
          </div>

          <h2>
            {loading
              ? "—"
              : `₹${Number(totalEarnings).toLocaleString("en-IN")}`}
          </h2>

          <p>
            Total earnings from orders
          </p>
        </div>

      </section>

      {/* Lower section */}
      <section className="dashboard-grid">

        {/* Recent Orders */}
        <div className="dashboard-card recent-orders">
          <div className="dashboard-card-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Your latest shop orders</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/orders")}
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading orders...</h3>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                ▱
              </div>

              <h3>No orders yet</h3>

              <p>
                Your recent orders will appear here.
              </p>
            </div>
          ) : (
            <div className="dashboard-orders-list">
              {orders.map((order) => (
              <div
  className="dashboard-order-item"
  key={order.id}
>
  <div className="dashboard-order-info">
    <span className="dashboard-order-number">
      Order #{order.orderNumber || order.id.slice(-6)}
    </span>

    <span className="dashboard-order-status">
      {order.orderStatus || "Pending"}
    </span>
  </div>

  <span className="dashboard-order-earning">
    ₹
    {Number(
      order.sellerAccounting?.sellerEarning || 0
    ).toLocaleString("en-IN")}
  </span>
</div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="dashboard-card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your shop</p>
            </div>
          </div>

          <div className="quick-action-list">

            <button
              type="button"
              onClick={() =>
                navigate("/products/add")
              }
            >
              <span className="quick-action-icon">
                ＋
              </span>

              <span>
                <strong>Add Product</strong>
                <small>
                  Add a new product to your shop
                </small>
              </span>

              <span className="quick-action-arrow">
                →
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/shop")
              }
            >
              <span className="quick-action-icon">
                ▣
              </span>

              <span>
                <strong>Shop Profile</strong>
                <small>
                  Update your shop information
                </small>
              </span>

              <span className="quick-action-arrow">
                →
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/orders")
              }
            >
              <span className="quick-action-icon">
                ▱
              </span>

              <span>
                <strong>View Orders</strong>
                <small>
                  Manage your customer orders
                </small>
              </span>

              <span className="quick-action-arrow">
                →
              </span>
            </button>

          </div>
        </div>

      </section>
    </main>
  );
}

export default Dashboard;