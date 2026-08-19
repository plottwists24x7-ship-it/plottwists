import React, { useRef } from "react";
import Image from "next/image";
import { PhotoCardConfig } from "./GalleryData";
import Sticker from "./Sticker";

interface PhotoCardProps {
  config: PhotoCardConfig;
  className?: string;
}

export default function PhotoCard({ config, className = "" }: PhotoCardProps) {
  const { src, alt, label, width, height, rotation, zIndex, sticker } = config;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Subtle 3D perspective tilt (max ±1.5 degrees for Apple-like premium weightiness)
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
      className={`photo-card relative bg-white border-[10px] border-white border-4 border-[#3D2E25] rounded-[20px] shadow-[8px_8px_0_#3D2E25] group select-none pointer-events-auto transition-all duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      style={{
        width,
        height,
        // Base rotation + tilt axis transforms + optional elevation
        transform: `rotate(${rotation}) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--elevate-y, 0px))`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Dynamic Laminated Reflection Sheen Layer (dynamically tracks mouse position) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-30 rounded-[10px]"
        style={{
          background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%)",
          mixBlendMode: "overlay"
        }}
      />

      {/* Card level stickers */}
      {sticker && (
        <Sticker 
          type={sticker.type} 
          className={`${sticker.positionClass} scrapbook-sticker`} 
        />
      )}

      {/* Image frame */}
      <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[#EAE4D9]/10">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 250px, 520px"
          className="object-cover object-center scale-103"
        />
        {label && (
          <div className="absolute bottom-2 left-2 bg-[#3D2E25] text-[#FAF9F6] font-bubble text-[0.5rem] uppercase tracking-wider px-2 py-0.5 rounded opacity-90 z-20">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
