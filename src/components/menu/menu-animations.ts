/**
 * PLOTTWIST BAKERY: SCRAPBOOK MENU ANIMATION VARIANTS
 * Framer Motion transition definitions with prefers-reduced-motion support.
 */

import { Variants } from "framer-motion";

// Check reduced motion in client context
export const getTransition = (duration: number, delay: number = 0) => ({
  duration,
  delay,
  ease: [0.22, 1, 0.36, 1], // Custom smooth cubic-bezier
});

// Section Container Variants
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

// Title and Heading Variants
export const headingVariants: Variants = {
  hidden: { opacity: 0, y: 24, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Stationery Sheets Variants
export const sheetBoxesVariants: Variants = {
  hidden: { opacity: 0, x: -32, y: 20, rotate: -4 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: -1.8,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const sheetJarsVariants: Variants = {
  hidden: { opacity: 0, x: 28, y: -16, rotate: 3 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 1.4,
    transition: {
      duration: 0.7,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const sheetWafflesVariants: Variants = {
  hidden: { opacity: 0, x: 28, y: 24, rotate: -2 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: -0.8,
    transition: {
      duration: 0.7,
      delay: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Washi Tape Spring Dropdown
export const tapeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 22,
      delay: 0.3,
    },
  },
};

// Pop-in Sticker Animation
export const stickerPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 20,
      delay: 0.35,
    },
  },
};

// Subtle Idle Floating Doodles
export const idleFloatVariants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-3, 3, -3],
    rotate: [-1.2, 1.2, -1.2],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Product Row Hover Effect
export const productRowVariants: Variants = {
  initial: { x: 0 },
  hover: {
    x: 3,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

// Bottom CTA Bar Variants
export const ctaBarVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Reduced Motion Alternative Variants (Accessible Fallback)
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

