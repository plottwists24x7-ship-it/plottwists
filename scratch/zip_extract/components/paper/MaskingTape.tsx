import type { CSSProperties } from 'react'

type TapeColor = 'cream' | 'sage' | 'blue' | 'yellow' | 'pink' | 'kraft'

const TAPE_COLORS: Record<TapeColor, string> = {
  cream: 'linear-gradient(100deg, rgba(245,237,220,0.85), rgba(245,237,220,0.55))',
  sage: 'linear-gradient(100deg, rgba(143,179,161,0.8), rgba(143,179,161,0.5))',
  blue: 'linear-gradient(100deg, rgba(123,163,196,0.8), rgba(123,163,196,0.5))',
  yellow: 'linear-gradient(100deg, rgba(255,224,102,0.85), rgba(245,201,78,0.55))',
  pink: 'linear-gradient(100deg, rgba(239,154,154,0.8), rgba(239,154,154,0.5))',
  kraft: 'linear-gradient(100deg, rgba(200,168,119,0.85), rgba(200,168,119,0.55))',
}

interface MaskingTapeProps {
  color?: TapeColor
  width?: number
  height?: number
  rotate?: number
  className?: string
  style?: CSSProperties
  torn?: boolean
}

/**
 * A single strip of masking/washi tape. Meant to be absolutely positioned by
 * the parent (className handles placement, this component handles the look).
 */
export function MaskingTape({
  color = 'cream',
  width = 90,
  height = 26,
  rotate = 0,
  className = '',
  style = {},
  torn = true,
}: MaskingTapeProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{
        width,
        height,
        background: TAPE_COLORS[color],
        transform: `rotate(${rotate}deg)`,
        boxShadow: 'inset 0 1px 3px rgba(45,24,16,0.15), 0 2px 3px rgba(45,24,16,0.12)',
        clipPath: torn
          ? 'polygon(1% 20%, 3% 0%, 6% 15%, 10% 2%, 14% 18%, 18% 3%, 22% 16%, 27% 0%, 32% 14%, 37% 2%, 42% 17%, 48% 3%, 53% 15%, 58% 0%, 64% 16%, 70% 2%, 76% 14%, 82% 0%, 88% 15%, 94% 2%, 98% 12%, 100% 0%, 100% 82%, 97% 100%, 93% 85%, 88% 98%, 82% 84%, 76% 100%, 70% 86%, 64% 98%, 58% 84%, 53% 100%, 48% 85%, 42% 98%, 37% 83%, 32% 100%, 27% 85%, 22% 100%, 18% 82%, 14% 97%, 10% 83%, 6% 100%, 3% 85%, 0% 100%)'
          : undefined,
        ...style,
      }}
    />
  )
}
