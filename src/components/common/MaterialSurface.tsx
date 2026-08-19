"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type MaterialType = "linen" | "walnut" | "concrete" | "paper" | "stone" | "canvas" | "metal";

interface MaterialSurfaceProps {
  type: MaterialType;
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export default function MaterialSurface({
  type,
  className,
  children,
  style,
}: MaterialSurfaceProps) {
  // Styles mapping to biological/tactile materials from Design Tokens
  const materialStyles: Record<MaterialType, string> = {
    linen: "bg-[#D8D3C5] border border-[#222221]/10 texture-linen",
    walnut: "bg-[#3D2E25] text-[#F5F2EB] border border-[#2A1F19] texture-walnut shadow-2xl",
    concrete: "bg-[#EAE4D9] text-[#222221] border border-[#222221]/12 texture-concrete shadow-inner",
    paper: "bg-[#F9F6F0] text-[#222221] border border-[#222221]/5 shadow-sm rounded-[2px]",
    stone: "bg-[#4E5143] text-[#F5F2EB] border border-[#3E4135] texture-stone",
    canvas: "bg-[#F5F2EB] border border-[#222221]/8 texture-canvas",
    metal: "bg-[#5A5C55] text-[#EAE4D9] border border-[#222221]/25",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        materialStyles[type],
        className
      )}
      style={style}
    >
      {/* 1. LINEN: Fibers & grain shadows */}
      {type === "linen" && (
        <>
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(34,34,33,0.01)_0%,rgba(34,34,33,0.04)_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(90deg, #222221 1px, transparent 1px),
                linear-gradient(0deg, #222221 1px, transparent 1px)
              `,
              backgroundSize: "5px 5px",
            }}
          />
        </>
      )}

      {/* 2. WALNUT WOOD: Grains, scratches & coffee stains */}
      {type === "walnut" && (
        <>
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(90deg, #fff 50%, transparent 50%)",
              backgroundSize: "4px 100%",
            }}
          />
          {/* Scratches */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.15) 49%, rgba(255,255,255,0.15) 51%, transparent 52%),
                linear-gradient(-30deg, transparent 48%, rgba(255,255,255,0.12) 49%, rgba(255,255,255,0.12) 51%, transparent 52%)
              `,
              backgroundSize: "180px 180px",
            }}
          />
          {/* Coffee stains */}
          <div
            className="absolute w-12 h-12 rounded-full border-[1.5px] border-[#2A1F19]/45 opacity-[0.35] pointer-events-none"
            style={{
              left: "15px",
              top: "20px",
              filter: "blur(0.8px)",
            }}
          />
        </>
      )}

      {/* 3. CONCRETE: Cracks & chalk markings */}
      {type === "concrete" && (
        <>
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#222221 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Concrete Cracks & Chalk drawing */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none">
            <path d="M 0,60 Q 80,75 140,110 T 260,140" fill="none" stroke="#222221" strokeWidth="1.2" />
            <path d="M 120,0 Q 140,80 130,190" fill="none" stroke="#222221" strokeWidth="0.8" />
            {/* White chalk circles */}
            <circle cx="85%" cy="25%" r="22" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 4" />
          </svg>
        </>
      )}

      {/* 4. PAPER: Yellow/browned aged edges */}
      {type === "paper" && (
        <>
          <div className="absolute inset-0 pointer-events-none border border-inset border-graphite-ink/5" />
          {/* Aged yellowing edges gradient */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 14px rgba(162, 90, 56, 0.24)",
            }}
          />
        </>
      )}

      {/* 5. STONE: Rough pitting */}
      {type === "stone" && (
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1),transparent)]" />
      )}

      {/* 6. CANVAS: Paint buildup & linen fibers */}
      {type === "canvas" && (
        <>
          {/* Linen fiber grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(90deg, var(--color-graphite-ink) 1px, transparent 1px),
                linear-gradient(0deg, var(--color-graphite-ink) 1px, transparent 1px)
              `,
              backgroundSize: "4px 4px",
            }}
          />
          {/* Paint buildup smears */}
          <div
            className="absolute inset-0 opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 75% 75%, var(--color-sienna-oxide) 0%, transparent 60%),
                radial-gradient(circle at 25% 30%, var(--color-gold-lustre) 0%, transparent 45%)
              `,
            }}
          />
        </>
      )}

      {/* 7. METAL: Oxidation rust patches & brushed grain */}
      {type === "metal" && (
        <>
          {/* Rust spots */}
          <div
            className="absolute inset-0 opacity-[0.24] pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, #A25A38 0%, transparent 35%),
                radial-gradient(circle at 80% 70%, #C2A679 0%, transparent 45%)
              `,
            }}
          />
          {/* Brushed texture lines */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(90deg, #111 1px, transparent 1px)",
              backgroundSize: "3px 100%",
            }}
          />
        </>
      )}

      {/* Surface content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
