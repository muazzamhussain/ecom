import React from "react";

const categories = [
  {
    title: "Casual",
    image: "/assets/casual.png", // Replace with your image path
    colSpan: "md:col-span-1",
  },
  {
    title: "Formal",
    image: "/assets/formal.png", // Replace with your image path
    colSpan: "md:col-span-2",
  },
  {
    title: "Party",
    image: "/assets/party.png", // Replace with your image path
    colSpan: "md:col-span-2",
  },
  {
    title: "Gym",
    image: "/assets/gym.png", // Replace with your image path
    colSpan: "md:col-span-1",
  },
];

const BrowseSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Outer Rounded Container */}
      <div className="rounded-3xl bg-gray px-6 py-10 md:px-16 md:py-16">
        {/* Section Heading */}
        <h2 className="mb-8 text-center uppercase tracking-wider text-black md:mb-12 md:text-4xl font-heading">
          Browse By Dress Style
        </h2>

        {/* Asymmetric Category Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`relative h-55 overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:scale-[1.01] sm:h-65 ${cat.colSpan}`}
            >
              {/* Category Title */}
              <span className="relative z-10 text-sm font-semibold text-black font-body">
                {cat.title}
              </span>

              {/* Background Image positioned to match the layout */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute right-0 top-0 h-full w-auto object-cover object-right"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseSection;