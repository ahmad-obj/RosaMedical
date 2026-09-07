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

async function box(page, selector) {
  const value = await page.locator(selector).first().boundingBox();
  assert.ok(value, `${selector} must have a visible layout box`);
  return value;
}

async function assertNoHorizontalOverflow(page) {
  const size = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(size.scroll <= size.client + 1, `${productPath} overflows horizontally: ${size.scroll} > ${size.client}`);
}

async function assertWideLayout(page, viewport) {
  const topologyDisplay = await page.locator('.rosa-product-detail__topology').evaluate((element) => getComputedStyle(element).display);
  assert.equal(topologyDisplay, 'grid', `${viewport.width}px Product Detail must use a composed grid, not the old vertical prototype`);

  const gallery = await box(page, '[data-preview-product-gallery]');
  const summary = await box(page, '[data-preview-product-summary]');
  const support = await box(page, '[data-preview-product-support]');

  assert.ok(gallery.width >= viewport.width * 0.38, `${viewport.width}px gallery must remain a substantial primary visual column`);
  assert.ok(summary.x > gallery.x + gallery.width * 0.6, `${viewport.width}px summary must sit beside the gallery`);
  assert.ok(Math.abs(summary.y - gallery.y) <= 80, `${viewport.width}px summary must begin alongside the gallery`);
  assert.ok(support.x >= summary.x - 8, `${viewport.width}px support panel must remain in the information column`);
  assert.ok(support.y > summary.y, `${viewport.width}px support panel must follow the main product summary`);

  const configurations = await box(page, '[data-preview-product-configurations]');
  assert.ok(configurations.y > gallery.y + Math.min(gallery.height, 300), `${viewport.width}px configuration section must continue below the product intro`);
}

async function assertMobileLayout(page, viewport) {
  const gallery = await box(page, '[data-preview-product-gallery]');
  const summary = await box(page, '[data-preview-product-summary]');
  const support = await box(page, '[data-preview-product-support]');

  assert.ok(gallery.width >= viewport.width - 48, `${viewport.width}px gallery must use the mobile content width`);
  assert.ok(summary.y > gallery.y + gallery.height - 4, `${viewport.width}px summary must stack below the gallery`);
  assert.ok(support.y > summary.y + summary.height - 4, `${viewport.width}px support must stack below the summary`);
  assert.ok(summary.width >= viewport.width - 48, `${viewport.width}px summary must use the mobile content width`);
  assert.ok(support.width >= viewport.width - 48, `${viewport.width}px support must use the mobile content width`);
}

try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    const page = await load(viewport);
    if (viewport.width >= 1024) {
      await assertWideLayout(page, viewport);
    } else {
      await assertMobileLayout(page, viewport);
    }
    await assertNoHorizontalOverflow(page);
    await page.close();
  }

  process.stdout.write('PASS: representative Product Detail uses the approved responsive gallery/information/support composition\n');
} finally {
  await browser.close();
}
