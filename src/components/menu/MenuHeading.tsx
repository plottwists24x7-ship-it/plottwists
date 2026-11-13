"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { headingVariants } from "./menu-animations";

export function MenuHeading() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : headingVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="relative mb-8 sm:mb-10 md:mb-12"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 lg:gap-8">
        
        {/* ── LEFT: "THE MENU." TITLE + WHISK + PINK CRAYON STROKE ── */}
        <div className="relative flex items-center gap-3 sm:gap-4">
          
          {/* Kitchen Whisk Doodle & Pink Accents */}
          <div className="hidden sm:block relative shrink-0 -rotate-12 pointer-events-none select-none">
            {/* Pink Accent Bursts */}
            <div className="absolute -top-3 -left-2 flex flex-col gap-0.5 opacity-80" aria-hidden="true">
              <span className="w-2.5 h-1 bg-[#F45B73] rounded-full rotate-45 inline-block" />
              <span className="w-3.5 h-1 bg-[#F45B73] rounded-full rotate-12 inline-block ml-1" />
              <span className="w-2 h-1 bg-[#F45B73] rounded-full -rotate-12 inline-block" />
            </div>
            <Image
              src="/images/menu-decor/handdrawn-whisk.svg"
              alt="Handdrawn kitchen whisk"
              width={54}
              height={108}
              className="w-10 sm:w-12 md:w-14 h-auto drop-shadow-sm"
              priority
            />
          </div>

          {/* Main Title Typography */}
          <div className="relative select-none text-center sm:text-left">
            <span className="block font-cherry text-2xl sm:text-3xl md:text-4xl text-[#3B2922] leading-none -rotate-3 ml-1 tracking-wider">
              THE
            </span>
            <div className="relative inline-flex items-baseline">
              <h2 className="font-cherry text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#3B2922] tracking-wide leading-none drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
                MENU.
              </h2>
              {/* Pink Heart Sticker sitting right next to the dot */}
              <div className="inline-block ml-1 sm:ml-2 -translate-y-2 sm:-translate-y-4">
                <Image
                  src="/images/menu-decor/heart-pink.svg"
                  alt="Pink heart sticker"
                  width={38}
                  height={36}
                  className="w-7 sm:w-9 md:w-10 h-auto rotate-12 drop-shadow-sm"
                />
              </div>
            </div>

            {/* Pink Crayon / Marker Brush Underline */}
            <div className="mt-1 sm:mt-1.5 h-2.5 sm:h-3.5 w-full bg-[#F45B73] rounded-full opacity-85 transform -rotate-1 shadow-sm" />
          </div>
        </div>

        {/* ── CENTER: TAPED RECIPE NOTE ("A little something for every craving. ♡") ── */}
        <div className="relative rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
          {/* Top Blue Washi Tape */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-xs">
            <Image
              src="/images/menu-decor/tape-blue.svg"
              alt="Blue washi tape"
              width={100}
              height={30}
              className="w-20 sm:w-24 h-auto -rotate-2"
            />
          </div>

          {/* Paper Note Box */}
          <div className="bg-[#FFFDF7] border-[2.5px] border-[#3B2922] shadow-[4px_4px_0px_#3B2922] rounded-xl sm:rounded-2xl px-5 sm:px-6 py-2.5 sm:py-3 max-w-xs sm:max-w-sm text-center">
            <p className="font-kalam font-bold text-base sm:text-lg md:text-xl text-[#3B2922] leading-tight">
              A little something for every craving. ♡
            </p>
          </div>
        </div>

        {/* ── RIGHT: PLOTTWIST BAKERY RUBBER STAMP & PINK TAPE ACCENT ── */}
        <div className="hidden lg:flex items-center gap-3 relative">
          {/* Pink Washi Tape Accent */}
          <div className="absolute -top-3 right-2 z-10 pointer-events-none">
            <Image
              src="/images/menu-decor/tape-pink.svg"
              alt="Pink washi tape"
              width={85}
              height={26}
              className="w-16 h-auto rotate-12"
            />
          </div>

          {/* Rubber Ink Stamp */}
          <div className="transform rotate-[3deg] hover:rotate-6 transition-transform duration-300 select-none">
            <Image
              src="/images/menu-decor/bakery-stamp.svg"
              alt="PlotTwist Bakery handmade rubber ink stamp"
              width={116}
              height={116}
              className="w-24 sm:w-28 h-auto drop-shadow-sm opacity-90"
            />
          </div>

          {/* Star Twinkle */}
          <div className="absolute -bottom-2 -left-3 pointer-events-none">
            <Image
              src="/images/menu-decor/star-yellow.svg"
              alt="Yellow star sticker"
              width={26}
              height={26}
              className="w-5 h-5 -rotate-6"
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

