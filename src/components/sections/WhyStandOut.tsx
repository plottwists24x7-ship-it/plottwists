"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "nutrient",
    title: "Nutrient-Enriched Recipes",
    description:
      "We enhance our traditional recipes with high-protein flours and natural fibers, giving your body wholesome energy.",
    color: "#FAF9F6", // cream
    icon: (
      <svg
        className="w-12 h-12 stroke-[#3D2E25]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "certified",
    title: "Certified Ingredients",
    description:
      "Every ingredient is selected from traceable, non-GMO organic farms to ensure clean energy in every bite.",
    color: "#FAF9F6", // cream
    icon: (
      <svg
        className="w-12 h-12 stroke-[#3D2E25]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "diabetic",
    title: "Diabetic-Friendly Choices",
    description:
      "We offer low-sugar, low-glycemic treats sweetened with premium agave and raw stevia extracts.",
    color: "#FAF9F6", // cream
    icon: (
      <svg
        className="w-12 h-12 stroke-[#3D2E25]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "texture",
    title: "Soft & Moist Texture",
    description:
      "Thanks to our slow sourdough rising process, all breads and cakes maintain a melt-in-the-mouth texture.",
    color: "#FAF9F6", // cream
    icon: (
      <svg
        className="w-12 h-12 stroke-[#3D2E25]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
      </svg>
    ),
  },
];

export default function WhyStandOut() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      const children = cardsRef.current?.children;
      if (children) {
        gsap.fromTo(
          Array.from(children),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#4B2773] text-[#FAF9F6] pt-32 pb-40 overflow-hidden"
    >
      {/* Top Wave Border Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[-1px]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[40px] fill-[#FAF9F6]"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        
        {/* Title */}
        <div className="text-center mb-20 select-none">
          <span className="font-bubble text-[0.65rem] uppercase tracking-[0.3em] font-semibold text-[#DDF51A] mb-4 block">
            Why Us
          </span>
          <h2 className="font-bubble text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-none text-[#FAF9F6]">
            why our treats stand out
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {FEATURES.map((feat) => (
            <div
              key={feat.id}
              className="bg-[#FAF9F6] text-[#3D2E25] p-8 rounded-2xl neo-border neo-shadow flex flex-col items-center text-center transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0px_0px_#3D2E25]"
            >
              {/* Feature Icon */}
              <div className="w-16 h-16 rounded-full border-3 border-[#3D2E25] bg-[#BFF0E1] flex items-center justify-center mb-6 shadow-sm select-none">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="font-bubble text-xl uppercase tracking-wide mb-4">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs font-semibold text-[#3D2E25]/85 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Wave Border Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[40px] fill-[#FAF9F6] rotate-180"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}
