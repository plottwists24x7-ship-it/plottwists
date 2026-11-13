/**
 * PLOTTWIST BAKERY: SCRAPBOOK MENU DATA MODEL & CATALOG
 * Source of truth for the 3 scrapbook stationery sheets (Boxes, Jars, Waffles).
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
    bgColor: "#F6B8C5",
    pillColor: "#F45B73",
    tapeAsset: "/images/menu-decor/tape-yellow.svg",
    tapeAlt: "Yellow washi tape pinning Boxes sheet",
    tapeRotate: -3,
    rotationDesktop: "-1.8deg",
    shadowDesktop: "8px 9px 0px #3B2922",
    products: [
      {
        id: "box-brookie",
        name: "Brookie",
        price: "Rs180",
        priceNumber: 180,
        description: "a classic combo of brownie and cookie",
      },
      {
        id: "box-tres-leches",
        name: "Tres leches",
        price: "Rs200",
        priceNumber: 200,
        description: "a simple sweet vanilla base with the right amount of twist",
      },
      {
        id: "box-crunch-cake",
        name: "Crunch cake",
        price: "Rs250",
        priceNumber: 250,
        description: "a cake base with chocolately cream and a crunchy topping",
      },
      {
        id: "box-choco-lava",
        name: "Choco Lava",
        price: "Rs300",
        priceNumber: 300,
        description: "Rich chocolate flavor in every bite with gooey centeric",
      },
      {
        id: "box-muffins",
        name: "Muffins × 4",
        price: "Rs150",
        priceNumber: 150,
        description: "richly double chocolate muffins",
      },
      {
        id: "box-puddle-cake",
        name: "Puddle cake",
        price: "Rs150",
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
    bgColor: "#F8DC72",
    pillColor: "#F8DC72",
    tapeAsset: "/images/menu-decor/tape-polka.svg",
    tapeAlt: "Pink polka dot tape pinning Jars sheet",
    tapeRotate: 2,
    rotationDesktop: "1.4deg",
    shadowDesktop: "8px 9px 0px #3B2922",
    products: [
      {
        id: "jar-biscoff-tiramisu",
        name: "Biscoff tiramisu",
        price: "Rs150",
        priceNumber: 150,
        description: "tiramisu cream with biscoff layering",
      },
      {
        id: "jar-mocha-oreo",
        name: "Mocha oreo pudding",
        price: "Rs150",
        priceNumber: 150,
        description: "mocha cream with oreo layering",
      },
      {
        id: "jar-dream-cake",
        name: "Dream cake",
        price: "Rs150",
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
    bgColor: "#A9CCF4",
    pillColor: "#4787F5",
    tapeAsset: "/images/menu-decor/tape-gingham.svg",
    tapeAlt: "Blue gingham tape pinning Waffles sheet",
    tapeRotate: -2,
    rotationDesktop: "-0.8deg",
    shadowDesktop: "8px 9px 0px #3B2922",
    products: [
      {
        id: "waffle-nutella",
        name: "Nutella waffles",
        price: "Rs150",
        priceNumber: 150,
        description: "chocolate/classic base",
      },
      {
        id: "waffle-dark-choc",
        name: "Dark choc waffles",
        price: "Rs150",
        priceNumber: 150,
        description: "chocolate/classic base",
      },
      {
        id: "waffle-biscoff",
        name: "Biscoff waffles",
        price: "Rs150",
        priceNumber: 150,
        description: "chocolate/classic base",
      },
    ],
  },
];

