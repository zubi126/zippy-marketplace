const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getShopOrders,
  updateShopOrderStatus,
} = require("../controllers/order.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

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
  authorize("SHOPKEEPER"),
  getShopOrders
);




// SHOPKEEPER - UPDATE ORDER STATUS
router.patch(
  "/shop/:orderId/status",
  authenticate,
  authorize("SHOPKEEPER"),
  updateShopOrderStatus
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