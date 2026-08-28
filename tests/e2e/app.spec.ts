import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('creates, edits, persists, and exports a useful strip', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Find the beat/);
  await page.getByRole('button', { name: 'Add your first event' }).click();
  await page.getByLabel('Label').fill('Gate opens');
  await page.getByLabel('Start frame').fill('0');
  await page.getByLabel('End frame').fill('48');
  await page.locator('#image-file').setInputFiles('public/assets/cutting-room-960.webp');
  await expect(page.locator('#image-picked')).toHaveText('cutting-room-960.webp');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByText('1 card', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '+ Add event' }).click();
  await page.getByText('Marker', { exact: true }).click();
  await page.getByLabel('Label').fill('Enable player input');
  await page.getByLabel('Marker kind').selectOption('interaction');
  await page.getByLabel('Start frame').fill('36');
  await page.getByLabel('End frame').fill('55');
  await page.getByRole('button', { name: 'Add to strip' }).click();
  await expect(page.getByText('1 marker', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: /Edit board Gate opens/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Edit Interaction Enable player input/ })).toBeVisible();

  await page.getByRole('button', { name: 'Export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Adapter JSON/ }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('untitled-scene.adapter.json');
  expect(consoleErrors).toEqual([]);
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('reloads the installed shell offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'offline install path is covered in the mobile PWA profile');
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.waitForFunction(() => navigator.onLine === false);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Offline', { exact: true })).toBeVisible();
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
