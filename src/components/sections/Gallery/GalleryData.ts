export interface PhotoCardConfig {
  id: string;
  src: string;
  alt: string;
  label: string;
  width: string;
  height: string;
  rotation: string;
  zIndex: number;
  desktopPosition: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  attachment: {
    type: "tape" | "pushpin" | "none";
    color?: string;
  };
  sticker?: {
    type: "smiley-yellow" | "smiley-blue" | "sparkle" | "heart" | "flower" | "seal";
    positionClass: string;
  };
}

export const GALLERY_PHOTOS: PhotoCardConfig[] = [
  {
    id: "pancakes",
    src: "/images/baker-where/prod_pancakes.jpg",
    alt: "Fluffy pancake stack with syrup",
    label: "Saturday Stacks",
    width: "250px",
    height: "210px",
    rotation: "-3deg",
    zIndex: 5,
    desktopPosition: { top: "10px", left: "0px" },
    attachment: { type: "tape", color: "blue" },
  },
  {
    id: "cookie",
    src: "/images/baker-where/prod_chocolate_cookies.jpg",
    alt: "Freshly baked chocolate chip cookie",
    label: "Golden Bake",
    width: "230px",
    height: "190px",
    rotation: "2deg",
    zIndex: 6,
    desktopPosition: { top: "45px", left: "220px" },
    attachment: { type: "tape", color: "blue" },
  },
  {
    id: "red-velvet",
    src: "/images/baker-where/prod_red_velvet.jpg",
    alt: "Red velvet cake slice with cream frosting",
    label: "Velvet Red",
    width: "230px",
    height: "190px",
    rotation: "-2deg",
    zIndex: 5,
    desktopPosition: { top: "25px", left: "460px" },
    attachment: { type: "tape", color: "pink" },
  },
  {
    id: "cupcake",
    src: "/images/baker-where/prod_red_velvet.jpg",
    alt: "Vanilla muffin with white frosting",
    label: "Sweet Muffins",
    width: "190px",
    height: "210px",
    rotation: "4deg",
    zIndex: 6,
    desktopPosition: { top: "70px", left: "740px" }, // moved right 10px
    attachment: { type: "tape", color: "brown" },
  },
  {
    id: "brownie",
    src: "/images/baker-where/prod_biscoff_brownie.jpg",
    alt: "Gooey Biscoff brownie slice",
    label: "Fudgy Center",
    width: "220px",
    height: "185px",
    rotation: "3deg",
    zIndex: 6,
    desktopPosition: { top: "230px", left: "-5px" }, // moved slightly left
    attachment: { type: "tape", color: "beige" },
    sticker: { type: "seal", positionClass: "absolute bottom-[-15px] left-[-15px] z-20" }
  },
  {
    id: "cheesecake",
    src: "/images/baker-where/prod_cheesecake.jpg",
    alt: "Silky baked cheesecake slice with strawberries",
    label: "Velvet Cheese",
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
    src: "/images/baker-where/prod_oreo_fudge.jpg",
    alt: "Rich Oreo chocolate fudge slice",
    label: "Double Oreo",
    width: "210px",
    height: "175px",
    rotation: "-3deg",
    zIndex: 6,
    desktopPosition: { top: "235px", left: "517px" }, // Oreo moved closer to Cheesecake by 8px
    attachment: { type: "tape", color: "yellow-grid" },
  },
  {
    id: "donuts",
    src: "/images/baker-where/prod_oreo_fudge.jpg",
    alt: "Glazed pink donuts stack",
    label: "Ring Donuts",
    width: "205px",
    height: "210px",
    rotation: "2deg",
    zIndex: 5,
    desktopPosition: { top: "275px", left: "720px" },
    attachment: { type: "tape", color: "striped" },
    sticker: { type: "smiley-blue", positionClass: "absolute top-[-10px] right-[-10px] z-20" }
  },
];
