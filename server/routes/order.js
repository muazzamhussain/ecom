const express = require("express");
const {
  addOrderItems,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderToBePaid,
  updateOrderToBeDelivered,
} = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", addOrderItems);

router.get("/", getOrders);

router.get("/myorders", verifyToken, getMyOrders);

router.get("/:id", getOrderById);

router.put("/:id/pay", updateOrderToBePaid);

router.put("/:id/deliver", updateOrderToBeDelivered);

module.exports = router;
