import fs from "fs";
import path from "path";
import { INITIAL_STORY, StoryConfig } from "./mock-data";

// In-memory cache for fast SSR / RSC responses
let memoryStoryCache: StoryConfig = { ...INITIAL_STORY };
let isInitialized = false;

const DATA_DIR = path.join(process.cwd(), ".data");
const STORY_FILE = path.join(DATA_DIR, "story.json");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignore directory creation errors (e.g. read-only serverless environment)
    }
  }
}

export function getPersistedStory(): StoryConfig {
  if (!isInitialized) {
    try {
      if (fs.existsSync(STORY_FILE)) {
        const raw = fs.readFileSync(STORY_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        memoryStoryCache = { ...INITIAL_STORY, ...parsed };
      }
    } catch (e) {
      console.warn("[Story Store] Failed to read story from disk, using default:", e);
    }
    isInitialized = true;
  }
  return memoryStoryCache;
}

export function savePersistedStory(updates: Partial<StoryConfig>): StoryConfig {
  const current = getPersistedStory();
  const updated: StoryConfig = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  memoryStoryCache = updated;

  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(STORY_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    console.warn("[Story Store] Failed to write story to disk (read-only filesystem):", e);
  }

  return updated;
}

