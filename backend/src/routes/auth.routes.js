const express = require("express");
const rateLimit = require("express-rate-limit");

const validate = require("../middleware/validate.middleware");
const { verifyOtpSchema } = require("../validators/auth.validator");

const {
  register,
   registerShopkeeper,
   registerRider,
  login,
  me,
  sendOtp,
  verifyOtp,
  resendOtp,
  logout,

   forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
} = require("../controllers/auth.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

router.post("/register", register);
router.post("/register-shopkeeper", registerShopkeeper);

router.post("/register-rider", registerRider);

router.post("/login", login);

router.get("/me", authenticate, me);

router.post(
  "/logout",
  authenticate,
  logout
);

router.post("/send-otp", otpLimiter, sendOtp);

router.post("/resend-otp", otpLimiter, resendOtp);

router.post(
  "/verify-otp",
  otpLimiter,
  validate(verifyOtpSchema),
  verifyOtp
);





router.post("/forgot-password", forgotPassword);

router.post(
  "/verify-forgot-password-otp",
  verifyForgotPasswordOtp
);

router.post(
  "/reset-password",
  resetPassword
);





router.get(
  "/customer-test",
  authenticate,
  authorize("CUSTOMER"),
  (req, res) => {
    res.json({
      success: true,
      message: "Customer route accessed successfully",
      user: req.user,
    });
  }
);

router.get(
  "/admin-test",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin route accessed successfully",
      user: req.user,
    });
  }
);

module.exports = router;