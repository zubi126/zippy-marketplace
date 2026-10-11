// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../services/api";
// import "./OrderSuccess.css";

// function OrderSuccess() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await api.get(`/orders/${orderId}`);

//         setOrder(
//           response.data.order ||
//             response.data.data ||
//             response.data
//         );
//       } catch (error) {
//         console.error("Order fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   if (loading) {
//     return (
//       <main className="order-success-message">
//         Loading order...
//       </main>
//     );
//   }

//   if (!order) {
//     return (
//       <main className="order-success-message">
//         <h2>Order not found</h2>

//         <button onClick={() => navigate("/products")}>
//           Continue Shopping
//         </button>
//       </main>
//     );
//   }

//   return (
//     <main className="order-success-page">
//       <section className="order-success-card">

//         <div className="success-icon">
//           ✓
//         </div>

//         <span className="success-label">
//           MYKASHO
//         </span>

//         <h1>Order Placed Successfully!</h1>

//         <p className="success-description">
//           Thank you for shopping with MyKasho.
//           Your order has been received.
//         </p>

//         <div className="order-number">
//           <span>Order Number</span>
//           <strong>
//             {order.orderNumber || order.id}
//           </strong>
//         </div>

//         <div className="order-info">

//           <div className="info-row">
//             <span>Payment Method</span>
//             <strong>
//               {order.paymentMethod || "COD"}
//             </strong>
//           </div>

//           <div className="info-row">
//             <span>Order Status</span>
//             <strong>
//               {order.status || "PENDING"}
//             </strong>
//           </div>

//           <div className="info-row">
//             <span>Total Amount</span>
//             <strong>
//               ₹{Number(order.totalAmount || order.total || 0).toFixed(2)}
//             </strong>
//           </div>

//         </div>

//         {order.address && (
//           <div className="delivery-address">
//             <small>DELIVERY ADDRESS</small>

//             <strong>
//               {order.address.fullAddress}
//             </strong>

//             <span>
//               {order.address.city}
//               {order.address.pincode
//                 ? ` - ${order.address.pincode}`
//                 : ""}
//             </span>
//           </div>
//         )}

//         <div className="success-actions">

//           <button
//             className="track-order-button"
//             onClick={() =>
//               navigate(`/orders/${order.id}`)
//             }
//           >
//             Track Order
//           </button>

//           <button
//             className="continue-shopping-button"
//             onClick={() => navigate("/products")}
//           >
//             Continue Shopping
//           </button>

//         </div>

//       </section>
//     </main>
//   );
// }

// export default OrderSuccess;








import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import api from "../services/api";
import "./OrderSuccess.css";

function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const checkoutPaymentId = searchParams.get("checkoutPaymentId");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      setLoading(true);

      try {
        // Always fetch the primary order first.
        const response = await api.get(`/orders/${orderId}`);

        const primaryOrder =
          response.data.order ||
          response.data.data ||
          response.data;

        if (!primaryOrder?.id) {
          throw new Error("Order was not returned by the server.");
        }

        let checkoutOrders = [primaryOrder];

        // When a shared checkout ID exists, find every order
        // belonging to that checkout, not all customer orders.
        if (checkoutPaymentId) {
          const ordersResponse = await api.get("/orders");

          const customerOrders =
            ordersResponse.data.orders ||
            ordersResponse.data.data ||
            [];

          const matchingOrders = customerOrders.filter(
            (item) =>
              item.checkoutPaymentId === checkoutPaymentId
          );

          if (matchingOrders.some((item) => item.id === primaryOrder.id)) {
            checkoutOrders = matchingOrders;
          }
        }

        if (active) {
          setOrders(checkoutOrders);
        }
      } catch (error) {
        console.error("Order fetch error:", error);

        // Don't show an incomplete or unrelated checkout.
        if (active) {
          setOrders([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, [orderId, checkoutPaymentId]);

  if (loading) {
    return (
      <main className="order-success-message">
        Loading order...
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="order-success-message">
        <h2>Order not found</h2>

        <button onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </main>
    );
  }

  const firstOrder = orders[0];

  const combinedTotal = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount ?? order.total ?? 0),
    0
  );

  const paymentMethod = firstOrder.paymentMethod || "COD";

  const deliveryAddress = [
    firstOrder.deliveryFullAddress ||
      firstOrder.address?.fullAddress,
    firstOrder.deliveryCity || firstOrder.address?.city,
    firstOrder.deliveryPincode || firstOrder.address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="order-success-page">
      <section className="order-success-card">
        <div className="success-icon">✓</div>

        <span className="success-label">MYKASHO</span>

        <h1>Order Placed Successfully!</h1>

        <p className="success-description">
          Thank you for shopping with MyKasho.
          Your order has been received.
        </p>

        <div className="order-number">
          <span>
            {orders.length > 1
              ? "Checkout Orders"
              : "Order Number"}
          </span>

          <strong>
            {orders.length > 1
              ? `${orders.length} shop orders`
              : firstOrder.orderNumber || firstOrder.id}
          </strong>
        </div>

        <div className="order-info">
          <div className="info-row">
            <span>Payment Method</span>
            <strong>{paymentMethod}</strong>
          </div>

          <div className="info-row">
            <span>Shop Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="info-row">
            <span>Combined Total</span>
            <strong>₹{combinedTotal.toFixed(2)}</strong>
          </div>
        </div>

        {orders.map((order, index) => (
          <section
            className="order-info"
            key={order.id}
            style={{ marginTop: "20px", textAlign: "left" }}
          >
            <h3>
              {order.shop?.name || `Shop ${index + 1}`}
            </h3>

            <div className="info-row">
              <span>Order Number</span>
              <strong>
                {order.orderNumber || order.id}
              </strong>
            </div>

            <div className="info-row">
              <span>Status</span>
              <strong>{order.status || "PENDING"}</strong>
            </div>

            <div className="info-row">
              <span>Order Total</span>
              <strong>
                ₹
                {Number(
                  order.totalAmount ?? order.total ?? 0
                ).toFixed(2)}
              </strong>
            </div>

            {Array.isArray(order.items) &&
              order.items.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <strong>Items</strong>

                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.productName || item.product?.name}
                        {" × "}
                        {item.quantity}
                        {" — ₹"}
                        {Number(
                          item.lineTotal ??
                            Number(item.unitPrice || 0) *
                              Number(item.quantity || 0)
                        ).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <button
              className="track-order-button"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              Track This Order
            </button>
          </section>
        ))}

        {deliveryAddress && (
          <div className="delivery-address">
            <small>DELIVERY ADDRESS</small>
            <strong>{deliveryAddress}</strong>
          </div>
        )}

        <div className="success-actions">
          <button
            className="continue-shopping-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

          <button onClick={() => navigate("/orders")}>
            View All Orders
          </button>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;
