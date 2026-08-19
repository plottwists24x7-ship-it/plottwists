"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export function useLenis(isLoading: boolean = false) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Initialize Lenis only after loading sequence finishes to correctly capture 800vh scroll height
    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Force ScrollTrigger to use native scroll updates
      ScrollTrigger.addEventListener("refresh", () => ScrollTrigger.update());
      return;
    }

    const lenis = new Lenis({
      duration: 1.8, // Heavy cinematic momentum deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    let rafId: number;
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }
    rafId = requestAnimationFrame(raf);

    // Force GSAP ScrollTrigger recalculation
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isLoading]);

  return lenisRef;
}

export default useLenis;
