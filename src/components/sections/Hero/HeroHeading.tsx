import React from "react";
import { HeroTornPaper } from "./HeroTornPaper";

export const HeroHeading: React.FC = React.memo(() => {
  return (
    <div className="HeroHeading relative flex flex-col items-start gap-1 sm:gap-2 mb-6 w-full transform-gpu">
      {/* Torn Paper Strip Mask Layer */}
      <HeroTornPaper />

      {/* Top Banner: "FRESH. HONEST. WHOLESOME." on Warm Paper held by Pink Tape on Left */}
      <div className="relative z-10 -rotate-[2.5deg] mb-1 sm:mb-2 transform-gpu">
        <div className="bg-[#FAF9F6] border-2 border-[#3D2E25] text-[#3D2E25] font-mono text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-sm shadow-[0_4px_12px_rgba(61,46,37,0.08)]">
          FRESH. HONEST. WHOLESOME.
        </div>
        {/* Pink Washi Tape holding left of banner */}
        <div className="absolute -top-3 -left-4 w-12 h-5 bg-[#FCEAF5]/85 border-y border-white/60 shadow-xs -rotate-12" />
      </div>

      {/* Line 1: "A NEW" with Star Sparkle on Left and 3 Brush Lines /// on Right */}
      <div className="relative z-10 flex items-center gap-2 transform-gpu">
        {/* 4-Point Black Star Sparkle */}
        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-[#3D2E25]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 Q13 10 21 12 Q13 14 12 22 Q11 14 3 12 Q11 10 12 2 Z" />
        </svg>

        <h1 className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[#3D2E25] uppercase leading-none">
          A NEW
        </h1>

        {/* 3 Short Brush Lines /// */}
        <svg className="w-6 h-6 text-[#3D2E25]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="6" y1="4" x2="2" y2="20" />
          <line x1="12" y1="4" x2="8" y2="20" />
          <line x1="18" y1="4" x2="14" y2="20" />
        </svg>
      </div>

      {/* Line 2: "TASTE OF" in Coral Red with Yellow Scalloped Badge "OF" */}
      <div className="relative z-10 flex items-center -mt-2 sm:-mt-3 transform-gpu">
        <span className="font-sans font-black text-6xl sm:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-[#F43F5E] uppercase leading-none">
          TASTE
        </span>

        {/* Yellow Scalloped Badge "OF" */}
        <div className="relative -ml-3 sm:-ml-4 -mb-2 bg-[#DDF51A] text-[#3D2E25] font-bubble text-xs sm:text-sm font-bold uppercase tracking-wider w-9 sm:w-11 h-9 sm:h-11 rounded-full border-2 border-[#3D2E25] shadow-xs flex items-center justify-center rotate-6 transform-gpu">
          OF
        </div>
      </div>

      {/* Line 3: "WELLNESS" in Black Bold Letters with 3 Wire Loops Below */}
      <div className="relative z-10 -mt-2 sm:-mt-4 transform-gpu">
        <span className="font-sans font-black text-6xl sm:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-[#3D2E25] uppercase leading-none">
          WELLNESS
        </span>

        {/* 3 Continuous Wire Loop Scribbles Directly Below "WELLNESS" */}
        <svg className="w-40 sm:w-56 h-6 text-[#3D2E25] -mt-1" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10 15 C 25 2, 40 28, 55 15 C 70 2, 85 28, 100 15 C 115 2, 130 28, 145 15 C 160 2, 175 28, 190 15" />
        </svg>
      </div>
    </div>
  );
});

HeroHeading.displayName = "HeroHeading";
