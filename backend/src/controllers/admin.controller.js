const prisma = require("../lib/prisma");

const {
  refundRazorpayPayment,
} = require("../services/payment.service");

const makeShopkeeper = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot be converted to shopkeeper",
      });
    }

    if (user.role === "SHOPKEEPER") {
      return res.status(409).json({
        success: false,
        message: "User is already a shopkeeper",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: "SHOPKEEPER",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User is now a shopkeeper",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Make shopkeeper error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};















const makeRider = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot be made a rider",
      });
    }

    if (user.role === "SHOPKEEPER") {
      return res.status(400).json({
        success: false,
        message: "Shopkeeper cannot be made a rider",
      });
    }

    // If user is already RIDER, check whether Rider profile exists
    if (user.role === "RIDER") {
      const existingRider = await prisma.rider.findUnique({
        where: {
          userId: user.id,
        },
      });

      // Rider role exists but profile is missing
      // Create the missing Rider profile
      if (!existingRider) {
        const rider = await prisma.rider.create({
          data: {
            userId: user.id,
            status: "OFFLINE",
            verificationStatus: "PENDING",
          },
        });

        return res.status(200).json({
          success: true,
          message: "Rider profile created successfully",
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          rider,
        });
      }

      return res.status(400).json({
        success: false,
        message: "User is already a rider",
      });
    }

    // Convert user to RIDER and create Rider profile
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: "RIDER",
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const rider = await tx.rider.create({
        data: {
          userId: user.id,
          status: "OFFLINE",
          verificationStatus: "PENDING",
        },
      });

      return {
        updatedUser,
        rider,
      };
    });

    return res.status(200).json({
      success: true,
      message: "User converted to RIDER and rider profile created successfully",
      user: result.updatedUser,
      rider: result.rider,
    });
  } catch (error) {
    console.error("Make rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to make user rider",
    });
  }
};







const approveShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.verificationStatus === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Shop is already approved",
      });
    }

    if (shop.verificationStatus === "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Suspended shop cannot be approved directly",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        verificationStatus: "APPROVED",
        rejectionReason: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop approved successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Approve shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve shop",
    });
  }
};




const rejectShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.verificationStatus === "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Shop is already rejected",
      });
    }

    if (shop.verificationStatus === "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Suspended shop cannot be rejected directly",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        verificationStatus: "REJECTED",
        rejectionReason: reason.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop rejected successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Reject shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject shop",
    });
  }
};








const suspendShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Suspension reason is required",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.verificationStatus === "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Shop is already suspended",
      });
    }

    if (shop.verificationStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only an approved shop can be suspended",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        verificationStatus: "SUSPENDED",
        rejectionReason: reason.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop suspended successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Suspend shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to suspend shop",
    });
  }
};









const reactivateShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.verificationStatus !== "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Only a suspended shop can be reactivated",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        verificationStatus: "APPROVED",
        rejectionReason: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop reactivated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Reactivate shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reactivate shop",
    });
  }
};











const approveRider = async (req, res) => {
  try {
    const { riderId } = req.params;

    const rider = await prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    if (rider.verificationStatus === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Rider is already approved",
      });
    }

    if (rider.verificationStatus === "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Suspended rider cannot be approved directly",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: {
        id: riderId,
      },
      data: {
        verificationStatus: "APPROVED",
        rejectionReason: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Rider approved successfully",
      rider: updatedRider,
    });
  } catch (error) {
    console.error("Approve rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve rider",
    });
  }
};








const rejectRider = async (req, res) => {
  try {
    const { riderId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const rider = await prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    if (rider.verificationStatus === "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Rider is already rejected",
      });
    }

    if (rider.verificationStatus === "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Suspended rider cannot be rejected directly",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: {
        id: riderId,
      },
      data: {
        verificationStatus: "REJECTED",
        rejectionReason: reason.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Rider rejected successfully",
      rider: updatedRider,
    });
  } catch (error) {
    console.error("Reject rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject rider",
    });
  }
};














const suspendRider = async (req, res) => {
  try {
    const { riderId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Suspension reason is required",
      });
    }

    const rider = await prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    if (rider.verificationStatus === "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Rider is already suspended",
      });
    }

    if (rider.verificationStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only an approved rider can be suspended",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: {
        id: riderId,
      },
      data: {
        verificationStatus: "SUSPENDED",
        rejectionReason: reason.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Rider suspended successfully",
      rider: updatedRider,
    });
  } catch (error) {
    console.error("Suspend rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to suspend rider",
    });
  }
};












const reactivateRider = async (req, res) => {
  try {
    const { riderId } = req.params;

    const rider = await prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    if (rider.verificationStatus !== "SUSPENDED") {
      return res.status(400).json({
        success: false,
        message: "Only a suspended rider can be reactivated",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: {
        id: riderId,
      },
      data: {
        verificationStatus: "APPROVED",
        rejectionReason: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Rider reactivated successfully",
      rider: updatedRider,
    });
  } catch (error) {
    console.error("Reactivate rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reactivate rider",
    });
  }
};













// GET SHOPS - ADMIN
const getAdminShops = async (req, res) => {
  try {
    const {
      status = "PENDING",
      page = 1,
      limit = 10,
    } = req.query;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop status",
      });
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      verificationStatus: status,
    };

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
      }),

      prisma.shop.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      status,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
      shops,
    });
  } catch (error) {
    console.error("Get admin shops error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
};


























// GET ORDERS - ADMIN
const getAdminOrders = async (req, res) => {
  try {
    const {
      status = "ALL",
      page = 1,
      limit = 10,
    } = req.query;

    const allowedStatuses = [
      "ALL",
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = status === "ALL"
      ? {}
      : {
          status,
        };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },

          shop: {
            select: {
              id: true,
              name: true,
              slug: true,
              phone: true,
            },
          },

          items: {
            select: {
              id: true,
              productId: true,
              productName: true,
              unitPrice: true,
              quantity: true,
              lineTotal: true,
            },
          },

          payment: {
            select: {
              id: true,
              provider: true,
              method: true,
              amount: true,
              refundedAmount: true,
              currency: true,
              providerOrderId: true,
              providerPaymentId: true,
              status: true,
              paidAt: true,
              failedAt: true,
              refundedAt: true,
            },
          },

          deliveries: {
            select: {
              id: true,
              riderId: true,
              status: true,
              deliveryFee: true,
              riderEarning: true,
              assignedAt: true,
              acceptedAt: true,
              pickedUpAt: true,
              deliveredAt: true,
              rider: {
                select: {
                  id: true,
                  vehicleType: true,
                  status: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),

      prisma.order.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      status,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
      orders,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};










// GET SINGLE SHOP - ADMIN
const getAdminShopById = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
    console.error("Get admin shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
};



















// GET RIDERS - ADMIN
const getAdminRiders = async (req, res) => {
  try {
    const {
      status = "PENDING",
      page = 1,
      limit = 10,
    } = req.query;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rider status",
      });
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      verificationStatus: status,
    };

    const [riders, total] = await Promise.all([
      prisma.rider.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),

      prisma.rider.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      status,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
      riders,
    });
  } catch (error) {
    console.error("Get admin riders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch riders",
    });
  }
};
















// GET SINGLE RIDER - ADMIN
const getAdminRiderById = async (req, res) => {
  try {
    const { riderId } = req.params;

    const rider = await prisma.rider.findUnique({
      where: {
        id: riderId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    return res.status(200).json({
      success: true,
      rider,
    });
  } catch (error) {
    console.error("Get admin rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rider",
    });
  }
};














const updateAdminRider = async (req, res) => {
  try {
    const { riderId } = req.params;
    const { vehicleType, status, isActive } = req.body;

    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      include: {
        user: true,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

   const riderStatuses = ["AVAILABLE", "OFFLINE"];

    if (status !== undefined && !riderStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rider status",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: { id: riderId },
      data: {
        ...(vehicleType !== undefined && { vehicleType }),
        ...(status !== undefined && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    let updatedUser = updatedRider.user;

    if (isActive !== undefined) {
      updatedUser = await prisma.user.update({
        where: { id: rider.userId },
        data: { isActive },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rider updated successfully",
      rider: {
        ...updatedRider,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Update admin rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update rider",
    });
  }
};














const updateAdminShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const {
      name,
      slug,
      phone,
      address,
      latitude,
      longitude,
    } = req.body;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(slug !== undefined && { slug: slug.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(address !== undefined && { address: address.trim() }),
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
    console.error("Update admin shop error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Shop slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update shop",
    });
  }
};













const deleteAdminShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (!shop.isActive) {
      return res.status(400).json({
        success: false,
        message: "Shop is already inactive",
      });
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        isActive: false,
        isOpen: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Shop deactivated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Deactivate admin shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate shop",
    });
  }
};















const deleteAdminRider = async (req, res) => {
  try {
    const { riderId } = req.params;

    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Rider ko inactive/offline rakho
      await tx.rider.update({
        where: { id: riderId },
        data: {
          status: "OFFLINE",
        },
      });

      // User account deactivate karo
      await tx.user.update({
        where: { id: rider.userId },
        data: {
          isActive: false,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Rider deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate admin rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate rider",
    });
  }
};














const getAdminRefundRequests = async (req, res) => {
  try {
    const {
      status = "PENDING",
      page = 1,
      limit = 10,
    } = req.query;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "PROCESSING",
      "COMPLETED",
      "FAILED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund request status",
      });
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      status,
    };

    const [refundRequests, total] = await Promise.all([
      prisma.refundRequest.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              subtotal: true,
              deliveryFee: true,
              platformFee: true,
              total: true,
              paymentMethod: true,
              paymentStatus: true,
              status: true,
              createdAt: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      }),

      prisma.refundRequest.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      status,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
      refundRequests,
    });
  } catch (error) {
    console.error("Get admin refund requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch refund requests",
    });
  }
};












const approveRefundRequest = async (req, res) => {
  try {
    const { refundRequestId } = req.params;
    const adminId = req.user.userId;

    const refundRequest = await prisma.refundRequest.findUnique({
      where: { id: refundRequestId },
      include: {
        order: {
          include: {
            payment: true,
          },
        },
      },
    });

    if (!refundRequest) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    if (refundRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Refund request cannot be approved because its current status is ${refundRequest.status}`,
      });
    }

    const order = refundRequest.order;
    const payment = order?.payment;

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Associated order not found",
      });
    }

    if (order.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "Only online payments can be refunded through Razorpay",
      });
    }

    if (
  !payment ||
  !["PAID", "PARTIALLY_REFUNDED"].includes(payment.status)
) {
      return res.status(400).json({
        success: false,
        message: "Order payment is not in PAID status",
      });
    }

    if (!payment.providerPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment ID not found",
      });
    }

    const refundAmount = Number(refundRequest.amount);
const paymentAmount = Number(payment.amount);
const alreadyRefunded = Number(payment.refundedAmount);

const remainingRefundable = paymentAmount - alreadyRefunded;

    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund amount",
      });
    }

    if (refundAmount > remainingRefundable) {
  return res.status(400).json({
    success: false,
    message: "Refund amount cannot exceed the remaining refundable amount",
  });
}

    // Mark request as PROCESSING before calling Razorpay
    const processingRequest = await prisma.refundRequest.updateMany({
      where: {
        id: refundRequestId,
        status: "PENDING",
      },
      data: {
        status: "PROCESSING",
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    if (processingRequest.count !== 1) {
      return res.status(400).json({
        success: false,
        message: "Refund request is already being processed",
      });
    }

    try {
      const refund = await refundRazorpayPayment({
        paymentId: payment.providerPaymentId,
        amount: refundAmount,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          refundRequestId: refundRequest.id,
        },
      });


await prisma.$transaction(async (tx) => {
  // Lock payment row and get latest refund amount
  const lockedPayment = await tx.$queryRaw`
    SELECT
      "id",
      "amount",
      "refundedAmount"
    FROM "Payment"
    WHERE "id" = ${payment.id}
    FOR UPDATE
  `;

  if (lockedPayment.length === 0) {
    throw new Error("PAYMENT_NOT_FOUND");
  }

  const latestPaymentAmount = Number(lockedPayment[0].amount);
  const latestRefundedAmount = Number(
    lockedPayment[0].refundedAmount
  );

  const latestRemainingRefundable =
    latestPaymentAmount - latestRefundedAmount;

  if (refundAmount > latestRemainingRefundable) {
    throw new Error("REFUND_AMOUNT_EXCEEDS_REMAINING");
  }

  const newRefundedAmount =
    latestRefundedAmount + refundAmount;

  const isFullyRefunded =
    newRefundedAmount >= latestPaymentAmount;

  await tx.refundRequest.update({
    where: { id: refundRequestId },
    data: {
      status: "COMPLETED",
      providerRefundId: refund.id,
    },
  });

  await tx.payment.update({
    where: { id: payment.id },
    data: {
      refundedAmount: newRefundedAmount,
      status: isFullyRefunded
        ? "REFUNDED"
        : "PARTIALLY_REFUNDED",
      refundedAt: isFullyRefunded ? new Date() : null,
    },
  });

  await tx.ledgerEntry.create({
    data: {
      shopId: order.shopId,
      orderId: order.id,
      paymentId: payment.id,
      type: "REFUND",
      direction: "DEBIT",
      amount: refundAmount,
      description: `Customer refund for order ${order.orderNumber}`,
      referenceId: refund.id,
      idempotencyKey: `REFUND:${refund.id}`,
    },
  });
});







      return res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        refundRequest: {
          id: refundRequest.id,
          status: "COMPLETED",
          providerRefundId: refund.id,
          amount: refundAmount,
        },
      });
    } catch (refundError) {
  console.error("Razorpay refund processing error:", refundError);

  if (refundError.message === "PAYMENT_NOT_FOUND") {
    return res.status(400).json({
      success: false,
      message: "Payment not found",
    });
  }

  if (refundError.message === "REFUND_AMOUNT_EXCEEDS_REMAINING") {
    return res.status(400).json({
      success: false,
      message: "Refund amount exceeds the remaining refundable amount",
    });
  }

  await prisma.refundRequest.update({
    where: { id: refundRequestId },
    data: { status: "FAILED" },
  });

  return res.status(502).json({
    success: false,
    message: "Razorpay refund failed",
  });
}
  } catch (error) {
    console.error("Approve refund request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process refund request",
    });
  }
};















const rejectRefundRequest = async (req, res) => {
  try {
    const { refundRequestId } = req.params;
    const adminId = req.user.userId;
    const { rejectionReason } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const refundRequest = await prisma.refundRequest.findUnique({
      where: { id: refundRequestId },
    });

    if (!refundRequest) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    if (refundRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Refund request cannot be rejected because its current status is ${refundRequest.status}`,
      });
    }

    const updatedRefundRequest = await prisma.refundRequest.update({
      where: {
        id: refundRequestId,
      },
      data: {
        status: "REJECTED",
        reviewedBy: adminId,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Refund request rejected successfully",
      refundRequest: updatedRefundRequest,
    });
  } catch (error) {
    console.error("Reject refund request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject refund request",
    });
  }
};
















const createAdminRider = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      vehicleType,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this phone number already exists",
      });
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.trim() },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "A user with this email already exists",
        });
      }
    }

    const rider = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          role: "RIDER",
          isActive: true,
        },
      });

      const riderProfile = await tx.rider.create({
        data: {
          userId: user.id,
          vehicleType: vehicleType || null,
          status: "OFFLINE",
          verificationStatus: "APPROVED",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return riderProfile;
    });

    return res.status(201).json({
      success: true,
      message: "Rider created successfully",
      rider,
    });
  } catch (error) {
    console.error("Create admin rider error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create rider",
    });
  }
};




















// CREATE CASH PAYOUT - ADMIN
// CREATE CASH PAYOUT - ADMIN
const createCashSellerPayout = async (req, res) => {
  try {
    const {
      shopId,
      amount,
      periodStart,
      periodEnd,
      referenceId,
      description,
      idempotencyKey,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop ID is required",
      });
    }

    const payoutAmount = Number(amount);

    if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payout amount must be greater than 0",
      });
    }

    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        message: "periodStart and periodEnd are required",
      });
    }

    if (!idempotencyKey || !idempotencyKey.trim()) {
      return res.status(400).json({
        success: false,
        message: "Idempotency key is required",
      });
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payout period dates",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "periodStart cannot be after periodEnd",
      });
    }

    // -----------------------------
    // CHECK SHOP
    // -----------------------------

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
      select: {
        id: true,
        name: true,
        verificationStatus: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // -----------------------------
    // CHECK DUPLICATE REQUEST
    // -----------------------------

    const existingPayout = await prisma.sellerPayout.findUnique({
      where: {
        idempotencyKey: idempotencyKey.trim(),
      },
    });

    if (existingPayout) {
      return res.status(409).json({
        success: false,
        message: "A payout with this idempotency key already exists",
        payout: existingPayout,
      });
    }

    // -----------------------------
    // CREATE PAYOUT + LEDGER
    // ATOMIC TRANSACTION
    // -----------------------------

    const result = await prisma.$transaction(async (tx) => {
      // Lock this shop row.
      // This serializes concurrent seller payouts
      // for the same shop.
      await tx.$queryRaw`
        SELECT "id"
        FROM "Shop"
        WHERE "id" = ${shopId}
        FOR UPDATE
      `;

      // -----------------------------
      // CALCULATE SELLER PAYABLE
      // -----------------------------

      const deliveredOrders = await tx.order.findMany({
        where: {
          shopId,
          status: "DELIVERED",
        },
        select: {
          sellerPayableAmount: true,
        },
      });

      const totalSellerEarnings = deliveredOrders.reduce(
        (sum, order) => sum + Number(order.sellerPayableAmount || 0),
        0
      );

      // -----------------------------
      // CALCULATE ALREADY PAID
      // -----------------------------

      const previousPayouts = await tx.sellerPayout.findMany({
        where: {
          shopId,
          status: {
            in: ["PAID", "PROCESSING"],
          },
        },
        select: {
          amount: true,
        },
      });

      const alreadyPaid = previousPayouts.reduce(
        (sum, payout) => sum + Number(payout.amount || 0),
        0
      );

      const pendingPayout = totalSellerEarnings - alreadyPaid;

      // -----------------------------
      // PREVENT OVER-PAYMENT
      // -----------------------------

      if (payoutAmount > pendingPayout) {
        const error = new Error("INSUFFICIENT_BALANCE");

        error.balance = {
          totalSellerEarnings,
          alreadyPaid,
          pendingPayout,
        };

        throw error;
      }

      // -----------------------------
      // CREATE PAYOUT
      // -----------------------------

      const payout = await tx.sellerPayout.create({
        data: {
          shopId,
          amount: payoutAmount,
          currency: "INR",
          periodStart: startDate,
          periodEnd: endDate,
          status: "PAID",
          provider: "CASH",
          providerPayoutId: null,
          paidAt: new Date(),
          referenceId: referenceId?.trim() || null,
          idempotencyKey: idempotencyKey.trim(),
        },
      });

      // -----------------------------
      // CREATE LEDGER ENTRY
      // -----------------------------

      const ledgerEntry = await tx.ledgerEntry.create({
        data: {
          shopId,
          payoutId: payout.id,
          type: "PAYOUT",
          direction: "DEBIT",
          amount: payoutAmount,
          description:
            description?.trim() ||
            `Cash payout to seller for ${startDate.toISOString()} to ${endDate.toISOString()}`,
          referenceId: referenceId?.trim() || payout.id,
          idempotencyKey: `PAYOUT:${payout.id}`,
        },
      });

      return {
        payout,
        ledgerEntry,
        totalSellerEarnings,
        alreadyPaid,
        pendingPayout,
      };
    });

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.status(201).json({
      success: true,
      message: "Cash seller payout recorded successfully",
      shop: {
        id: shop.id,
        name: shop.name,
      },
      payout: result.payout,
      ledgerEntry: result.ledgerEntry,
      balance: {
        totalSellerEarnings: result.totalSellerEarnings,
        previouslyPaid: result.alreadyPaid,
        payoutAmount,
        remainingPendingPayout:
          result.pendingPayout - payoutAmount,
      },
    });
  } catch (error) {
    if (error.message === "INSUFFICIENT_BALANCE") {
      return res.status(400).json({
        success: false,
        message: "Payout amount exceeds the seller's pending balance",
        balance: error.balance,
      });
    }

    console.error("Create cash seller payout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create cash seller payout",
    });
  }
};



















// GET SELLER PAYOUTS - ADMIN
const getAdminSellerPayouts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        skip,
        take: limitNumber,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          payouts: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              amount: true,
              currency: true,
              status: true,
              provider: true,
              providerPayoutId: true,
              paidAt: true,
              createdAt: true,
            },
          },
          ledgerEntries: {
            select: {
              amount: true,
              direction: true,
            },
          },
        },
      }),

      prisma.shop.count(),
    ]);

    const sellerPayouts = shops.map((shop) => {
      let totalEarned = 0;
      let totalPaidOut = 0;

      for (const entry of shop.ledgerEntries) {
        const amount = Number(entry.amount || 0);

        if (entry.direction === "CREDIT") {
          totalEarned += amount;
        }

        if (entry.direction === "DEBIT") {
          totalPaidOut += amount;
        }
      }

      const pendingBalance =
        totalEarned - totalPaidOut;

      return {
        shopId: shop.id,

        shop: {
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          phone: shop.phone,
        },

        verificationStatus:
          shop.verificationStatus,

        balance: {
          totalEarned: Number(
            totalEarned.toFixed(2)
          ),

          totalPaidOut: Number(
            totalPaidOut.toFixed(2)
          ),

          pendingBalance: Number(
            Math.max(
              pendingBalance,
              0
            ).toFixed(2)
          ),
        },

        payouts: shop.payouts,
      };
    });

    const totalPages = Math.ceil(
      total / limitNumber
    );

    return res.status(200).json({
      success: true,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage:
          pageNumber < totalPages,
        hasPreviousPage:
          pageNumber > 1,
      },

      shops: sellerPayouts,
    });
  } catch (error) {
    console.error(
      "Get admin seller payouts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seller payouts",
    });
  }
};









const createRiderCashPayout = async (req, res) => {
  try {
    const { riderId, amount, periodStart, periodEnd, referenceId } = req.body;

    if (!riderId || amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "riderId and amount are required",
      });
    }

    const payoutAmount = Number(amount);

    if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Lock rider row so concurrent payouts for the same rider
      // are processed one at a time.
      await tx.$queryRaw`
        SELECT "id"
        FROM "Rider"
        WHERE "id" = ${riderId}
        FOR UPDATE
      `;

      const rider = await tx.rider.findUnique({
        where: {
          id: riderId,
        },
      });

      if (!rider) {
        throw new Error("RIDER_NOT_FOUND");
      }

      const ledgerEntries = await tx.riderLedgerEntry.findMany({
        where: {
          riderId: rider.id,
        },
        select: {
          amount: true,
          direction: true,
        },
      });

      let totalCredits = 0;
      let totalDebits = 0;

      for (const entry of ledgerEntries) {
        const value = Number(entry.amount);

        if (entry.direction === "CREDIT") {
          totalCredits += value;
        } else if (entry.direction === "DEBIT") {
          totalDebits += value;
        }
      }

      const pendingBalance = totalCredits - totalDebits;

      if (payoutAmount > pendingBalance) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const idempotencyKey =
        `RIDER_CASH_PAYOUT:${rider.id}:` +
        `${Date.now()}:${Math.random().toString(36).slice(2)}`;

      const payout = await tx.riderPayout.create({
        data: {
          riderId: rider.id,
          amount: payoutAmount,
          currency: "INR",
          periodStart: periodStart
            ? new Date(periodStart)
            : new Date(),
          periodEnd: periodEnd
            ? new Date(periodEnd)
            : new Date(),
          status: "PAID",
          provider: "CASH",
          paidAt: new Date(),
          referenceId: referenceId || null,
          idempotencyKey,
        },
      });

      const ledgerEntry = await tx.riderLedgerEntry.create({
        data: {
          riderId: rider.id,
          payoutId: payout.id,
          type: "PAYOUT",
          amount: payoutAmount,
          description: "Cash payout to rider",
          referenceId: referenceId || payout.id,
          direction: "DEBIT",
          idempotencyKey: `RIDER_PAYOUT:${payout.id}`,
        },
      });

      return {
        payout,
        ledgerEntry,
        pendingBalanceAfterPayout: pendingBalance - payoutAmount,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Rider cash payout recorded successfully",
      payout: result.payout,
      ledgerEntry: result.ledgerEntry,
      pendingBalanceAfterPayout: result.pendingBalanceAfterPayout,
    });
  } catch (error) {
    if (error.message === "RIDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    if (error.message === "INSUFFICIENT_BALANCE") {
      return res.status(400).json({
        success: false,
        message: "Payout amount exceeds rider pending balance",
      });
    }

    console.error("Create rider cash payout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create rider cash payout",
    });
  }
};












// GET RIDER PAYOUTS - ADMIN
const getAdminRiderPayouts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [riders, total] = await Promise.all([
      prisma.rider.findMany({
        skip,
        take: limitNumber,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },

          ledgerEntries: {
            select: {
              amount: true,
              direction: true,
            },
          },

          payouts: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              amount: true,
              currency: true,
              status: true,
              provider: true,
              providerPayoutId: true,
              paidAt: true,
              createdAt: true,
            },
          },
        },
      }),

      prisma.rider.count(),
    ]);

    const riderPayouts = riders.map((rider) => {
      let totalEarned = 0;
      let totalPaidOut = 0;

      for (const entry of rider.ledgerEntries) {
        const amount = Number(entry.amount || 0);

        if (entry.direction === "CREDIT") {
          totalEarned += amount;
        }

        if (entry.direction === "DEBIT") {
          totalPaidOut += amount;
        }
      }

      const pendingBalance =
        totalEarned - totalPaidOut;

      return {
        riderId: rider.id,

        rider: {
          id: rider.user.id,
          name: rider.user.name,
          phone: rider.user.phone,
          email: rider.user.email,
        },

        riderStatus: rider.status,
        verificationStatus:
          rider.verificationStatus,

        balance: {
          totalEarned: Number(
            totalEarned.toFixed(2)
          ),

          totalPaidOut: Number(
            totalPaidOut.toFixed(2)
          ),

          pendingBalance: Number(
            Math.max(
              pendingBalance,
              0
            ).toFixed(2)
          ),
        },

        payouts: rider.payouts,
      };
    });

    const totalPages = Math.ceil(
      total / limitNumber
    );

    return res.status(200).json({
      success: true,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage:
          pageNumber < totalPages,
        hasPreviousPage:
          pageNumber > 1,
      },

      riders: riderPayouts,
    });
  } catch (error) {
    console.error(
      "Get admin rider payouts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch rider payouts",
    });
  }
};













// TOGGLE PRODUCT FEATURED - ADMIN
const toggleProductFeatured = async (req, res) => {
  try {
    const { productId } = req.params;
    const { isFeatured } = req.body;

    // Validate input
    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    // Check product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update featured status
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isFeatured,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: isFeatured
        ? "Product added to featured products"
        : "Product removed from featured products",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Toggle product featured error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product featured status",
    });
  }
};



























// GET PRODUCTS - ADMIN
const getAdminProducts = async (req, res) => {
  try {
    const {
      status = "ALL",
      page = 1,
      limit = 10,
    } = req.query;

    const allowedStatuses = [
      "ALL",
      "AVAILABLE",
      "UNAVAILABLE",
      "FEATURED",
      "NOT_FEATURED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product status",
      });
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    let where = {};

    if (status === "AVAILABLE") {
      where.isAvailable = true;
    }

    if (status === "UNAVAILABLE") {
      where.isAvailable = false;
    }

    if (status === "FEATURED") {
      where.isFeatured = true;
    }

    if (status === "NOT_FEATURED") {
      where.isFeatured = false;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNumber,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          shop: {
            select: {
              id: true,
              name: true,
              slug: true,
              phone: true,
              isOpen: true,
              isActive: true,
              verificationStatus: true,
            },
          },

          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true,
            },
          },

          inventory: {
            select: {
              id: true,
              quantity: true,
              reservedQuantity: true,
              lowStockThreshold: true,
              updatedAt: true,
            },
          },
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      status,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },

      products,
    });
  } catch (error) {
    console.error("Get admin products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};















// GET TOTAL PLATFORM SALES - ADMIN
const getAdminTotalPlatformSales = async (req, res) => {
  try {
    const result = await prisma.order.aggregate({
      where: {
        status: "DELIVERED",
      },
      _sum: {
        subtotal: true,
      },
      _count: {
        id: true,
      },
    });

    const totalPlatformSales = Number(
      result._sum.subtotal || 0
    );

    return res.status(200).json({
      success: true,
      totalPlatformSales: Number(
        totalPlatformSales.toFixed(2)
      ),
      totalDeliveredOrders: result._count.id,
    });
  } catch (error) {
    console.error(
      "Get admin total platform sales error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch total platform sales",
    });
  }
};

















// GET TOTAL COMMISSION - ADMIN
const getAdminTotalCommission = async (req, res) => {
  try {
    const result = await prisma.order.aggregate({
      where: {
        status: "DELIVERED",
      },
      _sum: {
        commissionAmount: true,
      },
    });

    const totalCommission = Number(
      result._sum.commissionAmount || 0
    );

    return res.status(200).json({
      success: true,
      totalCommission: Number(
        totalCommission.toFixed(2)
      ),
    });
  } catch (error) {
    console.error(
      "Get admin total commission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch total commission",
    });
  }
};


























// GET TOTAL SELLER PAYOUTS - ADMIN
const getAdminTotalSellerPayouts = async (req, res) => {
  try {
    const result = await prisma.sellerPayout.aggregate({
      where: {
        status: {
          in: ["PAID", "PROCESSING"],
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalSellerPayouts = Number(
      result._sum.amount || 0
    );

    return res.status(200).json({
      success: true,
      totalSellerPayouts: Number(
        totalSellerPayouts.toFixed(2)
      ),
      totalSellerPayoutCount: result._count.id,
    });
  } catch (error) {
    console.error(
      "Get admin total seller payouts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch total seller payouts",
    });
  }
};


















// GET TOTAL RIDER PAYOUTS - ADMIN
const getAdminTotalRiderPayouts = async (req, res) => {
  try {
    const result = await prisma.riderPayout.aggregate({
      where: {
        status: {
          in: ["PAID", "PROCESSING"],
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRiderPayouts = Number(
      result._sum.amount || 0
    );

    return res.status(200).json({
      success: true,
      totalRiderPayouts: Number(
        totalRiderPayouts.toFixed(2)
      ),
      totalRiderPayoutCount: result._count.id,
    });
  } catch (error) {
    console.error(
      "Get admin total rider payouts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch total rider payouts",
    });
  }
};














// GET TOTAL REFUNDED - ADMIN
const getAdminTotalRefunded = async (req, res) => {
  try {
    const result = await prisma.payment.aggregate({
      where: {
        refundedAmount: {
          gt: 0,
        },
      },
      _sum: {
        refundedAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRefunded = Number(
      result._sum.refundedAmount || 0
    );

    return res.status(200).json({
      success: true,
      totalRefunded: Number(
        totalRefunded.toFixed(2)
      ),
      refundedPaymentCount: result._count.id,
    });
  } catch (error) {
    console.error(
      "Get admin total refunded error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch total refunded amount",
    });
  }
};













// GET NET PLATFORM EARNINGS - ADMIN
const getAdminNetPlatformEarnings = async (req, res) => {
  try {
    const [commissionResult, refundResult] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: "DELIVERED",
        },
        _sum: {
          commissionAmount: true,
        },
      }),

      prisma.payment.aggregate({
        where: {
          refundedAmount: {
            gt: 0,
          },
        },
        _sum: {
          refundedAmount: true,
        },
      }),
    ]);

    const totalCommission = Number(
      commissionResult._sum.commissionAmount || 0
    );

    const totalRefunded = Number(
      refundResult._sum.refundedAmount || 0
    );

    const netPlatformEarnings =
      totalCommission - totalRefunded;

    return res.status(200).json({
      success: true,
      totalCommission: Number(
        totalCommission.toFixed(2)
      ),
      totalRefunded: Number(
        totalRefunded.toFixed(2)
      ),
      netPlatformEarnings: Number(
        netPlatformEarnings.toFixed(2)
      ),
    });
  } catch (error) {
    console.error(
      "Get admin net platform earnings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch net platform earnings",
    });
  }
};












// GET WEEKLY PLATFORM EARNINGS - ADMIN
const getAdminWeeklyEarnings = async (req, res) => {
  try {
    const now = new Date();

    // Start of current week - Monday
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();

    const diff = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const [salesResult, commissionResult, refundResult] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            status: "DELIVERED",
            createdAt: {
              gte: startOfWeek,
              lt: endOfWeek,
            },
          },
          _sum: {
            subtotal: true,
          },
          _count: {
            id: true,
          },
        }),

        prisma.order.aggregate({
          where: {
            status: "DELIVERED",
            createdAt: {
              gte: startOfWeek,
              lt: endOfWeek,
            },
          },
          _sum: {
            commissionAmount: true,
          },
        }),

        prisma.payment.aggregate({
          where: {
            refundedAmount: {
              gt: 0,
            },
            updatedAt: {
              gte: startOfWeek,
              lt: endOfWeek,
            },
          },
          _sum: {
            refundedAmount: true,
          },
        }),
      ]);

    const totalSales = Number(
      salesResult._sum.subtotal || 0
    );

    const totalCommission = Number(
      commissionResult._sum.commissionAmount || 0
    );

    const totalRefunded = Number(
      refundResult._sum.refundedAmount || 0
    );

    const netPlatformEarnings =
      totalCommission - totalRefunded;

    return res.status(200).json({
      success: true,

      period: {
        start: startOfWeek,
        end: endOfWeek,
      },

      totalSales: Number(totalSales.toFixed(2)),
      totalDeliveredOrders: salesResult._count.id,

      totalCommission: Number(
        totalCommission.toFixed(2)
      ),

      totalRefunded: Number(
        totalRefunded.toFixed(2)
      ),

      netPlatformEarnings: Number(
        netPlatformEarnings.toFixed(2)
      ),
    });
  } catch (error) {
    console.error(
      "Get admin weekly earnings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly platform earnings",
    });
  }
};














// GET MONTHLY PLATFORM EARNINGS - ADMIN
const getAdminMonthlyEarnings = async (req, res) => {
  try {
    const now = new Date();

    // Start of current month
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // Start of next month
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const [salesResult, commissionResult, refundResult] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            status: "DELIVERED",
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
          _sum: {
            subtotal: true,
          },
          _count: {
            id: true,
          },
        }),

        prisma.order.aggregate({
          where: {
            status: "DELIVERED",
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
          _sum: {
            commissionAmount: true,
          },
        }),

        prisma.payment.aggregate({
          where: {
            refundedAmount: {
              gt: 0,
            },
            updatedAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
          _sum: {
            refundedAmount: true,
          },
        }),
      ]);

    const totalSales = Number(
      salesResult._sum.subtotal || 0
    );

    const totalCommission = Number(
      commissionResult._sum.commissionAmount || 0
    );

    const totalRefunded = Number(
      refundResult._sum.refundedAmount || 0
    );

    const netPlatformEarnings =
      totalCommission - totalRefunded;

    return res.status(200).json({
      success: true,

      period: {
        start: startOfMonth,
        end: endOfMonth,
      },

      totalSales: Number(totalSales.toFixed(2)),

      totalDeliveredOrders: salesResult._count.id,

      totalCommission: Number(
        totalCommission.toFixed(2)
      ),

      totalRefunded: Number(
        totalRefunded.toFixed(2)
      ),

      netPlatformEarnings: Number(
        netPlatformEarnings.toFixed(2)
      ),
    });
  } catch (error) {
    console.error(
      "Get admin monthly earnings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly platform earnings",
    });
  }
};














// GET SHOP-WISE EARNINGS - ADMIN
// GET SHOP-WISE EARNINGS WITH DATE FILTER - ADMIN
const getAdminShopEarnings = async (req, res) => {
  try {
    const {
      period = "all",
      startDate,
      endDate,
    } = req.query;

    const allowedPeriods = [
      "all",
      "week",
      "month",
      "custom",
    ];

    if (!allowedPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid period",
      });
    }

    let dateFilter = {};

    const now = new Date();

    // CURRENT WEEK - MONDAY TO NEXT MONDAY
    if (period === "week") {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();

      const diff = day === 0 ? 6 : day - 1;

      startOfWeek.setDate(
        startOfWeek.getDate() - diff
      );

      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(
        endOfWeek.getDate() + 7
      );

      dateFilter = {
        gte: startOfWeek,
        lt: endOfWeek,
      };
    }

    // CURRENT MONTH
    if (period === "month") {
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

      dateFilter = {
        gte: startOfMonth,
        lt: endOfMonth,
      };
    }

    // CUSTOM DATE RANGE
    if (period === "custom") {
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message:
            "startDate and endDate are required for custom period",
        });
      }

      const customStartDate = new Date(startDate);
      const customEndDate = new Date(endDate);

      if (
        Number.isNaN(customStartDate.getTime()) ||
        Number.isNaN(customEndDate.getTime())
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid startDate or endDate",
        });
      }

      customStartDate.setHours(0, 0, 0, 0);

      customEndDate.setHours(23, 59, 59, 999);

      if (customStartDate > customEndDate) {
        return res.status(400).json({
          success: false,
          message:
            "startDate cannot be greater than endDate",
        });
      }

      dateFilter = {
        gte: customStartDate,
        lte: customEndDate,
      };
    }

    const orderWhere =
      period === "all"
        ? {
            status: "DELIVERED",
          }
        : {
            status: "DELIVERED",
            createdAt: dateFilter,
          };

    const shops = await prisma.shop.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,

        orders: {
          where: orderWhere,

          select: {
            subtotal: true,
            commissionAmount: true,
            sellerPayableAmount: true,
          },
        },
      },
    });

    const shopEarnings = await Promise.all(
      shops.map(async (shop) => {
        const totalSales = shop.orders.reduce(
          (sum, order) =>
            sum + Number(order.subtotal || 0),
          0
        );

        const totalCommission = shop.orders.reduce(
          (sum, order) =>
            sum + Number(order.commissionAmount || 0),
          0
        );

        const totalSellerEarnings = shop.orders.reduce(
          (sum, order) =>
            sum + Number(
              order.sellerPayableAmount || 0
            ),
          0
        );

        const payoutWhere = {
          shopId: shop.id,
          status: {
            in: ["PAID", "PROCESSING"],
          },
        };

        if (period !== "all") {
          payoutWhere.createdAt = dateFilter;
        }

        const paidPayoutResult =
          await prisma.sellerPayout.aggregate({
            where: payoutWhere,
            _sum: {
              amount: true,
            },
          });

        const alreadyPaid = Number(
          paidPayoutResult._sum.amount || 0
        );

        const pendingPayout =
          totalSellerEarnings - alreadyPaid;

        return {
          shopId: shop.id,
          shopName: shop.name,
          slug: shop.slug,
          phone: shop.phone,

          totalSales: Number(
            totalSales.toFixed(2)
          ),

          totalDeliveredOrders:
            shop.orders.length,

          totalCommission: Number(
            totalCommission.toFixed(2)
          ),

          totalSellerEarnings: Number(
            totalSellerEarnings.toFixed(2)
          ),

          alreadyPaid: Number(
            alreadyPaid.toFixed(2)
          ),

          pendingPayout: Number(
            Math.max(
              pendingPayout,
              0
            ).toFixed(2)
          ),
        };
      })
    );

    return res.status(200).json({
      success: true,

      period,

      ...(period === "custom"
        ? {
            startDate,
            endDate,
          }
        : {}),

      shops: shopEarnings,
    });
  } catch (error) {
    console.error(
      "Get admin shop earnings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop earnings",
    });
  }
};
















// GET SINGLE SELLER PAYOUT DETAILS - ADMIN
const getAdminSellerPayoutDetails = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop ID is required",
      });
    }

    // ---------------------------------
    // GET SHOP
    // ---------------------------------

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
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
        isActive: true,
        verificationStatus: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // ---------------------------------
    // GET DELIVERED ORDERS
    // ---------------------------------

    const deliveredOrders = await prisma.order.findMany({
      where: {
        shopId,
        status: "DELIVERED",
      },
      select: {
        id: true,
        orderNumber: true,
        subtotal: true,
        commissionAmount: true,
        sellerPayableAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ---------------------------------
    // GET SELLER PAYOUTS
    // ---------------------------------

    const payouts = await prisma.sellerPayout.findMany({
      where: {
        shopId,
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
        idempotencyKey: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ---------------------------------
    // OVERALL TOTALS
    // ---------------------------------

    let totalSales = 0;
    let totalCommission = 0;
    let totalSellerEarnings = 0;

    for (const order of deliveredOrders) {
      totalSales += Number(order.subtotal || 0);
      totalCommission += Number(
        order.commissionAmount || 0
      );
      totalSellerEarnings += Number(
        order.sellerPayableAmount || 0
      );
    }

    let totalPaidOut = 0;

    for (const payout of payouts) {
      if (
        payout.status === "PAID" ||
        payout.status === "PROCESSING"
      ) {
        totalPaidOut += Number(payout.amount || 0);
      }
    }

    const pendingPayout = Math.max(
      totalSellerEarnings - totalPaidOut,
      0
    );

    // ---------------------------------
    // MONTHLY BREAKDOWN
    // ---------------------------------

    const monthlyMap = new Map();

    for (const order of deliveredOrders) {
      const date = new Date(order.createdAt);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${String(month).padStart(2, "0")}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          period: key,
          year,
          month,
          totalSales: 0,
          totalDeliveredOrders: 0,
          totalCommission: 0,
          totalSellerEarnings: 0,
        });
      }

      const monthly = monthlyMap.get(key);

      monthly.totalSales += Number(
        order.subtotal || 0
      );

      monthly.totalDeliveredOrders += 1;

      monthly.totalCommission += Number(
        order.commissionAmount || 0
      );

      monthly.totalSellerEarnings += Number(
        order.sellerPayableAmount || 0
      );
    }

    const monthly = Array.from(
      monthlyMap.values()
    )
      .map((item) => ({
        ...item,
        totalSales: Number(
          item.totalSales.toFixed(2)
        ),
        totalCommission: Number(
          item.totalCommission.toFixed(2)
        ),
        totalSellerEarnings: Number(
          item.totalSellerEarnings.toFixed(2)
        ),
      }))
      .sort((a, b) =>
        b.period.localeCompare(a.period)
      );

    // ---------------------------------
    // WEEKLY BREAKDOWN
    // ---------------------------------

    const weeklyMap = new Map();

    for (const order of deliveredOrders) {
      const date = new Date(order.createdAt);

      // Monday = start of week
      const day = date.getDay();

      const diff =
        day === 0
          ? -6
          : 1 - day;

      const weekStart = new Date(date);

      weekStart.setDate(
        date.getDate() + diff
      );

      weekStart.setHours(
        0,
        0,
        0,
        0
      );

      const weekEnd = new Date(weekStart);

      weekEnd.setDate(
        weekStart.getDate() + 6
      );

      weekEnd.setHours(
        23,
        59,
        59,
        999
      );

      const startKey =
        weekStart.toISOString().split("T")[0];

      const endKey =
        weekEnd.toISOString().split("T")[0];

      const key = `${startKey}_${endKey}`;

      if (!weeklyMap.has(key)) {
        weeklyMap.set(key, {
          periodStart: startKey,
          periodEnd: endKey,
          totalSales: 0,
          totalDeliveredOrders: 0,
          totalCommission: 0,
          totalSellerEarnings: 0,
        });
      }

      const weekly = weeklyMap.get(key);

      weekly.totalSales += Number(
        order.subtotal || 0
      );

      weekly.totalDeliveredOrders += 1;

      weekly.totalCommission += Number(
        order.commissionAmount || 0
      );

      weekly.totalSellerEarnings += Number(
        order.sellerPayableAmount || 0
      );
    }

    const weekly = Array.from(
      weeklyMap.values()
    )
      .map((item) => ({
        ...item,
        totalSales: Number(
          item.totalSales.toFixed(2)
        ),
        totalCommission: Number(
          item.totalCommission.toFixed(2)
        ),
        totalSellerEarnings: Number(
          item.totalSellerEarnings.toFixed(2)
        ),
      }))
      .sort((a, b) =>
        b.periodStart.localeCompare(
          a.periodStart
        )
      );

    // ---------------------------------
    // RESPONSE
    // ---------------------------------

    return res.status(200).json({
      success: true,

      shop,

      summary: {
        totalSales: Number(
          totalSales.toFixed(2)
        ),

        totalDeliveredOrders:
          deliveredOrders.length,

        totalCommission: Number(
          totalCommission.toFixed(2)
        ),

        totalSellerEarnings: Number(
          totalSellerEarnings.toFixed(2)
        ),

        totalPaidOut: Number(
          totalPaidOut.toFixed(2)
        ),

        pendingPayout: Number(
          pendingPayout.toFixed(2)
        ),
      },

      payouts: payouts.map((payout) => ({
        ...payout,
        amount: Number(
          payout.amount || 0
        ),
      })),

      weekly,

      monthly,
    });
  } catch (error) {
    console.error(
      "Get admin seller payout details error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch seller payout details",
    });
  }
};












// GET RIDER PAYOUT DETAILS - ADMIN
const getAdminRiderPayoutDetails = async (req, res) => {
  try {
    const { riderId } = req.params;

    if (!riderId) {
      return res.status(400).json({
        success: false,
        message: "Rider ID is required",
      });
    }

    const rider = await prisma.rider.findUnique({
      where: {
        id: riderId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },

        ledgerEntries: {
          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,
            deliveryId: true,
            payoutId: true,
            type: true,
            amount: true,
            description: true,
            referenceId: true,
            direction: true,
            createdAt: true,
          },
        },

        payouts: {
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
            idempotencyKey: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        deliveries: {
          where: {
            status: "DELIVERED",
          },

          select: {
            id: true,
            riderEarning: true,
            deliveredAt: true,
            createdAt: true,
          },

          orderBy: {
            deliveredAt: "asc",
          },
        },
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    // ---------------------------------------
    // OVERALL BALANCE
    // ---------------------------------------

    let totalEarned = 0;
    let totalPaidOut = 0;

    for (const entry of rider.ledgerEntries) {
      const amount = Number(entry.amount || 0);

      if (entry.direction === "CREDIT") {
        totalEarned += amount;
      }

      if (entry.direction === "DEBIT") {
        totalPaidOut += amount;
      }
    }

    const pendingBalance = Math.max(
      totalEarned - totalPaidOut,
      0
    );

    // ---------------------------------------
    // WEEKLY EARNINGS
    // ---------------------------------------

    const weeklyMap = {};

    for (const entry of rider.ledgerEntries) {
      if (entry.direction !== "CREDIT") continue;

      const date = new Date(entry.createdAt);

      const day = date.getDay();

      const diffToMonday = day === 0 ? -6 : 1 - day;

      const periodStart = new Date(date);

      periodStart.setDate(
        date.getDate() + diffToMonday
      );

      periodStart.setHours(0, 0, 0, 0);

      const periodEnd = new Date(periodStart);

      periodEnd.setDate(
        periodStart.getDate() + 7
      );

      const key = periodStart
        .toISOString()
        .slice(0, 10);

      if (!weeklyMap[key]) {
        weeklyMap[key] = {
          periodStart: key,
          periodEnd: periodEnd
            .toISOString()
            .slice(0, 10),
          totalEarnings: 0,
          deliveries: 0,
        };
      }

      weeklyMap[key].totalEarnings += Number(
        entry.amount || 0
      );

      // One CREDIT is created for one delivery earning.
      if (entry.deliveryId) {
        weeklyMap[key].deliveries += 1;
      }
    }

    const weekly = Object.values(weeklyMap)
      .sort(
        (a, b) =>
          new Date(b.periodStart) -
          new Date(a.periodStart)
      )
      .map((item) => ({
        ...item,
        totalEarnings: Number(
          item.totalEarnings.toFixed(2)
        ),
      }));

    // ---------------------------------------
    // MONTHLY EARNINGS
    // ---------------------------------------

    const monthlyMap = {};

    for (const entry of rider.ledgerEntries) {
      if (entry.direction !== "CREDIT") continue;

      const date = new Date(entry.createdAt);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key =
        `${year}-${String(month).padStart(2, "0")}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          period: key,
          year,
          month,
          totalEarnings: 0,
          deliveries: 0,
        };
      }

      monthlyMap[key].totalEarnings += Number(
        entry.amount || 0
      );

      if (entry.deliveryId) {
        monthlyMap[key].deliveries += 1;
      }
    }

    const monthly = Object.values(monthlyMap)
      .sort((a, b) => {
        if (b.year !== a.year) {
          return b.year - a.year;
        }

        return b.month - a.month;
      })
      .map((item) => ({
        ...item,
        totalEarnings: Number(
          item.totalEarnings.toFixed(2)
        ),
      }));

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      rider: {
        id: rider.id,

        name: rider.user.name,
        phone: rider.user.phone,
        email: rider.user.email,

        vehicleType: rider.vehicleType,

        status: rider.status,
        verificationStatus: rider.verificationStatus,

        createdAt: rider.createdAt,
        updatedAt: rider.updatedAt,
      },

      summary: {
        totalEarned: Number(
          totalEarned.toFixed(2)
        ),

        totalPaidOut: Number(
          totalPaidOut.toFixed(2)
        ),

        pendingBalance: Number(
          pendingBalance.toFixed(2)
        ),
      },

      weekly,

      monthly,

      payouts: rider.payouts,
    });
  } catch (error) {
    console.error(
      "Get admin rider payout details error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rider payout details",
    });
  }
};



module.exports = {
  makeShopkeeper,

   approveShop,
   makeRider,
   rejectShop,
   suspendShop,
   reactivateShop,
   approveRider,
   rejectRider,
   suspendRider,
   reactivateRider,
   getAdminShops,
   getAdminOrders,
   getAdminShopById,
   getAdminRiders,
   getAdminRiderById,
   updateAdminRider,
   updateAdminShop,
   deleteAdminShop,
   deleteAdminRider,
   getAdminRefundRequests,
   approveRefundRequest,
   rejectRefundRequest,
   createAdminRider,

   createCashSellerPayout,
   createRiderCashPayout,

   toggleProductFeatured,
   getAdminProducts,
   getAdminTotalPlatformSales,
   getAdminTotalCommission,
   getAdminTotalSellerPayouts,
   getAdminTotalRiderPayouts,
   getAdminTotalRefunded,
   getAdminNetPlatformEarnings,
   getAdminWeeklyEarnings,
   getAdminMonthlyEarnings,
   getAdminShopEarnings,
   getAdminRiderPayouts,
   getAdminSellerPayouts,
   getAdminSellerPayoutDetails,
   getAdminRiderPayoutDetails,

};