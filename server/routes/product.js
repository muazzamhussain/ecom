const express = require("express");
const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.delete("/:id", deleteProduct);

router.put("/", updateProduct);

module.exports = router;
