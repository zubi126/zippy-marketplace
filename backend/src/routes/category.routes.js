const express = require("express");

const {
  createCategory,
  getCategories,
} = require("../controllers/category.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();



router.get("/", getCategories);




router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategory
);

module.exports = router;