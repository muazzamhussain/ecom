import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  Bell,
  ShieldCheck,
  Check,
  Loader2,
  AlertTriangle,
  X,
  Save,
  RotateCcw,
} from "lucide-react";

import API from "../lib/api";
import { useAuth } from "../context/authContext";
import GeneralSection from "./GeneralSection";
import NotificationSection from "./NotificationSection";
import SecuritySection from "./SecuritySection";

// --------------------------------------------------
// DEFAULT PREFERENCES
// Keys must match the Mongoose schema and the section components.
// --------------------------------------------------

const DEFAULTS = {
  general: {
    language: "English",
    currency: "USD",
    timezone: "Asia/Karachi",
  },

  notifications: {
    orderUpdates: true,
    orderSms: false,
    priceDrops: true,
    restock: true,
    promotions: false,
    newsletter: false,
  },

  security: {
    twoFactor: false,
    loginAlerts: true,
  },
};

const TABS = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const inputClass =
  "w-full h-11 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all disabled:opacity-50";

// --------------------------------------------------
// NORMALIZE API DATA
// --------------------------------------------------

const normalizePreferences = (preferences = {}) => ({
  general: { ...DEFAULTS.general, ...(preferences.general || {}) },
  notifications: {
    ...DEFAULTS.notifications,
    ...(preferences.notifications || {}),
  },
  security: { ...DEFAULTS.security, ...(preferences.security || {}) },
});

// --------------------------------------------------
// MAIN SETTINGS PAGE
// --------------------------------------------------

export default function SettingsTab() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Preferences
  const [saved, setSaved] = useState(DEFAULTS);
  const [draft, setDraft] = useState(DEFAULTS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState("general");

  // Sessions (populate from backend when available)
  const [sessions, setSessions] = useState([]);

  // Password
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Feedback
  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

  // --------------------------------------------------
  // FETCH PREFERENCES
  // --------------------------------------------------

  const fetchPreferences = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const { data } = await API.get("/preferences");
      const normalized = normalizePreferences(data.preferences);

      setSaved(normalized);
      setDraft(normalized);
    } catch (error) {
      console.error("Fetch preferences error:", error);
      setLoadError(
        error.response?.data?.message || "Unable to load your preferences.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  const showToast = (message, isError = false) => {
    setToast(message);
    setToastError(isError);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // --------------------------------------------------
  // LOCAL DRAFT UPDATES
  // --------------------------------------------------

  const updatePreference = (section, key, value) => {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const setAllNotifications = (value) => {
    setDraft((prev) => ({
      ...prev,
      notifications: Object.fromEntries(
        Object.keys(prev.notifications).map((key) => [key, value]),
      ),
    }));
  };

  // GeneralSection calls update(null, key, value)
  const updateGeneral = (_, key, value) =>
    updatePreference("general", key, value);

  // --------------------------------------------------
  // SAVE / DISCARD
  // --------------------------------------------------

  const handleSave = async () => {
    if (!isDirty || saving) return;

    setSaving(true);

    try {
      const { data } = await API.patch("/preferences", {
        general: draft.general,
        notifications: draft.notifications,
        security: draft.security,
      });

      const normalized = normalizePreferences(data.preferences);

      setSaved(normalized);
      setDraft(normalized);

      showToast(data.message || "Preferences saved successfully.");
    } catch (error) {
      console.error("Save preferences error:", error);
      showToast(
        error.response?.data?.message || "Failed to save preferences.",
        true,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(normalizePreferences(saved));
  };

  // --------------------------------------------------
  // PASSWORD
  // --------------------------------------------------

  const savePassword = async (e) => {
    e.preventDefault();
    if (savingPassword) return;
    setPasswordError("");

    const { current, next, confirm } = passwordForm;

    if (!current || !next || !confirm)
      return setPasswordError("Please fill in all password fields.");
    if (next.length < 8)
      return setPasswordError("New password must be at least 8 characters.");
    if (next !== confirm)
      return setPasswordError("New passwords do not match.");
    if (current === next)
      return setPasswordError(
        "New password must differ from your current one.",
      );

    setSavingPassword(true);

    try {
      await API.put("/auth/profile", {
        currentPassword: current,
        password: next,
      });

      showToast("Password updated successfully.");
      setPasswordForm({ current: "", next: "", confirm: "" });
      setEditingPassword(false);
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordError(
        error.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  // --------------------------------------------------
  // SESSIONS
  // Endpoint is a placeholder; adjust to your backend.
  // --------------------------------------------------

  const handleRevokeSession = async (id) => {
    try {
      await API.delete(`/auth/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast("Signed out of that device.");
    } catch (error) {
      console.error("Revoke session error:", error);
      showToast(
        error.response?.data?.message || "Failed to sign out device.",
        true,
      );
    }
  };

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------

  const handleDeleteAccount = async () => {
    if (deleteText !== "DELETE" || deleting) return;

    setDeleting(true);

    try {
      await API.delete(`/auth/${user?._id}`);
      await logout();

      setDeleteOpen(false);
      setDeleteText("");
      navigate("/sign-up", { replace: true });
    } catch (error) {
      console.error("Delete account error:", error);
      showToast(
        error.response?.data?.message || "Failed to delete account.",
        true,
      );
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setDeleteText("");
  };

  // --------------------------------------------------
  // KEYBOARD TAB NAVIGATION
  // --------------------------------------------------

  const handleTabKey = (e) => {
    const index = TABS.findIndex((tab) => tab.id === activeTab);

    if (e.key === "ArrowRight") {
      setActiveTab(TABS[(index + 1) % TABS.length].id);
    }

    if (e.key === "ArrowLeft") {
      setActiveTab(TABS[(index - 1 + TABS.length) % TABS.length].id);
    }
  };

  // --------------------------------------------------
  // LOADING / ERROR STATES
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="border border-black/10 rounded-2xl p-8 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-3" />

        <p className="font-body text-sm mb-4">{loadError}</p>

        <button
          type="button"
          onClick={fetchPreferences}
          className="px-6 py-2.5 rounded-full bg-black text-white text-sm cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="relative space-y-6 animate-in fade-in duration-300">
      {/* PAGE HEADER */}

      <div>
        <h2 className="font-heading font-semibold text-xl sm:text-2xl uppercase tracking-wide text-black">
          Settings
        </h2>

        <p className="font-body text-sm text-black/60 mt-1">
          Manage your preferences, notifications and account security.
        </p>
      </div>

      {/* TAB BAR */}

      <div
        role="tablist"
        aria-label="Settings sections"
        onKeyDown={handleTabKey}
        className="flex gap-1 p-1 bg-[#F0F0F0] rounded-full overflow-x-auto no-scrollbar"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-fit flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-black text-white"
                  : "text-black/60 hover:text-black"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SETTINGS PANEL */}

      <div
        role="tabpanel"
        className="border border-black/10 rounded-2xl p-5 sm:p-8"
      >
        {activeTab === "general" && (
          <GeneralSection draft={draft.general} update={updateGeneral} />
        )}

        {activeTab === "notifications" && (
          <NotificationSection
            draft={draft}
            update={updatePreference}
            setAllNotifications={setAllNotifications}
          />
        )}

        {activeTab === "security" && (
          <SecuritySection
            draft={draft}
            update={updatePreference}
            sessions={sessions}
            onRevoke={handleRevokeSession}
            onDeleteRequest={() => setDeleteOpen(true)}
            editingPassword={editingPassword}
            setEditingPassword={setEditingPassword}
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            savingPassword={savingPassword}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            savePassword={savePassword}
          />
        )}
      </div>

      {/* SAVE / DISCARD BAR */}

      <div className="flex flex-wrap items-center justify-between gap-3 border border-black/10 rounded-2xl p-4">
        <p className="font-body text-xs text-black/50">
          {isDirty
            ? "You have unsaved preference changes."
            : "Your preferences are up to date."}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || saving}
            className="h-10 px-5 rounded-full border border-black/10 font-body text-sm flex items-center gap-2 hover:bg-[#F0F0F0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="h-10 px-5 rounded-full bg-black text-white font-body text-sm flex items-center gap-2 hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* DELETE ACCOUNT MODAL */}

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>

            <h3 className="font-heading font-bold text-2xl uppercase mb-2">
              Delete Account
            </h3>

            <p className="font-body text-sm text-black/60 leading-relaxed mb-5">
              This action permanently removes your account and associated data.
              Type <strong>DELETE</strong> to confirm.
            </p>

            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type DELETE"
              className={inputClass}
            />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={deleting}
                onClick={closeDeleteModal}
                className="flex-1 h-11 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteText !== "DELETE" || deleting}
                className="flex-1 h-11 rounded-full bg-red-600 text-white font-body text-sm font-medium hover:bg-red-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-60 flex items-center gap-2 px-5 py-3 rounded-full text-white font-body text-sm shadow-lg ${
            toastError ? "bg-red-600" : "bg-black"
          }`}
        >
          {toastError ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {toast}
        </div>
      )}
    </div>
  );
}
