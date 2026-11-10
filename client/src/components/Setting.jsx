import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";
import { useAuth } from "../context/authContext";

import {
  SlidersHorizontal,
  Bell,
  ShieldCheck,
  MessageSquare,
  Mail,
  TrendingDown,
  Package,
  Tag,
  Newspaper,
  Smartphone,
  Monitor,
  Check,
  Loader2,
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";
import GeneralSection from "./GeneralSection";
import NotificationsSection from "./NotificationSection";
import SecuritySection from "./SecuritySection";
import SaveBar from "./ui/SaveBar";

// ─────────────────────────────────────────────

// CONSTANTS

// ─────────────────────────────────────────────

const STORAGE_KEY = "shopco-settings";

const DEFAULTS = {
  language: "English",

  currency: "USD",

  timezone: "America/New_York",

  notifications: {
    orderUpdates: true,

    orderSms: false,

    priceDrops: true,

    restock: true,

    promotions: true,

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
  "w-full h-11 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";

// Load persisted settings, merged with defaults

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return DEFAULTS;

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULTS,

      ...parsed,

      notifications: { ...DEFAULTS.notifications, ...parsed.notifications },

      security: { ...DEFAULTS.security, ...parsed.security },
    };
  } catch {
    return DEFAULTS;
  }
};

// MAIN SETTINGS TAB


export default function SettingsTab() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [activeTab, setActiveTab] = useState("general");

  const [saved, setSaved] = useState(loadSettings); // committed settings

  const [draft, setDraft] = useState(saved); // editable copy

  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteText, setDeleteText] = useState("");

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const savePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const { data } = await API.post("/auth/change-password", {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });
      setPasswordForm({ current: "", next: "", confirm: "" });
      setEditingPassword(false);
      setToast(data.message || "Password updated successfully.");
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordError(
        error.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  // Auto-hide toast

  useEffect(() => {
    if (!toast) return;

    const t = setTimeout(() => setToast(""), 2500);

    return () => clearTimeout(t);
  }, [toast]);

  // Warn before leaving with unsaved changes

  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();

        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Generic updater: top-level key (section = null) or nested section key

  const update = (section, key, value) => {
    setDraft((prev) =>
      section
        ? { ...prev, [section]: { ...prev[section], [key]: value } }
        : { ...prev, [key]: value },
    );
  };

  const setAllNotifications = (value) => {
    setDraft((prev) => ({
      ...prev,

      notifications: Object.fromEntries(
        Object.keys(prev.notifications).map((k) => [k, value]),
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaved(draft);
      setToast("Preferences saved on this device.");
    } catch (error) {
      console.error("Could not persist settings:", error);
      setToast("Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setDraft(saved);

  const handleDeleteAccount = async () => {
    if (deleteText !== "DELETE") return;

    try {
      await API.delete("/auth/account");
      await logout();
      setDeleteOpen(false);
      setDeleteText("");
      navigate("/sign-up", { replace: true });
    } catch (error) {
      console.error("Delete account error:", error);
      setToast(error.response?.data?.message || "Failed to delete account.");
    }
  };

  // Keyboard navigation for tabs (← →)

  const handleTabKey = (e) => {
    const idx = TABS.findIndex((t) => t.id === activeTab);

    if (e.key === "ArrowRight") setActiveTab(TABS[(idx + 1) % TABS.length].id);

    if (e.key === "ArrowLeft")
      setActiveTab(TABS[(idx - 1 + TABS.length) % TABS.length].id);
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-300">
      {/* Page header */}

      <div>
        <h2 className="font-body font-bold text-xl sm:text-2xl uppercase tracking-tight text-black">
          Settings
        </h2>

        <p className="font-body text-sm text-black/60 mt-1">
          Manage your preferences, notifications and account security.
        </p>
      </div>

      {/* Tab bar */}

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
              className={`flex-1 min-w-fit flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${isActive
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

      {/* Panel */}

      <div
        role="tabpanel"
        className="border border-black/10 rounded-2xl p-5 sm:p-8"
      >
        {activeTab === "general" && (
          <GeneralSection draft={draft} update={update} />
        )}

        {activeTab === "notifications" && (
          <NotificationsSection
            draft={draft}
            update={update}
            setAllNotifications={setAllNotifications}
          />
        )}

        {activeTab === "security" && (
          <SecuritySection
            draft={draft}
            update={update}
            sessions={[]}
            onRevoke={() => { }}
            onDeleteRequest={() => setDeleteOpen(true)}
            editingPassword={editingPassword}
            setEditingPassword={setEditingPassword}
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            savingPassword={savingPassword}
            passwordError={passwordError}
            savePassword={savePassword}
          />
        )}

        <SaveBar
          dirty={isDirty}
          saving={saving}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div>

      {/* Delete account modal */}

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => {
                setDeleteOpen(false);

                setDeleteText("");
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#FF3333]/10 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-[#FF3333]" />
            </div>

            <h3 className="font-body font-bold text-2xl uppercase tracking-tight mb-2">
              Delete Account
            </h3>

            <p className="font-body text-sm text-black/60 leading-relaxed mb-5">
              This permanently removes your account, orders and saved items.
              Type <span className="font-bold text-black">DELETE</span> to
              confirm.
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
                onClick={() => {
                  setDeleteOpen(false);

                  setDeleteText("");
                }}
                className="flex-1 h-11 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteText !== "DELETE"}
                className="flex-1 h-11 rounded-full bg-[#FF3333] text-white font-body text-sm font-medium hover:bg-[#FF3333]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white font-body text-sm shadow-lg animate-in fade-in">
          <Check className="w-4 h-4" />

          {toast}
        </div>
      )}
    </div>
  );
}
