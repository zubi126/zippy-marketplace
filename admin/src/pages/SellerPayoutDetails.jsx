import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./SellerPayoutDetails.css";

function SellerPayoutDetails() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/payouts/sellers/${shopId}`
      );

      if (response.data?.success) {
        setData(response.data);
      } else {
        setError("Failed to load seller payout details");
      }
    } catch (err) {
      console.error(
        "Fetch seller payout details error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load seller payout details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [shopId]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMonth = (year, month) => {
    return new Date(
      year,
      month - 1,
      1
    ).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="seller-payout-details-page">
        <div className="seller-payout-details-loading">
          Loading seller payout details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-payout-details-page">
        <button
          className="seller-payout-details-back-btn"
          onClick={() => navigate("/seller-payouts")}
        >
          ← Back
        </button>

        <div className="seller-payout-details-error">
          <p>{error}</p>

          <button onClick={fetchDetails}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const shop = data?.shop;
  const summary = data?.summary;

  return (
    <div className="seller-payout-details-page">

      {/* HEADER */}

      <div className="seller-payout-details-header">
        <div>
          <button
            className="seller-payout-details-back-btn"
            onClick={() => navigate("/seller-payouts")}
          >
            ← Back to Seller Payouts
          </button>

          <h1>{shop?.name || "Seller Details"}</h1>

          <p>
            {shop?.slug || ""}
            {shop?.phone
              ? ` • ${shop.phone}`
              : ""}
          </p>
        </div>

        <button
          className="seller-payout-details-refresh-btn"
          onClick={fetchDetails}
        >
          Refresh
        </button>
      </div>

      {/* SHOP INFORMATION */}

      <div className="seller-detail-card seller-shop-info-card">
        <div className="seller-detail-card-header">
          <h2>Shop Information</h2>

          <span
            className={`seller-detail-status ${
              shop?.verificationStatus?.toLowerCase()
            }`}
          >
            {shop?.verificationStatus}
          </span>
        </div>

        <div className="seller-shop-info-grid">
          <div>
            <span className="seller-info-label">
              Shop Name
            </span>
            <strong>{shop?.name || "N/A"}</strong>
          </div>

          <div>
            <span className="seller-info-label">
              Phone
            </span>
            <strong>{shop?.phone || "N/A"}</strong>
          </div>

          <div>
            <span className="seller-info-label">
              Slug
            </span>
            <strong>{shop?.slug || "N/A"}</strong>
          </div>

          <div>
            <span className="seller-info-label">
              Address
            </span>
            <strong>{shop?.address || "N/A"}</strong>
          </div>

          <div>
            <span className="seller-info-label">
              Shop Status
            </span>
            <strong>
              {shop?.isActive ? "Active" : "Inactive"}
            </strong>
          </div>

          <div>
            <span className="seller-info-label">
              Open Status
            </span>
            <strong>
              {shop?.isOpen ? "Open" : "Closed"}
            </strong>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="seller-detail-section">
        <div className="seller-detail-section-title">
          <h2>Overall Earnings</h2>
        </div>

        <div className="seller-summary-grid">

          <div className="seller-summary-card">
            <div className="seller-summary-title">
              Total Sales
            </div>

            <div className="seller-summary-value">
              ₹
              {Number(
                summary?.totalSales || 0
              ).toFixed(2)}
            </div>

            <div className="seller-summary-description">
              Delivered order sales
            </div>
          </div>

          <div className="seller-summary-card">
            <div className="seller-summary-title">
              Delivered Orders
            </div>

            <div className="seller-summary-value">
              {summary?.totalDeliveredOrders || 0}
            </div>

            <div className="seller-summary-description">
              Successfully delivered
            </div>
          </div>

          <div className="seller-summary-card">
            <div className="seller-summary-title">
              Commission
            </div>

            <div className="seller-summary-value">
              ₹
              {Number(
                summary?.totalCommission || 0
              ).toFixed(2)}
            </div>

            <div className="seller-summary-description">
              Platform commission
            </div>
          </div>

          <div className="seller-summary-card">
            <div className="seller-summary-title">
              Seller Earnings
            </div>

            <div className="seller-summary-value">
              ₹
              {Number(
                summary?.totalSellerEarnings || 0
              ).toFixed(2)}
            </div>

            <div className="seller-summary-description">
              Total payable to seller
            </div>
          </div>

          <div className="seller-summary-card">
            <div className="seller-summary-title">
              Paid Out
            </div>

            <div className="seller-summary-value">
              ₹
              {Number(
                summary?.totalPaidOut || 0
              ).toFixed(2)}
            </div>

            <div className="seller-summary-description">
              Already paid to seller
            </div>
          </div>

          <div className="seller-summary-card seller-summary-card-pending">
            <div className="seller-summary-title">
              Pending Payout
            </div>

            <div className="seller-summary-value">
              ₹
              {Number(
                summary?.pendingPayout || 0
              ).toFixed(2)}
            </div>

            <div className="seller-summary-description">
              Currently payable
            </div>
          </div>

        </div>
      </div>

      {/* WEEKLY */}

      <div className="seller-detail-card">
        <div className="seller-detail-card-header">
          <div>
            <h2>Weekly Earnings</h2>
            <p>
              Sales and earnings grouped by week
            </p>
          </div>
        </div>

        <div className="seller-detail-table-container">
          <table className="seller-detail-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Sales</th>
                <th>Orders</th>
                <th>Commission</th>
                <th>Seller Earnings</th>
              </tr>
            </thead>

            <tbody>
              {!data?.weekly?.length ? (
                <tr>
                  <td
                    colSpan="5"
                    className="seller-detail-empty"
                  >
                    No weekly earnings found.
                  </td>
                </tr>
              ) : (
                data.weekly.map((week) => (
                  <tr
                    key={`${week.periodStart}-${week.periodEnd}`}
                  >
                    <td>
                      <div className="seller-period-main">
                        {formatDate(
                          week.periodStart
                        )}
                      </div>

                      <div className="seller-period-sub">
                        to{" "}
                        {formatDate(
                          week.periodEnd
                        )}
                      </div>
                    </td>

                    <td>
                      ₹
                      {Number(
                        week.totalSales || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {week.totalDeliveredOrders || 0}
                    </td>

                    <td>
                      ₹
                      {Number(
                        week.totalCommission || 0
                      ).toFixed(2)}
                    </td>

                    <td className="seller-earnings-amount">
                      ₹
                      {Number(
                        week.totalSellerEarnings || 0
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MONTHLY */}

      <div className="seller-detail-card">
        <div className="seller-detail-card-header">
          <div>
            <h2>Monthly Earnings</h2>
            <p>
              Sales and earnings grouped by month
            </p>
          </div>
        </div>

        <div className="seller-detail-table-container">
          <table className="seller-detail-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales</th>
                <th>Orders</th>
                <th>Commission</th>
                <th>Seller Earnings</th>
              </tr>
            </thead>

            <tbody>
              {!data?.monthly?.length ? (
                <tr>
                  <td
                    colSpan="5"
                    className="seller-detail-empty"
                  >
                    No monthly earnings found.
                  </td>
                </tr>
              ) : (
                data.monthly.map((month) => (
                  <tr
                    key={month.period}
                  >
                    <td>
                      {formatMonth(
                        month.year,
                        month.month
                      )}
                    </td>

                    <td>
                      ₹
                      {Number(
                        month.totalSales || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {month.totalDeliveredOrders || 0}
                    </td>

                    <td>
                      ₹
                      {Number(
                        month.totalCommission || 0
                      ).toFixed(2)}
                    </td>

                    <td className="seller-earnings-amount">
                      ₹
                      {Number(
                        month.totalSellerEarnings || 0
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYOUT HISTORY */}

      <div className="seller-detail-card">
        <div className="seller-detail-card-header">
          <div>
            <h2>Payout History</h2>
            <p>
              Payments made to this seller
            </p>
          </div>
        </div>

        <div className="seller-detail-table-container">
          <table className="seller-detail-table">
            <thead>
              <tr>
                <th>Payout Date</th>
                <th>Amount</th>
                <th>Period</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Reference</th>
              </tr>
            </thead>

            <tbody>
              {!data?.payouts?.length ? (
                <tr>
                  <td
                    colSpan="6"
                    className="seller-detail-empty"
                  >
                    No payouts have been made yet.
                  </td>
                </tr>
              ) : (
                data.payouts.map((payout) => (
                  <tr key={payout.id}>

                    <td>
                      {formatDate(
                        payout.paidAt ||
                          payout.createdAt
                      )}
                    </td>

                    <td className="seller-payout-amount">
                      ₹
                      {Number(
                        payout.amount || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      <div className="seller-period-main">
                        {formatDate(
                          payout.periodStart
                        )}
                      </div>

                      <div className="seller-period-sub">
                        to{" "}
                        {formatDate(
                          payout.periodEnd
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`seller-payout-status ${
                          payout.status?.toLowerCase()
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>

                    <td>
                      {payout.provider || "N/A"}
                    </td>

                    <td>
                      {payout.referenceId || "—"}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default SellerPayoutDetails;