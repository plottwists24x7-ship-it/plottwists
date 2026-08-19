"use client";

import { useEffect, useState } from "react";
import EditorialText from "@/components/common/EditorialText";
import MaterialSurface from "@/components/common/MaterialSurface";
import CanvasFrame from "@/components/common/CanvasFrame";

interface ArrivalProps {
  scrollProgress: number;
  prefersReduced?: boolean;
  isMobile?: boolean;
}

interface Speck {
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
}

export default function Space1({ scrollProgress, prefersReduced = false, isMobile = false }: ArrivalProps) {
  const targetZ = 0;
  const netZ = targetZ + scrollProgress * 10500;

  const [dustSpecks, setDustSpecks] = useState<Speck[]>([]);
  const [isDoorSwinging, setIsDoorSwinging] = useState(false);
  const [isPaperShifting, setIsPaperShifting] = useState(false);

  // Sunlight intensity drift
  const [sunIntensity, setSunIntensity] = useState(0.12);

  useEffect(() => {
    const specks = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`,
      top: `${10 + Math.random() * 80}%`,
      size: `${1.2 + Math.random() * 2.2}px`,
      delay: `${Math.random() * -10}s`,
      duration: `${12 + Math.random() * 8}s`,
    }));
    setDustSpecks(specks);

    // Sunlight drifts over time
    const lightInterval = setInterval(() => {
      setSunIntensity(0.08 + Math.random() * 0.08);
    }, 7000);

    return () => clearInterval(lightInterval);
  }, []);

  // Listen to 8-second global event ticker
  useEffect(() => {
    const handleLivingStudio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type;
      
      // Swing the entrance door slightly when wind blows (rope-twist / lamp-swing trigger)
      if (type === "rope-twist" || type === "lamp-swing") {
        setIsDoorSwinging(true);
        setTimeout(() => setIsDoorSwinging(false), 3600);
      }
      
      // Shift paper flyer
      if (type === "page-turn") {
        setIsPaperShifting(true);
        setTimeout(() => setIsPaperShifting(false), 2400);
      }
    };
    window.addEventListener("living-studio-trigger", handleLivingStudio);
    return () => window.removeEventListener("living-studio-trigger", handleLivingStudio);
  }, []);

  // Compute Opacity based on Z-depth position
  let opacity = 1;
  if (prefersReduced) {
    opacity = scrollProgress < 0.12 ? 1 : 0;
  } else {
    // Fade out as camera dollys past Space1 (0.12 to 0.16)
    if (scrollProgress >= 0.12 && scrollProgress < 0.16) {
      opacity = 1 - (scrollProgress - 0.12) / 0.04;
    } else if (scrollProgress >= 0.16) {
      opacity = 0;
    }
  }

  // Cinematic Depth-of-Field focus blur (disabled on mobile)
  let blur = 0;
  if (!prefersReduced && !isMobile) {
    if (netZ > 50) {
      blur = Math.min(10, (netZ - 50) * 0.05);
    }
  }

  // Y drift translation on scroll
  const translateY = prefersReduced ? 0 : Math.min(45, scrollProgress * 320);

  // Volumetric Z-drift for foreground door/beams to pass camera plane rapidly
  const fgZOffset = prefersReduced ? 0 : scrollProgress * 1500;

  return (
    <div
      className="spatial-scene w-full h-full flex flex-col justify-center items-center select-none"
      style={{
        transform: prefersReduced ? "none" : `translate3d(0, -${translateY}px, ${targetZ}px)`,
        opacity,
        visibility: opacity <= 0 ? "hidden" : "visible",
        pointerEvents: opacity <= 0 ? "none" : "auto",
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        transition: prefersReduced ? "opacity 0.5s ease" : "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Morning Golden Hour Volumetric Light Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#F9F6F0]/25 via-transparent to-transparent pointer-events-none z-45"
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-all duration-[6000ms] ease-in-out"
        style={{
          transform: "translate3d(-300px, -200px, 150px)",
          backgroundColor: `rgba(194, 166, 121, ${sunIntensity})`,
        }}
      />

      {/* Dynamic Dust Particles (Pollen/Ash) */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 opacity-30" style={{ transformStyle: "preserve-3d" }}>
          {dustSpecks.map((speck) => (
            <div
              key={speck.id}
              className="absolute rounded-full bg-[#C2A679]/30 blur-[0.4px]"
              style={{
                left: speck.left,
                top: speck.top,
                width: speck.size,
                height: speck.size,
                animation: `dust-float ${speck.duration} linear infinite`,
                animationDelay: speck.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* FOREGROUND LAYER: Timber rafters passing overhead & wooden entrance */}
      {!prefersReduced && (
        <div className="absolute inset-0 pointer-events-none z-40" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Heavy wooden industrial entrance, rotated open (Swings slightly on wind event triggers) */}
          <MaterialSurface
            type="walnut"
            className="absolute w-[200px] h-[480px] border border-[#2A1F19] shadow-2xl flex flex-col justify-between p-4 transition-all duration-[3500ms] ease-in-out"
            style={{
              transform: isDoorSwinging 
                ? `translate3d(-180px, -110px, ${360 - fgZOffset}px) rotateY(38deg)` 
                : `translate3d(-180px, -110px, ${360 - fgZOffset}px) rotateY(32deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-full h-full border border-[#222221]/15 relative">
              <div 
                className="absolute right-2 top-[50%] w-2 h-10 bg-[#C2A679] rounded-[2px]" 
                title="Industrial Door Handle"
              />
            </div>
            <span className="font-mono text-[0.42rem] text-canvas-base/30 uppercase tracking-widest">[ studio entrance ]</span>
          </MaterialSurface>

          {/* Concrete Portal beam left */}
          <MaterialSurface
            type="concrete"
            className="absolute w-24 h-[600px] border border-graphite-ink/10"
            style={{
              transform: `translate3d(-380px, -200px, ${400 - fgZOffset}px) rotateY(15deg)`,
            }}
          />

          {/* Concrete Portal beam right */}
          <MaterialSurface
            type="concrete"
            className="absolute w-24 h-[600px] border border-graphite-ink/10"
            style={{
              transform: `translate3d(380px, -200px, ${400 - fgZOffset}px) rotateY(-15deg)`,
            }}
          />

          {/* Timber ceiling rafters (pass above camera) */}
          <MaterialSurface
            type="walnut"
            className="absolute w-[600px] h-8"
            style={{
              transform: `translate3d(0px, -300px, ${300 - fgZOffset}px) rotateX(90deg)`,
            }}
          />
          <MaterialSurface
            type="walnut"
            className="absolute w-[600px] h-8"
            style={{
              transform: `translate3d(0px, -300px, ${100 - fgZOffset}px) rotateX(90deg)`,
            }}
          />

          {/* Paint Footprints on the floor tracking inside (Sienna paint begins) */}
          <div 
            className="absolute w-[200px] h-[300px]"
            style={{
              transform: `translate3d(60px, 140px, ${200 - fgZOffset}px) rotateX(90deg)`,
            }}
          >
            <svg className="w-full h-full opacity-35" viewBox="0 0 100 200">
              {/* Left footprint */}
              <ellipse cx="30" cy="50" rx="6" ry="12" fill="var(--color-sienna-oxide)" />
              <ellipse cx="32" cy="30" rx="3" ry="5" fill="var(--color-sienna-oxide)" />
              {/* Right footprint further forward */}
              <ellipse cx="60" cy="110" rx="6" ry="12" fill="var(--color-sienna-oxide)" />
              <ellipse cx="58" cy="90" rx="3" ry="5" fill="var(--color-sienna-oxide)" />
            </svg>
          </div>

        </div>
      )}

      {/* MIDDLE GROUND LAYER: Leaning wooden frames & shifting pinned paper */}
      <div 
        className="absolute transition-all duration-300"
        style={{
          transform: prefersReduced ? "none" : "translate3d(260px, 80px, -50px) rotateY(-15deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <CanvasFrame ratio="portrait" borderWidth={8} className="w-[140px] h-[190px] md:w-[180px] md:h-[240px] shadow-lg">
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#222221]/8 h-full w-full bg-canvas-base/30">
            <span className="font-mono text-[0.45rem] text-[#222221]/15 uppercase tracking-[0.15em]">[ empty ]</span>
          </div>
        </CanvasFrame>
      </div>

      <div 
        className="absolute transition-all duration-300"
        style={{
          transform: prefersReduced ? "none" : "translate3d(320px, 110px, -80px) rotateY(-22deg) rotateZ(5deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <CanvasFrame ratio="square" borderWidth={6} className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] shadow-md">
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#222221]/8 h-full w-full bg-canvas-base/30" />
        </CanvasFrame>
      </div>

      {/* Pinned paper flyer on the rear wall that shifts physically */}
      {!prefersReduced && (
        <div
          className="absolute"
          style={{
            transform: "translate3d(-200px, 50px, -100px)",
            transformStyle: "preserve-3d",
          }}
        >
          <MaterialSurface
            type="paper"
            className="w-16 h-24 p-2 shadow-md border border-graphite-ink/5 flex flex-col justify-between transition-all duration-[2400ms] ease-in-out"
            style={{
              transform: isPaperShifting 
                ? "rotate(-10deg) rotateX(12deg) translate3d(0, -3px, 2px)" 
                : "rotate(-14deg)",
            }}
          >
            <span className="font-mono text-[0.38rem] text-graphite-ink/40 uppercase tracking-widest">EXHIBIT_01</span>
            <span className="font-serif text-[0.45rem] leading-none text-graphite-ink/70 italic">Arrival</span>
          </MaterialSurface>
        </div>
      )}

      {/* BACKGROUND LAYER: Project Title (Projected style on rear concrete wall) */}
      <div
        className="text-center transition-all duration-300"
        style={{
          transform: prefersReduced ? "none" : "translate3d(0, -50px, -200px)",
          transformStyle: "preserve-3d",
        }}
      >
        <EditorialText
          variant="display"
          className="text-[#222221] tracking-tight leading-none mb-4 uppercase"
          style={{
            textShadow: "0 0 15px rgba(194, 166, 121, 0.15), 0 0 3px rgba(34, 34, 33, 0.08)",
          }}
        >
          Inside The Artist's Mind
        </EditorialText>

        <EditorialText
          variant="label-mono"
          className="text-[#A25A38] tracking-[0.32em] font-semibold block mt-4"
        >
          An Immersive Digital Exhibition
        </EditorialText>

        <div className="mt-12 font-mono text-[0.62rem] text-[#222221]/25 uppercase tracking-[0.25em]">
          Scroll to walk forward
        </div>
      </div>

    </div>
  );
}
