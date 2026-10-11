import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ShopDetails.css";

function ShopDetails() {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const fetchShop = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/shops/${shopId}`
      );

      setShop(response.data?.shop || null);
    } catch (error) {
      console.error("Failed to fetch shop:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load shop details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [shopId]);

  const handleAction = async (action) => {
    if (action === "reject" || action === "suspend") {
      setSelectedAction(action);
      setReason("");
      setShowReasonModal(true);
      return;
    }

    try {
      setActionLoading(true);

      let endpoint = "";

      if (action === "approve") {
        endpoint = `/admin/shops/${shopId}/approve`;
      }

      if (action === "reactivate") {
        endpoint = `/admin/shops/${shopId}/reactivate`;
      }

      if (!endpoint) return;

      await api.patch(endpoint);

      await fetchShop();
    } catch (error) {
      console.error("Shop action failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to complete this action."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const submitReasonAction = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    try {
      setActionLoading(true);

      let endpoint = "";

      if (selectedAction === "reject") {
        endpoint = `/admin/shops/${shopId}/reject`;
      }

      if (selectedAction === "suspend") {
        endpoint = `/admin/shops/${shopId}/suspend`;
      }

      await api.patch(endpoint, {
        reason: reason.trim(),
      });

      setShowReasonModal(false);
      setSelectedAction("");
      setReason("");

      await fetchShop();
    } catch (error) {
      console.error("Shop action failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to complete this action."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return `shop-detail-status shop-detail-status-${status?.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="shop-details-page">
        <div className="shop-details-loading">
          <div className="shop-details-spinner"></div>
          <p>Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="shop-details-page">

        <button
          type="button"
          className="shop-details-back"
          onClick={() => navigate("/shops")}
        >
          ← Back to Shops
        </button>

        <div className="shop-details-error">
          <h2>Unable to load shop</h2>

          <p>
            {error || "Shop not found."}
          </p>

          <button
            type="button"
            onClick={fetchShop}
          >
            Try Again
          </button>
        </div>

      </div>
    );
  }

  const verificationStatus =
    shop.verificationStatus || "UNKNOWN";

  return (
    <div className="shop-details-page">

      {/* Header */}

      <div className="shop-details-header">

        <div>

          <button
            type="button"
            className="shop-details-back"
            onClick={() => navigate("/shops")}
          >
            ← Back to Shops
          </button>

          <div className="shop-details-title">

            <div className="shop-details-avatar">
              {shop.name
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div>
              <h1>
                {shop.name || "Unnamed Shop"}
              </h1>

              <p>
                Shop ID: {shop.id}
              </p>
            </div>

          </div>

        </div>

        <span
          className={getStatusClass(
            verificationStatus
          )}
        >
          {verificationStatus}
        </span>

      </div>

      {/* Action Bar */}

      <div className="shop-details-actions">

        <div>
          <strong>Account Actions</strong>

          <span>
            Manage this shop's verification status.
          </span>
        </div>

        <div className="shop-details-action-buttons">

          {verificationStatus === "PENDING" && (
            <>
              <button
                type="button"
                className="shop-detail-approve-button"
                disabled={actionLoading}
                onClick={() =>
                  handleAction("approve")
                }
              >
                Approve Shop
              </button>

              <button
                type="button"
                className="shop-detail-reject-button"
                disabled={actionLoading}
                onClick={() =>
                  handleAction("reject")
                }
              >
                Reject Shop
              </button>
            </>
          )}

          {verificationStatus === "APPROVED" && (
            <button
              type="button"
              className="shop-detail-suspend-button"
              disabled={actionLoading}
              onClick={() =>
                handleAction("suspend")
              }
            >
              Suspend Shop
            </button>
          )}

          {verificationStatus === "SUSPENDED" && (
            <button
              type="button"
              className="shop-detail-reactivate-button"
              disabled={actionLoading}
              onClick={() =>
                handleAction("reactivate")
              }
            >
              Reactivate Shop
            </button>
          )}

        </div>

      </div>

      {/* Main Grid */}

      <div className="shop-details-grid">

        {/* Shop Information */}

        <section className="shop-detail-card">

          <div className="shop-detail-card-header">
            <h2>Shop Information</h2>
          </div>

          <div className="shop-detail-info-grid">

            <div className="shop-detail-field">
              <span>Shop Name</span>

              <strong>
                {shop.name || "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Shop ID</span>

              <strong className="shop-detail-id">
                {shop.id}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Verification Status</span>

              <strong>
                {shop.verificationStatus || "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Created On</span>

              <strong>
                {formatDate(shop.createdAt)}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Last Updated</span>

              <strong>
                {formatDate(shop.updatedAt)}
              </strong>
            </div>

          </div>

        </section>

        {/* Owner Information */}

        <section className="shop-detail-card">

          <div className="shop-detail-card-header">
            <h2>Owner Information</h2>
          </div>

          <div className="shop-detail-info-grid">

            <div className="shop-detail-field">
              <span>Owner Name</span>

              <strong>
                {shop.owner?.name || "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Phone Number</span>

              <strong>
                {shop.owner?.phone || "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Email Address</span>

              <strong>
                {shop.owner?.email || "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Role</span>

              <strong>
                {shop.owner?.role || "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Owner Account</span>

              <strong>
                {shop.owner?.isActive
                  ? "Active"
                  : "Inactive"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Owner Registered</span>

              <strong>
                {formatDate(
                  shop.owner?.createdAt
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* Verification */}

        <section className="shop-detail-card">

          <div className="shop-detail-card-header">
            <h2>Verification Information</h2>
          </div>

          <div className="shop-verification-box">

            <div className="shop-verification-row">

              <span>
                Verification Status
              </span>

              <span
                className={getStatusClass(
                  verificationStatus
                )}
              >
                {verificationStatus}
              </span>

            </div>

            <div className="shop-verification-row">

              <span>
                Rejection / Suspension Reason
              </span>

              <strong>
                {shop.rejectionReason ||
                  "No reason recorded"}
              </strong>

            </div>

            <div className="shop-verification-row">

              <span>
                Last Updated
              </span>

              <strong>
                {formatDate(shop.updatedAt)}
              </strong>

            </div>

          </div>

        </section>

        {/* System Information */}

        <section className="shop-detail-card">

          <div className="shop-detail-card-header">
            <h2>System Information</h2>
          </div>

          <div className="shop-detail-info-grid">

            <div className="shop-detail-field">
              <span>Shop ID</span>

              <strong className="shop-detail-id">
                {shop.id}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Owner ID</span>

              <strong className="shop-detail-id">
                {shop.owner?.id ||
                  shop.ownerId ||
                  "—"}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Created At</span>

              <strong>
                {formatDate(shop.createdAt)}
              </strong>
            </div>

            <div className="shop-detail-field">
              <span>Updated At</span>

              <strong>
                {formatDate(shop.updatedAt)}
              </strong>
            </div>

          </div>

        </section>

      </div>

      {/* Reason Modal */}

      {showReasonModal && (
        <div className="shop-detail-modal-overlay">

          <div className="shop-detail-modal">

            <div className="shop-detail-modal-header">

              <div>

                <h2>
                  {selectedAction === "reject"
                    ? "Reject Shop"
                    : "Suspend Shop"}
                </h2>

                <p>
                  {shop.name || "Shop"}
                </p>

              </div>

              <button
                type="button"
                className="shop-detail-modal-close"
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedAction("");
                  setReason("");
                }}
              >
                ×
              </button>

            </div>

            <label>
              Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              rows="4"
              placeholder={
                selectedAction === "reject"
                  ? "Enter rejection reason..."
                  : "Enter suspension reason..."
              }
            />

            <div className="shop-detail-modal-actions">

              <button
                type="button"
                className="shop-detail-cancel"
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedAction("");
                  setReason("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  selectedAction === "reject"
                    ? "shop-detail-modal-danger"
                    : "shop-detail-modal-warning"
                }
                disabled={actionLoading}
                onClick={submitReasonAction}
              >
                {actionLoading
                  ? "Processing..."
                  : selectedAction === "reject"
                  ? "Reject Shop"
                  : "Suspend Shop"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ShopDetails;