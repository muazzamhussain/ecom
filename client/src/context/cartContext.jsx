import { createContext, useContext, useState } from "react";

const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item._id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => prev.filter((item) => item.id !== product.id));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item._id === productId);
      if (existingProduct) {
        return prev.map((item) =>
          item._id === productId ? { ...item, quantity } : item,
        );
      }
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
