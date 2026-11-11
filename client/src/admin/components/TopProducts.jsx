import React from "react";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { TOP_PRODUCTS } from "../data/mockData";

const TopProducts = ({ onViewAll }) => {
  return (
    <div className="bg-white border border-black/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-xl text-black">Top Products</h3>
        <button className="text-black/60 hover:text-black cursor-pointer">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5">
        {TOP_PRODUCTS.map((p, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0EEED] flex items-center justify-center shrink-0 font-heading font-bold text-black/40">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm text-black truncate">{p.name}</p>
              <p className="font-body text-xs text-black/60">{p.sold} sold</p>
            </div>
            <span className="font-heading font-bold text-sm text-black shrink-0">
              ${(p.revenue / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer"
      >
        View All <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TopProducts;