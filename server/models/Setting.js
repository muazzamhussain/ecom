const mongoose = require("mongoose");

// One document per store (key: "store"). It is created with these defaults
// the first time the settings are read.
const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "store", unique: true },
    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      default: "Ecom",
    },
    adminEmail: { type: String, trim: true, lowercase: true, default: "" },
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Setting", SettingSchema);
