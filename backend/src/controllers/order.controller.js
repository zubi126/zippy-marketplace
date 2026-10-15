const prisma = require("../lib/prisma");

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayOrderPayments,
} = require("../services/payment.service");

const {
  assignOrderToNearestRider,
} = require("../services/delivery.service");













// const createOrder = async (req, res) => {
//   try {
//     const { addressId, paymentMethod = "COD" } = req.body;

//     const customerId = req.user.userId;

//     // 1. Validate payment method
//     if (!["COD", "ONLINE"].includes(paymentMethod)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment method",
//       });
//     }

//     // 2. Find customer
//     const customer = await prisma.user.findUnique({
//       where: {
//         id: customerId,
//       },
//       select: {
//         name: true,
//         phone: true,
//       },
//     });

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     // 3. Find customer's active cart
//     const cart = await prisma.cart.findFirst({
//       where: {
//         customerId,
//         status: "ACTIVE",
//       },
//       include: {
//         shop: true,
//         items: {
//           include: {
//             product: {
//               include: {
//                 inventory: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!cart) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     // 4. Check cart items
//     if (cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty",
//       });
//     }

//     // 5. Check shop availability
//     if (
//       !cart.shop.isOpen ||
//       !cart.shop.isActive ||
//       cart.shop.verificationStatus !== "APPROVED"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Shop is currently unavailable",
//       });
//     }

//     // 6. Find customer's address
//     const address = await prisma.address.findFirst({
//       where: {
//         id: addressId,
//         userId: customerId,
//       },
//     });

//     if (!address) {
//       return res.status(404).json({
//         success: false,
//         message: "Address not found",
//       });
//     }

//     // 7. Check products and stock
//     for (const item of cart.items) {
//       const product = item.product;

//       if (!product.isAvailable) {
//         return res.status(400).json({
//           success: false,
//           message: `${product.name} is currently unavailable`,
//         });
//       }

//       if (!product.inventory) {
//         return res.status(400).json({
//           success: false,
//           message: `Inventory not found for ${product.name}`,
//         });
//       }

//       const availableQuantity =
//         product.inventory.quantity -
//         product.inventory.reservedQuantity;

//       if (item.quantity > availableQuantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Only ${availableQuantity} units of ${product.name} are available`,
//         });
//       }
//     }

//     // 8. Calculate subtotal
//     const subtotal = cart.items.reduce((total, item) => {
//       return total + Number(item.product.price) * item.quantity;
//     }, 0);




//     // // 9. Delivery + platform fee
//     // const deliveryFee = paymentMethod === "ONLINE" ? 20 : 40;
//     // const platformFee = 20;
//     // const total = subtotal + deliveryFee + platformFee;



//     // 9. Delivery + platform fee
// const isRazorpayLiveTest = cart.items.some(
//   (item) =>
//     item.productId === "eddf1921-5fc9-4aef-9c18-f9d67a067c87"
// );

// const deliveryFee = isRazorpayLiveTest
//   ? 0
//   : paymentMethod === "ONLINE"
//     ? 10
//     : 20;

// const platformFee = isRazorpayLiveTest ? 0 : 20;

// const total = subtotal + deliveryFee + platformFee;








// const commissionRate = 10;

// const commissionAmount = Number(
//   ((subtotal * commissionRate) / 100).toFixed(2)
// );

// const sellerPayableAmount = Number(
//   (subtotal - commissionAmount).toFixed(2)
// );






//     // 10. Generate order number
//     const orderNumber = `AN-${Date.now()}`;

//     // 11. Create Order + Payment + reserve stock + checkout cart
//     const order = await prisma.$transaction(async (tx) => {
//       const newOrder = await tx.order.create({
//         data: {
//           orderNumber,
//           customerId,
//           shopId: cart.shopId,

//           subtotal,
//           deliveryFee,
//           platformFee,
//           total,


//           commissionRate,
// commissionAmount,
// sellerPayableAmount,


//           paymentMethod,
//           paymentStatus: "PENDING",
//           status: "PENDING",

//           // Address snapshot
//           deliveryName: customer.name,
//           deliveryPhone: customer.phone,
//           deliveryFullAddress: address.fullAddress,
//           deliveryCity: address.city,
//           deliveryState: address.state,
//           deliveryPincode: address.pincode,
//           deliveryLatitude: address.latitude,
//           deliveryLongitude: address.longitude,

//           items: {
//             create: cart.items.map((item) => ({
//               productId: item.productId,
//               productName: item.product.name,
//               unitPrice: item.product.price,
//               quantity: item.quantity,
//               lineTotal:
//                 Number(item.product.price) * item.quantity,
//             })),
//           },
//         },

//         include: {
//           items: true,
//           shop: true,
//         },
//       });

//       // Create Payment record BEFORE Razorpay call
//       await tx.payment.create({
//         data: {
//           orderId: newOrder.id,
//           provider: paymentMethod === "ONLINE" ? "razorpay" : "cod",
//           method: paymentMethod,
//           amount: total,
//           currency: "INR",
//           status: "PENDING",
//         },
//       });

//       // Reserve stock
//      // Reserve stock atomically
// // Stock will be reserved only if enough unreserved quantity exists.
// const itemsToReserve = [...cart.items].sort((a, b) =>
//   a.productId.localeCompare(b.productId)
// );

// for (const item of itemsToReserve) {
//   const reserved = await tx.$queryRaw`
//     UPDATE "Inventory"
//     SET "reservedQuantity" = "reservedQuantity" + ${item.quantity}
//     WHERE "productId" = ${item.productId}
//       AND "quantity" - "reservedQuantity" >= ${item.quantity}
//     RETURNING "productId", "reservedQuantity";
//   `;

//   if (reserved.length === 0) {
//     const error = new Error(
//       `Only available stock can be reserved for ${item.product.name}`
//     );

//     error.code = "INSUFFICIENT_STOCK";
//     error.productName = item.product.name;

//     throw error;
//   }
// }

//       // Mark cart as checked out
//       await tx.cart.update({
//         where: {
//           id: cart.id,
//         },
//         data: {
//           status: "CHECKED_OUT",
//         },
//       });

//       return newOrder;
//     });

//     // 12. Create Razorpay order for ONLINE payment
//     let razorpayOrder = null;

//     if (paymentMethod === "ONLINE") {
//       try {
//         razorpayOrder = await createRazorpayOrder({
//           orderId: order.id,
//           amount: total,
//         });

//         // Save Razorpay order ID
//         await prisma.payment.update({
//           where: {
//             orderId: order.id,
//           },
//           data: {
//             providerOrderId: razorpayOrder.id,
//           },
//         });
//       } catch (razorpayError) {
//         console.error("Razorpay order creation failed:", razorpayError);

//         // Rollback database state
//         await prisma.$transaction(async (tx) => {
//           // Get order items
//           const orderItems = await tx.orderItem.findMany({
//             where: {
//               orderId: order.id,
//             },
//           });

//           // Release reserved stock
//           for (const item of orderItems) {
//             await tx.inventory.update({
//               where: {
//                 productId: item.productId,
//               },
//               data: {
//                 reservedQuantity: {
//                   decrement: item.quantity,
//                 },
//               },
//             });
//           }

//           // Mark payment as failed
//           await tx.payment.update({
//             where: {
//               orderId: order.id,
//             },
//             data: {
//               status: "FAILED",
//               failedAt: new Date(),
//             },
//           });

//           // Cancel order
//           await tx.order.update({
//             where: {
//               id: order.id,
//             },
//             data: {
//               status: "CANCELLED",
//               paymentStatus: "FAILED",
//             },
//           });

//           // Restore cart
//           await tx.cart.update({
//             where: {
//               id: cart.id,
//             },
//             data: {
//               status: "ACTIVE",
//             },
//           });
//         });

//         return res.status(502).json({
//           success: false,
//           message: "Online payment initialization failed",
//         });
//       }
//     }

//     // 13. Get payment record
//     const payment = await prisma.payment.findUnique({
//       where: {
//         orderId: order.id,
//       },
//     });

//     // 14. Return response
//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//       payment,
//       razorpay: razorpayOrder
//         ? {
//             keyId: process.env.RAZORPAY_KEY_ID,
//             orderId: razorpayOrder.id,
//             amount: razorpayOrder.amount,
//             currency: razorpayOrder.currency,
//           }
//         : null,
//     });
//   } catch (error) {
//   console.error("Create order error:", error);

//   if (error.code === "INSUFFICIENT_STOCK") {
//     return res.status(400).json({
//       success: false,
//       message: `${error.productName} does not have enough stock available`,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message: "Failed to create order",
//   });
// }
// };























// changed function


const createOrder = async (req, res) => {
  let checkoutPaymentId = null;
  let createdOrders = [];
  let activeCartIds = [];

  try {
    const { addressId, paymentMethod = "COD" } = req.body;
    const customerId = req.user.userId;

    // 1. Validate payment method
    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // 2. Find customer
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
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

    // 3. Find ALL active carts belonging to this customer
    const carts = await prisma.cart.findMany({
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

    if (carts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Ignore empty carts; only carts containing items are checked out.
    const nonEmptyCarts = carts.filter(
      (cart) => cart.items.length > 0
    );

    if (nonEmptyCarts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    activeCartIds = nonEmptyCarts.map((cart) => cart.id);

    // 4. Validate every shop
    for (const cart of nonEmptyCarts) {
      if (
        !cart.shop ||
        !cart.shop.isOpen ||
        !cart.shop.isActive ||
        cart.shop.verificationStatus !== "APPROVED"
      ) {
        return res.status(400).json({
          success: false,
          message: `Shop ${cart.shop?.name || ""} is currently unavailable`,
        });
      }
    }

    // 5. Find customer's address
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

    // 6. Validate every product and check available stock
    const allItems = nonEmptyCarts.flatMap(
      (cart) => cart.items
    );

    for (const item of allItems) {
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

    // 7. Calculate checkout totals.
    // Preserve the existing test-product fee waiver across the checkout.
    const isRazorpayLiveTest = allItems.some(
      (item) =>
        item.productId ===
        "eddf1921-5fc9-4aef-9c18-f9d67a067c87"
    );

    const commissionRate = 10;

    const orderCalculations = nonEmptyCarts.map((cart) => {
      const subtotal = cart.items.reduce(
        (total, item) =>
          total +
          Number(item.product.price) * item.quantity,
        0
      );

      const totalWeightKg = cart.items.reduce(
  (total, item) =>
    total +
    Number(item.product.weightKg ?? 1) * item.quantity,
  0
);

const weightBasedDeliveryFee =
  totalWeightKg <= 2
    ? 20
    : totalWeightKg <= 5
      ? 30
      : totalWeightKg <= 10
        ? 50
        : totalWeightKg <= 20
          ? 80
          : totalWeightKg <= 30
            ? 150
            : 200;

const deliveryFee = isRazorpayLiveTest
  ? 0
  : weightBasedDeliveryFee;

      const platformFee = isRazorpayLiveTest ? 0 : 20;

      const total = Number(
        (subtotal + deliveryFee + platformFee).toFixed(2)
      );

      const commissionAmount = Number(
        ((subtotal * commissionRate) / 100).toFixed(2)
      );

      const sellerPayableAmount = Number(
        (subtotal - commissionAmount).toFixed(2)
      );

      return {
        cart,
        subtotal,
        deliveryFee,
        platformFee,
        total,
        commissionRate,
        commissionAmount,
        sellerPayableAmount,
      };
    });

    const combinedTotal = Number(
      orderCalculations
        .reduce((sum, item) => sum + item.total, 0)
        .toFixed(2)
    );

    // Unique checkout identifier, also used to group shop orders.
    const checkoutNumber =
      `CHK-${Date.now()}-${require("crypto").randomBytes(4).toString("hex")}`;

    // 8. Create one checkout payment and separate orders per shop.
    // Stock reservation and cart updates stay inside the transaction.
    const checkoutResult = await prisma.$transaction(
      async (tx) => {
        
const checkoutPayment = await tx.checkoutPayment.create({
  data: {
    checkoutNumber,
    amount: combinedTotal,
    currency: "INR",
    method: paymentMethod,
    provider:
      paymentMethod === "ONLINE" ? "razorpay" : "cod",
    status: "PENDING",
    customerId,

    // Save the carts associated with this checkout.
    metadata: {
      cartIds: nonEmptyCarts.map((cart) => cart.id),
    },
  },
});


        const orders = [];

        for (let index = 0; index < orderCalculations.length; index++) {
          const calculation = orderCalculations[index];
          const { cart } = calculation;

          const orderNumber =
            `AN-${Date.now()}-${index + 1}-${require("crypto").randomBytes(3).toString("hex")}`;

          const newOrder = await tx.order.create({
            data: {
              orderNumber,
              customerId,
              shopId: cart.shopId,

              subtotal: calculation.subtotal,
              deliveryFee: calculation.deliveryFee,
              platformFee: calculation.platformFee,
              total: calculation.total,

              commissionRate: calculation.commissionRate,
              commissionAmount: calculation.commissionAmount,
              sellerPayableAmount: calculation.sellerPayableAmount,

              paymentMethod,
              paymentStatus: "PENDING",
              status: "PENDING",

              // Link every shop order to the same checkout.
              checkoutPaymentId: checkoutPayment.id,

              // Preserve the delivery address snapshot.
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

          // Keep the existing per-order Payment records for
          // compatibility with order, COD, and seller workflows.
          await tx.payment.create({
            data: {
              orderId: newOrder.id,
              provider:
                paymentMethod === "ONLINE" ? "razorpay" : "cod",
              method: paymentMethod,
              amount: calculation.total,
              currency: "INR",
              status: "PENDING",
            },
          });

          // Reserve stock atomically, in a consistent product order.
          const itemsToReserve = [...cart.items].sort((a, b) =>
            a.productId.localeCompare(b.productId)
          );

          for (const item of itemsToReserve) {
            const reserved = await tx.$queryRaw`
              UPDATE "Inventory"
              SET "reservedQuantity" =
                "reservedQuantity" + ${item.quantity}
              WHERE "productId" = ${item.productId}
                AND "quantity" - "reservedQuantity" >= ${item.quantity}
              RETURNING "productId", "reservedQuantity";
            `;

            if (reserved.length === 0) {
              const error = new Error(
                `Only available stock can be reserved for ${item.product.name}`
              );

              error.code = "INSUFFICIENT_STOCK";
              error.productName = item.product.name;

              throw error;
            }
          }

          // Mark only this shop's cart as checked out.
          await tx.cart.update({
            where: { id: cart.id },
            data: { status: "CHECKED_OUT" },
          });

          orders.push(newOrder);
        }

        return {
          checkoutPayment,
          orders,
        };
      }
    );

    checkoutPaymentId = checkoutResult.checkoutPayment.id;
    createdOrders = checkoutResult.orders;

    // 9. Create ONE Razorpay order for the combined checkout amount.
    let razorpayOrder = null;

    if (paymentMethod === "ONLINE") {
      try {
        razorpayOrder = await createRazorpayOrder({
          orderId: checkoutResult.checkoutPayment.checkoutNumber,
          amount: combinedTotal,
        });

        // Save the provider order ID on the shared checkout payment,
        // not on each individual Payment record.
        await prisma.checkoutPayment.update({
          where: {
            id: checkoutPaymentId,
          },
          data: {
            providerOrderId: razorpayOrder.id,
          },
        });
      } catch (razorpayError) {
        console.error(
          "Razorpay order creation failed:",
          razorpayError
        );

        // Roll back the database state for ALL orders in this checkout.
        await prisma.$transaction(async (tx) => {
          for (const order of createdOrders) {
            const orderItems = await tx.orderItem.findMany({
              where: { orderId: order.id },
            });

            for (const item of orderItems) {
              // Release exactly the quantity reserved for this order.
              const released = await tx.$queryRaw`
                UPDATE "Inventory"
                SET "reservedQuantity" =
                  "reservedQuantity" - ${item.quantity}
                WHERE "productId" = ${item.productId}
                  AND "reservedQuantity" >= ${item.quantity}
                RETURNING "productId";
              `;

              if (released.length === 0) {
                throw new Error(
                  `Unable to safely release reserved stock for product ${item.productId}`
                );
              }
            }
          }

          await tx.payment.updateMany({
            where: {
              orderId: {
                in: createdOrders.map((order) => order.id),
              },
            },
            data: {
              status: "FAILED",
              failedAt: new Date(),
            },
          });

          await tx.order.updateMany({
            where: {
              id: {
                in: createdOrders.map((order) => order.id),
              },
            },
            data: {
              status: "CANCELLED",
              paymentStatus: "FAILED",
            },
          });

          await tx.checkoutPayment.update({
            where: { id: checkoutPaymentId },
            data: {
              status: "FAILED",
              failedAt: new Date(),
            },
          });

          await tx.cart.updateMany({
            where: {
              id: { in: activeCartIds },
              customerId,
            },
            data: { status: "ACTIVE" },
          });
        });

        return res.status(502).json({
          success: false,
          message: "Online payment initialization failed",
        });
      }
    }

    // 10. Fetch per-order payment records.
    const payments = await prisma.payment.findMany({
      where: {
        orderId: {
          in: createdOrders.map((order) => order.id),
        },
      },
    });

    // 11. Keep the legacy `order` and `payment` properties while
    // also returning all orders and the shared checkout payment.
    const firstOrder = createdOrders[0];
    const firstPayment = payments.find(
      (payment) => payment.orderId === firstOrder.id
    );

    return res.status(201).json({
      success: true,
      message: "Checkout created successfully",

      // Backward compatibility for existing frontend code.
      order: firstOrder,
      payment: firstPayment,

      // New multi-shop response.
      orders: createdOrders,
      payments,
      checkoutPayment: checkoutResult.checkoutPayment,

      razorpay: razorpayOrder
        ? {
            keyId: process.env.RAZORPAY_KEY_ID,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          }
        : null,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (error.code === "INSUFFICIENT_STOCK") {
      return res.status(400).json({
        success: false,
        message: `${error.productName} does not have enough stock available`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};












// GET CHECKOUT PRICE SUMMARY

const getCheckoutSummary = async (req, res) => {
  try {
    const { paymentMethod = "COD" } = req.query;
    const customerId = req.user.userId;

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Fetch ALL active carts belonging to this customer.
    const carts = await prisma.cart.findMany({
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

    const items = carts.flatMap((cart) => cart.items);

    if (items.length === 0) {
      return res.status(200).json({
        success: true,
        summary: {
          subtotal: 0,
          deliveryFee: 0,
          platformFee: 0,
          total: 0,
        },
      });
    }

    // Validate each shop.
    for (const cart of carts) {
      if (cart.items.length === 0) continue;

      if (
        !cart.shop ||
        !cart.shop.isOpen ||
        !cart.shop.isActive ||
        cart.shop.verificationStatus !== "APPROVED"
      ) {
        return res.status(400).json({
          success: false,
          message: `Shop ${cart.shop?.name || ""} is currently unavailable`,
        });
      }
    }

    // Validate products and inventory.
    for (const item of items) {
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

    const subtotal = items.reduce(
      (total, item) =>
        total + Number(item.product.price) * item.quantity,
      0
    );

    const isRazorpayLiveTest = items.some(
      (item) =>
        item.productId ===
        "4d0e142c-8b95-4b33-8b99-b3492711f341"
    );

    // Current fee rules applied per shop cart.
    // const deliveryFee = isRazorpayLiveTest
    //   ? 0
    //   : carts.reduce((total, cart) => {
    //       if (cart.items.length === 0) return total;
    //       return total + (paymentMethod === "ONLINE" ? 10 : 20);
    //     }, 0);







const deliveryFee = isRazorpayLiveTest
  ? 0
  : carts.reduce((total, cart) => {
      if (cart.items.length === 0) return total;

      const totalWeightKg = cart.items.reduce(
        (weight, item) =>
          weight +
          Number(item.product.weightKg ?? 1) * item.quantity,
        0
      );

      const cartDeliveryFee =
        totalWeightKg <= 2
          ? 20
          : totalWeightKg <= 5
            ? 30
            : totalWeightKg <= 10
              ? 50
              : totalWeightKg <= 20
                ? 80
                : totalWeightKg <= 30
                  ? 150
                  : 200;

      return total + cartDeliveryFee;
    }, 0);












    const platformFee = isRazorpayLiveTest
      ? 0
      : carts.reduce(
          (total, cart) =>
            total + (cart.items.length > 0 ? 20 : 0),
          0
        );

    const total = subtotal + deliveryFee + platformFee;

    return res.status(200).json({
      success: true,
      summary: {
        subtotal,
        deliveryFee,
        platformFee,
        total,
      },
    });
  } catch (error) {
    console.error("Get checkout summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate checkout summary",
    });
  }
};

















// const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     // 1. Validate required fields
//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay payment details",
//       });
//     }

//     // 2. Verify Razorpay signature
//     const isValid = verifyRazorpayPayment({
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//     });

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment signature",
//       });
//     }

//     // 3. Find payment
//     const payment = await prisma.payment.findUnique({
//       where: {
//         providerOrderId: razorpay_order_id,
//       },
//       include: {
//         order: true,
//       },
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     // 4. Make sure this payment belongs to logged-in customer
//     if (payment.order.customerId !== req.user.userId) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized payment access",
//       });
//     }

//     // 5. Prevent duplicate verification
//     if (payment.status === "PAID") {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already verified",
//         payment,
//       });
//     }

//     // 6. Update payment + order atomically
//     const result = await prisma.$transaction(async (tx) => {
//       const updatedPayment = await tx.payment.update({
//         where: {
//           id: payment.id,
//         },
//         data: {
//           providerPaymentId: razorpay_payment_id,
//           status: "PAID",
//           paidAt: new Date(),
//         },
//       });

//       const updatedOrder = await tx.order.update({
//         where: {
//           id: payment.orderId,
//         },
//         data: {
//           paymentStatus: "PAID",
//         },
//       });

//       return {
//         updatedPayment,
//         updatedOrder,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       payment: result.updatedPayment,
//       order: result.updatedOrder,
//     });
//   } catch (error) {
//     console.error("Verify payment error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to verify payment",
//     });
//   }
// };









// changed verify payment 

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1. Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    // 2. Verify Razorpay signature
    const isValid = verifyRazorpayPayment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 3. First check for a combined multi-shop checkout payment.
    const checkoutPayment = await prisma.checkoutPayment.findUnique({
      where: {
        providerOrderId: razorpay_order_id,
      },
      include: {
        orders: true,
      },
    });

    if (checkoutPayment) {
      // 4. Confirm that the checkout belongs to this customer.
      if (checkoutPayment.customerId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized payment access",
        });
      }

      if (checkoutPayment.method !== "ONLINE") {
        return res.status(400).json({
          success: false,
          message: "This checkout is not an online payment",
        });
      }

      // 5. Make verification retries idempotent.
      if (checkoutPayment.status === "PAID") {
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
          checkoutPayment,
          orders: checkoutPayment.orders,
        });
      }

      if (checkoutPayment.status !== "PENDING") {
        return res.status(400).json({
          success: false,
          message: "This checkout payment is no longer pending",
        });
      }

      // 6. Update the shared payment and all related records atomically.
      const result = await prisma.$transaction(async (tx) => {
        // Re-check the state inside the transaction.
        const currentCheckoutPayment =
          await tx.checkoutPayment.findUnique({
            where: {
              id: checkoutPayment.id,
            },
          });

        if (!currentCheckoutPayment) {
          throw new Error("CHECKOUT_PAYMENT_NOT_FOUND");
        }

        if (currentCheckoutPayment.status === "PAID") {
          const existingOrders = await tx.order.findMany({
            where: {
              checkoutPaymentId: currentCheckoutPayment.id,
            },
          });

          return {
            alreadyVerified: true,
            checkoutPayment: currentCheckoutPayment,
            orders: existingOrders,
          };
        }

        if (currentCheckoutPayment.status !== "PENDING") {
          throw new Error("CHECKOUT_PAYMENT_NOT_PENDING");
        }

        // const updatedCheckoutPayment =
        //   await tx.checkoutPayment.update({
        //     where: {
        //       id: currentCheckoutPayment.id,
        //     },
        //     data: {
        //       providerPaymentId: razorpay_payment_id,
        //       status: "PAID",
        //       paidAt: new Date(),
        //     },
        //   });











// Atomically claim the PENDING checkout for payment verification.
        const checkoutUpdate = await tx.checkoutPayment.updateMany({
          where: {
            id: currentCheckoutPayment.id,
            status: "PENDING",
          },
          data: {
            providerPaymentId: razorpay_payment_id,
            status: "PAID",
            paidAt: new Date(),
          },
        });

        // Cancellation or another request may have changed the status.
        if (checkoutUpdate.count !== 1) {
          throw new Error("CHECKOUT_PAYMENT_NOT_PENDING");
        }

        const updatedCheckoutPayment =
          await tx.checkoutPayment.findUnique({
            where: {
              id: currentCheckoutPayment.id,
            },
          });

        if (!updatedCheckoutPayment) {
          throw new Error("CHECKOUT_PAYMENT_NOT_FOUND");
        }















        // Mark every shop order in this checkout as paid.
        await tx.order.updateMany({
          where: {
            checkoutPaymentId: currentCheckoutPayment.id,
            customerId: req.user.userId,
          },
          data: {
            paymentStatus: "PAID",
          },
        });

        // Preserve the existing per-order Payment records.
        // Do NOT copy the same Razorpay payment ID to each row:
        // Payment.providerPaymentId is unique.
        await tx.payment.updateMany({
          where: {
            order: {
              checkoutPaymentId: currentCheckoutPayment.id,
              customerId: req.user.userId,
            },
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        const updatedOrders = await tx.order.findMany({
          where: {
            checkoutPaymentId: currentCheckoutPayment.id,
            customerId: req.user.userId,
          },
          include: {
            shop: true,
            items: true,
            payment: true,
          },
        });

        return {
          alreadyVerified: false,
          checkoutPayment: updatedCheckoutPayment,
          orders: updatedOrders,
        };
      });

      return res.status(200).json({
        success: true,
        message: result.alreadyVerified
          ? "Payment already verified"
          : "Checkout payment verified successfully",
        checkoutPayment: result.checkoutPayment,
        orders: result.orders,
      });
    }

    // 7. Backward compatibility:
    // If this is an older individual order payment, use the original flow.
    const payment = await prisma.payment.findUnique({
      where: {
        providerOrderId: razorpay_order_id,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // 8. Verify ownership of the individual order.
    if (payment.order.customerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment access",
      });
    }

    if (payment.method !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "This payment is not an online payment",
      });
    }

    // 9. Prevent duplicate verification for older payments.
    if (payment.status === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        payment,
        order: payment.order,
      });
    }

    if (payment.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This payment is no longer pending",
      });
    }

    // 10. Update the individual payment and order atomically.
    const result = await prisma.$transaction(async (tx) => {
      const currentPayment = await tx.payment.findUnique({
        where: {
          id: payment.id,
        },
        include: {
          order: true,
        },
      });

      if (!currentPayment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      if (currentPayment.order.customerId !== req.user.userId) {
        throw new Error("UNAUTHORIZED_PAYMENT");
      }

      if (currentPayment.status === "PAID") {
        return {
          alreadyVerified: true,
          updatedPayment: currentPayment,
          updatedOrder: currentPayment.order,
        };
      }

      if (currentPayment.status !== "PENDING") {
        throw new Error("PAYMENT_NOT_PENDING");
      }

      const updatedPayment = await tx.payment.update({
        where: {
          id: currentPayment.id,
        },
        data: {
          providerPaymentId: razorpay_payment_id,
          status: "PAID",
          paidAt: new Date(),
        },
      });

      const updatedOrder = await tx.order.update({
        where: {
          id: currentPayment.orderId,
        },
        data: {
          paymentStatus: "PAID",
        },
      });

      return {
        alreadyVerified: false,
        updatedPayment,
        updatedOrder,
      };
    });

    return res.status(200).json({
      success: true,
      message: result.alreadyVerified
        ? "Payment already verified"
        : "Payment verified successfully",
      payment: result.updatedPayment,
      order: result.updatedOrder,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    if (error.message === "CHECKOUT_PAYMENT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Checkout payment not found",
      });
    }

    if (
      error.message === "CHECKOUT_PAYMENT_NOT_PENDING" ||
      error.message === "PAYMENT_NOT_PENDING"
    ) {
      return res.status(400).json({
        success: false,
        message: "This payment is no longer pending",
      });
    }

    if (error.message === "UNAUTHORIZED_PAYMENT") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment access",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "This Razorpay payment has already been processed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
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
           providerOrderId: true,
providerPaymentId: true,
            status: true,
            paidAt: true,
          },
        },
        // delivery: {
        //   include: {
        //     rider: {
        //       select: {
        //         id: true,
        //         vehicleType: true,
        //         status: true,
        //         currentLatitude: true,
        //         currentLongitude: true,
        //       },
        //     },
        //   },
        // },










deliveries: {
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
        deliveries: {
  select: {
    id: true,
    riderId: true,
    status: true,
    deliveryFee: true,
    riderEarning: true
  }
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























// new cancel checkout function

const cancelCheckout = async (req, res) => {
  try {
    const { checkoutPaymentId } = req.params;
    const { reason, note } = req.body;
    const customerId = req.user.userId;

    // 1. Validate cancellation reason
    const validReasons = [
      "CHANGED_MIND",
      "ORDERED_BY_MISTAKE",
      "BETTER_PRICE",
      "DELIVERY_TAKING_TOO_LONG",
      "PRODUCT_NOT_NEEDED",
      "WRONG_PRODUCT_OR_QUANTITY",
      "OTHER",
    ];

    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Valid cancellation reason is required",
      });
    }

    if (reason === "OTHER" && (!note || !note.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a cancellation note",
      });
    }

    // 2. Find checkout belonging to this customer
    const checkoutPayment = await prisma.checkoutPayment.findFirst({
      where: {
        id: checkoutPaymentId,
        customerId,
      },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!checkoutPayment) {
      return res.status(404).json({
        success: false,
        message: "Checkout payment not found",
      });
    }

    if (checkoutPayment.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message:
          "Only pending checkouts can be cancelled. Please check the payment status.",
      });
    }

    const cancellableStatuses = ["PENDING", "CONFIRMED"];

    if (
      checkoutPayment.orders.length === 0 ||
      checkoutPayment.orders.some(
        (order) => !cancellableStatuses.includes(order.status)
      )
    ) {
      return res.status(409).json({
        success: false,
        message:
          "One or more orders can no longer be cancelled.",
      });
    }

    // 3. Check Razorpay before cancelling an ONLINE checkout
    if (checkoutPayment.method === "ONLINE") {
      if (!checkoutPayment.providerOrderId) {
        return res.status(503).json({
          success: false,
          message:
            "Payment status cannot be confirmed. Please try again later.",
        });
      }

      let gatewayPayments;

      try {
        gatewayPayments = await getRazorpayOrderPayments({
          razorpayOrderId: checkoutPayment.providerOrderId,
        });
      } catch (gatewayError) {
        console.error(
          "Checkout cancellation payment lookup failed:",
          gatewayError
        );

        return res.status(503).json({
          success: false,
          message:
            "Unable to verify payment status. Checkout was not cancelled.",
        });
      }

      // Never cancel or release stock if money has been captured.
      if (
        gatewayPayments.some(
          (payment) => payment.status === "captured"
        )
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Payment has been captured. Checkout cannot be cancelled through this request. Payment reconciliation is required.",
        });
      }

      // An authorized payment must be reconciled before cancellation.
      if (
        gatewayPayments.some(
          (payment) => payment.status === "authorized"
        )
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Payment is authorized. Checkout was not cancelled; payment reconciliation is required.",
        });
      }

      // Only no payment attempts, or attempts confirmed as failed,
      // are allowed to proceed.
      const hasUnresolvedPayment = gatewayPayments.some(
        (payment) => payment.status !== "failed"
      );

      if (hasUnresolvedPayment) {
        return res.status(409).json({
          success: false,
          message:
            "A payment attempt is still active or unresolved. Checkout was not cancelled.",
        });
      }
    }

    // 4. Cancel the checkout and its linked orders atomically.
    const result = await prisma.$transaction(async (tx) => {
      // Compare-and-set: only one request can cancel a PENDING checkout.
      const checkoutUpdate = await tx.checkoutPayment.updateMany({
        where: {
          id: checkoutPayment.id,
          customerId,
          status: "PENDING",
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (checkoutUpdate.count !== 1) {
        throw new Error("CHECKOUT_NOT_PENDING");
      }

      // Re-fetch all linked orders inside the transaction.
      const currentCheckout = await tx.checkoutPayment.findUnique({
        where: {
          id: checkoutPayment.id,
        },
        include: {
          orders: {
            include: {
              items: true,
            },
          },
        },
      });

      if (
        !currentCheckout ||
        currentCheckout.orders.length === 0
      ) {
        throw new Error("CHECKOUT_ORDERS_NOT_FOUND");
      }

      if (
        currentCheckout.orders.some(
          (order) => !cancellableStatuses.includes(order.status)
        )
      ) {
        throw new Error("CHECKOUT_ORDERS_NOT_CANCELLABLE");
      }

      const orderIds = currentCheckout.orders.map(
        (order) => order.id
      );

      // 5. Release every reserved item safely.
      for (const order of currentCheckout.orders) {
        for (const item of order.items) {
          const released = await tx.inventory.updateMany({
            where: {
              productId: item.productId,
              reservedQuantity: {
                gte: item.quantity,
              },
            },
            data: {
              reservedQuantity: {
                decrement: item.quantity,
              },
            },
          });

          if (released.count !== 1) {
            throw new Error("INVENTORY_RELEASE_FAILED");
          }
        }
      }

      // 6. Cancel every linked shop order.
      const ordersUpdate = await tx.order.updateMany({
        where: {
          id: {
            in: orderIds,
          },
          customerId,
          status: {
            in: cancellableStatuses,
          },
        },
        data: {
          status: "CANCELLED",
          paymentStatus: "CANCELLED",
          cancelledAt: new Date(),
          cancellationReason: reason,
          cancellationNote:
            reason === "OTHER"
              ? note.trim()
              : note?.trim() || null,
          cancelledBy: "CUSTOMER",
        },
      });

      if (ordersUpdate.count !== orderIds.length) {
        throw new Error("CHECKOUT_ORDERS_NOT_CANCELLABLE");
      }

      // 7. Mark associated per-order payment records cancelled.
      await tx.payment.updateMany({
        where: {
          orderId: {
            in: orderIds,
          },
          status: "PENDING",
        },
        data: {
          status: "CANCELLED",
        },
      });

      // 8. Restore the carts saved in checkout metadata.
      const metadata = currentCheckout.metadata;
      const cartIds =
        metadata &&
        typeof metadata === "object" &&
        !Array.isArray(metadata) &&
        Array.isArray(metadata.cartIds)
          ? metadata.cartIds.filter(
              (id) => typeof id === "string"
            )
          : [];

      if (cartIds.length > 0) {
        await tx.cart.updateMany({
          where: {
            id: {
              in: cartIds,
            },
            customerId,
            status: "CHECKED_OUT",
          },
          data: {
            status: "ACTIVE",
          },
        });
      }

      // 9. Return the final state.
      const updatedCheckoutPayment =
        await tx.checkoutPayment.findUnique({
          where: {
            id: currentCheckout.id,
          },
          include: {
            orders: {
              include: {
                items: true,
                payment: true,
                shop: true,
              },
            },
          },
        });

      return updatedCheckoutPayment;
    });

    return res.status(200).json({
      success: true,
      message: "Checkout and linked orders cancelled successfully",
      checkoutPayment: result,
    });
  } catch (error) {
    console.error("Cancel checkout error:", error);

    if (error.message === "CHECKOUT_NOT_PENDING") {
      return res.status(409).json({
        success: false,
        message: "Checkout is no longer pending",
      });
    }

    if (error.message === "CHECKOUT_ORDERS_NOT_FOUND") {
      return res.status(409).json({
        success: false,
        message: "No linked orders were found for this checkout",
      });
    }

    if (
      error.message === "CHECKOUT_ORDERS_NOT_CANCELLABLE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "One or more orders can no longer be cancelled",
      });
    }

    if (error.message === "INVENTORY_RELEASE_FAILED") {
      return res.status(409).json({
        success: false,
        message:
          "Stock could not be safely released. No checkout changes were committed.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to cancel checkout",
    });
  }
};























// CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, note } = req.body;

    const customerId = req.user.userId;

    // 1. Validate cancellation reason
    const validReasons = [
      "CHANGED_MIND",
      "ORDERED_BY_MISTAKE",
      "BETTER_PRICE",
      "DELIVERY_TAKING_TOO_LONG",
      "PRODUCT_NOT_NEEDED",
      "WRONG_PRODUCT_OR_QUANTITY",
      "OTHER",
    ];

    if (!reason || !validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Valid cancellation reason is required",
      });
    }

    // 2. If OTHER is selected, note is required
    if (reason === "OTHER" && (!note || !note.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a cancellation note",
      });
    }

    // 3. Find customer's order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }






    // Prevent cancelling only one order from a shared ONLINE checkout.
    if (
      order.checkoutPaymentId &&
      order.paymentMethod === "ONLINE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This order belongs to a shared online checkout. Please cancel the entire checkout instead.",
        checkoutPaymentId: order.checkoutPaymentId,
        cancelCheckoutEndpoint:
          `/checkout/${order.checkoutPaymentId}/cancel`,
      });
    }






    
    // 4. Check if order can be cancelled
    const cancellableStatuses = ["PENDING", "CONFIRMED"];

    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in ${order.status} status`,
      });
    }

    // 5. Cancel order + release reserved stock atomically
    const result = await prisma.$transaction(async (tx) => {
      // Re-check order inside transaction
      const currentOrder = await tx.order.findFirst({
        where: {
          id: orderId,
          customerId,
        },
        include: {
          items: true,
          payment: true,
        },
      });

      if (!currentOrder) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (!cancellableStatuses.includes(currentOrder.status)) {
        throw new Error("ORDER_NOT_CANCELLABLE");
      }

      // 6. Release reserved stock
      for (const item of currentOrder.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId: item.productId,
          },
        });

        if (!inventory) {
          throw new Error(
            `Inventory not found for product ${item.productId}`
          );
        }

        // Safety check - reserved stock must be enough to release
        if (inventory.reservedQuantity < item.quantity) {
          throw new Error(
            `Invalid reserved stock for product ${item.productId}`
          );
        }

        await tx.inventory.update({
          where: {
            productId: item.productId,
          },
          data: {
            reservedQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }




// 7. Mark unpaid online payment as failed
if (
  currentOrder.paymentMethod === "ONLINE" &&
  currentOrder.payment?.status === "PENDING"
) {
  await tx.payment.update({
    where: {
      id: currentOrder.payment.id,
    },
    data: {
      status: "FAILED",
      failedAt: new Date(),
    },
  });
}



   // 8. Cancel order
      const cancelledOrder = await tx.order.update({
        where: {
          id: currentOrder.id,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancellationReason: reason,
          cancellationNote:
            reason === "OTHER" ? note.trim() : note?.trim() || null,
          cancelledBy: "CUSTOMER",
        },
        include: {
          items: true,
          payment: true,
          shop: true,
        },
      });

      return cancelledOrder;
    });

    // 8. Return cancelled order
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: result,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (error.message === "ORDER_NOT_CANCELLABLE") {
      return res.status(400).json({
        success: false,
        message: "Order can no longer be cancelled",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
















// CUSTOMER - REQUEST REFUND
const requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, note, amount } = req.body;

    const customerId = req.user.userId;

    // 1. Validate reason
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Refund reason is required",
      });
    }

    // 2. Find customer's order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3. Refund is only applicable to ONLINE paid orders
    if (order.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "Refund is only available for online payments",
      });
    }

    if (
      !order.payment ||
      !["PAID", "PARTIALLY_REFUNDED"].includes(order.payment.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be refunded",
      });
    }

    // 4. Calculate remaining refundable amount
    const remainingRefundable =
      Number(order.payment.amount) -
      Number(order.payment.refundedAmount);

    // 5. Validate refund amount
    const refundAmount = Number(amount);

    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Refund amount must be greater than 0",
      });
    }

    if (refundAmount > remainingRefundable) {
      return res.status(400).json({
        success: false,
        message: `Maximum refundable amount is ${remainingRefundable}`,
      });
    }

    // 6. Check if an active refund request already exists
    const existingRequest = await prisma.refundRequest.findFirst({
      where: {
        orderId: order.id,
        status: {
          in: ["PENDING", "APPROVED", "PROCESSING"],
        },
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "A refund request already exists for this order",
        refundRequest: existingRequest,
      });
    }

    // 7. Create refund request
    const refundRequest = await prisma.refundRequest.create({
      data: {
        orderId: order.id,
        customerId,
        reason: reason.trim(),
        note: note?.trim() || null,
        amount: refundAmount,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Refund request submitted successfully",
      refundRequest,
    });
  } catch (error) {
    console.error("Request refund error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit refund request",
    });
  }
};







module.exports = {
  createOrder,
  getCheckoutSummary,
  verifyPayment,
  getMyOrders,
  getOrderById,
  getShopOrders,
  updateShopOrderStatus,
  cancelOrder,
  cancelCheckout,
  requestRefund,
};