"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MaskingTape } from "@/components/paper/MaskingTape";

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3E2A24"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3E2A24"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="#FFD46B"
    stroke="#3E2A24"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M4 11h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a1 1 0 0 1 1-1Z" />
    <path d="M12 2C9.5 2 7.5 5 7.5 8h9C16.5 5 14.5 2 12 2Z" fill="#FF4FA3" />
    <circle cx="12" cy="2" r="1.5" fill="#FFE26E" />
  </svg>
);

export default function Footer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const footerRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      role="contentinfo"
      aria-label="PlotTwist Bakery Scrapbook Footer"
      className="relative w-full bg-[#FFF6E8] text-[#3E2A24] pt-[120px] pb-[80px] px-6 sm:px-12 lg:px-20 min-h-[720px] border-t-[4px] border-[#3E2A24] overflow-hidden select-none"
    >
      {/* ─── BACKGROUND ORGANIC BLOBS & PAPER DOTS (rgba(150,120,80,.08)) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft Organic Warm Blobs (#FFECC8 & #FFD46B) */}
        <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-[#FFECC8]/60 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-[#FFD46B]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#FFFBF7]/80 rounded-full blur-2xl" />

        {/* Tiny Paper Dot Texture */}
        <svg className="absolute inset-0 w-full h-full opacity-60" width="100%" height="100%">
          <pattern id="footer-paper-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.4" fill="rgba(150,120,80,0.12)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footer-paper-dots)" />
        </svg>

        {/* Faint Bakery Coffee Stain */}
        <svg className="absolute bottom-20 left-16 w-36 h-36 text-[#3E2A24] opacity-[0.04]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="42" strokeWidth="2" strokeDasharray="6 3 12 2" />
          <circle cx="50" cy="50" r="36" strokeWidth="1" />
        </svg>
      </div>

      {/* ─── SCRAPBOOK STICKERS & DECORATIONS (12 Strawberries, 18 Hearts, 10 Stars, 14 Sparkles, 6 Cherries, 5 Bows) ─── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* 12 STRAWBERRIES 🍓 */}
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-16 left-[5%] text-[24px]">🍓</motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[40%] left-[2%] text-[18px]">🍓</motion.div>
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] left-[46%] text-[16px] hidden md:block">🍓</motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute top-16 right-[22%] text-[20px]">🍓</motion.div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} className="absolute bottom-28 right-[5%] text-[24px]">🍓</motion.div>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-16 right-[14%] text-[14px]">🍓</motion.div>

        {/* 18 HEARTS 💕 / ❤️ */}
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-24 right-[12%] text-[22px]">❤️</motion.div>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="absolute bottom-[35%] right-[20%] text-[#FF4FA3] text-[18px]">💕</motion.div>
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} className="absolute top-[52%] left-[44%] text-[#FF7DB8] text-[16px] hidden md:block">♡</motion.div>

        {/* 10 STARS ⭐ (#FFD54A) */}
        <motion.div animate={{ y: [0, -4, 0], rotate: [0, 15, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-[7%] text-[#FFD54A] text-[22px]">⭐</motion.div>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} className="absolute bottom-24 left-[8%] text-[#FFD54A] text-[18px]">⭐</motion.div>

        {/* 6 CHERRIES 🍒 */}
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute bottom-24 left-[3%] text-[22px]">🍒</motion.div>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} className="absolute top-36 right-[35%] text-[20px] hidden md:block">🍒</motion.div>

        {/* 5 BABY PINK BOWS 🎀 */}
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute top-28 left-[42%] text-[22px] hidden md:block">🎀</motion.div>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 1.3 }} className="absolute bottom-32 right-[28%] text-[20px] hidden lg:block">🎀</motion.div>

        {/* 14 SPARKLES ✨ */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-32 right-[18%] text-[#FF8DBE] opacity-60 text-[20px]">✨</motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} className="absolute bottom-28 left-[12%] text-[#FF8DBE] opacity-60 text-[18px]">✨</motion.div>
      </div>

      {/* ─── INNER MAIN CONTAINER (MAX WIDTH 1400PX, 120PX GAP DESKTOP 50/50 LAYOUT) ─── */}
      <div className="max-w-[1400px] mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[120px] items-center">
          
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN (50% DESKTOP): LOGO -> HEADING -> DESCRIPTION -> BUTTONS
             ═════════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* 1. Small Label / Logo */}
            <motion.div 
              whileHover={{ rotate: 2 }}
              className="flex items-center gap-3 mb-6 cursor-pointer"
            >
              <LogoIcon />
              <span className="font-bricolage font-bold text-[18px] text-[#3E2A24] uppercase tracking-[1px]">
                PlotTwist24x Bakery
              </span>
            </motion.div>

            {/* 2. Main Heading: Bowlby One (72px Desktop / 56px Tablet / 44px Mobile, Color #3E2A24, Line Height 0.92, Letter Spacing -1px) */}
            <motion.h2
              whileHover={{ rotate: 2 }}
              transition={{ duration: 0.2 }}
              className="font-bowlby font-normal text-[44px] sm:text-[56px] lg:text-[72px] text-[#3E2A24] leading-[0.92] tracking-[-1px] mb-6 max-w-xl"
              style={{ fontFamily: "var(--font-bowlby-one), 'Bowlby One', 'Titan One', cursive, sans-serif" }}
            >
              TASTE THE LOVE IN EVERY BITE
            </motion.h2>

            {/* 3. Short Description: Kalam (24px, Max Width 520px, Color #5F4A3A) */}
            <p className="font-kalam text-[20px] sm:text-[24px] text-[#5F4A3A] leading-[1.6] max-w-[520px] mb-8 font-normal">
              Freshly baked joy, handmade desserts and sweet memories—crafted with love for every celebration.
            </p>

            {/* 4. Contact Buttons (Background #FFFDF8, Border 4px solid #3E2A24, Radius 999px, Height 74px, Padding 32px, Shadow 6px 6px 0 #3E2A24) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              
              {/* Phone Button */}
              <a
                href="tel:+3727121070"
                onClick={preventDefault}
                className="h-[74px] bg-[#FFFDF8] text-[#3E2A24] border-[4px] border-[#3E2A24] shadow-[6px_6px_0px_#3E2A24] hover:shadow-[10px_10px_0px_#3E2A24] hover:-translate-y-[6px] hover:rotate-[-1deg] active:translate-y-0 active:shadow-[3px_3px_0px_#3E2A24] px-8 rounded-full font-bricolage font-semibold text-[22px] flex items-center gap-3 transition-all duration-300 cursor-pointer focus-visible:outline-none"
                aria-label="Call PlotTwist Bakery"
              >
                <div className="w-11 h-11 rounded-full bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center shrink-0 shadow-sm">
                  <PhoneIcon />
                </div>
                <span>+372 712 10 70</span>
              </a>

              {/* Email Button */}
              <a
                href="mailto:hello@plotwist.co"
                onClick={preventDefault}
                className="h-[74px] bg-[#FFFDF8] text-[#3E2A24] border-[4px] border-[#3E2A24] shadow-[6px_6px_0px_#3E2A24] hover:shadow-[10px_10px_0px_#3E2A24] hover:-translate-y-[6px] hover:rotate-[1deg] active:translate-y-0 active:shadow-[3px_3px_0px_#3E2A24] px-8 rounded-full font-bricolage font-semibold text-[22px] flex items-center gap-3 transition-all duration-300 cursor-pointer focus-visible:outline-none"
                aria-label="Email PlotTwist Bakery"
              >
                <div className="w-11 h-11 rounded-full bg-[#FFE26E] border-2 border-[#3E2A24] flex items-center justify-center shrink-0 shadow-sm">
                  <MailIcon />
                </div>
                <span>hello@plotwist.co</span>
              </a>

            </div>

            {/* Copyright & Bakery Stamp Note */}
            <p className="font-kalam text-[18px] sm:text-[20px] text-[#6E5446]">
              © {new Date().getFullYear()} PlotTwist24x Bakery. All rights reserved. ♡
            </p>

          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN (50% DESKTOP): INTERACTIVE BAKERY SCRAPBOOK COMPOSITION
             ═════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-center relative py-6">
            
            {/* Interactive Scrapbook Notebook Canvas with Parallax Tilt */}
            <motion.div
              style={{ x: mousePos.x * 12, y: mousePos.y * 12 }}
              className="relative w-full max-w-[480px] sm:max-w-[520px] aspect-square rounded-[36px] bg-[#FFFBF7] border-[4px] border-[#3E2A24] shadow-[12px_12px_0px_rgba(62,42,36,0.20)] p-6 sm:p-8 flex flex-col items-center justify-center text-center transform hover:rotate-1 transition-transform duration-500 group"
            >
              {/* Masking Tape Accents on Notebook Card */}
              <MaskingTape color="pink" width={76} height={24} rotate={-10} className="absolute -top-4 left-8 z-30 opacity-95" />
              <MaskingTape color="yellow" width={70} height={22} rotate={8} className="absolute -bottom-4 right-10 z-30 opacity-95" />

              {/* Recipe Paper Grid Inside Card */}
              <svg className="absolute inset-0 w-full h-full rounded-[32px] opacity-10 pointer-events-none" width="100%" height="100%">
                <pattern id="card-recipe-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3E2A24" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#card-recipe-grid)" />
              </svg>

              {/* Hand-Drawn Arrow Doodle */}
              <svg className="absolute -top-4 -right-4 w-20 h-20 text-[#3E2A24] transform rotate-12 pointer-events-none hidden sm:block" fill="none" stroke="#3E2A24" strokeWidth="2.5" strokeDasharray="5 3" viewBox="0 0 100 100">
                <path d="M 15 85 Q 50 15 85 45" strokeLinecap="round" />
                <path d="M 70 50 L 85 45 L 80 30" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Central Bakery Cartoon Composition (Cake, Cupcakes, Cookies) */}
              <div className="relative z-10 flex flex-col items-center">
                
                {/* Bakery Stamp Sticker */}
                <div className="bg-[#FFE26E] border-2 border-[#3E2A24] shadow-[3px_3px_0_#3E2A24] px-4 py-1 rounded-full transform -rotate-4 mb-4">
                  <span className="font-bricolage text-xs font-extrabold uppercase tracking-wider text-[#3E2A24]">
                    Handcrafted Daily • 100% Organic
                  </span>
                </div>

                {/* Main Treat Illustration Stack */}
                <div className="text-[90px] sm:text-[110px] leading-none filter drop-shadow-[4px_6px_0_rgba(62,42,36,0.18)] transform group-hover:scale-105 transition-transform duration-500">
                  🎂
                </div>

                {/* Surrounding Treat Pins (Cupcakes 🧁, Cookies 🍪, Cake 🍰) */}
                <div className="flex items-center gap-3 mt-4 font-kalam text-lg font-bold text-[#3E2A24]">
                  <span className="bg-[#FFF6E8] border border-[#3E2A24] px-3 py-1 rounded-xl shadow-sm transform -rotate-3">🧁 Cupcakes</span>
                  <span className="bg-[#FFF6E8] border border-[#3E2A24] px-3 py-1 rounded-xl shadow-sm transform rotate-3">🍪 Cookies</span>
                  <span className="bg-[#FFF6E8] border border-[#3E2A24] px-3 py-1 rounded-xl shadow-sm transform -rotate-2">🍰 Bakes</span>
                </div>

                {/* Postage Sticker Note */}
                <div className="mt-5 bg-[#FFECC8] border border-[#3E2A24]/30 px-4 py-1.5 rounded-lg transform rotate-2">
                  <span className="font-kalam text-sm text-[#5F4A3A]">
                    Visit us @ PlotTwist Studio ✨
                  </span>
                </div>

              </div>

            </motion.div>

          </div>

        </div>

        {/* ─── HAND-DRAWN CHOCOLATE BROWN BRUSH STROKE DIVIDER (3px, 60% Opacity) ─── */}
        <div className="w-full my-12 opacity-60">
          <svg className="w-full h-[6px]" preserveAspectRatio="none" viewBox="0 0 1200 6">
            <path d="M 0 3 Q 300 1 600 4 T 1200 2" stroke="#3E2A24" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* ─── BOTTOM AREA: Made slowly with love ♡ & Back to Top ↑ ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-bricolage text-[18px] font-semibold text-[#3E2A24]">
          
          {/* Left: Made slowly, with love ♡ (Pacifico 26px) */}
          <div className="font-pacifico text-[26px] text-[#3E2A24] flex items-center gap-2 transform -rotate-1">
            <span>Made slowly, with love ♡</span>
          </div>

          {/* Right: Back to Top ↑ (Bricolage Grotesque 18px 600 weight) */}
          <motion.button
            whileHover={{ y: -4 }}
            onClick={handleScrollToTop}
            className="font-bricolage font-semibold text-[18px] text-[#3E2A24] hover:text-[#FF4FA3] flex items-center gap-2 cursor-pointer focus-visible:outline-none group transition-colors duration-200"
          >
            <span>Back to Top</span>
            <span className="inline-block transform group-hover:rotate-[15deg] group-hover:-translate-y-1 transition-transform duration-300">
              ↑
            </span>
          </motion.button>

        </div>

      </div>
    </footer>
  );
}
