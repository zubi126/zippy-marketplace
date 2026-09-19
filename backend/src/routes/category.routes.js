const express = require("express");

const {
  createCategory,
} = require("../controllers/category.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategory
);

module.exports = router;