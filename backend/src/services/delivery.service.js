const prisma = require("../lib/prisma");
const { findAvailableRider } = require("./rider.service");

const assignOrderToNearestRider = async (orderId) => {
  // 1. Order check
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      delivery: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 2. Only READY_FOR_PICKUP orders can be assigned
  if (order.status !== "READY_FOR_PICKUP") {
    throw new Error(
      "Only orders ready for pickup can be assigned to a rider"
    );
  }

  // 3. Prevent duplicate assignment
  if (order.delivery) {
    throw new Error("Order is already assigned to a rider");
  }

  // 4. Find nearest available rider
  const rider = await findAvailableRider(orderId);

  if (!rider) {
    return null;
  }

  // 5. Create delivery
  const delivery = await prisma.delivery.create({
    data: {
      orderId: order.id,
      riderId: rider.id,
      status: "ASSIGNED",
      deliveryFee: order.deliveryFee,
      riderEarning: order.deliveryFee,
    },
    include: {
      rider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          deliveryName: true,
          deliveryPhone: true,
          deliveryFullAddress: true,
          deliveryCity: true,
          deliveryPincode: true,
          deliveryLatitude: true,
          deliveryLongitude: true,
        },
      },
    },
  });

  return delivery;
};

module.exports = {
  assignOrderToNearestRider,
};