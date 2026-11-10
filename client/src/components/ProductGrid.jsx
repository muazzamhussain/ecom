
import { useEffect, useMemo, useState } from "react";
import { useFilterOpen } from "../context/filterContext";
import { useSearchParams } from "react-router-dom";
import API from "../lib/api";
import ProductCard from "./ui/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const ProductGrid = ({ filters }) => {
  const { toggleFilterOpen } = useFilterOpen();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products based on search
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let result;

        if (search.trim()) {
          result = await API.get("/product/search", {
            params: { q: search.trim() },
          });
        } else {
          result = await API.get("/product");
        }

        if (isMounted) {
          // Supports both array and { products: [] } responses
          const data = result.data.products ?? result.data;
          setProducts(Array.isArray(data) ? data : []);
        }

      } catch (error) {
        console.error("Error fetching products:", error);

        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchProducts, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };

  }, [search]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      // Price filter
      const price = Number(product.salePrice ?? product.cost ?? 0);

      const matchesPrice =
        price >= (filters?.minPrice ?? 0) &&
        price <= (filters?.maxPrice ?? Infinity);

      // Category filter
      const category =
        typeof product.category === "object"
          ? product.category?.name
          : product.category;

      const matchesCategory =
        !filters?.category ||
        category?.toLowerCase() === filters.category.toLowerCase();

      // Size filter
      const productSizes = Array.isArray(product.sizes)
        ? product.sizes
        : product.size
          ? [product.size]
          : [];

      const matchesSize =
        !filters?.sizes?.length ||
        filters.sizes.some((size) =>
          productSizes.some(
            (item) => item.toLowerCase() === size.toLowerCase()
          )
        );

      // Style filter
      const productStyles = Array.isArray(product.styles)
        ? product.styles
        : product.style
          ? [product.style]
          : [];

      const matchesStyle =
        !filters?.styles?.length ||
        filters.styles.some((style) =>
          productStyles.some(
            (item) => item.toLowerCase() === style.toLowerCase()
          )
        );

      return (
        matchesPrice &&
        matchesCategory &&
        matchesSize &&
        matchesStyle
      );
    });
  }, [products, filters]);

  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1 min-w-0">

      {/* Heading */}
      <h2 className="flex items-center gap-4 mb-6 uppercase tracking-wider text-black text-xl sm:text-2xl md:text-3xl font-heading font-bold">

        <SlidersHorizontal
          className="md:hidden cursor-pointer shrink-0"
          onClick={toggleFilterOpen}
        />

        {search ? `Search: ${search}` : "Products"}

        <span className="text-sm font-body font-normal text-gray-400 normal-case tracking-normal">
          ({filteredProducts.length})
        </span>
      </h2>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-3/4 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="font-heading text-xl font-bold">
            No products found
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            Try changing your search or filters to see more products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              title={product.name}
              desc={product.description}
              image={product.images?.[0]}
              rating={product.ratings}
              price={product.cost}
              discountPrice={product.salePrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
