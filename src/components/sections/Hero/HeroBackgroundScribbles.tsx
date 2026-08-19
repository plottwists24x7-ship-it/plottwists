import React from "react";

export const HeroBackgroundScribbles: React.FC = React.memo(() => {
  return (
    <div className="HeroBackgroundScribbles absolute inset-0 z-1 pointer-events-none select-none overflow-hidden transform-gpu" aria-hidden="true">
      {/* System 1 Layer 1: Fine Paper Grain Texture (3% Opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(61,46,37,0.15) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(61,46,37,0.15) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />

      {/* System 1 Layer 2: Dotted Print Grid (18-22px Spacing, 4% Opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #3D2E25 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* System 1 Layer 3: Microscopic Corner Ink Speckles */}
      <svg className="absolute inset-0 w-full h-full text-[#3D2E25] opacity-[0.05]" viewBox="0 0 1000 800" fill="currentColor">
        <circle cx="40" cy="50" r="1.5" /><circle cx="85" cy="120" r="1" /><circle cx="120" cy="75" r="2" />
        <circle cx="940" cy="60" r="1.5" /><circle cx="890" cy="110" r="2" /><circle cx="960" cy="140" r="1" />
        <circle cx="50" cy="720" r="2" /><circle cx="110" cy="760" r="1.5" />
        <circle cx="920" cy="740" r="1" /><circle cx="950" cy="710" r="2" />
      </svg>

      {/* Loose Organic Pencil Scribble Loops (Opacity 12%) */}
      <div className="opacity-[0.12] text-[#3D2E25]">
        <svg className="absolute top-[6%] left-[4%] w-[180px] h-[90px] -rotate-6" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 50 C 40 10, 70 90, 100 40 C 130 10, 160 80, 190 30" />
        </svg>
        <svg className="hidden sm:block absolute bottom-[8%] left-[2%] w-[190px] h-[95px] rotate-8" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M15 45 C 50 85, 80 15, 120 70 C 150 20, 175 75, 185 35" />
        </svg>
      </div>
    </div>
  );
});

HeroBackgroundScribbles.displayName = "HeroBackgroundScribbles";
