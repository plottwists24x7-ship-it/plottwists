import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImgPath = `C:/Users/chara/.gemini/antigravity/brain/7609a636-1e0a-4793-862b-9f2d1dfc43e6/.user_uploaded/media__1784778408918.jpg`;
const outputDir = `C:/Users/chara/.gemini/antigravity/scratch/baker-where/public/assets/paper`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function sliceAssets() {
  const image = sharp(sourceImgPath);

  // Defined crop coordinates for individual assets within sprite sheet
  const slices = [
    // Offwhite Cardstock Sheets (hero & medium)
    { name: 'offwhite_01', rect: { left: 20, top: 100, width: 180, height: 230 } },
    { name: 'offwhite_02', rect: { left: 40, top: 110, width: 170, height: 215 } },
    { name: 'offwhite_03', rect: { left: 55, top: 120, width: 155, height: 200 } },
    { name: 'offwhite_04', rect: { left: 30, top: 105, width: 175, height: 220 } },
    { name: 'offwhite_05', rect: { left: 10, top: 95, width: 195, height: 240 } },

    // Notebook Pages
    { name: 'notebook_01', rect: { left: 230, top: 100, width: 170, height: 230 } },
    { name: 'notebook_02', rect: { left: 245, top: 110, width: 160, height: 215 } },
    { name: 'notebook_03', rect: { left: 260, top: 120, width: 150, height: 200 } },
    { name: 'notebook_04', rect: { left: 235, top: 105, width: 165, height: 220 } },

    // Graph Paper Sheets
    { name: 'graph_01', rect: { left: 425, top: 100, width: 170, height: 230 } },
    { name: 'graph_02', rect: { left: 440, top: 110, width: 160, height: 215 } },
    { name: 'graph_03', rect: { left: 455, top: 120, width: 150, height: 200 } },
    { name: 'graph_04', rect: { left: 430, top: 105, width: 165, height: 220 } },

    // Kraft Paper Pieces
    { name: 'kraft_01', rect: { left: 615, top: 100, width: 170, height: 230 } },
    { name: 'kraft_02', rect: { left: 630, top: 110, width: 160, height: 215 } },
    { name: 'kraft_03', rect: { left: 645, top: 120, width: 150, height: 200 } },
    { name: 'kraft_04', rect: { left: 620, top: 105, width: 165, height: 220 } },

    // Torn Paper Corners
    { name: 'torn_01', rect: { left: 805, top: 95, width: 100, height: 80 } },
    { name: 'torn_02', rect: { left: 900, top: 105, width: 95, height: 75 } },
    { name: 'torn_03', rect: { left: 800, top: 170, width: 90, height: 80 } },
    { name: 'torn_04', rect: { left: 880, top: 180, width: 85, height: 70 } },
    { name: 'torn_05', rect: { left: 800, top: 250, width: 105, height: 80 } },
    { name: 'torn_06', rect: { left: 890, top: 245, width: 115, height: 90 } },

    // Folded Paper Corners
    { name: 'folded_01', rect: { left: 25, top: 400, width: 90, height: 80 } },
    { name: 'folded_02', rect: { left: 125, top: 405, width: 90, height: 80 } },
    { name: 'folded_03', rect: { left: 20, top: 490, width: 95, height: 80 } },
    { name: 'folded_04', rect: { left: 120, top: 495, width: 95, height: 80 } },
    { name: 'folded_05', rect: { left: 30, top: 575, width: 85, height: 75 } },
    { name: 'folded_06', rect: { left: 125, top: 570, width: 90, height: 80 } },

    // Receipt Fragments
    { name: 'receipt_01', rect: { left: 235, top: 405, width: 90, height: 130 } },
    { name: 'receipt_02', rect: { left: 320, top: 410, width: 95, height: 125 } },
    { name: 'receipt_03', rect: { left: 230, top: 535, width: 95, height: 130 } },
    { name: 'receipt_04', rect: { left: 325, top: 535, width: 90, height: 125 } },

    // Baking Parchment Pieces
    { name: 'parchment_01', rect: { left: 445, top: 395, width: 115, height: 120 } },
    { name: 'parchment_02', rect: { left: 560, top: 400, width: 120, height: 115 } },
    { name: 'parchment_03', rect: { left: 450, top: 515, width: 120, height: 125 } },
    { name: 'parchment_04', rect: { left: 570, top: 520, width: 115, height: 120 } },
  ];

  for (const s of slices) {
    const croppedBuffer = await image
      .clone()
      .extract(s.rect)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = croppedBuffer;

    // Background color keying: convert canvas background (#FAF6F0 / #F5F0E8 / #F8F3EC) to transparent alpha=0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Canvas background color threshold
      if (r >= 234 && g >= 228 && b >= 216) {
        // Soft feathering at boundary
        const bgDiff = Math.min(r - 234, g - 228, b - 216);
        if (bgDiff > 10) {
          data[i + 3] = 0;
        } else {
          data[i + 3] = Math.max(0, Math.floor(255 * (1 - bgDiff / 10)));
        }
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(path.join(outputDir, `${s.name}.png`));
  }

  console.log(`Successfully sliced ${slices.length} individual asset PNG files into ${outputDir}`);
}

sliceAssets().catch(console.error);
