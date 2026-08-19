"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import MaterialSurface from "./MaterialSurface";

export type FrameRatio = "portrait" | "landscape" | "square";

interface CanvasFrameProps {
  ratio: FrameRatio;
  borderWidth?: number; // thickness in pixels
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export default function CanvasFrame({
  ratio,
  borderWidth = 12,
  className,
  children,
  style,
}: CanvasFrameProps) {
  // Editorial ratios from Asset Production guidelines
  const ratioClasses: Record<FrameRatio, string> = {
    portrait: "w-[280px] h-[373px] md:w-[320px] md:h-[426px]",
    landscape: "w-[373px] h-[280px] md:w-[426px] md:h-[320px]",
    square: "w-[280px] h-[280px] md:w-[340px] md:h-[340px]",
  };

  return (
    <div
      className={cn(
        "canvas-primacy relative border-solid shadow-leaning-depth transform transition-all duration-700 bg-[#EFECE6]",
        ratioClasses[ratio],
        className
      )}
      style={{
        borderWidth: `${borderWidth}px`,
        borderColor: "var(--color-walnut-grain)",
        borderStyle: "solid",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Canvas substrate backboard */}
      <MaterialSurface type="canvas" className="w-full h-full">
        {/* Shadow Occlusions */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(34,34,33,0.06)] pointer-events-none" />

        {/* Embedded Content */}
        <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">
          {children}
        </div>
      </MaterialSurface>
    </div>
  );
}
