interface Note {
  text: string
  x: string
  y: string
  rotate: number
  size: string
}

// Kept at 4-7% opacity by design — these should read as texture, never as
// content someone tries to actually read.
const NOTES: Note[] = [
  { text: '2 cups almond flour', x: '4%', y: '14%', rotate: -6, size: '13px' },
  { text: '1/3 cup honey', x: '8%', y: '22%', rotate: 4, size: '12px' },
  { text: 'bake 350° · 45 min', x: '3%', y: '58%', rotate: -3, size: '12px' },
  { text: 'whisk until smooth', x: '76%', y: '12%', rotate: 5, size: '12px' },
  { text: '★★★★★', x: '84%', y: '20%', rotate: -8, size: '14px' },
  { text: 'fold in berries gently', x: '80%', y: '46%', rotate: 3, size: '12px' },
  { text: 'chill overnight', x: '6%', y: '74%', rotate: 6, size: '12px' },
  { text: 'no refined sugar!', x: '70%', y: '68%', rotate: -4, size: '12px' },
  { text: '3 eggs, room temp', x: '18%', y: '86%', rotate: -2, size: '12px' },
  { text: 'zest of 1 lemon', x: '60%', y: '84%', rotate: 5, size: '12px' },
  { text: 'yields 8 slices', x: '90%', y: '80%', rotate: -5, size: '12px' },
]

export function BackgroundNotes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {NOTES.map((n, i) => (
        <p
          key={i}
          className="absolute font-cursive-note text-[#2D1810] whitespace-nowrap"
          style={{ left: n.x, top: n.y, transform: `rotate(${n.rotate}deg)`, fontSize: n.size, opacity: 0.06 }}
        >
          {n.text}
        </p>
      ))}

      {/* A couple of faint ingredient-arrow sketches */}
      <svg className="absolute w-24 h-16 text-[#2D1810]" style={{ left: '14%', top: '40%', opacity: 0.05, transform: 'rotate(-8deg)' }} fill="none" stroke="currentColor" viewBox="0 0 100 60">
        <path strokeWidth="1.5" d="M5 30 Q30 10 55 30 T95 25" />
        <path strokeWidth="1.2" d="M90 20 L95 25 L88 30" />
      </svg>

      {/* Faint whisk sketch */}
      <svg className="absolute w-10 h-16 text-[#2D1810]" style={{ left: '88%', top: '55%', opacity: 0.05, transform: 'rotate(10deg)' }} fill="none" stroke="currentColor" viewBox="0 0 40 60">
        <path strokeWidth="1.5" d="M20 4 L20 30 M12 10 Q20 2 28 10 M12 18 Q20 8 28 18 M12 26 Q20 14 28 26 M20 30 L20 56" />
      </svg>

      {/* Coffee-ring stain */}
      <div
        className="absolute rounded-full border-[6px]"
        style={{ left: '55%', top: '10%', width: 90, height: 90, borderColor: '#8B5E34', opacity: 0.045 }}
      />
      <div
        className="absolute rounded-full border-[5px]"
        style={{ left: '10%', top: '48%', width: 70, height: 70, borderColor: '#8B5E34', opacity: 0.04 }}
      />
    </div>
  )
}
