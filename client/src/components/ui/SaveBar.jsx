import { Loader2,Check } from "lucide-react";

const SaveBar = ({ dirty, saving, onSave, onDiscard }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 mt-8 border-t border-black/10">
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${dirty ? "bg-[#FFC633]" : "bg-[#01AB31]"}`}
      />

      <p className="font-body text-sm text-black/60">
        {dirty ? "You have unsaved changes" : "All changes saved"}
      </p>
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        onClick={onDiscard}
        disabled={!dirty || saving}
        className="h-11 px-6 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Discard
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="h-11 px-6 flex items-center justify-center gap-2 rounded-full bg-black text-white font-body text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}

        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
);

export default SaveBar;
