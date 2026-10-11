
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

const initialStats = {
  sales: null,
  commission: null,
  sellerPayouts: null,
  riderPayouts: null,
  refunds: null,
  netEarnings: null,
  weekly: null,
  monthly: null,
};

function getAmount(data) {
  if (data == null) return null;

  if (typeof data === "number" || typeof data === "string") {
    const value = Number(data);
    return Number.isFinite(value) ? value : null;
  }

  if (typeof data === "object") {
    const candidates = [
      data.totalSales,
      data.totalPlatformSales,
      data.totalCommission,
      data.totalSellerPayouts,
      data.totalRiderPayouts,
      data.totalRefunded,
      data.netPlatformEarnings,
      data.netEarnings,
      data.amount,
      data.total,
    ];

    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null) {
        const value = Number(candidate);
        if (Number.isFinite(value)) return value;
      }
    }

    if (data.data && data.data !== data) {
      return getAmount(data.data);
    }
  }

  return null;
}

function formatCurrency(value) {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCount(value) {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-IN").format(value);
}

function Dashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    const requests = [
      {
        key: "sales",
        url: "/admin/earnings/sales",
      },
      {
        key: "commission",
        url: "/admin/earnings/commission",
      },
      {
        key: "sellerPayouts",
        url: "/admin/earnings/seller-payouts",
      },
      {
        key: "riderPayouts",
        url: "/admin/earnings/rider-payouts",
      },
      {
        key: "refunds",
        url: "/admin/earnings/refunds",
      },
      {
        key: "netEarnings",
        url: "/admin/earnings/net",
      },
      {
        key: "weekly",
        url: "/admin/earnings/weekly",
      },
      {
        key: "monthly",
        url: "/admin/earnings/monthly",
      },
    ];

    const results = await Promise.allSettled(
      requests.map((request) => api.get(request.url))
    );

    const nextStats = { ...initialStats };
    const failedRequests = [];

    results.forEach((result, index) => {
      const key = requests[index].key;

      if (result.status === "fulfilled") {
        nextStats[key] = result.value.data;
      } else {
        failedRequests.push(key);
        console.error(
          `Dashboard request failed: ${requests[index].url}`,
          result.reason
        );
      }
    });

    setStats(nextStats);

    if (failedRequests.length === requests.length) {
      setError(
        "Dashboard data could not be loaded. Please check your connection and try again."
      );
    } else if (failedRequests.length > 0) {
      setError(
        "Some dashboard figures could not be loaded. Please refresh to retry."
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Platform Sales",
      value: getAmount(stats.sales),
      icon: "₹",
      description: "Sales from delivered orders",
    },
    {
      title: "Total Commission",
      value: getAmount(stats.commission),
      icon: "%",
      description: "Platform commission",
    },
    {
      title: "Seller Payouts",
      value: getAmount(stats.sellerPayouts),
      icon: "S",
      description: "Seller payouts recorded",
    },
    {
      title: "Rider Payouts",
      value: getAmount(stats.riderPayouts),
      icon: "R",
      description: "Rider payouts recorded",
    },
    {
      title: "Total Refunded",
      value: getAmount(stats.refunds),
      icon: "↩",
      description: "Refunds recorded",
    },
    {
      title: "Net Platform Earnings",
      value: getAmount(stats.netEarnings),
      icon: "₹",
      description: "Commission minus refunds",
    },
  ];

  const weekly = stats.weekly?.data ?? stats.weekly;
  const monthly = stats.monthly?.data ?? stats.monthly;

  return (
    <main className="admin-dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>
            Welcome back, <strong>{user?.name || "Admin"}</strong>.
            Here is your marketplace overview.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh-btn"
          onClick={fetchDashboard}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div className="dashboard-error" role="alert">
          {error}
        </div>
      )}

      <section className="dashboard-stats-grid">
        {cards.map((card) => (
          <article className="dashboard-stat-card" key={card.title}>
            <div className="dashboard-stat-top">
              <span className="dashboard-stat-title">
                {card.title}
              </span>

              <span className="dashboard-stat-icon">
                {card.icon}
              </span>
            </div>

            <div className="dashboard-stat-value">
              {loading && card.value === null
                ? "Loading..."
                : formatCurrency(card.value)}
            </div>

            <p className="dashboard-stat-description">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="dashboard-period-section">
        <h2>Performance Overview</h2>

        <div className="dashboard-period-grid">
          <article className="dashboard-period-card">
            <h3>This Week</h3>

            <div className="dashboard-period-row">
              <span>Sales</span>
              <strong>
                {loading
                  ? "Loading..."
                  : formatCurrency(getAmount(weekly))}
              </strong>
            </div>

            <div className="dashboard-period-row">
              <span>Orders</span>
              <strong>
                {formatCount(
                  weekly?.totalOrders ??
                  weekly?.ordersCount ??
                  weekly?.orderCount
                )}
              </strong>
            </div>

            <div className="dashboard-period-row">
              <span>Commission</span>
              <strong>
                {formatCurrency(
                  weekly?.totalCommission ??
                  weekly?.commission
                )}
              </strong>
            </div>
          </article>

          <article className="dashboard-period-card">
            <h3>This Month</h3>

            <div className="dashboard-period-row">
              <span>Sales</span>
              <strong>
                {loading
                  ? "Loading..."
                  : formatCurrency(getAmount(monthly))}
              </strong>
            </div>

            <div className="dashboard-period-row">
              <span>Orders</span>
              <strong>
                {formatCount(
                  monthly?.totalOrders ??
                  monthly?.ordersCount ??
                  monthly?.orderCount
                )}
              </strong>
            </div>

            <div className="dashboard-period-row">
              <span>Commission</span>
              <strong>
                {formatCurrency(
                  monthly?.totalCommission ??
                  monthly?.commission
                )}
              </strong>
            </div>
          </article>
        </div>
      </section>

      <div className="dashboard-footer">
        <span>MyKasho Admin Dashboard</span>

        <button
          type="button"
          className="dashboard-logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
