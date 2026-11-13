import React from "react";
import Image from "next/image";

export function PlotTwistRisographPaper() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* ── BASE LAYER: Warm Uncoated Ivory Paper with Tonal Radial Gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#F5EBDD",
          backgroundImage:
            "radial-gradient(ellipse 75% 55% at 50% 25%, #FFFDF7 0%, #F5EBDD 60%, #EBDDC8 100%)",
        }}
      />

      {/* ── LAYER 1: Subtle Static Paper Fibre & Speckle Pattern ── */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: "url(/images/menu-decor/paper-fibre-tile.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />

      {/* ── LAYER 1.5: Boutique Bakery Wrapping Paper V2 Rich Motif ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/menu-decor/bakery-wrapping-paper-tile-v2.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "380px 380px",
        }}
      />

      {/* ── LAYER 2: Sparse Risograph Halftone Ink Screens in Corners ── */}
      {/* Top Left Risograph Screen (Muted Pink Ink) */}
      <div className="absolute -top-12 -left-12 w-64 h-64 opacity-60 rotate-6">
        <Image
          src="/images/menu-decor/risograph-halftone.svg"
          alt=""
          width={240}
          height={240}
          loading="lazy"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Bottom Right Risograph Screen (Muted Blue Ink) */}
      <div className="absolute -bottom-14 -right-14 w-72 h-72 opacity-50 -rotate-12">
        <Image
          src="/images/menu-decor/risograph-halftone.svg"
          alt=""
          width={240}
          height={240}
          loading="lazy"
          className="w-full h-full object-contain"
        />
      </div>

      {/* ── LAYER 3: Risograph Print Details & Registration Marks ── */}
      {/* Top Left Registration Mark */}
      <div className="hidden sm:flex items-center gap-1.5 absolute top-5 left-6 opacity-25 text-[#715B4C]">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
          REG: PLOTTWIST-RISO // 01-B
        </span>
      </div>

      {/* Top Right Registration Mark */}
      <div className="hidden md:flex items-center gap-1.5 absolute top-5 right-6 opacity-25 text-[#715B4C]">
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
          PRESS RUN: OCT 2024 • 2-COLOR
        </span>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Bottom Left Colour Separation Guide */}
      <div className="hidden lg:flex items-center gap-1.5 absolute bottom-4 left-6 opacity-25 text-[#715B4C]">
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F3B7C5] border border-[#715B4C]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F8DD78] border border-[#715B4C]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#A9C9F0] border border-[#715B4C]" />
        </div>
        <span className="font-mono text-[8px] font-bold tracking-wider uppercase ml-1">
          SEP: BLUSH / OCHRE / SKY
        </span>
      </div>

      {/* ── LAYER 4: Top & Bottom Deckle Torn-Paper Silhouette Transitions ── */}
      {/* Top Torn-Paper Edge Transition */}
      <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
        <svg
          viewBox="0 0 1200 16"
          preserveAspectRatio="none"
          className="w-full h-full text-[#3B2922]/15 fill-current"
        >
          <path d="M0,0 L1200,0 L1200,8 Q1150,14 1100,7 Q1050,1 1000,9 Q950,16 900,8 Q850,2 800,9 Q750,15 700,7 Q650,2 600,10 Q550,15 500,8 Q450,2 400,9 Q350,16 300,7 Q250,2 200,10 Q150,15 100,7 Q50,2 0,9 Z" />
        </svg>
      </div>

      {/* Bottom Torn-Paper Edge Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden rotate-180">
        <svg
          viewBox="0 0 1200 16"
          preserveAspectRatio="none"
          className="w-full h-full text-[#3B2922]/15 fill-current"
        >
          <path d="M0,0 L1200,0 L1200,8 Q1150,14 1100,7 Q1050,1 1000,9 Q950,16 900,8 Q850,2 800,9 Q750,15 700,7 Q650,2 600,10 Q550,15 500,8 Q450,2 400,9 Q350,16 300,7 Q250,2 200,10 Q150,15 100,7 Q50,2 0,9 Z" />
        </svg>
      </div>
    </div>
  );
}

