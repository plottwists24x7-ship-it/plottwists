import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRE_DIR = path.join(__dirname, 'baselines-v13');
const POST_DIR = path.join(__dirname, 'post-v13');
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';

const widths = [1920, 1440, 1280, 1024];
const sections = ['faves', 'reviews'];

const report = [];

for (const w of widths) {
  for (const s of sections) {
    const prePath = path.join(PRE_DIR, `pre-${w}-${s}.png`);
    const postPath = path.join(POST_DIR, `post-${w}-${s}.png`);

    if (fs.existsSync(prePath) && fs.existsSync(postPath)) {
      const preStat = fs.statSync(prePath);
      const postStat = fs.statSync(postPath);
      const preBuf = fs.readFileSync(prePath);
      const postBuf = fs.readFileSync(postPath);

      // Byte length comparison and identical byte check
      const byteDiff = Math.abs(preStat.size - postStat.size);
      const percentDiff = ((byteDiff / preStat.size) * 100).toFixed(2);
      const isExactMatch = Buffer.compare(preBuf, postBuf) === 0;

      report.push({
        width: w,
        section: s,
        preSize: preStat.size,
        postSize: postStat.size,
        byteDiff,
        percentDiff: `${percentDiff}%`,
        isExactMatch,
        status: percentDiff < 2 ? 'PASS (Preserved)' : 'INVESTIGATE'
      });
    }
  }
}

console.table(report);
fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop-regression-comparison.json'), JSON.stringify(report, null, 2));
