export interface SharedProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  serial?: string;
  price?: string;
  category: string;
  badge?: string;
  badgeText?: string;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SharedGalleryPhoto {
  id: string;
  title: string;
  image: string;
  src?: string;
  alt?: string;
  label?: string;
  category: string;
  caption?: string;
  width?: string;
  height?: string;
  rotation?: string;
  zIndex?: number;
  desktopPosition?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  attachment?: {
    type: "tape" | "pushpin" | "none";
    color?: string;
  };
  sticker?: {
    type: "smiley-yellow" | "smiley-blue" | "sparkle" | "heart" | "flower" | "seal";
    positionClass: string;
  };
  createdAt?: string;
}

export interface SharedReview {
  id: string;
  name: string;
  customerName?: string;
  profession?: string;
  rating: number;
  review: string;
  portrait?: string;
  customerImage?: string;
  backgroundColor?: string;
  splashColor?: string;
  accentColor?: string;
  mood?: string;
  decorativeElement?: string;
  date?: string;
  verified?: boolean;
}

// ─── 1. OUR BAKES (SHARED PRODUCTS) ───
export const INITIAL_PRODUCTS: SharedProduct[] = [
  {
    id: "oreo-fudge",
    name: "Oreo Fudge",
    description: "Rich chocolate fudge folded with crunchy Oreo crumbs and a soft melt-in-your-mouth centre.",
    image: "/images/baker-where/prod_oreo_fudge.jpg",
    serial: "01 / 07",
    price: "$26.00",
    category: "Brownies",
    badge: "Double Choc 🍫",
    badgeText: "Double Choc 🍫",
    isPopular: true,
  },
  {
    id: "pancakes",
    name: "Fluffy Pancakes",
    description: "Fluffy golden stacks made for slow mornings, soft bites, extra syrup, and rich whipped cream.",
    image: "/images/baker-where/prod_pancakes.jpg",
    serial: "02 / 07",
    price: "$22.00",
    category: "Pastries",
    badge: "Fluffy Stacks 🥞",
    badgeText: "Fluffy Stacks 🥞",
    isPopular: true,
  },
  {
    id: "tiramisu",
    name: "Venetian Tiramisu",
    description: "Coffee-soaked layers of soft sponge, creamy mascarpone, and a dusting of dark espresso cocoa.",
    image: "/images/baker-where/prod_tiramisu.jpg",
    serial: "03 / 07",
    price: "$32.00",
    category: "Tiramisu",
    badge: "Espresso Kick ☕",
    badgeText: "Espresso Kick ☕",
    isPopular: true,
  },
  {
    id: "cheesecake",
    name: "Basque Cheesecake",
    description: "Silky, creamy, lightly baked cheesecake with a buttery biscuit base and fresh berry drizzle.",
    image: "/images/baker-where/prod_cheesecake.jpg",
    serial: "04 / 07",
    price: "$38.00",
    category: "Cheesecakes",
    badge: "Lightly Baked 🍓",
    badgeText: "Lightly Baked 🍓",
    isPopular: true,
  },
  {
    id: "biscoff-brownie",
    name: "Biscoff Brownie",
    description: "Deep fudgy brownie finished with caramelised Biscoff spread and a warm gooey centre.",
    image: "/images/baker-where/prod_biscoff_brownie.jpg",
    serial: "05 / 07",
    price: "$24.00",
    category: "Brownies",
    badge: "Gooey Centre 🍪",
    badgeText: "Gooey Centre 🍪",
    isPopular: true,
  },
  {
    id: "red-velvet",
    name: "Red Velvet Cake",
    description: "Tender cocoa-red sponge layered with smooth cream-cheese frosting and white chocolate curls.",
    image: "/images/baker-where/prod_red_velvet.jpg",
    serial: "06 / 07",
    price: "$42.00",
    category: "Cakes",
    badge: "Cream Frosting 🧁",
    badgeText: "Cream Frosting 🧁",
    isPopular: false,
  },
  {
    id: "chocolate-chip",
    name: "Chocolate Chip Cookies",
    description: "Crisp around the edges, soft in the middle, and packed with molten chocolate chips.",
    image: "/images/baker-where/prod_chocolate_cookies.jpg",
    serial: "07 / 07",
    price: "$18.00",
    category: "Cookies",
    badge: "Molten Chips ✨",
    badgeText: "Molten Chips ✨",
    isPopular: false,
  },
];

// ─── 2. GALLERY PHOTOS (SHARED GALLERY) ───
export const INITIAL_GALLERY_PHOTOS: SharedGalleryPhoto[] = [
  {
    id: "pancakes",
    title: "Saturday Stacks",
    label: "Saturday Stacks",
    image: "/images/baker-where/prod_pancakes.jpg",
    src: "/images/baker-where/prod_pancakes.jpg",
    alt: "Fluffy pancake stack with syrup",
    category: "Display & Store",
    caption: "Fluffy pancake stack prepared fresh on weekend mornings.",
    width: "250px",
    height: "210px",
    rotation: "-3deg",
    zIndex: 5,
    desktopPosition: { top: "10px", left: "0px" },
    attachment: { type: "tape", color: "blue" },
  },
  {
    id: "cookie",
    title: "Golden Bake",
    label: "Golden Bake",
    image: "/images/baker-where/prod_chocolate_cookies.jpg",
    src: "/images/baker-where/prod_chocolate_cookies.jpg",
    alt: "Freshly baked chocolate chip cookie",
    category: "Kitchen & Oven",
    caption: "Freshly pulled batch of triple chocolate chunk cookies.",
    width: "230px",
    height: "190px",
    rotation: "2deg",
    zIndex: 6,
    desktopPosition: { top: "45px", left: "220px" },
    attachment: { type: "tape", color: "blue" },
  },
  {
    id: "red-velvet",
    title: "Velvet Red",
    label: "Velvet Red",
    image: "/images/baker-where/prod_red_velvet.jpg",
    src: "/images/baker-where/prod_red_velvet.jpg",
    alt: "Red velvet cake slice with cream frosting",
    category: "Decorating",
    caption: "Precision piping on our signature red velvet cake.",
    width: "230px",
    height: "190px",
    rotation: "-2deg",
    zIndex: 5,
    desktopPosition: { top: "25px", left: "460px" },
    attachment: { type: "tape", color: "pink" },
  },
  {
    id: "cupcake",
    title: "Sweet Muffins",
    label: "Sweet Muffins",
    image: "/images/baker-where/prod_red_velvet.jpg",
    src: "/images/baker-where/prod_red_velvet.jpg",
    alt: "Vanilla muffin with white frosting",
    category: "Display & Store",
    caption: "Artisan cupcakes cooling on parchment paper.",
    width: "190px",
    height: "210px",
    rotation: "4deg",
    zIndex: 6,
    desktopPosition: { top: "70px", left: "740px" },
    attachment: { type: "tape", color: "brown" },
  },
  {
    id: "brownie",
    title: "Fudgy Center",
    label: "Fudgy Center",
    image: "/images/baker-where/prod_biscoff_brownie.jpg",
    src: "/images/baker-where/prod_biscoff_brownie.jpg",
    alt: "Gooey Biscoff brownie slice",
    category: "Kitchen & Oven",
    caption: "Warm gooey Biscoff speculoos swirls.",
    width: "220px",
    height: "185px",
    rotation: "3deg",
    zIndex: 6,
    desktopPosition: { top: "230px", left: "-5px" },
    attachment: { type: "tape", color: "beige" },
    sticker: { type: "seal", positionClass: "absolute bottom-[-15px] left-[-15px] z-20" }
  },
  {
    id: "cheesecake",
    title: "Velvet Cheese",
    label: "Velvet Cheese",
    image: "/images/baker-where/prod_cheesecake.jpg",
    src: "/images/baker-where/prod_cheesecake.jpg",
    alt: "Silky baked cheesecake slice with strawberries",
    category: "Ingredients",
    caption: "Freshly sliced Basque cheesecake with berry drizzle.",
    width: "260px",
    height: "210px",
    rotation: "-1deg",
    zIndex: 7,
    desktopPosition: { top: "210px", left: "250px" },
    attachment: { type: "tape", color: "beige" },
    sticker: { type: "flower", positionClass: "absolute bottom-[-10px] right-[-10px] z-20" }
  },
  {
    id: "oreo-fudge",
    title: "Double Oreo",
    label: "Double Oreo",
    image: "/images/baker-where/prod_oreo_fudge.jpg",
    src: "/images/baker-where/prod_oreo_fudge.jpg",
    alt: "Rich Oreo chocolate fudge slice",
    category: "Packaging",
    caption: "Hand-wrapped boxes of dense chocolate fudge.",
    width: "210px",
    height: "175px",
    rotation: "-3deg",
    zIndex: 6,
    desktopPosition: { top: "235px", left: "517px" },
    attachment: { type: "tape", color: "yellow-grid" },
  },
  {
    id: "donuts",
    title: "Ring Donuts",
    label: "Ring Donuts",
    image: "/images/baker-where/gallery_display.jpg",
    src: "/images/baker-where/gallery_display.jpg",
    alt: "Glazed pink donuts stack",
    category: "Display & Store",
    caption: "Morning storefront counter ready for visitors.",
    width: "205px",
    height: "210px",
    rotation: "2deg",
    zIndex: 5,
    desktopPosition: { top: "275px", left: "720px" },
    attachment: { type: "tape", color: "striped" },
    sticker: { type: "smiley-blue", positionClass: "absolute top-[-10px] right-[-10px] z-20" }
  },
];

// ─── 3. CUSTOMER REVIEWS (SHARED REVIEWS) ───
export const INITIAL_REVIEWS_LIST: SharedReview[] = [
  {
    id: "rev-1",
    name: "Oliver Bennett",
    customerName: "Oliver Bennett",
    profession: "Art Collector",
    rating: 5,
    review: "The low-sugar brownies are a lifesaver for my sweet cravings! They're decadent and satisfying, without the guilt. I'm hooked!",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&h=450&fit=crop&q=80",
    customerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#0F6B73",
    splashColor: "#EAF7F5",
    accentColor: "#DDF8F4",
    mood: "Fresh Morning",
    decorativeElement: "droplet",
    date: "August 16, 2026",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Sophia Martinez",
    customerName: "Sophia Martinez",
    profession: "Creative Director",
    rating: 5,
    review: "A masterpiece of flavor and styling. They didn't just bake a cake; they crafted a brand experience that dominated our event.",
    portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=450&h=450&fit=crop&q=80",
    customerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#B55A36",
    splashColor: "#F5E7D6",
    mood: "Artisan Bakery",
    decorativeElement: "cookie",
    date: "August 14, 2026",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Davie Cade",
    customerName: "Davie Cade",
    profession: "Brand Designer",
    rating: 5,
    review: "I love the fiber-rich cookies! They're crunchy, delicious, and keep me full longer. It's great to have a snack that's both tasty and good for me.",
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&h=450&fit=crop&q=80",
    customerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#335C43",
    splashColor: "#F4F0E6",
    mood: "Organic Farm",
    decorativeElement: "quote",
    date: "August 12, 2026",
    verified: true,
  },
  {
    id: "rev-4",
    name: "James Reed",
    customerName: "James Reed",
    profession: "Coffee Shop Owner",
    rating: 5,
    review: "Their pastries pair perfectly with our coffee. Customers keep asking where we get them from!",
    portrait: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=450&h=450&fit=crop&q=80",
    customerImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#3D4EA3",
    splashColor: "#E9E3FF",
    mood: "Premium Signature",
    decorativeElement: "sparkle",
    date: "August 10, 2026",
    verified: true,
  },
  {
    id: "rev-5",
    name: "Chloe Henderson",
    customerName: "Chloe Henderson",
    profession: "Illustrator",
    rating: 5,
    review: "Playful, colorful, and deliciously chunky. They bring raw artistic energy and nostalgia back into custom baking.",
    portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=450&h=450&fit=crop&q=80",
    customerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#7B2748",
    splashColor: "#F7DDD3",
    mood: "Dessert Collection",
    decorativeElement: "stamp",
    date: "August 8, 2026",
    verified: true,
  },
  {
    id: "rev-6",
    name: "David Kim",
    customerName: "David Kim",
    profession: "Marketing Manager",
    rating: 5,
    review: "Consistent quality that our clients love. The packaging design is gorgeous and makes an immediate impression.",
    portrait: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=450&h=450&fit=crop&q=80",
    customerImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#0F6B73",
    splashColor: "#EAF7F5",
    accentColor: "#DDF8F4",
    mood: "Fresh Morning",
    decorativeElement: "sparkle",
    date: "August 6, 2026",
    verified: true,
  }
];

// ─── 4. HERO SECTION FEATURED IMAGE CONFIG ───
export interface HeroConfig {
  image: string;
  alt: string;
  captionTitle: string;
  captionSubtitle: string;
  scale?: number;
  objectFit?: "cover" | "contain";
  aspectRatio?: string;
  updatedAt: string;
}

export const INITIAL_HERO: HeroConfig = {
  image: "/cheesecake.png",
  alt: "Signature Artisanal Cheesecake",
  captionTitle: "today's batch ♡",
  captionSubtitle: "Mom's Special",
  scale: 1.03,
  objectFit: "cover",
  aspectRatio: "4:3",
  updatedAt: new Date().toISOString(),
};

// ─── 5. STORY SECTION CONFIG ───
export interface StoryBadgeItem {
  id: string;
  image: string;
  label: string;
  alt?: string;
}

export interface StoryConfig {
  isEnabled: boolean;
  tagline: string;
  title: string;
  subtitleScript: string;
  noteLeft: string;
  noteRight: string;
  recipeNumber: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  badgeBottom: string;
  stampTopText: string;
  stampBottomText: string;
  chefsPickText: string;
  batchChecklist: string[];
  badges: StoryBadgeItem[];
  founderName: string;
  founderRole: string;
  updatedAt: string;
}

export const INITIAL_STORY: StoryConfig = {
  isEnabled: true,
  tagline: "✨ ABOUT OUR BAKERY",
  title: "PLOTTWIST24X7",
  subtitleScript: "made with love ♡",
  noteLeft: '"fresh every morning" 🥐',
  noteRight: '"slow fermentation" ♡',
  recipeNumber: "RECIPE CARD № 042 • HANDCRAFTED",
  description: "Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.",
  ctaText: "SEE ALL BAKES",
  ctaLink: "#bakes",
  image: "/images/baker-where/hero_bakery.jpg",
  imageAlt: "Artisan bakery kitchen prep",
  imageCaption: "artisan sourdough prep ♡",
  badgeBottom: "BAKED TODAY",
  stampTopText: "HANDMADE",
  stampBottomText: "FRESH DAILY",
  chefsPickText: '"chef\'s pick" 🔥',
  batchChecklist: ["✓ slow rise", "✓ better texture", "✓ more flavour 😊"],
  badges: [
    { id: "sb-1", image: "/images/baker-where/prod_pancakes.jpg", label: "24 countries", alt: "Pancakes background stats" },
    { id: "sb-2", image: "/images/baker-where/prod_tiramisu.jpg", label: "100% wholesome", alt: "Tiramisu background stats" },
    { id: "sb-3", image: "/images/baker-where/prod_biscoff_brownie.jpg", label: "trusted quality", alt: "Brownie background stats" },
  ],
  founderName: "Elena Rostova",
  founderRole: "Head Baker & Founder",
  updatedAt: new Date().toISOString(),
};

// ─── 6. STORY IMAGES ONLY CONFIG ───
export interface StoryImagesConfig {
  mainPolaroid: string;
  badge1: string;
  badge2: string;
  badge3: string;
  updatedAt: string;
}

export const INITIAL_STORY_IMAGES: StoryImagesConfig = {
  mainPolaroid: "/images/baker-where/hero_bakery.jpg",
  badge1: "/images/baker-where/prod_pancakes.jpg",
  badge2: "/images/baker-where/prod_tiramisu.jpg",
  badge3: "/images/baker-where/prod_biscoff_brownie.jpg",
  updatedAt: new Date().toISOString(),
};



