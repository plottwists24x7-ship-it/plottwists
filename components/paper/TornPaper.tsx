import type { ReactNode, CSSProperties } from 'react'

export type PaperVariant = 'cream' | 'notebook' | 'kraft' | 'memo' | 'recipe'

const VARIANT_BG: Record<PaperVariant, string> = {
  cream: '#F5EDDC',
  notebook: '#FBF7EC',
  kraft: '#D8BE94',
  memo: '#FFFDF6',
  recipe: '#F3E9D2',
}

// A handful of distinct torn-edge silhouettes so repeated papers don't look
// like the same rectangle copy/pasted. Picked deterministically by `edge`.
const EDGES = [
  'polygon(2% 6%, 10% 2%, 22% 5%, 34% 1%, 46% 5%, 58% 1%, 70% 4%, 82% 0%, 94% 4%, 100% 8%, 98% 22%, 100% 36%, 97% 50%, 100% 64%, 98% 78%, 100% 92%, 92% 98%, 80% 95%, 68% 99%, 56% 95%, 44% 99%, 32% 96%, 20% 100%, 8% 96%, 0% 90%, 3% 76%, 0% 62%, 4% 48%, 0% 34%, 3% 20%, 0% 8%)',
  'polygon(0% 10%, 12% 4%, 24% 8%, 36% 2%, 48% 7%, 60% 3%, 72% 8%, 84% 3%, 96% 7%, 100% 18%, 96% 32%, 100% 46%, 95% 60%, 100% 74%, 96% 88%, 100% 98%, 86% 100%, 74% 96%, 62% 100%, 50% 97%, 38% 100%, 26% 96%, 14% 100%, 2% 96%, 4% 82%, 0% 68%, 5% 54%, 0% 40%, 4% 26%)',
  'polygon(4% 0%, 18% 4%, 30% 0%, 42% 5%, 54% 0%, 66% 4%, 78% 0%, 90% 5%, 100% 2%, 96% 16%, 100% 30%, 94% 44%, 100% 58%, 95% 72%, 100% 86%, 92% 100%, 78% 96%, 64% 100%, 50% 95%, 36% 100%, 22% 97%, 8% 100%, 0% 90%, 4% 76%, 0% 62%, 5% 48%, 0% 34%, 5% 18%)',
]

interface TornPaperProps {
  variant?: PaperVariant
  rotate?: number
  edge?: 0 | 1 | 2
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * A reusable "scrap of paper" surface with an irregular torn edge and a
 * believable drop shadow. Compose with sticky notes, recipe cards, tape,
 * labels, etc. by passing children.
 */
export function TornPaper({
  variant = 'cream',
  rotate = 0,
  edge = 0,
  className = '',
  style = {},
  children,
}: TornPaperProps) {
  return (
    <div
      className={className}
      style={{
        background: VARIANT_BG[variant],
        clipPath: EDGES[edge],
        transform: `rotate(${rotate}deg)`,
        filter: 'drop-shadow(3px 5px 4px rgba(45,24,16,0.18))',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
