import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { savePersistedStory, getPersistedStory } from "@/lib/story-store";
import { StoryConfig } from "@/lib/mock-data";

export async function GET() {
  try {
    const story = getPersistedStory();
    return NextResponse.json(story);
  } catch (err) {
    console.error("[Story API Error] GET /api/admin/story failed:", err);
    return NextResponse.json({ error: "Failed to load story" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAuthenticated = await verifySessionToken(sessionCookie);

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = (await req.json()) as Partial<StoryConfig>;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload." },
        { status: 400 }
      );
    }

    const updated = savePersistedStory(body);

    return NextResponse.json({
      success: true,
      message: "Story text content persisted successfully.",
      story: updated,
    });
  } catch (err) {
    console.error("[Story API Error] POST /api/admin/story failed:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error while saving story." },
      { status: 500 }
    );
  }
}

