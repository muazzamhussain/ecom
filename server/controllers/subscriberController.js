const Subscriber = require("../models/Subscriber");

const subscribeNewsletter = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isSubscribed) {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed to our newsletter.",
        });
      }

      // Resubscribe an existing subscriber.
      existingSubscriber.isSubscribed = true;
      existingSubscriber.subscribedAt = new Date();
      existingSubscriber.unsubscribedAt = null;

      await existingSubscriber.save();

      return res.status(200).json({
        success: true,
        message: "You have successfully resubscribed!",
      });
    }

    await Subscriber.create({ email });

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to subscribe. Please try again.",
    });
  }
};

module.exports = { subscribeNewsletter };
