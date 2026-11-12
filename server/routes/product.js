const express = require("express");
const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  createProductReview,
  searchProducts,
} = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/search", searchProducts);

router.post("/", upload.array("images", 8), createProduct);

router.get("/", getProducts);

router.put("/:id", upload.array("images", 8), updateProduct);

router.delete("/:id", deleteProduct);

router.get("/:id", getProductById);

router.post("/:id/review", verifyToken, createProductReview);

module.exports = router;
