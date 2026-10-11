const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateInventory,
  deleteProduct,
  getMyProducts,
  searchProducts,
  filterProducts,
  getFeaturedProducts,
  getProductsByShop,
} = require("../controllers/product.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const {
  authorizeApprovedShopkeeper,
} = require("../middleware/shopkeeper.middleware");

const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getProducts);

router.get(
  "/my",
  authenticate,
  authorizeApprovedShopkeeper,
  getMyProducts
);

router.get("/featured", getFeaturedProducts);


router.get("/search", searchProducts);
router.get("/filter", filterProducts);


router.get("/shop/:shopId", getProductsByShop);


router.get("/:id", getProductById);

router.post(
  "/",
  authenticate,
  authorizeApprovedShopkeeper,
  upload.single("image"),
  createProduct
);




router.patch(
  "/:id",
  authenticate,
  authorizeApprovedShopkeeper,
  upload.single("image"),
  updateProduct
);

router.patch(
  "/:id/inventory",
  authenticate,
  authorizeApprovedShopkeeper,
  updateInventory
);




router.delete(
  "/:id",
  authenticate,
  authorizeApprovedShopkeeper,
  deleteProduct
);


module.exports = router;




















// const express = require("express");

// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   updateInventory,
//   getMyProducts,
// } = require("../controllers/product.controller");

// const {
//   authenticate,
//   authorize,
// } = require("../middleware/auth.middleware");

// const router = express.Router();



// router.get("/", getProducts);



// router.get(
//   "/my",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   getMyProducts
// );



// router.get("/:id", getProductById);

// router.post(
//   "/",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   createProduct
// );





// router.patch(
//   "/:id",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   updateProduct
// );





// router.patch(
//   "/:id/inventory",
//   authenticate,
//   authorize("SHOPKEEPER"),
//   updateInventory
// );


// module.exports = router;