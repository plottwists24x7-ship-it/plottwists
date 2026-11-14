"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SPRINGS, APPLE_EASE } from "@/lib/motion";

export function MobileStickyOrderPill() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (~380px), hide near the bottom when footer is visible
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const nearBottom = scrollY + winHeight > docHeight - 380;

      if (scrollY > 380 && !nearBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const el = document.getElementById("faves") || document.getElementById("bakes");
    if (el) {
      const headerOffset = 85;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.85, y: 22 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.88, y: 16 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.18 }
              : { duration: 0.38, ease: APPLE_EASE }
          }
          className="fixed bottom-5 right-4 z-40 block lg:hidden pb-[env(safe-area-inset-bottom)]"
        >
          <motion.button
            onClick={handleClick}
            whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.96,
                    y: 2,
                    boxShadow: "1.5px 1.5px 0px #3B2A22",
                  }
            }
            transition={SPRINGS.press}
            aria-label="Order PlotTwist Faves"
            className="group flex items-center gap-2 px-4 py-2.5 bg-[#FFE066] hover:bg-[#FFD600] text-[#3B2A22] border-[2.5px] border-[#3B2A22] rounded-full shadow-[3.5px_3.5px_0px_#3B2A22] font-fredoka font-bold text-xs uppercase tracking-wider cursor-pointer touch-manipulation select-none"
          >
            {/* Pop-in bakery icon */}
            <motion.span
              initial={
                shouldReduceMotion
                  ? false
                  : { scale: 0.6, rotate: -18 }
              }
              animate={
                shouldReduceMotion
                  ? false
                  : { scale: 1, rotate: 0 }
              }
              transition={SPRINGS.sticker}
              className="w-5 h-5 rounded-full bg-[#EF5B5B] text-white flex items-center justify-center text-[10px] shadow-xs"
            >
              🧁
            </motion.span>
            
            <span>ORDER FAVES</span>
            
            <motion.span
              className="text-[#3B2A22] font-bold inline-block"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
