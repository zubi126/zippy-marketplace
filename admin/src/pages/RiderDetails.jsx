import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./RiderDetails.css";

function RiderDetails() {
  const { riderId } = useParams();
  const navigate = useNavigate();

  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const fetchRider = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/riders/${riderId}`
      );

      setRider(response.data?.rider || null);
    } catch (error) {
      console.error("Failed to fetch rider:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load rider details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRider();
  }, [riderId]);

  const handleAction = async (action) => {
    if (
      action === "reject" ||
      action === "suspend"
    ) {
      setSelectedAction(action);
      setReason("");
      setShowReasonModal(true);
      return;
    }

    try {
      setActionLoading(true);

      let endpoint = "";

      if (action === "approve") {
        endpoint = `/admin/riders/${riderId}/approve`;
      }

      if (action === "reactivate") {
        endpoint = `/admin/riders/${riderId}/reactivate`;
      }

      if (!endpoint) return;

      await api.patch(endpoint);

      await fetchRider();
    } catch (error) {
      console.error("Rider action failed:", error);

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
        endpoint = `/admin/riders/${riderId}/reject`;
      }

      if (selectedAction === "suspend") {
        endpoint = `/admin/riders/${riderId}/suspend`;
      }

      await api.patch(endpoint, {
        reason: reason.trim(),
      });

      setShowReasonModal(false);
      setSelectedAction("");
      setReason("");

      await fetchRider();
    } catch (error) {
      console.error("Rider action failed:", error);

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

  const getVerificationClass = (status) => {
    return `rider-detail-status rider-detail-status-${status?.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="rider-details-page">
        <div className="rider-details-loading">
          <div className="rider-details-spinner"></div>
          <p>Loading rider details...</p>
        </div>
      </div>
    );
  }

  if (error || !rider) {
    return (
      <div className="rider-details-page">
        <button
          type="button"
          className="rider-details-back"
          onClick={() => navigate("/riders")}
        >
          ← Back to Riders
        </button>

        <div className="rider-details-error">
          <h2>Unable to load rider</h2>
          <p>{error || "Rider not found."}</p>

          <button
            type="button"
            onClick={fetchRider}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus =
    rider.verificationStatus || "UNKNOWN";

  return (
    <div className="rider-details-page">

      {/* Header */}

      <div className="rider-details-header">

        <div>
          <button
            type="button"
            className="rider-details-back"
            onClick={() => navigate("/riders")}
          >
            ← Back to Riders
          </button>

          <div className="rider-details-title">
            <div className="rider-details-avatar">
              {rider.user?.name
                ?.charAt(0)
                .toUpperCase() || "R"}
            </div>

            <div>
              <h1>
                {rider.user?.name || "Unknown Rider"}
              </h1>

              <p>
                Rider ID: {rider.id}
              </p>
            </div>
          </div>
        </div>

        <span
          className={getVerificationClass(
            verificationStatus
          )}
        >
          {verificationStatus}
        </span>

      </div>

      {/* Action Bar */}

      <div className="rider-details-actions">

        <div>
          <strong>Account Actions</strong>
          <span>
            Manage this rider's verification status.
          </span>
        </div>

        <div className="rider-details-action-buttons">

          {verificationStatus === "PENDING" && (
            <>
              <button
                type="button"
                className="detail-approve-button"
                disabled={actionLoading}
                onClick={() =>
                  handleAction("approve")
                }
              >
                Approve Rider
              </button>

              <button
                type="button"
                className="detail-reject-button"
                disabled={actionLoading}
                onClick={() =>
                  handleAction("reject")
                }
              >
                Reject Rider
              </button>
            </>
          )}

          {verificationStatus === "APPROVED" && (
            <button
              type="button"
              className="detail-suspend-button"
              disabled={actionLoading}
              onClick={() =>
                handleAction("suspend")
              }
            >
              Suspend Rider
            </button>
          )}

          {verificationStatus === "SUSPENDED" && (
            <button
              type="button"
              className="detail-reactivate-button"
              disabled={actionLoading}
              onClick={() =>
                handleAction("reactivate")
              }
            >
              Reactivate Rider
            </button>
          )}

        </div>

      </div>

      {/* Main Grid */}

      <div className="rider-details-grid">

        {/* Personal Information */}

        <section className="rider-detail-card">

          <div className="rider-detail-card-header">
            <h2>Personal Information</h2>
          </div>

          <div className="rider-detail-info-grid">

            <div className="rider-detail-field">
              <span>Full Name</span>
              <strong>
                {rider.user?.name || "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Phone Number</span>
              <strong>
                {rider.user?.phone || "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Email Address</span>
              <strong>
                {rider.user?.email || "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Role</span>
              <strong>
                {rider.user?.role || "RIDER"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Account Status</span>
              <strong>
                {rider.user?.isActive
                  ? "Active"
                  : "Inactive"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Registered On</span>
              <strong>
                {formatDate(rider.user?.createdAt)}
              </strong>
            </div>

          </div>

        </section>

        {/* Rider Information */}

        <section className="rider-detail-card">

          <div className="rider-detail-card-header">
            <h2>Rider Information</h2>
          </div>

          <div className="rider-detail-info-grid">

            <div className="rider-detail-field">
              <span>Rider ID</span>
              <strong className="rider-detail-id">
                {rider.id}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Vehicle Type</span>
              <strong>
                {rider.vehicleType || "Not set"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Current Status</span>
              <strong>
                {rider.status || "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Verification</span>
              <strong>
                {rider.verificationStatus || "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Latitude</span>
              <strong>
                {rider.latitude ?? "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Longitude</span>
              <strong>
                {rider.longitude ?? "—"}
              </strong>
            </div>

          </div>

        </section>

        {/* Verification Information */}

        <section className="rider-detail-card">

          <div className="rider-detail-card-header">
            <h2>Verification Information</h2>
          </div>

          <div className="rider-verification-box">

            <div className="rider-verification-row">
              <span>Verification Status</span>

              <span
                className={getVerificationClass(
                  verificationStatus
                )}
              >
                {verificationStatus}
              </span>
            </div>

            <div className="rider-verification-row">
              <span>Rejection / Suspension Reason</span>

              <strong>
                {rider.rejectionReason || "No reason recorded"}
              </strong>
            </div>

            <div className="rider-verification-row">
              <span>Last Updated</span>

              <strong>
                {formatDate(rider.updatedAt)}
              </strong>
            </div>

          </div>

        </section>

        {/* System Information */}

        <section className="rider-detail-card">

          <div className="rider-detail-card-header">
            <h2>System Information</h2>
          </div>

          <div className="rider-detail-info-grid">

            <div className="rider-detail-field">
              <span>User ID</span>
              <strong className="rider-detail-id">
                {rider.user?.id || rider.userId || "—"}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Created At</span>
              <strong>
                {formatDate(rider.createdAt)}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Updated At</span>
              <strong>
                {formatDate(rider.updatedAt)}
              </strong>
            </div>

            <div className="rider-detail-field">
              <span>Account Active</span>
              <strong>
                {rider.user?.isActive
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

          </div>

        </section>

      </div>

      {/* Reason Modal */}

      {showReasonModal && (
        <div className="rider-detail-modal-overlay">

          <div className="rider-detail-modal">

            <div className="rider-detail-modal-header">

              <div>
                <h2>
                  {selectedAction === "reject"
                    ? "Reject Rider"
                    : "Suspend Rider"}
                </h2>

                <p>
                  {rider.user?.name || "Rider"}
                </p>
              </div>

              <button
                type="button"
                className="rider-detail-modal-close"
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

            <div className="rider-detail-modal-actions">

              <button
                type="button"
                className="rider-detail-cancel"
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
                    ? "rider-detail-modal-danger"
                    : "rider-detail-modal-warning"
                }
                disabled={actionLoading}
                onClick={submitReasonAction}
              >
                {actionLoading
                  ? "Processing..."
                  : selectedAction === "reject"
                  ? "Reject Rider"
                  : "Suspend Rider"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default RiderDetails;