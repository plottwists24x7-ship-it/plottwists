import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const OUT_DIR = path.join(__dirname, 'baselines-v15');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let portCounter = 9700;

async function launchChrome(width, height) {
  const port = portCounter++;
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${width + 100},${height + 100}`,
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

async function captureHero(width, height, isMobile) {
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
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2200));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `pre-v15-${width}-hero.png`;
    fs.writeFileSync(path.join(OUT_DIR, filename), Buffer.from(snap.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.result.data, 'base64'));
    console.log(`Captured pre-v15 Hero baseline for ${width}x${height}`);

    ws.close();
  } finally {
    proc.kill();
  }
}

async function main() {
  console.log('Capturing Pre-V15 Hero Baselines...');
  // Desktop
  await captureHero(1440, 900, false);
  await captureHero(1280, 800, false);
  await captureHero(1024, 768, false);

  // Mobile
  await captureHero(430, 932, true);
  await captureHero(414, 896, true);
  await captureHero(393, 852, true);
  await captureHero(390, 844, true);
  await captureHero(375, 812, true);
  await captureHero(360, 800, true);

  console.log('Pre-V15 Hero Baselines captured successfully!');
}

main();
