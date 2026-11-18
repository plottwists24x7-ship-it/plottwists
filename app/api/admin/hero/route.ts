import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath, isSameImageResource } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const HERO_SINGLETON_ID = "00000000-0000-0000-0000-000000000001";

/**
 * GET /api/admin/hero
 * Retrieves the current hero singleton record.
 */
export async function GET(req: NextRequest) {
  const auth = await validateAdminRequest(req, { checkCsrf: false });
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("site_hero")
      .select("*")
      .eq("id", HERO_SINGLETON_ID)
      .single();

    if (error) {
      console.error("[Hero API GET Error]:", error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch hero settings: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Hero API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/hero
 * Updates the hero section singleton record with image replacement cleanup.
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
      .from("site_hero")
      .select("*")
      .eq("id", HERO_SINGLETON_ID)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Hero singleton record not found in database." },
        { status: 404 }
      );
    }

    const dbPayload: Record<string, unknown> = {};

    if (body.alt_text !== undefined || body.alt !== undefined) {
      dbPayload.alt_text = String(body.alt_text !== undefined ? body.alt_text : body.alt).trim();
    }
    if (body.caption_title !== undefined || body.captionTitle !== undefined) {
      dbPayload.caption_title = String(body.caption_title !== undefined ? body.caption_title : body.captionTitle).trim();
    }
    if (body.caption_subtitle !== undefined || body.captionSubtitle !== undefined) {
      dbPayload.caption_subtitle = String(body.caption_subtitle !== undefined ? body.caption_subtitle : body.captionSubtitle).trim();
    }
    if (body.scale !== undefined) {
      const parsedScale = Number(body.scale);
      if (!isNaN(parsedScale) && parsedScale > 0) {
        dbPayload.scale = parsedScale;
      }
    }
    if (body.object_fit !== undefined || body.objectFit !== undefined) {
      dbPayload.object_fit = String(body.object_fit !== undefined ? body.object_fit : body.objectFit).trim();
    }
    if (body.aspect_ratio !== undefined || body.aspectRatio !== undefined) {
      dbPayload.aspect_ratio = String(body.aspect_ratio !== undefined ? body.aspect_ratio : body.aspectRatio).trim();
    }

    const newImage = body.image_url ?? body.image;
    let hasImageChanged = false;

    if (newImage !== undefined && !isSameImageResource(String(newImage), existing.image_url)) {
      dbPayload.image_url = String(newImage).trim();
      hasImageChanged = true;
    }

    if (Object.keys(dbPayload).length === 0) {
      return NextResponse.json({ success: true, data: existing });
    }

    // 2. Perform DB update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("site_hero")
      .update(dbPayload)
      .eq("id", HERO_SINGLETON_ID)
      .select()
      .single();

    if (updateError) {
      console.error("[Hero API PATCH Error]:", updateError);
      // Rollback new image if update failed
      if (hasImageChanged && newImage) {
        const newStoragePath = extractStoragePath(newImage);
        if (newStoragePath) {
          await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch(() => {});
        }
      }
      return NextResponse.json(
        { success: false, error: `Failed to update hero settings: ${updateError.message}` },
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
          console.warn("[Storage Warning] Could not remove superseded hero image:", delErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[Hero API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
