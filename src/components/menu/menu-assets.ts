/**
 * PLOTTWIST BAKERY: SCRAPBOOK MENU ASSET MANIFEST
 * Centralized registry of all SVG sticker, washi tape, and doodle illustrations.
 */

export interface MenuAssetItem {
  id: string;
  src: string;
  alt: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const MENU_ASSETS = {
  // Stickers
  heartPink: {
    id: "heart-pink",
    src: "/images/menu-decor/heart-pink.svg",
    alt: "Pink heart sticker",
    defaultWidth: 48,
    defaultHeight: 46,
  },
  heartRed: {
    id: "heart-red",
    src: "/images/menu-decor/heart-red.svg",
    alt: "Red heart sticker",
    defaultWidth: 42,
    defaultHeight: 40,
  },
  starYellow: {
    id: "star-yellow",
    src: "/images/menu-decor/star-yellow.svg",
    alt: "Yellow star sparkle sticker",
    defaultWidth: 44,
    defaultHeight: 44,
  },
  flowerPink: {
    id: "flower-pink",
    src: "/images/menu-decor/flower-pink.svg",
    alt: "Pink flower sticker",
    defaultWidth: 52,
    defaultHeight: 52,
  },
  flowerYellow: {
    id: "flower-yellow",
    src: "/images/menu-decor/flower-yellow.svg",
    alt: "Yellow flower sticker",
    defaultWidth: 48,
    defaultHeight: 48,
  },
  flowerBlue: {
    id: "flower-blue",
    src: "/images/menu-decor/flower-blue.svg",
    alt: "Powder blue flower sticker",
    defaultWidth: 48,
    defaultHeight: 48,
  },
  smileyYellow: {
    id: "smiley-yellow",
    src: "/images/menu-decor/smiley-yellow.svg",
    alt: "Yellow smiley face button",
    defaultWidth: 54,
    defaultHeight: 54,
  },
  tinySparkle: {
    id: "tiny-sparkle",
    src: "/images/menu-decor/tiny-sparkle.svg",
    alt: "Tiny sparkle twinkle",
    defaultWidth: 26,
    defaultHeight: 26,
  },
  freshlyMadeBadge: {
    id: "freshly-made-badge",
    src: "/images/menu-decor/freshly-made-badge.svg",
    alt: "Freshly made just for you stamp",
    defaultWidth: 120,
    defaultHeight: 120,
  },

  // Washi Tapes
  tapePink: {
    id: "tape-pink",
    src: "/images/menu-decor/tape-pink.svg",
    alt: "Pink washi tape",
    defaultWidth: 120,
    defaultHeight: 36,
  },
  tapeYellow: {
    id: "tape-yellow",
    src: "/images/menu-decor/tape-yellow.svg",
    alt: "Yellow washi tape",
    defaultWidth: 120,
    defaultHeight: 36,
  },
  tapeBlue: {
    id: "tape-blue",
    src: "/images/menu-decor/tape-blue.svg",
    alt: "Powder blue washi tape",
    defaultWidth: 120,
    defaultHeight: 36,
  },
  tapeGingham: {
    id: "tape-gingham",
    src: "/images/menu-decor/tape-gingham.svg",
    alt: "Blue gingham checked washi tape",
    defaultWidth: 130,
    defaultHeight: 38,
  },
  tapePolka: {
    id: "tape-polka",
    src: "/images/menu-decor/tape-polka.svg",
    alt: "Pink polka dot washi tape",
    defaultWidth: 130,
    defaultHeight: 38,
  },

  // Stationery & Stamps
  paperclipBrown: {
    id: "paperclip-brown",
    src: "/images/menu-decor/paperclip-brown.svg",
    alt: "Stationery paper clip",
    defaultWidth: 28,
    defaultHeight: 56,
  },
  bakeryStamp: {
    id: "bakery-stamp",
    src: "/images/menu-decor/bakery-stamp.svg",
    alt: "PlotTwist Bakery handmade rubber ink stamp",
    defaultWidth: 130,
    defaultHeight: 130,
  },
  handwrittenNote: {
    id: "handwritten-note",
    src: "/images/menu-decor/handwritten-note.svg",
    alt: "Handwritten note: A little something for every craving",
    defaultWidth: 260,
    defaultHeight: 90,
  },

  // Kitchen & Bakery Doodles
  whisk: {
    id: "handdrawn-whisk",
    src: "/images/menu-decor/handdrawn-whisk.svg",
    alt: "Handdrawn kitchen whisk",
    defaultWidth: 55,
    defaultHeight: 110,
  },
  fork: {
    id: "handdrawn-fork",
    src: "/images/menu-decor/handdrawn-fork.svg",
    alt: "Handdrawn dessert fork",
    defaultWidth: 40,
    defaultHeight: 100,
  },
  doodleCake: {
    id: "doodle-cake",
    src: "/images/menu-decor/doodle-cake.svg",
    alt: "Handdrawn cake slice with cherry",
    defaultWidth: 80,
    defaultHeight: 80,
  },
  doodleSpoon: {
    id: "doodle-spoon",
    src: "/images/menu-decor/doodle-spoon.svg",
    alt: "Handdrawn dessert spoon",
    defaultWidth: 38,
    defaultHeight: 90,
  },
} as const;

