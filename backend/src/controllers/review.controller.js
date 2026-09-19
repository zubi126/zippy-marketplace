const prisma = require("../lib/prisma");

const createReview = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { productId, orderId, rating, comment } = req.body;

    // Basic validation
    if (!productId || !orderId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, order ID and rating are required",
      });
    }

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only delivered orders can be reviewed
    if (order.status !== "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "You can only review products from delivered orders",
      });
    }

    // Check product exists in this order
    const orderItem = order.items.find(
      (item) => item.productId === productId
    );

    if (!orderItem) {
      return res.status(400).json({
        success: false,
        message: "This product does not belong to the selected order",
      });
    }

    // Check duplicate review
    const existingReview = await prisma.review.findUnique({
      where: {
        customerId_productId_orderId: {
          customerId,
          productId,
          orderId,
        },
      },
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product for this order",
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        customerId,
        productId,
        orderId,
        rating,
        comment: comment || null,
      },
      select: {
        id: true,
        customerId: true,
        productId: true,
        orderId: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};













const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};










const updateReview = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (rating === undefined && comment === undefined) {
      return res.status(400).json({
        success: false,
        message: "Rating or comment is required",
      });
    }

    if (
      rating !== undefined &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        customerId,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && {
          comment: comment || null,
        }),
      },
      select: {
        id: true,
        customerId: true,
        productId: true,
        orderId: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};












const deleteReview = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { reviewId } = req.params;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        customerId,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};