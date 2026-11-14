import http from 'http';
import { spawn } from 'child_process';

const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9850',
  '--disable-gpu',
  '--window-size=1380,900',
  'about:blank'
]);

async function main() {
  await new Promise(r => setTimeout(r, 1200));
  const wsUrl = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9850/json', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)[0].webSocketDebuggerUrl));
    });
  });
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(r => {
    const msgId = id++;
    const handler = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        r(msg);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 2200));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      const cake = document.querySelector('img[alt*="Cheesecake"]')?.closest('.relative');
      const btns = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
      const exploreBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('EXPLORE BAKES'));
      const exploreRect = exploreBtn?.getBoundingClientRect();
      const h1Rect = h1?.getBoundingClientRect();
      const cakeRect = cake?.getBoundingClientRect();
      return {
        h1: h1Rect ? { top: h1Rect.top, left: h1Rect.left, width: h1Rect.width, height: h1Rect.height } : null,
        cake: cakeRect ? { top: cakeRect.top, left: cakeRect.left, width: cakeRect.width, height: cakeRect.height } : null,
        explore: exploreRect ? { top: exploreRect.top, left: exploreRect.left, width: exploreRect.width, height: exploreRect.height } : null,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('1280px Measurements:', JSON.stringify(res.result.result.value, null, 2));
  ws.close();
  proc.kill();
}

main();
