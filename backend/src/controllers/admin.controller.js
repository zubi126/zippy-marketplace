const prisma = require("../lib/prisma");

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
   reactivateRider
};