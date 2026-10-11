const webpush = require("web-push");
const prisma = require("../lib/prisma");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (userId, payload) => {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
      },
    });

    if (!subscriptions.length) {
      return {
        success: false,
        message: "No push subscriptions found for this user",
      };
    }

    const results = [];

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        );

        results.push({
          subscriptionId: subscription.id,
          success: true,
        });
      } catch (error) {
        console.error(
          `Push notification failed for subscription ${subscription.id}:`,
          error.message
        );

        // Subscription is no longer valid
        if (error.statusCode === 404 || error.statusCode === 410) {
          await prisma.pushSubscription.delete({
            where: {
              id: subscription.id,
            },
          });
        }

        results.push({
          subscriptionId: subscription.id,
          success: false,
        });
      }
    }

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error("Send push notification error:", error);

    return {
      success: false,
      message: "Failed to send push notification",
    };
  }
};

module.exports = {
  sendPushNotification,
};