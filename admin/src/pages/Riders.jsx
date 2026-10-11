import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Riders.css";

function Riders() {
  const navigate = useNavigate();

  const [riders, setRiders] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/riders?status=${status}`
      );

      setRiders(response.data?.riders || []);
    } catch (error) {
      console.error("Failed to fetch riders:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load riders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, [status]);

  const handleAction = async (rider, action) => {
    if (action === "reject" || action === "suspend") {
      setSelectedAction({
        rider,
        action,
      });

      setReason("");
      setShowReasonModal(true);
      return;
    }

    try {
      setActionLoading(rider.id);

      let endpoint = "";

      if (action === "approve") {
        endpoint = `/admin/riders/${rider.id}/approve`;
      }

      if (action === "reactivate") {
        endpoint = `/admin/riders/${rider.id}/reactivate`;
      }

      if (!endpoint) return;

      await api.patch(endpoint);

      await fetchRiders();
    } catch (error) {
      console.error("Rider action failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to complete this action."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const submitReasonAction = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    const rider = selectedAction?.rider;
    const action = selectedAction?.action;

    if (!rider || !action) return;

    try {
      setActionLoading(rider.id);

      let endpoint = "";

      if (action === "reject") {
        endpoint = `/admin/riders/${rider.id}/reject`;
      }

      if (action === "suspend") {
        endpoint = `/admin/riders/${rider.id}/suspend`;
      }

      await api.patch(endpoint, {
        reason: reason.trim(),
      });

      setShowReasonModal(false);
      setSelectedAction(null);
      setReason("");

      await fetchRiders();
    } catch (error) {
      console.error("Rider action failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to complete this action."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRiders = riders.filter((rider) => {
    const searchText = search.toLowerCase();

    return (
      rider.user?.name?.toLowerCase().includes(searchText) ||
      rider.user?.phone?.toLowerCase().includes(searchText) ||
      rider.user?.email?.toLowerCase().includes(searchText) ||
      rider.id?.toLowerCase().includes(searchText)
    );
  });

  const getStatusClass = (riderStatus) => {
    return `rider-status rider-status-${riderStatus?.toLowerCase()}`;
  };

  return (
    <div className="riders-page">

      <div className="riders-page-header">
        <div>
          <h1>Riders</h1>
          <p>
            Manage rider applications, approvals and accounts.
          </p>
        </div>

        <button
          type="button"
          className="riders-refresh-button"
          onClick={fetchRiders}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="riders-tabs">
        {[
          "PENDING",
          "APPROVED",
          "REJECTED",
          "SUSPENDED",
        ].map((item) => (
          <button
            key={item}
            type="button"
            className={
              status === item
                ? "riders-tab active"
                : "riders-tab"
            }
            onClick={() => setStatus(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="riders-toolbar">

        <div className="riders-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="riders-count">
          {filteredRiders.length} rider
          {filteredRiders.length !== 1 ? "s" : ""}
        </div>

      </div>

      {error && (
        <div className="riders-error">
          {error}
        </div>
      )}

      <div className="riders-card">

        {loading ? (
          <div className="riders-empty">
            <div className="riders-loading-spinner"></div>
            <p>Loading riders...</p>
          </div>
        ) : filteredRiders.length === 0 ? (
          <div className="riders-empty">
            <div className="riders-empty-icon">
              🚴
            </div>

            <h3>No riders found</h3>

            <p>
              There are no riders under the{" "}
              {status.toLowerCase()} status.
            </p>
          </div>
        ) : (
          <div className="riders-table-wrapper">

            <table className="riders-table">

              <thead>
                <tr>
                  <th>Rider</th>
                  <th>Phone</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredRiders.map((rider) => {

                  const isActionLoading =
                    actionLoading === rider.id;

                  return (
                    <tr key={rider.id}>

                      <td>
                        <div className="rider-info">

                          <div className="rider-avatar">
                            {rider.user?.name
                              ?.charAt(0)
                              .toUpperCase() || "R"}
                          </div>

                          <div>
                            <strong>
                              {rider.user?.name ||
                                "Unknown Rider"}
                            </strong>

                            <small>
                              {rider.user?.email || "No email"}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        {rider.user?.phone || "—"}
                      </td>

                      <td>
                        {rider.vehicleType || "Not set"}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            rider.status
                          )}
                        >
                          {rider.status || "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`rider-verification rider-verification-${rider.verificationStatus?.toLowerCase()}`}
                        >
                          {rider.verificationStatus || "—"}
                        </span>
                      </td>

                      <td>
                        {rider.createdAt
                          ? new Date(
                              rider.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>

                        <div className="rider-actions">

                          <button
                            type="button"
                            className="rider-view-button"
                            onClick={() =>
                              navigate(
                                `/riders/${rider.id}`
                              )
                            }
                          >
                            View
                          </button>

                          {rider.verificationStatus ===
                            "PENDING" && (
                            <>
                              <button
                                type="button"
                                className="rider-approve-button"
                                disabled={isActionLoading}
                                onClick={() =>
                                  handleAction(
                                    rider,
                                    "approve"
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                className="rider-reject-button"
                                disabled={isActionLoading}
                                onClick={() =>
                                  handleAction(
                                    rider,
                                    "reject"
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {rider.verificationStatus ===
                            "APPROVED" && (
                            <button
                              type="button"
                              className="rider-suspend-button"
                              disabled={isActionLoading}
                              onClick={() =>
                                handleAction(
                                  rider,
                                  "suspend"
                                )
                              }
                            >
                              Suspend
                            </button>
                          )}

                          {rider.verificationStatus ===
                            "SUSPENDED" && (
                            <button
                              type="button"
                              className="rider-reactivate-button"
                              disabled={isActionLoading}
                              onClick={() =>
                                handleAction(
                                  rider,
                                  "reactivate"
                                )
                              }
                            >
                              Reactivate
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {showReasonModal && (
        <div className="rider-modal-overlay">

          <div className="rider-reason-modal">

            <div className="rider-modal-header">
              <div>
                <h2>
                  {selectedAction?.action === "reject"
                    ? "Reject Rider"
                    : "Suspend Rider"}
                </h2>

                <p>
                  {selectedAction?.rider?.user?.name ||
                    "Rider"}
                </p>
              </div>

              <button
                type="button"
                className="rider-modal-close"
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedAction(null);
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
              placeholder={
                selectedAction?.action === "reject"
                  ? "Enter rejection reason..."
                  : "Enter suspension reason..."
              }
              rows="4"
            />

            <div className="rider-modal-actions">

              <button
                type="button"
                className="rider-modal-cancel"
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedAction(null);
                  setReason("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  selectedAction?.action === "reject"
                    ? "rider-modal-danger"
                    : "rider-modal-warning"
                }
                disabled={actionLoading !== null}
                onClick={submitReasonAction}
              >
                {actionLoading
                  ? "Processing..."
                  : selectedAction?.action === "reject"
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

export default Riders;