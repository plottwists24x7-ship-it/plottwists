import React from "react";

export const HeroPaperNotes: React.FC = React.memo(() => {
  return (
    <div className="HeroPaperNotes absolute inset-0 z-35 pointer-events-none select-none" aria-hidden="true">
      {/* Exact Note 1: Cream Note "Made with love, for you. ♡" pinned with a Metallic Paperclip */}
      <div className="hidden sm:flex absolute bottom-[10%] left-[8%] md:left-[12%] bg-[#FFFDF0] border border-[#3D2E25]/20 rounded-lg shadow-[0_8px_20px_rgba(61,46,37,0.10)] -rotate-6 px-5 py-3 flex-col transform-gpu">
        {/* Metallic Paperclip Icon pinned on the left */}
        <div className="absolute top-[-14px] left-3 w-4 h-9 border-2 border-[#7A6458] rounded-full rotate-12 opacity-80" />

        <div className="font-bubble text-xs sm:text-sm text-[#3D2E25]/85 italic flex flex-col items-center justify-center text-center">
          <span>Made</span>
          <span>with love,</span>
          <span>for you.</span>
          <span className="text-xs mt-0.5">♡</span>
        </div>
      </div>
    </div>
  );
});

HeroPaperNotes.displayName = "HeroPaperNotes";
