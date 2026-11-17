import { 
  SharedProduct, 
  SharedReview, 
  HeroConfig, 
  StoryConfig, 
  StoryBadgeItem,
  StoryImagesConfig,
  InstagramCTAConfig,
} from "@/lib/mock-data";

export type { HeroConfig, StoryConfig, StoryBadgeItem, StoryImagesConfig, InstagramCTAConfig };

export type BakeCategory = 
  | "Cheesecakes"
  | "Brownies"
  | "Cookies"
  | "Cakes"
  | "Tiramisu"
  | "Pastries"
  | "Seasonal"
  | string;

export type Bake = SharedProduct;

export type Review = SharedReview;

export interface AdminStats {
  totalBakes: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface AdminContextType {
  bakes: SharedProduct[];
  faves: SharedProduct[];
  reviews: SharedReview[];
  hero: HeroConfig;
  story: StoryConfig;
  storyImages: StoryImagesConfig;
  instagramCTA: InstagramCTAConfig;
  stats: AdminStats;
  
  // Hero Update
  updateHero: (updates: Partial<HeroConfig>) => Promise<boolean>;

  // Story Update
  updateStory: (updates: Partial<StoryConfig>) => Promise<boolean>;
  updateStoryImages: (updates: Partial<StoryImagesConfig>) => Promise<boolean>;

  // Instagram CTA Update
  updateInstagramCTA: (updates: Partial<InstagramCTAConfig>) => Promise<boolean>;
  
  // Bake CRUD
  addBake: (bake: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">) => Promise<SharedProduct | null>;
  updateBake: (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>) => Promise<boolean>;
  deleteBake: (id: string) => Promise<boolean>;
  
  // Review CRUD
  addReview: (review: Omit<SharedReview, "id" | "date">) => Promise<SharedReview | null>;
  updateReview: (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  
  // Storage / Reset
  resetToDefaults: () => void;
}

// Deprecated type stubs to prevent orphaned component compilation issues
export type GalleryCategory = string;
export interface GalleryImage {
  id: string;
  title: string;
  image: string;
  src?: string;
  alt?: string;
  category?: GalleryCategory;
  caption?: string;
  createdAt?: string;
}
