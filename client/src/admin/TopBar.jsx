import React, { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";

const TopBar = ({ onMenuClick, searchValue, onSearchChange, onBellClick }) => {
  const [hasNotif, setHasNotif] = useState(true);

  const handleBell = () => {
    setHasNotif(false);
    onBellClick?.();
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden text-black cursor-pointer shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders, products..."
            className="w-full h-11 pl-11 pr-4 bg-[#F0F0F0] rounded-full font-body text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleBell}
          className="w-11 h-11 rounded-full bg-[#F0F0F0] hover:bg-[#e0e0e0] flex items-center justify-center relative cursor-pointer transition-colors"
        >
          <Bell className="w-5 h-5 text-black" />
          {hasNotif && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF3333]" />}
        </button>
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-black/10">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-heading">A</div>
          <div className="hidden md:block">
            <p className="font-heading text-sm font-bold text-black">Admin</p>
            <p className="font-body text-xs text-black/60">admin@Ecom</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;