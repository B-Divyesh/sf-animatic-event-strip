import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const base = 'https://animatic-event-strip.sociobot.in';
const results = {};

{
  const context = await browser.newContext({ acceptDownloads: true });
  await context.addInitScript(() => {
    localStorage.setItem('sb_license:animatic-event-strip', 'qa-cached-valid');
    localStorage.setItem('sb_license:animatic-event-strip:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
    window.print = () => localStorage.setItem('qa:print-called', 'yes');
  });
  const page = await context.newPage();
  await page.goto(`${base}/`);
  await page.getByText('Studio Pack unlocked').waitFor();
  const download = async (name) => {
    await page.getByRole('button', { name: 'Export' }).click();
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name }).click();
    const item = await pending;
    return { filename: item.suggestedFilename(), text: await readFile(await item.path(), 'utf8') };
  };
  const godot = await download(/Godot 4 adapter source/);
  const unity = await download(/Unity 6 adapter source/);
  await page.getByRole('button', { name: 'Export' }).click();
  await page.getByRole('button', { name: /Print handoff sheet/ }).click();
  results.cachedPaidOutputs = {
    godot: { filename: godot.filename, hasV1Loader: godot.text.includes('adapter_version') && godot.text.includes('Godot 4.x') },
    unity: { filename: unity.filename, hasV1Loader: unity.text.includes('adapter_version') && unity.text.includes('Unity 6') },
    printCalled: await page.evaluate(() => localStorage.getItem('qa:print-called') === 'yes'),
  };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  let verifyUrl = '';
  await page.route('https://api.sociobot.in/**', async (route) => {
    verifyUrl = route.request().url();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });
  await page.goto(`${base}/?kept=1&license=qa-invalid-token#anchor`);
  await page.getByText(/This license is no longer active/).waitFor();
  results.returnToken = await page.evaluate(() => ({
    url: location.href,
    token: localStorage.getItem('sb_license:animatic-event-strip'),
    state: document.querySelector('#license-state')?.textContent?.trim(),
  }));
  results.returnToken.verifyUrl = verifyUrl;
  await context.close();
}

await browser.close();
const passed = results.cachedPaidOutputs.godot.hasV1Loader
  && results.cachedPaidOutputs.unity.hasV1Loader
  && results.cachedPaidOutputs.printCalled
  && results.returnToken.token === 'qa-invalid-token'
  && !results.returnToken.url.includes('license=')
  && results.returnToken.url.includes('kept=1')
  && results.returnToken.url.endsWith('#anchor')
  && results.returnToken.verifyUrl.includes('/verify?license=qa-invalid-token')
  && results.returnToken.state === 'Free planner active';
console.log(JSON.stringify({ passed, ...results }, null, 2));
if (!passed) process.exitCode = 1;
