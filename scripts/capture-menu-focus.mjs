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

async function capture(name, width, height, isMobile = false) {
  let chromeProc;
  try {
    chromeProc = await launchChrome(width, height);
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

    if (isMobile) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: true
      });
    }

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll down to #story first
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('story');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    // Scroll into #menu
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('menu');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    // Get #menu bounding box for clip screenshot
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
    console.log(`${name} clip dimensions:`, clip);

    // Capture clip screenshot
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

    const outputPath = path.join(__dirname, `${name}.png`);
    fs.writeFileSync(outputPath, Buffer.from(screenshotRes.result.data, 'base64'));
    console.log(`Saved ${outputPath}`);

    ws.close();
  } finally {
    if (chromeProc) chromeProc.kill();
  }
}

async function captureElement(name, selector, width, height) {
  let chromeProc;
  try {
    chromeProc = await launchChrome(width, height);
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
    await new Promise(r => setTimeout(r, 2500));

    // Scroll element into view
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const clipRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return JSON.stringify({
          x: Math.max(0, r.x - 20),
          y: Math.max(0, r.y + window.scrollY - 30),
          width: r.width + 40,
          height: r.height + 60,
          scale: 1
        });
      })()`,
      returnByValue: true
    });

    const clip = JSON.parse(clipRes.result.result.value);
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

    const outputPath = path.join(__dirname, `${name}.png`);
    fs.writeFileSync(outputPath, Buffer.from(screenshotRes.result.data, 'base64'));
    console.log(`Saved element ${outputPath}`);
    ws.close();
  } finally {
    if (chromeProc) chromeProc.kill();
  }
}

async function main() {
  const artifactDir = 'C:\\Users\\chara\\.gemini\\antigravity\\brain\\91ee9676-29bf-4295-960a-434fa215f2de';

  console.log('Capturing Desktop V9 (1440x1200)...');
  await capture('menu-v9-desktop', 1440, 1200, false);
  fs.copyFileSync(path.join(__dirname, 'menu-v9-desktop.png'), path.join(artifactDir, 'menu-v9-desktop.png'));
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing Mobile V9 (390x1400)...');
  await capture('menu-v9-mobile', 390, 1400, true);
  fs.copyFileSync(path.join(__dirname, 'menu-v9-mobile.png'), path.join(artifactDir, 'menu-v9-mobile.png'));
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing Tablet V9 (768x2200)...');
  await capture('menu-v9-tablet', 768, 2200, false);
  fs.copyFileSync(path.join(__dirname, 'menu-v9-tablet.png'), path.join(artifactDir, 'menu-v9-tablet.png'));
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing CTA Area V9 (1200x800)...');
  await captureElement('menu-v9-cta-focus', '#menu .max-w-4xl', 1200, 800);
  fs.copyFileSync(path.join(__dirname, 'menu-v9-cta-focus.png'), path.join(artifactDir, 'menu-v9-cta-focus.png'));

  console.log('All V9 screenshots captured and synced to brain artifacts!');
}

main();
