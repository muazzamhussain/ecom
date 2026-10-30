import { useFilterOpen } from "../context/filterContext";
import ProductCard from "./ui/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const ProductGrid = () => {
  const { toggleFilterOpen } = useFilterOpen();

  const products = [
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

  return (
    <div className="p-8">
      <h2 className="flex gap-4 mb-8  uppercase tracking-wider text-black md:mb-6 md:text-3xl font-heading">
        <SlidersHorizontal className="md:hidden" onClick={toggleFilterOpen} />
        Products
      </h2>
      <div className="flex justify-around flex-wrap">
        {" "}
        {products.map((product, index) => (
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
    </div>
  );
};

export default ProductGrid;
