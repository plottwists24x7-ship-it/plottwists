// Deterministic PRNG (mulberry32) so the scribble field is identical on the
// server and client render — avoids hydration mismatches without needing a
// `mounted` gate, while still giving each doodle a hand-placed feel.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Kind = 'star' | 'swirl' | 'loop' | 'cross' | 'arrow' | 'underline' | 'heart' | 'circleScribble' | 'brushStroke' | 'dot' | 'plus'

interface Doodle {
  kind: Kind
  x: number // percentage
  y: number // percentage
  rotate: number
  scale: number
  opacity: number
  accent: boolean // pink marker vs ink brown
}

const KINDS: Kind[] = ['star', 'swirl', 'loop', 'cross', 'arrow', 'underline', 'heart', 'circleScribble', 'brushStroke', 'dot', 'plus']

function buildField(count: number, seed: number): Doodle[] {
  const rnd = mulberry32(seed)
  const doodles: Doodle[] = []
  for (let i = 0; i < count; i++) {
    const scaleRnd = rnd()
    // Tiered sizing: Tiny (0.45-0.6), Small (0.7-0.9), Medium (1.0-1.3)
    const scale = scaleRnd < 0.4 ? (0.45 + rnd() * 0.15) : scaleRnd < 0.8 ? (0.7 + rnd() * 0.2) : (1.0 + rnd() * 0.3)
    doodles.push({
      kind: KINDS[Math.floor(rnd() * KINDS.length)],
      x: 4 + rnd() * 92,
      y: 4 + rnd() * 92,
      rotate: Math.floor(rnd() * 360),
      scale: scale,
      // Refined background opacity: 20-30% range for designed whitespace
      opacity: 0.18 + rnd() * 0.12,
      accent: rnd() > 0.85,
    })
  }
  return doodles
}

// Two independent fields (different seeds) so we can layer a sparse
// foreground set over a denser background set without repeating positions.
const FIELD_A = buildField(34, 1337)
const FIELD_B = buildField(20, 90210)

function DoodlePath({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'star':
      return <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
    case 'swirl':
      return <path fill="none" strokeWidth="1.6" strokeLinecap="round" d="M4 14c0-5 4-9 9-9s7 3 6 7-5 5-8 3 1-6 4-5" />
    case 'loop':
      return <path fill="none" strokeWidth="1.6" strokeLinecap="round" d="M3 12c2-6 8-6 9 0s5 5 9-1" />
    case 'cross':
      return <path fill="none" strokeWidth="1.8" strokeLinecap="round" d="M4 4l14 14M18 4L4 18" />
    case 'arrow':
      return <path fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 14 Q10 4 18 8 M18 8l-4-1 M18 8l-2 4" />
    case 'underline':
      return <path fill="none" strokeWidth="2" strokeLinecap="round" d="M2 12 Q8 4 14 12 T24 10" />
    case 'heart':
      return (
        <path
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20s-7-4.7-9.4-8.8C1 8.4 1.7 5 4.6 3.7 6.8 2.7 9.2 3.5 12 6.6c2.8-3.1 5.2-3.9 7.4-2.9 2.9 1.3 3.6 4.7 1.8 7.5C19 15.3 12 20 12 20z"
        />
      )
    case 'circleScribble':
      return <path fill="none" strokeWidth="1.6" strokeLinecap="round" d="M12 3c5 0 8 3 8 8s-3 8-8 8-8-3-8-8 2-7 7-8" />
    case 'brushStroke':
      return <path fill="none" strokeWidth="3" strokeLinecap="round" d="M2 10 Q9 6 16 10 T22 8" />
    case 'plus':
      return <path fill="none" strokeWidth="1.8" strokeLinecap="round" d="M10 3v14M3 10h14" />
    case 'dot':
    default:
      return <circle cx="10" cy="10" r="2.4" />
  }
}

function Doodle({ d }: { d: Doodle }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute"
      style={{
        left: `${d.x}%`,
        top: `${d.y}%`,
        width: 24 * d.scale,
        height: 24 * d.scale,
        opacity: d.opacity,
        transform: `rotate(${d.rotate}deg)`,
        color: d.accent ? '#D4537E' : '#2D1810',
      }}
      viewBox="0 0 24 20"
      fill="currentColor"
      stroke="currentColor"
    >
      <DoodlePath kind={d.kind} />
    </svg>
  )
}

/**
 * Dense field of small hand-drawn-style doodles (stars, swirls, loops,
 * crosses, arrows, underlines, hearts, brush strokes, plus signs, dots).
 * Positions are seeded/deterministic so SSR and client markup match exactly.
 */
export function Scribbles({ dense = true }: { dense?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {FIELD_A.map((d, i) => (
        <Doodle key={`a-${i}`} d={d} />
      ))}
      {dense && FIELD_B.map((d, i) => (
        <Doodle key={`b-${i}`} d={d} />
      ))}
    </div>
  )
}
