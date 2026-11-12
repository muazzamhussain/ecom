import React, { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import OrdersTable from "../components/OrdersTable";
import API from "../../lib/api";
import { toast } from "react-toastify";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OrdersPage = ({ orders = [], searchValue = "" }) => {
  const [selected, setSelected] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const [localOrders, setLocalOrders] = useState(orders);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const query = (searchValue || localSearch).trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return localOrders;

    return localOrders.filter((order) => {
      const orderId = order._id || "";
      const customerName = order.userId?.name || "";
      const customerEmail = order.userId?.email || "";

      const products = (order.orderItems || [])
        .map((item) => item.name || "")
        .join(" ");

      return (
        orderId.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query) ||
        products.toLowerCase().includes(query)
      );
    });
  }, [localOrders, query]);

  const handleStatusChange = async (newStatus) => {
    if (!selected || newStatus === selected.orderStatus) return;

    try {
      setUpdatingStatus(true);

      const { data } = await API.put(`/order/${selected._id}/status`, {
        status: newStatus,
      });

      const updatedOrder = data.order;

      setSelected(updatedOrder);

      // Update the displayed table without refreshing the page.
      setLocalOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );

      toast.success(data.message || "Order status updated.");
    } catch (error) {
      console.error("Update order status error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update order status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Orders
        </h1>

        <p className="font-body text-sm text-black/60 mt-1">
          {filtered.length} of {localOrders.length} orders
        </p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />

        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by order ID, customer or product..."
          className="w-full h-11 pl-11 pr-4 bg-[#F0F0F0] rounded-full font-body text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
        />
      </div>

      <OrdersTable
        orders={filtered}
        title="All Orders"
        subtitle={`${filtered.length} results`}
        showViewAll={false}
        onViewOrder={setSelected}
      />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-body font-bold text-2xl uppercase tracking-tight mb-1">
              Order Details
            </h3>

            <p className="font-body text-xs text-black/50 mb-6 break-all pr-10">
              {selected._id}
            </p>

            <div className="space-y-4">
              <div className="border-b border-black/5 pb-3">
                <p className="font-body text-xs text-black/50 mb-1">Customer</p>
                <p className="font-body font-bold text-sm">
                  {selected.userId?.name || "Unknown customer"}
                </p>
                <p className="font-body text-sm text-black/60">
                  {selected.userId?.email || "N/A"}
                </p>
              </div>

              <div className="border-b border-black/5 pb-3">
                <p className="font-body text-xs text-black/50 mb-2">Products</p>

                <div className="space-y-3">
                  {(selected.orderItems || []).map((item, index) => (
                    <div
                      key={item._id || item.productId || index}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-body font-medium">{item.name}</p>
                        <p className="font-body text-xs text-black/50">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-body font-bold whitespace-nowrap">
                        $
                        {(
                          Number(item.price || 0) * Number(item.quantity || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {[
                ["Order Date", formatDate(selected.createdAt)],
                [
                  "Items Price",
                  `$${Number(selected.itemsPrice || 0).toFixed(2)}`,
                ],
                [
                  "Shipping",
                  `$${Number(selected.shippingPrice || 0).toFixed(2)}`,
                ],
                ["Tax", `$${Number(selected.taxPrice || 0).toFixed(2)}`],
                ["Total", `$${Number(selected.totalPrice || 0).toFixed(2)}`],
                ["Payment Method", selected.paymentMethod || "N/A"],
                ["Payment Status", selected.paymentStatus || "N/A"],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-4 border-b border-black/5 pb-3"
                >
                  <span className="font-body text-sm text-black/60">{key}</span>
                  <span className="font-body font-bold text-sm text-right">
                    {value}
                  </span>
                </div>
              ))}

              <div>
                <p className="font-body text-sm text-black/60 mb-2">
                  Shipping Address
                </p>

                {(Array.isArray(selected.shippingAddress)
                  ? selected.shippingAddress
                  : selected.shippingAddress
                    ? [selected.shippingAddress]
                    : []
                ).map((address, index) => (
                  <div key={address._id || index} className="text-sm">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="font-body text-sm text-black/60">
                  Update Order Status
                </label>

                <select
                  value={selected.orderStatus || "Processing"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={
                    updatingStatus || selected.orderStatus === "Cancelled"
                  }
                  className="w-full h-11 px-4 rounded-xl border border-black/10 bg-white font-body text-sm focus:outline-none focus:ring-1 focus:ring-black/30 disabled:opacity-50"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {updatingStatus && (
                  <p className="text-xs text-black/50">
                    Updating order status...
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-6 h-11 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
