import React, { useState } from "react";
import { Check } from "lucide-react";

const SettingsPage = () => {
  const [form, setForm] = useState({
    storeName: "Ecom",
    email: "admin@Ecom",
    notifications: true,
    darkMode: false,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full h-12 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Settings
        </h1>
        <p className="font-body text-sm text-black/60 mt-1">Manage your store preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="font-body text-sm font-medium text-black mb-2 block">Store Name</label>
          <input name="storeName" value={form.storeName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-black mb-2 block">Admin Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
        </div>

        {[
          ["notifications", "Email Notifications", "Receive updates about new orders"],
          ["darkMode", "Dark Mode", "Enable dark theme (coming soon)"],
        ].map(([key, title, desc]) => (
          <label key={key} className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9F9] cursor-pointer">
            <div>
              <p className="font-body font-bold text-sm">{title}</p>
              <p className="font-body text-xs text-black/60">{desc}</p>
            </div>
            <input
              type="checkbox"
              name={key}
              checked={form[key]}
              onChange={handleChange}
              className="w-5 h-5 accent-black cursor-pointer"
            />
          </label>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="h-12 px-8 bg-black text-white font-body font-medium text-sm rounded-full hover:bg-black/80 transition-colors cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Changes
          </button>
          {saved && <span className="font-body text-sm text-[#01AB31]">✓ Saved successfully</span>}
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;