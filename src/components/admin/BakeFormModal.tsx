"use client";

import React, { useState, useEffect } from "react";
import { Bake, BakeCategory } from "@/types/admin";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { X, Save, Sparkles, Loader2 } from "lucide-react";

interface BakeFormModalProps {
  isOpen: boolean;
  initialData?: Bake | null;
  onSave: (bake: Omit<Bake, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  onClose: () => void;
}

const CATEGORIES: BakeCategory[] = [
  "Cheesecakes",
  "Brownies",
  "Cookies",
  "Cakes",
  "Tiramisu",
  "Pastries",
  "Seasonal",
];

const PRESET_BADGES = [
  "Bestseller",
  "Fan Favorite",
  "Chef Choice",
  "Special Edition",
  "Daily Fresh",
  "Decadent",
  "Gluten Free Option",
];

export function BakeFormModal({
  isOpen,
  initialData,
  onSave,
  onClose,
}: BakeFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<BakeCategory>("Cheesecakes");
  const [image, setImage] = useState("");
  const [badge, setBadge] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setCategory(initialData.category || "Cheesecakes");
      setImage(initialData.imagePath || initialData.image || "");
      setBadge(initialData.badge || "");
      setIsPopular(initialData.isPopular || false);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Cheesecakes");
      setImage("");
      setBadge("");
      setIsPopular(false);
    }
    setErrors({});
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Bake name is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!image.trim()) errs.image = "Product image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const saved = await onSave({
        name: name.trim(),
        description: description.trim(),
        price: price.trim() || undefined,
        category,
        image,
        badge: badge.trim() || undefined,
        isPopular,
      });

      if (saved) {
        onClose();
      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to save bake:", err);
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

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[12px_12px_0_#3E2A24] my-8 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-150 overflow-hidden">
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

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-[3px] border-[#3E2A24]/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE26E] border-[2.5px] border-[#3E2A24] flex items-center justify-center text-xl shadow-[2px_2px_0_#3E2A24]">
              🧁
            </div>
            <div>
              <h2 className="font-bowlby text-xl sm:text-2xl text-[#3E2A24]">
                {initialData ? "Edit Bake" : "Add New Bake"}
              </h2>
              <p className="font-kalam text-xs text-[#5F4A3A]">
                Craft dessert details for your menu
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <ImageUploadDropzone
              value={image}
              disabled={isSubmitting}
              onChange={(val) => {
                setImage(val);
                if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
              }}
              label="Dessert Image"
              required
            />
            {errors.image && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.image}
              </p>
            )}
          </div>

          {/* Bake Name */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Bake Title <span className="text-[#FF4FA3]">*</span>
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Classic Basque Burnt Cheesecake"
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.name && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.name}
              </p>
            )}
          </div>

          {/* Category & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                Category <span className="text-[#FF4FA3]">*</span>
              </label>
              <select
                disabled={isSubmitting}
                value={category}
                onChange={(e) => setCategory(e.target.value as BakeCategory)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                Price <span className="text-[#5F4A3A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. $38.00 or $5.50/slice"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Description <span className="text-[#FF4FA3]">*</span>
            </label>
            <textarea
              rows={3}
              disabled={isSubmitting}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe ingredients, texture, flavor notes, and artisan techniques..."
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-kalam text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.description}
              </p>
            )}
          </div>

          {/* Badge & Popular Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                Ribbon Badge <span className="text-[#5F4A3A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, Chef Choice"
                list="preset-badges"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <datalist id="preset-badges">
                {PRESET_BADGES.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            <div className="pt-2 sm:pt-6 flex items-center gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-[#3E2A24] text-[#FF4FA3] focus:ring-0 cursor-pointer accent-[#FF4FA3] disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <span className="font-bricolage font-bold text-xs text-[#3E2A24] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
                  <span>Highlight on Hero</span>
                </span>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-[3px] border-[#3E2A24]/20">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-sm border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[165px] justify-center px-6 py-3 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#3E2A24] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#3E2A24]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#3E2A24] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? "Save Changes" : "Create Bake"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
