"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MaskingTape } from "@/components/paper/MaskingTape";

// Official Instagram profile link (Placeholder URL - replace with the actual Instagram username when needed)
const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/plottwist24x7?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==";

export const InstagramCTA: React.FC = () => {
  const [wiggle, setWiggle] = useState(false);

  // Playful subtle wiggle on button every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 800);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(INSTAGRAM_PROFILE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="instagram-cta"
      aria-label="Instagram Community Showcase"
      className="relative w-full bg-[#FFFDF8] py-24 sm:py-32 md:py-40 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden select-none"
    >
      {/* ─── TOP TORN PAPER EDGE TRANSITION ─── */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-30 pointer-events-none -translate-y-[1px]">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 md:h-16 fill-[#FFF8EE] filter drop-shadow-[0_4px_3px_rgba(59,42,34,0.12)]"
        >
          <path d="M0,0 L0,35 Q30,55 70,30 Q120,10 180,42 Q240,60 310,25 Q380,0 450,35 Q520,60 600,20 Q680,0 750,40 Q820,60 900,25 Q980,0 1060,35 Q1130,55 1200,20 L1200,0 Z" />
        </svg>

        {/* Masking Tape Accents on Top Torn Edge */}
        <MaskingTape color="kraft" width={64} height={18} rotate={-12} className="absolute top-1 left-[12%] z-40 opacity-90" />
        <MaskingTape color="pink" width={56} height={16} rotate={8} className="absolute top-2 right-[18%] z-40 opacity-90" />
      </div>

      {/* ─── MULTI-LAYER PAPER BACKGROUND DETAILS ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {/* Subtle Faded Watercolor Stains */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FFE3E3]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-[#E3F6EE]/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#FFF4CC]/50 rounded-full blur-3xl" />

        {/* Notebook Paper Grid Dots */}
        <svg className="absolute inset-0 w-full h-full opacity-15" width="100%" height="100%">
          <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#3B2A22" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>

        {/* Tiny Faint Coffee Stain SVG */}
        <svg className="absolute bottom-12 left-12 w-32 h-32 text-[#3B2A22] opacity-10" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="40" strokeWidth="2.5" strokeDasharray="6 4 12 2" />
          <circle cx="50" cy="50" r="35" strokeWidth="1" />
        </svg>
      </div>

      {/* ─── FLOATING SCRAPBOOK STICKERS & MICRO DECORATIONS (STRAWBERRIES 🍓 & DONUTS 🍩) ─── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Strawberry sticker 1 - Top Left */}
        <div className="absolute top-16 left-[6%] animate-paper-float opacity-90">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[2px_2px_0_#111111] transform -rotate-12 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 2 - Near Cake Left */}
        <div className="absolute top-[38%] left-[2%] animate-paper-wobble opacity-85">
          <span className="text-2xl sm:text-3xl filter drop-shadow-[2px_2px_0_#111111] transform rotate-12 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 3 - Center Top */}
        <div className="absolute top-16 left-[44%] animate-paper-float opacity-85 hidden md:block">
          <span className="text-2xl sm:text-3xl filter drop-shadow-[1.5px_1.5px_0_#111111] transform -rotate-6 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 4 - Top Right */}
        <div className="absolute top-20 right-[24%] animate-breathe opacity-90 hidden md:block">
          <span className="text-3xl filter drop-shadow-[2px_2px_0_#111111] transform rotate-15 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 5 - Beside Instagram Card */}
        <div className="absolute bottom-28 right-[4%] animate-paper-float opacity-90">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[2.5px_2.5px_0_#111111] transform rotate-6 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 6 - Lower Right */}
        <div className="absolute bottom-12 right-[10%] animate-paper-wobble opacity-85">
          <span className="text-2xl filter drop-shadow-[1.5px_1.5px_0_#111111] transform -rotate-12 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 7 - Lower Left */}
        <div className="absolute bottom-36 left-[8%] animate-breathe opacity-85">
          <span className="text-2xl sm:text-3xl filter drop-shadow-[2px_2px_0_#111111] transform rotate-6 inline-block">🍓</span>
        </div>

        {/* Strawberry sticker 8 - Beside Quote */}
        <div className="absolute top-[58%] left-[46%] animate-paper-float opacity-85 hidden lg:block">
          <span className="text-2xl filter drop-shadow-[1.5px_1.5px_0_#111111] transform -rotate-15 inline-block">🍓</span>
        </div>

        {/* Donut sticker 1 - Top Near Heading */}
        <div className="absolute top-14 left-[52%] animate-paper-wobble opacity-90 hidden lg:block">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[2px_2px_0_#111111] transform rotate-12 inline-block">🍩</span>
        </div>

        {/* Donut sticker 2 - Near Cake Right */}
        <div className="absolute top-[28%] left-[38%] animate-paper-float opacity-85 hidden md:block">
          <span className="text-3xl filter drop-shadow-[2px_2px_0_#111111] transform -rotate-12 inline-block">🍩</span>
        </div>

        {/* Donut sticker 3 - Beside CTA Button */}
        <div className="absolute bottom-[28%] left-[48%] animate-breathe opacity-90 hidden lg:block">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[2px_2px_0_#111111] transform rotate-8 inline-block">🍩</span>
        </div>

        {/* Donut sticker 4 - Lower Left Corner */}
        <div className="absolute bottom-16 left-[2%] animate-paper-float opacity-85">
          <span className="text-3xl filter drop-shadow-[2px_2px_0_#111111] transform -rotate-6 inline-block">🍩</span>
        </div>

        {/* Donut sticker 5 - Top Far Right */}
        <div className="absolute top-32 right-[4%] animate-paper-wobble opacity-90">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[2px_2px_0_#111111] transform rotate-12 inline-block">🍩</span>
        </div>

        {/* Cherry sticker */}
        <div className="absolute bottom-24 left-[4%] animate-paper-wobble opacity-85">
          <span className="text-3xl filter drop-shadow-[2px_2px_0_#111111]">🍒</span>
        </div>

        {/* Golden Star */}
        <div className="absolute top-28 right-[14%] animate-breathe opacity-90">
          <svg className="w-8 h-8 text-[#FFE066] fill-current filter drop-shadow-[1.5px_1.5px_0_#111111]" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        {/* Sparkle SVG */}
        <div className="absolute bottom-36 right-[12%] animate-paper-float opacity-80">
          <svg className="w-7 h-7 text-[#FF4FA3] fill-current" viewBox="0 0 24 24">
            <path d="M12 2l1.3 6.4L20 10l-6.7 1.6L12 18l-1.3-6.4L4 10l6.7-1.6L12 2z" />
          </svg>
        </div>

        {/* Puffy Cloud Emoji */}
        <div className="absolute top-1/2 left-[1%] animate-paper-float opacity-75 hidden xl:block">
          <span className="text-3xl">☁️</span>
        </div>

        {/* Pinned Ribbon Tape */}
        <div className="absolute top-36 left-[46%] animate-paper-wobble opacity-80 hidden lg:block">
          <span className="text-2xl">🎀</span>
        </div>
      </div>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="max-w-[1380px] mx-auto relative z-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-16 xl:gap-20">
          
          {/* ═════════════════════════════════════════════════════════
              LEFT SIDE (55% DESKTOP): DESSERT COMPOSITION & BLOBS
             ═════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[55%] shrink-0 flex items-center justify-center relative py-6">
            
            {/* Soft Background Color Blobs (Pink & Mint) */}
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#FFD1DC] rounded-full filter blur-xl opacity-70 animate-breathe pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-80 h-80 bg-[#C7E9E4] rounded-full filter blur-xl opacity-70 animate-paper-wobble pointer-events-none" />

            {/* Main Hand-Painted Yellow Organic Splash SVG */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg viewBox="0 0 500 500" className="w-[125%] h-[125%] max-w-[580px] fill-[#FAD02C] filter drop-shadow-[4px_6px_0_rgba(17,17,17,0.15)] transform -rotate-3">
                <path d="M 120 70 Q 240 10 380 60 Q 480 120 460 260 Q 440 400 320 460 Q 180 500 80 380 Q -10 260 40 160 Z" />
              </svg>
            </div>

            {/* Hand-Drawn SVG Doodles around Dessert */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Arrow pointing to dessert */}
              <svg className="absolute -top-2 right-12 w-16 h-16 text-[#111111] transform -rotate-12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 100 100">
                <path d="M 20 80 Q 50 20 80 50" strokeLinecap="round" />
                <path d="M 65 55 L 80 50 L 75 35" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Cherry Doodle */}
              <svg className="absolute bottom-4 left-6 w-12 h-12 text-[#FF4FA3] fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              {/* Swirl Doodle */}
              <svg className="absolute top-10 left-4 w-10 h-10 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10z" strokeLinecap="round" />
              </svg>
            </div>

            {/* Main Dessert Photo Cutout Card */}
            <div className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] h-[360px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden border-[5px] border-white bg-[#FAF4E8] shadow-[10px_10px_0_rgba(17,17,17,0.25)] transform -rotate-4 hover:rotate-0 transition-transform duration-500 ease-out group">
              <Image
                src="/images/baker-where/instagram_cta_dessert.jpg"
                alt="PlotTwist24x signature gourmet cake dessert"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Masking Tape on Dessert Photo */}
              <MaskingTape color="yellow" width={68} height={22} rotate={-10} className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 opacity-95" />

              {/* Handwritten Note Pin 1 (Small Handwritten Caption: Caveat 20px) */}
              <div className="absolute top-4 left-4 z-30 bg-[#FFF8EE] border-2 border-[#111111] shadow-[3px_3px_0_#111111] px-3 py-1 rounded-lg transform -rotate-6">
                <span className="font-caveat text-[20px] font-bold text-[#FF4FA3]">Baked today! ♡</span>
              </div>

              {/* Handwritten Note Pin 2 (Small Handwritten Caption: Caveat 20px) */}
              <div className="absolute bottom-4 right-4 z-30 bg-[#FFE066] border-2 border-[#111111] shadow-[3px_3px_0_#111111] px-3 py-1 rounded-lg transform rotate-3">
                <span className="font-caveat text-[20px] font-bold text-[#111111]">Yum! ✨</span>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT SIDE (45% DESKTOP): HEADINGS, CTA & POLAROID CARD
             ═════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[45%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left relative z-20">
            
            {/* Handwritten Accent: Fresh from our oven → */}
            <div className="flex items-center gap-2 mb-2 transform -rotate-5">
              <span className="font-fasthand text-2xl sm:text-3xl font-bold text-[#FF4FA3] tracking-wide">
                Fresh from our oven →
              </span>
            </div>

            {/* 1. Main Heading: Lilita One (ONE LAST: 84px, SWEET STOP...: 92px, Line Height 0.9, Letter Spacing -2px) */}
            <h2 className="font-lilita leading-[0.9] tracking-[-2px] mb-6 filter drop-shadow-[2px_2px_0_rgba(255,224,102,0.8)]" style={{ fontFamily: "var(--font-lilita-one), 'Lilita One', cursive, sans-serif" }}>
              <span className="text-[#111111] text-[52px] sm:text-[72px] lg:text-[84px] block" style={{ fontFamily: "var(--font-lilita-one), 'Lilita One', cursive, sans-serif" }}>ONE LAST</span>
              <span className="text-[#FF4FA3] text-[58px] sm:text-[80px] lg:text-[92px] block" style={{ fontFamily: "var(--font-lilita-one), 'Lilita One', cursive, sans-serif" }}>SWEET STOP...</span>
            </h2>

            {/* 2. Description: Caveat (Weight 500, Size 26px, Line Height 1.7, Letter Spacing 0.3px) */}
            <p className="font-caveat font-medium text-[22px] sm:text-[26px] text-[#444444] leading-[1.7] tracking-[0.3px] max-w-[480px] mb-6">
              Fresh bakes. Behind-the-scenes moments. New flavours. Tiny baking chaos. Follow us and never miss a sweet surprise.
            </p>

            {/* 3. Quote Strip: Pacifico (19px, Regular) */}
            <div className="w-full max-w-[390px] h-[52px] bg-[#FFF9F5] rounded-[16px] border-l-[6px] border-[#FF5DAE] shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-[22px] flex items-center mb-8">
              <p className="font-pacifico text-[19px] font-normal text-[#FF4FA3]">
                &ldquo;Every dessert has a story. Come watch ours.&rdquo;
              </p>
            </div>

            {/* CTA Button & Instagram Polaroid Card Container */}
            <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-10 w-full justify-center lg:justify-start">
              
              {/* 4 & 5. FOLLOW Button: Baloo 2 ExtraBold (800 weight, 46px FOLLOW, 24px Username) */}
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-[#FF4FA3] text-white border-[4px] border-[#111111] shadow-[8px_8px_0px_#111111] hover:shadow-[12px_12px_0px_#111111] hover:-translate-y-1.5 hover:rotate-[-2deg] hover:scale-[1.04] active:translate-y-0 active:shadow-[4px_4px_0px_#111111] px-7 py-4 rounded-[20px] uppercase flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer focus-visible:outline-none ${
                  wiggle ? "animate-wiggle" : ""
                }`}
                aria-label="Follow @PLOTTWIST24X on Instagram (opens in a new tab)"
              >
                <span className="leading-none text-left">
                  <span className="font-baloo font-extrabold text-[36px] sm:text-[46px] text-white block">FOLLOW</span>
                  <span className="font-baloo font-bold text-[18px] sm:text-[24px] text-[#FFE36A] block mt-1">@PLOTTWIST24X</span>
                </span>
                <div className="w-10 h-10 rounded-full bg-[#FFE066] border-2 border-[#111111] flex items-center justify-center text-[#111111] font-bold text-lg shrink-0 shadow-sm">
                  ↗
                </div>
              </a>

              {/* Instagram Polaroid Card Taped to Scrapbook */}
              <a 
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit @plottwist24x Instagram profile (opens in a new tab)"
                className="w-[280px] sm:w-[310px] bg-white border-[4px] border-[#111111] shadow-[8px_8px_0_#111111] rounded-2xl p-5 relative transform rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer group shrink-0 block"
              >
                {/* Top Masking Tape */}
                <MaskingTape color="pink" width={56} height={18} rotate={-8} className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 opacity-90" />

                {/* 6. Card Header: Instagram Username (Baloo 2 Bold 34px) */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#111111]/15 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFE066] via-[#FF4FA3] to-[#8A2399] p-0.5 shadow-sm">
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#FF4FA3]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-baloo font-bold text-[28px] sm:text-[34px] text-[#111111] block leading-tight">@plottwist24x</span>
                    <span className="font-fredoka text-[10px] font-bold text-[#FF4FA3] uppercase tracking-wider">Official Bakery Studio</span>
                  </div>
                </div>

                {/* 7. Small Tags Grid: Baloo 2 SemiBold (600 weight, 18px) */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-left font-baloo font-semibold text-[15px] sm:text-[18px] text-[#111111]">
                  <div className="bg-[#FAF4E8] border border-[#111111]/20 p-2 rounded-lg flex items-center gap-1.5">
                    <span>🍰</span>
                    <span>Daily Bakes</span>
                  </div>
                  <div className="bg-[#FAF4E8] border border-[#111111]/20 p-2 rounded-lg flex items-center gap-1.5">
                    <span>☕</span>
                    <span>BTS Moments</span>
                  </div>
                  <div className="bg-[#FAF4E8] border border-[#111111]/20 p-2 rounded-lg flex items-center gap-1.5">
                    <span>🍓</span>
                    <span>Fresh Menu</span>
                  </div>
                  <div className="bg-[#FAF4E8] border border-[#111111]/20 p-2 rounded-lg flex items-center gap-1.5">
                    <span>✨</span>
                    <span>Specials</span>
                  </div>
                </div>

                {/* Bottom Small Follow Button */}
                <div className="w-full bg-[#FF4FA3] text-white border-2 border-[#111111] shadow-[3px_3px_0_#111111] py-2 rounded-full font-baloo font-bold text-xs uppercase tracking-wider text-center group-hover:bg-[#FFE066] group-hover:text-[#111111] transition-colors duration-300">
                  Follow on Instagram ↗
                </div>
              </a>

            </div>

          </div>

        </div>
      </div>

      {/* ─── BOTTOM TORN PAPER EDGE TRANSITION TO FOOTER ─── */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-30 pointer-events-none translate-y-[1px]">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 md:h-16 fill-[#E6DCB8] filter drop-shadow-[0_-4px_3px_rgba(59,42,34,0.12)]"
        >
          <path d="M0,60 L0,25 Q40,5 90,35 Q150,55 220,20 Q300,-5 380,35 Q450,60 540,25 Q620,-5 700,35 Q780,60 860,20 Q940,-5 1020,30 Q1100,55 1200,25 L1200,60 Z" />
        </svg>

        {/* Masking Tape Accent on Bottom Edge */}
        <MaskingTape color="yellow" width={60} height={18} rotate={-6} className="absolute bottom-1 left-[20%] z-40 opacity-90" />
      </div>
    </section>
  );
};

export default InstagramCTA;
