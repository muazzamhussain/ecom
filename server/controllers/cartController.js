const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: qty,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice ?? product.price,
        image: product.images?.[0] || "",
        images: product.images || [],
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCart = async (req, res) => {
  const { quantity } = req.body;
  const userId = req.user.id || req.user._id;
  const targetId = req.params.productId || req.params.itemId || req.params.id;

  try {
    const newQty = parseInt(quantity, 10);
    if (isNaN(newQty)) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === targetId.toString() ||
        item._id.toString() === targetId.toString(),
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (newQty <= 0) {
      // Remove item if quantity set to 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const targetId = req.params.productId || req.params.itemId || req.params.id;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== targetId.toString() &&
        item._id.toString() !== targetId.toString(),
    );

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id || req.user._id;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared completely",
      cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };

