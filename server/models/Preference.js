const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    general: {
      language: {
        type: String,
        default: "en",
        enum: ["en", "ur", "ar"],
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "PKR", "EUR", "GBP"],
      },
      timezone: {
        type: String,
        default: "Asia/Karachi",
      },
    },

    notifications: {
      orderUpdates: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      priceDrops: { type: Boolean, default: true },
      backInStock: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
    },

    security: {
      twoFA: { type: Boolean, default: false },
      loginAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Preference", PreferenceSchema);
