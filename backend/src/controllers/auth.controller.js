const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");



















const register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      verificationId,
    } = req.body;

    // Basic validation
    if (!name || !phone || !password || !verificationId) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, password and verificationId are required",
      });
    }

    // Check verified OTP
   
    // Check verified, active and unused OTP
    const otpVerification = await prisma.otpVerification.findFirst({
      where: {
        id: verificationId,
        phone,
        purpose: "CUSTOMER_REGISTRATION",
        verified: true,
        invalidatedAt: null,
        consumedAt: null,
      },
    });


    if (!otpVerification) {
      return res.status(400).json({
        success: false,
        message: "Phone number is not verified. Please verify OTP first",
      });
    }

    // Check OTP verification expiry
    if (new Date() > otpVerification.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP verification has expired. Please verify your phone again",
      });
    }

    // Check existing phone
    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
   
    // Create user and consume OTP atomically
    const registrationResult = await prisma.$transaction(async (tx) => {
      const consumedOtp = await tx.otpVerification.updateMany({
        where: {
          id: verificationId,
          phone,
          purpose: "CUSTOMER_REGISTRATION",
          verified: true,
          invalidatedAt: null,
          consumedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          consumedAt: new Date(),
        },
      });

      // OTP was already consumed, invalidated or expired
      if (consumedOtp.count !== 1) {
        return { otpInvalid: true };
      }

      // Create user only after OTP is successfully consumed
      const user = await tx.user.create({
        data: {
          name,
          phone,
          email: email || null,
          passwordHash,
          role: "CUSTOMER",
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      return { user };
    });

    if (registrationResult.otpInvalid) {
      return res.status(400).json({
        success: false,
        message:
          "OTP is invalid, expired or already used. Please verify your phone again",
      });
    }

    const user = registrationResult.user;


    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


















const registerShopkeeper = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      verificationId,
      shopName,
      shopSlug,
      shopPhone,
      shopAddress,
      latitude,
      longitude,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !phone ||
      !password ||
      !verificationId ||
      !shopName ||
      !shopSlug ||
      !shopPhone ||
      !shopAddress
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone, password, verificationId, shop name, shop slug, shop phone and shop address are required",
      });
    }

    // Check verified OTP
    const otpVerification = await prisma.otpVerification.findFirst({
      where: {
        id: verificationId,
        phone,
        purpose: "SHOPKEEPER_REGISTRATION",
        verified: true,
        invalidatedAt: null,
        consumedAt: null,
      },
    });

    if (!otpVerification) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number is not verified. Please verify OTP first",
      });
    }

    // Check OTP verification expiry
    if (new Date() > otpVerification.expiresAt) {
      return res.status(400).json({
        success: false,
        message:
          "OTP verification has expired. Please verify your phone again",
      });
    }

    // Check existing phone
    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Check existing email
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    // Check existing shop slug
    const existingSlug = await prisma.shop.findUnique({
      where: {
        slug: shopSlug,
      },
    });

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "Shop slug already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + shop together
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          phone,
          email: email || null,
          passwordHash,
          role: "SHOPKEEPER",
        },
      });

      const shop = await tx.shop.create({
        data: {
          ownerId: user.id,
          name: shopName,
          slug: shopSlug,
          phone: shopPhone,
          address: shopAddress,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          verificationStatus: "PENDING",
        },
      });

      return { user, shop };
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: result.user.id,
        role: result.user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Shopkeeper registration submitted successfully",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        phone: result.user.phone,
        email: result.user.email,
        role: result.user.role,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt,
      },
      shop: result.shop,
    });
  } catch (error) {
    console.error("Shopkeeper registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};










const registerRider = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      verificationId,
    } = req.body;

    // Basic validation
    if (!name || !phone || !password || !verificationId) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone, password and verificationId are required",
      });
    }

    // Check verified OTP
    const otpVerification = await prisma.otpVerification.findFirst({
      where: {
        id: verificationId,
        phone,
        purpose: "RIDER_REGISTRATION",
        verified: true,
        invalidatedAt: null,
        consumedAt: null,
      },
    });

    if (!otpVerification) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number is not verified. Please verify OTP first",
      });
    }

    // Check OTP verification expiry
    if (new Date() > otpVerification.expiresAt) {
      return res.status(400).json({
        success: false,
        message:
          "OTP verification has expired. Please verify your phone again",
      });
    }

    // Check existing phone
    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Check existing email
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + rider profile together
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          phone,
          email: email || null,
          passwordHash,
          role: "RIDER",
        },
      });

      const rider = await tx.rider.create({
        data: {
          userId: user.id,
          status: "OFFLINE",
          verificationStatus: "PENDING",
        },
      });

      return { user, rider };
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: result.user.id,
        role: result.user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Rider registration submitted successfully",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        phone: result.user.phone,
        email: result.user.email,
        role: result.user.role,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt,
      },
      rider: result.rider,
    });
  } catch (error) {
    console.error("Rider registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};













const login = async (req, res) => {
  try {
    const { phone, password, adminSecret } = req.body;








    const { portal } = req.body;

    const allowedRoles = {
      customer: "CUSTOMER",
      seller: "SHOPKEEPER",
      rider: "RIDER",
      admin: "ADMIN",
    };

    if (!portal || !allowedRoles[portal]) {
      return res.status(400).json({
        success: false,
        message: "Invalid login portal",
      });
    }








    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }







    if (user.role !== allowedRoles[portal]) {
      return res.status(403).json({
        success: false,
        message: "This account cannot log in through this portal",
      });
    }








    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }






if (user.role === "ADMIN") {
  if (!adminSecret) {
    return res.status(401).json({
      success: false,
      message: "Admin secret is required",
    });
  }

  if (adminSecret !== process.env.ADMIN_ACCESS_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin secret",
    });
  }
}








 const token = jwt.sign(
  {
    userId: user.id,
    role: user.role,
    ...(user.role === "ADMIN" && {
      adminVerified: true,
    }),
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  }
);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};










const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};












const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};






















const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    // Basic validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check 60-second resend cooldown
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose: "PASSWORD_RESET",
        verified: false,
        lastSentAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    // 2Factor API
    const apiUrl =
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN/Zippy%20Login%20OTP`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    console.log("2Factor forgot password response:", data);

    if (data.Status !== "Success") {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    // Save 2Factor session ID
    await prisma.otpVerification.create({
      data: {
        phone,
        purpose: "PASSWORD_RESET",
        sessionId: data.Details,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        verified: false,
        lastSentAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Basic validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    // Validate OTP format
    if (!/^\d{4,6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid OTP",
      });
    }

    // Find latest unverified OTP
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose: "PASSWORD_RESET",
        verified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found. Please request a new OTP",
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Check maximum attempts
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP",
      });
    }

    // 2Factor Verify API
    const apiUrl =
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${otpRecord.sessionId}/${otp}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    console.log("2Factor forgot password verify response:", data);

    // OTP failed
    if (
      data.Status !== "Success" ||
      data.Details !== "OTP Matched"
    ) {
      await prisma.otpVerification.update({
        where: {
          id: otpRecord.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      phone,
      verificationId: otpRecord.id,
    });
  } catch (error) {
    console.error("Verify forgot password OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};







const resetPassword = async (req, res) => {
  try {
    const {
      phone,
      verificationId,
      newPassword,
    } = req.body;

    // Basic validation
    if (!phone || !verificationId || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Phone, verificationId and new password are required",
      });
    }

    // Check verified OTP
    const otpVerification = await prisma.otpVerification.findFirst({
      where: {
        id: verificationId,
        phone,
        purpose: "PASSWORD_RESET",
        verified: true,
      },
    });

    if (!otpVerification) {
      return res.status(400).json({
        success: false,
        message: "Password reset verification is invalid",
      });
    }

    // Check OTP verification expiry
    if (new Date() > otpVerification.expiresAt) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset verification has expired. Please verify OTP again",
      });
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};









const sendOtp = async (req, res) => {
  try {
    const { phone, purpose } = req.body;





const validPurposes = [
  "CUSTOMER_REGISTRATION",
  "SHOPKEEPER_REGISTRATION",
  "RIDER_REGISTRATION",
];

if (!validPurposes.includes(purpose)) {
  return res.status(400).json({
    success: false,
    message: "Invalid OTP purpose",
  });
}




    // Validate phone
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    // Check 60-second resend cooldown
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose,
        verified: false,
        lastSentAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    // 2Factor API
    const apiUrl =
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN/Zippy%20Login%20OTP`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    console.log("2Factor response:", data);

    if (data.Status !== "Success") {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    // Save 2Factor session ID
    await prisma.otpVerification.create({
      data: {
        phone,
        purpose,
        sessionId: data.Details,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        verified: false,
        lastSentAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




















const resendOtp = async (req, res) => {
  try {
    const { phone, purpose } = req.body;




const validPurposes = [
  "CUSTOMER_REGISTRATION",
  "SHOPKEEPER_REGISTRATION",
  "RIDER_REGISTRATION",
];

if (!validPurposes.includes(purpose)) {
  return res.status(400).json({
    success: false,
    message: "Invalid OTP purpose",
  });
}




    // Validate phone
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    // Find latest OTP for this phone
    const latestOtp = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 60-second resend cooldown
    if (
      latestOtp &&
      latestOtp.lastSentAt.getTime() >
        Date.now() - 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    // Send new OTP through 2Factor
    const apiUrl =
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN/Zippy%20Login%20OTP`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("2Factor resend response:", data);

    if (data.Status !== "Success") {
      return res.status(500).json({
        success: false,
        message: "Failed to resend OTP",
      });
    }

   
    // Invalidate previous OTPs without marking them as verified
    const now = new Date();

    await prisma.otpVerification.updateMany({
      where: {
        phone,
        purpose,
        invalidatedAt: null,
      },
      data: {
        invalidatedAt: now,
      },
    });

    // Create the new OTP record
    await prisma.otpVerification.create({
      data: {
        phone,
        purpose,
        sessionId: data.Details,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        verified: false,
        consumedAt: null,
        invalidatedAt: null,
        lastSentAt: now,
      },
    });



    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




































const verifyOtp = async (req, res) => {
  try {
   const { phone, otp, purpose } = req.body;

    // Basic validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }





    const validPurposes = [
      "CUSTOMER_REGISTRATION",
      "SHOPKEEPER_REGISTRATION",
      "RIDER_REGISTRATION",
    ];



console.log("VERIFY PURPOSE:", JSON.stringify(purpose));
console.log("VALID PURPOSES:", validPurposes);



    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose",
      });
    }



    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit Indian phone number",
      });
    }

    // Validate OTP format
    if (!/^\d{4,6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid OTP",
      });
    }

    // Find latest unverified OTP
   
    // Find latest active, unverified OTP
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose,
        verified: false,
        invalidatedAt: null,
        consumedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found. Please request a new OTP",
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Check maximum attempts
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP",
      });
    }

    // 2Factor Verify API
    const apiUrl =
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${otpRecord.sessionId}/${otp}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    console.log("2Factor verify response:", data);

    // OTP failed
    if (
      data.Status !== "Success" ||
      data.Details !== "OTP Matched"
    ) {
      await prisma.otpVerification.update({
        where: {
          id: otpRecord.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      phone,
      purpose,
      verificationId: otpRecord.id,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};









module.exports = {
  register,
   registerShopkeeper,
   registerRider,
  login,
  me,
  sendOtp,
  
  resendOtp,
  verifyOtp,
  logout,

   forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
};


