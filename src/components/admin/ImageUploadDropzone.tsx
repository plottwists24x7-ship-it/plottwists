"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { getProductImageUrl, uploadProductImage } from "@/lib/supabase/client";

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ImageUploadDropzone({
  value,
  onChange,
  label = "Upload Image",
  required = false,
  disabled = false,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (disabled || isUploading) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadProductImage(file);
      onChange(uploadedUrl);
    } catch (error) {
      console.error("Product image upload failed:", error);
      alert("We couldn't upload that image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (disabled || isUploading) return;
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setIsUrlMode(false);
      setCustomUrl("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24]">
          {label} {required && <span className="text-[#FF4FA3]">*</span>}
        </label>
        {!disabled && (
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="text-xs font-bricolage font-bold text-[#FF4FA3] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{isUrlMode ? "Upload File" : "Paste Image URL"}</span>
          </button>
        )}
      </div>

      {isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            disabled={disabled || isUploading}
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/dessert.jpg"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] text-sm font-bricolage text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={handleApplyUrl}
            className="px-4 py-2.5 rounded-2xl bg-[#FFE26E] text-[#3E2A24] border-[3px] border-[#3E2A24] font-bricolage font-bold text-xs shadow-[2px_2px_0_#3E2A24] cursor-pointer hover:bg-[#ffd633] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      ) : isUploading ? (
        /* Uploading State */
        <div className="h-36 rounded-2xl border-[3px] border-dashed border-[#3E2A24] bg-[#FFECC8]/40 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] mb-2 shadow-[2px_2px_0_#3E2A24] animate-spin">
            <Loader2 className="w-5 h-5 text-[#3E2A24]" />
          </div>
          <p className="font-bricolage font-bold text-xs text-[#3E2A24]">
            Uploading image...
          </p>
          <p className="font-kalam text-xs text-[#5F4A3A] mt-0.5">
            Processing and optimizing...
          </p>
        </div>
      ) : value ? (
        /* Preview Card */
        <div className="relative rounded-2xl border-[3px] border-[#3E2A24] overflow-hidden bg-[#FFECC8]/40 p-2 flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-xl border-2 border-[#3E2A24] overflow-hidden bg-white shrink-0">
            {value ? (
              <Image
                src={getProductImageUrl(value)}
                alt="Upload preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                Invalid Image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <p className="font-bricolage font-bold text-xs text-[#3E2A24]">
              Image selected
            </p>
            <p className="font-kalam text-xs text-[#5F4A3A] truncate max-w-[200px]">
              {value.startsWith("data:") ? "Custom file upload" : value}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] text-[11px] font-bricolage font-bold text-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] hover:bg-[#ffd633] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change
              </button>
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={() => onChange("")}
                className="px-3 py-1 rounded-xl bg-[#FFF6E8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] text-[11px] font-bricolage font-bold text-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone Box */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!disabled && !isUploading) fileInputRef.current?.click();
          }}
          className={`h-36 rounded-2xl border-[3px] border-dashed border-[#3E2A24] flex flex-col items-center justify-center p-4 text-center transition-all ${
            disabled || isUploading
              ? "opacity-60 cursor-not-allowed bg-[#FFFDF8]"
              : isDragging
              ? "bg-[#FFE26E]/60 scale-[1.01] cursor-pointer"
              : "bg-[#FFFDF8] hover:bg-[#FFECC8]/30 cursor-pointer"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFECC8] border-2 border-[#3E2A24] flex items-center justify-center text-[#FF4FA3] mb-2 shadow-[2px_2px_0_#3E2A24]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="font-bricolage font-bold text-xs text-[#3E2A24]">
            Click or drag & drop bakery photo
          </p>
          <p className="font-kalam text-xs text-[#5F4A3A] mt-0.5">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        disabled={disabled || isUploading}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
