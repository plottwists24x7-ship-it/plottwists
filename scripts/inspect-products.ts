import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const k = match[1].trim();
      const v = match[2].trim().replace(/^['"](.*)['"]$/, "$1");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

async function run() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
  } else {
    console.log(`Found ${data.length} products:`);
    data.forEach((p, idx) => {
      console.log(`[${idx + 1}] ID: ${p.id} | Name: "${p.name}" | Cat: "${p.category}" | Order: ${p.display_order} | Badge: "${p.badge}" | Popular: ${p.is_popular} | Price: ${p.price} | Image: "${p.image_url.slice(0, 40)}..."`);
    });
  }

  const { data: storageFiles, error: storageError } = await supabase.storage
    .from("products")
    .list("", { limit: 100 });

  if (storageError) {
    console.error("Storage error:", storageError);
  } else {
    console.log(`\nStorage files in 'products' bucket (${storageFiles.length}):`);
    console.log(storageFiles.map((f) => f.name).join(", "));
  }
}

run();
