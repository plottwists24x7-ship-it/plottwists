"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Clock, ExternalLink } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AdminSidebar } from "./AdminSidebar";

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": {
    title: "Bakery Dashboard",
    subtitle: "Overview of your bakes, gallery showcase & customer reviews",
  },
  "/admin/hero": {
    title: "Hero Section Cover",
    subtitle: "Customize the storefront featured cheesecake polaroid and captions",
  },
  "/admin/story": {
    title: "Story Images",
    subtitle: "Replace and update Story section polaroid photo and 3 highlight badges",
  },
  "/admin/bakes": {
    title: "Our Bakes Menu",
    subtitle: "Manage, price and publish your handcrafted desserts",
  },
  "/admin/gallery": {
    title: "Bakery Gallery",
    subtitle: "Showcase behind-the-scenes moments and kitchen craftsmanship",
  },
  "/admin/reviews": {
    title: "Customer Reviews",
    subtitle: "Highlight genuine customer testimonials & 5-star ratings",
  },
};

export function AdminHeader() {
  const pathname = usePathname();
  const { stats } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMeta = TITLE_MAP[pathname] || {
    title: "Admin Portal",
    subtitle: "Manage your PlotTwist24x bakery content",
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFDF8]/90 backdrop-blur-md border-b-[4px] border-[#3E2A24] px-6 sm:px-8 py-4 flex items-center justify-between">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-[#FFE26E] border-2 border-[#3E2A24] shadow-[2px_2px_0_#3E2A24] flex items-center justify-center text-[#3E2A24] cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-bowlby text-xl sm:text-2xl text-[#3E2A24] tracking-tight flex items-center gap-2">
              <span>{activeMeta.title}</span>
            </h1>
            <p className="font-kalam text-xs sm:text-sm text-[#5F4A3A] hidden sm:block">
              {activeMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Stats Status & Storefront Shortcut */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFECC8] border-2 border-[#3E2A24] text-xs font-bricolage font-bold text-[#3E2A24]">
            <Clock className="w-3.5 h-3.5 text-[#FF4FA3]" />
            <span>Updated: {stats.lastUpdated}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#FF4FA3] text-white border-[2.5px] border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] hover:bg-[#ff3b99] hover:translate-y-[-1px] font-bricolage font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <span className="hidden sm:inline">Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-[#3E2A24]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-80 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center text-[#3E2A24]"
            >
              <X className="w-4 h-4" />
            </button>
            <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
