import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./RiderPayoutDetails.css";

function RiderPayoutDetails() {
  const { riderId } = useParams();
  const navigate = useNavigate();

  const [rider, setRider] = useState(null);
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRiderPayoutDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/payouts/riders/${riderId}`
      );

      if (response.data?.success) {
        setRider(response.data.rider);
        setSummary(response.data.summary);
        setWeekly(response.data.weekly || []);
        setMonthly(response.data.monthly || []);
        setPayouts(response.data.payouts || []);
      } else {
        setError("Failed to load rider payout details");
      }
    } catch (err) {
      console.error(
        "Fetch rider payout details error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load rider payout details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderPayoutDetails();
  }, [riderId]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="rider-payout-details-loading">
          Loading rider payout details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="rider-payout-details-error">
          <p>{error}</p>

          <button onClick={fetchRiderPayoutDetails}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page rider-payout-details-page">
      <div className="admin-page-header">
        <div>
          <h1>Rider Payout Details</h1>
          <p>View rider earnings and payout history</p>
        </div>

        <div className="rider-payout-details-actions">
          <button
            className="rider-payout-details-back-btn"
            onClick={() => navigate("/rider-payouts")}
          >
            ← Back
          </button>

          <button
            className="rider-payout-details-refresh-btn"
            onClick={fetchRiderPayoutDetails}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Rider Information */}

      <div className="rider-payout-details-card">
        <div className="rider-payout-details-card-header">
          <h2>Rider Information</h2>
        </div>

        <div className="rider-info-grid">
          <div>
            <span className="rider-info-label">
              Name
            </span>

            <strong>
              {rider?.name || "N/A"}
            </strong>
          </div>

          <div>
            <span className="rider-info-label">
              Phone
            </span>

            <strong>
              {rider?.phone || "N/A"}
            </strong>
          </div>

          <div>
            <span className="rider-info-label">
              Email
            </span>

            <strong>
              {rider?.email || "N/A"}
            </strong>
          </div>

          <div>
            <span className="rider-info-label">
              Vehicle Type
            </span>

            <strong>
              {rider?.vehicleType || "N/A"}
            </strong>
          </div>

          <div>
            <span className="rider-info-label">
              Rider Status
            </span>

            <span
              className={`rider-detail-status ${
                rider?.status?.toLowerCase() || ""
              }`}
            >
              {rider?.status || "N/A"}
            </span>
          </div>

          <div>
            <span className="rider-info-label">
              Verification
            </span>

            <span
              className={`rider-detail-verification ${
                rider?.verificationStatus?.toLowerCase() ||
                ""
              }`}
            >
              {rider?.verificationStatus || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Earnings */}

      <div className="rider-payout-details-card">
        <div className="rider-payout-details-card-header">
          <h2>Overall Earnings</h2>
        </div>

        <div className="rider-summary-grid">
          <div className="rider-summary-item">
            <span>Total Earned</span>

            <strong>
              ₹
              {Number(
                summary?.totalEarned || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div className="rider-summary-item">
            <span>Total Paid Out</span>

            <strong>
              ₹
              {Number(
                summary?.totalPaidOut || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div className="rider-summary-item">
            <span>Pending Balance</span>

            <strong>
              ₹
              {Number(
                summary?.pendingBalance || 0
              ).toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      {/* Weekly Earnings */}

      <div className="rider-payout-details-card">
        <div className="rider-payout-details-card-header">
          <h2>Weekly Earnings</h2>
        </div>

        <div className="rider-details-table-container">
          <table className="rider-details-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Total Earnings</th>
                <th>Deliveries</th>
              </tr>
            </thead>

            <tbody>
              {weekly.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="rider-details-empty"
                  >
                    No weekly earnings found.
                  </td>
                </tr>
              ) : (
                weekly.map((item) => (
                  <tr
                    key={`${item.periodStart}-${item.periodEnd}`}
                  >
                    <td>
                      {item.periodStart} →{" "}
                      {item.periodEnd}
                    </td>

                    <td>
                      ₹
                      {Number(
                        item.totalEarnings || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {item.deliveries || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Earnings */}

      <div className="rider-payout-details-card">
        <div className="rider-payout-details-card-header">
          <h2>Monthly Earnings</h2>
        </div>

        <div className="rider-details-table-container">
          <table className="rider-details-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Earnings</th>
                <th>Deliveries</th>
              </tr>
            </thead>

            <tbody>
              {monthly.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="rider-details-empty"
                  >
                    No monthly earnings found.
                  </td>
                </tr>
              ) : (
                monthly.map((item) => (
                  <tr key={item.period}>
                    <td>{item.period}</td>

                    <td>
                      ₹
                      {Number(
                        item.totalEarnings || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {item.deliveries || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History */}

      <div className="rider-payout-details-card">
        <div className="rider-payout-details-card-header">
          <h2>Payout History</h2>
        </div>

        <div className="rider-details-table-container">
          <table className="rider-details-table">
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
              {payouts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="rider-details-empty"
                  >
                    No payout history found.
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>
                      {payout.paidAt
                        ? new Date(
                            payout.paidAt
                          ).toLocaleDateString()
                        : new Date(
                            payout.createdAt
                          ).toLocaleDateString()}
                    </td>

                    <td>
                      ₹
                      {Number(
                        payout.amount || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {new Date(
                        payout.periodStart
                      ).toLocaleDateString()}
                      {" → "}
                      {new Date(
                        payout.periodEnd
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        className={`rider-payout-status ${
                          payout.status?.toLowerCase() ||
                          ""
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>

                    <td>
                      {payout.provider || "N/A"}
                    </td>

                    <td>
                      {payout.referenceId || "N/A"}
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

export default RiderPayoutDetails;