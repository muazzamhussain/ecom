import { Eye, ArrowUpRight } from "lucide-react";
import { getStatusColor } from "../data/mockData";

const OrdersTable = ({
  orders = [],
  title = "Recent Orders",
  subtitle,
  onViewAll,
  onViewOrder,
  showViewAll = true,
}) => {
  const getProducts = (order) => {
    const items = order.orderItems || [];

    if (!items.length) return "No products";

    const firstProduct = items[0].name || "Unnamed product";

    return items.length > 1
      ? `${firstProduct} + ${items.length - 1} more`
      : firstProduct;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };

  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-black/10">
        <div>
          <h3 className="font-body font-bold text-xl text-black">{title}</h3>

          {subtitle && (
            <p className="font-body text-sm text-black/60">{subtitle}</p>
          )}
        </div>

        {showViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 h-10 px-5 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F9F9]">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Product",
                "Date",
                "Status",
                "Total",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="font-body text-xs font-medium uppercase text-black/60 text-left px-6 py-4 tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t border-black/5 hover:bg-[#F9F9F9]/50 transition-colors"
              >
                <td className="px-6 py-4 font-body font-bold text-sm">
                  #{order._id?.slice(-8).toUpperCase()}
                </td>

                <td className="px-6 py-4 font-body text-sm">
                  {order.userId?.name || "Unknown"}
                </td>

                <td className="px-6 py-4 font-body text-sm text-black/60 max-w-45 truncate">
                  {getProducts(order)}
                </td>

                <td className="px-6 py-4 font-body text-sm text-black/60">
                  {formatDate(order.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus || "Unknown"}
                  </span>
                </td>

                <td className="px-6 py-4 font-heading font-bold text-sm">
                  {formatPrice(order.totalPrice)}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewOrder?.(order)}
                    className="w-8 h-8 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="View order"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-black/50"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-black/5">
        {orders.map((order) => (
          <div key={order._id} className="p-5">
            <div className="flex justify-between gap-3 mb-2">
              <p className="font-heading font-bold text-sm break-all">
                #{order._id?.slice(-8).toUpperCase()}
              </p>

              <span
                className={`font-body text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(order.orderStatus)}`}
              >
                {order.orderStatus || "Unknown"}
              </span>
            </div>

            <p className="font-body text-sm">
              {order.userId?.name || "Unknown customer"}
            </p>

            <p className="font-body text-xs text-black/60 mb-2 truncate">
              {getProducts(order)}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold">
                  {formatPrice(order.totalPrice)}
                </p>
                <p className="font-body text-xs text-black/50">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <button
                onClick={() => onViewOrder?.(order)}
                className="w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center cursor-pointer"
                title="View order"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="p-8 text-center text-sm text-black/50">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
