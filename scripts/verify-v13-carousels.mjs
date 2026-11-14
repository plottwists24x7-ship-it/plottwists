import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const OUT_DIR = path.join(__dirname, 'post-v13');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let portCounter = 9400;

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

async function verifyMobile(width, height) {
  const { proc, port } = await launchChrome(width, height);
  const results = { width, height, overflow: 0, interactions: {} };

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

    // 1. Check Document Horizontal Overflow
    const overflowCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        return { scrollWidth: sw, clientWidth: cw, overflow: sw - cw };
      })()`,
      returnByValue: true
    });
    const ovVal = overflowCheck.result.result.value;
    results.overflow = ovVal.overflow;
    console.log(`[${width}px] Overflow: ${ovVal.overflow}px (scrollWidth: ${ovVal.scrollWidth}, clientWidth: ${ovVal.clientWidth})`);

    // 2. Scroll to Faves and Capture Initial State (Product 1)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const snapFaves1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `mobile-${width}-faves-p1.png`), Buffer.from(snapFaves1.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `mobile-${width}-faves-p1.png`), Buffer.from(snapFaves1.result.data, 'base64'));

    // 3. Test Faves Next Product (Product 2 Active)
    await send('Runtime.evaluate', {
      expression: `(() => {
        // Find next arrow button in faves mobile container
        const faves = document.getElementById('faves');
        if (!faves) return;
        const mobileContainer = faves.querySelector('.block.lg\\\\:hidden');
        if (!mobileContainer) return;
        const buttons = mobileContainer.querySelectorAll('button[aria-label="Next product"]');
        if (buttons.length > 0) buttons[0].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const snapFaves2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `mobile-${width}-faves-p2.png`), Buffer.from(snapFaves2.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `mobile-${width}-faves-p2.png`), Buffer.from(snapFaves2.result.data, 'base64'));
    results.interactions.favesNext = true;

    // 4. Scroll to Reviews and Capture Initial Fan State (Review 1 Active)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const snapRev1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `mobile-${width}-reviews-r1.png`), Buffer.from(snapRev1.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `mobile-${width}-reviews-r1.png`), Buffer.from(snapRev1.result.data, 'base64'));

    // 5. Test Reviews Next Review (Review 2 Active)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const reviews = document.getElementById('reviews');
        if (!reviews) return;
        const mobileContainer = reviews.querySelector('.block.lg\\\\:hidden');
        if (!mobileContainer) return;
        const buttons = mobileContainer.querySelectorAll('button[aria-label="Next review"]');
        if (buttons.length > 0) buttons[0].click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const snapRev2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `mobile-${width}-reviews-r2.png`), Buffer.from(snapRev2.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `mobile-${width}-reviews-r2.png`), Buffer.from(snapRev2.result.data, 'base64'));
    results.interactions.reviewsNext = true;

    ws.close();
  } catch (e) {
    console.error(`Error verifying mobile ${width}:`, e);
  } finally {
    proc.kill();
  }

  return results;
}

async function verifyDesktop(width, height) {
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
    fs.writeFileSync(path.join(OUT_DIR, `post-${width}-faves.png`), Buffer.from(snapFaves.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `post-${width}-faves.png`), Buffer.from(snapFaves.result.data, 'base64'));

    // Scroll to Reviews
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `post-${width}-reviews.png`), Buffer.from(snapReviews.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `post-${width}-reviews.png`), Buffer.from(snapReviews.result.data, 'base64'));

    console.log(`Captured post-desktop for ${width}x${height}`);
    ws.close();
  } catch (e) {
    console.error(`Error verifying desktop ${width}:`, e);
  } finally {
    proc.kill();
  }
}

async function verifyReducedMotion() {
  const { proc, port } = await launchChrome(390, 844);
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
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // Faves reduced motion
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('faves');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const snapFaves = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `reduced-motion-390-faves.png`), Buffer.from(snapFaves.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `reduced-motion-390-faves.png`), Buffer.from(snapFaves.result.data, 'base64'));

    // Reviews reduced motion
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, `reduced-motion-390-reviews.png`), Buffer.from(snapReviews.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, `reduced-motion-390-reviews.png`), Buffer.from(snapReviews.result.data, 'base64'));

    console.log('Captured reduced-motion test for 390px');
    ws.close();
  } catch (e) {
    console.error('Error in reduced motion:', e);
  } finally {
    proc.kill();
  }
}

async function main() {
  console.log('--- Starting V13 Automated Verification ---');
  
  // 1. Mobile matrix
  const mobileWidths = [
    { w: 430, h: 932 },
    { w: 414, h: 896 },
    { w: 393, h: 852 },
    { w: 390, h: 844 },
    { w: 375, h: 812 },
    { w: 360, h: 800 }
  ];

  const results = [];
  for (const m of mobileWidths) {
    const res = await verifyMobile(m.w, m.h);
    results.push(res);
  }

  // 2. Desktop matrix
  const desktopWidths = [
    { w: 1920, h: 1080 },
    { w: 1440, h: 900 },
    { w: 1280, h: 800 },
    { w: 1024, h: 768 }
  ];

  for (const d of desktopWidths) {
    await verifyDesktop(d.w, d.h);
  }

  // 3. Reduced motion
  await verifyReducedMotion();

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'v13-verification-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('--- All verifications completed! ---');
}

main();
