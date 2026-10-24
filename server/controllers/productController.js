const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      cost,
      price,
      salePrice,
      category,
      brand,
      images,
      stock,
      ratings,
      reviews,
    } = req.body;

    if (
      !name ||
      !description ||
      !cost ||
      !price ||
      !category ||
      !salePrice ||
      !stock
    ) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const newProduct = new Product({
      name,
      description,
      cost,
      price,
      salePrice,
      category,
      brand,
      images,
      stock,
      ratings,
      reviews,
    });

    const createdProduct = await newProduct.save();

    res
      .status(201)
      .json({ message: "product saved successfully" }, createdProduct);
  } catch (error) {
    console.log("Product saving Error: " + error);
    return res.status(500).json({ message: "Internal server error " + error });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log("Error getting products " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.body.id;

    const product = await Product.findById(productId);
    if (product) {
      const {
        name,
        description,
        cost,
        price,
        salePrice,
        category,
        brand,
        images,
        stock,
      } = req.body;

      const updatedProduct = await Product.updateOne({
        name,
        description,
        cost,
        price,
        salePrice,
        category,
        brand,
        images,
        stock,
      });

      res.status(200).json({ message: "Product updated successfully" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log("Error updating product " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id || req.body.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found!" });
    }
  } catch (error) {
    console.log("Error getting product by id " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = await product.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString(),
      );
      if (alreadyReviewed)
        return res.status(400).json({ message: "Product already reviewed." });

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        userId: req.user._id,
      };
      product.reviews.push(review);
      product.ratings.count = product.reviews.length;
      product.ratings.average =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        items.reviews.length;

      await product.save();
      res.status(200).json({ message: "Review added successfully" });
    } else {
      res.status(404).json({ message: "Product not found!" });
    }
  } catch (error) {
    console.log("Error creating product review " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductReview,
};
