"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenis from "@/hooks/useLenis";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Products from "@/components/sections/Products";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import Closing from "@/components/sections/Closing";
import Footer from "@/components/sections/Footer";

export default function Home() {
  // Initialize Lenis smooth scroll
  useLenis(false);

  useEffect(() => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();

    // Recalculate ScrollTrigger points after full page asset load (prevents layout shifts)
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FAF9F6] text-[#3D2E25]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => handleScrollTo("bakes")}
        onStoryClick={() => handleScrollTo("story")}
      />

      {/* Story Section */}
      <Story />

      {/* Products Section */}
      <Products />

      {/* Gallery Section */}
      <Gallery />

      {/* Reviews Section */}
      <Reviews />

      {/* Closing Section */}
      <Closing />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
