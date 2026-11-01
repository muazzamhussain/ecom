import SectionHeader from "./ui/SectionHeader";
import Toggle from "./ui/Toggle";
import { Trash2, ShieldCheck, Bell } from "lucide-react";

const SecuritySection = ({
  draft,
  update,
  sessions = [],
  onRevoke,
  onDeleteRequest,
  editingPassword,
  setEditingPassword,
  passwordForm,
  setPasswordForm,
  savingPassword,
  passwordError,
  savePassword,
}) => {
  const inputClass =
    "w-full h-11 px-4 font-body text-sm text-black bg-[#F0F0F0] rounded-full border border-transparent focus:border-black focus:bg-white focus:outline-none transition-all";
  return (
    <div className="space-y-8">
      <div>
        <SectionHeader
          title="Security"
          description="Protect your account with extra verification and alerts."
        />

        {/* ── PASSWORD CHANGE (inline expand) ── */}
        <form
          onSubmit={savePassword}
          className="mt-6 pt-6 border-t border-black/10 space-y-4 animate-in fade-in"
        >
          <h3 className="font-heading font-bold text-base uppercase">
            Change Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-sm text-black/60 mb-1.5 block">
                Current Password
              </label>

              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, current: e.target.value }))
                }
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="font-body text-sm text-black/60 mb-1.5 block">
                New Password
              </label>

              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, next: e.target.value }))
                }
                className={inputClass}
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="font-body text-sm text-black/60 mb-1.5 block">
                Confirm New
              </label>

              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirm: e.target.value }))
                }
                className={inputClass}
                minLength={8}
                required
              />
            </div>
          </div>

          {passwordError && (
            <p className="font-body text-sm text-[#FF3333]">{passwordError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={savingPassword}
              className="h-11 px-6 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingPassword(false);

                setPasswordForm({ current: "", next: "", confirm: "" });

                setPasswordError("");
              }}
              className="h-11 px-6 border border-black/10 font-body text-sm font-medium rounded-full hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

        <Toggle
          icon={ShieldCheck}
          label="Two-factor authentication"
          description="Require a verification code when signing in"
          checked={draft.security.twoFactor}
          onChange={(v) => update("security", "twoFactor", v)}
        />

        <Toggle
          icon={Bell}
          label="Login alerts"
          description="Email me when a new device signs in"
          checked={draft.security.loginAlerts}
          onChange={(v) => update("security", "loginAlerts", v)}
        />
      </div>

      {/* Active sessions */}

      <div>
        <p className="font-heading font-bold text-xs uppercase tracking-wider text-black/50 mb-3">
          Active Sessions
        </p>

        {sessions.length === 0 ? (
          <p className="font-body text-sm text-black/60">
            No other active sessions.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const Icon = s.icon;

              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#F9F9F9]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-body font-medium text-sm truncate">
                        {s.device}
                      </p>

                      <p className="font-body text-xs text-black/60 truncate">
                        {s.location}
                      </p>
                    </div>
                  </div>

                  {s.current ? (
                    <span className="font-body text-xs font-medium px-3 py-1.5 rounded-full text-[#01AB31] bg-[#01AB31]/10 shrink-0">
                      This device
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRevoke(s.id)}
                      className="h-9 px-4 rounded-full border border-black/10 font-body text-xs font-medium hover:bg-black hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger zone */}

      <div className="rounded-2xl border border-[#FF3333]/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-heading font-bold text-base uppercase text-[#FF3333]">
            Delete Account
          </p>

          <p className="font-body text-sm text-black/60 mt-1">
            Permanently remove your account and all associated data.
          </p>
        </div>

        <button
          type="button"
          onClick={onDeleteRequest}
          className="h-11 px-6 flex items-center justify-center gap-2 rounded-full bg-[#FF3333] text-white font-body text-sm font-medium hover:bg-[#FF3333]/90 transition-colors cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;
