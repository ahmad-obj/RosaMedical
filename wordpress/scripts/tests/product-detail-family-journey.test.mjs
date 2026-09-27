import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const expectedFamilies = new Set(['scissors', 'cutters', 'punches', 'chisels', 'knives']);
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') {
  launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}

function positiveInteger(value, label) {
  const parsed = Number(value);
  assert.ok(Number.isInteger(parsed) && parsed > 0, `${label} must be a positive integer; got ${value}`);
  return parsed;
}

async function load(page, path, label) {
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${label} returned HTTP ${response?.status() ?? 'no response'}`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
}

async function assertHealthyDetail(page, sample, locale, viewportLabel) {
  const route = new URL(page.url());
  const label = `${sample.family} ${locale.toUpperCase()} ${viewportLabel}`;
  assert.equal(await page.locator('main').count(), 1, `${label} must have one main landmark`);
  assert.equal(await page.locator('.rosa-product-detail').count(), 1, `${label} must render one Product Detail surface`);
  assert.equal(await page.locator('[data-preview-product-gallery]').count(), 1, `${label} must render a gallery/fallback surface`);
  assert.equal(await page.locator('[data-preview-product-summary]').count(), 1, `${label} must render product summary`);
  assert.equal(await page.locator('[data-preview-product-configurations]').count(), 1, `${label} must render configuration catalogue`);
  assert.equal(await page.locator('[data-preview-product-support]').count(), 1, `${label} must render procurement support`);
  assert.equal(await page.locator('h1').first().textContent(), sample.name, `${label} must retain its Woo product name`);
  assert.match(route.pathname, /\/product\//, `${label} must remain on a Product Detail route`);
  assert.equal(await page.locator('html').getAttribute('dir'), locale === 'ar' ? 'rtl' : 'ltr', `${label} document direction mismatch`);
  const overflow = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(overflow.scroll <= overflow.client + 1, `${label} has horizontal overflow: ${overflow.scroll} > ${overflow.client}`);

  const brokenImages = await page.locator('img').evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src));
  assert.deepEqual(brokenImages, [], `${label} contains loaded-but-broken image assets`);
}

async function addExactQuote(page, sample) {
  const label = `${sample.family} quote`;
  await page.evaluate(() => window.RosaQuoteBasket.clear());
  const form = page.locator('[data-preview-product-summary] [data-rosa-quote-item]');
  assert.equal(await form.count(), 1, `${label} must expose one quote form`);
  const select = form.locator('[data-rosa-quote-configuration]');
  const quantity = form.locator('[data-rosa-quote-quantity]');
  const button = form.locator('[data-rosa-add-to-quote]');
  assert.equal(await quantity.count(), 1, `${label} must expose quantity selection`);
  assert.equal(await button.count(), 1, `${label} must expose Add to Quote`);

  let expectedVariationId = 0;
  let expectedSku = '';
  if (sample.type === 'variable') {
    assert.equal(await select.count(), 1, `${label} variable product must require exact configuration selection`);
    assert.ok(await select.locator('option').count() > 0, `${label} configuration selector must have Woo options`);
    await select.selectOption({ index: Math.min(1, (await select.locator('option').count()) - 1) });
    const option = select.locator('option:checked');
    expectedVariationId = positiveInteger(await option.getAttribute('data-variation-id'), `${label} selected variation`);
    expectedSku = ((await option.getAttribute('data-sku')) || '').trim();
  } else {
    assert.equal(await select.count(), 0, `${label} simple product must not fabricate a variation selector`);
    expectedSku = ((await button.getAttribute('data-sku')) || '').trim();
  }

  assert.ok(expectedSku.length > 0, `${label} must retain a canonical public reference`);
  await quantity.fill('2');
  await button.click();
  await page.waitForFunction(() => window.RosaQuoteBasket.getState().items.length === 1);
  const state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 1, `${label} must add exactly one quote line`);
  const item = state.items[0];
  assert.equal(item.productId, sample.productId, `${label} must preserve parent product identity`);
  assert.equal(item.variationId, expectedVariationId, `${label} must preserve selected configuration identity`);
  assert.equal(item.sku, expectedSku, `${label} must preserve selected configuration reference`);
  assert.equal(item.quantity, 2, `${label} must preserve requested quantity`);
}

const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const failures = [];
page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
page.on('console', (message) => { if (message.type() === 'error') failures.push(`console: ${message.text()}`); });

try {
  await load(page, '/shop/', 'Shop EN discovery');
  const samples = await page.locator('.rosa-shop-products-grid .rosa-preview-product:not(.rosa-preview-product--family)').evaluateAll((cards) => {
    const found = new Map();
    for (const card of cards) {
      const family = card.getAttribute('data-family') || '';
      const link = card.querySelector('h3 a[href]');
      if (!family || !link || found.has(family)) continue;
      found.set(family, {
        family,
        productId: Number(card.getAttribute('data-product-id')),
        type: card.getAttribute('data-product-type'),
        name: (link.textContent || '').trim(),
        href: link.getAttribute('href'),
      });
    }
    return [...found.values()];
  });

  assert.deepEqual(new Set(samples.map((sample) => sample.family)), expectedFamilies, 'Shop EN must expose a quotable representative for each source family');
  for (const sample of samples) {
    positiveInteger(sample.productId, `${sample.family} parent product`);
    assert.ok(['simple', 'variable'].includes(sample.type), `${sample.family} must expose explicit Woo product type`);
    assert.ok(sample.name.length > 0 && sample.href, `${sample.family} must expose product title and direct route`);

    await load(page, sample.href, `${sample.family} EN`);
    await assertHealthyDetail(page, sample, 'en', 'desktop');
    await addExactQuote(page, sample);

    const languageHref = await page.locator('.rosa-preview-language[href]').getAttribute('href');
    assert.ok(languageHref, `${sample.family} EN must link to Arabic equivalent`);
    const arabicUrl = new URL(languageHref, page.url());
    assert.equal(arabicUrl.origin, baseUrl.origin, `${sample.family} Arabic equivalent must remain on the Rosa host`);
    await load(page, `${arabicUrl.pathname}${arabicUrl.search}`, `${sample.family} AR`);
    await assertHealthyDetail(page, sample, 'ar', 'desktop');
    const arabicQuoteText = ((await page.locator('[data-preview-product-summary] [data-rosa-add-to-quote]').textContent()) || '').trim();
    assert.match(arabicQuoteText, /[\u0600-\u06ff]/, `${sample.family} AR must translate Add to Quote`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const sample of samples) {
    await load(page, sample.href, `${sample.family} EN mobile`);
    await assertHealthyDetail(page, sample, 'en', 'mobile');
    const add = page.locator('[data-preview-product-summary] [data-rosa-add-to-quote]');
    const box = await add.boundingBox();
    assert.ok(box && box.width >= 44 && box.height >= 44, `${sample.family} EN mobile Add to Quote must remain a usable touch target`);
  }

  assert.deepEqual(failures, [], 'Representative Product Detail journeys must not emit browser errors');
  process.stdout.write('PASS: one representative from each catalogue family keeps direct EN/AR Product Detail, exact configuration quotation, media fallback, and mobile layout healthy\n');
} finally {
  await context.close();
  await browser.close();
}
