import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from '@playwright/test';

const root = new URL('../../../dist/', import.meta.url).pathname;
let swVersion = 'aes-shell-qa-update-1';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'text/xml', '.txt': 'text/plain' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    let path = url.pathname === '/' || url.pathname === '/demo' || url.pathname === '/index.html' ? 'index.html'
      : url.pathname === '/privacy/' ? 'privacy/index.html'
      : url.pathname === '/terms/' ? 'terms/index.html'
      : url.pathname.replace(/^\//, '');
    let body = await readFile(join(root, path));
    if (path === 'sw.js') body = Buffer.from(body.toString().replaceAll('aes-shell-v5', swVersion));
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': path === 'sw.js' ? 'no-cache' : 'public, max-age=0', 'Service-Worker-Allowed': '/' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(`${base}/demo`);
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload({ waitUntil: 'networkidle' });
const initial = await page.evaluate(async () => ({ controller: Boolean(navigator.serviceWorker.controller), caches: await caches.keys() }));
swVersion = 'aes-shell-qa-update-2';
await page.evaluate(async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  await registration.update();
});
await page.getByText('A fresh version is ready.').waitFor({ state: 'visible', timeout: 15000 });
const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Update app' }).click();
await navigation;
await page.waitForFunction(async () => (await caches.keys()).includes('aes-shell-qa-update-2'));
const final = await page.evaluate(async () => ({ controller: Boolean(navigator.serviceWorker.controller), caches: await caches.keys(), title: document.title }));
const passed = initial.controller && initial.caches.includes('aes-shell-qa-update-1') && final.controller && final.caches.includes('aes-shell-qa-update-2') && !final.caches.includes('aes-shell-qa-update-1') && errors.length === 0;
console.log(JSON.stringify({ passed, initial, updateToast: 'A fresh version is ready.', final, errors }, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));
if (!passed) process.exitCode = 1;
