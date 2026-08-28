import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

function wavTone() {
  const rate = 8000;
  const samples = 2000;
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + samples * 2, 4); buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i += 1) buffer.writeInt16LE(Math.round(Math.sin(2 * Math.PI * 440 * i / rate) * 16000), 44 + i * 2);
  return buffer;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));
await page.goto('https://animatic-event-strip.sociobot.in/demo');
await page.getByRole('button', { name: '+ Add event' }).click();
await page.getByRole('dialog', { name: 'Add event' }).getByText('Sound', { exact: true }).click();
await page.getByLabel('Label').fill('QA voice cue');
await page.getByLabel('Start frame').fill('150');
await page.getByLabel('End frame').fill('174');
await page.locator('#audio-file').setInputFiles({ name: 'qa-tone.wav', mimeType: 'audio/wav', buffer: wavTone() });
await page.getByRole('button', { name: 'Add to strip' }).click();
const card = page.getByRole('button', { name: /Edit sound QA voice cue, F150–173/ });
await card.waitFor();
const polygon = await card.locator('polygon').getAttribute('points');
await page.reload();
await page.getByRole('button', { name: /Edit sound QA voice cue, F150–173/ }).waitFor();
await page.getByRole('button', { name: 'Export' }).click();
const pending = page.waitForEvent('download');
await page.getByRole('button', { name: /Project JSON/ }).click();
const download = await pending;
const project = JSON.parse(await readFile(await download.path(), 'utf8'));
const audio = project.events.find((event) => event.label === 'QA voice cue');
const passed = Boolean(polygon) && audio?.waveform?.length === 56 && audio?.media?.name === 'qa-tone.wav' && audio?.media?.data?.startsWith('data:audio/wav;base64,') && errors.length === 0;
console.log(JSON.stringify({ passed, renderedWaveformPointCount: polygon?.split(' ').length, exportedWaveformBuckets: audio?.waveform?.length, mediaName: audio?.media?.name, mediaPrefix: audio?.media?.data?.slice(0, 30), persistedAfterReload: true, errors }, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
