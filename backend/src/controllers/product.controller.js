const prisma = require("../lib/prisma");
const { Prisma } = require("@prisma/client");

const cloudinary = require("../lib/cloudinary");




const attachProductRatings = async (products) => {
  if (!products.length) return products;

  const productIds = products.map((product) => product.id);

  const ratings = await prisma.review.groupBy({
    by: ["productId"],
    where: {
      productId: {
        in: productIds,
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      productId: true,
    },
  });

  const ratingMap = new Map(
    ratings.map((item) => [
      item.productId,
      {
        averageRating: Number((item._avg.rating ?? 0).toFixed(1)),
        totalReviews: item._count.productId,
      },
    ])
  );

  return products.map((product) => ({
    ...product,
    averageRating: ratingMap.get(product.id)?.averageRating ?? 0,
    totalReviews: ratingMap.get(product.id)?.totalReviews ?? 0,
  }));
};





const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mykasho/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};






const createProduct = async (req, res) => {
  try {
const {
  categoryId,
  name,
  slug,
  description,
  price,
  quantity,
  lowStockThreshold,
  weightKg,
} = req.body;

    if (!categoryId || !name || !slug || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category, name, slug and price are required",
      });
    }



if (!req.file) {
  return res.status(400).json({
    success: false,
    message: "Product image is required",
  });
}



    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }





const parsedWeightKg = Number(weightKg ?? 1);

if (!Number.isFinite(parsedWeightKg) || parsedWeightKg <= 0) {
  return res.status(400).json({
    success: false,
    message: "Product weight must be greater than 0 kg",
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



const uploadResult = await uploadToCloudinary(req.file.buffer);

const imageUrl = uploadResult.secure_url;



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
        imageUrl,
        weightKg: parsedWeightKg,
inventory: {
  create: {
    quantity: Number(quantity ?? 0),
    lowStockThreshold: Number(lowStockThreshold ?? 5),
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
    const { category } = req.query;

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
          ...(category && {
            slug: category,
          }),
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

    // ⭐ CHANGE 1: attach real product ratings
    const productsWithRatings = await attachProductRatings(products);

    return res.status(200).json({
      success: true,

      // ⭐ CHANGE 2: return products with ratings
      products: productsWithRatings,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};












const getFeaturedProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isAvailable: true,

        shop: {
          isActive: true,
          isOpen: true,
          verificationStatus: "APPROVED",
        },

        category: {
          isActive: true,
          ...(category && { slug: category }),
        },
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

      take: 10,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get featured products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
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
  isAvailable,
  weightKg,
} = req.body;


const parsedIsAvailable =
  isAvailable !== undefined
    ? isAvailable === "true" || isAvailable === true
    : undefined;

    const ownerId = req.user.userId;




let imageUrl;

if (req.file) {
  const uploadResult = await uploadToCloudinary(req.file.buffer);
  imageUrl = uploadResult.secure_url;
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









const parsedWeightKg =
  weightKg !== undefined ? Number(weightKg) : undefined;

if (
  parsedWeightKg !== undefined &&
  (!Number.isFinite(parsedWeightKg) || parsedWeightKg <= 0)
) {
  return res.status(400).json({
    success: false,
    message: "Product weight must be greater than 0 kg",
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
        ...(price !== undefined && { price: Number(price) }),

        ...(parsedWeightKg !== undefined && {
            weightKg: parsedWeightKg,
            }),

        ...(imageUrl !== undefined && { imageUrl }),
       ...(parsedIsAvailable !== undefined && {
  isAvailable: parsedIsAvailable,
}),
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

    const { status = "active" } = req.query;

const isAvailable = status !== "deleted";

const products = await prisma.product.findMany({
  where: {
    shopId: shop.id,
    isAvailable,
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














const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
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

    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        isAvailable: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};












const searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const search = q.trim();

    const where = {
      isAvailable: true,

      shop: {
        isActive: true,
        isOpen: true,
        verificationStatus: "APPROVED",
      },

      category: {
        isActive: true,
        ...(category && {
          slug: category,
        }),
      },

      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
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
        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    // ⭐ Added: attach real ratings to search results
    const productsWithRatings = await attachProductRatings(products);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      search: search,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      products: productsWithRatings,
    });
  } catch (error) {
    console.error("Search products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};










const filterProducts = async (req, res) => {
  try {
    const {
      categoryId,
      shopId,
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    // Validate price filters
    if (minPrice !== undefined && Number.isNaN(Number(minPrice))) {
      return res.status(400).json({
        success: false,
        message: "Invalid minPrice",
      });
    }

    if (maxPrice !== undefined && Number.isNaN(Number(maxPrice))) {
      return res.status(400).json({
        success: false,
        message: "Invalid maxPrice",
      });
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }

    // Validate inStock
    if (
      inStock !== undefined &&
      inStock !== "true" &&
      inStock !== "false"
    ) {
      return res.status(400).json({
        success: false,
        message: "inStock must be true or false",
      });
    }

    // Find products based on actual available stock:
    // available stock = quantity - reservedQuantity
    let availableStockProductIds = null;

    if (inStock !== undefined) {
      const inventoryRows = await prisma.$queryRaw(
        Prisma.sql`
          SELECT "productId"
          FROM "Inventory"
          WHERE "quantity"
          ${
            inStock === "true"
              ? Prisma.sql`>`
              : Prisma.sql`<=`
          }
          "reservedQuantity"
        `
      );

      availableStockProductIds = inventoryRows.map(
        (item) => item.productId
      );
    }

    const where = {
      isAvailable: true,

      shop: {
        isActive: true,
        isOpen: true,
        verificationStatus: "APPROVED",

        ...(shopId !== undefined && {
          id: shopId,
        }),
      },

      category: {
        isActive: true,

        ...(categoryId !== undefined && {
          id: categoryId,
        }),
      },

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && {
                gte: Number(minPrice),
              }),
              ...(maxPrice !== undefined && {
                lte: Number(maxPrice),
              }),
            },
          }
        : {}),

      ...(inStock !== undefined
        ? {
            id: {
              in: availableStockProductIds,
            },
          }
        : {}),
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
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
        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      filters: {
        categoryId: categoryId || null,
        shopId: shopId || null,
        minPrice: minPrice !== undefined ? Number(minPrice) : null,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : null,
        inStock: inStock !== undefined ? inStock === "true" : null,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      products,
    });
  } catch (error) {
    console.error("Filter products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};















const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId,
        isActive: true,
        isOpen: true,
        verificationStatus: "APPROVED",
      },
      select: {
        id: true,
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
        shopId,
        isAvailable: true,
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
            lowStockThreshold: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      shopId,
      products,
    });
  } catch (error) {
    console.error("Get products by shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop products",
    });
  }
};











module.exports = {
  createProduct,
  getProducts,
  getFeaturedProducts,
  deleteProduct,
  filterProducts,
  getProductById,
   updateProduct,
   updateInventory,
   getMyProducts,
   searchProducts,
    getProductsByShop,
};