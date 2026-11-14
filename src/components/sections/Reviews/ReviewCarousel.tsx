"use client";

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ReviewItem } from './ReviewsData';
import { ReviewCard } from './ReviewCard';
import { SPRINGS } from '@/lib/motion';
import { useAutoplayCarousel, AUTOPLAY_INTERVAL } from '@/hooks/useAutoplayCarousel';

interface ReviewCarouselProps {
  reviews: ReviewItem[];
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = React.memo(({ reviews }) => {
  // Duplicate reviews 2x for exact -50% infinite seamless CSS marquee loop on desktop (LOCKED & PRESERVED)
  const duplicatedReviews = [...reviews, ...reviews];

  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    activeIndex,
    next: nextReview,
    prev: prevReview,
    goTo: goToReview,
    setIsDragging,
    getCircularOffset,
  } = useAutoplayCarousel({
    itemCount: reviews.length,
    interval: AUTOPLAY_INTERVAL,
    enabled: !shouldReduceMotion,
    containerRef: mobileContainerRef,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevReview();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextReview();
    }
  };

  const fanSpring = shouldReduceMotion
    ? { duration: 0.25, ease: "easeInOut" as const }
    : { type: "spring" as const, stiffness: 240, damping: 24, mass: 0.9 };

  return (
    <div className="w-full overflow-hidden py-4 sm:py-6 relative select-none">
      
      {/* ── DESKTOP: SINGLE CONTINUOUS HORIZONTAL MARQUEE ROW (LOCKED & PRESERVED) ── */}
      <div className="hidden lg:flex w-full overflow-hidden mask-gradient-x relative py-4">
        <div className="flex gap-8 md:gap-9 shrink-0 animate-marquee-left">
          {duplicatedReviews.map((item, idx) => (
            <ReviewCard key={`single-row-${item.id}-${idx}`} item={item} index={idx} />
          ))}
        </div>
      </div>

      {/* ── MOBILE: EXPRESSIVE OVERLAPPING FAN CAROUSEL (Scrapbook Deck & Autoplay) ── */}
      <div
        ref={mobileContainerRef}
        className="block lg:hidden w-full relative outline-none focus:ring-2 focus:ring-[#FFE066] rounded-2xl"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Customer review fan carousel, use arrow keys to navigate"
      >
        {/* Fan Stage Container */}
        <div className="relative w-full h-[285px] xs:h-[305px] flex items-center justify-center overflow-hidden my-1">
          {reviews.map((item, idx) => {
            const offset = getCircularOffset(idx);
            // Only render visible deck cards (within 2 offsets) for optimal performance
            if (Math.abs(offset) > 2) return null;

            let x = 0;
            let y = 0;
            let scale = 1;
            let rotateZ = 0;
            let opacity = 1;
            let zIndex = 30;
            let pointerEvents: "auto" | "none" = "auto";

            if (offset === 0) {
              // Active Hero Card (Foreground)
              x = 0;
              y = 0;
              scale = 1;
              rotateZ = 0;
              opacity = 1;
              zIndex = 30;
              pointerEvents = "auto";
            } else if (offset === 1) {
              // Next Card (Peeking Right & Tilted Clockwise)
              x = 18;
              y = 8;
              scale = 0.95;
              rotateZ = shouldReduceMotion ? 0 : 3.5;
              opacity = 0.88;
              zIndex = 20;
              pointerEvents = "auto";
            } else if (offset === 2) {
              // Deep Next Card (Bottom Right Deck)
              x = 32;
              y = 16;
              scale = 0.90;
              rotateZ = shouldReduceMotion ? 0 : 6.5;
              opacity = 0.45;
              zIndex = 10;
              pointerEvents = "none";
            } else if (offset === -1) {
              // Previous Card (Peeking Left & Tilted Counter-Clockwise)
              x = -18;
              y = 8;
              scale = 0.95;
              rotateZ = shouldReduceMotion ? 0 : -3.5;
              opacity = 0.88;
              zIndex = 15;
              pointerEvents = "auto";
            } else if (offset === -2) {
              // Deep Prev Card (Bottom Left Deck)
              x = -32;
              y = 16;
              scale = 0.90;
              rotateZ = shouldReduceMotion ? 0 : -6.5;
              opacity = 0.45;
              zIndex = 10;
              pointerEvents = "none";
            }

            return (
              <motion.div
                key={`mobile-rev-fan-${item.id}`}
                initial={false}
                animate={{
                  x,
                  y,
                  scale,
                  rotate: rotateZ,
                  opacity,
                  zIndex,
                }}
                transition={fanSpring}
                drag={offset === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  const threshold = 35;
                  const velocityThreshold = 250;
                  if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                    nextReview();
                  } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                    prevReview();
                  }
                }}
                onClick={() => {
                  if (offset !== 0) goToReview(idx);
                }}
                style={{
                  position: "absolute",
                  pointerEvents,
                  touchAction: "pan-y",
                }}
                className="flex items-center justify-center cursor-pointer"
              >
                <ReviewCard
                  item={item}
                  index={idx}
                  isActive={offset === 0}
                  isMobileFan={true}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Pagination Dots & Controls (Continuous Looping) */}
        <div className="flex items-center justify-between px-6 mt-3 max-w-xs mx-auto">
          <motion.button
            onClick={prevReview}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94, y: 1.5, boxShadow: "1px 1px 0 #3B2A22" }}
            transition={SPRINGS.press}
            aria-label="Previous review"
            className="w-9 h-9 rounded-full bg-[#FAF4E8] border-2 border-[#3B2A22] shadow-[2px_2px_0_#3B2A22] flex items-center justify-center text-[#3B2A22] hover:bg-[#FFE066]/30 transition-all cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2A22]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Review pagination">
            {reviews.map((_, i) => (
              <motion.button
                key={`rev-dot-${i}`}
                onClick={() => goToReview(i)}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.88 }}
                role="tab"
                aria-selected={activeIndex === i}
                aria-label={`Go to review ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF5B5B] ${
                  activeIndex === i
                    ? "w-6 h-2 bg-[#EF5B5B] shadow-xs"
                    : "w-2 h-2 bg-[#3B2A22]/25 hover:bg-[#3B2A22]/50"
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={nextReview}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94, y: 1.5, boxShadow: "1px 1px 0 #3B2A22" }}
            transition={SPRINGS.press}
            aria-label="Next review"
            className="w-9 h-9 rounded-full bg-[#FAF4E8] border-2 border-[#3B2A22] shadow-[2px_2px_0_#3B2A22] flex items-center justify-center text-[#3B2A22] hover:bg-[#FFE066]/30 transition-all cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B2A22]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>
      </div>

    </div>
  );
});

ReviewCarousel.displayName = 'ReviewCarousel';
