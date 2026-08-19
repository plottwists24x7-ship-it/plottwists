"use client";

import { useEffect, useState } from "react";
import MaterialSurface from "@/components/common/MaterialSurface";

interface ObservationProps {
  scrollProgress: number;
  prefersReduced?: boolean;
  isMobile?: boolean;
}

export default function Space4({ scrollProgress, prefersReduced = false, isMobile = false }: ObservationProps) {
  const targetZ = -5000;
  const netZ = targetZ + scrollProgress * 10500;

  const [isPhotoShifting, setIsPhotoShifting] = useState(false);

  // Listen to global wind triggers to shift hanging photographs
  useEffect(() => {
    const handleLivingStudio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      if (type === "page-turn" || type === "rope-twist") {
        setIsPhotoShifting(true);
        setTimeout(() => setIsPhotoShifting(false), 2400);
      }
    };
    window.addEventListener("living-studio-trigger", handleLivingStudio);
    return () => window.removeEventListener("living-studio-trigger", handleLivingStudio);
  }, []);

  // Compute Opacity based on scroll progress window
  let opacity = 0;
  if (prefersReduced) {
    opacity = (scrollProgress >= 0.40 && scrollProgress < 0.54) ? 1 : 0;
  } else {
    if (scrollProgress >= 0.36 && scrollProgress < 0.40) {
      opacity = (scrollProgress - 0.36) / 0.04;
    } else if (scrollProgress >= 0.40 && scrollProgress < 0.50) {
      opacity = 1;
    } else if (scrollProgress >= 0.50 && scrollProgress < 0.54) {
      opacity = 1 - (scrollProgress - 0.50) / 0.04;
    } else {
      opacity = 0;
    }
  }

  // Cinematic Depth-of-Field focus blur (disabled on mobile)
  let blur = 0;
  if (!prefersReduced && !isMobile) {
    if (netZ > 50) {
      blur = Math.min(10, (netZ - 50) * 0.05);
    } else if (netZ < -1000) {
      blur = Math.min(5, (-netZ - 1000) * 0.007);
    }
  }

  // Foreground Z drift
  const fgZOffset = prefersReduced ? 0 : (scrollProgress - 0.36) * 1600;

  // Responsive spatial transforms
  const shelfTransform = prefersReduced
    ? "none"
    : isMobile
    ? `translate3d(-70px, -90px, ${100 - fgZOffset}px) scale(0.65)`
    : `translate3d(-340px, 20px, ${50 - fgZOffset}px) rotateY(15deg) scale(0.9)`;

  const sculptureTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(70px, -90px, 0px) scale(0.65)"
    : "translate3d(140px, 40px, 150px) rotateY(-18deg) rotateX(8deg)";

  const backgroundWallTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(0px, 150px, 0px) scale(0.7)"
    : "translate3d(240px, -40px, -120px) rotateY(-10deg)";

  return (
    <div
      className="spatial-scene w-full h-full flex flex-col justify-center items-center"
      style={{
        transform: prefersReduced ? "none" : `translate3d(0, 0, ${targetZ}px)`,
        opacity,
        visibility: opacity <= 0 ? "hidden" : "visible",
        pointerEvents: opacity <= 0 ? "none" : "auto",
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        transition: prefersReduced ? "opacity 0.5s ease" : "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Stark Spotlights & Deep Dark Corners Lighting Layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0d0d0e]/95 to-transparent pointer-events-none z-45"
        style={{
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-[100px] bg-[#C2A679]/15 pointer-events-none mix-blend-screen"
        style={{
          transform: "translate3d(-180px, -50px, 100px)",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[90px] bg-[#C2A679]/12 pointer-events-none mix-blend-screen"
        style={{
          transform: "translate3d(120px, -30px, 180px)",
        }}
      />

      {/* FOREGROUND LAYER: Steel Gantry Beams & Dangling cords */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-40" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Gantry steel beam left */}
          <div
            className="absolute w-8 h-[700px] bg-graphite-ink border-r border-[#222221]/30 shadow-2xl"
            style={{
              transform: `translate3d(-390px, -250px, ${300 - fgZOffset}px) rotateY(10deg)`,
            }}
          />

          {/* Dangling ropes/cords */}
          <div
            className="absolute w-1 h-[400px] bg-[#2A1F19]/40 border-l border-[#222221]/20"
            style={{
              transform: `translate3d(80px, -300px, ${200 - fgZOffset}px)`,
            }}
          />
          <div
            className="absolute w-1 h-[450px] bg-[#2A1F19]/40 border-l border-[#222221]/20"
            style={{
              transform: `translate3d(-100px, -320px, ${100 - fgZOffset}px)`,
            }}
          />

        </div>
      )}

      {/* MIDDLE GROUND LAYER (Left Wood Shelf with childhood artifacts, Right concrete balancing blocks) */}
      
      {/* Wood Shelving Unit */}
      <div
        className="absolute transition-all duration-300 z-35"
        style={{
          transform: shelfTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <MaterialSurface
          type="walnut"
          className="w-[200px] h-[340px] p-4 border border-[#2A1F19] shadow-heavy-slab flex flex-col justify-between"
        >
          {/* Top shelf row: art school rejection letter and travel postcards */}
          <div className="flex gap-2 justify-around border-b border-[#2A1F19]/25 pb-3" style={{ transformStyle: "preserve-3d" }}>
            
            {/* School rejection letter */}
            <MaterialSurface
              type="paper"
              className="w-12 h-14 p-1 shadow-md border border-graphite-ink/10 flex flex-col justify-between text-[#222221]"
              style={{ transform: "rotateY(-15deg) rotateZ(-5deg)", transformStyle: "preserve-3d" }}
            >
              <span className="font-mono text-[0.38rem] font-bold text-sienna-oxide uppercase">REJECTION</span>
              <span className="font-serif text-[0.28rem] leading-none opacity-60">"We regret to inform..."</span>
            </MaterialSurface>

            {/* Travel postcard */}
            <MaterialSurface
              type="paper"
              className="w-10 h-10 shadow-sm border border-graphite-ink/5 relative overflow-hidden"
              style={{ transform: "translate3d(0, -4px, 4px) rotate(15deg)" }}
            >
              <div className="absolute right-0.5 top-0.5 w-2 h-2.5 bg-gold-lustre/30 border border-graphite-ink/10" />
              <div className="absolute bottom-1 left-0.5 w-6 h-[1.5px] bg-[#222221]/15" />
            </MaterialSurface>
          </div>

          {/* Middle shelf row: journals and broken wood frames */}
          <div className="flex gap-2 justify-around border-b border-t border-[#2A1F19]/25 py-2" style={{ transformStyle: "preserve-3d" }}>
            {/* Old leather journal book */}
            <MaterialSurface
              type="walnut"
              className="w-8 h-12 border border-[#2A1F19]/60 shadow-sm"
              style={{ transform: "rotateY(-5deg)" }}
            />
            {/* Broken wood frame */}
            <div 
              className="w-10 h-12 border border-dashed border-[#222221]/20 bg-transparent relative"
              style={{ transform: "rotate(8deg)" }}
            >
              {/* Cracked line represent */}
              <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-[#2A1F19]/40 rotate-[35deg]" />
            </div>
          </div>

          {/* Bottom shelf row: family photo and sketchbooks */}
          <div className="flex gap-2 justify-around border-t border-[#2A1F19]/25 pt-3" style={{ transformStyle: "preserve-3d" }}>
            {/* Family photo card */}
            <MaterialSurface
              type="paper"
              className="w-12 h-16 p-1 border border-graphite-ink/10 shadow-sm flex flex-col justify-between"
              style={{ transform: "rotateY(10deg)" }}
            >
              <div className="w-full h-10 bg-graphite-ink/65" />
              <div className="text-[0.3rem] font-mono text-center text-graphite-ink/30">FAMILY.12</div>
            </MaterialSurface>

            {/* Old sketchbook */}
            <div className="w-10 h-14 border border-dashed border-[#222221]/15 bg-canvas-base/30 rounded-[1px] transform rotate-[-8deg]" />
          </div>

          <div className="font-mono text-[0.45rem] text-canvas-base/30 text-center uppercase tracking-wider select-none">
            [ Shelf rack 04 ]
          </div>
        </MaterialSurface>
      </div>

      {/* Right Concrete balancing sculpture */}
      <div
        className="absolute transition-all duration-300 z-35"
        style={{
          transform: sculptureTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative w-[180px] h-[320px] flex flex-col justify-end items-center" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Tilted top concrete block */}
          <MaterialSurface
            type="concrete"
            className="absolute w-28 h-28 border border-graphite-ink/10 shadow-heavy-slab flex items-center justify-center"
            style={{
              transform: "translate3d(-10px, -140px, 20px) rotateX(12deg) rotateY(25deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="border border-dashed border-graphite-ink/5 w-full h-full flex flex-col justify-between p-2">
              <span className="font-mono text-[0.4rem] text-graphite-ink/30">[ STRUCTURE ]</span>
            </div>
          </MaterialSurface>

          {/* Middle Walnut connector column */}
          <MaterialSurface
            type="walnut"
            className="absolute w-6 h-48 border border-[#222221]/15 shadow-md"
            style={{
              transform: "translate3d(10px, -60px, 0px)",
            }}
          />

          {/* Base pedestal stone block */}
          <MaterialSurface
            type="stone"
            className="w-36 h-20 border border-canvas-base/10 shadow-2xl flex items-center justify-center"
            style={{
              transform: "rotateY(45deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <span className="font-mono text-[0.48rem] text-canvas-base/40 tracking-[0.2em]">PEDESTAL</span>
          </MaterialSurface>

        </div>
      </div>

      {/* BACKGROUND LAYER: Pinned blueprints & childhood sketches on the wall (Replaces text) */}
      <div
        className="absolute w-[320px] text-left select-none transition-all duration-300 z-20 flex flex-col gap-4"
        style={{
          transform: backgroundWallTransform,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Large Blueprint Plan Sheet */}
        <MaterialSurface
          type="paper"
          className="w-[280px] h-[190px] p-4 shadow-heavy-slab bg-[#3a4f66] relative"
        >
          {/* Blue line sketch overlay */}
          <div className="w-full h-full border border-[#EAE4D9]/20 relative overflow-hidden flex flex-col justify-between">
            <svg className="absolute inset-0 w-full h-full opacity-60">
              <path d="M 10,10 L 260,10 M 10,170 L 260,170" stroke="#EAE4D9" strokeWidth="0.8" />
              <path d="M 40,30 Q 140,110 240,30" fill="none" stroke="#EAE4D9" strokeWidth="1" />
              <circle cx="140" cy="90" r="35" fill="none" stroke="#EAE4D9" strokeWidth="0.8" strokeDasharray="3 3" />
            </svg>
            <span className="font-mono text-[0.42rem] text-[#EAE4D9]/50 uppercase tracking-[0.25em]">[ studio blueprint 1994 ]</span>
            <span className="font-mono text-[0.38rem] text-[#EAE4D9]/30 self-end">[ scale 1:50 ]</span>
          </div>
        </MaterialSurface>

        {/* Childhood sketch pinned below */}
        <MaterialSurface
          type="paper"
          className="w-[160px] h-[130px] p-3 shadow-md border border-graphite-ink/10 relative transition-all duration-[2400ms] ease-in-out self-end"
          style={{
            transform: isPhotoShifting 
              ? "rotate(-5deg) translate3d(-10px, 0, 5px)" 
              : "rotate(-8deg)",
          }}
        >
          {/* Crayon drawing representation */}
          <div className="w-full h-full border border-dashed border-graphite-ink/5 flex flex-col justify-between">
            <svg className="w-full h-[60px] opacity-40">
              {/* Crude house */}
              <polygon points="30,40 50,20 70,40" fill="none" stroke="var(--color-sienna-oxide)" strokeWidth="2" />
              <rect x="35" y="40" width="30" height="20" fill="none" stroke="var(--color-sienna-oxide)" strokeWidth="2" />
              <circle cx="90" cy="20" r="6" fill="none" stroke="var(--color-gold-lustre)" strokeWidth="1.5" />
            </svg>
            <span className="font-serif italic text-[0.45rem] text-graphite-ink/50 text-center block mb-1">
              "my home" — age 6
            </span>
          </div>
        </MaterialSurface>
      </div>

    </div>
  );
}
