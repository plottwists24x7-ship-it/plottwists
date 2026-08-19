const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/chara/.gemini/antigravity/brain/7609a636-1e0a-4793-862b-9f2d1dfc43e6/.system_generated/logs/transcript_full.jsonl';

async function findCode() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const foundMap = {};

  for await (const line of rl) {
    if (!line.includes('write_to_file')) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'write_to_file' && tc.args && tc.args.TargetFile && tc.args.CodeContent) {
            const tf = tc.args.TargetFile;
            if (tf.includes('Story.tsx') || tf.includes('Gallery.tsx') || tf.includes('Reviews.tsx') || tf.includes('Navbar.tsx') || tf.includes('Products.tsx')) {
              foundMap[tf] = tc.args.CodeContent;
            }
          }
        }
      }
    } catch (e) {}
  }

  for (const [tf, code] of Object.entries(foundMap)) {
    console.log(`Found ${tf} (${code.length} bytes)`);
    // Determine target path
    const filename = tf.split('\\').pop();
    let targetPath = `C:/Users/chara/.gemini/antigravity/scratch/baker-where/src/components/sections/${filename}`;
    if (filename === 'Navbar.tsx') {
      targetPath = `C:/Users/chara/.gemini/antigravity/scratch/baker-where/src/components/Navbar.tsx`;
    }
    fs.writeFileSync(targetPath, code, 'utf8');
    console.log(`Saved to ${targetPath}`);
  }
}

findCode();
