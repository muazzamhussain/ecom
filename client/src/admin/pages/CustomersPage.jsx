import React from "react";
import { Mail } from "lucide-react";

const CustomersPage = ({ customers }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Customers
        </h1>
        <p className="font-body text-sm text-black/60 mt-1">
          {customers.length} customers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div
            key={c._id}
            className="bg-white border border-black/10 rounded-2xl p-5 flex gap-4 items-center"
          >
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-body text-xl shrink-0">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-bold text-base truncate">{c.name}</p>
              <p className="font-body text-xs text-black/60 truncate">
                {c.email}
              </p>
              <p className="font-body text-xs text-black/60 mt-1">
                <span className="font-body font-bold text-black">
                  {c.orders}
                </span>{" "}
                orders ·{" "}
                <span className="font-body font-bold text-black">
                  ${c.spent}
                </span>
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersPage;
