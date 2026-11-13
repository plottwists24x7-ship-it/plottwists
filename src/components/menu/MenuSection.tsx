"use client";

import React from "react";
import { MENU_CATEGORIES } from "./menu-data";
import { MenuHeading } from "./MenuHeading";
import { MenuCategorySheet } from "./MenuCategorySheet";
import { MenuOrderCTA } from "./MenuOrderCTA";
import { MenuDecorations } from "./MenuDecorations";
import { PlotTwistRisographPaper } from "./PlotTwistRisographPaper";

export function MenuSection() {
  const boxesCategory = MENU_CATEGORIES.find((c) => c.id === "boxes")!;
  const jarsCategory = MENU_CATEGORIES.find((c) => c.id === "jars")!;
  const wafflesCategory = MENU_CATEGORIES.find((c) => c.id === "waffles")!;

  return (
    <section
      id="menu"
      aria-label="PlotTwist Bakery Menu"
      className="relative scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-6 md:px-8 lg:px-10 w-full overflow-x-clip select-none"
    >
      {/* ── DEDICATED RISOGRAPH BAKERY SCRAPBOOK PAPER CANVAS ── */}
      <PlotTwistRisographPaper />

      {/* Floating Sticker & Doodle Layer (Section Gutter Level) */}
      <MenuDecorations />

      {/* ── MAIN CONTENT CONTAINER (Compact Vertical Rhythm) ── */}
      <div className="max-w-5xl mx-auto relative z-10">

        {/* 1. Compact Editorial "THE MENU." Heading & Taped Note */}
        <MenuHeading />

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
