const express = require("express");

const { createShop,updateShopLocation,updateShopStatus,getMyShop,updateMyShop } = require("../controllers/shop.controller");

const {
  authenticate,
  authorize,

} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("SHOPKEEPER"),
  createShop
);




router.get(
  "/me",
  authenticate,
  authorize("SHOPKEEPER"),
  getMyShop
);



router.patch(
  "/me",
  authenticate,
  authorize("SHOPKEEPER"),
  updateMyShop
);


router.patch(
  "/location",
  authenticate,
  authorize("SHOPKEEPER"),
  updateShopLocation
);




router.patch(
  "/status",
  authenticate,
  authorize("SHOPKEEPER"),
  updateShopStatus
);

module.exports = router;