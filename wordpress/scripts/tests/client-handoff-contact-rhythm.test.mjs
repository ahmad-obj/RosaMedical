import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });

const routes = ['/contact/', '/ar/contact/'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

async function load(path, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${path} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));
  return page;
}

async function box(page, selector) {
  const value = await page.locator(selector).first().boundingBox();
  assert.ok(value, `${selector} must have a visible layout box`);
  return value;
}

async function assertContactRhythm(page, path, viewport) {
  const cards = await box(page, '.rosa-preview-contact__cards');
  const prefooter = await box(page, '.rosa-preview-prefooter');
  const gap = prefooter.y - (cards.y + cards.height);

  assert.ok(
    gap >= -1,
    `${path} ${viewport.width}x${viewport.height} Contact cards must not overlap the procurement prefooter (gap ${gap.toFixed(1)}px)`,
  );
  assert.ok(
    gap <= 192,
    `${path} ${viewport.width}x${viewport.height} Contact cards-to-prefooter gap is ${gap.toFixed(1)}px; handoff rhythm must stay within 192px`,
  );

  const documentSize = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(
    documentSize.scroll <= documentSize.client + 1,
    `${path} ${viewport.width}x${viewport.height} overflows horizontally: ${documentSize.scroll} > ${documentSize.client}`,
  );
}

try {
  for (const viewport of viewports) {
    for (const path of routes) {
      const page = await load(path, viewport);
      await assertContactRhythm(page, path, viewport);
      await page.close();
    }
  }

  process.stdout.write('PASS: Contact EN/AR handoff rhythm keeps the cards and procurement prefooter in a controlled vertical relationship across all handoff viewports\n');
} finally {
  await browser.close();
}
