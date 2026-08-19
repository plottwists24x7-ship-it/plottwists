import React from "react";

export interface VintageStampProps {
  text?: string;
  variant?: "circle" | "rect";
  rotation?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const VintageStamp: React.FC<VintageStampProps> = React.memo(({
  text = "SINCE 2019",
  variant = "circle",
  rotation = 0,
  opacity = 0.35,
  className = "",
  style = {}
}) => {
  return (
    <div
      className={`VintageStamp border-2 border-dashed border-[#3D2E25] flex items-center justify-center p-2 text-[#3D2E25] font-bubble text-[10px] uppercase tracking-widest pointer-events-none select-none transform-gpu ${variant === "circle" ? "rounded-full w-20 h-20" : "rounded-md px-3 py-1.5"} ${className}`}
      style={{
        opacity,
        transform: `rotate(${rotation}deg)`,
        ...style
      }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
});

VintageStamp.displayName = "VintageStamp";
