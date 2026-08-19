import React from "react";

interface HeroCTAProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export const HeroCTA: React.FC<HeroCTAProps> = React.memo(({ onExploreClick, onStoryClick }) => {
  return (
    <div className="HeroCTA flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-4 w-full min-[480px]:w-auto mt-7 ml-32 sm:ml-36 md:ml-44 lg:ml-52">
      <button
        onClick={onExploreClick}
        className="PrimaryCTA bg-[#F43F5E] text-[#FAF9F6] border-4 border-[#3D2E25] shadow-[4px_4px_0px_0px_#3D2E25,0_10px_18px_rgba(61,46,37,0.08)] h-[56px] min-w-[200px] px-8 rounded-full font-bubble text-sm uppercase tracking-widest flex items-center justify-center cursor-pointer select-none focus-visible:outline-none transition-all duration-250 ease-out hover:-translate-y-[3px] hover:scale-[1.03] active:translate-y-0 active:scale-100"
      >
        Explore Bakes
      </button>
      <button
        onClick={onStoryClick}
        className="SecondaryCTA bg-[#FAF9F6] text-[#3D2E25] border-4 border-[#3D2E25] shadow-[4px_4px_0px_0px_#3D2E25,0_10px_18px_rgba(61,46,37,0.08)] h-[56px] min-w-[200px] px-8 rounded-full font-bubble text-sm uppercase tracking-widest flex items-center justify-center cursor-pointer select-none focus-visible:outline-none transition-all duration-250 ease-out hover:-translate-y-[2px] active:translate-y-0"
      >
        Read Our Story
      </button>
    </div>
  );
});

HeroCTA.displayName = "HeroCTA";
