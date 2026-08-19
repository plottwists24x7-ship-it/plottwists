import React from "react";

export const HeroFoodStorytelling: React.FC = React.memo(() => {
  return (
    <div className="HeroFoodStorytelling absolute inset-0 z-3 pointer-events-none select-none overflow-hidden opacity-[0.04] text-[#3D2E25]" aria-hidden="true">
      {/* Detail 1: Cookie Crumbs Specks near Cheesecake */}
      <svg className="absolute top-[32%] right-[14%] w-[40px] h-[30px]" viewBox="0 0 40 30" fill="currentColor">
        <circle cx="6" cy="10" r="1.5" /><circle cx="18" cy="22" r="1" /><circle cx="32" cy="8" r="1.8" /><circle cx="24" cy="16" r="1" />
      </svg>

      {/* Detail 2: Powdered Sugar Dust Dusting near Recipe Card */}
      <svg className="hidden sm:block absolute bottom-[22%] right-[22%] w-[50px] h-[35px]" viewBox="0 0 50 35" fill="currentColor">
        <circle cx="8" cy="8" r="0.8" /><circle cx="20" cy="14" r="1.2" /><circle cx="38" cy="6" r="0.9" /><circle cx="14" cy="28" r="1.1" /><circle cx="42" cy="24" r="0.8" />
      </svg>

      {/* Detail 3: Tiny Ink Splatter near Headline */}
      <svg className="hidden md:block absolute top-[20%] left-[36%] w-[30px] h-[30px]" viewBox="0 0 30 30" fill="currentColor">
        <circle cx="12" cy="12" r="2" /><circle cx="20" cy="8" r="0.8" /><circle cx="8" cy="22" r="1" /><circle cx="22" cy="20" r="0.6" />
      </svg>

      {/* Detail 4: Mint Leaf Shadow Silhouette */}
      <svg className="hidden lg:block absolute bottom-[15%] left-[8%] w-[45px] h-[45px] -rotate-12" viewBox="0 0 45 45" fill="currentColor">
        <path d="M22.5 5 C12 12, 5 22.5, 5 22.5 C12 25, 22.5 40, 22.5 40 C22.5 40, 33 25, 40 22.5 C40 22.5, 33 12, 22.5 5 Z" />
      </svg>

      {/* Detail 5: Micro Coffee Stain Ring */}
      <svg className="hidden lg:block absolute top-[10%] right-[32%] w-[55px] h-[55px]" viewBox="0 0 55 55" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="27.5" cy="27.5" r="24" strokeDasharray="3 4" />
      </svg>
    </div>
  );
});

HeroFoodStorytelling.displayName = "HeroFoodStorytelling";
