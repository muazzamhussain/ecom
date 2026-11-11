import React, { useState, useEffect, useMemo } from "react";
import { Plus, Package, Edit2, Trash2, Search } from "lucide-react";
import ProductForm from "../components/ProductForm";
import ConfirmModal from "../../components/ConfirmModal";
import { getStatusColor } from "../data/mockData";

const ProductsPage = ({ products, onAdd, onUpdate, onDelete, searchValue, initialView = "list", onViewChange }) => {
  const [view, setView] = useState(initialView);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [localSearch, setLocalSearch] = useState("");

  // Sync view if "Add Product" is clicked from the Dashboard
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const query = (searchValue || localSearch).toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, query]);

  const openAdd = () => {
    setEditing(null);
    setView("add");
    if (onViewChange) onViewChange("add");
  };

  const openEdit = (product) => {
    setEditing(product);
    setView("edit");
    if (onViewChange) onViewChange("edit");
  };

  const backToList = () => {
    setView("list");
    setEditing(null);
    if (onViewChange) onViewChange("list");
  };

  const handleSave = (data) => {
    if (view === "edit" && editing) {
      onUpdate({ ...editing, ...data });
    } else {
      onAdd(data);
    }
    backToList();
  };

  const confirmDelete = () => {
    if (deleteTarget) onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  // Render Forms
  if (view === "add" || view === "edit") {
    return (
      <ProductForm
        mode={view}
        initial={editing}
        onSave={handleSave}
        onCancel={backToList}
      />
    );
  }

  // Render List
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
            Products
          </h1>
          <p className="font-body text-sm text-black/60 mt-1">
            {filtered.length} of {products.length} products
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter products by name or category..."
          className="w-full h-11 pl-11 pr-4 bg-[#F0F0F0] rounded-full font-body text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F9F9]">
              <tr>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="font-body text-xs font-medium uppercase text-black/60 text-left px-6 py-4 tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id} className="border-t border-black/5 hover:bg-[#F9F9F9]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-black/20" />
                      </div>
                      <span className="font-body font-bold text-sm text-black">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body text-sm text-black/60">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-body font-bold text-sm">${product.price}</span>
                    {product.oldPrice && (
                      <span className="font-body text-xs text-black/30 line-through ml-2">
                        ${product.oldPrice}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-body text-sm">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="w-8 h-8 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="w-8 h-8 rounded-full bg-[#F0F0F0] hover:bg-[#FF3333] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-black/5">
          {filtered.map((product) => (
            <div key={product._id} className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-black/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-sm truncate">{product.name}</p>
                  <p className="font-body text-xs text-black/60">{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body font-bold text-base">${product.price}</span>
                    <span className={`font-body text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="flex-1 h-10 rounded-full bg-[#F0F0F0] font-body text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-black hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(product)}
                  className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center cursor-pointer hover:bg-[#FF3333] hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ProductsPage;