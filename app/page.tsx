'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ScrapbookHeroRedesign } from '@/components/ScrapbookHeroRedesign'
import { DecorativeElements } from '@/components/DecorativeElements'
import { PaperBackground } from '@/components/PaperBackground'
import { BackgroundNotes } from '@/components/BackgroundNotes'
import { Scribbles } from '@/components/Scribbles'
import { ParallaxLayer } from '@/components/ParallaxLayer'
import Story from '@/components/sections/Story'
import Products from '@/components/sections/Products'
import Gallery from '@/components/sections/Gallery'
import Reviews from '@/components/sections/Reviews'
import InstagramCTA from '@/components/sections/InstagramCTA'
import Footer from '@/components/sections/Footer'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-[#C7E9E4] overflow-x-hidden relative">
      {/* Layer 1 - Paper foundation (grain, watercolor wash, vignette) */}
      <PaperBackground />

      {/* Header */}
      <Header />

      {/* Main Single-Composition Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 pt-24 md:pt-28 pb-12 relative overflow-hidden">
        {/* Layer 2 - Background notes (faded recipe handwriting, stains) */}
        <div className="absolute inset-0 z-[1]">
          <BackgroundNotes />
        </div>

        {/* Layer 3 - Scribbles (doodle field), drifting slightly with the cursor */}
        <ParallaxLayer depth={14} className="absolute inset-0 z-[2]">
          <Scribbles />
        </ParallaxLayer>

        {/* Layer 3.5 - Floating background micro-decorations (tapes, sticky notes, paperclips, scraps) */}
        <DecorativeElements />

        {/* Layer 4 - Single-Composition Scrapbook Hero Canvas */}
        <div className="w-full relative z-10">
          <ScrapbookHeroRedesign
            onExploreClick={() => scrollToSection('bakes')}
            onStoryClick={() => scrollToSection('story')}
          />
        </div>
      </section>

      {/* Our Story Section */}
      <div id="story">
        <Story />
      </div>

      {/* Our Bakes / Products Showcase Section */}
      <div id="bakes">
        <Products />
      </div>

      {/* Our Gallery Section */}
      <div id="gallery">
        <Gallery />
      </div>

      {/* Customer Reviews Section */}
      <div id="reviews">
        <Reviews />
      </div>

      {/* Award-Winning Final Instagram CTA Section */}
      <div id="contact-section">
        <InstagramCTA />
      </div>

      {/* Footer Section */}
      <Footer />
    </main>
  )
}
