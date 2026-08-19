import React from "react";

export interface CoffeeStainProps {
  rotation?: number;
  opacity?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CoffeeStain: React.FC<CoffeeStainProps> = React.memo(({
  rotation = 0,
  opacity = 0.05,
  scale = 1,
  className = "",
  style = {}
}) => {
  return (
    <svg
      className={`CoffeeStain pointer-events-none select-none text-[#3B2C26] ${className}`}
      style={{
        opacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        ...style
      }}
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M 12 30 A 20 20 0 1 1 48 30" strokeWidth="2" strokeDasharray="5 3 10 2" />
      <path d="M 10 28 A 22 22 0 1 1 50 28" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />
    </svg>
  );
});

CoffeeStain.displayName = "CoffeeStain";
