// import { useEffect, useState } from "react";
// import api from "../services/api";
// import "./Earnings.css";

// function Earnings() {
//   const [balance, setBalance] = useState(null);
//   const [weekly, setWeekly] = useState(null);
//   const [monthly, setMonthly] = useState(null);
//   const [payouts, setPayouts] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchEarnings = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const [
//         balanceResponse,
//         weeklyResponse,
//         monthlyResponse,
//         payoutsResponse,
//       ] = await Promise.all([
//         api.get("/riders/earnings/balance"),
//         api.get("/riders/earnings/weekly"),
//         api.get("/riders/earnings/monthly"),
//         api.get("/riders/earnings/payouts"),
//       ]);

//       setBalance(
//         balanceResponse.data?.balance || null
//       );

//       setWeekly(
//         weeklyResponse.data || null
//       );

//       setMonthly(
//         monthlyResponse.data || null
//       );

//       setPayouts(
//         payoutsResponse.data?.payouts || []
//       );
//     } catch (error) {
//       console.error(
//         "Failed to load earnings:",
//         error
//       );

//       setError(
//         error.response?.data?.message ||
//           "Unable to load earnings."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEarnings();
//   }, []);

//   const formatAmount = (amount) => {
//     return `₹${Number(amount || 0).toFixed(2)}`;
//   };

//   const formatDate = (date) => {
//     if (!date) return "—";

//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   if (loading) {
//     return (
//       <main className="rider-earnings-page">
//         <div className="rider-earnings-loading">
//           Loading earnings...
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="rider-earnings-page">
//       <div className="rider-earnings-container">
//         <div className="rider-earnings-header">
//           <div>
//             <h1>Earnings</h1>

//             <p>
//               Track your delivery earnings and payouts.
//             </p>
//           </div>

//           <button
//             type="button"
//             className="rider-earnings-refresh"
//             onClick={fetchEarnings}
//           >
//             Refresh
//           </button>
//         </div>

//         {error && (
//           <div className="rider-earnings-error">
//             {error}
//           </div>
//         )}

//         <section className="rider-earnings-stats">
//           <div className="rider-earnings-stat-card">
//             <span>Total Earned</span>

//             <strong>
//               {formatAmount(
//                 balance?.totalEarned
//               )}
//             </strong>
//           </div>

//           <div className="rider-earnings-stat-card">
//             <span>Total Paid Out</span>

//             <strong>
//               {formatAmount(
//                 balance?.totalPaidOut
//               )}
//             </strong>
//           </div>

//           <div className="rider-earnings-stat-card">
//             <span>Pending Balance</span>

//             <strong>
//               {formatAmount(
//                 balance?.pendingBalance
//               )}
//             </strong>
//           </div>
//         </section>

//         <section className="rider-period-grid">
//           <div className="rider-period-card">
//             <div className="rider-period-card-header">
//               <div>
//                 <h2>This Week</h2>
//                 <p>
//                   Your weekly delivery earnings
//                 </p>
//               </div>
//             </div>

//             <div className="rider-period-amount">
//               {formatAmount(
//                 weekly?.totalEarnings ??
//                   weekly?.totalEarned ??
//                   weekly?.earnings
//               )}
//             </div>

//             <div className="rider-period-info">
//               <span>
//                 Deliveries
//               </span>

//               <strong>
//                 {weekly?.totalDeliveries ??
//                   weekly?.deliveryCount ??
//                   weekly?.count ??
//                   0}
//               </strong>
//             </div>
//           </div>

//           <div className="rider-period-card">
//             <div className="rider-period-card-header">
//               <div>
//                 <h2>This Month</h2>
//                 <p>
//                   Your monthly delivery earnings
//                 </p>
//               </div>
//             </div>

//             <div className="rider-period-amount">
//               {formatAmount(
//                 monthly?.totalEarnings ??
//                   monthly?.totalEarned ??
//                   monthly?.earnings
//               )}
//             </div>

//             <div className="rider-period-info">
//               <span>
//                 Deliveries
//               </span>

//               <strong>
//                 {monthly?.totalDeliveries ??
//                   monthly?.deliveryCount ??
//                   monthly?.count ??
//                   0}
//               </strong>
//             </div>
//           </div>
//         </section>

//         <section className="rider-payouts-section">
//           <div className="rider-payouts-header">
//             <div>
//               <h2>Payout History</h2>

//               <p>
//                 Your recent rider payouts.
//               </p>
//             </div>
//           </div>

//           {payouts.length === 0 ? (
//             <div className="rider-payouts-empty">
//               <div className="rider-payouts-empty-icon">
//                 💰
//               </div>

//               <h3>
//                 No payouts yet
//               </h3>

//               <p>
//                 Your payout history will appear here.
//               </p>
//             </div>
//           ) : (
//             <div className="rider-payouts-list">
//               {payouts.map((payout) => (
//                 <div
//                   className="rider-payout-item"
//                   key={
//                     payout.id ||
//                     `${payout.createdAt}-${payout.amount}`
//                   }
//                 >
//                   <div className="rider-payout-main">
//                     <strong>
//                       {formatAmount(
//                         payout.amount
//                       )}
//                     </strong>

//                     <span>
//                       {formatDate(
//                         payout.paidAt ||
//                           payout.createdAt
//                       )}
//                     </span>
//                   </div>

//                   <div className="rider-payout-right">
//                     <span
//                       className={`rider-payout-status ${String(
//                         payout.status ||
//                           "PENDING"
//                       ).toLowerCase()}`}
//                     >
//                       {String(
//                         payout.status ||
//                           "PENDING"
//                       )
//                         .replaceAll("_", " ")
//                         .toLowerCase()
//                         .replace(
//                           /\b\w/g,
//                           (char) =>
//                             char.toUpperCase()
//                         )}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }

// export default Earnings;








import { useEffect, useState } from "react";
import api from "../services/api";
import "./Earnings.css";

function Earnings() {
  const [balance, setBalance] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [payouts, setPayouts] = useState([]);

  const [filterType, setFilterType] = useState("week");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [filteredEarnings, setFilteredEarnings] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] =
    useState(false);

  const [error, setError] = useState("");

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        balanceResponse,
        weeklyResponse,
        monthlyResponse,
        payoutsResponse,
      ] = await Promise.all([
        api.get("/riders/earnings/balance"),
        api.get("/riders/earnings/weekly"),
        api.get("/riders/earnings/monthly"),
        api.get("/riders/earnings/payouts"),
      ]);

      setBalance(
        balanceResponse.data?.balance || null
      );

      setWeekly(
        weeklyResponse.data || null
      );

      setMonthly(
        monthlyResponse.data || null
      );

      setPayouts(
        payoutsResponse.data?.payouts || []
      );

      // Default filter = current week
      setFilteredEarnings({
        type: "week",
        totalEarnings:
          weeklyResponse.data?.summary
            ?.totalEarnings || 0,
        totalDeliveries:
          weeklyResponse.data?.summary
            ?.totalDeliveries || 0,
        earnings:
          weeklyResponse.data?.earnings || [],
        period:
          weeklyResponse.data?.period || null,
      });
    } catch (error) {
      console.error(
        "Failed to load earnings:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load earnings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      return "₹0.00";
    }

    return `₹${numericAmount.toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const applyWeekFilter = () => {
    setFilterType("week");

    setFilteredEarnings({
      type: "week",
      totalEarnings:
        weekly?.summary?.totalEarnings || 0,
      totalDeliveries:
        weekly?.summary?.totalDeliveries || 0,
      earnings:
        weekly?.earnings || [],
      period:
        weekly?.period || null,
    });
  };

  const applyMonthFilter = () => {
    setFilterType("month");

    setFilteredEarnings({
      type: "month",
      totalEarnings:
        monthly?.summary?.totalEarnings || 0,
      totalDeliveries:
        monthly?.summary?.totalDeliveries || 0,
      earnings:
        monthly?.earnings || [],
      period:
        monthly?.period || null,
    });
  };

  const applyCustomFilter = async () => {
    if (!startDate || !endDate) {
      setError(
        "Please select both start date and end date."
      );
      return;
    }

    if (startDate > endDate) {
      setError(
        "Start date cannot be after end date."
      );
      return;
    }

    try {
      setFilterLoading(true);
      setError("");
      setFilterType("custom");

      const response = await api.get(
        "/riders/earnings",
        {
          params: {
            startDate,
            endDate,
          },
        }
      );

      setFilteredEarnings({
        type: "custom",
        totalEarnings:
          response.data?.summary?.totalEarnings || 0,
        totalDeliveries:
          response.data?.summary?.totalDeliveries || 0,
        earnings:
          response.data?.earnings || [],
        period:
          response.data?.period || null,
      });
    } catch (error) {
      console.error(
        "Failed to load custom earnings:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load earnings for selected dates."
      );
    } finally {
      setFilterLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="rider-earnings-page">
        <div className="rider-earnings-loading">
          Loading earnings...
        </div>
      </main>
    );
  }

  return (
    <main className="rider-earnings-page">
      <div className="rider-earnings-container">

        {/* HEADER */}
        <div className="rider-earnings-header">
          <div>
            <h1>Earnings</h1>

            <p>
              Track your delivery earnings and payouts.
            </p>
          </div>

          <button
            type="button"
            className="rider-earnings-refresh"
            onClick={fetchEarnings}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="rider-earnings-error">
            {error}
          </div>
        )}

        {/* BALANCE */}
        <section className="rider-earnings-stats">

          <div className="rider-earnings-stat-card">
            <span>Total Earned</span>

            <strong>
              {formatAmount(
                balance?.totalEarned
              )}
            </strong>
          </div>

          <div className="rider-earnings-stat-card">
            <span>Total Paid Out</span>

            <strong>
              {formatAmount(
                balance?.totalPaidOut
              )}
            </strong>
          </div>

          <div className="rider-earnings-stat-card">
            <span>Pending Balance</span>

            <strong>
              {formatAmount(
                balance?.pendingBalance
              )}
            </strong>
          </div>

        </section>

        {/* WEEK / MONTH */}
        <section className="rider-period-grid">

          <div className="rider-period-card">
            <div className="rider-period-card-header">
              <h2>This Week</h2>

              <p>
                Your weekly delivery earnings
              </p>
            </div>

            <div className="rider-period-amount">
              {formatAmount(
                weekly?.summary?.totalEarnings
              )}
            </div>

            <div className="rider-period-info">
              <span>Deliveries</span>

              <strong>
                {weekly?.summary?.totalDeliveries ||
                  0}
              </strong>
            </div>
          </div>

          <div className="rider-period-card">
            <div className="rider-period-card-header">
              <h2>This Month</h2>

              <p>
                Your monthly delivery earnings
              </p>
            </div>

            <div className="rider-period-amount">
              {formatAmount(
                monthly?.summary?.totalEarnings
              )}
            </div>

            <div className="rider-period-info">
              <span>Deliveries</span>

              <strong>
                {monthly?.summary?.totalDeliveries ||
                  0}
              </strong>
            </div>
          </div>

        </section>

        {/* EARNINGS FILTER */}
        <section className="rider-earnings-filter">

          <div className="rider-filter-header">
            <div>
              <h2>Earnings Filter</h2>

              <p>
                Check your earnings for a specific
                period.
              </p>
            </div>
          </div>

          <div className="rider-filter-buttons">

            <button
              type="button"
              className={
                filterType === "week"
                  ? "active"
                  : ""
              }
              onClick={applyWeekFilter}
            >
              This Week
            </button>

            <button
              type="button"
              className={
                filterType === "month"
                  ? "active"
                  : ""
              }
              onClick={applyMonthFilter}
            >
              This Month
            </button>

            <button
              type="button"
              className={
                filterType === "custom"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilterType("custom")
              }
            >
              Custom Dates
            </button>

          </div>

          {filterType === "custom" && (
            <div className="rider-custom-date-form">

              <div className="rider-date-field">
                <label htmlFor="startDate">
                  From
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>

              <div className="rider-date-field">
                <label htmlFor="endDate">
                  To
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="rider-apply-filter"
                onClick={applyCustomFilter}
                disabled={filterLoading}
              >
                {filterLoading
                  ? "Loading..."
                  : "Apply Filter"}
              </button>

            </div>
          )}

        </section>

        {/* FILTER RESULT */}
        {filteredEarnings && (
          <section className="rider-filter-result">

            <div className="rider-filter-result-header">
              <div>
                <h2>
                  {filteredEarnings.type === "week"
                    ? "This Week"
                    : filteredEarnings.type ===
                      "month"
                    ? "This Month"
                    : "Custom Date Range"}
                </h2>

                {filteredEarnings.period && (
                  <p>
                    {formatDate(
                      filteredEarnings.period.start
                    )}{" "}
                    —{" "}
                    {formatDate(
                      filteredEarnings.period.end
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="rider-filter-summary">

              <div>
                <span>Total Earnings</span>

                <strong>
                  {formatAmount(
                    filteredEarnings.totalEarnings
                  )}
                </strong>
              </div>

              <div>
                <span>Deliveries</span>

                <strong>
                  {
                    filteredEarnings.totalDeliveries
                  }
                </strong>
              </div>

            </div>

            {filteredEarnings.earnings.length > 0 ? (
              <div className="rider-earning-list">

                {filteredEarnings.earnings.map(
                  (earning) => (
                    <div
                      className="rider-earning-item"
                      key={earning.id}
                    >
                      <div>
                        <strong>
                          {formatAmount(
                            earning.amount
                          )}
                        </strong>

                        <p>
                          {earning.description ||
                            "Delivery earning"}
                        </p>
                      </div>

                      <div>
                        <span>
                          {formatDate(
                            earning.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="rider-no-earnings">
                No earnings for this period.
              </div>
            )}

          </section>
        )}

        {/* PAYOUT HISTORY */}
        <section className="rider-payouts-section">

          <div className="rider-payouts-header">
            <div>
              <h2>Payout History</h2>

              <p>
                Your recent rider payouts.
              </p>
            </div>
          </div>

          {payouts.length === 0 ? (
            <div className="rider-payouts-empty">

              <div className="rider-payouts-empty-icon">
                💰
              </div>

              <h3>
                No payouts yet
              </h3>

              <p>
                Your payout history will appear here.
              </p>

            </div>
          ) : (
            <div className="rider-payouts-list">

              {payouts.map((payout) => (
                <div
                  className="rider-payout-item"
                  key={
                    payout.id ||
                    `${payout.createdAt}-${payout.amount}`
                  }
                >

                  <div className="rider-payout-main">
                    <strong>
                      {formatAmount(
                        payout.amount
                      )}
                    </strong>

                    <span>
                      {formatDate(
                        payout.paidAt ||
                          payout.createdAt
                      )}
                    </span>
                  </div>

                  <div className="rider-payout-right">

                    <span
                      className={`rider-payout-status ${String(
                        payout.status ||
                          "PENDING"
                      ).toLowerCase()}`}
                    >
                      {String(
                        payout.status ||
                          "PENDING"
                      )
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase()
                        )}
                    </span>

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

export default Earnings;