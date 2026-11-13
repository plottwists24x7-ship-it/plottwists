"use client";

import React from "react";
import { MENU_CATEGORIES } from "./menu-data";
import { MenuHeading } from "./MenuHeading";
import { MenuCategorySheet } from "./MenuCategorySheet";
import { MenuOrderCTA } from "./MenuOrderCTA";
import { MenuDecorations } from "./MenuDecorations";

export function MenuSection() {
  const boxesCategory = MENU_CATEGORIES.find((c) => c.id === "boxes")!;
  const jarsCategory = MENU_CATEGORIES.find((c) => c.id === "jars")!;
  const wafflesCategory = MENU_CATEGORIES.find((c) => c.id === "waffles")!;

  return (
    <section
      id="menu"
      aria-label="PlotTwist Bakery Menu"
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 w-full overflow-x-clip select-none"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          #FFFDF7 0px,
          #FFFDF7 28px,
          #FFF6DA 28px,
          #FFF6DA 56px
        )`,
      }}
    >
      {/* ── TOP & BOTTOM DECORATIVE STITCHED LINES ── */}
      <div
        className="absolute top-0 left-0 right-0 h-2 bg-[#3B2922]/10 border-b-2 border-dashed border-[#3B2922]/20 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-2 bg-[#3B2922]/10 border-t-2 border-dashed border-[#3B2922]/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Floating Sticker & Doodle Layer */}
        <MenuDecorations />

        {/* 1. Playful "THE MENU." Heading & Taped Note */}
        <MenuHeading />

        {/* 2. Asymmetric Stationery Sheets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-start relative">
          
          {/* Left Column: 01 / BOXES (Spans 7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <MenuCategorySheet category={boxesCategory} />
          </div>

          {/* Right Column: 02 / JARS + 03 / WAFFLES (Spans 5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-8 sm:gap-10 relative">
            {/* 02 / JARS Sheet */}
            <MenuCategorySheet category={jarsCategory} />

            {/* 03 / WAFFLES Sheet */}
            <MenuCategorySheet category={wafflesCategory} />
          </div>

        </div>

        {/* 3. Bottom Scrapbook Order Card */}
        <MenuOrderCTA />

      </div>
    </section>
  );
}

export default MenuSection;

