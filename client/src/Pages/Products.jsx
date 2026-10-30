import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import ProductGrid from "../components/ProductGrid";
import { FilterStateProvider } from "../context/filterContext";

const Products = () => {
  return (
    <div>
      <Header />
      <FilterStateProvider>
        <div className="flex overflow-x-hidden">
          <Filter />
          <ProductGrid />
        </div>
      </FilterStateProvider>
      <Footer />
    </div>
  );
};

export default Products;
