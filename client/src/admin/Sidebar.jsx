import React from "react";
import { X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./data/mockData";

const Sidebar = ({ activeTab, onTabChange, open, onClose, onLogout }) => {
  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-65 bg-white border-r border-black/10 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-black/10">
          <h1 className="font-heading text-2xl uppercase tracking-tight text-black">ECOM</h1>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-black/60 hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full font-body text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? "bg-black text-white" : "text-black/60 hover:bg-[#F0F0F0] hover:text-black"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/10">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full font-body text-sm font-medium text-[#FF3333] hover:bg-[#FF3333]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
      )}
    </>
  );
};

export default Sidebar;