"use client";

import React, { useState, useEffect } from "react";
import { MaskingTape } from "@/components/paper/MaskingTape";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("story");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Track active section based on scroll position
      const sections = ["story", "bakes", "gallery", "reviews"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`fixed top-3 left-3 right-3 md:top-5 md:left-6 md:right-6 z-50 transition-all duration-300 ${scrolled ? "top-2 md:top-3" : ""}`}>
      <div className={`max-w-7xl mx-auto bg-[#FAF4E8] border-[3px] border-[#3B2A22] rounded-2xl relative px-3 py-2 md:px-6 md:py-3 transition-all duration-300 flex items-center justify-between ${
        scrolled 
          ? "shadow-[9px_9px_0_rgba(59,42,34,0.28)] bg-[#FAF4E8]/95 backdrop-blur-sm py-2 md:py-2.5" 
          : "shadow-[7px_7px_0_rgba(59,42,34,0.2)]"
      }`}>
        
        {/* ========================================================================= */}
        {/* SCRAPBOOK COVER DECORATION: Corner Masking Tape & Top Stitched Thread */}
        {/* ========================================================================= */}
        <MaskingTape color="pink" width={58} height={20} rotate={-14} className="absolute -top-3.5 right-12 z-30 opacity-90 hidden sm:block" />
        
        {/* Top Stitched Thread Line Accent */}
        <svg className="absolute top-1 left-16 right-16 h-1 w-[calc(100%-8rem)] pointer-events-none opacity-35 hidden md:block" fill="none">
          <line x1="0" y1="2" x2="100%" y2="2" stroke="#3B2A22" strokeWidth="1.6" strokeDasharray="5 4" />
        </svg>

        {/* ========================================================================= */}
        {/* LEFT: EDITORIAL COVER LOGO, ENAMEL RIVETS & HANDWRITTEN METADATA */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3.5 relative z-20">
          
          {/* Scrapbook Enamel Binder Rivets (Replaces Browser Dots) */}
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            <div className="w-3 h-3 rounded-full border-[1.8px] border-[#3B2A22] bg-[#EF5B5B] shadow-inner relative flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
            </div>
            <div className="w-3 h-3 rounded-full border-[1.8px] border-[#3B2A22] bg-[#FFE066] shadow-inner relative flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
            </div>
            <div className="w-3 h-3 rounded-full border-[1.8px] border-[#3B2A22] bg-[#8FB3A1] shadow-inner relative flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/60 absolute top-0.5 left-0.5" />
            </div>
          </div>

          {/* Plotwist Editorial Journal Cover Logo */}
          <div 
            onClick={() => scrollToSection("story")} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            {/* Bakery Chef Hat Seal Icon */}
            <div className="w-8.5 h-8.5 rounded-lg bg-[#EF5B5B] border-2 border-[#3B2A22] flex items-center justify-center shadow-[2px_2px_0_#3B2A22] group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-4.5 h-4.5 text-[#F5EDDC]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 00-4.9 4A5 5 0 003 10a5 5 0 003 4.9V20a2 2 0 002 2h8a2 2 0 002-2v-5.1A5 5 0 0021 10a5 5 0 00-4.1-4A5 5 0 0012 2z" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-cherry font-bold text-[#3B2A22] leading-none tracking-wide">
                plotwist
              </span>
              <span className="font-fredoka text-[9px] font-bold text-[#3B2A22]/60 tracking-[0.22em] uppercase -mt-0.5 hidden lg:block">
                VOL. I • BAKERY JOURNAL
              </span>
            </div>

            {/* Handwritten Metadata Note */}
            <span className="font-fasthand text-xs text-[#3B2A22]/80 rotate-[-4deg] ml-1 hidden md:inline-block font-bold">
              Since 2024 ♡
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CENTER: UNIQUE RECIPE INDEX DIVIDER TABS (10/10 Handcrafted Font Pairing) */}
        {/* ========================================================================= */}
        <nav className="hidden md:flex items-center gap-3 relative z-20">
          
          {/* TAB 1: STORY (Fredoka Chunky Playful) */}
          <div className="relative group">
            <MaskingTape color="pink" width={34} height={14} rotate={-8} className="absolute -top-2 left-1 z-30 opacity-85 pointer-events-none" />
            <button
              onClick={() => scrollToSection("story")}
              className={`px-4.5 py-1.5 md:px-5 md:py-2 border-2 border-[#3B2A22] text-xs md:text-sm font-fredoka font-bold tracking-wider rounded-tl-xl rounded-tr-md transform rotate-[-1.8deg] transition-all duration-250 cursor-pointer relative z-10 ${
                activeTab === "story"
                  ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                  : "bg-[#EFE6CE] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[-2.4deg] hover:bg-[#F5EDDC]"
              }`}
            >
              <span>STORY</span>
              {activeTab === "story" && (
                <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                </svg>
              )}
            </button>
          </div>

          {/* TAB 2: BAKES (Cherry Bomb One Display) */}
          <div className="relative group">
            <MaskingTape color="yellow" width={36} height={14} rotate={10} className="absolute -top-2.5 right-1 z-30 opacity-85 pointer-events-none" />
            <button
              onClick={() => scrollToSection("bakes")}
              className={`px-5 py-2 md:px-6 md:py-2.5 border-2 border-[#3B2A22] text-xs md:text-sm font-cherry font-bold tracking-wider rounded-tl-md rounded-tr-xl transform rotate-[1.5deg] transition-all duration-250 cursor-pointer relative z-10 ${
                activeTab === "bakes"
                  ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                  : "bg-[#FAF4E8] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[2.2deg] hover:bg-[#FFE066]"
              }`}
            >
              <span>BAKES</span>
              {activeTab === "bakes" && (
                <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                </svg>
              )}
            </button>
          </div>

          {/* TAB 3: GALLERY (Fraunces Editorial Serif) */}
          <div className="relative group">
            <MaskingTape color="sage" width={32} height={14} rotate={-6} className="absolute -top-2 left-2 z-30 opacity-85 pointer-events-none" />
            <button
              onClick={() => scrollToSection("gallery")}
              className={`px-4 py-1.5 md:px-5 md:py-2 border-2 border-[#3B2A22] text-xs md:text-sm font-fraunces font-bold tracking-wider rounded-tl-lg rounded-tr-lg transform rotate-[-1.2deg] transition-all duration-250 cursor-pointer relative z-10 ${
                activeTab === "gallery"
                  ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                  : "bg-[#E3EFE9] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[-1.8deg] hover:bg-[#8FB3A1]/40"
              }`}
            >
              <span>GALLERY</span>
              {activeTab === "gallery" && (
                <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                </svg>
              )}
            </button>
          </div>

          {/* TAB 4: REVIEWS (Fasthand Cursive Handwriting) */}
          <div className="relative group">
            <MaskingTape color="cream" width={30} height={14} rotate={6} className="absolute -top-2 right-2 z-30 opacity-85 pointer-events-none" />
            <button
              onClick={() => scrollToSection("reviews")}
              className={`px-4.5 py-1.5 md:px-5 md:py-2 border-2 border-[#3B2A22] text-sm md:text-base font-fasthand font-bold tracking-wide rounded-tl-md rounded-tr-xl transform rotate-[2.2deg] transition-all duration-250 cursor-pointer relative z-10 ${
                activeTab === "reviews"
                  ? "bg-[#EF5B5B] text-white shadow-[5px_5px_0_#3B2A22] -translate-y-1.5 md:-translate-y-2"
                  : "bg-[#F7D6D6] text-[#3B2A22] shadow-[3px_3px_0_#3B2A22] hover:-translate-y-1 hover:shadow-[4.5px_4.5px_0_#3B2A22] hover:rotate-[2.8deg]"
              }`}
            >
              <span>REVIEWS</span>
              {activeTab === "reviews" && (
                <svg className="absolute -bottom-1 left-2 right-2 h-1.5 text-white/90" fill="none" viewBox="0 0 40 6">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M2 3 Q 20 1, 38 3" />
                </svg>
              )}
            </button>
          </div>

        </nav>

        {/* ========================================================================= */}
        {/* RIGHT: BAKERY APPROVAL INK STAMP BUTTON & METADATA */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 relative z-20">
          
          {/* Handwritten Page Number & Batch Metadata */}
          <div className="text-right hidden lg:block font-fasthand text-xs text-[#3B2A22]/80 rotate-[2deg]">
            <p className="font-bold">APPROVED ♡ • P. 01</p>
          </div>

          {/* Bakery Quality Approval Ink Stamp CTA Button */}
          <button
            onClick={() => scrollToSection("bakes")}
            aria-label="Order Bakes"
            className="w-12 h-12 md:w-13 md:h-13 bg-[#FFE066] border-[2.5px] border-dashed border-[#3B2A22] rounded-full shadow-[4px_4px_0_#3B2A22] flex flex-col items-center justify-center cursor-pointer transform hover:rotate-[8deg] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0_#3B2A22] active:scale-[0.96] transition-all duration-200 group relative z-20"
          >
            <span className="text-[8px] font-fredoka font-bold text-[#3B2A22] leading-none tracking-widest uppercase">
              ORDER
            </span>
            <svg className="w-3.5 h-3.5 text-[#3B2A22] mt-0.5 group-hover:translate-y-0.5 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>

        </div>

      </div>
    </header>
  );
}
