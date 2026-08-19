"use client";

import { useEffect, useState } from "react";
import MaterialSurface from "@/components/common/MaterialSurface";

interface ReflectionProps {
  scrollProgress: number;
  prefersReduced?: boolean;
  isMobile?: boolean;
}

interface DustMote {
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
}

export default function Space6({ scrollProgress, prefersReduced = false, isMobile = false }: ReflectionProps) {
  const targetZ = -8500;
  const netZ = targetZ + scrollProgress * 10500;

  const [dustMotes, setDustMotes] = useState<DustMote[]>([]);

  useEffect(() => {
    // Generate soft sacred dust particles drifting slowly in the sunbeam
    const motes = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${10 + Math.random() * 80}%`,
      size: `${1.2 + Math.random() * 2.5}px`,
      delay: `${Math.random() * -12}s`,
      duration: `${14 + Math.random() * 10}s`,
    }));
    setDustMotes(motes);
  }, []);

  // Compute Opacity based on scroll progress window
  let opacity = 0;
  if (prefersReduced) {
    opacity = (scrollProgress >= 0.68 && scrollProgress < 0.82) ? 1 : 0;
  } else {
    if (scrollProgress >= 0.64 && scrollProgress < 0.68) {
      opacity = (scrollProgress - 0.64) / 0.04;
    } else if (scrollProgress >= 0.68 && scrollProgress < 0.78) {
      opacity = 1;
    } else if (scrollProgress >= 0.78 && scrollProgress < 0.82) {
      opacity = 1 - (scrollProgress - 0.78) / 0.04;
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

  // Foreground occlusion Z drift
  const fgZOffset = prefersReduced ? 0 : (scrollProgress - 0.64) * 1600;

  // Monolith reveals
  const monolithOpacity = prefersReduced ? 1.0 : Math.max(0, Math.min(1, (scrollProgress - 0.64) * 10));

  // Centered sacred cathedral scale transforms
  const monolithTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(0px, -20px, 0px) scale(0.6)"
    : "translate3d(0px, 0px, 150px) rotateY(-15deg) rotateX(8deg)";

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
      {/* Dramatic Cathedral Lighting Spotlights & Shadows */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/55 via-transparent to-transparent pointer-events-none z-45"
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] bg-[#C2A679]/12 pointer-events-none mix-blend-screen"
        style={{
          transform: "translate3d(0px, -180px, 100px)",
        }}
      />

      {/* Volumetric Skylight Shaft filtering down from ceiling */}
      {!prefersReduced && (
        <div
          className="absolute w-[360px] h-[900px] bg-gradient-to-b from-[#C2A679]/20 via-[#C2A679]/5 to-transparent pointer-events-none z-10"
          style={{
            transform: "translate3d(0px, -350px, 50px) rotateX(12deg)",
            clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Floating Dust Particles in the Sunbeam */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 opacity-35" style={{ transformStyle: "preserve-3d" }}>
          {dustMotes.map((mote) => (
            <div
              key={mote.id}
              className="absolute rounded-full bg-[#C2A679]/25 blur-[0.4px]"
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
                animation: `dust-float ${mote.duration} linear infinite`,
                animationDelay: mote.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* FOREGROUND LAYER: Brutalist Concrete Portal entrance */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-40" style={{ transformStyle: "preserve-3d" }}>
          {/* Symmetrical concrete pillars framing the colossal room */}
          <MaterialSurface
            type="concrete"
            className="absolute w-28 h-[800px] border border-[#222221]/15 shadow-heavy-slab"
            style={{
              transform: `translate3d(-360px, -200px, ${300 - fgZOffset}px) rotateY(15deg)`,
            }}
          />

          <MaterialSurface
            type="concrete"
            className="absolute w-28 h-[800px] border border-[#222221]/15 shadow-heavy-slab"
            style={{
              transform: `translate3d(360px, -200px, ${300 - fgZOffset}px) rotateY(-15deg)`,
            }}
          />
        </div>
      )}

      {/* MIDDLE GROUND LAYER: Suspended Floating Concrete Monolith with Golden Core */}
      <div
        className="absolute transition-all duration-300 z-35"
        style={{
          transform: monolithTransform,
          transformStyle: "preserve-3d",
          opacity: monolithOpacity,
        }}
      >
        <div className="relative w-full h-full flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Sacred Golden Core */}
          <div
            className="absolute w-32 h-32 rounded-full bg-[#C2A679] opacity-95 blur-[28px] mix-blend-screen animate-pulse"
            style={{
              boxShadow: "0 0 100px #C2A679, 0 0 200px #A25A38",
            }}
          />

          {/* Fractured Slab 1 */}
          <MaterialSurface
            type="concrete"
            className="absolute w-44 h-56 shadow-heavy-slab border border-[#222221]/15"
            style={{
              transform: "translate3d(-70px, -100px, 60px) rotateX(12deg) rotateY(18deg)",
              animation: "dust-float 16s ease-in-out infinite alternate",
            }}
          >
            <div className="w-full h-full border border-dashed border-graphite-ink/5" />
          </MaterialSurface>

          {/* Fractured Slab 2 */}
          <MaterialSurface
            type="concrete"
            className="absolute w-40 h-52 shadow-heavy-slab border border-[#222221]/15"
            style={{
              transform: "translate3d(80px, -80px, -30px) rotateX(-8deg) rotateY(-20deg)",
              animation: "dust-float 18s ease-in-out infinite alternate-reverse",
              animationDelay: "-2s",
            }}
          >
            <div className="w-full h-full border border-dashed border-graphite-ink/5" />
          </MaterialSurface>

          {/* Fractured Slab 3 */}
          <MaterialSurface
            type="concrete"
            className="absolute w-56 h-44 shadow-heavy-slab border border-[#222221]/15"
            style={{
              transform: "translate3d(-10px, 90px, 20px) rotateX(-15deg) rotateY(10deg)",
              animation: "dust-float 22s ease-in-out infinite alternate",
              animationDelay: "-4s",
            }}
          >
            <div className="w-full h-full border border-dashed border-graphite-ink/5" />
          </MaterialSurface>

          {/* Fractured Slab 4 */}
          <MaterialSurface
            type="stone"
            className="absolute w-28 h-52 shadow-heavy-slab border border-canvas-base/5"
            style={{
              transform: "translate3d(-130px, 20px, -50px) rotateY(-35deg)",
              animation: "dust-float 15s ease-in-out infinite alternate-reverse",
            }}
          >
            <div className="w-full h-full flex flex-col justify-end p-2 opacity-20 select-none">
              <span className="font-mono text-[0.45rem] text-canvas-base/50 tracking-wider">FRAGMENT_04</span>
            </div>
          </MaterialSurface>

          {/* Fractured Slab 5 */}
          <MaterialSurface
            type="walnut"
            className="absolute w-18 h-64 shadow-heavy-slab border border-[#2A1F19]"
            style={{
              transform: "translate3d(130px, 30px, 80px) rotateX(10deg) rotateY(40deg) rotateZ(15deg)",
              animation: "dust-float 20s ease-in-out infinite alternate",
            }}
          />

        </div>
      </div>

    </div>
  );
}
