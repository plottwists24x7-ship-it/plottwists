"use client";

import EditorialText from "@/components/common/EditorialText";
import MaterialSurface from "@/components/common/MaterialSurface";
import LightingLayer from "@/components/common/LightingLayer";
import TextureOverlay from "@/components/common/TextureOverlay";

interface DepartureProps {
  scrollProgress: number;
  prefersReduced?: boolean;
  isMobile?: boolean;
}

export default function Space7({ scrollProgress, prefersReduced = false, isMobile = false }: DepartureProps) {
  const targetZ = -10500;
  const netZ = targetZ + scrollProgress * 10500;

  // Compute Opacity based on scroll progress window
  let opacity = 0;
  if (prefersReduced) {
    opacity = scrollProgress >= 0.82 ? 1 : 0;
  } else {
    if (scrollProgress >= 0.78 && scrollProgress < 0.82) {
      opacity = (scrollProgress - 0.78) / 0.04;
    } else if (scrollProgress >= 0.82) {
      opacity = 1;
    } else {
      opacity = 0;
    }
  }

  // Cinematic Depth-of-Field focus blur (disabled on mobile)
  let blur = 0;
  if (!prefersReduced && !isMobile) {
    if (netZ > 50) {
      blur = Math.min(8, (netZ - 50) * 0.04);
    } else if (netZ < -1000) {
      blur = Math.min(6, (-netZ - 1000) * 0.008);
    }
  }

  // Object reveals: window frame fades in as camera approaches
  const windowOpacity = prefersReduced ? 1 : Math.max(0, Math.min(1, (scrollProgress - 0.78) * 12));

  // Brass key silhouette reveals subsequently
  const keyOpacity = prefersReduced ? 0.75 : Math.max(0, Math.min(0.75, (scrollProgress - 0.84) * 12));

  // Walls dissolve as camera passes desk and heads out window
  let wallDissolveOpacity = 1;
  if (!prefersReduced && netZ > -400) {
    wallDissolveOpacity = Math.max(0, 1 - (netZ + 400) / 300);
  }

  // Blinding fullscreen pure white light bloom fades in as camera exits window plane (netZ > 0)
  let whiteBloomOpacity = 0;
  if (!prefersReduced) {
    if (netZ > 0) {
      whiteBloomOpacity = Math.min(1, netZ / 150);
    }
  }

  // Blinding white light slowly dissolves into solid void black (netZ > 350)
  let voidBlackOpacity = 0;
  if (!prefersReduced) {
    if (netZ > 350) {
      voidBlackOpacity = Math.min(1, (netZ - 350) / 250);
    }
  }

  // Minimalist Credits roll fades in from black (netZ > 600)
  let creditsOpacity = 0;
  if (!prefersReduced) {
    if (netZ > 600) {
      creditsOpacity = Math.min(1, (netZ - 600) / 150);
    }
    // Credits fade out into complete void at the absolute end (netZ > 950)
    if (netZ > 950) {
      creditsOpacity = Math.max(0, 1 - (netZ - 950) / 150);
    }
  }

  // Foreground Z drift
  const fgZOffset = prefersReduced ? 0 : (scrollProgress - 0.82) * 1650;

  // Symmetrical central window alignment at x = 0 (perfect for walkthrough dollying)
  const windowTransform = prefersReduced
    ? "none"
    : isMobile
    ? "translate3d(0px, -80px, 0px) scale(0.75)"
    : "translate3d(0px, 0px, 0px)";

  // Foreground workbench on left side
  const workbenchTransform = prefersReduced
    ? "none"
    : isMobile
    ? `translate3d(-50px, 110px, ${150 - fgZOffset}px) rotateX(70deg) scale(0.7)`
    : `translate3d(-240px, 120px, ${250 - fgZOffset}px) rotateX(74deg) rotateY(2deg)`;

  // Single chair on right side
  const chairTransform = prefersReduced
    ? "none"
    : isMobile
    ? `translate3d(50px, 110px, ${150 - fgZOffset}px) rotateX(70deg) scale(0.7)`
    : `translate3d(180px, 130px, ${200 - fgZOffset}px) rotateX(74deg) rotateY(-10deg)`;

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
      <div 
        className="w-full h-full relative flex flex-col justify-center bg-[#0a0a0b] text-[#EAE4D9]"
        style={{
          opacity: wallDissolveOpacity,
          transition: "opacity 0.3s ease",
        }}
      >
        <LightingLayer type="twilight" intensity={0.9} />
        <TextureOverlay type="concrete-pitting" opacity={0.08} />

        {/* FOREGROUND LAYER: The Abandoned Workbench & Chair */}
        <div
          className="absolute transition-all duration-300 z-35"
          style={{
            transform: workbenchTransform,
            transformStyle: "preserve-3d",
          }}
        >
          <MaterialSurface
            type="walnut"
            className="w-[180px] md:w-[260px] h-[120px] p-3 border border-[#2A1F19] shadow-lg flex flex-col justify-between"
          >
            <div className="flex justify-between" style={{ transformStyle: "preserve-3d" }}>
              <div className="w-8 h-8 rounded-full border border-canvas-base/10 bg-canvas-base/5" />
              <div className="w-12 h-2 bg-graphite-ink/20 rounded-full" />
            </div>
            <div className="font-mono text-[0.4rem] text-canvas-base/20 uppercase tracking-widest">[ workbench ]</div>
          </MaterialSurface>
        </div>

        {/* Single Chair left behind */}
        {!prefersReduced && (
          <div
            className="absolute transition-all duration-300 pointer-events-none z-35"
            style={{
              transform: chairTransform,
              transformStyle: "preserve-3d",
            }}
          >
            <MaterialSurface
              type="walnut"
              className="w-14 h-24 border border-[#2A1F19] shadow-md flex flex-col justify-between p-2"
            >
              <div className="w-full h-1.5 bg-[#222221]/15" />
              <span className="font-mono text-[0.38rem] text-canvas-base/15">CHAIR</span>
            </MaterialSurface>
          </div>
        )}

      </div>

      {/* MIDDLE GROUND LAYER: Centered Symmetrical Window (Exempt from wall dissolve to float) */}
      <div
        className="absolute transition-all duration-300 z-30"
        style={{
          transform: windowTransform,
          transformStyle: "preserve-3d",
          left: "50%",
          marginLeft: isMobile ? "-140px" : "-180px",
          opacity: wallDissolveOpacity,
        }}
      >
        <div
          className="relative w-[280px] h-[340px] md:w-[360px] md:h-[440px] border-[12px] border-[#222221] bg-transparent flex flex-col justify-between shadow-2xl transition-all duration-500"
          style={{
            opacity: windowOpacity,
          }}
        >
          {/* Window grid divisions */}
          <div className="absolute top-0 bottom-0 left-[50%] w-[2px] bg-[#222221]" />
          <div className="absolute left-0 right-0 top-[40%] h-[2px] bg-[#222221]" />

          {/* Sunset twilight horizon gradient behind window */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[#A25A38]/30 via-[#C2A679]/20 to-[#4E5143]/60"
            style={{ filter: "blur(2px)" }}
          />

          {/* Small key silhouette resting on sill */}
          <div
            className="absolute bottom-[2px] left-[55%] w-5 h-2 bg-[#C2A679] transition-all duration-500"
            style={{
              clipPath: "polygon(0 30%, 30% 30%, 40% 0, 60% 0, 70% 30%, 100% 30%, 100% 70%, 70% 70%, 60% 100%, 40% 100%, 30% 70%, 0 70%)",
              opacity: keyOpacity,
            }}
            title="The Artist's Key"
          />
        </div>
      </div>

      {/* Full-Screen Blinding Pure White Bloom Overlay */}
      <div
        className="fixed inset-0 bg-white pointer-events-none select-none z-45 transition-opacity duration-300"
        style={{
          opacity: whiteBloomOpacity,
        }}
      />

      {/* Full-Screen Solid Black Void Overlay */}
      <div
        className="fixed inset-0 bg-[#0a0a0b] pointer-events-none select-none z-50 transition-opacity duration-300"
        style={{
          opacity: voidBlackOpacity,
        }}
      />

      {/* Minimalist Editorial Credits Roll & Handwritten sentence */}
      <div
        className="fixed inset-0 flex flex-col justify-center items-center select-none text-center pointer-events-none z-60 font-mono transition-opacity duration-300"
        style={{
          opacity: creditsOpacity,
        }}
      >
        <div className="max-w-md px-6">
          {/* The final handwritten quote */}
          <p className="font-serif italic text-base md:text-lg text-[#EAE4D9] mb-12 tracking-wide font-light max-w-sm mx-auto leading-relaxed">
            "Every masterpiece begins with a single unfinished thought."
          </p>
          
          <div className="w-8 h-[1px] bg-[#EAE4D9]/20 my-8 mx-auto" />

          <h2 className="font-serif text-[1.2rem] md:text-[1.6rem] text-[#EAE4D9]/80 mb-3 tracking-wide font-light uppercase">
            Inside The Artist's Mind
          </h2>
          <p className="text-[0.6rem] text-[#EAE4D9]/40 tracking-[0.12em] leading-relaxed mb-8 uppercase">
            A Volumetric Architectural Exhibition
          </p>
          <div className="flex flex-col gap-2.5 text-[0.52rem] text-[#EAE4D9]/25 tracking-widest uppercase">
            <span>Concept & Creative Direction</span>
            <span className="text-[#C2A679]">Tadao Ando Tribute Studio</span>
            <div className="w-8 h-[1px] bg-[#EAE4D9]/10 my-1.5 mx-auto" />
            <span>Development & Motion</span>
            <span className="text-[#C2A679]">Advanced Agentic Coding</span>
          </div>
          <div className="mt-12 text-[0.48rem] text-[#EAE4D9]/15 tracking-[0.2em] uppercase">
            © 2026 — End of Exhibition
          </div>
        </div>
      </div>

    </div>
  );
}
