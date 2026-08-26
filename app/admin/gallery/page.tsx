"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { GalleryImage, GalleryCategory } from "@/types/admin";
import { GalleryFormModal } from "@/components/admin/GalleryFormModal";
import { GalleryUploadModal } from "@/components/admin/GalleryUploadModal";
import { ImagePreviewModal } from "@/components/admin/ImagePreviewModal";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  UploadCloud, 
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
  const { gallery, addGalleryImage, addMultipleGalleryImages, updateGalleryImage, deleteGalleryImage } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "All">("All");
  
  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  // Filtered gallery list
  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.alt && item.alt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [gallery, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* ─── TOP ACTION BAR & STATS HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#FFFDF8] border-[3.5px] border-[#3E2A24] shadow-[5px_5px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bowlby text-xl sm:text-2xl text-[#3E2A24]">
              Bakery Photo Gallery
            </h2>
            <span className="bg-[#FFE26E] text-[#3E2A24] text-xs font-bricolage font-black px-2.5 py-0.5 rounded-full border-2 border-[#3E2A24]">
              {gallery.length} Photos
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1">
            Behind-the-scenes photography, stone oven baking & handcrafted packaging
          </p>
        </div>

        {/* Action Buttons: Add Photo & Batch Upload */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setBatchModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFECC8] text-[#3E2A24] font-bricolage font-bold text-xs border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
            title="Upload multiple photos simultaneously"
          >
            <UploadCloud className="w-4 h-4 text-[#FF4FA3]" />
            <span className="hidden sm:inline">Batch Upload</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingImage(null);
              setFormModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-xs sm:text-sm border-[3px] border-[#3E2A24] shadow-[3.5px_3.5px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <div className="w-5 h-5 rounded-lg bg-white border border-[#3E2A24] flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-[#3E2A24]" />
            </div>
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* ─── FILTERS & SEARCH ROW ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery photos by title or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] text-xs sm:text-sm font-bricolage text-[#3E2A24] placeholder:text-[#5F4A3A]/40 focus:outline-none focus:bg-[#FFECC8]/30 shadow-[2px_2px_0_#3E2A24]"
          />
          <Search className="w-4 h-4 text-[#5F4A3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bricolage font-bold whitespace-nowrap transition-all border-2 border-[#3E2A24] cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#FF4FA3] text-white shadow-[2px_2px_0_#3E2A24]"
                  : "bg-[#FFFDF8] text-[#3E2A24] hover:bg-[#FFECC8] shadow-[1.5px_1.5px_0_#3E2A24]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── GALLERY CARDS GRID ─── */}
      {filteredGallery.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#FFFDF8] border-[3.5px] border-[#3E2A24] shadow-[5px_5px_0_#3E2A24]">
          <div className="text-5xl mb-3">🖼️</div>
          <h3 className="font-bowlby text-xl text-[#3E2A24]">No Photos Found</h3>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1 mb-4">
            {searchQuery ? "Try refining your search terms" : "Upload your first photo for this category"}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs shadow-[2px_2px_0_#3E2A24] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDF8] rounded-3xl border-[3.5px] border-[#3E2A24] shadow-[5px_5px_0_#3E2A24] hover:shadow-[7px_7px_0_#3E2A24] transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Photo Frame Container */}
              <div className="relative w-full h-56 bg-[#FFECC8]/40 border-b-[3px] border-[#3E2A24] overflow-hidden">
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
              <div className="p-4 space-y-1.5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bowlby text-base sm:text-lg text-[#3E2A24] leading-tight">
                    {item.title}
                  </h3>
                </div>

                {item.caption ? (
                  <p className="font-kalam text-xs text-[#5F4A3A] line-clamp-2 leading-relaxed">
                    "{item.caption}"
                  </p>
                ) : (
                  <p className="font-kalam text-xs text-[#5F4A3A]/50 italic">
                    No caption note provided
                  </p>
                )}
              </div>

              {/* Bottom Action Strip: Edit, Preview, Delete */}
              <div className="p-3 bg-[#FFF9F5] border-t-[2.5px] border-[#3E2A24]/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Edit Photo Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingImage(item);
                      setFormModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FFECC8] hover:bg-[#FFE26E] border-2 border-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] flex items-center gap-1.5 cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FF4FA3]" />
                    <span>Edit Photo</span>
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

      {/* ─── SINGLE PHOTO FORM MODAL (ADD / EDIT) ─── */}
      <GalleryFormModal
        isOpen={formModalOpen}
        initialData={editingImage}
        onSave={async (data) => {
          if (editingImage) {
            return await updateGalleryImage(editingImage.id, data);
          } else {
            return (await addGalleryImage(data)) !== null;
          }
        }}
        onClose={() => {
          setFormModalOpen(false);
          setEditingImage(null);
        }}
      />

      {/* ─── BATCH UPLOAD MODAL ─── */}
      <GalleryUploadModal
        isOpen={batchModalOpen}
        onUpload={(items) => addMultipleGalleryImages(items)}
        onClose={() => setBatchModalOpen(false)}
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
        message="Are you sure you want to remove this image from your bakery gallery showcase? It will be deleted immediately."
        itemName={deleteTarget?.title}
        onConfirm={async () => {
          if (deleteTarget) {
            if (await deleteGalleryImage(deleteTarget.id)) {
              setDeleteTarget(null);
            }
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
