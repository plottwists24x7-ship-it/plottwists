"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { GalleryCategory } from "@/types/admin";
import { X, UploadCloud, Plus, Trash2, Check } from "lucide-react";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onUpload: (images: Array<{ title: string; image: string; category: GalleryCategory; caption?: string }>) => void;
  onClose: () => void;
}

const CATEGORIES: GalleryCategory[] = [
  "Kitchen & Oven",
  "Display & Store",
  "Packaging",
  "Decorating",
  "Ingredients",
  "Events",
];

interface UploadItem {
  id: string;
  image: string;
  title: string;
  category: GalleryCategory;
  caption: string;
}

export function GalleryUploadModal({
  isOpen,
  onUpload,
  onClose,
}: GalleryUploadModalProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<GalleryCategory>("Kitchen & Oven");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          const formattedTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1);

          setItems((prev) => [
            ...prev,
            {
              id: `upload-${Date.now()}-${Math.random()}`,
              image: e.target?.result as string,
              title: formattedTitle,
              category: defaultCategory,
              caption: "",
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    onUpload(
      items.map((it) => ({
        title: it.title.trim() || "Bakery Moment",
        image: it.image,
        category: it.category,
        caption: it.caption.trim() || undefined,
      }))
    );

    setItems([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3E2A24]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[12px_12px_0_#3E2A24] my-8 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-[3px] border-[#3E2A24]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4FA3] border-[2.5px] border-[#3E2A24] flex items-center justify-center text-xl shadow-[2px_2px_0_#3E2A24]">
              🖼️
            </div>
            <div>
              <h2 className="font-bowlby text-xl sm:text-2xl text-[#3E2A24]">
                Upload Gallery Photos
              </h2>
              <p className="font-kalam text-xs text-[#5F4A3A]">
                Add multiple bakery kitchen & showcase snapshots
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Dropzone for Multi-Files */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-36 rounded-2xl border-[3px] border-dashed border-[#3E2A24] bg-[#FFECC8]/40 hover:bg-[#FFECC8]/80 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:scale-[1.005]"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] mb-2 shadow-[2px_2px_0_#3E2A24]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-bricolage font-bold text-sm text-[#3E2A24]">
              Select multiple photos from your device
            </p>
            <p className="font-kalam text-xs text-[#5F4A3A] mt-0.5">
              Supports PNG, JPG, WEBP. Select multiple files at once!
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />

          {/* Staged Upload Items List */}
          {items.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24]">
                  Photos Ready to Publish ({items.length})
                </span>
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="text-xs font-bricolage font-bold text-[#FF4FA3] hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FFF9F5] rounded-2xl border-[2.5px] border-[#3E2A24] flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl border-2 border-[#3E2A24] overflow-hidden bg-white shrink-0">
                      <Image
                        src={item.image}
                        alt="Staged"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                        placeholder="Photo Title"
                        className="px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24]"
                      />

                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, { category: e.target.value as GalleryCategory })}
                        className="px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => handleUpdateItem(item.id, { caption: e.target.value })}
                        placeholder="Short caption / story (optional)"
                        className="sm:col-span-2 px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-kalam text-xs text-[#5F4A3A]"
                      />
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-8 h-8 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors shrink-0 cursor-pointer self-end sm:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t-[3px] border-[#3E2A24]/20 shrink-0">
          <p className="font-kalam text-xs text-[#5F4A3A]">
            {items.length === 0 ? "Select photos above to begin" : `${items.length} photo(s) queued`}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-sm border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={items.length === 0}
              className="px-6 py-2.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] disabled:opacity-50 disabled:pointer-events-none text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] flex items-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
            >
              <Check className="w-4 h-4" />
              <span>Publish ({items.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
