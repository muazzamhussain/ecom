import { ShoppingCart, CircleUserRound, Search, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-around h-15 md:h-20 items-center">
        <Menu
          className=" block md:hidden"
          onClick={() => {
            openSidebar ? setOpenSidebar(false) : setOpenSidebar(true);
          }}
        />
        <h1 className="text-2xl font-bold font-heading relative right-6 md:block">
          ECOM
        </h1>
        <ul className="gap-20 hidden md:flex">
          <li className="cursor-pointer">New Arrivals</li>
          <li className="cursor-pointer">Brands</li>
          <li className="cursor-pointer">Shop</li>
        </ul>
        <div className="search flex items-center">
          <Search className=" relative left-7 md:left-8 md:opacity-60" />
          <input
            type="search"
            placeholder="Search for products..."
            className="bg-gray w-100 px-12 py-2 rounded-4xl focus:outline-1 hidden md:block"
          />
        </div>
        <div className="icons flex gap-2 md:gap-5">
          <ShoppingCart className="cursor-pointer" />
          <CircleUserRound className="cursor-pointer" />
        </div>
      </div>

      {/* Sidebar */}
      {openSidebar && (
        <div className="sidebar bg-gray/95 text-black absolute rounded-2xl ml-2">
          <ul className="p-4 py-2">
            <li className="cursor-pointer">Shop</li>
            <li className="cursor-pointer">Brands</li>
            <li className="cursor-pointer">New Arrivals</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
