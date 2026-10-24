const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        name: String,
        price: Number,
        image: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", CartSchema);
