import React from "react";

export const HeroTornPaper: React.FC = React.memo(() => {
  return (
    <>
      {/* Handcrafted Deckle-Edge Torn Paper Strip Behind Headline (Subtle Paper Tension & Deckled Cuts) */}
      <div 
        className="absolute top-[-10px] left-[-20px] w-[110%] h-[115%] bg-[#FAF9F6] z-0 rounded-lg pointer-events-none select-none shadow-[0_18px_40px_rgba(61,46,37,0.07)] -rotate-[1.8deg] transform-gpu"
        style={{
          clipPath: "polygon(0% 3%, 4% 0%, 11% 3%, 17% 1%, 24% 4%, 31% 1%, 39% 3%, 47% 0%, 54% 3%, 62% 1%, 69% 4%, 77% 0%, 84% 3%, 91% 1%, 100% 4%, 98% 95%, 91% 98%, 83% 94%, 76% 99%, 67% 95%, 59% 98%, 51% 94%, 44% 99%, 37% 95%, 29% 98%, 21% 94%, 14% 99%, 7% 95%, 0% 98%)"
        }}
        aria-hidden="true"
      />

      {/* Handcrafted Recipe Card / Paper Receipt Behind Cheesecake Anchor */}
      <div 
        className="absolute -top-6 -left-6 w-[108%] h-[108%] bg-[#FDFBF7] border border-[#3D2E25]/15 z-0 rounded-2xl pointer-events-none select-none shadow-[0_24px_60px_rgba(61,46,37,0.10)] -rotate-3 flex flex-col justify-between p-6 transform-gpu"
        aria-hidden="true"
      >
        <div className="flex justify-between items-center border-b border-dashed border-[#3D2E25]/20 pb-2">
          <span className="font-bubble text-[10px] uppercase tracking-widest text-[#3D2E25]/50">RECIPE #084</span>
          <span className="font-bubble text-[10px] uppercase tracking-widest text-[#3D2E25]/50">PLOTWIST</span>
        </div>
        <div className="flex justify-between items-center border-t border-dashed border-[#3D2E25]/20 pt-2">
          <span className="font-sans text-[10px] text-[#3D2E25]/40 italic">Handcrafted with love</span>
          <span className="font-bubble text-[10px] text-[#F43F5E]">100% ORGANIC</span>
        </div>
      </div>
    </>
  );
});

HeroTornPaper.displayName = "HeroTornPaper";
