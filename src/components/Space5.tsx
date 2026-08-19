"use client";

import { useEffect, useState } from "react";
import TextureOverlay from "@/components/common/TextureOverlay";
import CanvasFrame from "@/components/common/CanvasFrame";
import MaterialSurface from "@/components/common/MaterialSurface";

interface CreationProps {
  scrollProgress: number;
  prefersReduced?: boolean;
  isMobile?: boolean;
}

interface PigmentParticle {
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
}

export default function Space5({ scrollProgress, prefersReduced = false, isMobile = false }: CreationProps) {
  const targetZ = -6800;
  const netZ = targetZ + scrollProgress * 10500;

  const [pigments, setPigments] = useState<PigmentParticle[]>([]);

  // Ticker animation states
  const [isLampSwinging, setIsLampSwinging] = useState(false);
  const [isPaintDripping, setIsPaintDripping] = useState(false);

  useEffect(() => {
    const pigmentSet = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 80}%`,
      size: `${1.2 + Math.random() * 2.8}px`,
      delay: `${Math.random() * -12}s`,
      duration: `${9 + Math.random() * 8}s`,
    }));
    setPigments(pigmentSet);
  }, []);

  useEffect(() => {
    const handleLivingStudio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      if (type === "lamp-swing") {
        setIsLampSwinging(true);
        setTimeout(() => setIsLampSwinging(false), 3800);
      } else if (type === "paint-drip") {
        setIsPaintDripping(true);
        setTimeout(() => setIsPaintDripping(false), 2800);
      }
    };
    window.addEventListener("living-studio-trigger", handleLivingStudio);
    return () => window.removeEventListener("living-studio-trigger", handleLivingStudio);
  }, []);

  // Compute Opacity based on scroll progress window
  let opacity = 0;
  if (prefersReduced) {
    opacity = (scrollProgress >= 0.54 && scrollProgress < 0.68) ? 1 : 0;
  } else {
    if (scrollProgress >= 0.50 && scrollProgress < 0.54) {
      opacity = (scrollProgress - 0.50) / 0.04;
    } else if (scrollProgress >= 0.54 && scrollProgress < 0.64) {
      opacity = 1;
    } else if (scrollProgress >= 0.64 && scrollProgress < 0.68) {
      opacity = 1 - (scrollProgress - 0.64) / 0.04;
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

  // Paint reveals
  const primaryStrokeDash = prefersReduced
    ? 0
    : Math.max(0, Math.min(500, (0.64 - scrollProgress) * 3500));

  const secondStrokeDash = prefersReduced
    ? 0
    : Math.max(0, Math.min(400, (0.64 - scrollProgress) * 3000));

  // Foreground Z drift
  const fgZOffset = prefersReduced ? 0 : (scrollProgress - 0.50) * 1800;

  // Canvas scale
  const frameScale = prefersReduced
    ? 1.25
    : 1.25 + Math.max(0, Math.min(0.08, (0.64 - scrollProgress) * 0.3));

  // Asymmetric messy transforms (no center alignment)
  const canvasTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(30px, -110px, 0px) scale(0.6)"
    : `translate3d(180px, 30px, 50px) rotateY(-18deg) rotateX(1deg) scale(${frameScale})`;

  const scaffoldingTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(-60px, -90px, 0px) scale(0.65)"
    : `translate3d(-240px, -20px, ${100 - fgZOffset}px) rotateY(15deg) scale(0.9)`;

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
      {/* Harsh Contrasted Industrial Lighting Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#A25A38]/15 via-transparent to-[#0a0a0b]/60 pointer-events-none z-45"
        style={{
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[100px] bg-[#C2A679]/15 pointer-events-none mix-blend-screen"
        style={{
          transform: "translate3d(180px, -120px, 120px)",
        }}
      />

      {/* Floating Pigment Particles */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 opacity-40" style={{ transformStyle: "preserve-3d" }}>
          {pigments.map((pigment) => (
            <div
              key={pigment.id}
              className="absolute rounded-full bg-[#A25A38]/40 blur-[0.3px]"
              style={{
                left: pigment.left,
                top: pigment.top,
                width: pigment.size,
                height: pigment.size,
                animation: `dust-float ${pigment.duration} linear infinite`,
                animationDelay: pigment.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* FOREGROUND LAYER: Studio beams, Scaffolding, Pulley system ropes & swinging lamp */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-40" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Heavy wooden post left */}
          <MaterialSurface
            type="walnut"
            className="absolute w-12 h-[800px] border border-[#2A1F19]"
            style={{
              transform: `translate3d(-340px, -200px, ${300 - fgZOffset}px) rotateY(10deg)`,
            }}
          />

          {/* Scaffolding metal pipes crossing foreground */}
          <div
            className="absolute w-4 h-[750px] bg-graphite-ink border-r border-[#222221]/30"
            style={{
              transform: `translate3d(360px, -200px, ${260 - fgZOffset}px) rotateZ(-5deg)`,
            }}
          />
          <div
            className="absolute w-[800px] h-4 bg-graphite-ink border-b border-[#222221]/30"
            style={{
              transform: `translate3d(-400px, 180px, ${220 - fgZOffset}px) rotateZ(3deg)`,
            }}
          />

          {/* Rope Pulley wire overhead */}
          <div
            className="absolute w-[800px] h-0.5 bg-[#2A1F19]/40"
            style={{
              transform: `translate3d(-400px, -240px, ${200 - fgZOffset}px) rotateZ(5deg)`,
            }}
          />

          {/* Swinging workshop lamp overhead */}
          <div
            className="absolute flex flex-col items-center justify-start w-20 h-48 transition-all duration-[3000ms] ease-in-out"
            style={{
              transform: isLampSwinging
                ? `translate3d(120px, -280px, ${250 - fgZOffset}px) rotateZ(14deg) rotateX(6deg)`
                : `translate3d(120px, -280px, ${250 - fgZOffset}px) rotateZ(3deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-0.5 h-36 bg-[#222221]" />
            <MaterialSurface
              type="stone"
              className="w-14 h-8 rounded-t-full border border-canvas-base/5 flex items-center justify-center"
              style={{ transform: "translate3d(0, -2px, 0)" }}
            >
              <div className="w-4 h-4 bg-[#C2A679] rounded-full blur-[3px]" />
            </MaterialSurface>
          </div>

        </div>
      )}

      {/* MIDDLE GROUND LAYER: Massive Painting on heavy studio easel */}
      <div
        className="absolute transition-all duration-300 z-35"
        style={{
          transform: canvasTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative flex flex-col items-center justify-end w-[360px] h-[460px]" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Heavy studio easel supports */}
          <MaterialSurface
            type="walnut"
            className="absolute w-6 h-[440px] border border-[#2A1F19]/25 shadow-lg"
            style={{ transform: "translate3d(-80px, 0px, -15px)" }}
          />
          <MaterialSurface
            type="walnut"
            className="absolute w-6 h-[440px] border border-[#2A1F19]/25 shadow-lg"
            style={{ transform: "translate3d(80px, 0px, -15px)" }}
          />

          {/* Paint-encrusted Coffee Mug (Story chain) */}
          <div
            className="absolute w-8 h-8 rounded-full border border-graphite-ink/20 bg-[#F9F6F0] flex items-center justify-center shadow-md animate-pulse"
            style={{
              transform: "translate3d(90px, 100px, 20px) rotate(12deg)",
              transformStyle: "preserve-3d",
            }}
            title="Dry Paint-Encrusted Mug"
          >
            <div className="absolute -right-1 w-2.5 h-4 border border-graphite-ink/20 rounded-r-full bg-[#F9F6F0]" />
            <div className="w-6 h-6 rounded-full bg-[#A25A38] border border-graphite-ink/10 opacity-80" />
          </div>

          {/* Massive Canvas Frame */}
          <CanvasFrame
            ratio="square"
            borderWidth={16}
            className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] shadow-heavy-slab transform rotate-[-2.5deg] relative"
            style={{ transform: "translate3d(0, -60px, 15px)" }}
          >
            <div className="absolute inset-0 bg-[#E5DEC9] opacity-90 overflow-hidden">
              <TextureOverlay type="linen-weave" opacity={0.12} />
              
              <svg className="w-full h-full opacity-75">
                <path
                  d="M -20,130 Q 130,90 380,160"
                  fill="none"
                  stroke="var(--color-sienna-oxide)"
                  strokeWidth="42"
                  strokeLinecap="round"
                  strokeDasharray="500"
                  strokeDashoffset={primaryStrokeDash}
                  style={{
                    filter: "blur(1px)",
                    transition: "stroke-dashoffset 0.4s ease",
                  }}
                />
                <path
                  d="M 30,70 Q 180,140 310,260"
                  fill="none"
                  stroke="var(--color-gold-lustre)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  strokeDashoffset={secondStrokeDash}
                  style={{
                    filter: "blur(0.5px)",
                    transition: "stroke-dashoffset 0.4s ease",
                  }}
                />
              </svg>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Programmatic sienna paint drip */}
              <div
                className="absolute w-1.5 h-6 bg-sienna-oxide rounded-full transition-all duration-[2600ms] ease-in-out"
                style={{
                  left: "90px",
                  top: isPaintDripping ? "170px" : "110px",
                  opacity: isPaintDripping ? 0.8 : 0,
                  transform: "translate3d(0, 0, 2px) scaleY(1.2)",
                }}
              />
            </div>
          </CanvasFrame>

        </div>
      </div>

      {/* BACKGROUND LAYER: Scaffolding towers, Pigment shelves, Paint jars, Ladders */}
      
      {/* Heavy scaffolding shelf unit on left containing glass pigment jars */}
      <div
        className="absolute transition-all duration-300 z-20"
        style={{
          transform: scaffoldingTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <MaterialSurface
          type="stone"
          className="w-[180px] h-[320px] p-4 border-2 border-graphite-ink/35 flex flex-col justify-between shadow-heavy-slab bg-[#cfc9be]"
        >
          {/* Top shelf: paint jars */}
          <div className="flex gap-2 justify-around border-b border-graphite-ink/15 pb-3" style={{ transformStyle: "preserve-3d" }}>
            {/* Pigment jar 1 */}
            <div className="w-8 h-12 bg-sienna-oxide border border-graphite-ink/10 rounded-[1px] shadow-sm flex items-end justify-center p-1">
              <span className="font-mono text-[0.3rem] text-[#EAE4D9]/50">RED</span>
            </div>
            {/* Pigment jar 2 */}
            <div className="w-8 h-10 bg-gold-lustre border border-graphite-ink/10 rounded-[1px] shadow-sm flex items-end justify-center p-1">
              <span className="font-mono text-[0.3rem] text-[#222221]/50">GOLD</span>
            </div>
          </div>

          {/* Middle shelf: paint buckets */}
          <div className="flex gap-2 justify-around border-b border-t border-graphite-ink/15 py-3" style={{ transformStyle: "preserve-3d" }}>
            {/* Paint bucket */}
            <MaterialSurface
              type="concrete"
              className="w-12 h-14 border border-[#222221]/15 shadow-md flex flex-col justify-end p-0.5"
            >
              <div className="w-full h-1 bg-[#222221]/20 rounded-full" />
              <span className="font-mono text-[0.32rem] text-graphite-ink/30 text-center">MIX</span>
            </MaterialSurface>
          </div>

          <div className="font-mono text-[0.45rem] text-graphite-ink/30 text-center uppercase tracking-wider select-none">
            [ PIGMENT_SHELF.05 ]
          </div>
        </MaterialSurface>
      </div>

      {/* Wooden Ladder leaning in background right */}
      {!prefersReduced && (
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            transform: `translate3d(240px, -80px, -150px) rotateY(-20deg) rotateZ(8deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-16 h-[460px] flex justify-between" style={{ transformStyle: "preserve-3d" }}>
            <MaterialSurface type="walnut" className="w-2.5 h-full border border-[#2A1F19]/25 shadow-sm" />
            <MaterialSurface type="walnut" className="w-2.5 h-full border border-[#2A1F19]/25 shadow-sm" />
            {/* Steps */}
            <div className="absolute inset-x-0 top-16 h-2 bg-[#2A1F19]/70" />
            <div className="absolute inset-x-0 top-32 h-2 bg-[#2A1F19]/70" />
            <div className="absolute inset-x-0 top-48 h-2 bg-[#2A1F19]/70" />
            <div className="absolute inset-x-0 top-64 h-2 bg-[#2A1F19]/70" />
            <div className="absolute inset-x-0 top-80 h-2 bg-[#2A1F19]/70" />
          </div>
        </div>
      )}

    </div>
  );
}
