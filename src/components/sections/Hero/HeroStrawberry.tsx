import React from "react";

export const HeroStrawberry: React.FC = React.memo(() => {
  return (
    <div className="HeroStrawberry absolute top-[14%] right-[28%] lg:right-[30%] w-[42px] h-[42px] z-25 pointer-events-none select-none -rotate-12 transform-gpu" aria-hidden="true">
      {/* Hand-Drawn Editorial Strawberry Illustration */}
      <svg className="w-full h-full text-[#F43F5E]" viewBox="0 0 42 42" fill="currentColor" stroke="#3D2E25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Berry Heart Silhouette */}
        <path d="M21 38 C 12 30, 6 20, 9 12 C 12 4, 20 6, 21 10 C 22 6, 30 4, 33 12 C 36 20, 30 30, 21 38 Z" fill="#F43F5E" />
        {/* Green Leaf Stem Top */}
        <path d="M21 10 C 18 4, 12 6, 14 2 C 18 4, 21 7, 21 7 C 21 7, 24 4, 28 2 C 30 6, 24 4, 21 10 Z" fill="#DDF51A" stroke="#3D2E25" strokeWidth="1.5" />
        {/* Seeds */}
        <circle cx="16" cy="18" r="0.8" fill="#FFFDF0" />
        <circle cx="26" cy="18" r="0.8" fill="#FFFDF0" />
        <circle cx="21" cy="24" r="0.8" fill="#FFFDF0" />
        <circle cx="16" cy="28" r="0.8" fill="#FFFDF0" />
        <circle cx="26" cy="28" r="0.8" fill="#FFFDF0" />
      </svg>
    </div>
  );
});

HeroStrawberry.displayName = "HeroStrawberry";
