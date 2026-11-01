import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  Search,
  ArrowLeft,
  MapPin,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
} from "lucide-react";

// ─────────────────────────────────────────────
// MOCK ORDERS (replace with API / context later)
// ─────────────────────────────────────────────
const ORDERS = [
  {
    id: "#ORD-8924",
    date: "August 20, 2023",
    status: "Delivered",
    total: 260.0,
    subtotal: 260.0,
    shipping: 0,
    discount: 0,
    paymentMethod: "Visa •••• 4242",
    trackingNumber: "TRK928374651",
    estimatedDelivery: "August 22, 2023",
    deliveredOn: "August 21, 2023",
    shippingAddress: {
      name: "Alex K.",
      street: "123 Fashion Ave, Suite 45",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 555 123 4567",
    },
    timeline: [
      { label: "Order Placed", date: "Aug 20, 2023 · 10:24 AM", done: true },
      { label: "Payment Confirmed", date: "Aug 20, 2023 · 10:25 AM", done: true },
      { label: "Shipped", date: "Aug 20, 2023 · 4:12 PM", done: true },
      { label: "Out for Delivery", date: "Aug 21, 2023 · 9:00 AM", done: true },
      { label: "Delivered", date: "Aug 21, 2023 · 2:45 PM", done: true },
    ],
    items: [
      {
        name: "One Life Graphic T-Shirt",
        qty: 1,
        price: 260,
        size: "Large",
        color: "Olive",
        image: null,
      },
    ],
  },
  {
    id: "#ORD-8911",
    date: "August 12, 2023",
    status: "Processing",
    total: 357.0,
    subtotal: 357.0,
    shipping: 0,
    discount: 0,
    paymentMethod: "Mastercard •••• 8888",
    trackingNumber: null,
    estimatedDelivery: "August 18, 2023",
    deliveredOn: null,
    shippingAddress: {
      name: "Alex K.",
      street: "123 Fashion Ave, Suite 45",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 555 123 4567",
    },
    timeline: [
      { label: "Order Placed", date: "Aug 12, 2023 · 3:02 PM", done: true },
      { label: "Payment Confirmed", date: "Aug 12, 2023 · 3:03 PM", done: true },
      { label: "Processing", date: "In progress", done: false },
      { label: "Shipped", date: "Pending", done: false },
      { label: "Delivered", date: "Pending", done: false },
    ],
    items: [
      {
        name: "Polo with Contrast Trims",
        qty: 1,
        price: 212,
        size: "Medium",
        color: "Navy",
        image: null,
      },
      {
        name: "Gradient Graphic T-shirt",
        qty: 1,
        price: 145,
        size: "Large",
        color: "Multi",
        image: null,
      },
    ],
  },
  {
    id: "#ORD-8902",
    date: "August 5, 2023",
    status: "Cancelled",
    total: 180.0,
    subtotal: 180.0,
    shipping: 0,
    discount: 0,
    paymentMethod: "Visa •••• 4242",
    trackingNumber: null,
    estimatedDelivery: null,
    deliveredOn: null,
    shippingAddress: {
      name: "Alex K.",
      street: "123 Fashion Ave, Suite 45",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 555 123 4567",
    },
    timeline: [
      { label: "Order Placed", date: "Aug 5, 2023 · 1:15 PM", done: true },
      { label: "Payment Confirmed", date: "Aug 5, 2023 · 1:15 PM", done: true },
      { label: "Cancelled", date: "Aug 5, 2023 · 6:40 PM", done: true },
    ],
    items: [
      {
        name: "Checkered Shirt",
        qty: 1,
        price: 180,
        size: "Large",
        color: "Red/Black",
        image: null,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "text-[#01AB31] bg-[#01AB31]/10";
    case "Processing":
    case "Shipped":
      return "text-[#FFC633] bg-[#FFC633]/10";
    case "Cancelled":
      return "text-[#FF3333] bg-[#FF3333]/10";
    default:
      return "text-black/60 bg-[#F0F0F0]";
  }
};

const StatusIcon = ({ status }) => {
  if (status === "Delivered")
    return <CheckCircle2 className="w-5 h-5 text-[#01AB31]" />;
  if (status === "Cancelled")
    return <XCircle className="w-5 h-5 text-[#FF3333]" />;
  if (status === "Shipped")
    return <Truck className="w-5 h-5 text-[#FFC633]" />;
  return <Clock className="w-5 h-5 text-[#FFC633]" />;
};

// ─────────────────────────────────────────────
// ORDER DETAIL VIEW
// ─────────────────────────────────────────────
const OrderDetail = ({ order, onBack }) => {
  const [copied, setCopied] = useState(false);

  const copyTracking = () => {
    if (!order.trackingNumber) return;
    navigator.clipboard?.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight text-black">
              {order.id}
            </h2>
            <span
              className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          <p className="font-body text-sm text-black/60">
            Placed on {order.date}
          </p>
        </div>
      </div>

      {/* Status banner */}
      <div className="border border-black/10 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
          <StatusIcon status={order.status} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-base sm:text-lg text-black mb-1">
            {order.status === "Delivered" && "Package delivered"}
            {order.status === "Processing" && "Order is being prepared"}
            {order.status === "Shipped" && "On the way"}
            {order.status === "Cancelled" && "Order cancelled"}
          </p>
          <p className="font-body text-sm text-black/60">
            {order.status === "Delivered" &&
              `Delivered on ${order.deliveredOn}`}
            {order.status === "Processing" &&
              `Estimated delivery: ${order.estimatedDelivery}`}
            {order.status === "Shipped" &&
              `Estimated delivery: ${order.estimatedDelivery}`}
            {order.status === "Cancelled" &&
              "Refund will be processed within 5–7 business days."}
          </p>

          {order.trackingNumber && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-body text-xs text-black/60">Tracking:</span>
              <code className="font-body text-sm font-medium text-black bg-[#F0F0F0] px-3 py-1 rounded-full">
                {order.trackingNumber}
              </code>
              <button
                type="button"
                onClick={copyTracking}
                className="w-8 h-8 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Copy tracking number"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT — items + timeline */}
        <div className="lg:col-span-3 space-y-6">
          {/* Items */}
          <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-lg uppercase tracking-tight mb-5">
              Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 pb-4 border-b border-black/5 last:border-0 last:pb-0"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0">
                    <Package className="w-7 h-7 text-black/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm sm:text-base text-black truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-xs sm:text-sm text-black/60 mt-1">
                      Size: {item.size}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                    <p className="font-body text-xs sm:text-sm text-black/60">
                      Qty: {item.qty}
                    </p>
                    <p className="font-heading font-bold text-base mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-lg uppercase tracking-tight mb-6">
              Order Timeline
            </h3>
            <ol className="relative space-y-0">
              {order.timeline.map((step, idx) => {
                const isLast = idx === order.timeline.length - 1;
                return (
                  <li key={idx} className="flex gap-4">
                    {/* rail */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1 ${
                          step.done ? "bg-black" : "bg-black/20"
                        }`}
                      />
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-10 ${
                            step.done ? "bg-black" : "bg-black/10"
                          }`}
                        />
                      )}
                    </div>
                    {/* content */}
                    <div className={`${isLast ? "pb-0" : "pb-6"}`}>
                      <p
                        className={`font-heading font-bold text-sm ${
                          step.done ? "text-black" : "text-black/40"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="font-body text-xs text-black/50 mt-0.5">
                        {step.date}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* RIGHT — summary + address */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment summary */}
          <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-lg uppercase tracking-tight mb-5">
              Summary
            </h3>
            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Subtotal</span>
                <span className="font-medium text-black">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Shipping</span>
                <span className="font-medium text-black">
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-black/60">Discount</span>
                  <span className="font-medium text-[#01AB31]">
                    −${order.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-black/10">
                <span className="font-heading font-bold text-base">Total</span>
                <span className="font-heading font-bold text-base">
                  ${order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-black/60">Payment</span>
                <span className="font-medium text-black">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-lg uppercase tracking-tight mb-4">
              Shipping To
            </h3>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div className="font-body text-sm leading-relaxed">
                <p className="font-heading font-bold text-black mb-1">
                  {order.shippingAddress.name}
                </p>
                <p className="text-black/60">{order.shippingAddress.street}</p>
                <p className="text-black/60">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p className="text-black/60">{order.shippingAddress.country}</p>
                <p className="text-black/60 mt-1">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {order.status === "Delivered" && (
              <button
                type="button"
                className="w-full h-12 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
              >
                Buy Again
              </button>
            )}
            {order.status === "Processing" && (
              <button
                type="button"
                className="w-full h-12 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            )}
            {order.trackingNumber && (
              <button
                type="button"
                onClick={copyTracking}
                className="w-full h-12 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                {copied ? "Tracking Copied" : "Track Package"}
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="w-full h-12 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ORDERS LIST
// ─────────────────────────────────────────────
const OrdersList = ({ orders, onOpen }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [orders, query]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders by ID, product, status..."
          className="w-full h-12 pl-11 pr-4 bg-[#F0F0F0] rounded-full font-body text-sm focus:outline-none focus:ring-1 focus:ring-black/10"
        />
      </div>

      {filtered.length === 0 && (
        <div className="border border-black/10 rounded-2xl py-16 text-center">
          <Package className="w-12 h-12 text-black/20 mx-auto mb-4" />
          <p className="font-heading font-bold text-lg mb-1">No orders found</p>
          <p className="font-body text-sm text-black/60">
            Try a different search term.
          </p>
        </div>
      )}

      {filtered.map((order) => (
        <div
          key={order.id}
          className="border border-black/10 rounded-2xl p-5 sm:p-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-5 border-b border-black/10">
            <div>
              <h3 className="font-heading font-bold text-lg text-black">
                {order.id}
              </h3>
              <p className="font-body text-sm text-black/60">
                Placed on {order.date}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span
                className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <span className="font-heading font-bold text-lg">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Items preview */}
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-black/20" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-sm text-black/60">
                      Qty: {item.qty}
                      {item.size ? ` · ${item.size}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(order)}
                  className="w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="View order"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={() => onOpen(order)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={() => onOpen(order)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
            >
              {order.status === "Delivered"
                ? "Buy Again"
                : order.trackingNumber
                ? "Track Order"
                : "View Status"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <OrdersList orders={ORDERS} onOpen={setSelectedOrder} />
  );
};

export default MyOrders;