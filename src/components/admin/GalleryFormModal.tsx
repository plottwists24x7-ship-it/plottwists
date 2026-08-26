"use client";

import React, { useState, useEffect } from "react";
import { GalleryImage, GalleryCategory } from "@/types/admin";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { X, Save, Loader2 } from "lucide-react";

interface GalleryFormModalProps {
  isOpen: boolean;
  initialData?: GalleryImage | null;
  onSave: (data: {
    title: string;
    image: string;
    alt?: string;
    category: GalleryCategory;
    caption?: string;
  }) => Promise<boolean>;
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

export function GalleryFormModal({
  isOpen,
  initialData,
  onSave,
  onClose,
}: GalleryFormModalProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("Kitchen & Oven");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setImage(initialData.image || "");
      setAlt(initialData.alt || initialData.title || "");
      setCategory(initialData.category || "Kitchen & Oven");
      setCaption(initialData.caption || "");
    } else {
      setTitle("");
      setImage("");
      setAlt("");
      setCategory("Kitchen & Oven");
      setCaption("");
    }
    setErrors({});
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Photo title is required";
    if (!image.trim()) errs.image = "Gallery image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const saved = await onSave({
        title: title.trim(),
        image,
        alt: alt.trim() || title.trim(),
        category,
        caption: caption.trim() || undefined,
      });

      if (saved) {
        onClose();
      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to save gallery photo:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3E2A24]/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[12px_12px_0_#3E2A24] my-8 p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-[#FFFDF8]/85 backdrop-blur-[2px] z-50 rounded-3xl flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
            <div className="w-10 h-10 border-[3.5px] border-[#3E2A24] border-t-[#FF4FA3] rounded-full animate-spin shadow-sm" />
            <div className="text-center">
              <p className="font-bricolage font-extrabold text-sm sm:text-base text-[#3E2A24]">
                Saving your changes...
              </p>
              <p className="font-kalam text-xs text-[#5F4A3A] mt-0.5">
                Please wait...
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-[3px] border-[#3E2A24]/20 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📸</span>
            <h2 className="font-bowlby text-xl text-[#3E2A24]">
              {initialData ? "Edit Photo" : "Add Gallery Image"}
            </h2>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Area */}
          <div>
            <ImageUploadDropzone
              value={image}
              disabled={isSubmitting}
              onChange={(val) => {
                setImage(val);
                if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
              }}
              label="Bakery Photo"
              required
            />
            {errors.image && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.image}
              </p>
            )}
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                Photo Title <span className="text-[#FF4FA3]">*</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g. Saturday Stacks"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.title && (
                <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                  ⚠️ {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                Category
              </label>
              <select
                disabled={isSubmitting}
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Alt Text (SEO & Accessibility)
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Fluffy pancake stack with maple syrup"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 transition-all placeholder:text-[#5F4A3A]/40 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Caption / Story */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Caption / Story (Optional)
            </label>
            <textarea
              rows={2}
              disabled={isSubmitting}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a sweet behind-the-scenes bakery note..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 transition-all resize-none placeholder:text-[#5F4A3A]/40 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Bottom Actions Bar */}
          <div className="pt-4 border-t-[3px] border-[#3E2A24]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-xs border-[2.5px] border-[#3E2A24] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px] justify-center px-6 py-2.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-xs border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[4px_4px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#3E2A24] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? "Save Changes" : "Add to Gallery"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
