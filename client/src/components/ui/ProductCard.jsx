
import {
  Star,
  ShoppingCartPlus,
  Minus,
  Plus,
} from "lucide-react";

import { useCart } from "../../context/cartContext";
import { toast } from "react-toastify";

const ProductCard = ({
  image,
  title,
  desc,
  rating,
  price,
  discountPrice,
  product,
}) => {
  const { addToCart, cart, updateQuantity } = useCart();

  const productId = product?._id || product?.id;

  const ratingValue =
    typeof rating === "number" ? rating : rating?.average ?? 0;

  // Find actual cart item
  const cartItem = cart?.find(
    (item) => (item._id || item.id) === productId
  );

  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
    toast.success("Product added to cart");
  };

  const handleQuantityChange = (quantity) => {
    updateQuantity(productId, quantity);
  };

  const finalPrice = discountPrice ?? price;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {discountPrice != null && discountPrice < price && (
          <span className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            -{Math.round(((price - discountPrice) / price) * 100)}%
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">

        <h3 className="font-semibold text-base sm:text-lg font-body line-clamp-1">
          {title}
        </h3>

        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-body line-clamp-2 min-h-8">
          {desc}
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <Star
            fill="orange"
            stroke="orange"
            size={16}
          />
          <span className="font-medium">{ratingValue}</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-lg sm:text-xl font-body">
            ${finalPrice}
          </h3>

          {discountPrice != null && discountPrice < price && (
            <span className="text-sm text-gray-400 line-through">
              ${price}
            </span>
          )}
        </div>

        {/* Cart Actions */}
        <div className="mt-4">
          {isInCart ? (
            <div className="flex items-center justify-between rounded-full bg-gray-100 px-2 py-1.5">

              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(
                    Math.max(1, (cartItem.quantity || 1) - 1)
                  )
                }
                disabled={(cartItem.quantity || 1) <= 1}
                className="rounded-full p-2 hover:bg-white disabled:opacity-30 transition cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span className="text-sm font-semibold">
                {cartItem.quantity || 1}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleQuantityChange((cartItem.quantity || 1) + 1)
                }
                className="rounded-full p-2 hover:bg-white transition cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>

            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-3 py-2.5 text-white text-sm font-medium transition hover:bg-gray-800 cursor-pointer"
            >
              <ShoppingCartPlus size={18} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
