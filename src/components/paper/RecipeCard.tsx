import type { ReactNode } from 'react'
import { TornPaper, type PaperVariant } from './TornPaper'

interface RecipeCardProps {
  children: ReactNode
  variant?: PaperVariant
  rotate?: number
  edge?: 0 | 1 | 2
  width?: number
  className?: string
}

/**
 * A torn-paper note card sized for short handwritten copy — "Made with
 * love, for you.", ingredient callouts, serving suggestions, etc.
 */
export function RecipeCard({ children, variant = 'cream', rotate = -6, edge = 1, width = 128, className = '' }: RecipeCardProps) {
  return (
    <TornPaper
      variant={variant}
      rotate={rotate}
      edge={edge}
      className={`p-4 ${className}`}
      style={{ width }}
    >
      {children}
    </TornPaper>
  )
}
