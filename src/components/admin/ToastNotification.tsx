"use client";

import React from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-[2.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] transition-all duration-300 animate-in slide-in-from-top-3 fade-in ${
            toast.type === "error"
              ? "bg-[#FFEAEA] text-[#7F1D1D]"
              : toast.type === "info"
              ? "bg-[#EAF2FF] text-[#1E3A8A]"
              : "bg-[#E8F8F0] text-[#14532D]"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === "error" ? (
              <div className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0 border border-[#3E2A24] shadow-xs">
                <AlertCircle className="w-4 h-4" />
              </div>
            ) : toast.type === "info" ? (
              <div className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shrink-0 border border-[#3E2A24] shadow-xs">
                <Info className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 border border-[#3E2A24] shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            <p className="font-bricolage font-bold text-xs sm:text-sm leading-tight text-[#2B1824] truncate">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-[#5F4A3A] hover:text-[#2B1824] p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
