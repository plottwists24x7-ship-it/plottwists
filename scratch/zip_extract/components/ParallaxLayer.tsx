'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface ParallaxLayerProps {
  depth?: number // higher = moves more
  children: ReactNode
  className?: string
}

/**
 * Wraps decorative content and gives it a subtle mouse-parallax drift.
 * Intended for background paper/scribble layers only — never for
 * text/CTAs, so hit targets never move under the cursor.
 */
export function ParallaxLayer({ depth = 10, children, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * depth
      const y = (e.clientY / window.innerHeight - 0.5) * depth
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [depth])

  return (
    <div ref={ref} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  )
}
