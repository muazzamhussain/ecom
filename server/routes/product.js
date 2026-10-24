const express = require("express");
const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  createProductReview,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.delete("/:id", deleteProduct);

router.put("/", updateProduct);

router.get("/:id", getProductById);

router.post("/:id/review", createProductReview);

module.exports = router;
