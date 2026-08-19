import React from "react";

export const HeroStickerRefinement: React.FC = React.memo(() => {
  return (
    <div className="HeroStickerRefinement absolute inset-0 pointer-events-none z-35" aria-hidden="true">
      {/* Exact Sticker 1: Yellow Scalloped "LACTOSE-FREE" attached Mid-Right of Cheesecake Frame */}
      <div className="absolute top-[42%] right-[-14px] md:right-[-24px] bg-[#DDF51A] text-[#3D2E25] font-bubble text-xs sm:text-sm uppercase tracking-widest px-4 py-2 border-3 border-[#3D2E25] ring-2 ring-white/90 rounded-xl shadow-[0_6px_16px_rgba(61,46,37,0.12)] rotate-4 transform-gpu">
        LACTOSE-FREE
      </div>

      {/* Exact Sticker 2: Pink Scalloped "SUGAR-FREE" tucked under Bottom-Left of Cheesecake Frame */}
      <div className="absolute bottom-[22%] left-[4%] md:left-[8%] bg-[#F43F5E] text-[#FAF9F6] font-bubble text-[#FAF9F6] text-xs sm:text-sm uppercase tracking-widest px-4 py-2 border-3 border-[#3D2E25] ring-2 ring-white/90 rounded-xl shadow-[0_6px_16px_rgba(61,46,37,0.12)] -rotate-6 transform-gpu">
        SUGAR-FREE
      </div>

      {/* Exact Sticker 3: Blue Oval "HIGH-PROTEIN" attached Bottom-Right of Cheesecake Frame */}
      <div className="absolute bottom-[4%] right-[12%] md:right-[16%] bg-[#22D3EE] text-[#3D2E25] font-bubble text-xs sm:text-sm uppercase tracking-widest px-5 py-2 border-3 border-[#3D2E25] ring-2 ring-white/90 rounded-full shadow-[0_6px_16px_rgba(61,46,37,0.12)] -rotate-3 transform-gpu">
        HIGH-PROTEIN
      </div>
    </div>
  );
});

HeroStickerRefinement.displayName = "HeroStickerRefinement";
