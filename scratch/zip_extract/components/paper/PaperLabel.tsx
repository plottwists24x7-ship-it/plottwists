type LabelColor = 'yellow' | 'coral' | 'blue' | 'cream' | 'sage'

const LABEL_BG: Record<LabelColor, string> = {
  yellow: '#FFE066',
  coral: '#EF9A9A',
  blue: '#7BA3C4',
  cream: '#F5EDDC',
  sage: '#8FB3A1',
}

interface PaperLabelProps {
  text: string
  color?: LabelColor
  rotate?: number
  pill?: boolean
  className?: string
  animate?: boolean
}

/**
 * Small rectangular/pill paper tag, e.g. "LACTOSE-FREE", "SUGAR-FREE",
 * "HIGH-PROTEIN". Reusable so product badges stay consistent.
 */
export function PaperLabel({ text, color = 'yellow', rotate = 3, pill = false, className = '', animate = true }: PaperLabelProps) {
  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-2 border-2 border-[#2D1810] ${pill ? 'rounded-full' : 'rounded-md'} ${animate ? 'animate-paper-wobble' : ''} ${className}`}
      style={{
        background: LABEL_BG[color],
        transform: `rotate(${rotate}deg)`,
        boxShadow: '2px 2px 0 rgba(45,24,16,0.2)',
      }}
    >
      <span className="text-[10px] font-bold text-[#2D1810] text-center whitespace-nowrap" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        {text}
      </span>
    </div>
  )
}
