import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import API from "../lib/api";
import ProductCard from "./ui/ProductCard";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/product");

        // Supports either an array or { products: [...] }
        const data = response.data.products ?? response.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response");
        }

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Latest products first
  const newArrivals = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 4);

  // Products with the highest completed sales first
  const topSelling = [...products]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 4);

  const renderProducts = (items) => (
    <div className="w-full mt-8 sm:mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 justify-items-center">
      {items.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          title={product.name}
          desc={product.description}
          image={product.images?.[0] ?? product.image?.[0] ?? product.image}
          rating={product.ratings}
          price={product.cost}
          discountPrice={product.salePrice}
        />
      ))}
    </div>
  );

  const renderSection = (title, items) => (
    <>
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-center tracking-tight">
        {title}
      </h2>

      {items.length > 0 ? (
        renderProducts(items)
      ) : (
        <p className="mt-8 text-center text-gray-500 font-body">
          No products available yet.
        </p>
      )}

      <Link
        to="/products"
        className="inline-flex items-center gap-2 font-body font-semibold border border-black/20 rounded-full mt-8 sm:mt-10 px-10 sm:px-14 py-2.5 sm:py-3 text-sm hover:bg-black hover:text-white transition-colors duration-300"
      >
        View All
        <ArrowRight size={16} />
      </Link>
    </>
  );

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-20 flex flex-col items-center">
      {loading ? (
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-3/4 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 font-body">{error}</p>
      ) : (
        <>
          {renderSection("New Arrivals", newArrivals)}

          <hr className="w-full border-t border-black/10 my-10 sm:my-14 md:my-16" />

          {renderSection("Top Selling", topSelling)}
        </>
      )}
    </section>
  );
};

export default ProductSection;
