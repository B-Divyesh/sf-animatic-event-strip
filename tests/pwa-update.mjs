import assert from 'node:assert/strict';
import { copyFile, cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';

const source = new URL('../dist/', import.meta.url);
const temporary = await mkdtemp(join(tmpdir(), 'aes-pwa-update-'));
const served = join(temporary, 'dist');
await cp(source, served, { recursive: true });
const workerPath = join(served, 'sw.js');
const currentWorker = await readFile(workerPath, 'utf8');
assert.match(currentWorker, /aes-shell-v8/, 'production worker version is not v8');
await writeFile(workerPath, currentWorker.replaceAll('aes-shell-v8', 'aes-shell-update-old'));

const server = spawn(process.execPath, [join(process.cwd(), 'node_modules/vite/bin/vite.js'), 'preview', '--outDir', served, '--host', '127.0.0.1', '--port', '4199'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('update test server did not start')), 10_000);
    server.stdout.on('data', (chunk) => {
      if (!String(chunk).includes('Local:')) return;
      clearTimeout(timeout);
      resolve();
    });
    server.once('exit', (code) => reject(new Error(`update test server exited ${code}`)));
  });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4199/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) await page.reload();
  await copyFile(new URL('../dist/sw.js', import.meta.url), workerPath);
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
  await page.getByText('A fresh version is ready.').waitFor();
  await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Update app' }).click()]);
  await page.getByRole('heading', { level: 1 }).waitFor();
  const caches = await page.evaluate(() => window.caches.keys());
  assert.deepEqual(caches.filter((name) => name.startsWith('aes-shell-')), ['aes-shell-v8']);
  await browser.close();
  console.log('PASS update toast shown; v8 activated; old cache removed');
} finally {
  server.kill('SIGTERM');
  await rm(temporary, { recursive: true, force: true });
}
