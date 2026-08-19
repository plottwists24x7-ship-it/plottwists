import React from "react";

export const HeroQualitySeal: React.FC = React.memo(() => {
  return (
    <div 
      className="HeroQualitySeal absolute top-[5%] right-[5%] lg:right-[7%] w-[70px] sm:w-[80px] lg:w-[90px] h-[70px] sm:h-[80px] lg:h-[90px] rounded-full border-2 border-dashed border-[#3D2E25] flex flex-col items-center justify-center p-2 text-[#3D2E25] select-none pointer-events-none rotate-2 z-15 opacity-20 transform-gpu"
      aria-hidden="true"
    >
      <span className="font-bubble text-[8px] sm:text-[9px] tracking-widest uppercase">EST. 2026</span>
      <span className="font-bubble text-[10px] sm:text-[11px] font-bold tracking-wider uppercase my-0.5">ESTONIA</span>
      <span className="font-sans text-[7px] sm:text-[7.5px] tracking-tight uppercase">ARTISANAL BAKERY</span>
    </div>
  );
});

HeroQualitySeal.displayName = "HeroQualitySeal";
