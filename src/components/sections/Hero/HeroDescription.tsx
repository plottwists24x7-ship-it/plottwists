import React from "react";

export const HeroDescription: React.FC = React.memo(() => {
  return (
    <p className="HeroDescription font-mono text-xs sm:text-sm md:text-base text-[#3D2E25]/85 max-w-[440px] leading-relaxed mb-4 sm:mb-6 font-semibold text-center md:text-left mx-auto md:mx-0">
      Guilt-free treats made with better ingredients for{" "}
      <span className="bg-[#DDF51A] text-[#3D2E25] px-1.5 py-0.5 rounded font-bold border border-[#3D2E25]/30">
        a happier you.
      </span>
    </p>
  );
});

HeroDescription.displayName = "HeroDescription";
