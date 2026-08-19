import React from "react";

export const HeroEditorialArrow: React.FC = React.memo(() => {
  return (
    <div className="HeroEditorialArrow absolute inset-0 z-40 pointer-events-none select-none text-[#3D2E25] opacity-80" aria-hidden="true">
      {/* Prominent Curved Arrow from Headline Paper Edge to Cheesecake Mount */}
      <svg className="hidden md:block absolute top-[26%] left-[36%] lg:left-[39%] w-[160px] lg:w-[190px] h-[60px] -rotate-6 transform-gpu filter drop-shadow-[0_2px_4px_rgba(61,46,37,0.15)]" viewBox="0 0 190 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 30 Q 95 5, 175 38" />
        <path d="M162 24 L 178 39 L 164 50" />
      </svg>

      {/* Hand-Drawn String Loop Flourish connecting CTA button to Recipe Note */}
      <svg className="hidden sm:block absolute bottom-[22%] left-[28%] md:left-[32%] w-[120px] h-[50px] rotate-12 transform-gpu filter drop-shadow-[0_2px_4px_rgba(61,46,37,0.12)] text-[#8A6F63]" viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10 25 C 40 5, 60 45, 90 20 C 105 8, 115 35, 110 42" strokeDasharray="6 3" />
      </svg>
    </div>
  );
});

HeroEditorialArrow.displayName = "HeroEditorialArrow";
