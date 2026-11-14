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
      {/* ── TOP WASHI TAPE (Pink Tape pinning the CTA card) ── */}
      <div className="absolute -top-3 sm:-top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-xs">
        <Image
          src="/images/menu-decor/tape-pink.svg"
          alt=""
          width={96}
          height={28}
          className="w-20 sm:w-24 h-auto rotate-1"
        />
      </div>

      {/* ── CAKE SLICE & STRAWBERRY TART DOODLES (Right Decorative Asset Cluster) ── */}
      <div
        className="hidden md:flex items-center gap-1.5 absolute -top-7 -right-6 lg:-right-8 z-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/menu-decor/doodle-strawberry-tart.svg"
          alt=""
          width={55}
          height={50}
          className="w-10 lg:w-11 h-auto -rotate-12 drop-shadow-xs"
        />
        <Image
          src="/images/menu-decor/doodle-cake.svg"
          alt=""
          width={64}
          height={64}
          className="w-13 lg:w-15 h-auto rotate-6 drop-shadow-xs"
        />
      </div>

      {/* ── MAIN CREAM CARD CONTAINER (Compact Padding & Height) ── */}
      <div className="bg-[#FFFDF7] border-[2.5px] border-[#3B2922] shadow-[5px_5px_0px_#3B2922] rounded-2xl p-3.5 sm:p-4 md:px-6 md:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-transform duration-200">
        
        {/* Left: Heading and Subtitle */}
        <div className="text-center sm:text-left">
          <h3 className="font-bricolage font-black text-base sm:text-lg md:text-xl text-[#3B2922] tracking-wide leading-tight">
            FOUND YOUR FAVOURITE?
          </h3>
          <p className="font-dmsans text-[11px] sm:text-xs md:text-[13px] text-[#5F4A3A] mt-0.5 font-normal leading-relaxed">
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
            className="group inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white font-space font-bold text-xs sm:text-sm tracking-wider px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-[#3B2922] shadow-[2.5px_2.5px_0px_#3B2922] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#3B2922] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#3B2922] transition-all duration-200"
          >
            <span>ORDER YOUR TREATS</span>
            {/* Yellow Circle with Right Arrow */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFE066] border-[1.5px] border-[#3B2922] flex items-center justify-center text-[#3B2922] shadow-[1px_1px_0px_#3B2922] group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
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
