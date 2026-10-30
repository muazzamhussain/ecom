import { SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { useFilterOpen } from "../context/filterContext";

const Filter = () => {
  const { filterOpen, toggleFilterOpen } = useFilterOpen();

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
        <div className="price p-3 mt-4 font-bold md:text-lg">
          <h3>Price</h3>
          <input type="range" min={0} max={1000} />
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
            <p key={size} className="cursor-pointer">
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
