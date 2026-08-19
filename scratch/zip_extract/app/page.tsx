'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { ProductShowcase } from '@/components/ProductShowcase'
import { ProductBadges } from '@/components/ProductBadges'
import { DecorativeElements } from '@/components/DecorativeElements'
import { PaperBackground } from '@/components/PaperBackground'
import { BackgroundNotes } from '@/components/BackgroundNotes'
import { Scribbles } from '@/components/Scribbles'
import { ParallaxLayer } from '@/components/ParallaxLayer'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[#C7E9E4] overflow-hidden relative">
      {/* Layer 1 - Paper foundation (grain, watercolor wash, vignette) */}
      <PaperBackground />

      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <section className="min-h-screen flex items-center justify-between px-8 md:px-16 pt-32 relative">
        {/* Layer 2 - Background notes (faded recipe handwriting, stains) */}
        <div className="absolute inset-0 z-[1]">
          <BackgroundNotes />
        </div>

        {/* Layer 3 - Scribbles (doodle field), drifting slightly with the cursor */}
        <ParallaxLayer depth={14} className="absolute inset-0 z-[2]">
          <Scribbles />
        </ParallaxLayer>

        {/* Layer 5/6 - Notes, paper scraps, tape, floating decorations */}
        <DecorativeElements />

        {/* Layer 4 - Main hero content */}
        <div className="w-full md:w-1/2 relative z-10 pr-8">
          <HeroSection />
        </div>

        {/* Layer 4 - Product showcase (also the composition's focal point) */}
        <div className="hidden lg:flex w-1/2 justify-end relative z-10 h-[600px] pb-20">
          <ProductShowcase />
          <ProductBadges />
        </div>
      </section>

      {/* Mobile Product Showcase - shows only on mobile/tablet (the "be kind to your body" tagline lives in the kraft corner decoration on desktop) */}
      <section className="lg:hidden py-12 px-6 relative z-10">
        <div className="relative h-96 mb-16">
          <ProductShowcase />
          <ProductBadges />
        </div>
        <p className="text-center text-lg font-cursive-note text-[#2D1810]">be kind to your body ♡</p>
      </section>
    </main>
  )
}
