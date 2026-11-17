import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env.local");
const content = fs.readFileSync(envPath, "utf-8");
let url = "";
let key = "";

for (const line of content.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
    url = trimmed.split("=")[1].trim();
  } else if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=")) {
    key = trimmed.split("=")[1].trim();
  }
}

async function testStorageRLS() {
  const supabase = createClient(url, key);

  console.log("Testing client-side direct upload to 'products' bucket with publishable key...");
  const dummyBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]); // JPEG header
  const { data, error } = await supabase.storage
    .from("products")
    .upload("products/unauthorized_test.jpg", dummyBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.log("✅ Expected Security Gate Passed: Public write rejected by Storage RLS.");
    console.log(`   Error message: ${error.message}`);
  } else {
    console.log("❌ Unexpected: Direct public upload succeeded:", data);
  }
}

testStorageRLS();
