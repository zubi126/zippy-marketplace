const prisma = require("../lib/prisma");

const authorizeApprovedShopkeeper = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "SHOPKEEPER") {
      return res.status(403).json({
        success: false,
        message: "Shopkeeper access required",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId: req.user.userId,
      },
      select: {
        id: true,
        verificationStatus: true,
        isActive: true,
      },
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "Shop profile not found",
      });
    }

    if (shop.verificationStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Shop approval is pending",
      });
    }

    if (!shop.isActive) {
      return res.status(403).json({
        success: false,
        message: "Shop is inactive",
      });
    }

    req.shop = shop;

    next();
  } catch (error) {
    console.error("Shopkeeper authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  authorizeApprovedShopkeeper,
};