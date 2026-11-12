const express = require("express");
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/preferenceController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getPreferences);
router.patch("/", verifyToken, updatePreferences);

module.exports = router;
