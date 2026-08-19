import React from "react";

export const HeroBadges: React.FC = React.memo(() => {
  return (
    <div className="HeroBadges absolute inset-0 pointer-events-none z-40">
      {/* Badge 1: Sugar Free (Die-Cut Sticker Finish, -4deg tilt) */}
      <div className="BadgeSugarFree absolute top-[3%] right-[22%] md:right-[24%] bg-[#22D3EE] text-[#3D2E25] font-bubble text-xs uppercase tracking-widest px-4 py-2 border-3 border-[#3D2E25] ring-2 ring-white/90 rounded-xl shadow-[3px_3px_0px_0px_#3D2E25,0_6px_14px_rgba(61,46,37,0.08)] -rotate-4 animate-badge-float">
        sugar-free
      </div>

      {/* Badge 2: Lactose Free (Die-Cut Sticker Finish, +3deg tilt, border overlap) */}
      <div className="BadgeLactoseFree absolute top-1/2 right-[4px] md:right-[-12px] -translate-y-1/2 bg-[#DDF51A] text-[#3D2E25] font-bubble text-[#3D2E25] text-xs uppercase tracking-widest px-4 py-2 border-3 border-[#3D2E25] ring-2 ring-white/90 rounded-xl shadow-[3px_3px_0px_0px_#3D2E25,0_6px_14px_rgba(61,46,37,0.08)] rotate-3 animate-badge-float" style={{ animationDelay: "1.2s" }}>
        lactose-free
      </div>

      {/* Badge 3: High Protein (Die-Cut Sticker Finish, -2deg tilt, border overlap) */}
      <div className="BadgeHighProtein absolute bottom-[6%] left-[8px] md:left-[10px] bg-[#F43F5E] text-[#FAF9F6] font-bubble text-xs uppercase tracking-widest px-4 py-2 border-3 border-[#3D2E25] ring-2 ring-white/90 rounded-xl shadow-[3px_3px_0px_0px_#3D2E25,0_6px_14px_rgba(61,46,37,0.08)] -rotate-2 animate-badge-float" style={{ animationDelay: "2.1s" }}>
        high-protein
      </div>
    </div>
  );
});

HeroBadges.displayName = "HeroBadges";
