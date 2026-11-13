import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

async function launchChrome() {
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,1080',
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

async function main() {
  let chromeProc;
  try {
    chromeProc = await launchChrome();
    const wsUrl = await getWsUrl();
    console.log('Connected to Chrome DevTools WebSocket:', wsUrl);

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

    console.log('Navigating to http://localhost:3000 ...');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 3500)); // wait for full render & fonts

    // Measure section heights
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const getMetrics = (id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id, height: Math.round(rect.height), top: Math.round(rect.top), width: Math.round(rect.width) };
        };
        return JSON.stringify({
          story: getMetrics('story'),
          bakes: getMetrics('bakes'),
          menu: getMetrics('menu'),
          reviews: getMetrics('reviews'),
          instagramCta: getMetrics('instagram-cta'),
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        });
      })()`,
      returnByValue: true
    });

    const metrics = JSON.parse(evalRes.result.result.value);
    console.log('\n================ SECTION HEIGHT MEASUREMENTS (DESKTOP 1440px) ================');
    console.table(metrics);

    // Capture Desktop Screenshot
    const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('fs');
    fs.writeFileSync('scripts/menu-v1-desktop.png', Buffer.from(screenshotRes.result.data, 'base64'));
    console.log('Saved scripts/menu-v1-desktop.png');

    // Emulate Mobile 390px Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileEvalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const getMetrics = (id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id, height: Math.round(rect.height), top: Math.round(rect.top), width: Math.round(rect.width) };
        };
        return JSON.stringify({
          story: getMetrics('story'),
          bakes: getMetrics('bakes'),
          menu: getMetrics('menu'),
          reviews: getMetrics('reviews'),
          instagramCta: getMetrics('instagram-cta')
        });
      })()`,
      returnByValue: true
    });
    console.log('\n================ SECTION HEIGHT MEASUREMENTS (MOBILE 390px) ================');
    console.table(JSON.parse(mobileEvalRes.result.result.value));

    const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/menu-v1-mobile.png', Buffer.from(mobileScreenshot.result.data, 'base64'));
    console.log('Saved scripts/menu-v1-mobile.png');

    ws.close();
  } catch (e) {
    console.error('Error during measurement:', e);
  } finally {
    if (chromeProc) chromeProc.kill();
  }
}

main();

