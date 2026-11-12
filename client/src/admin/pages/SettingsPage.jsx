import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../lib/api";

const inputClass =
  "w-full h-12 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";

const TOGGLES = [
  [
    "emailNotifications",
    "Email Notifications",
    "Receive updates about new orders",
  ],
  ["darkMode", "Dark Mode", "Enable dark theme (coming soon)"],
];

const EMPTY = {
  storeName: "",
  adminEmail: "",
  emailNotifications: true,
  darkMode: false,
};

const pickSettings = (settings = {}) => ({
  storeName: settings.storeName ?? "",
  adminEmail: settings.adminEmail ?? "",
  emailNotifications: Boolean(settings.emailNotifications),
  darkMode: Boolean(settings.darkMode),
});

const SettingsPage = () => {
  const [saved, setSaved] = useState(EMPTY);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved],
  );

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const { data } = await API.get("/settings");
      const settings = pickSettings(data.settings);

      setSaved(settings);
      setForm(settings);
    } catch (error) {
      console.error("Fetch settings error:", error);
      setLoadError(
        error.response?.data?.message || "Unable to load your settings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isDirty || saving) return;

    setSaving(true);

    try {
      const { data } = await API.put("/settings", form);
      const settings = pickSettings(data.settings);

      setSaved(settings);
      setForm(settings);
      toast.success(data.message || "Settings saved successfully");
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl border border-black/10 rounded-2xl p-8 text-center bg-white">
        <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-3" />
        <p className="font-body text-sm mb-4">{loadError}</p>
        <button
          type="button"
          onClick={fetchSettings}
          className="px-6 py-2.5 rounded-full bg-black text-white text-sm cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl uppercase font-black tracking-tight text-black">
          Settings
        </h1>
        <p className="font-body text-sm text-black/60 mt-1">
          Manage your store preferences
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div>
          <label
            htmlFor="storeName"
            className="font-body text-sm font-medium text-black mb-2 block"
          >
            Store Name
          </label>
          <input
            id="storeName"
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            maxLength={60}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="adminEmail"
            className="font-body text-sm font-medium text-black mb-2 block"
          >
            Admin Email
          </label>
          <input
            id="adminEmail"
            type="email"
            name="adminEmail"
            value={form.adminEmail}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {TOGGLES.map(([key, title, desc]) => (
          <label
            key={key}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9F9] cursor-pointer"
          >
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="h-12 px-8 bg-black text-white font-body font-medium text-sm rounded-full hover:bg-black/80 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
