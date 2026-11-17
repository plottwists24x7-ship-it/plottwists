import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STORY_SINGLETON_ID = "00000000-0000-0000-0000-000000000002";

/**
 * GET /api/admin/story
 * Retrieves the full unified story record from the database.
 */
export async function GET(req: NextRequest) {
  const auth = await validateAdminRequest(req, { checkCsrf: false });
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("site_story")
      .select("*")
      .eq("id", STORY_SINGLETON_ID)
      .single();

    if (error) {
      console.error("[Story Admin API Error] GET /api/admin/story failed:", error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch story: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Story Admin API Error] GET /api/admin/story unhandled:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * Shared helper to update site_story singleton with image replacement cleanup.
 */
async function updateStorySingleton(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const supabaseAdmin = createAdminClient();

    // 1. Fetch current singleton row
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("site_story")
      .select("*")
      .eq("id", STORY_SINGLETON_ID)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Story singleton record not found in database." },
        { status: 404 }
      );
    }

    const dbPayload: Record<string, unknown> = {};

    // Editorial text fields
    if (body.isEnabled !== undefined || body.is_enabled !== undefined) {
      dbPayload.is_enabled = Boolean(body.isEnabled !== undefined ? body.isEnabled : body.is_enabled);
    }
    if (body.tagline !== undefined) dbPayload.tagline = String(body.tagline).trim();
    if (body.title !== undefined) dbPayload.title = String(body.title).trim();
    if (body.subtitleScript !== undefined || body.subtitle_script !== undefined) {
      dbPayload.subtitle_script = String(body.subtitleScript !== undefined ? body.subtitleScript : body.subtitle_script).trim();
    }
    if (body.noteLeft !== undefined || body.note_left !== undefined) {
      dbPayload.note_left = String(body.noteLeft !== undefined ? body.noteLeft : body.note_left).trim();
    }
    if (body.noteRight !== undefined || body.note_right !== undefined) {
      dbPayload.note_right = String(body.noteRight !== undefined ? body.noteRight : body.note_right).trim();
    }
    if (body.recipeNumber !== undefined || body.recipe_number !== undefined) {
      dbPayload.recipe_number = String(body.recipeNumber !== undefined ? body.recipeNumber : body.recipe_number).trim();
    }
    if (body.description !== undefined) dbPayload.description = String(body.description).trim();
    if (body.ctaText !== undefined || body.cta_text !== undefined) {
      dbPayload.cta_text = String(body.ctaText !== undefined ? body.ctaText : body.cta_text).trim();
    }
    if (body.ctaLink !== undefined || body.cta_link !== undefined) {
      dbPayload.cta_link = String(body.ctaLink !== undefined ? body.ctaLink : body.cta_link).trim();
    }
    if (body.badgeBottom !== undefined || body.badge_bottom !== undefined) {
      dbPayload.badge_bottom = String(body.badgeBottom !== undefined ? body.badgeBottom : body.badge_bottom).trim();
    }
    if (body.stampTopText !== undefined || body.stamp_top_text !== undefined) {
      dbPayload.stamp_top_text = String(body.stampTopText !== undefined ? body.stampTopText : body.stamp_top_text).trim();
    }
    if (body.stampBottomText !== undefined || body.stamp_bottom_text !== undefined) {
      dbPayload.stamp_bottom_text = String(body.stampBottomText !== undefined ? body.stampBottomText : body.stamp_bottom_text).trim();
    }
    if (body.chefsPickText !== undefined || body.chefs_pick_text !== undefined) {
      dbPayload.chefs_pick_text = String(body.chefsPickText !== undefined ? body.chefsPickText : body.chefs_pick_text).trim();
    }
    if (body.batchChecklist !== undefined || body.batch_checklist !== undefined) {
      const checklist = body.batchChecklist !== undefined ? body.batchChecklist : body.batch_checklist;
      if (Array.isArray(checklist)) {
        dbPayload.batch_checklist = checklist;
      }
    }

    // Story 4 unified images
    const imageReplacements: Array<{ newPath?: string; oldPath?: string }> = [];

    // Main Polaroid
    const newMain = body.main_polaroid_url ?? body.mainPolaroid ?? body.image;
    if (newMain !== undefined && newMain !== existing.main_polaroid_url) {
      dbPayload.main_polaroid_url = String(newMain).trim();
      imageReplacements.push({ newPath: String(newMain).trim(), oldPath: existing.main_polaroid_url });
    }
    if (body.main_polaroid_alt !== undefined || body.imageAlt !== undefined) {
      dbPayload.main_polaroid_alt = String(body.main_polaroid_alt !== undefined ? body.main_polaroid_alt : body.imageAlt).trim();
    }

    // Badge 1
    const newBadge1 = body.badge_1_url ?? body.badge1;
    if (newBadge1 !== undefined && newBadge1 !== existing.badge_1_url) {
      dbPayload.badge_1_url = String(newBadge1).trim();
      imageReplacements.push({ newPath: String(newBadge1).trim(), oldPath: existing.badge_1_url });
    }
    if (body.badge_1_label !== undefined) dbPayload.badge_1_label = String(body.badge_1_label).trim();

    // Badge 2
    const newBadge2 = body.badge_2_url ?? body.badge2;
    if (newBadge2 !== undefined && newBadge2 !== existing.badge_2_url) {
      dbPayload.badge_2_url = String(newBadge2).trim();
      imageReplacements.push({ newPath: String(newBadge2).trim(), oldPath: existing.badge_2_url });
    }
    if (body.badge_2_label !== undefined) dbPayload.badge_2_label = String(body.badge_2_label).trim();

    // Badge 3
    const newBadge3 = body.badge_3_url ?? body.badge3;
    if (newBadge3 !== undefined && newBadge3 !== existing.badge_3_url) {
      dbPayload.badge_3_url = String(newBadge3).trim();
      imageReplacements.push({ newPath: String(newBadge3).trim(), oldPath: existing.badge_3_url });
    }
    if (body.badge_3_label !== undefined) dbPayload.badge_3_label = String(body.badge_3_label).trim();

    // 2. Perform DB update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("site_story")
      .update(dbPayload)
      .eq("id", STORY_SINGLETON_ID)
      .select()
      .single();

    if (updateError) {
      console.error("[Story Admin API Error] Update failed:", updateError);
      // Rollback newly uploaded images if update failed
      for (const item of imageReplacements) {
        if (item.newPath) {
          const storagePath = extractStoragePath(item.newPath);
          if (storagePath) {
            await supabaseAdmin.storage.from("products").remove([storagePath]).catch(() => {});
          }
        }
      }
      return NextResponse.json(
        { success: false, error: `Failed to update story: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 3. Remove superseded old images from storage if applicable
    for (const item of imageReplacements) {
      if (item.oldPath) {
        const oldStoragePath = extractStoragePath(item.oldPath);
        if (oldStoragePath) {
          try {
            await supabaseAdmin.storage.from("products").remove([oldStoragePath]);
          } catch (delErr) {
            console.warn("[Storage Warning] Could not remove superseded story image:", delErr);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Story persisted successfully to database.",
      data: updated,
      story: updated,
    });
  } catch (err) {
    console.error("[Story Admin API Error] Uncaught error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  return updateStorySingleton(req);
}

export async function POST(req: NextRequest) {
  return updateStorySingleton(req);
}
