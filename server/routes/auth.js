const express = require("express");

const {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
  deleteUser,
  getUsers,
} = require("../controllers/userController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Authenticated routes
router.get("/me", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateProfile);

// Admin-only routes
router.get("/",  getUsers);

router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
