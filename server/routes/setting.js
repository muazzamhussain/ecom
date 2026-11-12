const express = require("express");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), getSettings);
router.put("/", verifyToken, authorizeRoles("admin"), updateSettings);

module.exports = router;
