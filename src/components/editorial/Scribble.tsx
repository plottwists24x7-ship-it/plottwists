import React from "react";

export interface ScribbleProps {
  type: "loop" | "arrow" | "heart" | "star" | "flower" | "leaf" | "swirl" | "squiggle" | "check" | "cross" | "stitch" | "flourish" | "dots";
  color?: string;
  rotation?: number;
  opacity?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Scribble: React.FC<ScribbleProps> = React.memo(({
  type,
  color = "#2E2B28",
  rotation = 0,
  opacity = 0.35,
  scale = 1,
  className = "",
  style = {}
}) => {
  const getPath = () => {
    switch (type) {
      case "loop":
        return <path d="M4 20 C 14 4, 28 32, 44 12 C 54 2, 64 24, 76 16" />;
      case "arrow":
        return (
          <>
            <path d="M6 18 Q 40 4, 70 24" />
            <path d="M58 14 L 72 25 L 60 34" />
          </>
        );
      case "heart":
        return <path d="M16 28 L 14.5 26.5 C 7 19.5 2 15 2 9.5 C 2 5 5.5 1.5 10 1.5 C 12.5 1.5 15 2.7 16 4.5 C 17 2.7 19.5 1.5 22 1.5 C 26.5 1.5 30 5 30 9.5 C 30 15 25 19.5 17.5 26.5 L 16 28 Z" fill="none" />;
      case "star":
        return <path d="M16 2 Q 17 12 28 16 Q 17 20 16 30 Q 15 20 4 16 Q 15 12 16 2 Z" />;
      case "flower":
        return <path d="M16 8 C 16 2, 24 2, 24 8 C 30 8, 30 16, 24 16 C 24 22, 16 22, 16 16 C 10 16, 10 8, 16 8 Z M16 12 A 2 2 0 1 0 20 12 A 2 2 0 1 0 16 12" />;
      case "leaf":
        return <path d="M4 28 C 4 14, 18 4, 28 4 C 28 18, 18 28, 4 28 Z M4 28 L 24 8" />;
      case "swirl":
        return <path d="M16 4 A 12 12 0 1 1 4 16 M4 8 L 4 16 L 12 16" />;
      case "squiggle":
        return <path d="M4 12 Q 12 2, 20 12 T 36 12 T 52 12 T 68 12" />;
      case "check":
        return <path d="M4 14 L 12 22 L 28 4" />;
      case "cross":
        return <path d="M6 6 L 26 26 M26 6 L 6 26 M36 6 L 56 26 M56 6 L 36 26" />;
      case "flourish":
        return <path d="M4 16 C 20 4, 30 28, 46 16 C 58 4, 68 24, 76 12" />;
      case "dots":
        return (
          <>
            <circle cx="8" cy="12" r="2" fill="currentColor" />
            <circle cx="28" cy="8" r="1.5" fill="currentColor" />
            <circle cx="48" cy="18" r="2" fill="currentColor" />
            <circle cx="68" cy="10" r="1.5" fill="currentColor" />
          </>
        );
      case "stitch":
        return <path d="M2 10 L 10 10 M16 10 L 24 10 M30 10 L 38 10 M44 10 L 52 10" strokeDasharray="4 4" />;
      default:
        return <path d="M4 12 Q 24 2, 44 12" />;
    }
  };

  return (
    <svg
      className={`Scribble inline-block pointer-events-none select-none ${className}`}
      style={{
        color,
        opacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center center",
        ...style
      }}
      viewBox="0 0 80 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {getPath()}
    </svg>
  );
});

Scribble.displayName = "Scribble";
