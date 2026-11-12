const Preference = require("../models/Preference");

// GET
const getPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findOneAndUpdate(
      { userId: req.user._id },
      {
        $setOnInsert: {
          userId: req.user._id,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Get preferences error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch preferences",
    });
  }
};

// PATCH
const updatePreferences = async (req, res) => {
  try {
    const { general, notifications, security } = req.body;

    const allowedFields = {
      general: ["language", "currency", "timezone"],
      notifications: [
        "orderUpdates",
        "smsAlerts",
        "priceDrops",
        "backInStock",
        "promotions",
        "newsletter",
      ],
      security: ["twoFA", "loginAlerts"],
    };

    const updates = {};

    // Validate and flatten nested fields
    for (const section of Object.keys(allowedFields)) {
      const sectionData = req.body[section];

      if (sectionData === undefined) continue;

      if (
        !sectionData ||
        typeof sectionData !== "object" ||
        Array.isArray(sectionData)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${section} data`,
        });
      }

      for (const [key, value] of Object.entries(sectionData)) {
        if (!allowedFields[section].includes(key)) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${section} field: ${key}`,
          });
        }

        if (section === "notifications" || section === "security") {
          if (typeof value !== "boolean") {
            return res.status(400).json({
              success: false,
              message: `${key} must be a boolean`,
            });
          }
        } else if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({
            success: false,
            message: `${key} must be a non-empty string`,
          });
        }

        updates[`${section}.${key}`] = value;
      }
    }

    // Reject empty or unsupported request bodies
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid preference fields provided",
      });
    }

    const preferences = await Preference.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: updates,
        $setOnInsert: {
          userId: req.user._id,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update preferences",
    });
  }
};

module.exports = { getPreferences, updatePreferences };
