const prisma = require("../lib/prisma");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const customerId = req.user.userId;

    // Find product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        shop: true,
        inventory: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (!product.shop.isActive || !product.shop.isOpen) {
      return res.status(400).json({
        success: false,
        message: "Shop is currently unavailable",
      });
    }

    if (!product.inventory) {
      return res.status(400).json({
        success: false,
        message: "Product inventory not found",
      });
    }

    const availableQuantity =
      product.inventory.quantity - product.inventory.reservedQuantity;

    if (quantity > availableQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableQuantity} items available`,
      });
    }

    // Find or create ACTIVE cart for this customer + shop
    let cart = await prisma.cart.findUnique({
      where: {
        customerId_shopId_status: {
          customerId,
          shopId: product.shopId,
          status: "ACTIVE",
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          customerId,
          shopId: product.shopId,
          status: "ACTIVE",
        },
      });
    }

    // Check whether product is already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableQuantity} items available`,
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        item: updatedItem,
      });
    }

    // Add new item
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      item: cartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};









const getMyCart = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const cart = await prisma.cart.findFirst({
      where: {
        customerId,
        status: "ACTIVE",
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true,
            isOpen: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                imageUrl: true,
                isAvailable: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: null,
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      lineTotal: Number(item.product.price) * item.quantity,
      imageUrl: item.product.imageUrl,
      isAvailable: item.product.isAvailable,
    }));

    const subtotal = items.reduce(
      (total, item) => total + item.lineTotal,
      0
    );

    return res.status(200).json({
      success: true,
      cart: {
        id: cart.id,
        status: cart.status,
        shop: cart.shop,
        items,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};





const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const customerId = req.user.userId;

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          customerId,
          status: "ACTIVE",
        },
      },
      include: {
        product: {
          include: {
            inventory: true,
            shop: true,
          },
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (!cartItem.product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    const inventory = cartItem.product.inventory;

    if (!inventory) {
      return res.status(400).json({
        success: false,
        message: "Product inventory not found",
      });
    }

    const availableQuantity =
      inventory.quantity - inventory.reservedQuantity;

    if (quantity > availableQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableQuantity} items available`,
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};





const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const customerId = req.user.userId;

    // Verify that this item belongs to the logged-in customer's active cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          customerId,
          status: "ACTIVE",
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


module.exports = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
};