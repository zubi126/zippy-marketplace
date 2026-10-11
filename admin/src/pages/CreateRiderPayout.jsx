import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateRiderPayout.css";

function CreateRiderPayout() {
  const navigate = useNavigate();

  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    riderId: "",
    amount: "",
    periodStart: "",
    periodEnd: "",
    referenceId: "",
  });

  const fetchRiders = async () => {
    try {
      setLoadingRiders(true);
      setError("");

      const response = await api.get(
        "/admin/payouts/riders?page=1&limit=100"
      );

      if (response.data?.success) {
        setRiders(response.data.riders || []);
      } else {
        setError("Failed to load riders.");
      }
    } catch (err) {
      console.error("Fetch riders error:", err);
      setError(
        err.response?.data?.message || "Failed to load riders."
      );
    } finally {
      setLoadingRiders(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const selectedRider = riders.find(
    (item) => item.riderId === form.riderId
  );

  const pendingBalance = Number(
    selectedRider?.balance?.pendingBalance || 0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.riderId) {
      setError("Please select a rider.");
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payout amount greater than zero.");
      return;
    }

    if (amount > pendingBalance) {
      setError(
        `Payout amount cannot exceed the pending balance of ₹${pendingBalance.toFixed(2)}.`
      );
      return;
    }

    if (!form.periodStart || !form.periodEnd) {
      setError("Please select both payout period dates.");
      return;
    }

    if (form.periodStart > form.periodEnd) {
      setError("Start date cannot be after the end date.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/admin/rider-payouts/cash",
        {
          riderId: form.riderId,
          amount,
          periodStart: form.periodStart,
          periodEnd: form.periodEnd,
          referenceId: form.referenceId.trim() || undefined,
        }
      );

      if (response.data?.success) {
        setSuccess("Cash rider payout recorded successfully.");

        setTimeout(() => {
          navigate(`/rider-payouts/${form.riderId}`);
        }, 1000);
      } else {
        setError(
          response.data?.message || "Failed to record rider payout."
        );
      }
    } catch (err) {
      console.error("Create rider payout error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to record rider payout."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page create-rider-payout-page">
      <div className="admin-page-header">
        <div>
          <h1>Create Rider Payout</h1>
          <p>Record a cash payment made to a delivery rider</p>
        </div>

        <button
          type="button"
          className="create-rider-payout-back-btn"
          onClick={() => navigate("/rider-payouts")}
        >
          Back to Rider Payouts
        </button>
      </div>

      <div className="create-rider-payout-card">
        {error && (
          <div className="create-rider-payout-alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="create-rider-payout-alert success">
            {success}
          </div>
        )}

        {loadingRiders ? (
          <div className="create-rider-payout-loading">
            Loading riders...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="create-rider-payout-field">
              <label htmlFor="riderId">Select Rider *</label>

              <select
                id="riderId"
                name="riderId"
                value={form.riderId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a rider</option>

                {riders.map((item) => (
                  <option
                    key={item.riderId}
                    value={item.riderId}
                  >
                    {item.rider?.name || "Unnamed Rider"}
                    {item.rider?.phone
                      ? ` — ${item.rider.phone}`
                      : ""}
                  </option>
                ))}
              </select>

              {riders.length === 0 && (
                <small>No riders were found.</small>
              )}
            </div>

            {selectedRider && (
              <div className="create-rider-payout-balance">
                <span>Rider Pending Balance</span>
                <strong>
                  ₹
                  {pendingBalance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
            )}

            <div className="create-rider-payout-field">
              <label htmlFor="amount">Payout Amount (₹) *</label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                max={pendingBalance}
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter payout amount"
                required
              />

              <small>
                Amount must not exceed the rider's pending balance.
              </small>
            </div>

            <div className="create-rider-payout-grid">
              <div className="create-rider-payout-field">
                <label htmlFor="periodStart">Period Start *</label>

                <input
                  id="periodStart"
                  name="periodStart"
                  type="date"
                  value={form.periodStart}
                  onChange={handleChange}
                  max={form.periodEnd || undefined}
                  required
                />
              </div>

              <div className="create-rider-payout-field">
                <label htmlFor="periodEnd">Period End *</label>

                <input
                  id="periodEnd"
                  name="periodEnd"
                  type="date"
                  value={form.periodEnd}
                  onChange={handleChange}
                  min={form.periodStart || undefined}
                  required
                />
              </div>
            </div>

            <div className="create-rider-payout-field">
              <label htmlFor="referenceId">
                Reference ID (Optional)
              </label>

              <input
                id="referenceId"
                name="referenceId"
                type="text"
                value={form.referenceId}
                onChange={handleChange}
                placeholder="Enter cash receipt or transaction reference"
              />
            </div>

            <div className="create-rider-payout-notice">
              <strong>Important:</strong> Submitting this form records
              an actual cash payout. Confirm that the rider has received
              the money before proceeding.
            </div>

            <div className="create-rider-payout-actions">
              <button
                type="button"
                className="create-rider-payout-cancel-btn"
                onClick={() => navigate("/rider-payouts")}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-rider-payout-submit-btn"
                disabled={submitting || loadingRiders}
              >
                {submitting ? "Recording Payout..." : "Record Cash Payout"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}



export default CreateRiderPayout;