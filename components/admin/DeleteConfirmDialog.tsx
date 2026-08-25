"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3E2A24]/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[10px_10px_0_#3E2A24] p-6 z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFECC8] border-[3px] border-[#3E2A24] flex items-center justify-center text-[#FF4FA3] shrink-0 shadow-[2px_2px_0_#3E2A24]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bowlby text-xl text-[#3E2A24]">
              {title}
            </h3>
            <p className="font-kalam text-xs text-[#5F4A3A]">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="font-bricolage text-sm text-[#5F4A3A] mb-4">
          {message}
        </p>

        {itemName && (
          <div className="p-3 bg-[#FFECC8]/50 rounded-2xl border-2 border-[#3E2A24]/30 font-bricolage font-bold text-sm text-[#3E2A24] mb-6 flex items-center gap-2">
            <span>🧁</span>
            <span className="truncate">{itemName}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-sm border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#ff3091] text-white font-bricolage font-bold text-sm border-[2.5px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] flex items-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
