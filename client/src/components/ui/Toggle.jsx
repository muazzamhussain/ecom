const Toggle = ({ checked, onChange, label, description, icon: Icon }) => (
  <div className="flex items-center justify-between gap-4 py-4 border-b border-black/5 last:border-0">
    <div className="flex items-start gap-3 min-w-0">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-black" />
        </div>
      )}

      <div className="min-w-0">
        <p className="font-body font-medium text-sm text-black">{label}</p>

        {description && (
          <p className="font-body text-xs text-black/60 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
        checked ? "bg-black" : "bg-black/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

export default Toggle;
