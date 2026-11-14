import React, { useRef, useState } from 'react';
import { ReviewItem } from './ReviewsData';
import { ReviewCard } from './ReviewCard';

interface ReviewCarouselProps {
  reviews: ReviewItem[];
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = React.memo(({ reviews }) => {
  // Duplicate reviews 2x for exact -50% infinite seamless CSS marquee loop on desktop
  const duplicatedReviews = [...reviews, ...reviews];

  const mobileReviewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!mobileReviewRef.current) return;
    const { scrollLeft, clientWidth } = mobileReviewRef.current;
    const cardWidth = clientWidth * 0.85;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(reviews.length - 1, Math.max(0, idx)));
  };

  const scrollToReview = (idx: number) => {
    if (!mobileReviewRef.current) return;
    const cardWidth = mobileReviewRef.current.clientWidth * 0.85;
    mobileReviewRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth'
    });
    setActiveIndex(idx);
  };

  const scrollReview = (dir: number) => {
    const nextIdx = Math.min(reviews.length - 1, Math.max(0, activeIndex + dir));
    scrollToReview(nextIdx);
  };

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

      {/* ── MOBILE: TOUCH SWIPE CAROUSEL (One Card at a Time, Accessible Snap) ── */}
      <div className="block lg:hidden w-full relative">
        <div
          ref={mobileReviewRef}
          onScroll={handleScroll}
          className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 pb-4 touch-pan-x"
          style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
        >
          {reviews.map((item, idx) => (
            <div
              key={`mobile-rev-${item.id}-${idx}`}
              className="snap-center shrink-0 w-[84vw] max-w-[340px] flex justify-center"
            >
              <ReviewCard item={item} index={idx} />
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots & Controls */}
        <div className="flex items-center justify-between px-6 mt-3 max-w-xs mx-auto">
          <button
            onClick={() => scrollReview(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous review"
            className="w-9 h-9 rounded-full bg-[#FAF4E8] border-2 border-[#3B2A22] shadow-[2px_2px_0_#3B2A22] flex items-center justify-center text-[#3B2A22] disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-0.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Review pagination">
            {reviews.map((_, i) => (
              <button
                key={`rev-dot-${i}`}
                onClick={() => scrollToReview(i)}
                role="tab"
                aria-selected={activeIndex === i}
                aria-label={`Go to review ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === i
                    ? "w-6 h-2 bg-[#EF5B5B] shadow-xs"
                    : "w-2 h-2 bg-[#3B2A22]/25 hover:bg-[#3B2A22]/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => scrollReview(1)}
            disabled={activeIndex === reviews.length - 1}
            aria-label="Next review"
            className="w-9 h-9 rounded-full bg-[#FAF4E8] border-2 border-[#3B2A22] shadow-[2px_2px_0_#3B2A22] flex items-center justify-center text-[#3B2A22] disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-0.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
});

ReviewCarousel.displayName = 'ReviewCarousel';


