const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateInventory,
  getMyProducts,
} = require("../controllers/product.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();



router.get("/", getProducts);



router.get(
  "/my",
  authenticate,
  authorize("SHOPKEEPER"),
  getMyProducts
);



router.get("/:id", getProductById);

router.post(
  "/",
  authenticate,
  authorize("SHOPKEEPER"),
  createProduct
);





router.patch(
  "/:id",
  authenticate,
  authorize("SHOPKEEPER"),
  updateProduct
);





router.patch(
  "/:id/inventory",
  authenticate,
  authorize("SHOPKEEPER"),
  updateInventory
);


module.exports = router;