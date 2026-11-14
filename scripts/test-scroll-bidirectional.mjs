import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

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

async function runScrollTest() {
  console.log('=== RUNNING BIDIRECTIONAL SCROLL QA TEST ===');
  let chromeProc;
  try {
    chromeProc = await launchChrome(1440, 1200);
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
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

    // STEP 1: Scroll down to #story first
    console.log('[Test 1] Scrolling down to #story...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('story');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // STEP 2: Scroll DOWN into #menu
    console.log('[Test 2] Scrolling DOWN into #menu (Triggering Entrance Animation)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    // Check menu element visibility
    const visibleCheck1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const heading = document.querySelector('#menu h2');
        const sheetBoxes = document.getElementById('menu-sheet-boxes');
        const cta = document.querySelector('#menu a[aria-label="Order your treats via WhatsApp"]');
        return {
          headingVisible: heading ? window.getComputedStyle(heading).opacity : null,
          sheetBoxesVisible: sheetBoxes ? window.getComputedStyle(sheetBoxes).opacity : null,
          ctaFound: !!cta
        };
      })()`,
      returnByValue: true
    });
    console.log('[Result 2] Downward Scroll Entrance:', visibleCheck1.result.result.value);

    // STEP 3: Scroll DOWN past #menu into #reviews
    console.log('[Test 3] Scrolling DOWN past #menu to #reviews...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('reviews');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // STEP 4: Scroll UP back into #menu (Testing Upward Scroll Replay)
    console.log('[Test 4] Scrolling UP back into #menu (Testing Bidirectional Scroll Replay)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const visibleCheck2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const heading = document.querySelector('#menu h2');
        const sheetBoxes = document.getElementById('menu-sheet-boxes');
        const sheetJars = document.getElementById('menu-sheet-jars');
        const sheetWaffles = document.getElementById('menu-sheet-waffles');
        return {
          headingOpacity: heading ? window.getComputedStyle(heading).opacity : null,
          sheetBoxesOpacity: sheetBoxes ? window.getComputedStyle(sheetBoxes).opacity : null,
          sheetJarsOpacity: sheetJars ? window.getComputedStyle(sheetJars).opacity : null,
          sheetWafflesOpacity: sheetWaffles ? window.getComputedStyle(sheetWaffles).opacity : null
        };
      })()`,
      returnByValue: true
    });
    console.log('[Result 4] Upward Scroll Replay Visibility:', visibleCheck2.result.result.value);

    // Get section height and clip dimensions
    const clipRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return JSON.stringify({
          x: Math.max(0, r.x),
          y: Math.max(0, r.y + window.scrollY),
          width: r.width,
          height: r.height,
          scale: 1
        });
      })()`,
      returnByValue: true
    });
    const clip = JSON.parse(clipRes.result.result.value);
    console.log('Final Desktop Clip Dimensions:', clip);

    // Capture Desktop V7 Screenshot
    const screenshotRes = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clip ? {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height,
        scale: 1
      } : undefined
    });

    const outputPath = path.join(__dirname, 'menu-v7-desktop.png');
    fs.writeFileSync(outputPath, Buffer.from(screenshotRes.result.data, 'base64'));
    console.log(`Saved ${outputPath}`);

    ws.close();
  } finally {
    if (chromeProc) chromeProc.kill();
  }
}

runScrollTest();
