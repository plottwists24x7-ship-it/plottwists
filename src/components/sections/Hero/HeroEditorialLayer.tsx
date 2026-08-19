import React from "react";
import { HeroStrawberry } from "./HeroStrawberry";
import { HeroEditorialArrow } from "./HeroEditorialArrow";
import { HeroEditorialUnderline } from "./HeroEditorialUnderline";
import { HeroGrainsAndDebris } from "./HeroGrainsAndDebris";
import { HeroFeatureCard } from "./HeroFeatureCard";
import { HeroPaperNotes } from "./HeroPaperNotes";
import { HeroStickerRefinement } from "./HeroStickerRefinement";

export const HeroEditorialLayer: React.FC = React.memo(() => {
  return (
    <div className="HeroEditorialLayer absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
      {/* 3 Floating Outline Hearts ♡ ♡ ♡ Top-Left of Cheesecake Frame */}
      <svg className="absolute top-[8%] left-[48%] md:left-[52%] w-16 h-16 text-[#3D2E25] z-30" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M16 28 L 14.5 26.5 C 7 19.5 2 15 2 9.5 C 2 5 5.5 1.5 10 1.5 C 12.5 1.5 15 2.7 16 4.5 C 17 2.7 19.5 1.5 22 1.5 C 26.5 1.5 30 5 30 9.5 C 30 15 25 19.5 17.5 26.5 L 16 28 Z" transform="translate(10, 0) scale(0.7)" />
        <path d="M16 28 L 14.5 26.5 C 7 19.5 2 15 2 9.5 C 2 5 5.5 1.5 10 1.5 C 12.5 1.5 15 2.7 16 4.5 C 17 2.7 19.5 1.5 22 1.5 C 26.5 1.5 30 5 30 9.5 C 30 15 25 19.5 17.5 26.5 L 16 28 Z" transform="translate(32, 12) scale(0.5)" />
        <path d="M16 28 L 14.5 26.5 C 7 19.5 2 15 2 9.5 C 2 5 5.5 1.5 10 1.5 C 12.5 1.5 15 2.7 16 4.5 C 17 2.7 19.5 1.5 22 1.5 C 26.5 1.5 30 5 30 9.5 C 30 15 25 19.5 17.5 26.5 L 16 28 Z" transform="translate(44, 28) scale(0.4)" />
      </svg>

      {/* Top Right Circular Blue Stamp "MADE FRESH DAILY" with Sunbursts ≡ */}
      <div className="absolute top-[4%] right-[6%] md:right-[10%] w-[72px] sm:w-[84px] h-[72px] sm:h-[84px] rounded-full border-2 border-dashed border-[#22D3EE] bg-[#EBF7F2]/90 flex flex-col items-center justify-center p-1 text-[#3D2E25] font-bubble text-[9px] uppercase tracking-wider z-30 shadow-xs rotate-3">
        {/* Sunburst 3 lines */}
        <div className="flex gap-1 text-[#22D3EE] font-bold text-[8px] mb-0.5">≡</div>
        <span>MADE FRESH</span>
        <span className="font-bold text-[#22D3EE] text-[10px]">DAILY</span>
        <span className="text-[7px]">🌿</span>
      </div>

      {/* Top Grid Washi Tape Holding Cheesecake Frame Top */}
      <div 
        className="absolute top-[3%] right-[24%] md:right-[28%] w-[80px] h-[24px] bg-[#FAF9F6]/85 border-y border-white/60 shadow-xs rotate-[8deg] z-30 transform-gpu"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(61,46,37,0.05) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(61,46,37,0.05) 0 1px, transparent 1px 6px)" }}
      />

      {/* Paperclip Doodle 📎 above HIGH-PROTEIN */}
      <div className="hidden sm:block absolute bottom-[18%] right-[24%] w-6 h-10 border-2 border-[#3D2E25] rounded-full rotate-45 z-35 opacity-80" />

      {/* Botanical Leaf Branch 🌿 next to SCROLL TO DISCOVER */}
      <svg className="hidden lg:block absolute bottom-[2%] left-[54%] w-10 h-10 text-[#91A78E] z-30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 32 C 16 24, 24 16, 32 8 M16 24 C 12 18, 18 14, 20 20 M24 16 C 20 10, 26 6, 28 12 M28 28 C 22 26, 24 18, 30 22" />
      </svg>

      {/* Food Debris & Golden Cookie Crumbs Clusters */}
      <HeroGrainsAndDebris />

      {/* Pink Feature Card */}
      <HeroFeatureCard />

      {/* Handwritten Cream Note */}
      <HeroPaperNotes />

      {/* 3 Nutrition Die-Cut Stickers */}
      <HeroStickerRefinement />

      {/* Cutout Red Strawberry */}
      <HeroStrawberry />

      {/* Muted Cocoa Editorial Arrow */}
      <HeroEditorialArrow />

      {/* Hand-Painted Editorial Underlines */}
      <HeroEditorialUnderline />
    </div>
  );
});

HeroEditorialLayer.displayName = "HeroEditorialLayer";
