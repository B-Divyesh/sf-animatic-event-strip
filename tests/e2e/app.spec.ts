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
  await page.getByRole('button', { name: 'Choose export' }).click();
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
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Plan animation events/);
  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByLabel('Label').fill('Gate opens');
  await page.getByLabel('Start frame').fill('150');
  await page.getByLabel('End frame').fill('180');
  await page.locator('#image-file').setInputFiles('public/assets/cutting-room-960.c6872b74.webp');
  await expect(page.locator('#image-picked')).toHaveText('cutting-room-960.c6872b74.webp');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeHidden();
  await expect(page.getByText('3 boards', { exact: true })).toBeVisible();

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

  await page.getByRole('button', { name: 'Choose export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /^Export Adapter JSON\b/ }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('rain-gate-opening-beat.adapter.json');
  expect(consoleErrors).toEqual([]);
});

test('@claim:fps-options exposes every documented planning rate', async ({ page }) => {
  await page.goto('/?demo=1');
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
  await page.goto('/?demo=1');
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
  await expect(page.getByText('Loads a filled 10-second strip. Your project is not opened or changed.')).toBeVisible();
  await expect(page.locator('#save-status')).toHaveText('Project unopened');
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).not.toContain('animatic-event-strip');
});

test('repairs F-3-1 and F-1-1 by focusing and announcing app and legal routes, including browser Back', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Planner ready: your project has not been opened.');
  const demoNavigation = page.getByLabel('Primary navigation').getByRole('link', { name: 'Demo' });
  await expect(demoNavigation).toBeVisible();
  await expect(demoNavigation).toHaveCSS('min-height', '44px');
  await demoNavigation.click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Demo loaded: Rain Gate sample strip.');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Planner ready: your project has not been opened.');

  await page.getByLabel('Primary navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Privacy loaded: local data policy.');
  await page.getByLabel('Primary navigation').getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL(/\/terms\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Terms loaded: product and purchase terms.');
  await page.goBack();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Privacy loaded: local data policy.');
});

test('repairs F-2-1 with predictable Demo, Privacy, and Terms links in every footer', async ({ page }) => {
  for (const route of ['/', '/?demo=1', '/privacy/', '/terms/']) {
    await page.goto(route);
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Demo', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms', exact: true })).toBeVisible();
  }
  await page.goto('/privacy/');
  await expect(page.locator('footer a[aria-current="page"]')).toHaveText('Privacy');
  await page.goto('/terms/');
  await expect(page.locator('footer a[aria-current="page"]')).toHaveText('Terms');
});

test('repairs F-2-2 through F-2-4 with specific copy and action names', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Export formats for engine handoff.' })).toBeVisible();
  await expect(page.getByText('Plan scene timing before engine implementation.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open quick guide', includeHidden: true })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Show artwork provenance' })).toBeVisible();
  await expect(page.locator('#save-status')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByText('Adapter JSON and CSV export frame data for Godot, Unity, or your own tools.')).toBeVisible();
  await expect(page.getByText('Both formats have a version number.')).toBeVisible();
});

test('shows the three visible handoff steps on the planner and demo', async ({ page }) => {
  for (const route of ['/', '/?demo=1']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: 'How to build an animation handoff' })).toBeVisible();
    await expect(page.getByText('Add boards', { exact: true })).toBeVisible();
    await expect(page.getByText('Align sound', { exact: true })).toBeVisible();
    await expect(page.getByText('Name engine events', { exact: true })).toBeVisible();
  }
});

test('@claim:sample-demo never opens real storage on the one-click sample path and resets its isolated data', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeOpen = indexedDB.open.bind(indexedDB);
    Object.defineProperty(indexedDB, 'open', {
      configurable: true,
      value(name: string, version?: number) {
        const opens = JSON.parse(sessionStorage.getItem('aes:idb-opens') ?? '[]') as string[];
        opens.push(name);
        sessionStorage.setItem('aes:idb-opens', JSON.stringify(opens));
        return version === undefined ? nativeOpen(name) : nativeOpen(name, version);
      },
    });
  });

  await page.goto('/privacy/');
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('animatic-event-strip', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('projects');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('projects', 'readwrite');
        transaction.objectStore('projects').put({
          schema: 'aes-project-1',
          id: 'sentinel-project',
          name: 'Sentinel real project',
          fps: 24,
          durationFrames: 240,
          events: [],
          createdAt: '2026-08-28T00:00:00.000Z',
          updatedAt: '2026-08-28T00:00:00.000Z',
        }, 'active');
        transaction.oncomplete = () => { db.close(); resolve(); };
        transaction.onerror = () => reject(transaction.error);
      };
    });
    sessionStorage.removeItem('aes:idb-opens');
  });

  await page.goto('/');
  await expect(page.locator('#save-status')).toHaveText('Project unopened');
  await expect(page.getByText('Sentinel real project')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('aes:idb-opens') ?? '[]'))).toEqual([]);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Animatic Event Strip');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('aes:idb-opens') ?? '[]'))).not.toContain('animatic-event-strip');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Rain Gate — opening beat')).toBeVisible();
  const sampleTitle = await page.getByText('Rain Gate — opening beat', { exact: true }).boundingBox();
  expect(sampleTitle?.y ?? Infinity).toBeLessThan(await page.evaluate(() => window.innerHeight));
  await expect(page.getByText('2 boards', { exact: true })).toBeVisible();
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
  await expect(page.getByText('Sentinel real project', { exact: true })).toBeVisible();
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Animatic Event Strip');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://animatic-event-strip.sociobot.in/?demo=1');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://animatic-event-strip.sociobot.in/?demo=1');
  await expect(page.getByRole('button', { name: /Discard on exit/ })).toHaveCount(0);

  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('animatic-event-strip');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Real project database deletion was blocked'));
    });
    sessionStorage.removeItem('aes:idb-opens');
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  const blankState = await page.evaluate(async () => ({
    databases: (await indexedDB.databases()).map((database) => database.name),
    opens: JSON.parse(sessionStorage.getItem('aes:idb-opens') ?? '[]') as string[],
  }));
  expect(blankState.databases).not.toContain('animatic-event-strip');
  expect(blankState.opens).not.toContain('animatic-event-strip');
});

test('@claim:local-storage-only keeps the complete demo flow same-origin and outside real project storage', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/?demo=1');
  await addMarker(page, 'Check local handoff', 200);
  const { path } = await downloadFromExport(page, /^Export Project JSON\b/);
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
  await page.goto('/?demo=1');
  await addMarker(page, 'Private runtime check', 200);
  await downloadFromExport(page, /^Export Adapter JSON\b/);
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

test('@claim:asset-provenance records the generated scene source and serves only bundled artwork', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Show artwork provenance' }).click();
  const dialog = page.getByRole('dialog', { name: 'Artwork provenance' });
  await expect(dialog).toContainText('AI-generated cutting-room scene.');
  await expect(dialog).toContainText('Created for this product on 28 August 2026.');
  const [source, thesis] = await Promise.all([
    readFile(new URL('../../assets/src/cutting-room.png.json', import.meta.url), 'utf8'),
    readFile(new URL('../../.factory/design.md', import.meta.url), 'utf8'),
  ]);
  const metadata = JSON.parse(source) as { deployment?: string; prompt?: string };
  expect(metadata.deployment).toBe('factory-image');
  expect(metadata.prompt).toContain('animation cutting room at blue hour');
  expect(thesis).toContain('Generated with the Param Factory Azure image deployment');
  expect([...origins]).toEqual([new URL(page.url()).origin]);
});

test('@claim:project-json-roundtrip exports a complete backup that reopens', async ({ page }) => {
  await page.goto('/?demo=1');
  await addMarker(page, 'Round-trip proof', 200);
  const { download, path } = await downloadFromExport(page, /^Export Project JSON\b/);
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
  await page.goto('/?demo=1');
  const { path } = await downloadFromExport(page, /^Export Adapter JSON\b/);
  const exported = JSON.parse(await readFile(path, 'utf8')) as { schema: string; adapter_version: number; events: Array<{ end_frame_exclusive: number }> };
  expect(exported.schema).toBe('animatic-event-strip/adapter');
  expect(exported.adapter_version).toBe(1);
  expect(exported.events).toHaveLength(6);
  expect(exported.events.every((event) => Number.isInteger(event.end_frame_exclusive))).toBe(true);
});

test('@claim:csv-export exports one UTF-8 row per sample event', async ({ page }) => {
  await page.goto('/?demo=1');
  const { path } = await downloadFromExport(page, /^Export Marker CSV\b/);
  const csv = await readFile(path, 'utf8');
  const rows = csv.trim().split(/\r?\n/);
  expect(csv.charCodeAt(0)).toBe(0xfeff);
  expect(rows[0]).toBe('schema,adapter_version,project,event_id,type,kind,name,start_frame,end_frame_exclusive,start_seconds,duration_seconds,notes,media_filename');
  expect(rows).toHaveLength(7);
});

test('@claim:cached-license-offline keeps a cached Studio verdict available offline', async ({ page, context }) => {
  await page.goto('/?demo=1');
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

test('@claim:license-lifecycle suppresses same-day checks, restores access, and reconciles inactive licenses from recorded fixtures', async ({ page }) => {
  const fixtures = JSON.parse(await readFile(new URL('../fixtures/license-verdicts.json', import.meta.url), 'utf8')) as Record<string, { valid: boolean; reason: string }>;
  const requests: string[] = [];
  await page.addInitScript(() => {
    if (!localStorage.getItem('sb_license:animatic-event-strip')) {
      localStorage.setItem('sb_license:animatic-event-strip', 'same-day-token');
      localStorage.setItem('sb_license:animatic-event-strip:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    }
  });
  await page.route(/https:\/\/api\.sociobot\.in\/api\/v1\/products\/animatic-event-strip\/verify\?license=.*/, async (route) => {
    const token = new URL(route.request().url()).searchParams.get('license') ?? '';
    requests.push(token);
    const fixture = fixtures[token] ?? { valid: true, reason: 'ok' };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' },
      body: JSON.stringify(fixture),
    });
  });

  await page.goto('/');
  await expect(page.getByText('Studio access was checked within the last day.')).toBeVisible();
  expect(requests).toEqual([]);

  await page.evaluate(() => {
    localStorage.setItem('sb_license:animatic-event-strip', 'stale-token');
    localStorage.setItem('sb_license:animatic-event-strip:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() - 86_400_001 }));
  });
  await page.reload();
  await expect(page.getByText('License verified. Studio downloads are ready.')).toBeVisible();
  expect(requests).toEqual(['stale-token']);

  await page.getByLabel('Have a license?').fill('restored-token');
  await page.getByRole('button', { name: 'Restore Studio license' }).click();
  await expect(page.getByText('License verified. Studio downloads are ready.')).toBeVisible();
  await expect(page.getByText('Studio Pack unlocked')).toBeVisible();
  expect(requests).toEqual(['stale-token', 'restored-token']);

  await page.goto('/?license=return-token');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Studio Pack unlocked')).toBeVisible();
  expect(requests).toEqual(['stale-token', 'restored-token', 'return-token']);

  for (const token of ['refunded-token', 'expired-token', 'revoked-token']) {
    await page.getByLabel('Have a license?').fill(token);
    await page.getByRole('button', { name: 'Restore Studio license' }).click();
    await expect(page.getByText('This license is no longer active.')).toBeVisible();
    await expect(page.getByText('Free planner active')).toBeVisible();
    await expect(page.locator('[data-export="godot"]')).toHaveClass(/locked/);
    await expect(page.locator('[data-export="json"]')).not.toHaveClass(/locked/);
  }
  expect(requests).toEqual(['stale-token', 'restored-token', 'return-token', 'refunded-token', 'expired-token', 'revoked-token']);

  const stored = await page.evaluate(async () => ({
    token: localStorage.getItem('sb_license:animatic-event-strip'),
    verdict: JSON.parse(localStorage.getItem('sb_license:animatic-event-strip:verdict') ?? '{}') as Record<string, unknown>,
    cachedVerification: await caches.match('https://api.sociobot.in/api/v1/products/animatic-event-strip/verify?license=revoked-token'),
  }));
  expect(stored.token).toBe('revoked-token');
  expect(stored.verdict).toMatchObject({ valid: false });
  expect(Object.keys(stored.verdict).sort()).toEqual(['checkedAt', 'valid']);
  expect(typeof stored.verdict.checkedAt).toBe('number');
  expect(stored.cachedVerification).toBeUndefined();
});

test('@claim:studio-outputs downloads Godot 4 and Unity 6 source and opens the print handoff', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:animatic-event-strip', 'sandbox-studio-license');
    localStorage.setItem('sb_license:animatic-event-strip:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    window.print = () => document.documentElement.setAttribute('data-print-invoked', 'true');
  });
  await page.goto('/');
  await expect(page.getByText('Studio Pack unlocked')).toBeVisible();
  const godot = await downloadFromExport(page, /Download Godot 4 adapter/);
  expect(await readFile(godot.path, 'utf8')).toContain('class_name AnimaticEventStrip');
  const unity = await downloadFromExport(page, /Download Unity 6 adapter/);
  expect(await readFile(unity.path, 'utf8')).toContain('using UnityEngine');
  await page.getByRole('button', { name: 'Choose export' }).click();
  await page.getByRole('button', { name: /Open printable handoff/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-print-invoked', 'true');
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/?demo=1');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('repairs AES-QA-304, AES-QA-305, and F-3-3 across every public route', async ({ page }) => {
  for (const route of ['/', '/?demo=1', '/privacy/', '/terms/', '/offline.html']) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('a.skip-link')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Animatic Event Strip home' })).toBeVisible();
    const navigation = page.getByLabel('Primary navigation');
    await expect(navigation.getByRole('link', { name: 'Demo', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Terms', exact: true })).toBeVisible();
    await expect(page.getByText(/Built by Param Factory/)).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
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
  await page.goto('/?demo=1');
  const skipLink = page.getByRole('link', { name: 'Skip to event strip' });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  const focusStyle = await skipLink.evaluate((node) => getComputedStyle(node).outline);
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

test('@claim:keyboard-operation operates documented planner controls and frame keys without focus loss', async ({ page }) => {
  await page.goto('/?demo=1');
  const addEvent = page.getByRole('button', { name: '+ Add event' });
  await addEvent.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('dialog', { name: 'Add event' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(addEvent).toBeFocused();

  const interaction = page.getByRole('button', { name: /Edit Interaction Enable player input/ });
  await interaction.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /Edit Interaction Enable player input, F109–145/ })).toBeFocused();
  await page.keyboard.press('Shift+ArrowRight');
  await expect(page.getByRole('button', { name: /Edit Interaction Enable player input, F119–155/ })).toBeFocused();

  const timeline = page.getByLabel(/Event strip timeline/);
  await timeline.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#timecode')).toHaveText('00:00:00:00');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#timecode')).toHaveText('00:00:00:01');
  await page.keyboard.press('Shift+ArrowRight');
  await expect(page.locator('#timecode')).toHaveText('00:00:00:11');
  await page.keyboard.press('End');
  await expect(page.locator('#timecode')).toHaveText('00:00:09:23');
  await expect(timeline).toBeFocused();
});

test('repairs AES-QA-302 by returning dialog focus to the edited event', async ({ page }) => {
  await page.goto('/?demo=1');
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
  await page.goto('/?demo=1');
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

test('repairs F-3-2 and AES-QA-003 with 44px targets on every public route', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '390px touch geometry is covered in the mobile profile');
  for (const route of ['/', '/privacy/', '/terms/', '/qa-definitely-missing-targets', '/offline.html']) {
    await page.goto(route);
    const targets = page.locator('a, button').filter({ visible: true });
    for (let index = 0; index < await targets.count(); index += 1) {
      const target = targets.nth(index);
      const box = await target.boundingBox();
      const name = await target.getAttribute('aria-label') ?? (await target.textContent())?.trim();
      expect(box, `missing target on ${route}: ${name}`).not.toBeNull();
      expect(box!.width, `narrow target on ${route}: ${name}`).toBeGreaterThanOrEqual(44);
      expect(box!.height, `short target on ${route}: ${name}`).toBeGreaterThanOrEqual(44);
    }
  }
});

test('repairs F-3-5 with result-naming controls and one board term', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('button', { name: 'Move to previous frame', includeHidden: true })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Move to next frame', includeHidden: true })).toHaveCount(1);
  await expect(page.getByText('2 boards', { exact: true })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Boards' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Event markers' })).toBeVisible();
  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByLabel('Label').fill(' ');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('alert')).toHaveText('Give this event a short label that tells the implementer what to build.');
  await page.getByLabel('Label').fill('Check range');
  await page.getByLabel('Start frame').fill('10');
  await page.getByLabel('End frame').fill('5');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByRole('alert')).toHaveText('Choose a start and end between frames 0 and 239. The end frame itself is not included.');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Edit board Hold on the closed gate/ }).click();
  await expect(page.getByRole('button', { name: 'Delete event' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Choose export' }).click();
  for (const name of ['Export Project JSON', 'Export Adapter JSON', 'Export Marker CSV', 'Download Godot 4 adapter', 'Download Unity 6 adapter', 'Open printable handoff']) {
    await expect(page.getByRole('button', { name: new RegExp(name) })).toBeVisible();
  }
});
