import React from "react";
import { Eye, ArrowUpRight } from "lucide-react";
import { getStatusColor } from "../data/mockData";

const OrdersTable = ({ orders, title = "Recent Orders", subtitle, onViewAll, onViewOrder, showViewAll = true }) => {
  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-black/10">
        <div>
          <h3 className="font-heading font-bold text-xl text-black">{title}</h3>
          {subtitle && <p className="font-body text-sm text-black/60">{subtitle}</p>}
        </div>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 h-10 px-5 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F9F9]">
            <tr>
              {["Order ID", "Customer", "Product", "Date", "Status", "Total", "Action"].map((h) => (
                <th key={h} className="font-body text-xs font-medium uppercase text-black/60 text-left px-6 py-4 tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-t border-black/5 hover:bg-[#F9F9F9]/50 transition-colors">
                <td className="px-6 py-4 font-heading font-bold text-sm">{order.id}</td>
                <td className="px-6 py-4 font-body text-sm">{order.customer}</td>
                <td className="px-6 py-4 font-body text-sm text-black/60 max-w-45 truncate">{order.product}</td>
                <td className="px-6 py-4 font-body text-sm text-black/60">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-heading font-bold text-sm">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewOrder?.(order)}
                    className="w-8 h-8 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-black/5">
        {orders?.map((order) => (
          <div key={order.id} className="p-5">
            <div className="flex justify-between mb-2">
              <p className="font-heading font-bold text-sm">{order.id}</p>
              <span className={`font-body text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="font-body text-sm">{order.customer}</p>
            <p className="font-body text-xs text-black/60 mb-2 truncate">{order.product}</p>
            <div className="flex items-center justify-between">
              <p className="font-heading font-bold">${order.total.toFixed(2)}</p>
              <button
                onClick={() => onViewOrder?.(order)}
                className="w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;