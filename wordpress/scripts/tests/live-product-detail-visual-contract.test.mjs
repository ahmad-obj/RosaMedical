import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productPath = process.argv[3] || '/product/rosa-foundation-stevens-scissors-regular/';
const browser = await chromium.launch({ headless: true });

async function load(width, height, path = productPath) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${path} returned ${response?.status() ?? 'no response'}`);
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
  assert.equal(await desktop.locator('[data-rosa-elementor-product-detail]').count(), 1,
    'Product Detail must render through the global Rosa Elementor Product Page');
  assert.equal(await columnCount(desktop, '.rosa-product-elementor-hero'), 2,
    '1440px Product Detail hero must use the approved two-column gallery / summary composition');
  assert.ok(await desktop.locator('[data-preview-product-thumbnails] > *').count() >= 1,
    'Product Detail must expose the real Woo gallery thumbnail strip when media exists');
  assert.equal(await desktop.locator('.rosa-product-detail__tabs a').count(), 3,
    'Product Detail must render Description / Configurations / Related navigation');
  assert.equal(await desktop.locator('.rosa-product-detail__spec-card').count(), 1,
    'Product Detail must expose the catalogue summary card beside the description');
  assert.equal(await desktop.locator('[data-preview-product-support-step]').count(), 3,
    'Product Detail must expose three procurement-support steps');
  assert.ok(await desktop.locator('[data-preview-product-related] .rosa-preview-product').count() >= 4,
    'Product Detail must render four related/family catalogue cards');
  assert.ok(await columnCount(desktop, '.rosa-product-detail__related-grid') >= 4,
    '1440px related catalogue surface must use four columns');
  assert.equal(await desktop.locator('.woocommerce-product-rating, .woocommerce-Reviews, .single_add_to_cart_button').count(), 0,
    'Product Detail must not regress to retail ratings/reviews/Add to Cart UI');
  await desktop.close();

  const mobile = await load(390, 844);
  assert.equal(await columnCount(mobile, '.rosa-product-elementor-hero'), 1,
    '390px Product Detail hero must collapse to one readable column');
  assert.ok(await mobile.locator('[data-preview-product-related] .rosa-preview-product').count() >= 4,
    '390px Product Detail must preserve related/family catalogue discovery');
  assert.equal(await columnCount(mobile, '.rosa-product-detail__related-grid'), 2,
    '390px related catalogue surface must use the approved two-column layout');
  await mobile.close();

  process.stdout.write('PASS: Elementor Product Detail exposes the approved MedicaShop-inspired Rosa composition\n');
} finally {
  await browser.close();
}
