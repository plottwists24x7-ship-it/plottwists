"use client";

import React from "react";
import { HeroContainer } from "./Hero/HeroContainer";
import { HeroScrollIndicator } from "./Hero/HeroScrollIndicator";
import { HeroScrapbookDoodles } from "./Hero/HeroScrapbookDoodles";

interface HeroProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export default function Hero({ onExploreClick, onStoryClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="HeroBackground relative min-h-[100svh] md:min-h-[900px] md:max-h-[1080px] h-auto md:h-screen w-full bg-[#BFF0E1] border-b-4 border-[#3D2E25] overflow-hidden"
    >
      {/* Background Dot Pattern Layer */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#3D2E25_2px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Primary Content Container Layer */}
      <HeroContainer onExploreClick={onExploreClick} onStoryClick={onStoryClick} />

      {/* Scrapbook Decorative Layer */}
      <div className="HeroDecorativeLayer absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <HeroScrapbookDoodles />
      </div>

      {/* Reserved Motion Layer Placeholder */}
      <div className="HeroMotionLayer absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

      {/* Static Minimal Scroll Indicator */}
      <HeroScrollIndicator />
    </section>
  );
}
