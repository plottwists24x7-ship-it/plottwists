import React from "react";

export const HeroScrollIndicator: React.FC = React.memo(() => {
  return (
    <div className="HeroScrollIndicator absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-70 pointer-events-none select-none" aria-hidden="true">
      <span className="font-bubble text-[10px] uppercase tracking-widest text-[#3D2E25]">Scroll</span>
      <svg className="w-4 h-4 text-[#3D2E25]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});

HeroScrollIndicator.displayName = "HeroScrollIndicator";
