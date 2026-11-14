"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileStickyOrderPill() {
  const [visible, setVisible] = useState(false);

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
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-5 right-4 z-40 block lg:hidden pb-[env(safe-area-inset-bottom)]"
        >
          <button
            onClick={handleClick}
            aria-label="Order PlotTwist Faves"
            className="group flex items-center gap-2 px-4 py-2.5 bg-[#FFE066] hover:bg-[#FFD600] active:scale-[0.96] text-[#3B2A22] border-[2.5px] border-[#3B2A22] rounded-full shadow-[3.5px_3.5px_0px_#3B2A22] font-fredoka font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-[#EF5B5B] text-white flex items-center justify-center text-[10px] shadow-xs">
              🧁
            </span>
            <span>ORDER FAVES</span>
            <span className="text-[#3B2A22] group-hover:translate-x-0.5 transition-transform font-bold">
              →
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
