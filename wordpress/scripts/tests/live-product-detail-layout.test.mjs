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

async function assertDesktopLayout(page, viewport) {
  const topologyDisplay = await page.locator('.rosa-product-detail__topology').evaluate((element) => getComputedStyle(element).display);
  assert.equal(topologyDisplay, 'grid', `${viewport.width}px Product Detail must use a composed grid, not the old vertical prototype`);

  const gallery = await box(page, '[data-preview-product-gallery]');
  const summary = await box(page, '[data-preview-product-summary]');
  const support = await box(page, '[data-preview-product-support]');

  assert.ok(gallery.width >= viewport.width * 0.38, `${viewport.width}px gallery must remain a substantial primary visual column`);
  assert.ok(summary.x > gallery.x + gallery.width * 0.6, `${viewport.width}px summary must sit beside the gallery`);
  assert.ok(Math.abs(summary.y - gallery.y) <= 80, `${viewport.width}px summary must begin alongside the gallery`);
  assert.ok(support.x > summary.x + summary.width * 0.55, `${viewport.width}px support panel must occupy the third frozen-live column`);
  assert.ok(Math.abs(support.y - gallery.y) <= 80, `${viewport.width}px support panel must begin alongside gallery and summary`);

  const configurations = await box(page, '[data-preview-product-configurations]');
  assert.ok(configurations.y > gallery.y + Math.min(gallery.height, 300), `${viewport.width}px configuration section must continue below the product intro`);
}

async function assertTabletLayout(page, viewport) {
  const topologyDisplay = await page.locator('.rosa-product-detail__topology').evaluate((element) => getComputedStyle(element).display);
  assert.equal(topologyDisplay, 'grid', `${viewport.width}px Product Detail must keep a composed tablet grid`);

  const gallery = await box(page, '[data-preview-product-gallery]');
  const summary = await box(page, '[data-preview-product-summary]');
  const support = await box(page, '[data-preview-product-support]');

  assert.ok(gallery.width >= viewport.width * 0.38, `${viewport.width}px gallery must remain a substantial primary visual column`);
  assert.ok(summary.x > gallery.x + gallery.width * 0.6, `${viewport.width}px summary must sit beside the gallery`);
  assert.ok(Math.abs(summary.y - gallery.y) <= 80, `${viewport.width}px summary must begin alongside the gallery`);

  const introRight = Math.max(gallery.x + gallery.width, summary.x + summary.width);
  const introBottom = Math.max(gallery.y + gallery.height, summary.y + summary.height);
  assert.ok(support.x <= gallery.x + 8, `${viewport.width}px support surface must begin with the gallery column`);
  assert.ok(support.x + support.width >= introRight - 8, `${viewport.width}px support surface must span beneath gallery and summary`);
  assert.ok(support.y >= introBottom - 4, `${viewport.width}px support surface must follow the complete gallery/summary row`);

  const stepBoxes = await page.locator('[data-preview-product-support-step]').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }));
  assert.equal(stepBoxes.length, 3, `${viewport.width}px support surface must retain three procurement steps`);
  const stepY = stepBoxes.map((step) => step.y);
  assert.ok(Math.max(...stepY) - Math.min(...stepY) <= 24, `${viewport.width}px support steps must form one horizontal row`);
  assert.ok(stepBoxes[1].x > stepBoxes[0].x && stepBoxes[2].x > stepBoxes[1].x,
    `${viewport.width}px support steps must progress horizontally across the support surface`);

  const configurations = await box(page, '[data-preview-product-configurations]');
  assert.ok(configurations.y >= support.y + support.height - 4, `${viewport.width}px configurations must continue below the tablet support surface`);

  const description = await box(page, '.rosa-product-detail__description');
  const media = await box(page, '[data-preview-product-description-media]');
  const configurationList = await box(page, '.rosa-product-detail__configuration-list');
  assert.ok(description.y < media.y, `${viewport.width}px description heading/copy must lead the media/configuration row`);
  assert.ok(media.x + media.width + 12 <= configurationList.x,
    `${viewport.width}px description media must not overlap the configuration content`);
  assert.ok(Math.abs(media.y - configurationList.y) <= 40,
    `${viewport.width}px description media and configuration cards must share a clean two-column row`);
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
    if (viewport.width >= 1200) {
      await assertDesktopLayout(page, viewport);
    } else if (viewport.width >= 1024) {
      await assertTabletLayout(page, viewport);
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
