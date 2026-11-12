const express = require("express");
const {
  addOrderItems,
  getOrders,
  getMyOrders,
  getOrderById,
  updatePayStatus,
  updateDeliveryStatus,
  updateOrderStatus,
} = require("../controllers/orderController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addOrderItems);

router.get("/", verifyToken, getOrders);

router.get("/myorders", verifyToken, getMyOrders);

router.get("/:id", verifyToken, getOrderById);

router.put("/:id/pay", verifyToken, authorizeRoles("admin"), updatePayStatus);

router.put(
  "/:id/deliver",
  verifyToken,
  authorizeRoles("admin"),
  updateDeliveryStatus,
);


router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin"),
  updateOrderStatus
);


module.exports = router;
