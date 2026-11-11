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

// All cart routes require authentication
router.use(verifyToken);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:productId", updateCart);
router.delete("/items/:productId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;

