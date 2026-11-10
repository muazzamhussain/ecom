import { useState } from "react";
import { SlidersHorizontal, ChevronRight, X, RotateCcw } from "lucide-react";
import { useFilterOpen } from "../context/filterContext";

const Filter = ({ onApply }) => {
  const { filterOpen, toggleFilterOpen } = useFilterOpen();

  // Price range
  const minLimit = 0;
  const maxLimit = 250;

  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(200);

  // Selected filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);

  const categories = ["T-Shirts", "Shorts", "Hoodie", "Jeans"];

  const sizes = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
  ];

  const styles = ["Casual", "Formal", "Party", "Gym"];

  // Price slider calculations
  const minPercent = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;

  const maxPercent = ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100;

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(Math.min(value, maxPrice - 10));
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(Math.max(value, minPrice + 10));
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  // Toggle style selection
  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((item) => item !== style)
        : [...prev, style],
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setMinPrice(minLimit);
    setMaxPrice(maxLimit);
    setSelectedCategory("");
    setSelectedSizes([]);
    setSelectedStyles([]);

    onApply?.({
      category: "",
      minPrice: minLimit,
      maxPrice: maxLimit,
      sizes: [],
      styles: [],
    });
  };

  // Apply filters
  const handleApply = () => {
    onApply?.({
      category: selectedCategory,
      minPrice,
      maxPrice,
      sizes: selectedSizes,
      styles: selectedStyles,
    });

    if (filterOpen) toggleFilterOpen();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
          onClick={toggleFilterOpen}
        />
      )}

      {/* Filter Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[85%] max-w-sm bg-white
          border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${filterOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-64 md:max-w-none
          md:border md:rounded-2xl md:m-4 md:mr-0
          md:sticky md:top-4 md:h-fit
          md:max-h-[calc(100vh-2rem)]
          flex flex-col font-body
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 shrink-0">
          <h3 className="font-bold text-lg">Filters</h3>

          <div className="flex items-center gap-4">
            <button
              onClick={resetFilters}
              className="text-gray-400 hover:text-black transition cursor-pointer"
              title="Reset filters"
            >
              <RotateCcw size={17} />
            </button>

            <SlidersHorizontal size={20} />

            <button
              onClick={toggleFilterOpen}
              className="md:hidden text-gray-500 hover:text-black cursor-pointer"
              aria-label="Close filters"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Content */}

        <div
          className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-thumb]:min-h-6 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 
            [&::-webkit-scrollbar-thumb]:rounded"
        >
          {/* Categories */}
          <section>
            <h3 className="font-bold text-base mb-3">Categories</h3>

            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? "" : category,
                    )
                  }
                  className={`
                    flex items-center justify-between w-full
                    rounded-lg px-3 py-2.5 text-sm transition
                    ${
                      selectedCategory === category
                        ? "bg-black text-white font-medium"
                        : "text-gray-500 hover:bg-gray-100 hover:text-black"
                    }
                  `}
                >
                  {category}
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </section>

          <div className="my-6 border-t border-gray-200" />

          {/* Price Range */}
          <section>
            <h3 className="font-bold text-base mb-6">Price Range</h3>

            <div className="px-2 pt-2">
              {/* Slider Track */}
              <div
                className="relative h-1.5 rounded-full bg-gray-200"
                style={{
                  background: `linear-gradient(to right, #e5e7eb ${minPercent}%, #000 ${minPercent}%, #000 ${maxPercent}%, #e5e7eb ${maxPercent}%)`,
                }}
              >
                {/* Minimum Slider */}
                <input
                  type="range"
                  min={minLimit}
                  max={maxLimit}
                  value={minPrice}
                  onChange={handleMinChange}
                  aria-label="Minimum price"
                  className="absolute inset-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-black
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow
                    [&::-moz-range-thumb]:pointer-events-auto
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-black
                    [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white"
                />

                {/* Maximum Slider */}
                <input
                  type="range"
                  min={minLimit}
                  max={maxLimit}
                  value={maxPrice}
                  onChange={handleMaxChange}
                  aria-label="Maximum price"
                  className="absolute inset-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none z-30 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-black
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow
                    [&::-moz-range-thumb]:pointer-events-auto
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-black
                    [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white"
                />
              </div>

              {/* Price Values */}
              <div className="flex justify-between items-center mt-6 text-sm font-semibold">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </section>

          <div className="my-6 border-t border-gray-200" />

          {/* Sizes */}
          <section>
            <h3 className="font-bold text-base mb-4">Size</h3>

            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const active = selectedSizes.includes(size);

                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`
                      rounded-full px-3 py-2 text-xs sm:text-sm
                      transition-colors cursor-pointer
                      ${
                        active
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="my-6 border-t border-gray-200" />

          {/* Dress Style */}
          <section>
            <h3 className="font-bold text-base mb-3">Dress Style</h3>

            <div className="space-y-1">
              {styles.map((style) => {
                const active = selectedStyles.includes(style);

                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`
                      flex items-center justify-between w-full
                      rounded-lg px-3 py-2.5 text-sm transition
                      ${
                        active
                          ? "bg-black text-white"
                          : "text-gray-500 hover:bg-gray-100 hover:text-black"
                      }
                    `}
                  >
                    {style}
                    <ChevronRight size={17} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sticky Apply Button */}
        <div className="p-5 border-t border-gray-200 bg-white shrink-0">
          <button
            onClick={handleApply}
            className="w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default Filter;
