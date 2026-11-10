import Header from "../components/Header";
import Footer from "../components/Footer";
import CartProductsList from "../components/ui/CartProductsList";
import OrderSummary from "../components/ui/OrderSummary";

const Cart = () => {
  return (
    <div>
      <Header />
      <h2 className="px-5 py-8 uppercase tracking-wide text-black text-2xl md:mb-6 md:text-3xl font-heading">
        Your Cart
      </h2>
      <div className="flex gap-10 mb-5 m-8 flex-col md:flex-row">
        <CartProductsList />
        <OrderSummary />
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
