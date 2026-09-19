const prisma = require("../lib/prisma");

const createShop = async (req, res) => {
  try {
    const { name, slug, phone, address, latitude, longitude } = req.body;

    if (!name || !slug || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, slug, phone and address are required",
      });
    }

    const ownerId = req.user.userId;

    // Check whether this user already owns a shop
    const existingShop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
    });

    if (existingShop) {
      return res.status(409).json({
        success: false,
        message: "You already have a shop",
      });
    }

    // Check slug
    const existingSlug = await prisma.shop.findUnique({
      where: {
        slug,
      },
    });

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "Shop slug already exists",
      });
    }

    const shop = await prisma.shop.create({
      data: {
        ownerId,
        name,
        slug,
        phone,
        address,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.error("Create shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};










const getMyShop = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error("Get my shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get shop",
    });
  }
};












const updateMyShop = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const {
      name,
      slug,
      phone,
      address,
      latitude,
      longitude,
    } = req.body;

    // Find shop owned by logged-in shopkeeper
    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Validate latitude
    if (latitude !== undefined) {
      if (typeof latitude !== "number") {
        return res.status(400).json({
          success: false,
          message: "Latitude must be a number",
        });
      }

      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude",
        });
      }
    }

    // Validate longitude
    if (longitude !== undefined) {
      if (typeof longitude !== "number") {
        return res.status(400).json({
          success: false,
          message: "Longitude must be a number",
        });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          message: "Invalid longitude",
        });
      }
    }

    // Check slug only if slug is being changed
    if (slug !== undefined && slug !== shop.slug) {
      const existingSlug = await prisma.shop.findUnique({
        where: {
          slug,
        },
      });

      if (existingSlug) {
        return res.status(409).json({
          success: false,
          message: "Shop slug already exists",
        });
      }
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shop.id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Update shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update shop",
    });
  }
};







const updateShopLocation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be numbers",
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId: userId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shop.id,
      },
      data: {
        latitude,
        longitude,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop location updated successfully",
      location: {
        latitude: updatedShop.latitude,
        longitude: updatedShop.longitude,
      },
    });
  } catch (error) {
    console.error("Update shop location error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update shop location",
    });
  }
};




















const updateShopStatus = async (req, res) => {
  try {
    const { isOpen } = req.body;
    const ownerId = req.user.userId;

    if (typeof isOpen !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isOpen must be a boolean",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shop.id,
      },
      data: {
        isOpen,
      },
      select: {
        id: true,
        name: true,
        isOpen: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: isOpen
        ? "Shop opened successfully"
        : "Shop closed successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Update shop status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update shop status",
    });
  }
};

module.exports = {
  updateShopStatus,
};




module.exports = {
  createShop,
  getMyShop,
  updateMyShop,
  updateShopLocation,
  updateShopStatus,
};