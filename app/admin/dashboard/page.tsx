"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { StatCard } from "@/components/admin/StatCard";
import { BakeFormModal } from "@/components/admin/BakeFormModal";
import { GalleryUploadModal } from "@/components/admin/GalleryUploadModal";
import { ReviewFormModal } from "@/components/admin/ReviewFormModal";
import { 
  Plus, 
  ArrowRight, 
  CakeSlice, 
  Images, 
  MessageSquareHeart, 
  Sparkles, 
  BookOpen,
  Star,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const { 
    bakes, 
    gallery, 
    reviews, 
    stats, 
    addBake, 
    addMultipleGalleryImages, 
    addReview,
    resetToDefaults 
  } = useAdmin();

  const [bakeModalOpen, setBakeModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* ─── WELCOME BANNER ─── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFECC8] border-[4px] border-[#3E2A24] shadow-[8px_8px_0_#3E2A24] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative Stamp */}
        <div className="absolute top-2 right-4 text-7xl opacity-10 pointer-events-none select-none">
          🧁
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF4FA3] text-white border-2 border-[#3E2A24] text-xs font-bricolage font-black uppercase shadow-sm mb-2">
            <Sparkles className="w-3 h-3" />
            <span>PlotTwist24x Bakery Manager</span>
          </div>
          <h2 className="font-bowlby text-2xl sm:text-3xl text-[#3E2A24] tracking-tight">
            Welcome back, Head Baker!
          </h2>
          <p className="font-kalam text-sm sm:text-base text-[#5F4A3A] font-semibold mt-1">
            Update dessert offerings, manage kitchen gallery moments, and curate 5-star customer reviews.
          </p>
        </div>

        {/* Quick Reset & Storefront Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFF6E8] text-[#3E2A24] font-bricolage font-bold text-xs border-[2.5px] border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center gap-1.5 cursor-pointer transition-all"
            title="Reset to default initial bakery demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* ─── 4 CLEAN STATISTICS CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Bakes"
          value={stats.totalBakes}
          icon="🧁"
          bgColor="bg-[#FFE26E]"
          href="/admin/bakes"
          description="Active bakery menu items"
        />
        <StatCard
          label="Gallery Images"
          value={stats.galleryImages}
          icon="🖼️"
          bgColor="bg-[#FFF9F5]"
          href="/admin/gallery"
          description="Kitchen & bakery photos"
        />
        <StatCard
          label="Total Reviews"
          value={stats.totalReviews}
          icon="⭐"
          bgColor="bg-[#FFECC8]"
          href="/admin/reviews"
          description="Customer testimonials"
        />
        <StatCard
          label="Last Updated"
          value={stats.lastUpdated.split(" ")[0]}
          icon="🕒"
          bgColor="bg-[#FFFDF8]"
          description={stats.lastUpdated}
        />
      </div>

      {/* ─── QUICK SHORTCUTS ROW ─── */}
      <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bowlby text-lg text-[#3E2A24]">
            Quick Bakery Actions
          </h3>
          <span className="font-kalam text-xs text-[#5F4A3A]">
            One-click content creators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/hero"
            className="p-4 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFECC8] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-3 font-bricolage font-bold text-sm text-[#3E2A24] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#3E2A24] flex items-center justify-center text-xl shrink-0">
              <Sparkles className="w-5 h-5 text-[#FF4FA3]" />
            </div>
            <div>
              <p className="font-black text-sm">Hero Cover</p>
              <p className="font-kalam text-xs text-[#5F4A3A]">Storefront polaroid</p>
            </div>
          </Link>

          <Link
            href="/admin/story"
            className="p-4 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFECC8] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-3 font-bricolage font-bold text-sm text-[#3E2A24] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#3E2A24] flex items-center justify-center text-xl shrink-0">
              <BookOpen className="w-5 h-5 text-[#FF4FA3]" />
            </div>
            <div>
              <p className="font-black text-sm">Story Images</p>
              <p className="font-kalam text-xs text-[#5F4A3A]">Polaroid & badges</p>
            </div>
          </Link>

          <button
            onClick={() => setBakeModalOpen(true)}
            className="p-4 rounded-2xl bg-[#FFE26E] hover:bg-[#ffd633] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-3 font-bricolage font-bold text-sm text-[#3E2A24] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#3E2A24] flex items-center justify-center text-xl shrink-0">
              <Plus className="w-5 h-5 text-[#3E2A24]" />
            </div>
            <div>
              <p className="font-black text-sm">Add New Bake</p>
              <p className="font-kalam text-xs text-[#5F4A3A]">Post a dessert product</p>
            </div>
          </button>

          <button
            onClick={() => setGalleryModalOpen(true)}
            className="p-4 rounded-2xl bg-[#FFECC8] hover:bg-[#ffe2a8] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-3 font-bricolage font-bold text-sm text-[#3E2A24] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#3E2A24] flex items-center justify-center text-xl shrink-0">
              <Images className="w-5 h-5 text-[#FF4FA3]" />
            </div>
            <div>
              <p className="font-black text-sm">Upload Photos</p>
              <p className="font-kalam text-xs text-[#5F4A3A]">Add gallery snapshots</p>
            </div>
          </button>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="p-4 rounded-2xl bg-[#FFF6E8] hover:bg-[#FFE26E] border-[3px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:shadow-[5px_5px_0_#3E2A24] hover:-translate-y-0.5 flex items-center gap-3 font-bricolage font-bold text-sm text-[#3E2A24] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#3E2A24] flex items-center justify-center text-xl shrink-0">
              <Star className="w-5 h-5 text-[#FF4FA3] fill-[#FF4FA3]" />
            </div>
            <div>
              <p className="font-black text-sm">Add Review</p>
              <p className="font-kalam text-xs text-[#5F4A3A]">Record guest feedback</p>
            </div>
          </button>
        </div>
      </div>

      {/* ─── PREVIEW OVERVIEW: RECENT BAKES & REVIEWS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bakes Section */}
        <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-[2.5px] border-[#3E2A24]/20 mb-4">
              <div className="flex items-center gap-2">
                <CakeSlice className="w-5 h-5 text-[#FF4FA3]" />
                <h3 className="font-bowlby text-lg text-[#3E2A24]">
                  Recent Bakes
                </h3>
              </div>
              <Link
                href="/admin/bakes"
                className="text-xs font-bricolage font-bold text-[#FF4FA3] hover:underline flex items-center gap-1"
              >
                <span>View All ({bakes.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {bakes.slice(0, 4).map((bake) => (
                <div
                  key={bake.id}
                  className="p-3 bg-[#FFF9F5] rounded-2xl border-2 border-[#3E2A24]/40 flex items-center justify-between gap-3 hover:bg-[#FFECC8]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl border-2 border-[#3E2A24] overflow-hidden bg-white shrink-0">
                      <Image
                        src={bake.image}
                        alt={bake.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bricolage font-bold text-sm text-[#3E2A24] truncate">
                        {bake.name}
                      </p>
                      <p className="font-kalam text-xs text-[#5F4A3A]">
                        {bake.category} {bake.price ? `• ${bake.price}` : ""}
                      </p>
                    </div>
                  </div>

                  {bake.badge && (
                    <span className="bg-[#FFE26E] text-[#3E2A24] text-[10px] font-bricolage font-black px-2 py-0.5 rounded-full border border-[#3E2A24] shrink-0">
                      {bake.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-[#3E2A24]/10 text-center">
            <Link
              href="/admin/bakes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] hover:bg-[#ffd633] shadow-[2px_2px_0_#3E2A24]"
            >
              <span>Manage Bakery Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="p-6 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3E2A24] shadow-[6px_6px_0_#3E2A24] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-[2.5px] border-[#3E2A24]/20 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#FF4FA3]" />
                <h3 className="font-bowlby text-lg text-[#3E2A24]">
                  Recent Reviews
                </h3>
              </div>
              <Link
                href="/admin/reviews"
                className="text-xs font-bricolage font-bold text-[#FF4FA3] hover:underline flex items-center gap-1"
              >
                <span>View All ({reviews.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {reviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 bg-[#FFF9F5] rounded-2xl border-2 border-[#3E2A24]/40 hover:bg-[#FFECC8]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 rounded-full border border-[#3E2A24] overflow-hidden bg-[#FFE26E]">
                        <Image
                          src={rev.customerImage || rev.portrait || "/placeholder-user.jpg"}
                          alt={rev.customerName || rev.name || "Customer"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="font-bricolage font-bold text-xs text-[#3E2A24]">
                        {rev.customerName || rev.name}
                      </span>
                    </div>

                    <div className="flex text-amber-500 text-xs">
                      {"★".repeat(rev.rating)}
                    </div>
                  </div>

                  <p className="font-kalam text-xs text-[#5F4A3A] line-clamp-2">
                    "{rev.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-[#3E2A24]/10 text-center">
            <Link
              href="/admin/reviews"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFECC8] border-2 border-[#3E2A24] font-bricolage font-bold text-xs text-[#3E2A24] hover:bg-[#ffe2a8] shadow-[2px_2px_0_#3E2A24]"
            >
              <span>Manage Testimonials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── MODALS ─── */}
      <BakeFormModal
        isOpen={bakeModalOpen}
        onSave={(data) => addBake(data)}
        onClose={() => setBakeModalOpen(false)}
      />

      <GalleryUploadModal
        isOpen={galleryModalOpen}
        onUpload={(items) => addMultipleGalleryImages(items)}
        onClose={() => setGalleryModalOpen(false)}
      />

      <ReviewFormModal
        isOpen={reviewModalOpen}
        onSave={(data) => addReview(data)}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
}
