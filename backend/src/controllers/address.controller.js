const prisma = require("../lib/prisma");

const createAddress = async (req, res) => {
  try {
    const {
      label,
      fullAddress,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (!label || !fullAddress || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message:
          "Label, full address, city, state and pincode are required",
      });
    }

    const userId = req.user.userId;

    // If this address should be default,
    // remove default status from existing addresses.
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label,
        fullAddress,
        city,
        state,
        pincode,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        isDefault: isDefault ?? false,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.error("Create address error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};






const getMyAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};










// UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      label,
      fullAddress,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    // First check that this address belongs to logged-in customer
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If this address is being made default,
    // remove default from all other addresses
    if (isDefault === true) {
      await prisma.address.updateMany({
        where: {
          userId: req.user.userId,
          id: {
            not: id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        ...(label !== undefined && { label }),
        ...(fullAddress !== undefined && { fullAddress }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(isDefault !== undefined && {
          isDefault: isDefault === true,
        }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};








// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check that address belongs to logged-in customer
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id,
      },
    });

    // If deleted address was default,
    // make the latest remaining address default
    if (existingAddress.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: {
          userId: req.user.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};






// SET DEFAULT ADDRESS
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check that address belongs to logged-in customer
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Remove default from all user's addresses
    await prisma.address.updateMany({
      where: {
        userId: req.user.userId,
      },
      data: {
        isDefault: false,
      },
    });

    // Make selected address default
    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Set default address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};


module.exports = {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};