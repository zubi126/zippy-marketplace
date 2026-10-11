// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import "./Orders.css";

// function Orders() {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await api.get("/orders");

//       setOrders(response.data.orders || []);
//     } catch (error) {
//       console.error("Orders error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Unable to load your orders."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const getStatusClass = (status) => {
//     return status?.toLowerCase().replaceAll("_", "-") || "";
//   };

//   if (loading) {
//     return (
//       <main className="orders-message">
//         Loading your orders...
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="orders-message">
//         <h2>{error}</h2>

//         <button onClick={fetchOrders}>
//           Try Again
//         </button>
//       </main>
//     );
//   }

//   return (
//     <main className="orders-page">

//       <div className="orders-header">
//         <div>
//           <span>MYKASHO</span>
//           <h1>My Orders</h1>
//           <p>
//             View and track all your orders in one place.
//           </p>
//         </div>

//         <button
//           className="shop-more-button"
//           onClick={() => navigate("/products")}
//         >
//           Continue Shopping
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <section className="empty-orders">

//           <div className="empty-orders-icon">
//             📦
//           </div>

//           <h2>No orders yet</h2>

//           <p>
//             Your orders will appear here after you
//             place your first order.
//           </p>

//           <button
//             onClick={() => navigate("/products")}
//           >
//             Start Shopping
//           </button>

//         </section>
//       ) : (
//         <section className="orders-list">

//           {orders.map((order) => {

//             const items = order.items || [];

//             return (
//               <article
//                 className="order-card"
//                 key={order.id}
//               >

//                 {/* Order header */}

//                 <div className="order-card-header">

//                   <div>
//                     <small>ORDER NUMBER</small>

//                     <h2>
//                       {order.orderNumber || order.id}
//                     </h2>
//                   </div>

//                   <span
//                     className={`order-status ${getStatusClass(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>

//                 </div>

//                 {/* Shop */}

//                 {order.shop?.name && (
//                   <div className="order-shop">

//                     <span className="shop-icon">
//                       🏪
//                     </span>

//                     <div>
//                       <small>SHOP</small>

//                       <strong>
//                         {order.shop.name}
//                       </strong>
//                     </div>

//                   </div>
//                 )}

//                 {/* Items */}

//                 <div className="order-items">

//                   {items.slice(0, 3).map((item) => (
//                     <div
//                       className="order-item"
//                       key={item.id}
//                     >

//                       <div className="order-item-icon">
//                         📦
//                       </div>

//                       <div className="order-item-info">

//                         <strong>
//                           {item.productName}
//                         </strong>

//                         <span>
//                           ₹
//                           {Number(
//                             item.unitPrice
//                           ).toFixed(2)}
//                           {" × "}
//                           {item.quantity}
//                         </span>

//                       </div>

//                       <strong>
//                         ₹
//                         {Number(
//                           item.lineTotal
//                         ).toFixed(2)}
//                       </strong>

//                     </div>
//                   ))}

//                   {items.length > 3 && (
//                     <div className="more-items">
//                       +{items.length - 3} more item
//                       {items.length - 3 > 1
//                         ? "s"
//                         : ""}
//                     </div>
//                   )}

//                 </div>

//                 {/* Order footer */}

//                 <div className="order-card-footer">

//                   <div className="order-total">

//                     <span>Total</span>

//                     <strong>
//                       ₹
//                       {Number(
//                         order.total
//                       ).toFixed(2)}
//                     </strong>

//                   </div>

//                   <div className="order-payment">

//                     <span>
//                       {order.paymentMethod}
//                     </span>

//                     <small>
//                       Payment:{" "}
//                       {order.paymentStatus}
//                     </small>

//                   </div>

//                   <button
//                     className="view-order-button"
//                     onClick={() =>
//                       navigate(
//                         `/orders/${order.id}`
//                       )
//                     }
//                   >
//                     View Order →
//                   </button>

//                 </div>

//               </article>
//             );
//           })}

//         </section>
//       )}

//     </main>
//   );
// }


// export default Orders;

















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(
        response.data.orders ||
          response.data.data?.orders ||
          []
      );
    } catch (error) {
      console.error("Orders error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    return status?.toLowerCase().replaceAll("_", "-") || "";
  };

  if (loading) {
    return (
      <main className="orders-message">
        Loading your orders...
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-message">
        <h2>{error}</h2>

        <button onClick={fetchOrders}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="orders-header">
        <div>
          <span>MYKASHO</span>
          <h1>My Orders</h1>
          <p>
            View and track all your orders in one place.
          </p>
        </div>

        <button
          className="shop-more-button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <section className="empty-orders">

          <div className="empty-orders-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            Your orders will appear here after you
            place your first order.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>

        </section>
      ) : (
        <section className="orders-list">

          {orders.map((order) => {

            const items = order.items || [];

            return (
              <article
                className="order-card"
                key={order.id}
              >

                {/* Order header */}

                <div className="order-card-header">

                  <div>
                    <small>ORDER NUMBER</small>

                    <h2>
                      {order.orderNumber || order.id}
                    </h2>
                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Shop */}

                {order.shop?.name && (
                  <div className="order-shop">

                    <span className="shop-icon">
                      🏪
                    </span>

                    <div>
                      <small>SHOP</small>

                      <strong>
                        {order.shop.name}
                      </strong>
                    </div>

                  </div>
                )}

                {/* Items */}

                <div className="order-items">

                  {items.slice(0, 3).map((item) => (
                    <div
                      className="order-item"
                      key={item.id}
                    >

                      <div className="order-item-icon">
                        📦
                      </div>

                      <div className="order-item-info">

                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          ₹
                          {Number(
                            item.unitPrice
                          ).toFixed(2)}
                          {" × "}
                          {item.quantity}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {Number(
                          item.lineTotal
                        ).toFixed(2)}
                      </strong>

                    </div>
                  ))}

                  {items.length > 3 && (
                    <div className="more-items">
                      +{items.length - 3} more item
                      {items.length - 3 > 1
                        ? "s"
                        : ""}
                    </div>
                  )}

                </div>

                {/* Order footer */}

                <div className="order-card-footer">

                  <div className="order-total">

                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount ?? order.total ?? 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div className="order-payment">

                    <span>
                      {order.paymentMethod ||
                        order.payment?.provider ||
                        "Payment"}
                    </span>

                    <small>
                      Payment:{" "}
                      {order.paymentStatus ||
                        order.payment?.status ||
                        "PENDING"}
                    </small>

                  </div>

                  <button
                    className="view-order-button"
                    onClick={() =>
                      navigate(
                        `/orders/${order.id}`
                      )
                    }
                  >
                    View Order →
                  </button>

                </div>

              </article>
            );
          })}

        </section>
      )}

    </main>
  );
}

export default Orders;
