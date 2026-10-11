// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import "./Dashboard.css";

// function Dashboard() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [rider, setRider] = useState(null);
//   const [deliveries, setDeliveries] = useState([]);
//   const [balance, setBalance] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [error, setError] = useState("");

//   const fetchDashboard = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const [
//         profileResponse,
//         deliveriesResponse,
//         balanceResponse,
//       ] = await Promise.all([
//         api.get("/riders/me"),
//         api.get("/riders/deliveries"),
//         api.get("/riders/earnings/balance"),
//       ]);

//       setRider(profileResponse.data?.rider || null);
//       setDeliveries(
//         deliveriesResponse.data?.deliveries || []
//       );
//       setBalance(
//         balanceResponse.data?.balance || null
//       );
//     } catch (error) {
//       console.error(
//         "Failed to load rider dashboard:",
//         error
//       );

//       setError(
//         error.response?.data?.message ||
//           "Unable to load dashboard."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const handleStatusChange = async () => {
//     if (!rider) return;

//     const newStatus =
//       rider.status === "AVAILABLE"
//         ? "OFFLINE"
//         : "AVAILABLE";

//     try {
//       setUpdatingStatus(true);
//       setError("");

//       const response = await api.patch(
//         "/riders/status",
//         {
//           status: newStatus,
//         }
//       );

//       setRider(
//         response.data?.rider || {
//           ...rider,
//           status: newStatus,
//         }
//       );
//     } catch (error) {
//       console.error(
//         "Failed to update rider status:",
//         error
//       );

//       setError(
//         error.response?.data?.message ||
//           "Unable to update rider status."
//       );
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="rider-dashboard-page">
//         <div className="rider-dashboard-loading">
//           Loading dashboard...
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="rider-dashboard-page">
//       <div className="rider-dashboard-container">
//         <div className="rider-dashboard-header">
//           <div>
//             <p className="rider-dashboard-greeting">
//               Welcome back
//             </p>

//             <h1>
//               {user?.name || rider?.user?.name || "Rider"}
//             </h1>

//             <p className="rider-dashboard-subtitle">
//               Manage your deliveries and earnings.
//             </p>
//           </div>

//           {rider && (
//             <div className="rider-availability">
//               <span
//                 className={`rider-status-dot ${
//                   rider.status === "AVAILABLE"
//                     ? "online"
//                     : rider.status === "ON_DELIVERY"
//                     ? "delivery"
//                     : "offline"
//                 }`}
//               ></span>

//               <span>
//                 {rider.status === "ON_DELIVERY"
//                   ? "On Delivery"
//                   : rider.status === "AVAILABLE"
//                   ? "Online"
//                   : "Offline"}
//               </span>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="rider-dashboard-error">
//             {error}
//           </div>
//         )}

//         {rider?.verificationStatus === "PENDING" && (
//           <div className="rider-pending-card">
//             <div>
//               <h3>Approval Pending</h3>

//               <p>
//                 Your rider account is waiting for admin
//                 approval. You can go online after approval.
//               </p>
//             </div>

//             <span className="pending-badge">
//               Pending
//             </span>
//           </div>
//         )}

//         {rider?.verificationStatus === "REJECTED" && (
//           <div className="rider-rejected-card">
//             <h3>Rider Application Rejected</h3>

//             <p>
//               Your rider application has been rejected by
//               the admin.
//             </p>
//           </div>
//         )}

//         <section className="rider-dashboard-stats">
//           <div className="rider-stat-card">
//             <span className="rider-stat-label">
//               Total Deliveries
//             </span>

//             <strong>
//               {deliveries.filter(
//                 (delivery) =>
//                   delivery.status === "DELIVERED"
//               ).length}
//             </strong>
//           </div>

//           <div className="rider-stat-card">
//             <span className="rider-stat-label">
//               Active Deliveries
//             </span>

//             <strong>
//               {deliveries.filter((delivery) =>
//                 [
//                   "ASSIGNED",
//                   "ACCEPTED",
//                   "PICKED_UP",
//                   "OUT_FOR_DELIVERY",
//                 ].includes(delivery.status)
//               ).length}
//             </strong>
//           </div>

//           <div className="rider-stat-card">
//             <span className="rider-stat-label">
//               Total Earned
//             </span>

//             <strong>
//               ₹{Number(
//                 balance?.totalEarned || 0
//               ).toFixed(2)}
//             </strong>
//           </div>

//           <div className="rider-stat-card">
//             <span className="rider-stat-label">
//               Pending Balance
//             </span>

//             <strong>
//               ₹{Number(
//                 balance?.pendingBalance || 0
//               ).toFixed(2)}
//             </strong>
//           </div>
//         </section>

//         <section className="rider-dashboard-actions">
//           <div className="rider-action-card">
//             <div>
//               <h2>Availability</h2>

//               <p>
//                 {rider?.status === "ON_DELIVERY"
//                   ? "You are currently delivering an order."
//                   : rider?.status === "AVAILABLE"
//                   ? "You are available for new deliveries."
//                   : "You are currently offline."}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={handleStatusChange}
//               disabled={
//                 updatingStatus ||
//                 rider?.verificationStatus !== "APPROVED" ||
//                 rider?.status === "ON_DELIVERY"
//               }
//               className={
//                 rider?.status === "AVAILABLE"
//                   ? "availability-button offline-button"
//                   : "availability-button online-button"
//               }
//             >
//               {updatingStatus
//                 ? "Updating..."
//                 : rider?.status === "AVAILABLE"
//                 ? "Go Offline"
//                 : "Go Online"}
//             </button>
//           </div>
//         </section>

//         <section className="rider-dashboard-deliveries">
//           <div className="rider-section-header">
//             <div>
//               <h2>Recent Deliveries</h2>

//               <p>
//                 Your latest assigned deliveries
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => navigate("/deliveries")}
//             >
//               View All
//             </button>
//           </div>

//           {deliveries.length === 0 ? (
//             <div className="rider-empty-card">
//               <div className="rider-empty-icon">
//                 🚴
//               </div>

//               <h3>No deliveries yet</h3>

//               <p>
//                 New delivery assignments will appear here.
//               </p>
//             </div>
//           ) : (
//             <div className="rider-delivery-list">
//               {deliveries
//                 .slice(0, 5)
//                 .map((delivery) => (
//                   <div
//                     className="rider-delivery-card"
//                     key={delivery.id}
//                     onClick={() =>
//                       navigate(
//                         `/deliveries/${delivery.id}`
//                       )
//                     }
//                   >
//                     <div>
//                       <span className="delivery-order-number">
//                         {delivery.order?.orderNumber ||
//                           "Order"}
//                       </span>

//                       <h3>
//                         {delivery.order
//                           ?.deliveryName ||
//                           "Customer"}
//                       </h3>

//                       <p>
//                         {delivery.order
//                           ?.deliveryCity ||
//                           "Delivery address"}
//                       </p>
//                     </div>

//                     <div className="delivery-card-right">
//                       <span
//                         className={`delivery-status status-${String(
//                           delivery.status || ""
//                         ).toLowerCase()}`}
//                       >
//                         {String(
//                           delivery.status || "UNKNOWN"
//                         ).replaceAll("_", " ")}
//                       </span>

//                       <strong>
//                         ₹{Number(
//                           delivery.riderEarning || 0
//                         ).toFixed(2)}
//                       </strong>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }

// export default Dashboard;




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rider, setRider] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [balance, setBalance] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        profileResponse,
        deliveriesResponse,
        balanceResponse,
      ] = await Promise.all([
        api.get("/riders/me"),
        api.get("/riders/deliveries"),
        api.get("/riders/earnings/balance"),
      ]);

      setRider(profileResponse.data?.rider || null);

      setDeliveries(
        deliveriesResponse.data?.deliveries || []
      );

      setBalance(
        balanceResponse.data?.balance || null
      );
    } catch (error) {
      console.error(
        "Failed to load rider dashboard:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async () => {
    if (!rider) return;

    const newStatus =
      rider.status === "AVAILABLE"
        ? "OFFLINE"
        : "AVAILABLE";

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await api.patch(
        "/riders/status",
        {
          status: newStatus,
        }
      );

      setRider(
        response.data?.rider || {
          ...rider,
          status: newStatus,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update rider status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update rider status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const totalDeliveries = deliveries.filter(
    (delivery) => delivery.status === "DELIVERED"
  ).length;

  const activeDeliveries = deliveries.filter(
    (delivery) =>
      [
        "ASSIGNED",
        "ACCEPTED",
        "PICKED_UP",
        "OUT_FOR_DELIVERY",
      ].includes(delivery.status)
  ).length;

  if (loading) {
    return (
      <main className="rider-dashboard-page">
        <div className="rider-dashboard-loading">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="rider-dashboard-page">
      <div className="rider-dashboard-container">

        {/* HEADER */}
        <div className="rider-dashboard-header">
          <div>
            <p className="rider-dashboard-greeting">
              Welcome back
            </p>

            <h1>
              {user?.name ||
                rider?.user?.name ||
                "Rider"}
            </h1>

            <p className="rider-dashboard-subtitle">
              Manage your deliveries and earnings.
            </p>
          </div>

          {rider && (
            <div className="rider-availability">
              <span
                className={`rider-status-dot ${
                  rider.status === "AVAILABLE"
                    ? "online"
                    : rider.status === "ON_DELIVERY"
                    ? "delivery"
                    : "offline"
                }`}
              />

              <span>
                {rider.status === "ON_DELIVERY"
                  ? "On Delivery"
                  : rider.status === "AVAILABLE"
                  ? "Online"
                  : "Offline"}
              </span>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="rider-dashboard-error">
            {error}
          </div>
        )}

        {/* VERIFICATION STATUS */}
        {rider?.verificationStatus === "PENDING" && (
          <div className="rider-pending-card">
            <div>
              <h3>Approval Pending</h3>

              <p>
                Your rider account is waiting for admin
                approval. You can go online after approval.
              </p>
            </div>

            <span className="pending-badge">
              Pending
            </span>
          </div>
        )}

        {rider?.verificationStatus === "REJECTED" && (
          <div className="rider-rejected-card">
            <h3>Rider Application Rejected</h3>

            <p>
              Your rider application has been rejected
              by the admin.
            </p>
          </div>
        )}

        {/* STATS */}
        <section className="rider-dashboard-stats">

          <div className="rider-stat-card">
            <span className="rider-stat-label">
              Total Deliveries
            </span>

            <strong>
              {totalDeliveries}
            </strong>
          </div>

          <div className="rider-stat-card">
            <span className="rider-stat-label">
              Active Deliveries
            </span>

            <strong>
              {activeDeliveries}
            </strong>
          </div>

          <div className="rider-stat-card">
            <span className="rider-stat-label">
              Total Earned
            </span>

            <strong>
              ₹
              {Number(
                balance?.totalEarned || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div className="rider-stat-card">
            <span className="rider-stat-label">
              Pending Balance
            </span>

            <strong>
              ₹
              {Number(
                balance?.pendingBalance || 0
              ).toFixed(2)}
            </strong>
          </div>

        </section>

        {/* QUICK ACCESS */}
        <section className="rider-quick-access">

          <div className="rider-section-header">
            <div>
              <h2>Quick Access</h2>

              <p>
                Manage your rider account
              </p>
            </div>
          </div>

          <div className="rider-quick-grid">

            {/* Deliveries */}
            <button
              type="button"
              className="rider-quick-card"
              onClick={() => navigate("/deliveries")}
            >
              <div className="rider-quick-icon">
                📦
              </div>

              <div>
                <h3>Deliveries</h3>

                <p>
                  View and manage all your deliveries
                </p>
              </div>

              <span className="rider-quick-arrow">
                →
              </span>
            </button>

            {/* Earnings */}
            <button
              type="button"
              className="rider-quick-card"
              onClick={() => navigate("/earnings")}
            >
              <div className="rider-quick-icon">
                💰
              </div>

              <div>
                <h3>Earnings</h3>

                <p>
                  View your earnings and performance
                </p>
              </div>

              <span className="rider-quick-arrow">
                →
              </span>
            </button>

            {/* Profile */}
            <button
              type="button"
              className="rider-quick-card"
              onClick={() => navigate("/profile")}
            >
              <div className="rider-quick-icon">
                👤
              </div>

              <div>
                <h3>Profile</h3>

                <p>
                  Manage your rider profile
                </p>
              </div>

              <span className="rider-quick-arrow">
                →
              </span>
            </button>

            {/* Balance & Payouts */}
            <button
              type="button"
              className="rider-quick-card"
              onClick={() => navigate("/earnings")}
            >
              <div className="rider-quick-icon">
                💳
              </div>

              <div>
                <h3>Balance & Payouts</h3>

                <p>
                  Check balance and payout history
                </p>
              </div>

              <span className="rider-quick-arrow">
                →
              </span>
            </button>

          </div>
        </section>

        {/* AVAILABILITY */}
        <section className="rider-dashboard-actions">
          <div className="rider-action-card">

            <div>
              <h2>Availability</h2>

              <p>
                {rider?.status === "ON_DELIVERY"
                  ? "You are currently delivering an order."
                  : rider?.status === "AVAILABLE"
                  ? "You are available for new deliveries."
                  : "You are currently offline."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleStatusChange}
              disabled={
                updatingStatus ||
                rider?.verificationStatus !==
                  "APPROVED" ||
                rider?.status === "ON_DELIVERY"
              }
              className={
                rider?.status === "AVAILABLE"
                  ? "availability-button offline-button"
                  : "availability-button online-button"
              }
            >
              {updatingStatus
                ? "Updating..."
                : rider?.status === "AVAILABLE"
                ? "Go Offline"
                : "Go Online"}
            </button>

          </div>
        </section>

        {/* RECENT DELIVERIES */}
        <section className="rider-dashboard-deliveries">

          <div className="rider-section-header">
            <div>
              <h2>Recent Deliveries</h2>

              <p>
                Your latest assigned deliveries
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/deliveries")
              }
            >
              View All
            </button>
          </div>

          {deliveries.length === 0 ? (
            <div className="rider-empty-card">

              <div className="rider-empty-icon">
                🚴
              </div>

              <h3>No deliveries yet</h3>

              <p>
                New delivery assignments will appear
                here.
              </p>

            </div>
          ) : (
            <div className="rider-delivery-list">

              {deliveries
                .slice(0, 5)
                .map((delivery) => (
                  <div
                    className="rider-delivery-card"
                    key={delivery.id}
                    onClick={() =>
                      navigate(
                        `/deliveries/${delivery.id}`
                      )
                    }
                  >

                    <div>
                      <span className="delivery-order-number">
                        {delivery.order?.orderNumber ||
                          "Order"}
                      </span>

                      <h3>
                        {delivery.order
                          ?.deliveryName ||
                          "Customer"}
                      </h3>

                      <p>
                        {delivery.order
                          ?.deliveryCity ||
                          "Delivery address"}
                      </p>
                    </div>

                    <div className="delivery-card-right">

                      <span
                        className={`delivery-status status-${String(
                          delivery.status || ""
                        ).toLowerCase()}`}
                      >
                        {String(
                          delivery.status ||
                            "UNKNOWN"
                        ).replaceAll(
                          "_",
                          " "
                        )}
                      </span>

                      <strong>
                        ₹
                        {Number(
                          delivery.riderEarning ||
                            0
                        ).toFixed(2)}
                      </strong>

                    </div>

                  </div>
                ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default Dashboard;