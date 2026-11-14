"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MaskingTape } from "@/components/paper/MaskingTape";
import { PaperLabel } from "@/components/paper/PaperLabel";
import { RecipeCard } from "@/components/paper/RecipeCard";
import { useAdmin } from "@/context/AdminContext";
import {
  SPRINGS,
  APPLE_EASE,
} from "@/lib/motion";

const PencilHeart = ({ className = "w-8 h-8", rotate = 0 }: { className?: string; rotate?: number }) => (
  <svg className={`${className} text-[#3B2A22] pointer-events-none opacity-90 filter drop-shadow-[1px_1px_0_rgba(59,42,34,0.15)]`} style={{ transform: `rotate(${rotate}deg)` }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path d="M8 9 Q 12 13 16 9" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

const PencilCandyWrapper = ({ className = "w-9 h-9", rotate = 0 }: { className?: string; rotate?: number }) => (
  <svg className={`${className} text-[#3B2A22] pointer-events-none opacity-90 filter drop-shadow-[1px_1px_0_rgba(59,42,34,0.15)]`} style={{ transform: `rotate(${rotate}deg)` }} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12 L4 6 L6 18 Z" />
    <path d="M24 24 L32 18 L30 30 Z" />
    <rect x="11" y="11" width="14" height="14" rx="3" transform="rotate(-15 18 18)" />
    <line x1="14" y1="14" x2="22" y2="22" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);

const PencilStar = ({ className = "w-8 h-8", rotate = 0 }: { className?: string; rotate?: number }) => (
  <svg className={`${className} text-[#3B2A22] pointer-events-none opacity-90 filter drop-shadow-[1px_1px_0_rgba(59,42,34,0.15)]`} style={{ transform: `rotate(${rotate}deg)` }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 Q12 12 2 12 Q12 12 12 22 Q12 12 12 2 Z" />
  </svg>
);

// ── V15 HERO CHOREOGRAPHY MOTION VARIANTS ──
// Stage 1: Freshness Badge (0ms delay) - drops slightly, settles natural tilt
const freshnessBadgeVariants = {
  hidden: { opacity: 0, y: -14, rotate: -5, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: -2.3,
    scale: 1,
    transition: { duration: 0.45, ease: APPLE_EASE, delay: 0.0 },
  },
};

// Stage 2: "A NEW" Block (100ms delay) - rises from downward offset, settles
const aNewBlockVariants = {
  hidden: { opacity: 0, y: 24, rotate: -3.2, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: -1.8,
    scale: 1,
    transition: { duration: 0.5, ease: APPLE_EASE, delay: 0.10 },
  },
};

// Stage 3: "TASTE" Block (220ms delay) - slides in from right with restrained spring
const tasteBlockVariants = {
  hidden: { opacity: 0, x: 30, rotate: -1.5, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 1.5,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 220, damping: 20, delay: 0.22 },
  },
};

// Stage 4: "OF" Badge (350ms delay) - scales in with small rotational settling
const ofBadgeVariants = {
  hidden: { opacity: 0, scale: 0.65, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 8,
    transition: { type: "spring" as const, stiffness: 280, damping: 18, delay: 0.35 },
  },
};

// Stage 5: "WELLNESS" Block (430ms delay) - rises into view, completes composition
const wellnessBlockVariants = {
  hidden: { opacity: 0, y: 26, rotate: -4.2, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: -2.5,
    scale: 1,
    transition: { duration: 0.52, ease: APPLE_EASE, delay: 0.43 },
  },
};

// Stage 6: Supporting Copy (600ms delay) - smooth editorial reveal
const supportingCopyVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: APPLE_EASE, delay: 0.60 },
  },
};

// Stage 7: Primary CTA "EXPLORE BAKES" (730ms delay) - tactile rise & pop
const primaryCtaVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 240, damping: 22, delay: 0.73 },
  },
};

// Stage 8: Secondary CTA "READ OUR STORY" (850ms delay) - gentle rise & fade
const secondaryCtaVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: APPLE_EASE, delay: 0.85 },
  },
};

// Stage 8.5: Recipe Metadata (920ms delay)
const recipeMetaVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: APPLE_EASE, delay: 0.92 },
  },
};

// Stage 9: Cake Polaroid Frame (950ms delay) - reveals upward with settling
const cakePolaroidVariants = {
  hidden: { opacity: 0, y: 35, rotate: 4, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 2,
    scale: 1,
    transition: { duration: 0.58, ease: APPLE_EASE, delay: 0.95 },
  },
};

// Stage 10: Overlapping Badges & Stickers (1100ms delay)
const createStickerPopVariants = (restRotate = 0, initialRotate = -8, delay = 1.1) => ({
  hidden: { opacity: 0, scale: 0.7, rotate: initialRotate },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: restRotate,
    transition: { type: "spring" as const, stiffness: 260, damping: 20, delay },
  },
});

interface ScrapbookHeroRedesignProps {
  onExploreClick?: () => void;
  onStoryClick?: () => void;
}

export function ScrapbookHeroRedesign({
  onExploreClick,
  onStoryClick,
}: ScrapbookHeroRedesignProps) {
  const { hero } = useAdmin();
  const shouldReduceMotion = useReducedMotion();

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("faves") || document.getElementById("bakes");
      if (el) {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
        const headerOffset = isMobile ? 85 : 95;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    }
  };

  const handleStory = () => {
    if (onStoryClick) {
      onStoryClick();
    } else {
      const el = document.getElementById("story");
      if (el) {
        const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
        const headerOffset = isMobile ? 85 : 95;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.05 }}
      className="w-full max-w-7xl mx-auto min-h-[680px] lg:min-h-[740px] relative select-none flex flex-col justify-center py-4 xs:py-6"
    >
      
      {/* ========================================================================= */}
      {/* FLOATING PENCIL SCRIBBLED HEARTS ♡, CANDY WRAPPERS 🍬 & STARS ✨ */}
      {/* ========================================================================= */}
      <motion.div
        variants={shouldReduceMotion ? undefined : createStickerPopVariants(-14, -24, 0.4)}
        className="absolute top-[8%] left-[2%] z-30"
      >
        <div className="animate-paper-float">
          <PencilHeart className="w-9 h-9" rotate={-14} />
        </div>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : createStickerPopVariants(22, 10, 0.5)}
        className="absolute top-[5%] right-[25%] z-30"
      >
        <div className="animate-paper-wobble">
          <PencilCandyWrapper className="w-10 h-10" rotate={22} />
        </div>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : createStickerPopVariants(15, 0, 0.6)}
        className="absolute top-[28%] left-[45%] z-30 hidden lg:block"
      >
        <div className="animate-paper-float" style={{ animationDelay: '1.2s' }}>
          <PencilStar className="w-9 h-9" rotate={15} />
        </div>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : createStickerPopVariants(-18, -30, 0.7)}
        className="absolute bottom-[20%] left-[1%] z-30"
      >
        <div className="animate-paper-wobble" style={{ animationDelay: '2.1s' }}>
          <PencilCandyWrapper className="w-9 h-9" rotate={-18} />
        </div>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : createStickerPopVariants(18, 5, 0.8)}
        className="absolute top-[48%] right-[3%] z-30"
      >
        <div className="animate-paper-float" style={{ animationDelay: '0.8s' }}>
          <PencilHeart className="w-8 h-8" rotate={18} />
        </div>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : createStickerPopVariants(-10, -20, 0.9)}
        className="absolute bottom-[10%] right-[32%] z-30 hidden lg:block"
      >
        <div className="animate-paper-wobble" style={{ animationDelay: '1.7s' }}>
          <PencilStar className="w-8 h-8" rotate={-10} />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* BACKDROP STORYTELLING: Coffee Ring Stain & Pencil Grid Lines */}
      {/* ========================================================================= */}
      {/* Coffee Stain Ring SVG */}
      <svg className="absolute top-[18%] right-[32%] w-48 h-48 text-[#3B2A22] opacity-[0.14] pointer-events-none z-0 hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="42" strokeWidth="3" strokeDasharray="8 4" />
        <circle cx="50" cy="50" r="38" strokeWidth="1.5" />
        <path d="M 45 10 C 60 12, 85 30, 88 50 C 90 70, 75 88, 50 88 C 25 88, 10 70, 12 50 C 14 30, 30 10, 45 10 Z" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      {/* Hand-drawn pencil arrow from Headline to Cheesecake */}
      <motion.svg
        variants={shouldReduceMotion ? undefined : freshnessBadgeVariants}
        className="absolute top-[22%] left-[42%] w-40 h-24 text-[#3B2A22] opacity-80 pointer-events-none z-30 hidden lg:block"
        viewBox="0 0 160 90"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 25 C 50 10, 110 15, 140 55" strokeDasharray="6 6" />
        <path d="M128 58 L142 57 L138 42" />
        <text x="25" y="18" fill="#3B2A22" className="font-fasthand text-sm font-bold rotate-[-5deg]">fresh today! 🍰</text>
      </motion.svg>

      {/* Main Interlocked Single-Canvas Composition Layout */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-center relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER: HANDCRAFTED EDITORIAL HEADLINE BLOCK & CTAS */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[54%] flex flex-col items-start text-left relative z-20">
          
          {/* Top Paper Strip - FRESH. HONEST. WHOLESOME. (Chunky Fredoka) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : freshnessBadgeVariants}
            className="relative inline-block mb-3 xs:mb-3.5 sm:mb-5 -ml-0.5 sm:-ml-1 group cursor-pointer"
          >
            <MaskingTape color="pink" width={42} height={20} rotate={-9} className="absolute -top-2 -left-3 z-10 opacity-90" />
            <div className="bg-[#EFE6CE] border-2 border-[#3B2A22] px-3.5 xs:px-4 py-1.5 rotate-[-2.3deg] shadow-[3px_3px_0_rgba(59,42,34,0.2)] group-hover:shadow-[5px_5px_0_rgba(59,42,34,0.25)] group-hover:-translate-y-0.5 transition-all duration-300 ease-out inline-block rounded-sm">
              <p className="text-[10px] xs:text-[11px] md:text-xs font-bold tracking-[0.22em] text-[#3B2A22] font-fredoka uppercase">
                FRESH. HONEST. WHOLESOME.
              </p>
            </div>
          </motion.div>

          {/* Sparkle Accent */}
          <svg className="absolute -top-3 -left-5 w-7 h-7 text-[#3B2A22] opacity-80 animate-paper-float pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
          </svg>

          {/* Mixed Paper Size & Tone Headline Blocks (Choreographed Entrance) */}
          <div className="space-y-2.5 xs:space-y-3 sm:space-y-3.5 md:space-y-4 w-full">
            
            {/* Block 1: "A NEW" (Warm Parchment Paper) */}
            <motion.div
              variants={shouldReduceMotion ? undefined : aNewBlockVariants}
              className="relative inline-block group"
            >
              {/* Vintage Stamp Accent */}
              <div className="absolute -top-7 -left-7 w-12 h-12 rounded-full border-2 border-dashed border-[#3B2A22]/40 flex items-center justify-center rotate-[-12deg] pointer-events-none hidden sm:flex">
                <span className="font-fasthand text-[9px] font-bold text-[#3B2A22]/60 text-center leading-tight">EST. 2024</span>
              </div>
              
              <div className="bg-[#F5EDDC] border-[3px] border-[#3B2A22] px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3.5 shadow-[4px_4px_0_#3B2A22] sm:shadow-[6px_6px_0_#3B2A22] rounded-lg transform -rotate-[1.8deg] group-hover:-rotate-[2.3deg] group-hover:-translate-y-1 group-hover:shadow-[9px_9px_0_#3B2A22] inline-block transition-all duration-300 ease-out">
                <h1 className="text-[38px] xs:text-[48px] sm:text-7xl md:text-8xl lg:text-[88px] font-cherry font-bold text-[#3B2A22] tracking-wider leading-none">
                  A NEW
                </h1>
              </div>
            </motion.div>

            {/* Block 2: "TASTE OF" + Yellow OF Badge (Coral Red Paper) */}
            <motion.div
              variants={shouldReduceMotion ? undefined : tasteBlockVariants}
              className="relative inline-flex items-end z-30 group"
            >
              <div className="bg-[#EF5B5B] border-[3px] border-[#3B2A22] px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3.5 shadow-[4px_4px_0_rgba(59,42,34,0.35)] sm:shadow-[6px_6px_0_rgba(59,42,34,0.35)] rounded-md transform rotate-[1.5deg] group-hover:rotate-[2.1deg] group-hover:-translate-y-1 group-hover:shadow-[9px_9px_0_rgba(59,42,34,0.35)] inline-block transition-all duration-300 ease-out">
                <h2 className="text-[38px] xs:text-[48px] sm:text-7xl md:text-8xl lg:text-[88px] font-cherry font-bold text-[#F5EDDC] tracking-wider leading-none">
                  TASTE
                </h2>
              </div>

              {/* Hand-placed "OF" Circle Badge overlapping TASTE & Seam */}
              <motion.div
                variants={shouldReduceMotion ? undefined : ofBadgeVariants}
                className="absolute -bottom-2.5 -right-3.5 xs:-bottom-4 xs:-right-5 md:-bottom-5 md:-right-8 w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#FFE066] rounded-full border-[2.5px] md:border-[3px] border-[#3B2A22] shadow-[3px_3px_0_rgba(59,42,34,0.3)] flex items-center justify-center z-40 transform rotate-[8deg] group-hover:rotate-[14deg] group-hover:scale-105 transition-transform duration-300 ease-out"
              >
                <div className="animate-paper-wobble">
                  <p className="text-xs xs:text-sm sm:text-lg md:text-xl font-cherry font-bold text-[#3B2A22]">OF</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Block 3: "WELLNESS" (Warm Cream Paper) */}
            <motion.div
              variants={shouldReduceMotion ? undefined : wellnessBlockVariants}
              className="relative inline-block group max-w-full"
            >
              <div className="bg-[#FAF4E8] border-[3px] border-[#3B2A22] px-3.5 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3.5 shadow-[4px_4px_0_rgba(59,42,34,0.3)] sm:shadow-[6px_6px_0_rgba(59,42,34,0.3)] rounded-xl transform -rotate-[2.5deg] group-hover:-rotate-[3.2deg] group-hover:-translate-y-1 group-hover:shadow-[9px_9px_0_rgba(59,42,34,0.35)] inline-block transition-all duration-300 ease-out max-w-full">
                <h3 className="text-[32px] xs:text-[42px] sm:text-7xl md:text-8xl lg:text-[88px] font-cherry font-bold text-[#3B2A22] tracking-wider leading-none break-words">
                  WELLNESS
                </h3>
              </div>
              {/* Hand-drawn squiggle underline */}
              <svg className="absolute -bottom-3 left-4 w-24 sm:w-32 h-6 text-[#3B2A22] opacity-75 pointer-events-none" fill="none" viewBox="0 0 100 24">
                <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M2 12 Q 15 2, 28 12 T 54 12 T 80 12 T 98 12" />
              </svg>
            </motion.div>

          </div>

          {/* Supporting Paragraph with Fraunces Editorial Serif Highlight */}
          <motion.p
            variants={shouldReduceMotion ? undefined : supportingCopyVariants}
            className="text-sm xs:text-[15px] sm:text-base md:text-lg text-[#3B2A22] max-w-lg mt-3.5 xs:mt-4 sm:mt-6 leading-[1.65] sm:leading-[1.75] font-manrope font-medium"
          >
            Guilt-free treats made with better ingredients for{' '}
            <span className="relative inline-block font-fraunces font-bold italic text-[#3B2A22] text-base sm:text-lg md:text-xl">
              a happier you.
              <span className="absolute left-0 -bottom-0.5 w-full h-2 bg-[#8FB3A1] opacity-60 -z-10 rounded-sm" />
            </span>
          </motion.p>

          {/* Tactile CTA Buttons (Full-Width on Mobile, Thumb-Friendly) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : primaryCtaVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 xs:gap-3 sm:gap-4.5 mt-4 xs:mt-4.5 sm:mt-6 w-full sm:w-auto"
          >
            {/* Primary CTA: EXPLORE BAKES (Fredoka Chunky) */}
            <motion.button 
              onClick={handleExplore}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.975,
                      y: 2.5,
                      boxShadow: "1.5px 1.5px 0px #3B2A22",
                    }
              }
              transition={SPRINGS.press}
              className="w-full sm:w-auto min-h-[50px] xs:min-h-[52px] justify-center px-6 sm:px-8 md:px-9 py-3 xs:py-3.5 sm:py-4 md:py-4.5 bg-[#EF5B5B] text-white text-base md:text-lg font-fredoka font-bold rounded-xl border-[3px] border-[#3B2A22] shadow-[4px_4px_0_#3B2A22] sm:shadow-[5px_5px_0_#3B2A22] hover:shadow-[7px_7px_0_#3B2A22] transition-colors duration-200 flex items-center gap-3.5 cursor-pointer group z-30 tracking-wider touch-manipulation select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFE066]" 
            >
              <span>EXPLORE BAKES</span>
              <motion.div 
                whileHover={shouldReduceMotion ? undefined : { rotate: 12, scale: 1.08 }}
                whileTap={shouldReduceMotion ? undefined : { rotate: 18, scale: 0.95 }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFE066] border-2 border-[#3B2A22] flex items-center justify-center transition-transform duration-250 ease-out shrink-0" 
                aria-hidden="true"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B2A22]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3l14 9-14 9z" />
                </svg>
              </motion.div>
            </motion.button>

            {/* Secondary CTA: READ OUR STORY */}
            <motion.button 
              variants={shouldReduceMotion ? undefined : secondaryCtaVariants}
              onClick={handleStory}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.975,
                      y: 2,
                      boxShadow: "1px 1px 0px #3B2A22",
                    }
              }
              transition={SPRINGS.press}
              className="w-full sm:w-auto min-h-[46px] xs:min-h-[48px] justify-center px-5 sm:px-6 md:px-7 py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-white/90 text-[#3B2A22] text-sm md:text-base font-manrope font-bold rounded-xl border-2 border-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:bg-white hover:shadow-[5px_5px_0_#3B2A22] transition-colors duration-200 flex items-center gap-2.5 cursor-pointer group z-30 touch-manipulation select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-[#8FB3A1]" 
            >
              <span>READ OUR STORY</span>
              <svg className="w-4 h-4 text-[#3B2A22] group-hover:translate-x-1 group-hover:rotate-6 transition-transform duration-250 ease-out shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Recipe Batch Metadata Tag */}
          <motion.div
            variants={shouldReduceMotion ? undefined : recipeMetaVariants}
            className="mt-3.5 xs:mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 font-fasthand text-xs sm:text-sm text-[#3B2A22]/75 rotate-[-1deg]"
          >
            <span>RECIPE № 024</span>
            <span>•</span>
            <span>HAND-BAKED DAILY</span>
            <span>•</span>
            <span>FAMILY RECIPE ♡</span>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT / CENTER: INTERLOCKED CHEESECAKE POLAROID KEEPSAKE */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[46%] flex justify-center lg:justify-end relative min-h-[360px] xs:min-h-[420px] sm:min-h-[540px] md:min-h-[580px] z-20 mt-5 xs:mt-6 sm:mt-8 lg:mt-0 lg:-ml-12">
          
          {/* Main Cheesecake Polaroid Frame Keepsake */}
          <motion.div
            variants={shouldReduceMotion ? undefined : cakePolaroidVariants}
            className="relative w-[280px] xs:w-[320px] sm:w-[380px] md:w-[420px] lg:w-[450px] h-[330px] xs:h-[380px] sm:h-[440px] md:h-[480px] lg:h-[510px] bg-white border-[4px] border-[#3B2A22] shadow-[7px_7px_0_#3B2A22] sm:shadow-[10px_10px_0_#3B2A22] rounded-md p-3 xs:p-4 flex flex-col justify-between transform rotate-[2deg] sm:rotate-[2.5deg] hover:rotate-[0.5deg] hover:shadow-[14px_14px_0_#3B2A22] hover:-translate-y-1 transition-all duration-500 ease-out group z-10"
          >
            {/* Top Kraft Masking Tape */}
            <MaskingTape color="kraft" width={90} height={28} rotate={-2} className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 opacity-95" />

            {/* Polaroid Photo Window (Matte finish & subtle corner wear) */}
            <div className="relative w-full h-[76%] xs:h-[78%] rounded overflow-hidden bg-[#F5EDDC] border-2 border-[#3B2A22]/30 shadow-inner">
              <Image
                src={hero?.image || "/cheesecake.png"}
                alt={hero?.alt || "Signature Artisanal Cheesecake"}
                fill
                sizes="(max-width: 640px) 320px, 450px"
                className="object-cover scale-[1.03] group-hover:scale-[1.07] transition-transform duration-700 ease-out"
                priority
                unoptimized={hero?.image?.startsWith("data:") || false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Polaroid Handwritten Keepsake Caption Bar */}
            <div className="flex items-center justify-between px-1.5 xs:px-2 pt-1.5 xs:pt-2 pb-0.5">
              <div className="flex flex-col">
                <p className="font-fasthand text-base xs:text-lg md:text-xl text-[#3B2A22] font-bold rotate-[-1deg]">
                  {hero?.captionTitle || "today's batch ♡"}
                </p>
                <p className="font-caveat text-xs xs:text-sm font-bold text-[#3B2A22]/70 -mt-1">
                  {hero?.captionSubtitle || "Mom's Special"}
                </p>
              </div>
              <div className="text-right">
                <span className="font-fraunces text-[10px] xs:text-xs font-bold text-[#3B2A22]/80 uppercase tracking-widest block">
                  02/24
                </span>
                <span className="font-fasthand text-[10px] xs:text-[11px] font-bold text-[#EF5B5B]">Made this morning</span>
              </div>
            </div>

            {/* Inner highlight shadow */}
            <div className="absolute inset-0 border-2 border-black/5 pointer-events-none rounded-md" />
          </motion.div>

          {/* ------------------------------------------------------------------------- */}
          {/* OVERLAPPING SCRAPBOOK BADGES & LABELS ATTACHED TO POLAROID */}
          {/* ------------------------------------------------------------------------- */}
          
          {/* Made Fresh Daily Blue Circle Badge (Top Right - Fredoka) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : createStickerPopVariants(6, -6, 1.05)}
            className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 md:-right-6 w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#7BA3C4] rounded-full border-[3px] md:border-[3.5px] border-[#3B2A22] shadow-[3px_3px_0_#3B2A22] sm:shadow-[4px_4px_0_#3B2A22] flex flex-col items-center justify-center z-30 transform rotate-[6deg]"
          >
            <div className="animate-paper-wobble flex flex-col items-center justify-center">
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-fredoka font-bold text-[#3B2A22] text-center leading-tight uppercase tracking-wider">MADE FRESH</p>
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-fredoka font-bold text-[#3B2A22] text-center leading-tight uppercase tracking-wider">DAILY</p>
            </div>
          </motion.div>

          {/* Lactose-Free Paper Label (Top Left Polaroid Edge) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : createStickerPopVariants(-5, 5, 1.15)}
            className="absolute top-10 xs:top-12 -left-3 xs:-left-4 sm:-left-8 z-30"
          >
            <PaperLabel text="LACTOSE-FREE" color="yellow" rotate={-5} className="shadow-[2.5px_2.5px_0_#3B2A22] sm:shadow-[3px_3px_0_#3B2A22] font-fredoka text-[10px] xs:text-xs" />
          </motion.div>

          {/* Sugar-Free Paper Label (Mid-Right Polaroid Edge) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : createStickerPopVariants(7, -5, 1.2)}
            className="absolute top-1/2 -right-3 xs:-right-4 sm:-right-8 z-30"
          >
            <PaperLabel text="SUGAR-FREE" color="coral" rotate={7} className="shadow-[2.5px_2.5px_0_#3B2A22] sm:shadow-[3px_3px_0_#3B2A22] font-fredoka text-[10px] xs:text-xs" />
          </motion.div>

          {/* ------------------------------------------------------------------------- */}
          {/* CLUSTER 2: RECIPE NOTE & MOM'S RECIPE CARD WITH PAPERCLIP & MEASUREMENTS */}
          {/* ------------------------------------------------------------------------- */}
          <motion.div
            variants={shouldReduceMotion ? undefined : createStickerPopVariants(-7, -15, 1.25)}
            className="absolute bottom-6 xs:bottom-8 -left-3 xs:-left-5 sm:-left-12 md:-left-16 z-30"
          >
            {/* Paperclip Accent */}
            <svg className="absolute -top-5 left-4 w-5 h-8 sm:w-6 sm:h-9 text-[#3B2A22] z-40 -rotate-12 pointer-events-none drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v14a5 5 0 0010 0V6a3 3 0 00-6 0v14a1 1 0 002 0V8" />
            </svg>
            
            <MaskingTape color="pink" width={48} height={18} rotate={-16} className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-40" />
            <RecipeCard rotate={-7} edge={1} width={130}>
              <div className="text-center py-1 px-1">
                <p className="text-[9px] font-fraunces font-bold text-[#3B2A22]/60 uppercase tracking-widest">
                  Mom&apos;s Recipe #024
                </p>
                <p className="text-sm xs:text-base font-fasthand text-[#3B2A22] leading-tight font-bold mt-0.5">
                  Made with love,
                </p>
                <p className="text-xs xs:text-sm font-fasthand text-[#EF5B5B] leading-tight font-bold">
                  for you ♡
                </p>
                <p className="text-[9px] font-caveat font-bold text-[#3B2A22]/70 mt-0.5">250g cream cheese</p>
              </div>
            </RecipeCard>
          </motion.div>

          {/* ------------------------------------------------------------------------- */}
          {/* CLUSTER 3: CHECKLIST CARD (Bottom Right Overlapping with Sage Tape) */}
          {/* ------------------------------------------------------------------------- */}
          <motion.div
            variants={shouldReduceMotion ? undefined : createStickerPopVariants(3.5, 10, 1.3)}
            className="absolute -bottom-3 xs:-bottom-4 -right-2 xs:-right-3 sm:-right-6 md:-right-10 w-44 xs:w-48 sm:w-56 bg-[#EF9A9A] border-[2.5px] sm:border-[3px] border-[#3B2A22] shadow-[4px_4px_0_#3B2A22] sm:shadow-[5px_5px_0_#3B2A22] hover:shadow-[7px_7px_0_#3B2A22] hover:-translate-y-0.5 transition-all duration-300 p-2.5 xs:p-3 sm:p-4 rounded-xl transform rotate-[3.5deg] z-30"
          >
            <MaskingTape color="sage" width={48} height={18} rotate={12} className="absolute -top-2.5 right-4 z-40" />
            <div className="space-y-1.5 xs:space-y-2">
              {['No Refined Sugar', 'High Protein', 'Real Ingredients', '100% Delicious'].map((label) => (
                <div key={label} className="flex items-center gap-1.5 xs:gap-2">
                  <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 bg-white border-2 border-[#3B2A22] rounded flex items-center justify-center shrink-0">
                    <svg className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-[#3B2A22]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] xs:text-xs font-fredoka font-bold text-[#3B2A22]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* High-Protein Pill Badge */}
          <motion.div
            variants={shouldReduceMotion ? undefined : createStickerPopVariants(-2, 0, 1.35)}
            className="absolute -bottom-7 sm:-bottom-8 right-12 sm:right-16 z-20 hidden xs:block"
          >
            <PaperLabel text="HIGH-PROTEIN" color="blue" pill rotate={-2} className="!px-3 xs:!px-5 !py-1.5 xs:!py-2.5 font-manrope font-bold text-[10px] xs:text-xs shadow-[2.5px_2.5px_0_#3B2A22] sm:shadow-[3px_3px_0_#3B2A22]" />
          </motion.div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* HAND-DRAWN BOUNCE SCROLL INDICATOR (Bottom Center) */}
      {/* ========================================================================= */}
      <motion.div 
        variants={shouldReduceMotion ? undefined : freshnessBadgeVariants}
        className="mt-10 xs:mt-12 lg:mt-6 mx-auto flex flex-col items-center gap-1.5 z-30 cursor-pointer group"
        onClick={() => {
          const target = document.getElementById('story');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <p className="text-[11px] font-manrope font-bold text-[#3B2A22] tracking-[0.2em] group-hover:text-[#EF5B5B] transition-colors duration-200 uppercase">
          SCROLL TO DISCOVER
        </p>
        <div className="bg-[#3B2A22]/30 h-px w-14" />
        <div className="w-9 h-9 bg-[#8FB3A1] rounded-full flex items-center justify-center border-2 border-[#3B2A22] shadow-[2px_2px_0_#3B2A22] group-hover:translate-y-1 transition-transform duration-200">
          <svg className="w-4 h-4 text-[#3B2A22] animate-bounce" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </motion.div>

    </motion.div>
  );
}
