"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { 
  SharedProduct, 
  SharedGalleryPhoto, 
  SharedReview, 
  HeroConfig,
  StoryConfig,
  StoryImagesConfig,
  InstagramCTAConfig,
  INITIAL_HERO,
  INITIAL_STORY,
  INITIAL_STORY_IMAGES,
  INITIAL_INSTAGRAM_CTA
} from "@/lib/mock-data";
import { createClient, getProductImageUrl } from "@/lib/supabase/client";

/* ========================================================================= */
/* SUPABASE ROW INTERFACES & MAPPERS                                         */
/* ========================================================================= */

interface ProductRow {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: string | null;
  category: string;
  badge: string | null;
  is_popular: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

function mapProductRowToShared(row: ProductRow, index: number, total: number): SharedProduct {
  const serialNum = row.display_order ?? (index + 1);
  const serialStr = `${String(serialNum).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: getProductImageUrl(row.image_url),
    imagePath: row.image_url,
    price: row.price || undefined,
    category: row.category,
    badge: row.badge || undefined,
    badgeText: row.badge || "Fresh Bake ✨",
    isPopular: row.is_popular,
    serial: serialStr,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface GalleryRow {
  id: string;
  title: string;
  image_url: string;
  alt_text: string | null;
  category: string;
  caption: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

function getDeterministicRotation(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const deg = ((Math.abs(hash) % 60) / 10 - 3).toFixed(1);
  return `${deg}deg`;
}

function mapGalleryRowToShared(row: GalleryRow): SharedGalleryPhoto {
  return {
    id: row.id,
    title: row.title,
    image: getProductImageUrl(row.image_url),
    imagePath: row.image_url,
    src: getProductImageUrl(row.image_url),
    alt: row.alt_text || row.title,
    label: row.title,
    category: row.category as SharedGalleryPhoto["category"],
    caption: row.caption || undefined,
    width: "230px",
    height: "200px",
    rotation: getDeterministicRotation(row.id),
    zIndex: 6,
    createdAt: row.created_at,
  };
}

interface ReviewRow {
  id: string;
  customer_name: string;
  customer_image: string;
  review: string;
  rating: number;
  verified: boolean;
  review_date: string | null;
  created_at: string;
  updated_at: string;
}

function mapReviewRowToShared(row: ReviewRow): SharedReview {
  return {
    id: row.id,
    name: row.customer_name,
    customerName: row.customer_name,
    portrait: row.customer_image,
    customerImage: row.customer_image,
    review: row.review,
    rating: row.rating,
    verified: row.verified,
    date: row.review_date || new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    mood: "Artisan Bakery",
    createdAt: row.created_at,
  };
}

interface HeroRow {
  id: string;
  image_url: string;
  alt_text: string;
  caption_title: string;
  caption_subtitle: string;
  scale: number;
  object_fit: "cover" | "contain";
  aspect_ratio: string;
  updated_at: string;
}

function mapHeroRowToConfig(row: HeroRow): HeroConfig {
  return {
    image: getProductImageUrl(row.image_url),
    alt: row.alt_text,
    captionTitle: row.caption_title,
    captionSubtitle: row.caption_subtitle,
    scale: Number(row.scale) || 1.03,
    objectFit: (row.object_fit as "cover" | "contain") || "cover",
    aspectRatio: row.aspect_ratio || "4:3",
    updatedAt: row.updated_at,
  };
}

interface InstagramRow {
  id: string;
  image_url: string;
  alt_text: string;
  updated_at: string;
}

function mapInstagramRowToConfig(row: InstagramRow): InstagramCTAConfig {
  return {
    image: getProductImageUrl(row.image_url),
    alt: row.alt_text,
    updatedAt: row.updated_at,
  };
}

interface StoryImagesRow {
  id: string;
  main_polaroid_url: string;
  badge_1_url: string;
  badge_2_url: string;
  badge_3_url: string;
  updated_at: string;
}

function mapStoryImagesRowToConfig(row: StoryImagesRow): StoryImagesConfig {
  return {
    mainPolaroid: getProductImageUrl(row.main_polaroid_url),
    badge1: getProductImageUrl(row.badge_1_url),
    badge2: getProductImageUrl(row.badge_2_url),
    badge3: getProductImageUrl(row.badge_3_url),
    updatedAt: row.updated_at,
  };
}

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
  instagramCTA: InstagramCTAConfig;
  stats: AdminStats;
  isLoading: boolean;
  isLoaded: boolean;
  
  // Hero Actions
  updateHero: (updates: Partial<HeroConfig>) => Promise<boolean> | void;

  // Story Actions
  updateStory: (updates: Partial<StoryConfig>) => void;
  updateStoryImages: (updates: Partial<StoryImagesConfig>) => Promise<boolean> | void;

  // Instagram CTA Actions
  updateInstagramCTA: (updates: Partial<InstagramCTAConfig>) => Promise<boolean> | void;
  
  // Bake Actions (Supabase backed)
  addBake: (bake: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">) => Promise<SharedProduct | null>;
  updateBake: (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>) => Promise<boolean>;
  deleteBake: (id: string) => Promise<boolean>;
  
  // Gallery Actions (Supabase backed)
  addGalleryImage: (image: Omit<SharedGalleryPhoto, "id" | "createdAt">) => Promise<SharedGalleryPhoto | null>;
  addMultipleGalleryImages: (images: Array<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => Promise<boolean>;
  updateGalleryImage: (id: string, updates: Partial<Omit<SharedGalleryPhoto, "id" | "createdAt">>) => Promise<boolean>;
  deleteGalleryImage: (id: string) => Promise<boolean>;
  
  // Review Actions (Supabase backed)
  addReview: (review: Omit<SharedReview, "id" | "date">) => Promise<SharedReview | null>;
  updateReview: (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  
  // Reset
  resetToDefaults: () => void;
  showToast: (type: "success" | "error" | "info" | "warning", message: string) => void;
  toast: { success: (msg: string) => void; error: (msg: string) => void; info: (msg: string) => void; };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bakes, setBakes] = useState<SharedProduct[]>([]);
  const [gallery, setGallery] = useState<SharedGalleryPhoto[]>([]);
  const [reviews, setReviews] = useState<SharedReview[]>([]);
  const [hero, setHero] = useState<HeroConfig>(INITIAL_HERO);
  const [story, setStory] = useState<StoryConfig>(INITIAL_STORY);
  const [storyImages, setStoryImages] = useState<StoryImagesConfig>(INITIAL_STORY_IMAGES);
  const [instagramCTA, setInstagramCTA] = useState<InstagramCTAConfig>(INITIAL_INSTAGRAM_CTA);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastItem["type"], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (msg: string) => showToast("success", msg),
    error: (msg: string) => showToast("error", msg),
    info: (msg: string) => showToast("info", msg),
  }), [showToast]);


  // Keep track of database singleton IDs
  const [heroDbId, setHeroDbId] = useState<string>("00000000-0000-0000-0000-000000000001");
  const [instagramDbId, setInstagramDbId] = useState<string>("00000000-0000-0000-0000-000000000003");
  const [storyImagesDbId, setStoryImagesDbId] = useState<string>("00000000-0000-0000-0000-000000000002");

  // Load all modules from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function loadAllFromSupabase() {
      try {
        // Execute all 6 initial data queries concurrently in parallel
        const [pRes, gRes, rRes, hRes, iRes, sRes] = await Promise.all([
          supabase.from("products").select("*").order("display_order", { ascending: true }),
          supabase.from("gallery_images").select("*").order("display_order", { ascending: true }),
          supabase.from("reviews").select("*").order("created_at", { ascending: false }),
          supabase.from("site_hero").select("*").limit(1).maybeSingle(),
          supabase.from("site_instagram").select("*").limit(1).maybeSingle(),
          supabase.from("story_images").select("*").limit(1).maybeSingle(),
        ]);

        if (!isMounted) return;

        // 1. Products
        if (pRes.error) console.error("Supabase products fetch error:", pRes.error.message || pRes.error);
        else if (pRes.data) {
          setBakes((pRes.data as ProductRow[]).map((row, idx, arr) => mapProductRowToShared(row, idx, arr.length)));
        }

        // 2. Gallery Images
        if (gRes.error) console.error("Supabase gallery fetch error:", gRes.error.message || gRes.error);
        else if (gRes.data) {
          setGallery((gRes.data as GalleryRow[]).map(mapGalleryRowToShared));
        }

        // 3. Reviews
        if (rRes.error) console.error("Supabase reviews fetch error:", rRes.error.message || rRes.error);
        else if (rRes.data) {
          setReviews((rRes.data as ReviewRow[]).map(mapReviewRowToShared));
        }

        // 4. Site Hero
        if (hRes.error) console.error("Supabase site_hero fetch error:", hRes.error.message || hRes.error);
        else if (hRes.data) {
          setHeroDbId(hRes.data.id);
          setHero(mapHeroRowToConfig(hRes.data as HeroRow));
        }

        // 5. Site Instagram
        if (iRes.error) console.error("Supabase site_instagram fetch error:", iRes.error.message || iRes.error);
        else if (iRes.data) {
          setInstagramDbId(iRes.data.id);
          setInstagramCTA(mapInstagramRowToConfig(iRes.data as InstagramRow));
        }

        // 6. Story Images
        if (sRes.error) console.error("Supabase story_images fetch error:", sRes.error.message || sRes.error);
        else if (sRes.data) {
          setStoryImagesDbId(sRes.data.id);
          setStoryImages(mapStoryImagesRowToConfig(sRes.data as StoryImagesRow));
        }
      } catch (err) {
        console.error("Unexpected error fetching initial data from Supabase:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoaded(true);
        }
      }
    }

    loadAllFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const triggerTimestampUpdate = useCallback(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(`Today at ${now}`);
  }, []);

  // ─── BAKES CRUD (SUPABASE BACKED) ───
  const addBake = useCallback(async (bakeData: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">): Promise<SharedProduct | null> => {
    const supabase = createClient();
    try {
      const maxOrder = bakes.reduce((max, b) => {
        const match = b.serial?.match(/^(\d+)/);
        const num = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, num);
      }, bakes.length);
      const nextDisplayOrder = maxOrder + 1;

      const insertPayload = {
        name: bakeData.name,
        description: bakeData.description,
        image_url: bakeData.image,
        price: bakeData.price || null,
        category: bakeData.category,
        badge: bakeData.badge || null,
        is_popular: Boolean(bakeData.isPopular),
        display_order: nextDisplayOrder,
      };

      const { data, error } = await supabase
        .from("products")
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error("Failed to insert product into Supabase:", error.message || error);
        showToast("error", "Failed to create bake. Please try again.");
        return null;
      }

      if (data) {
        const inserted = mapProductRowToShared(data as ProductRow, 0, bakes.length + 1);
        setBakes((prev) => [inserted, ...prev]);
        triggerTimestampUpdate();
        showToast("success", "Bake created successfully!");
        return inserted;
      }
    } catch (err) {
      console.error("Unexpected error in addBake:", err);
    }
    return null;
  }, [bakes, triggerTimestampUpdate]);

  const updateBake = useCallback(async (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.name !== undefined) updatePayload.name = updates.name;
      if (updates.description !== undefined) updatePayload.description = updates.description;
      if (updates.image !== undefined) updatePayload.image_url = updates.imagePath ?? updates.image;
      if (updates.price !== undefined) updatePayload.price = updates.price || null;
      if (updates.category !== undefined) updatePayload.category = updates.category;
      if (updates.badge !== undefined) updatePayload.badge = updates.badge || null;
      if (updates.isPopular !== undefined) updatePayload.is_popular = Boolean(updates.isPopular);

      const { data, error } = await supabase
        .from("products")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update product in Supabase:", error.message || error);
        showToast("error", "Failed to update bake. Please try again.");
        return false;
      }

      if (data) {
        setBakes((prev) =>
          prev.map((item, idx) =>
            item.id === id
              ? mapProductRowToShared(data as ProductRow, idx, prev.length)
              : item
          )
        );
        triggerTimestampUpdate();
        showToast("success", "Bake updated successfully!");
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in updateBake:", err);
    }
    return false;
  }, [triggerTimestampUpdate]);

  const deleteBake = useCallback(async (id: string): Promise<boolean> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Failed to delete product from Supabase:", error.message || error);
        showToast("error", "Failed to delete bake. Please try again.");
        return false;
      }

      setBakes((prev) => prev.filter((item) => item.id !== id));
      triggerTimestampUpdate();
      showToast("success", "Bake deleted successfully!");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteBake:", err);
    }
    return false;
  }, [triggerTimestampUpdate]);

  // ─── GALLERY CRUD (SUPABASE BACKED) ───
  const addGalleryImage = useCallback(async (imageData: Omit<SharedGalleryPhoto, "id" | "createdAt">): Promise<SharedGalleryPhoto | null> => {
    const supabase = createClient();
    try {
      const nextDisplayOrder = gallery.length + 1;
      const insertPayload = {
        title: imageData.title || "Bakery Moment",
        image_url: imageData.image,
        alt_text: imageData.alt || imageData.title || "Bakery Snapshot",
        category: imageData.category || "Display & Store",
        caption: imageData.caption || null,
        display_order: nextDisplayOrder,
      };

      const { data, error } = await supabase
        .from("gallery_images")
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error("Failed to insert gallery image into Supabase:", error.message || error);
        showToast("error", "Failed to add gallery image. Please try again.");
        return null;
      }

      if (data) {
        const newImg = mapGalleryRowToShared(data as GalleryRow);
        setGallery((prev) => [newImg, ...prev]);
        triggerTimestampUpdate();
        return newImg;
      }
    } catch (err) {
      console.error("Unexpected error in addGalleryImage:", err);
    }
    return null;
  }, [gallery.length, triggerTimestampUpdate]);

  const addMultipleGalleryImages = useCallback(async (imagesData: Array<Omit<SharedGalleryPhoto, "id" | "createdAt">>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const insertPayloads = imagesData.map((img, index) => ({
        title: img.title || `Bakery Photo ${index + 1}`,
        image_url: img.image,
        alt_text: img.alt || img.title || "Bakery Snapshot",
        category: img.category || "Kitchen & Oven",
        caption: img.caption || null,
        display_order: gallery.length + index + 1,
      }));

      const { data, error } = await supabase
        .from("gallery_images")
        .insert(insertPayloads)
        .select();

      if (error) {
        console.error("Failed to batch insert gallery images into Supabase:", error.message || error);
        return false;
      }

      if (data) {
        const mapped = (data as GalleryRow[]).map(mapGalleryRowToShared);
        setGallery((prev) => [...mapped, ...prev]);
        triggerTimestampUpdate();
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in addMultipleGalleryImages:", err);
    }
    return false;
  }, [gallery.length, triggerTimestampUpdate]);

  const updateGalleryImage = useCallback(async (id: string, updates: Partial<Omit<SharedGalleryPhoto, "id" | "createdAt">>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.title !== undefined) updatePayload.title = updates.title;
      if (updates.image !== undefined) updatePayload.image_url = updates.image;
      if (updates.alt !== undefined) updatePayload.alt_text = updates.alt;
      if (updates.category !== undefined) updatePayload.category = updates.category;
      if (updates.caption !== undefined) updatePayload.caption = updates.caption || null;

      const { data, error } = await supabase
        .from("gallery_images")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update gallery image in Supabase:", error.message || error);
        return false;
      }

      if (data) {
        setGallery((prev) =>
          prev.map((item) => (item.id === id ? mapGalleryRowToShared(data as GalleryRow) : item))
        );
        triggerTimestampUpdate();
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in updateGalleryImage:", err);
    }
    return false;
  }, [triggerTimestampUpdate]);

  const deleteGalleryImage = useCallback(async (id: string): Promise<boolean> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Failed to delete gallery image from Supabase:", error.message || error);
        return false;
      }

      setGallery((prev) => prev.filter((item) => item.id !== id));
      triggerTimestampUpdate();
      showToast("success", "Gallery image deleted successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteGalleryImage:", err);
    }
    return false;
  }, [triggerTimestampUpdate]);

  // ─── REVIEWS CRUD (SUPABASE BACKED) ───
  const addReview = useCallback(async (reviewData: Omit<SharedReview, "id" | "date">): Promise<SharedReview | null> => {
    const supabase = createClient();
    try {
      const insertPayload = {
        customer_name: reviewData.customerName || reviewData.name || "Bakery Enthusiast",
        customer_image: reviewData.customerImage || reviewData.portrait || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&h=450&fit=crop&q=80",
        review: reviewData.review,
        rating: reviewData.rating || 5,
        verified: reviewData.verified !== undefined ? reviewData.verified : true,
        review_date: new Date().toISOString().split("T")[0],
      };

      const { data, error } = await supabase
        .from("reviews")
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error("Failed to insert review into Supabase:", error.message || error);
        return null;
      }

      if (data) {
        const newReview = mapReviewRowToShared(data as ReviewRow);
        setReviews((prev) => [newReview, ...prev]);
        triggerTimestampUpdate();
        showToast("success", "Review added successfully.");
        return newReview;
      }
    } catch (err) {
      console.error("Unexpected error in addReview:", err);
    }
    return null;
  }, [triggerTimestampUpdate]);

  const updateReview = useCallback(async (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.customerName !== undefined || updates.name !== undefined) {
        updatePayload.customer_name = updates.customerName || updates.name;
      }
      if (updates.customerImage !== undefined || updates.portrait !== undefined) {
        updatePayload.customer_image = updates.customerImage || updates.portrait;
      }
      if (updates.review !== undefined) updatePayload.review = updates.review;
      if (updates.rating !== undefined) updatePayload.rating = updates.rating;
      if (updates.verified !== undefined) updatePayload.verified = updates.verified;

      const { data, error } = await supabase
        .from("reviews")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update review in Supabase:", error.message || error);
        return false;
      }

      if (data) {
        setReviews((prev) =>
          prev.map((item) => (item.id === id ? mapReviewRowToShared(data as ReviewRow) : item))
        );
        triggerTimestampUpdate();
        showToast("success", "Review updated successfully.");
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in updateReview:", err);
    }
    return false;
  }, [triggerTimestampUpdate]);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Failed to delete review from Supabase:", error.message || error);
        return false;
      }

      setReviews((prev) => prev.filter((item) => item.id !== id));
      triggerTimestampUpdate();
      showToast("success", "Review deleted successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteReview:", err);
    }
    return false;
  }, [triggerTimestampUpdate]);

  // ─── HERO ACTIONS (SUPABASE BACKED) ───
  const updateHero = useCallback(async (updates: Partial<HeroConfig>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.image !== undefined) updatePayload.image_url = updates.image;
      if (updates.alt !== undefined) updatePayload.alt_text = updates.alt;
      if (updates.captionTitle !== undefined) updatePayload.caption_title = updates.captionTitle;
      if (updates.captionSubtitle !== undefined) updatePayload.caption_subtitle = updates.captionSubtitle;
      if (updates.scale !== undefined) updatePayload.scale = updates.scale;
      if (updates.objectFit !== undefined) updatePayload.object_fit = updates.objectFit;
      if (updates.aspectRatio !== undefined) updatePayload.aspect_ratio = updates.aspectRatio;

      const { data, error } = await supabase
        .from("site_hero")
        .update(updatePayload)
        .eq("id", heroDbId)
        .select()
        .single();

      if (error) {
        console.error("Failed to update site_hero in Supabase:", error.message || error);
        showToast("error", "Failed to update hero section. Please try again.");
        return false;
      }

      if (data) {
        setHero(mapHeroRowToConfig(data as HeroRow));
        triggerTimestampUpdate();
        showToast("success", "Hero section updated successfully.");
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in updateHero:", err);
    }
    return false;
  }, [heroDbId, triggerTimestampUpdate]);

  // ─── STORY ACTIONS ───
  const updateStory = useCallback((updates: Partial<StoryConfig>) => {
    setStory((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    triggerTimestampUpdate();
  }, [triggerTimestampUpdate]);

  // ─── STORY IMAGES (SUPABASE BACKED) ───
  const updateStoryImages = useCallback(async (updates: Partial<StoryImagesConfig>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.mainPolaroid !== undefined) updatePayload.main_polaroid_url = updates.mainPolaroid;
      if (updates.badge1 !== undefined) updatePayload.badge_1_url = updates.badge1;
      if (updates.badge2 !== undefined) updatePayload.badge_2_url = updates.badge2;
      if (updates.badge3 !== undefined) updatePayload.badge_3_url = updates.badge3;

      const { data, error } = await supabase
        .from("story_images")
        .update(updatePayload)
        .eq("id", storyImagesDbId)
        .select()
        .single();

      if (error) {
        console.error("Failed to update story_images in Supabase:", error.message || error);
        showToast("error", "Failed to update story images. Please try again.");
        return false;
      }

      if (data) {
        setStoryImages(mapStoryImagesRowToConfig(data as StoryImagesRow));
        triggerTimestampUpdate();
        showToast("success", "Story images updated successfully.");
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in updateStoryImages:", err);
    }
    return false;
  }, [storyImagesDbId, triggerTimestampUpdate]);

  // ─── INSTAGRAM CTA (SUPABASE BACKED) ───
  const updateInstagramCTA = useCallback(async (updates: Partial<InstagramCTAConfig>): Promise<boolean> => {
    const supabase = createClient();
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.image !== undefined) updatePayload.image_url = updates.image;
      if (updates.alt !== undefined) updatePayload.alt_text = updates.alt;

      const { data, error } = await supabase
        .from("site_instagram")
        .update(updatePayload)
        .eq("id", instagramDbId)
        .select()
        .single();

      if (error) {
        console.error("Failed to update site_instagram in Supabase:", error.message || error);
        showToast("error", "Failed to update Instagram section. Please try again.");
        return false;
      }

      if (data) {
        setInstagramCTA(mapInstagramRowToConfig(data as InstagramRow));
        triggerTimestampUpdate();
        showToast("success", "Instagram section updated successfully.");
        return true;
      }
    } catch (err) {
      console.error("Unexpected error in updateInstagramCTA:", err);
    }
    return false;
  }, [instagramDbId, triggerTimestampUpdate]);

  // ─── RESET ───
  const resetToDefaults = useCallback(() => {
    setLastUpdated("Refreshed from Supabase database");
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
    instagramCTA,
    stats,
    isLoading,
    isLoaded,
    updateHero,
    updateStory,
    updateStoryImages,
    updateInstagramCTA,
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
    instagramCTA,
    stats,
    updateHero,
    updateStory,
    updateStoryImages,
    updateInstagramCTA,
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
