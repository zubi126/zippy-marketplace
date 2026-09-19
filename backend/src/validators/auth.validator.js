const { z } = require("zod");

const verifyOtpSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),

    otp: z
      .string()
      .regex(/^\d{4,6}$/, "Please enter a valid OTP"),
  }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = {
  verifyOtpSchema,
};