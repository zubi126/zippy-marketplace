// // import { useEffect, useState } from "react";
// // import api from "../services/api";
// // import "./SellerPayouts.css";

// // function SellerPayouts() {
// //   const [shops, setShops] = useState([]);
// //   const [pagination, setPagination] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const fetchSellerPayouts = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const response = await api.get(
// //         "/admin/payouts/sellers?page=1&limit=10"
// //       );

// //       if (response.data?.success) {
// //         setShops(response.data.shops || []);
// //         setPagination(response.data.pagination);
// //       } else {
// //         setError("Failed to load seller payouts");
// //       }
// //     } catch (err) {
// //       console.error(
// //         "Fetch seller payouts error:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //           "Failed to load seller payouts"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSellerPayouts();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="admin-page">
// //         <div className="admin-page-header">
// //           <div>
// //             <h1>Seller Payouts</h1>
// //             <p>
// //               Manage seller balances and payouts
// //             </p>
// //           </div>
// //         </div>

// //         <div className="seller-payouts-loading">
// //           Loading seller payouts...
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="admin-page">
// //         <div className="admin-page-header">
// //           <div>
// //             <h1>Seller Payouts</h1>
// //             <p>
// //               Manage seller balances and payouts
// //             </p>
// //           </div>
// //         </div>

// //         <div className="seller-payouts-error">
// //           <p>{error}</p>

// //           <button onClick={fetchSellerPayouts}>
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="admin-page">

// //       <div className="admin-page-header">
// //         <div>
// //           <h1>Seller Payouts</h1>
// //           <p>
// //             Manage seller balances and payouts
// //           </p>
// //         </div>

// //         <button
// //           className="seller-payouts-refresh-btn"
// //           onClick={fetchSellerPayouts}
// //         >
// //           Refresh
// //         </button>
// //       </div>

// //       <div className="seller-payouts-table-container">

// //         <table className="seller-payouts-table">

// //           <thead>
// //             <tr>
// //               <th>Shop</th>
// //               <th>Phone</th>
// //               <th>Status</th>
// //               <th>Total Earned</th>
// //               <th>Paid Out</th>
// //               <th>Pending</th>
// //               <th>Payouts</th>
// //             </tr>
// //           </thead>

// //           <tbody>

// //             {shops.length === 0 ? (
// //               <tr>
// //                 <td
// //                   colSpan="7"
// //                   className="seller-payouts-empty"
// //                 >
// //                   No seller payouts found.
// //                 </td>
// //               </tr>
// //             ) : (
// //               shops.map((shop) => (
// //                 <tr key={shop.shopId}>

// //                   <td>
// //                     <div className="seller-shop-name">
// //                       {shop.shop?.name || "N/A"}
// //                     </div>

// //                     <div className="seller-shop-slug">
// //                       {shop.shop?.slug || ""}
// //                     </div>
// //                   </td>

// //                   <td>
// //                     {shop.shop?.phone || "N/A"}
// //                   </td>

// //                   <td>
// //                     <span
// //                       className={`seller-status ${
// //                         shop.verificationStatus?.toLowerCase()
// //                       }`}
// //                     >
// //                       {shop.verificationStatus}
// //                     </span>
// //                   </td>

// //                   <td>
// //                     ₹
// //                     {Number(
// //                       shop.balance?.totalEarned || 0
// //                     ).toFixed(2)}
// //                   </td>

// //                   <td>
// //                     ₹
// //                     {Number(
// //                       shop.balance?.totalPaidOut || 0
// //                     ).toFixed(2)}
// //                   </td>

// //                   <td>
// //                     <strong>
// //                       ₹
// //                       {Number(
// //                         shop.balance?.pendingBalance || 0
// //                       ).toFixed(2)}
// //                     </strong>
// //                   </td>

// //                   <td>
// //                     {shop.payouts?.length || 0}
// //                   </td>

// //                 </tr>
// //               ))
// //             )}

// //           </tbody>

// //         </table>

// //       </div>

// //       {pagination && (
// //         <div className="seller-payouts-pagination">
// //           Showing {shops.length} of{" "}
// //           {pagination.total} sellers
// //         </div>
// //       )}

// //     </div>
// //   );
// // }

// // export default SellerPayouts;


























// import { useEffect, useState } from "react";
// import api from "../services/api";
// import "./SellerPayouts.css";

// function SellerPayouts() {
//   const [shops, setShops] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("ALL");

//   const fetchSellerPayouts = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: "1",
//         limit: "10",
//       });

//       if (search.trim()) {
//         params.append("search", search.trim());
//       }

//       if (status !== "ALL") {
//         params.append("status", status);
//       }

//       const response = await api.get(
//         `/admin/payouts/sellers?${params.toString()}`
//       );

//       if (response.data?.success) {
//         setShops(response.data.shops || []);
//         setPagination(response.data.pagination);
//       } else {
//         setError("Failed to load seller payouts");
//       }
//     } catch (err) {
//       console.error(
//         "Fetch seller payouts error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//           "Failed to load seller payouts"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSellerPayouts();
//   }, [status]);

//   if (loading) {
//     return (
//       <div className="admin-page">
//         <div className="admin-page-header">
//           <div>
//             <h1>Seller Payouts</h1>
//             <p>
//               Manage seller balances and payouts
//             </p>
//           </div>
//         </div>

//         <div className="seller-payouts-loading">
//           Loading seller payouts...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="admin-page">
//         <div className="admin-page-header">
//           <div>
//             <h1>Seller Payouts</h1>
//             <p>
//               Manage seller balances and payouts
//             </p>
//           </div>
//         </div>

//         <div className="seller-payouts-error">
//           <p>{error}</p>

//           <button onClick={fetchSellerPayouts}>
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
//           <h1>Seller Payouts</h1>
//           <p>
//             Manage seller balances and payouts
//           </p>
//         </div>

//         <button
//           className="seller-payouts-refresh-btn"
//           onClick={fetchSellerPayouts}
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="seller-payouts-filters">

//         <input
//           type="text"
//           placeholder="Search seller or shop..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//         />

//         <select
//           value={status}
//           onChange={(e) =>
//             setStatus(e.target.value)
//           }
//         >
//           <option value="ALL">All Payouts</option>
//           <option value="PAID">Paid</option>
//           <option value="PROCESSING">
//             Processing
//           </option>
//           <option value="PENDING">Pending</option>
//           <option value="FAILED">Failed</option>
//         </select>

//         <button
//           className="seller-payouts-filter-btn"
//           onClick={fetchSellerPayouts}
//         >
//           Apply
//         </button>

//       </div>

//       <div className="seller-payouts-table-container">

//         <table className="seller-payouts-table">

//           <thead>
//             <tr>
//               <th>Shop</th>
//               <th>Phone</th>
//               <th>Status</th>
//               <th>Total Earned</th>
//               <th>Paid Out</th>
//               <th>Pending</th>
//               <th>Payouts</th>
//             </tr>
//           </thead>

//           <tbody>

//             {shops.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="seller-payouts-empty"
//                 >
//                   No seller payouts found.
//                 </td>
//               </tr>
//             ) : (
//               shops.map((shop) => (
//                 <tr key={shop.shopId}>

//                   <td>
//                     <div className="seller-shop-name">
//                       {shop.shop?.name || "N/A"}
//                     </div>

//                     <div className="seller-shop-slug">
//                       {shop.shop?.slug || ""}
//                     </div>
//                   </td>

//                   <td>
//                     {shop.shop?.phone || "N/A"}
//                   </td>

//                   <td>
//                     <span
//                       className={`seller-status ${
//                         shop.verificationStatus?.toLowerCase()
//                       }`}
//                     >
//                       {shop.verificationStatus}
//                     </span>
//                   </td>

//                   <td>
//                     ₹
//                     {Number(
//                       shop.balance?.totalEarned || 0
//                     ).toFixed(2)}
//                   </td>

//                   <td>
//                     ₹
//                     {Number(
//                       shop.balance?.totalPaidOut || 0
//                     ).toFixed(2)}
//                   </td>

//                   <td>
//                     <strong>
//                       ₹
//                       {Number(
//                         shop.balance?.pendingBalance || 0
//                       ).toFixed(2)}
//                     </strong>
//                   </td>

//                   <td>
//                     {shop.payouts?.length || 0}
//                   </td>

//                 </tr>
//               ))
//             )}

//           </tbody>

//         </table>

//       </div>

//       {pagination && (
//         <div className="seller-payouts-pagination">
//           Showing {shops.length} of{" "}
//           {pagination.total} sellers
//         </div>
//       )}

//     </div>
//   );
// }

// export default SellerPayouts;















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SellerPayouts.css";

function SellerPayouts() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellerPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/payouts/sellers?page=1&limit=10"
      );

      if (response.data?.success) {
        setShops(response.data.shops || []);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to load seller payouts");
      }
    } catch (err) {
      console.error(
        "Fetch seller payouts error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load seller payouts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerPayouts();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Seller Payouts</h1>
            <p>
              Manage seller balances and payouts
            </p>
          </div>
        </div>

        <div className="seller-payouts-loading">
          Loading seller payouts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Seller Payouts</h1>
            <p>
              Manage seller balances and payouts
            </p>
          </div>
        </div>

        <div className="seller-payouts-error">
          <p>{error}</p>

          <button onClick={fetchSellerPayouts}>
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
    <h1>Seller Payouts</h1>
    <p>
      Manage seller balances and payouts
    </p>
  </div>

  <div className="seller-payouts-header-actions">
    <button
      type="button"
      className="seller-payouts-create-btn"
      onClick={() => navigate("/create-seller-payout")}
    >
      + Create Seller Payout
    </button>

    <button
      type="button"
      className="seller-payouts-refresh-btn"
      onClick={fetchSellerPayouts}
    >
      Refresh
    </button>
  </div>
</div>


      <div className="seller-payouts-table-container">

        <table className="seller-payouts-table">

          <thead>
            <tr>
              <th>Shop</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Total Earned</th>
              <th>Paid Out</th>
              <th>Pending</th>
              <th>Payouts</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {shops.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="seller-payouts-empty"
                >
                  No seller payouts found.
                </td>
              </tr>
            ) : (
              shops.map((shop) => (
                <tr key={shop.shopId}>

                  <td>
                    <div className="seller-shop-name">
                      {shop.shop?.name || "N/A"}
                    </div>

                    <div className="seller-shop-slug">
                      {shop.shop?.slug || ""}
                    </div>
                  </td>

                  <td>
                    {shop.shop?.phone || "N/A"}
                  </td>

                  <td>
                    <span
                      className={`seller-status ${
                        shop.verificationStatus?.toLowerCase()
                      }`}
                    >
                      {shop.verificationStatus}
                    </span>
                  </td>

                  <td>
                    ₹
                    {Number(
                      shop.balance?.totalEarned || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    ₹
                    {Number(
                      shop.balance?.totalPaidOut || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    <strong>
                      ₹
                      {Number(
                        shop.balance?.pendingBalance || 0
                      ).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    {shop.payouts?.length || 0}
                  </td>

                  <td>
                    <button
                      className="seller-payouts-view-btn"
                      onClick={() =>
                        navigate(
                          `/seller-payouts/${shop.shopId}`
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
        <div className="seller-payouts-pagination">
          Showing {shops.length} of{" "}
          {pagination.total} sellers
        </div>
      )}

    </div>
  );
}

export default SellerPayouts;