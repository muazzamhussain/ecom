import { useCallback, useEffect, useMemo, useState } from "react";
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
import API from "../lib/api";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getOrderStatus = (status) => {
  const normalized = String(status || "Processing").toLowerCase();

  const statuses = {
    pending: "Processing",
    processing: "Processing",
    confirmed: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
  };

  return statuses[normalized] || "Processing";
};

// Normalize MongoDB order data for the UI.
// Adjust these aliases if your actual Order schema uses different names.
const normalizeOrder = (order) => {
  const items = Array.isArray(order.items)
    ? order.items.map((item) => {
        const product = item.productId || item.product || {};

        return {
          id: item._id || product._id || item.productId,
          name: item.name || item.productName || product.name || "Product",
          image:
            item.image ||
            item.images?.[0] ||
            product.images?.[0] ||
            product.image ||
            "",
          price: Number(
            item.price ??
              item.salePrice ??
              product.salePrice ??
              product.cost ??
              0,
          ),
          qty: Number(item.qty ?? item.quantity ?? 1),
          size: item.size || "",
          color: item.color || "",
        };
      })
    : [];

  const address = order.shippingAddress || order.address || {};

  const subtotal = Number(
    order.subtotal ?? order.totalAmount ?? order.total ?? 0,
  );

  const shipping = Number(order.shipping ?? order.shippingCost ?? 0);
  const discount = Number(order.discount ?? 0);

  return {
    ...order,
    id: order.orderNumber || order._id || order.id,
    date: formatDate(order.createdAt || order.date),
    status: getOrderStatus(order.status || order.orderStatus),
    items,
    subtotal,
    shipping,
    discount,
    total: Number(order.total ?? subtotal + shipping - discount),
    paymentMethod:
      order.paymentMethod || order.payment?.method || "Not specified",
    shippingAddress: {
      name: address.name || address.fullName || "",
      street: address.street || address.address || "",
      city: address.city || "",
      state: address.state || address.province || "",
      zip: address.zip || address.postalCode || "",
      country: address.country || "",
      phone: address.phone || address.phoneNumber || "",
    },
    trackingNumber: order.trackingNumber || "",
    deliveredOn: order.deliveredAt ? formatDate(order.deliveredAt) : "",
    estimatedDelivery: order.estimatedDelivery
      ? formatDate(order.estimatedDelivery)
      : "",
  };
};

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

// --------------------------------------------------
// STATUS COMPONENTS
// --------------------------------------------------

const StatusIcon = ({ status }) => {
  if (status === "Delivered") {
    return <CheckCircle2 className="w-5 h-5 text-[#01AB31]" />;
  }

  if (status === "Cancelled") {
    return <XCircle className="w-5 h-5 text-[#FF3333]" />;
  }

  if (status === "Shipped") {
    return <Truck className="w-5 h-5 text-[#FFC633]" />;
  }

  return <Clock className="w-5 h-5 text-[#FFC633]" />;
};

const StatusBadge = ({ status }) => (
  <span
    className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(
      status,
    )}`}
  >
    {status}
  </span>
);

// --------------------------------------------------
// REUSABLE ORDER ITEM
// --------------------------------------------------

const OrderItem = ({ item, detailed = false }) => (
  <div
    className={`flex gap-4 ${
      detailed
        ? "pb-4 border-b border-black/5 last:border-0 last:pb-0"
        : "items-center justify-between gap-3"
    }`}
  >
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <div
        className={`rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0 overflow-hidden ${
          detailed ? "w-20 h-20 sm:w-24 sm:h-24" : "w-14 h-14 sm:w-16 sm:h-16"
        }`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-6 h-6 text-black/20" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-body font-bold text-sm sm:text-base text-black truncate">
          {item.name}
        </p>

        {detailed && (
          <p className="font-body text-xs sm:text-sm text-black/60 mt-1">
            {item.size && `Size: ${item.size}`}
            {item.size && item.color && " · "}
            {item.color}
          </p>
        )}

        <p className="font-body text-xs sm:text-sm text-black/60">
          Qty: {item.qty}
          {!detailed && item.size && ` · ${item.size}`}
        </p>

        {detailed && (
          <p className="font-body font-bold text-base mt-2">
            {formatCurrency(item.price)}
          </p>
        )}
      </div>
    </div>
  </div>
);

// --------------------------------------------------
// ORDER TIMELINE
// --------------------------------------------------

const OrderTimeline = ({ order }) => {
  const steps = [
    {
      label: "Order placed",
      done: true,
      date: order.date,
    },
    {
      label: "Processing",
      done: ["Processing", "Shipped", "Delivered"].includes(order.status),
      date: "",
    },
    {
      label: "Shipped",
      done: ["Shipped", "Delivered"].includes(order.status),
      date: "",
    },
    {
      label: "Delivered",
      done: order.status === "Delivered",
      date: order.deliveredOn,
    },
  ];

  if (order.status === "Cancelled") {
    steps.push({
      label: "Order cancelled",
      done: true,
      date: order.updatedAt ? formatDate(order.updatedAt) : "",
    });
  }

  return (
    <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-body font-bold text-lg uppercase tracking-tight mb-6">
        Order Timeline
      </h3>

      <ol className="relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <li key={step.label} className="flex gap-4">
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

              <div className={isLast ? "pb-0" : "pb-6"}>
                <p
                  className={`font-body font-bold text-sm ${
                    step.done ? "text-black" : "text-black/40"
                  }`}
                >
                  {step.label}
                </p>

                {step.date && (
                  <p className="font-body text-xs text-black/50 mt-0.5">
                    {step.date}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

// --------------------------------------------------
// ORDER SUMMARY
// --------------------------------------------------

const OrderSummary = ({ order }) => (
  <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
    <h3 className="font-body font-bold text-lg uppercase tracking-tight mb-5">
      Summary
    </h3>

    <div className="space-y-3 font-body text-sm">
      <div className="flex justify-between">
        <span className="text-black/60">Subtotal</span>
        <span className="font-medium text-black">
          {formatCurrency(order.subtotal)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-black/60">Shipping</span>
        <span className="font-medium text-black">
          {order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
        </span>
      </div>

      {order.discount > 0 && (
        <div className="flex justify-between">
          <span className="text-black/60">Discount</span>
          <span className="font-medium text-[#01AB31]">
            −{formatCurrency(order.discount)}
          </span>
        </div>
      )}

      <div className="flex justify-between pt-3 border-t border-black/10">
        <span className="font-bold text-base">Total</span>
        <span className="font-bold text-base">
          {formatCurrency(order.total)}
        </span>
      </div>

      <div className="flex justify-between pt-1">
        <span className="text-black/60">Payment</span>
        <span className="font-medium text-black">{order.paymentMethod}</span>
      </div>
    </div>
  </div>
);

// --------------------------------------------------
// SHIPPING ADDRESS
// --------------------------------------------------

const ShippingAddress = ({ address }) => (
  <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
    <h3 className="font-body font-bold text-lg uppercase tracking-tight mb-4">
      Shipping To
    </h3>

    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
        <MapPin className="w-5 h-5 text-black" />
      </div>

      <div className="font-body text-sm leading-relaxed min-w-0">
        {address.name && (
          <p className="font-bold text-black mb-1">{address.name}</p>
        )}

        {address.street && <p className="text-black/60">{address.street}</p>}

        <p className="text-black/60">
          {[address.city, address.state, address.zip]
            .filter(Boolean)
            .join(", ")}
        </p>

        {address.country && <p className="text-black/60">{address.country}</p>}

        {address.phone && <p className="text-black/60 mt-1">{address.phone}</p>}
      </div>
    </div>
  </div>
);

// --------------------------------------------------
// ORDER DETAIL
// --------------------------------------------------

const OrderDetail = ({ order, onBack }) => {
  const [copied, setCopied] = useState(false);

  const copyTracking = async () => {
    if (!order.trackingNumber) return;

    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy tracking number:", error);
    }
  };

  const statusMessage = {
    Delivered: {
      title: "Package delivered",
      description: order.deliveredOn
        ? `Delivered on ${order.deliveredOn}`
        : "Your package has been delivered.",
    },
    Processing: {
      title: "Order is being prepared",
      description: "Your order is currently being processed.",
    },
    Shipped: {
      title: "On the way",
      description: order.estimatedDelivery
        ? `Estimated delivery: ${order.estimatedDelivery}`
        : "Your package is on its way.",
    },
    Cancelled: {
      title: "Order cancelled",
      description: "This order has been cancelled.",
    },
  };

  const currentMessage = statusMessage[order.status];

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Header */}
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
            <h2 className="font-body font-bold text-xl sm:text-2xl uppercase tracking-tight text-black break-all">
              {order.id}
            </h2>

            <StatusBadge status={order.status} />
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
          <p className="font-body font-bold text-base sm:text-lg text-black mb-1">
            {currentMessage.title}
          </p>

          <p className="font-body text-sm text-black/60">
            {currentMessage.description}
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
                aria-label="Copy tracking number"
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
        {/* Left: Items and timeline */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border border-black/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-body font-bold text-lg uppercase tracking-tight mb-5">
              Items ({order.items.length})
            </h3>

            {order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <OrderItem key={item.id || index} item={item} detailed />
                ))}
              </div>
            ) : (
              <p className="text-sm text-black/50">
                No item details available.
              </p>
            )}
          </div>

          <OrderTimeline order={order} />
        </div>

        {/* Right: Summary and address */}
        <div className="lg:col-span-2 space-y-6">
          <OrderSummary order={order} />
          <ShippingAddress address={order.shippingAddress} />

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
  );
};

// --------------------------------------------------
// ORDERS LIST
// --------------------------------------------------

const OrdersList = ({ orders, onOpen }) => {
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return orders;

    return orders.filter((order) => {
      const orderId = String(order.id || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();

      const matchesItem = order.items.some((item) =>
        String(item.name || "")
          .toLowerCase()
          .includes(q),
      );

      return orderId.includes(q) || status.includes(q) || matchesItem;
    });
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

      {filteredOrders.length === 0 && (
        <div className="border border-black/10 rounded-2xl py-16 text-center">
          <Package className="w-12 h-12 text-black/20 mx-auto mb-4" />

          <p className="font-body font-bold text-lg mb-1">No orders found</p>

          <p className="font-body text-sm text-black/60">
            {orders.length === 0
              ? "You haven't placed any orders yet."
              : "Try a different search term."}
          </p>
        </div>
      )}

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="border border-black/10 rounded-2xl p-5 sm:p-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-5 border-b border-black/10">
            <div className="min-w-0">
              <h3 className="font-body font-bold text-lg text-black break-all">
                {order.id}
              </h3>

              <p className="font-body text-sm text-black/60">
                Placed on {order.date}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <StatusBadge status={order.status} />

              <span className="font-body font-bold text-lg">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Items preview */}
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <OrderItem item={item} />
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
          </div>
        </div>
      ))}
    </div>
  );
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await API.get("/order/myorders");

      // Supports both response formats:
      // [...] OR { success: true, orders: [...] }
      const data = result.data.orders ?? result.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response from server");
      }

      setOrders(data.map(normalizeOrder));
    } catch (err) {
      console.error("Error getting user orders:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-black/10 rounded-2xl p-8 text-center">
        <p className="font-body text-sm text-red-500 mb-4">{error}</p>

        <button
          type="button"
          onClick={fetchOrders}
          className="px-6 py-2.5 rounded-full bg-black text-white font-body text-sm hover:bg-black/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return <OrdersList orders={orders} onOpen={setSelectedOrder} />;
};

export default MyOrders;
