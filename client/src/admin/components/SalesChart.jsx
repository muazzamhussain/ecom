import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const RANGES = {
  "This Week": [65, 45, 80, 55, 90, 70, 95],
  "Last Week": [40, 60, 50, 70, 55, 80, 65],
  "Last Month": [70, 80, 55, 90, 60, 85, 95],
};
const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SalesChart = () => {
  const [range, setRange] = useState("This Week");
  const [open, setOpen] = useState(false);

  const data = RANGES[range];

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-xl text-black">Sales Overview</h3>
          <p className="font-body text-sm text-black/60">Daily revenue</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 h-10 px-4 rounded-full bg-[#F0F0F0] hover:bg-[#e0e0e0] font-body text-sm font-medium cursor-pointer transition-colors"
          >
            {range}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute right-0 top-12 bg-white border border-black/10 rounded-2xl shadow-lg p-2 w-40 z-10">
              {Object.keys(RANGES).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRange(r);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-full font-body text-sm hover:bg-[#F0F0F0] cursor-pointer ${
                    r === range ? "font-bold text-black" : "text-black/60"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-4 h-56 pt-4">
        {data.map((height, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
            <div
              className="w-full bg-[#F0F0F0] group-hover:bg-black rounded-t-xl transition-all relative"
              style={{ height: `${height}%` }}
            >
              <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-body px-2 py-1 rounded whitespace-nowrap transition-opacity">
                ${(height * 50).toLocaleString()}
              </span>
            </div>
            <span className="font-body text-xs text-black/60">{LABELS[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesChart;