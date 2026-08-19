import React from "react";

export interface WashiTapeProps {
  variant?: "beige" | "yellow" | "transparent" | "grid" | "pink" | "mint" | "kraft";
  rotation?: number;
  opacity?: number;
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const WashiTape: React.FC<WashiTapeProps> = React.memo(({
  variant = "beige",
  rotation = 0,
  opacity = 0.85,
  width = "75px",
  height = "24px",
  className = "",
  style = {}
}) => {
  const getBgStyle = () => {
    switch (variant) {
      case "beige": return { backgroundColor: "rgba(245, 242, 235, 0.85)" };
      case "yellow": return { backgroundColor: "rgba(250, 240, 205, 0.85)" };
      case "transparent": return { backgroundColor: "rgba(255, 255, 255, 0.65)" };
      case "grid": return { backgroundColor: "rgba(251, 247, 239, 0.85)", backgroundImage: "repeating-linear-gradient(0deg, rgba(61,46,37,0.05) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(61,46,37,0.05) 0 1px, transparent 1px 6px)" };
      case "pink": return { backgroundColor: "rgba(252, 234, 245, 0.85)" };
      case "mint": return { backgroundColor: "rgba(225, 245, 238, 0.85)" };
      case "kraft": return { backgroundColor: "rgba(232, 220, 196, 0.85)" };
      default: return { backgroundColor: "rgba(245, 242, 235, 0.85)" };
    }
  };

  return (
    <div
      className={`WashiTape backdrop-blur-[2px] border-y border-white/60 shadow-[0_3px_8px_rgba(61,46,37,0.08)] pointer-events-none select-none transform-gpu ${className}`}
      style={{
        width,
        height,
        opacity,
        transform: `rotate(${rotation}deg)`,
        ...getBgStyle(),
        ...style
      }}
      aria-hidden="true"
    />
  );
});

WashiTape.displayName = "WashiTape";
