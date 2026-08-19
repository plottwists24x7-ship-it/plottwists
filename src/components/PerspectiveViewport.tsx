"use client";

import { ReactNode, RefObject } from "react";
import LinenOverlay from "@/components/common/LinenOverlay";

interface PerspectiveViewportProps {
  children: ReactNode;
  viewportRef: RefObject<HTMLDivElement | null>;
}

export default function PerspectiveViewport({ children, viewportRef }: PerspectiveViewportProps) {
  return (
    <div className="relative w-full h-screen bg-canvas-base selection:bg-linen-shadow">
      {/* Dynamic Linen texture overlay */}
      <LinenOverlay />

      {/* Volumetric viewport containing the camera timeline */}
      <div ref={viewportRef} className="perspective-viewport">
        {children}
      </div>
    </div>
  );
}
