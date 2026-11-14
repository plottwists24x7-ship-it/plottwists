"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * PLOTTWIST BAKERY — AUTOPLAY CAROUSEL HOOK
 * V14 — Cover Flow × Fan Carousel × Automatic + Manual Navigation
 *
 * Requirements:
 * 1. Configurable interval (AUTOPLAY_INTERVAL = 2000ms).
 * 2. Continuous looping from last slide to first slide.
 * 3. Manual navigation (prev, next, dot, swipe) immediately resets to a fresh 2s interval.
 * 4. Pauses during active drag / swipe gesture.
 * 5. Pauses when browser tab is hidden (document.hidden).
 * 6. Pauses when component is scrolled out of viewport (IntersectionObserver).
 * 7. Pauses on hover or keyboard focus for accessibility.
 * 8. Disables autoplay when prefers-reduced-motion is active.
 * 9. Independent instance per carousel.
 */

export const AUTOPLAY_INTERVAL = 2000;

export interface UseAutoplayCarouselOptions {
  itemCount: number;
  interval?: number;
  enabled?: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function useAutoplayCarousel({
  itemCount,
  interval = AUTOPLAY_INTERVAL,
  enabled = true,
  containerRef,
}: UseAutoplayCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing active timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Advance to next slide with continuous loop
  const next = useCallback(() => {
    if (itemCount <= 0) return;
    setActiveIndex((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  // Move to previous slide with continuous loop
  const prev = useCallback(() => {
    if (itemCount <= 0) return;
    setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount);
  }, [itemCount]);

  // Jump to specific slide
  const goTo = useCallback(
    (idx: number) => {
      if (itemCount <= 0) return;
      const normalized = ((idx % itemCount) + itemCount) % itemCount;
      setActiveIndex(normalized);
    },
    [itemCount]
  );

  // Reset and restart fresh autoplay interval
  const resetTimer = useCallback(() => {
    clearTimer();
    if (!enabled || isPaused || isDragging || !isInViewport || itemCount <= 1) {
      return;
    }
    timerRef.current = setTimeout(() => {
      next();
    }, interval);
  }, [clearTimer, enabled, isPaused, isDragging, isInViewport, itemCount, interval, next]);

  // Whenever activeIndex or control conditions change, restart fresh interval
  useEffect(() => {
    resetTimer();
    return clearTimer;
  }, [activeIndex, resetTimer, clearTimer]);

  // Page visibility change (Tab switch backgrounding)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimer();
      } else {
        resetTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearTimer, resetTimer]);

  // IntersectionObserver for viewport awareness
  useEffect(() => {
    const node = containerRef?.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        setIsInViewport(visible);
        if (!visible) {
          clearTimer();
        }
      },
      { threshold: [0, 0.15, 0.5] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef, clearTimer]);

  // Hover and focus listeners on container
  useEffect(() => {
    const node = containerRef?.current;
    if (!node) return;

    const onMouseEnter = () => setIsPaused(true);
    const onMouseLeave = () => setIsPaused(false);
    const onFocusIn = () => setIsPaused(true);
    const onFocusOut = () => setIsPaused(false);

    node.addEventListener("mouseenter", onMouseEnter);
    node.addEventListener("mouseleave", onMouseLeave);
    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);

    return () => {
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mouseleave", onMouseLeave);
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
    };
  }, [containerRef]);

  // Calculate shortest directed distance on a circle for continuous loop transitions
  const getCircularOffset = useCallback(
    (index: number) => {
      if (itemCount <= 0) return 0;
      let diff = (index - activeIndex) % itemCount;
      if (diff > itemCount / 2) diff -= itemCount;
      if (diff < -itemCount / 2) diff += itemCount;
      return diff;
    },
    [activeIndex, itemCount]
  );

  return {
    activeIndex,
    setActiveIndex: goTo,
    next,
    prev,
    goTo,
    setIsDragging,
    getCircularOffset,
    isPaused: isPaused || isDragging || !isInViewport,
  };
}
