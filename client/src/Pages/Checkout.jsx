import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import API from "../lib/api";

import ShippingDetails from "../components/ui/ShippingDetails";
import OrderSummary from "../components/ui/OrderSummary";

import { AlertCircle, PackageCheck } from "lucide-react";
import OrderSuccess from "../components/ui/OrderSuccess";

const SHIPPING_FEE = 200;
const FREE_SHIPPING_OVER = 5000;

const EMPTY_ADDRESS = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Pakistan",
};

const REQUIRED_FIELDS = [
  { name: "name", label: "recipient's full name" },
  { name: "phone", label: "phone number" },
  { name: "street", label: "street address" },
  { name: "city", label: "city" },
  { name: "state", label: "state / province" },
  { name: "zipCode", label: "postal code" },
  { name: "country", label: "country" },
];

const PHONE_PATTERN = /^\+?[0-9\s()-]{10,16}$/;

const money = (amount) =>
  Number(amount || 0).toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });

// Normalize different possible cart item shapes.
const toLine = (item) => {
  const product =
    typeof item.product === "object" && item.product !== null
      ? item.product
      : null;

  const productId =
    product?._id ??
    item.productId ??
    (typeof item.product === "string" ? item.product : null) ??
    item._id;

  const image =
    item.image ?? item.images?.[0]?.url ?? product?.images?.[0]?.url ?? "";

  const price = Number(
    item.salePrice ?? product?.salePrice ?? item.price ?? product?.price ?? 0,
  );

  const quantity = Number(item.quantity ?? item.qty ?? 1);

  return {
    productId: productId ? String(productId) : "",
    name: item.name ?? product?.name ?? "Product",
    image: typeof image === "string" ? image : (image?.url ?? ""),
    price,
    quantity,
  };
};

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    ...EMPTY_ADDRESS,
  });

  const [selectedAddressIndex, setSelectedAddressIndex] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // Normalize cart items.
  const lines = useMemo(() => {
    return (Array.isArray(cart) ? cart : [])
      .map(toLine)
      .filter(
        (item) =>
          item.productId &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      );
  }, [cart]);

  // Calculate totals.
  const subtotal = useMemo(() => {
    return lines.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [lines]);

  const deliveryFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;

  const total = subtotal + deliveryFee;

  // Prefill recipient and default saved address.
  useEffect(() => {
    if (!user) return;

    const addresses = Array.isArray(user.addresses) ? user.addresses : [];

    const defaultIndex = addresses.findIndex((address) => address.isDefault);

    const addressIndex =
      defaultIndex >= 0 ? defaultIndex : addresses.length > 0 ? 0 : -1;

    const selectedAddress = addressIndex >= 0 ? addresses[addressIndex] : {};

    if (addressIndex >= 0) {
      setSelectedAddressIndex(String(addressIndex));
    }

    setShippingAddress((previous) => ({
      ...EMPTY_ADDRESS,
      ...selectedAddress,
      name: previous.name || user.name || "",
      phone: previous.phone || user.phone || "",
    }));
  }, [user]);

  // Handle input changes from ShippingDetails.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Name and phone are contact details, not saved address fields.
    if (!["name", "phone"].includes(name)) {
      setSelectedAddressIndex("");
    }

    setError("");
  };

  // Handle saved address selection.
  const handleSavedAddress = (event) => {
    const index = event.target.value;

    setError("");

    if (index === "") {
      setSelectedAddressIndex("");

      setShippingAddress((previous) => ({
        ...EMPTY_ADDRESS,
        name: previous.name || user?.name || "",
        phone: previous.phone || user?.phone || "",
      }));

      return;
    }

    const addresses = Array.isArray(user?.addresses) ? user.addresses : [];

    const address = addresses[Number(index)];

    if (!address) return;

    setSelectedAddressIndex(index);

    setShippingAddress((previous) => ({
      ...EMPTY_ADDRESS,
      ...address,
      name: previous.name || user?.name || "",
      phone: previous.phone || user?.phone || "",
    }));
  };

  // Validate shipping information.
  const validateShippingAddress = () => {
    const missingField = REQUIRED_FIELDS.find(({ name }) => {
      return !String(shippingAddress[name] ?? "").trim();
    });

    if (missingField) {
      return `Please enter your ${missingField.label}.`;
    }

    const phone = String(shippingAddress.phone ?? "").trim();

    if (!PHONE_PATTERN.test(phone)) {
      return "Please enter a valid phone number.";
    }

    return "";
  };

  // Place order.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (placing) return;

    setError("");

    if (!lines.length) {
      setError("Your cart is empty or contains invalid products.");
      return;
    }

    const validationError = validateShippingAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      items: lines.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),

      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zipCode: shippingAddress.zipCode.trim(),
        country: shippingAddress.country.trim(),
      },

      paymentMethod: "COD",
    };

    try {
      setPlacing(true);

      const response = await API.post("/checkout", payload);

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Unable to place your order.");
      }

      const order =
        response.data?.order ??
        response.data?.data?.order ??
        response.data?.data ??
        response.data;

      if (
        !order ||
        typeof order !== "object" ||
        (!order._id && !order.id && !order.orderNumber)
      ) {
        throw new Error(
          "The server response did not contain a valid order confirmation.",
        );
      }

      // Show confirmation only after successful order creation.
      setPlacedOrder(order);
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while placing your order.",
      );
    } finally {
      setPlacing(false);
    }
  };

  // Order confirmation screen.
  if (placedOrder) {
    const orderNumber =
      placedOrder.orderNumber ?? placedOrder._id ?? placedOrder.id;

    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <OrderSuccess orderNumber={orderNumber} placedOrder={placedOrder} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="mt-3 font-heading text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your delivery details and review your order.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!lines.length ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <PackageCheck size={42} className="mx-auto text-gray-300" />

            <h2 className="mt-4 font-heading text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="mt-6 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
          >
            {/* Left: shipping and payment */}
            <div className="space-y-6 lg:col-span-2">
              <ShippingDetails
                user={user}
                value={shippingAddress}
                onChange={handleChange}
                onSelectAddress={handleSavedAddress}
                selectedAddressIndex={selectedAddressIndex}
                disabled={placing}
              />

              {/* Payment method */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="font-heading text-lg font-bold text-gray-900">
                    Payment method
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you want to pay for your order.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked
                    readOnly
                    className="mt-1 h-4 w-4 accent-gray-900"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-gray-900">
                      Cash on Delivery
                    </span>

                    <span className="mt-1 block text-xs text-gray-500">
                      Pay when your order is delivered to your address.
                    </span>
                  </span>
                </label>
              </section>
            </div>

            {/* Right: order summary */}
            <aside className="lg:sticky lg:top-6">
              <OrderSummary
                items={lines}
                showItems
                subtotal={subtotal}
                discount={0}
                deliveryFee={deliveryFee}
                total={total}
                shippingLabel="Delivery"
                actionLabel={`Place Order · ${money(total)}`}
                loadingLabel="Placing order..."
                actionType="submit"
                loading={placing}
                disabled={!lines.length || placing}
              />

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                By placing your order, you confirm that your shipping details
                are correct.
              </p>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;
