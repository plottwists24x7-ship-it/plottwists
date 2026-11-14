import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223;
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

async function runCapture() {
  // 1. DESKTOP CAPTURE (1440x900)
  console.log('Capturing Desktop Faves...');
  let proc = await launchChrome(1440, 900);
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

    // Scroll to #faves
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Capture Intro
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const buf1 = Buffer.from(snap1.result.data, 'base64');
    fs.writeFileSync(path.join(__dirname, 'faves-desktop-intro.png'), buf1);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'faves-desktop-intro.png'), buf1);
    console.log('Saved faves-desktop-intro.png');

    // Scroll down into horizontal cards (Card 1: Muffins)
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 2400)`
    });
    await new Promise(r => setTimeout(r, 1200));

    // Capture Card 1 (Muffins)
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const buf2 = Buffer.from(snap2.result.data, 'base64');
    fs.writeFileSync(path.join(__dirname, 'faves-desktop-muffins.png'), buf2);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'faves-desktop-muffins.png'), buf2);
    console.log('Saved faves-desktop-muffins.png');

    // Scroll down another 1800px into Cookies / Mocha Oreo
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 1800)`
    });
    await new Promise(r => setTimeout(r, 1200));

    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    const buf3 = Buffer.from(snap3.result.data, 'base64');
    fs.writeFileSync(path.join(__dirname, 'faves-desktop-cookies.png'), buf3);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'faves-desktop-cookies.png'), buf3);
    console.log('Saved faves-desktop-cookies.png');

    ws.close();
  } finally {
    proc.kill();
    await new Promise(r => setTimeout(r, 1000));
  }

  // 2. MOBILE CAPTURE (390x844)
  console.log('Capturing Mobile Faves...');
  proc = await launchChrome(390, 844);
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll to #faves
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Capture Mobile Cards 1 & 2
    const snapMobile1 = await send('Page.captureScreenshot', { format: 'png' });
    const bufMob1 = Buffer.from(snapMobile1.result.data, 'base64');
    fs.writeFileSync(path.join(__dirname, 'faves-mobile-top.png'), bufMob1);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'faves-mobile-top.png'), bufMob1);
    console.log('Saved faves-mobile-top.png');

    // Scroll down on mobile
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 650)`
    });
    await new Promise(r => setTimeout(r, 1000));

    const snapMobile2 = await send('Page.captureScreenshot', { format: 'png' });
    const bufMob2 = Buffer.from(snapMobile2.result.data, 'base64');
    fs.writeFileSync(path.join(__dirname, 'faves-mobile-bottom.png'), bufMob2);
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'faves-mobile-bottom.png'), bufMob2);
    console.log('Saved faves-mobile-bottom.png');

    ws.close();
  } finally {
    proc.kill();
  }

  console.log('All Faves screenshots captured successfully!');
}

runCapture().catch(console.error);
