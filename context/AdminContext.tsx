"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { 
  SharedProduct, 
  SharedGalleryPhoto, 
  SharedReview, 
  HeroConfig,
  StoryConfig,
  StoryImagesConfig,
  INITIAL_PRODUCTS, 
  INITIAL_GALLERY_PHOTOS, 
  INITIAL_REVIEWS_LIST,
  INITIAL_HERO,
  INITIAL_STORY,
  INITIAL_STORY_IMAGES 
} from "@/lib/mock-data";

export interface AdminStats {
  totalBakes: number;
  galleryImages: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface AdminContextType {
  // Shared Data Sources
  bakes: SharedProduct[];
  gallery: SharedGalleryPhoto[];
  reviews: SharedReview[];
  hero: HeroConfig;
  story: StoryConfig;
  storyImages: StoryImagesConfig;
  stats: AdminStats;
  
  // Hero Actions
  updateHero: (updates: Partial<HeroConfig>) => void;

  // Story Actions
  updateStory: (updates: Partial<StoryConfig>) => void;
  updateStoryImages: (updates: Partial<StoryImagesConfig>) => void;
  
  // Bake Actions
  addBake: (bake: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">) => SharedProduct;
  updateBake: (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>) => void;
  deleteBake: (id: string) => void;
  
  // Gallery Actions
  addGalleryImage: (image: Omit<SharedGalleryPhoto, "id" | "createdAt">) => SharedGalleryPhoto;
  addMultipleGalleryImages: (images: Array<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => void;
  updateGalleryImage: (id: string, updates: Partial<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => void;
  deleteGalleryImage: (id: string) => void;
  
  // Review Actions
  addReview: (review: Omit<SharedReview, "id" | "date">) => SharedReview;
  updateReview: (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>) => void;
  deleteReview: (id: string) => void;
  
  // Reset
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  BAKES: "plottwist_shared_bakes_v2",
  GALLERY: "plottwist_shared_gallery_v2",
  REVIEWS: "plottwist_shared_reviews_v2",
  HERO: "plottwist_shared_hero_v2",
  STORY: "plottwist_shared_story_v2",
  STORY_IMAGES: "plottwist_shared_story_images_v2",
  LAST_UPDATED: "plottwist_shared_last_updated_v2",
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bakes, setBakes] = useState<SharedProduct[]>(INITIAL_PRODUCTS);
  const [gallery, setGallery] = useState<SharedGalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [reviews, setReviews] = useState<SharedReview[]>(INITIAL_REVIEWS_LIST);
  const [hero, setHero] = useState<HeroConfig>(INITIAL_HERO);
  const [story, setStory] = useState<StoryConfig>(INITIAL_STORY);
  const [storyImages, setStoryImages] = useState<StoryImagesConfig>(INITIAL_STORY_IMAGES);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  // Synchronize on mount from localStorage
  useEffect(() => {
    try {
      const storedBakes = localStorage.getItem(STORAGE_KEYS.BAKES);
      const storedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const storedHero = localStorage.getItem(STORAGE_KEYS.HERO);
      const storedStory = localStorage.getItem(STORAGE_KEYS.STORY);
      const storedStoryImages = localStorage.getItem(STORAGE_KEYS.STORY_IMAGES);
      const storedUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);

      if (storedBakes) setBakes(JSON.parse(storedBakes));
      if (storedGallery) setGallery(JSON.parse(storedGallery));
      if (storedReviews) setReviews(JSON.parse(storedReviews));
      if (storedHero) setHero(JSON.parse(storedHero));
      if (storedStory) setStory(JSON.parse(storedStory));
      if (storedStoryImages) setStoryImages(JSON.parse(storedStoryImages));
      if (storedUpdated) setLastUpdated(storedUpdated);
    } catch (e) {
      console.warn("Using shared initial mock data:", e);
    }
  }, []);

  const persistUpdate = useCallback((key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updateStr = `Today at ${now}`;
      setLastUpdated(updateStr);
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, updateStr);
    } catch (e) {
      console.warn("Could not persist to localStorage:", e);
    }
  }, []);

  // ─── BAKES CRUD ───
  const addBake = useCallback((bakeData: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">): SharedProduct => {
    const newBake: SharedProduct = {
      ...bakeData,
      id: `bake-${Date.now()}`,
      serial: `0${bakes.length + 1} / 0${bakes.length + 1}`,
      badgeText: bakeData.badge || "Fresh Bake ✨",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBakes((prev) => {
      const next = [newBake, ...prev];
      persistUpdate(STORAGE_KEYS.BAKES, next);
      return next;
    });

    return newBake;
  }, [bakes.length, persistUpdate]);

  const updateBake = useCallback((id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>) => {
    setBakes((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              badgeText: updates.badge || item.badgeText || item.badge,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      persistUpdate(STORAGE_KEYS.BAKES, next);
      return next;
    });
  }, [persistUpdate]);

  const deleteBake = useCallback((id: string) => {
    setBakes((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistUpdate(STORAGE_KEYS.BAKES, next);
      return next;
    });
  }, [persistUpdate]);

  // ─── GALLERY CRUD ───
  const addGalleryImage = useCallback((imageData: Omit<SharedGalleryPhoto, "id" | "createdAt">): SharedGalleryPhoto => {
    const newImg: SharedGalleryPhoto = {
      ...imageData,
      id: `gal-${Date.now()}`,
      src: imageData.image,
      alt: imageData.title,
      label: imageData.title,
      width: imageData.width || "230px",
      height: imageData.height || "200px",
      rotation: `${(Math.random() * 6 - 3).toFixed(1)}deg`,
      zIndex: 6,
      createdAt: new Date().toISOString(),
    };

    setGallery((prev) => {
      const next = [newImg, ...prev];
      persistUpdate(STORAGE_KEYS.GALLERY, next);
      return next;
    });

    return newImg;
  }, [persistUpdate]);

  const addMultipleGalleryImages = useCallback((imagesData: Array<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => {
    const now = new Date().toISOString();
    const newImages: SharedGalleryPhoto[] = imagesData.map((img, index) => ({
      ...img,
      id: `gal-${Date.now()}-${index}`,
      src: img.image,
      alt: img.title,
      label: img.title,
      width: img.width || "230px",
      height: img.height || "200px",
      rotation: `${(Math.random() * 6 - 3).toFixed(1)}deg`,
      zIndex: 6,
      createdAt: now,
    }));

    setGallery((prev) => {
      const next = [...newImages, ...prev];
      persistUpdate(STORAGE_KEYS.GALLERY, next);
      return next;
    });
  }, [persistUpdate]);

  const updateGalleryImage = useCallback((id: string, updates: Partial<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => {
    setGallery((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              src: updates.image || item.src || item.image,
              alt: updates.title || item.alt || item.title,
              label: updates.title || item.label || item.title,
            }
          : item
      );
      persistUpdate(STORAGE_KEYS.GALLERY, next);
      return next;
    });
  }, [persistUpdate]);

  const deleteGalleryImage = useCallback((id: string) => {
    setGallery((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistUpdate(STORAGE_KEYS.GALLERY, next);
      return next;
    });
  }, [persistUpdate]);

  // ─── REVIEWS CRUD ───
  const addReview = useCallback((reviewData: Omit<SharedReview, "id" | "date">): SharedReview => {
    const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const newReview: SharedReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      name: reviewData.name || reviewData.customerName || "Bakery Guest",
      customerName: reviewData.name || reviewData.customerName || "Bakery Guest",
      portrait: reviewData.customerImage || reviewData.portrait || "/placeholder-user.jpg",
      customerImage: reviewData.customerImage || reviewData.portrait || "/placeholder-user.jpg",
      backgroundColor: "#0F6B73",
      splashColor: "#EAF7F5",
      mood: "Artisan Bakery",
      date: dateStr,
      verified: true,
    };

    setReviews((prev) => {
      const next = [newReview, ...prev];
      persistUpdate(STORAGE_KEYS.REVIEWS, next);
      return next;
    });

    return newReview;
  }, [persistUpdate]);

  const updateReview = useCallback((id: string, updates: Partial<Omit<SharedReview, "id" | "date">>) => {
    setReviews((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              name: updates.name || updates.customerName || item.name,
              customerName: updates.customerName || updates.name || item.customerName,
              portrait: updates.customerImage || updates.portrait || item.portrait,
              customerImage: updates.customerImage || updates.portrait || item.customerImage,
            }
          : item
      );
      persistUpdate(STORAGE_KEYS.REVIEWS, next);
      return next;
    });
  }, [persistUpdate]);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistUpdate(STORAGE_KEYS.REVIEWS, next);
      return next;
    });
  }, [persistUpdate]);

  // ─── HERO ACTIONS ───
  const updateHero = useCallback((updates: Partial<HeroConfig>) => {
    setHero((prev) => {
      const next: HeroConfig = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      persistUpdate(STORAGE_KEYS.HERO, next);
      return next;
    });
  }, [persistUpdate]);

  // ─── STORY ACTIONS ───
  // ─── STORY ACTIONS ───
  const updateStory = useCallback((updates: Partial<StoryConfig>) => {
    setStory((prev) => {
      const next: StoryConfig = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      persistUpdate(STORAGE_KEYS.STORY, next);
      return next;
    });
  }, [persistUpdate]);

  const updateStoryImages = useCallback((updates: Partial<StoryImagesConfig>) => {
    setStoryImages((prev) => {
      const next: StoryImagesConfig = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      persistUpdate(STORAGE_KEYS.STORY_IMAGES, next);
      return next;
    });
  }, [persistUpdate]);

  // ─── RESET ───
  const resetToDefaults = useCallback(() => {
    setBakes(INITIAL_PRODUCTS);
    setGallery(INITIAL_GALLERY_PHOTOS);
    setReviews(INITIAL_REVIEWS_LIST);
    setHero(INITIAL_HERO);
    setStory(INITIAL_STORY);
    setStoryImages(INITIAL_STORY_IMAGES);
    setLastUpdated("Reset to initial master dataset");

    localStorage.removeItem(STORAGE_KEYS.BAKES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.HERO);
    localStorage.removeItem(STORAGE_KEYS.STORY);
    localStorage.removeItem(STORAGE_KEYS.STORY_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATED);
  }, []);

  const stats: AdminStats = useMemo(() => ({
    totalBakes: bakes.length,
    galleryImages: gallery.length,
    totalReviews: reviews.length,
    lastUpdated,
  }), [bakes.length, gallery.length, reviews.length, lastUpdated]);

  const value = useMemo(() => ({
    bakes,
    gallery,
    reviews,
    hero,
    story,
    storyImages,
    stats,
    updateHero,
    updateStory,
    updateStoryImages,
    addBake,
    updateBake,
    deleteBake,
    addGalleryImage,
    addMultipleGalleryImages,
    updateGalleryImage,
    deleteGalleryImage,
    addReview,
    updateReview,
    deleteReview,
    resetToDefaults,
  }), [
    bakes,
    gallery,
    reviews,
    hero,
    story,
    storyImages,
    stats,
    updateHero,
    updateStory,
    updateStoryImages,
    addBake,
    updateBake,
    deleteBake,
    addGalleryImage,
    addMultipleGalleryImages,
    updateGalleryImage,
    deleteGalleryImage,
    addReview,
    updateReview,
    deleteReview,
    resetToDefaults,
  ]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
