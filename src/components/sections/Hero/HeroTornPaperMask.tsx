import React from "react";

export const HeroTornPaperMask: React.FC = React.memo(() => {
  return (
    <div className="HeroTornPaperMask absolute -inset-3.5 z-10 pointer-events-none select-none" aria-hidden="true">
      {/* Off-White Organic Torn Paper Frame Mounted Around Cheesecake (Micro Paper Lip & Bevel) */}
      <div 
        className="w-full h-full bg-[#FAF9F6] rounded-full border-2 border-[#3D2E25]/15 shadow-[0_16px_40px_rgba(61,46,37,0.10)] transform-gpu"
        style={{
          clipPath: "polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)"
        }}
      />
    </div>
  );
});

HeroTornPaperMask.displayName = "HeroTornPaperMask";
