"use client";

import { useEffect, useState } from "react";
import EditorialText from "@/components/common/EditorialText";
import MaterialSurface from "@/components/common/MaterialSurface";
import MuseumLabel from "@/components/common/MuseumLabel";

interface InspirationProps {
  scrollProgress: number;
  prefersReduced?: boolean;
  isMobile?: boolean;
}

interface Fiber {
  id: number;
  left: string;
  top: string;
  size: string;
  angle: string;
}

export default function Space3({ scrollProgress, prefersReduced = false, isMobile = false }: InspirationProps) {
  const targetZ = -3200;
  const netZ = targetZ + scrollProgress * 10500;

  const [fibers, setFibers] = useState<Fiber[]>([]);

  // Ticker animation states
  const [isPageLifting, setIsPageLifting] = useState(false);
  const [isBrushRolling, setIsBrushRolling] = useState(false);
  const [isCurtainSwaying, setIsCurtainSwaying] = useState(false);

  useEffect(() => {
    const fiberSet = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${15 + Math.random() * 70}%`,
      size: `${1.5 + Math.random() * 3}px`,
      angle: `${Math.random() * 360}deg`,
    }));
    setFibers(fiberSet);
  }, []);

  useEffect(() => {
    const handleLivingStudio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      if (type === "page-turn") {
        setIsPageLifting(true);
        setTimeout(() => setIsPageLifting(false), 2200);
      } else if (type === "brush-roll") {
        setIsBrushRolling(true);
        setTimeout(() => setIsBrushRolling(false), 2800);
      } else if (type === "rope-twist" || type === "lamp-swing") {
        setIsCurtainSwaying(true);
        setTimeout(() => setIsCurtainSwaying(false), 3800);
      }
    };
    window.addEventListener("living-studio-trigger", handleLivingStudio);
    return () => window.removeEventListener("living-studio-trigger", handleLivingStudio);
  }, []);

  // Compute Opacity based on scroll progress window
  let opacity = 0;
  if (prefersReduced) {
    opacity = (scrollProgress >= 0.26 && scrollProgress < 0.40) ? 1 : 0;
  } else {
    if (scrollProgress >= 0.22 && scrollProgress < 0.26) {
      opacity = (scrollProgress - 0.22) / 0.04;
    } else if (scrollProgress >= 0.26 && scrollProgress < 0.36) {
      opacity = 1;
    } else if (scrollProgress >= 0.36 && scrollProgress < 0.40) {
      opacity = 1 - (scrollProgress - 0.36) / 0.04;
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
  const fgZOffset = prefersReduced ? 0 : (scrollProgress - 0.22) * 1800;

  // Responsive transforms
  const deskTransform = prefersReduced
    ? "none"
    : isMobile
    ? `translate3d(0px, 90px, ${100 - fgZOffset}px) rotateX(70deg) scale(0.8)`
    : `translate3d(-100px, 140px, ${200 - fgZOffset}px) rotateX(72deg) rotateY(-2deg)`;

  const sketchTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(0px, -90px, 0px) scale(0.75)"
    : "translate3d(180px, -40px, 50px) rotateY(-18deg) rotateZ(-3deg)";

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
      {/* Warm Orange Sunlight Lighting Layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#A25A38]/12 via-[#C2A679]/8 to-transparent pointer-events-none z-45"
        style={{
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[100px] bg-[#C2A679]/15 pointer-events-none mix-blend-screen"
        style={{
          transform: "translate3d(-150px, 100px, 120px)",
        }}
      />

      {/* Floating Paper Fibers / Dust */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 opacity-25" style={{ transformStyle: "preserve-3d" }}>
          {fibers.map((fiber) => (
            <div
              key={fiber.id}
              className="absolute bg-[#C2A679]/45 blur-[0.3px]"
              style={{
                left: fiber.left,
                top: fiber.top,
                width: fiber.size,
                height: "1px",
                transform: `rotate(${fiber.angle})`,
              }}
            />
          ))}
        </div>
      )}

      {/* BACKGROUND LAYER: Large Window with hanging curtains framing the concrete wall */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Large Window frame */}
          <div
            className="absolute w-[440px] h-[320px] border-[10px] border-[#222221] bg-transparent flex flex-col justify-between shadow-2xl"
            style={{
              transform: "translate3d(120px, -180px, -240px)",
            }}
          >
            <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-[#222221]" />
            <div className="absolute left-0 right-0 top-[40%] h-[2px] bg-[#222221]" />
            {/* Soft sunset orange light backdrop */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#A25A38]/20 via-[#C2A679]/15 to-transparent" />
          </div>

          {/* Draped Curtains Left */}
          <div
            className="absolute w-24 h-[550px] bg-[#EAE4D9]/80 border-r border-[#222221]/10 transition-all duration-[3000ms] ease-in-out"
            style={{
              transform: isCurtainSwaying
                ? "translate3d(-140px, -240px, -180px) rotateY(12deg)"
                : "translate3d(-140px, -240px, -180px) rotateY(5deg)",
            }}
          />

          {/* Draped Curtains Right */}
          <div
            className="absolute w-20 h-[550px] bg-[#EAE4D9]/80 border-l border-[#222221]/10 transition-all duration-[3000ms] ease-in-out"
            style={{
              transform: isCurtainSwaying
                ? "translate3d(360px, -240px, -180px) rotateY(-12deg)"
                : "translate3d(360px, -240px, -180px) rotateY(-5deg)",
            }}
          />

        </div>
      )}

      {/* FOREGROUND LAYER: The Messy Drafting Table, Stool, Canvas Rolls, Paper Scraps */}
      <div
        className="absolute transition-all duration-300 z-35"
        style={{
          transform: deskTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Main Walnut Drafting Desk Surface */}
          <MaterialSurface
            type="walnut"
            className="w-[450px] md:w-[650px] h-[250px] p-6 border-2 border-[#2A1F19] shadow-heavy-slab flex flex-col justify-between relative"
          >
            {/* Cluttered Desk Objects Overlapping without grid alignment */}
            <div className="flex justify-between w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Left group: Coffee mug, open notebooks, reference photos, masking tape */}
              <div className="relative w-56 h-36" style={{ transformStyle: "preserve-3d" }}>
                
                {/* Coffee Ring Stain */}
                <div 
                  className="absolute w-12 h-12 rounded-full border-[1.5px] border-[#2A1F19]/40 opacity-70"
                  style={{ transform: "translate3d(10px, 10px, 2px)" }}
                />

                {/* Clean Coffee Mug overlapping notebook edge */}
                <div
                  className="absolute w-8 h-8 rounded-full border border-graphite-ink/15 bg-[#F9F6F0] flex items-center justify-center shadow-sm"
                  style={{
                    transform: "translate3d(18px, 16px, 12px) rotate(-15deg)",
                    transformStyle: "preserve-3d",
                  }}
                  title="Artist's Coffee Mug"
                >
                  <div className="absolute -right-1 w-2.5 h-4 border border-graphite-ink/15 rounded-r-full bg-[#F9F6F0]" />
                  <div className="w-6 h-6 rounded-full bg-[#2A1F19]/90 border border-graphite-ink/5" />
                </div>

                {/* Open Notebook page with masking tape strips */}
                <MaterialSurface
                  type="paper"
                  className="w-28 h-20 p-2 text-[0.45rem] font-mono text-graphite-ink shadow-sm transition-all duration-700 ease-in-out relative"
                  style={{ 
                    transform: isPageLifting 
                      ? "translate3d(30px, 25px, 8px) rotate(-4deg) rotateX(12deg)" 
                      : "translate3d(30px, 25px, 4px) rotate(-8deg)"
                  }}
                >
                  {/* Masking tape on notebook corner */}
                  <div className="absolute -top-1.5 -left-1 w-6 h-2 bg-[#EAE4D9]/75 border border-graphite-ink/5 rotate-[15deg] opacity-80" />
                  
                  <div className="border-b border-[#222221]/10 pb-1 mb-1 font-bold">WORKSPACE_03</div>
                  <div>* charcoal sticks</div>
                  <div>* gesso mix 2:1</div>
                </MaterialSurface>

                {/* Reference photograph overlapping notebook */}
                <MaterialSurface
                  type="paper"
                  className="absolute w-12 h-16 p-1 border border-graphite-ink/10 shadow-sm"
                  style={{
                    transform: "translate3d(120px, 12px, 14px) rotate(12deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="w-full h-10 bg-[#222221]/80 rounded-[1px] mb-1" />
                  <div className="text-[0.38rem] font-mono text-graphite-ink/40 text-center">STUDIO.86</div>
                </MaterialSurface>

              </div>

              {/* Center group: Retro Music Player and charcoal box */}
              <div 
                className="absolute left-[50%] marginLeft-[-40px] top-6 w-24 h-16"
                style={{
                  transform: "translate3d(0, 0, 5px) rotate(5deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <MaterialSurface
                  type="walnut"
                  className="w-20 h-10 border border-[#2A1F19] shadow-md flex items-center justify-around p-1.5"
                >
                  {/* Speaker mesh dial */}
                  <div className="w-6 h-6 rounded-full border border-graphite-ink/20 bg-graphite-ink/65" />
                  <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-1 bg-sienna-oxide/40 rounded-full" />
                    <div className="w-3 h-1 bg-[#C2A679] rounded-full" />
                  </div>
                </MaterialSurface>
              </div>

              {/* Right group: Brushes inside charcoal jar, messy paint tubes heap */}
              <div className="flex gap-4 items-end self-end mr-4" style={{ transformStyle: "preserve-3d" }}>
                
                {/* Paint Brush rolling */}
                <div
                  className="w-1.5 h-16 bg-[#2A1F19] rounded-full shadow-sm transition-all duration-700 ease-out"
                  style={{
                    transform: isBrushRolling 
                      ? "translate3d(10px, 0px, 6px) rotate(-16deg)" 
                      : "translate3d(0px, 0px, 2px) rotate(-26deg)",
                  }}
                />

                {/* Charcoal jar containing dry brushes */}
                <MaterialSurface
                  type="stone"
                  className="w-10 h-14 flex items-center justify-center shadow-md relative"
                  style={{ transform: "translate3d(0, 0, 5px) rotate(15deg)" }}
                >
                  {/* Brushes peaking out */}
                  <div className="absolute -top-6 w-1 h-8 bg-graphite-ink rounded-full rotate-[-8deg]" />
                  <div className="absolute -top-5 w-1 h-7 bg-[#2A1F19] rounded-full rotate-[12deg]" />
                  <span className="font-mono text-[0.38rem] text-canvas-base/40">INK</span>
                </MaterialSurface>
                
                {/* Overlapping Paint tubes heap */}
                <div className="flex gap-1 flex-col relative" style={{ transformStyle: "preserve-3d" }}>
                  <div className="w-8 h-2 bg-[#A25A38] border border-graphite-ink/10 rounded-[1px] shadow-sm rotate-[-10deg] absolute -top-1" />
                  <div className="w-9 h-2 bg-[#C2A679] border border-graphite-ink/10 rounded-[1px] shadow-sm rotate-[5deg]" />
                  <div className="w-7 h-2 bg-[#4E5143] border border-graphite-ink/10 rounded-[1px] shadow-sm rotate-[-20deg] absolute top-1.5" />
                </div>
              </div>

            </div>

            <div className="text-[0.45rem] font-mono text-canvas-base/30 tracking-widest uppercase">
              [ Workspace surface — physical study ]
            </div>
          </MaterialSurface>

          {/* Stacked Canvas Rolls leaning against the desk side */}
          {!prefersReduced && (
            <div
              className="absolute pointer-events-none"
              style={{
                transform: "translate3d(240px, 60px, 30px) rotateY(-20deg) rotateZ(-15deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative flex gap-1.5" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-5 h-36 bg-[#E5DEC9] border border-graphite-ink/10 shadow-md rounded-[2px]" />
                <div className="w-4.5 h-32 bg-[#E5DEC9] border border-graphite-ink/10 shadow-md rounded-[2px] transform translate3d(0, 10px, 5px) rotate(5deg)" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Wooden Stool leaning beside desk left */}
      {!prefersReduced && (
        <div
          className="absolute transition-all duration-300 pointer-events-none"
          style={{
            transform: prefersReduced
              ? "none"
              : isMobile
              ? `translate3d(-100px, 120px, ${100 - fgZOffset}px) scale(0.6)`
              : `translate3d(-320px, 140px, ${220 - fgZOffset}px) rotateY(25deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <MaterialSurface
            type="walnut"
            className="w-16 h-28 border border-[#2A1F19] shadow-lg flex flex-col justify-between p-2 relative"
          >
            <div className="w-full h-1 bg-[#222221]/15" />
            <div className="font-mono text-[0.4rem] text-canvas-base/20">STOOL.03</div>
          </MaterialSurface>
        </div>
      )}

      {/* Programmatic Paper Scraps scattered around stool on the floor */}
      {!prefersReduced && (
        <div
          className="absolute pointer-events-none"
          style={{
            transform: `translate3d(-240px, 140px, ${150 - fgZOffset}px) rotateX(90deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-32 h-20 opacity-30 flex gap-2">
            <div className="w-6 h-8 bg-canvas-base border border-graphite-ink/5 rotate-[-15deg] shadow-sm" />
            <div className="w-8 h-6 bg-canvas-base border border-graphite-ink/5 rotate-[20deg] shadow-sm translate-y-3" />
            <div className="w-5 h-5 bg-canvas-base border border-graphite-ink/5 rotate-[-5deg] shadow-sm translate-x-2" />
          </div>
        </div>
      )}

      {/* Sienna paint footprint ending near stool */}
      {!prefersReduced && (
        <div 
          className="absolute w-[180px] h-[200px] pointer-events-none"
          style={{
            transform: `translate3d(-280px, 140px, ${120 - fgZOffset}px) rotateX(90deg)`,
          }}
        >
          <svg className="w-full h-full opacity-35" viewBox="0 0 100 100">
            <ellipse cx="50" cy="40" rx="5" ry="10" fill="var(--color-sienna-oxide)" />
            <ellipse cx="48" cy="22" rx="2.5" ry="4" fill="var(--color-sienna-oxide)" />
          </svg>
        </div>
      )}

      {/* MIDDLE GROUND LAYER: Pinned Sketches Panel */}
      <div
        className="absolute transition-all duration-300"
        style={{
          transform: sketchTransform,
          transformStyle: "preserve-3d",
        }}
      >
        <MaterialSurface
          type="paper"
          className="w-[280px] h-[340px] p-6 shadow-heavy-slab bg-[#F9F6F0] relative"
        >
          {/* Tape tacks in corners */}
          <div className="absolute -top-1 left-12 w-8 h-3 bg-[#EAE4D9]/80 border border-graphite-ink/5 rotate-[-3deg] opacity-75 shadow-sm" />
          <div className="absolute -bottom-1 right-8 w-7 h-3.5 bg-[#EAE4D9]/80 border border-graphite-ink/5 rotate-[8deg] opacity-75 shadow-sm" />

          <div className="h-full flex flex-col justify-between select-none">
            <div>
              <EditorialText variant="label-mono" className="text-[#A25A38] text-[0.52rem] mb-2">
                Fig. 03 — Grid
              </EditorialText>
              <div className="w-full h-[140px] border border-dashed border-graphite-ink/15 relative overflow-hidden my-3">
                <svg className="absolute inset-0 w-full h-full opacity-60">
                  <path d="M 0,70 L 280,70" stroke="var(--color-graphite-ink)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <path d="M 140,0 L 140,200" stroke="var(--color-graphite-ink)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <circle cx="140" cy="70" r="45" fill="none" stroke="var(--color-sienna-oxide)" strokeWidth="1" />
                  <path d="M 40,25 Q 140,95 240,25" fill="none" stroke="var(--color-graphite-ink)" strokeWidth="1.2" />
                </svg>
              </div>
            </div>

            <MuseumLabel
              title="Ideation Study 03"
              category="Geometrical Plan"
              dimensions="50 x 70 cm — Ink & Charcoal"
            />
          </div>
        </MaterialSurface>
      </div>

      {/* BACKGROUND LAYER: Concrete Wall with handwritten sketches and notes */}
      <div
        className="absolute w-[360px] md:w-[460px] text-left select-none pointer-events-none"
        style={{
          transform: "translate3d(-260px, -110px, -150px)",
          transformStyle: "preserve-3d",
        }}
      >
        <EditorialText variant="label-mono" className="text-graphite-ink/25 mb-3 uppercase tracking-[0.2em] block">
          Studio Notes
        </EditorialText>
        <h2 className="text-[1.8rem] md:text-[2.3rem] leading-tight font-serif text-graphite-ink/75 mb-6">
          The Creative Crucible
        </h2>
        <p className="font-mono text-[0.55rem] md:text-[0.62rem] text-graphite-ink/40 leading-relaxed max-w-xs">
          1. STRUCTURE FIRST.  
          2. VOLUME OVERLINES.  
          3. ACCUMULATION OF PROCESS REVEALS FINAL TRUTH.
        </p>
      </div>

    </div>
  );
}
