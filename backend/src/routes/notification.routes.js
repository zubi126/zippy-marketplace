const express = require("express");

const {
  subscribeToPush,
  testPushNotification,
} = require("../controllers/notification.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/subscribe",
  authenticate,
  subscribeToPush
);



router.post(
  "/test",
  authenticate,
  testPushNotification
);

module.exports = router;