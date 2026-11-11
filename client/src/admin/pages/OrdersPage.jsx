import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import OrdersTable from "../components/OrdersTable";
import { getStatusColor } from "../data/mockData";

const OrdersPage = ({ orders, searchValue }) => {
  const [selected, setSelected] = useState(null);
  const [localSearch, setLocalSearch] = useState("");

  const query = (searchValue || localSearch).toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.customer.toLowerCase().includes(query) ||
        o.product.toLowerCase().includes(query)
    );
  }, [orders, query]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Orders
        </h1>
        <p className="font-body text-sm text-black/60 mt-1">
          {filtered.length} of {orders.length} orders
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

      {/* Order details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-bold text-2xl uppercase tracking-tight mb-1">
              Order Details
            </h3>
            <p className="font-body text-sm text-black/60 mb-6">{selected.id}</p>

            <div className="space-y-4">
              {[
                ["Customer", selected.customer],
                ["Product", selected.product],
                ["Date", selected.date],
                ["Total", `$${selected.total.toFixed(2)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-black/5 pb-3">
                  <span className="font-body text-sm text-black/60">{k}</span>
                  <span className="font-heading font-bold text-sm">{v}</span>
                </div>
              ))}

              <div className="flex justify-between items-center pt-1">
                <span className="font-body text-sm text-black/60">Status</span>
                <span className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(selected.status)}`}>
                  {selected.status}
                </span>
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