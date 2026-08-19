"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Closing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // Parallax float on the graphic container
      gsap.to(graphicRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="contact-section"
      className="relative w-full py-28 md:py-36 bg-[#FAF9F6] text-[#3D2E25] px-6 md:px-12 lg:px-24 overflow-hidden border-b-4 border-[#3D2E25] scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Donut sticker overlaying yellow flower */}
        <div ref={graphicRef} className="md:col-span-6 relative w-full h-[350px] flex items-center justify-center">
          
          {/* Yellow Flower SVG background backing */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center select-none z-0">
            <svg viewBox="0 0 100 100" className="w-[110%] h-[110%] fill-[#DDF51A] animate-spin-slow">
              <path d="M50 20c-8.3 0-15 6.7-15 15 0 1.2.1 2.3.4 3.4C26.1 36.8 17 45.4 17 56c0 10.6 8.6 19.2 19.2 19.2 1.3 0 2.5-.1 3.7-.4C42.8 84.1 50.8 90 60 90c9.2 0 17.2-5.9 20.1-15.2 1.2.3 2.4.4 3.7.4C94.4 75.2 103 66.6 103 56c0-10.6-9.1-19.2-18.4-17.6.3-1.1.4-2.2.4-3.4 0-8.3-6.7-15-15-15-8.3 0-15 6.7-15 15 0-8.3-6.7-15-15-15z" />
            </svg>
          </div>

          {/* Floating Sticker Cutout Image */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full sticker-outline overflow-hidden shadow-2xl z-10 animate-float">
            <Image
              src="/images/baker-where/prod_red_velvet.jpg"
              alt="Pink strawberry frosted cake representational sticker"
              fill
              loading="lazy"
              sizes="300px"
              className="object-cover scale-105"
            />
          </div>
        </div>

        {/* Right Column: CTA Info and Neobrutalist Button */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
          <span className="font-bubble text-[0.65rem] uppercase tracking-[0.3em] font-semibold text-[#F43F5E] mb-4 block">
            Get In Touch
          </span>
          <h2 className="font-bubble text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#3D2E25] leading-[0.95] mb-8 max-w-lg">
            Ready to taste the difference? Contact us!
          </h2>

          {/* Adjusted Button sizing */}
          <button
            onClick={handleButtonClick}
            className="bg-[#F43F5E] text-[#FAF9F6] border-4 border-[#3D2E25] shadow-[4px_4px_0px_0px_#3D2E25] hover:bg-[#DDF51A] hover:text-[#3D2E25] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#3D2E25] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0px_0px_#3D2E25] px-8 py-4 rounded-full font-bubble text-sm sm:text-base uppercase tracking-widest flex items-center gap-3 transition-all duration-200 cursor-pointer focus-visible:outline-none"
          >
            <span>Contact Us</span>
            <div className="w-8 h-8 rounded-full bg-[#DDF51A] border-2 border-[#3D2E25] flex items-center justify-center font-bold text-xs select-none text-[#3D2E25]">
              →
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
