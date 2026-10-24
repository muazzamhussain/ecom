const Product = require("../models/Product");
const Order = require("../models/Order");

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0)
    return res.status(404).json({ message: "No items to order." });

  try {
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    const result = await Product.bulkWrite(bulkOps);

    if (result.modifiedCount !== orderItems.length)
      return res.status(400).json({
        message:
          "Inventory conflict: One or more selected items are out of stock",
      });

    const order = new Order({
      orderItems,
      userId: req.user._id,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log("Error adding order items " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error getting orders " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email",
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found!" });
    }
  } catch (error) {
    console.log("Error getting order by id " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error getting my orders " + error);
    res.status(500).json({ message: "Internal server errror" });
  }
};

const updateOrderToBePaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.paymentStatus = "Paid";
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        email_address: req.body.payer?.email_address || req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found!" });
    }
  } catch (error) {
    console.log("Error update order to be paid " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderToBeDelivered = async (req, res) => {
  try {
    const order = await Order.find(req.params.id);
    if (order) {
      order.orderStatus = "Delivered";
      order.deliveredDate = Date.now();

      const updatedOrder = order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not Found!" });
    }
  } catch (error) {
    console.log("Error update order to be delivered " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addOrderItems,
  getOrders,
  getOrderById,
  getMyOrders,
  updateOrderToBePaid,
  updateOrderToBeDelivered,
};
