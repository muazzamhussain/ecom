
import {
  ShoppingCart,
  CircleUserRound,
  Search,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/cartContext";

const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { user } = useAuth();
  const { totalItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);

    setOpenSearch(false);
    setOpenSidebar(false);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-around h-15 md:h-20 items-center">

        {/* Mobile Menu */}
        <Menu
          className="block md:hidden cursor-pointer"
          onClick={() => setOpenSidebar((prev) => !prev)}
        />

        {/* Logo */}
        <h1 className="text-2xl font-bold font-heading relative right-6 md:block">
          <Link to="/">ECOM</Link>
        </h1>

        {/* Desktop Navigation */}
        <ul className="gap-20 hidden md:flex">
          <li className="cursor-pointer">
            <Link to="/products">Shop</Link>
          </li>
        </ul>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center"
        >
          <button type="submit" aria-label="Search products">
            <Search className="relative left-7 md:left-8 opacity-60 cursor-pointer" />
          </button>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="bg-gray w-100 px-12 py-2 rounded-4xl focus:outline-1"
          />
        </form>

        {/* Icons */}
        <div className="icons flex gap-2 md:gap-5 items-center">

          {/* Mobile Search Toggle */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpenSearch((prev) => !prev)}
            aria-label="Toggle search"
          >
            {openSearch ? <X /> : <Search />}
          </button>

          <Link to="/cart" className="relative p-1">
            <ShoppingCart className="cursor-pointer" />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <Link to={user ? "/profile" : "/login"}>
            <CircleUserRound className="cursor-pointer" />
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      {openSearch && (
        <form
          onSubmit={handleSearch}
          className="px-4 pb-3 md:hidden"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            autoFocus
            className="bg-gray px-4 text-sm w-full py-3 rounded-4xl focus:outline-1"
          />
        </form>
      )}

      {/* Sidebar */}
      {openSidebar && (
        <div className="sidebar bg-gray/95 text-black absolute rounded-2xl ml-2 z-50">
          <ul className="p-4 py-2">
            <li className="cursor-pointer">
              <Link to="/products" onClick={() => setOpenSidebar(false)}>
                Shop
              </Link>
            </li>
            <li className="cursor-pointer">Brands</li>
            <li className="cursor-pointer">New Arrivals</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
