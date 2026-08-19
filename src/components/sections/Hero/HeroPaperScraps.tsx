import React from "react";

export const HeroPaperScraps: React.FC = React.memo(() => {
  return (
    <div className="HeroPaperScraps absolute inset-0 z-8 pointer-events-none select-none" aria-hidden="true">
      {/* Tucked Fragment 1: Upper Right Recipe Paper Scrap (Tucked behind paper stack) */}
      <div className="absolute top-[-8px] right-[18%] w-[95px] h-[55px] bg-[#FAF9F6] border border-[#3D2E25]/15 shadow-xs rotate-[6deg] opacity-90 transform-gpu" />

      {/* Tucked Fragment 2: Lower Right Receipt Fragment (Tucked behind recipe card) */}
      <div className="absolute bottom-[-6px] right-[22%] w-[110px] h-[45px] bg-[#FFFDF0] border border-dashed border-[#3D2E25]/20 shadow-xs -rotate-[4deg] opacity-90 transform-gpu" />
    </div>
  );
});

HeroPaperScraps.displayName = "HeroPaperScraps";
