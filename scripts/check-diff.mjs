import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prePath = path.join(__dirname, 'baselines-v15', 'pre-v15-1280-hero.png');
const postPath = path.join(__dirname, 'post-v15', 'post-v15-1280-hero.png');

console.log('Pre 1280 exists:', fs.existsSync(prePath), 'Size:', fs.statSync(prePath).size);
console.log('Post 1280 exists:', fs.existsSync(postPath), 'Size:', fs.statSync(postPath).size);
