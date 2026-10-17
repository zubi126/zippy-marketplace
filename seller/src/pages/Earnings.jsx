import { useEffect, useState } from "react";
import api from "../services/api";
import "./Earnings.css";

function Earnings() {
  const [balance, setBalance] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [filteredEarnings, setFilteredEarnings] = useState(null);

  const [filterType, setFilterType] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const makeEarningsResult = (data, type) => ({
    type,
    totalOrders: data?.summary?.totalOrders || 0,
    totalSales: data?.summary?.grossSales || 0,
    commission: data?.summary?.sellerAccounting?.commission || 0,
    sellerEarnings: data?.summary?.sellerAccounting?.sellerEarnings || 0,
    period: data?.period || null,
  });

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError("");

      const [balanceRes, weeklyRes, monthlyRes, payoutsRes] =
        await Promise.all([
          api.get("/shops/earnings/balance"),
          api.get("/shops/earnings/weekly"),
          api.get("/shops/earnings/monthly"),
          api.get("/shops/earnings/payouts"),
        ]);

      setBalance(balanceRes.data?.balance || null);
      setWeekly(weeklyRes.data || null);
      setMonthly(monthlyRes.data || null);
      setPayouts(payoutsRes.data?.payouts || []);

      setFilteredEarnings(makeEarningsResult(weeklyRes.data, "week"));
      setFilterType("week");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load seller earnings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const applyCustomFilter = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    try {
      setFilterLoading(true);
      setError("");

      const response = await api.get("/shops/earnings", {
        params: { startDate, endDate },
      });

      setFilteredEarnings(makeEarningsResult(response.data, "custom"));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load earnings for the selected dates."
      );
    } finally {
      setFilterLoading(false);
    }
  };

  const selectPeriod = (type) => {
    setError("");
    setFilterType(type);

    if (type === "week" && weekly) {
      setFilteredEarnings(makeEarningsResult(weekly, "week"));
    }

    if (type === "month" && monthly) {
      setFilteredEarnings(makeEarningsResult(monthly, "month"));
    }
  };

  if (loading) {
    return <main className="seller-earnings-page">Loading earnings...</main>;
  }

  return (
    <main className="seller-earnings-page">
      <div className="seller-earnings-container">
        <header className="seller-earnings-header">
          <div>
            <h1>Earnings & Payouts</h1>
            <p>Track your shop sales, earnings and payout history.</p>
          </div>

          <button
            type="button"
            className="seller-earnings-refresh"
            onClick={fetchEarnings}
          >
            Refresh
          </button>
        </header>

        {error && <div className="seller-earnings-error">{error}</div>}

        <section className="seller-earnings-stats">
          <article className="seller-earnings-stat-card">
            <span>Total Sales</span>
            <strong>{formatAmount(balance?.totalSales)}</strong>
            <small>{balance?.totalOrders || 0} delivered orders</small>
          </article>

          <article className="seller-earnings-stat-card">
            <span>Total Commission</span>
            <strong>{formatAmount(balance?.totalCommission)}</strong>
          </article>

          <article className="seller-earnings-stat-card">
            <span>Total Seller Earnings</span>
            <strong>{formatAmount(balance?.totalSellerEarnings)}</strong>
          </article>

          <article className="seller-earnings-stat-card">
            <span>Paid / Processing</span>
            <strong>{formatAmount(balance?.alreadyPaid)}</strong>
          </article>

          <article className="seller-earnings-stat-card">
            <span>Pending Payout</span>
            <strong>{formatAmount(balance?.pendingPayout)}</strong>
          </article>
        </section>

        <section className="seller-earnings-period-grid">
          <article className="seller-earnings-period-card">
            <h2>This Week</h2>
            <strong>
              {formatAmount(weekly?.summary?.sellerAccounting?.sellerEarnings)}
            </strong>
            <p>
              {weekly?.summary?.totalOrders || 0} delivered orders
            </p>
          </article>

          <article className="seller-earnings-period-card">
            <h2>This Month</h2>
            <strong>
              {formatAmount(monthly?.summary?.sellerAccounting?.sellerEarnings)}
            </strong>
            <p>
              {monthly?.summary?.totalOrders || 0} delivered orders
            </p>
          </article>
        </section>

        <section className="seller-earnings-filter">
          <h2>Earnings Filter</h2>
          <p>Choose a period to review your seller earnings.</p>

          <div className="seller-earnings-filter-buttons">
            <button
              type="button"
              className={filterType === "week" ? "active" : ""}
              onClick={() => selectPeriod("week")}
            >
              This Week
            </button>

            <button
              type="button"
              className={filterType === "month" ? "active" : ""}
              onClick={() => selectPeriod("month")}
            >
              This Month
            </button>

            <button
              type="button"
              className={filterType === "custom" ? "active" : ""}
              onClick={() => {
                setError("");
                setFilterType("custom");
              }}
            >
              Custom Dates
            </button>
          </div>

          {filterType === "custom" && (
            <div className="seller-earnings-date-form">
              <label>
                From
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>

              <label>
                To
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={applyCustomFilter}
                disabled={filterLoading}
              >
                {filterLoading ? "Loading..." : "Apply Filter"}
              </button>
            </div>
          )}
        </section>

        {filteredEarnings && (
          <section className="seller-earnings-results">
            <h2>
              {filteredEarnings.type === "week"
                ? "This Week's Earnings"
                : filteredEarnings.type === "month"
                ? "This Month's Earnings"
                : "Custom Date Earnings"}
            </h2>

            {filteredEarnings.period && (
              <p className="seller-earnings-period-label">
                {formatDate(
                  filteredEarnings.period.startDate ||
                    filteredEarnings.period.start
                )}{" "}
                —{" "}
                {formatDate(
                  filteredEarnings.period.endDate ||
                    filteredEarnings.period.end
                )}
              </p>
            )}

            <div className="seller-earnings-result-grid">
              <div>
                <span>Sales</span>
                <strong>{formatAmount(filteredEarnings.totalSales)}</strong>
              </div>

              <div>
                <span>Commission</span>
                <strong>{formatAmount(filteredEarnings.commission)}</strong>
              </div>

              <div>
                <span>Seller Earnings</span>
                <strong>{formatAmount(filteredEarnings.sellerEarnings)}</strong>
              </div>

              <div>
                <span>Delivered Orders</span>
                <strong>{filteredEarnings.totalOrders}</strong>
              </div>
            </div>
          </section>
        )}

        <section className="seller-payouts-section" id="payout-history">
          <div className="seller-payouts-header">
            <div>
              <h2>Payout History</h2>
              <p>Review payouts recorded for your shop.</p>
            </div>
          </div>

          {payouts.length === 0 ? (
            <div className="seller-payouts-empty">
              <h3>No payouts yet</h3>
              <p>Your payout history will appear here when available.</p>
            </div>
          ) : (
            <div className="seller-payouts-list">
              {payouts.map((payout) => (
                <article className="seller-payout-item" key={payout.id}>
                  <div className="seller-payout-main">
                    <strong>
                      {formatAmount(payout.amount)}{" "}
                      {payout.currency && payout.currency !== "INR"
                        ? payout.currency
                        : ""}
                    </strong>
                    <span>
                      {formatDate(payout.paidAt || payout.createdAt)}
                    </span>

                    {payout.periodStart && payout.periodEnd && (
                      <small>
                        Period: {formatDate(payout.periodStart)} —{" "}
                        {formatDate(payout.periodEnd)}
                      </small>
                    )}

                    {payout.failureReason && (
                      <small className="seller-payout-failure">
                        Reason: {payout.failureReason}
                      </small>
                    )}
                  </div>

                  <span
                    className={`seller-payout-status ${String(
                      payout.status || "PENDING"
                    ).toLowerCase()}`}
                  >
                    {String(payout.status || "PENDING")
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Earnings;