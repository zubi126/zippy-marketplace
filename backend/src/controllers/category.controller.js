const prisma = require("../lib/prisma");

const createCategory = async (req, res) => {
  try {
    const { name, slug, parentId } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: {
          id: parentId,
        },
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createCategory,
};