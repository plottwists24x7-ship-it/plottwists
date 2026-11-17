import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ALLOWED_FOLDERS = new Set([
  "products",
  "hero",
  "story",
  "instagram",
  "reviews",
]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Validates file magic bytes against reported MIME type.
 * Ensures uploaded file content truly matches the expected image format.
 */
function validateImageMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WEBP: "RIFF" (0..3) ... "WEBP" (8..11)
  if (mimeType === "image/webp") {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  return false;
}

/**
 * POST /api/admin/upload
 * Securely uploads an image to the 'products' Supabase Storage bucket using service-role credentials.
 */
export async function POST(req: NextRequest) {
  // 1. Authenticate admin & CSRF check
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = (formData.get("folder") as string | null) || "products";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided for upload." },
        { status: 400 }
      );
    }

    // 2. Validate folder allowlist and sanitize
    const folder = rawFolder.toLowerCase().trim();
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid target folder '${rawFolder}'. Allowed: ${Array.from(ALLOWED_FOLDERS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          success: false,
          error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 5 MB.`,
        },
        { status: 400 }
      );
    }

    // 4. Validate MIME type
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported MIME type '${file.type}'. Allowed types: JPEG, PNG, WEBP.`,
        },
        { status: 400 }
      );
    }

    // 5. Inspect magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    if (!validateImageMagicBytes(uint8, mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: "File content does not match reported image format header (magic bytes check failed).",
        },
        { status: 400 }
      );
    }

    // 6. Generate collision-resistant, safe storage path
    let extension = "jpg";
    if (mimeType === "image/png") extension = "png";
    if (mimeType === "image/webp") extension = "webp";

    const uniqueId = crypto.randomUUID();
    const objectPath = `${folder}/${Date.now()}-${uniqueId}.${extension}`;

    // 7. Upload to Supabase Storage using service-role admin client
    const supabaseAdmin = createAdminClient();
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "products";

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(objectPath, uint8, {
        contentType: mimeType,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("[Storage Upload Error]:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to store image in storage bucket: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    // 8. Compute public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(objectPath);

    return NextResponse.json({
      success: true,
      path: objectPath,
      publicUrl: urlData.publicUrl,
    });
  } catch (err) {
    console.error("[Upload API Uncaught Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing image upload.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/upload
 * Deletes an image from the 'products' Supabase Storage bucket using service-role credentials.
 */
export async function DELETE(req: NextRequest) {
  // 1. Authenticate admin & CSRF check
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawPath = body.path || req.nextUrl.searchParams.get("path");

    const storagePath = extractStoragePath(rawPath);
    if (!storagePath) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or non-removable storage path provided.",
        },
        { status: 400 }
      );
    }

    // Verify folder component
    const folder = storagePath.split("/")[0];
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete path outside allowed folders: ${folder}`,
        },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET || "products";

    const { error: deleteError } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([storagePath]);

    if (deleteError) {
      console.error("[Storage Deletion Error]:", deleteError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to remove image from storage: ${deleteError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Object '${storagePath}' deleted from storage bucket.`,
    });
  } catch (err) {
    console.error("[Storage Deletion Uncaught Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred during storage deletion.",
      },
      { status: 500 }
    );
  }
}
