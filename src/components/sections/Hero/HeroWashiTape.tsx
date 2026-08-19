import React from "react";

export const HeroWashiTape: React.FC = React.memo(() => {
  return (
    <>
      {/* Heading Corner Masking Tape (-14deg tilt) */}
      <div 
        className="absolute top-[-16px] left-[-28px] w-[120px] h-[32px] bg-white/75 backdrop-blur-[2px] border-y border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-20 pointer-events-none select-none -rotate-12"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(61,46,37,0.03) 4px, rgba(61,46,37,0.03) 8px)"
        }}
        aria-hidden="true"
      />

      {/* Product Recipe Card Top Washi Tape (6deg tilt) */}
      <div 
        className="absolute top-[-18px] right-[25%] w-[130px] h-[34px] bg-white/75 backdrop-blur-[2px] border-y border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-20 pointer-events-none select-none rotate-6"
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(61,46,37,0.03) 4px, rgba(61,46,37,0.03) 8px)"
        }}
        aria-hidden="true"
      />
    </>
  );
});

HeroWashiTape.displayName = "HeroWashiTape";
