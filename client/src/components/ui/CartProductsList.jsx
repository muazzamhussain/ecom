import { Trash, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/cartContext";

const CartProductsList = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="w-full border mx-3 border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 font-body">
      <div className="space-y-6">
        {cart?.length > 0 ? (
          cart.map((product) => (
            <div
              key={product._id}
              className="flex gap-4 sm:gap-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              {/* Product Image */}
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl bg-gray-100 shrink-0"
              />

              {/* Product Details */}
              <div className="flex flex-1 min-w-0 flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer shrink-0"
                      aria-label="Remove product"
                    >
                      <Trash size={19} />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Rating: {product.ratings?.average ?? "N/A"}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-3">
                    <span className="font-bold text-lg sm:text-xl">
                      ${product.salePrice}
                    </span>

                    <span className="text-gray-400 line-through text-sm sm:text-base">
                      ${product.price}
                    </span>

                    <span className="text-red-500 bg-red-100 rounded-full px-2 py-1 text-[10px] sm:text-xs font-medium">
                      -
                      {Math.round(
                        ((product.price - product.salePrice) / product.price) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex justify-end mt-3">
                  <div className="flex items-center justify-between bg-gray-100 rounded-full w-28 sm:w-32 px-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          Math.max(1, product.quantity - 1),
                        )
                      }
                      disabled={product.quantity <= 1}
                      className="p-2 hover:text-gray-500 disabled:opacity-30 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="font-medium text-sm">
                      {product.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(product._id, product.quantity + 1)
                      }
                      className="p-2 hover:text-gray-500 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-lg font-semibold font-body">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-400 mt-2 font-body">
              Add some products to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartProductsList;
