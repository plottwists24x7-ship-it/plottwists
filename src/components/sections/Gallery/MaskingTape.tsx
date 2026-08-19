import React from "react";

interface MaskingTapeProps {
  color?: string;
}

export default function MaskingTape({ color = "beige" }: MaskingTapeProps) {
  // Zig-zag coordinate vertices to simulate real jagged torn tape ends
  const tapeClip = "polygon(0% 12%, 4% 0%, 96% 0%, 100% 12%, 98% 30%, 100% 50%, 97% 65%, 100% 88%, 96% 100%, 4% 100%, 0% 88%, 2% 65%, 0% 50%, 3% 30%)";
  
  let bgClass = "bg-[#FAF5EE]/90 border-x border-[#3D2E25]/10";
  let bgStyle: React.CSSProperties = {};

  if (color === "blue") {
    bgClass = "bg-[#2D6DFF]/80 border-x border-[#3D2E25]/15";
  } else if (color === "pink") {
    bgClass = "bg-[#F43F5E]/85 border-x border-[#3D2E25]/15";
  } else if (color === "brown") {
    bgClass = "bg-[#854D0E]/85 border-x border-[#3D2E25]/15";
  } else if (color === "yellow-grid") {
    bgClass = "bg-[#F4FF18]/90 border-x border-[#3D2E25]/15";
    bgStyle = {
      backgroundImage: "radial-gradient(#3D2E25 12%, transparent 13%), radial-gradient(#3D2E25 12%, transparent 13%)",
      backgroundPosition: "0 0, 4px 4px",
      backgroundSize: "8px 8px"
    };
  } else if (color === "striped") {
    bgStyle = {
      backgroundImage: "repeating-linear-gradient(45deg, #F43F5E 0, #F43F5E 4px, #FFFFFF 4px, #FFFFFF 8px)",
      opacity: 0.95
    };
  }

  return (
    <div
      className={`tape-wrapper absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-[58px] h-[18px] z-30 pointer-events-none shadow-[1px_1px_2px_rgba(61,46,37,0.05)] border-t border-white/20 ${bgClass}`}
      style={{ clipPath: tapeClip, ...bgStyle }}
    />
  );
}
