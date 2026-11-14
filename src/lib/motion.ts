import { Variants } from "framer-motion";

/**
 * PLOTTWIST BAKERY — MASTER MOTION SYSTEM
 * Version 11 | Scrapbook x Apple | Expressive Motion | Mobile First
 *
 * Core Principles:
 * - Scrapbook personality: paper-like movement, sticker entrances, tactile presses, subtle rotational settling.
 * - Apple polish: smooth 60fps cubic easing [0.22, 1, 0.36, 1], controlled springs, zero chaotic bouncing.
 * - Bidirectional scroll replay: re-triggers cleanly when scrolling into view without micro-jitter.
 * - Universal prefers-reduced-motion support.
 */

// ── 1. TIMING & EASING TOKENS ──
export const MOTION_TIMING = {
  micro: 0.16,      // 160ms - button taps, toggles
  sticker: 0.38,    // 380ms - sticker pops, doodle drops
  content: 0.28,    // 280ms - tab switches, text fades
  card: 0.52,       // 520ms - polaroids, recipe cards, sheets
  section: 0.62,    // 620ms - section reveals
} as const;

export const APPLE_EASE = [0.22, 1, 0.36, 1] as const;

export const SPRINGS = {
  // Controlled crisp spring for stickers & doodles
  sticker: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  // Smooth settling spring for cards & stationery sheets
  card: {
    type: "spring" as const,
    stiffness: 220,
    damping: 22,
    mass: 1,
  },
  // Immediate tactile response for button presses
  press: {
    type: "spring" as const,
    stiffness: 500,
    damping: 28,
  },
  // Gentle illustration pop
  illustration: {
    type: "spring" as const,
    stiffness: 260,
    damping: 22,
    mass: 0.9,
  },
};

// ── 2. VIEWPORT CONFIGURATION (Scroll Replay with Restraint) ──
export const VIEWPORT_CONFIG = {
  once: false,
  amount: 0.18,
  margin: "0px 0px -60px 0px",
} as const;

export const VIEWPORT_STRICT = {
  once: false,
  amount: 0.28,
} as const;

// ── 3. REUSABLE MOTION VARIANTS ──

/**
 * Scrapbook Section Stagger Container
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/**
 * Scrapbook Content Entrance (Labels, Headings, Text)
 */
export const scrapbookEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TIMING.section,
      ease: APPLE_EASE,
    },
  },
};

/**
 * Editorial Label & Badge Entrance (Quick, crisp)
 */
export const labelEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_TIMING.content,
      ease: APPLE_EASE,
    },
  },
};

/**
 * Sticker Pop Entrance (Scale pop + natural tilt settling)
 */
export const createStickerPopVariants = (restRotate = 0, initialRotate = -8): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.72,
    rotate: initialRotate,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: restRotate,
    transition: SPRINGS.sticker,
  },
});

export const stickerPopVariants: Variants = createStickerPopVariants(0, -6);

/**
 * Washi Tape Attachment Drop
 */
export const tapeDropVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.65,
    y: -10,
  },
  visible: {
    opacity: 0.95,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 22,
    },
  },
};

/**
 * Paper Card Entrance (Polaroid, Recipe Card, Stationery Sheet)
 */
export const createPaperCardVariants = (restRotate = 0, initialRotate = 2): Variants => ({
  hidden: {
    opacity: 0,
    y: 26,
    rotate: initialRotate,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotate: restRotate,
    scale: 1,
    transition: {
      duration: MOTION_TIMING.card,
      ease: APPLE_EASE,
    },
  },
});

export const paperCardVariants: Variants = createPaperCardVariants(0, 2);

/**
 * Bakery Illustration Entrance (Gentle scale & settle)
 */
export const illustrationEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    rotate: -4,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: SPRINGS.illustration,
  },
};

/**
 * Hand-drawn Underline SVG Stroke Reveal
 */
export const strokeDrawVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: APPLE_EASE,
    },
  },
};

/**
 * Tactile Button Press Properties for `whileTap` and `whileHover`
 */
export const tactilePressProps = {
  whileHover: {
    y: -2,
    transition: { duration: 0.16, ease: "easeOut" },
  },
  whileTap: {
    y: 2,
    scale: 0.975,
    transition: SPRINGS.press,
  },
};

export const tactileButtonVariants: Variants = {
  idle: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -2,
    transition: { duration: 0.16, ease: "easeOut" },
  },
  tap: {
    y: 2,
    scale: 0.975,
    transition: SPRINGS.press,
  },
};

/**
 * Content Transition (Tabs / Category switches)
 */
export const contentTransitionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_TIMING.content,
      ease: APPLE_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: "easeIn",
    },
  },
};

/**
 * Accessible Reduced Motion Fallback
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};
