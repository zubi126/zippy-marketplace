const express = require("express");

const {
  updateMyProfile,
} = require("../controllers/customer.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.patch(
  "/profile",
  authenticate,
  authorize("CUSTOMER"),
  updateMyProfile
);

module.exports = router;