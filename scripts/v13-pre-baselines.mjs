import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const OUT_DIR = path.join(__dirname, 'baselines-v13');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let portCounter = 9300;

async function launchChrome(width, height) {
  const port = portCounter++;
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${width},${height}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  return { proc, port };
}

async function getWsUrl(port) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          resolve(list[0].webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function captureViewport(width, height, isDesktop = false) {
  const { proc, port } = await launchChrome(width, height);
  try {
    const wsUrl = await getWsUrl(port);
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to Faves
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const snapFaves = await send('Page.captureScreenshot', { format: 'png' });
    const favesFilename = `pre-${width}-faves.png`;
    fs.writeFileSync(path.join(OUT_DIR, favesFilename), Buffer.from(snapFaves.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, favesFilename), Buffer.from(snapFaves.result.data, 'base64'));

    // Scroll to Reviews
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
    const reviewsFilename = `pre-${width}-reviews.png`;
    fs.writeFileSync(path.join(OUT_DIR, reviewsFilename), Buffer.from(snapReviews.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, reviewsFilename), Buffer.from(snapReviews.result.data, 'base64'));

    console.log(`Captured pre-baseline for ${width}x${height} (Faves & Reviews)`);

    ws.close();
  } catch (err) {
    console.error(`Error at ${width}:`, err);
  } finally {
    proc.kill();
  }
}

async function main() {
  console.log('Capturing Pre-Implementation Baselines for V13...');
  // Desktop
  await captureViewport(1920, 1080, true);
  await captureViewport(1440, 900, true);
  await captureViewport(1280, 800, true);
  await captureViewport(1024, 768, true);

  // Mobile
  await captureViewport(430, 932);
  await captureViewport(414, 896);
  await captureViewport(393, 852);
  await captureViewport(390, 844);
  await captureViewport(375, 812);
  await captureViewport(360, 800);

  console.log('All pre-baselines captured successfully!');
}

main();
