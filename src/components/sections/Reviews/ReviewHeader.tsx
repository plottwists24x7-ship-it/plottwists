"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  staggerContainerVariants,
  scrapbookEntranceVariants,
  stickerPopVariants,
  SPRINGS,
} from '@/lib/motion';

export const ReviewHeader: React.FC = React.memo(() => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: false, amount: 0.2 }}
      variants={shouldReduceMotion ? undefined : staggerContainerVariants}
      className="flex flex-col items-center justify-center text-center pt-8 pb-4 relative z-10 select-none"
    >
      {/* 1. Main Heading: WHAT OUR CUSTOMERS SAY */}
      <motion.h2 
        id="reviews-heading" 
        variants={shouldReduceMotion ? undefined : scrapbookEntranceVariants}
        className="font-shrikhand text-3xl xs:text-4xl sm:text-6xl md:text-7xl text-[#3B2A22] tracking-wide font-normal uppercase leading-[1.1] filter drop-shadow-[2px_2px_0_rgba(255,224,102,0.6)]"
      >
        What Our Customers Say
      </motion.h2>

      {/* 2. Handwritten Subtitle (Supporting Tagline) */}
      <motion.p
        variants={shouldReduceMotion ? undefined : scrapbookEntranceVariants}
        className="font-mali text-lg xs:text-2xl sm:text-3xl font-bold text-[#EF5B5B] mt-2 rotate-[-1.5deg]"
      >
        sweet memories & happy tummies ♡
      </motion.p>

      {/* 3. ★★★★★ Golden Yellow Rating Stars */}
      <motion.div
        variants={shouldReduceMotion ? undefined : stickerPopVariants}
        className="flex items-center gap-1.5 mt-3 mb-1"
      >
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.15, rotate: 6 }}
            transition={SPRINGS.press}
            className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFE066] fill-current filter drop-shadow-[1px_1px_0_#3B2A22]"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </motion.svg>
        ))}
      </motion.div>
    </motion.div>
  );
});

ReviewHeader.displayName = 'ReviewHeader';
