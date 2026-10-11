// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import "./RiderPayouts.css";

// function RiderPayouts() {

//   const navigate = useNavigate();

//   const [riders, setRiders] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchRiderPayouts = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await api.get(
//         "/admin/payouts/riders?page=1&limit=10"
//       );

//       if (response.data?.success) {
//         setRiders(response.data.riders || []);
//         setPagination(response.data.pagination);
//       } else {
//         setError("Failed to load rider payouts");
//       }
//     } catch (err) {
//       console.error("Fetch rider payouts error:", err);

//       setError(
//         err.response?.data?.message ||
//           "Failed to load rider payouts"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRiderPayouts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="admin-page">
//         <div className="admin-page-header">
//           <div>
//             <h1>Rider Payouts</h1>
//             <p>Manage rider balances and payouts</p>
//           </div>
//         </div>

//         <div className="rider-payouts-loading">
//           Loading rider payouts...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="admin-page">
//         <div className="admin-page-header">
//           <div>
//             <h1>Rider Payouts</h1>
//             <p>Manage rider balances and payouts</p>
//           </div>
//         </div>

//         <div className="rider-payouts-error">
//           <p>{error}</p>

//           <button onClick={fetchRiderPayouts}>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-page">
//       <div className="admin-page-header">
//         <div>
//           <h1>Rider Payouts</h1>
//           <p>Manage rider balances and payouts</p>
//         </div>

//         <button
//           className="rider-payouts-refresh-btn"
//           onClick={fetchRiderPayouts}
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="rider-payouts-table-container">
//         <table className="rider-payouts-table">
//           <thead>
//             <tr>
//               <th>Rider</th>
//               <th>Phone</th>
//               <th>Status</th>
//               <th>Verification</th>
//               <th>Total Earned</th>
//               <th>Paid Out</th>
//               <th>Pending</th>
//               <th>Payouts</th>
//             </tr>
//           </thead>

//           <tbody>
//             {riders.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="rider-payouts-empty"
//                 >
//                   No rider payouts found.
//                 </td>
//               </tr>
//             ) : (
//               riders.map((rider) => (
//                 <tr key={rider.riderId}>
//                   <td>
//                     <div className="rider-name">
//                       {rider.rider?.name || "N/A"}
//                     </div>

//                     <div className="rider-email">
//                       {rider.rider?.email || ""}
//                     </div>
//                   </td>

//                   <td>
//                     {rider.rider?.phone || "N/A"}
//                   </td>

//                   <td>
//                     <span
//                       className={`rider-status ${rider.riderStatus?.toLowerCase()}`}
//                     >
//                       {rider.riderStatus}
//                     </span>
//                   </td>

//                   <td>
//                     <span
//                       className={`rider-verification ${rider.verificationStatus?.toLowerCase()}`}
//                     >
//                       {rider.verificationStatus}
//                     </span>
//                   </td>

//                   <td>
//                     ₹
//                     {Number(
//                       rider.balance?.totalEarned || 0
//                     ).toFixed(2)}
//                   </td>

//                   <td>
//                     ₹
//                     {Number(
//                       rider.balance?.totalPaidOut || 0
//                     ).toFixed(2)}
//                   </td>

//                   <td>
//                     <strong>
//                       ₹
//                       {Number(
//                         rider.balance?.pendingBalance || 0
//                       ).toFixed(2)}
//                     </strong>
//                   </td>

//                   <td>
//                     {rider.payouts?.length || 0}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {pagination && (
//         <div className="rider-payouts-pagination">
//           Showing {riders.length} of{" "}
//           {pagination.total} riders
//         </div>
//       )}
//     </div>
//   );
// }

// export default RiderPayouts;
















import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./RiderPayouts.css";

function RiderPayouts() {

  const navigate = useNavigate();

  const [riders, setRiders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRiderPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/payouts/riders?page=1&limit=10"
      );

      if (response.data?.success) {
        setRiders(response.data.riders || []);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to load rider payouts");
      }
    } catch (err) {
      console.error("Fetch rider payouts error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load rider payouts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderPayouts();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Rider Payouts</h1>
            <p>Manage rider balances and payouts</p>
          </div>
        </div>

        <div className="rider-payouts-loading">
          Loading rider payouts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Rider Payouts</h1>
            <p>Manage rider balances and payouts</p>
          </div>
        </div>

        <div className="rider-payouts-error">
          <p>{error}</p>

          <button onClick={fetchRiderPayouts}>
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
          <h1>Rider Payouts</h1>
          <p>Manage rider balances and payouts</p>
        </div>

       
<div className="rider-payouts-header-actions">
  <button
    type="button"
    className="rider-payouts-create-btn"
    onClick={() => navigate("/create-rider-payout")}
  >
    + Create Rider Payout
  </button>

  <button
    type="button"
    className="rider-payouts-refresh-btn"
    onClick={fetchRiderPayouts}
  >
    Refresh
  </button>
</div>

      </div>

      <div className="rider-payouts-table-container">
        <table className="rider-payouts-table">
          <thead>
            <tr>
              <th>Rider</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Verification</th>
              <th>Total Earned</th>
              <th>Paid Out</th>
              <th>Pending</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {riders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="rider-payouts-empty"
                >
                  No rider payouts found.
                </td>
              </tr>
            ) : (
              riders.map((rider) => (
                <tr key={rider.riderId}>
                  <td>
                    <div className="rider-name">
                      {rider.rider?.name || "N/A"}
                    </div>

                    <div className="rider-email">
                      {rider.rider?.email || ""}
                    </div>
                  </td>

                  <td>
                    {rider.rider?.phone || "N/A"}
                  </td>

                  <td>
                    <span
                      className={`rider-status ${rider.riderStatus?.toLowerCase()}`}
                    >
                      {rider.riderStatus}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`rider-verification ${rider.verificationStatus?.toLowerCase()}`}
                    >
                      {rider.verificationStatus}
                    </span>
                  </td>

                  <td>
                    ₹
                    {Number(
                      rider.balance?.totalEarned || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    ₹
                    {Number(
                      rider.balance?.totalPaidOut || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    <strong>
                      ₹
                      {Number(
                        rider.balance?.pendingBalance || 0
                      ).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    <button
                      className="rider-payouts-view-btn"
                      onClick={() =>
                        navigate(
                          `/rider-payouts/${rider.riderId}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="rider-payouts-pagination">
          Showing {riders.length} of{" "}
          {pagination.total} riders
        </div>
      )}
    </div>
  );
}

export default RiderPayouts;