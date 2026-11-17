import { createBrowserClient } from "@supabase/ssr";

// Product records store an object path (for example `products/prod_oreo_fudge.jpg`),
// not a browser URL. Keep the bucket configurable because bucket names are part of
// a project's Supabase configuration, not the products table schema.
export const PRODUCT_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "products";

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Normalizes the Supabase Project URL:
 * - Trims whitespace
 * - Strips trailing slashes
 * - Strips accidental /rest/v1 suffix
 * - Enforces fail-closed configuration (never falls back to placeholder domains)
 */
export function normalizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || rawUrl.trim().length === 0) {
    throw new Error("Configuration error: NEXT_PUBLIC_SUPABASE_URL is missing or empty.");
  }
  let url = rawUrl.trim();
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/rest\/v1\/?$/i, "");
  url = url.replace(/\/+$/, "");

  if (url.includes("placeholder-offline")) {
    throw new Error(
      "Configuration error: Supabase URL cannot use placeholder-offline domain."
    );
  }

  return url;
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !key) {
    throw new Error(
      "Supabase client initialization failed: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not defined."
    );
  }

  const url = normalizeSupabaseUrl(rawUrl);
  return createBrowserClient(url, key.trim());
}

export function getProductImageUrl(image: string) {
  if (!image) return "/images/baker-where/prod_chocolate_cookies.jpg";
  if (image.startsWith("data:") || image.startsWith("/") || /^https?:\/\//i.test(image)) {
    return image;
  }

  // Handle hero special path
  if (image === "hero/cheesecake.png" || image === "cheesecake.png") {
    return "/cheesecake.png";
  }

  // Handle sample prefix paths for static local sample assets (e.g. products/prod_oreo_fudge.jpg)
  const isSampleAsset = /^(gallery|instagram|story|products)\/(prod_|gallery_|hero_|instagram_|bakery_|coffee_|story_)/.test(image);
  if (isSampleAsset) {
    const filename = image.replace(/^(gallery|instagram|story|products)\//, "");
    return `/images/baker-where/${filename}`;
  }

  try {
    return createClient().storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(image).data.publicUrl;
  } catch {
    return image;
  }
}

/**
 * Validates and uploads an image via the secure server-side admin upload API route.
 * Enforces file format (JPEG, PNG, WEBP), 5 MB size limit, and service-role storage.
 * Does NOT fall back to Base64 strings to prevent database row bloat.
 */
export async function uploadImage(file: File, folder: string = "products"): Promise<string> {
  // 1. Client-side validation: MIME type
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error(
      `Unsupported file format (${file.type || "unknown"}). Only JPEG, PNG, and WEBP images are supported.`
    );
  }

  // 2. Client-side validation: file size (max 5 MB)
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File size (${sizeInMb} MB) exceeds the 5 MB limit. Please choose a smaller image.`);
  }

  // 3. Delegate to secure server-side endpoint (which uses service-role and validates session + magic bytes)
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `Image upload failed with status ${response.status}`
    );
  }

  const result = await response.json();
  if (!result.success || !result.path) {
    throw new Error(result.message || "Upload response did not return a valid image path.");
  }

  return result.path;
}

/**
 * Backwards-compatible alias for existing callers
 */
export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, "products");
}
