"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ctaBarVariants } from "./menu-animations";

export function MenuOrderCTA() {
  const shouldReduceMotion = useReducedMotion();

  // Verified WhatsApp order URL
  const whatsappUrl =
    "https://wa.me/918008922410?text=Hi%20PlotTwist%2C%20I%20would%20like%20to%20order%20some%20treats%21";

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : ctaBarVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className="relative mt-6 sm:mt-7 md:mt-8 max-w-4xl mx-auto"
    >
      {/* ── TOP WASHI TAPE (Pink Tactile Tape pinning the CTA card) ── */}
      <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-xs select-none">
        <Image
          src="/images/menu-decor/tape-pink.svg"
          alt=""
          width={110}
          height={32}
          className="w-22 sm:w-26 h-auto rotate-1"
        />
      </div>

      {/* ── LAYERED CAKE SLICE ON PLATE (Small Supporting Cake Illustration) ── */}
      <div
        className="hidden md:block absolute -top-8 -right-4 lg:-right-6 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-tiramisu-slice.svg"
          alt="Layered tiramisu cake on plate"
          width={90}
          height={60}
          className="w-16 lg:w-18 h-auto rotate-3 drop-shadow-xs"
        />
      </div>

      {/* ── MAIN CREAM CARD CONTAINER (Tactile Scrapbook Finishing Panel) ── */}
      <div className="bg-[#FFFDF7] border-[2.5px] border-[#3B2922] shadow-[5px_5px_0px_#3B2922] rounded-2xl p-4 sm:p-5 md:px-7 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#3B2922] relative overflow-visible">
        
        {/* Left: Heading and Supporting Sentence + Subtle Heart */}
        <div className="text-center sm:text-left relative">
          <div className="inline-flex items-center gap-1.5 justify-center sm:justify-start">
            <h3 className="font-bricolage font-black text-base sm:text-lg md:text-xl text-[#3B2922] tracking-wide leading-tight">
              FOUND YOUR FAVOURITE?
            </h3>
            {/* Subtle Heart Sticker */}
            <Image
              src="/images/menu-decor/heart-pink.svg"
              alt=""
              width={20}
              height={18}
              className="w-3.5 sm:w-4 h-auto rotate-12 inline-block -translate-y-0.5"
            />
          </div>
          <p className="font-dmsans text-[11px] sm:text-xs md:text-[13px] text-[#5F4A3A] mt-0.5 font-normal leading-relaxed">
            Your next dessert obsession is just one message away.
          </p>
        </div>

        {/* Center: Deliberate Supporting Freshness Rubber Ink Stamp */}
        <div
          className="hidden lg:flex items-center justify-center shrink-0 pointer-events-none select-none opacity-85 rotate-[-6deg]"
          aria-hidden="true"
        >
          <Image
            src="/images/menu-decor/freshly-made-badge.svg"
            alt="Freshly made seal"
            width={72}
            height={72}
            className="w-14 xl:w-16 h-auto drop-shadow-xs hover:rotate-0 transition-transform duration-300"
          />
        </div>

        {/* Right: Blue Pill Action Button */}
        <div className="shrink-0 w-full sm:w-auto text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order your treats via WhatsApp"
            className="group inline-flex items-center justify-center gap-2.5 bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-space font-bold text-xs sm:text-sm tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-[#3B2922] shadow-[2.5px_2.5px_0px_#3B2922] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#3B2922] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#3B2922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 transition-all duration-200"
          >
            <span>ORDER YOUR TREATS</span>
            {/* Yellow Circle with Interactive Right Arrow */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFE066] border-[1.5px] border-[#3B2922] flex items-center justify-center text-[#3B2922] shadow-[1px_1px_0px_#3B2922] group-hover:scale-105 group-hover:rotate-6 group-hover:translate-x-0.5 transition-all duration-200">
              <ArrowRight className="w-3 h-3 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>
        </div>

      </div>

      {/* ── BOTTOM LEFT FLOWER STICKER ── */}
      <div
        className="absolute -bottom-2.5 -left-2.5 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-yellow.svg"
          alt=""
          width={32}
          height={32}
          style={{ height: "auto" }}
          className="w-7 h-auto rotate-12 drop-shadow-xs"
        />
      </div>
    </motion.div>
  );
}
