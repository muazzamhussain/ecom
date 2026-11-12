const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const createProduct = async (req, res) => {
  let uploadedImages = [];

  try {
    const {
      name,
      description,
      cost,
      price,
      salePrice,
      category,
      brand,
      stock,
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      cost === undefined ||
      price === undefined ||
      salePrice === undefined ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields",
      });
    }

    const numericFields = {
      cost: Number(cost),
      price: Number(price),
      salePrice: Number(salePrice),
      stock: Number(stock ?? 0),
    };

    if (numericFields.salePrice > numericFields.price) {
      return res.status(400).json({
        success: false,
        message: "Sale price cannot exceed the original price",
      });
    }

    if (
      Object.values(numericFields).some(
        (value) => !Number.isFinite(value) || value < 0,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Product prices and stock must be valid non-negative numbers",
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer)),
    );

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      cost: numericFields.cost,
      price: numericFields.price,
      salePrice: numericFields.salePrice,
      category: category.trim(),
      brand: brand?.trim() || "",
      stock: numericFields.stock,
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    // Remove uploaded images if product creation fails.
    await Promise.allSettled(
      uploadedImages.map((image) =>
        cloudinary.uploader.destroy(image.publicId),
      ),
    );

    console.error("Add product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
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
  let newlyUploadedImages = [];

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const oldImages = product.images.map((image) => ({
      publicId: image.publicId,
    }));

    const {
      name,
      description,
      cost,
      price,
      salePrice,
      category,
      brand,
      stock,
      existingImages,
    } = req.body;

    // Validate numeric fields before uploading anything.
    const updates = {};

    for (const field of ["cost", "price", "salePrice", "stock"]) {
      if (req.body[field] !== undefined) {
        const value = Number(req.body[field]);

        if (!Number.isFinite(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a valid non-negative number`,
          });
        }

        updates[field] = value;
      }
    }

    if (
      (updates.salePrice ?? product.salePrice) >
      (updates.price ?? product.price)
    ) {
      return res.status(400).json({
        success: false,
        message: "Sale price cannot exceed the original price",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        });
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
      }
      updates.description = description.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Category cannot be empty" });
      }
      updates.category = category.trim();
    }

    if (brand !== undefined) {
      updates.brand = brand.trim();
    }

    // Retain only images belonging to this product.
    let retainedImages = product.images;

    if (existingImages !== undefined) {
      let publicIds;

      try {
        publicIds = JSON.parse(existingImages);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid existingImages format",
        });
      }

      if (
        !Array.isArray(publicIds) ||
        publicIds.some((id) => typeof id !== "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid existing image IDs",
        });
      }

      retainedImages = product.images.filter((image) =>
        publicIds.includes(image.publicId),
      );
    }

    // Upload newly selected images.
    if (req.files?.length) {
      newlyUploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)),
      );
    }

    const finalImages = [...retainedImages, ...newlyUploadedImages];

    if (!finalImages.length) {
      await Promise.allSettled(
        newlyUploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.publicId),
        ),
      );

      return res.status(400).json({
        success: false,
        message: "A product must have at least one image",
      });
    }

    product.set({
      ...updates,
      images: finalImages,
    });

    await product.save();

    // Remove old images only after successful database save.
    const finalIds = new Set(finalImages.map((image) => image.publicId));

    await Promise.allSettled(
      oldImages
        .filter((image) => !finalIds.has(image.publicId))
        .map((image) => cloudinary.uploader.destroy(image.publicId)),
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    await Promise.allSettled(
      newlyUploadedImages.map((image) =>
        cloudinary.uploader.destroy(image.publicId),
      ),
    );

    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete the database record first.
    await Product.findByIdAndDelete(req.params.id);

    // Then remove its Cloudinary images.
    const results = await Promise.allSettled(
      product.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId),
      ),
    );

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Cloudinary deletion failed:", result.reason);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
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
        product.reviews.length;

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

const searchProducts = async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!q) return res.status(200).json({ success: true, products: [] });

    const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const products = await Product.find({
      $or: [
        { name: { $regex: pattern, $options: "i" } },
        { category: { $regex: pattern, $options: "i" } },
        { brand: { $regex: pattern, $options: "i" } },
      ],
    }).limit(20);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Search products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while searching products",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductReview,
  searchProducts,
};
