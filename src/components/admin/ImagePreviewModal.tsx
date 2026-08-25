"use client";

import React from "react";
import Image from "next/image";
import { X, Calendar, Tag } from "lucide-react";
import { GalleryImage } from "@/types/admin";

interface ImagePreviewModalProps {
  image: GalleryImage | null;
  onClose: () => void;
}

export function ImagePreviewModal({ image, onClose }: ImagePreviewModalProps) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#3E2A24]/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Lightbox Modal */}
      <div className="relative w-full max-w-4xl bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[16px_16px_0_#3E2A24] overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FFE26E] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center justify-center text-[#3E2A24] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Showcase */}
        <div className="relative w-full md:w-3/5 h-72 md:h-auto min-h-[340px] bg-[#111111] shrink-0">
          <Image
            src={image.image}
            alt={image.title}
            fill
            className="object-contain p-2"
            unoptimized
          />
        </div>

        {/* Meta Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 bg-[#FFFDF8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFECC8] border-2 border-[#3E2A24] text-xs font-bricolage font-black text-[#3E2A24] uppercase mb-3">
              <Tag className="w-3 h-3 text-[#FF4FA3]" />
              <span>{image.category}</span>
            </div>

            <h3 className="font-bowlby text-2xl text-[#3E2A24] mb-3">
              {image.title}
            </h3>

            {image.caption ? (
              <p className="font-kalam text-base text-[#5F4A3A] leading-relaxed">
                "{image.caption}"
              </p>
            ) : (
              <p className="font-kalam text-sm text-[#5F4A3A]/60 italic">
                No custom story caption provided.
              </p>
            )}
          </div>

          <div className="pt-6 border-t-2 border-[#3E2A24]/20 flex items-center gap-2 text-xs font-bricolage font-bold text-[#5F4A3A]">
            <Calendar className="w-4 h-4 text-[#FF4FA3]" />
            <span>Uploaded: {new Date(image.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
