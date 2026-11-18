import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, extractStoragePath, isSameImageResource } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/reviews
 * Retrieves all reviews or a single review by ID via service-role client.
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
        .from("reviews")
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
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

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
 * POST /api/admin/reviews
 * Creates a new customer review via service-role admin client.
 */
export async function POST(req: NextRequest) {
  const auth = await validateAdminRequest(req);
  if (!auth.authorized || auth.response) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const {
      customer_name,
      customerName,
      name,
      customer_image,
      customerImage,
      portrait,
      review,
      rating = 5,
      verified = false,
      review_date,
      reviewDate,
    } = body;

    const finalName = (customer_name || customerName || name || "").trim();
    const finalImage = (customer_image || customerImage || portrait || "").trim();
    const finalReview = (review || "").trim();
    const finalRating = Math.round(Number(rating));

    if (!finalName) {
      return NextResponse.json(
        { success: false, error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!finalReview) {
      return NextResponse.json(
        { success: false, error: "Review text content is required." },
        { status: 400 }
      );
    }

    if (isNaN(finalRating) || finalRating < 1 || finalRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    const defaultAvatar =
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=450&h=450&fit=crop&q=80";

    const insertPayload = {
      customer_name: finalName,
      customer_image: finalImage || defaultAvatar,
      review: finalReview,
      rating: finalRating,
      verified: Boolean(verified),
      review_date:
        review_date ||
        reviewDate ||
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    };

    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("[Reviews API Insert Error]:", error);
      const newStoragePath = extractStoragePath(finalImage);
      if (newStoragePath) {
        await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch(() => {});
      }
      return NextResponse.json(
        { success: false, error: `Failed to insert review: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Reviews API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/reviews
 * Updates a customer review with validation and image cleanup.
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
        { success: false, error: "Review ID is required for update." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch existing review for comparison
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Review not found." },
        { status: 404 }
      );
    }

    const dbPayload: Record<string, unknown> = {};

    if (updateFields.customer_name !== undefined || updateFields.customerName !== undefined || updateFields.name !== undefined) {
      const nameVal = (updateFields.customer_name || updateFields.customerName || updateFields.name || "").trim();
      if (!nameVal) {
        return NextResponse.json({ success: false, error: "Customer name cannot be empty." }, { status: 400 });
      }
      dbPayload.customer_name = nameVal;
    }

    if (updateFields.review !== undefined) {
      const reviewVal = String(updateFields.review).trim();
      if (!reviewVal) {
        return NextResponse.json({ success: false, error: "Review text cannot be empty." }, { status: 400 });
      }
      dbPayload.review = reviewVal;
    }

    if (updateFields.rating !== undefined) {
      const ratingVal = Math.round(Number(updateFields.rating));
      if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
        return NextResponse.json(
          { success: false, error: "Rating must be an integer between 1 and 5." },
          { status: 400 }
        );
      }
      dbPayload.rating = ratingVal;
    }

    if (updateFields.verified !== undefined) {
      dbPayload.verified = Boolean(updateFields.verified);
    }

    if (updateFields.review_date !== undefined || updateFields.reviewDate !== undefined) {
      dbPayload.review_date = updateFields.review_date || updateFields.reviewDate;
    }

    const newImage =
      updateFields.customer_image ??
      updateFields.customerImage ??
      updateFields.portrait;

    let hasImageChanged = false;
    if (newImage !== undefined && !isSameImageResource(String(newImage), existing.customer_image)) {
      dbPayload.customer_image = String(newImage).trim();
      hasImageChanged = true;
    }

    if (Object.keys(dbPayload).length === 0) {
      return NextResponse.json({ success: true, data: existing });
    }

    // Execute database update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("reviews")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Reviews API Update Error]:", updateError);
      if (hasImageChanged && newImage) {
        const newStoragePath = extractStoragePath(newImage);
        if (newStoragePath) {
          await supabaseAdmin.storage.from("products").remove([newStoragePath]).catch(() => {});
        }
      }
      return NextResponse.json(
        { success: false, error: `Failed to update review: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Cleanup old image if superseded
    if (hasImageChanged && existing.customer_image) {
      const oldStoragePath = extractStoragePath(existing.customer_image);
      if (oldStoragePath) {
        try {
          await supabaseAdmin.storage.from("products").remove([oldStoragePath]);
        } catch (delErr) {
          console.warn("[Storage Warning] Could not remove superseded customer image:", delErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[Reviews API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews
 * Deletes a review and safely removes custom storage image if applicable.
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
        { success: false, error: "Review ID is required for deletion." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch review row to inspect customer_image
    const { data: existing } = await supabaseAdmin
      .from("reviews")
      .select("customer_image")
      .eq("id", id)
      .maybeSingle();

    // Delete database record
    const { error: deleteError } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Reviews API Delete Error]:", deleteError);
      return NextResponse.json(
        { success: false, error: `Failed to delete review: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // Attempt to delete custom storage avatar
    if (existing?.customer_image) {
      const storagePath = extractStoragePath(existing.customer_image);
      if (storagePath) {
        try {
          await supabaseAdmin.storage.from("products").remove([storagePath]);
        } catch (delErr) {
          console.warn("[Storage Warning] Failed to delete customer image after review deletion:", delErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (err) {
    console.error("[Reviews API Uncaught Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
