"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { GalleryImage, GalleryCategory } from "@/types/admin";
import { GalleryUploadModal } from "@/components/admin/GalleryUploadModal";
import { ImagePreviewModal } from "@/components/admin/ImagePreviewModal";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { 
  UploadCloud, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Sparkles, 
  Tag, 
  Camera 
} from "lucide-react";

const CATEGORIES: Array<GalleryCategory | "All"> = [
  "All",
  "Kitchen & Oven",
  "Display & Store",
  "Packaging",
  "Decorating",
  "Ingredients",
  "Events",
];

export default function AdminGalleryPage() {
  const { gallery, addMultipleGalleryImages, updateGalleryImage, deleteGalleryImage } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "All">("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  // Hidden file input for Replace Image action
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const triggerReplaceImage = (id: string) => {
    setReplacingId(id);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFile = (file: File) => {
    if (!replacingId || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateGalleryImage(replacingId, {
          image: e.target.result as string,
        });
        setReplacingId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      return selectedCategory === "All" || item.category === selectedCategory;
    });
  }, [gallery, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* ─── TOP ACTION BAR & STATS HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bowlby text-2xl text-[#3E2A24]">
              Bakery Photo Gallery
            </h2>
            <span className="bg-[#FFE26E] text-[#3E2A24] text-xs font-bricolage font-black px-2.5 py-0.5 rounded-full border-2 border-[#3E2A24]">
              {gallery.length} Snapshots
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1">
            Behind-the-scenes photography, stone oven baking & handcrafted packaging
          </p>
        </div>

        {/* Upload Images Button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[6px_6px_0_#3E2A24] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <div className="w-6 h-6 rounded-lg bg-white border border-[#3E2A24] flex items-center justify-center">
            <UploadCloud className="w-4 h-4 text-[#3E2A24]" />
          </div>
          <span>Upload Photos (Batch)</span>
        </button>
      </div>

      {/* ─── CATEGORY FILTER PILLS ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bricolage font-black whitespace-nowrap transition-all border-2 border-[#3E2A24] cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#FF4FA3] text-white shadow-[2.5px_2.5px_0_#3E2A24]"
                : "bg-[#FFFDF8] text-[#3E2A24] hover:bg-[#FFECC8] shadow-[1.5px_1.5px_0_#3E2A24]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── GALLERY GRID / MASONRY ─── */}
      {filteredGallery.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
          <div className="text-5xl mb-3">🖼️</div>
          <h3 className="font-bowlby text-xl text-[#3E2A24]">No Photos in This Category</h3>
          <p className="font-kalam text-sm text-[#5F4A3A] mt-1 mb-4">
            Upload new moments or switch category filters
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="px-4 py-2 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs shadow-[2px_2px_0_#3E2A24]"
          >
            Show All Photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] hover:shadow-[8px_8px_0_#3E2A24] transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Photo Frame Container */}
              <div className="relative w-full h-64 bg-[#FFECC8]/40 border-b-[3px] border-[#3E2A24] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setPreviewImage(item)}
                  unoptimized
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-[#FFE26E] text-[#3E2A24] border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] font-bricolage font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                  {item.category}
                </div>

                {/* Lightbox Quick Trigger Overlay */}
                <button
                  type="button"
                  onClick={() => setPreviewImage(item)}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#FFFDF8]/90 backdrop-blur-sm hover:bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24] shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Click to zoom preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Card Meta Body */}
              <div className="p-5 space-y-1.5 flex-1">
                <h3 className="font-bowlby text-lg text-[#3E2A24] leading-tight">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="font-kalam text-xs text-[#5F4A3A] line-clamp-2">
                    "{item.caption}"
                  </p>
                )}
              </div>

              {/* Bottom Action Strip: Replace Image, Delete, Preview */}
              <div className="p-3 bg-[#FFF9F5] border-t-[3px] border-[#3E2A24]/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Replace Image Button */}
                  <button
                    type="button"
                    onClick={() => triggerReplaceImage(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFECC8] hover:bg-[#FFE26E] border-2 border-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] flex items-center gap-1.5 cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF4FA3]" />
                    <span>Replace Image</span>
                  </button>

                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewImage(item)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF6E8] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#5F4A3A] flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="w-8 h-8 rounded-xl bg-[#FFFDF8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] flex items-center justify-center text-[#FF4FA3] transition-colors cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input for Replace Action */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleReplaceFile(e.target.files[0]);
          }
        }}
      />

      {/* ─── MULTI-FILE UPLOAD MODAL ─── */}
      <GalleryUploadModal
        isOpen={uploadModalOpen}
        onUpload={(items) => addMultipleGalleryImages(items)}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* ─── LIGHTBOX PREVIEW MODAL ─── */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* ─── DELETE CONFIRMATION DIALOG ─── */}
      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Gallery Photo?"
        message="Are you sure you want to remove this image from the gallery showcase? This cannot be undone."
        itemName={deleteTarget?.title}
        onConfirm={() => {
          if (deleteTarget) {
            deleteGalleryImage(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
