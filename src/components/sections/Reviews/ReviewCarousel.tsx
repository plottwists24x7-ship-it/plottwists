import React from 'react';
import { ReviewItem } from './ReviewsData';
import { ReviewCard } from './ReviewCard';

interface ReviewCarouselProps {
  reviews: ReviewItem[];
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = React.memo(({ reviews }) => {
  // Duplicate all 10 unique reviews internally 3x for 100% seamless 60fps infinite marquee looping
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="w-full overflow-hidden py-6 relative select-none">
      
      {/* SINGLE CONTINUOUS HORIZONTAL MARQUEE ROW (Slides RIGHT to LEFT) */}
      <div className="flex w-full overflow-hidden mask-gradient-x relative py-4">
        <div className="flex gap-8 md:gap-9 shrink-0 animate-marquee-left">
          {duplicatedReviews.map((item, idx) => (
            <ReviewCard key={`single-row-${item.id}-${idx}`} item={item} index={idx} />
          ))}
        </div>
      </div>

    </div>
  );
});

ReviewCarousel.displayName = 'ReviewCarousel';


