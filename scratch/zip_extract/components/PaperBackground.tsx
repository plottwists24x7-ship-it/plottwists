/**
 * Layer 1 — Paper foundation. Sits behind everything else: warm base tone
 * (set on <main>/<html>), a soft watercolor wash, paper-fiber grain, and a
 * gentle vignette. Every effect here stays subtle by design — the point is
 * that the user *feels* paper without consciously noticing texture.
 */
export function PaperBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Watercolor wash — soft blurred color blobs, multiply-blended */}
      <div
        className="absolute -top-20 -left-20 w-[520px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(143,179,161,0.35), transparent 70%)', filter: 'blur(40px)', mixBlendMode: 'multiply' }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(239,154,154,0.25), transparent 70%)', filter: 'blur(50px)', mixBlendMode: 'multiply' }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(200,168,119,0.22), transparent 70%)', filter: 'blur(45px)', mixBlendMode: 'multiply' }}
      />
      <div
        className="absolute top-10 left-1/2 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,224,102,0.18), transparent 70%)', filter: 'blur(40px)', mixBlendMode: 'multiply' }}
      />

      {/* Paper grain — fine turbulence noise, extremely subtle */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05, mixBlendMode: 'multiply' }}>
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.176  0 0 0 0 0.094  0 0 0 0 0.063  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(45,24,16,0.10) 100%)' }}
      />
    </div>
  )
}
