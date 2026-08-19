import React from "react";

export const HeroBlueFreshSeal: React.FC = React.memo(() => {
  return (
    <div 
      className="HeroBlueFreshSeal absolute bottom-[14%] left-[6%] w-[68px] sm:w-[76px] h-[68px] sm:h-[76px] rounded-full bg-[#22D3EE] border-3 border-[#3D2E25] shadow-[0_6px_16px_rgba(61,46,37,0.12)] flex flex-col items-center justify-center p-2 text-[#3D2E25] select-none pointer-events-none -rotate-6 z-10 opacity-90 transform-gpu"
      aria-hidden="true"
    >
      <span className="font-bubble text-[8px] uppercase tracking-widest">100% FRESH</span>
      <span className="font-bubble text-[10px] font-bold uppercase tracking-wider my-0.5">BAKED DAILY</span>
      <span className="font-sans text-[7px] uppercase tracking-tight opacity-70">ARTISANAL</span>
    </div>
  );
});

HeroBlueFreshSeal.displayName = "HeroBlueFreshSeal";
