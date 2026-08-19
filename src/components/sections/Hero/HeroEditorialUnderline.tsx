import React from "react";

export const HeroEditorialUnderline: React.FC = React.memo(() => {
  return (
    <div className="HeroEditorialUnderline absolute inset-0 z-45 pointer-events-none select-none text-[#F3C7D7] opacity-[0.18]" aria-hidden="true">
      {/* Underline 1: 'TASTE' (75% of word width, 4px stroke) */}
      <svg className="hidden sm:block absolute top-[25%] left-[20%] md:left-[24%] lg:left-[28%] w-[160px] h-[16px] transform-gpu" viewBox="0 0 160 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8 Q 40 2, 80 8 T 156 8" />
      </svg>

      {/* Underline 2: 'WELLNESS' (75% of word width, 4px stroke) */}
      <svg className="hidden sm:block absolute top-[36%] left-[18%] md:left-[22%] lg:left-[26%] w-[210px] h-[18px] transform-gpu" viewBox="0 0 210 18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9 Q 55 1, 105 9 T 205 9" />
      </svg>
    </div>
  );
});

HeroEditorialUnderline.displayName = "HeroEditorialUnderline";
