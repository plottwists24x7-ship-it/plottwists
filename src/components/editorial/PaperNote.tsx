import React from "react";

export interface PaperNoteProps {
  variant?: "cream" | "kraft" | "pink" | "yellow" | "blue" | "grid" | "diary";
  rotation?: number;
  scale?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PaperNote: React.FC<PaperNoteProps> = React.memo(({
  variant = "cream",
  rotation = 0,
  scale = 1,
  className = "",
  children,
  style = {}
}) => {
  const getBgColor = () => {
    switch (variant) {
      case "cream": return "bg-[#F7F0DD]";
      case "kraft": return "bg-[#E8D6B5]";
      case "pink": return "bg-[#F4D4CF]";
      case "yellow": return "bg-[#EFDCA4]";
      case "blue": return "bg-[#D9EAF7]";
      case "grid": return "bg-[#FBF7EF]";
      case "diary": return "bg-[#EFE3C8]";
      default: return "bg-[#F7F0DD]";
    }
  };

  return (
    <div
      className={`PaperNote border border-[#3D2E25]/15 rounded-lg p-3 shadow-[0_6px_14px_rgba(61,46,37,0.08)] pointer-events-none select-none transform-gpu ${getBgColor()} ${className}`}
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        ...style
      }}
      aria-hidden="true"
    >
      <div className="font-bubble text-xs text-[#3D2E25]/80 uppercase tracking-wider">
        {children}
      </div>
    </div>
  );
});

PaperNote.displayName = "PaperNote";
