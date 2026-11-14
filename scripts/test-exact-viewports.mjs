import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\0812795a-9b16-4a15-bfb0-185dc92846b7';

async function testViewport(w, h, isMobile) {
  const port = 9500;
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--window-size=1200,1000',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1200));

  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', async () => {
        try {
          const list = JSON.parse(d);
          const ws = new WebSocket(list[0].webSocketDebuggerUrl);
          let id = 1;
          const callbacks = new Map();
          ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id && callbacks.has(msg.id)) {
              callbacks.get(msg.id)(msg);
              callbacks.delete(msg.id);
            }
          };
          const send = (method, params = {}) => new Promise((resFn) => {
            const msgId = id++;
            callbacks.set(msgId, resFn);
            ws.send(JSON.stringify({ id: msgId, method, params }));
          });

          await new Promise(r => ws.onopen = r);
          await send('Page.enable');
          await send('Runtime.enable');
          await send('Emulation.setDeviceMetricsOverride', {
            width: w,
            height: h,
            deviceScaleFactor: 1,
            mobile: isMobile
          });
          await send('Page.navigate', { url: 'http://localhost:3000' });
          await new Promise(r => setTimeout(r, 2500));

          const res = await send('Runtime.evaluate', {
            expression: `({
              innerWidth: window.innerWidth,
              innerHeight: window.innerHeight,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
              hasDesktopPanels: !!document.querySelector('.product-panel'),
              hasDesktopMarquee: !!document.querySelector('.animate-marquee-left'),
              hasCoverFlow: !!document.querySelector('[key*="coverflow"], .mobile-product-card'),
              hasMobileFan: !!document.querySelector('[aria-label*="fan carousel"]')
            })`,
            returnByValue: true
          });

          const val = res.result.result.value;

          // Scroll to Faves
          await send('Runtime.evaluate', {
            expression: `document.getElementById('faves')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
          });
          await new Promise(r => setTimeout(r, 600));
          const snapFaves = await send('Page.captureScreenshot', { format: 'png' });
          const prefix = isMobile ? 'mobile-exact' : 'desktop-exact';
          fs.writeFileSync(path.join(ARTIFACT_DIR, `${prefix}-${w}-faves.png`), Buffer.from(snapFaves.result.data, 'base64'));

          // Scroll to Reviews
          await send('Runtime.evaluate', {
            expression: `document.getElementById('reviews')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
          });
          await new Promise(r => setTimeout(r, 600));
          const snapReviews = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(ARTIFACT_DIR, `${prefix}-${w}-reviews.png`), Buffer.from(snapReviews.result.data, 'base64'));

          ws.close();
          proc.kill();
          resolve(val);
        } catch (e) {
          proc.kill();
          reject(e);
        }
      });
    }).on('error', (e) => {
      proc.kill();
      reject(e);
    });
  });
}

async function main() {
  console.log('--- Testing Exact Viewports with CDP Device Emulation ---');

  const tests = [
    // Desktop
    { w: 1920, h: 1080, mobile: false, label: 'Desktop 1920' },
    { w: 1440, h: 900,  mobile: false, label: 'Desktop 1440' },
    { w: 1280, h: 800,  mobile: false, label: 'Desktop 1280' },
    { w: 1024, h: 768,  mobile: false, label: 'Desktop 1024' },
    // Mobile
    { w: 430,  h: 932,  mobile: true,  label: 'Mobile 430' },
    { w: 414,  h: 896,  mobile: true,  label: 'Mobile 414' },
    { w: 393,  h: 852,  mobile: true,  label: 'Mobile 393' },
    { w: 390,  h: 844,  mobile: true,  label: 'Mobile 390' },
    { w: 375,  h: 812,  mobile: true,  label: 'Mobile 375' },
    { w: 360,  h: 800,  mobile: true,  label: 'Mobile 360' },
  ];

  const results = [];
  for (const t of tests) {
    const r = await testViewport(t.w, t.h, t.mobile);
    results.push({
      label: t.label,
      width: t.w,
      innerWidth: r.innerWidth,
      overflow: `${r.overflow}px`,
      hasDesktopPanels: r.hasDesktopPanels,
      hasDesktopMarquee: r.hasDesktopMarquee,
      hasCoverFlow: r.hasCoverFlow,
      hasMobileFan: r.hasMobileFan,
      status: r.overflow === 0 ? 'PASS' : 'FAIL OVERFLOW'
    });
    console.log(`[${t.label}] innerWidth: ${r.innerWidth}, overflow: ${r.overflow}px, desktop: ${r.hasDesktopPanels}, fan: ${r.hasMobileFan}`);
  }

  console.table(results);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'exact-viewport-audit.json'), JSON.stringify(results, null, 2));
}

main();
