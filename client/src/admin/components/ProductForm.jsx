import React, { useState } from "react";
import { ArrowLeft, Upload, Check } from "lucide-react";
import { CATEGORIES } from "../data/mockData";

const EMPTY = {
  name: "",
  category: "T-Shirts",
  price: "",
  oldPrice: "",
  stock: "",
  status: "Active",
  description: "",
};

const inputClass =
  "w-full h-12 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";

const ProductForm = ({ mode = "add", initial, onSave, onCancel }) => {
  const [form, setForm] = useState(
    initial ? { ...EMPTY, ...initial, price: initial.price ?? "", oldPrice: initial.oldPrice ?? "", stock: initial.stock ?? "" } : EMPTY
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "" || form.stock === "") {
      alert("Please fill in Name, Price and Stock.");
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
            {mode === "edit" ? "Edit Product" : "Add Product"}
          </h1>
          <p className="font-body text-sm text-black/60 mt-1">
            {mode === "edit" ? "Update product details below." : "Fill in the details to create a new product."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Image upload */}
          <div>
            <label className="font-body text-sm font-medium text-black mb-2 block">Product Image</label>
            <div className="w-full h-48 rounded-2xl bg-[#F0EEED] border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#EBE9E8] transition-colors">
              <Upload className="w-8 h-8 text-black/30" />
              <p className="font-body text-sm text-black/40">Click to upload or drag & drop</p>
            </div>
          </div>

          <div>
            <label className="font-body text-sm font-medium text-black mb-2 block">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Graphic T-Shirt" className={inputClass} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-black mb-2 block">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-black mb-2 block">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"}>
                <option value="Active">Active</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-black mb-2 block">Price ($) *</label>
              <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="260" className={inputClass} required />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-black mb-2 block">Old Price ($)</label>
              <input type="number" min="0" step="0.01" name="oldPrice" value={form.oldPrice} onChange={handleChange} placeholder="300" className={inputClass} />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-black mb-2 block">Stock *</label>
              <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} placeholder="48" className={inputClass} required />
            </div>
          </div>

          <div>
            <label className="font-body text-sm font-medium text-black mb-2 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short product description..."
              className="w-full px-4 py-3 font-body text-sm text-black bg-[#F0F0F0] rounded-2xl border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-black text-white font-body font-medium text-sm rounded-full hover:bg-black/80 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {mode === "edit" ? "Save Changes" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none h-12 px-8 border border-black/10 font-body font-medium text-sm rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;