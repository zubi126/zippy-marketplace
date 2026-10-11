// const express = require("express");

// const { makeShopkeeper,
//   approveShop,
//   rejectShop,
//   suspendShop,
//   reactivateShop,
//   makeRider,
//   approveRider,
//   rejectRider,
//   suspendRider,
//   reactivateRider,
//   getAdminShops,
//     getAdminOrders,
//     getAdminProducts,
//   getAdminShopById,
//   getAdminRiders,
//   getAdminRiderById,
//   updateAdminRider,
//   updateAdminShop,
//   deleteAdminShop,
//   deleteAdminRider,
//   getAdminRefundRequests,
//   approveRefundRequest,
//   rejectRefundRequest,
//   createAdminRider,
//   createCashSellerPayout,
//   createRiderCashPayout,
//   toggleProductFeatured,
//   getAdminTotalPlatformSales,
//   getAdminTotalCommission,
//   getAdminTotalSellerPayouts,
//   getAdminTotalRiderPayouts,
//   getAdminTotalRefunded,
//   getAdminNetPlatformEarnings,
//   getAdminWeeklyEarnings,
//   getAdminMonthlyEarnings,
//   getAdminShopEarnings,
//   getAdminRiderPayouts,
//   getAdminSellerPayouts,
//   getAdminSellerPayoutDetails,
//   getAdminRiderPayoutDetails,
//  } = require("../controllers/admin.controller");


// const adminSecretMiddleware = require("../middleware/admin-secret.middleware");




// const {
//   authenticate,
//   authorize,
// } = require("../middleware/auth.middleware");

// const router = express.Router();





// // ADMIN - GET ORDERS
// router.get(
//   "/orders",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminOrders,
//   adminSecretMiddleware,
// );



// // ADMIN - GET TOTAL PLATFORM SALES
// router.get(
//   "/earnings/sales",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminTotalPlatformSales
// );






// // ADMIN - GET TOTAL COMMISSION
// router.get(
//   "/earnings/commission",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminTotalCommission
// );



// // ADMIN - GET TOTAL SELLER PAYOUTS
// router.get(
//   "/earnings/seller-payouts",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminTotalSellerPayouts
// );





// // ADMIN - GET TOTAL RIDER PAYOUTS
// router.get(
//   "/earnings/rider-payouts",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminTotalRiderPayouts
// );


// // ADMIN - GET RIDER PAYOUTS
// router.get(
//   "/payouts/riders",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminRiderPayouts
// );







// router.get(
//   "/payouts/riders/:riderId",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminRiderPayoutDetails
// );




// // ADMIN - GET TOTAL REFUNDED
// router.get(
//   "/earnings/refunds",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminTotalRefunded
// );







// // ADMIN - GET NET PLATFORM EARNINGS
// router.get(
//   "/earnings/net",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminNetPlatformEarnings
// );










// // ADMIN - GET WEEKLY PLATFORM EARNINGS
// router.get(
//   "/earnings/weekly",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminWeeklyEarnings
// );







// // ADMIN - GET MONTHLY PLATFORM EARNINGS
// router.get(
//   "/earnings/monthly",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminMonthlyEarnings
// );







// // ADMIN - GET SHOP-WISE EARNINGS
// router.get(
//   "/earnings/shops",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminShopEarnings
// );










// // ADMIN - GET PRODUCTS
// router.get(
//   "/products",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminProducts
// );








// // ADMIN - GET SHOPS
// router.get(
//   "/shops",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminShops
// );



// // ADMIN - GET RIDERS
// router.get(
//   "/riders",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminRiders
// );



// // ADMIN - GET SINGLE SHOP
// router.get(
//   "/shops/:shopId",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminShopById
// );



// router.patch(
//   "/shops/:shopId",
//   authenticate,
//   authorize("ADMIN"),
//   updateAdminShop
// );




// // ADMIN - GET SINGLE RIDER
// router.get(
//   "/riders/:riderId",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminRiderById
// );






// router.get(
//   "/refunds",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminRefundRequests
// );











// router.patch(
//   "/refunds/:refundRequestId/approve",
//   authenticate,
//   authorize("ADMIN"),
//   approveRefundRequest
// );



// router.patch(
//   "/refunds/:refundRequestId/reject",
//   authenticate,
//   authorize("ADMIN"),
//   rejectRefundRequest
// );


// router.patch(
//   "/make-shopkeeper",
//   authenticate,
//   authorize("ADMIN"),
//   makeShopkeeper
// );



// router.patch(
//   "/make-rider",
//   authenticate,
//   authorize("ADMIN"),
//   makeRider
// );


// router.patch(
//   "/riders/:riderId",
//   authenticate,
//   authorize("ADMIN"),
//   updateAdminRider
// );

// router.patch(
//   "/riders/:riderId/approve",
//   authenticate,
//   authorize("ADMIN"),
//   approveRider
// );


// router.patch(
//   "/riders/:riderId/reject",
//   authenticate,
//   authorize("ADMIN"),
//   rejectRider
// );


// router.patch(
//   "/riders/:riderId/suspend",
//   authenticate,
//   authorize("ADMIN"),
//   suspendRider
// );




// router.patch(
//   "/riders/:riderId/reactivate",
//   authenticate,
//   authorize("ADMIN"),
//   reactivateRider
// );









// router.patch(
//   "/shops/:shopId/approve",
//   authenticate,
//   authorize("ADMIN"),
//   approveShop
// );



// router.patch(
//   "/shops/:shopId/reject",
//   authenticate,
//   authorize("ADMIN"),
//   rejectShop
// );



// router.patch(
//   "/shops/:shopId/suspend",
//   authenticate,
//   authorize("ADMIN"),
//   suspendShop
// );



// router.patch(
//   "/shops/:shopId/reactivate",
//   authenticate,
//   authorize("ADMIN"),
//   reactivateShop
// );






// router.delete(
//   "/shops/:shopId",
//   authenticate,
//   authorize("ADMIN"),
//   deleteAdminShop
// );





// router.post(
//   "/riders",
//   authenticate,
//   authorize("ADMIN"),
//   createAdminRider
// );





// router.post(
//   "/rider-payouts/cash",
//   authenticate,
//   authorize("ADMIN"),
//   createRiderCashPayout
// );



// router.delete(
//   "/riders/:riderId",
//   authenticate,
//   authorize("ADMIN"),
//   deleteAdminRider
// );









// // ADMIN - CREATE CASH SELLER PAYOUT

// router.post(
//   "/seller-payouts/cash",
//   authenticate,
//   authorize("ADMIN"),
//   createCashSellerPayout
// );







// // ADMIN - GET SELLER PAYOUTS
// router.get(
//   "/payouts/sellers",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminSellerPayouts
// );







// router.get(
//   "/payouts/sellers/:shopId",
//   authenticate,
//   authorize("ADMIN"),
//   getAdminSellerPayoutDetails
// );





// // ADMIN - TOGGLE PRODUCT FEATURED

// router.patch(
//   "/products/:productId/featured",
//   authenticate,
//   authorize("ADMIN"),
//   toggleProductFeatured
// );




// module.exports = router;






























const express = require("express");

const { makeShopkeeper,
  approveShop,
  rejectShop,
  suspendShop,
  reactivateShop,
  makeRider,
  approveRider,
  rejectRider,
  suspendRider,
  reactivateRider,
  getAdminShops,
    getAdminOrders,
    getAdminProducts,
  getAdminShopById,
  getAdminRiders,
  getAdminRiderById,
  updateAdminRider,
  updateAdminShop,
  deleteAdminShop,
  deleteAdminRider,
  getAdminRefundRequests,
  approveRefundRequest,
  rejectRefundRequest,
  createAdminRider,
  createCashSellerPayout,
  createRiderCashPayout,
  toggleProductFeatured,
  getAdminTotalPlatformSales,
  getAdminTotalCommission,
  getAdminTotalSellerPayouts,
  getAdminTotalRiderPayouts,
  getAdminTotalRefunded,
  getAdminNetPlatformEarnings,
  getAdminWeeklyEarnings,
  getAdminMonthlyEarnings,
  getAdminShopEarnings,
  getAdminRiderPayouts,
  getAdminSellerPayouts,
  getAdminSellerPayoutDetails,
  getAdminRiderPayoutDetails,
 } = require("../controllers/admin.controller");


const adminSecretMiddleware = require("../middleware/admin-secret.middleware");




const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();





// ADMIN - GET ORDERS
router.get(
  "/orders",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminOrders
);



// ADMIN - GET TOTAL PLATFORM SALES
router.get(
  "/earnings/sales",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminTotalPlatformSales
);






// ADMIN - GET TOTAL COMMISSION
router.get(
  "/earnings/commission",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminTotalCommission
);



// ADMIN - GET TOTAL SELLER PAYOUTS
router.get(
  "/earnings/seller-payouts",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminTotalSellerPayouts
);





// ADMIN - GET TOTAL RIDER PAYOUTS
router.get(
  "/earnings/rider-payouts",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminTotalRiderPayouts
);


// ADMIN - GET RIDER PAYOUTS
router.get(
  "/payouts/riders",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminRiderPayouts
);







router.get(
  "/payouts/riders/:riderId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminRiderPayoutDetails
);




// ADMIN - GET TOTAL REFUNDED
router.get(
  "/earnings/refunds",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminTotalRefunded
);







// ADMIN - GET NET PLATFORM EARNINGS
router.get(
  "/earnings/net",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminNetPlatformEarnings
);










// ADMIN - GET WEEKLY PLATFORM EARNINGS
router.get(
  "/earnings/weekly",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminWeeklyEarnings
);







// ADMIN - GET MONTHLY PLATFORM EARNINGS
router.get(
  "/earnings/monthly",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminMonthlyEarnings
);







// ADMIN - GET SHOP-WISE EARNINGS
router.get(
  "/earnings/shops",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminShopEarnings
);










// ADMIN - GET PRODUCTS
router.get(
  "/products",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminProducts
);








// ADMIN - GET SHOPS
router.get(
  "/shops",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminShops
);



// ADMIN - GET RIDERS
router.get(
  "/riders",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminRiders
);



// ADMIN - GET SINGLE SHOP
router.get(
  "/shops/:shopId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminShopById
);



router.patch(
  "/shops/:shopId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  updateAdminShop
);




// ADMIN - GET SINGLE RIDER
router.get(
  "/riders/:riderId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminRiderById
);






router.get(
  "/refunds",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminRefundRequests
);











router.patch(
  "/refunds/:refundRequestId/approve",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  approveRefundRequest
);



router.patch(
  "/refunds/:refundRequestId/reject",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  rejectRefundRequest
);


router.patch(
  "/make-shopkeeper",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  makeShopkeeper
);



router.patch(
  "/make-rider",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  makeRider
);


router.patch(
  "/riders/:riderId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  updateAdminRider
);

router.patch(
  "/riders/:riderId/approve",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  approveRider
);


router.patch(
  "/riders/:riderId/reject",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  rejectRider
);


router.patch(
  "/riders/:riderId/suspend",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  suspendRider
);




router.patch(
  "/riders/:riderId/reactivate",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  reactivateRider
);









router.patch(
  "/shops/:shopId/approve",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  approveShop
);



router.patch(
  "/shops/:shopId/reject",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  rejectShop
);



router.patch(
  "/shops/:shopId/suspend",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  suspendShop
);



router.patch(
  "/shops/:shopId/reactivate",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  reactivateShop
);






router.delete(
  "/shops/:shopId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  deleteAdminShop
);





router.post(
  "/riders",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  createAdminRider
);





router.post(
  "/rider-payouts/cash",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  createRiderCashPayout
);



router.delete(
  "/riders/:riderId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  deleteAdminRider
);









// ADMIN - CREATE CASH SELLER PAYOUT

router.post(
  "/seller-payouts/cash",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  createCashSellerPayout
);







// ADMIN - GET SELLER PAYOUTS
router.get(
  "/payouts/sellers",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminSellerPayouts
);







router.get(
  "/payouts/sellers/:shopId",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  getAdminSellerPayoutDetails
);





// ADMIN - TOGGLE PRODUCT FEATURED

router.patch(
  "/products/:productId/featured",
  authenticate,
  authorize("ADMIN"),
  adminSecretMiddleware,
  toggleProductFeatured
);




module.exports = router;