import React from "react";

interface HeroCTAProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export const HeroCTA: React.FC<HeroCTAProps> = React.memo(({ onExploreClick, onStoryClick }) => {
  return (
    <div className="HeroCTA flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-6 mx-auto md:mx-0 md:ml-12 lg:ml-16">
      {/* Primary CTA (Dominant, Bold) */}
      <button
        onClick={onExploreClick}
        className="PrimaryCTA w-full sm:w-auto bg-[#F43F5E] text-[#FAF9F6] border-4 border-[#3D2E25] shadow-[4px_4px_0px_0px_#3D2E25,0_10px_18px_rgba(61,46,37,0.08)] h-[52px] sm:h-[56px] min-w-[200px] px-8 rounded-full font-bubble text-sm uppercase tracking-widest flex items-center justify-center cursor-pointer select-none focus-visible:outline-none transition-all duration-250 ease-out hover:-translate-y-[3px] hover:scale-[1.03] active:translate-y-0 active:scale-100"
      >
        Explore Bakes
      </button>

      {/* Secondary CTA (Quieter, Lighter border & weight) */}
      <button
        onClick={onStoryClick}
        className="SecondaryCTA w-full sm:w-auto bg-[#FAF9F6]/90 text-[#3D2E25]/90 border-2 sm:border-4 border-[#3D2E25]/60 sm:border-[#3D2E25] shadow-[2px_2px_0px_0px_#3D2E25] sm:shadow-[4px_4px_0px_0px_#3D2E25] h-[48px] sm:h-[56px] min-w-[180px] sm:min-w-[200px] px-7 sm:px-8 rounded-full font-bubble text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center cursor-pointer select-none focus-visible:outline-none transition-all duration-250 ease-out hover:-translate-y-[2px] active:translate-y-0"
      >
        Read Our Story
      </button>
    </div>
  );
});

HeroCTA.displayName = "HeroCTA";
