const express = require("express");
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/items", addToCart);
router.put("/items/:productId", verifyToken, updateCart);
router.delete("/items/:productId", verifyToken, removeFromCart);
router.delete("/", verifyToken, clearCart);

module.exports = router;
