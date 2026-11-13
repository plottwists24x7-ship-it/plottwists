import { NextResponse } from "next/server";
import { getPersistedStory } from "@/lib/story-store";

export async function GET() {
  try {
    const story = getPersistedStory();
    return NextResponse.json(story, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[Story API Error] GET /api/story failed:", err);
    return NextResponse.json({ error: "Failed to load story" }, { status: 500 });
  }
}

