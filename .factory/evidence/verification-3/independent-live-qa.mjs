import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://animatic-event-strip.sociobot.in';
const checks = [];
const record = (name, passed, evidence) => {
  checks.push({ name, passed: Boolean(passed), evidence });
  if (!passed) process.exitCode = 1;
};
const visible = (locator) => locator.isVisible();

const browser = await chromium.launch({ headless: true });

// Independent desktop flow: error recovery, boundaries, import/export, persistence, and privacy.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  const origins = new Set();
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('request', (request) => origins.add(new URL(request.url()).origin));

  const response = await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  record('demo starts populated', response?.status() === 200
    && await visible(page.getByText('Demo — sample data, nothing is saved'))
    && await visible(page.getByText('Rain Gate — opening beat'))
    && await visible(page.getByText('2 cards', { exact: true }))
    && await visible(page.getByText('1 clip', { exact: true }))
    && await visible(page.getByText('3 markers', { exact: true })), 'HTTP 200; 2 boards, 1 sound, 3 markers');

  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByLabel('Label').fill('Invalid range probe');
  await page.getByLabel('Start frame').fill('-1');
  await page.getByLabel('End frame').fill('0');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  const rangeEvidence = await page.getByLabel('Start frame').evaluate((node) => ({
    rangeUnderflow: node.validity.rangeUnderflow,
    message: node.validationMessage,
    dialogOpen: Boolean(node.closest('dialog')?.open),
  }));
  record('invalid range is rejected in-place', rangeEvidence.rangeUnderflow && rangeEvidence.dialogOpen, rangeEvidence);
  await page.getByLabel('Label').fill('Boundary first frame');
  await page.getByLabel('Start frame').fill('0');
  await page.getByLabel('End frame').fill('1');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  record('valid one-frame recovery succeeds', await visible(page.getByRole('button', { name: /Edit board Boundary first frame, F0/ })), 'board F0 added without reload');

  await page.getByRole('button', { name: 'Edit project timing' }).click();
  await page.getByLabel('Duration (frames)').fill('100');
  await page.getByRole('button', { name: 'Save timing' }).click();
  const shrinkError = await page.locator('#settings-error').textContent();
  record('duration cannot truncate existing events', /at least 145 frames/.test(shrinkError ?? ''), shrinkError);
  await page.getByLabel('Duration (frames)').fill('240');
  await page.getByLabel('Project name').fill('Recovered live QA scene');
  await page.getByRole('button', { name: 'Save timing' }).click();
  record('settings recover after validation', await visible(page.getByText('Recovered live QA scene')), 'name and duration saved');

  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{') });
  await page.waitForTimeout(100);
  const importError = await page.locator('#workspace-error').textContent();
  record('malformed import is non-destructive and recoverable', Boolean(importError) && await visible(page.getByText('Recovered live QA scene')), importError);

  const minimal = {
    schema: 'aes-project-1', id: 'qa-min', name: 'Twelve frame boundary', fps: 60,
    durationFrames: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), events: [],
  };
  await page.locator('#import-file').setInputFiles({ name: 'min.aes.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(minimal)) });
  const importConfirm = page.getByRole('dialog', { name: /Open “Twelve frame boundary”/ });
  await importConfirm.waitFor({ state: 'visible' });
  await importConfirm.getByRole('button', { name: 'Replace project' }).click();
  await page.locator('#project-name').filter({ hasText: 'Twelve frame boundary' }).waitFor({ state: 'visible' });
  record('minimum duration import succeeds', await visible(page.locator('#project-name').filter({ hasText: 'Twelve frame boundary' })) && await visible(page.getByText('0.2s', { exact: true })), '12 frames at 60 fps');

  await page.getByRole('button', { name: 'Edit project timing' }).click();
  await page.getByLabel('Duration (frames)').fill('216001');
  await page.getByRole('button', { name: 'Save timing' }).click();
  const maxEvidence = await page.getByLabel('Duration (frames)').evaluate((node) => ({
    rangeOverflow: node.validity.rangeOverflow,
    message: node.validationMessage,
    dialogOpen: Boolean(node.closest('dialog')?.open),
  }));
  record('over-maximum duration is rejected', maxEvidence.rangeOverflow && maxEvidence.dialogOpen, maxEvidence);
  await page.getByLabel('Duration (frames)').fill('216000');
  await page.getByRole('button', { name: 'Save timing' }).click();
  record('maximum duration is accepted', await visible(page.getByText('3600.0s', { exact: true })), '216000 frames at 60 fps');

  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByText('Marker', { exact: true }).click();
  await page.getByLabel('Marker kind').selectOption('note');
  await page.getByLabel('Label').fill('Final supported frame');
  await page.getByLabel('Start frame').fill('215999');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  const marker = page.getByRole('button', { name: /Final supported frame, F215999/ });
  record('last supported frame can be marked', await visible(marker), 'note at frame 215999');
  await marker.focus();
  await page.keyboard.press('ArrowRight');
  record('keyboard movement respects upper boundary', await visible(page.getByRole('button', { name: /Final supported frame, F215999/ })), 'ArrowRight did not move past end');
  await page.keyboard.press('Shift+ArrowLeft');
  const moved = page.getByRole('button', { name: /Final supported frame, F215989/ });
  record('keyboard recovery move persists', await visible(moved), 'Shift+ArrowLeft moved ten frames');

  await page.getByRole('button', { name: 'Export' }).click();
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: /Marker CSV/ }).click();
  const csv = await (await csvDownload).createReadStream();
  let csvText = '';
  for await (const chunk of csv) csvText += chunk.toString();
  record('boundary CSV has schema and one data row', csvText.startsWith('\ufeffschema,adapter_version') && csvText.trim().split(/\r?\n/).length === 2 && csvText.includes('215989'), csvText.split(/\r?\n/).slice(0, 2));

  await page.reload({ waitUntil: 'networkidle' });
  const persisted = page.getByRole('button', { name: /Final supported frame, F215989/ });
  record('boundary edit persists after live reload', await visible(persisted), 'marker F215989 after reload');
  await persisted.click();
  await page.getByRole('button', { name: 'Delete' }).click();
  const cancelConfirm = page.getByRole('dialog', { name: /Delete “Final supported frame”/ });
  await cancelConfirm.waitFor({ state: 'visible' });
  await cancelConfirm.getByRole('button', { name: 'Keep current' }).click();
  await page.getByRole('dialog', { name: 'Edit event' }).waitFor({ state: 'visible' });
  record('delete cancellation restores editor', await visible(page.getByRole('dialog', { name: 'Edit event' })) && await page.getByLabel('Label').inputValue() === 'Final supported frame', 'cancelled deletion retained event');
  await page.getByRole('button', { name: 'Delete' }).click();
  const deleteConfirm = page.getByRole('dialog', { name: /Delete “Final supported frame”/ });
  await deleteConfirm.waitFor({ state: 'visible' });
  await deleteConfirm.getByRole('button', { name: 'Replace project' }).click();
  await page.getByRole('button', { name: /Final supported frame/ }).waitFor({ state: 'detached' });
  record('confirmed delete removes event', await page.getByRole('button', { name: /Final supported frame/ }).count() === 0, 'event removed');

  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const severe = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
  record('desktop axe serious/critical', severe.length === 0, severe.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })));
  record('ordinary demo flow stays same-origin', [...origins].every((origin) => origin === base), [...origins]);
  record('desktop console and page errors', errors.length === 0, errors);
  await page.screenshot({ path: '.factory/evidence/verification-3/desktop-independent-final.png', fullPage: true });
  await context.close();
}

// Mobile layout, complete visible touch-target inventory, keyboard focus, and reduced motion.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const geometry = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, body: document.body.scrollWidth }));
  record('390px page has no body overflow', geometry.body <= geometry.viewport, geometry);
  const undersized = await page.evaluate(() => [...document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea')].flatMap((element) => {
    const node = element;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
    const effective = node.matches('input[type=radio]') && node.closest('label') ? node.closest('label').getBoundingClientRect() : rect;
    return effective.width < 44 || effective.height < 44 ? [{ tag: node.tagName, type: node.getAttribute('type'), text: (node.getAttribute('aria-label') || node.textContent || node.getAttribute('placeholder') || '').trim(), width: +effective.width.toFixed(1), height: +effective.height.toFixed(1) }] : [];
  }));
  record('all rendered mobile targets are at least 44x44', undersized.length === 0, undersized);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to event strip' });
  const focus = await skip.evaluate((node) => { const style = getComputedStyle(node); return { focused: document.activeElement === node, outline: style.outline, color: style.outlineColor }; });
  record('first Tab exposes designed skip-link focus', focus.focused && /3px/.test(focus.outline), focus);
  const motion = await page.evaluate(() => {
    const values = [...document.querySelectorAll('*')].flatMap((node) => {
      const style = getComputedStyle(node);
      return [style.transitionDuration, style.animationDuration];
    });
    return [...new Set(values)].filter((value) => value !== '0s');
  });
  record('reduced motion removes meaningful animation', motion.every((value) => value.split(',').every((part) => parseFloat(part) <= 0.001)), motion);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const severe = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
  record('mobile axe serious/critical', severe.length === 0, severe.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })));
  record('mobile console and page errors', errors.length === 0, errors);
  await page.screenshot({ path: '.factory/evidence/verification-3/mobile-independent.png', fullPage: true });
  await context.close();
}

// Live PWA install/controller and offline demo reload.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/demo`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  const before = await page.evaluate(() => ({ controller: Boolean(navigator.serviceWorker.controller), caches: [] }));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const offline = await page.evaluate(async () => ({
    online: navigator.onLine,
    controller: Boolean(navigator.serviceWorker.controller),
    caches: await caches.keys(),
    title: document.title,
  }));
  record('live PWA controls and reloads demo offline', before.controller && !offline.online && offline.controller && offline.caches.includes('aes-shell-v5') && await visible(page.getByText('Rain Gate — opening beat')) && await visible(page.getByText('Offline', { exact: true })), offline);
  await context.setOffline(false);
  await context.close();
}

// Legal pages and metadata baseline.
{
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const route of ['/privacy/', '/terms/']) {
    const response = await page.goto(`${base}${route}`);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const severe = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
    record(`${route} responds and passes serious/critical axe`, response?.status() === 200 && severe.length === 0, { status: response?.status(), severe: severe.map((v) => v.id), title: await page.title() });
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ summary: { total: checks.length, passed: checks.filter((c) => c.passed).length, failed: checks.filter((c) => !c.passed).length }, checks }, null, 2));
