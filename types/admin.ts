import { 
  SharedProduct, 
  SharedGalleryPhoto, 
  SharedReview, 
  HeroConfig, 
  StoryConfig, 
  StoryBadgeItem,
  StoryImagesConfig 
} from "@/lib/mock-data";

export type { HeroConfig, StoryConfig, StoryBadgeItem, StoryImagesConfig };

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

export type GalleryCategory = 
  | "Kitchen & Oven"
  | "Display & Store"
  | "Packaging"
  | "Decorating"
  | "Ingredients"
  | "Events"
  | string;

export type GalleryImage = SharedGalleryPhoto;

export type Review = SharedReview;

export interface AdminStats {
  totalBakes: number;
  galleryImages: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface AdminContextType {
  bakes: SharedProduct[];
  gallery: SharedGalleryPhoto[];
  reviews: SharedReview[];
  hero: HeroConfig;
  story: StoryConfig;
  storyImages: StoryImagesConfig;
  stats: AdminStats;
  
  // Hero Update
  updateHero: (updates: Partial<HeroConfig>) => void;

  // Story Update
  updateStory: (updates: Partial<StoryConfig>) => void;
  updateStoryImages: (updates: Partial<StoryImagesConfig>) => void;
  
  // Bake CRUD
  addBake: (bake: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">) => SharedProduct;
  updateBake: (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>) => void;
  deleteBake: (id: string) => void;
  
  // Gallery CRUD
  addGalleryImage: (image: Omit<SharedGalleryPhoto, "id" | "createdAt">) => SharedGalleryPhoto;
  addMultipleGalleryImages: (images: Array<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => void;
  updateGalleryImage: (id: string, updates: Partial<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => void;
  deleteGalleryImage: (id: string) => void;
  
  // Review CRUD
  addReview: (review: Omit<SharedReview, "id" | "date">) => SharedReview;
  updateReview: (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>) => void;
  deleteReview: (id: string) => void;
  
  // Storage / Reset
  resetToDefaults: () => void;
}
