import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const BASELINE_DIR = path.join(__dirname, 'baselines-v11');
const POST_DIR = path.join(__dirname, 'post-v11');

const sections = ['hero', 'faves', 'menu', 'reviews'];

for (const sec of sections) {
  const bPath = path.join(BASELINE_DIR, `baseline-1440-${sec}.png`);
  const pPath = path.join(POST_DIR, `post-1440-${sec}.png`);
  if (fs.existsSync(bPath) && fs.existsSync(pPath)) {
    const bStat = fs.statSync(bPath);
    const pStat = fs.statSync(pPath);
    const ratio = Math.abs(bStat.size - pStat.size) / bStat.size;
    console.log(`Desktop 1440px ${sec}: Baseline size=${bStat.size}, Post size=${pStat.size}, Delta=${(ratio * 100).toFixed(2)}%`);
  }
}
