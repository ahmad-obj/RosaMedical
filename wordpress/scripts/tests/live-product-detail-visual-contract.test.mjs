import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productPath = process.argv[3] || '/product/rosa-foundation-stevens-scissors-regular/';
const browser = await chromium.launch({ headless: true });

async function load(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(productPath, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${productPath} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));
  return page;
}

async function columnCount(page, selector) {
  return page.locator(selector).first().evaluate((element) => {
    const value = getComputedStyle(element).gridTemplateColumns.trim();
    return value ? value.split(/\s+/).length : 0;
  });
}

try {
  const desktop = await load(1440, 900);
  assert.ok(await columnCount(desktop, '.rosa-product-detail__topology') >= 3,
    '1440px Product Detail must use the frozen-live three-column gallery / summary / support composition');
  assert.ok(await desktop.locator('[data-preview-product-thumbnails] > *').count() >= 4,
    'Product Detail must expose a four-slot thumbnail strip like the frozen live reference');
  assert.equal(await desktop.locator('[data-preview-product-tabs]').count(), 1,
    'Product Detail must render the Description / Available configurations tab rail');
  assert.equal(await desktop.locator('[data-preview-product-description-media]').count(), 1,
    'Product Detail description area must retain the frozen-live media panel');
  assert.ok(await desktop.locator('[data-preview-product-related] .rosa-preview-product').count() >= 4,
    'Product Detail must render four related/family catalogue cards instead of a lone fallback button');
  assert.ok(await columnCount(desktop, '.rosa-product-detail__related-grid') >= 4,
    '1440px related catalogue surface must use four columns');
  await desktop.close();

  const mobile = await load(390, 844);
  assert.ok(await mobile.locator('[data-preview-product-thumbnails] > *').count() >= 4,
    '390px Product Detail must preserve the four-slot thumbnail strip');
  assert.ok(await mobile.locator('[data-preview-product-related] .rosa-preview-product').count() >= 4,
    '390px Product Detail must preserve four related/family cards');
  assert.equal(await columnCount(mobile, '.rosa-product-detail__related-grid'), 2,
    '390px related catalogue surface must use the frozen-live two-column layout');
  await mobile.close();

  process.stdout.write('PASS: Product Detail exposes the frozen-live visual composition surfaces at desktop/mobile\n');
} finally {
  await browser.close();
}
