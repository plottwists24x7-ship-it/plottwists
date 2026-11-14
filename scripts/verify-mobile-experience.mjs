import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
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

function saveSnap(filename, base64) {
  const buf = Buffer.from(base64, 'base64');
  fs.writeFileSync(path.join(__dirname, filename), buf);
  fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
  console.log(`Saved ${filename}`);
}

async function runMobileSuite() {
  // =========================================================================
  // 1. MOBILE 390px SUITE (Standard Modern iPhone)
  // =========================================================================
  console.log('Testing Mobile 390x844...');
  let proc = await launchChrome(390, 844);
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

    // Snap 1: Mobile Hero
    const snapHero = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-hero-390.png', snapHero.result.data);

    // Snap 2: Mobile Nav Drawer (Tap Hamburger)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label="Open navigation menu"]');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const snapDrawer = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-nav-drawer-390.png', snapDrawer.result.data);

    // Close Nav Drawer
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label="Close navigation menu"]');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // Snap 3: Mobile Faves Carousel (Card 1 + Card 2 Peek)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const snapFaves1 = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-faves-carousel-390.png', snapFaves1.result.data);

    // Snap 4: Mobile Faves Carousel (Swipe to Card 2 & 3)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const carousel = document.querySelector('.mobile-carousel-container div');
        if (carousel) {
          carousel.scrollBy({ left: 320, behavior: 'instant' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    const snapFaves2 = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-faves-swiped-390.png', snapFaves2.result.data);

    // Snap 5: Mobile Menu with Sticky Category Quick-Navigator
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const snapMenu = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-menu-390.png', snapMenu.result.data);

    // Snap 6: Mobile Reviews Carousel
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-reviews-390.png', snapReviews.result.data);

    // Check for Horizontal Overflow on Mobile 390
    const overflowCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        return { docW, scrollW, bodyW, hasOverflow: scrollW > docW || bodyW > docW };
      })()`,
      returnByValue: true
    });
    console.log('Mobile 390px Overflow Check:', overflowCheck.result.value);

    ws.close();
  } finally {
    proc.kill();
    await new Promise(r => setTimeout(r, 800));
  }

  // =========================================================================
  // 2. MOBILE 360px OVERFLOW & CAROUSEL TEST (Narrow Screen)
  // =========================================================================
  console.log('Testing Mobile 360x740...');
  proc = await launchChrome(360, 740);
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
      width: 360,
      height: 740,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to #faves
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    const snap360 = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-mobile-faves-360.png', snap360.result.data);

    const overflow360 = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          docW: document.documentElement.clientWidth,
          scrollW: document.documentElement.scrollWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile 360px Overflow Check:', overflow360.result.value);

    ws.close();
  } finally {
    proc.kill();
    await new Promise(r => setTimeout(r, 800));
  }

  // =========================================================================
  // 3. DESKTOP 1440px REGRESSION VERIFICATION (Must be 100% Identical)
  // =========================================================================
  console.log('Verifying Desktop 1440px Regression...');
  proc = await launchChrome(1440, 900);
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

    // Scroll to #faves desktop
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const snapDeskFaves = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-desktop-faves-regression.png', snapDeskFaves.result.data);

    // Scroll to #menu desktop
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const snapDeskMenu = await send('Page.captureScreenshot', { format: 'png' });
    saveSnap('v10-desktop-menu-regression.png', snapDeskMenu.result.data);

    ws.close();
  } finally {
    proc.kill();
  }

  console.log('Mobile & Desktop Verification Suite Complete!');
}

runMobileSuite().catch(console.error);
