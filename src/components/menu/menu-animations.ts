/**
 * PLOTTWIST BAKERY: SCRAPBOOK MENU ANIMATION SYSTEM (V7)
 * Bidirectional Scroll-Responsive choreography with Framer Motion.
 * Supports both downward and upward scrolling with prefers-reduced-motion fallback.
 */

import { Variants } from "framer-motion";

// ── 1. MAIN HEADING & MASTHEAD ──
export const headingVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const underlineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 0.85,
    transition: {
      duration: 0.6,
      delay: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const whiskVariants: Variants = {
  hidden: { opacity: 0, rotate: -35, scale: 0.75 },
  visible: {
    opacity: 1,
    rotate: -12,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
      delay: 0.12,
    },
  },
};

export const noteDropVariants: Variants = {
  hidden: { opacity: 0, y: -12, rotate: -6 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: -1.5,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 20,
      delay: 0.2,
    },
  },
};

export const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 1.25, rotate: 0 },
  visible: {
    opacity: 0.85,
    scale: 1,
    rotate: 4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 18,
      delay: 0.25,
    },
  },
};

// ── 2. ASYMMETRIC STATIONERY SHEETS ──
export const sheetBoxesVariants: Variants = {
  hidden: { opacity: 0, x: -28, y: 16, rotate: -3.5 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: -1.2,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const sheetJarsVariants: Variants = {
  hidden: { opacity: 0, y: -24, rotate: 3 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 1.2,
    transition: {
      duration: 0.65,
      delay: 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const sheetWafflesVariants: Variants = {
  hidden: { opacity: 0, x: 24, y: 20, rotate: -2.5 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: -0.8,
    transition: {
      duration: 0.65,
      delay: 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ── 3. WASHI TAPE ATTACHMENTS ──
export const tapeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 20,
      delay: 0.22,
    },
  },
};

// ── 4. PRODUCT ROWS (STAGGERED CONTAINER & ITEMS) ──
export const productListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.12,
    },
  },
};

export const productRowVariants: Variants = {
  hidden: { opacity: 0, y: 7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: "easeOut",
    },
  },
};

// ── 5. SCRAPBOOK STICKERS & BAKERY ILLUSTRATIONS ──
export const stickerPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.45, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 18,
      delay: 0.18,
    },
  },
};

export const idleFloatVariants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-2.5, 2.5, -2.5],
    rotate: [-1, 1, -1],
    transition: {
      duration: 4.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ── 6. BOTTOM ORDER CTA BAR ──
export const ctaBarVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ── 7. ACCESSIBLE REDUCED MOTION FALLBACK ──
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25 },
  },
};
