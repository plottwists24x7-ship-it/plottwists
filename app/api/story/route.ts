import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_STORY, StoryConfig } from "@/lib/mock-data";
import { getProductImageUrl } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

const STORY_SINGLETON_ID = "00000000-0000-0000-0000-000000000002";

function mapRowToStoryConfig(row: Record<string, unknown>): StoryConfig {
  return {
    isEnabled: row.is_enabled !== undefined ? Boolean(row.is_enabled) : true,
    tagline: (row.tagline as string) || INITIAL_STORY.tagline,
    title: (row.title as string) || INITIAL_STORY.title,
    subtitleScript: (row.subtitle_script as string) || INITIAL_STORY.subtitleScript,
    noteLeft: (row.note_left as string) || INITIAL_STORY.noteLeft,
    noteRight: (row.note_right as string) || INITIAL_STORY.noteRight,
    recipeNumber: (row.recipe_number as string) || INITIAL_STORY.recipeNumber,
    description: (row.description as string) || INITIAL_STORY.description,
    ctaText: (row.cta_text as string) || INITIAL_STORY.ctaText,
    ctaLink: (row.cta_link as string) || INITIAL_STORY.ctaLink,
    image: getProductImageUrl((row.main_polaroid_url as string) || INITIAL_STORY.image),
    imageAlt: (row.main_polaroid_alt as string) || INITIAL_STORY.imageAlt,
    imageCaption: INITIAL_STORY.imageCaption,
    badgeBottom: (row.badge_bottom as string) || INITIAL_STORY.badgeBottom,
    stampTopText: (row.stamp_top_text as string) || INITIAL_STORY.stampTopText,
    stampBottomText: (row.stamp_bottom_text as string) || INITIAL_STORY.stampBottomText,
    chefsPickText: (row.chefs_pick_text as string) || INITIAL_STORY.chefsPickText,
    batchChecklist: Array.isArray(row.batch_checklist)
      ? (row.batch_checklist as string[])
      : INITIAL_STORY.batchChecklist,
    badges: [
      {
        id: "sb-1",
        image: getProductImageUrl((row.badge_1_url as string) || INITIAL_STORY.badges[0].image),
        label: (row.badge_1_label as string) || INITIAL_STORY.badges[0].label,
        alt: INITIAL_STORY.badges[0].alt,
      },
      {
        id: "sb-2",
        image: getProductImageUrl((row.badge_2_url as string) || INITIAL_STORY.badges[1].image),
        label: (row.badge_2_label as string) || INITIAL_STORY.badges[1].label,
        alt: INITIAL_STORY.badges[1].alt,
      },
      {
        id: "sb-3",
        image: getProductImageUrl((row.badge_3_url as string) || INITIAL_STORY.badges[2].image),
        label: (row.badge_3_label as string) || INITIAL_STORY.badges[2].label,
        alt: INITIAL_STORY.badges[2].alt,
      },
    ],
    founderName: INITIAL_STORY.founderName,
    founderRole: INITIAL_STORY.founderRole,
    updatedAt: (row.updated_at as string) || new Date().toISOString(),
  };
}

/**
 * GET /api/story
 * Public storefront endpoint to retrieve verified story content from Supabase.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_story")
      .select("*")
      .eq("id", STORY_SINGLETON_ID)
      .maybeSingle();

    if (error || !data) {
      console.warn("[Story API] Could not load from site_story table, serving initial story:", error?.message);
      return NextResponse.json(INITIAL_STORY, {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      });
    }

    const storyConfig = mapRowToStoryConfig(data);
    return NextResponse.json(storyConfig, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[Story API Error] GET /api/story failed:", err);
    return NextResponse.json(INITIAL_STORY, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }
}
