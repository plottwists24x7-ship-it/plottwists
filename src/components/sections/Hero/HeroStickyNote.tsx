import React from "react";

export const HeroStickyNote: React.FC = React.memo(() => {
  return (
    <div 
      className="HeroStickyNote absolute -top-8 -right-8 z-35 bg-[#FFFDF0] border border-[#3D2E25]/15 rounded-xl shadow-[0_12px_28px_rgba(61,46,37,0.10)] -rotate-[4deg] px-4 py-3 pointer-events-none select-none transform-gpu"
      aria-hidden="true"
    >
      <div className="font-bubble text-[11px] uppercase tracking-wider text-[#3D2E25]/80 flex items-center gap-1">
        <span>Handmade Daily ♡</span>
      </div>
      {/* Soft Curled Corner Lift & Drop Shadow Effect */}
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#FAF9F6] border-t border-l border-[#3D2E25]/15 rounded-tl-md shadow-[0_2px_4px_rgba(61,46,37,0.12)]" />
    </div>
  );
});

HeroStickyNote.displayName = "HeroStickyNote";
