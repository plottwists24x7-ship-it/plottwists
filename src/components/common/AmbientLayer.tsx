"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type AmbientTone = "warm-glow" | "cool-shadow" | "golden-hour" | "twilight";

interface AmbientLayerProps {
  tone: AmbientTone;
  opacity?: number;
  className?: string;
  children?: ReactNode;
}

export default function AmbientLayer({
  tone,
  opacity = 0.15,
  className,
  children,
}: AmbientLayerProps) {
  // Configures the baseline atmospheric color casts defined by lighting design tokens
  const tones: Record<AmbientTone, string> = {
    "warm-glow": "bg-[radial-gradient(circle_at_20%_20%,rgba(194,166,121,0.15),transparent_80%)]",
    "cool-shadow": "bg-[radial-gradient(ellipse_at_bottom_right,rgba(78,81,67,0.15),transparent_70%)]",
    "golden-hour": "bg-gradient-to-tr from-[#A25A38]/10 via-[#C2A679]/5 to-transparent",
    twilight: "bg-gradient-to-b from-[#0a0a0b]/20 via-[#4E5143]/10 to-[#222221]/40",
  };

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none transition-all duration-1000",
        tones[tone],
        className
      )}
      style={{ opacity }}
    >
      {children}
    </div>
  );
}
