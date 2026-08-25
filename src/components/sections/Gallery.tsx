"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_PHOTOS } from "./Gallery/GalleryData";
import PhotoCard from "./Gallery/PhotoCard";
import RecipeCard from "./Gallery/RecipeCard";
import Sticker from "./Gallery/Sticker";
import Decoration from "./Gallery/Decoration";
import MaskingTape from "./Gallery/MaskingTape";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const RollingPinDoodle = ({ className = "w-8 h-8 text-[#3B2A22]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-75`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 12h3M19 12h3M5 9h14v6H5z" />
    <circle cx="3.5" cy="12" r="1.5" />
    <circle cx="20.5" cy="12" r="1.5" />
  </svg>
);

const WhiskDoodle = ({ className = "w-8 h-8 text-[#3B2A22]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-75`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 21v-7M9 5c0 4 3 9 3 9s3-5 3-9a3 3 0 0 0-6 0zM11 5c0 3 1 7 1 7s1-4 1-7a1 1 0 0 0-2 0z" />
  </svg>
);

const CroissantDoodle = ({ className = "w-8 h-8 text-[#3B2A22]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-75`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 4C7 4 3 8 3 13c0 3 2 6 5 7M12 4c5 0 9 4 9 9 0 3-2 6-5 7M12 4v16M7 20c2.5 0 5-1 5-4M17 20c-2.5 0-5-1-5-4" />
  </svg>
);

const SteamSwirlsDoodle = ({ className = "w-8 h-8 text-[#3B2A22]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-70`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 18 Q 6 12 10 8 T 8 2M16 20 Q 14 14 18 10 T 16 4" />
  </svg>
);

const BakeryStamp = ({ className = "" }: { className?: string }) => (
  <div className={`${className} pointer-events-none border-2 border-dashed border-[#3B2A22]/40 rounded-full w-20 h-20 flex flex-col items-center justify-center p-1 text-center rotate-[-12deg]`}>
    <span className="font-cherry text-[0.55rem] text-[#3B2A22]/70 leading-tight uppercase">BAKED FRESH</span>
    <span className="font-fasthand text-xs text-[#EF5B5B] my-0.5">daily ♡</span>
    <span className="font-manrope text-[0.45rem] font-bold text-[#3B2A22]/60 uppercase tracking-widest">EST. 2024</span>
  </div>
);

import { useAdmin } from "@/context/AdminContext";

export default function Gallery() {
  const { gallery } = useAdmin();
  
  // Merge live gallery updates from context with layout configuration
  const activePhotos = React.useMemo(() => {
    if (!gallery || gallery.length === 0) return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.map((staticPhoto, idx) => {
      const liveItem = gallery[idx];
      if (!liveItem) return staticPhoto;
      return {
        ...staticPhoto,
        src: liveItem.image || liveItem.src || staticPhoto.src,
        alt: liveItem.title || liveItem.alt || staticPhoto.alt,
        label: liveItem.title || liveItem.label || staticPhoto.label,
      };
    });
  }, [gallery]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Accessibility: Reveal final state immediately if prefers-reduced-motion is active
    if (prefersReduced) {
      const container = sectionRef.current;
      if (container) {
        gsap.set(container.querySelectorAll(".photo-card, .tape-wrapper, .recipe-card-inner, .scrapbook-sticker, h2, p, button"), { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          rotateX: 0 
        });
        gsap.set(".scribble-mask-path, .scribble-mask-arrow", { strokeDashoffset: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      if (!container) return;

      const heading = leftColumnRef.current?.querySelector("h2");
      const paragraph = leftColumnRef.current?.querySelector("p");
      const ctaButton = leftColumnRef.current?.querySelector("button");

      if (!heading || !paragraph || !ctaButton) return;

      // =========================================================================
      // SCENE 1: Setup Initial States (Prevent flashes and pre-render setup)
      // =========================================================================
      gsap.set(heading, { opacity: 0, y: 20 });
      gsap.set(paragraph, { opacity: 0 });
      gsap.set(ctaButton, { opacity: 0 });
      
      // Setup scribble mask path start values
      gsap.set(".scribble-mask-path, .scribble-mask-arrow", { 
        strokeDashoffset: (i, el: any) => el.getAttribute("stroke-dasharray") 
      });

      // Hide all elements at load state
      gsap.set(".photo-card", { opacity: 0, boxShadow: "14px 16px 0px rgba(61,46,37,0.12)" });
      gsap.set(".tape-wrapper", { opacity: 0 });
      gsap.set(".recipe-card-inner", { opacity: 0, rotateX: -85 });
      gsap.set(".scrapbook-sticker", { opacity: 0, scale: 0.98 });

      // Create Single Master Timeline (Paused initially)
      const tl = gsap.timeline({ paused: true });

      // =========================================================================
      // SCENE 2: Title Introduction (Heading -> Paragraph -> CTA)
      // =========================================================================
      tl.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      })
      .to(paragraph, {
        opacity: 1,
        duration: 0.4
      }, "-=0.25")
      .to(ctaButton, {
        opacity: 1,
        duration: 0.4
      }, "-=0.2");

      // =========================================================================
      // SCENE 3: Scribble Creation (SVG Mask Drawing)
      // =========================================================================
      tl.to(".scribble-mask-path", {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut"
      }, "+=0.1")
      .to(".scribble-mask-arrow", {
        strokeDashoffset: 0,
        duration: 0.2,
        ease: "power2.out"
      });

      // =========================================================================
      // SCENE 4 & 5: Photo Choreography & Tape Fades (Photo lands -> 120ms -> Tape)
      // =========================================================================
      // Config for unique paths, weight and delays
      const photoConfig: Record<string, { y: number; x: number; rotOffset: number; duration: number; delay: number }> = {
        pancakes: { y: -240, x: -60, rotOffset: -6, duration: 0.70, delay: 0.0 },
        cheesecake: { y: -260, x: -10, rotOffset: 6, duration: 0.68, delay: 0.14 },
        cookie: { y: -220, x: 40, rotOffset: 7, duration: 0.60, delay: 0.09 },
        "red-velvet": { y: -250, x: 30, rotOffset: -7, duration: 0.62, delay: 0.16 },
        brownie: { y: -260, x: -80, rotOffset: -8, duration: 0.68, delay: 0.11 },
        "oreo-fudge": { y: -240, x: 20, rotOffset: 7, duration: 0.60, delay: 0.13 },
        cupcake: { y: -210, x: 80, rotOffset: -5, duration: 0.55, delay: 0.08 },
        donuts: { y: -200, x: 90, rotOffset: 8, duration: 0.60, delay: 0.15 }
      };

      const sequenceOrder = [
        "pancakes",
        "cheesecake",
        "cookie",
        "red-velvet",
        "brownie",
        "oreo-fudge",
        "cupcake",
        "donuts"
      ];

      // Track relative sequence timestamp
      let runningTime = 0.8; // begins after scribble finishes drawing

      sequenceOrder.forEach((id) => {
        const cardWrapper = container.querySelector(`[data-id="${id}"]`);
        if (!cardWrapper) return;

        const photoCard = cardWrapper.querySelector(".photo-card");
        const tape = cardWrapper.querySelector(".tape-wrapper");
        const sticker = cardWrapper.querySelector(".scrapbook-sticker");

        const cfg = photoConfig[id];
        const photoData = GALLERY_PHOTOS.find((p) => p.id === id);
        const baseRotation = parseFloat(photoData?.rotation || "0");

        runningTime += cfg.delay;

        // Controlled drop entry with gravity (overshoot 2px, then settle in 140ms)
        // Shadow converges from translucent offset to solid neobrutalist on landing
        tl.fromTo(
          photoCard,
          {
            y: cfg.y,
            x: cfg.x,
            rotation: baseRotation + cfg.rotOffset,
            boxShadow: "14px 16px 0px rgba(61,46,37,0.12)",
            opacity: 0
          },
          {
            y: 2,
            x: 0,
            rotation: baseRotation + (cfg.rotOffset > 0 ? 0.6 : -0.6),
            boxShadow: "10px 10px 0px rgba(61,46,37,0.45)",
            opacity: 1,
            duration: cfg.duration,
            ease: "power2.in"
          },
          runningTime
        ).to(
          photoCard,
          {
            y: 0,
            rotation: baseRotation,
            boxShadow: "8px 8px 0px #3D2E25",
            duration: 0.14,
            ease: "power1.out"
          }
        );

        // Tape Choreography: Fades and presses down 120ms after card lands
        if (tape) {
          tl.fromTo(
            tape,
            { opacity: 0, scale: 1.25 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.22,
              ease: "power3.out"
            },
            `>-0.02`
          );
        }

        // Card Level Sticker reveals
        if (sticker) {
          tl.fromTo(
            sticker,
            { opacity: 0, scale: 0.98 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            },
            `>-0.1`
          );
        }
      });

      // =========================================================================
      // SCENE 6: Recipe Note Unfolds (Delicate rotateX unfold unfolding)
      // =========================================================================
      const recipeWrapper = container.querySelector('[data-id="recipe"]');
      if (recipeWrapper) {
        const recipeInner = recipeWrapper.querySelector(".recipe-card-inner");
        const recipeTape = recipeWrapper.querySelector(".tape-wrapper");

        runningTime += 0.18; // slight pause before unfolding

        tl.fromTo(
          recipeInner,
          {
            opacity: 0,
            rotateX: -85,
            transformOrigin: "top center"
          },
          {
            opacity: 1,
            rotateX: 0,
            duration: 0.65,
            ease: "power2.out"
          },
          runningTime
        );

        // Recipe Note Tape fades and presses
        if (recipeTape) {
          tl.fromTo(
            recipeTape,
            { opacity: 0, scale: 1.25 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.25,
              ease: "power3.out"
            },
            `+=0.12` // 120ms pause after unfolding settles
          );
        }
      }

      // =========================================================================
      // SCENE 7: Stickers Reveal (Canvas stickers appear after neighbors settle)
      // =========================================================================
      const canvasStickers = container.querySelectorAll(".scrapbook-canvas-sticker");
      if (canvasStickers.length > 0) {
        tl.fromTo(
          canvasStickers,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.25,
            ease: "power2.out"
          },
          `+=0.15`
        );
      }

      // =========================================================================
      // MANDATORY SCROLL REPLAY SYSTEM
      // Triggers when 65-70% of the section enters the viewport (top 65%)
      // Resets silently on scroll exit (prevents duplicate animation or freeze)
      // =========================================================================
      ScrollTrigger.create({
        trigger: container,
        start: "top 65%", // 65-70% threshold
        onEnter: () => tl.play(0),
        onLeave: () => tl.pause().progress(0),
        onEnterBack: () => tl.play(0),
        onLeaveBack: () => tl.pause().progress(0)
      });

      // Smooth Parallax setup on Scroll Trigger
      gsap.to(canvasRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, sectionRef);

    // Dynamic ScrollTrigger refresh on load
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full bg-[#FAF9F6] text-[#3D2E25] border-b-4 border-[#3D2E25] overflow-hidden flex items-center justify-center pt-[96px] pb-[96px] pl-[72px] lg:pl-[80px] pr-[72px] lg:pr-[80px] scroll-mt-20 z-10"
      aria-labelledby="gallery-title"
    >
      {/* Soft rounded organic corner blobs - Colored #E66B7B with thick 4px border, 35%-40% outside the viewport */}
      <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none z-0 translate-x-[36%] translate-y-[-36%]">
        <svg className="w-full h-full text-[#E66B7B]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 35 0 C 45 40 70 70 100 80 L 100 0 Z"
            fill="currentColor"
            stroke="#3D2E25"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none z-0 translate-x-[-36%] translate-y-[36%]">
        <svg className="w-full h-full text-[#E66B7B]" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 0,90 C 40,90 60,30 110,70 C 140,95 160,150 200,200 L 0,200 Z"
            fill="currentColor"
            stroke="#3D2E25"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Two-Column Flex Layout - Prevents absolute positioned canvas overflow on medium/large screens */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 z-10 relative">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Clean Editorial Copy Column (35% Width) */}
        {/* ========================================================================= */}
        <div ref={leftColumnRef} className="w-full lg:w-[35%] flex flex-col items-start text-left select-none relative z-10">
          {/* Primary & Medium Left Column Accents */}
          <Sticker type="flower" className="absolute -top-10 -left-6 w-11 h-11 rotate-[-12deg]" />
          <Sticker type="heart" className="absolute -top-4 right-12 w-10 h-10 rotate-[15deg]" />
          
          {/* Tiny Micro Accents */}
          <Sticker type="diamond" className="absolute top-[80px] -left-8 w-5 h-5 rotate-[15deg]" />
          <Sticker type="sparkle" className="absolute top-[140px] right-4 w-4.5 h-4.5" />
          <Sticker type="heart" className="absolute bottom-[20px] -left-6 w-4.5 h-4.5 rotate-[-20deg]" />

          {/* Sparkle decoration (Yellow sparkle sticker with black outline) */}
          <Sticker type="sparkle" className="absolute top-[-38px] left-[200px] w-6 h-6 scrapbook-canvas-sticker" />
          
          {/* Red heart sticker next to heading */}
          <Sticker type="heart" className="absolute top-[18px] left-[150px] w-5 h-5 rotate-[-10deg] scrapbook-canvas-sticker" />

          <h2 id="gallery-title" className="font-cherry text-6xl lg:text-7xl text-[#3B2A22] uppercase leading-[0.92] tracking-[0.03em] font-bold mb-8 max-w-[430px] w-full">
            OUR <br />
            GALLERY
          </h2>
          
          <p className="font-manrope text-base sm:text-lg leading-[1.7] text-[#3B2A22]/85 max-w-[360px] w-full mb-10 relative z-10 font-medium">
            Moments, memories & magic from our kitchen to yours.
          </p>

          {/* Thin hand-drawn curved loop arrow in #E66B7B, sitting behind CTA and pointing rightwards with reveal mask */}
          <svg className="absolute bottom-[-15px] left-[150px] w-20 h-20 text-[#E66B7B] pointer-events-none z-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" aria-hidden="true">
            <defs>
              <mask id="scribble-mask">
                <path
                  className="scribble-mask-path"
                  d="M 10 10 C 30 10, 50 40, 45 70 C 40 90, 70 80, 85 65"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="10"
                  strokeDasharray="150"
                  strokeDashoffset="150"
                />
                <path
                  className="scribble-mask-arrow"
                  d="M 72 65 L 85 65 L 82 50"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="10"
                  strokeDasharray="40"
                  strokeDashoffset="40"
                />
              </mask>
            </defs>
            {/* Dashed loop path hidden initially by the mask */}
            <path 
              d="M 10 10 C 30 10, 50 40, 45 70 C 40 90, 70 80, 85 65" 
              strokeDasharray="6 6" 
              mask="url(#scribble-mask)"
            />
            {/* Solid Arrow head hidden initially by the mask */}
            <path 
              d="M 72 65 L 85 65 L 82 50" 
              mask="url(#scribble-mask)"
            />
          </svg>

          {/* Premium Blue CTA Button */}
          <button 
            className="h-[56px] px-8 bg-[#2D6DFF] text-[#FAF9F6] border-4 border-[#3B2A22] shadow-[6px_6px_0px_0px_#3B2A22] hover:shadow-[8px_8px_0px_0px_#3B2A22] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_#3B2A22] active:translate-x-[2px] active:translate-y-[2px] rounded-full font-manrope font-bold text-sm uppercase tracking-wider flex items-center gap-3.5 transition-all duration-250 ease-out relative z-10 group"
            aria-label="Explore our flavors"
          >
            <span>EXPLORE OUR FLAVORS</span>
            <div className="w-11 h-11 rounded-full bg-[#F4FF18] border-3 border-[#3B2A22] flex items-center justify-center group-hover:rotate-8 transition-transform duration-250 ease-out" aria-hidden="true">
              <svg className="w-5 h-5 text-[#3B2A22]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3l14 9-14 9z" />
              </svg>
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Stable Collage Canvas Wrapper (65% Width) */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[65%] flex justify-center lg:justify-end relative h-[450px] sm:h-[530px] md:h-[580px] lg:h-[620px] overflow-visible">
          
          {/* DESKTOP/MOBILE CANVAS: Scaled proportionally on viewports with group/canvas hover dimming (Enlarged by 18% per Master Prompt) */}
          <div ref={canvasRef} className="group/canvas relative w-[910px] h-[530px] select-none transform scale-[0.50] xs:scale-[0.55] sm:scale-[0.74] md:scale-[0.87] lg:scale-[1.10] lg:-translate-x-6 origin-center lg:origin-right">
            
            {/* Render 8 Photo Cards from config */}
            {activePhotos.map((photo) => (
              <div key={photo.id} data-id={photo.id} className="photo-card-wrapper absolute" style={{ top: photo.desktopPosition.top || "0px", left: photo.desktopPosition.left || "0px", zIndex: photo.zIndex, width: photo.width, height: photo.height }}>
                {/* Static tape anchored to wrapper container so it doesn't move when card is tilted */}
                {photo.attachment.type === "tape" && <MaskingTape color={photo.attachment.color} />}
                
                <PhotoCard config={photo} />
              </div>
            ))}

            {/* Render 1 Recipe Note (Bottom Center, raised by 12px, top: 408px) */}
            <div data-id="recipe" className="scrapbook-extra absolute" style={{ top: "408px", left: "215px", zIndex: 8, width: "190px", height: "120px" }}>
              {/* Static tape anchored to wrapper container so it doesn't move */}
              <MaskingTape color="beige" />
              
              <RecipeCard />
            </div>

            {/* ========================================================================= */}
            {/* VISUAL HIERARCHY DECORATION SYSTEM */}
            {/* ========================================================================= */}
            
            {/* ------------------------------------------------------------------------- */}
            {/* ⭐ TIER 1: 3-4 PRIMARY STICKERS (Slightly Larger, Prominent Focal Points - 44px-56px) */}
            {/* ------------------------------------------------------------------------- */}
            <Sticker type="seal" className="absolute top-[20px] right-[40px] z-12 w-14 h-14" />
            <Sticker type="smiley-yellow" className="absolute top-[195px] left-[215px] z-12 w-12 h-12 scrapbook-canvas-sticker" />
            <Sticker type="heart" className="absolute top-[-30px] left-[80px] z-12 w-11 h-11 rotate-[-15deg] scrapbook-canvas-sticker" />
            <Sticker type="flower" className="absolute bottom-[40px] right-[280px] z-12 w-11 h-11 rotate-[-8deg]" />

            {/* ------------------------------------------------------------------------- */}
            {/* ✨ TIER 2: 6-8 MEDIUM DOODLES (Supporting Accents - 28px-36px) */}
            {/* ------------------------------------------------------------------------- */}
            <CroissantDoodle className="absolute top-[-25px] left-[190px] w-8 h-8 rotate-[-15deg] z-12" />
            <RollingPinDoodle className="absolute top-[40px] right-[140px] w-9 h-9 rotate-[25deg] z-12" />
            <WhiskDoodle className="absolute bottom-[30px] left-[60px] w-8 h-8 rotate-[-30deg] z-12" />
            <BakeryStamp className="absolute top-[280px] right-[60px] z-12" />
            <Sticker type="smiley-blue" className="absolute bottom-[40px] left-[130px] z-12 w-9 h-9 scrapbook-canvas-sticker" />
            <Decoration type="arrow-up" className="absolute top-[215px] left-[165px] z-12" />
            <Decoration type="arrow-down" className="absolute bottom-[290px] left-[320px] z-12" />
            <Sticker type="diamond" className="absolute top-[180px] left-[100px] z-12 w-8 h-8 rotate-[15deg]" />

            {/* ------------------------------------------------------------------------- */}
            {/* • TIER 3: 10-12 TINY SPARKLES / HEARTS / DUSTING (Micro Accents - 14px-20px) */}
            {/* ------------------------------------------------------------------------- */}
            {/* Tiny Red/Pink Hearts */}
            <Sticker type="heart" className="absolute top-[110px] left-[260px] z-12 w-4.5 h-4.5 rotate-[12deg]" />
            <Sticker type="heart" className="absolute top-[15px] right-[180px] z-12 w-4 h-4 rotate-[-8deg]" />
            <Sticker type="heart" className="absolute bottom-[80px] left-[20px] z-12 w-4.5 h-4.5 rotate-[18deg]" />
            <Sticker type="heart" className="absolute bottom-[200px] right-[40px] z-12 w-4 h-4 rotate-[-12deg]" />

            {/* Tiny Yellow Sparkles */}
            <Sticker type="sparkle" className="absolute top-[80px] left-[420px] z-12 w-5 h-5" />
            <Sticker type="sparkle" className="absolute bottom-[185px] right-[230px] z-12 w-4.5 h-4.5" />
            <Sticker type="sparkle" className="absolute top-[20px] right-[350px] z-12 w-4 h-4 rotate-[15deg]" />
            <Sticker type="sparkle" className="absolute bottom-[100px] left-[440px] z-12 w-4.5 h-4.5" />

            {/* Micro 8-Pointed Star Specks */}
            <svg className="absolute top-[120px] left-[15px] w-4 h-4 text-[#3B2A22]/60 pointer-events-none rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </svg>
            
            <svg className="absolute bottom-[140px] right-[180px] w-4 h-4 text-[#3B2A22]/60 pointer-events-none -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </svg>

            {/* Coffee Beans & Chocolate Crumbs */}
            <Decoration type="coffee" className="absolute top-[20px] left-[430px] z-12 rotate-[-12deg]" />
            <Decoration type="coffee" className="absolute bottom-[100px] right-[430px] z-12 rotate-[35deg]" />
            <Decoration type="chocolate" className="absolute top-[350px] left-[30px] z-12" />
            <Decoration type="chocolate" className="absolute top-[280px] left-[210px] z-12 rotate-[-15deg]" />

            {/* Steam Swirls */}
            <SteamSwirlsDoodle className="absolute top-[160px] left-[380px] w-6 h-6 z-12 opacity-60" />

          </div>
        </div>
      </div>
    </section>
  );
}
