import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productSlug = 'rosa-foundation-stevens-scissors-regular';
const storageKey = 'rosa_quote_basket_v1';

const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') {
  launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}

const forbiddenCommerceRequest = /(?:[?&]wc-ajax=add_to_cart\b|\/wp-json\/wc\/store\/v1\/cart(?:\/|\?|$)|\/wp-json\/wc\/v3\/orders(?:\/|\?|$)|\/cart\/?(?:\?|#|$)|\/checkout\/?(?:\?|#|$))/i;
const forbiddenCommerceUi = '.single_add_to_cart_button, .add_to_cart_button, [name="add-to-cart"], a[href*="/cart/"], a[href*="/checkout/"]';
const listingQuoteUi = '[data-rosa-add-to-quote], [data-rosa-quote-quantity], [data-rosa-quote-configuration], [data-rosa-quote-item], .rosa-preview-product__quote';

const positiveInteger = (value, label) => {
  const parsed = Number(value);
  assert.ok(Number.isInteger(parsed) && parsed > 0, `${label} must be a positive integer; got ${value}`);
  return parsed;
};

const nonNegativeInteger = (value, label) => {
  const parsed = Number(value);
  assert.ok(Number.isInteger(parsed) && parsed >= 0, `${label} must be a non-negative integer; got ${value}`);
  return parsed;
};

function assertQuoteState(state, label) {
  assert.ok(state && typeof state === 'object' && !Array.isArray(state), `${label} quote state must be an object`);
  assert.equal(state.version, 1, `${label} quote state version must remain 1`);
  assert.ok(Array.isArray(state.items), `${label} quote state items must be an array`);

  for (const item of state.items) {
    positiveInteger(item.productId, `${label} productId`);
    nonNegativeInteger(item.variationId, `${label} variationId`);
    assert.equal(typeof item.sku, 'string', `${label} SKU must be a string`);
    assert.ok(item.sku.trim().length > 0, `${label} SKU must not be empty`);
    positiveInteger(item.quantity, `${label} quantity`);
    for (const key of Object.keys(item)) {
      assert.ok(
        !/(?:price|subtotal|amount|currency|tax|shipping|cart|checkout|order)/i.test(key),
        `${label} item must not store ecommerce/pricing field ${key}`,
      );
    }
  }
}

async function load(page, path, label) {
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${label} returned HTTP ${response?.status() ?? 'no response'}`);
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function readCount(page, label) {
  const indicator = page.locator('[data-rosa-quote-count]');
  assert.equal(await indicator.count(), 1, `${label} must expose exactly one shared quote-count indicator`);
  const text = ((await indicator.textContent()) || '').trim();
  const match = text.match(/\d+/);
  assert.ok(match, `${label} quote-count indicator must expose a numeric count; got ${JSON.stringify(text)}`);
  return Number(match[0]);
}

async function assertFeedback(page, locale, label) {
  const feedback = page.locator('[data-rosa-quote-feedback]');
  assert.equal(await feedback.count(), 1, `${label} must expose exactly one shared Add to Quote feedback element`);
  const ariaLive = await feedback.getAttribute('aria-live');
  assert.ok(['polite', 'assertive'].includes(ariaLive || ''), `${label} quote feedback must use an aria-live region`);
  await feedback.waitFor({ state: 'visible', timeout: 5_000 });
  const text = ((await feedback.textContent()) || '').trim();
  assert.ok(text.length > 0, `${label} quote feedback must expose visible copy`);
  if (locale === 'ar') {
    assert.match(text, /[\u0600-\u06ff]/, `${label} Arabic quote feedback must expose Arabic copy`);
  } else {
    assert.match(text, /quote|added|request/i, `${label} English quote feedback must explain that the item was added`);
  }
}

async function assertTouchTarget(locator, label) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} must be visible`);
  assert.ok(box.width >= 44 && box.height >= 44, `${label} must keep a 44px minimum touch target; got ${box.width}x${box.height}`);
}

async function assertCatalogueCardsNavigateOnly(page, selector, label) {
  const cards = page.locator(selector);
  const count = await cards.count();
  assert.ok(count > 0, `${label} must expose at least one real Woo product card`);

  for (let index = 0; index < Math.min(count, 8); index += 1) {
    const card = cards.nth(index);
    assert.equal(await card.locator(listingQuoteUi).count(), 0, `${label} card ${index + 1} must not expose configuration, quantity or Add to Quote controls`);

    const media = card.locator('.rosa-preview-product__media[href]');
    const title = card.locator('h3 a[href]');
    const action = card.locator('.rosa-preview-product__action[href]');
    assert.equal(await media.count(), 1, `${label} card ${index + 1} media must navigate to Product Detail`);
    assert.equal(await title.count(), 1, `${label} card ${index + 1} title must navigate to Product Detail`);
    assert.equal(await action.count(), 1, `${label} card ${index + 1} action must navigate to Product Detail`);

    const hrefs = await Promise.all([media.getAttribute('href'), title.getAttribute('href'), action.getAttribute('href')]);
    assert.ok(hrefs.every(Boolean), `${label} card ${index + 1} navigation targets must not be empty`);
    const urls = hrefs.map((href) => new URL(href, page.url()));
    assert.ok(urls.every((url) => /\/product\//.test(url.pathname)), `${label} card ${index + 1} must route to a dedicated /product/ detail URL`);
    assert.equal(urls[0].href, urls[1].href, `${label} card ${index + 1} media and title must target the same Product Detail URL`);
    assert.equal(urls[1].href, urls[2].href, `${label} card ${index + 1} title and View Details action must target the same Product Detail URL`);
  }
}

async function selectSummaryQuoteIdentity(page, index, label) {
  const form = page.locator('.rosa-product-detail__quote-form[data-rosa-quote-item]').first();
  assert.equal(await form.count(), 1, `${label} must expose the Product Detail quote form`);
  const selector = form.locator('[data-rosa-quote-configuration]');
  const quantity = form.locator('input[data-rosa-quote-quantity]');
  const add = form.locator('[data-rosa-add-to-quote]');

  assert.equal(await selector.count(), 1, `${label} must expose one exact Woo configuration selector`);
  assert.equal(await quantity.count(), 1, `${label} must expose one quotation quantity input`);
  assert.equal(await add.count(), 1, `${label} must expose one Add to Quote button`);
  assert.ok(await selector.locator('option').count() >= 2, `${label} representative product must expose at least two Woo configurations`);

  await selector.selectOption({ index });
  const selected = selector.locator('option:checked');
  const variationId = positiveInteger(await selected.getAttribute('data-variation-id'), `${label} selected variationId`);
  const sku = ((await selected.getAttribute('data-sku')) || '').trim();
  const productId = positiveInteger(await add.getAttribute('data-product-id'), `${label} productId`);
  assert.ok(sku.length > 0, `${label} selected configuration must expose an exact SKU`);
  assert.equal(positiveInteger(await add.getAttribute('data-variation-id'), `${label} button variationId`), variationId, `${label} button must track the selected variation`);
  assert.equal(((await add.getAttribute('data-sku')) || '').trim(), sku, `${label} button must track the selected SKU`);

  return { add, quantity, productId, variationId, sku };
}

const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const forbiddenRequests = [];
const browserErrors = [];

page.on('request', (request) => {
  if (forbiddenCommerceRequest.test(request.url())) forbiddenRequests.push(request.url());
});
page.on('pageerror', (error) => browserErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') browserErrors.push(message.text());
});

try {
  await load(page, '/', 'Home EN');
  assert.equal(await page.evaluate(() => typeof window.RosaQuoteBasket?.clear), 'function', 'Home EN must load the shared quote basket shell');
  await page.evaluate(() => window.RosaQuoteBasket.clear());
  await assertCatalogueCardsNavigateOnly(page, '.rosa-preview-product:not(.rosa-preview-product--family)', 'Home EN');
  assert.equal(await readCount(page, 'Home EN'), 0, 'Home EN catalogue previews must not mutate quote state');

  await load(page, '/shop/', 'Shop EN');
  await assertCatalogueCardsNavigateOnly(page, '.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)', 'Shop EN');
  assert.equal(await readCount(page, 'Shop EN'), 0, 'Shop EN catalogue previews must not mutate quote state');
  assert.equal(await page.locator(forbiddenCommerceUi).count(), 0, 'Shop EN must not expose Woo Add to Cart, Cart or Checkout UI');

  await load(page, '/ar/shop/', 'Shop AR');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Shop AR must remain RTL');
  await assertCatalogueCardsNavigateOnly(page, '.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)', 'Shop AR');
  const arDetailsText = ((await page.locator('.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family) .rosa-preview-product__action').first().textContent()) || '').trim();
  assert.match(arDetailsText, /[\u0600-\u06ff]/, 'Shop AR View Details action must expose Arabic copy');
  assert.equal(await readCount(page, 'Shop AR'), 0, 'Shop AR catalogue previews must not mutate quote state');

  await load(page, `/product/${productSlug}/`, 'Product EN');
  await page.evaluate(() => window.RosaQuoteBasket.clear());
  assert.equal(await page.locator(forbiddenCommerceUi).count(), 0, 'Product EN must not expose Woo Add to Cart, Cart or Checkout UI');

  const selectedConfigurations = [];
  for (const [index, quantityValue] of [[0, 2], [1, 1]]) {
    const selection = await selectSummaryQuoteIdentity(page, index, `Product EN configuration ${index + 1}`);
    await selection.quantity.fill(String(quantityValue));
    await selection.add.click();
    selectedConfigurations.push({ productId: selection.productId, variationId: selection.variationId, sku: selection.sku, quantity: quantityValue });
  }

  await page.waitForFunction(() => window.RosaQuoteBasket.getState().items.length === 2);
  let state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assertQuoteState(state, 'Product EN multi-configuration state');
  assert.equal(state.items.length, 2, 'Product EN must support two distinct configuration quote lines');
  for (const expected of selectedConfigurations) {
    const actual = state.items.find((item) => item.variationId === expected.variationId && item.sku === expected.sku);
    assert.ok(actual, `Product EN quote basket must retain exact configuration ${expected.sku}`);
    assert.equal(actual.quantity, expected.quantity, `Product EN configuration ${expected.sku} quantity mismatch`);
  }
  assert.equal(await readCount(page, 'Product EN'), 3, 'Product EN quote count must equal total quantity across selected configurations');
  await assertFeedback(page, 'en', 'Product EN');

  const languageHref = await page.locator('.rosa-preview-language').getAttribute('href');
  assert.ok(languageHref, 'Product EN must expose Arabic language pairing');
  const arabicProductUrl = new URL(languageHref, page.url());
  assert.equal(arabicProductUrl.origin, baseUrl.origin, 'Arabic Product pairing must stay on the Rosa site');

  await load(page, `${arabicProductUrl.pathname}${arabicProductUrl.search}`, 'Product AR');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Product AR must remain RTL');
  assert.equal(await readCount(page, 'Product AR'), 3, 'Product AR must preserve quote-count state across locale navigation');
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 2, 'Product AR must preserve both selected configuration lines');
  const arAdd = page.locator('.rosa-product-detail__quote-form [data-rosa-add-to-quote]').first();
  const productArAddText = ((await arAdd.textContent()) || '').trim();
  assert.match(productArAddText, /[\u0600-\u06ff]/, 'Product AR Add to Quote control must expose Arabic copy');

  await page.setViewportSize({ width: 390, height: 844 });
  await load(page, '/shop/', 'Shop EN mobile');
  const mobileCard = page.locator('.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)').first();
  assert.equal(await mobileCard.locator(listingQuoteUi).count(), 0, 'Shop EN mobile cards must remain navigation-only');
  await assertTouchTarget(mobileCard.locator('.rosa-preview-product__action'), 'Shop EN mobile View Details');

  await load(page, `/product/${productSlug}/`, 'Product EN mobile');
  const mobileQuoteForm = page.locator('.rosa-product-detail__quote-form[data-rosa-quote-item]').first();
  await assertTouchTarget(mobileQuoteForm.locator('[data-rosa-add-to-quote]'), 'Product EN mobile Add to Quote');
  await assertTouchTarget(mobileQuoteForm.locator('input[data-rosa-quote-quantity]'), 'Product EN mobile quote quantity');

  const storedRaw = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  assert.ok(storedRaw, 'Product Detail quote state must remain persisted');
  assertQuoteState(JSON.parse(storedRaw), 'persisted Product Detail quote state');
  assert.deepEqual(forbiddenRequests, [], 'Product Detail Add to Quote interactions must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'Catalogue navigation/Product Detail quote contract must not emit browser errors');

  process.stdout.write('PASS: Home/Shop cards navigate to Product Detail only, while Product Detail retains exact Woo-backed configuration, quantity and Add to Quote behavior without Woo Cart/Checkout/Orders\n');
} finally {
  await context.close();
  await browser.close();
}
