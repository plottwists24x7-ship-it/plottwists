"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/types/admin";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { X, Save, Star, Loader2 } from "lucide-react";

interface ReviewFormModalProps {
  isOpen: boolean;
  initialData?: Review | null;
  onSave: (review: Omit<Review, "id" | "date">) => Promise<boolean> | void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await onSave({
        customerName: customerName.trim(),
        customerImage,
        review: review.trim(),
        rating,
        verified,
      });

      if (res !== false) {
        onClose();
      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to save review:", err);
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
      <div className="relative w-full max-w-xl bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[12px_12px_0_#3E2A24] my-8 p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-150 overflow-hidden">
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
            disabled={isSubmitting}
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              onChange={(val) => {
                setCustomerImage(val);
                if (errors.customerImage) setErrors((prev) => ({ ...prev, customerImage: "" }));
              }}
              label="Customer Portrait / Avatar"
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
              disabled={isSubmitting}
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: "" }));
              }}
              placeholder="e.g. Maya Lin"
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.customerName && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.customerName}
              </p>
            )}
          </div>

          {/* Star Rating Selection */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Star Rating <span className="text-[#FF4FA3]">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-xl border-2 border-[#3E2A24] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
                    rating >= star ? "bg-[#FFE26E] text-[#3E2A24] shadow-[2px_2px_0_#3E2A24]" : "bg-[#FFF6E8] text-gray-300"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <Star className={`w-5 h-5 ${rating >= star ? "fill-[#3E2A24]" : "fill-gray-200"}`} />
                </button>
              ))}
              <span className="font-bricolage font-bold text-sm text-[#3E2A24] ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
              Customer Testimonial <span className="text-[#FF4FA3]">*</span>
            </label>
            <textarea
              rows={3}
              disabled={isSubmitting}
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                if (errors.review) setErrors((prev) => ({ ...prev, review: "" }));
              }}
              placeholder="What did they love most about their bakery box or experience?..."
              className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-kalam text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.review && (
              <p className="font-bricolage text-xs font-bold text-[#FF4FA3] mt-1">
                ⚠️ {errors.review}
              </p>
            )}
          </div>

          {/* Verified Buyer Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isSubmitting}
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-[#3E2A24] text-[#FF4FA3] focus:ring-0 cursor-pointer accent-[#FF4FA3] disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="font-bricolage font-bold text-xs text-[#3E2A24]">
                Verified Customer (Displays badge on storefront)
              </span>
            </label>
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
              className="min-w-[165px] justify-center px-6 py-3 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#3E2A24] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#3E2A24] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialData ? "Save Changes" : "Post Review"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
