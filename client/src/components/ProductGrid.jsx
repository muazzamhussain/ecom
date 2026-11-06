import { useEffect, useState } from "react";
import { useFilterOpen } from "../context/filterContext";
import API from "../lib/api";
import ProductCard from "./ui/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const ProductGrid = () => {
  const { toggleFilterOpen } = useFilterOpen();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const result = await API.get("/product");
      setProducts(result.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8 w-300">
      <h2 className="flex gap-4 mb-8 uppercase tracking-wider text-black md:mb-6 md:text-3xl font-heading">
        <SlidersHorizontal
          className="md:hidden cursor-pointer"
          onClick={toggleFilterOpen}
        />
        Products
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
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
