"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin, SharedInstagramEntry } from "@/context/AdminContext";
import { MaskingTape } from "@/components/paper/MaskingTape";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { uploadImage } from "@/lib/supabase/client";
import { 
  UploadCloud, 
  RefreshCw, 
  Save, 
  Sparkles, 
  ExternalLink, 
  Image as ImageIcon,
  RotateCcw,
  Type,
  Camera,
  Plus,
  Trash2,
  Edit3,
  X
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const SINGLETON_BANNER_ID = "00000000-0000-0000-0000-000000000003";

export default function AdminInstagramPage() {
  const { 
    instagramCTA, 
    updateInstagramCTA, 
    instagramEntries, 
    addInstagramEntry, 
    updateInstagramEntry, 
    deleteInstagramEntry 
  } = useAdmin();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"banner" | "gallery">("banner");

  // Local editing state for primary banner
  const [image, setImage] = useState(instagramCTA?.image || "/images/baker-where/instagram_cta_dessert.jpg");
  const [alt, setAlt] = useState(instagramCTA?.alt || "PlotTwist24x signature gourmet cake dessert");

  // UI state for banner
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery post modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postImage, setPostImage] = useState("");
  const [postAlt, setPostAlt] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postHandle, setPostHandle] = useState("@plottwist24x");
  const [postUrl, setPostUrl] = useState("https://www.instagram.com/plottwist24x7");
  const [postOrder, setPostOrder] = useState<number>(1);
  const [postIsActive, setPostIsActive] = useState(true);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<SharedInstagramEntry | null>(null);

  // Synchronize banner when context updates
  const [prevInstagram, setPrevInstagram] = useState(instagramCTA);
  if (instagramCTA !== prevInstagram) {
    setPrevInstagram(instagramCTA);
    setImage(instagramCTA?.image || "/images/baker-where/instagram_cta_dessert.jpg");
    setAlt(instagramCTA?.alt || "PlotTwist24x signature gourmet cake dessert");
  }

  // ─── BANNER HANDLERS ───
  const handleFile = async (file: File) => {
    setErrorMsg("");
    try {
      const uploadedPath = await uploadImage(file, "instagram");
      setImage(uploadedPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process image file.";
      setErrorMsg(msg);
    }
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

  const handleSaveBanner = async () => {
    setIsSaving(true);
    await updateInstagramCTA({
      image,
      alt: alt.trim() || "PlotTwist24x signature gourmet cake dessert",
    });
    setIsSaving(false);
  };

  // ─── GALLERY POST HANDLERS ───
  const openNewPostModal = () => {
    setEditingPostId(null);
    setPostImage("");
    setPostAlt("");
    setPostCaption("");
    setPostHandle("@plottwist24x");
    setPostUrl("https://www.instagram.com/plottwist24x7");
    setPostOrder(instagramEntries.length + 1);
    setPostIsActive(true);
    setIsPostModalOpen(true);
  };

  const openEditPostModal = (entry: SharedInstagramEntry) => {
    setEditingPostId(entry.id);
    setPostImage(entry.imagePath || entry.image);
    setPostAlt(entry.alt || "");
    setPostCaption(entry.description || "");
    setPostHandle(entry.handle || "@plottwist24x");
    setPostUrl(entry.url || "https://www.instagram.com/plottwist24x7");
    setPostOrder(entry.displayOrder ?? 1);
    setPostIsActive(entry.isActive !== undefined ? entry.isActive : true);
    setIsPostModalOpen(true);
  };

  const handlePostFile = async (file: File) => {
    setErrorMsg("");
    try {
      const uploadedPath = await uploadImage(file, "instagram");
      setPostImage(uploadedPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload post image.";
      setErrorMsg(msg);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postImage.trim()) {
      setErrorMsg("Please select or upload an image for this Instagram post.");
      return;
    }

    setIsSavingPost(true);
    setErrorMsg("");

    if (editingPostId) {
      const success = await updateInstagramEntry(editingPostId, {
        image: postImage.trim(),
        alt: postAlt.trim() || "PlotTwist Instagram Post",
        description: postCaption.trim(),
        handle: postHandle.trim(),
        url: postUrl.trim(),
        displayOrder: postOrder,
        isActive: postIsActive,
      });
      if (success) {
        setIsPostModalOpen(false);
      }
    } else {
      const created = await addInstagramEntry({
        image: postImage.trim(),
        imagePath: postImage.trim(),
        alt: postAlt.trim() || "PlotTwist Instagram Post",
        description: postCaption.trim(),
        handle: postHandle.trim(),
        url: postUrl.trim(),
        displayOrder: postOrder,
        isActive: postIsActive,
      });
      if (created) {
        setIsPostModalOpen(false);
      }
    }
    setIsSavingPost(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteInstagramEntry(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8 pb-12">

      {/* ─── TOP ACTION BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="font-bowlby text-2xl sm:text-3xl text-[#3E2A24] tracking-tight">
              Instagram Management
            </h1>
            <span className="bg-[#FF4FA3] text-white text-[10px] font-bricolage font-black px-2 py-0.5 rounded-full border border-[#3E2A24] uppercase shadow-xs">
              Live Media
            </span>
          </div>
          <p className="font-kalam text-sm text-[#5F4A3A] font-semibold mt-1">
            Manage your high-conversion storefront Instagram banner and community gallery posts.
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

          {activeTab === "banner" ? (
            <button
              onClick={handleSaveBanner}
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
                  <span>Save Banner</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={openNewPostModal}
              className="px-6 py-2.5 rounded-2xl bg-[#FFE26E] hover:bg-[#FFD738] text-[#3E2A24] font-bricolage font-black text-sm border-[2.5px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[4px_4px_0_#3E2A24] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_#3E2A24] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Post</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── TAB NAVIGATION ─── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab("banner")}
          className={`px-5 py-2.5 rounded-2xl font-bricolage font-extrabold text-sm border-[3px] border-[#3E2A24] transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "banner"
              ? "bg-[#FFE26E] text-[#3E2A24] shadow-[4px_4px_0_#3E2A24] translate-y-[-2px]"
              : "bg-[#FFFDF8] text-[#5F4A3A] hover:bg-[#FFECC8]/50 shadow-[2px_2px_0_#3E2A24]"
          }`}
        >
          <Camera className="w-4 h-4 text-[#FF4FA3]" />
          <span>Storefront CTA Banner</span>
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-5 py-2.5 rounded-2xl font-bricolage font-extrabold text-sm border-[3px] border-[#3E2A24] transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "gallery"
              ? "bg-[#FFE26E] text-[#3E2A24] shadow-[4px_4px_0_#3E2A24] translate-y-[-2px]"
              : "bg-[#FFFDF8] text-[#5F4A3A] hover:bg-[#FFECC8]/50 shadow-[2px_2px_0_#3E2A24]"
          }`}
        >
          <InstagramIcon className="w-4 h-4 text-[#FF4FA3]" />
          <span>Instagram Gallery Posts ({instagramEntries.length})</span>
        </button>
      </div>

      {/* ─── ERROR BANNER ─── */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FEE2E2] border-[3px] border-[#EF4444] text-[#B91C1C] font-bricolage font-bold text-sm flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-xs underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          TAB 1: STOREFRONT BANNER CTA (ORIGINAL APPROVED EDITOR)
         ═════════════════════════════════════════════════════════════ */}
      {activeTab === "banner" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CONTROLS & SETTINGS */}
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
                <li>High-contrast dessert photography with vibrant toppings performs best on the homepage.</li>
                <li>Updates take effect immediately on both desktop and mobile layouts once saved.</li>
              </ul>
            </div>

          </div>

          {/* RIGHT COLUMN: LIVE STOREFRONT PREVIEW */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] space-y-4">
              
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
                <div className="absolute -top-4 -left-4 w-44 h-44 bg-[#FFD1DC] rounded-full filter blur-lg opacity-70 pointer-events-none" />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#C7E9E4] rounded-full filter blur-lg opacity-70 pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 500 500" className="w-[120%] h-[120%] fill-[#FAD02C] filter drop-shadow-[3px_4px_0_rgba(17,17,17,0.15)] transform -rotate-3">
                    <path d="M 120 70 Q 240 10 380 60 Q 480 120 460 260 Q 440 400 320 460 Q 180 500 80 380 Q -10 260 40 160 Z" />
                  </svg>
                </div>

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

                  <MaskingTape color="yellow" width={56} height={18} rotate={-8} className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 opacity-95" />

                  <div className="absolute top-2.5 left-2.5 z-30 bg-[#FFF8EE] border border-[#111111] shadow-[2px_2px_0_#111111] px-2 py-0.5 rounded transform -rotate-6">
                    <span className="font-caveat text-sm font-bold text-[#FF4FA3]">Baked today! ♡</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 z-30 bg-[#FFE066] border border-[#111111] shadow-[2px_2px_0_#111111] px-2 py-0.5 rounded transform rotate-3">
                    <span className="font-caveat text-sm font-bold text-[#111111]">Yum! ✨</span>
                  </div>
                </div>

                <span className="absolute top-3 left-4 text-2xl filter drop-shadow-[1px_1px_0_#111111] transform -rotate-12 pointer-events-none">🍓</span>
                <span className="absolute bottom-3 right-4 text-2xl filter drop-shadow-[1px_1px_0_#111111] transform rotate-12 pointer-events-none">🍩</span>
              </div>

              <div className="pt-2 text-center">
                <p className="font-kalam text-xs text-[#5F4A3A]">
                  Click <span className="font-bold text-[#FF4FA3]">&ldquo;Save Banner&rdquo;</span> at the top to publish your updates.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          TAB 2: INSTAGRAM GALLERY POSTS (MULTI-ENTRY CRUD)
         ═════════════════════════════════════════════════════════════ */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFECC8]/40 border-2 border-[#3E2A24]/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <p className="font-bricolage text-sm text-[#3E2A24] font-medium">
                Manage your community feed entries stored in Supabase <code className="px-1.5 py-0.5 bg-white rounded border border-[#3E2A24]/20 text-xs">site_instagram</code>. The primary homepage banner is safely preserved at Order #0.
              </p>
            </div>
            <button
              onClick={openNewPostModal}
              className="px-4 py-2 rounded-xl bg-[#FF4FA3] hover:bg-[#FF3393] text-white font-bricolage font-black text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>

          {/* Grid of Instagram Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {instagramEntries.map((entry, index) => {
              const isSingletonBanner = entry.id === SINGLETON_BANNER_ID;

              return (
                <div
                  key={entry.id}
                  className="p-5 rounded-3xl bg-[#FFFDF8] border-[3.5px] border-[#3E2A24] shadow-[5px_5px_0_#3E2A24] flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform duration-200"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image Container */}
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-[#3E2A24] bg-[#FAF9F6]">
                      <Image
                        src={entry.image || "/images/baker-where/instagram_cta_dessert.jpg"}
                        alt={entry.alt || "Instagram post"}
                        fill
                        className="object-cover"
                      />
                      {isSingletonBanner && (
                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#FFE26E] border border-[#3E2A24] text-[10px] font-bricolage font-black text-[#3E2A24] shadow-xs">
                          ⭐ Homepage Banner
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded-full bg-black/75 text-white text-[10px] font-mono">
                        #{entry.displayOrder ?? index}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bricolage font-bold text-xs text-[#FF4FA3]">
                          {entry.handle || "@plottwist24x"}
                        </span>
                        {entry.isActive !== false ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-600 text-[10px] font-bold">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="font-bricolage text-sm text-[#3E2A24] font-semibold line-clamp-2 mt-1">
                        {entry.description || entry.alt || "Bakery community drop"}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t-2 border-[#3E2A24]/10 flex items-center justify-between gap-2">
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bricolage text-[#5F4A3A] hover:text-[#FF4FA3] flex items-center gap-1 font-bold underline"
                      >
                        <span>View Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs font-kalam text-[#5F4A3A]">PlotTwist Post</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditPostModal(entry)}
                        className="p-1.5 rounded-lg bg-[#FFE26E] hover:bg-[#FFD738] border border-[#3E2A24] text-[#3E2A24] cursor-pointer shadow-xs"
                        title="Edit post"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {!isSingletonBanner && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(entry)}
                          className="p-1.5 rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#EF4444] text-[#DC2626] cursor-pointer shadow-xs"
                          title="Delete post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE / EDIT INSTAGRAM POST ─── */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-[#3E2A24]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPostModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[10px_10px_0_#3E2A24] p-6 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#3E2A24]/20 mb-4">
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-5 h-5 text-[#FF4FA3]" />
                <h3 className="font-bowlby text-xl text-[#3E2A24]">
                  {editingPostId ? "Edit Instagram Post" : "Add Instagram Post"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#FFECC8] text-[#3E2A24] border border-[#3E2A24]/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Image Input */}
              <div>
                <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                  Post Photo / Image URL *
                </label>
                <input
                  ref={postFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePostFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-[#3E2A24] bg-white font-mono text-xs text-[#3E2A24] focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]"
                  />
                  <button
                    type="button"
                    onClick={() => postFileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-[#FFE26E] text-[#3E2A24] font-bricolage font-bold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer hover:bg-[#FFD738]"
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {/* Alt & Caption */}
              <div>
                <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                  Caption / Description:
                </label>
                <textarea
                  rows={2}
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Fresh morning bakes with rich chocolate fudge..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#3E2A24] bg-white font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                  Alt Text (Accessibility):
                </label>
                <input
                  type="text"
                  value={postAlt}
                  onChange={(e) => setPostAlt(e.target.value)}
                  placeholder="PlotTwist gourmet bake"
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#3E2A24] bg-white font-bricolage text-sm text-[#3E2A24] focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]"
                />
              </div>

              {/* Handle & External Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                    Instagram Handle:
                  </label>
                  <input
                    type="text"
                    value={postHandle}
                    onChange={(e) => setPostHandle(e.target.value)}
                    placeholder="@plottwist24x"
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#3E2A24] bg-white font-bricolage text-sm text-[#3E2A24]"
                  />
                </div>

                <div>
                  <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                    Display Order:
                  </label>
                  <input
                    type="number"
                    value={postOrder}
                    onChange={(e) => setPostOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#3E2A24] bg-white font-bricolage text-sm text-[#3E2A24]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bricolage font-bold text-xs text-[#3E2A24] mb-1">
                  Direct Instagram Post / Reel URL:
                </label>
                <input
                  type="url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#3E2A24] bg-white font-mono text-xs text-[#3E2A24]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="post-is-active"
                  checked={postIsActive}
                  onChange={(e) => setPostIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#FF4FA3] rounded cursor-pointer"
                />
                <label htmlFor="post-is-active" className="font-bricolage font-bold text-xs text-[#3E2A24] cursor-pointer">
                  Visible in Gallery (Active)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#3E2A24]/10">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFF6E8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-xs border-2 border-[#3E2A24] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPost}
                  className="px-5 py-2 rounded-xl bg-[#FF4FA3] hover:bg-[#FF3393] text-white font-bricolage font-bold text-xs border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingPost ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE DIALOG ─── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Instagram Post?"
        message="Are you sure you want to permanently delete this Instagram post? Any hosted image will also be removed."
        itemName={deleteTarget?.description || deleteTarget?.alt || "Selected Post"}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
}
