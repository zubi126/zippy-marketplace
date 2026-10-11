import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Shops.css";

function Shops() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/shops?status=${status}`
      );

      setShops(response.data?.shops || []);
    } catch (error) {
      console.error("Failed to fetch shops:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load shops."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [status]);

  const handleAction = async (shop, action) => {
    if (action === "reject" || action === "suspend") {
      setSelectedAction({
        shop,
        action,
      });

      setReason("");
      setShowReasonModal(true);
      return;
    }

    try {
      setActionLoading(shop.id);

      let endpoint = "";

      if (action === "approve") {
        endpoint = `/admin/shops/${shop.id}/approve`;
      }

      if (action === "reactivate") {
        endpoint = `/admin/shops/${shop.id}/reactivate`;
      }

      await api.patch(endpoint);

      await fetchShops();
    } catch (error) {
      console.error("Shop action failed:", error);

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

    const shop = selectedAction?.shop;
    const action = selectedAction?.action;

    if (!shop || !action) return;

    try {
      setActionLoading(shop.id);

      let endpoint = "";

      if (action === "reject") {
        endpoint = `/admin/shops/${shop.id}/reject`;
      }

      if (action === "suspend") {
        endpoint = `/admin/shops/${shop.id}/suspend`;
      }

      await api.patch(endpoint, {
        reason: reason.trim(),
      });

      setShowReasonModal(false);
      setSelectedAction(null);
      setReason("");

      await fetchShops();
    } catch (error) {
      console.error("Shop action failed:", error);

      alert(
        error.response?.data?.message ||
          "Unable to complete this action."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredShops = shops.filter((shop) => {
    const searchText = search.toLowerCase();

    return (
      shop.name?.toLowerCase().includes(searchText) ||
      shop.owner?.name?.toLowerCase().includes(searchText) ||
      shop.owner?.phone?.toLowerCase().includes(searchText) ||
      shop.owner?.email?.toLowerCase().includes(searchText) ||
      shop.id?.toLowerCase().includes(searchText)
    );
  });

  const getStatusClass = (shopStatus) => {
    return `shop-status shop-status-${shopStatus?.toLowerCase()}`;
  };

  return (
    <div className="shops-page">

      <div className="shops-page-header">
        <div>
          <h1>Shops</h1>
          <p>
            Manage shop applications, approvals and accounts.
          </p>
        </div>

        <button
          type="button"
          className="shops-refresh-button"
          onClick={fetchShops}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="shops-tabs">
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
                ? "shops-tab active"
                : "shops-tab"
            }
            onClick={() => setStatus(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="shops-toolbar">

        <div className="shops-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search shop, owner, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shops-count">
          {filteredShops.length} shop
          {filteredShops.length !== 1 ? "s" : ""}
        </div>

      </div>

      {error && (
        <div className="shops-error">
          {error}
        </div>
      )}

      <div className="shops-card">

        {loading ? (
          <div className="shops-empty">
            <div className="shops-loading-spinner"></div>
            <p>Loading shops...</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="shops-empty">
            <div className="shops-empty-icon">
              🏪
            </div>

            <h3>No shops found</h3>

            <p>
              There are no shops under the{" "}
              {status.toLowerCase()} status.
            </p>
          </div>
        ) : (
          <div className="shops-table-wrapper">

            <table className="shops-table">

              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Owner Account</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredShops.map((shop) => {

                  const isActionLoading =
                    actionLoading === shop.id;

                  return (
                    <tr key={shop.id}>

                      <td>
                        <div className="shop-info">

                          <div className="shop-avatar">
                            {shop.name
                              ?.charAt(0)
                              .toUpperCase() || "S"}
                          </div>

                          <div>
                            <strong>
                              {shop.name || "Unnamed Shop"}
                            </strong>

                            <small>
                              {shop.id}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        {shop.owner?.name || "—"}
                      </td>

                      <td>
                        {shop.owner?.phone || "—"}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            shop.verificationStatus
                          )}
                        >
                          {shop.verificationStatus || "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            shop.owner?.isActive
                              ? "shop-account-active"
                              : "shop-account-inactive"
                          }
                        >
                          {shop.owner?.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {shop.createdAt
                          ? new Date(
                              shop.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>

                        <div className="shop-actions">

                          <button
                            type="button"
                            className="shop-view-button"
                            onClick={() =>
                              navigate(
                                `/shops/${shop.id}`
                              )
                            }
                          >
                            View
                          </button>

                          {shop.verificationStatus ===
                            "PENDING" && (
                            <>
                              <button
                                type="button"
                                className="shop-approve-button"
                                disabled={isActionLoading}
                                onClick={() =>
                                  handleAction(
                                    shop,
                                    "approve"
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                className="shop-reject-button"
                                disabled={isActionLoading}
                                onClick={() =>
                                  handleAction(
                                    shop,
                                    "reject"
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {shop.verificationStatus ===
                            "APPROVED" && (
                            <button
                              type="button"
                              className="shop-suspend-button"
                              disabled={isActionLoading}
                              onClick={() =>
                                handleAction(
                                  shop,
                                  "suspend"
                                )
                              }
                            >
                              Suspend
                            </button>
                          )}

                          {shop.verificationStatus ===
                            "SUSPENDED" && (
                            <button
                              type="button"
                              className="shop-reactivate-button"
                              disabled={isActionLoading}
                              onClick={() =>
                                handleAction(
                                  shop,
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
        <div className="shop-modal-overlay">

          <div className="shop-reason-modal">

            <div className="shop-modal-header">

              <div>
                <h2>
                  {selectedAction?.action === "reject"
                    ? "Reject Shop"
                    : "Suspend Shop"}
                </h2>

                <p>
                  {selectedAction?.shop?.name ||
                    "Shop"}
                </p>
              </div>

              <button
                type="button"
                className="shop-modal-close"
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

            <div className="shop-modal-actions">

              <button
                type="button"
                className="shop-modal-cancel"
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
                    ? "shop-modal-danger"
                    : "shop-modal-warning"
                }
                disabled={actionLoading !== null}
                onClick={submitReasonAction}
              >
                {actionLoading
                  ? "Processing..."
                  : selectedAction?.action === "reject"
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

export default Shops;