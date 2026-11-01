import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ label, value, change, trend, icon: Icon }) => {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-[#01AB31]" : "text-[#FF3333]";

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-6 hover:border-black/20 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center">
          <Icon className="w-6 h-6 text-black" />
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="font-body text-xs font-medium">{change}</span>
        </div>
      </div>
      <h3 className="font-body text-sm text-black/60 mb-1">{label}</h3>
      <p className="font-heading text-3xl font-bold text-black">{value}</p>
    </div>
  );
};

export default StatCard;