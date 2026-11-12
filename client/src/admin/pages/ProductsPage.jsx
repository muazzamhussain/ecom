import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Search,
  Star,
  ShoppingBag,
  Boxes,
  ImageIcon,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Tag,
  X,
} from "lucide-react";

import ProductForm from "../components/ProductForm";
import ConfirmModal from "../../components/ConfirmModal";

const formatPrice = (value) =>
  `Rs. ${Number(value ?? 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })}`;

const ProductsPage = ({
  products = [],
  onAdd,
  onUpdate,
  onDelete,
  searchValue = "",
  initialView = "list",
  onViewChange,
}) => {
  const [view, setView] = useState(initialView);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const changeView = (nextView) => {
    setView(nextView);
    onViewChange?.(nextView);
  };

  const backToList = () => {
    setEditing(null);
    changeView("list");
  };

  const openAdd = () => {
    setEditing(null);
    changeView("add");
  };

  const openEdit = (product) => {
    setEditing(product);
    changeView("edit");
  };

  const filteredProducts = useMemo(() => {
    const query = `${searchValue} ${localSearch}`.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.category,
        product.brand,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return query.split(/\s+/).every((word) => searchableText.includes(word));
    });
  }, [products, searchValue, localSearch]);

  const handleSave = async (formData) => {
    try {
      if (view === "edit" && editing) {
        await onUpdate(editing._id, formData);
      } else {
        await onAdd(formData);
      }

      backToList();
    } catch (error) {
      console.error("Saving product failed:", error);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id || deleting) return;

    try {
      setDeleting(true);
      await onDelete(deleteTarget._id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Deleting product failed:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (view === "add" || view === "edit") {
    return (
      <div className="animate-in fade-in duration-300">
        <ProductForm
          mode={view}
          initial={view === "edit" ? editing : null}
          onSave={handleSave}
          onCancel={backToList}
        />
      </div>
    );
  }

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );

  const totalSold = products.reduce(
    (total, product) => total + Number(product.soldCount || 0),
    0,
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 5,
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock || 0) === 0,
  ).length;

  const hasSearch = Boolean(localSearch || searchValue);

  return (
    <div className="space-y-7 pb-8 font-body animate-in fade-in duration-300">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-700">Products</span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-1.5 text-sm text-gray-500">
            Manage your catalog, pricing, and inventory in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md active:translate-y-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add New Product
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        <SummaryCard
          icon={<Package size={21} />}
          label="Total Products"
          value={products.length.toLocaleString()}
          description="Products in catalog"
          iconStyle="bg-violet-50 text-violet-600"
        />

        <SummaryCard
          icon={<Boxes size={21} />}
          label="Total Inventory"
          value={totalStock.toLocaleString()}
          description="Available units"
          iconStyle="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<ShoppingBag size={21} />}
          label="Units Sold"
          value={totalSold.toLocaleString()}
          description="Total units sold"
          iconStyle="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={<AlertTriangle size={21} />}
          label="Low Stock"
          value={lowStockProducts.toLocaleString()}
          description={
            outOfStock > 0
              ? `${outOfStock} out of stock`
              : "Inventory needs attention"
          }
          iconStyle="bg-amber-50 text-amber-600"
          alert={lowStockProducts > 0}
        />
      </div>

      {/* Inventory alert */}
      {outOfStock > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-4">
          <div className="rounded-xl bg-red-100 p-2 text-red-600">
            <AlertTriangle size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">
              Products out of stock
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-red-600">
              {outOfStock} {outOfStock === 1 ? "product is" : "products are"}{" "}
              currently unavailable. Consider updating your inventory.
            </p>
          </div>
        </div>
      )}

      {/* Product listing */}
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        {/* Listing toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-heading text-lg font-bold text-gray-900">
                All Products
              </h2>

              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {filteredProducts.length}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              View and manage your products
            </p>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />

              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-250 text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Product
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Cost
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Pricing
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Inventory
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Sold
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Rating
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="group transition-colors hover:bg-gray-50/70"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex min-w-57 items-center gap-3.5">
                      <ProductImage
                        product={product}
                        className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 bg-gray-50"
                      />

                      <div className="min-w-0">
                        <p className="max-w-52 truncate text-sm font-semibold text-gray-900">
                          {product.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                          <span>{product.brand || "Unbranded"}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span className="max-w-27 truncate">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cost */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="text-sm font-medium text-gray-600">
                      {formatPrice(product.cost)}
                    </span>
                  </td>

                  {/* Pricing */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(product.salePrice)}
                    </p>

                    {Number(product.price) > Number(product.salePrice) && (
                      <p className="mt-0.5 text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">
                    <StockBadge stock={product.stock} />
                  </td>

                  {/* Sold */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="text-sm font-medium text-gray-700">
                      {Number(product.soldCount || 0).toLocaleString()}
                    </span>
                    <p className="mt-0.5 text-[11px] text-gray-400">units</p>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={15}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-sm font-semibold text-gray-800">
                        {Number(product.ratings?.average || 0).toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {product.ratings?.count || 0} reviews
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                      <ActionButton
                        label="Edit product"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil size={15} />
                      </ActionButton>

                      <ActionButton
                        label="Delete product"
                        danger
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 size={15} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <EmptyState onAdd={openAdd} hasSearch={hasSearch} />
          )}
        </div>

        {/* Mobile product cards */}
        <div className="divide-y divide-gray-100 md:hidden">
          {filteredProducts.map((product) => (
            <article
              key={product._id}
              className="space-y-4 p-4 transition hover:bg-gray-50/50"
            >
              <div className="flex items-start gap-3">
                <ProductImage
                  product={product}
                  className="h-19w-19 shrink-0 rounded-xl border border-gray-100 bg-gray-50"
                />

                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="truncate text-sm font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {product.brand || "Unbranded"} · {product.category}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {Number(product.ratings?.average || 0).toFixed(1)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      ({product.ratings?.count || 0})
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  <ActionButton
                    label="Edit product"
                    onClick={() => openEdit(product)}
                  >
                    <Pencil size={14} />
                  </ActionButton>

                  <ActionButton
                    label="Delete product"
                    danger
                    onClick={() => setDeleteTarget(product)}
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                <MobileInfo
                  label="Sale Price"
                  value={formatPrice(product.salePrice)}
                />

                <MobileInfo
                  label="Original Price"
                  value={formatPrice(product.price)}
                />

                <MobileInfo
                  label="Purchase Cost"
                  value={formatPrice(product.cost)}
                />

                <div>
                  <p className="mb-1.5 text-[11px] font-medium text-gray-400">
                    Available Stock
                  </p>
                  <StockBadge stock={product.stock} />
                </div>

                <MobileInfo
                  label="Units Sold"
                  value={Number(product.soldCount || 0).toLocaleString()}
                />

                <MobileInfo
                  label="Total Reviews"
                  value={product.ratings?.count || 0}
                />
              </div>
            </article>
          ))}

          {filteredProducts.length === 0 && (
            <EmptyState onAdd={openAdd} hasSearch={hasSearch} />
          )}
        </div>

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3.5 text-xs text-gray-400 sm:flex-row sm:items-center sm:px-6">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <span>Inventory overview</span>
          </div>
        )}
      </section>

      {/* Delete confirmation */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name || "this product"}"? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
};

/* Summary card */
const SummaryCard = ({
  icon,
  label,
  value,
  description,
  iconStyle,
  alert = false,
}) => (
  <div className="group rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-2">
      <div className={`rounded-xl p-2.5 ${iconStyle}`}>{icon}</div>

      {alert && (
        <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
          Attention
        </span>
      )}
    </div>

    <p className="mt-4 text-xs font-medium text-gray-500 sm:text-sm">{label}</p>

    <p className="mt-1 font-heading text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
      {value}
    </p>

    <p className="mt-1.5 text-[11px] text-gray-400 sm:text-xs">{description}</p>
  </div>
);

/* Product thumbnail */
const ProductImage = ({ product, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = product.images?.[0]?.url ||product.images?.[0];

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  if (!imageUrl || imageError) {
    return (
      <div
        className={`flex items-center justify-center text-gray-300 ${className}`}
      >
        <ImageIcon size={24} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={product.name || "Product"}
      loading="lazy"
      className={`object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

/* Inventory badge */
const StockBadge = ({ stock }) => {
  const quantity = Number(stock || 0);

  const style =
    quantity <= 0
      ? "bg-red-50 text-red-700 ring-red-100"
      : quantity <= 5
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-inset ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {quantity <= 0 ? "Out of stock" : `${quantity} available`}
    </span>
  );
};

/* Action button */
const ActionButton = ({ children, onClick, label, danger = false }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    className={`rounded-lg border p-2 transition duration-150 ${
      danger
        ? "border-transparent text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
        : "border-transparent text-gray-400 hover:border-gray-200 hover:bg-white hover:text-gray-900"
    }`}
  >
    {children}
  </button>
);

/* Mobile information */
const MobileInfo = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[11px] font-medium text-gray-400">{label}</p>
    <p className="mt-1 wrap-word-break text-sm font-semibold text-gray-900">
      {value}
    </p>
  </div>
);

/* Empty state */
const EmptyState = ({ onAdd, hasSearch }) => (
  <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
      {hasSearch ? (
        <Search size={27} strokeWidth={1.5} />
      ) : (
        <Package size={27} strokeWidth={1.5} />
      )}
    </div>

    <h3 className="mt-5 font-heading text-lg font-bold text-gray-900">
      {hasSearch ? "No products found" : "Your catalog is empty"}
    </h3>

    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-gray-400">
      {hasSearch
        ? "We couldn't find any products matching your search. Try a different keyword."
        : "Add your first product to start building your store catalog."}
    </p>

    {!hasSearch && (
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <Plus size={17} />
        Add Your First Product
      </button>
    )}
  </div>
);

export default ProductsPage;
