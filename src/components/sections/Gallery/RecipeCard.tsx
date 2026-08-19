import React, { useRef } from "react";

interface RecipeCardProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function RecipeCard({ className = "", style }: RecipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const tiltX = ((y - 50) / 50) * -1.5;
    const tiltY = ((x - 50) / 50) * 1.5;

    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);
    cardRef.current.style.setProperty("--tilt-x", `${tiltX}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${tiltY}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--tilt-x", "0deg");
    cardRef.current.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`recipe-card-inner absolute bg-[#FFFDF0] border-3 border-[#3D2E25] shadow-[4px_4px_0px_0px_#3D2E25] p-4.5 rounded-xl z-8 select-none font-bubble text-[#3D2E25] w-[190px] h-[120px] transition-all duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      style={{
        ...style,
        transform: `rotate(-4deg) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--elevate-y, 0px))`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Reflection highlight overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-30 rounded-xl"
        style={{
          background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%)",
          mixBlendMode: "overlay"
        }}
      />

      <div className="flex justify-between items-center border-b-2 border-[#3D2E25]/10 pb-1.5 mb-2">
        <span className="text-[0.5rem] uppercase tracking-wider font-semibold opacity-75">Daily Note</span>
        <span className="text-xs" role="img" aria-label="Cookie emoji">🍪</span>
      </div>
      <p className="text-[0.65rem] leading-snug font-bubble text-center mt-2 font-semibold">
        Freshly baked <br />
        happiness <br />
        in every bite. ♥
      </p>
    </div>
  );
}
