"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  serial: string;
  badgeText: string;
}

const PRODUCTS: Product[] = [
  {
    id: "oreo-fudge",
    name: "Oreo Fudge",
    description: "Rich chocolate fudge folded with crunchy Oreo crumbs and a soft melt-in-your-mouth centre.",
    image: "/images/baker-where/prod_oreo_fudge.jpg",
    serial: "01 / 07",
    badgeText: "Double Choc 🍫",
  },
  {
    id: "pancakes",
    name: "Pancakes",
    description: "Fluffy golden stacks made for slow mornings, soft bites, extra syrup, and rich whipped cream.",
    image: "/images/baker-where/prod_pancakes.jpg",
    serial: "02 / 07",
    badgeText: "Fluffy Stacks 🥞",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    description: "Coffee-soaked layers of soft sponge, creamy mascarpone, and a dusting of dark espresso cocoa.",
    image: "/images/baker-where/prod_tiramisu.jpg",
    serial: "03 / 07",
    badgeText: "Espresso Kick ☕",
  },
  {
    id: "cheesecake",
    name: "Cheesecake",
    description: "Silky, creamy, lightly baked cheesecake with a buttery biscuit base and fresh berry drizzle.",
    image: "/images/baker-where/prod_cheesecake.jpg",
    serial: "04 / 07",
    badgeText: "Lightly Baked 🍓",
  },
  {
    id: "biscoff-brownie",
    name: "Biscoff Brownie",
    description: "Deep fudgy brownie finished with caramelised Biscoff spread and a warm gooey centre.",
    image: "/images/baker-where/prod_biscoff_brownie.jpg",
    serial: "05 / 07",
    badgeText: "Gooey Centre 🍪",
  },
  {
    id: "red-velvet",
    name: "Red Velvet Cake",
    description: "Tender cocoa-red sponge layered with smooth cream-cheese frosting and white chocolate curls.",
    image: "/images/baker-where/prod_red_velvet.jpg",
    serial: "06 / 07",
    badgeText: "Cream Frosting 🧁",
  },
  {
    id: "chocolate-chip",
    name: "Chocolate Chip Cookies",
    description: "Crisp around the edges, soft in the middle, and packed with molten chocolate chips.",
    image: "/images/baker-where/prod_chocolate_cookies.jpg",
    serial: "07 / 07",
    badgeText: "Molten Chips ✨",
  },
];

interface FloatingSticker {
  id: number;
  top: string;
  left: string;
  size: string;
  img: string;
  xDir: number;
  yDir: number;
}

const FLOATING_STICKERS: FloatingSticker[] = [
  { id: 1, top: "8%", left: "6%", size: "w-16 h-16 sm:w-20 sm:h-20", img: "/images/baker-where/prod_pancakes.jpg", xDir: -150, yDir: -120 },
  { id: 2, top: "12%", left: "22%", size: "w-20 h-20 sm:w-24 sm:h-24", img: "/images/baker-where/prod_tiramisu.jpg", xDir: -80, yDir: -180 },
  { id: 3, top: "6%", left: "82%", size: "w-18 h-18 sm:w-22 sm:h-22", img: "/images/baker-where/prod_biscoff_brownie.jpg", xDir: 120, yDir: -160 },
  { id: 4, top: "16%", left: "90%", size: "w-16 h-16 sm:w-20 sm:h-20", img: "/images/baker-where/prod_oreo_fudge.jpg", xDir: 180, yDir: -100 },
  { id: 5, top: "45%", left: "5%", size: "w-20 h-20 sm:w-24 sm:h-24", img: "/images/baker-where/prod_cheesecake.jpg", xDir: -180, yDir: -20 },
  { id: 6, top: "78%", left: "8%", size: "w-16 h-16 sm:w-20 sm:h-20", img: "/images/baker-where/prod_red_velvet.jpg", xDir: -150, yDir: 120 },
  { id: 7, top: "82%", left: "28%", size: "w-20 h-20 sm:w-24 sm:h-24", img: "/images/baker-where/prod_chocolate_cookies.jpg", xDir: -60, yDir: 180 },
  { id: 8, top: "48%", left: "88%", size: "w-20 h-20 sm:w-24 sm:h-24", img: "/images/baker-where/prod_pancakes.jpg", xDir: 180, yDir: 10 },
  { id: 9, top: "76%", left: "85%", size: "w-18 h-18 sm:w-22 sm:h-22", img: "/images/baker-where/prod_tiramisu.jpg", xDir: 150, yDir: 140 },
  { id: 10, top: "84%", left: "68%", size: "w-16 h-16 sm:w-20 sm:h-20", img: "/images/baker-where/prod_biscoff_brownie.jpg", xDir: 80, yDir: 180 },
];

const AsteriskStarDoodle = ({ className = "w-7 h-7 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
  </svg>
);

const HeartDoodle = ({ className = "w-6 h-6 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SparkleDoodle = ({ className = "w-6 h-6 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 Q13 9 20 12 Q13 15 12 22 Q11 15 4 12 Q11 9 12 2 Z" />
  </svg>
);

const SwirlDoodle = ({ className = "w-7 h-7 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
  </svg>
);

const LoopArrowDoodle = ({ className = "w-7 h-7 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M3 10h10a5 5 0 0 1 5 5v3M15 15l3 3 3-3" />
  </svg>
);

const SmileyDoodle = ({ className = "w-7 h-7 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M8 15s1.5 2 4 2 4-2 4-2" />
  </svg>
);

const FlowerDoodle = ({ className = "w-7 h-7 text-[#6B2C12]" }: { className?: string }) => (
  <svg className={`${className} pointer-events-none opacity-85`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 5a3 3 0 0 0 0 6 3 3 0 0 0 0-6zM12 13a3 3 0 0 0 0 6 3 3 0 0 0 0-6zM5 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0zM13 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0z" />
  </svg>
);

import { useAdmin } from "@/context/AdminContext";

export default function Products() {
  const { bakes } = useAdmin();
  const activeProducts = bakes && bakes.length > 0 ? bakes : PRODUCTS;

  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const introContentRef = useRef<HTMLDivElement>(null);
  const stickersContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeProductNum, setActiveProductNum] = useState("01");

  const scrollToInstagramCTA = () => {
    const element = document.getElementById("instagram-cta") || document.getElementById("contact-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        if (prefersReduced) return;
        
        if (stickersContainerRef.current) {
          gsap.fromTo(
            stickersContainerRef.current.querySelectorAll(".floating-sticker-wrapper"),
            { autoAlpha: 0, y: 150 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.03,
              duration: 1.0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: introContentRef.current,
                start: "top 80%",
              }
            }
          );
        }

        const cards = containerRef.current?.querySelectorAll(".mobile-product-card");
        if (cards) {
          gsap.fromTo(
            Array.from(cards),
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current?.querySelector(".mobile-showcase-container"),
                start: "top 85%",
              }
            }
          );
        }
      });

      mm.add("(min-width: 1024px)", () => {
        if (prefersReduced) return;
        if (!trackRef.current || !pinWrapperRef.current) return;

        const maxScrollX = () => {
          if (!trackRef.current) return 0;
          return trackRef.current.scrollWidth - window.innerWidth;
        };

        const stickers = stickersContainerRef.current?.querySelectorAll(".floating-sticker-wrapper") || [];

        stickers.forEach((sticker) => {
          const randomRot = gsap.utils.random(-25, 25);
          gsap.set(sticker, { autoAlpha: 0, y: 350, rotation: randomRot, scale: 0.9 });
        });

        gsap.set(trackRef.current, { x: window.innerWidth });

        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapperRef.current,
            start: "top top",
            end: () => `+=${window.innerWidth + maxScrollX()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              if (progressBarRef.current) {
                gsap.set(progressBarRef.current, { width: `${progress * 100}%` });
              }

              const panels = trackRef.current?.querySelectorAll(".product-panel");
              let currentPanelIndex = 0;
              if (panels) {
                let minDistance = Infinity;
                panels.forEach((panel, i) => {
                  const rect = panel.getBoundingClientRect();
                  const distance = Math.abs(rect.left);
                  if (distance < minDistance) {
                    minDistance = distance;
                    currentPanelIndex = i;
                  }
                });
              }
              setActiveProductNum(String(currentPanelIndex + 1).padStart(2, "0"));
            }
          }
        });

        masterTimeline.fromTo(
          stickers,
          { autoAlpha: 0, y: 350, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.20,
            stagger: {
              each: 0.01,
              from: "random",
            },
            ease: "power2.out",
          },
          0.0
        );

        masterTimeline.to(
          stickers,
          {
            autoAlpha: 0,
            y: (i) => FLOATING_STICKERS[i]?.yDir || -150,
            x: (i) => FLOATING_STICKERS[i]?.xDir || 0,
            scale: 0.85,
            duration: 0.15,
            ease: "power2.in",
          },
          0.20
        );

        masterTimeline.to(
          introContentRef.current,
          {
            autoAlpha: 0,
            y: -30,
            duration: 0.15,
            ease: "power2.in",
          },
          0.20
        );

        const trackTween = masterTimeline.fromTo(
          trackRef.current,
          { x: () => window.innerWidth },
          {
            x: () => -maxScrollX(),
            ease: "none",
            duration: 0.65,
          },
          0.35
        );

        const panels = trackRef.current.querySelectorAll(".product-panel");
        panels.forEach((panel) => {
          const img = panel.querySelector(".panel-image-wrapper");
          const textElements = panel.querySelectorAll(".panel-fade-up");

          gsap.fromTo(
            img,
            { scale: 0.96, autoAlpha: 0, y: 30 },
            {
              scale: 1,
              autoAlpha: 1,
              y: 0,
              ease: "power1.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: trackTween,
                start: "left 85%",
                end: "left 25%",
                scrub: true,
              }
            }
          );

          gsap.fromTo(
            textElements,
            { autoAlpha: 0, x: 20 },
            {
              autoAlpha: 1,
              x: 0,
              stagger: 0.05,
              ease: "power1.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: trackTween,
                start: "left 80%",
                end: "left 30%",
                scrub: true,
              }
            }
          );
        });

        const handleImageLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", handleImageLoad);
        return () => window.removeEventListener("load", handleImageLoad);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="bakes"
      ref={containerRef}
      style={{
        backgroundColor: "#FFFCEB",
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255, 235, 110, 0.18) 12px, rgba(255, 235, 110, 0.18) 26px)",
      }}
      className="w-full relative text-[#3D2E25] scroll-mt-20 overflow-hidden border-b-4 border-[#6B2C12]/20 select-none"
    >
      {/* ========================================================================= */}
      {/* DESKTOP PINNED HORIZONTAL SCROLL CONTAINER */}
      {/* ========================================================================= */}
      <div
        ref={pinWrapperRef}
        className="w-full h-screen relative overflow-hidden hidden lg:block z-10"
      >
        {/* Floating Dessert Stickers Background */}
        <div ref={stickersContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {FLOATING_STICKERS.map((sticker) => (
            <div
              key={sticker.id}
              className="absolute floating-sticker-wrapper pointer-events-auto cursor-default"
              style={{ top: sticker.top, left: sticker.left }}
            >
              <div className={`${sticker.size} relative filter drop-shadow-[4px_4px_0px_#6B2C12]`}>
                <div className="absolute inset-0 bg-white rounded-2xl p-1 border-2 border-white">
                  <Image
                    src={sticker.img}
                    alt="Floating dessert sticker"
                    fill
                    sizes="96px"
                    priority={sticker.id <= 4}
                    className="object-cover rounded-xl scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INTRO HERO STATE - DENSE SCATTERED HAND-DRAWN DOODLES */}
        <div ref={introContentRef} className="absolute inset-0 h-full w-full flex flex-col items-center justify-center z-10 px-6 my-auto select-none">
          <AsteriskStarDoodle className="absolute top-[18%] left-[26%] w-10 h-10 text-[#6B2C12] animate-paper-wobble" />
          <AsteriskStarDoodle className="absolute bottom-[20%] right-[22%] w-9 h-9 text-[#6B2C12] animate-paper-float" />
          <HeartDoodle className="absolute top-[22%] right-[26%] w-8 h-8 text-[#6B2C12] rotate-12" />
          <HeartDoodle className="absolute bottom-[24%] left-[22%] w-7 h-7 text-[#6B2C12] -rotate-12" />
          <SparkleDoodle className="absolute top-[16%] left-[48%] w-7 h-7 text-[#6B2C12]" />
          <SparkleDoodle className="absolute bottom-[28%] left-[16%] w-6 h-6 text-[#6B2C12]" />
          <SparkleDoodle className="absolute bottom-[30%] right-[16%] w-6 h-6 text-[#6B2C12]" />
          <SwirlDoodle className="absolute top-[32%] left-[18%] w-9 h-9 text-[#6B2C12] -rotate-12" />
          <SwirlDoodle className="absolute bottom-[20%] right-[32%] w-8 h-8 text-[#6B2C12] rotate-12" />
          <LoopArrowDoodle className="absolute bottom-[38%] left-[34%] w-8 h-8 text-[#6B2C12] rotate-[-45deg]" />
          <SmileyDoodle className="absolute top-[28%] right-[18%] w-8 h-8 text-[#6B2C12] rotate-6" />
          <FlowerDoodle className="absolute top-[15%] right-[36%] w-8 h-8 text-[#6B2C12] -rotate-6" />

          <h2 className="font-cherry text-[72px] sm:text-[84px] text-[#3B2A22] uppercase leading-[0.92] tracking-[0.03em] text-center font-bold mb-6">
            OUR BAKES
          </h2>
          
          <p className="font-manrope text-[#4A4A4A] text-[18px] sm:text-[20px] font-medium leading-[1.7] max-w-[460px] text-center mb-8">
            From wholesome muffins and buttery croissants to rich brownies, soft cookies, and celebration cakes—made fresh daily.
          </p>

          <div className="flex flex-col items-center gap-3">
            <div className="relative inline-flex items-center group cursor-pointer">
              <button className="bg-[#1E63D5] text-white font-manrope font-bold text-[17px] px-[32px] py-[16px] rounded-full shadow-[0_10px_25px_rgba(59,42,34,0.18)] group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_rgba(59,42,34,0.22)] transition-all duration-250 ease-out flex items-center gap-2 cursor-pointer">
                <span>Scroll To Explore</span>
              </button>
              <div className="w-[52px] h-[52px] rounded-full bg-[#FFE63B] border-2 border-[#3B2A22] shadow-md flex items-center justify-center -ml-5 z-10 group-hover:rotate-8 transition-transform duration-250 ease-out">
                <svg className="w-6 h-6 text-[#3B2A22]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
            </div>
            <div className="w-1.5 h-8 bg-[#3B2A22] rounded-full animate-bounce mt-2" />
          </div>
        </div>

        {/* HORIZONTAL TRACK OF ALL BAKES */}
        <div
          ref={trackRef}
          className="flex h-full items-center pl-16 pr-[20vw] absolute top-0 left-0 z-20"
          style={{ width: "fit-content" }}
        >
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="product-panel w-[85vw] max-w-6xl h-full flex items-center justify-center px-12 relative flex-shrink-0"
            >
              <div className="w-full grid grid-cols-12 gap-12 lg:gap-[80px] items-center">
                
                {/* Left Side (45% -> 5 cols): Editorial Info */}
                <div className="col-span-5 flex flex-col items-start text-left relative">
                  
                  {/* Left Column Doodles */}
                  <AsteriskStarDoodle className="absolute -top-10 -left-6 w-8 h-8 text-[#3B2A22] animate-paper-wobble" />
                  <FlowerDoodle className="absolute -top-8 right-4 w-7 h-7 text-[#3B2A22]" />
                  <HeartDoodle className="absolute -bottom-6 left-12 w-6 h-6 text-[#3B2A22] rotate-12" />

                  <span className="panel-fade-up font-manrope text-xs sm:text-sm uppercase tracking-[0.2em] text-[#F43F5E] mb-2 block font-extrabold">
                    {product.serial}
                  </span>

                  <h3 className="panel-fade-up font-cherry text-4xl xl:text-5xl uppercase tracking-[0.03em] text-[#3B2A22] leading-none mb-5 font-bold">
                    {product.name}
                  </h3>

                  <p className="panel-fade-up font-manrope text-[#4A4A4A] text-base xl:text-[18px] font-medium leading-[1.7] mb-8 max-w-md">
                    {product.description}
                  </p>

                  <div 
                    onClick={scrollToInstagramCTA}
                    className="panel-fade-up relative inline-flex items-center group cursor-pointer"
                  >
                    <button 
                      onClick={scrollToInstagramCTA}
                      aria-label={`Try this bake: ${product.name}`}
                      className="bg-[#1E63D5] text-white font-manrope font-bold text-base px-7 py-3.5 rounded-full shadow-[0_8px_20px_rgba(59,42,34,0.18)] group-hover:-translate-y-1 group-hover:shadow-[0_12px_28px_rgba(59,42,34,0.22)] transition-all duration-250 ease-out flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFE63B]"
                    >
                      <span>Try This Bake</span>
                    </button>
                    <div className="w-11 h-11 rounded-full bg-[#FFE63B] border-2 border-[#3B2A22] shadow-md flex items-center justify-center -ml-4 z-10 group-hover:rotate-8 transition-transform duration-250 ease-out">
                      <svg className="w-5 h-5 text-[#3B2A22]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* Right Side (55% -> 7 cols): Organic Yellow Splash + White Sticker Product Image */}
                <div className="col-span-7 relative flex justify-center items-center">
                  
                  {/* Dense Scattered Hand-Drawn Chocolate Doodles around Yellow Splash */}
                  <AsteriskStarDoodle className="absolute -top-8 left-10 w-9 h-9 text-[#6B2C12] animate-paper-wobble" />
                  <AsteriskStarDoodle className="absolute -bottom-8 right-10 w-8 h-8 text-[#6B2C12] animate-paper-float" />
                  <HeartDoodle className="absolute -bottom-4 left-16 w-7 h-7 text-[#6B2C12] rotate-[-15deg]" />
                  <SparkleDoodle className="absolute top-8 right-6 w-7 h-7 text-[#6B2C12]" />
                  <SwirlDoodle className="absolute -bottom-6 right-20 w-8 h-8 text-[#6B2C12] rotate-12" />
                  <LoopArrowDoodle className="absolute top-12 left-4 w-7 h-7 text-[#6B2C12] -rotate-45" />
                  <SmileyDoodle className="absolute -top-6 right-24 w-8 h-8 text-[#6B2C12] rotate-12" />

                  {/* Oversized Organic Saturated Yellow SVG Splash (#FFF400) */}
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center select-none z-0 opacity-100 scale-110">
                    <svg viewBox="0 0 500 420" className="w-[520px] h-[440px] fill-[#FFF400]">
                      <path d="M 150,30 Q 280,-10 400,40 Q 500,90 480,220 Q 460,350 360,400 Q 240,440 120,380 Q 10,320 20,200 Q 30,60 150,30 Z" />
                    </svg>
                  </div>

                  {/* Product Sticker Frame */}
                  <div className="panel-image-wrapper relative z-10 w-[360px] h-[360px] xl:w-[420px] xl:h-[420px] p-3.5 bg-white rounded-[40px] border-4 border-white shadow-[0_22px_50px_rgba(0,0,0,0.18)] transform rotate-[-2deg]">
                    <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-[#FAF9F6]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="420px"
                        className="object-cover scale-105"
                      />
                    </div>

                    <div className="absolute -top-3 -right-3 bg-[#FFE63B] text-[#6B2C12] border-2 border-[#6B2C12] shadow-sm px-3.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider transform rotate-6">
                      {product.badgeText}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

        {/* PROGRESS BAR BOTTOM DOCK */}
        <div className="absolute bottom-6 left-16 right-16 z-30 flex flex-col gap-2 pointer-events-none select-none">
          <div className="flex justify-between items-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#6B2C12]/80">
            <span>PLOTWIST BAKERY FAVORITES</span>
            <span>{activeProductNum} / 07</span>
          </div>
          <div className="w-full h-1.5 bg-[#6B2C12]/15 rounded-full overflow-hidden">
            <div ref={progressBarRef} className="h-full bg-[#6B2C12] w-0" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE VERTICAL SHOWCASE SECTION (Premium, Thumb-Friendly, Conversion-Focused) */}
      {/* ========================================================================= */}
      <div className="w-full py-12 xs:py-16 px-4 xs:px-6 block lg:hidden relative z-10">
        
        <div className="text-center mb-8 xs:mb-12 select-none">
          <h2
            style={{ fontFamily: "var(--font-fasthand-g), 'FastHand', 'Fasthand', cursive, sans-serif" }}
            className="text-4xl xs:text-5xl text-[#6B2C12] uppercase leading-[0.9] tracking-tight mb-2.5 font-bold"
          >
            OUR BAKES
          </h2>
          <p
            style={{ fontFamily: "var(--font-workforce-g), 'Workforce', sans-serif" }}
            className="text-xs xs:text-sm text-[#4A4A4A] max-w-sm mx-auto font-medium"
          >
            Scroll to discover our fresh handcrafted creations.
          </p>
        </div>

        <div className="mobile-showcase-container max-w-xl mx-auto flex flex-col gap-6 xs:gap-8">
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="mobile-product-card w-full p-5 xs:p-6 bg-white border-[3.5px] border-[#6B2C12] shadow-[5px_5px_0px_0px_#6B2C12] xs:shadow-[6px_6px_0px_0px_#6B2C12] rounded-3xl flex flex-col items-center gap-5 relative overflow-hidden"
            >
              <div className="relative w-40 h-40 xs:w-48 xs:h-48 flex-shrink-0 p-2 bg-[#FFF400] rounded-2xl shadow-inner">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-white border-2 border-white shadow-xs">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 192px, 300px"
                    className="object-cover scale-105"
                  />
                </div>
                {product.badgeText && (
                  <div className="absolute -top-2.5 -right-2.5 bg-[#FFE63B] text-[#6B2C12] border-2 border-[#6B2C12] shadow-sm px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider transform rotate-6">
                    {product.badgeText}
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col items-center text-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#6B2C12] text-[#FFFCEB] mb-2.5">
                  {product.serial || "SPECIAL"}
                </span>
                
                <h4
                  style={{ fontFamily: "var(--font-fasthand-g), 'FastHand', 'Fasthand', cursive, sans-serif" }}
                  className="text-2xl xs:text-3xl uppercase tracking-wider text-[#6B2C12] mb-1.5 font-bold"
                >
                  {product.name}
                </h4>

                <p
                  style={{ fontFamily: "var(--font-workforce-g), 'Workforce', sans-serif" }}
                  className="text-xs xs:text-sm leading-relaxed text-[#4A4A4A] font-medium mb-5 max-w-sm"
                >
                  {product.description}
                </p>

                <button
                  onClick={scrollToInstagramCTA}
                  aria-label={`Try this bake: ${product.name}`}
                  className="w-full max-w-xs min-h-[48px] bg-[#1E63D5] hover:bg-[#1853b3] active:scale-[0.98] text-white px-6 py-3 rounded-full text-xs xs:text-sm font-bold uppercase tracking-wider shadow-[3px_3px_0_#6B2C12] flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFE63B]"
                >
                  <span>Try This Bake</span>
                  <span className="text-sm">↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
