const adminSecretMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    if (req.user.adminVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Admin verification required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin security middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin security verification failed",
    });
  }
};

module.exports = adminSecretMiddleware;