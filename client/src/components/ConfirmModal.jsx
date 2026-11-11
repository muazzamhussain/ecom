import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmText = "Delete" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F0F0F0] hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-full bg-[#FF3333]/10 flex items-center justify-center mb-5">
          <AlertTriangle className="w-7 h-7 text-[#FF3333]" />
        </div>

        <h3 className="font-heading font-bold text-2xl uppercase tracking-tight mb-2">{title}</h3>
        <p className="font-body text-sm text-black/60 leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-full border border-black/10 font-body text-sm font-medium hover:bg-[#F0F0F0] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-full bg-[#FF3333] text-white font-body text-sm font-medium hover:bg-[#FF3333]/90 transition-colors cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;