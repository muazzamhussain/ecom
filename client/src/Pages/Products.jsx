import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import ProductGrid from "../components/ProductGrid";
import { FilterStateProvider } from "../context/filterContext";
import { useState } from "react";

const Products = () => {
  
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 250,
    sizes: [],
    styles: [],
  });

  return (
    <div>
      <Header />
      <FilterStateProvider>
        <div className="flex overflow-x-hidden">
          <Filter onApply={setFilters} />
          <ProductGrid filters={filters} />
        </div>
      </FilterStateProvider>
      <Footer />
    </div>
  );
};

export default Products;
