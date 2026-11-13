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
      viewport={{ once: true, margin: "-30px" }}
      className="relative mb-5 sm:mb-6 md:mb-7"
    >
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-3 sm:gap-4">
        
        {/* ── LEFT: COMPACT "THE MENU." TITLE + WHISK + PINK CRAYON STROKE ── */}
        <div className="relative flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Handdrawn Kitchen Whisk Doodle */}
          <div className="hidden sm:block relative shrink-0 -rotate-12 pointer-events-none select-none">
            <Image
              src="/images/menu-decor/handdrawn-whisk.svg"
              alt=""
              width={44}
              height={88}
              style={{ height: "auto" }}
              className="w-8 sm:w-9 md:w-10 h-auto drop-shadow-xs"
              priority
            />
          </div>

          {/* Main Title Block */}
          <div className="relative select-none text-center sm:text-left">
            {/* Small Monospace Risograph Eyebrow */}
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#715B4C] tracking-[0.25em] uppercase opacity-80">
                DAILY SCRAPBOOK MENU
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F45B73] inline-block" />
              <span className="font-mono text-[9px] sm:text-[10px] text-[#715B4C] tracking-wider uppercase opacity-70">
                SERIES 01
              </span>
            </div>

            <div className="relative inline-flex items-baseline">
              <span className="font-cherry text-xl sm:text-2xl md:text-3xl text-[#3B2922] leading-none -rotate-3 mr-1.5 tracking-wider">
                THE
              </span>
              <h2 className="font-cherry text-4xl sm:text-5xl md:text-6xl text-[#3B2922] tracking-wide leading-none drop-shadow-[2px_2px_0px_rgba(255,255,255,0.85)]">
                MENU.
              </h2>
              {/* Pink Heart Sticker */}
              <div className="inline-block ml-1 -translate-y-1 sm:-translate-y-2">
                <Image
                  src="/images/menu-decor/heart-pink.svg"
                  alt=""
                  width={30}
                  height={28}
                  style={{ width: "auto", height: "auto" }}
                  className="w-6 sm:w-7 rotate-12 drop-shadow-xs"
                />
              </div>
            </div>

            {/* Pink Crayon Marker Brush Underline */}
            <div className="h-2 sm:h-2.5 w-full bg-[#F45B73] rounded-full opacity-85 transform -rotate-0.5 shadow-xs -mt-0.5" />
          </div>
        </div>

        {/* ── CENTER / RIGHT: TAPED NOTE & RISOGRAPH STAMP ── */}
        <div className="flex items-center gap-3 relative">
          
          {/* Taped Recipe Note ("A little something for every craving. ♡") */}
          <div className="relative rotate-[-1.5deg] hover:rotate-0 transition-transform duration-200">
            {/* Blue Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-xs">
              <Image
                src="/images/menu-decor/tape-blue.svg"
                alt=""
                width={80}
                height={24}
                style={{ height: "auto" }}
                className="w-16 sm:w-20 h-auto -rotate-1"
              />
            </div>

            {/* Paper Note Box */}
            <div className="bg-[#FFFDF7] border-2 border-[#3B2922] shadow-[3px_3px_0px_#3B2922] rounded-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-center">
              <p className="font-kalam font-bold text-xs sm:text-sm text-[#3B2922] leading-tight">
                A little something for every craving. ♡
              </p>
            </div>
          </div>

          {/* Bakery Rubber Ink Stamp */}
          <div className="hidden lg:block transform rotate-[4deg] hover:rotate-8 transition-transform duration-300 select-none opacity-85 shrink-0">
            <Image
              src="/images/menu-decor/bakery-stamp.svg"
              alt="PlotTwist Bakery stamp"
              width={92}
              height={92}
              style={{ height: "auto" }}
              className="w-18 xl:w-20 h-auto drop-shadow-xs"
            />
          </div>

        </div>

      </div>
    </motion.div>
  );
}
