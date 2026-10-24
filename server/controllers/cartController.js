const Cart = require("../models/Cart");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.body._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.body._id, items: [] });
      res.status(200).json(cart);
    }
  } catch (error) {
    console.log("Error getting cart" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getCart}