const Product = require("../models/Product");
const Order = require("../models/Order");

// Keep SHIPPING_FEE and FREE_SHIPPING_OVER in sync with CheckoutPage.jsx.
const SHIPPING_FEE = 200;
const FREE_SHIPPING_OVER = 5000;
const TAX_RATE = 0;
const MAX_ITEMS = 50;
const MAX_QUANTITY = 10;

const OBJECT_ID = /^[a-f\d]{24}$/i;
const PHONE_PATTERN = /^[+\d][\d\s-]{9,19}$/;
const ADDRESS_FIELDS = {
  street: "street address",
  city: "city",
  state: "state or province",
  zipCode: "postal code",
  country: "country",
};

const round2 = (value) => Math.round(value * 100) / 100;

const fail = (res, code, message) =>
  res.status(code).json({ success: false, message });

// Puts back stock that was already taken when a later step fails.
const releaseStock = (reserved) =>
  Promise.allSettled(
    reserved.map(({ id, quantity }) =>
      Product.updateOne(
        { _id: id },
        { $inc: { stock: quantity, soldCount: -quantity } },
      ),
    ),
  );

// POST /checkout
// body: { items: [{ productId, quantity }], shippingAddress: {...}, paymentMethod: "COD" }
// Prices and stock always come from the database, never from the browser.
const placeOrder = async (req, res) => {
  const reserved = [];

  try {
    if (req.user.isBlocked) {
      return fail(
        res,
        403,
        "Your account has been blocked. Please contact support.",
      );
    }

    const { items, shippingAddress, paymentMethod = "COD" } = req.body;

    if (paymentMethod !== "COD") {
      return fail(res, 400, "Only cash on delivery is available right now");
    }

    if (!Array.isArray(items) || !items.length || items.length > MAX_ITEMS) {
      return fail(res, 400, "Your cart is empty");
    }

    // Merge duplicate lines and validate each one.
    const quantities = new Map();

    for (const item of items) {
      const quantity = Number(item?.quantity);

      if (
        typeof item?.productId !== "string" ||
        !OBJECT_ID.test(item.productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return fail(res, 400, "Your cart contains an invalid item");
      }

      quantities.set(
        item.productId,
        (quantities.get(item.productId) || 0) + quantity,
      );
    }

    if ([...quantities.values()].some((quantity) => quantity > MAX_QUANTITY)) {
      return fail(
        res,
        400,
        `You can order at most ${MAX_QUANTITY} of each product`,
      );
    }

    // Shipping address
    const address = {};

    for (const [field, label] of Object.entries(ADDRESS_FIELDS)) {
      const value = shippingAddress?.[field];

      if (typeof value !== "string" || !value.trim()) {
        return fail(res, 400, `Please enter your ${label}`);
      }
      address[field] = value.trim();
    }

    const phone =
      typeof shippingAddress?.phone === "string"
        ? shippingAddress.phone.trim()
        : "";

    if (!PHONE_PATTERN.test(phone)) {
      return fail(res, 400, "Please enter a valid phone number");
    }

    // Products and stock
    const ids = [...quantities.keys()];
    const found = await Product.find({ _id: { $in: ids } });

    if (found.length !== ids.length) {
      return fail(res, 409, "Some items in your cart are no longer available");
    }

    const byId = new Map(
      found.map((product) => [String(product._id), product]),
    );
    const products = ids.map((id) => byId.get(id)); // keep the cart's order

    for (const product of products) {
      const quantity = quantities.get(String(product._id));

      if (product.stock < quantity) {
        return fail(
          res,
          409,
          product.stock > 0
            ? `Only ${product.stock} of "${product.name}" left in stock`
            : `"${product.name}" is out of stock`,
        );
      }
    }

    // Take the stock one product at a time. Each update only succeeds if enough
    // is still left, so two shoppers can't both buy the last item.
    for (const product of products) {
      const quantity = quantities.get(String(product._id));

      const result = await Product.updateOne(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity, soldCount: quantity } },
      );

      if (result.modifiedCount !== 1) {
        await releaseStock(reserved);
        return fail(res, 409, `"${product.name}" just went out of stock`);
      }

      reserved.push({ id: product._id, quantity });
    }

    const orderItems = products.map((product) => ({
      productId: product._id,
      name: product.name,
      quantity: quantities.get(String(product._id)),
      price: product.salePrice,
      image: product.images?.[0]?.url || "",
    }));

    const itemsPrice = round2(
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );
    const shippingPrice = itemsPrice >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
    const taxPrice = round2(itemsPrice * TAX_RATE);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    const order = await Order.create({
      userId: req.user._id,
      orderItems,
      shippingAddress: [{ ...address, phone }],
      paymentMethod: "COD",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        _id: order._id,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    await releaseStock(reserved);
    console.error("Place order error:", error);

    return fail(res, 500, "Failed to place your order. Please try again.");
  }
};

module.exports = { placeOrder };
