import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log("=== SUPABASE LIVE CONNECTIVITY & POLICY AUDIT ===");

  const tables = [
    "products",
    "gallery_images",
    "reviews",
    "site_hero",
    "site_instagram",
    "story_images",
  ];

  for (const table of tables) {
    console.log(`\nTesting table: ${table}`);
    // 1. SELECT test
    const { data: selectData, error: selectError, count } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .limit(2);

    if (selectError) {
      console.log(`  [SELECT] FAILED: ${selectError.message} (Code: ${selectError.code})`);
    } else {
      console.log(`  [SELECT] SUCCESS: Retrieved ${selectData?.length} rows (Total count: ${count})`);
      if (selectData && selectData.length > 0) {
        console.log(`  [COLUMNS]: ${Object.keys(selectData[0]).join(", ")}`);
      }
    }

    // 2. INSERT test (attempt an insert with a dummy non-destructive identifier that can be rolled back or will fail if RLS prevents it)
    const dummyRecord = {
      id: "00000000-0000-0000-0000-000000000000",
      created_at: new Date().toISOString(),
    };
    
    // We attempt insert to test if RLS allows anon insert:
    const { data: insertData, error: insertError } = await supabase
      .from(table)
      .insert([dummyRecord])
      .select();

    if (insertError) {
      console.log(`  [INSERT Anon] REJECTED / BLOCKED: ${insertError.message} (Code: ${insertError.code})`);
    } else {
      console.log(`  [INSERT Anon] ALLOWED! Anon was able to insert:`, insertData);
      // Clean up the dummy test record immediately!
      await supabase.from(table).delete().eq("id", "00000000-0000-0000-0000-000000000000");
    }
  }

  // Test Storage bucket 'products'
  console.log("\nTesting Storage Bucket: 'products'");
  const { data: bucketData, error: bucketError } = await supabase.storage.from("products").list("", { limit: 5 });
  if (bucketError) {
    console.log(`  [STORAGE] FAILED: ${bucketError.message}`);
  } else {
    console.log(`  [STORAGE] SUCCESS: Retrieved ${bucketData?.length} items from bucket 'products'`);
    bucketData?.forEach((item) => console.log(`    - ${item.name} (${item.metadata?.mimetype || "unknown"})`));
  }
}

main().catch(console.error);

