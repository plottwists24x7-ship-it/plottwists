import React from "react";

export interface StickerProps {
  text: string;
  variant?: "cyan" | "lime" | "rose" | "amber" | "purple" | "cream";
  rotation?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Sticker: React.FC<StickerProps> = React.memo(({
  text,
  variant = "cyan",
  rotation = 0,
  scale = 1,
  className = "",
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "cyan": return "bg-[#22D3EE] text-[#3D2E25]";
      case "lime": return "bg-[#DDF51A] text-[#3D2E25]";
      case "rose": return "bg-[#F43F5E] text-[#FAF9F6]";
      case "amber": return "bg-[#F59E0B] text-[#3D2E25]";
      case "purple": return "bg-[#A855F7] text-[#FAF9F6]";
      case "cream": return "bg-[#FFFDF0] text-[#3D2E25]";
      default: return "bg-[#22D3EE] text-[#3D2E25]";
    }
  };

  return (
    <div
      className={`Sticker font-bubble text-sm sm:text-base uppercase tracking-widest px-6 py-3 border-4 border-[#3D2E25] ring-3 ring-white/90 rounded-2xl shadow-[0_8px_20px_rgba(61,46,37,0.12)] pointer-events-none select-none inline-block transform-gpu ${getVariantStyles()} ${className}`}
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        ...style
      }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
});

Sticker.displayName = "Sticker";
