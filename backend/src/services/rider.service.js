const prisma = require("../lib/prisma");

/**
 * Find the nearest available rider for an order.
 */
const findAvailableRider = async (
  orderId,
  excludedRiderIds = [],
  db = prisma
) => {
  // Get order with shop location
  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      shop: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Shop must have location
  if (
    order.shop.latitude === null ||
    order.shop.longitude === null
  ) {
    throw new Error("Shop location is not available");
  }

  // Find eligible riders
  const riders = await db.rider.findMany({
    where: {
  status: "AVAILABLE",
  verificationStatus: "APPROVED",
  currentLatitude: {
    not: null,
  },
  currentLongitude: {
    not: null,
  },

  ...(excludedRiderIds.length > 0 && {
    id: {
      notIn: excludedRiderIds,
    },
  }),
},
    select: {
      id: true,
      userId: true,
      vehicleType: true,
      status: true,
      verificationStatus: true,
      currentLatitude: true,
      currentLongitude: true,
    },
  });

  if (riders.length === 0) {
    return null;
  }

  // Convert Decimal values to Number
  const shopLatitude = Number(order.shop.latitude);
  const shopLongitude = Number(order.shop.longitude);

  // Calculate distance between two coordinates
  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const earthRadius = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  };

  // Calculate distance for every rider
  const ridersWithDistance = riders.map((rider) => {
    const distance = calculateDistance(
      shopLatitude,
      shopLongitude,
      Number(rider.currentLatitude),
      Number(rider.currentLongitude)
    );

    return {
      ...rider,
      distanceInKm: Number(distance.toFixed(2)),
    };
  });

  // Nearest rider first
  ridersWithDistance.sort(
    (a, b) => a.distanceInKm - b.distanceInKm
  );

  return ridersWithDistance[0];
};

module.exports = {
  findAvailableRider,
};