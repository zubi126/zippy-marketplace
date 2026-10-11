const express = require("express");

const {
  applyAsRider,
  getMyRiderProfile,
   updateRiderStatus,
   updateRiderLocation,
   testNearestRider,
   acceptDelivery,
   rejectDelivery,
   pickupDelivery,
   deliverDelivery,
   getMyDeliveries,
   getMyEarnings,
   getMyEarningsBalance,
   getMyEarningsPayouts,
   getMyWeeklyEarnings,
   getMyMonthlyEarnings,
} = require("../controllers/rider.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();



router.post(
  "/apply",
  authenticate,
  authorize("RIDER"),
  applyAsRider
);










router.get(
  "/me",
  authenticate,
  authorize("RIDER"),
  getMyRiderProfile
);







router.patch(
  "/status",
  authenticate,
  authorize("RIDER"),
  updateRiderStatus
);




router.patch(
  "/location",
  authenticate,
  authorize("RIDER"),
  updateRiderLocation
);






router.get(
  "/test/nearest-rider/:orderId",
  authenticate,
  authorize("RIDER"),
  testNearestRider
);







router.patch(
  "/deliveries/:deliveryId/accept",
  authenticate,
  authorize("RIDER"),
  acceptDelivery
);



router.patch(
  "/deliveries/:deliveryId/reject",
  authenticate,
  authorize("RIDER"),
  rejectDelivery
);



router.patch(
  "/deliveries/:deliveryId/pickup",
  authenticate,
  authorize("RIDER"),
  pickupDelivery
);





router.patch(
  "/deliveries/:deliveryId/deliver",
  authenticate,
  authorize("RIDER"),
  deliverDelivery
);



router.get(
  "/deliveries",
  authenticate,
  authorize("RIDER"),
  getMyDeliveries
);








router.get(
  "/earnings",
  authenticate,
  authorize("RIDER"),
  getMyEarnings
);





router.get(
  "/earnings/balance",
  authenticate,
  authorize("RIDER"),
  getMyEarningsBalance
);







router.get(
  "/earnings/payouts",
  authenticate,
  authorize("RIDER"),
  getMyEarningsPayouts
);







router.get(
  "/earnings/weekly",
  authenticate,
  authorize("RIDER"),
  getMyWeeklyEarnings
);








router.get(
  "/earnings/monthly",
  authenticate,
  authorize("RIDER"),
  getMyMonthlyEarnings
);



module.exports = router;