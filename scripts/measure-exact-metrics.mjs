import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9232;
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
  const auditResults = [];

  for (const vp of VIEWPORTS) {
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
      await new Promise(r => setTimeout(r, 2200));

      const evalRes = await send('Runtime.evaluate', {
        expression: `JSON.stringify({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth || document.body.scrollWidth > document.documentElement.clientWidth,
          domNodes: document.querySelectorAll('*').length,
          fcpMs: Math.round(performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0)
        })`,
        returnByValue: true
      });

      const parsed = JSON.parse(evalRes.result.result.value);
      auditResults.push({
        viewport: `${vp.name}px`,
        ...parsed
      });

      ws.close();
    } finally {
      proc.kill();
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.table(auditResults);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'exact-metrics.json'), JSON.stringify(auditResults, null, 2));
}

run().catch(console.error);
