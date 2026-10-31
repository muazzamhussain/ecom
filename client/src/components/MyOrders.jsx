import { ChevronRight, Search } from "lucide-react";

const MyOrders = () => {
  const ORDERS = [
    {
      id: "#ORD-8924",
      date: "August 20, 2023",
      status: "Delivered",
      total: 260.0,
      items: [{ name: "One Life Graphic T-Shirt", qty: 1, image: "Image" }],
    },
    {
      id: "#ORD-8911",
      date: "August 12, 2023",
      status: "Processing",
      total: 357.0,
      items: [
        { name: "Polo with Contrast Trims", qty: 1, image: "Image" },
        { name: "Gradient Graphic T-shirt", qty: 1, image: "Image" },
      ],
    },
  ];

   // Helper for Status Pills
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-[#01AB31] bg-[#01AB31]/10";
      case "Processing":
        return "text-[#FFC633] bg-[#FFC633]/10";
      case "Cancelled":
        return "text-[#FF3333] bg-[#FF3333]/10";
      default:
        return "text-black/60 bg-[#F0F0F0]";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search / Filter (Visual only) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full h-12 pl-11 pr-4 bg-[#F0F0F0] rounded-full font-body text-sm focus:outline-none focus:ring-1 focus:ring-black/10"
          />
        </div>
      </div>

      {/* Orders List */}
      {ORDERS.map((order) => (
        <div key={order.id} className="border border-black/10 rounded-2xl p-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-black/10">
            <div>
              <h3 className="font-body font-bold text-lg">{order.id}</h3>
              <p className="font-body text-sm text-black/60">
                Placed on {order.date}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
              <span className="font-body font-bold text-lg">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0">
                    <span className="text-black/20 text-[10px] uppercase font-body">
                      {item.image}
                    </span>
                  </div>
                  <div>
                    <p className="font-body font-bold text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="font-body text-sm text-black/60">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer">
              View Details
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer">
              Track Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
