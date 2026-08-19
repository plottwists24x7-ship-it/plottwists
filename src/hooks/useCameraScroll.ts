"use client";

import { useEffect, useState, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CameraScrollData {
  scrollProgress: number;
  scrollVelocity: number;
  activeScene: number;
}

export function useCameraScroll(
  viewportRef: RefObject<HTMLDivElement | null>,
  cameraRef: RefObject<HTMLDivElement | null>,
  totalScenes: number,
  prefersReduced: boolean = false
): CameraScrollData {
  const [scrollData, setScrollData] = useState<CameraScrollData>({
    scrollProgress: 0,
    scrollVelocity: 0,
    activeScene: 0,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const camera = cameraRef.current;
    if (!viewport || !camera) return;

    let driftRAF: number;
    let baseTimeline: gsap.core.Timeline;

    // Build timeline for Z-depth movement
    const ctx = gsap.context(() => {
      // If prefers reduced motion is enabled, we only update progress state
      if (prefersReduced) {
        ScrollTrigger.create({
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const velocity = self.getVelocity();
            const interval = 1 / totalScenes;
            let active = Math.floor(progress / interval);
            if (active >= totalScenes) active = totalScenes - 1;

            setScrollData({
              scrollProgress: progress,
              scrollVelocity: velocity,
              activeScene: active,
            });
          },
        });
        return;
      }

      // Symmetrical timeline normalized to exactly 100 duration keyframes
      baseTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.8, // Heavy cinematic momentum scrub
          onUpdate: (self) => {
            const progress = self.progress;
            const MathVelocity = self.getVelocity();
            const interval = 1 / totalScenes;
            let active = Math.floor(progress / interval);
            if (active >= totalScenes) active = totalScenes - 1;

            setScrollData({
              scrollProgress: progress,
              scrollVelocity: MathVelocity,
              activeScene: active,
            });
          },
        },
      });

      // 1. Z-DOL-Y AND X-DODGING PATHWAYS (Dodge frames & scaffolding to prevent clipping)
      // Total travel duration is exactly 100 units on scroll trigger
      baseTimeline
        // Room 1: Arrival (0 to 12% scroll)
        .to(camera, { z: 1200, x: 0, duration: 12, ease: "sine.inOut" }, 0)
        // Room 2: Silence (12 to 26% scroll) - Sway right to dodge easel/linens
        .to(camera, { z: 1700, x: 25, duration: 7, ease: "power1.out" }, 12)
        .to(camera, { z: 2900, x: 15, duration: 7, ease: "sine.inOut" }, 19)
        // Room 3: Inspiration (26 to 40% scroll) - Center framing desk
        .to(camera, { z: 3400, x: -10, duration: 7, ease: "power1.out" }, 26)
        .to(camera, { z: 4700, x: -5, duration: 7, ease: "sine.inOut" }, 33)
        // Room 4: Observation (40 to 54% scroll) - Swing right to dodge shelves
        .to(camera, { z: 5200, x: 30, duration: 7, ease: "power1.out" }, 40)
        .to(camera, { z: 6500, x: 20, duration: 7, ease: "sine.inOut" }, 47)
        // Room 5: Creation (54 to 68% scroll) - Swing left to dodge heavy easel
        .to(camera, { z: 7000, x: -35, duration: 7, ease: "power1.out" }, 54)
        .to(camera, { z: 8200, x: -15, duration: 7, ease: "sine.inOut" }, 61)
        // Room 6: Reflection (68 to 82% scroll) - Center frame monolith
        .to(camera, { z: 8700, x: 0, duration: 7, ease: "power2.out" }, 68)
        .to(camera, { z: 10100, x: 0, duration: 7, ease: "sine.inOut" }, 75)
        // Room 7: Departure (82 to 100% scroll) - Align perfectly center for exit
        .to(camera, { z: 12000, x: 0, duration: 18, ease: "power1.inOut" }, 82);

      // 2. HEAD ROTATIONS & PAUSES (Attentive head turns locked under max 5 degrees)
      
      // Space 1 (Entrance): Downward tilt passing timber portal
      baseTimeline
        .to(camera, { rotationX: 1.5, rotationY: 0.6, duration: 5, ease: "sine.inOut" }, 1)
        .to(camera, { rotationX: 0, rotationY: 0, duration: 5, ease: "sine.inOut" }, 6);

      // Space 2 (Silence): Attentive turn to cracked easel frame (right wall)
      baseTimeline
        .to(camera, { rotationY: -4.2, rotationX: 0.8, duration: 8, ease: "power1.inOut" }, 12)
        .to(camera, { rotationY: 0, rotationX: 0, duration: 6, ease: "power1.inOut" }, 20);

      // Space 3 (Inspiration): Look slightly to the right sketches
      baseTimeline
        .to(camera, { rotationY: -3.0, rotationX: -0.5, duration: 8, ease: "power1.inOut" }, 26)
        .to(camera, { rotationY: 0, rotationX: 0, duration: 6, ease: "power1.inOut" }, 34);

      // Space 4 (Observation): Look slightly to the left wood shelves
      baseTimeline
        .to(camera, { rotationY: 3.8, rotationX: 0.8, duration: 8, ease: "power1.inOut" }, 40)
        .to(camera, { rotationY: 0, rotationX: 0, duration: 6, ease: "power1.inOut" }, 48);

      // Space 5 (Creation): Gaze slightly right to the massive canvas
      baseTimeline
        .to(camera, { rotationY: -4.0, rotationX: -0.6, duration: 8, ease: "power1.inOut" }, 54)
        .to(camera, { rotationY: 0, rotationX: 0, duration: 6, ease: "power1.inOut" }, 62);

      // Space 6 (Reflection): Gaze slowly upwards at central monolith & skylight
      baseTimeline
        .to(camera, { rotationY: -1.2, rotationX: -4.2, duration: 10, ease: "power2.inOut" }, 68)
        .to(camera, { rotationY: 0, rotationX: 0, duration: 8, ease: "power1.inOut" }, 78);

      // Space 7 (Departure): Lock straight ahead for white bloom transition
      baseTimeline.to(camera, { rotationY: 0, rotationX: 0, duration: 10, ease: "sine.inOut" }, 82);
    });

    // 3. HANDHELD CAMERA BREATHING (Continuous Lissajous micro-sways)
    if (!prefersReduced) {
      const breathingRig = camera.querySelector("#camera-breathing-rig") as HTMLElement || camera;
      let startTime = Date.now();
      
      const runBreathingDrift = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        // Lissajous curves simulating breathing chest movements
        const driftX = Math.sin(elapsed * 0.45) * 0.04;
        const driftY = Math.cos(elapsed * 0.35 + 0.5) * 0.05;
        const driftZ = Math.sin(elapsed * 0.25) * 0.015;
        const rotZ = Math.sin(elapsed * 0.15) * 0.15; // Natural handheld tilt sway

        if (breathingRig) {
          gsap.set(breathingRig, {
            x: driftX * 30,
            y: driftY * 30,
            z: driftZ * 12,
            rotationZ: rotZ,
            overwrite: "auto",
          });
        }

        driftRAF = requestAnimationFrame(runBreathingDrift);
      };
      driftRAF = requestAnimationFrame(runBreathingDrift);
    }

    return () => {
      ctx.revert();
      if (driftRAF) cancelAnimationFrame(driftRAF);
    };
  }, [viewportRef, cameraRef, totalScenes, prefersReduced]);

  return scrollData;
}

export default useCameraScroll;
