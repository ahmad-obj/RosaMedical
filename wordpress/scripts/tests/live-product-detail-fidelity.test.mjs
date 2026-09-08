import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productPath = process.argv[3] || '/product/rosa-foundation-stevens-scissors-regular/';
const browser = await chromium.launch({ headless: true });

async function load(viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(productPath, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${productPath} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));
  return page;
}

async function assertNoHorizontalOverflow(page) {
  const size = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(size.scroll <= size.client + 1, `${productPath} overflows horizontally: ${size.scroll} > ${size.client}`);
}

async function assertProductDetailTopology(page) {
  assert.equal(await page.locator('.rosa-product-detail').count(), 1, `${productPath} must render the Rosa product-detail surface`);
  assert.equal(await page.locator('[data-preview-product-breadcrumb]').count(), 1, `${productPath} must render the frozen live breadcrumb`);
  assert.equal(await page.locator('[data-preview-product-gallery]').count(), 1, `${productPath} must render the frozen live product/gallery block`);
  assert.equal(await page.locator('[data-preview-product-thumbnails]').count(), 1, `${productPath} must render the product thumbnail strip`);
  assert.equal(await page.locator('[data-preview-product-summary]').count(), 1, `${productPath} must render the main product information column`);
  assert.equal(await page.locator('[data-preview-product-support]').count(), 1, `${productPath} must render the numbered procurement-support panel`);
  assert.equal(await page.locator('[data-preview-product-configurations]').count(), 1, `${productPath} must render the description/configuration section`);
  assert.equal(await page.locator('[data-preview-product-related]').count(), 1, `${productPath} must render related products before the shared quotation CTA`);
  assert.equal(await page.locator('.rosa-preview-prefooter').count(), 1, `${productPath} must preserve the shared quotation CTA`);

  const text = (await page.locator('.rosa-product-detail').textContent()) || '';
  assert.match(text, /Stevens Scissors/, `${productPath} must preserve the Woo product name`);
  assert.match(text, /04-0901/, `${productPath} must preserve straight SKU 04-0901`);
  assert.match(text, /04-0911/, `${productPath} must preserve curved SKU 04-0911`);
  assert.match(text, /Straight/, `${productPath} must preserve the Straight configuration`);
  assert.match(text, /Curved/, `${productPath} must preserve the Curved configuration`);

  const supportSteps = await page.locator('[data-preview-product-support] [data-preview-product-support-step]').count();
  assert.ok(supportSteps >= 3, `${productPath} must expose the numbered procurement-support steps; found ${supportSteps}`);

  const configurations = await page.locator('[data-preview-product-configurations] article[data-variation-id]').count();
  assert.equal(configurations, 2, `${productPath} must render exactly the two real Woo variations for the representative fixture`);

  const order = await page.evaluate(() => {
    const related = document.querySelector('[data-preview-product-related]');
    const prefooter = document.querySelector('.rosa-preview-prefooter');
    if (!related || !prefooter) return false;
    return Boolean(related.compareDocumentPosition(prefooter) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  assert.equal(order, true, `${productPath} must render related products before the shared quotation CTA`);

  await assertNoHorizontalOverflow(page);
}

try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    const page = await load(viewport);
    await assertProductDetailTopology(page);
    await page.close();
  }
  process.stdout.write('PASS: representative Product Detail matches the frozen live Rosa topology at desktop/tablet/mobile\n');
} finally {
  await browser.close();
}
