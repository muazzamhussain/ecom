import React, { useState, useEffect } from "react";

import { Edit2, MapPin, Check, X, Plus } from "lucide-react";
import { useAuth } from "../context/authContext";
import API from "../lib/api";

const inputClass =
  "w-full h-11 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";

const PersonalDetails = () => {
  const { user, setUser } = useAuth();

  // ── Personal details edit state ──

  const [editingInfo, setEditingInfo] = useState(false);

  const [infoForm, setInfoForm] = useState({
    name: "",

    email: "",

    phone: "",
  });

  const [savingInfo, setSavingInfo] = useState(false);

  // ── Address edit state ──

  const [editingAddress, setEditingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    street: "",

    city: "",

    state: "",

    zipCode: "",

    country: "",
  });

  const [savingAddress, setSavingAddress] = useState(false);

  // Sync forms when user loads / changes

  useEffect(() => {
    if (!user) return;

    setInfoForm({
      name: user.name || "",

      email: user.email || "",

      phone: user.phone || "",
    });

    const defaultAddress =
      user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

    setAddressForm({
      street: defaultAddress?.street || "",

      city: defaultAddress?.city || "",

      state: defaultAddress?.state || "",

      zipCode: defaultAddress?.zipCode || "",

      country: defaultAddress?.country || "",
    });
  }, [user]);

  // ── Helpers ──

  const defaultAddress =
    user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const formattedAddress = defaultAddress
    ? [
        defaultAddress.street,

        defaultAddress.city,

        defaultAddress.state,

        defaultAddress.zipCode,

        defaultAddress.country,
      ]

        .filter(Boolean)

        .join(", ")
    : "No address added yet";

  // ── Personal Info handlers ──

  const startEditInfo = () => {
    setInfoForm({
      name: user?.name || "",

      email: user?.email || "",

      phone: user?.phone || "",
    });

    setEditingInfo(true);
  };

  const cancelEditInfo = () => {
    setEditingInfo(false);
  };

  const saveInfo = async (e) => {
    e.preventDefault();

    if (!infoForm.name.trim() || !infoForm.email.trim()) {
      alert("Name and email are required.");

      return;
    }

    setSavingInfo(true);

    try {
      const { data } = await API.put("/auth/profile", {
        name: infoForm.name.trim(),
        email: infoForm.email.trim(),
        phone: infoForm.phone.trim(),
      });

      if (data.user) {
        setUser(data.user);
      } else {
        setUser((current) => ({ ...current, ...infoForm }));
      }
      setEditingInfo(false);
    } catch (err) {
      console.error(err);

      alert("Failed to update profile. Please try again.");
    } finally {
      setSavingInfo(false);
    }
  };

  // ── Address handlers ──

  const startEditAddress = () => {
    const addr =
      user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

    setAddressForm({
      street: addr?.street || "",

      city: addr?.city || "",

      state: addr?.state || "",

      zipCode: addr?.zipCode || "",

      country: addr?.country || "",
    });

    setEditingAddress(true);
  };

  const cancelEditAddress = () => {
    setEditingAddress(false);
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    if (!addressForm.street.trim() || !addressForm.city.trim()) {
      alert("Street and city are required.");

      return;
    }

    setSavingAddress(true);

    try {
      const newAddress = {
        ...addressForm,
        street: addressForm.street.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        zipCode: addressForm.zipCode.trim(),
        country: addressForm.country.trim(),
        isDefault: true,
      };

      const otherAddresses = (user?.addresses || []).filter(
        (address) => !address.isDefault,
      );
      const addresses = [newAddress, ...otherAddresses];

      const { data } = await API.put("/auth/profile", { addresses });

      if (data.user) {
        setUser(data.user);
      } else {
        setUser((current) => ({ ...current, addresses }));
      }
      setEditingAddress(false);
    } catch (err) {
      console.error(err);

      alert("Failed to update address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* ═══════════════════════════════════════════*

*&#xA0;         PERSONAL DETAILS CARD*

*&#xA0;     ═══════════════════════════════════════════ */}

      <div className="border border-black/10 rounded-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight">
            Personal Details
          </h2>

          {!editingInfo ? (
            <button
              type="button"
              onClick={startEditInfo}
              className="flex items-center gap-2 text-black/60 hover:text-black font-body text-sm transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />

              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEditInfo}
                disabled={savingInfo}
                className="w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {!editingInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-body text-sm text-black/60 mb-1">Full Name</p>

              <p className="font-body font-medium text-black">
                {user?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-body text-sm text-black/60 mb-1">
                Email Address
              </p>

              <p className="font-body font-medium text-black">
                {user?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-body text-sm text-black/60 mb-1">
                Phone Number
              </p>

              <p className="font-body font-medium text-black">
                {user?.phone || "Not set"}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={saveInfo} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) =>
                    setInfoForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  Email Address *
                </label>

                <input
                  type="email"
                  value={infoForm.email}
                  onChange={(e) =>
                    setInfoForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={infoForm.phone}
                  onChange={(e) =>
                    setInfoForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+1 234 567 8900"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={savingInfo}
                className="flex-1 h-11 flex items-center justify-center gap-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Check className="w-4 h-4" />

                {savingInfo ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={cancelEditInfo}
                disabled={savingInfo}
                className="flex-1 sm:flex-none h-11 px-8 border border-black/10 font-body text-sm font-medium rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ═══════════════════════════════════════════*

*&#xA0;         SHIPPING ADDRESS CARD*

*&#xA0;     ═══════════════════════════════════════════ */}

      <div className="border border-black/10 rounded-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tight">
            Shipping Address
          </h2>

          {!editingAddress ? (
            <button
              type="button"
              onClick={startEditAddress}
              className="flex items-center gap-2 text-black/60 hover:text-black font-body text-sm transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />

              <span className="hidden sm:inline">
                {defaultAddress ? "Edit" : "Add"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelEditAddress}
              disabled={savingAddress}
              className="w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!editingAddress ? (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-black" />
            </div>

            <div>
              <p className="font-heading font-bold text-base mb-1">
                Default Address
              </p>

              <p className="font-body text-sm text-black/60 leading-relaxed max-w-md">
                {formattedAddress}
              </p>

              {!defaultAddress && (
                <button
                  type="button"
                  onClick={startEditAddress}
                  className="mt-3 flex items-center gap-2 font-body text-sm font-medium text-black hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add a shipping address
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={saveAddress} className="space-y-4">
            <div>
              <label className="font-body text-sm text-black/60 mb-1.5 block">
                Street Address *
              </label>

              <input
                type="text"
                value={addressForm.street}
                onChange={(e) =>
                  setAddressForm((p) => ({ ...p, street: e.target.value }))
                }
                placeholder="123 Fashion Ave, Suite 45"
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  City *
                </label>

                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="New York"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  State / Province
                </label>

                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, state: e.target.value }))
                  }
                  placeholder="NY"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  ZIP / Postal Code
                </label>

                <input
                  type="text"
                  value={addressForm.zipCode}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, zipCode: e.target.value }))
                  }
                  placeholder="10001"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="font-body text-sm text-black/60 mb-1.5 block">
                  Country
                </label>

                <input
                  type="text"
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm((p) => ({ ...p, country: e.target.value }))
                  }
                  placeholder="United States"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={savingAddress}
                className="flex-1 h-11 flex items-center justify-center gap-2 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Check className="w-4 h-4" />

                {savingAddress ? "Saving..." : "Save Address"}
              </button>

              <button
                type="button"
                onClick={cancelEditAddress}
                disabled={savingAddress}
                className="flex-1 sm:flex-none h-11 px-8 border border-black/10 font-body text-sm font-medium rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
