"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { Review } from "@/types/admin";
import { ReviewFormModal } from "@/components/admin/ReviewFormModal";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { 
  Plus, 
  Star, 
  Edit3, 
  Trash2, 
  Save, 
  CheckCircle2, 
  X, 
  Sparkles,
  Quote
} from "lucide-react";

export default function AdminReviewsPage() {
  const { reviews, addReview, updateReview, deleteReview } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  // Inline editing state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineName, setInlineName] = useState("");
  const [inlineQuote, setInlineQuote] = useState("");
  const [inlineRating, setInlineRating] = useState(5);

  const startInlineEdit = (rev: Review) => {
    setInlineEditId(rev.id);
    setInlineName(rev.customerName);
    setInlineQuote(rev.review);
    setInlineRating(rev.rating);
  };

  const saveInlineEdit = (id: string) => {
    updateReview(id, {
      customerName: inlineName.trim(),
      review: inlineQuote.trim(),
      rating: inlineRating,
    });
    setInlineEditId(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── TOP ACTION BAR & HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bowlby text-2xl text-[#3E2A24]">
              Customer Reviews
            </h2>
            <span className="bg-[#FFE26E] text-[#3E2A24] text-xs font-bricolage font-black px-2.5 py-0.5 rounded-full border-2 border-[#3E2A24]">
              {reviews.length} Testimonials
            </span>
          </div>
          <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] mt-1">
            Publish, edit ratings, and highlight genuine bakery guest feedback
          </p>
        </div>

        {/* Add Review Button */}
        <button
          onClick={() => {
            setEditingReview(null);
            setModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] active:translate-y-0 text-[#3E2A24] font-bricolage font-extrabold text-sm border-[3.5px] border-[#3E2A24] shadow-[4px_4px_0_#3E2A24] hover:shadow-[6px_6px_0_#3E2A24] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <div className="w-6 h-6 rounded-lg bg-white border border-[#3E2A24] flex items-center justify-center">
            <Plus className="w-4 h-4 text-[#3E2A24]" />
          </div>
          <span>Add Customer Review</span>
        </button>
      </div>

      {/* ─── REVIEWS CARDS GRID ─── */}
      {reviews.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
          <div className="text-5xl mb-3">⭐</div>
          <h3 className="font-bowlby text-xl text-[#3E2A24]">No Reviews Recorded</h3>
          <p className="font-kalam text-sm text-[#5F4A3A] mt-1 mb-4">
            Click above to record your first guest testimonial
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs shadow-[2px_2px_0_#3E2A24]"
          >
            Create Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => {
            const isEditing = inlineEditId === rev.id;

            return (
              <div
                key={rev.id}
                className="bg-[#FFFDF8] rounded-3xl border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] hover:shadow-[8px_8px_0_#3E2A24] transition-all p-6 flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Decorative watermark quote */}
                <Quote className="absolute top-4 right-4 w-16 h-16 text-[#3E2A24]/5 pointer-events-none" />

                <div>
                  {/* Top Customer Row: Avatar, Name, Rating */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl border-2 border-[#3E2A24] overflow-hidden bg-[#FFE26E] shadow-[2px_2px_0_#3E2A24] shrink-0">
                        <Image
                          src={rev.customerImage || rev.portrait || "/placeholder-user.jpg"}
                          alt={rev.customerName || rev.name || "Customer"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={inlineName}
                            onChange={(e) => setInlineName(e.target.value)}
                            className="px-2 py-1 rounded-lg bg-white border-2 border-[#3E2A24] font-bricolage font-bold text-sm text-[#3E2A24]"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bowlby text-base text-[#3E2A24]">
                              {rev.customerName || rev.name}
                            </h3>
                            {rev.verified && (
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] fill-[#10B981]/20" />
                            )}
                          </div>
                        )}
                        <span className="font-kalam text-xs text-[#5F4A3A]">
                          {rev.date || rev.profession || "Verified Review"}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Display / Editor */}
                    <div className="bg-[#FFF9F5] px-3 py-1.5 rounded-2xl border-2 border-[#3E2A24] flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setInlineRating(star)}
                              className="text-base cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= inlineRating
                                    ? "text-[#FFE26E] fill-[#FFE26E]"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? "text-[#FFE26E] fill-[#FFE26E] stroke-[#3E2A24] stroke-[1.2]"
                                  : "text-gray-300 fill-transparent"
                              }`}
                            />
                          ))}
                          <span className="font-bricolage font-black text-xs text-[#3E2A24] ml-1">
                            {rev.rating}.0
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="my-3">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={inlineQuote}
                        onChange={(e) => setInlineQuote(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#3E2A24] font-kalam text-sm text-[#3E2A24] resize-none"
                      />
                    ) : (
                      <p className="font-kalam text-base text-[#3E2A24] leading-relaxed">
                        "{rev.review}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons (Edit, Save, Delete) */}
                <div className="pt-4 mt-3 border-t-[2.5px] border-[#3E2A24]/15 flex items-center justify-between gap-2">
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
                        onClick={() => saveInlineEdit(rev.id)}
                        className="px-4 py-1.5 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        {/* Full Edit Modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReview(rev);
                            setModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FFECC8] hover:bg-[#FFE26E] border-2 border-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] flex items-center gap-1.5 cursor-pointer transition-all hover:translate-y-[-1px]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#FF4FA3]" />
                          <span>Edit</span>
                        </button>

                        {/* Quick Inline Edit */}
                        <button
                          type="button"
                          onClick={() => startInlineEdit(rev)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF6E8] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#5F4A3A] cursor-pointer"
                        >
                          Quick Edit
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(rev)}
                        className="w-8 h-8 rounded-xl bg-[#FFFDF8] hover:bg-[#FF4FA3] hover:text-white border-2 border-[#3E2A24] shadow-[1.5px_1.5px_0_#3E2A24] flex items-center justify-center text-[#FF4FA3] transition-colors cursor-pointer"
                        title="Delete review"
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

      {/* ─── ADD / EDIT REVIEW MODAL ─── */}
      <ReviewFormModal
        isOpen={modalOpen}
        initialData={editingReview}
        onSave={(data) => {
          if (editingReview) {
            updateReview(editingReview.id, data);
          } else {
            addReview(data);
          }
        }}
        onClose={() => {
          setModalOpen(false);
          setEditingReview(null);
        }}
      />

      {/* ─── DELETE CONFIRMATION DIALOG ─── */}
      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Customer Review?"
        message="Are you sure you want to remove this testimonial? It will be removed from your public reviews carousel."
        itemName={deleteTarget?.customerName}
        onConfirm={() => {
          if (deleteTarget) {
            deleteReview(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
