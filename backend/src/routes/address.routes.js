const express = require("express");

const {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  getMyAddresses
);





router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  createAddress
);




// SET DEFAULT ADDRESS
router.patch(
  "/:id/default",
  authenticate,
  authorize("CUSTOMER"),
  setDefaultAddress
);





// UPDATE ADDRESS
router.patch(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  updateAddress
);






// DELETE ADDRESS
router.delete(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  deleteAddress
);

module.exports = router;