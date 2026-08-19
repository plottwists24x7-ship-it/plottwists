import React from "react";

export const HeroGrainsAndDebris: React.FC = React.memo(() => {
  return (
    <div className="HeroGrainsAndDebris absolute inset-0 z-35 pointer-events-none select-none overflow-hidden opacity-90 text-[#3D2E25]" aria-hidden="true">
      {/* Bold Golden Cookie Crumbs & Chocolate Chunks (High Visibility) */}
      <svg className="absolute bottom-[10%] right-[18%] md:right-[22%] w-[180px] h-[90px] filter drop-shadow-[0_4px_8px_rgba(61,46,37,0.15)]" viewBox="0 0 180 90" fill="currentColor">
        {/* Chocolate Chunks (Broken Cubes) */}
        <path d="M20 40 L35 30 L45 45 L30 55 Z" fill="#3D2E25" stroke="#2E2B28" strokeWidth="1.5" />
        <path d="M80 50 L92 42 L102 54 L90 62 Z" fill="#3D2E25" stroke="#2E2B28" strokeWidth="1.5" />
        <path d="M130 35 L140 28 L148 38 L138 45 Z" fill="#3D2E25" stroke="#2E2B28" strokeWidth="1.5" />

        {/* Golden Cookie Crumbs Specks */}
        <circle cx="12" cy="55" r="3.5" fill="#E8D6B5" stroke="#3D2E25" strokeWidth="1" />
        <circle cx="28" cy="62" r="4.5" fill="#D9B45B" stroke="#3D2E25" strokeWidth="1" />
        <circle cx="68" cy="58" r="3.8" fill="#E8D6B5" stroke="#3D2E25" strokeWidth="1" />
        <circle cx="108" cy="48" r="4.2" fill="#D9B45B" stroke="#3D2E25" strokeWidth="1" />
        <circle cx="152" cy="42" r="3" fill="#E8D6B5" stroke="#3D2E25" strokeWidth="1" />

        {/* Oat Grains */}
        <ellipse cx="18" cy="22" rx="6" ry="3" transform="rotate(25 18 22)" fill="#E8D6B5" stroke="#3D2E25" strokeWidth="1" />
        <ellipse cx="44" cy="30" rx="6" ry="3" transform="rotate(-15 44 30)" fill="#E8D6B5" stroke="#3D2E25" strokeWidth="1" />
        <ellipse cx="94" cy="22" rx="6" ry="3" transform="rotate(40 94 22)" fill="#E8D6B5" stroke="#3D2E25" strokeWidth="1" />

        {/* Sesame Seeds */}
        <ellipse cx="36" cy="14" rx="2.5" ry="1.5" fill="#FFFDF0" stroke="#3D2E25" strokeWidth="0.8" />
        <ellipse cx="72" cy="42" rx="2.5" ry="1.5" fill="#FFFDF0" stroke="#3D2E25" strokeWidth="0.8" />
        <ellipse cx="120" cy="26" rx="2.5" ry="1.5" fill="#FFFDF0" stroke="#3D2E25" strokeWidth="0.8" />
      </svg>
    </div>
  );
});

HeroGrainsAndDebris.displayName = "HeroGrainsAndDebris";
