import { useState } from "react";
import { BiSolidCoupon } from "react-icons/bi";
import { ArrowRight, ShoppingBag, Tag } from "lucide-react";

const formatPrice = (value = 0) => {
  return Number(value || 0).toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });
};

const OrderSummary = ({
  items = [],
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  total = 0,

  actionLabel = "Continue",
  loadingLabel = "Please wait...",
  loading = false,
  disabled = false,
  actionType = "button",
  onAction,

  showCoupon = false,
  onApplyCoupon,

  shippingLabel = "Delivery Fee",
  showItems = false,
}) => {
  const [coupon, setCoupon] = useState("");

  const handleApplyCoupon = () => {
    if (!coupon.trim() || !onApplyCoupon) return;

    onApplyCoupon(coupon.trim());
  };

  return (
    <aside className="w-full rounded-2xl border border-gray-200 bg-white p-5 font-body shadow-sm sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
          <ShoppingBag size={19} />
        </div>

        <div>
          <h2 className="font-heading text-lg font-bold uppercase text-gray-900">
            Order Summary
          </h2>
          <p className="text-xs text-gray-500">Review your order details</p>
        </div>
      </div>

      {/* Checkout product list */}
      {showItems && items.length > 0 && (
        <div className="mb-6 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag size={20} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      )}

      {showItems && <div className="mb-5 border-t border-gray-200" />}

      {/* Price breakdown */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="font-medium text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between gap-4">
            <span className="font-medium text-gray-500">Discount</span>
            <span className="font-semibold text-red-500">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-gray-500">{shippingLabel}</span>

          <span className="font-semibold text-gray-900">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>
      </div>

      <div className="my-5 border-t border-gray-200" />

      {/* Total */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-heading text-base font-bold text-gray-900">
          Total
        </span>

        <span className="font-heading text-xl font-bold text-gray-900">
          {formatPrice(total)}
        </span>
      </div>

      {/* Coupon */}
      {showCoupon && (
        <div className="my-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Have a coupon?
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <BiSolidCoupon
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                placeholder="Enter promo code"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={!coupon.trim() || !onApplyCoupon}
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Action */}
      <button
        type={actionType}
        onClick={actionType === "button" ? onAction : undefined}
        disabled={disabled || loading}
        className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? loadingLabel : actionLabel}

        {!loading && (
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </button>
    </aside>
  );
};

export default OrderSummary;
