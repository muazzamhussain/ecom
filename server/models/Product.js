const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    brand: { type: String },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: "User" },
        name: { type: String },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
