import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterStateProvider({ children }) {
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilterOpen = () => {
    setFilterOpen((prev) => !prev);
  };

  return (
    <FilterContext.Provider value={{ filterOpen, toggleFilterOpen }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterOpen() {
  return useContext(FilterContext);
}
