
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CartProductsList from "../components/ui/CartProductsList";
import OrderSummary from "../components/ui/OrderSummary";

import { useCart } from "../context/cartContext";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    subTotal,
    discount,
    deliveryFee,
    totalPrice,
  } = useCart();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-black sm:text-3xl">
            Your Cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review your items before proceeding to checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <CartProductsList />
          </div>

          <div className="w-full lg:sticky lg:top-6">
            <OrderSummary
              subtotal={subTotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={totalPrice}
              actionLabel="Go to Checkout"
              disabled={!cart?.length}
              onAction={() => navigate("/checkout")}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
