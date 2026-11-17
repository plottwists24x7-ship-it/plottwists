import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const INSTAGRAM_SINGLETON_ID = "00000000-0000-0000-0000-000000000003";

/**
 * GET /api/admin/instagram
 * Retrieves the current Instagram section singleton record.
 */
export async function GET(req: NextRequest) {
  const auth = await validateAdminRequest(req, { checkCsrf: false });
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("site_instagram")
      .select("*")
      .eq("id", INSTAGRAM_SINGLETON_ID)
      .single();

    if (error) {
      console.error("[Instagram API GET Error]:", error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch Instagram settings: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Instagram API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/instagram
 * Updates the Instagram section singleton record with image replacement cleanup.
 */
export async function PATCH(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const supabaseAdmin = createAdminClient();

    // 1. Fetch current singleton row
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("site_instagram")
      .select("*")
      .eq("id", INSTAGRAM_SINGLETON_ID)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Instagram singleton record not found in database." },
        { status: 404 }
      );
    }

    const dbPayload: Record<string, unknown> = {};

    if (body.alt_text !== undefined || body.alt !== undefined) {
      dbPayload.alt_text = String(body.alt_text !== undefined ? body.alt_text : body.alt).trim();
    }
    if (body.eyebrow !== undefined) dbPayload.eyebrow = String(body.eyebrow).trim();
    if (body.heading_line1 !== undefined) dbPayload.heading_line1 = String(body.heading_line1).trim();
    if (body.heading_line2 !== undefined) dbPayload.heading_line2 = String(body.heading_line2).trim();
    if (body.description !== undefined) dbPayload.description = String(body.description).trim();
    if (body.quote !== undefined) dbPayload.quote = String(body.quote).trim();
    if (body.instagram_handle !== undefined) dbPayload.instagram_handle = String(body.instagram_handle).trim();
    if (body.instagram_url !== undefined) dbPayload.instagram_url = String(body.instagram_url).trim();
    if (body.cta_text !== undefined) dbPayload.cta_text = String(body.cta_text).trim();

    const newImage = body.image_url ?? body.image;
    let hasImageChanged = false;

    if (newImage !== undefined && newImage !== existing.image_url) {
      dbPayload.image_url = String(newImage).trim();
      hasImageChanged = true;
    }

    // 2. Perform DB update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("site_instagram")
      .update(dbPayload)
      .eq("id", INSTAGRAM_SINGLETON_ID)
      .select()
      .single();

    if (updateError) {
      console.error("[Instagram API PATCH Error]:", updateError);
      if (hasImageChanged && newImage) {
        const newStoragePath = extractStoragePath(newImage);
        if (newStoragePath) {
          await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch(() => {});
        }
      }
      return NextResponse.json(
        { success: false, error: `Failed to update Instagram settings: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 3. Remove superseded old image from storage if applicable
    if (hasImageChanged && existing.image_url) {
      const oldStoragePath = extractStoragePath(existing.image_url);
      if (oldStoragePath) {
        try {
          await supabaseAdmin.storage.from("products").remove([oldStoragePath]);
        } catch (delErr) {
          console.warn("[Storage Warning] Could not remove superseded Instagram image:", delErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[Instagram API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
