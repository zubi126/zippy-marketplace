

const prisma = require("../lib/prisma");





const updateMyProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const customerId = req.user.userId;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (email !== undefined && email !== null && !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be empty",
      });
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.trim(),
          id: {
            not: customerId,
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const user = await prisma.user.update({
      where: {
        id: customerId,
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),
        ...(email !== undefined && {
          email: email?.trim() || null,
        }),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update customer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};





module.exports = {
  updateMyProfile,
};