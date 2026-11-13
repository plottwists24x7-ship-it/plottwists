/**
 * PLOTTWIST BAKERY: SCRAPBOOK MENU DATA MODEL & CATALOG (V3)
 * Source of truth for the 3 scrapbook stationery sheets (Boxes, Jars, Waffles).
 * Uses approved poster catalog items and exact ₹ currency formatting.
 */

export interface MenuProductItem {
  id: string;
  name: string;
  price: string;
  priceNumber: number;
  description: string;
}

export type MenuCategoryType = "boxes" | "jars" | "waffles";

export interface MenuCategoryConfig {
  id: MenuCategoryType;
  sheetNumber: string;
  sheetTitle: string;
  badgeLabel: string;
  bgColor: string;
  pillColor: string;
  pillTextColor: string;
  titleFontClass: string;
  productNameFontClass: string;
  tapeAsset: string;
  tapeAlt: string;
  tapeRotate: number;
  rotationDesktop: string;
  shadowDesktop: string;
  products: MenuProductItem[];
}

export const MENU_CATEGORIES: MenuCategoryConfig[] = [
  {
    id: "boxes",
    sheetNumber: "01",
    sheetTitle: "BOXES",
    badgeLabel: "01 / BOXES",
    bgColor: "#F3B7C5",
    pillColor: "#F45B73",
    pillTextColor: "#FFFFFF",
    titleFontClass: "font-bricolage font-black",
    productNameFontClass: "font-outfit font-bold",
    tapeAsset: "/images/menu-decor/tape-yellow.svg",
    tapeAlt: "Yellow washi tape pinning Boxes sheet",
    tapeRotate: -2.5,
    rotationDesktop: "-1.2deg",
    shadowDesktop: "6px 7px 0px #3B2922",
    products: [
      {
        id: "box-brookie",
        name: "Brookie",
        price: "₹180",
        priceNumber: 180,
        description: "a classic combo of brownie and cookie",
      },
      {
        id: "box-tres-leches",
        name: "Tres leches",
        price: "₹200",
        priceNumber: 200,
        description: "a simple sweet vanilla base with the right amount of twist",
      },
      {
        id: "box-crunch-cake",
        name: "Crunch cake",
        price: "₹250",
        priceNumber: 250,
        description: "a cake base with chocolately cream and a crunchy topping",
      },
      {
        id: "box-choco-lava",
        name: "Choco Lava",
        price: "₹300",
        priceNumber: 300,
        description: "Rich chocolate flavor in every bite with gooey centeric",
      },
      {
        id: "box-muffins",
        name: "Muffins × 4",
        price: "₹150",
        priceNumber: 150,
        description: "richly double chocolate muffins",
      },
      {
        id: "box-puddle-cake",
        name: "Puddle cake",
        price: "₹150",
        priceNumber: 150,
        description: "pieces of brownie with decadent cold chocolate",
      },
    ],
  },
  {
    id: "jars",
    sheetNumber: "02",
    sheetTitle: "JARS",
    badgeLabel: "02 / JARS",
    bgColor: "#F8DD78",
    pillColor: "#E8C84A",
    pillTextColor: "#3B2922",
    titleFontClass: "font-fraunces font-bold italic",
    productNameFontClass: "font-outfit font-bold",
    tapeAsset: "/images/menu-decor/tape-polka.svg",
    tapeAlt: "Pink polka dot tape pinning Jars sheet",
    tapeRotate: 2,
    rotationDesktop: "1.2deg",
    shadowDesktop: "6px 7px 0px #3B2922",
    products: [
      {
        id: "jar-biscoff-tiramisu",
        name: "Biscoff tiramisu",
        price: "₹150",
        priceNumber: 150,
        description: "tiramisu cream with biscoff layering",
      },
      {
        id: "jar-mocha-oreo",
        name: "Mocha oreo pudding",
        price: "₹150",
        priceNumber: 150,
        description: "mocha cream with oreo layering",
      },
      {
        id: "jar-dream-cake",
        name: "Dream cake",
        price: "₹150",
        priceNumber: 150,
        description: "brownie with chocolate layers",
      },
    ],
  },
  {
    id: "waffles",
    sheetNumber: "03",
    sheetTitle: "WAFFLES",
    badgeLabel: "03 / WAFFLES",
    bgColor: "#A9C9F0",
    pillColor: "#3B82F6",
    pillTextColor: "#FFFFFF",
    titleFontClass: "font-space font-bold italic",
    productNameFontClass: "font-outfit font-bold",
    tapeAsset: "/images/menu-decor/tape-gingham.svg",
    tapeAlt: "Blue gingham tape pinning Waffles sheet",
    tapeRotate: -1.5,
    rotationDesktop: "-0.8deg",
    shadowDesktop: "6px 7px 0px #3B2922",
    products: [
      {
        id: "waffle-nutella",
        name: "Nutella waffles",
        price: "₹150",
        priceNumber: 150,
        description: "chocolate/classic base",
      },
      {
        id: "waffle-dark-choc",
        name: "Dark choc waffles",
        price: "₹150",
        priceNumber: 150,
        description: "chocolate/classic base",
      },
      {
        id: "waffle-biscoff",
        name: "Biscoff waffles",
        price: "₹150",
        priceNumber: 150,
        description: "chocolate/classic base",
      },
    ],
  },
];
