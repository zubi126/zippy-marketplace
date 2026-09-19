const express = require("express");

const { makeShopkeeper,approveShop,rejectShop,suspendShop,reactivateShop,makeRider,approveRider,rejectRider,suspendRider,reactivateRider, } = require("../controllers/admin.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.patch(
  "/make-shopkeeper",
  authenticate,
  authorize("ADMIN"),
  makeShopkeeper
);



router.patch(
  "/make-rider",
  authenticate,
  authorize("ADMIN"),
  makeRider
);




router.patch(
  "/riders/:riderId/approve",
  authenticate,
  authorize("ADMIN"),
  approveRider
);


router.patch(
  "/riders/:riderId/reject",
  authenticate,
  authorize("ADMIN"),
  rejectRider
);


router.patch(
  "/riders/:riderId/suspend",
  authenticate,
  authorize("ADMIN"),
  suspendRider
);




router.patch(
  "/riders/:riderId/reactivate",
  authenticate,
  authorize("ADMIN"),
  reactivateRider
);





router.patch(
  "/shops/:shopId/approve",
  authenticate,
  authorize("ADMIN"),
  approveShop
);



router.patch(
  "/shops/:shopId/reject",
  authenticate,
  authorize("ADMIN"),
  rejectShop
);



router.patch(
  "/shops/:shopId/suspend",
  authenticate,
  authorize("ADMIN"),
  suspendShop
);



router.patch(
  "/shops/:shopId/reactivate",
  authenticate,
  authorize("ADMIN"),
  reactivateShop
);

module.exports = router;