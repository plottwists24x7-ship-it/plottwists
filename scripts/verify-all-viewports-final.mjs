import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9230;
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';
const OUTPUT_DIR = path.join(__dirname, 'post-v11');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

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
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buf);
  fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
  console.log(`Saved ${filename}`);
}

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: '1024', width: 1024, height: 768, mobile: false },
  { name: '768', width: 768, height: 1024, mobile: false },
  { name: '430', width: 430, height: 932, mobile: true },
  { name: '414', width: 414, height: 896, mobile: true },
  { name: '393', width: 393, height: 852, mobile: true },
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '375', width: 375, height: 667, mobile: true },
  { name: '360', width: 360, height: 740, mobile: true }
];

async function run() {
  console.log('Starting Comprehensive Verification & Post-Implementation Screenshot Capture...');
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const proc = await launchChrome(vp.width, vp.height);
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
      if (vp.mobile) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 2,
          mobile: true
        });
      }
      await send('Page.navigate', { url: 'http://localhost:3000' });
      await new Promise(r => setTimeout(r, 2500));

      // 1. Horizontal Overflow Audit
      const overflow = await send('Runtime.evaluate', {
        expression: `(() => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const bodyW = document.body.scrollWidth;
          return {
            clientWidth: docW,
            scrollWidth: scrollW,
            bodyWidth: bodyW,
            hasHorizontalOverflow: scrollW > docW || bodyW > docW
          };
        })()`,
        returnByValue: true
      });

      // 2. Measure Performance / LCP / DOM Metrics
      const perf = await send('Runtime.evaluate', {
        expression: `(() => {
          const entries = performance.getEntriesByType('navigation')[0] || {};
          const domNodes = document.querySelectorAll('*').length;
          return {
            domInteractive: Math.round(entries.domInteractive || 0),
            domComplete: Math.round(entries.domComplete || 0),
            loadEventEnd: Math.round(entries.loadEventEnd || 0),
            domNodeCount: domNodes
          };
        })()`,
        returnByValue: true
      });

      results.push({
        viewport: vp.name,
        ...overflow.result.value,
        ...perf.result.value
      });

      // 3. Hero Screenshot
      const snapHero = await send('Page.captureScreenshot', { format: 'png' });
      saveSnap(`post-${vp.name}-hero.png`, snapHero.result.data);

      // 4. Faves Screenshot
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('faves');
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - (window.innerWidth < 1024 ? 70 : 0);
            window.scrollTo({ top: y, behavior: 'instant' });
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 800));
      const snapFaves = await send('Page.captureScreenshot', { format: 'png' });
      saveSnap(`post-${vp.name}-faves.png`, snapFaves.result.data);

      // 5. Menu Screenshot
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('menu');
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - (window.innerWidth < 1024 ? 70 : 80);
            window.scrollTo({ top: y, behavior: 'instant' });
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 800));
      const snapMenu = await send('Page.captureScreenshot', { format: 'png' });
      saveSnap(`post-${vp.name}-menu.png`, snapMenu.result.data);

      // 6. Reviews Screenshot
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('reviews');
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'instant' });
          }
        })()`
      });
      await new Promise(r => setTimeout(r, 800));
      const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
      saveSnap(`post-${vp.name}-reviews.png`, snapReviews.result.data);

      // 7. Test scroll replay on mobile viewports (Scroll away and back)
      if (vp.mobile) {
        await send('Runtime.evaluate', {
          expression: `(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          })()`
        });
        await new Promise(r => setTimeout(r, 400));
        await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.getElementById('faves');
            if (el) {
              const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
              window.scrollTo({ top: y, behavior: 'instant' });
            }
          })()`
        });
        await new Promise(r => setTimeout(r, 600));
      }

      ws.close();
    } finally {
      proc.kill();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\n========================================');
  console.log('MULTI-VIEWPORT VERIFICATION RESULTS:');
  console.log('========================================');
  console.table(results);

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'final-verification-results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('Saved final-verification-results.json to artifact dir');
}

run().catch(console.error);
