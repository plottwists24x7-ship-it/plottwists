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
  Crop, 
  ZoomIn, 
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  Type
} from "lucide-react";

export default function AdminHeroPage() {
  const { hero, updateHero } = useAdmin();

  // Local editing state
  const [image, setImage] = useState(hero.image || "/cheesecake.png");
  const [alt, setAlt] = useState(hero.alt || "Signature Artisanal Cheesecake");
  const [captionTitle, setCaptionTitle] = useState(hero.captionTitle || "today's batch ♡");
  const [captionSubtitle, setCaptionSubtitle] = useState(hero.captionSubtitle || "Mom's Special");
  const [aspectRatio, setAspectRatio] = useState(hero.aspectRatio || "4:3");
  const [objectFit, setObjectFit] = useState<"cover" | "contain">(hero.objectFit || "cover");
  const [scale, setScale] = useState(hero.scale || 1.03);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImage(hero.image || "/cheesecake.png");
    setAlt(hero.alt || "Signature Artisanal Cheesecake");
    setCaptionTitle(hero.captionTitle || "today's batch ♡");
    setCaptionSubtitle(hero.captionSubtitle || "Mom's Special");
    setAspectRatio(hero.aspectRatio || "4:3");
    setObjectFit(hero.objectFit || "cover");
    setScale(hero.scale || 1.03);
  }, [hero]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
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
    }
  };

  const handleResetToDefault = () => {
    setImage("/cheesecake.png");
    setAlt("Signature Artisanal Cheesecake");
    setCaptionTitle("today's batch ♡");
    setCaptionSubtitle("Mom's Special");
    setAspectRatio("4:3");
    setObjectFit("cover");
    setScale(1.03);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateHero({
      image,
      alt: alt.trim() || "Signature Artisanal Cheesecake",
      captionTitle: captionTitle.trim() || "today's batch ♡",
      captionSubtitle: captionSubtitle.trim() || "Mom's Special",
      aspectRatio,
      objectFit,
      scale,
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── TOAST NOTIFICATION ─── */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-5 py-3.5 rounded-2xl bg-[#FFE26E] border-[3px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] flex items-center gap-3 text-[#3E2A24]">
            <div className="w-8 h-8 rounded-full bg-[#10B981] border-2 border-[#3E2A24] flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bricolage font-extrabold text-sm">Hero image updated successfully.</p>
              <p className="font-kalam text-xs text-[#5F4A3A]">Your live storefront is now showing the new featured bake!</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOP ACTION BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bowlby text-2xl text-[#3E2A24]">
              Hero Section Featured Image
            </h2>
            <span className="bg-[#FF4FA3] text-white text-xs font-bricolage font-black px-2.5 py-0.5 rounded-full border-2 border-[#3E2A24]">
              Storefront Cover
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1">
            Replace the centerpiece dessert polaroid that welcomes every visitor to PlotTwist24x
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-xs border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 transition-all"
          >
            <span>View Live Hero</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[6px_6px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
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

      {/* ─── MAIN TWO-COLUMN WORKSPACE: CONTROLS & LIVE PREVIEW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── LEFT: UPLOAD & CROP CONTROLS (7 COLS) ─── */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* UPLOAD BOX */}
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#3E2A24]/15">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#FF4FA3]" />
                <h3 className="font-bowlby text-base text-[#3E2A24]">
                  Upload & Replace Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUrlMode(!isUrlMode)}
                className="text-xs font-bricolage font-bold text-[#FF4FA3] hover:underline cursor-pointer"
              >
                {isUrlMode ? "Switch to File Upload" : "Paste Image URL"}
              </button>
            </div>

            {isUrlMode ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/artisan-cake.jpg"
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white border-[3px] border-[#3E2A24] text-sm font-bricolage text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-2xl bg-[#FFE26E] text-[#3E2A24] border-[3px] border-[#3E2A24] font-bricolage font-bold text-xs shadow-[2px_2px_0_#3E2A24] cursor-pointer hover:bg-[#ffd633]"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`h-40 rounded-2xl border-[3px] border-dashed border-[#3E2A24] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "bg-[#FFE26E]/60 scale-[1.01]"
                    : "bg-[#FFECC8]/30 hover:bg-[#FFECC8]/70"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] mb-2 shadow-[2px_2px_0_#3E2A24]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-bricolage font-bold text-sm text-[#3E2A24]">
                  Click to browse or drag & drop new hero photo
                </p>
                <p className="font-kalam text-xs text-[#5F4A3A] mt-1">
                  Supports PNG, JPG, JPEG, WEBP up to 10MB. Landscape recommended.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* CROPPING, ORIENTATION & FIT CONTROLS */}
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-[#3E2A24]/15">
              <Crop className="w-5 h-5 text-[#FF4FA3]" />
              <h3 className="font-bowlby text-base text-[#3E2A24]">
                Framing & Crop Optimization
              </h3>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-2">
                Recommended Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Landscape (4:3)", val: "4:3", sub: "Recommended" },
                  { label: "Standard (16:9)", val: "16:9", sub: "Widescreen" },
                  { label: "Square (1:1)", val: "1:1", sub: "Polaroid" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAspectRatio(item.val)}
                    className={`p-3 rounded-2xl border-2 border-[#3E2A24] text-center transition-all cursor-pointer ${
                      aspectRatio === item.val
                        ? "bg-[#FFE26E] shadow-[3px_3px_0_#3E2A24] font-bold"
                        : "bg-white hover:bg-[#FFECC8]/40 shadow-[1.5px_1.5px_0_#3E2A24]"
                    }`}
                  >
                    <p className="font-bricolage text-xs font-bold text-[#3E2A24]">{item.label}</p>
                    <span className="font-kalam text-[10px] text-[#5F4A3A]">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale & Zoom Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24]">
                  Scale / Zoom ({scale.toFixed(2)}x)
                </label>
                <button
                  type="button"
                  onClick={() => setScale(1.03)}
                  className="text-[11px] font-bricolage font-bold text-[#FF4FA3] hover:underline"
                >
                  Reset Zoom
                </button>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.5"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#FFECC8] rounded-lg appearance-none cursor-pointer accent-[#FF4FA3]"
              />
            </div>

            {/* Object Fit Selector */}
            <div className="flex items-center justify-between pt-1">
              <label className="font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24]">
                Fit Mode:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setObjectFit("cover")}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#3E2A24] text-xs font-bricolage font-bold cursor-pointer ${
                    objectFit === "cover" ? "bg-[#FF4FA3] text-white" : "bg-white text-[#3E2A24]"
                  }`}
                >
                  Cover Frame (Fill)
                </button>
                <button
                  type="button"
                  onClick={() => setObjectFit("contain")}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#3E2A24] text-xs font-bricolage font-bold cursor-pointer ${
                    objectFit === "contain" ? "bg-[#FF4FA3] text-white" : "bg-white text-[#3E2A24]"
                  }`}
                >
                  Contain Entire Photo
                </button>
              </div>
            </div>
          </div>

          {/* CAPTION & ACCESSIBILITY DETAILS */}
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-[#3E2A24]/15">
              <Type className="w-5 h-5 text-[#FF4FA3]" />
              <h3 className="font-bowlby text-base text-[#3E2A24]">
                Handwritten Captions & Alt Text
              </h3>
            </div>

            <div>
              <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                Image Alt Text (Accessibility & SEO)
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g. Signature Artisanal Basque Cheesecake"
                className="w-full px-4 py-2.5 rounded-2xl bg-white border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                  Polaroid Caption Title
                </label>
                <input
                  type="text"
                  value={captionTitle}
                  onChange={(e) => setCaptionTitle(e.target.value)}
                  placeholder="e.g. today's batch ♡"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border-[3px] border-[#3E2A24] font-fasthand font-bold text-base text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30"
                />
              </div>

              <div>
                <label className="block font-bricolage text-xs font-black uppercase tracking-wider text-[#3E2A24] mb-1.5">
                  Polaroid Subtitle
                </label>
                <input
                  type="text"
                  value={captionSubtitle}
                  onChange={(e) => setCaptionSubtitle(e.target.value)}
                  placeholder="e.g. Mom's Special"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border-[3px] border-[#3E2A24] font-caveat font-bold text-base text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs font-bricolage font-bold text-[#5F4A3A] hover:text-[#3E2A24] flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Original Demo Image</span>
              </button>
            </div>
          </div>

        </div>

        {/* ─── RIGHT: LIVE POLAROID PREVIEW CANVAS (5 COLS) ─── */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#3E2A24]/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4FA3]" />
                <h3 className="font-bowlby text-base text-[#3E2A24]">
                  Live Storefront Preview
                </h3>
              </div>
              <span className="bg-[#FFE26E] text-[#3E2A24] text-[10px] font-bricolage font-black px-2 py-0.5 rounded-full border border-[#3E2A24]">
                1:1 Scale Match
              </span>
            </div>

            {/* Interactive Scrapbook Polaroid Mockup Frame */}
            <div className="w-full flex justify-center py-6 bg-[#C7E9E4]/40 rounded-2xl border-2 border-dashed border-[#3E2A24]/30 overflow-hidden relative">
              {/* Paper dot grid */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" width="100%" height="100%">
                <pattern id="preview-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="#3B2A22" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#preview-grid)" />
              </svg>

              {/* Polaroid Frame */}
              <div className="relative w-72 sm:w-80 h-[360px] sm:h-[400px] bg-white border-[4px] border-[#3B2A22] shadow-[10px_10px_0_#3B2A22] rounded-md p-3.5 flex flex-col justify-between transform rotate-[2.5deg] z-10">
                
                {/* Top Masking Tape */}
                <MaskingTape color="kraft" width={90} height={28} rotate={-2} className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 opacity-95" />

                {/* Photo Window */}
                <div className="relative w-full h-[76%] rounded overflow-hidden bg-[#F5EDDC] border-2 border-[#3B2A22]/30 shadow-inner">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    style={{
                      objectFit: objectFit,
                      transform: `scale(${scale})`,
                    }}
                    className="transition-transform duration-300"
                    unoptimized={image.startsWith("data:") || false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Handwritten Keepsake Caption Bar */}
                <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
                  <div className="flex flex-col">
                    <p className="font-fasthand text-base sm:text-lg text-[#3B2A22] font-bold rotate-[-1deg] leading-tight">
                      {captionTitle}
                    </p>
                    <p className="font-caveat text-xs sm:text-sm font-bold text-[#3B2A22]/70 -mt-0.5">
                      {captionSubtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-fraunces text-[10px] font-bold text-[#3B2A22]/80 uppercase tracking-widest block">
                      02/24
                    </span>
                    <span className="font-fasthand text-[10px] font-bold text-[#EF5B5B]">Made this morning</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metadata Box */}
            <div className="mt-4 p-3 bg-[#FFECC8]/50 rounded-2xl border-2 border-[#3E2A24]/30 font-bricolage text-xs text-[#5F4A3A] space-y-1">
              <p className="font-bold text-[#3E2A24]">Active Hero Metadata:</p>
              <p className="truncate">Source: <span className="font-mono text-[11px]">{image.startsWith("data:") ? "Custom Upload (Base64)" : image}</span></p>
              <p>Last Saved: <span className="font-bold text-[#3E2A24]">{hero.updatedAt ? new Date(hero.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Initial"}</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
