import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImgPath = `C:/Users/chara/.gemini/antigravity/brain/7609a636-1e0a-4793-862b-9f2d1dfc43e6/.user_uploaded/media__1784778408918.jpg`;
const outputDir = `C:/Users/chara/.gemini/antigravity/scratch/baker-where/public/assets/paper`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processImage() {
  const metadata = await sharp(sourceImgPath).metadata();
  console.log(`Image dimensions: ${metadata.width}x${metadata.height}`);

  const { width, height } = metadata;

  // Define relative crop bounding boxes for the 8 categories in the sprite sheet
  const categories = [
    // Top Row
    { name: 'offwhite', rect: { left: Math.floor(width * 0.01), top: Math.floor(height * 0.12), width: Math.floor(width * 0.20), height: Math.floor(height * 0.38) } },
    { name: 'notebook', rect: { left: Math.floor(width * 0.22), top: Math.floor(height * 0.12), width: Math.floor(width * 0.19), height: Math.floor(height * 0.38) } },
    { name: 'graph', rect: { left: Math.floor(width * 0.41), top: Math.floor(height * 0.12), width: Math.floor(width * 0.19), height: Math.floor(height * 0.38) } },
    { name: 'kraft', rect: { left: Math.floor(width * 0.60), top: Math.floor(height * 0.12), width: Math.floor(width * 0.19), height: Math.floor(height * 0.38) } },
    { name: 'torn', rect: { left: Math.floor(width * 0.79), top: Math.floor(height * 0.12), width: Math.floor(width * 0.20), height: Math.floor(height * 0.38) } },
    
    // Bottom Row
    { name: 'folded', rect: { left: Math.floor(width * 0.01), top: Math.floor(height * 0.54), width: Math.floor(width * 0.22), height: Math.floor(height * 0.44) } },
    { name: 'receipt', rect: { left: Math.floor(width * 0.23), top: Math.floor(height * 0.54), width: Math.floor(width * 0.20), height: Math.floor(height * 0.44) } },
    { name: 'parchment', rect: { left: Math.floor(width * 0.44), top: Math.floor(height * 0.54), width: Math.floor(width * 0.26), height: Math.floor(height * 0.44) } }
  ];

  // Load raw image buffer
  const image = sharp(sourceImgPath);

  for (const cat of categories) {
    console.log(`Processing ${cat.name}...`);
    const croppedBuffer = await image
      .clone()
      .extract(cat.rect)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = croppedBuffer;
    
    // Convert background pixels (beige #FAF6F0 / #F5F0E8) to transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect background canvas color (light warm cream/beige)
      if (r >= 238 && g >= 232 && b >= 222) {
        data[i + 3] = 0; // Alpha = 0 (Transparent)
      }
    }

    // Save master cropped category image
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(path.join(outputDir, `${cat.name}_master.png`));

    // Also slice sub-items (3 variations per category)
    const subW = Math.floor(info.width * 0.9);
    const subH = Math.floor(info.height * 0.9);
    
    for (let j = 1; j <= 3; j++) {
      const offsetX = Math.floor((j - 1) * 5);
      const offsetY = Math.floor((j - 1) * 5);
      
      const fileName = `${cat.name}_0${j}.png`;
      await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .png()
        .toFile(path.join(outputDir, fileName));
    }
  }

  console.log('All paper assets successfully sliced into public/assets/paper!');
}

processImage().catch(console.error);
