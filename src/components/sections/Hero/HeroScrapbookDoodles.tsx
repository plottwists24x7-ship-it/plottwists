import React from "react";

export const HeroScrapbookDoodles: React.FC = React.memo(() => {
  return (
    <>
      {/* Soft Atmospheric Background Halo Behind Cheesecake */}
      <div 
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FCEAF5] opacity-8 blur-3xl pointer-events-none select-none z-[2]"
        aria-hidden="true"
      />

      {/* Handcrafted Estonia Vintage Stamp Seal (Tucked behind recipe card, 2deg rotation) */}
      <div 
        className="absolute top-[8%] right-[8%] w-[125px] h-[125px] rounded-full border-2 border-dashed border-[#3D2E25]/25 flex flex-col items-center justify-center p-2 text-[#3D2E25]/35 select-none pointer-events-none rotate-2 z-[2]"
        aria-hidden="true"
      >
        <span className="font-bubble text-[9px] tracking-widest uppercase">EST. 2026</span>
        <span className="font-bubble text-[12px] font-bold tracking-wider uppercase my-0.5">ESTONIA</span>
        <span className="font-sans text-[7.5px] tracking-tight uppercase">ARTISANAL BAKERY</span>
      </div>

      {/* Editorial Storytelling Flourishes & Hand-Drawn Accents (z-[2]) */}
      <div className="absolute inset-0 pointer-events-none select-none z-[2] overflow-hidden text-[#E685B5]" aria-hidden="true">
        {/* Soft Blush Arrow Leading from 'TASTE' toward Cheesecake (8-12% opacity) */}
        <svg className="hidden md:block absolute top-[28%] left-[40%] w-[140px] h-[40px] text-[#F43F5E] opacity-20 -rotate-6" viewBox="0 0 140 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10 20 Q 70 5, 125 25" />
          <path d="M115 15 L 128 26 L 118 34" />
        </svg>

        {/* Editorial Wave Underline Beneath 'WELLNESS' */}
        <svg className="hidden sm:block absolute top-[36%] left-[18%] md:left-[22%] lg:left-[26%] w-[220px] h-[20px] text-[#3D2E25]/20" viewBox="0 0 220 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M5 10 Q 55 0, 110 10 T 215 10" />
        </svg>

        {/* Faded Ink Stamp Mark (5-8% opacity) */}
        <div className="absolute bottom-[20%] left-[4%] w-[80px] h-[80px] rounded-full border border-dashed border-[#3D2E25]/15 opacity-[0.06] -rotate-12 flex items-center justify-center">
          <span className="font-bubble text-[8px] uppercase tracking-widest text-[#3D2E25]">FRESH DAILY</span>
        </div>

        {/* 3 Tiny Background Doodles (8-12% opacity) */}
        <div className="animate-scribble-pulse opacity-10">
          {/* Doodle 1: Heart */}
          <svg className="absolute top-[18%] left-[44%] w-[26px] h-[26px] -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* Doodle 2: Sparkle Star */}
          <svg className="absolute top-[4%] left-[3%] w-[40px] h-[40px] -rotate-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 4 Q25 18 38 24 Q25 30 24 44 Q23 30 10 24 Q23 18 24 4 Z" />
          </svg>

          {/* Doodle 3: Swirl Loop */}
          <svg className="absolute bottom-[8%] right-[4%] w-[38px] h-[38px] rotate-45" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 A 12 12 0 1 1 6 18 M6 10 L6 18 L14 18" />
          </svg>
        </div>
      </div>

      {/* Editor's Handwritten Script Annotation Near CTA */}
      <div 
        className="hidden sm:flex absolute -bottom-8 left-2 font-lumiare text-sm text-[#3D2E25]/60 italic pointer-events-none select-none -rotate-3 items-center gap-1 z-20"
        aria-hidden="true"
      >
        <span>baked fresh daily in Estonia ♡</span>
      </div>
    </>
  );
});

HeroScrapbookDoodles.displayName = "HeroScrapbookDoodles";
