import ProductCard from "./ui/ProductCard";

const ProductSection = () => {
  const newArrivals = [
    {
      title: "T-shirt with Tape Details",
      image: "shirt.png",
      rating: "4.5/5",
      price: 120,
      discountPrice: null,
    },
    {
      title: "Skinny Fit Jeans",
      image: "jeans.png",
      rating: "3.5/5",
      price: 260,
      discountPrice: 240,
    },
    {
      title: "Checkered Shirt",
      image: "check-shirt.png",
      rating: "4.5/5",
      price: 180,
      discountPrice: null,
    },
    {
      title: "Sleeve Striped T-shirt",
      image: "striped-shirt.png",
      rating: "4.5/5",
      price: 160,
      discountPrice: 130,
    },
  ];

  const topSelling = [
    {
      title: "Vertical Striped Shirt",
      image: "vertical-shirt.png",
      rating: "5.0/5",
      price: 232,
      discountPrice: 212,
    },
    {
      title: "Courage Graphic T-shirt",
      image: "courage-shirt.png",
      rating: "4.0/5",
      price: 145,
      discountPrice: null,
    },
    {
      title: "Loose Fit Bermuda Shorts",
      image: "shorts.png",
      rating: "3.0/5",
      price: 80,
      discountPrice: null,
    },
    {
      title: "Faded Skinny Jeans",
      image: "faded-jeans.png",
      rating: "4.5/5",
      price: 210,
      discountPrice: null,
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-20 flex flex-col items-center">
      {/* ========== NEW ARRIVALS ========== */}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-center tracking-tight">
        New Arrivals
      </h2>

      {/* Products Grid */}
      <div className="w-full mt-8 sm:mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 justify-items-center">
        {newArrivals.map((product, index) => (
          <ProductCard
            key={`new-${index}`}
            title={product.title}
            image={product.image}
            rating={product.rating}
            price={product.price}
            discountPrice={product.discountPrice}
          />
        ))}
      </div>

      {/* View All Button */}
      <button className="font-body font-semibold border border-black/20 rounded-full mt-8 sm:mt-10 px-10 sm:px-14 py-2.5 sm:py-3 text-sm hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer">
        View All
      </button>

      {/* Divider */}
      <hr className="w-full border-t border-black/10 my-10 sm:my-14 md:my-16" />

      {/* ========== TOP SELLING ========== */}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-center tracking-tight">
        Top Selling
      </h2>

      {/* Products Grid */}
      <div className="w-full mt-8 sm:mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 justify-items-center">
        {topSelling.map((product, index) => (
          <ProductCard
            key={`top-${index}`}
            title={product.title}
            image={product.image}
            rating={product.rating}
            price={product.price}
            discountPrice={product.discountPrice}
          />
        ))}
      </div>

      {/* View All Button */}
      <button className="font-body font-semibold border border-black/20 rounded-full mt-8 sm:mt-10 px-10 sm:px-14 py-2.5 sm:py-3 text-sm hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer">
        View All
      </button>
    </section>
  );
};

export default ProductSection;
