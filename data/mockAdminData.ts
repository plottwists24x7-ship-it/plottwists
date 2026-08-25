import { Bake, GalleryImage, Review } from "@/types/admin";

export const INITIAL_BAKES: Bake[] = [
  {
    id: "bake-1",
    name: "Classic Basque Burnt Cheesecake",
    description: "Creamy Spanish-style baked cheesecake with an intense caramelized top and molten center.",
    price: "$38.00",
    category: "Cheesecakes",
    image: "/images/baker-where/prod_cheesecake.jpg",
    badge: "Bestseller",
    isPopular: true,
    createdAt: "2026-08-10T10:00:00.000Z",
    updatedAt: "2026-08-18T14:30:00.000Z",
  },
  {
    id: "bake-2",
    name: "Biscoff Cookie Butter Brownie",
    description: "Fudgy Belgian dark chocolate brownie swirled with rich Lotus Biscoff spread and crushed speculoos.",
    price: "$24.00",
    category: "Brownies",
    image: "/images/baker-where/prod_biscoff_brownie.jpg",
    badge: "Fan Favorite",
    isPopular: true,
    createdAt: "2026-08-11T11:00:00.000Z",
    updatedAt: "2026-08-17T09:15:00.000Z",
  },
  {
    id: "bake-3",
    name: "Signature Red Velvet Dream",
    description: "Tender scarlet cocoa sponge layers nestled between silky vanilla bean cream cheese frosting.",
    price: "$42.00",
    category: "Cakes",
    image: "/images/baker-where/prod_red_velvet.jpg",
    badge: "Special Edition",
    isPopular: false,
    createdAt: "2026-08-12T12:00:00.000Z",
    updatedAt: "2026-08-15T16:45:00.000Z",
  },
  {
    id: "bake-4",
    name: "Classic Venetian Tiramisu",
    description: "Espresso-soaked Savoiardi ladyfingers layered with whipped mascarpone zabaione and cocoa dust.",
    price: "$32.00",
    category: "Tiramisu",
    image: "/images/baker-where/prod_tiramisu.jpg",
    badge: "Chef Choice",
    isPopular: true,
    createdAt: "2026-08-13T08:30:00.000Z",
    updatedAt: "2026-08-19T10:00:00.000Z",
  },
  {
    id: "bake-5",
    name: "Triple Chocolate Chunk Cookies",
    description: "Chewy golden bakery cookies loaded with pools of 70% dark, milk, and white chocolate chunks.",
    price: "$18.00",
    category: "Cookies",
    image: "/images/baker-where/prod_chocolate_cookies.jpg",
    badge: "Daily Fresh",
    isPopular: false,
    createdAt: "2026-08-14T09:00:00.000Z",
    updatedAt: "2026-08-16T11:20:00.000Z",
  },
  {
    id: "bake-6",
    name: "Midnight Oreo Fudge Slab",
    description: "Dense dark chocolate truffle fudge packed with crunchy Oreo crumbles and sea salt flakes.",
    price: "$26.00",
    category: "Brownies",
    image: "/images/baker-where/prod_oreo_fudge.jpg",
    badge: "Decadent",
    isPopular: false,
    createdAt: "2026-08-15T14:00:00.000Z",
    updatedAt: "2026-08-18T18:00:00.000Z",
  },
  {
    id: "bake-7",
    name: "Fluffy Soufflé Pancake Stack",
    description: "Cloud-light Japanese soufflé pancakes served with whipped honeycomb butter and organic maple.",
    price: "$22.00",
    category: "Pastries",
    image: "/images/baker-where/prod_pancakes.jpg",
    badge: "Brunch Favorite",
    isPopular: false,
    createdAt: "2026-08-16T07:45:00.000Z",
    updatedAt: "2026-08-17T12:10:00.000Z",
  }
];

export const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: "gal-1",
    title: "Morning Display Window",
    image: "/images/baker-where/gallery_display.jpg",
    category: "Display & Store",
    caption: "Freshly staged bakes ready for the morning rush.",
    createdAt: "2026-08-14T09:00:00.000Z"
  },
  {
    id: "gal-2",
    title: "Stone Hearth Oven in Action",
    image: "/images/baker-where/gallery_oven.jpg",
    category: "Kitchen & Oven",
    caption: "Baking Basque cheesecakes at 240°C.",
    createdAt: "2026-08-15T10:30:00.000Z"
  },
  {
    id: "gal-3",
    title: "Handcrafted Gift Packaging",
    image: "/images/baker-where/gallery_package.jpg",
    category: "Packaging",
    caption: "Eco-friendly craft boxes tied with baker's twine.",
    createdAt: "2026-08-16T11:15:00.000Z"
  },
  {
    id: "gal-4",
    title: "Precision Piping Frosting",
    image: "/images/baker-where/gallery_pipe.jpg",
    category: "Decorating",
    caption: "Decorating custom celebratory birthday cakes.",
    createdAt: "2026-08-17T13:45:00.000Z"
  },
  {
    id: "gal-5",
    title: "Artisanal Coffee & Cinnamon",
    image: "/images/baker-where/coffee_beans_cinnamon.jpg",
    category: "Ingredients",
    caption: "Single-origin espresso beans and Ceylon cinnamon.",
    createdAt: "2026-08-18T08:00:00.000Z"
  },
  {
    id: "gal-6",
    title: "Hand-Crushed Cookie Crumbs",
    image: "/images/baker-where/bakery_cookie_crumbs.jpg",
    category: "Ingredients",
    caption: "Prepping base crusts for dessert bars.",
    createdAt: "2026-08-18T15:20:00.000Z"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customerName: "Elena Rostova",
    customerImage: "/placeholder-user.jpg",
    review: "The Basque burnt cheesecake is genuinely the best dessert I have ever tasted in the city. Perfectly creamy with that unmistakable caramelized top!",
    rating: 5,
    date: "August 16, 2026",
    verified: true
  },
  {
    id: "rev-2",
    customerName: "Marcus Vance",
    customerImage: "/placeholder-user.jpg",
    review: "Ordered 3 boxes of Biscoff Brownies for our studio celebration. Everyone was stunned by how rich and fudgy they were. 10/10 recommended!",
    rating: 5,
    date: "August 14, 2026",
    verified: true
  },
  {
    id: "rev-3",
    customerName: "Sophia Chen",
    customerImage: "/placeholder-user.jpg",
    review: "PlotTwist24x has become our weekend bakery ritual. The Red Velvet cake and espresso pairing is pure comfort.",
    rating: 5,
    date: "August 12, 2026",
    verified: true
  },
  {
    id: "rev-4",
    customerName: "David Miller",
    customerImage: "/placeholder-user.jpg",
    review: "Incredible attention to packaging and presentation. The cookies arrived warm and in pristine shape. Great craftsmanship!",
    rating: 4,
    date: "August 10, 2026",
    verified: true
  }
];
