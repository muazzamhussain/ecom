import { useState } from "react";
import { BiSolidCoupon } from "react-icons/bi";
import { ArrowRight } from "lucide-react";
import { useCart } from "../../context/cartContext";

const OrderSummary = () => {
  const { cart } = useCart();
  const [coupon, setCoupon] = useState("");

  const subTotal = cart.reduce(
    (acc, curr) => acc + curr.salePrice * curr.quantity,
    0,
  );

  const discount = cart.reduce(
    (acc, curr) => acc + (curr.price - curr.salePrice) * curr.quantity,
    0,
  );

  const deliveryFee = cart.length > 0 ? 9.99 : 0;
  const total = subTotal + deliveryFee;

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;

    // Implement coupon validation here
    console.log("Applying coupon:", coupon);
  };

  const handleCheckout = () => {
    if (!cart.length) return;

    // Navigate to checkout or initiate checkout
    console.log("Proceeding to checkout");
  };

  return (
    <div className="w-75 md:w-100 border border-gray-300 rounded-2xl m-5 p-5 lg:p-10 font-body">
      <h2 className="font-bold text-2xl py-5 tracking-tight">Order Summary</h2>

      <div className="space-y-3">
        <p className="flex justify-between font-semibold text-gray-400">
          Subtotal
          <span className="font-bold text-black">{formatPrice(subTotal)}</span>
        </p>

        <p className="flex justify-between font-semibold text-gray-400">
          Discount
          <span className="font-bold text-red-500">
            -{formatPrice(discount)}
          </span>
        </p>

        <p className="flex justify-between font-semibold text-gray-400">
          Delivery Fee
          <span className="font-bold text-black">
            {formatPrice(deliveryFee)}
          </span>
        </p>
      </div>

      <div className="my-4 border-t border-gray-300/70" />

      <p className="flex justify-between py-2 font-semibold">
        Total
        <span className="font-bold text-black">{formatPrice(total)}</span>
      </p>

      {/* Coupon */}
      <div className="flex flex-col sm:flex-row gap-3 py-4">
        <div className="relative flex-1">
          <BiSolidCoupon
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon or promo code"
            className="w-full bg-gray-100 rounded-full py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <button
          type="button"
          onClick={handleApplyCoupon}
          className="rounded-full bg-black text-white px-7 py-3 text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
        >
          Apply
        </button>
      </div>

      {/* Checkout */}
      <button
        type="button"
        disabled={!cart.length}
        onClick={handleCheckout}
        className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white font-medium text-sm rounded-full hover:bg-black/80 transition-colors cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Go to Checkout
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default OrderSummary;
