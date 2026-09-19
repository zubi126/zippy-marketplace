const prisma = require("../lib/prisma");


const {
  assignOrderToNearestRider,
} = require("../services/delivery.service");

const createOrder = async (req, res) => {
  try {
    const {
      addressId,
      paymentMethod = "COD",
    } = req.body;

    const customerId = req.user.userId;




const customer = await prisma.user.findUnique({
  where: {
    id: customerId,
  },
  select: {
    name: true,
    phone: true,
  },
});

if (!customer) {
  return res.status(404).json({
    success: false,
    message: "Customer not found",
  });
}


    // 1. Validate payment method
    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // 2. Find customer's active cart
    const cart = await prisma.cart.findFirst({
      where: {
        customerId,
        status: "ACTIVE",
      },
      include: {
        shop: true,
        items: {
          include: {
            product: {
              include: {
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 3. Check shop availability
    if (
  !cart.shop.isOpen ||
  !cart.shop.isActive ||
  cart.shop.verificationStatus !== "APPROVED"
) {
  return res.status(400).json({
    success: false,
    message: "Shop is currently unavailable",
  });
}

    // 4. Find customer's address
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: customerId,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // 5. Check products and stock
    for (const item of cart.items) {
      const product = item.product;

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently unavailable`,
        });
      }

      if (!product.inventory) {
        return res.status(400).json({
          success: false,
          message: `Inventory not found for ${product.name}`,
        });
      }

      const availableQuantity =
        product.inventory.quantity -
        product.inventory.reservedQuantity;

      if (item.quantity > availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableQuantity} units of ${product.name} are available`,
        });
      }
    }

    // 6. Calculate subtotal from database prices
    const subtotal = cart.items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);

    // 7. Delivery + platform fee
    const deliveryFee = 40;
    const platformFee = 20;

    const total = subtotal + deliveryFee + platformFee;

    // 8. Generate order number
    const orderNumber = `AN-${Date.now()}`;

    // 9. Create order using transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          shopId: cart.shopId,

          subtotal,
          deliveryFee,
          platformFee,
          total,

          paymentMethod,
          paymentStatus:
            paymentMethod === "COD" ? "PENDING" : "PENDING",

          status: "PENDING",

          // Address snapshot
          deliveryName: customer.name,
deliveryPhone: customer.phone,
deliveryFullAddress: address.fullAddress,
          deliveryCity: address.city,
          deliveryState: address.state,
          deliveryPincode: address.pincode,
          deliveryLatitude: address.latitude,
          deliveryLongitude: address.longitude,

          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              unitPrice: item.product.price,
              quantity: item.quantity,
              lineTotal:
                Number(item.product.price) * item.quantity,
            })),
          },
        },

        include: {
          items: true,
          shop: true,
        },
      });

      // 10. Reserve stock
      for (const item of cart.items) {
        await tx.inventory.update({
          where: {
            productId: item.productId,
          },
          data: {
            reservedQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      // 11. Mark cart as checked out
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          status: "CHECKED_OUT",
        },
      });

      return newOrder;
    });

    // 12. Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: paymentMethod === "COD" ? "cod" : "razorpay",
        amount: total,
        currency: "INR",
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      payment,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};






// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true,
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
            amount: true,
            currency: true,
            status: true,
            paidAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};












// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.userId;

    const order = await prisma.order.findFirst({
      where: {
        id,
        customerId,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true,
            latitude: true,
            longitude: true,
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
            amount: true,
            currency: true,
            razorpayOrderId: true,
            razorpayPaymentId: true,
            status: true,
            paidAt: true,
          },
        },
        delivery: {
          include: {
            rider: {
              select: {
                id: true,
                vehicleType: true,
                status: true,
                currentLatitude: true,
                currentLongitude: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};







// GET SHOP ORDERS
const getShopOrders = async (req, res) => {
  try {
    const ownerId = req.user.userId;

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

    // Get orders for this shop
    const orders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
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
            amount: true,
            currency: true,
            status: true,
            paidAt: true,
          },
        },
        delivery: {
          select: {
            id: true,
            riderId: true,
            status: true,
            deliveryFee: true,
            riderEarning: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      shop: {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
      },
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get shop orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop orders",
    });
  }
};








// UPDATE SHOP ORDER STATUS
const updateShopOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const ownerId = req.user.userId;

    // 1. Validate requested status
    const allowedStatuses = [
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // 2. Find shop owned by logged-in shopkeeper
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

    // 3. Find order belonging to this shop
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        shopId: shop.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 4. Validate status transition
    const validTransitions = {
      PENDING: "CONFIRMED",
      CONFIRMED: "PREPARING",
      PREPARING: "READY_FOR_PICKUP",
    };

    const nextStatus = validTransitions[order.status];

    if (nextStatus !== status) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${order.status} to ${status}`,
      });
    }




    // 5. Update order status
   // 5. Update order status
const updatedOrder = await prisma.order.update({
  where: {
    id: order.id,
  },
  data: {
    status,
  },
});

// 6. Automatically assign rider when order is ready
if (status === "READY_FOR_PICKUP") {
  try {
    const delivery = await assignOrderToNearestRider(order.id);

    if (!delivery) {
      return res.status(200).json({
        success: true,
        message:
          "Order is ready for pickup, but no available rider was found",
        order: updatedOrder,
        delivery: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order ready and rider assigned successfully",
      order: updatedOrder,
      delivery,
    });
  } catch (assignmentError) {
    console.error(
      "Automatic rider assignment error:",
      assignmentError
    );

    return res.status(200).json({
      success: true,
      message:
        "Order is ready for pickup, but rider assignment failed",
      order: updatedOrder,
      delivery: null,
    });
  }
}

return res.status(200).json({
  success: true,
  message: "Order status updated successfully",
  order: updatedOrder,
});

  } catch (error) {
    console.error("Update shop order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};






module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getShopOrders,
  updateShopOrderStatus,
};