import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
let supabaseUrl = "";
let pubKey = "";
let serviceRoleKey = "";
let adminPassword = "";

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
    supabaseUrl = trimmed.split("=")[1].trim();
  } else if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=")) {
    pubKey = trimmed.split("=")[1].trim();
  } else if (trimmed.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
    serviceRoleKey = trimmed.split("=")[1].trim();
  } else if (trimmed.startsWith("ADMIN_PASSWORD=")) {
    adminPassword = trimmed.split("=")[1].trim();
  }
}

const BASE_URL = "http://localhost:3000";

// Minimal valid file buffers
const JPEG_HEADER = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
  0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
  0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
  0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
  0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
  0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
  0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
  0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
  0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
  0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
  0x00, 0xbf, 0x00, 0xff, 0xd9
]);

const PNG_HEADER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);

// 1x1 WebP
const WEBP_HEADER = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x1a, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  0x56, 0x50, 0x38, 0x4c, 0x0e, 0x00, 0x00, 0x00, 0x2f, 0x00, 0x00, 0x00,
  0x10, 0x07, 0x10, 0x11, 0x11, 0x88, 0x88, 0xfe, 0x07, 0x00
]);

async function runLiveTests() {
  console.log("==================================================================");
  console.log("   PLOTTWIST: LIVE REMOTE CRUD & STORAGE INTEGRATION TESTS        ");
  console.log("==================================================================\n");

  const remote = createClient(supabaseUrl, serviceRoleKey);

  // 1. Authenticate to obtain real admin_session cookie
  console.log("1. Authenticating to /api/admin/login...");
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPassword }),
  });
  if (!loginRes.ok) {
    throw new Error(`Login failed with HTTP ${loginRes.status}`);
  }
  const setCookieHeaders = (loginRes.headers as any).getSetCookie ? (loginRes.headers as any).getSetCookie() : [loginRes.headers.get("set-cookie")];
  const sessionCookie = setCookieHeaders.find((c: string) => c && c.startsWith("admin_session="));
  if (!sessionCookie) {
    throw new Error("No admin_session cookie received from login API");
  }
  const cookieVal = sessionCookie.split(";")[0];
  console.log("   ✅ Succeeded: Authenticated session established.\n");

  const authHeaders = {
    Cookie: cookieVal,
    Origin: BASE_URL,
    Referer: `${BASE_URL}/admin/dashboard`,
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PRODUCTS CRUD
  // ──────────────────────────────────────────────────────────────────────────
  console.log("2. Testing Products CRUD via protected Next.js API...");

  // 2a. POST /api/admin/products
  const prodPayload = {
    name: "Live QA Broo-kie Test",
    description: "Temporary product created by Phase 4.2 automated suite",
    image: "/cheesecake.png",
    price: "$99.99",
    category: "Brownies",
    badge: "QA Badge ✨",
    isPopular: false,
    isBestseller: false,
    displayOrder: 999,
  };

  const createProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(prodPayload),
  });
  const createProdJson = await createProdRes.json();
  if (!createProdRes.ok || !createProdJson.success) {
    throw new Error(`Create product failed: ${JSON.stringify(createProdJson)}`);
  }
  const createdProdId = createProdJson.data.id;
  console.log(`   ✅ Succeeded: POST /api/admin/products -> created product ID: ${createdProdId}`);

  // Verify in remote Supabase
  const { data: remoteProd1 } = await remote.from("products").select("*").eq("id", createdProdId).single();
  if (!remoteProd1 || remoteProd1.name !== prodPayload.name) {
    throw new Error("Product verification failed in remote Supabase database");
  }
  console.log(`   ✅ Succeeded: Verified product '${remoteProd1.name}' exists in remote Supabase.`);

  // 2b. PATCH /api/admin/products
  const updateProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      id: createdProdId,
      name: "Live QA Broo-kie Test (UPDATED)",
      price: "$105.00",
    }),
  });
  const updateProdJson = await updateProdRes.json();
  if (!updateProdRes.ok || !updateProdJson.success) {
    throw new Error(`Update product failed: ${JSON.stringify(updateProdJson)}`);
  }
  console.log("   ✅ Succeeded: PATCH /api/admin/products updated product.");

  // Verify update in remote Supabase
  const { data: remoteProd2 } = await remote.from("products").select("*").eq("id", createdProdId).single();
  if (!remoteProd2 || remoteProd2.name !== "Live QA Broo-kie Test (UPDATED)" || remoteProd2.price !== "$105.00") {
    throw new Error("Updated product verification failed in remote Supabase database");
  }
  console.log(`   ✅ Succeeded: Verified updated product '${remoteProd2.name}' ($105.00) in remote Supabase.`);

  // 2c. DELETE /api/admin/products
  const deleteProdRes = await fetch(`${BASE_URL}/api/admin/products?id=${createdProdId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteProdJson = await deleteProdRes.json();
  if (!deleteProdRes.ok || !deleteProdJson.success) {
    throw new Error(`Delete product failed: ${JSON.stringify(deleteProdJson)}`);
  }
  console.log("   ✅ Succeeded: DELETE /api/admin/products removed product.");

  // Verify deletion in remote Supabase
  const { data: remoteProd3 } = await remote.from("products").select("*").eq("id", createdProdId).maybeSingle();
  if (remoteProd3) {
    throw new Error("Product still exists in remote Supabase after DELETE");
  }
  console.log("   ✅ Succeeded: Verified product completely removed from remote Supabase.\n");

  // ──────────────────────────────────────────────────────────────────────────
  // 3. REVIEWS CRUD
  // ──────────────────────────────────────────────────────────────────────────
  console.log("3. Testing Reviews CRUD via protected Next.js API...");

  // 3a. POST /api/admin/reviews
  const revPayload = {
    customer_name: "QA Live Reviewer",
    customer_image: "/cheesecake.png",
    review: "This is a temporary live integration review for Phase 4.2 testing.",
    rating: 5,
    verified: false,
  };

  const createRevRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(revPayload),
  });
  const createRevJson = await createRevRes.json();
  if (!createRevRes.ok || !createRevJson.success) {
    throw new Error(`Create review failed: ${JSON.stringify(createRevJson)}`);
  }
  const createdRevId = createRevJson.data.id;
  console.log(`   ✅ Succeeded: POST /api/admin/reviews -> created review ID: ${createdRevId}`);

  // Verify in remote Supabase
  const { data: remoteRev1 } = await remote.from("reviews").select("*").eq("id", createdRevId).single();
  if (!remoteRev1 || remoteRev1.customer_name !== revPayload.customer_name) {
    throw new Error("Review verification failed in remote Supabase database");
  }
  console.log(`   ✅ Succeeded: Verified review '${remoteRev1.customer_name}' exists in remote Supabase.`);

  // 3b. PATCH /api/admin/reviews
  const updateRevRes = await fetch(`${BASE_URL}/api/admin/reviews`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      id: createdRevId,
      review: "Updated review text with 4 star rating.",
      rating: 4,
    }),
  });
  const updateRevJson = await updateRevRes.json();
  if (!updateRevRes.ok || !updateRevJson.success) {
    throw new Error(`Update review failed: ${JSON.stringify(updateRevJson)}`);
  }
  console.log("   ✅ Succeeded: PATCH /api/admin/reviews updated review.");

  // Verify update in remote Supabase
  const { data: remoteRev2 } = await remote.from("reviews").select("*").eq("id", createdRevId).single();
  if (!remoteRev2 || remoteRev2.rating !== 4) {
    throw new Error("Updated review verification failed in remote Supabase database");
  }
  console.log(`   ✅ Succeeded: Verified updated review (Rating: ${remoteRev2.rating}) in remote Supabase.`);

  // 3c. DELETE /api/admin/reviews
  const deleteRevRes = await fetch(`${BASE_URL}/api/admin/reviews?id=${createdRevId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteRevJson = await deleteRevRes.json();
  if (!deleteRevRes.ok || !deleteRevJson.success) {
    throw new Error(`Delete review failed: ${JSON.stringify(deleteRevJson)}`);
  }
  console.log("   ✅ Succeeded: DELETE /api/admin/reviews removed review.");

  // Verify deletion in remote Supabase
  const { data: remoteRev3 } = await remote.from("reviews").select("*").eq("id", createdRevId).maybeSingle();
  if (remoteRev3) {
    throw new Error("Review still exists in remote Supabase after DELETE");
  }
  console.log("   ✅ Succeeded: Verified review completely removed from remote Supabase (Count: 0).\n");

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SINGLETON MUTATIONS & EXACT RESTORATION (HERO, STORY, INSTAGRAM)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("4. Testing Singleton Mutations & Exact Restoration...");

  // 4a. Hero Section
  const { data: origHero } = await remote.from("site_hero").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single();
  console.log(`   Original Hero caption: '${origHero.caption_title}'`);

  const patchHeroRes = await fetch(`${BASE_URL}/api/admin/hero`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ caption_title: "today's batch ♡ (QA Test)" }),
  });
  const patchHeroJson = await patchHeroRes.json();
  if (!patchHeroRes.ok || !patchHeroJson.success) {
    throw new Error(`Patch Hero failed: ${JSON.stringify(patchHeroJson)}`);
  }

  // Verify in remote Supabase
  const { data: modHero } = await remote.from("site_hero").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single();
  if (modHero.caption_title !== "today's batch ♡ (QA Test)") {
    throw new Error("Modified hero caption was not persisted in remote Supabase");
  }
  console.log("   ✅ Succeeded: Hero caption update verified in remote Supabase.");

  // Restore Hero
  await fetch(`${BASE_URL}/api/admin/hero`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ caption_title: origHero.caption_title }),
  });
  const { data: restHero } = await remote.from("site_hero").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single();
  if (restHero.caption_title !== origHero.caption_title) {
    throw new Error("Failed to restore original Hero caption");
  }
  console.log(`   ✅ Succeeded: Hero caption restored exactly to '${restHero.caption_title}'.`);

  // 4b. Story Section
  const { data: origStory } = await remote.from("site_story").select("*").eq("id", "00000000-0000-0000-0000-000000000002").single();
  console.log(`   Original Story stamp_top_text: '${origStory.stamp_top_text}'`);

  const patchStoryRes = await fetch(`${BASE_URL}/api/admin/story`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ stamp_top_text: "HANDMADE QA" }),
  });
  const patchStoryJson = await patchStoryRes.json();
  if (!patchStoryRes.ok || !patchStoryJson.success) {
    throw new Error(`Patch Story failed: ${JSON.stringify(patchStoryJson)}`);
  }

  // Verify in remote Supabase
  const { data: modStory } = await remote.from("site_story").select("*").eq("id", "00000000-0000-0000-0000-000000000002").single();
  if (modStory.stamp_top_text !== "HANDMADE QA") {
    throw new Error("Modified story stamp was not persisted in remote Supabase");
  }
  console.log("   ✅ Succeeded: Story stamp update verified in remote Supabase.");

  // Restore Story
  await fetch(`${BASE_URL}/api/admin/story`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ stamp_top_text: origStory.stamp_top_text }),
  });
  const { data: restStory } = await remote.from("site_story").select("*").eq("id", "00000000-0000-0000-0000-000000000002").single();
  if (restStory.stamp_top_text !== origStory.stamp_top_text) {
    throw new Error("Failed to restore original Story stamp");
  }
  console.log(`   ✅ Succeeded: Story stamp restored exactly to '${restStory.stamp_top_text}'.`);

  // 4c. Instagram Section
  const { data: origIg } = await remote.from("site_instagram").select("*").eq("id", "00000000-0000-0000-0000-000000000003").single();
  console.log(`   Original Instagram eyebrow: '${origIg.eyebrow}'`);

  const patchIgRes = await fetch(`${BASE_URL}/api/admin/instagram`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ eyebrow: "Fresh from our oven (QA Test) →" }),
  });
  const patchIgJson = await patchIgRes.json();
  if (!patchIgRes.ok || !patchIgJson.success) {
    throw new Error(`Patch Instagram failed: ${JSON.stringify(patchIgJson)}`);
  }

  // Verify in remote Supabase
  const { data: modIg } = await remote.from("site_instagram").select("*").eq("id", "00000000-0000-0000-0000-000000000003").single();
  if (modIg.eyebrow !== "Fresh from our oven (QA Test) →") {
    throw new Error("Modified Instagram eyebrow was not persisted in remote Supabase");
  }
  console.log("   ✅ Succeeded: Instagram eyebrow update verified in remote Supabase.");

  // Restore Instagram
  await fetch(`${BASE_URL}/api/admin/instagram`, {
    method: "PATCH",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ eyebrow: origIg.eyebrow }),
  });
  const { data: restIg } = await remote.from("site_instagram").select("*").eq("id", "00000000-0000-0000-0000-000000000003").single();
  if (restIg.eyebrow !== origIg.eyebrow) {
    throw new Error("Failed to restore original Instagram eyebrow");
  }
  console.log(`   ✅ Succeeded: Instagram eyebrow restored exactly to '${restIg.eyebrow}'.\n`);

  // ──────────────────────────────────────────────────────────────────────────
  // 5. STORAGE UPLOADS ACROSS ALLOWED FOLDERS
  // ──────────────────────────────────────────────────────────────────────────
  console.log("5. Testing Real Storage Uploads & Deletions in Supabase 'products' Bucket...");

  const foldersToTest = [
    { folder: "products", buffer: JPEG_HEADER, ext: "jpg", mime: "image/jpeg" },
    { folder: "hero", buffer: PNG_HEADER, ext: "png", mime: "image/png" },
    { folder: "story", buffer: WEBP_HEADER, ext: "webp", mime: "image/webp" },
    { folder: "instagram", buffer: JPEG_HEADER, ext: "jpg", mime: "image/jpeg" },
    { folder: "reviews", buffer: PNG_HEADER, ext: "png", mime: "image/png" },
  ];

  for (const item of foldersToTest) {
    console.log(`   Testing upload to folder '${item.folder}' (${item.mime})...`);
    const formData = new FormData();
    const blob = new Blob([item.buffer], { type: item.mime });
    formData.append("file", blob, `test_file.${item.ext}`);
    formData.append("folder", item.folder);

    const uploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok || !uploadJson.success) {
      throw new Error(`Upload to ${item.folder} failed: ${JSON.stringify(uploadJson)}`);
    }

    const publicUrl = uploadJson.publicUrl;
    const storagePath = uploadJson.path;
    console.log(`   -> Uploaded successfully. Public URL: ${publicUrl}`);

    // Verify image is retrievable over public CDN
    const fetchImgRes = await fetch(publicUrl);
    if (!fetchImgRes.ok) {
      throw new Error(`Failed to fetch uploaded image from public CDN: HTTP ${fetchImgRes.status}`);
    }
    console.log(`   -> Public CDN retrieval HTTP 200 OK (${fetchImgRes.headers.get("content-type")}).`);

    // Delete the temporary object
    const deleteRes = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: "DELETE",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ path: storagePath }),
    });
    const deleteJson = await deleteRes.json();
    if (!deleteRes.ok || !deleteJson.success) {
      throw new Error(`Delete storage object ${storagePath} failed: ${JSON.stringify(deleteJson)}`);
    }
    console.log(`   -> Deleted temporary object '${storagePath}' successfully.`);
  }

  // 5b. Verify invalid SVG upload is rejected
  console.log("\n   Verifying invalid SVG file rejection...");
  const svgFormData = new FormData();
  const svgBlob = new Blob(['<svg xmlns="http://www.w3.org/2000/svg"></svg>'], { type: "image/svg+xml" });
  svgFormData.append("file", svgBlob, "malicious.svg");
  svgFormData.append("folder", "products");

  const svgRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: authHeaders,
    body: svgFormData,
  });
  if (svgRes.status === 400) {
    console.log("   ✅ Succeeded: SVG upload correctly rejected with HTTP 400.");
  } else {
    throw new Error(`Expected HTTP 400 for SVG upload, got ${svgRes.status}`);
  }

  console.log("\n==================================================================");
  console.log("   ALL LIVE DATABASE CRUD & STORAGE TESTS PASSED SUCCESSFULLY!    ");
  console.log("==================================================================");
}

runLiveTests().catch((err) => {
  console.error("\n❌ LIVE TEST SUITE ERROR:", err);
  process.exit(1);
});
