"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { StoryImagesConfig, INITIAL_STORY_IMAGES } from "@/lib/mock-data";
import { 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  UploadCloud, 
  ExternalLink, 
  Sparkles, 
  RotateCcw,
  Image as ImageIcon,
  Award,
  Layers,
  Info
} from "lucide-react";

interface StoryImageItemConfig {
  key: keyof Omit<StoryImagesConfig, "updatedAt">;
  title: string;
  badge: string;
  description: string;
  dimensions: string;
  shape: "polaroid" | "circle";
  defaultSrc: string;
}

const STORY_IMAGES_METADATA: StoryImageItemConfig[] = [
  {
    key: "mainPolaroid",
    title: "Kitchen Preparation Polaroid",
    badge: "Main Featured",
    description: "The large centerpiece polaroid photo inside the 3D-tilting scrapbook frame.",
    dimensions: "Portrait / Square (e.g. 800×1000px)",
    shape: "polaroid",
    defaultSrc: "/images/baker-where/hero_bakery.jpg",
  },
  {
    key: "badge1",
    title: "Feature Badge 1: '24 countries'",
    badge: "Badge 1",
    description: "Circular showcase image for the first highlight badge.",
    dimensions: "Square 1:1 (e.g. 500×500px)",
    shape: "circle",
    defaultSrc: "/images/baker-where/prod_pancakes.jpg",
  },
  {
    key: "badge2",
    title: "Feature Badge 2: '100% wholesome'",
    badge: "Badge 2",
    description: "Circular showcase image for the center highlight badge.",
    dimensions: "Square 1:1 (e.g. 500×500px)",
    shape: "circle",
    defaultSrc: "/images/baker-where/prod_tiramisu.jpg",
  },
  {
    key: "badge3",
    title: "Feature Badge 3: 'trusted quality'",
    badge: "Badge 3",
    description: "Circular showcase image for the third highlight badge.",
    dimensions: "Square 1:1 (e.g. 500×500px)",
    shape: "circle",
    defaultSrc: "/images/baker-where/prod_biscoff_brownie.jpg",
  },
];

export default function AdminStoryImagesPage() {
  const { storyImages, updateStoryImages } = useAdmin();

  // Local state
  const [formData, setFormData] = useState<StoryImagesConfig>(storyImages);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSavingKey, setActiveSavingKey] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Story image updated successfully.");
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hidden file input refs
  const fileInputRefs = {
    mainPolaroid: useRef<HTMLInputElement>(null),
    badge1: useRef<HTMLInputElement>(null),
    badge2: useRef<HTMLInputElement>(null),
    badge3: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    setMounted(true);
    setFormData(storyImages);
  }, [storyImages]);

  const handleImageFile = (file: File, key: keyof Omit<StoryImagesConfig, "updatedAt">) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please upload an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        setFormData((prev) => ({ ...prev, [key]: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = async (key: keyof Omit<StoryImagesConfig, "updatedAt">) => {
    setActiveSavingKey(key);
    await updateStoryImages({ [key]: formData[key] });
    setActiveSavingKey(null);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await updateStoryImages(formData);
    setIsSaving(false);
  };

  const handleResetSingle = async (key: keyof Omit<StoryImagesConfig, "updatedAt">, defaultSrc: string) => {
    if (confirm("Reset this image back to its original default?")) {
      const updated = { ...formData, [key]: defaultSrc };
      setFormData(updated);
      await updateStoryImages({ [key]: defaultSrc });
    }
  };

  const handleResetAll = async () => {
    if (confirm("Reset all 4 Story Section images back to initial defaults?")) {
      setFormData(INITIAL_STORY_IMAGES);
      await updateStoryImages(INITIAL_STORY_IMAGES);
    }
  };

  return (
    <div className="space-y-8 pb-12">

      {/* ─── TOP ACTION BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bowlby text-2xl text-[#3E2A24]">
              Story Images
            </h2>
            <span className="bg-[#FFE26E] text-[#3E2A24] text-xs font-bricolage font-black px-2.5 py-0.5 rounded-full border-2 border-[#3E2A24]">
              Media Manager
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1">
            Replace and update the 4 dynamic images in the Story section without changing any text or styling
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/#story"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-xs border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 transition-all"
          >
            <span>View Story Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[6px_6px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving All...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Images</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── INFO BANNER ─── */}
      <div className="p-4 rounded-2xl bg-[#FFECC8]/40 border-2 border-[#3E2A24]/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#FF4FA3] shrink-0 mt-0.5" />
        <div className="text-xs font-bricolage text-[#5F4A3A] space-y-0.5">
          <p className="font-extrabold text-[#3E2A24]">
            Supported Formats: PNG, JPG, JPEG, WEBP • Max File Size: 10 MB per image
          </p>
          <p>
            All scrapbook frames, stickers, polaroid rotations, shadows, and text formatting are preserved automatically.
          </p>
        </div>
      </div>

      {/* ─── 4 IMAGE CARDS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {STORY_IMAGES_METADATA.map((item) => {
          const currentImg = formData[item.key] || item.defaultSrc;
          const isItemSaving = activeSavingKey === item.key;

          return (
            <div
              key={item.key}
              className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] flex flex-col justify-between space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-[#3E2A24]/15">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bowlby text-base sm:text-lg text-[#3E2A24]">
                      {item.title}
                    </h3>
                    <span className="bg-[#FFE26E] text-[#3E2A24] text-[10px] font-bricolage font-black px-2 py-0.5 rounded-full border border-[#3E2A24]">
                      {item.badge}
                    </span>
                  </div>
                  <p className="font-kalam text-xs text-[#5F4A3A] mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Preview & Upload Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                
                {/* Visual Preview Frame */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-[#FFECC8]/30 rounded-2xl border-2 border-[#3E2A24]/20">
                  <span className="text-[10px] font-bricolage font-black text-[#5F4A3A] uppercase tracking-wider mb-2">
                    Current Preview
                  </span>

                  {item.shape === "polaroid" ? (
                    <div className="w-36 bg-[#F9F3E6] p-2 pb-6 rounded border border-[#A17A5B] shadow-md transform rotate-[-1deg]">
                      <div className="relative w-full h-32 rounded overflow-hidden bg-white">
                        <Image
                          src={currentImg}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized={currentImg.startsWith("data:")}
                        />
                      </div>
                      <p className="font-kalam text-[9px] text-[#5C4332] font-bold mt-1 text-center truncate">
                        artisan sourdough prep ♡
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-[#2B1824] shadow-md bg-white relative">
                        <Image
                          src={currentImg}
                          alt={item.title}
                          fill
                          className="object-cover scale-105"
                          unoptimized={currentImg.startsWith("data:")}
                        />
                      </div>
                      <span className="text-[9px] font-bricolage font-black bg-[#FFE26E] text-[#2B1824] px-2 py-0.5 rounded-full border border-[#2B1824] -translate-y-2 shadow-xs">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-[#5F4A3A] mt-2 font-bold">
                    {item.dimensions}
                  </span>
                </div>

                {/* Upload & Controls */}
                <div className="sm:col-span-7 space-y-3">
                  
                  {/* Dropzone */}
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverKey(null);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleImageFile(e.dataTransfer.files[0], item.key);
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverKey(item.key);
                    }}
                    onDragLeave={() => setDragOverKey(null)}
                    onClick={() => fileInputRefs[item.key].current?.click()}
                    className={"h-28 rounded-2xl border-2 border-dashed border-[#3E2A24] flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all " + (dragOverKey === item.key ? "bg-[#FFE26E]/60 scale-[1.02]" : "bg-white hover:bg-[#FFECC8]/40")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFE26E] border border-[#3E2A24] flex items-center justify-center text-[#3E2A24] mb-1">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <p className="font-bricolage font-bold text-xs text-[#3E2A24]">
                      Click to Replace Image
                    </p>
                    <p className="font-kalam text-[10px] text-[#5F4A3A]">
                      or drag & drop file here
                    </p>
                  </div>

                  <input
                    ref={fileInputRefs[item.key]}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0], item.key);
                      }
                    }}
                  />

                  {/* Manual URL Input */}
                  <div>
                    <label className="block font-bricolage text-[10px] font-black uppercase tracking-wider text-[#3E2A24] mb-1">
                      Or Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={currentImg.startsWith("data:") ? "(Uploaded File Base64)" : currentImg}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val.startsWith("(Uploaded File")) {
                          setFormData((prev) => ({ ...prev, [item.key]: val }));
                        }
                      }}
                      placeholder="/images/baker-where/hero_bakery.jpg"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-mono text-xs text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30"
                    />
                  </div>

                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-[#3E2A24]/15 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleResetSingle(item.key, item.defaultSrc)}
                  className="text-xs font-bricolage font-bold text-[#5F4A3A] hover:text-[#3E2A24] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveItem(item.key)}
                  disabled={isItemSaving}
                  className="px-4 py-2 rounded-xl bg-[#FFE26E] hover:bg-[#ffd633] text-[#3E2A24] font-bricolage font-extrabold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] hover:shadow-[3px_3px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isItemSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ─── BOTTOM RESET BAR ─── */}
      <div className="flex items-center justify-between p-4 bg-[#FFFDF8] rounded-2xl border-[3px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24]">
        <span className="font-kalam text-xs text-[#5F4A3A]" suppressHydrationWarning>
          Last saved: {mounted && storyImages.updatedAt ? new Date(storyImages.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"}
        </span>
        <button
          type="button"
          onClick={handleResetAll}
          className="text-xs font-bricolage font-bold text-[#EF5B5B] hover:text-[#dc2626] flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Story Images to Original Defaults</span>
        </button>
      </div>

    </div>
  );
}
