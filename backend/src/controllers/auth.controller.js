const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Basic validation
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
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
    const user = await prisma.user.create({
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

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
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






const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

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








const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

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
    const { phone } = req.body;

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

    // Invalidate previous unverified OTPs
    await prisma.otpVerification.updateMany({
      where: {
        phone,
        verified: false,
      },
      data: {
        verified: true,
      },
    });

    // Create new OTP record
    await prisma.otpVerification.create({
      data: {
        phone,
        sessionId: data.Details,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        verified: false,
        lastSentAt: new Date(),
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

    // Find existing user
    let user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    // Create customer if user doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: "CUSTOMER",
        },
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

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

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
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
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};












module.exports = {
  register,
  login,
  me,
  sendOtp,
  resendOtp,
  verifyOtp,
};


