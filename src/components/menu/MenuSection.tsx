"use client";

import React, { useState, useEffect } from "react";
import { MENU_CATEGORIES } from "./menu-data";
import { MenuHeading } from "./MenuHeading";
import { MenuCategorySheet } from "./MenuCategorySheet";
import { MenuOrderCTA } from "./MenuOrderCTA";
import { MenuDecorations } from "./MenuDecorations";
import { PlotTwistRisographPaper } from "./PlotTwistRisographPaper";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>("boxes");
  const boxesCategory = MENU_CATEGORIES.find((c) => c.id === "boxes")!;
  const jarsCategory = MENU_CATEGORIES.find((c) => c.id === "jars")!;
  const wafflesCategory = MENU_CATEGORIES.find((c) => c.id === "waffles")!;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const catId = entry.target.id.replace("menu-sheet-", "");
            setActiveCategory(catId);
            break;
          }
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );

    ["boxes", "jars", "waffles"].forEach((id) => {
      const el = document.getElementById(`menu-sheet-${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(`menu-sheet-${categoryId}`);
    if (el) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
      const headerOffset = isMobile ? 135 : 95;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  return (
    <section
      id="menu"
      aria-label="PlotTwist Bakery Menu"
      className="relative scroll-mt-28 md:scroll-mt-32 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-6 md:px-8 lg:px-10 w-full overflow-x-clip select-none"
    >
      {/* ── DEDICATED RISOGRAPH BAKERY SCRAPBOOK PAPER CANVAS ── */}
      <PlotTwistRisographPaper />

      {/* ── MAIN CONTENT CONTAINER (Compact Vertical Rhythm) ── */}
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Floating Sticker & Doodle Layer (Relative to Content Grid) */}
        <MenuDecorations />

        {/* 1. Compact Editorial "THE MENU." Heading & Taped Note */}
        <MenuHeading />

        {/* 1B. Mobile Scrapbook Category Quick-Navigator (Compact & Sticky) */}
        <div className="block lg:hidden sticky top-[72px] z-30 mb-5 py-2 -mx-4 px-4 bg-[#FBF7F0]/90 backdrop-blur-xs">
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto p-1 bg-[#FAF4E8] border-2 border-[#3B2922] rounded-full shadow-[3px_3px_0_#3B2922]">
            <button
              onClick={() => scrollToCategory("boxes")}
              className={`flex-1 py-1 px-2 rounded-full text-[11px] font-bold font-fredoka uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === "boxes"
                  ? "bg-[#FF85A1] text-white shadow-[1.5px_1.5px_0_#3B2922] scale-102"
                  : "text-[#3B2922] hover:bg-[#FFD4DF]/60"
              }`}
            >
              01 BOXES
            </button>
            <button
              onClick={() => scrollToCategory("jars")}
              className={`flex-1 py-1 px-2 rounded-full text-[11px] font-bold font-fredoka uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === "jars"
                  ? "bg-[#FFD600] text-[#3B2922] shadow-[1.5px_1.5px_0_#3B2922] scale-102"
                  : "text-[#3B2922] hover:bg-[#FFEAA0]/60"
              }`}
            >
              02 JARS
            </button>
            <button
              onClick={() => scrollToCategory("waffles")}
              className={`flex-1 py-1 px-2 rounded-full text-[11px] font-bold font-fredoka uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === "waffles"
                  ? "bg-[#8EC2FF] text-[#3B2922] shadow-[1.5px_1.5px_0_#3B2922] scale-102"
                  : "text-[#3B2922] hover:bg-[#BDE0FE]/60"
              }`}
            >
              03 WAFFLES
            </button>
          </div>
        </div>

        {/* 2. Asymmetric Compact Stationery Sheets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-6 items-start relative">
          
          {/* Left Column: 01 / BOXES (Spans 7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <MenuCategorySheet category={boxesCategory} />
          </div>

          {/* Right Column: 02 / JARS + 03 / WAFFLES (Spans 5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 relative">
            {/* 02 / JARS Sheet */}
            <MenuCategorySheet category={jarsCategory} />

            {/* 03 / WAFFLES Sheet */}
            <MenuCategorySheet category={wafflesCategory} />
          </div>

        </div>

        {/* 3. Integrated Bottom Scrapbook Order Card */}
        <MenuOrderCTA />

      </div>
    </section>
  );
}

export default MenuSection;
