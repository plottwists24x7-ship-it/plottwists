"use client";

import { useEffect, useRef, useState } from "react";

type HoverType = "none" | "canvas" | "sketch" | "frame" | "button" | "object";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<HoverType>("none");

  // Mouse coordinate refs
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  
  // Interpolated cursor coordinate refs
  const dotX = useRef(0);
  const dotY = useRef(0);
  const ringX = useRef(0);
  const ringY = useRef(0);

  // Animation frame handler
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Enable custom cursor active class on body
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseX.current && !mouseY.current) {
        setIsVisible(true);
      }
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Event delegation for advanced material-tactile hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest("a, button, [role='button'], .interactive-trigger, button *")) {
        setHoverType("button");
      } else if (target.closest(".canvas-frame, [class*='CanvasFrame']")) {
        setHoverType("canvas");
      } else if (target.closest("[class*='MaterialSurface'][class*='paper']")) {
        setHoverType("sketch");
      } else if (target.closest("[class*='MaterialSurface'][class*='walnut']")) {
        setHoverType("frame");
      } else if (target.closest("[class*='MaterialSurface'][class*='stone'], [class*='MaterialSurface'][class*='concrete']")) {
        setHoverType("object");
      } else {
        setHoverType("none");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    // Dynamic RAF Lerp Loop
    const tick = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        // Dot tracking: high speed, small latency
        dotX.current += (mouseX.current - dotX.current) * 0.4;
        dotY.current += (mouseY.current - dotY.current) * 0.4;
        dot.style.transform = `translate3d(${dotX.current}px, ${dotY.current}px, 0px) translate3d(-50%, -50%, 0px)`;

        // Ring tracking: soft inertia lag with tactile micro-vibrations
        ringX.current += (mouseX.current - ringX.current) * 0.15;
        ringY.current += (mouseY.current - ringY.current) * 0.15;

        // Apply programmatic force-feedback vibration near buttons
        const vx = window.document.body.classList.contains("custom-cursor-hover-active") 
          ? (Math.random() - 0.5) * 1.2 
          : 0;
        const vy = window.document.body.classList.contains("custom-cursor-hover-active") 
          ? (Math.random() - 0.5) * 1.2 
          : 0;

        ring.style.transform = `translate3d(${ringX.current + vx}px, ${ringY.current + vy}px, 0px) translate3d(-50%, -50%, 0px)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      document.body.classList.remove("custom-cursor-hover-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Update body class based on hoverType for RAF lookup
  useEffect(() => {
    if (hoverType === "button" || hoverType === "canvas") {
      document.body.classList.add("custom-cursor-hover-active");
    } else {
      document.body.classList.remove("custom-cursor-hover-active");
    }
  }, [hoverType]);

  if (!isVisible) return null;

  // Compute tactile ring styles based on hovered material properties
  let ringStyles: React.CSSProperties = {};
  switch (hoverType) {
    case "button":
      ringStyles = {
        transform: "scale(1.5)",
        borderColor: "var(--color-sienna-oxide)",
        borderWidth: "1.5px",
        borderRadius: "50%",
        boxShadow: "0 0 10px rgba(162, 90, 56, 0.25)",
      };
      break;
    case "canvas":
      ringStyles = {
        transform: "scale(1.4)",
        borderColor: "var(--color-gold-lustre)",
        borderStyle: "dashed",
        borderRadius: "50%",
        boxShadow: "0 0 12px rgba(194, 166, 121, 0.4)",
      };
      break;
    case "sketch":
      ringStyles = {
        transform: "scale(0.8)",
        borderColor: "var(--color-graphite-ink)",
        borderRadius: "50%",
      };
      break;
    case "frame":
      ringStyles = {
        transform: "scale(1.3)",
        borderColor: "var(--color-walnut-grain)",
        borderRadius: "4px", // Tactile square frame boundary!
      };
      break;
    case "object":
      ringStyles = {
        transform: "scale(1.2)",
        borderColor: "var(--color-stone-shade)",
        borderWidth: "2px",
        borderRadius: "50%",
      };
      break;
    default:
      ringStyles = {
        transform: "scale(1)",
        borderColor: "rgba(34,34,33,0.2)",
        borderRadius: "50%",
      };
  }

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-sienna-oxide rounded-full pointer-events-none z-[9999] will-change-transform"
      />
      {/* Outer Ring with spring scale transitions */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-graphite-ink/20 rounded-full pointer-events-none z-[9998] will-change-transform transition-all duration-300 ease-out"
        style={ringStyles}
      />
    </>
  );
}
