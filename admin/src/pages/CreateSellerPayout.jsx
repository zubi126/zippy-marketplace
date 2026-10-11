
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateSellerPayout.css";

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

function CreateSellerPayout() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [shopId, setShopId] = useState("");
  const [amount, setAmount] = useState("");
  const [periodStart, setPeriodStart] = useState(getToday());
  const [periodEnd, setPeriodEnd] = useState(getToday());
  const [referenceId, setReferenceId] = useState("");
  const [description, setDescription] = useState("");
  const [loadingShops, setLoadingShops] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedShop = shops.find((shop) => shop.shopId === shopId);
  const pendingBalance = Number(
    selectedShop?.balance?.pendingBalance || 0
  );

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoadingShops(true);
        setError("");

        const response = await api.get(
          "/admin/payouts/sellers?page=1&limit=100"
        );

        if (response.data?.success) {
          setShops(response.data.shops || []);
        } else {
          setError("Failed to load sellers.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load sellers."
        );
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payoutAmount = Number(amount);

    if (!shopId) {
      setError("Please select a seller.");
      return;
    }

    if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
      setError("Enter a valid payout amount.");
      return;
    }

    if (payoutAmount > pendingBalance) {
      setError("Payout amount cannot exceed the pending balance.");
      return;
    }

    if (!periodStart || !periodEnd || periodStart > periodEnd) {
      setError("Please select a valid payout period.");
      return;
    }

    try {
      setSubmitting(true);

      const idempotencyKey =
        `seller-cash-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`;

      const response = await api.post(
        "/admin/seller-payouts/cash",
        {
          shopId,
          amount: payoutAmount,
          periodStart,
          periodEnd,
          referenceId: referenceId.trim() || undefined,
          description: description.trim() || undefined,
          idempotencyKey,
        }
      );

      if (response.data?.success) {
        setSuccess(
          response.data.message || "Seller payout created successfully."
        );

        setTimeout(() => {
          navigate(`/seller-payouts/${shopId}`);
        }, 1000);
      } else {
        setError(response.data?.message || "Failed to create payout.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create seller payout."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page create-seller-payout-page">
      <div className="admin-page-header">
        <div>
          <h1>Create Seller Payout</h1>
          <p>Record a cash payment to a seller.</p>
        </div>

        <button
          type="button"
          className="csp-secondary-btn"
          onClick={() => navigate("/seller-payouts")}
        >
          Back to Seller Payouts
        </button>
      </div>

      <form className="csp-form" onSubmit={handleSubmit}>
        {error && <div className="csp-message csp-error">{error}</div>}
        {success && (
          <div className="csp-message csp-success">{success}</div>
        )}

        <div className="csp-field">
          <label htmlFor="seller">Select Seller *</label>
          <select
            id="seller"
            value={shopId}
            onChange={(e) => {
              setShopId(e.target.value);
              setAmount("");
            }}
            required
            disabled={loadingShops || submitting}
          >
            <option value="">
              {loadingShops ? "Loading sellers..." : "Choose a seller"}
            </option>

            {shops.map((shop) => (
              <option key={shop.shopId} value={shop.shopId}>
                {shop.shop?.name || "Unnamed Shop"} — Pending ₹
                {Number(shop.balance?.pendingBalance || 0).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selectedShop && (
          <div className="csp-balance">
            <span>Seller pending balance</span>
            <strong>₹{pendingBalance.toFixed(2)}</strong>
          </div>
        )}

        <div className="csp-field">
          <label htmlFor="amount">Payout Amount (₹) *</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            max={pendingBalance}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            disabled={!shopId || submitting}
          />
        </div>

        <div className="csp-grid">
          <div className="csp-field">
            <label htmlFor="periodStart">Period Start *</label>
            <input
              id="periodStart"
              type="date"
              value={periodStart}
              max={periodEnd}
              onChange={(e) => setPeriodStart(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="csp-field">
            <label htmlFor="periodEnd">Period End *</label>
            <input
              id="periodEnd"
              type="date"
              value={periodEnd}
              min={periodStart}
              onChange={(e) => setPeriodEnd(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="csp-field">
          <label htmlFor="referenceId">Reference ID (optional)</label>
          <input
            id="referenceId"
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder="Cash receipt or transaction reference"
            disabled={submitting}
          />
        </div>

        <div className="csp-field">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a note about this payout"
            disabled={submitting}
          />
        </div>

        <div className="csp-actions">
          <button
            type="button"
            className="csp-secondary-btn"
            onClick={() => navigate("/seller-payouts")}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="csp-submit-btn"
            disabled={
              submitting ||
              loadingShops ||
              !shopId ||
              shops.length === 0
            }
          >
            {submitting ? "Creating Payout..." : "Create Cash Payout"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSellerPayout;
