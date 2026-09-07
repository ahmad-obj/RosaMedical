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

async function shopSelectionIdentity(card, label) {
  const add = card.locator('[data-rosa-add-to-quote]');
  const selector = card.locator('[data-rosa-quote-configuration]');
  const quantity = card.locator('input[data-rosa-quote-quantity]');

  assert.equal(await add.count(), 1, `${label} must expose exactly one Add to Quote control`);
  assert.equal(await add.evaluate((node) => node.tagName), 'BUTTON', `${label} Add to Quote control must be a button, not navigation`);
  assert.equal(await quantity.count(), 1, `${label} must expose one quotation quantity control`);
  assert.equal(await quantity.getAttribute('type'), 'number', `${label} quantity control must use type=number`);
  assert.ok(Number(await quantity.getAttribute('min')) >= 1, `${label} quantity control must enforce a minimum of 1`);

  const productId = positiveInteger(await add.getAttribute('data-product-id'), `${label} Add to Quote productId`);
  let variationId = 0;
  let sku = '';

  if (await selector.count()) {
    assert.equal(await selector.count(), 1, `${label} must expose at most one configuration selector`);
    const optionCount = await selector.locator('option').count();
    assert.ok(optionCount > 0, `${label} configuration selector must expose at least one exact Woo configuration`);
    const selected = selector.locator('option:checked');
    variationId = positiveInteger(await selected.getAttribute('data-variation-id'), `${label} selected variationId`);
    sku = ((await selected.getAttribute('data-sku')) || '').trim();
  } else {
    variationId = nonNegativeInteger((await add.getAttribute('data-variation-id')) || '0', `${label} Add to Quote variationId`);
    sku = ((await add.getAttribute('data-sku')) || '').trim();
  }

  assert.ok(sku.length > 0, `${label} must expose an exact SKU before adding to the quote`);
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
  await load(page, '/shop/', 'Shop EN');
  assert.equal(await page.evaluate(() => typeof window.RosaQuoteBasket?.add), 'function', 'Shop EN must load the shared RosaQuoteBasket.add API');
  await page.evaluate(() => window.RosaQuoteBasket.clear());

  const realCards = page.locator('.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)');
  assert.ok(await realCards.count() > 0, 'Shop EN must expose at least one real Woo product card');

  const familyCards = page.locator('.rosa-preview-shop-grid .rosa-preview-product--family');
  if (await familyCards.count()) {
    assert.equal(
      await familyCards.locator('[data-rosa-add-to-quote]').count(),
      0,
      'Shop family-navigation placeholder cards must never expose Add to Quote controls',
    );
  }

  const firstCard = realCards.first();
  assert.equal(
    await firstCard.locator('[data-rosa-add-to-quote]').count(),
    1,
    'Shop EN first real product card must expose exactly one Add to Quote control',
  );
  assert.ok(await firstCard.locator('.rosa-preview-product__action[href]').count() > 0, 'Shop EN must preserve View details navigation beside Add to Quote');
  assert.equal(await page.locator(forbiddenCommerceUi).count(), 0, 'Shop EN must not expose Woo Add to Cart, Cart or Checkout UI');

  const shopSelection = await shopSelectionIdentity(firstCard, 'Shop EN first real product card');
  await shopSelection.quantity.fill('2');
  assert.equal(await readCount(page, 'Shop EN'), 0, 'Shop EN quote count must begin at zero after clear()');
  await shopSelection.add.click();
  await page.waitForFunction(() => window.RosaQuoteBasket.getState().items.length === 1);

  let state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assertQuoteState(state, 'Shop EN after first add');
  assert.equal(state.items.length, 1, 'Shop EN first Add to Quote action must create one selected line');
  assert.deepEqual(
    { productId: state.items[0].productId, variationId: state.items[0].variationId, sku: state.items[0].sku, quantity: state.items[0].quantity },
    { productId: shopSelection.productId, variationId: shopSelection.variationId, sku: shopSelection.sku, quantity: 2 },
    'Shop EN must add the exact selected Woo product/configuration/SKU and quantity',
  );
  assert.equal(await readCount(page, 'Shop EN after first add'), 2, 'Shop EN quote count must update to total selected quantity');
  await assertFeedback(page, 'en', 'Shop EN');

  await shopSelection.quantity.fill('1');
  await shopSelection.add.click();
  await page.waitForFunction(() => window.RosaQuoteBasket.getState().items[0]?.quantity === 3);
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 1, 're-adding the same Shop configuration must not duplicate the quote line');
  assert.equal(state.items[0].quantity, 3, 're-adding the same Shop configuration must increment quantity');
  assert.equal(await readCount(page, 'Shop EN after duplicate add'), 3, 'quote count must reflect the incremented quantity');

  await load(page, '/ar/shop/', 'Shop AR');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Shop AR must remain RTL');
  assert.equal(await readCount(page, 'Shop AR'), 3, 'Shop AR must preserve quote-count state from English navigation');
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items[0]?.quantity, 3, 'Shop AR must preserve the existing quote basket state');
  const arFirstCard = page.locator('.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)').first();
  const shopArAddText = ((await arFirstCard.locator('[data-rosa-add-to-quote]').textContent()) || '').trim();
  assert.match(shopArAddText, /[\u0600-\u06ff]/, 'Shop AR Add to Quote control must expose Arabic copy');

  await load(page, `/product/${productSlug}/`, 'Product EN');
  await page.evaluate(() => window.RosaQuoteBasket.clear());
  assert.equal(await page.locator(forbiddenCommerceUi).count(), 0, 'Product EN must not expose Woo Add to Cart, Cart or Checkout UI');

  const configurations = page.locator('.rosa-product-detail__configuration[data-variation-id]');
  assert.ok(await configurations.count() >= 2, 'representative Product Detail must expose at least two exact configurations for multi-item quote testing');

  const selectedConfigurations = [];
  for (const [index, quantityValue] of [[0, 2], [1, 1]]) {
    const configuration = configurations.nth(index);
    const variationId = positiveInteger(await configuration.getAttribute('data-variation-id'), `Product EN configuration ${index + 1} variationId`);
    const add = configuration.locator('[data-rosa-add-to-quote]');
    const quantity = configuration.locator('input[data-rosa-quote-quantity]');
    assert.equal(await add.count(), 1, `Product EN configuration ${index + 1} must expose one Add to Quote control`);
    assert.equal(await quantity.count(), 1, `Product EN configuration ${index + 1} must expose one quantity control`);
    const productId = positiveInteger(await add.getAttribute('data-product-id'), `Product EN configuration ${index + 1} productId`);
    assert.equal(positiveInteger(await add.getAttribute('data-variation-id'), `Product EN configuration ${index + 1} button variationId`), variationId, `Product EN configuration ${index + 1} button must preserve exact variation identity`);
    const sku = ((await add.getAttribute('data-sku')) || '').trim();
    assert.ok(sku.length > 0, `Product EN configuration ${index + 1} Add to Quote control must expose exact SKU`);
    const renderedSku = ((await configuration.locator('dl dd').first().textContent()) || '').trim();
    assert.equal(sku, renderedSku, `Product EN configuration ${index + 1} Add to Quote SKU must match rendered Woo SKU`);

    await quantity.fill(String(quantityValue));
    await add.click();
    selectedConfigurations.push({ productId, variationId, sku, quantity: quantityValue });
  }

  await page.waitForFunction(() => window.RosaQuoteBasket.getState().items.length === 2);
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
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
  const arConfiguration = page.locator('.rosa-product-detail__configuration[data-variation-id]').first();
  const arAdd = arConfiguration.locator('[data-rosa-add-to-quote]');
  const productArAddText = ((await arAdd.textContent()) || '').trim();
  assert.match(productArAddText, /[\u0600-\u06ff]/, 'Product AR Add to Quote control must expose Arabic copy');
  await arAdd.click();
  await assertFeedback(page, 'ar', 'Product AR');

  await page.setViewportSize({ width: 390, height: 844 });
  await load(page, '/shop/', 'Shop EN mobile');
  const mobileCard = page.locator('.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)').first();
  await assertTouchTarget(mobileCard.locator('[data-rosa-add-to-quote]'), 'Shop EN mobile Add to Quote');
  await assertTouchTarget(mobileCard.locator('input[data-rosa-quote-quantity]'), 'Shop EN mobile quote quantity');

  const storedState = JSON.parse(await page.evaluate((key) => localStorage.getItem(key), storageKey));
  assertQuoteState(storedState, 'persisted Batch 8 quote state');
  assert.deepEqual(forbiddenRequests, [], 'Add to Quote interactions must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'Add to Quote interaction contract must not emit browser errors');

  process.stdout.write('PASS: Shop/Product EN/AR expose exact Woo-backed Add to Quote selection, quantity, live count and accessible feedback while preserving multi-configuration state without Woo Cart/Checkout/Orders or pricing dependencies\n');
} finally {
  await context.close();
  await browser.close();
}
