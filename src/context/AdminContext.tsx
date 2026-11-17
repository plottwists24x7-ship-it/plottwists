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
  INITIAL_INSTAGRAM_CTA,
  INITIAL_FAVES
} from "@/lib/mock-data";
import { createClient, getProductImageUrl } from "@/lib/supabase/client";
import { ToastItem, ToastContainer } from "@/components/admin/ToastNotification";

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
  is_bestseller?: boolean | null;
  bestseller_order?: number | null;
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
    isBestseller: Boolean(row.is_bestseller),
    bestsellerOrder: row.bestseller_order ?? undefined,
    serial: serialStr,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
  eyebrow?: string;
  heading_line1?: string;
  heading_line2?: string;
  description?: string;
  quote?: string;
  instagram_handle?: string;
  instagram_url?: string;
  cta_text?: string;
  display_order?: number;
  is_active?: boolean;
  updated_at: string;
}

export interface SharedInstagramEntry {
  id: string;
  image: string;
  imagePath: string;
  alt: string;
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  quote?: string;
  handle?: string;
  url?: string;
  ctaText?: string;
  displayOrder?: number;
  isActive?: boolean;
  updatedAt: string;
}

function mapInstagramRowToConfig(row: InstagramRow): InstagramCTAConfig {
  return {
    image: getProductImageUrl(row.image_url),
    alt: row.alt_text,
    updatedAt: row.updated_at,
  };
}

function mapInstagramRowToShared(row: InstagramRow): SharedInstagramEntry {
  return {
    id: row.id,
    image: getProductImageUrl(row.image_url),
    imagePath: row.image_url,
    alt: row.alt_text,
    eyebrow: row.eyebrow,
    headingLine1: row.heading_line1,
    headingLine2: row.heading_line2,
    description: row.description,
    quote: row.quote,
    handle: row.instagram_handle,
    url: row.instagram_url,
    ctaText: row.cta_text,
    displayOrder: typeof row.display_order === "number" ? row.display_order : 0,
    isActive: row.is_active !== undefined ? Boolean(row.is_active) : true,
    updatedAt: row.updated_at,
  };
}

interface SiteStoryRow {
  id: string;
  is_enabled: boolean;
  tagline: string;
  title: string;
  subtitle_script: string;
  note_left: string;
  note_right: string;
  recipe_number: string;
  description: string;
  cta_text: string;
  cta_link: string;
  badge_bottom: string;
  stamp_top_text: string;
  stamp_bottom_text: string;
  chefs_pick_text: string;
  batch_checklist: string[];
  main_polaroid_url: string;
  main_polaroid_alt: string;
  badge_1_url: string;
  badge_1_label: string;
  badge_2_url: string;
  badge_2_label: string;
  badge_3_url: string;
  badge_3_label: string;
  updated_at: string;
}

function mapSiteStoryRowToConfigs(row: SiteStoryRow): { story: StoryConfig; storyImages: StoryImagesConfig } {
  const storyImages: StoryImagesConfig = {
    mainPolaroid: getProductImageUrl(row.main_polaroid_url || INITIAL_STORY_IMAGES.mainPolaroid),
    badge1: getProductImageUrl(row.badge_1_url || INITIAL_STORY_IMAGES.badge1),
    badge2: getProductImageUrl(row.badge_2_url || INITIAL_STORY_IMAGES.badge2),
    badge3: getProductImageUrl(row.badge_3_url || INITIAL_STORY_IMAGES.badge3),
    updatedAt: row.updated_at || new Date().toISOString(),
  };

  const story: StoryConfig = {
    isEnabled: row.is_enabled !== undefined ? Boolean(row.is_enabled) : true,
    tagline: row.tagline || INITIAL_STORY.tagline,
    title: row.title || INITIAL_STORY.title,
    subtitleScript: row.subtitle_script || INITIAL_STORY.subtitleScript,
    noteLeft: row.note_left || INITIAL_STORY.noteLeft,
    noteRight: row.note_right || INITIAL_STORY.noteRight,
    recipeNumber: row.recipe_number || INITIAL_STORY.recipeNumber,
    description: row.description || INITIAL_STORY.description,
    ctaText: row.cta_text || INITIAL_STORY.ctaText,
    ctaLink: row.cta_link || INITIAL_STORY.ctaLink,
    image: storyImages.mainPolaroid,
    imageAlt: row.main_polaroid_alt || INITIAL_STORY.imageAlt,
    imageCaption: INITIAL_STORY.imageCaption,
    badgeBottom: row.badge_bottom || INITIAL_STORY.badgeBottom,
    stampTopText: row.stamp_top_text || INITIAL_STORY.stampTopText,
    stampBottomText: row.stamp_bottom_text || INITIAL_STORY.stampBottomText,
    chefsPickText: row.chefs_pick_text || INITIAL_STORY.chefsPickText,
    batchChecklist: Array.isArray(row.batch_checklist)
      ? row.batch_checklist
      : INITIAL_STORY.batchChecklist,
    badges: [
      {
        id: "sb-1",
        image: storyImages.badge1,
        label: row.badge_1_label || INITIAL_STORY.badges[0].label,
        alt: INITIAL_STORY.badges[0].alt,
      },
      {
        id: "sb-2",
        image: storyImages.badge2,
        label: row.badge_2_label || INITIAL_STORY.badges[1].label,
        alt: INITIAL_STORY.badges[1].alt,
      },
      {
        id: "sb-3",
        image: storyImages.badge3,
        label: row.badge_3_label || INITIAL_STORY.badges[2].label,
        alt: INITIAL_STORY.badges[2].alt,
      },
    ],
    founderName: INITIAL_STORY.founderName,
    founderRole: INITIAL_STORY.founderRole,
    updatedAt: row.updated_at || new Date().toISOString(),
  };

  return { story, storyImages };
}

export interface AdminStats {
  totalBakes: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface AdminContextType {
  // Shared Data Sources
  bakes: SharedProduct[];
  faves: SharedProduct[];
  reviews: SharedReview[];
  hero: HeroConfig;
  story: StoryConfig;
  storyImages: StoryImagesConfig;
  instagramCTA: InstagramCTAConfig;
  instagramEntries: SharedInstagramEntry[];
  stats: AdminStats;
  isLoading: boolean;
  isLoaded: boolean;
  
  // Hero Actions
  updateHero: (updates: Partial<HeroConfig>) => Promise<boolean>;

  // Story Actions
  updateStory: (updates: Partial<StoryConfig>) => Promise<boolean>;
  updateStoryImages: (updates: Partial<StoryImagesConfig>) => Promise<boolean>;

  // Instagram Actions (Protected Server API)
  updateInstagramCTA: (updates: Partial<InstagramCTAConfig>) => Promise<boolean>;
  addInstagramEntry: (entry: Omit<SharedInstagramEntry, "id" | "updatedAt">) => Promise<SharedInstagramEntry | null>;
  updateInstagramEntry: (id: string, updates: Partial<Omit<SharedInstagramEntry, "id" | "updatedAt">>) => Promise<boolean>;
  deleteInstagramEntry: (id: string) => Promise<boolean>;
  
  // Bake Actions (Protected Server API)
  addBake: (bake: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">) => Promise<SharedProduct | null>;
  updateBake: (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>) => Promise<boolean>;
  deleteBake: (id: string) => Promise<boolean>;
  
  // Review Actions (Protected Server API)
  addReview: (review: Omit<SharedReview, "id" | "date">) => Promise<SharedReview | null>;
  updateReview: (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  
  // Reset & Toasts
  resetToDefaults: () => void;
  showToast: (type: "success" | "error" | "info" | "warning", message: string) => void;
  toast: { success: (msg: string) => void; error: (msg: string) => void; info: (msg: string) => void; };

  // Deprecated backward-compatible stubs (for safe unmounting)
  gallery?: SharedGalleryPhoto[];
  addGalleryImage?: (image: unknown) => Promise<unknown>;
  addMultipleGalleryImages?: (images: unknown[]) => Promise<boolean>;
  updateGalleryImage?: (id: string, updates: Record<string, unknown>) => Promise<boolean>;
  deleteGalleryImage?: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bakes, setBakes] = useState<SharedProduct[]>([]);
  const [reviews, setReviews] = useState<SharedReview[]>([]);
  const [hero, setHero] = useState<HeroConfig>(INITIAL_HERO);
  const [story, setStory] = useState<StoryConfig>(INITIAL_STORY);
  const [storyImages, setStoryImages] = useState<StoryImagesConfig>(INITIAL_STORY_IMAGES);
  const [instagramCTA, setInstagramCTA] = useState<InstagramCTAConfig>(INITIAL_INSTAGRAM_CTA);
  const [instagramEntries, setInstagramEntries] = useState<SharedInstagramEntry[]>([]);
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

  const triggerTimestampUpdate = useCallback(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(`Today at ${now}`);
  }, []);

  // ─── INITIAL DATA LOAD FROM NEW SUPABASE PROJECT ───
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const supabase = createClient();
        const [pRes, rRes, hRes, iRes, sRes] = await Promise.all([
          supabase.from("products").select("*").order("display_order", { ascending: true }),
          supabase.from("reviews").select("*").order("created_at", { ascending: false }),
          supabase.from("site_hero").select("*").limit(1).maybeSingle(),
          supabase.from("site_instagram").select("*"),
          supabase.from("site_story").select("*").limit(1).maybeSingle(),
        ]);

        if (!isMounted) return;

        // 1. Products
        if (pRes.error) {
          console.error("Supabase products fetch error:", pRes.error.message || pRes.error);
        } else if (pRes.data) {
          setBakes((pRes.data as ProductRow[]).map((row, idx, arr) => mapProductRowToShared(row, idx, arr.length)));
        }

        // 2. Reviews (preserves genuine empty state when 0 reviews exist)
        if (rRes.error) {
          console.error("Supabase reviews fetch error:", rRes.error.message || rRes.error);
        } else if (rRes.data) {
          setReviews((rRes.data as ReviewRow[]).map(mapReviewRowToShared));
        }

        // 3. Site Hero
        if (hRes.error) {
          console.error("Supabase site_hero fetch error:", hRes.error.message || hRes.error);
        } else if (hRes.data) {
          setHero(mapHeroRowToConfig(hRes.data as HeroRow));
        }

        // 4. Site Instagram
        if (iRes.error) {
          console.error("Supabase site_instagram fetch error:", iRes.error.message || iRes.error);
        } else if (iRes.data) {
          const rows = iRes.data as InstagramRow[];
          const bannerRow = rows.find((r) => r.id === "00000000-0000-0000-0000-000000000003") || rows[0];
          if (bannerRow) {
            setInstagramCTA(mapInstagramRowToConfig(bannerRow));
          }
          setInstagramEntries(rows.map(mapInstagramRowToShared));
        }

        // 5. Unified Site Story (Editorial copy + 4 images)
        if (sRes.error) {
          console.error("Supabase site_story fetch error:", sRes.error.message || sRes.error);
        } else if (sRes.data) {
          const mapped = mapSiteStoryRowToConfigs(sRes.data as SiteStoryRow);
          setStory(mapped.story);
          setStoryImages(mapped.storyImages);
        }
      } catch (err) {
        console.error("Unexpected error fetching data from Supabase:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoaded(true);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── BAKES CRUD (PROTECTED SERVER-SIDE API) ───
  const addBake = useCallback(async (bakeData: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">): Promise<SharedProduct | null> => {
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
        image: bakeData.image,
        price: bakeData.price || null,
        category: bakeData.category,
        badge: bakeData.badge || null,
        isPopular: Boolean(bakeData.isPopular),
        display_order: nextDisplayOrder,
        isBestseller: Boolean(bakeData.isBestseller),
        bestsellerOrder: bakeData.bestsellerOrder || null,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insertPayload),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return null;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to create bake.");
        return null;
      }

      const inserted = mapProductRowToShared(result.data as ProductRow, 0, bakes.length + 1);
      setBakes((prev) => [inserted, ...prev]);
      triggerTimestampUpdate();
      showToast("success", "Bake created successfully!");
      return inserted;
    } catch (err) {
      console.error("Unexpected error in addBake:", err);
      showToast("error", "Network error occurred while saving bake.");
      return null;
    }
  }, [bakes, triggerTimestampUpdate, showToast]);

  const updateBake = useCallback(async (id: string, updates: Partial<Omit<SharedProduct, "id" | "createdAt" | "updatedAt">>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update bake.");
        return false;
      }

      setBakes((prev) =>
        prev.map((item, idx) =>
          item.id === id
            ? mapProductRowToShared(result.data as ProductRow, idx, prev.length)
            : item
        )
      );
      triggerTimestampUpdate();
      showToast("success", "Bake updated successfully!");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateBake:", err);
      showToast("error", "Network error occurred while updating bake.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  const deleteBake = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to delete bake.");
        return false;
      }

      setBakes((prev) => prev.filter((item) => item.id !== id));
      triggerTimestampUpdate();
      showToast("success", "Bake deleted successfully!");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteBake:", err);
      showToast("error", "Network error occurred while deleting bake.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  // ─── REVIEWS CRUD (PROTECTED SERVER-SIDE API) ───
  const addReview = useCallback(async (reviewData: Omit<SharedReview, "id" | "date">): Promise<SharedReview | null> => {
    try {
      const insertPayload = {
        customerName: reviewData.customerName || reviewData.name || "Bakery Guest",
        customerImage: reviewData.customerImage || reviewData.portrait || "",
        review: reviewData.review,
        rating: reviewData.rating || 5,
        verified: reviewData.verified !== undefined ? reviewData.verified : false,
      };

      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insertPayload),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return null;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to add review.");
        return null;
      }

      const newReview = mapReviewRowToShared(result.data as ReviewRow);
      setReviews((prev) => [newReview, ...prev]);
      triggerTimestampUpdate();
      showToast("success", "Review added successfully.");
      return newReview;
    } catch (err) {
      console.error("Unexpected error in addReview:", err);
      showToast("error", "Network error occurred while saving review.");
      return null;
    }
  }, [triggerTimestampUpdate, showToast]);

  const updateReview = useCallback(async (id: string, updates: Partial<Omit<SharedReview, "id" | "date">>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update review.");
        return false;
      }

      setReviews((prev) =>
        prev.map((item) => (item.id === id ? mapReviewRowToShared(result.data as ReviewRow) : item))
      );
      triggerTimestampUpdate();
      showToast("success", "Review updated successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateReview:", err);
      showToast("error", "Network error occurred while updating review.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to delete review.");
        return false;
      }

      setReviews((prev) => prev.filter((item) => item.id !== id));
      triggerTimestampUpdate();
      showToast("success", "Review deleted successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteReview:", err);
      showToast("error", "Network error occurred while deleting review.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  // ─── HERO ACTIONS (PROTECTED SERVER-SIDE API) ───
  const updateHero = useCallback(async (updates: Partial<HeroConfig>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update hero section.");
        return false;
      }

      setHero(mapHeroRowToConfig(result.data as HeroRow));
      triggerTimestampUpdate();
      showToast("success", "Hero section updated successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateHero:", err);
      showToast("error", "Network error occurred while saving hero.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  // ─── STORY ACTIONS (PROTECTED SERVER-SIDE API) ───
  const updateStory = useCallback(async (updates: Partial<StoryConfig>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/story", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update story.");
        return false;
      }

      if (result.data) {
        const mapped = mapSiteStoryRowToConfigs(result.data as SiteStoryRow);
        setStory(mapped.story);
        setStoryImages(mapped.storyImages);
      } else {
        setStory((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
      }
      triggerTimestampUpdate();
      showToast("success", "Story content updated successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateStory:", err);
      showToast("error", "Network error occurred while saving story.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  const updateStoryImages = useCallback(async (updates: Partial<StoryImagesConfig>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/story", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update story images.");
        return false;
      }

      if (result.data) {
        const mapped = mapSiteStoryRowToConfigs(result.data as SiteStoryRow);
        setStory(mapped.story);
        setStoryImages(mapped.storyImages);
      } else {
        setStoryImages((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
      }
      triggerTimestampUpdate();
      showToast("success", "Story images updated successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateStoryImages:", err);
      showToast("error", "Network error occurred while saving story images.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  // ─── INSTAGRAM ACTIONS (PROTECTED SERVER-SIDE API) ───
  const updateInstagramCTA = useCallback(async (updates: Partial<InstagramCTAConfig>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/instagram", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update Instagram section.");
        return false;
      }

      setInstagramCTA(mapInstagramRowToConfig(result.data as InstagramRow));
      triggerTimestampUpdate();
      showToast("success", "Instagram section updated successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateInstagramCTA:", err);
      showToast("error", "Network error occurred while saving Instagram section.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  const addInstagramEntry = useCallback(async (entryData: Omit<SharedInstagramEntry, "id" | "updatedAt">): Promise<SharedInstagramEntry | null> => {
    try {
      const payload = {
        image: entryData.image,
        alt: entryData.alt,
        instagram_handle: entryData.handle,
        instagram_url: entryData.url,
        description: entryData.description,
        quote: entryData.quote,
        eyebrow: entryData.eyebrow,
        heading_line1: entryData.headingLine1,
        heading_line2: entryData.headingLine2,
        cta_text: entryData.ctaText,
        display_order: entryData.displayOrder ?? (instagramEntries.length + 1),
        is_active: entryData.isActive !== undefined ? entryData.isActive : true,
      };

      const res = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return null;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to add Instagram entry.");
        return null;
      }

      const newEntry = mapInstagramRowToShared(result.data as InstagramRow);
      setInstagramEntries((prev) => [...prev, newEntry]);
      triggerTimestampUpdate();
      showToast("success", "Instagram post added successfully.");
      return newEntry;
    } catch (err) {
      console.error("Unexpected error in addInstagramEntry:", err);
      showToast("error", "Network error occurred while saving Instagram post.");
      return null;
    }
  }, [instagramEntries.length, triggerTimestampUpdate, showToast]);

  const updateInstagramEntry = useCallback(async (id: string, updates: Partial<Omit<SharedInstagramEntry, "id" | "updatedAt">>): Promise<boolean> => {
    try {
      const payload: Record<string, unknown> = { id };
      if (updates.image !== undefined) payload.image = updates.image;
      if (updates.alt !== undefined) payload.alt = updates.alt;
      if (updates.handle !== undefined) payload.instagram_handle = updates.handle;
      if (updates.url !== undefined) payload.instagram_url = updates.url;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.quote !== undefined) payload.quote = updates.quote;
      if (updates.eyebrow !== undefined) payload.eyebrow = updates.eyebrow;
      if (updates.headingLine1 !== undefined) payload.heading_line1 = updates.headingLine1;
      if (updates.headingLine2 !== undefined) payload.heading_line2 = updates.headingLine2;
      if (updates.ctaText !== undefined) payload.cta_text = updates.ctaText;
      if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;

      const res = await fetch("/api/admin/instagram", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to update Instagram entry.");
        return false;
      }

      const updated = mapInstagramRowToShared(result.data as InstagramRow);
      setInstagramEntries((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (id === "00000000-0000-0000-0000-000000000003") {
        setInstagramCTA(mapInstagramRowToConfig(result.data as InstagramRow));
      }
      triggerTimestampUpdate();
      showToast("success", "Instagram entry updated successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in updateInstagramEntry:", err);
      showToast("error", "Network error occurred while updating Instagram entry.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  const deleteInstagramEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/instagram?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        showToast("error", "Unauthorized: Admin session expired. Please log in.");
        return false;
      }

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        showToast("error", result.error || "Failed to delete Instagram entry.");
        return false;
      }

      setInstagramEntries((prev) => prev.filter((item) => item.id !== id));
      triggerTimestampUpdate();
      showToast("success", "Instagram entry deleted successfully.");
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteInstagramEntry:", err);
      showToast("error", "Network error occurred while deleting Instagram entry.");
      return false;
    }
  }, [triggerTimestampUpdate, showToast]);

  // ─── RESET / MANUAL REFRESH ───
  const resetToDefaults = useCallback(() => {
    setIsLoading(true);
    const supabase = createClient();
    Promise.all([
      supabase.from("products").select("*").order("display_order", { ascending: true }),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("site_hero").select("*").limit(1).maybeSingle(),
      supabase.from("site_instagram").select("*"),
      supabase.from("site_story").select("*").limit(1).maybeSingle(),
    ])
      .then(([pRes, rRes, hRes, iRes, sRes]) => {
        if (pRes.data) {
          setBakes((pRes.data as ProductRow[]).map((row, idx, arr) => mapProductRowToShared(row, idx, arr.length)));
        }
        if (rRes.data) {
          setReviews((rRes.data as ReviewRow[]).map(mapReviewRowToShared));
        }
        if (hRes.data) {
          setHero(mapHeroRowToConfig(hRes.data as HeroRow));
        }
        if (iRes.data) {
          const rows = iRes.data as InstagramRow[];
          const bannerRow = rows.find((r) => r.id === "00000000-0000-0000-0000-000000000003") || rows[0];
          if (bannerRow) {
            setInstagramCTA(mapInstagramRowToConfig(bannerRow));
          }
          setInstagramEntries(rows.map(mapInstagramRowToShared));
        }
        if (sRes.data) {
          const mapped = mapSiteStoryRowToConfigs(sRes.data as SiteStoryRow);
          setStory(mapped.story);
          setStoryImages(mapped.storyImages);
        }
        setLastUpdated("Refreshed from Supabase database");
        showToast("success", "Dashboard data refreshed from database.");
      })
      .catch((err) => {
        console.error("Failed to refresh data:", err);
        showToast("error", "Failed to refresh data from Supabase.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showToast]);

  // ─── OUR FAVES (FOUR FEATURED BESTSELLERS) ───
  const faves: SharedProduct[] = useMemo(() => {
    // 1. If database products have is_bestseller = true
    const bestsellerRows = bakes.filter((b) => b.isBestseller === true);
    if (bestsellerRows.length >= 4) {
      return [...bestsellerRows]
        .sort((a, b) => (a.bestsellerOrder ?? 99) - (b.bestsellerOrder ?? 99))
        .slice(0, 4)
        .map((item, idx) => ({
          ...item,
          serial: `0${idx + 1} / 04`,
        }));
    }

    // 2. Deterministic match against the 4 canonical categories:
    // 01 Muffins, 02 Cookies, 03 Mocha Oreo, 04 Tiramisu
    const findMatch = (matcher: (b: SharedProduct) => boolean, fallback: SharedProduct): SharedProduct => {
      const found = bakes.find(matcher);
      if (!found) return fallback;
      return {
        ...fallback,
        ...found,
        name: found.name || fallback.name,
        description: found.description || fallback.description,
        image: found.image || fallback.image,
        price: found.price || fallback.price,
      };
    };

    return [
      findMatch((b) => /muffin/i.test(b.name) || /muffin/i.test(b.category), INITIAL_FAVES[0]),
      findMatch((b) => /cookie/i.test(b.name) || /cookie/i.test(b.category), INITIAL_FAVES[1]),
      findMatch((b) => /oreo/i.test(b.name) || /fudge/i.test(b.name), INITIAL_FAVES[2]),
      findMatch((b) => /tiramisu/i.test(b.name) || /tiramisu/i.test(b.category), INITIAL_FAVES[3]),
    ].map((item, idx) => ({
      ...item,
      serial: `0${idx + 1} / 04`,
    }));
  }, [bakes]);

  // ─── STATS ───
  const stats: AdminStats = useMemo(() => ({
    totalBakes: bakes.length,
    totalReviews: reviews.length,
    lastUpdated,
  }), [bakes.length, reviews.length, lastUpdated]);

  const value = useMemo<AdminContextType>(() => ({
    bakes,
    faves,
    reviews,
    hero,
    story,
    storyImages,
    instagramCTA,
    instagramEntries,
    stats,
    isLoading,
    isLoaded,
    updateHero,
    updateStory,
    updateStoryImages,
    updateInstagramCTA,
    addInstagramEntry,
    updateInstagramEntry,
    deleteInstagramEntry,
    addBake,
    updateBake,
    deleteBake,
    addReview,
    updateReview,
    deleteReview,
    resetToDefaults,
    showToast,
    toast,
    // Safe empty array for backward compatibility
    gallery: [],
  }), [
    bakes,
    faves,
    reviews,
    hero,
    story,
    storyImages,
    instagramCTA,
    instagramEntries,
    stats,
    isLoading,
    isLoaded,
    updateHero,
    updateStory,
    updateStoryImages,
    updateInstagramCTA,
    addInstagramEntry,
    updateInstagramEntry,
    deleteInstagramEntry,
    addBake,
    updateBake,
    deleteBake,
    addReview,
    updateReview,
    deleteReview,
    resetToDefaults,
    showToast,
    toast,
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
