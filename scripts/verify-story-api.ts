import { createSessionToken, ADMIN_COOKIE_NAME } from "../src/lib/auth";
import fs from "fs";
import path from "path";

// Load .env.local if needed
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^['"](.*)['"]$/, "$1");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function run() {
  console.log("=== VERIFYING STORY PERSISTENCE & API CONTRACTS ===");

  const BASE_URL = "http://localhost:3005";

  // 1. Test Public GET /api/story
  console.log("\n[Test 1] Public GET /api/story");
  const getRes = await fetch(`${BASE_URL}/api/story`);
  console.log("Status:", getRes.status);
  const cacheControl = getRes.headers.get("cache-control");
  console.log("Cache-Control:", cacheControl);
  const storyData = await getRes.json();
  console.log("Story Title:", storyData.title);
  console.log("Story Description present?", Boolean(storyData.description));
  if (getRes.status === 200 && storyData.title) {
    console.log("-> PASS: Public GET /api/story returns valid story JSON with cache headers.");
  } else {
    console.error("-> FAIL: Public GET /api/story did not return expected data.");
  }

  // 2. Test Unauthorized POST /api/admin/story
  console.log("\n[Test 2] Unauthorized POST /api/admin/story (No Cookie)");
  const unauthPostRes = await fetch(`${BASE_URL}/api/admin/story`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hacked Title" }),
  });
  console.log("Status:", unauthPostRes.status);
  const unauthData = await unauthPostRes.json();
  console.log("Response:", unauthData);
  if (unauthPostRes.status === 401 && unauthData.error?.includes("Unauthorized")) {
    console.log("-> PASS: Unauthorized POST correctly rejected with HTTP 401.");
  } else {
    console.error("-> FAIL: Expected HTTP 401 for unauthorized POST.");
  }

  // 3. Test Unauthorized POST /api/admin/story with forged cookie
  console.log("\n[Test 3] Tampered Cookie POST /api/admin/story");
  const forgedPostRes = await fetch(`${BASE_URL}/api/admin/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${ADMIN_COOKIE_NAME}=forged.signature.token`,
    },
    body: JSON.stringify({ title: "Hacked Title" }),
  });
  console.log("Status:", forgedPostRes.status);
  if (forgedPostRes.status === 401) {
    console.log("-> PASS: Forged token correctly rejected with HTTP 401.");
  } else {
    console.error("-> FAIL: Forged token was not rejected.");
  }

  // 4. Test Authorized POST /api/admin/story
  console.log("\n[Test 4] Authorized POST /api/admin/story with Valid Session");
  const validToken = await createSessionToken();
  const testUpdatedTitle = `PLOTTWIST24X7 TEST-${Date.now().toString().slice(-4)}`;
  const authPostRes = await fetch(`${BASE_URL}/api/admin/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
    body: JSON.stringify({
      title: testUpdatedTitle,
      description: "Verified persistence across sessions test.",
    }),
  });
  console.log("Status:", authPostRes.status);
  const authData = await authPostRes.json();
  console.log("Response:", authData);
  if (authPostRes.status === 200 && authData.story?.title === testUpdatedTitle) {
    console.log("-> PASS: Authorized POST saved story successfully.");
  } else {
    console.error("-> FAIL: Authorized POST failed.");
  }

  // 5. Verify Persistence via Subsequent Public GET /api/story
  console.log("\n[Test 5] Verify Persistence via Subsequent GET /api/story");
  const verifyGetRes = await fetch(`${BASE_URL}/api/story`);
  const verifyStory = await verifyGetRes.json();
  console.log("Fetched Title:", verifyStory.title);
  if (verifyStory.title === testUpdatedTitle) {
    console.log("-> PASS: Story title successfully persisted and verified via public endpoint!");
  } else {
    console.error("-> FAIL: Story title was not updated on subsequent GET.");
  }

  // Reset back to original title
  await fetch(`${BASE_URL}/api/admin/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
    body: JSON.stringify({
      title: "PLOTTWIST24X7",
      description: "Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.",
    }),
  });
  console.log("\nReset story back to original brand copy.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
