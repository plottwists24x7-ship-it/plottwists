"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { Bake, BakeCategory } from "@/types/admin";
import { BakeFormModal } from "@/components/admin/BakeFormModal";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  Sparkles, 
  Check, 
  X, 
  Tag 
} from "lucide-react";

const CATEGORIES: Array<BakeCategory | "All"> = [
  "All",
  "Cheesecakes",
  "Brownies",
  "Cookies",
  "Cakes",
  "Tiramisu",
  "Pastries",
];

export default function AdminBakesPage() {
  const { bakes, addBake, updateBake, deleteBake } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BakeCategory | "All">("All");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBake, setEditingBake] = useState<Bake | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Bake | null>(null);

  // Inline edit state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineName, setInlineName] = useState("");
  const [inlinePrice, setInlinePrice] = useState("");
  const [inlineDesc, setInlineDesc] = useState("");

  const startInlineEdit = (bake: Bake) => {
    setInlineEditId(bake.id);
    setInlineName(bake.name);
    setInlinePrice(bake.price || "");
    setInlineDesc(bake.description);
  };

  const saveInlineEdit = (id: string) => {
    updateBake(id, {
      name: inlineName.trim(),
      price: inlinePrice.trim() || undefined,
      description: inlineDesc.trim(),
    });
    setInlineEditId(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
  };

  // Filtered bakes list
  const filteredBakes = useMemo(() => {
    return bakes.filter((b) => {
      const matchCat = selectedCategory === "All" || b.category === selectedCategory;
      const matchSearch = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.badge && b.badge.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [bakes, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* ─── TOP ACTION BAR & STATS HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bowlby text-2xl text-[#3E2A24]">
              Our Bakes Catalog
            </h2>
            <span className="bg-[#FFE26E] text-[#3E2A24] text-xs font-bricolage font-black px-2.5 py-0.5 rounded-full border-2 border-[#3E2A24]">
              {bakes.length} Items
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1">
            Real-time menu manager with image previews, category ribbons & pricing
          </p>
        </div>

        {/* Large Add Bake Button */}
        <button
          onClick={() => {
            setEditingBake(null);
            setModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[6px_6px_0_#3E2A24] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <div className="w-6 h-6 rounded-lg bg-white border border-[#3E2A24] flex items-center justify-center">
            <Plus className="w-4 h-4 text-[#3E2A24]" />
          </div>
          <span>Add New Bake</span>
        </button>
      </div>

      {/* ─── FILTERS & SEARCH ROW ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, description, badge..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF8] border-[3px] border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24] focus:outline-none focus:bg-[#FFECC8]/30 shadow-[2px_2px_0_#3E2A24]"
          />
          <Search className="w-4 h-4 text-[#5F4A3A] absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FF4FA3]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bricolage font-black whitespace-nowrap transition-all border-2 border-[#3E2A24] cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#FF4FA3] text-white shadow-[2.5px_2.5px_0_#3E2A24]"
                  : "bg-[#FFFDF8] text-[#3E2A24] hover:bg-[#FFECC8] shadow-[1.5px_1.5px_0_#3E2A24]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── EDITABLE PRODUCT CARDS GRID ─── */}
      {filteredBakes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
          <div className="text-5xl mb-3">🧁</div>
          <h3 className="font-bowlby text-xl text-[#3E2A24]">No Bakes Found</h3>
          <p className="font-kalam text-sm text-[#5F4A3A] mt-1 mb-4">
            Try adjusting your search query or filter category
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs shadow-[2px_2px_0_#3E2A24]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBakes.map((bake) => {
            const isEditing = inlineEditId === bake.id;

            return (
              <div
                key={bake.id}
                className="bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] hover:shadow-[8px_8px_0_#3E2A24] transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Image Container with Ribbon Badge */}
                  <div className="relative w-full h-56 bg-[#FFECC8]/40 border-b-[3px] border-[#3E2A24] overflow-hidden">
                    <Image
                      src={bake.image}
                      alt={bake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />

                    {/* Ribbon Badge */}
                    {bake.badge && (
                      <div className="absolute top-3 left-3 bg-[#FFE26E] text-[#3E2A24] border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] font-bricolage font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full transform -rotate-3">
                        {bake.badge}
                      </div>
                    )}

                    {/* Category Stamp */}
                    <div className="absolute top-3 right-3 bg-[#FFFDF8]/90 backdrop-blur-sm text-[#3E2A24] border-2 border-[#3E2A24] font-bricolage font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-lg shadow-sm">
                      {bake.category}
                    </div>

                    {bake.isPopular && (
                      <div className="absolute bottom-3 left-3 bg-[#FF4FA3] text-white border-2 border-[#3E2A24] font-bricolage font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Hero Feature</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    {isEditing ? (
                      /* Inline Edit Form */
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-black uppercase text-[#5F4A3A]">Title</label>
                          <input
                            type="text"
                            value={inlineName}
                            onChange={(e) => setInlineName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-[#5F4A3A]">Price</label>
                          <input
                            type="text"
                            value={inlinePrice}
                            onChange={(e) => setInlinePrice(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-[#5F4A3A]">Description</label>
                          <textarea
                            rows={3}
                            value={inlineDesc}
                            onChange={(e) => setInlineDesc(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-kalam text-xs text-[#3E2A24] resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bowlby text-lg sm:text-xl text-[#3E2A24] leading-tight">
                            {bake.name}
                          </h3>
                          {bake.price && (
                            <span className="font-bricolage font-black text-base text-[#FF4FA3] shrink-0 bg-[#FFF6E8] px-2.5 py-0.5 rounded-xl border border-[#3E2A24]/30">
                              {bake.price}
                            </span>
                          )}
                        </div>

                        <p className="font-kalam text-sm text-[#5F4A3A] line-clamp-3 leading-relaxed">
                          {bake.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons (Edit, Save, Delete) */}
                <div className="p-4 bg-[#FFF9F5] border-t-[3px] border-[#3E2A24]/20 flex items-center justify-between gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full justify-end">
                      <button
                        type="button"
                        onClick={cancelInlineEdit}
                        className="px-3 py-1.5 rounded-xl bg-white border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => saveInlineEdit(bake.id)}
                        className="px-4 py-1.5 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        {/* Full Edit in Modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBake(bake);
                            setModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#FFECC8] hover:bg-[#FFE26E] border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] flex items-center gap-1.5 cursor-pointer transition-all hover:translate-y-[-1px]"
                          title="Full Modal Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#FF4FA3]" />
                          <span>Edit</span>
                        </button>

                        {/* Quick Inline Edit Toggle */}
                        <button
                          type="button"
                          onClick={() => startInlineEdit(bake)}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-[#FFF6E8] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#5F4A3A] cursor-pointer"
                          title="Quick text edit"
                        >
                          Quick Edit
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(bake)}
                        className="w-9 h-9 rounded-xl bg-[#FFFDF8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center justify-center text-[#FF4FA3] transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── ADD / EDIT MODAL ─── */}
      <BakeFormModal
        isOpen={modalOpen}
        initialData={editingBake}
        onSave={(data) => {
          if (editingBake) {
            updateBake(editingBake.id, data);
          } else {
            addBake(data);
          }
        }}
        onClose={() => {
          setModalOpen(false);
          setEditingBake(null);
        }}
      />

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Bake Product?"
        message="Are you sure you want to delete this dessert from your menu? It will be removed immediately from your public bakery catalog."
        itemName={deleteTarget?.name}
        onConfirm={() => {
          if (deleteTarget) {
            deleteBake(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
