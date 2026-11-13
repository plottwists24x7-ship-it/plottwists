"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ctaBarVariants } from "./menu-animations";

export function MenuOrderCTA() {
  const shouldReduceMotion = useReducedMotion();

  // WhatsApp order link with pre-filled message
  const whatsappUrl =
    "https://wa.me/918008922410?text=Hi%20PlotTwist%2C%20I%20would%20like%20to%20order%20some%20treats%21";

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : ctaBarVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="relative mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto"
    >
      {/* ── TOP WASHI TAPE (Pink Tape pinning the CTA card) ── */}
      <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-xs">
        <Image
          src="/images/menu-decor/tape-pink.svg"
          alt="Pink washi tape"
          width={110}
          height={32}
          className="w-24 sm:w-28 h-auto rotate-1"
        />
      </div>

      {/* ── CAKE SLICE DOODLE (Right Decorative Asset) ── */}
      <div
        className="hidden md:block absolute -top-8 -right-8 lg:-right-12 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-cake.svg"
          alt="Cake slice doodle with cherry"
          width={76}
          height={76}
          className="w-16 lg:w-20 h-auto rotate-6 drop-shadow-sm"
        />
      </div>

      {/* ── MAIN CREAM CARD CONTAINER ── */}
      <div className="bg-[#FFFDF7] border-[3.5px] border-[#3B2922] shadow-[6px_7px_0px_#3B2922] md:shadow-[8px_9px_0px_#3B2922] rounded-2xl md:rounded-3xl p-5 sm:p-6 md:px-8 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-5 transition-transform duration-200">
        
        {/* Left: Heading and Subtitle */}
        <div className="text-center sm:text-left">
          <h3 className="font-cherry text-xl sm:text-2xl md:text-3xl text-[#3B2922] tracking-wide leading-tight">
            FOUND YOUR FAVOURITE?
          </h3>
          <p className="font-fredoka text-xs sm:text-sm md:text-base text-[#5F4A3A] mt-1 font-normal leading-relaxed">
            Your next dessert obsession is just one message away.
          </p>
        </div>

        {/* Right: Blue Pill Action Button */}
        <div className="shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order your treats via WhatsApp"
            className="group inline-flex items-center gap-2.5 sm:gap-3 bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-fredoka font-bold text-sm sm:text-base md:text-[17px] tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border-[2.5px] border-[#3B2922] shadow-[3.5px_3.5px_0px_#3B2922] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#3B2922] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#3B2922] transition-all duration-200"
          >
            <span>ORDER YOUR TREATS</span>
            {/* Yellow Circle with Right Arrow */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFE066] border-2 border-[#3B2922] flex items-center justify-center text-[#3B2922] shadow-[1px_1px_0px_#3B2922] group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>
          </a>
        </div>

      </div>

      {/* ── BOTTOM LEFT FLOWER STICKER ── */}
      <div
        className="absolute -bottom-3.5 -left-3.5 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/flower-pink.svg"
          alt="Pink flower sticker"
          width={40}
          height={40}
          className="w-8 sm:w-9 h-auto rotate-12 drop-shadow-xs"
        />
      </div>
    </motion.div>
  );
}

