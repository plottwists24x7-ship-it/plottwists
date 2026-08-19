import React from "react";

export const HeroInkStamp: React.FC = React.memo(() => {
  return (
    <div 
      className="HeroInkStamp absolute bottom-[18%] right-[5%] w-[76px] h-[76px] rounded-full border-2 border-dashed border-[#7A6458] text-[#7A6458] opacity-[0.07] -rotate-[10deg] flex flex-col items-center justify-center p-1 pointer-events-none select-none z-20 transform-gpu"
      aria-hidden="true"
    >
      <span className="font-bubble text-[8px] uppercase tracking-widest">CHEF</span>
      <span className="font-bubble text-[9px] font-bold uppercase tracking-wider">APPROVED</span>
    </div>
  );
});

HeroInkStamp.displayName = "HeroInkStamp";
