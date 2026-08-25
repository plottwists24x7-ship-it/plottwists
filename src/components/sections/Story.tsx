"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdmin } from "@/context/AdminContext";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const { storyImages } = useAdmin();
  const containerRef = useRef<HTMLDivElement>(null);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  
  const headingBoxRef = useRef<HTMLDivElement>(null);
  const headlinePart1Ref = useRef<HTMLSpanElement>(null);
  const madeWithLoveRef = useRef<HTMLDivElement>(null);
  const bakesRef = useRef<HTMLDivElement>(null);
  const descTextRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  
  const splatRef = useRef<HTMLDivElement>(null);
  const muffinRef = useRef<HTMLDivElement>(null);
  
  // Polaroid accessories refs
  const chefsPickRef = useRef<HTMLDivElement>(null);
  const bakedTodayRef = useRef<HTMLDivElement>(null);
  const handmadeStampRef = useRef<HTMLDivElement>(null);
  const todaysBatchRef = useRef<HTMLDivElement>(null);
  const bakedWithCareRef = useRef<HTMLDivElement>(null);

  // Cookie background refs
  const topCookieRef = useRef<HTMLDivElement>(null);
  const bottomCookieRef = useRef<HTMLDivElement>(null);
  const rightFragmentRef = useRef<HTMLDivElement>(null);
  const crumbsRef = useRef<HTMLDivElement>(null);
  const topNotesRef = useRef<HTMLDivElement>(null);

  // 3D Polaroid Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });

  const handlePolaroidMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12, isHovered: true });
  };

  const handlePolaroidMouseLeave = () => {
    setTilt({ x: 0, y: 0, isHovered: false });
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(revealContainerRef.current, { "--reveal-pct": "115%" });
        gsap.set(
          [
            topNotesRef.current ? Array.from(topNotesRef.current.children) : [],
            headingBoxRef.current,
            headlinePart1Ref.current,
            madeWithLoveRef.current,
            bakesRef.current ? Array.from(bakesRef.current.children) : [],
            descTextRef.current,
            ctaButtonRef.current,
            muffinRef.current,
            todaysBatchRef.current,
            handmadeStampRef.current,
            chefsPickRef.current,
            bakedTodayRef.current,
            bakedWithCareRef.current,
            topCookieRef.current,
            bottomCookieRef.current,
            rightFragmentRef.current,
            crumbsRef.current
          ],
          { autoAlpha: 1, scale: 1, y: 0, x: 0, rotation: 0 }
        );
        return;
      }

      // Initial States: GPU-accelerated transforms & power3.out easing (NO BOUNCE)
      gsap.set(revealContainerRef.current, { "--reveal-pct": "-15%", autoAlpha: 0, y: 24, scale: 0.985 });
      
      // SCROLLTRIGGER ENTRANCE INITIAL STATES
      gsap.set(topNotesRef.current ? Array.from(topNotesRef.current.children) : [], { autoAlpha: 0, y: -20, scale: 0.96 }); // 2 Top labels
      gsap.set(headlinePart1Ref.current, { autoAlpha: 0, y: 40, scale: 0.96, rotation: -2 }); // 3 PLOTTWIST24X7
      gsap.set(madeWithLoveRef.current, { autoAlpha: 0, y: 30, scale: 0.94, rotation: -4 }); // 4 made with love
      
      if (bakesRef.current) {
        gsap.set(Array.from(bakesRef.current.children), { autoAlpha: 0, y: 40, scale: 0.96 }); // 5 Badges
      }

      gsap.set(descTextRef.current, { autoAlpha: 0, y: 40, scale: 0.96, rotation: -1 }); // 6 Recipe Card
      gsap.set(ctaButtonRef.current, { autoAlpha: 0, y: 40, scale: 0.96, x: -10 }); // 7 CTA Button
      gsap.set(muffinRef.current, { autoAlpha: 0, y: 40, scale: 0.96, rotation: -2 }); // 8 Polaroid
      gsap.set(todaysBatchRef.current, { autoAlpha: 0, y: 40, scale: 0.96, rotation: 3 }); // 9 Today's Batch
      gsap.set(handmadeStampRef.current, { autoAlpha: 0, y: 40, scale: 0.96, rotation: 12 }); // 10 Handmade Stamp

      gsap.set([bottomCookieRef.current], { autoAlpha: 0, scale: 0.96 });
      gsap.set([topCookieRef.current, rightFragmentRef.current], { autoAlpha: 0, scale: 0.92 });
      gsap.set([crumbsRef.current], { autoAlpha: 0 });

      if (underlineRef.current) {
        gsap.set(underlineRef.current, { strokeDashoffset: 100, strokeDasharray: 100 });
      }

      // Single Coordinated Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 20%",
          scrub: 0.8,
        },
      });

      // Canvas & Background Reveal
      tl.to(revealContainerRef.current, {
        "--reveal-pct": "115%",
        autoAlpha: 1,
        y: 0,
        scale: 1,
        ease: "power3.out",
        duration: 1.1,
      }, 0)
      .to(bottomCookieRef.current, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 0.2)
      .to([topCookieRef.current, rightFragmentRef.current], { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.3)
      .to(crumbsRef.current, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.4);

      // ENTRANCE SEQUENCE
      const startTime = 0.35;
      const stepStagger = 0.08;

      // 1 & 2. Top labels
      tl.to(topNotesRef.current ? Array.from(topNotesRef.current.children) : [], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out"
      }, startTime);

      // 3. PLOTTWIST24X7
      tl.to(headlinePart1Ref.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 2);

      // 4. made with love
      tl.to(madeWithLoveRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: -2,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 3);

      // Underline stroke draw
      if (underlineRef.current) {
        tl.to(underlineRef.current, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, startTime + stepStagger * 4.5);
      }

      // 6. Badges
      tl.to(bakesRef.current ? Array.from(bakesRef.current.children) : [], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out"
      }, startTime + stepStagger * 5);

      // 7. Recipe Card
      tl.to(descTextRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: -1,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 6);

      // 8. CTA Button
      tl.to(ctaButtonRef.current, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 7);

      // 9. Polaroid
      tl.to(muffinRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 8);

      // 10. Today's Batch
      tl.to(todaysBatchRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 3,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 9);

      // 11. Handmade Stamp
      tl.to(handmadeStampRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 12,
        duration: 0.9,
        ease: "power3.out"
      }, startTime + stepStagger * 10);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToBakes = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("bakes");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#F6EEDB] text-[#3E332B] px-[clamp(1.5rem,5vw,5rem)] py-[clamp(3.5rem,7vh,5.5rem)] overflow-hidden scroll-mt-20 flex items-center justify-center border-t-4 border-b-4 border-[#3D2E25]"
    >
      {/* 2% ANIMATED SUBTLE NOISE GRAIN OVERLAY ACROSS ENTIRE HERO */}
      <div className="absolute inset-0 z-[20] pointer-events-none opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] animate-grain" />

      {/* ========================================================================= */}
      {/* 1. ASYMMETRICAL EDITORIAL SIDE MARGIN COMPOSITIONS (5-15% PRINT OPACITY) */}
      {/* ========================================================================= */}
      
      {/* ========================================================================= */}
      {/* 1. ASYMMETRICAL EDITORIAL SIDE MARGIN COMPOSITIONS (RICH CRAFTSMANSHIP) */}
      {/* ========================================================================= */}
      
      {/* ========================================================================= */}
      {/* 1. ASYMMETRICAL EDITORIAL SIDE MARGIN MICRO-DETAILS (CRAFTSMANSHIP) */}
      {/* ========================================================================= */}
      
      {/* LEFT CREAM MARGIN COMPOSITION */}
      <div className="absolute top-0 left-0 bottom-0 w-[18%] z-[15] pointer-events-none select-none overflow-hidden hidden lg:block">
        {/* Top Left: Botanical Wheat Sketch & Flour Particles */}
        <div className="absolute top-[6%] left-[15%] opacity-30 transform -rotate-12">
          <svg className="w-16 h-28 text-[#5C4332]" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M25 90 C 25 50, 25 20, 25 10 M 25 70 C 15 65, 10 55, 25 50 M 25 50 C 35 45, 40 35, 25 30 M 25 30 C 15 25, 10 15, 25 10" strokeLinecap="round" />
          </svg>
        </div>

        {/* Upper Left: Circular Vintage Seal "HANDCRAFTED WITH LOVE" */}
        <div className="absolute top-[22%] left-[8%] opacity-35 transform rotate-[-8deg]">
          <div className="w-26 h-26 border-2 border-dashed border-[#5C4332] rounded-full flex flex-col items-center justify-center text-center p-1 bg-[#FAF9F6]/40 backdrop-blur-xs">
            <span
              style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
              className="text-[0.52rem] tracking-widest text-[#5C4332] uppercase font-extrabold"
            >
              HANDCRAFTED
            </span>
            <span className="text-xs text-[#FF6A63]">♡</span>
            <span
              style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
              className="text-[0.48rem] tracking-widest text-[#5C4332] uppercase font-bold"
            >
              WITH LOVE
            </span>
          </div>
        </div>

        {/* Mid Left: Masking Tape Note "Sourdough Batch 042" with Pencil Underline */}
        <div className="absolute top-[48%] left-[10%] opacity-90 transform rotate-[-3deg]">
          <div
            style={{ fontFamily: "var(--font-kalam-g), 'Kalam', cursive" }}
            className="bg-[#FAF9F6] border border-[#5C4332]/30 px-3 py-1.5 rounded text-xs font-bold text-[#5C4332] shadow-xs"
          >
            sourdough batch 042 🌾
            <div className="w-full h-0.5 bg-[#FF6A63]/60 mt-0.5 rounded-full" />
          </div>
        </div>

        {/* Bottom Left: Coffee Ring Stain */}
        <div className="absolute bottom-[18%] left-[8%] opacity-20">
          <div className="w-22 h-22 border-3 border-[#7A4A2E] rounded-full transform rotate-45 border-dashed" />
        </div>

        {/* Bottom Left: Hand-drawn Croissant Line Sketch */}
        <div className="absolute bottom-[6%] left-[12%] opacity-30 transform rotate-12">
          <svg className="w-16 h-12 text-[#5C4332]" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.8">
            <ellipse cx="30" cy="20" rx="25" ry="15" strokeLinecap="round" />
            <path d="M 15 15 Q 25 10, 35 15 M 25 25 Q 35 20, 45 25" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* RIGHT CREAM MARGIN COMPOSITION */}
      <div className="absolute top-0 right-0 bottom-0 w-[18%] z-[15] pointer-events-none select-none overflow-hidden hidden lg:block">
        {/* Top Right: Vintage Bakery Stamp "SLOW FERMENTATION" & Rosemary */}
        <div className="absolute top-[8%] right-[10%] opacity-35 transform rotate-[10deg]">
          <div className="w-26 h-26 border-2 border-dotted border-[#5C4332] rounded-full flex flex-col items-center justify-center text-center p-1 bg-[#FAF9F6]/40 backdrop-blur-xs">
            <span
              style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
              className="text-[0.52rem] tracking-widest text-[#5C4332] uppercase font-extrabold"
            >
              SLOW
            </span>
            <span className="text-xs">🌿</span>
            <span
              style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
              className="text-[0.45rem] tracking-widest text-[#5C4332] uppercase font-bold"
            >
              FERMENTATION
            </span>
          </div>
        </div>

        {/* Lower Right: Tape Note "Baked before sunrise" */}
        <div className="absolute top-[52%] right-[8%] opacity-90 transform rotate-[-5deg]">
          <div
            style={{ fontFamily: "var(--font-kalam-g), 'Kalam', cursive" }}
            className="bg-[#FFE7A3] border border-[#5C4332]/30 px-3 py-1.5 rounded text-xs font-bold text-[#5C4332] shadow-xs"
          >
            baked before sunrise ♡
          </div>
        </div>

        {/* Bottom Right: Rolling Pin Sketch */}
        <div className="absolute bottom-[22%] right-[10%] opacity-30 transform -rotate-12">
          <svg className="w-22 h-9 text-[#5C4332]" viewBox="0 0 80 30" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="15" y="10" width="50" height="10" rx="3" />
            <line x1="5" y1="15" x2="15" y2="15" strokeLinecap="round" strokeWidth="2.5" />
            <line x1="65" y1="15" x2="75" y2="15" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      {/* MICRO-DETAILS: VECTOR COFFEE BEANS, COOKIE CRUMBS & CHOCOLATE CHUNKS SCATTERED IN MARGINS */}
      <div ref={crumbsRef} className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3E332B_1px,transparent_1px)] opacity-[0.04] [background-size:16px_16px]" />
        
        {/* VECTOR COFFEE BEANS SCATTERED ON LEFT MARGIN */}
        <div className="absolute top-[12%] left-[5%] transform rotate-[-25deg] filter drop-shadow-xs">
          <svg className="w-4 h-6 text-[#3A2312]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#7E522C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-[34%] left-[3%] transform rotate-[40deg] filter drop-shadow-xs">
          <svg className="w-3.5 h-5.5 text-[#4E2E18]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#8C5C34" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-[30%] left-[14%] transform rotate-[-60deg] filter drop-shadow-xs">
          <svg className="w-4 h-6 text-[#3A2312]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#7E522C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-[10%] left-[4%] transform rotate-[15deg] filter drop-shadow-xs">
          <svg className="w-4.5 h-7 text-[#2C190B]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#664120" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* VECTOR COFFEE BEANS SCATTERED ON RIGHT MARGIN */}
        <div className="absolute top-[16%] right-[5%] transform rotate-[30deg] filter drop-shadow-xs">
          <svg className="w-4 h-6 text-[#3A2312]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#7E522C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-[42%] right-[3%] transform rotate-[-45deg] filter drop-shadow-xs">
          <svg className="w-3.5 h-5.5 text-[#4E2E18]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#8C5C34" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-[26%] right-[12%] transform rotate-[70deg] filter drop-shadow-xs">
          <svg className="w-4 h-6 text-[#3A2312]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#7E522C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-[8%] right-[5%] transform rotate-[-20deg] filter drop-shadow-xs">
          <svg className="w-4.5 h-7 text-[#2C190B]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#664120" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* ORGANIC COOKIE CRUMBS & CHOCOLATE CHUNKS (LEFT MARGIN) */}
        <div className="absolute top-[20%] left-[8%] w-3 h-2.5 bg-[#C48C46] rounded-xs shadow-xs transform rotate-12 opacity-90" />
        <div className="absolute top-[26%] left-[2%] w-2 h-2 bg-[#2A180E] rounded-xs opacity-95 transform -rotate-45" />
        <div className="absolute top-[40%] left-[12%] w-2.5 h-2.5 bg-[#D9A566] rounded-full opacity-85" />
        <div className="absolute top-[58%] left-[4%] w-3.5 h-3 bg-[#A66E2E] rounded-xs shadow-xs transform rotate-45 opacity-90" />
        <div className="absolute bottom-[22%] left-[10%] w-2 h-2 bg-[#2A180E] rounded-full opacity-90" />
        <div className="absolute bottom-[16%] left-[2%] w-3.5 h-3.5 bg-[#C48C46] rounded-xs shadow-xs opacity-90 transform rotate-12" />

        {/* ORGANIC COOKIE CRUMBS & CHOCOLATE CHUNKS (RIGHT MARGIN) */}
        <div className="absolute top-[24%] right-[3%] w-3 h-3 bg-[#C48C46] rounded-xs shadow-xs opacity-90 transform -rotate-12" />
        <div className="absolute top-[32%] right-[12%] w-2 h-2 bg-[#2A180E] rounded-xs opacity-95 transform rotate-12" />
        <div className="absolute top-[64%] right-[4%] w-3.5 h-3.5 bg-[#D9A566] rounded-full shadow-xs opacity-90" />
        <div className="absolute bottom-[32%] right-[10%] w-2.5 h-2.5 bg-[#A66E2E] rounded-xs opacity-85" />
        <div className="absolute bottom-[18%] right-[3%] w-3 h-2.5 bg-[#2A180E] rounded-xs shadow-xs opacity-90 transform rotate-45" />

        {/* FLOUR DUSTING & POWDERED SUGAR SPECKS */}
        <div className="absolute top-[18%] left-[14%] w-1.5 h-1.5 bg-[#FFF7EF] rounded-full opacity-60" />
        <div className="absolute top-[50%] left-[7%] w-2 h-2 bg-[#FFF7EF] rounded-full opacity-50" />
        <div className="absolute bottom-[28%] right-[8%] w-1.5 h-1.5 bg-[#FFF7EF] rounded-full opacity-60" />
        <div className="absolute top-[36%] right-[14%] w-2 h-2 bg-[#FFF7EF] rounded-full opacity-50" />

        {/* Bakery Flour & Temperature Doodles */}
        <div
          style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
          className="absolute top-[10%] left-[22%] text-[#5C4332]/35 text-xs rotate-[-4deg] tracking-widest font-extrabold"
        >
          🌾 220°C • Nº 042 FOLD
        </div>
        <div
          style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
          className="absolute bottom-[10%] right-[22%] text-[#5C4332]/35 text-xs rotate-[4deg] tracking-widest font-extrabold"
        >
          ✨ SLOW RISE • 24H FERMENT
        </div>
      </div>

      {/* DEPTH B & C: Subtle Vector Coffee Beans and Cookie Crumb Accents Near Corners */}
      <div ref={topCookieRef} className="absolute top-[2%] left-[10%] z-[16] pointer-events-none select-none">
        <div className="w-10 h-10 rounded-full border border-[#5C4332]/30 shadow-xs flex items-center justify-center bg-[#FAF9F6]/60 backdrop-blur-xs transform -rotate-12">
          <svg className="w-5 h-7 text-[#3A2312]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#7E522C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div ref={rightFragmentRef} className="absolute top-[46%] right-[1%] z-[16] pointer-events-none select-none">
        <div className="w-9 h-9 rounded-full border border-[#5C4332]/30 shadow-xs flex items-center justify-center bg-[#FAF9F6]/60 backdrop-blur-xs transform rotate-12">
          <svg className="w-4 h-6 text-[#4E2E18]" viewBox="0 0 30 45" fill="none">
            <ellipse cx="15" cy="22.5" rx="13" ry="20" fill="currentColor" />
            <path d="M15 5C18 14 11 25 15 39" stroke="#8C5C34" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div ref={bottomCookieRef} className="absolute bottom-[3%] left-[2%] z-[16] pointer-events-none select-none">
        <div className="flex items-center gap-1.5 opacity-90">
          <div className="w-4 h-3.5 bg-[#C48C46] rounded-xs shadow-xs transform rotate-12" />
          <div className="w-3 h-3 bg-[#2A180E] rounded-xs shadow-xs transform -rotate-45" />
          <div className="w-2.5 h-2.5 bg-[#D9A566] rounded-full opacity-80" />
        </div>
      </div>

      {/* SVG ClipPath Definition for Hand-Cut Wavy Deckled Edges */}
      <svg className="absolute w-0 h-0">
        <defs>
          <clipPath id="storyScribbleClip" clipPathUnits="objectBoundingBox">
            <path
              d="M 0,0 
                 C 0.05,0.03 0.03,0.1 0.08,0.18 
                 C 0.04,0.28 0.09,0.38 0.05,0.48 
                 C 0.09,0.58 0.04,0.68 0.08,0.78 
                 C 0.03,0.88 0.05,0.96 0.06,1.0 
                 L 0.25,0.99 C 0.45,1.01 0.65,0.985 0.85,1.01 L 1.0,0.995 
                 C 0.98,0.93 0.99,0.84 0.96,0.75 
                 C 0.99,0.65 0.95,0.55 0.98,0.45 
                 C 0.95,0.35 0.99,0.25 0.96,0.15 
                 C 0.98,0.07 0.96,0.0 0.97,0.0 
                 Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* INNER PURPLE SCRIBBLE PAPER CONTAINER FRAME (#4F2F77 Container Canvas) */}
      <div className="purple-paper w-full max-w-7xl relative overflow-visible z-10 min-h-0 lg:min-h-[clamp(540px,68vh,620px)] flex items-center">
        
        {/* Layer 2A: Inner Deep Purple Panel Backing Cutout */}
        <div
          ref={revealContainerRef}
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            "--reveal-pct": "-15%",
            clipPath: "polygon(0% 0%, calc(var(--reveal-pct) - 20px) 0%, calc(var(--reveal-pct) + 28px) 22%, calc(var(--reveal-pct) - 12px) 48%, calc(var(--reveal-pct) + 22px) 72%, calc(var(--reveal-pct) - 18px) 100%, 0% 100%)"
          } as React.CSSProperties}
        >
          <div
            className="absolute inset-0 bg-[#3D245D] z-0 select-none pointer-events-none"
            style={{ clipPath: "url(#storyScribbleClip)" }}
          />
          
          <div
            className="absolute inset-0 bg-[#4F2F77] z-10 overflow-hidden transform -translate-x-[6px] -translate-y-[6px]"
            style={{ clipPath: "url(#storyScribbleClip)" }}
          >
            {/* 6% RECYCLED PAPER TEXTURE OVERLAY ON PURPLE PAPER */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-[0.06] [background-size:16px_16px] mix-blend-overlay pointer-events-none" />
            <div className="linen-grain-overlay opacity-[0.04] pointer-events-none" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SAFE CONTENT CONTAINER WITH MASTER ALIGNMENT AXIS */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* MOBILE-ONLY LUXURY SCRAPBOOK STORY CARDS (Rebuilt for 320px–768px) */}
        {/* ========================================================================= */}
        <div className="block lg:hidden w-full relative z-20 px-4 py-8 select-none">
          {/* Mobile Story Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <span
              style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
              className="text-[11px] uppercase tracking-[0.2em] font-extrabold bg-[#FFD95B] text-[#2B1824] px-4 py-1.5 rounded-full border-2 border-[#2B1824] shadow-[2.5px_2.5px_0_#2B1824] inline-block mb-3 rotate-[-1deg]"
            >
              ✨ ABOUT OUR BAKERY
            </span>
            
            <h2
              className="font-fasthand font-bold text-4xl xs:text-5xl text-[#FFF7EF] leading-none tracking-tight mb-2 drop-shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
            >
              PLOTTWIST24X7
            </h2>
            
            <span className="text-[#F6AFCF] font-workforce text-lg font-bold transform -rotate-2 tracking-wide block">
              made with love ♡
            </span>
          </div>

          {/* Mobile Story Cards Stack (16px gap, 16-20px padding) */}
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            
            {/* Card 1: Sourdough Craft & Heritage */}
            <div className="story-card-mobile group bg-[#FAF4E8] border-[3px] border-[#3B2A22] rounded-2xl p-4 xs:p-5 shadow-[5px_5px_0_#3B2A22] relative overflow-hidden transition-all duration-300 active:scale-[0.99]">
              {/* Top Masking Tape */}
              <div className="absolute -top-3 left-6 w-20 h-5 bg-[#E8C59A]/90 border-x border-[#3B2A22]/30 rotate-[-4deg] z-20 shadow-xs pointer-events-none" />
              
              {/* Fixed Aspect Ratio Image */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#3B2A22]/20 bg-[#F5EDDC] shadow-inner mb-3">
                <Image
                  src={storyImages?.mainPolaroid || "/images/baker-where/hero_bakery.jpg"}
                  alt="Artisan bakery kitchen sourdough prep"
                  fill
                  sizes="(max-width: 640px) 360px, 450px"
                  loading="lazy"
                  className="object-cover scale-102 group-hover:scale-105 transition-transform duration-500 ease-out"
                  unoptimized={storyImages?.mainPolaroid?.startsWith("data:")}
                />
                <div className="absolute top-2 right-2 bg-[#FF6A63] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#2B1824] shadow-xs">
                  № 01 • OUR CRAFT
                </div>
              </div>

              {/* Heading (12px gap from image) */}
              <h3 className="font-fraunces text-xl font-bold text-[#3B2A22] leading-tight mb-2">
                Slow-Fermented Sourdough
              </h3>

              {/* 2-3 lines of text (8px gap from title) */}
              <p className="font-manrope text-xs xs:text-sm text-[#5C4332] leading-relaxed font-medium line-clamp-3">
                Every morning begins at dawn, nurturing our heirloom sourdough starter to create artisan loaves and flaky pastries with rich texture and natural crispness.
              </p>
            </div>

            {/* Card 2: Pure Ingredients */}
            <div className="story-card-mobile group bg-[#FAF4E8] border-[3px] border-[#3B2A22] rounded-2xl p-4 xs:p-5 shadow-[5px_5px_0_#3B2A22] relative overflow-hidden transition-all duration-300 active:scale-[0.99]">
              {/* Top Masking Tape */}
              <div className="absolute -top-3 right-6 w-20 h-5 bg-[#C5E1A5]/90 border-x border-[#3B2A22]/30 rotate-[3deg] z-20 shadow-xs pointer-events-none" />
              
              {/* Fixed Aspect Ratio Image */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#3B2A22]/20 bg-[#F5EDDC] shadow-inner mb-3">
                <Image
                  src={storyImages?.badge1 || "/images/baker-where/prod_pancakes.jpg"}
                  alt="Clean wholesome pancake bakes"
                  fill
                  sizes="(max-width: 640px) 360px, 450px"
                  loading="lazy"
                  className="object-cover scale-102 group-hover:scale-105 transition-transform duration-500 ease-out"
                  unoptimized={storyImages?.badge1?.startsWith("data:")}
                />
                <div className="absolute top-2 right-2 bg-[#A8D8FF] text-[#2B1824] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#2B1824] shadow-xs">
                  № 02 • WHOLESOME
                </div>
              </div>

              {/* Heading */}
              <h3 className="font-fraunces text-xl font-bold text-[#3B2A22] leading-tight mb-2">
                100% Real Ingredients
              </h3>

              {/* Text */}
              <p className="font-manrope text-xs xs:text-sm text-[#5C4332] leading-relaxed font-medium line-clamp-3">
                We carefully source real dairy, unrefined sugars, and organic flours. No shortcuts or heavy preservatives—just guilt-free treats made for a happier you.
              </p>
            </div>

            {/* Card 3: Small-Batch Love */}
            <div className="story-card-mobile group bg-[#FAF4E8] border-[3px] border-[#3B2A22] rounded-2xl p-4 xs:p-5 shadow-[5px_5px_0_#3B2A22] relative overflow-hidden transition-all duration-300 active:scale-[0.99]">
              {/* Top Masking Tape */}
              <div className="absolute -top-3 left-8 w-20 h-5 bg-[#F8BBD0]/90 border-x border-[#3B2A22]/30 rotate-[-2deg] z-20 shadow-xs pointer-events-none" />
              
              {/* Fixed Aspect Ratio Image */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#3B2A22]/20 bg-[#F5EDDC] shadow-inner mb-3">
                <Image
                  src={storyImages?.badge2 || "/images/baker-where/prod_tiramisu.jpg"}
                  alt="Fresh baked tiramisu and treats"
                  fill
                  sizes="(max-width: 640px) 360px, 450px"
                  loading="lazy"
                  className="object-cover scale-102 group-hover:scale-105 transition-transform duration-500 ease-out"
                  unoptimized={storyImages?.badge2?.startsWith("data:")}
                />
                <div className="absolute top-2 right-2 bg-[#FFD95B] text-[#2B1824] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#2B1824] shadow-xs">
                  № 03 • HANDMADE
                </div>
              </div>

              {/* Heading */}
              <h3 className="font-fraunces text-xl font-bold text-[#3B2A22] leading-tight mb-2">
                Small Batches, Big Heart
              </h3>

              {/* Text */}
              <p className="font-manrope text-xs xs:text-sm text-[#5C4332] leading-relaxed font-medium line-clamp-3">
                Every bake is crafted in boutique batches and cooled naturally, packing the cozy warmth of home-baked comfort into every single gift box.
              </p>
            </div>

            {/* Mobile CTA Action Button */}
            <div className="pt-2">
              <button
                onClick={scrollToBakes}
                style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                className="ticket-edge group bg-[#FFD95B] text-[#2B1824] border-3 border-[#2B1824] shadow-[4px_4px_0_#2B1824] active:shadow-[1px_1px_0_#2B1824] active:translate-x-0.5 active:translate-y-0.5 active:scale-[0.98] w-full min-h-[50px] justify-center px-6 py-3.5 rounded-full text-xs xs:text-sm uppercase tracking-[0.14em] transition-all duration-200 cursor-pointer font-extrabold flex items-center gap-2"
              >
                <span>SEE ALL BAKES</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP-ONLY LAYOUT (Preserved 100% pixel-identical) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block relative w-full z-10 story-safe-content select-none px-16 pt-12 pb-16">
          
          {/* TOP PINNED TAPE NOTES (AMBENT FLOAT ANIMATION) */}
          <div ref={topNotesRef} className="pointer-events-none">
            <div
              style={{ fontFamily: "var(--font-kalam-g), 'Kalam', var(--font-workforce-g), 'Caveat', cursive, sans-serif" }}
              className="absolute top-6 left-20 z-30 bg-[#FAF9F6] text-[#5C4332] px-3.5 py-1.5 rounded border border-[#A17A5B]/40 shadow-[0_4px_10px_rgba(0,0,0,0.12)] transform -rotate-3 text-sm font-bold tracking-wide animate-float-a hover:rotate-2 hover:-translate-y-0.5 transition-transform duration-200 pointer-events-auto cursor-pointer"
            >
              "fresh every morning" 🥐
            </div>

            <div
              style={{ fontFamily: "var(--font-kalam-g), 'Kalam', var(--font-workforce-g), 'Caveat', cursive, sans-serif" }}
              className="absolute top-6 right-20 z-30 bg-[#FFE7A3] text-[#5C4332] px-3.5 py-1.5 rounded border border-[#3E332B]/30 shadow-[0_4px_10px_rgba(0,0,0,0.12)] transform rotate-3 text-sm font-bold tracking-wide animate-float-b hover:rotate-2 hover:-translate-y-0.5 transition-transform duration-200 pointer-events-auto cursor-pointer"
            >
              "slow fermentation" ♡
            </div>
          </div>

          {/* 2-COLUMN MAIN COMPOSITION GRID (LEFT CONTENT: 58-60% WIDTH ALLOCATION) */}
          <div className="grid grid-cols-12 gap-10 items-center">
            
            {/* ========================================================================= */}
            {/* LEFT COLUMN: SHIFTED ~50px RIGHT INSIDE PURPLE CANVAS (.story-left) */}
            {/* ========================================================================= */}
            <div className="col-span-7 story-left flex flex-col items-start text-left w-full max-w-2xl pl-14">
              
              {/* 1. ABOUT OUR BAKERY PILL (Outer left edge aligned to master axis, 26px above headline) */}
              <div ref={headingBoxRef} className="mb-[26px] pt-2">
                <span
                  style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                  className="text-xs uppercase tracking-[0.22em] font-extrabold bg-[#FFD95B] text-[#2B1824] px-4 py-1.5 rounded-full border-2 border-[#2B1824] shadow-[3px_3px_0_#2B1824] inline-block rotate-[-1deg]"
                >
                  ✨ ABOUT OUR BAKERY
                </span>
              </div>

              {/* 2. UNIFIED HEADLINE WRAPPER: PLOTTWIST24X7 (FILMOTYPE HONEY WARM IVORY #FFF7EF) */}
              <div className="story-heading flex flex-col text-left mb-[22px] w-full relative">
                
                {/* OPEN-CENTER 3-LINE SPARKLE BURSTS IN BABY PINK (#F6AFCF) */}
                <div className="absolute -bottom-2 -left-6 z-20 pointer-events-none sparkle-pink">
                  <svg className="w-7 h-7" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="17" x2="5" y2="24" />
                    <line x1="15" y1="18" x2="15" y2="27" />
                    <line x1="18" y1="17" x2="25" y2="24" />
                  </svg>
                </div>

                <div className="absolute -top-4 right-4 z-20 pointer-events-none sparkle-pink">
                  <svg className="w-7 h-7" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="13" x2="5" y2="6" />
                    <line x1="15" y1="12" x2="15" y2="3" />
                    <line x1="18" y1="13" x2="25" y2="6" />
                  </svg>
                </div>

                {/* PLOTTWIST24X7: FASTHAND IN WARM HANDCRAFTED IVORY (#FFF7EF) WITH CLIPPED PAPER TEXTURE */}
                <span
                  ref={headlinePart1Ref}
                  className="font-fasthand font-bold text-[clamp(44px,4.5vw,76px)] text-[#FFF7EF] leading-[0.92] tracking-[-0.015em] mb-[6px] text-left distressed-text drop-shadow-[0_3px_8px_rgba(0,0,0,0.08)] whitespace-nowrap block"
                >
                  PLOTTWIST24X7
                </span>
              </div>

              {/* 4. "made with love ♡" HANDWRITTEN SCRIPT (WORKFORCE) IN SOFT BABY PINK (#F6AFCF) + SVG UNDERLINE */}
              <div ref={madeWithLoveRef} className="mb-[18px] relative inline-block">
                <span className="text-[#F6AFCF] font-workforce text-2xl font-bold transform -rotate-2 tracking-wide text-left pointer-events-none leading-none pl-0.5 block">
                  made with love ♡
                </span>
                
                {/* Interactive Hand-Drawn SVG Underline Stroke */}
                <svg className="w-36 h-3 text-[#F6AFCF] mt-0.5 opacity-85" viewBox="0 0 140 12" fill="none">
                  <path ref={underlineRef} d="M 4 8 Q 40 2, 80 7 T 136 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* 5. REPOSITIONED FEATURE BADGES (PLACED BELOW CIRCULAR IMAGES, 100% VISIBLE!) */}
              <div ref={bakesRef} className="grid grid-cols-3 gap-5 w-full mb-[32px] items-center justify-items-center max-w-xl">
                
                {/* Badge 1: 24 Countries (Image fully visible, Capsule Badge below) */}
                <div className="relative flex flex-col items-center select-none w-28 transform rotate-[-2deg] hover:scale-[1.04] transition-transform duration-300">
                  <div className="w-26 h-26 rounded-full overflow-hidden border-3 border-[#2B1824] shadow-[0_6px_12px_rgba(0,0,0,0.12)] bg-white relative">
                    <Image
                      src={storyImages?.badge1 || "/images/baker-where/prod_pancakes.jpg"}
                      alt="Pancakes background stats bakes"
                      fill
                      sizes="128px"
                      loading="lazy"
                      className="object-cover scale-110"
                      unoptimized={storyImages?.badge1?.startsWith("data:")}
                    />
                  </div>
                  {/* Badge Capsule sit BELOW image, overlapping bottom edge by only 6-8px */}
                  <div
                    style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                    className="bg-[#A8D8FF] text-[#2B1824] border-2 border-[#2B1824] shadow-[2px_2px_0_#2B1824] px-2.5 py-1 rounded-full text-xs uppercase tracking-wider -translate-y-2 z-20 text-center font-extrabold whitespace-nowrap"
                  >
                    24 countries
                  </div>
                </div>

                {/* Badge 2: 100% Wholesome (Image fully visible, Capsule Badge below) */}
                <div className="relative flex flex-col items-center select-none w-30 transform rotate-[3deg] hover:scale-[1.04] transition-transform duration-300">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#2B1824] shadow-[0_8px_16px_rgba(0,0,0,0.16)] bg-white relative">
                    <Image
                      src={storyImages?.badge2 || "/images/baker-where/prod_tiramisu.jpg"}
                      alt="Tiramisu background stats bakes"
                      fill
                      sizes="128px"
                      loading="lazy"
                      className="object-cover scale-110"
                      unoptimized={storyImages?.badge2?.startsWith("data:")}
                    />
                  </div>
                  {/* Badge Capsule sit BELOW image, overlapping bottom edge by only 6-8px */}
                  <div
                    style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                    className="bg-[#FFD95B] text-[#2B1824] border-2 border-[#2B1824] shadow-[2px_2px_0_#2B1824] px-2.5 py-1 rounded-full text-xs uppercase tracking-wider -translate-y-2 z-20 text-center font-extrabold whitespace-nowrap"
                  >
                    100% wholesome
                  </div>
                </div>

                {/* Badge 3: Trusted Quality (Image fully visible, Capsule Badge below) */}
                <div className="relative flex flex-col items-center select-none w-28 transform rotate-[-2deg] hover:scale-[1.04] transition-transform duration-300">
                  <div className="w-26 h-26 rounded-full overflow-hidden border-3 border-[#2B1824] shadow-[0_6px_14px_rgba(0,0,0,0.10)] bg-white relative">
                    <Image
                      src={storyImages?.badge3 || "/images/baker-where/prod_biscoff_brownie.jpg"}
                      alt="Brownie background stats bakes"
                      fill
                      sizes="128px"
                      loading="lazy"
                      className="object-cover scale-110"
                      unoptimized={storyImages?.badge3?.startsWith("data:")}
                    />
                  </div>
                  {/* Badge Capsule sit BELOW image, overlapping bottom edge by only 6-8px */}
                  <div
                    style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                    className="bg-[#FF6A63] text-[#FAF9F6] border-2 border-[#2B1824] shadow-[2px_2px_0_#2B1824] px-2.5 py-1 rounded-full text-xs uppercase tracking-wider -translate-y-2 z-20 text-center font-extrabold whitespace-nowrap"
                  >
                    trusted quality
                  </div>
                </div>

              </div>

              {/* 6. AGED RECIPE CARD (Neue Montreal Bold heading, Aesthet body 170% line-height, 520px max-width) */}
              <div
                ref={descTextRef}
                className="relative bg-[#F6EEDB] text-[#5C4332] p-7 rounded-2xl border-2 border-[#A17A5B] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)] transition-all duration-300 transform rotate-[-1deg] mb-[26px] w-full max-w-[520px]"
              >
                {/* Hand-drawn swirl doodle */}
                <svg className="absolute -top-5 -left-5 w-7 h-7 text-[#6B2C12] opacity-85 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                </svg>

                {/* Subtle Coffee Stain Ring */}
                <div className="absolute top-3 left-4 w-14 h-14 rounded-full border-2 border-[#8C6239]/20 opacity-40 pointer-events-none transform rotate-12" />

                {/* Paper clip with spring hover animation */}
                <div className="absolute -top-3 right-6 w-4 h-9 border-2 border-[#5C4332] rounded-full rotate-12 opacity-90 z-20 cursor-pointer hover:rotate-20 hover:-translate-y-1 transition-transform duration-300" />

                <span
                  style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                  className="text-[0.65rem] uppercase tracking-[0.14em] font-extrabold text-[#A17A5B]/90 mb-3 block text-left"
                >
                  RECIPE CARD № 042 • HANDCRAFTED
                </span>

                <p
                  style={{ fontFamily: "var(--font-kalam-g), 'Kalam', var(--font-quicksand-g), 'Quicksand', 'Patrick Hand', cursive, sans-serif" }}
                  className="text-[#3E332B] text-lg leading-[170%] font-bold text-left"
                >
                  Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.
                </p>

                <div className="absolute -bottom-3 -left-3 w-20 h-5 bg-[#EFE3C5] border-x border-[#5C4332]/30 rotate-[6deg] opacity-92 pointer-events-none" />
              </div>

              {/* 7. TICKET-STYLE CTA BUTTON (Layered shadow, hover lift, active press effect) */}
              <div className="relative">
                <button
                  ref={ctaButtonRef}
                  onClick={scrollToBakes}
                  style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                  className="ticket-edge group bg-[#FFD95B] text-[#2B1824] border-3 border-[#2B1824] shadow-[3px_3px_0_#2B1824] hover:bg-[#FFE7A3] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97] px-8 py-3.5 rounded-full text-base uppercase tracking-[0.14em] transition-all duration-200 cursor-pointer focus-visible:outline-none font-extrabold flex items-center gap-2"
                >
                  <span>SEE ALL BAKES</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: POLAROID POSTCARD SCRAPBOOK CLUSTER WITH 3D MOUSE TILT */}
            <div className="col-span-5 relative w-full min-h-[380px] flex items-center justify-center pr-6">
              
              {/* ORGANIC MORPHING SVG BLOB BEHIND POLAROID PHOTO (#FFD95B Fill) */}
              <div ref={splatRef} className="absolute inset-0 w-full h-full flex items-center justify-center select-none z-0">
                <svg viewBox="0 0 200 200" className="w-[110%] h-[110%] fill-[#FFD95B] opacity-90 animate-breathe">
                  <path d="M44.7,-58.4C56.9,-49.2,65.2,-34.7,69.1,-19.1C73,-3.5,72.5,13.2,65.7,27.1C58.9,41,45.8,52.1,31.2,59.3C16.6,66.5,0.5,69.8,-15.8,67.3C-32.1,64.8,-48.6,56.5,-58.8,43.2C-69,29.9,-72.9,11.6,-70.8,-5.6C-68.7,-22.8,-60.6,-38.9,-48.7,-48.4C-36.8,-57.9,-21.1,-60.8,-3.8,-56.3C13.5,-51.8,32.5,-67.6,44.7,-58.4Z" transform="translate(100 100)" />
                </svg>
              </div>

              {/* POLAROID FRAME WITH 3D MOUSE TILT & SOFT LAYERED SHADOW */}
              <div
                ref={muffinRef}
                onMouseMove={handlePolaroidMouseMove}
                onMouseLeave={handlePolaroidMouseLeave}
                style={{
                  transform: tilt.isHovered
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)`
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                  transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
                className="relative z-10 flex flex-col items-center cursor-pointer"
              >
                
                {/* Polaroid Card Frame with Large Soft Shadow */}
                <div className="relative w-72 h-84 bg-[#F9F3E6] p-3 pb-11 rounded-lg border-2 border-[#A17A5B]/40 shadow-[0_16px_36px_rgba(0,0,0,0.18)] transform rotate-[-2deg]">
                  
                  {/* Paper clips with hover spring animation */}
                  <div className="absolute -top-4 left-5 w-22 h-6.5 bg-[#F6EEDB] border-x border-[#3E332B]/30 rotate-[-6deg] z-30 opacity-92 shadow-xs cursor-pointer hover:rotate-12 hover:-translate-y-1 transition-transform duration-300" />
                  <div className="absolute -top-4 right-5 w-18 h-5.5 bg-[#EFE3C5] border-x border-[#3E332B]/30 rotate-[8deg] z-30 opacity-92 shadow-xs cursor-pointer hover:rotate-12 hover:-translate-y-1 transition-transform duration-300" />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-9 border-2 border-[#5C4332] rounded-full rotate-[-5deg] z-30 opacity-90 cursor-pointer hover:rotate-12 hover:-translate-y-1 transition-transform duration-300" />

                  {/* Photo Container */}
                  <div className="relative w-full h-[80%] rounded border border-[#2B1824]/20 overflow-hidden bg-white">
                    <Image
                      src={storyImages?.mainPolaroid || "/images/baker-where/hero_bakery.jpg"}
                      alt="Artisan bakery kitchen prep"
                      fill
                      sizes="288px"
                      loading="lazy"
                      className="object-cover"
                      unoptimized={storyImages?.mainPolaroid?.startsWith("data:")}
                    />
                  </div>

                  {/* VINTAGE POSTCARD TYPOGRAPHY: Kalam handwritten caption */}
                  <p
                    style={{ fontFamily: "var(--font-kalam-g), 'Kalam', var(--font-workforce-g), 'Caveat', cursive, sans-serif" }}
                    className="text-sm text-[#5C4332] text-center mt-2 font-bold tracking-wide"
                  >
                    artisan sourdough prep ♡
                  </p>
                </div>

                {/* BAKED TODAY Sticker */}
                <div
                  ref={bakedTodayRef}
                  style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-30 bg-[#FF6A63] text-[#FAF9F6] border-3 border-[#2B1824] shadow-[0_6px_14px_rgba(0,0,0,0.12)] px-4.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-extrabold rotate-[3deg] flex items-center gap-1.5 whitespace-nowrap animate-float-a"
                >
                  <span>✨</span>
                  <span>BAKED TODAY</span>
                </div>

                {/* HANDMADE STAMP (Hover rotate 12deg) */}
                <div
                  ref={handmadeStampRef}
                  style={{ fontFamily: "var(--font-federo-g), 'Federo', var(--font-quicksand-g), 'Quicksand', sans-serif" }}
                  className="absolute -bottom-5 -right-6 z-30 w-19 h-19 border-2 border-dashed border-[#2B1824]/70 rounded-full flex flex-col items-center justify-center text-center text-[#2B1824] bg-[#FAF9F6]/95 p-1 rotate-12 shadow-sm cursor-pointer hover:rotate-[18deg] hover:scale-105 transition-transform duration-300 animate-float-b"
                >
                  <span className="text-[0.55rem] uppercase tracking-wider leading-tight font-extrabold">HANDMADE</span>
                  <span className="text-xs">🥐</span>
                  <span className="text-[0.55rem] uppercase tracking-wider leading-tight font-extrabold">FRESH DAILY</span>
                </div>

                {/* CHEF'S PICK STICKER */}
                <div
                  ref={chefsPickRef}
                  style={{ fontFamily: "var(--font-kalam-g), 'Kalam', var(--font-workforce-g), 'Caveat', cursive, sans-serif" }}
                  className="absolute -top-5 right-0 z-30 bg-[#FFD8C2] text-[#5C4332] px-3 py-1 rounded border border-[#3E332B]/30 shadow-[0_4px_10px_rgba(0,0,0,0.12)] transform -rotate-3 text-sm font-bold tracking-wide animate-float-a hover:rotate-2 hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer"
                >
                  "chef's pick" 🔥
                </div>

                {/* STICKY NOTE TYPOGRAPHY: Federo label & Kalam checklist */}
                <div ref={todaysBatchRef} className="absolute -bottom-9 -left-14 z-30 bg-[#F9F3E6] border-2 border-[#F8A9C7] p-3 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] transform rotate-[3deg] max-w-[180px] animate-float-c hover:rotate-6 hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-full border-b border-[#F8A9C7]/50 pb-0.5 mb-1 text-left">
                    <span
                      style={{ fontFamily: "var(--font-federo-g), 'Federo', sans-serif" }}
                      className="uppercase tracking-wider text-[#5C4332] font-extrabold text-[0.7rem] block"
                    >
                      today's batch:
                    </span>
                  </div>
                  <ul
                    style={{ fontFamily: "var(--font-kalam-g), 'Kalam', var(--font-workforce-g), 'Caveat', cursive, sans-serif" }}
                    className="text-[0.82rem] text-[#5C4332] font-bold space-y-0.5 text-left"
                  >
                    <li>✓ slow rise</li>
                    <li>✓ better texture</li>
                    <li>✓ more flavour 😊</li>
                  </ul>
                </div>

              </div>

            </div>

          </div>

          <div ref={bakedWithCareRef} className="absolute bottom-3 left-[46%] -translate-x-1/2 z-20 border-2 border-dashed border-[#FFD95B]/40 px-3.5 py-1 rounded text-[#FFD95B]/80 font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase transform rotate-1 pointer-events-none animate-float-c">
            ═ BAKED WITH CARE ═
          </div>

        </div>

      </div>
    </section>
  );
}
