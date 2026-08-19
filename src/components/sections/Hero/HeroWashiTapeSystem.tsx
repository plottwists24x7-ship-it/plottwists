import React from "react";

export const HeroWashiTapeSystem: React.FC = React.memo(() => {
  return (
    <div className="HeroWashiTapeSystem absolute inset-0 z-30 pointer-events-none select-none" aria-hidden="true">
      {/* Tape 1: Holding Foundation Paper Top Left (-10deg tilt, Muted Beige) */}
      <div 
        className="absolute -top-4 left-6 w-[76px] h-[24px] bg-[#F5F2EB]/84 backdrop-blur-[2px] border-y border-white/60 shadow-[0_3px_8px_rgba(61,46,37,0.08)] -rotate-[10deg] transform-gpu"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(61,46,37,0.03) 3px, rgba(61,46,37,0.03) 6px)" }}
      />

      {/* Tape 2: Holding Cream Sheet Top Right (8deg tilt, Warm Cream) */}
      <div 
        className="absolute -top-3 right-12 w-[82px] h-[26px] bg-[#FAF9F6]/84 backdrop-blur-[2px] border-y border-white/60 shadow-[0_3px_8px_rgba(61,46,37,0.08)] rotate-[8deg] transform-gpu"
        style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(61,46,37,0.03) 3px, rgba(61,46,37,0.03) 6px)" }}
      />

      {/* Tape 3: Holding Light Beige Sheet Lower Left (-6deg tilt, Soft Blush Washi) */}
      <div 
        className="absolute -bottom-3 left-10 w-[70px] h-[22px] bg-[#FCEAF5]/84 backdrop-blur-[2px] border-y border-white/60 shadow-[0_3px_8px_rgba(61,46,37,0.08)] -rotate-[6deg] transform-gpu"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(61,46,37,0.03) 3px, rgba(61,46,37,0.03) 6px)" }}
      />

      {/* Tape 4: Pinning Recipe Card Overlap (12deg tilt, Light Kraft) */}
      <div 
        className="absolute top-4 -right-4 w-[80px] h-[25px] bg-[#F5E6D3]/84 backdrop-blur-[2px] border-y border-white/60 shadow-[0_3px_8px_rgba(61,46,37,0.08)] rotate-[12deg] transform-gpu"
        style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(61,46,37,0.03) 3px, rgba(61,46,37,0.03) 6px)" }}
      />
    </div>
  );
});

HeroWashiTapeSystem.displayName = "HeroWashiTapeSystem";
