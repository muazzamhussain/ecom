import { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { useFilterOpen } from "../context/filterContext";

const Filter = () => {
  const { filterOpen, toggleFilterOpen } = useFilterOpen();

  // Define pricing bounds
  const minLimit = 0;
  const maxLimit = 250;

  // React State for both handles
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(200);

  // Position offsets for tracking background highlight fill and text alignment
  const [minOffset, setMinOffset] = useState("0%");
  const [maxOffset, setMaxOffset] = useState("100%");

  // Update background bar fill positions and label positioning dynamically
  useEffect(() => {
    const minPercent = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;
    const maxPercent = ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100;

    setMinOffset(`${minPercent}%`);
    setMaxOffset(`${maxPercent}%`);
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 10); // Enforces 10 dollar separation
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 10); // Enforces 10 dollar separation
    setMaxPrice(value);
  };

  return (
    <>
      {/* Mobile overlay */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleFilterOpen}
        />
      )}

      <div
        className={`
          w-60 pb-8 border border-gray-300 rounded-2xl bg-white
          fixed md:static top-0 left-0 z-50 md:z-auto
          h-screen md:h-fit overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${filterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:m-6
        `}
      >
        <h3 className="flex justify-between p-3 font-bold md:text-lg">
          Filters
          <div className="flex gap-3">
            <X
              className="md:hidden cursor-pointer"
              onClick={toggleFilterOpen}
            />
            <SlidersHorizontal />
          </div>
        </h3>

        <div className="categories py-0 text-sm">
          {["T-Shirts", "Shorts", "Hoodie", "Jeans"].map((category) => (
            <p
              key={category}
              className="flex justify-between px-3 py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              {category}
              <ChevronRight />
            </p>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 w-50 mx-auto border-t border-gray-300/70" />

        {/* Price Slider Section */}
        <div className="price p-3 mt-4 font-bold md:text-lg">
          <h3>Price</h3>
          <div className="w-full max-w-xl mx-auto px-1 pt-8 relative select-none">
            {/* Slider Component Body */}
            <div className="relative w-full h-1 bg-gray-200 rounded-full">
              {/* Active Dark Range Filled Bar */}
              <div
                className="absolute h-1 bg-black rounded-full"
                style={{
                  left: minOffset,
                  right: `${100 - parseFloat(maxOffset)}%`,
                }}
              ></div>

              {/* Minimum Range Handle input */}
              <input
                type="range"
                min={minLimit}
                max={maxLimit}
                value={minPrice}
                onChange={handleMinChange}
                className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer accent-transparent top-0 left-0
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
              />

              {/* Maximum Range Handle input */}
              <input
                type="range"
                min={minLimit}
                max={maxLimit}
                value={maxPrice}
                onChange={handleMaxChange}
                className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer accent-transparent top-0 left-0
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>

            {/* Dynamic Value Floating Labels below track */}
            <div className="relative w-full h-6 mt-4 text-sm text-black font-medium font-sans">
              <span
                className="absolute transform -translate-x-1/2 whitespace-nowrap"
                style={{ left: minOffset }}
              >
                ${minPrice}
              </span>
              <span
                className="absolute transform -translate-x-1/2 whitespace-nowrap"
                style={{ left: maxOffset }}
              >
                ${maxPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 w-50 mx-auto border-t border-gray-300/70" />
        <h3 className="font-bold md:text-lg mt-4 px-3 pb-1">Size</h3>

        <div className="size flex flex-wrap gap-x-4 gap-y-2 pl-3 text-sm">
          {[
            "XX-Small",
            "X-Small",
            "Small",
            "Medium",
            "Large",
            "X-Large",
            "XX-Large",
          ].map((size) => (
            <p key={size} className="cursor-pointer bg-gray p-2 rounded-2xl focus:bg-black focus:text-white">
              {size}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 w-50 mx-auto border-t border-gray-300/70" />

        <div className="style mt-4 p-3 pb-1 text-sm">
          <h3 className="font-bold md:text-lg">Dress Style</h3>

          {["Casual", "Formal", "Party", "Gym"].map((style) => (
            <p
              key={style}
              className="flex justify-between py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              {style}
              <ChevronRight />
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Filter;
