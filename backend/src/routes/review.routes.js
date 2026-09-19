const express = require("express");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createReview
);



router.get(
  "/product/:productId",
  getProductReviews
);



router.patch(
  "/:reviewId",
  authenticate,
  authorize("CUSTOMER"),
  updateReview
);



router.delete(
  "/:reviewId",
  authenticate,
  authorize("CUSTOMER"),
  deleteReview
);



module.exports = router;