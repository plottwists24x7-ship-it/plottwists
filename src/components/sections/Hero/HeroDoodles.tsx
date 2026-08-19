import React from "react";

export const HeroDoodles: React.FC = React.memo(() => {
  return (
    <div className="HeroDoodles absolute inset-0 z-50 pointer-events-none select-none text-[#E685B5] transform-gpu" aria-hidden="true">
      <div className="animate-scribble-pulse opacity-10">
        {/* Doodle 1: Sparkle Star (Top Left Zone 1) */}
        <svg className="absolute top-[4%] left-[3%] w-[38px] sm:w-[42px] h-[38px] sm:h-[42px] -rotate-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 4 Q25 18 38 24 Q25 30 24 44 Q23 30 10 24 Q23 18 24 4 Z" />
        </svg>

        {/* Doodle 2: Tiny Heart (Top Right Zone 5) */}
        <svg className="absolute top-[14%] right-[16%] w-[24px] sm:w-[28px] h-[24px] sm:h-[28px] rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

        {/* Doodle 3: Swirl Loop (Lower Right Zone 6) */}
        <svg className="hidden sm:block absolute bottom-[8%] right-[4%] w-[34px] sm:w-[38px] h-[34px] sm:h-[38px] rotate-45" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 A 12 12 0 1 1 6 18 M6 10 L6 18 L14 18" />
        </svg>

        {/* Doodle 4: Mini Sparkle (Upper Headline) */}
        <svg className="hidden sm:block absolute top-[18%] left-[44%] w-[22px] h-[22px] -rotate-6" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 4 Q25 18 38 24 Q25 30 24 44 Q23 30 10 24 Q23 18 24 4 Z" />
        </svg>

        {/* Doodle 5: Mini Leaf (Desktop Only) */}
        <svg className="hidden lg:block absolute top-[52%] left-[4%] w-[26px] h-[26px] rotate-18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>

        {/* Doodle 6: Dot Cluster (Desktop Only) */}
        <svg className="hidden lg:block absolute bottom-[22%] left-[34%] w-[30px] h-[16px]" viewBox="0 0 30 16" fill="currentColor">
          <circle cx="4" cy="8" r="1.5" /><circle cx="15" cy="8" r="1.5" /><circle cx="26" cy="8" r="1.5" />
        </svg>

        {/* Doodle 7: Short Flourish (Desktop Only) */}
        <svg className="hidden lg:block absolute top-[44%] right-[32%] w-[40px] h-[16px] -rotate-12" viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8 C 12 2, 28 14, 38 8" />
        </svg>

        {/* Doodle 8: Tiny Star 2 (Desktop Only) */}
        <svg className="hidden lg:block absolute bottom-[28%] right-[18%] w-[20px] h-[20px] rotate-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 4 Q25 18 38 24 Q25 30 24 44 Q23 30 10 24 Q23 18 24 4 Z" />
        </svg>
      </div>
    </div>
  );
});

HeroDoodles.displayName = "HeroDoodles";
