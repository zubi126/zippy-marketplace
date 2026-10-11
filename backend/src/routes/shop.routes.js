// const express = require("express");

// const { createShop,
//   updateShopLocation,
//   updateShopStatus,
//   getMyShop,
//   getNearbyShops,
//   getSellerEarningsSummary,
//   getSellerOrders,
//   getSellerWeeklyEarnings,
//   getSellerMonthlyEarnings,
//   getSellerCustomEarnings,
//   getSellerBalance,
//   getSellerPayoutHistory,
//    getShopBySlug,
//   updateMyShop } = require("../controllers/shop.controller");

// const {
//   authorizeApprovedShopkeeper,
// } = require("../middleware/shopkeeper.middleware");

// const {
//   authenticate,
//   authorize,
// } = require("../middleware/auth.middleware");

// const router = express.Router();

// router.post(
//   "/",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   createShop
// );



// router.get(
//   "/nearby",
//   getNearbyShops
// );


// router.get("/:slug", getShopBySlug);



// router.get(
//   "/me",
//   authenticate,
//   authorizeApprovedShopkeeper,
//   getMyShop
// );






// router.get(
//   "/earnings/summary",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerEarningsSummary
// );






// router.get(
//   "/earnings/orders",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerOrders
// );




// router.get(
//   "/earnings/weekly",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerWeeklyEarnings
// );






// router.get(
//   "/earnings/monthly",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerMonthlyEarnings
// );






// router.get(
//   "/earnings",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerCustomEarnings
// );





// router.get(
//   "/earnings/balance",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerBalance
// );



// // SELLER - PAYOUT HISTORY
// router.get(
//   "/earnings/payouts",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getSellerPayoutHistory
// );


// router.patch(
//   "/me",
//   authenticate,
//   authorizeApprovedShopkeeper,
//   updateMyShop
// );

// router.patch(
//   "/location",
//   authenticate,
//   authorizeApprovedShopkeeper,
//   updateShopLocation
// );

// router.patch(
//   "/status",
//   authenticate,
//   authorizeApprovedShopkeeper,
//   updateShopStatus
// );








// module.exports = router;























// // const express = require("express");

// // const { createShop,updateShopLocation,updateShopStatus,getMyShop,updateMyShop } = require("../controllers/shop.controller");



// // const {
// //   authorizeApprovedShopkeeper,
// // } = require("../middleware/shopkeeper.middleware");



// // const {
// //   authenticate,
// //   authorize,

// // } = require("../middleware/auth.middleware");

// // const router = express.Router();

// // router.post(
// //   "/",
// //   authenticate,
// //   authorize("SHOPKEEPER"),
// //   createShop
// // );




// // router.get(
// //   "/me",
// //   authenticate,
// //   authorize("SHOPKEEPER"),
// //   getMyShop
// // );



// // router.patch(
// //   "/me",
// //   authenticate,
// //   authorize("SHOPKEEPER"),
// //   updateMyShop
// // );


// // router.patch(
// //   "/location",
// //   authenticate,
// //   authorize("SHOPKEEPER"),
// //   updateShopLocation
// // );




// // router.patch(
// //   "/status",
// //   authenticate,
// //   authorize("SHOPKEEPER"),
// //   updateShopStatus
// // );

// // module.exports = router;





















const express = require("express");

const {
  createShop,
  updateShopLocation,
  updateShopStatus,
  getMyShop,
  getMyShopStatus,
    searchShops,
  getNearbyShops,
  getSellerEarningsSummary,
  getSellerOrders,
  getSellerWeeklyEarnings,
  getSellerMonthlyEarnings,
  getSellerCustomEarnings,
  getSellerBalance,
  getSellerPayoutHistory,
  getShopBySlug,
  updateMyShop,
} = require("../controllers/shop.controller");

const {
  authorizeApprovedShopkeeper,
} = require("../middleware/shopkeeper.middleware");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

/* =========================
   SHOPKEEPER
========================= */

router.post(
  "/",
  authenticate,
  authorize("SHOPKEEPER"),
  createShop
);


/* =========================
   PUBLIC SHOP ROUTES
========================= */

router.get(
  "/nearby",
  getNearbyShops
);







router.get(
  "/search",
  searchShops
);





/* =========================
   SHOPKEEPER - OWN SHOP
========================= */

router.get(
  "/me",
  authenticate,
  authorizeApprovedShopkeeper,
  getMyShop
);









router.get(
  "/me/status",
  authenticate,
  authorize("SHOPKEEPER"),
  getMyShopStatus
);











/* =========================
   SELLER EARNINGS
========================= */

router.get(
  "/earnings/summary",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerEarningsSummary
);

router.get(
  "/earnings/orders",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerOrders
);

router.get(
  "/earnings/weekly",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerWeeklyEarnings
);

router.get(
  "/earnings/monthly",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerMonthlyEarnings
);

router.get(
  "/earnings",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerCustomEarnings
);

router.get(
  "/earnings/balance",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerBalance
);

router.get(
  "/earnings/payouts",
  authenticate,
  authorize("SHOPKEEPER"),
  getSellerPayoutHistory
);


/* =========================
   SHOPKEEPER - UPDATE SHOP
========================= */

router.patch(
  "/me",
  authenticate,
  authorizeApprovedShopkeeper,
  updateMyShop
);

router.patch(
  "/location",
  authenticate,
  authorizeApprovedShopkeeper,
  updateShopLocation
);

router.patch(
  "/status",
  authenticate,
  authorizeApprovedShopkeeper,
  updateShopStatus
);


/* =========================
   PUBLIC SHOP BY SLUG
   MUST BE LAST
========================= */

router.get(
  "/:slug",
  getShopBySlug
);


module.exports = router;