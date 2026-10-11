import { useEffect, useState } from "react";
import api from "../services/api";
import "./Earnings.css";

function Earnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/earnings/net");

      if (response.data?.success) {
        setEarnings(response.data);
      } else {
        setError("Failed to load earnings");
      }
    } catch (err) {
      console.error("Fetch earnings error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load earnings"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Earnings</h1>
            <p>Platform earnings overview</p>
          </div>
        </div>

        <div className="earnings-loading">
          Loading earnings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Earnings</h1>
            <p>Platform earnings overview</p>
          </div>
        </div>

        <div className="earnings-error">
          <p>{error}</p>

          <button onClick={fetchEarnings}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Earnings</h1>
          <p>Platform earnings overview</p>
        </div>

        <button
          className="earnings-refresh-btn"
          onClick={fetchEarnings}
        >
          Refresh
        </button>
      </div>

      <div className="earnings-grid">

        <div className="earnings-card">
          <div className="earnings-card-title">
            Total Commission
          </div>

          <div className="earnings-card-value">
            ₹{Number(
              earnings?.totalCommission || 0
            ).toFixed(2)}
          </div>

          <div className="earnings-card-description">
            Platform commission earned
          </div>
        </div>

        <div className="earnings-card">
          <div className="earnings-card-title">
            Total Refunded
          </div>

          <div className="earnings-card-value">
            ₹{Number(
              earnings?.totalRefunded || 0
            ).toFixed(2)}
          </div>

          <div className="earnings-card-description">
            Amount refunded to customers
          </div>
        </div>

        <div className="earnings-card">
          <div className="earnings-card-title">
            Net Platform Earnings
          </div>

          <div className="earnings-card-value">
            ₹{Number(
              earnings?.netPlatformEarnings || 0
            ).toFixed(2)}
          </div>

          <div className="earnings-card-description">
            Commission after refunds
          </div>
        </div>

      </div>

    </div>
  );
}

export default Earnings;