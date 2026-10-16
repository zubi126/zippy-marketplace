const razorpay = require("../lib/razorpay");

const createRazorpayOrder = async ({ orderId, amount }) => {
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: orderId,
  });

  return razorpayOrder;
};




const verifyRazorpayPayment = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const crypto = require("crypto");

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
};




const refundRazorpayPayment = async ({
  paymentId,
  amount,
  notes = {},
}) => {
  try {
    if (!paymentId) {
      throw new Error("Razorpay payment ID is required");
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("Refund amount must be greater than 0");
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: Math.round(Number(amount) * 100),
      notes,
    });

    return refund;
  } catch (error) {
    console.error("Razorpay refund error:", error);

    throw error;
  }
};












const getRazorpayOrderPayments = async ({ razorpayOrderId }) => {
  if (!razorpayOrderId) {
    throw new Error("Razorpay order ID is required");
  }

  try {
    const result = await razorpay.orders.fetchPayments(razorpayOrderId);
    return result.items || [];
  } catch (error) {
    console.error("Razorpay payment status lookup error:", error);
    throw error;
  }
};










const getRazorpayPayment = async ({ razorpayPaymentId }) => {
  if (!razorpayPaymentId) {
    throw new Error("Razorpay payment ID is required");
  }

  return razorpay.payments.fetch(razorpayPaymentId);
};





module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  refundRazorpayPayment,
  getRazorpayOrderPayments,
  getRazorpayPayment,
};