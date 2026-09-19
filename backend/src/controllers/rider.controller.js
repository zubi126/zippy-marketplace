const prisma = require("../lib/prisma");

const { findAvailableRider } = require("../services/rider.service");



const applyAsRider = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. User check
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. User must be RIDER
    if (user.role !== "RIDER") {
      return res.status(403).json({
        success: false,
        message: "Only users with RIDER role can apply as rider",
      });
    }

    // 3. Check if rider profile already exists
    const existingRider = await prisma.rider.findUnique({
      where: {
        userId,
      },
    });

    if (existingRider) {
      return res.status(400).json({
        success: false,
        message: "Rider application already exists",
        rider: existingRider,
      });
    }

    // 4. Create rider application
    const rider = await prisma.rider.create({
      data: {
        userId,
        status: "OFFLINE",
        verificationStatus: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Rider application submitted successfully",
      rider,
    });
  } catch (error) {
    console.error("Rider application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit rider application",
    });
  }
};










const getMyRiderProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rider = await prisma.rider.findUnique({
      where: {
        userId,
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
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      rider,
    });
  } catch (error) {
    console.error("Get rider profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rider profile",
    });
  }
};







const updateRiderStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.body;

    // Only these statuses can be manually changed
    if (!["AVAILABLE", "OFFLINE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rider status",
      });
    }

    const rider = await prisma.rider.findUnique({
      where: {
        userId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider profile not found",
      });
    }

    // Rider must be approved before going online
    if (rider.verificationStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Only approved riders can change their availability",
      });
    }

    // Rider cannot manually change status while delivering
    if (rider.status === "ON_DELIVERY") {
      return res.status(400).json({
        success: false,
        message: "You cannot change status while on delivery",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: {
        id: rider.id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Rider status changed to ${status}`,
      rider: updatedRider,
    });
  } catch (error) {
    console.error("Update rider status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update rider status",
    });
  }
};







const updateRiderLocation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { latitude, longitude } = req.body;

    // Validate coordinates
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

    // Validate coordinate ranges
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

    const rider = await prisma.rider.findUnique({
      where: {
        userId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider profile not found",
      });
    }

    // Only approved riders can update location
    if (rider.verificationStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Only approved riders can update their location",
      });
    }

    const updatedRider = await prisma.rider.update({
      where: {
        id: rider.id,
      },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
      },
    });

    // Send real-time location to the rider's active order room(s)
    const io = req.app.get("io");

    if (io) {
      const activeDeliveries = await prisma.delivery.findMany({
        where: {
          riderId: rider.id,
          status: {
            in: ["ASSIGNED", "ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY"],
          },
        },
        select: {
          orderId: true,
        },
      });

      activeDeliveries.forEach((delivery) => {
        io.to(`order:${delivery.orderId}`).emit("rider-location", {
          orderId: delivery.orderId,
          riderId: rider.id,
          latitude,
          longitude,
        });
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rider location updated successfully",
      location: {
        latitude: updatedRider.currentLatitude,
        longitude: updatedRider.currentLongitude,
      },
    });
  } catch (error) {
    console.error("Update rider location error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update rider location",
    });
  }
};




const testNearestRider = async (req, res) => {
  try {
    const { orderId } = req.params;

    const rider = await findAvailableRider(orderId);

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "No available rider found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nearest rider found successfully",
      rider,
    });
  } catch (error) {
    console.error("Find nearest rider error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};










const acceptDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const userId = req.user.userId;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find rider
      const rider = await tx.rider.findUnique({
        where: {
          userId,
        },
      });

      if (!rider) {
        throw new Error("Rider profile not found");
      }

      // 2. Rider must be approved
      if (rider.verificationStatus !== "APPROVED") {
        throw new Error("Only approved riders can accept deliveries");
      }

      // 3. Rider must be available
      // 3. Rider must be available or already on delivery
if (!["AVAILABLE", "ON_DELIVERY"].includes(rider.status)) {
  throw new Error("Rider is not available");
}

      // 4. Find delivery
      const delivery = await tx.delivery.findUnique({
        where: {
          id: deliveryId,
        },
      });

      if (!delivery) {
        throw new Error("Delivery not found");
      }

      // 5. Delivery must belong to this rider
      if (delivery.riderId !== rider.id) {
        throw new Error(
          "This delivery is not assigned to you"
        );
      }

      // 6. Delivery must still be available
      if (delivery.status !== "ASSIGNED") {
        throw new Error(
          "This delivery is no longer available"
        );
      }

      // 7. Accept delivery
      const updatedDelivery = await tx.delivery.update({
        where: {
          id: delivery.id,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      // 8. Rider becomes ON_DELIVERY
      const updatedRider = await tx.rider.update({
        where: {
          id: rider.id,
        },
        data: {
          status: "ON_DELIVERY",
        },
      });

      // 9. Update order status
      const updatedOrder = await tx.order.update({
        where: {
          id: delivery.orderId,
        },
        data: {
          status: "OUT_FOR_DELIVERY",
        },
      });

      return {
        delivery: updatedDelivery,
        rider: updatedRider,
        order: updatedOrder,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Delivery accepted successfully",
      ...result,
    });
  } catch (error) {
    console.error("Accept delivery error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};










const rejectDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const userId = req.user.userId;

    const result = await prisma.$transaction(async (tx) => {
  const rider = await tx.rider.findUnique({
    where: { userId },
  });

  if (!rider) {
    throw new Error("Rider profile not found");
  }

  if (rider.verificationStatus !== "APPROVED") {
    throw new Error("Only approved riders can reject deliveries");
  }

  const delivery = await tx.delivery.findUnique({
    where: { id: deliveryId },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  if (delivery.riderId !== rider.id) {
    throw new Error("This delivery is not assigned to you");
  }

  if (delivery.status !== "ASSIGNED") {
    throw new Error("Only assigned deliveries can be rejected");
  }

  // Reject current rider's delivery
  const updatedDelivery = await tx.delivery.update({
    where: { id: delivery.id },
    data: {
      status: "CANCELLED",
    },
  });

  // Find another available rider
  const nextRider = await findAvailableRider(
  delivery.orderId,
  [rider.id],
  tx
);

  // Keep current rider available
  const updatedRider = await tx.rider.update({
    where: { id: rider.id },
    data: {
      status: "AVAILABLE",
    },
  });

  let newDelivery = null;

  // Assign order to next rider if available
  if (nextRider) {
    newDelivery = await tx.delivery.create({
      data: {
        orderId: delivery.orderId,
        riderId: nextRider.id,
        status: "ASSIGNED",
        deliveryFee: delivery.deliveryFee,
        riderEarning: delivery.riderEarning,
      },
    });
  }

  return {
    delivery: updatedDelivery,
    rider: updatedRider,
    newDelivery,
  };
});

    return res.status(200).json({
      success: true,
      message: "Delivery rejected successfully",
      ...result,
    });
  } catch (error) {
    console.error("Reject delivery error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};









const pickupDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const userId = req.user.userId;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find rider
      const rider = await tx.rider.findUnique({
        where: {
          userId,
        },
      });

      if (!rider) {
        throw new Error("Rider profile not found");
      }

      // 2. Rider must be approved
      if (rider.verificationStatus !== "APPROVED") {
        throw new Error(
          "Only approved riders can pick up deliveries"
        );
      }

      // 3. Rider must be ON_DELIVERY
      if (rider.status !== "ON_DELIVERY") {
        throw new Error(
          "Rider is not currently on a delivery"
        );
      }

      // 4. Find delivery
      const delivery = await tx.delivery.findUnique({
        where: {
          id: deliveryId,
        },
      });

      if (!delivery) {
        throw new Error("Delivery not found");
      }

      // 5. Delivery must belong to this rider
      if (delivery.riderId !== rider.id) {
        throw new Error(
          "This delivery is not assigned to you"
        );
      }

      // 6. Delivery must be accepted first
      if (delivery.status !== "ACCEPTED") {
        throw new Error(
          "Only an accepted delivery can be picked up"
        );
      }

      // 7. Mark delivery as picked up
      const updatedDelivery = await tx.delivery.update({
        where: {
          id: delivery.id,
        },
        data: {
          status: "PICKED_UP",
          pickedUpAt: new Date(),
        },
      });

      return {
        delivery: updatedDelivery,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Order picked up successfully",
      ...result,
    });
  } catch (error) {
    console.error("Pickup delivery error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};






const deliverDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const userId = req.user.userId;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find rider
      const rider = await tx.rider.findUnique({
        where: {
          userId,
        },
      });

      if (!rider) {
        throw new Error("Rider profile not found");
      }

      // 2. Rider must be approved
      if (rider.verificationStatus !== "APPROVED") {
        throw new Error(
          "Only approved riders can complete deliveries"
        );
      }

      // 3. Rider must be ON_DELIVERY
      if (rider.status !== "ON_DELIVERY") {
        throw new Error(
          "Rider is not currently on a delivery"
        );
      }

      // 4. Find delivery with order + payment
      const delivery = await tx.delivery.findUnique({
        where: {
          id: deliveryId,
        },
        include: {
          order: {
            include: {
              payment: true,
            },
          },
        },
      });

      if (!delivery) {
        throw new Error("Delivery not found");
      }

      // 5. Delivery must belong to this rider
      if (delivery.riderId !== rider.id) {
        throw new Error(
          "This delivery is not assigned to you"
        );
      }

      // 6. Delivery must be picked up
      if (delivery.status !== "PICKED_UP") {
        throw new Error(
          "Only a picked-up delivery can be completed"
        );
      }

      // 7. Mark delivery as delivered
      const updatedDelivery = await tx.delivery.update({
        where: {
          id: delivery.id,
        },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
      });

      // 8. Mark order as delivered
     const updatedOrder = await tx.order.update({
  where: {
    id: delivery.orderId,
  },
  data: {
    status: "DELIVERED",
    paymentStatus:
      delivery.order.paymentMethod === "COD"
        ? "PAID"
        : delivery.order.paymentStatus,
  },
});

      // 9. COD payment becomes PAID
      let updatedPayment = null;

      if (delivery.order.paymentMethod === "COD") {
        if (!delivery.order.payment) {
          throw new Error("Payment record not found");
        }

        updatedPayment = await tx.payment.update({
          where: {
            id: delivery.order.payment.id,
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });
      }

      // 10. Rider becomes AVAILABLE again
     // 10. Check if rider has any other active deliveries
const otherActiveDelivery = await tx.delivery.findFirst({
  where: {
    riderId: rider.id,
    status: {
      in: ["ASSIGNED", "ACCEPTED", "PICKED_UP"],
    },
  },
});

// Rider becomes AVAILABLE only when no other active delivery exists
const updatedRider = await tx.rider.update({
  where: {
    id: rider.id,
  },
  data: {
    status: otherActiveDelivery ? "ON_DELIVERY" : "AVAILABLE",
  },
});

      return {
        delivery: updatedDelivery,
        order: updatedOrder,
        payment: updatedPayment,
        rider: updatedRider,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Delivery completed successfully",
      ...result,
    });
  } catch (error) {
    console.error("Deliver delivery error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};










const getMyDeliveries = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rider = await prisma.rider.findUnique({
      where: {
        userId,
      },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider profile not found",
      });
    }

    const deliveries = await prisma.delivery.findMany({
      where: {
        riderId: rider.id,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            paymentMethod: true,
            paymentStatus: true,
            subtotal: true,
            deliveryFee: true,
            platformFee: true,
            total: true,
            deliveryName: true,
            deliveryPhone: true,
            deliveryFullAddress: true,
            deliveryCity: true,
            deliveryState: true,
            deliveryPincode: true,
            deliveryLatitude: true,
            deliveryLongitude: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error("Get my deliveries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deliveries",
    });
  }
};













const getMyEarnings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rider = await prisma.rider.findUnique({
      where: { userId },
    });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider profile not found",
      });
    }

    const deliveries = await prisma.delivery.findMany({
      where: {
        riderId: rider.id,
        status: "DELIVERED",
      },
      select: {
        id: true,
        deliveryFee: true,
        riderEarning: true,
        deliveredAt: true,
      },
      orderBy: {
        deliveredAt: "desc",
      },
    });

    const totalEarnings = deliveries.reduce(
      (sum, delivery) => sum + Number(delivery.riderEarning),
      0
    );

    const totalDeliveryFees = deliveries.reduce(
      (sum, delivery) => sum + Number(delivery.deliveryFee),
      0
    );

    return res.status(200).json({
      success: true,
      summary: {
        totalDeliveries: deliveries.length,
        totalDeliveryFees,
        totalEarnings,
      },
      deliveries,
    });
  } catch (error) {
    console.error("Get rider earnings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rider earnings",
    });
  }
};





module.exports = {
  applyAsRider,
  getMyRiderProfile,
  updateRiderStatus,
  updateRiderLocation,
  testNearestRider,
  acceptDelivery,
  rejectDelivery,
  pickupDelivery,
  deliverDelivery,
  getMyDeliveries,
  getMyEarnings,
};