import { CheckCircle2, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = ({ orderNumber, placedOrder }) => {
  const navigate = useNavigate();

  const money = (amount) =>
    Number(amount || 0).toLocaleString("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    });
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 size={34} className="text-green-600" />
      </div>

      <h1 className="font-heading text-2xl font-bold text-gray-900">
        Order placed successfully!
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        Thank you for your purchase. Your order has been received and is being
        processed.
      </p>

      {orderNumber && (
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Order reference
          </p>

          <p className="mt-1 break-all font-semibold text-gray-900">
            {orderNumber}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <PackageCheck size={18} className="text-green-600" />
        <span>Payment method: Cash on Delivery</span>
      </div>

      <p className="mt-4 text-lg font-bold text-gray-900">
        Total: {money(placedOrder.totalPrice ?? total)}
      </p>

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="mt-8 w-full rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;
