const express = require("express");
const {
  signup,
  signin,
  getUserProfile,
  updateProfile,
  deleteUser,
  getUsers,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sign-up", signup);

router.post("/sign-in", signin);

router.get("/profile", verifyToken, getUserProfile);

router.put("/profile", updateProfile);

router.get("/", getUsers);

router.delete("/:id", deleteUser);

module.exports = router;
