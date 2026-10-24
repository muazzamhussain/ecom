const Cart = require("../models/Cart");
const Product = require("../models/Product");

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

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findById({ userId: req.body.user._id });
    if (!cart) Cart.create({ userId: req.body.user._id, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        quantity,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images[0] || "",
      });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error adding item to cart " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById({ userId: req.body.user._id });

    const item = cart?.items.find(
      (i) => i.productId.toString() === req.params.id,
    );
    if (item) {
      item.quantity = Number(quantity);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("Error updating cart" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById({ userId: req.body.user._id });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== req.params.productId,
      );
      cart.save();
      res.ststus(200).json(cart);
    } else {
      res.status(404).json({ message: "Cart not found!" });
    }
  } catch (error) {
    console.log("Error deleting cart " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findById({ userId: req.body.user._id });
    if (cart) {
      cart.items = [];
      cart.save();
      res.status(200).json({ message: "Cart cleared completely", cart });
    } else {
      res.status(404).json({ message: "Cart not found!" });
    }
  } catch (error) {
    console.log("Error clearing cart " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart};
