import React from "react";

interface StickerProps {
  type: "smiley-yellow" | "smiley-blue" | "sparkle" | "heart" | "flower" | "seal" | "diamond";
  className?: string;
  style?: React.CSSProperties;
}

export default function Sticker({ type, className = "", style }: StickerProps) {
  if (type === "smiley-yellow") {
    return (
      <div 
        className={`w-10 h-10 rounded-full bg-[#F4FF18] border-3 border-[#3D2E25] shadow-[2px_2px_0px_0px_#3D2E25] flex items-center justify-center rotate-[-12deg] pointer-events-none ${className}`}
        style={style}
        role="img"
        aria-label="Yellow smiley sticker"
      >
        <svg className="w-6 h-6 text-[#3D2E25]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="8.5" cy="9" r="1.2" fill="currentColor" />
          <circle cx="15.5" cy="9" r="1.2" fill="currentColor" />
          <path d="M7 14 C 9 17.5, 15 17.5, 17 14" />
        </svg>
      </div>
    );
  }
  
  if (type === "smiley-blue") {
    return (
      <div 
        className={`w-9 h-9 rounded-full bg-[#2D6DFF] border-3 border-[#3D2E25] shadow-[2px_2px_0px_0px_#3D2E25] flex items-center justify-center rotate-[8deg] pointer-events-none ${className}`}
        style={style}
        role="img"
        aria-label="Blue smiley sticker"
      >
        <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="8.5" cy="9" r="1.2" fill="currentColor" />
          <circle cx="15.5" cy="9" r="1.2" fill="currentColor" />
          <path d="M7 14 C 9 17.5, 15 17.5, 17 14" />
        </svg>
      </div>
    );
  }

  if (type === "sparkle") {
    return (
      <div className={`w-7 h-7 pointer-events-none ${className}`} style={style} role="img" aria-label="Decorative sparkle">
        <svg className="w-full h-full text-[#F4FF18]" viewBox="0 0 24 24" fill="currentColor" stroke="#3D2E25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 Q12 12 2 12 Q12 12 12 22 Q12 12 22 12 Q12 12 12 2 Z" />
        </svg>
      </div>
    );
  }

  if (type === "heart") {
    return (
      <div className={`w-7 h-7 text-[#F43F5E] filter drop-shadow-[2px_2px_0px_#3D2E25] pointer-events-none ${className}`} style={style} role="img" aria-label="Decorative heart outline">
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }

  if (type === "flower") {
    return (
      <div className={`w-9 h-9 pointer-events-none ${className}`} style={style} role="img" aria-label="Pink flower sticker">
        <svg className="w-full h-full text-[#F43F5E]" viewBox="0 0 100 100" fill="currentColor" stroke="#3D2E25" strokeWidth="6" strokeLinejoin="round" aria-hidden="true">
          <circle cx="50" cy="22" r="16" />
          <circle cx="24" cy="40" r="16" />
          <circle cx="34" cy="71" r="16" />
          <circle cx="66" cy="71" r="16" />
          <circle cx="76" cy="40" r="16" />
          <circle cx="50" cy="48" r="12" fill="#F4FF18" />
        </svg>
      </div>
    );
  }

  if (type === "diamond") {
    return (
      <div className={`w-7 h-7 pointer-events-none ${className}`} style={style} role="img" aria-label="Decorative diamond sticker">
        <svg className="w-full h-full text-[#22D3EE]" viewBox="0 0 24 24" fill="currentColor" stroke="#3D2E25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12,2 22,9 12,22 2,9" />
        </svg>
      </div>
    );
  }

  if (type === "seal") {
    return (
      <div 
        className={`w-14 h-14 rounded-full bg-[#854D0E] border-3 border-[#3D2E25] shadow-[2px_2px_0px_0px_#3D2E25] flex flex-col items-center justify-center rotate-[-8deg] pointer-events-none font-bubble text-white text-[0.45rem] leading-[0.6rem] uppercase text-center ${className}`}
        style={style}
        role="img"
        aria-label="Made with love seal sticker"
      >
        <span>made</span>
        <span>with</span>
        <span>love</span>
      </div>
    );
  }

  return null;
}
