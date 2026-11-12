const Setting = require("../models/Setting");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOOLEAN_FIELDS = ["emailNotifications", "darkMode"];

const publicSettings = (s) => ({
  storeName: s.storeName,
  adminEmail: s.adminEmail,
  emailNotifications: s.emailNotifications,
  darkMode: s.darkMode,
});

const badRequest = (res, message) =>
  res.status(400).json({ success: false, message });

// Returns the single settings document, creating it with defaults on first use.
const findOrCreate = (update = {}) =>
  Setting.findOneAndUpdate(
    { key: "store" },
    { ...update, $setOnInsert: { key: "store" } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );

const getSettings = async (req, res) => {
  try {
    const settings = await findOrCreate();

    return res.status(200).json({
      success: true,
      settings: publicSettings(settings),
    });
  } catch (error) {
    console.error("Get settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load settings",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { storeName, adminEmail } = req.body;
    const updates = {};

    if (storeName !== undefined) {
      if (typeof storeName !== "string" || !storeName.trim()) {
        return badRequest(res, "Store name cannot be empty");
      }
      if (storeName.trim().length > 60) {
        return badRequest(res, "Store name must be 60 characters or fewer");
      }
      updates.storeName = storeName.trim();
    }

    if (adminEmail !== undefined) {
      if (typeof adminEmail !== "string") {
        return badRequest(res, "Admin email must be text");
      }

      const email = adminEmail.trim().toLowerCase();

      if (email && !EMAIL_PATTERN.test(email)) {
        return badRequest(res, "Enter a valid email address");
      }
      updates.adminEmail = email;
    }

    for (const field of BOOLEAN_FIELDS) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "boolean") {
          return badRequest(res, `${field} must be true or false`);
        }
        updates[field] = req.body[field];
      }
    }

    if (!Object.keys(updates).length) {
      return badRequest(res, "No valid settings to update");
    }

    const settings = await findOrCreate({ $set: updates });

    return res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      settings: publicSettings(settings),
    });
  } catch (error) {
    console.error("Update settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save settings",
    });
  }
};

module.exports = { getSettings, updateSettings };
