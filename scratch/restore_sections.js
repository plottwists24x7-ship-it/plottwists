const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/chara/.gemini/antigravity/brain/7609a636-1e0a-4793-862b-9f2d1dfc43e6/.system_generated/logs/transcript_full.jsonl';

if (!fs.existsSync(logPath)) {
  console.log('Log file not found');
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');

const targets = ['Story.tsx', 'Gallery.tsx', 'Reviews.tsx'];

for (const target of targets) {
  console.log(`=== Searching for ${target} ===`);
  const regex = new RegExp(`TargetFile.*${target}`, 'g');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const idx = match.index;
    const snippet = content.substring(idx, idx + 2000);
    console.log(`Found ${target} at index ${idx}:`);
    console.log(snippet.substring(0, 500));
    console.log('-----------------------------------');
  }
}
