"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/types/admin";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { X, Save, Star } from "lucide-react";

interface ReviewFormModalProps {
  isOpen: boolean;
  initialData?: Review | null;
  onSave: (review: Omit<Review, "id" | "date">) => void;
  onClose: () => void;
}

export function ReviewFormModal({
  isOpen,
  initialData,
  onSave,
  onClose,
}: ReviewFormModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerImage, setCustomerImage] = useState("/placeholder-user.jpg");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [verified, setVerified] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName || initialData.name || "");
      setCustomerImage(initialData.customerImage || initialData.portrait || "/placeholder-user.jpg");
      setReview(initialData.review || "");
      setRating(initialData.rating || 5);
      setVerified(initialData.verified ?? true);
    } else {
      setCustomerName("");
      setCustomerImage("/placeholder-user.jpg");
      setReview("");
      setRating(5);
      setVerified(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = "Customer name is required";
    if (!review.trim()) errs.review = "Review text is required";
    if (!customerImage.trim()) errs.customerImage = "Customer photo is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      customerName: customerName.trim(),
      customerImage,
      review: review.trim(),
      rating,
      verified,
    });

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
      <div className="relative w-full max-w-xl bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[12px_12px_0_#3E2A24] my-8 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-[3px] border-[#3E2A24]/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE26E] border-[2.5px] border-[#3E2A24] flex items-center justify-center text-xl shadow-[2px_2px_0_#3E2A24]">
              ⭐
            </div>
            <div>
              <h2 className="font-bowlby text-xl sm:text-2xl text-[#3E2A24]">
                {initialData ? "Edit Review" : "Add Customer Review"}
              </h2>
              <p className="font-kalam text-xs text-[#5F4A3A]">
                Publish genuine guest feedback and ratings
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Avatar Upload */}
          <div>
            <ImageUploadDropzone
              value={customerImage}
              onChange={(val) => {
                setCustomerImage(val);
                if (errors.customerImage) setErrors((prev) => ({ ...prev, customerImage: "" }));
              }}
              label="Customer Avatar Photo"
              required
            />
            {errors.customerImage && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.customerImage}
              </p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Customer Name <span className="text-[#FF4FA3]">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: "" }));
              }}
              placeholder="e.g. Marcus Vance"
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30"
            />
            {errors.customerName && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.customerName}
              </p>
            )}
          </div>

          {/* Rating Stars Selector */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-2">
              Star Rating <span className="text-[#FF4FA3]">*</span>
            </label>
            <div className="flex items-center gap-2 p-3 bg-[#FFECC8]/40 rounded-2xl border-[2.5px] border-[#3E2A24]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-[#FFE26E] fill-[#FFE26E] stroke-[#3E2A24] stroke-[1.5]"
                        : "text-[#3E2A24]/20 fill-transparent"
                    }`}
                  />
                </button>
              ))}
              <span className="font-bowlby text-base text-[#3E2A24] ml-2">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Review Quote <span className="text-[#FF4FA3]">*</span>
            </label>
            <textarea
              rows={4}
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                if (errors.review) setErrors((prev) => ({ ...prev, review: "" }));
              }}
              placeholder="What did the customer say about the bakery, flavor, and experience?..."
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-kalam text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 resize-none"
            />
            {errors.review && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.review}
              </p>
            )}
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-[#3E2A24] text-[#FF4FA3] focus:ring-0 cursor-pointer accent-[#FF4FA3]"
              />
              <span className="font-bricolage font-bold text-xs text-[#3E2A24]">
                Verified Bakery Guest Review
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-[3px] border-[#3E2A24]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-sm border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#3E2A24] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? "Save Review" : "Publish Review"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
