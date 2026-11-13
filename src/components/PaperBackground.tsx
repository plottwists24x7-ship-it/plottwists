/**
 * Layer 1 — Paper foundation. Sits behind everything else: warm base tone
 * (set on <main>/<html>), a soft watercolor wash, paper-fiber grain, and a
 * gentle vignette. Hardware-accelerated with GPU compositing layer and cached
 * pattern-tiled grain for 60fps scrolling without expensive per-pixel feTurbulence re-renders.
 */
export function PaperBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 0,
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {/* Watercolor wash — soft blurred color blobs, GPU accelerated */}
      <div
        className="absolute -top-20 -left-20 w-[520px] h-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(143,179,161,0.35) 0%, rgba(143,179,161,0.15) 50%, transparent 70%)",
          filter: "blur(25px)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(239,154,154,0.25) 0%, rgba(239,154,154,0.10) 50%, transparent 70%)",
          filter: "blur(30px)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[480px] h-[480px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,168,119,0.22) 0%, rgba(200,168,119,0.08) 50%, transparent 70%)",
          filter: "blur(25px)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute top-10 left-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,224,102,0.18) 0%, rgba(255,224,102,0.06) 50%, transparent 70%)",
          filter: "blur(25px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Tiled Paper grain — rasterized into 128x128 GPU cached pattern instead of viewport-scale filter */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05, mixBlendMode: "multiply" }}>
        <defs>
          <filter id="paper-grain-tile" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.176  0 0 0 0 0.094  0 0 0 0 0.063  0 0 0 0.5 0" />
          </filter>
          <pattern id="paper-grain-pattern" width="128" height="128" patternUnits="userSpaceOnUse">
            <rect width="128" height="128" filter="url(#paper-grain-tile)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#paper-grain-pattern)" />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(45,24,16,0.10) 100%)" }}
      />
    </div>
  );
}
