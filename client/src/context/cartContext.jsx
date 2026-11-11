import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import API from "../lib/api";
import { useAuth } from "./authContext";

const CartContext = createContext(null);

const GUEST_CART_KEY = "ecommerce_guest_cart";

// Helper to normalize cart items across backend responses and local guest items
const normalizeCartItem = (item) => {
  if (!item) return null;

  const productObj =
    typeof item.productId === "object" && item.productId !== null
      ? item.productId
      : item.product || {};

  const productId = (
    productObj._id ||
    item.productId ||
    item._id ||
    item.id ||
    ""
  ).toString();

  const name = productObj.name || item.name || "Product";
  const price = Number(productObj.price ?? item.price ?? 0);
  const salePrice = Number(productObj.salePrice ?? item.salePrice ?? price);

  const images =
    (productObj.images && productObj.images.length > 0
      ? productObj.images
      : null) ||
    (item.images && item.images.length > 0 ? item.images : null) ||
    (productObj.image ? [productObj.image] : null) ||
    (item.image ? [item.image] : null) ||
    [];

  const image = images[0] || "";
  const stock = Number(productObj.stock ?? item.stock ?? 99);
  const ratings = productObj.ratings || item.ratings || { average: 0, count: 0 };
  const quantity = Math.max(1, Number(item.quantity) || 1);

  return {
    _id: productId, // Consistent identifier matching product._id
    productId,
    rawItemId: item._id && item._id !== productId ? item._id : undefined,
    name,
    price,
    salePrice,
    image,
    images,
    stock,
    ratings,
    quantity,
  };
};

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeCartItem).filter(Boolean);
};

export const CartContextProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load guest cart from localStorage
  const getGuestCart = useCallback(() => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? normalizeItems(JSON.parse(stored)) : [];
    } catch (e) {
      console.error("Failed to parse guest cart from localStorage:", e);
      return [];
    }
  }, []);

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((items) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save guest cart to localStorage:", e);
    }
  }, []);

  // Fetch cart from backend (for authenticated users)
  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const result = await API.get("/cart");
      if (result.data?.cart?.items) {
        setCart(normalizeItems(result.data.cart.items));
      }
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Synchronize cart when auth state changes (login, logout, or initial load)
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // User is logged in: Check if there's any guest cart items to merge
      const guestItems = getGuestCart();
      if (guestItems.length > 0) {
        const mergeGuestCart = async () => {
          try {
            setLoading(true);
            for (const item of guestItems) {
              await API.post("/cart/items", {
                productId: item.productId,
                quantity: item.quantity,
              });
            }
            localStorage.removeItem(GUEST_CART_KEY);
            await fetchCart();
          } catch (err) {
            console.error("Failed to merge guest cart with server cart:", err);
            await fetchCart();
          } finally {
            setLoading(false);
          }
        };
        mergeGuestCart();
      } else {
        fetchCart();
      }
    } else {
      // User is not logged in: Load guest cart
      setCart(getGuestCart());
    }
  }, [user, authLoading, fetchCart, getGuestCart]);

  // Add to Cart
  const addToCart = async (product, quantity = 1) => {
    if (!product) return;

    const productId = (
      product._id ||
      product.id ||
      product.productId ||
      product
    ).toString();
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (user) {
      // Authenticated flow -> Sync with backend
      try {
        setLoading(true);
        const result = await API.post("/cart/items", {
          productId,
          quantity: qty,
        });

        const items = result.data?.cart?.items || [];
        setCart(normalizeItems(items));
        return result.data;
      } catch (error) {
        console.error("Error adding to server cart:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      // Guest flow -> Update local state & localStorage
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === productId,
        );
        let updated;
        if (existingIndex > -1) {
          updated = prev.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + qty }
              : item,
          );
        } else {
          const newItem = normalizeCartItem({
            ...product,
            productId,
            quantity: qty,
          });
          updated = [...prev, newItem];
        }
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  // Update Quantity
  const updateQuantity = async (productIdOrTarget, quantity) => {
    const targetId = (
      productIdOrTarget?._id ||
      productIdOrTarget?.productId ||
      productIdOrTarget?.id ||
      productIdOrTarget ||
      ""
    ).toString();

    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      return removeFromCart(targetId);
    }

    if (user) {
      // Authenticated flow
      try {
        const result = await API.put(`/cart/items/${targetId}`, {
          quantity: newQty,
        });
        const items = result.data?.cart?.items || [];
        setCart(normalizeItems(items));
      } catch (error) {
        console.error("Error updating cart quantity on server:", error);
      }
    } else {
      // Guest flow
      setCart((prev) => {
        const updated = prev.map((item) =>
          item.productId === targetId ? { ...item, quantity: newQty } : item,
        );
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  // Remove from Cart
  const removeFromCart = async (productIdOrTarget) => {
    const targetId = (
      productIdOrTarget?._id ||
      productIdOrTarget?.productId ||
      productIdOrTarget?.id ||
      productIdOrTarget ||
      ""
    ).toString();

    if (!targetId) return;

    if (user) {
      // Authenticated flow
      try {
        const result = await API.delete(`/cart/items/${targetId}`);
        const items = result.data?.cart?.items || [];
        setCart(normalizeItems(items));
      } catch (error) {
        console.error("Error removing item from server cart:", error);
      }
    } else {
      // Guest flow
      setCart((prev) => {
        const updated = prev.filter((item) => item.productId !== targetId);
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (user) {
      try {
        await API.delete("/cart");
        setCart([]);
      } catch (error) {
        console.error("Error clearing server cart:", error);
      }
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
      setCart([]);
    }
  };

  // Useful computed values
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const subTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.salePrice ?? item.price ?? 0);
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const discount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const original = Number(item.price ?? 0);
      const sale = Number(item.salePrice ?? original);
      return sum + Math.max(0, original - sale) * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const deliveryFee = cart.length > 0 ? 9.99 : 0;
  const totalPrice = subTotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        totalItems,
        subTotal,
        discount,
        deliveryFee,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartContextProvider");
  }
  return context;
};
