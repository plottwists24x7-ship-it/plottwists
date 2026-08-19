"use client";

import { useEffect, useState } from "react";
import CanvasFrame from "@/components/common/CanvasFrame";
import MaterialSurface from "@/components/common/MaterialSurface";

interface SilenceProps {
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

export default function Space2({ scrollProgress, prefersReduced = false, isMobile = false }: SilenceProps) {
  const targetZ = -1500;
  const netZ = targetZ + scrollProgress * 10500;

  const [dustMotes, setDustMotes] = useState<DustMote[]>([]);
  const [isLinenSwaying, setIsLinenSwaying] = useState(false);

  useEffect(() => {
    const motes = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 80}%`,
      size: `${1.2 + Math.random() * 2.2}px`,
      delay: `${Math.random() * -15}s`,
      duration: `${12 + Math.random() * 9}s`,
    }));
    setDustMotes(motes);
  }, []);

  // Listen to 8-second global wind ticker
  useEffect(() => {
    const handleLivingStudio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      if (type === "rope-twist" || type === "lamp-swing") {
        setIsLinenSwaying(true);
        setTimeout(() => setIsLinenSwaying(false), 3800);
      }
    };
    window.addEventListener("living-studio-trigger", handleLivingStudio);
    return () => window.removeEventListener("living-studio-trigger", handleLivingStudio);
  }, []);

  // Compute Opacity based on scroll progress window
  let opacity = 0;
  if (prefersReduced) {
    opacity = (scrollProgress >= 0.12 && scrollProgress < 0.26) ? 1 : 0;
  } else {
    if (scrollProgress >= 0.08 && scrollProgress < 0.12) {
      opacity = (scrollProgress - 0.08) / 0.04;
    } else if (scrollProgress >= 0.12 && scrollProgress < 0.22) {
      opacity = 1;
    } else if (scrollProgress >= 0.22 && scrollProgress < 0.26) {
      opacity = 1 - (scrollProgress - 0.22) / 0.04;
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
  const fgZOffset = prefersReduced ? 0 : (scrollProgress - 0.08) * 1600;

  // Object Choreography: walnut easel frame
  const frameZOffset = prefersReduced
    ? 0
    : Math.max(0, Math.min(45, (0.22 - scrollProgress) * 550));

  // Asymmetrical offset coordinates for isolation mood (no centered placement)
  const frameTransform = prefersReduced
    ? "rotate(1.5deg)"
    : isMobile
    ? `translate3d(50px, 15px, ${frameZOffset}px) scale(0.72)`
    : `translate3d(220px, 40px, ${frameZOffset}px) rotateY(-20deg) rotateX(4deg) scale(0.92)`;

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
      {/* Cool Indirect Shadow Lighting Layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#1b1c1e]/30 via-transparent to-transparent pointer-events-none"
        style={{
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-[100px] bg-[#222221]/15 pointer-events-none mix-blend-multiply"
        style={{
          transform: "translate3d(180px, -70px, 120px)",
        }}
      />

      {/* Floating Dust particles in cool shadows */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 opacity-25" style={{ transformStyle: "preserve-3d" }}>
          {dustMotes.map((mote) => (
            <div
              key={mote.id}
              className="absolute rounded-full bg-[#EAE4D9]/20 blur-[0.5px]"
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

      {/* FOREGROUND LAYER: Hanging Linen cloths & old ropes (Camera brushes past) */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-40" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Hanging Linen sheet 1 (Left side, sways dynamically) */}
          <div
            className="absolute w-[200px] h-[440px] bg-[#EAE4D9]/80 border border-graphite-ink/5 shadow-md transition-all duration-[3000ms] ease-in-out"
            style={{
              transform: isLinenSwaying
                ? `translate3d(-260px, -150px, ${300 - fgZOffset}px) rotateY(25deg) rotateZ(-5deg)`
                : `translate3d(-260px, -150px, ${300 - fgZOffset}px) rotateY(15deg) rotateZ(-3deg)`,
            }}
          >
            <div className="absolute inset-0 opacity-[0.08] texture-linen pointer-events-none" />
          </div>

          {/* Hanging Linen sheet 2 (Right side, sways dynamically) */}
          <div
            className="absolute w-[180px] h-[380px] bg-[#EAE4D9]/75 border border-graphite-ink/5 shadow-sm transition-all duration-[3000ms] ease-in-out"
            style={{
              transform: isLinenSwaying
                ? `translate3d(180px, -100px, ${100 - fgZOffset}px) rotateY(-26deg) rotateZ(8deg)`
                : `translate3d(180px, -100px, ${100 - fgZOffset}px) rotateY(-20deg) rotateZ(5deg)`,
            }}
          >
            <div className="absolute inset-0 opacity-[0.06] texture-linen pointer-events-none" />
          </div>

          {/* Old ropes dangling from ceiling */}
          <div
            className="absolute w-0.5 h-[400px] bg-[#2A1F19]/45 border-l border-[#222221]/15 transition-all duration-[3500ms] ease-in-out"
            style={{
              transform: isLinenSwaying
                ? `translate3d(-100px, -240px, ${220 - fgZOffset}px) rotateZ(-6deg)`
                : `translate3d(-100px, -240px, ${220 - fgZOffset}px) rotateZ(-3deg)`,
            }}
          />

          {/* Open Paint Bucket on floor left */}
          <MaterialSurface
            type="concrete"
            className="absolute w-12 h-16 border border-graphite-ink/10 shadow-md flex flex-col justify-end p-1"
            style={{
              transform: `translate3d(-240px, 120px, ${220 - fgZOffset}px) rotateX(10deg)`,
            }}
          >
            <div className="absolute top-[2px] left-[5%] w-[90%] h-2 rounded-full border border-[#222221]/20 bg-[#A25A38]/50" />
            <div className="font-mono text-[0.38rem] text-graphite-ink/20">SIENNA</div>
          </MaterialSurface>

          {/* Broken Glass shards on the floor */}
          <div
            className="absolute w-20 h-10 flex gap-2"
            style={{
              transform: `translate3d(140px, 140px, ${150 - fgZOffset}px) rotateX(90deg)`,
            }}
          >
            <div className="w-4 h-4 bg-canvas-base/40 border border-graphite-ink/5 shadow-sm" style={{ clipPath: "polygon(0 0, 100% 30%, 30% 100%)" }} />
            <div className="w-5 h-3 bg-canvas-base/40 border border-graphite-ink/5 shadow-sm" style={{ clipPath: "polygon(20% 0, 100% 100%, 0 80%)" }} />
          </div>

          {/* Sienna paint footprints on the floor */}
          <div 
            className="absolute w-[200px] h-[300px]"
            style={{
              transform: `translate3d(-80px, 140px, ${160 - fgZOffset}px) rotateX(90deg)`,
            }}
          >
            <svg className="w-full h-full opacity-40" viewBox="0 0 100 200">
              <ellipse cx="40" cy="70" rx="5" ry="10" fill="var(--color-sienna-oxide)" />
              <ellipse cx="42" cy="52" rx="2.5" ry="4" fill="var(--color-sienna-oxide)" />
              <ellipse cx="70" cy="130" rx="5" ry="10" fill="var(--color-sienna-oxide)" />
              <ellipse cx="68" cy="112" rx="2.5" ry="4" fill="var(--color-sienna-oxide)" />
            </svg>
          </div>

        </div>
      )}

      {/* MIDDLE GROUND LAYER: Leaning Easel + Broken Frame */}
      <div
        className="absolute transition-all duration-300"
        style={{
          transform: frameTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative flex flex-col items-center justify-end w-[240px] h-[340px]" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Easel support legs */}
          <MaterialSurface
            type="walnut"
            className="absolute w-3 h-72 border border-[#222221]/15 shadow-sm"
            style={{
              transform: "translate3d(0px, 30px, -40px) rotateX(12deg)",
            }}
          />
          <MaterialSurface
            type="walnut"
            className="absolute w-3 h-80 border border-[#222221]/15"
            style={{
              transform: "translate3d(-50px, 0px, 0px) rotateY(5deg)",
            }}
          />
          <MaterialSurface
            type="walnut"
            className="absolute w-3 h-80 border border-[#222221]/15"
            style={{
              transform: "translate3d(50px, 0px, 0px) rotateY(-5deg)",
            }}
          />

          {/* Broken wood frame (torn canvas shreds) */}
          <CanvasFrame 
            ratio="portrait" 
            borderWidth={12} 
            className="shadow-heavy-slab mb-8 w-[160px] h-[220px] md:w-[200px] md:h-[270px] transform rotate-[1.5deg]"
            style={{
              transform: "translate3d(0px, -20px, 10px)",
            }}
          >
            {/* Torn empty backing represent */}
            <div className="flex-1 flex items-center justify-center border border-dashed border-[#222221]/15 h-full w-full bg-[#f4f1ea] relative overflow-hidden">
              {/* Torn canvas shreds on the sides */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#E5DEC9] shadow-sm border-r border-[#222221]/10" style={{ clipPath: "polygon(0 0, 100% 30%, 40% 60%, 100% 80%, 0 100%)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#E5DEC9] shadow-sm border-l border-[#222221]/10" style={{ clipPath: "polygon(100% 0, 0 20%, 60% 50%, 0 85%, 100% 100%)" }} />
              <span className="font-mono text-[0.48rem] text-[#A25A38]/30 tracking-[0.2em] uppercase">
                [ TORN ]
              </span>
            </div>
          </CanvasFrame>

        </div>
      </div>

      {/* BACKGROUND LAYER: Placer wall, paint drips & charcoal handprint */}
      <div 
        className="absolute w-[400px] h-[400px] opacity-40 pointer-events-none select-none"
        style={{
          transform: "translate3d(240px, 100px, -220px)",
          transformStyle: "preserve-3d",
        }}
      >
        <svg className="w-full h-full opacity-35">
          <path d="M 50,0 Q 60,180 62,300" fill="none" stroke="var(--color-stone-shade)" strokeWidth="1.5" />
          <path d="M 80,0 Q 82,100 83,180" fill="none" stroke="var(--color-sienna-oxide)" strokeWidth="0.8" />
          {/* Charcoal Handprint shape */}
          <path d="M 120,80 Q 125,50 125,45 M 125,80 Q 132,46 133,42 M 130,83 Q 140,50 142,48 M 115,83 Q 112,65 110,60" stroke="var(--color-stone-shade)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="126" cy="88" r="8" fill="var(--color-stone-shade)" />
        </svg>
      </div>

    </div>
  );
}
