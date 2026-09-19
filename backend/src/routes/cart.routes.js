const express = require("express");

const { addToCart,getMyCart,updateCartItem,removeCartItem, } = require("../controllers/cart.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();




router.get(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  getMyCart
);


router.post(
  "/items",
  authenticate,
  authorize("CUSTOMER"),
  addToCart
);


router.patch(
  "/items/:itemId",
  authenticate,
  authorize("CUSTOMER"),
  updateCartItem
);




router.delete(
  "/items/:itemId",
  authenticate,
  authorize("CUSTOMER"),
  removeCartItem
);

module.exports = router;