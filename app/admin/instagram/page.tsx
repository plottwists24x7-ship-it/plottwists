"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { MaskingTape } from "@/components/paper/MaskingTape";
import { 
  UploadCloud, 
  RefreshCw, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Image as ImageIcon,
  RotateCcw,
  Type,
  Camera
} from "lucide-react";

export default function AdminInstagramPage() {
  const { instagramCTA, updateInstagramCTA } = useAdmin();

  // Local editing state
  const [image, setImage] = useState(instagramCTA?.image || "/images/baker-where/instagram_cta_dessert.jpg");
  const [alt, setAlt] = useState(instagramCTA?.alt || "PlotTwist24x signature gourmet cake dessert");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImage(instagramCTA?.image || "/images/baker-where/instagram_cta_dessert.jpg");
    setAlt(instagramCTA?.alt || "PlotTwist24x signature gourmet cake dessert");
  }, [instagramCTA]);

  const handleFile = (file: File) => {
    setErrorMsg("");
    
    // Validation: format
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type) && !file.type.startsWith("image/")) {
      setErrorMsg("Unsupported file format. Please upload a PNG, JPG, JPEG, or WEBP image.");
      return;
    }

    // Validation: max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit. Please upload an optimized image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read the image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      setImage(customUrl.trim());
      setIsUrlMode(false);
      setCustomUrl("");
      setErrorMsg("");
    }
  };

  const handleResetToDefault = () => {
    setImage("/images/baker-where/instagram_cta_dessert.jpg");
    setAlt("PlotTwist24x signature gourmet cake dessert");
    setErrorMsg("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateInstagramCTA({
      image,
      alt: alt.trim() || "PlotTwist24x signature gourmet cake dessert",
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 pb-12">

      {/* ─── TOP ACTION BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="font-bowlby text-2xl sm:text-3xl text-[#3E2A24] tracking-tight">
              Instagram CTA
            </h1>
            <span className="bg-[#FF4FA3] text-white text-[10px] font-bricolage font-black px-2 py-0.5 rounded-full border border-[#3E2A24] uppercase shadow-xs">
              Live Media
            </span>
          </div>
          <p className="font-kalam text-sm text-[#5F4A3A] font-semibold mt-1">
            Replace the featured dessert cutout photo displayed in the Instagram Community CTA section.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/#instagram-cta"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-xs border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 transition-all"
          >
            <span>View Live Section</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#FF3393] text-white font-bricolage font-black text-sm border-[2.5px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[4px_4px_0_#3E2A24] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_#3E2A24] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── ERROR BANNER ─── */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FEE2E2] border-[3px] border-[#EF4444] text-[#B91C1C] font-bricolage font-bold text-sm flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-xs underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* ─── 2-COLUMN MAIN EDITOR LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ═════════════════════════════════════════════════════════
            LEFT COLUMN (7 COLS): UPLOAD CONTROLS & SETTINGS
           ═════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Image Upload & Replacement */}
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-5">
            <div className="flex items-center justify-between border-b-[2px] border-[#3E2A24]/15 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#FF4FA3]" />
                <h2 className="font-bowlby text-lg text-[#3E2A24]">Image Upload & Replacement</h2>
              </div>
              <span className="font-kalam text-xs text-[#5F4A3A] font-bold">Max 5MB • JPG, PNG, WEBP</span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-[3px] border-dashed text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? "border-[#FF4FA3] bg-[#FFE8F3] scale-[1.01]" 
                  : "border-[#3E2A24]/30 bg-[#FAF9F6] hover:bg-[#FFECC8]/30 hover:border-[#3E2A24]"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#FFE26E] border-[2.5px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] mx-auto flex items-center justify-center text-[#3E2A24] mb-3">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-bowlby text-base text-[#3E2A24] mb-1">
                Drop your new Instagram dessert photo here
              </h3>
              <p className="font-kalam text-xs text-[#5F4A3A] font-semibold mb-3">
                or click to browse your computer files
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#3E2A24]/30 font-bricolage text-[11px] font-bold text-[#3E2A24]">
                Recommended: 1200 × 1200 px (Square / Organic Cutout)
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#FFE26E] hover:bg-[#FFD738] text-[#3E2A24] font-bricolage font-extrabold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUrlMode(!isUrlMode)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F6] text-[#3E2A24] font-bricolage font-bold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isUrlMode ? "Hide URL Input" : "Paste Image URL"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FEE2E2] text-[#DC2626] font-bricolage font-bold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                title="Reset to default bakery dessert image"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>

            {/* Custom URL Input Accordion */}
            {isUrlMode && (
              <div className="p-4 rounded-xl bg-[#FAF9F6] border-2 border-[#3E2A24] space-y-2 animate-in fade-in-50">
                <label className="block font-bricolage font-bold text-xs text-[#3E2A24]">
                  Direct Image Web URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-[#3E2A24] bg-white font-mono text-xs text-[#3E2A24] focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2 rounded-lg bg-[#FF4FA3] text-white font-bricolage font-bold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer hover:bg-[#FF3393]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Accessibility & SEO Details */}
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-4">
            <div className="flex items-center gap-2 border-b-[2px] border-[#3E2A24]/15 pb-3">
              <Type className="w-5 h-5 text-[#FF4FA3]" />
              <h2 className="font-bowlby text-lg text-[#3E2A24]">Image Alt & Accessibility</h2>
            </div>

            <div>
              <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                Alt Text (Screen Readers & SEO):
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="PlotTwist24x signature gourmet cake dessert"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#3E2A24] bg-white font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]"
              />
              <p className="font-kalam text-xs text-[#5F4A3A] mt-1">
                Describes the image for visually impaired users and search engine indexing.
              </p>
            </div>
          </div>

          {/* Card 3: Bakery Owner Tips */}
          <div className="p-5 rounded-3xl bg-[#FFECC8]/60 border-[3px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4FA3]" />
              <h3 className="font-bowlby text-sm text-[#3E2A24]">Bakery Owner Pro-Tips</h3>
            </div>
            <ul className="font-kalam text-xs text-[#5F4A3A] space-y-1 list-disc list-inside font-semibold">
              <li>High-contrast dessert photography with vibrant toppings (strawberries, cream, chocolate) performs best.</li>
              <li>Images with clean backgrounds naturally integrate with the hand-painted yellow splash decoration.</li>
              <li>Updates take effect immediately on both desktop and mobile layouts once saved.</li>
            </ul>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════
            RIGHT COLUMN (5 COLS): LIVE SCRAPBOOK PREVIEW
           ═════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-[2px] border-[#3E2A24]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h2 className="font-bowlby text-lg text-[#3E2A24]">Live Storefront Preview</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#047857] border border-[#10B981]/40 font-bricolage text-[10px] font-bold uppercase">
                Real-Time
              </span>
            </div>

            {/* Scrapbook Preview Canvas Matching Live Website */}
            <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl bg-[#FFFDF8] border-2 border-[#3E2A24]/20 p-4 flex items-center justify-center overflow-hidden">
              
              {/* Soft Background Blobs */}
              <div className="absolute -top-4 -left-4 w-44 h-44 bg-[#FFD1DC] rounded-full filter blur-lg opacity-70 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#C7E9E4] rounded-full filter blur-lg opacity-70 pointer-events-none" />

              {/* Hand-Painted Organic Splash SVG */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 500 500" className="w-[120%] h-[120%] fill-[#FAD02C] filter drop-shadow-[3px_4px_0_rgba(17,17,17,0.15)] transform -rotate-3">
                  <path d="M 120 70 Q 240 10 380 60 Q 480 120 460 260 Q 440 400 320 460 Q 180 500 80 380 Q -10 260 40 160 Z" />
                </svg>
              </div>

              {/* Dessert Cutout Card */}
              <div className="relative z-10 w-[240px] sm:w-[270px] h-[280px] sm:h-[310px] rounded-2xl overflow-hidden border-[4px] border-white bg-[#FAF4E8] shadow-[8px_8px_0_rgba(17,17,17,0.25)] transform -rotate-3">
                <Image
                  src={image || "/images/baker-where/instagram_cta_dessert.jpg"}
                  alt={alt || "Instagram dessert preview"}
                  fill
                  priority
                  sizes="300px"
                  className="object-cover"
                  unoptimized={Boolean(image?.startsWith("data:"))}
                />

                {/* Masking Tape */}
                <MaskingTape color="yellow" width={56} height={18} rotate={-8} className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 opacity-95" />

                {/* Top Left Note Pin */}
                <div className="absolute top-2.5 left-2.5 z-30 bg-[#FFF8EE] border border-[#111111] shadow-[2px_2px_0_#111111] px-2 py-0.5 rounded transform -rotate-6">
                  <span className="font-caveat text-sm font-bold text-[#FF4FA3]">Baked today! ♡</span>
                </div>

                {/* Bottom Right Note Pin */}
                <div className="absolute bottom-2.5 right-2.5 z-30 bg-[#FFE066] border border-[#111111] shadow-[2px_2px_0_#111111] px-2 py-0.5 rounded transform rotate-3">
                  <span className="font-caveat text-sm font-bold text-[#111111]">Yum! ✨</span>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <span className="absolute top-3 left-4 text-2xl filter drop-shadow-[1px_1px_0_#111111] transform -rotate-12 pointer-events-none">🍓</span>
              <span className="absolute bottom-3 right-4 text-2xl filter drop-shadow-[1px_1px_0_#111111] transform rotate-12 pointer-events-none">🍩</span>
            </div>

            {/* Save Reminder Footer */}
            <div className="pt-2 text-center">
              <p className="font-kalam text-xs text-[#5F4A3A]">
                Click <span className="font-bold text-[#FF4FA3]">&ldquo;Save Changes&rdquo;</span> at the top to publish your updates.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
