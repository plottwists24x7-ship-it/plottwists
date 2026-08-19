type NoteColor = 'yellow' | 'pink' | 'blue' | 'cream' | 'sage'

const NOTE_BG: Record<NoteColor, string> = {
  yellow: '#FFE066',
  pink: '#F4B8C4',
  blue: '#AEC9DF',
  cream: '#F5EDDC',
  sage: '#C7D9C9',
}

interface StickyNoteProps {
  text: string
  color?: NoteColor
  rotate?: number
  size?: number
  className?: string
  animate?: boolean
}

/**
 * Small handwritten sticky note. Used throughout the page for callouts like
 * "Fresh Daily", "Chef's Pick", "Calories", etc. — pass different `text` and
 * `color` per instance for variety.
 */
export function StickyNote({ text, color = 'yellow', rotate = -4, size = 96, className = '', animate = true }: StickyNoteProps) {
  return (
    <div
      className={`flex items-center justify-center text-center p-2 ${animate ? 'animate-paper-float' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: NOTE_BG[color],
        transform: `rotate(${rotate}deg)`,
        boxShadow: '2px 4px 0 rgba(45,24,16,0.15), 3px 5px 6px rgba(45,24,16,0.15)',
        clipPath: 'polygon(1% 3%, 96% 0%, 100% 6%, 98% 96%, 4% 100%, 0% 94%)',
      }}
    >
      <p className="font-cursive-note text-sm leading-tight text-[#2D1810]">{text}</p>
    </div>
  )
}
