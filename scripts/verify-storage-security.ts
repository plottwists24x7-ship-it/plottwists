import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { getProductImageUrl } from "../src/lib/supabase/client";

// Auto-load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const k = match[1].trim();
      const v = match[2].trim().replace(/^['"](.*)['"]$/, "$1");
      if (!process.env[k]) {
        process.env[k] = v;
      }
    }
  }
}

async function run() {
  console.log("=== VERIFYING SUPABASE STORAGE SECURITY ===");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient(url, key);

  // 1. Verify Public Image Reads via Storage Public URL
  console.log("\n[Test 1] Public Image Reads");
  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl("sample-test-image.jpg");
  console.log("Sample Public URL:", publicUrlData.publicUrl);
  if (publicUrlData.publicUrl.includes("/storage/v1/object/public/products/")) {
    console.log("-> PASS: Public URL structure matches Supabase public CDN endpoint.");
  }

  // 2. Test Anonymous Upload (Should be DENIED)
  console.log("\n[Test 2] Anonymous Upload Denial");
  const testBuffer = Buffer.from("fake-image-bytes-for-test");
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products")
    .upload("unauthorized-test.jpg", testBuffer, {
      contentType: "image/jpeg",
      upsert: false,
    });
  
  if (uploadError) {
    console.log(`-> PASS: Anonymous upload correctly denied: ${uploadError.message} (${uploadError.name})`);
  } else {
    console.error("-> CRITICAL FAIL: Anonymous upload succeeded! Bucket is insecure:", uploadData);
  }

  // 3. Test Anonymous Image Replacement / Upsert (Should be DENIED)
  console.log("\n[Test 3] Anonymous Image Replacement / Upsert Denial");
  const { data: updateData, error: updateError } = await supabase.storage
    .from("products")
    .upload("unauthorized-test.jpg", testBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
  
  if (updateError) {
    console.log(`-> PASS: Anonymous upsert/replacement correctly denied: ${updateError.message}`);
  } else {
    console.error("-> CRITICAL FAIL: Anonymous upsert succeeded!", updateData);
  }

  // 4. Test Anonymous Deletion (Should be DENIED)
  console.log("\n[Test 4] Anonymous Deletion Denial");
  const { data: deleteData, error: deleteError } = await supabase.storage
    .from("products")
    .remove(["unauthorized-test.jpg"]);

  if (deleteError || (deleteData && deleteData.length === 0)) {
    console.log(`-> PASS: Anonymous deletion denied or no-op:`, deleteError ? deleteError.message : "0 rows deleted");
  } else {
    console.error("-> CRITICAL FAIL: Anonymous delete succeeded!", deleteData);
  }

  // 5. Test Base64 Image Backward Compatibility Rendering
  console.log("\n[Test 5] Base64 Image Backward Compatibility");
  const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const resolved = getProductImageUrl(dummyBase64);
  if (resolved === dummyBase64) {
    console.log("-> PASS: getProductImageUrl preserves and returns existing Base64 Data URLs without modification.");
  } else {
    console.error("-> FAIL: Base64 URL was mutated:", resolved);
  }

  // 6. Test No Silent Base64 Fallback on New Uploads
  console.log("\n[Test 6] No Silent Base64 Fallback Verification");
  // Inspect src/lib/supabase/client.ts uploadImage source code
  const clientSrc = fs.readFileSync(path.join(process.cwd(), "src/lib/supabase/client.ts"), "utf-8");
  const hasBase64Fallback = clientSrc.includes("reader.readAsDataURL") || clientSrc.includes("FileReader");
  if (!hasBase64Fallback) {
    console.log("-> PASS: src/lib/supabase/client.ts has NO FileReader or readAsDataURL fallback.");
  } else {
    console.error("-> FAIL: src/lib/supabase/client.ts still contains FileReader / readAsDataURL!");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
