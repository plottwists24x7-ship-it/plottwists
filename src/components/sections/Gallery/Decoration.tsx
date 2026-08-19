import React from "react";

interface DecorationProps {
  type: "coffee" | "chocolate" | "arrow-down" | "arrow-up";
  className?: string;
  style?: React.CSSProperties;
}

export default function Decoration({ type, className = "", style }: DecorationProps) {
  if (type === "coffee") {
    return (
      <div className={`text-[#3D2E25] pointer-events-none ${className}`} style={style} role="img" aria-label="Coffee bean doodle">
        <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)" />
          <path d="M3.5 20.5 C 10 14, 14 10, 20.5 3.5" stroke="#FAF9F6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === "chocolate") {
    return (
      <div className={`text-[#3D2E25] pointer-events-none ${className}`} style={style} role="img" aria-label="Chocolate chip crumb">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 C 7 2, 6 6, 4 9 C 2 12, 3 17, 7 20 C 11 23, 17 21, 20 17 C 23 13, 21 8, 18 5 C 15 2, 13 2, 12 2 Z" />
        </svg>
      </div>
    );
  }

  if (type === "arrow-down") {
    return (
      <div className={`text-[#3D2E25] pointer-events-none ${className}`} style={style} role="img" aria-label="Doodle arrow pointing down">
        <svg className="w-14 h-14 rotate-[-20deg]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" aria-hidden="true">
          <path d="M20 70 C 35 70, 65 50, 75 25" />
          <path d="M58 28 L 75 25 L 73 42" />
        </svg>
      </div>
    );
  }

  if (type === "arrow-up") {
    return (
      <div className={`text-[#3D2E25] pointer-events-none ${className}`} style={style} role="img" aria-label="Doodle arrow pointing up">
        <svg className="w-14 h-14 rotate-[110deg]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" aria-hidden="true">
          <path d="M20 70 C 35 70, 65 50, 75 25" />
          <path d="M58 28 L 75 25 L 73 42" />
        </svg>
      </div>
    );
  }

  return null;
}
