"use client";

import { cn } from "@/utils/cn";

interface TextureOverlayProps {
  type: "wood-grain" | "concrete-pitting" | "linen-weave" | "paper-deckle";
  opacity?: number;
  className?: string;
}

export default function TextureOverlay({
  type,
  opacity = 0.05,
  className,
}: TextureOverlayProps) {
  // SVG-based inline noise data / CSS background patterns for high performance and zero external dependencies
  const backgrounds: Record<TextureOverlayProps["type"], string> = {
    "wood-grain": `linear-gradient(90deg, rgba(34, 34, 33, 0.08) 1px, transparent 1px)`,
    "concrete-pitting": `radial-gradient(circle, rgba(34, 34, 33, 0.15) 1px, transparent 1px)`,
    "linen-weave": `
      linear-gradient(90deg, rgba(34, 34, 33, 0.06) 1px, transparent 1px),
      linear-gradient(0deg, rgba(34, 34, 33, 0.06) 1px, transparent 1px)
    `,
    "paper-deckle": `radial-gradient(ellipse at center, rgba(34, 34, 33, 0.03) 0%, transparent 100%)`,
  };

  const bgSizes: Record<TextureOverlayProps["type"], string> = {
    "wood-grain": "6px 100%",
    "concrete-pitting": "16px 16px",
    "linen-weave": "4px 4px",
    "paper-deckle": "100% 100%",
  };

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none mix-blend-multiply", className)}
      style={{
        backgroundImage: backgrounds[type],
        backgroundSize: bgSizes[type],
        opacity,
      }}
    />
  );
}
