"use client";

import { ReactNode } from "react";
import LinenOverlay from "@/components/common/LinenOverlay";

interface SceneContainerProps {
  children: ReactNode;
}

export default function SceneContainer({ children }: SceneContainerProps) {
  return (
    <div className="relative w-full h-screen bg-canvas-base selection:bg-linen-shadow">
      {/* Dynamic Linen texture overlay */}
      <LinenOverlay />

      {/* Volumetric viewport containing the camera timeline */}
      <div className="perspective-viewport">
        {children}
      </div>
    </div>
  );
}
