import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Upload, X, ImagePlus } from "lucide-react";

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EMPTY = {
  name: "",
  description: "",
  cost: "",
  price: "",
  salePrice: "",
  category: "T-Shirts",
  brand: "",
  stock: "0",
};

const inputClass =
  "w-full rounded-full bg-[#F0F0F0] px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10";

const ProductForm = ({ mode = "add", initial, onSave, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const newImagesRef = useRef(newImages);
  newImagesRef.current = newImages;

  useEffect(
    () => () =>
      newImagesRef.current.forEach((i) => URL.revokeObjectURL(i.preview)),
    [],
  );
  useEffect(() => {
    setForm({
      ...EMPTY,
      ...initial,
      cost: initial?.cost ?? "",
      price: initial?.price ?? "",
      salePrice: initial?.salePrice ?? "",
      stock: initial?.stock ?? "0",
    });

    setExistingImages(initial?.images || []);
    setNewImages([]);
  }, [initial]);

  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [newImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const availableSlots =
      MAX_IMAGES - existingImages.length - newImages.length;

    if (files.length > availableSlots) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
    }

    const validFiles = files
      .filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} is not an image.`);
          return false;
        }

        if (file.size > MAX_FILE_SIZE) {
          alert(`${file.name} exceeds the 5MB limit.`);
          return false;
        }

        return true;
      })
      .slice(0, Math.max(0, availableSlots));

    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...previews]);

    // Allows selecting the same file again after removal.
    e.target.value = "";
  };

  const removeExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((image) => image.publicId !== publicId),
    );
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const image = prev[index];

      if (image) URL.revokeObjectURL(image.preview);

      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Product name is required.");
    }

    if (!form.description.trim()) {
      return alert("Description is required.");
    }

    if (!form.category.trim()) {
      return alert("Category is required.");
    }

    const cost = Number(form.cost);
    const price = Number(form.price);
    const salePrice = Number(form.salePrice);
    const stock = Number(form.stock);

    if (
      ![cost, price, salePrice, stock].every(
        (value) => Number.isFinite(value) && value >= 0,
      )
    ) {
      return alert("Enter valid non-negative prices and stock.");
    }

    if (salePrice > price) {
      return alert("Sale price cannot exceed the original price.");
    }

    if (existingImages.length + newImages.length === 0) {
      return alert("Please upload at least one product image.");
    }

    const data = new FormData();

    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    data.append("cost", cost);
    data.append("price", price);
    data.append("salePrice", salePrice);
    data.append("category", form.category.trim());
    data.append("brand", form.brand.trim());
    data.append("stock", stock);

    data.append(
      "existingImages",
      JSON.stringify(existingImages.map((image) => image.publicId)),
    );

    newImages.forEach(({ file }) => {
      data.append("images", file);
    });

    try {
      setSaving(true);
      await onSave(data);
    } catch (error) {
      console.error("Product form submission error:", error);
    } finally {
      setSaving(false);
    }
  };

  const imageCount = existingImages.length + newImages.length;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft size={18} />
        Back to products
      </button>

      <h2 className="text-2xl font-semibold font-heading">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <label className="mb-3 block text-sm font-medium">
            Product Images ({imageCount}/{MAX_IMAGES})
          </label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {existingImages.map((image) => (
              <div
                key={image.publicId}
                className="relative aspect-square overflow-hidden rounded-xl border"
              >
                <img
                  src={image.url}
                  alt="Product"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(image.publicId)}
                  className="absolute right-2 top-2 rounded-full bg-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {newImages.map((image, index) => (
              <div
                key={image.preview}
                className="relative aspect-square overflow-hidden rounded-xl border"
              >
                <img
                  src={image.preview}
                  alt="New product"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {imageCount < MAX_IMAGES && (
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <ImagePlus size={30} />
              <span className="mt-2 text-sm font-medium">
                Click to upload images
              </span>
              <span className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP (Maximum 5MB each)
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Product Name *
          </label>
          <input
            className={inputClass}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Description *
          </label>
          <textarea
            className="w-full rounded-2xl bg-[#F0F0F0] p-5 text-sm outline-none focus:ring-2 focus:ring-black/10"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            rows={5}
            required
          />
        </div>

        {/* Category and Brand */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Category *</label>
            <input
              className={inputClass}
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Brand</label>
            <input
              className={inputClass}
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand name"
            />
          </div>
        </div>

        {/* Prices */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Cost *</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              placeholder="Purchase cost"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Original Price *
            </label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Original price"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Sale Price *
            </label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              name="salePrice"
              value={form.salePrice}
              onChange={handleChange}
              placeholder="Selling price"
              required
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block text-sm font-medium">Stock *</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Available quantity"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border px-6 py-3 text-sm"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-black px-6 py-3 text-sm text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
