const prisma = require("../lib/prisma");

const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      price,
      imageUrl,
      quantity,
      lowStockThreshold,
    } = req.body;

    if (!categoryId || !name || !slug || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category, name, slug and price are required",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    const ownerId = req.user.userId;
















    // Find the shop owned by the logged-in shopkeeper
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

    // Make sure category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: "Category not found or inactive",
      });
    }

    // Product slug is unique only within this shop
    const existingProduct = await prisma.product.findUnique({
      where: {
        shopId_slug: {
          shopId: shop.id,
          slug,
        },
      },
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product slug already exists in your shop",
      });
    }

    const product = await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId,
        name,
        slug,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        inventory: {
          create: {
            quantity: quantity ?? 0,
            lowStockThreshold: lowStockThreshold ?? 5,
          },
        },
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};







// get product 
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        shop: {
          isActive: true,
          isOpen: true,
           verificationStatus: "APPROVED",
        },
        category: {
          isActive: true,
        },
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            isOpen: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        inventory: {
          select: {
            quantity: true,
            reservedQuantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};










const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        isAvailable: true,
        shop: {
          isActive: true,
          isOpen: true,
        },
        category: {
          isActive: true,
        },
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
            isOpen: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        inventory: {
          select: {
            quantity: true,
            reservedQuantity: true,
            lowStockThreshold: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

















const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      categoryId,
      name,
      slug,
      description,
      price,
      imageUrl,
      isAvailable,
    } = req.body;

    const ownerId = req.user.userId;

    // Find the shop owned by the logged-in shopkeeper
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

    // Find product and make sure it belongs to this shop
    const product = await prisma.product.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in your shop",
      });
    }

    // Validate category if categoryId is being changed
    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category || !category.isActive) {
        return res.status(404).json({
          success: false,
          message: "Category not found or inactive",
        });
      }
    }

    // Validate price if provided
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    // Check slug conflict within the same shop
    if (slug !== undefined && slug !== product.slug) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          shopId: shop.id,
          slug,
          id: {
            not: id,
          },
        },
      });

      if (existingProduct) {
        return res.status(409).json({
          success: false,
          message: "Product slug already exists in your shop",
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};





















const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, lowStockThreshold } = req.body;

    const ownerId = req.user.userId;

    // Quantity required
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    // Validate quantity
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative integer",
      });
    }

    // Validate low stock threshold if provided
    if (
      lowStockThreshold !== undefined &&
      (!Number.isInteger(Number(lowStockThreshold)) ||
        Number(lowStockThreshold) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Low stock threshold must be a non-negative integer",
      });
    }

    // Find the shop owned by the logged-in shopkeeper
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

    // Find product belonging to this shop
    const product = await prisma.product.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in your shop",
      });
    }

    if (!product.inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this product",
      });
    }

    // Don't allow quantity below already reserved stock
    if (Number(quantity) < product.inventory.reservedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Quantity cannot be less than reserved quantity (${product.inventory.reservedQuantity})`,
      });
    }

    const inventory = await prisma.inventory.update({
      where: {
        productId: product.id,
      },
      data: {
        quantity: Number(quantity),
        ...(lowStockThreshold !== undefined && {
          lowStockThreshold: Number(lowStockThreshold),
        }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
















const getMyProducts = async (req, res) => {
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

    const products = await prisma.product.findMany({
      where: {
        shopId: shop.id,
      },
      include: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedProducts = products.map((product) => {
      const inventory = product.inventory;

      const availableQuantity = inventory
        ? inventory.quantity - inventory.reservedQuantity
        : 0;

      const isLowStock =
        inventory !== null &&
        availableQuantity <= inventory.lowStockThreshold;

      return {
        ...product,
        availableQuantity,
        isLowStock,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Get my products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};









module.exports = {
  createProduct,
  getProducts,
  getProductById,
   updateProduct,
   updateInventory,
   getMyProducts,
};