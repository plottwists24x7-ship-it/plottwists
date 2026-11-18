import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath, isSameImageResource } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const INSTAGRAM_SINGLETON_ID = "00000000-0000-0000-0000-000000000003";

/**
 * GET /api/admin/instagram
 * Retrieves either a single Instagram entry by ID or all entries along with the primary banner.
 */
export async function GET(req: NextRequest) {
  const auth = await validateAdminRequest(req, { checkCsrf: false });
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    const supabaseAdmin = createAdminClient();

    if (id) {
      const { data, error } = await supabaseAdmin
        .from("site_instagram")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to fetch Instagram entry: ${error.message}` },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, data });
    }

    // Fetch all entries from site_instagram
    const { data: rows, error } = await supabaseAdmin
      .from("site_instagram")
      .select("*");

    if (error) {
      console.error("[Instagram API GET Error]:", error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch Instagram settings: ${error.message}` },
        { status: 500 }
      );
    }

    const allRows = rows || [];
    // Sort safely: singleton first or by display_order if present
    allRows.sort((a, b) => {
      if (a.id === INSTAGRAM_SINGLETON_ID) return -1;
      if (b.id === INSTAGRAM_SINGLETON_ID) return 1;
      const orderA = typeof a.display_order === "number" ? a.display_order : 999;
      const orderB = typeof b.display_order === "number" ? b.display_order : 999;
      return orderA - orderB;
    });

    const banner =
      allRows.find((r) => r.id === INSTAGRAM_SINGLETON_ID) ||
      allRows[0] ||
      null;

    // Separate gallery entries from the singleton banner
    const galleryEntries = allRows.filter((r) => r.id !== INSTAGRAM_SINGLETON_ID);

    return NextResponse.json({
      success: true,
      data: banner, // backward-compatible for singleton callers
      banner,
      entries: allRows,
      galleryEntries,
    });
  } catch (err) {
    console.error("[Instagram API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/instagram
 * Creates a new Instagram gallery entry via service-role admin client.
 */
export async function POST(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const {
      image,
      image_url,
      alt,
      alt_text,
      eyebrow = "Fresh from our oven →",
      heading_line1 = "Plot twists",
      heading_line2 = "daily on your feed.",
      description = "",
      quote = "",
      instagram_handle = "@plottwist24x",
      instagram_url = "https://www.instagram.com/plottwist24x7",
      cta_text = "FOLLOW",
      display_order,
      is_active = true,
    } = body;

    const finalImage = (image_url || image || "").trim();
    const finalAlt = (alt_text || alt || "PlotTwist Instagram Post").trim();

    if (!finalImage) {
      return NextResponse.json(
        { success: false, error: "Instagram image is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();
    const newId = crypto.randomUUID();

    const insertPayload: Record<string, unknown> = {
      id: newId,
      image_url: finalImage,
      alt_text: finalAlt,
      eyebrow: String(eyebrow).trim(),
      heading_line1: String(heading_line1).trim(),
      heading_line2: String(heading_line2).trim(),
      description: String(description).trim(),
      quote: String(quote).trim(),
      instagram_handle: String(instagram_handle).trim(),
      instagram_url: String(instagram_url).trim(),
      cta_text: String(cta_text).trim(),
    };

    if (display_order !== undefined && !isNaN(Number(display_order))) {
      insertPayload.display_order = Number(display_order);
    }
    if (is_active !== undefined) {
      insertPayload.is_active = Boolean(is_active);
    }

    let { data, error } = await supabaseAdmin
      .from("site_instagram")
      .insert(insertPayload)
      .select()
      .single();

    // Graceful fallback if display_order or is_active columns do not exist yet in schema
    if (error && (error.message.includes("display_order") || error.message.includes("is_active"))) {
      delete insertPayload.display_order;
      delete insertPayload.is_active;
      const retry = await supabaseAdmin
        .from("site_instagram")
        .insert(insertPayload)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("[Instagram API Insert Error]:", error);
      const newStoragePath = extractStoragePath(finalImage);
      if (newStoragePath) {
        await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch(() => {});
      }
      return NextResponse.json(
        { success: false, error: `Failed to insert Instagram entry: ${error.message}` },
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
 * Updates an existing Instagram record (either the singleton banner or a specific gallery post).
 */
export async function PATCH(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const supabaseAdmin = createAdminClient();

    // Default to singleton banner if no ID is specified
    const targetId = body.id ? String(body.id).trim() : INSTAGRAM_SINGLETON_ID;

    // 1. Fetch current target row
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("site_instagram")
      .select("*")
      .eq("id", targetId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: `Instagram record (${targetId}) not found in database.` },
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
    if (body.display_order !== undefined && !isNaN(Number(body.display_order))) {
      dbPayload.display_order = Number(body.display_order);
    }
    if (body.is_active !== undefined) {
      dbPayload.is_active = Boolean(body.is_active);
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
    let { data: updated, error: updateError } = await supabaseAdmin
      .from("site_instagram")
      .update(dbPayload)
      .eq("id", targetId)
      .select()
      .single();

    // Graceful fallback if display_order or is_active columns do not exist yet in schema
    if (updateError && (updateError.message.includes("display_order") || updateError.message.includes("is_active"))) {
      delete dbPayload.display_order;
      delete dbPayload.is_active;
      const retry = await supabaseAdmin
        .from("site_instagram")
        .update(dbPayload)
        .eq("id", targetId)
        .select()
        .single();
      updated = retry.data;
      updateError = retry.error;
    }

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

/**
 * DELETE /api/admin/instagram
 * Deletes an Instagram gallery entry by ID.
 * Protects the singleton banner from accidental deletion.
 */
export async function DELETE(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    let id = req.nextUrl.searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // no json body
      }
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Instagram entry ID is required for deletion." },
        { status: 400 }
      );
    }

    if (id === INSTAGRAM_SINGLETON_ID) {
      return NextResponse.json(
        {
          success: false,
          error: "The primary Instagram banner cannot be deleted. You can edit its image and content instead.",
        },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch existing record to clean up storage image
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("site_instagram")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Instagram entry not found." },
        { status: 404 }
      );
    }

    // Delete record from database
    const { error: deleteError } = await supabaseAdmin
      .from("site_instagram")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Instagram API DELETE Error]:", deleteError);
      return NextResponse.json(
        { success: false, error: `Failed to delete Instagram entry: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // Clean up storage image if applicable
    if (existing.image_url) {
      const storagePath = extractStoragePath(existing.image_url);
      if (storagePath) {
        try {
          await supabaseAdmin.storage.from("products").remove([storagePath]);
        } catch (delErr) {
          console.warn("[Storage Warning] Could not remove deleted Instagram image:", delErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Instagram gallery entry deleted successfully.",
      id,
    });
  } catch (err) {
    console.error("[Instagram API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
