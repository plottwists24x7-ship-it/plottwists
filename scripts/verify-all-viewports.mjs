import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;
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

const VIEWPORTS = [
  { name: '360x740', width: 360, height: 740, mobile: true },
  { name: '375x667', width: 375, height: 667, mobile: true },
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '393x852', width: 393, height: 852, mobile: true },
  { name: '414x896', width: 414, height: 896, mobile: true },
  { name: '430x932', width: 430, height: 932, mobile: true },
  { name: '768x1024', width: 768, height: 1024, mobile: false },
  { name: '1024x768', width: 1024, height: 768, mobile: false }
];

async function run() {
  console.log('Starting Multi-Viewport Audit...');
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport ${vp.name}...`);
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
      await new Promise(r => setTimeout(r, 2000));

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

      results.push({
        viewport: vp.name,
        ...overflow.result.value
      });

      // Capture screenshot at #faves
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
      const snap = await send('Page.captureScreenshot', { format: 'png' });
      saveSnap(`v10-audit-${vp.name}-faves.png`, snap.result.data);

      ws.close();
    } finally {
      proc.kill();
      await new Promise(r => setTimeout(r, 600));
    }
  }

  console.log('\n--- MULTI-VIEWPORT AUDIT RESULTS ---');
  console.table(results);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'viewport-audit-results.json'), JSON.stringify(results, null, 2));
}

run().catch(console.error);
