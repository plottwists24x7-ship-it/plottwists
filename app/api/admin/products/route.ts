import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath, isSameImageResource } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/products
 * Retrieves all products or a single product by ID via service-role client.
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
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Adds a new product to the catalog via service-role admin client.
 */
export async function POST(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const {
      name,
      description = "",
      image,
      image_url,
      price = null,
      category = "Cheesecakes",
      badge = null,
      is_popular = false,
      isPopular,
      display_order,
      is_bestseller = false,
      isBestseller,
      bestseller_order = null,
      bestsellerOrder,
    } = body;

    const finalImage = image_url || image;
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!finalImage || typeof finalImage !== "string") {
      return NextResponse.json(
        { success: false, error: "Product image is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Determine display_order if not provided
    let nextDisplayOrder = Number(display_order);
    if (isNaN(nextDisplayOrder)) {
      const { data: maxRow } = await supabaseAdmin
        .from("products")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      nextDisplayOrder = (maxRow?.display_order ?? 0) + 1;
    }

    const insertPayload = {
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      image_url: finalImage.trim(),
      price: price ? String(price).trim() : null,
      category: String(category).trim(),
      badge: badge ? String(badge).trim() : null,
      is_popular: Boolean(isPopular !== undefined ? isPopular : is_popular),
      display_order: nextDisplayOrder,
      is_bestseller: Boolean(isBestseller !== undefined ? isBestseller : is_bestseller),
      bestseller_order: bestsellerOrder !== undefined ? bestsellerOrder : bestseller_order,
    };

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("[Products API Insert Error]:", error);
      // Rollback newly uploaded storage image if present
      const newStoragePath = extractStoragePath(finalImage);
      if (newStoragePath) {
        await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch(() => {});
      }
      return NextResponse.json(
        { success: false, error: `Failed to insert product: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Products API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/products
 * Updates an existing product with image replacement cleanup and rollback safety.
 */
export async function PATCH(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const { id, updates: nestedUpdates, ...rest } = body;
    const updateFields = nestedUpdates || rest;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Product ID is required for update." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch existing product record for image comparison
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    const dbPayload: Record<string, unknown> = {};
    if (updateFields.name !== undefined) dbPayload.name = String(updateFields.name).trim();
    if (updateFields.description !== undefined) dbPayload.description = String(updateFields.description).trim();
    if (updateFields.price !== undefined) dbPayload.price = updateFields.price ? String(updateFields.price).trim() : null;
    if (updateFields.category !== undefined) dbPayload.category = String(updateFields.category).trim();
    if (updateFields.badge !== undefined) dbPayload.badge = updateFields.badge ? String(updateFields.badge).trim() : null;
    if (updateFields.display_order !== undefined) dbPayload.display_order = Number(updateFields.display_order);
    if (updateFields.is_popular !== undefined || updateFields.isPopular !== undefined) {
      dbPayload.is_popular = Boolean(updateFields.isPopular !== undefined ? updateFields.isPopular : updateFields.is_popular);
    }
    if (updateFields.is_bestseller !== undefined || updateFields.isBestseller !== undefined) {
      dbPayload.is_bestseller = Boolean(updateFields.isBestseller !== undefined ? updateFields.isBestseller : updateFields.is_bestseller);
    }
    if (updateFields.bestseller_order !== undefined || updateFields.bestsellerOrder !== undefined) {
      dbPayload.bestseller_order = updateFields.bestsellerOrder !== undefined ? updateFields.bestsellerOrder : updateFields.bestseller_order;
    }

    const newImage = updateFields.image_url ?? updateFields.imagePath ?? updateFields.image;
    let hasImageChanged = false;
    if (newImage !== undefined && !isSameImageResource(String(newImage), existing.image_url)) {
      dbPayload.image_url = String(newImage).trim();
      hasImageChanged = true;
    }

    if (Object.keys(dbPayload).length === 0) {
      return NextResponse.json({ success: true, data: existing });
    }

    // Execute database update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("products")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Products API Update Error]:", updateError);
      // Image replacement cleanup step 3: If DB update fails, delete new image from storage as rollback
      if (hasImageChanged && newImage) {
        const newStoragePath = extractStoragePath(newImage);
        if (newStoragePath) {
          await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch((delErr) => {
            console.warn("[Rollback Warning] Failed to delete newly uploaded image during rollback:", delErr);
          });
        }
      }
      return NextResponse.json(
        { success: false, error: `Failed to update product: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Image replacement cleanup step 4 & 5: If DB update succeeds, attempt to delete old image
    if (hasImageChanged && existing.image_url) {
      const oldStoragePath = extractStoragePath(existing.image_url);
      if (oldStoragePath) {
        try {
          const { error: oldDelError } = await supabaseAdmin.storage
            .from("products")
            .remove([oldStoragePath]);
          if (oldDelError) {
            console.warn("[Storage Warning] Could not remove superseded image from storage:", oldDelError.message);
          }
        } catch (delErr) {
          console.warn("[Storage Warning] Exception while removing superseded image:", delErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[Products API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products
 * Removes a product and safely deletes its custom storage image if applicable.
 */
export async function DELETE(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json().catch(() => ({}));
    const id = body.id || req.nextUrl.searchParams.get("id");

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Product ID is required for deletion." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch product row to know image path
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    // 2. Delete database record
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Products API Delete Error]:", deleteError);
      return NextResponse.json(
        { success: false, error: `Failed to delete product: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // 3. Attempt to delete storage image if dynamic
    if (existing?.image_url) {
      const storagePath = extractStoragePath(existing.image_url);
      if (storagePath) {
        try {
          await supabaseAdmin.storage.from("products").remove([storagePath]);
        } catch (delErr) {
          console.warn("[Storage Warning] Failed to delete product image after record deletion:", delErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    console.error("[Products API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
