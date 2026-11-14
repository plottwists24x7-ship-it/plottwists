import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9224;
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\91ee9676-29bf-4295-960a-434fa215f2de';

async function launchChrome(width, height) {
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${width},${height}`,
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));
  return proc;
}

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
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

async function captureDesktopBaseline() {
  console.log('Capturing Desktop Baselines (1440x900)...');
  const proc = await launchChrome(1440, 900);
  try {
    const wsUrl = await getWsUrl();
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
    await new Promise(r => setTimeout(r, 3000));

    // 1. Hero Desktop
    const snapHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'desktop-baseline-hero.png'), Buffer.from(snapHero.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop-baseline-hero.png'), Buffer.from(snapHero.result.data, 'base64'));
    console.log('Saved desktop-baseline-hero.png');

    // 2. Faves Desktop
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    const snapFaves = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'desktop-baseline-faves.png'), Buffer.from(snapFaves.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop-baseline-faves.png'), Buffer.from(snapFaves.result.data, 'base64'));
    console.log('Saved desktop-baseline-faves.png');

    // 3. Menu Desktop
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const snapMenu = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'desktop-baseline-menu.png'), Buffer.from(snapMenu.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop-baseline-menu.png'), Buffer.from(snapMenu.result.data, 'base64'));
    console.log('Saved desktop-baseline-menu.png');

    // 4. Reviews Desktop
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'desktop-baseline-reviews.png'), Buffer.from(snapReviews.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'desktop-baseline-reviews.png'), Buffer.from(snapReviews.result.data, 'base64'));
    console.log('Saved desktop-baseline-reviews.png');

    ws.close();
  } finally {
    proc.kill();
  }
}

captureDesktopBaseline().catch(console.error);
