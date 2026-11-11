import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterStateProvider = ({ children }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilterOpen = () => {
    setFilterOpen((prev) => !prev);
  };

  return (
    <FilterContext.Provider value={{ filterOpen, toggleFilterOpen }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterOpen = () => {
  return useContext(FilterContext);
};
