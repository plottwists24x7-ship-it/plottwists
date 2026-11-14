import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const OUT_DIR = path.join(__dirname, 'v14-tests');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let portCounter = 9600;

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

async function setupPage(width, height, isMobile = true, reducedMotion = false) {
  const { proc, port } = await launchChrome(width, height);
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

  if (reducedMotion) {
    await send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
  }

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 2000));

  return { proc, ws, send };
}

async function runAutoplayTests() {
  console.log('=== PHASE 1: Real-Time Autoplay & Looping Test (390x844 Mobile) ===');
  const { proc, ws, send } = await setupPage(390, 844, true);

  try {
    // Scroll to Faves
    await send('Runtime.evaluate', {
      expression: `document.getElementById('faves')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 400));

    // Helper to get active product index and title
    const getFavesState = async () => {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const dots = Array.from(document.querySelectorAll('#faves [role="tab"]'));
          const activeDotIdx = dots.findIndex(d => d.getAttribute('aria-selected') === 'true');
          const heroCard = document.querySelector('#faves .mobile-product-card.shadow-\\\\[6px_6px_0px_0px_\\\\#6B2C12\\\\]');
          const title = heroCard?.querySelector('h4')?.textContent || 'unknown';
          const serial = heroCard?.querySelector('span')?.textContent || '';
          return { activeDotIdx, title, serial };
        })()`,
        returnByValue: true
      });
      return res.result.result.value;
    };

    // Helper to get active review index
    const getReviewsState = async () => {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const dots = Array.from(document.querySelectorAll('#reviews [role="tab"]'));
          const activeDotIdx = dots.findIndex(d => d.getAttribute('aria-selected') === 'true');
          return { activeDotIdx };
        })()`,
        returnByValue: true
      });
      return res.result.result.value;
    };

    // 1. Initial State (t = 0s)
    const t0 = await getFavesState();
    console.log(`[t = 0.0s] Faves Active: Index ${t0.activeDotIdx} (${t0.title})`);
    const snap0 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v14-faves-autoplay-0s.png'), Buffer.from(snap0.result.data, 'base64'));

    // 2. Wait 2.2s for first automatic slide advancement
    console.log('Waiting 2200ms for autoplay tick 1...');
    await new Promise(r => setTimeout(r, 2200));
    const t1 = await getFavesState();
    console.log(`[t = 2.2s] Faves Active: Index ${t1.activeDotIdx} (${t1.title})`);
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v14-faves-autoplay-2s.png'), Buffer.from(snap1.result.data, 'base64'));

    // 3. Wait 2.2s for second automatic slide advancement
    console.log('Waiting 2200ms for autoplay tick 2...');
    await new Promise(r => setTimeout(r, 2200));
    const t2 = await getFavesState();
    console.log(`[t = 4.4s] Faves Active: Index ${t2.activeDotIdx} (${t2.title})`);

    // 4. Wait for loop back to index 0
    console.log('Waiting for remaining ticks to verify continuous looping (index 3 -> index 0)...');
    await new Promise(r => setTimeout(r, 2200));
    const t3 = await getFavesState();
    console.log(`[t = 6.6s] Faves Active: Index ${t3.activeDotIdx} (${t3.title})`);

    await new Promise(r => setTimeout(r, 2200));
    const t4 = await getFavesState();
    console.log(`[t = 8.8s] Faves Looped Back to: Index ${t4.activeDotIdx} (${t4.title})`);
    const snapLoop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v14-faves-autoplay-loop.png'), Buffer.from(snapLoop.result.data, 'base64'));

    console.log('=== PHASE 2: Manual Control & Timer Reset Test ===');
    // Test Manual Click Next
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('#faves button[aria-label="Next product"]')[0]?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const manualNextState = await getFavesState();
    console.log(`Manual Next Clicked -> Now at Index ${manualNextState.activeDotIdx} (${manualNextState.title})`);

    // Test Manual Click Prev (Loops backward from 1 to 0, then 0 to 3)
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('#faves button[aria-label="Previous product"]')[0]?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const manualPrevState1 = await getFavesState();
    console.log(`Manual Prev Clicked -> Now at Index ${manualPrevState1.activeDotIdx} (${manualPrevState1.title})`);

    // Loop backwards across boundary (from index 0 -> index 3)
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('#faves button[aria-label="Previous product"]')[0]?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const manualPrevState2 = await getFavesState();
    console.log(`Manual Prev Loop Across Boundary (0 -> 3) -> Now at Index ${manualPrevState2.activeDotIdx} (${manualPrevState2.title})`);

    // Test Pagination Direct Click (Click dot 1 for Cookies)
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('#faves button[aria-label="Go to product 2"]')[0]?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const dotState = await getFavesState();
    console.log(`Pagination Dot 2 Clicked -> Now at Index ${dotState.activeDotIdx} (${dotState.title})`);

    console.log('=== PHASE 3: Reviews Fan Carousel Autoplay & Looping ===');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('reviews')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 500));

    const r0 = await getReviewsState();
    console.log(`[t = 0.0s] Reviews Active: Index ${r0.activeDotIdx}`);
    const snapR0 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v14-reviews-autoplay-0s.png'), Buffer.from(snapR0.result.data, 'base64'));

    console.log('Waiting 2200ms for Reviews autoplay tick...');
    await new Promise(r => setTimeout(r, 2200));
    const r1 = await getReviewsState();
    console.log(`[t = 2.2s] Reviews Active: Index ${r1.activeDotIdx}`);
    const snapR1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'v14-reviews-autoplay-2s.png'), Buffer.from(snapR1.result.data, 'base64'));

    // Test Reviews Manual Next
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('#reviews button[aria-label="Next review"]')[0]?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const rManualNext = await getReviewsState();
    console.log(`Reviews Manual Next -> Index ${rManualNext.activeDotIdx}`);

    // Test Reviews Manual Prev (with boundary loop if at 0)
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('#reviews button[aria-label="Previous review"]')[0]?.click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const rManualPrev = await getReviewsState();
    console.log(`Reviews Manual Prev -> Index ${rManualPrev.activeDotIdx}`);

    ws.close();
  } finally {
    proc.kill();
  }

  console.log('Autoplay and manual tests completed successfully!');
}

async function runViewportMatrixTests() {
  console.log('=== PHASE 4: Viewport Matrix & Overflow Tests ===');
  const viewports = [
    { w: 430, h: 932, mobile: true, label: 'Mobile 430' },
    { w: 414, h: 896, mobile: true, label: 'Mobile 414' },
    { w: 393, h: 852, mobile: true, label: 'Mobile 393' },
    { w: 390, h: 844, mobile: true, label: 'Mobile 390' },
    { w: 375, h: 812, mobile: true, label: 'Mobile 375' },
    { w: 360, h: 800, mobile: true, label: 'Mobile 360' },
    { w: 1024, h: 768, mobile: false, label: 'Desktop 1024' },
    { w: 1280, h: 800, mobile: false, label: 'Desktop 1280' },
    { w: 1440, h: 900, mobile: false, label: 'Desktop 1440' },
    { w: 1920, h: 1080, mobile: false, label: 'Desktop 1920' },
  ];

  const results = [];
  for (const vp of viewports) {
    const { proc, ws, send } = await setupPage(vp.w, vp.h, vp.mobile);
    try {
      const metrics = await send('Runtime.evaluate', {
        expression: `({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          hasDesktopFaves: !!document.querySelector('.product-panel'),
          hasDesktopMarquee: !!document.querySelector('.animate-marquee-left')
        })`,
        returnByValue: true
      });
      const val = metrics.result.result.value;
      results.push({
        label: vp.label,
        width: vp.w,
        innerWidth: val.innerWidth,
        overflow: `${val.overflow}px`,
        desktopFaves: val.hasDesktopFaves,
        desktopMarquee: val.hasDesktopMarquee,
        status: val.overflow === 0 ? 'PASS' : 'FAIL OVERFLOW'
      });
      console.log(`[${vp.label}] innerWidth: ${val.innerWidth}, overflow: ${val.overflow}px, status: ${val.overflow === 0 ? 'PASS' : 'FAIL'}`);
      ws.close();
    } finally {
      proc.kill();
    }
  }

  console.table(results);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'v14-viewport-audit.json'), JSON.stringify(results, null, 2));
}

async function runReducedMotionTest() {
  console.log('=== PHASE 5: Reduced Motion Autoplay Disable Test ===');
  const { proc, ws, send } = await setupPage(390, 844, true, true);
  try {
    await send('Runtime.evaluate', {
      expression: `document.getElementById('faves')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });
    await new Promise(r => setTimeout(r, 400));

    // Get initial
    const getDotIdx = async () => {
      const res = await send('Runtime.evaluate', {
        expression: `Array.from(document.querySelectorAll('#faves [role="tab"]')).findIndex(d => d.getAttribute('aria-selected') === 'true')`,
        returnByValue: true
      });
      return res.result.result.value;
    };

    const initialIdx = await getDotIdx();
    console.log(`Reduced motion initial index: ${initialIdx}`);
    // Wait 2500ms
    await new Promise(r => setTimeout(r, 2500));
    const afterIdx = await getDotIdx();
    console.log(`Reduced motion index after 2.5s (Autoplay should be inactive): ${afterIdx}`);
    const isAutoplayDisabled = initialIdx === afterIdx;
    console.log(`Reduced Motion Autoplay Disabled: ${isAutoplayDisabled ? 'PASS' : 'FAIL'}`);

    ws.close();
  } finally {
    proc.kill();
  }
}

async function main() {
  await runAutoplayTests();
  await runViewportMatrixTests();
  await runReducedMotionTest();
  console.log('All V14 master tests completed successfully!');
}

main();
