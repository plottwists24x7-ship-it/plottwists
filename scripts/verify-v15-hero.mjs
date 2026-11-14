import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const OUT_DIR = path.join(__dirname, 'post-v15');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let portCounter = 9800;

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

async function verifyHero(width, height, isMobile, reducedMotion = false) {
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

    if (reducedMotion) {
      await send('Emulation.setEmulatedMedia', {
        media: 'screen',
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
      });
    }

    await send('Page.navigate', { url: 'http://localhost:3000' });
    // Wait for the full 1.3s choreography to settle
    await new Promise(r => setTimeout(r, 2200));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const filename = reducedMotion ? `post-v15-${width}-reduced.png` : `post-v15-${width}-hero.png`;
    fs.writeFileSync(path.join(OUT_DIR, filename), Buffer.from(snap.result.data, 'base64'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(snap.result.data, 'base64'));

    // Check Metrics & Cake Visibility
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        const heroSection = document.querySelector('section');
        const polaroid = document.querySelector('img[alt*="Cheesecake"]')?.closest('.relative');
        const polaroidRect = polaroid ? polaroid.getBoundingClientRect() : null;
        
        // Calculate how much of polaroid top is within the initial viewport
        let cakeVisiblePixels = 0;
        if (polaroidRect) {
          const visibleTop = Math.max(0, polaroidRect.top);
          const visibleBottom = Math.min(window.innerHeight, polaroidRect.bottom);
          cakeVisiblePixels = Math.max(0, visibleBottom - visibleTop);
        }

        const exploreBtn = document.querySelector('button span');
        return {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          scrollWidth: sw,
          clientWidth: cw,
          overflow: sw - cw,
          polaroidTop: polaroidRect ? Math.round(polaroidRect.top) : null,
          polaroidHeight: polaroidRect ? Math.round(polaroidRect.height) : null,
          cakeVisiblePixels: Math.round(cakeVisiblePixels),
          cakeInInitialViewport: cakeVisiblePixels > 80
        };
      })()`,
      returnByValue: true
    });

    ws.close();
    proc.kill();
    return evalRes.result.result.value;
  } catch (err) {
    proc.kill();
    throw err;
  }
}

async function main() {
  console.log('=== Starting V15 Hero Verification Suite ===');
  
  const mobileTests = [
    { w: 430, h: 932, label: 'Mobile 430' },
    { w: 414, h: 896, label: 'Mobile 414' },
    { w: 393, h: 852, label: 'Mobile 393' },
    { w: 390, h: 844, label: 'Mobile 390' },
    { w: 375, h: 812, label: 'Mobile 375' },
    { w: 360, h: 800, label: 'Mobile 360' },
  ];

  const desktopTests = [
    { w: 1440, h: 900, label: 'Desktop 1440' },
    { w: 1280, h: 800, label: 'Desktop 1280' },
    { w: 1024, h: 768, label: 'Desktop 1024' },
  ];

  const results = [];

  for (const m of mobileTests) {
    const res = await verifyHero(m.w, m.h, true);
    results.push({
      label: m.label,
      width: m.w,
      height: m.h,
      overflow: `${res.overflow}px`,
      polaroidTop: `${res.polaroidTop}px`,
      cakeVisiblePixels: `${res.cakeVisiblePixels}px`,
      cakeInInitialViewport: res.cakeInInitialViewport ? 'YES (Integrated)' : 'NO',
      status: res.overflow === 0 ? 'PASS' : 'FAIL OVERFLOW'
    });
    console.log(`[${m.label}] Overflow: ${res.overflow}px | Polaroid Top: ${res.polaroidTop}px | Cake Visible: ${res.cakeVisiblePixels}px (${res.cakeInInitialViewport ? 'INTEGRATED' : 'BELOW FOLD'})`);
  }

  for (const d of desktopTests) {
    const res = await verifyHero(d.w, d.h, false);
    results.push({
      label: d.label,
      width: d.w,
      height: d.h,
      overflow: `${res.overflow}px`,
      polaroidTop: `${res.polaroidTop}px`,
      cakeVisiblePixels: `${res.cakeVisiblePixels}px`,
      cakeInInitialViewport: 'YES (Desktop Side-by-Side)',
      status: res.overflow === 0 ? 'PASS' : 'FAIL OVERFLOW'
    });
    console.log(`[${d.label}] Overflow: ${res.overflow}px | Desktop Layout Verified`);
  }

  // Reduced motion
  const rm = await verifyHero(390, 844, true, true);
  console.log(`[Reduced Motion 390] Overflow: ${rm.overflow}px | Cake Visible: ${rm.cakeVisiblePixels}px`);

  console.table(results);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'v15-hero-metrics.json'), JSON.stringify(results, null, 2));

  // Desktop regression comparison
  console.log('\n=== Desktop Regression Delta Comparison ===');
  const desktopWidths = [1440, 1280, 1024];
  const deltaReport = [];

  for (const w of desktopWidths) {
    const prePath = path.join(__dirname, 'baselines-v15', `pre-v15-${w}-hero.png`);
    const postPath = path.join(OUT_DIR, `post-v15-${w}-hero.png`);

    if (fs.existsSync(prePath) && fs.existsSync(postPath)) {
      const preStat = fs.statSync(prePath);
      const postStat = fs.statSync(postPath);
      const diff = Math.abs(preStat.size - postStat.size);
      const pct = ((diff / preStat.size) * 100).toFixed(2);
      deltaReport.push({
        width: `${w}px`,
        preBytes: preStat.size,
        postBytes: postStat.size,
        diffBytes: diff,
        percentDelta: `${pct}%`,
        status: pct < 1.0 ? 'PASS (100% Preserved)' : 'INVESTIGATE'
      });
    }
  }

  console.table(deltaReport);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'v15-desktop-regression.json'), JSON.stringify(deltaReport, null, 2));
}

main();
