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
  "image/gif",
  "image/svg+xml",
]);

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

let hasWarnedMissingSupabase = false;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined" && !hasWarnedMissingSupabase) {
      console.warn(
        "Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) are missing in environment variables. Falling back to offline client."
      );
      hasWarnedMissingSupabase = true;
    }
    return createBrowserClient(
      url || "https://placeholder-offline.supabase.co",
      key || "placeholder-anon-key"
    );
  }

  return createBrowserClient(url, key);
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

  // Handle sample prefix paths for gallery, instagram, story, and products
  if (
    image.startsWith("gallery/") ||
    image.startsWith("instagram/") ||
    image.startsWith("story/") ||
    image.startsWith("products/")
  ) {
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
 * Validates and uploads an image to Supabase Storage in the specified folder.
 * Enforces file format, size limits, and requires a valid Supabase Storage bucket.
 * Does NOT fall back to Base64 strings to prevent multi-megabyte database row bloat.
 */
export async function uploadImage(file: File, folder: string = "products"): Promise<string> {
  // 1. Validate MIME type
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error(
      `Unsupported file format (${file.type || "unknown"}). Please upload a JPG, PNG, WEBP, GIF, or SVG image.`
    );
  }

  // 2. Validate file size (max 5 MB)
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File size (${sizeInMb} MB) exceeds the 5 MB limit. Please choose a smaller image.`);
  }

  // 3. Generate secure, unique object storage path
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
  const path = `${cleanFolder}/${Date.now()}-${uniqueId}.${extension}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    const isBucketMissing =
      error.message?.toLowerCase().includes("bucket not found") ||
      (error as { error?: string })?.error?.toLowerCase().includes("bucket not found");

    if (isBucketMissing) {
      throw new Error(
        `Supabase Storage bucket '${PRODUCT_IMAGE_BUCKET}' not found. Please create the public bucket '${PRODUCT_IMAGE_BUCKET}' in your Supabase Dashboard before uploading images.`
      );
    }

    throw new Error(`Failed to upload image to Supabase Storage: ${error.message}`);
  }

  return path;
}

/**
 * Backwards-compatible alias for existing callers
 */
export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, "products");
}
