"use client";

import React from 'react';
import { REVIEWS_DATA } from './Reviews/ReviewsData';
import { ReviewHeader } from './Reviews/ReviewHeader';
import { ReviewCarousel } from './Reviews/ReviewCarousel';
import { BackgroundDecorations } from './Reviews/BackgroundDecorations';

export const Reviews: React.FC = () => {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="reviewsSection border-t-4 border-[#3B2A22] bg-[#FFF8EE] py-24 md:py-32 relative overflow-hidden select-none"
    >
      <BackgroundDecorations />

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16 xl:gap-20">
          
          {/* LEFT ZONE: Heading & Subtitle (30% Width on Desktop) */}
          <div className="w-full lg:w-[32%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            <ReviewHeader />
          </div>

          {/* RIGHT ZONE: Two-Row Infinite Marquee (68% Width on Desktop) */}
          <div className="w-full lg:w-[68%] min-w-0 overflow-hidden">
            <ReviewCarousel reviews={REVIEWS_DATA} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Reviews;


