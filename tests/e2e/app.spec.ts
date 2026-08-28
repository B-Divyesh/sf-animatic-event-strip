import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

declare global {
  interface Window { __audioPlayCount: number }
}

function wavFixture(): Buffer {
  const samples = 800;
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(8000, 24);
  buffer.writeUInt32LE(16000, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples * 2, 40);
  for (let index = 0; index < samples; index += 1) buffer.writeInt16LE(Math.round(Math.sin(index / 5) * 12000), 44 + index * 2);
  return buffer;
}

async function addMarker(page: import('@playwright/test').Page, label: string, start = 180): Promise<void> {
  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByText('Marker', { exact: true }).click();
  await page.getByLabel('Label').fill(label);
  await page.getByLabel('Start frame').fill(String(start));
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeHidden();
}

async function downloadFromExport(page: import('@playwright/test').Page, name: RegExp) {
  await page.getByRole('button', { name: 'Export' }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name }).click();
  const download = await pending;
  const path = await download.path();
  expect(path).not.toBeNull();
  return { download, path: path! };
}

test('@claim:editor-workflow creates, edits, persists, and exports a useful strip', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Plan animation events/);
  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByLabel('Label').fill('Gate opens');
  await page.getByLabel('Start frame').fill('150');
  await page.getByLabel('End frame').fill('180');
  await page.locator('#image-file').setInputFiles('public/assets/cutting-room-960.c6872b74.webp');
  await expect(page.locator('#image-picked')).toHaveText('cutting-room-960.c6872b74.webp');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeHidden();
  await expect(page.getByText('3 cards', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByText('Marker', { exact: true }).click();
  await page.getByLabel('Label').fill('Enable jump input');
  await page.getByLabel('Marker kind').selectOption('interaction');
  await page.getByLabel('Start frame').fill('36');
  await page.getByLabel('End frame').fill('55');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeHidden();
  await expect(page.getByText('4 markers', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: /Edit board Gate opens/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Edit Interaction Enable jump input/ })).toBeVisible();

  await page.getByRole('button', { name: 'Export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Adapter JSON/ }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('rain-gate-opening-beat.adapter.json');
  expect(consoleErrors).toEqual([]);
});

test('@claim:fps-options exposes every documented planning rate', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Edit project timing' }).click();
  await expect(page.getByLabel('Frames per second').locator('option')).toHaveText(['12', '15', '24', '25', '30', '60']);
});

test('@claim:audio-preview stores a waveform and starts aligned local playback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__audioPlayCount', { value: 0, writable: true });
    HTMLMediaElement.prototype.play = function () {
      window.__audioPlayCount += 1;
      return Promise.resolve();
    };
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByRole('dialog', { name: 'Add event' }).getByText('Sound', { exact: true }).click();
  await page.getByLabel('Label').fill('Local timing tone');
  await page.getByLabel('Start frame').fill('0');
  await page.getByLabel('End frame').fill('24');
  await page.locator('#audio-file').setInputFiles({ name: 'timing-tone.wav', mimeType: 'audio/wav', buffer: wavFixture() });
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeHidden();
  const clip = page.getByRole('button', { name: /Edit sound Local timing tone, F0–23/ });
  await expect(clip.locator('svg polygon')).toHaveAttribute('points', /,/);
  await page.reload();
  await expect(page.getByRole('button', { name: /Edit sound Local timing tone, F0–23/ })).toBeVisible();
  await page.getByRole('button', { name: 'Play strip preview' }).click();
  await expect.poll(() => page.evaluate(() => window.__audioPlayCount)).toBeGreaterThan(0);
});

test('repairs AES-QA-203 with a plain first read and first action', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Animatic Event Strip — plan animation events');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plan animation events before engine work.');
  await expect(page.getByText(/For solo 2D animators and small game teams/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('Loads a filled 10-second strip. The demo never opens or changes your project.')).toBeVisible();
});

test('@claim:sample-demo opens one-click sample data in an isolated, resettable workspace', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add your first event' }).click();
  await page.getByLabel('Label').fill('Real project only');
  await page.getByLabel('Start frame').fill('0');
  await page.getByLabel('End frame').fill('24');
  await page.getByRole('button', { name: 'Add to strip' }).click();

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle('Demo — Animatic Event Strip');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Rain Gate — opening beat')).toBeVisible();
  await expect(page.getByText('2 cards', { exact: true })).toBeVisible();
  await expect(page.getByText('1 clip', { exact: true })).toBeVisible();
  await expect(page.getByText('3 markers', { exact: true })).toBeVisible();
  await expect(page.getByText('Real project only')).toHaveCount(0);

  await addMarker(page, 'Temporary demo note', 190);
  await expect(page.getByRole('button', { name: /Temporary demo note/ })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('button', { name: /Temporary demo note/ })).toHaveCount(0);

  await addMarker(page, 'Discard on exit', 190);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('button', { name: /Real project only/ })).toBeVisible();
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: /Discard on exit/ })).toHaveCount(0);
});

test('@claim:local-storage-only keeps the complete demo flow same-origin and outside real project storage', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/demo');
  await addMarker(page, 'Check local handoff', 200);
  const { path } = await downloadFromExport(page, /Project JSON/);
  expect(JSON.parse(await readFile(path, 'utf8')).events).toHaveLength(7);
  const storage = await page.evaluate(async () => ({
    databases: (await indexedDB.databases()).map((database) => database.name),
    licenseKeys: Object.keys(localStorage).filter((key) => key.startsWith('sb_license:')),
  }));
  expect(storage.databases).toContain('demo:animatic-event-strip');
  expect(storage.databases).not.toContain('animatic-event-strip');
  expect(storage.licenseKeys).toEqual([]);
  expect([...origins]).toEqual([new URL(page.url()).origin]);
});

test('@claim:runtime-privacy ships without analytics, cookies, remote fonts, or third-party runtime scripts', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/demo');
  await addMarker(page, 'Private runtime check', 200);
  await downloadFromExport(page, /Adapter JSON/);
  const runtime = await page.evaluate(() => ({
    cookies: document.cookie,
    scripts: [...document.scripts].map((script) => script.src).filter(Boolean),
    styles: [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((link) => link.href),
    fonts: performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => /\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(name)),
  }));
  const pageOrigin = new URL(page.url()).origin;
  expect(runtime.cookies).toBe('');
  expect(runtime.fonts).toEqual([]);
  expect([...runtime.scripts, ...runtime.styles].every((url) => new URL(url).origin === pageOrigin)).toBe(true);
  expect([...origins]).toEqual([pageOrigin]);
});

test('@claim:project-json-roundtrip exports a complete backup that reopens', async ({ page }) => {
  await page.goto('/demo');
  await addMarker(page, 'Round-trip proof', 200);
  const { download, path } = await downloadFromExport(page, /Project JSON/);
  expect(download.suggestedFilename()).toBe('rain-gate-opening-beat.aes.json');
  const exported = JSON.parse(await readFile(path, 'utf8')) as { schema: string; events: unknown[] };
  expect(exported.schema).toBe('aes-project-1');
  expect(exported.events).toHaveLength(7);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('button', { name: /Round-trip proof/ })).toHaveCount(0);
  await page.locator('#import-file').setInputFiles(path);
  await page.getByRole('button', { name: 'Replace project' }).click();
  await expect(page.getByRole('button', { name: /Round-trip proof/ })).toBeVisible();
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{"schema":"wrong"}') });
  await expect(page.getByRole('alert')).toContainText(/not an Animatic Event Strip project/i);
  await expect(page.getByRole('button', { name: /Round-trip proof/ })).toBeVisible();
});

test('@claim:adapter-json-v1 exports every sample event with the stable adapter schema', async ({ page }) => {
  await page.goto('/demo');
  const { path } = await downloadFromExport(page, /Adapter JSON/);
  const exported = JSON.parse(await readFile(path, 'utf8')) as { schema: string; adapter_version: number; events: Array<{ end_frame_exclusive: number }> };
  expect(exported.schema).toBe('animatic-event-strip/adapter');
  expect(exported.adapter_version).toBe(1);
  expect(exported.events).toHaveLength(6);
  expect(exported.events.every((event) => Number.isInteger(event.end_frame_exclusive))).toBe(true);
});

test('@claim:csv-export exports one UTF-8 row per sample event', async ({ page }) => {
  await page.goto('/demo');
  const { path } = await downloadFromExport(page, /Marker CSV/);
  const csv = await readFile(path, 'utf8');
  const rows = csv.trim().split(/\r?\n/);
  expect(csv.charCodeAt(0)).toBe(0xfeff);
  expect(rows[0]).toBe('schema,adapter_version,project,event_id,type,kind,name,start_frame,end_frame_exclusive,start_seconds,duration_seconds,notes,media_filename');
  expect(rows).toHaveLength(7);
});

test('@claim:cached-license-offline keeps a cached Studio verdict available offline', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL((url) => url.pathname === '/');
  await expect(page.getByText('Untitled scene')).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem('sb_license:animatic-event-strip', 'sandbox-cached-license');
    localStorage.setItem('sb_license:animatic-event-strip:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Studio Pack unlocked')).toBeVisible();
  await expect(page.getByText('Studio access is cached on this device. License verification will resume online.')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:studio-outputs downloads Godot 4 and Unity 6 source and opens the print handoff', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:animatic-event-strip', 'sandbox-studio-license');
    localStorage.setItem('sb_license:animatic-event-strip:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    window.print = () => document.documentElement.setAttribute('data-print-invoked', 'true');
  });
  await page.goto('/');
  await expect(page.getByText('Studio Pack unlocked')).toBeVisible();
  const godot = await downloadFromExport(page, /Godot 4 adapter source/);
  expect(await readFile(godot.path, 'utf8')).toContain('class_name AnimaticEventStrip');
  const unity = await downloadFromExport(page, /Unity 6 adapter source/);
  expect(await readFile(unity.path, 'utf8')).toContain('using UnityEngine');
  await page.getByRole('button', { name: 'Export' }).click();
  await page.getByRole('button', { name: /Print handoff sheet/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-print-invoked', 'true');
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('repairs AES-QA-304 and AES-QA-305 across legal and missing routes', async ({ page }) => {
  for (const route of ['/privacy/', '/terms/']) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.getByRole('link', { name: 'Skip to privacy policy' }).or(page.getByRole('link', { name: 'Skip to terms' }))).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Animatic Event Strip home' })).toBeVisible();
    await expect(page.getByText(/Built by Param Factory/)).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
  const response = await page.goto('/qa-definitely-missing-repair-3');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Animatic Event Strip');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('That frame is not on this strip.');
  await expect(page.getByRole('link', { name: 'Return to the planner' })).toBeVisible();
});

test('repairs AES-QA-301 by retaining focus through repeated keyboard frame moves', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to event strip' })).toBeFocused();
  const focusStyle = await page.getByRole('link', { name: 'Skip to event strip' }).evaluate((node) => getComputedStyle(node).outline);
  expect(focusStyle).toContain('3px');

  const interaction = page.getByRole('button', { name: /Edit Interaction Enable player input/ });
  await interaction.focus();
  await page.keyboard.press('ArrowRight');
  const movedOnce = page.getByRole('button', { name: /Edit Interaction Enable player input, F109–145/ });
  await expect(movedOnce).toBeFocused();
  await page.keyboard.press('ArrowRight');
  const movedTwice = page.getByRole('button', { name: /Edit Interaction Enable player input, F110–146/ });
  await expect(movedTwice).toBeFocused();
  await page.keyboard.press('Shift+ArrowRight');
  await expect(page.getByRole('button', { name: /Edit Interaction Enable player input, F120–156/ })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('button', { name: /Edit Interaction Enable player input, F120–156/ })).toBeVisible();
});

test('repairs AES-QA-302 by returning dialog focus to the edited event', async ({ page }) => {
  await page.goto('/demo');
  const interaction = page.getByRole('button', { name: /Edit Interaction Enable player input/ });
  await interaction.focus();
  await interaction.press('Enter');
  await expect(page.getByLabel('Label')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Edit event' })).toBeHidden();
  await expect(interaction).toBeFocused();

  await page.getByRole('button', { name: '+ Add event' }).click();
  await expect(page.getByLabel('Label')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeHidden();
  await expect(page.getByRole('button', { name: '+ Add event' })).toBeFocused();
});

test('@claim:offline-reload reloads the installed demo shell and sample data offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'offline install path is covered in the mobile PWA profile');
  await page.goto('/demo');
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) throw new Error('PWA service worker is not active');
    const manifest = await fetch((document.querySelector('link[rel="manifest"]') as HTMLLinkElement).href).then((response) => response.json());
    if (manifest.display !== 'standalone' || !manifest.icons.some((icon: { sizes?: string }) => icon.sizes === '512x512')) throw new Error('Install manifest is incomplete');
  });
  await context.setOffline(true);
  await page.waitForFunction(() => navigator.onLine === false);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Offline', { exact: true })).toBeVisible();
  await expect(page.getByText('Rain Gate — opening beat')).toBeVisible();
  await context.setOffline(false);
});

test('keeps the 390px page viewport free of body overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout assertion');
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
  await page.getByRole('button', { name: '+ Add event' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeVisible();
});

test('keeps every verifier-identified mobile target at least 44 by 44 CSS pixels', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '390px touch geometry is covered in the mobile profile');
  await page.goto('/');
  const targets = [
    page.getByRole('link', { name: 'Animatic Event Strip home' }),
    page.getByRole('button', { name: 'Rename project' }),
    page.getByRole('link', { name: 'Privacy' }),
    page.getByRole('link', { name: 'Terms' }),
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box, `missing target: ${await target.getAttribute('aria-label') ?? await target.textContent()}`).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
