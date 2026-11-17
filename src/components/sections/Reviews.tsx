"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ReviewHeader } from './Reviews/ReviewHeader';
import { ReviewCarousel } from './Reviews/ReviewCarousel';
import { BackgroundDecorations } from './Reviews/BackgroundDecorations';

import { useAdmin } from '@/context/AdminContext';
import { ReviewItem } from './Reviews/ReviewsData';
import { staggerContainerVariants } from '@/lib/motion';

export const Reviews: React.FC = () => {
  const { reviews } = useAdmin();
  const shouldReduceMotion = useReducedMotion();

  // Map only genuine reviews from database; zero mock data fallback
  const formattedReviews: ReviewItem[] = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    const PALETTES = [
      { bg: "#0F6B73", splash: "#EAF7F5", accent: "#DDF8F4", deco: "droplet" as const },
      { bg: "#B55A36", splash: "#F5E7D6", accent: "#FFECC8", deco: "cookie" as const },
      { bg: "#335C43", splash: "#F4F0E6", accent: "#DDF8F4", deco: "quote" as const },
      { bg: "#3D4EA3", splash: "#E9E3FF", accent: "#DDF8F4", deco: "sparkle" as const },
      { bg: "#7B2748", splash: "#F7DDD3", accent: "#FFECC8", deco: "stamp" as const },
    ];

    return reviews.map((r, i) => {
      const palette = PALETTES[i % PALETTES.length];
      return {
        id: r.id,
        name: r.name || r.customerName || "Bakery Guest",
        profession: r.profession || "Dessert Enthusiast",
        rating: r.rating || 5,
        review: r.review,
        portrait: r.portrait || r.customerImage || "/images/baker-where/prod_chocolate_cookies.jpg",
        backgroundColor: r.backgroundColor || palette.bg,
        splashColor: r.splashColor || palette.splash,
        accentColor: r.accentColor || palette.accent,
        mood: r.mood || "Artisan Bakery",
        decorativeElement: r.decorativeElement || palette.deco,
      };
    });
  }, [reviews]);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="reviewsSection border-t-4 border-[#3B2A22] bg-[#FFF8EE] py-24 md:py-32 relative overflow-hidden select-none"
    >
      <BackgroundDecorations />

      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: false, amount: 0.15 }}
        variants={shouldReduceMotion ? undefined : staggerContainerVariants}
        className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-12 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16 xl:gap-20">
          
          {/* LEFT ZONE: Heading & Subtitle (32% Width on Desktop) */}
          <div className="w-full lg:w-[32%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            <ReviewHeader />
          </div>

          {/* RIGHT ZONE: Two-Row Infinite Marquee or Authentic Empty State */}
          <div className="w-full lg:w-[68%] min-w-0 overflow-hidden">
            {formattedReviews.length > 0 ? (
              <ReviewCarousel reviews={formattedReviews} />
            ) : (
              <div className="w-full py-10 sm:py-14 px-6 sm:px-10 rounded-3xl bg-[#FFFDF8] border-[4px] border-[#3B2A22] shadow-[6px_6px_0_#3B2A22] flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Scrapbook corner tape */}
                <div className="absolute top-2 left-6 w-16 h-5 bg-[#FFE26E]/80 border-t border-b border-[#3B2A22]/20 -rotate-6 pointer-events-none" />
                <div className="absolute top-2 right-6 w-16 h-5 bg-[#FF4FA3]/40 border-t border-b border-[#3B2A22]/20 rotate-6 pointer-events-none" />

                {/* Stars illustration */}
                <div className="flex items-center gap-1.5 text-amber-400 text-2xl mb-3">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>

                <h3 className="font-bowlby text-xl sm:text-2xl text-[#3B2A22] tracking-tight">
                  Reviews Coming Soon ♡
                </h3>
                
                <p className="font-kalam text-base sm:text-lg text-[#5F4A3A] font-medium max-w-md mt-2 leading-relaxed">
                  Every batch is baked fresh with whole ingredients and genuine care. Tried our sweet treats? We would love to feature your story here!
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE26E] text-[#3B2A22] border-2 border-[#3B2A22] text-xs font-bricolage font-black uppercase mt-4 shadow-sm">
                  <span>Fresh From Our Oven ✨</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default Reviews;
