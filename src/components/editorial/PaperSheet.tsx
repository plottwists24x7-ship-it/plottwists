import React from "react";
import Image from "next/image";

export interface PaperSheetProps {
  type: "offwhite" | "notebook" | "graph" | "kraft" | "torn" | "folded" | "receipt" | "parchment";
  variant?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "hero" | "medium" | "fragment";
  layer?: 1 | 2 | 3 | 4 | 5 | 6;
  rotation?: number;
  scale?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export const PaperSheet: React.FC<PaperSheetProps> = React.memo(({
  type,
  variant = 1,
  size = "medium",
  layer = 3,
  rotation = 0,
  scale = 1,
  opacity = 1,
  className = "",
  style = {},
  width,
  height
}) => {
  // 3-Tier Size Hierarchy (Chapter 8: Hero 320-430px, Medium 180-280px, Fragment 70-170px)
  const getDimensions = () => {
    if (width && height) return { w: width, h: height };
    switch (size) {
      case "hero": return { w: 380, h: 275 };
      case "medium": return { w: 230, h: 165 };
      case "fragment": return { w: 120, h: 90 };
      default: return { w: 220, h: 160 };
    }
  };

  const { w, h } = getDimensions();

  // Shadow System by Depth Layer (Chapter 12: L1-L2 Hero, L3-L4 Medium, L5 Fragments, Receipts/Parchment)
  const getShadowClass = () => {
    if (type === "receipt" || type === "parchment") return "shadow-[0_2px_8px_rgba(0,0,0,0.08)]";
    if (layer <= 2 || size === "hero") return "shadow-[0_10px_28px_rgba(0,0,0,0.16)]";
    if (layer <= 4 || size === "medium") return "shadow-[0_7px_18px_rgba(0,0,0,0.12)]";
    return "shadow-[0_4px_12px_rgba(0,0,0,0.10)]";
  };

  // Determine actual asset filename (from available sliced variants)
  const getAssetPath = () => {
    let v = variant;
    if (type === "offwhite" && v > 5) v = ((v - 1) % 5) + 1;
    if ((type === "notebook" || type === "graph" || type === "kraft" || type === "receipt" || type === "parchment") && v > 4) v = ((v - 1) % 4) + 1;
    if ((type === "torn" || type === "folded") && v > 6) v = ((v - 1) % 6) + 1;
    
    return `/assets/paper/${type}_0${v}.png`;
  };

  return (
    <div
      className={`PaperSheet absolute pointer-events-none select-none transform-gpu transition-transform ${getShadowClass()} ${className}`}
      style={{
        width: `${Math.round(w * scale)}px`,
        height: `${Math.round(h * scale)}px`,
        opacity,
        transform: `rotate(${rotation}deg)`,
        zIndex: layer,
        ...style
      }}
      aria-hidden="true"
    >
      <Image
        src={getAssetPath()}
        alt={`Paper scrap ${type}`}
        width={Math.round(w * scale)}
        height={Math.round(h * scale)}
        className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none"
        priority
      />
    </div>
  );
});

PaperSheet.displayName = "PaperSheet";
