import React from "react";

export const HeroFeatureCard: React.FC = React.memo(() => {
  return (
    <div className="HeroFeatureCard hidden md:flex absolute bottom-[14%] right-[-10px] bg-[#F4D4CF] border-2 border-[#3D2E25]/30 rounded-xl px-5 py-4 shadow-[0_8px_20px_rgba(61,46,37,0.10)] rotate-3 z-35 pointer-events-none select-none flex-col gap-2 transform-gpu" aria-hidden="true">
      {/* Taped Corner holding Feature Card down */}
      <div className="absolute -top-3 left-4 w-12 h-4 bg-[#F5F2EB]/85 border-y border-white/60 shadow-xs -rotate-6" />

      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#3D2E25]">
        <span className="text-[#F43F5E] font-bold">✓</span> No Refined Sugar
      </div>
      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#3D2E25]">
        <span className="text-[#F43F5E] font-bold">✓</span> High Protein
      </div>
      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#3D2E25]">
        <span className="text-[#F43F5E] font-bold">✓</span> Real Ingredients
      </div>
      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#3D2E25]">
        <span className="text-[#F43F5E] font-bold">✓</span> 100% Delicious
      </div>
    </div>
  );
});

HeroFeatureCard.displayName = "HeroFeatureCard";
