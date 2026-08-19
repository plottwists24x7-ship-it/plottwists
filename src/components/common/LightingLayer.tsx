"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export type LightingType = "sunset" | "twilight" | "sunbeam" | "spotlight" | "ambient";

interface LightingLayerProps {
  type: LightingType;
  className?: string;
  intensity?: number; // 0 to 1 scale
  style?: React.CSSProperties;
}

export default function LightingLayer({
  type,
  className,
  intensity = 1.0,
  style,
}: LightingLayerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor global document scroll progress dynamically
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute barycentric interpolation weights for 9 continuous lighting stages
  const keys = [0.05, 0.18, 0.32, 0.46, 0.60, 0.74, 0.86, 0.93, 0.98];
  
  const weights = keys.map((key, i) => {
    const dist = Math.abs(scrollProgress - key);
    if (i === 0 && scrollProgress < key) return 1.0;
    if (i === keys.length - 1 && scrollProgress > key) return 1.0;

    const prevKey = keys[i - 1] ?? 0;
    const nextKey = keys[i + 1] ?? 1;
    const range = scrollProgress < key ? (key - prevKey) : (nextKey - key);

    return Math.max(0, 1 - dist / range);
  });

  const sum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map((w) => (sum > 0 ? w / sum : 0));

  // 9 Continuous Spatial Lighting Layers
  const layers = [
    // 1. Golden Hour (Space 1)
    {
      style: {
        background: "linear-gradient(135deg, rgba(249, 246, 240, 0.25) 0%, rgba(194, 166, 121, 0.15) 100%)",
        mixBlendMode: "screen" as const,
      },
    },
    // 2. Cool Hallway (Space 2)
    {
      style: {
        background: "linear-gradient(180deg, rgba(27, 28, 30, 0.45) 0%, transparent 100%)",
        mixBlendMode: "multiply" as const,
      },
    },
    // 3. Warm Studio (Space 3)
    {
      style: {
        background: "linear-gradient(45deg, rgba(162, 90, 56, 0.2) 0%, rgba(194, 166, 121, 0.12) 100%)",
        mixBlendMode: "screen" as const,
      },
    },
    // 4. Spotlights (Space 4)
    {
      style: {
        background: "radial-gradient(circle at center, rgba(13, 13, 14, 0.1) 0%, rgba(13, 13, 14, 0.88) 100%)",
        mixBlendMode: "multiply" as const,
      },
    },
    // 5. Workshop Lamp (Space 5)
    {
      style: {
        background: "radial-gradient(circle at 65% 35%, rgba(194, 166, 121, 0.25) 0%, rgba(10, 10, 11, 0.5) 100%)",
        mixBlendMode: "screen" as const,
      },
    },
    // 6. Skylight (Space 6)
    {
      style: {
        background: "linear-gradient(180deg, rgba(194, 166, 121, 0.18) 0%, transparent 80%)",
        mixBlendMode: "screen" as const,
      },
    },
    // 7. Sunset (Space 7)
    {
      style: {
        background: "linear-gradient(180deg, rgba(162, 90, 56, 0.28) 0%, rgba(78, 81, 67, 0.45) 100%)",
        mixBlendMode: "multiply" as const,
      },
    },
    // 8. White Bloom (Exit window plane)
    {
      style: {
        background: "rgba(255, 255, 255, 1.0)",
        mixBlendMode: "normal" as const,
      },
    },
    // 9. Black Void (Exit credits plane)
    {
      style: {
        background: "rgba(10, 10, 11, 1.0)",
        mixBlendMode: "normal" as const,
      },
    },
  ];

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none transition-all duration-300", className)}
      style={{
        opacity: intensity,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Layered GPU Composited Crossfades (Maintains 60/120fps scrolling speed) */}
      {layers.map((layer, idx) => (
        <div
          key={idx}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            ...layer.style,
            opacity: normalizedWeights[idx],
          }}
        />
      ))}
    </div>
  );
}
