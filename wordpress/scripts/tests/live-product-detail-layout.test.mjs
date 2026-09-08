import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productPath = process.argv[3] || '/product/rosa-foundation-stevens-scissors-regular/';
const browser = await chromium.launch({ headless: true });

async function load(viewport, path = productPath) {
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

async function assertNoHorizontalOverflow(page, path = productPath) {
  const size = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(size.scroll <= size.client + 1, `${path} overflows horizontally: ${size.scroll} > ${size.client}`);
}

async function assertSectionOrder(page, path = productPath) {
  const ordered = await page.evaluate(() => {
    const selectors = ['[data-preview-product-details]', '[data-preview-product-configurations]', '[data-preview-product-support]', '[data-preview-product-related]'];
    const nodes = selectors.map((selector) => document.querySelector(selector));
    if (nodes.some((node) => !node)) return false;
    return nodes.slice(0, -1).every((node, index) => Boolean(node.compareDocumentPosition(nodes[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  assert.equal(ordered, true, `${path} must flow details → configurations → procurement support → related instruments`);
}

async function assertWideHero(page, viewport, rtl = false) {
  const heroDisplay = await page.locator('.rosa-product-elementor-hero').evaluate((element) => getComputedStyle(element).display);
  assert.equal(heroDisplay, 'grid', `${viewport.width}px Product Detail hero must use the Elementor grid composition`);

  const gallery = await box(page, '[data-preview-product-gallery]');
  const summary = await box(page, '[data-preview-product-summary]');
  assert.ok(gallery.width >= viewport.width * 0.35, `${viewport.width}px gallery must remain a substantial visual column`);
  assert.ok(summary.width >= viewport.width * 0.28, `${viewport.width}px summary must remain a substantial information column`);
  assert.ok(Math.abs(summary.y - gallery.y) <= 80, `${viewport.width}px gallery and summary must start on the same hero row`);
  if (rtl) {
    assert.ok(gallery.x > summary.x, `${viewport.width}px RTL must mirror the gallery to the right of the summary`);
  } else {
    assert.ok(summary.x > gallery.x, `${viewport.width}px summary must sit to the right of the gallery in English`);
  }
}

async function assertMobileHero(page, viewport, path = productPath) {
  const gallery = await box(page, '[data-preview-product-gallery]');
  const summary = await box(page, '[data-preview-product-summary]');
  assert.ok(gallery.width >= viewport.width - 48, `${path} gallery must use the mobile content width`);
  assert.ok(summary.y >= gallery.y + gallery.height - 4, `${path} summary must stack below the gallery`);
  assert.ok(summary.width >= viewport.width - 48, `${path} summary must use the mobile content width`);
}

try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    const page = await load(viewport);
    if (viewport.width >= 1024) await assertWideHero(page, viewport);
    else await assertMobileHero(page, viewport);

    const configurations = await box(page, '[data-preview-product-configurations]');
    const support = await box(page, '[data-preview-product-support]');
    assert.ok(support.y >= configurations.y + configurations.height - 4,
      `${viewport.width}px procurement support must follow the configuration catalogue, not compete with the hero`);
    await assertSectionOrder(page);
    await assertNoHorizontalOverflow(page);
    await page.close();
  }

  const rtlPath = '/ar/product/rosa-foundation-stevens-scissors-regular/';
  const rtlDesktop = await load({ width: 1440, height: 900 }, rtlPath);
  assert.equal(await rtlDesktop.locator('html').getAttribute('dir'), 'rtl', 'Arabic Product Detail must retain RTL document direction');
  await assertWideHero(rtlDesktop, { width: 1440, height: 900 }, true);
  await assertSectionOrder(rtlDesktop, rtlPath);
  await assertNoHorizontalOverflow(rtlDesktop, rtlPath);
  await rtlDesktop.close();

  const narrow = await load({ width: 768, height: 1024 }, rtlPath);
  await assertMobileHero(narrow, { width: 768, height: 1024 }, rtlPath);
  await assertNoHorizontalOverflow(narrow, rtlPath);
  await narrow.close();

  process.stdout.write('PASS: Elementor Product Detail uses the approved responsive two-column hero and mirrored RTL composition\n');
} finally {
  await browser.close();
}
