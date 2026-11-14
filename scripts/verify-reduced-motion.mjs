import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9236;
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';

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

async function run() {
  console.log('Testing prefers-reduced-motion support...');
  const proc = await launchChrome(390, 844);
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
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    const checkReduced = await send('Runtime.evaluate', {
      expression: `(() => {
        const matches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return {
          prefersReducedMotionActive: matches,
          heroVisible: !!document.querySelector('h1'),
          favesVisible: !!document.getElementById('faves'),
          menuVisible: !!document.getElementById('menu'),
          reviewsVisible: !!document.getElementById('reviews')
        };
      })()`,
      returnByValue: true
    });

    const res = checkReduced.result.result.value;
    console.log('Reduced motion check result:', res);

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'reduced-motion-390.png'), Buffer.from(snap.result.data, 'base64'));
    console.log('Saved reduced-motion-390.png');

    ws.close();
  } finally {
    proc.kill();
  }
}

run().catch(console.error);
