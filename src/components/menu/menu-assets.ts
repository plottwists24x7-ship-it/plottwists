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
  doodleWaffle: {
    id: "doodle-waffle",
    src: "/images/menu-decor/doodle-waffle.svg",
    alt: "Handdrawn waffle grid with melting butter",
    defaultWidth: 70,
    defaultHeight: 70,
  },
  doodleJar: {
    id: "doodle-jar",
    src: "/images/menu-decor/doodle-jar.svg",
    alt: "Handdrawn dessert jar with ribbon bow",
    defaultWidth: 60,
    defaultHeight: 74,
  },
  doodleBrownie: {
    id: "doodle-brownie",
    src: "/images/menu-decor/doodle-brownie.svg",
    alt: "Handdrawn fudge brownie square",
    defaultWidth: 64,
    defaultHeight: 60,
  },
  doodleCupcake: {
    id: "doodle-cupcake",
    src: "/images/menu-decor/doodle-cupcake.svg",
    alt: "Handdrawn swirl frosted cupcake",
    defaultWidth: 60,
    defaultHeight: 70,
  },
  doodleCherry: {
    id: "doodle-cherry",
    src: "/images/menu-decor/doodle-cherry.svg",
    alt: "Handdrawn bakery cherries",
    defaultWidth: 56,
    defaultHeight: 56,
  },
  doodleRollingPin: {
    id: "doodle-rolling-pin",
    src: "/images/menu-decor/doodle-rolling-pin.svg",
    alt: "Handdrawn wooden rolling pin",
    defaultWidth: 90,
    defaultHeight: 34,
  },
  doodleMixingBowl: {
    id: "doodle-mixing-bowl",
    src: "/images/menu-decor/doodle-mixing-bowl.svg",
    alt: "Handdrawn ceramic mixing bowl",
    defaultWidth: 68,
    defaultHeight: 54,
  },
  doodlePastry: {
    id: "doodle-pastry",
    src: "/images/menu-decor/doodle-pastry.svg",
    alt: "Handdrawn golden croissant pastry",
    defaultWidth: 68,
    defaultHeight: 48,
  },
  doodleSpatula: {
    id: "doodle-spatula",
    src: "/images/menu-decor/doodle-spatula.svg",
    alt: "Handdrawn silicone spatula",
    defaultWidth: 36,
    defaultHeight: 80,
  },
  doodleMuffin: {
    id: "doodle-muffin",
    src: "/images/menu-decor/doodle-muffin.svg",
    alt: "Handdrawn double chocolate muffin",
    defaultWidth: 56,
    defaultHeight: 58,
  },
  doodleBox: {
    id: "doodle-box",
    src: "/images/menu-decor/doodle-box.svg",
    alt: "Handdrawn tied pastry box",
    defaultWidth: 64,
    defaultHeight: 60,
  },
  doodleSpoon: {
    id: "doodle-spoon",
    src: "/images/menu-decor/doodle-spoon.svg",
    alt: "Handdrawn dessert spoon",
    defaultWidth: 38,
    defaultHeight: 90,
  },
  // V5 Foreground Illustrations & Labels
  doodleBiscoffJar: {
    id: "doodle-biscoff-jar",
    src: "/images/menu-decor/doodle-biscoff-jar.svg",
    alt: "Layered Biscoff crumb dessert jar",
    defaultWidth: 75,
    defaultHeight: 90,
  },
  doodleChocoPuddingJar: {
    id: "doodle-choco-pudding-jar",
    src: "/images/menu-decor/doodle-choco-pudding-jar.svg",
    alt: "Chocolate mocha oreo pudding jar",
    defaultWidth: 70,
    defaultHeight: 85,
  },
  doodleMuffinDoubleChoc: {
    id: "doodle-muffin-double-choc",
    src: "/images/menu-decor/doodle-muffin-double-choc.svg",
    alt: "Double chocolate bakery muffin",
    defaultWidth: 105,
    defaultHeight: 105,
  },
  doodleMuffinLarge: {
    id: "doodle-muffin-large",
    src: "/images/menu-decor/doodle-muffin-large.svg",
    alt: "Large double-chocolate bakery muffin with chunks",
    defaultWidth: 105,
    defaultHeight: 105,
  },
  doodleBrownieCluster: {
    id: "doodle-brownie-cluster",
    src: "/images/menu-decor/doodle-brownie-cluster.svg",
    alt: "Stacked fudgy brownie squares with chocolate drizzle",
    defaultWidth: 80,
    defaultHeight: 75,
  },
  doodleWaffleSyrup: {
    id: "doodle-waffle-syrup",
    src: "/images/menu-decor/doodle-waffle-syrup.svg",
    alt: "Golden waffle with chocolate drizzle and butter pat",
    defaultWidth: 80,
    defaultHeight: 80,
  },
  doodleCherriesPair: {
    id: "doodle-cherries-pair",
    src: "/images/menu-decor/doodle-cherries-pair.svg",
    alt: "Twin glossy red cherries with leaf",
    defaultWidth: 50,
    defaultHeight: 50,
  },
  doodleStrawberryTart: {
    id: "doodle-strawberry-tart",
    src: "/images/menu-decor/doodle-strawberry-tart.svg",
    alt: "Strawberry bakery tart",
    defaultWidth: 65,
    defaultHeight: 60,
  },
  doodleBakingSheet: {
    id: "doodle-baking-sheet",
    src: "/images/menu-decor/doodle-baking-sheet.svg",
    alt: "Baking tray with fresh chocolate chip cookies",
    defaultWidth: 75,
    defaultHeight: 55,
  },
  scrapbookTapeNote: {
    id: "scrapbook-tape-note",
    src: "/images/menu-decor/scrapbook-tape-note.svg",
    alt: "Handwritten Baker's Daily Pick note",
    defaultWidth: 120,
    defaultHeight: 48,
  },
  scrapbookLabelSlowchurned: {
    id: "scrapbook-label-slowchurned",
    src: "/images/menu-decor/scrapbook-label-slowchurned.svg",
    alt: "Slow churned daily oval label",
    defaultWidth: 90,
    defaultHeight: 32,
  },
  stickerArrowDoodle: {
    id: "sticker-arrow-doodle",
    src: "/images/menu-decor/sticker-arrow-doodle.svg",
    alt: "Playful hand-drawn curly arrow doodle",
    defaultWidth: 45,
    defaultHeight: 40,
  },
  // V8 Custom Illustrated Assets (Directly from User Reference Photos)
  doodleTiramisuSlice: {
    id: "doodle-tiramisu-slice",
    src: "/images/menu-decor/doodle-tiramisu-slice.svg",
    alt: "Layered tiramisu cake slice with nuts and mint on plate",
    defaultWidth: 95,
    defaultHeight: 65,
  },
  stickerSunSmiley: {
    id: "sticker-sun-smiley",
    src: "/images/menu-decor/sticker-sun-smiley.svg",
    alt: "Retro smiling sun sticker with triangular rays",
    defaultWidth: 50,
    defaultHeight: 50,
  },
  stickerFlameHeart: {
    id: "sticker-flame-heart",
    src: "/images/menu-decor/sticker-flame-heart.svg",
    alt: "Pink and purple Y2K flame heart sticker",
    defaultWidth: 46,
    defaultHeight: 44,
  },
  stickerDaisyStem: {
    id: "sticker-daisy-stem",
    src: "/images/menu-decor/sticker-daisy-stem.svg",
    alt: "Smiling pink daisy flower on green stem with leaves",
    defaultWidth: 55,
    defaultHeight: 80,
  },
  stickerLightning: {
    id: "sticker-lightning",
    src: "/images/menu-decor/sticker-lightning.svg",
    alt: "Yellow lightning bolt sticker",
    defaultWidth: 32,
    defaultHeight: 45,
  },
  stickerHeartRays: {
    id: "sticker-heart-rays",
    src: "/images/menu-decor/sticker-heart-rays.svg",
    alt: "Pink heart with radiating sparkle rays",
    defaultWidth: 40,
    defaultHeight: 40,
  },
  // Background Canvas Motifs
  paperFibreTile: {
    id: "paper-fibre-tile",
    src: "/images/menu-decor/paper-fibre-tile.svg",
    alt: "Handmade paper fibre texture",
    defaultWidth: 120,
    defaultHeight: 120,
  },
  wrappingPaperTileV2: {
    id: "bakery-wrapping-paper-tile-v2",
    src: "/images/menu-decor/bakery-wrapping-paper-tile-v2.svg",
    alt: "Boutique bakery wrapping paper V2 dense motif",
    defaultWidth: 400,
    defaultHeight: 400,
  },
  wrappingPaperTile: {
    id: "bakery-wrapping-paper-tile",
    src: "/images/menu-decor/bakery-wrapping-paper-tile.svg",
    alt: "Boutique bakery wrapping paper motif",
    defaultWidth: 240,
    defaultHeight: 240,
  },
  risographHalftone: {
    id: "risograph-halftone",
    src: "/images/menu-decor/risograph-halftone.svg",
    alt: "Two-colour risograph halftone screen",
    defaultWidth: 240,
    defaultHeight: 240,
  },
} as const;

