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















const getMyShopStatus = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        verificationStatus: true,
        rejectionReason: true,
        isActive: true,
        isOpen: true,
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
    console.error("Get my shop status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get shop status",
    });
  }
};


















const searchShops = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const search = q.trim();

    const shops = await prisma.shop.findMany({
      where: {
        isActive: true,
        verificationStatus: "APPROVED",
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        latitude: true,
        longitude: true,
        isOpen: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      search,
      shops,
    });
  } catch (error) {
    console.error("Search shops error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search shops",
    });
  }
};














const getNearbyShops = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        isActive: true,
        verificationStatus: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        latitude: true,
        longitude: true,
        isOpen: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("Get nearby shops error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get nearby shops",
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
















const getSellerEarningsSummary = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    // Find seller's shop
    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Get all orders for this shop
    const orders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
        status: "DELIVERED",
      },
      select: {
        subtotal: true,
        deliveryFee: true,
        platformFee: true,
        commissionAmount: true,
        sellerPayableAmount: true,
      },
    });

    const totalOrders = orders.length;

    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.subtotal),
      0
    );

    const totalDeliveryFees = orders.reduce(
      (sum, order) => sum + Number(order.deliveryFee),
      0
    );

    const totalPlatformFees = orders.reduce(
      (sum, order) => sum + Number(order.platformFee),
      0
    );

    const totalCommission = orders.reduce(
      (sum, order) => sum + Number(order.commissionAmount),
      0
    );

    const totalSellerEarnings = orders.reduce(
      (sum, order) => sum + Number(order.sellerPayableAmount),
      0
    );

    return res.status(200).json({
      success: true,
      summary: {
        shopId: shop.id,
        shopName: shop.name,
        shopSince: shop.createdAt,

        totalOrders,

        // Product sales
        totalSales: Number(totalSales.toFixed(2)),

        // Customer charges - separate from seller earnings
        totalDeliveryFees: Number(totalDeliveryFees.toFixed(2)),
        totalPlatformFees: Number(totalPlatformFees.toFixed(2)),

        // Seller accounting
        totalCommission: Number(totalCommission.toFixed(2)),
        totalSellerEarnings: Number(totalSellerEarnings.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Get seller earnings summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get seller earnings summary",
    });
  }
};
















const getSellerOrders = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    // Find seller's shop
    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const where = {
      shopId: shop.id,
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          orderNumber: true,

          subtotal: true,
          deliveryFee: true,
          platformFee: true,

          commissionRate: true,
          commissionAmount: true,
          sellerPayableAmount: true,

          paymentMethod: true,
          paymentStatus: true,
          status: true,

          createdAt: true,
          updatedAt: true,

          items: {
  select: {
    id: true,
    productId: true,
    productName: true,
    quantity: true,
    unitPrice: true,
    lineTotal: true,
  },
},
        },
      }),

      prisma.order.count({
        where,
      }),
    ]);

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,

      products: order.items.map((item) => ({
  id: item.productId,
  name: item.productName,
  quantity: item.quantity,
  price: Number(item.unitPrice),
  lineTotal: Number(item.lineTotal),
})),

      productSubtotal: Number(order.subtotal),

      customerCharges: {
        deliveryFee: Number(order.deliveryFee),
        platformFee: Number(order.platformFee),
        customerProductTotal: Number(order.subtotal),
        customerTotal:
          Number(order.subtotal) +
          Number(order.deliveryFee) +
          Number(order.platformFee),
      },

      sellerAccounting: {
        commissionRate: Number(order.commissionRate),
        commission: Number(order.commissionAmount),
        sellerEarning: Number(order.sellerPayableAmount),
      },

      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
      },

      orderStatus: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.status(200).json({
      success: true,

      shop: {
        id: shop.id,
        name: shop.name,
      },

      orders: formattedOrders,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get seller orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get seller orders",
    });
  }
};
















const getSellerWeeklyEarnings = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Current week: Monday 00:00 -> now
    const now = new Date();

    const currentDay = now.getDay(); // Sunday = 0
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - daysFromMonday);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);

    const orders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
        status: "DELIVERED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        subtotal: true,
        deliveryFee: true,
        platformFee: true,
        commissionAmount: true,
        sellerPayableAmount: true,
      },
    });

    const totalOrders = orders.length;

    const grossSales = orders.reduce(
      (sum, order) => sum + Number(order.subtotal),
      0
    );

    const totalDeliveryFees = orders.reduce(
      (sum, order) => sum + Number(order.deliveryFee),
      0
    );

    const totalPlatformFees = orders.reduce(
      (sum, order) => sum + Number(order.platformFee),
      0
    );

    const totalCommission = orders.reduce(
      (sum, order) => sum + Number(order.commissionAmount),
      0
    );

    const totalSellerEarnings = orders.reduce(
      (sum, order) => sum + Number(order.sellerPayableAmount),
      0
    );

    return res.status(200).json({
      success: true,

      period: {
        startDate,
        endDate,
      },

      shop: {
        id: shop.id,
        name: shop.name,
      },

      summary: {
        totalOrders,

        grossSales: Number(grossSales.toFixed(2)),

        customerCharges: {
          deliveryFees: Number(totalDeliveryFees.toFixed(2)),
          platformFees: Number(totalPlatformFees.toFixed(2)),
        },

        sellerAccounting: {
          commission: Number(totalCommission.toFixed(2)),
          sellerEarnings: Number(totalSellerEarnings.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Get seller weekly earnings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get weekly seller earnings",
    });
  }
};

















const getSellerMonthlyEarnings = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const now = new Date();

    // Current calendar month
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const endDate = new Date(now);

    const orders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
        status: "DELIVERED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        subtotal: true,
        deliveryFee: true,
        platformFee: true,
        commissionAmount: true,
        sellerPayableAmount: true,
      },
    });

    const totalOrders = orders.length;

    const grossSales = orders.reduce(
      (sum, order) => sum + Number(order.subtotal),
      0
    );

    const totalDeliveryFees = orders.reduce(
      (sum, order) => sum + Number(order.deliveryFee),
      0
    );

    const totalPlatformFees = orders.reduce(
      (sum, order) => sum + Number(order.platformFee),
      0
    );

    const totalCommission = orders.reduce(
      (sum, order) => sum + Number(order.commissionAmount),
      0
    );

    const totalSellerEarnings = orders.reduce(
      (sum, order) => sum + Number(order.sellerPayableAmount),
      0
    );

    return res.status(200).json({
      success: true,

      period: {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        startDate,
        endDate,
      },

      shop: {
        id: shop.id,
        name: shop.name,
      },

      summary: {
        totalOrders,

        grossSales: Number(grossSales.toFixed(2)),

        customerCharges: {
          deliveryFees: Number(totalDeliveryFees.toFixed(2)),
          platformFees: Number(totalPlatformFees.toFixed(2)),
        },

        sellerAccounting: {
          commission: Number(totalCommission.toFixed(2)),
          sellerEarnings: Number(totalSellerEarnings.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Get seller monthly earnings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get monthly seller earnings",
    });
  }
};














const getSellerCustomEarnings = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59.999`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate or endDate",
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "startDate cannot be after endDate",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Do not allow reports before shop creation
    if (end < shop.createdAt) {
      return res.status(400).json({
        success: false,
        message: "Selected date range is before the shop was created",
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
        status: "DELIVERED",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        subtotal: true,
        deliveryFee: true,
        platformFee: true,
        commissionAmount: true,
        sellerPayableAmount: true,
      },
    });

    const totalOrders = orders.length;

    const grossSales = orders.reduce(
      (sum, order) => sum + Number(order.subtotal),
      0
    );

    const totalDeliveryFees = orders.reduce(
      (sum, order) => sum + Number(order.deliveryFee),
      0
    );

    const totalPlatformFees = orders.reduce(
      (sum, order) => sum + Number(order.platformFee),
      0
    );

    const totalCommission = orders.reduce(
      (sum, order) => sum + Number(order.commissionAmount),
      0
    );

    const totalSellerEarnings = orders.reduce(
      (sum, order) => sum + Number(order.sellerPayableAmount),
      0
    );

    return res.status(200).json({
      success: true,

      period: {
        startDate: start,
        endDate: end,
      },

      shop: {
        id: shop.id,
        name: shop.name,
      },

      summary: {
        totalOrders,

        grossSales: Number(grossSales.toFixed(2)),

        customerCharges: {
          deliveryFees: Number(totalDeliveryFees.toFixed(2)),
          platformFees: Number(totalPlatformFees.toFixed(2)),
        },

        sellerAccounting: {
          commission: Number(totalCommission.toFixed(2)),
          sellerEarnings: Number(totalSellerEarnings.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Get seller custom earnings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get seller earnings",
    });
  }
};
















const getSellerBalance = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const shop = await prisma.shop.findUnique({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Completed seller earnings
    const earnings = await prisma.order.aggregate({
      where: {
        shopId: shop.id,
        status: "DELIVERED",
      },
      _sum: {
        subtotal: true,
        commissionAmount: true,
        sellerPayableAmount: true,
      },
      _count: {
        id: true,
      },
    });

    // Total payouts already made / being processed
    const payouts = await prisma.sellerPayout.aggregate({
      where: {
        shopId: shop.id,
        status: {
          in: ["PAID", "PROCESSING"],
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalSales = Number(earnings._sum.subtotal || 0);
    const totalCommission = Number(
      earnings._sum.commissionAmount || 0
    );
    const totalSellerEarnings = Number(
      earnings._sum.sellerPayableAmount || 0
    );

    const paidOrProcessing = Number(payouts._sum.amount || 0);

    const pendingPayout = Math.max(
      totalSellerEarnings - paidOrProcessing,
      0
    );

    return res.status(200).json({
      success: true,

      shop: {
        id: shop.id,
        name: shop.name,
        shopSince: shop.createdAt,
      },

      balance: {
        totalOrders: earnings._count.id,

        totalSales: Number(totalSales.toFixed(2)),

        totalCommission: Number(
          totalCommission.toFixed(2)
        ),

        totalSellerEarnings: Number(
          totalSellerEarnings.toFixed(2)
        ),

        alreadyPaid: Number(
          paidOrProcessing.toFixed(2)
        ),

        pendingPayout: Number(
          pendingPayout.toFixed(2)
        ),
      },
    });
  } catch (error) {
    console.error("Get seller balance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get seller balance",
    });
  }
};














// GET SELLER PAYOUT HISTORY
const getSellerPayoutHistory = async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: {
        ownerId: req.user.userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const {
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 20, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      shopId: shop.id,
    };

    const [payouts, total] = await Promise.all([
      prisma.sellerPayout.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          periodStart: true,
          periodEnd: true,
          status: true,
          provider: true,
          providerPayoutId: true,
          paidAt: true,
          failedAt: true,
          failureReason: true,
          referenceId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      prisma.sellerPayout.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,

      shop: {
        id: shop.id,
        name: shop.name,
      },

      payouts,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get seller payout history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seller payout history",
    });
  }
};











const getShopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const shop = await prisma.shop.findFirst({
      where: {
        slug,
        isActive: true,
        verificationStatus: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        latitude: true,
        longitude: true,
        isOpen: true,
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
    console.error("Get shop by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get shop",
    });
  }
};








module.exports = {
  createShop,
  getMyShop,
  getMyShopStatus,
  searchShops,
  getNearbyShops,
  updateMyShop,
  updateShopLocation,
  updateShopStatus,
  getSellerEarningsSummary,
  getSellerOrders,
  getSellerWeeklyEarnings,
  getSellerMonthlyEarnings,
  getSellerCustomEarnings,
  getSellerBalance,
  getSellerPayoutHistory,
   getShopBySlug,
};