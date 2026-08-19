"use client";

import { useEffect, useState } from "react";
import Space1 from "@/components/Space1";
import Space2 from "@/components/Space2";
import Space3 from "@/components/Space3";
import Space4 from "@/components/Space4";
import Space5 from "@/components/Space5";
import Space6 from "@/components/Space6";
import Space7 from "@/components/Space7";
import MaterialSurface from "@/components/common/MaterialSurface";

interface WorldProps {
  scrollProgress: number;
  prefersReduced: boolean;
}

interface Segment {
  zStart: number;
  zEnd: number;
  leftX: number;
  rightX: number;
  height: number;
  yOffset: number;
  label: string;
}

const segments: Segment[] = [
  // Space 1: Arrival (Large open entrance)
  { zStart: 500, zEnd: -750, leftX: -1000, rightX: 1000, height: 1200, yOffset: 0, label: "Arrival" },
  // Space 2: Silence (Compressed narrow corridor)
  { zStart: -750, zEnd: -2350, leftX: -500, rightX: 500, height: 750, yOffset: 0, label: "Silence" },
  // Space 3: Inspiration (Open creative studio)
  { zStart: -2350, zEnd: -4100, leftX: -900, rightX: 900, height: 1100, yOffset: 0, label: "Inspiration" },
  // Space 4: Observation (Side gallery with offset architecture - shifted left)
  { zStart: -4100, zEnd: -5900, leftX: -1200, rightX: -200, height: 1000, yOffset: 0, label: "Observation" },
  // Space 5: Creation (Tall industrial workshop)
  { zStart: -5900, zEnd: -7650, leftX: -700, rightX: 700, height: 1600, yOffset: 0, label: "Creation" },
  // Space 6: Reflection (Monumental cathedral pavilion)
  { zStart: -7650, zEnd: -9500, leftX: -800, rightX: 800, height: 1600, yOffset: 0, label: "Reflection" },
  // Space 7: Departure (Infinite transition space)
  { zStart: -9500, zEnd: -12000, leftX: -800, rightX: 800, height: 1000, yOffset: 0, label: "Departure" },
];

export default function World({ scrollProgress, prefersReduced }: WorldProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fade out architectural panels as we dolly past the window (from progress 0.90 to 0.96)
  let archOpacity = 1;
  if (scrollProgress >= 0.90 && !prefersReduced) {
    archOpacity = Math.max(0, 1 - (scrollProgress - 0.90) / 0.06);
  }

  return (
    <>
      {/* Continuous Architectural Shell */}
      {!prefersReduced && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300" 
          style={{ 
            transformStyle: "preserve-3d",
            opacity: archOpacity,
          }}
        >
          {segments.map((seg, idx) => {
            const length = Math.abs(seg.zStart - seg.zEnd);
            const zCenter = (seg.zStart + seg.zEnd) / 2;
            const width = seg.rightX - seg.leftX;
            const xCenter = (seg.leftX + seg.rightX) / 2;

            // Programmatic rafter layout spacing
            const rafterSpacing = isMobile ? 400 : 250;
            const rafterCount = Math.floor(length / rafterSpacing);
            const raftersArray = Array.from({ length: rafterCount });

            // Find next segment for physical threshold step wall joints
            const nextSeg = segments[idx + 1];

            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 1. FLOOR PANEL: Aged timber planks */}
                <MaterialSurface
                  type="walnut"
                  className="absolute border-y border-[#2A1F19]/20"
                  style={{
                    width: `${width}px`,
                    height: `${length}px`,
                    left: "50%",
                    marginLeft: `-${width / 2}px`,
                    transform: `rotateX(90deg) translate3d(${xCenter}px, ${-zCenter}px, ${-(seg.height / 2) + seg.yOffset}px)`,
                    boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)",
                  }}
                />

                {/* 2. LEFT WALL PANEL: Concrete slab */}
                <MaterialSurface
                  type="concrete"
                  className="absolute"
                  style={{
                    width: `${length}px`,
                    height: `${seg.height}px`,
                    top: "50%",
                    marginTop: `-${seg.height / 2 + seg.yOffset}px`,
                    transform: `rotateY(90deg) translate3d(0px, 0px, ${seg.leftX}px) translate3d(${zCenter}px, 0px, 0px)`,
                    boxShadow: "inset 0 0 80px rgba(0,0,0,0.25)",
                  }}
                />

                {/* 3. RIGHT WALL PANEL: Concrete slab */}
                <MaterialSurface
                  type="concrete"
                  className="absolute"
                  style={{
                    width: `${length}px`,
                    height: `${seg.height}px`,
                    top: "50%",
                    marginTop: `-${seg.height / 2 + seg.yOffset}px`,
                    transform: `rotateY(-90deg) translate3d(0px, 0px, ${-seg.rightX}px) translate3d(${-zCenter}px, 0px, 0px)`,
                    boxShadow: "inset 0 0 80px rgba(0,0,0,0.25)",
                  }}
                />

                {/* 4. CEILING PANEL: Concrete slab */}
                <MaterialSurface
                  type="concrete"
                  className="absolute"
                  style={{
                    width: `${width}px`,
                    height: `${length}px`,
                    left: "50%",
                    marginLeft: `-${width / 2}px`,
                    transform: `rotateX(-90deg) translate3d(${xCenter}px, ${zCenter}px, ${-(seg.height / 2) - seg.yOffset}px)`,
                    boxShadow: "inset 0 0 80px rgba(0,0,0,0.3)",
                  }}
                />

                {/* 5. CEILING RAFTERS (Timber beams programmatically instanced in Z depth) */}
                {raftersArray.map((_, rIdx) => {
                  const rZ = seg.zStart - rIdx * rafterSpacing;
                  return (
                    <MaterialSurface
                      key={`rafter-${rIdx}`}
                      type="walnut"
                      className="absolute border-b border-[#2A1F19]/45 shadow-md"
                      style={{
                        width: `${width}px`,
                        height: "12px",
                        left: "50%",
                        marginLeft: `-${width / 2}px`,
                        transform: `translate3d(${xCenter}px, -50%, ${rZ}px) translate3d(0px, ${-seg.height / 2 + 6}px, 0px)`,
                      }}
                    />
                  );
                })}

                {/* 6. STRUCTURAL CONCRETE PORTALS / ARCHES (Joining the thresholds) */}
                <MaterialSurface
                  type="concrete"
                  className="absolute border border-graphite-ink/15 shadow-2xl"
                  style={{
                    width: "24px",
                    height: `${seg.height}px`,
                    left: "50%",
                    marginLeft: `${seg.leftX}px`,
                    transform: `translate3d(0px, -50%, ${seg.zEnd}px)`,
                  }}
                />
                <MaterialSurface
                  type="concrete"
                  className="absolute border border-graphite-ink/15 shadow-2xl"
                  style={{
                    width: "24px",
                    height: `${seg.height}px`,
                    left: "50%",
                    marginLeft: `${seg.rightX - 24}px`,
                    transform: `translate3d(0px, -50%, ${seg.zEnd}px)`,
                  }}
                />

                {/* 7. TRANSVERSE JOINT WALLS (Seals gaps when room widths step to prevent void leakage) */}
                {nextSeg && (
                  <>
                    {/* Left side transverse joint wall */}
                    {seg.leftX !== nextSeg.leftX && (
                      <MaterialSurface
                        type="concrete"
                        className="absolute border-l border-graphite-ink/20 shadow-md"
                        style={{
                          width: `${Math.abs(seg.leftX - nextSeg.leftX)}px`,
                          height: `${Math.max(seg.height, nextSeg.height)}px`,
                          left: "50%",
                          marginLeft: `${Math.min(seg.leftX, nextSeg.leftX)}px`,
                          transform: `translate3d(0px, -50%, ${seg.zEnd}px)`,
                        }}
                      />
                    )}

                    {/* Right side transverse joint wall */}
                    {seg.rightX !== nextSeg.rightX && (
                      <MaterialSurface
                        type="concrete"
                        className="absolute border-r border-graphite-ink/20 shadow-md"
                        style={{
                          width: `${Math.abs(seg.rightX - nextSeg.rightX)}px`,
                          height: `${Math.max(seg.height, nextSeg.height)}px`,
                          left: "50%",
                          marginLeft: `${Math.min(seg.rightX, nextSeg.rightX)}px`,
                          transform: `translate3d(0px, -50%, ${seg.zEnd}px)`,
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Spatial Rooms positioned absolutely in 3D depth */}
      <Space1 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
      <Space2 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
      <Space3 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
      <Space4 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
      <Space5 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
      <Space6 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
      <Space7 scrollProgress={scrollProgress} prefersReduced={prefersReduced} isMobile={isMobile} />
    </>
  );
}
