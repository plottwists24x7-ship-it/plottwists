import { createBrowserClient } from "@supabase/ssr";

// Product records store an object path (for example `products/prod_oreo_fudge.jpg`),
// not a browser URL.  Keep the bucket configurable because bucket names are part of
// a project's Supabase configuration, not the products table schema.
export const PRODUCT_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "products";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
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

export async function uploadProductImage(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `products/${crypto.randomUUID()}.${extension}`;
  
  try {
    const { error } = await createClient().storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (!error) {
      return path;
    }
    console.warn("Storage bucket upload failed, falling back to Data URL:", error.message || error);
  } catch (err) {
    console.warn("Storage upload exception, using Data URL fallback:", err);
  }

  // Fallback: Read file as Data URL so image persists in database image_url column
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
