const express = require("express");

const {
  createOrder,
  getMyOrders,
  getCheckoutSummary,
  verifyPayment,
  getOrderById,
  getShopOrders,
  updateShopOrderStatus,
  cancelOrder,
  cancelCheckout, // NEW
  requestRefund,
  retryPayment, // NEW
} = require("../controllers/order.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const {
  authorizeApprovedShopkeeper,
} = require("../middleware/shopkeeper.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  getMyOrders
);

// GET SHOP ORDERS
router.get(
  "/shop/orders",
  authenticate,
  authorizeApprovedShopkeeper,
  getShopOrders
);

// SHOPKEEPER - UPDATE ORDER STATUS
router.patch(
  "/shop/:orderId/status",
  authenticate,
  authorizeApprovedShopkeeper,
  updateShopOrderStatus
);

router.post(
  "/payment/verify",
  authenticate,
  authorize("CUSTOMER"),
  verifyPayment
);








// CUSTOMER - RETRY PAYMENT
router.post(
  "/checkout/:checkoutPaymentId/retry-payment",
  authenticate,
  authorize("CUSTOMER"),
  retryPayment
);




 // CUSTOMER - CANCEL ENTIRE CHECKOUT
router.patch(
  "/checkout/:checkoutPaymentId/cancel",
  authenticate,
  authorize("CUSTOMER"),
  cancelCheckout
);






// CUSTOMER - CANCEL ORDER
router.patch(
  "/:orderId/cancel",
  authenticate,
  authorize("CUSTOMER"),
  cancelOrder
);




// CUSTOMER - REQUEST REFUND
router.post(
  "/:orderId/refund-request",
  authenticate,
  authorize("CUSTOMER"),
  requestRefund
);





router.get(
  "/summary",
  authenticate,
  authorize("CUSTOMER"),
  getCheckoutSummary
);







// GET SINGLE ORDER
router.get(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  getOrderById
);

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createOrder
);

module.exports = router;














// const express = require("express");

// const {
//   createOrder,
//   getMyOrders,
//   verifyPayment,
//   getOrderById,
//   getShopOrders,
//   updateShopOrderStatus,
// } = require("../controllers/order.controller");

// const {
//   authenticate,
//   authorize,
// } = require("../middleware/auth.middleware");

// const router = express.Router();



// router.get(
//   "/",
//   authenticate,
//   authorize("CUSTOMER"),
//   getMyOrders
// );




// // GET SHOP ORDERS
// router.get(
//   "/shop/orders",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getShopOrders
// );




// // SHOPKEEPER - UPDATE ORDER STATUS
// router.patch(
//   "/shop/:orderId/status",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   updateShopOrderStatus
// );



// router.post(
//   "/payment/verify",
//   authenticate,
//   authorize("CUSTOMER"),
//   verifyPayment
// );



// // GET SINGLE ORDER
// router.get(
//   "/:id",
//   authenticate,
//   authorize("CUSTOMER"),
//   getOrderById
// );

// router.post(
//   "/",
//   authenticate,
//   authorize("CUSTOMER"),
//   createOrder
// );

// module.exports = router;