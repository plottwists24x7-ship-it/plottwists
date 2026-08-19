"use client";

import { ReactNode, RefObject } from "react";

interface CameraRigProps {
  children: ReactNode;
  cameraRef: RefObject<HTMLDivElement | null>;
  scrollProgress: number;
  prefersReduced: boolean;
}

export default function CameraRig({ children, cameraRef, scrollProgress, prefersReduced }: CameraRigProps) {
  return (
    <div ref={cameraRef} className="camera-container">
      {/* Nested camera breathing rig to isolate drift from timeline dolly updates */}
      <div id="camera-breathing-rig" className="camera-container" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
