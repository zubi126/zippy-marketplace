const prisma = require("../lib/prisma");

const subscribeToPush = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({
        success: false,
        message: "Invalid push subscription data",
      });
    }

    const subscription = await prisma.pushSubscription.upsert({
      where: {
        endpoint,
      },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: req.user.userId,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: req.user.userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Push subscription saved successfully",
      subscription: {
        id: subscription.id,
      },
    });
  } catch (error) {
    console.error("Subscribe to push error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save push subscription",
    });
  }
};














const testPushNotification = async (req, res) => {
  try {
    const { sendPushNotification } = require("../services/push.service");

    const result = await sendPushNotification(req.user.userId, {
      title: "Zippy Test Notification",
      body: "Web Push notification is working successfully! 🔔",
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Test push notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send test notification",
    });
  }
};

module.exports = {
  subscribeToPush,
  testPushNotification,
};