import fs from "fs";
import path from "path";
import sharp from "sharp";

interface ImageInfo {
  filename: string;
  relativePath: string;
  format: string;
  width?: number;
  height?: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  usageLocations: string[];
  isUsed: boolean;
}

function getFiles(dir: string): string[] {
  const subdirs = fs.readdirSync(dir);
  const files: string[] = [];
  for (const subdir of subdirs) {
    const res = path.resolve(dir, subdir);
    if (fs.statSync(res).isDirectory()) {
      files.push(...getFiles(res));
    } else {
      files.push(res);
    }
  }
  return files;
}

function searchUsage(searchDirs: string[], imageName: string): string[] {
  const results: string[] = [];
  const baseName = path.basename(imageName);
  
  function scan(dir: string) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (/\.(tsx|ts|jsx|js|css|json)$/.test(entry)) {
        const content = fs.readFileSync(full, "utf8");
        if (content.includes(baseName) || content.includes(imageName.replace(/\\/g, "/"))) {
          results.push(path.relative(process.cwd(), full));
        }
      }
    }
  }

  for (const d of searchDirs) {
    if (fs.existsSync(d)) scan(d);
  }
  return results;
}

async function run() {
  const publicDir = path.resolve(process.cwd(), "public");
  const allFiles = getFiles(publicDir);
  const imageFiles = allFiles.filter(f => /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(f));

  const inventory: ImageInfo[] = [];

  for (const file of imageFiles) {
    const rel = path.relative(publicDir, file).replace(/\\/g, "/");
    const stats = fs.statSync(file);
    let meta: { format?: string; width?: number; height?: number } = {};
    if (!file.endsWith(".svg")) {
      try {
        meta = await sharp(file).metadata();
      } catch (e) {
        // ignore
      }
    }

    const usages = searchUsage([path.resolve(process.cwd(), "src"), path.resolve(process.cwd(), "app")], rel);

    inventory.push({
      filename: path.basename(file),
      relativePath: rel,
      format: meta.format || path.extname(file).replace(".", "").toLowerCase(),
      width: meta.width,
      height: meta.height,
      fileSizeBytes: stats.size,
      fileSizeFormatted: (stats.size / 1024).toFixed(1) + " KB",
      usageLocations: usages,
      isUsed: usages.length > 0
    });
  }

  console.log("=== PUBLIC IMAGE ASSET INVENTORY ===");
  console.table(inventory.map(i => ({
    File: i.filename,
    Format: i.format,
    Dims: i.width && i.height ? `${i.width}x${i.height}` : "N/A",
    Size: i.fileSizeFormatted,
    Used: i.isUsed ? "YES (" + i.usageLocations.length + " refs)" : "NO"
  })));

  const totalBytes = inventory.reduce((sum, i) => sum + i.fileSizeBytes, 0);
  console.log(`\nTotal Images: ${inventory.length}`);
  console.log(`Total Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  
  const unused = inventory.filter(i => !i.isUsed);
  console.log(`Unused images in public: ${unused.length}`);
  unused.forEach(u => console.log(`  - ${u.relativePath} (${u.fileSizeFormatted})`));
}

run().catch(console.error);

