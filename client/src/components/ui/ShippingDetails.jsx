
import { MapPin, UserRound, Phone, ChevronDown } from "lucide-react";

const inputClass =
  "w-full h-11 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-xl border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all disabled:opacity-50";

const fields = [
  {
    name: "street",
    label: "Street address",
    placeholder: "House number, street name",
    autoComplete: "street-address",
    wide: true,
  },
  {
    name: "city",
    label: "City",
    placeholder: "Your city",
    autoComplete: "address-level2",
  },
  {
    name: "state",
    label: "State / Province",
    placeholder: "Your state",
    autoComplete: "address-level1",
  },
  {
    name: "zipCode",
    label: "Postal code",
    placeholder: "Postal code",
    autoComplete: "postal-code",
  },
  {
    name: "country",
    label: "Country",
    placeholder: "Your country",
    autoComplete: "country-name",
  },
];

const ShippingDetails = ({
  user,
  value,
  onChange,
  onSelectAddress,
  selectedAddressIndex = "",
  disabled = false,
}) => {
  const savedAddresses = user?.addresses ?? [];

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-8">
      {/* Section heading */}
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F0F0]">
          <MapPin size={20} />
        </div>

        <div>
          <h2 className="font-heading text-lg font-bold uppercase">
            Shipping Details
          </h2>
          <p className="mt-1 font-body text-xs text-black/50">
            Where should we deliver your order?
          </p>
        </div>
      </div>

      {/* Saved addresses */}
      {savedAddresses.length > 0 && (
        <div className="mb-7">
          <label
            htmlFor="savedAddress"
            className="mb-2 block font-body text-sm font-semibold"
          >
            Choose a saved address
          </label>

          <div className="relative">
            <select
              id="savedAddress"
              value={selectedAddressIndex}
              onChange={onSelectAddress}
              disabled={disabled}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Enter a new address</option>

              {savedAddresses.map((address, index) => (
                <option key={address._id ?? index} value={index}>
                  {address.street}, {address.city}
                  {address.isDefault ? " (Default)" : ""}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/50"
            />
          </div>
        </div>
      )}

      {/* Contact information */}
      <div className="mb-7">
        <div className="mb-4 flex items-center gap-2">
          <UserRound size={17} className="text-black/60" />
          <h3 className="font-body text-sm font-bold">
            Contact Information
          </h3>
        </div>

        <div className="space-y-4">
          {/* Recipient name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-body text-sm font-semibold"
            >
              Full Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={value.name || ""}
              onChange={onChange}
              placeholder="Enter recipient's full name"
              className={inputClass}
              required
              disabled={disabled}
            />
          </div>

          {/* Phone number */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block font-body text-sm font-semibold"
            >
              Phone Number *
            </label>

            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
              />

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={value.phone || ""}
                onChange={onChange}
                placeholder="+92 300 1234567"
                className={`${inputClass} pl-11`}
                required
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 border-t border-black/10" />

      {/* Address information */}
      <div className="mb-4 flex items-center gap-2">
        <MapPin size={17} className="text-black/60" />
        <h3 className="font-body text-sm font-bold">
          Delivery Address
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(
          ({ name, label, placeholder, autoComplete, wide }) => (
            <div key={name} className={wide ? "sm:col-span-2" : ""}>
              <label
                htmlFor={name}
                className="mb-2 block font-body text-sm font-semibold"
              >
                {label} *
              </label>

              <input
                id={name}
                name={name}
                type="text"
                autoComplete={autoComplete}
                value={value[name] || ""}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
                required
                disabled={disabled}
              />
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default ShippingDetails;
