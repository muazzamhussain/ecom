const express = require("express");
const {
  addOrderItems,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderToBePaid,
  updateOrderToBeDelivered,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", addOrderItems);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.get("/myorders", getMyOrders);

router.put("/:id/pay", updateOrderToBePaid);

router.put("/:id/deliver", updateOrderToBeDelivered);

module.exports = router;
