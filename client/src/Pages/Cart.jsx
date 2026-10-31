import Header from "../components/Header";
import Footer from "../components/Footer";
import CartProductsList from "../components/ui/CartProductsList";
import { BiSolidCoupon } from "react-icons/bi";
import { MoveRight } from "lucide-react";

const Cart = () => {
  return (
    <div>
      <Header />
      <h2 className="px-15 py-8 uppercase tracking-wide text-black md:mb-6 md:text-3xl font-heading">
        Your Cart
      </h2>
      <div className="flex gap-10 mb-5 mr-40">
        <CartProductsList />
        <div className="summary border rounded-2xl border-gray-300 p-10 font-body h-110">
          <h2 className="font-bold text-2xl py-5 font-body tracking-tight">Order Summary</h2>
          <p className="flex w-110 justify-between py-1 font-semibold text-gray-400">
            Subtotal <span className="font-bold text-black">$543</span>
          </p>
          <p className="flex w-110 justify-between py-1 font-semibold text-gray-400">
            Discount <span className="font-bold text-red-500">-$13</span>
          </p>
          <p className="flex w-110 justify-between py-1 font-semibold text-gray-400">
            Delivery Fee <span className="font-bold text-black">$43</span>
          </p>

          {/* Divider */}
          <div className="my-3 border-t border-gray-300/70" />
          <p className="flex w-110 justify-between py-2 font-semibold">
            Total <span className="font-bold text-black">$600</span>
          </p>

          <div className="flex w-110 gap-4 py-2 mx-auto">
            <BiSolidCoupon
              color="gray"
              size={23}
              className="relative left-12 top-2"
            />
            <input
              type="text"
              className="bg-gray rounded-3xl p-3 py-2 pl-9"
              placeholder="coupon or promo code here"
              size={30}
            />
            <button className="rounded-3xl bg-black text-white px-4 py-1 cursor-pointer hover:bg-gray-200 hover:text-black hover:outline ">
              Apply
            </button>
          </div>
          <button className="rounded-3xl bg-black text-white px-35 flex gap-5 items-center py-2 hover:bg-gray-700 font-body  my-3 ">
            Go to Checkout <MoveRight />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
