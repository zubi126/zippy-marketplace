import { useEffect, useState } from "react";
import api from "../services/api";
import "./Refunds.css";

function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("PENDING");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [processingId, setProcessingId] = useState(null);

  const fetchRefunds = async (page = 1, selectedStatus = status) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/refunds", {
        params: {
          status: selectedStatus,
          page,
          limit: 10,
        },
      });

      const data = response.data;

      setRefunds(data.refundRequests || []);

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error("Failed to fetch refunds:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load refund requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds(1, status);
  }, [status]);

  const handleApprove = async (refundId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this refund?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(refundId);

      await api.patch(
        `/admin/refunds/${refundId}/approve`
      );

      await fetchRefunds(pagination.page, status);
    } catch (err) {
      console.error("Approve refund error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to approve refund."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (refundId) => {
    const rejectionReason = window.prompt(
      "Enter rejection reason:"
    );

    if (!rejectionReason || !rejectionReason.trim()) {
      return;
    }

    try {
      setProcessingId(refundId);

      await api.patch(
        `/admin/refunds/${refundId}/reject`,
        {
          rejectionReason: rejectionReason.trim(),
        }
      );

      await fetchRefunds(pagination.page, status);
    } catch (err) {
      console.error("Reject refund error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to reject refund."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handlePrevious = () => {
    if (pagination.hasPreviousPage) {
      fetchRefunds(pagination.page - 1, status);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      fetchRefunds(pagination.page + 1, status);
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (refundStatus) => {
    return `refund-status refund-${refundStatus
      .toLowerCase()
      .replace(/_/g, "-")}`;
  };

  return (
    <div className="admin-refunds-page">
      <div className="refunds-header">
        <div>
          <h1>Refunds</h1>
          <p>
            Review and manage customer refund requests.
          </p>
        </div>

        <div className="refunds-header-count">
          <span>{pagination.total}</span>
          <small>Refund Requests</small>
        </div>
      </div>

      <div className="refunds-toolbar">
        <div className="refunds-filter">
          <label htmlFor="refund-status">
            Status
          </label>

          <select
            id="refund-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button
          type="button"
          className="refunds-refresh-button"
          onClick={() =>
            fetchRefunds(pagination.page, status)
          }
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="refunds-state-card">
          <div className="refunds-spinner"></div>
          <p>Loading refund requests...</p>
        </div>
      ) : error ? (
        <div className="refunds-state-card refunds-error-card">
          <div className="refunds-state-icon">!</div>

          <h3>Unable to load refunds</h3>

          <p>{error}</p>

          <button
            type="button"
            className="refunds-retry-button"
            onClick={() =>
              fetchRefunds(pagination.page, status)
            }
          >
            Try Again
          </button>
        </div>
      ) : refunds.length === 0 ? (
        <div className="refunds-state-card">
          <div className="refunds-state-icon">
            ↩
          </div>

          <h3>No refund requests</h3>

          <p>
            There are no refund requests with this status.
          </p>
        </div>
      ) : (
        <>
          <div className="refunds-table-card">
            <div className="refunds-table-wrapper">
              <table className="refunds-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Refund Amount</th>
                    <th>Order Total</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                    <th>Requested</th>
                    <th>Status</th>
                    {status === "PENDING" && (
                      <th>Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {refunds.map((refund) => (
                    <tr key={refund.id}>
                      <td>
                        <div className="refund-order-info">
                          <strong>
                            {refund.order?.orderNumber ||
                              "—"}
                          </strong>

                          <span>
                            {formatDate(
                              refund.order?.createdAt
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="refund-customer-info">
                          <strong>
                            {refund.customer?.name ||
                              "Unknown Customer"}
                          </strong>

                          <span>
                            {refund.customer?.phone ||
                              "No phone"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong className="refund-amount">
                          {formatAmount(refund.amount)}
                        </strong>
                      </td>

                      <td>
                        {formatAmount(
                          refund.order?.total
                        )}
                      </td>

                      <td>
                        <div className="refund-payment-info">
                          <strong>
                            {refund.order
                              ?.paymentMethod || "—"}
                          </strong>

                          <span>
                            {refund.order
                              ?.paymentStatus || "—"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="order-status">
                          {refund.order?.status
                            ?.replace(/_/g, " ") || "—"}
                        </span>
                      </td>

                      <td>
                        {formatDate(refund.createdAt)}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            refund.status
                          )}
                        >
                          {refund.status}
                        </span>
                      </td>

                      {status === "PENDING" && (
                        <td>
                          <div className="refund-actions">
                            <button
                              type="button"
                              className="refund-approve-button"
                              onClick={() =>
                                handleApprove(refund.id)
                              }
                              disabled={
                                processingId === refund.id
                              }
                            >
                              {processingId === refund.id
                                ? "..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              className="refund-reject-button"
                              onClick={() =>
                                handleReject(refund.id)
                              }
                              disabled={
                                processingId === refund.id
                              }
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="refunds-pagination">
            <div className="pagination-info">
              Showing page{" "}
              <strong>{pagination.page}</strong>{" "}
              of{" "}
              <strong>
                {pagination.totalPages}
              </strong>

              <span>
                ({pagination.total} request
                {pagination.total === 1 ? "" : "s"})
              </span>
            </div>

            <div className="pagination-buttons">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={
                  !pagination.hasPreviousPage ||
                  loading
                }
              >
                ← Previous
              </button>

              <div className="pagination-current">
                {pagination.page}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  !pagination.hasNextPage ||
                  loading
                }
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Refunds;