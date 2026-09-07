import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productSlug = 'rosa-foundation-stevens-scissors-regular';

const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') {
  launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}

const forbiddenCommerceRequest = /(?:[?&]wc-ajax=add_to_cart\b|\/wp-json\/wc\/store\/v1\/cart(?:\/|\?|$)|\/wp-json\/wc\/v3\/orders(?:\/|\?|$)|\/cart\/?(?:\?|#|$)|\/checkout\/?(?:\?|#|$))/i;
const forbiddenCommerceUi = '.single_add_to_cart_button, .add_to_cart_button, [name="add-to-cart"], a[href*="/cart/"], a[href*="/checkout/"], .woocommerce-cart-form, .wc-block-cart, .wc-block-checkout';
const forbiddenPricingUi = '.price, .woocommerce-Price-amount, [data-rosa-quote-price], [data-price]';

async function load(page, path, label) {
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForLoadState('networkidle').catch(() => {});
  assert.ok(response, `${label} returned no HTTP response`);
  return response;
}

async function loadQuotePage(page, path, label) {
  const response = await load(page, path, label);
  const surface = page.locator('[data-rosa-quote-request-page]');
  assert.equal(await surface.count(), 1, `${label} must expose exactly one dedicated quotation request page`);
  assert.ok(response.ok(), `${label} must return HTTP 2xx; received ${response.status()}`);
  assert.equal(new URL(page.url()).pathname, path, `${label} must preserve canonical path ${path}`);
  return surface;
}

async function assertTouchTarget(locator, label) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} must be visible`);
  assert.ok(box.width >= 44 && box.height >= 44, `${label} must keep a 44px minimum touch target; got ${box.width}x${box.height}`);
}

async function assertLocalized(locator, locale, label) {
  const text = `${((await locator.textContent()) || '').trim()} ${((await locator.getAttribute('aria-label')) || '').trim()} ${((await locator.getAttribute('placeholder')) || '').trim()}`.trim();
  assert.ok(text.length > 0, `${label} must expose localized copy`);
  if (locale === 'ar') {
    assert.match(text, /[\u0600-\u06ff]/, `${label} must expose Arabic copy`);
  } else {
    assert.match(text, /quote|request|name|email|phone|whatsapp|institution|hospital|country|city|notes|remove|quantity|catalog/i, `${label} must expose English quotation copy`);
  }
}

async function seedTwoConfigurations(page) {
  const response = await load(page, `/product/${productSlug}/`, 'Product EN seed');
  assert.ok(response.ok(), `Product EN seed returned HTTP ${response.status()}`);
  assert.equal(await page.evaluate(() => typeof window.RosaQuoteBasket?.clear), 'function', 'Product EN seed must load RosaQuoteBasket');
  await page.evaluate(() => window.RosaQuoteBasket.clear());

  const productTitle = ((await page.locator('.rosa-product-detail__summary h1').textContent()) || '').trim();
  assert.ok(productTitle.length > 0, 'Product EN seed must expose product title');

  const rows = page.locator('.rosa-product-detail__configuration[data-variation-id]');
  assert.ok(await rows.count() >= 2, 'Batch 10 contract requires at least two representative published configurations');

  const expected = [];
  for (const [index, quantityValue] of [[0, 2], [1, 1]]) {
    const row = rows.nth(index);
    const add = row.locator('[data-rosa-add-to-quote]');
    const quantity = row.locator('input[data-rosa-quote-quantity]');
    assert.equal(await add.count(), 1, `seed configuration ${index + 1} must expose Add to Quote`);
    assert.equal(await quantity.count(), 1, `seed configuration ${index + 1} must expose quantity control`);

    const productId = Number(await add.getAttribute('data-product-id'));
    const variationId = Number(await add.getAttribute('data-variation-id'));
    const sku = ((await add.getAttribute('data-sku')) || '').trim();
    assert.ok(Number.isInteger(productId) && productId > 0, `seed configuration ${index + 1} must expose productId`);
    assert.ok(Number.isInteger(variationId) && variationId > 0, `seed configuration ${index + 1} must expose variationId`);
    assert.ok(sku.length > 0, `seed configuration ${index + 1} must expose exact SKU`);

    await quantity.fill(String(quantityValue));
    await add.click();
    expected.push({ productId, variationId, sku, quantity: quantityValue, title: productTitle });
  }

  await page.waitForFunction(() => window.RosaQuoteBasket?.getState().items.length === 2);
  const state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 2, 'seed must persist two distinct quote lines');
  return expected;
}

async function assertForm(surface, locale, label) {
  const form = surface.locator('form[data-rosa-quote-request-form]');
  assert.equal(await form.count(), 1, `${label} must expose exactly one quotation inquiry form`);

  const fields = [
    { selector: 'input[name="name"]', type: 'text', required: true, autocomplete: 'name', label: 'Name' },
    { selector: 'input[name="email"]', type: 'email', required: true, autocomplete: 'email', label: 'Email' },
    { selector: 'input[name="phone"]', type: 'tel', required: false, autocomplete: 'tel', label: 'WhatsApp/Phone' },
    { selector: 'input[name="institution"]', type: 'text', required: false, autocomplete: null, label: 'Institution/Hospital' },
    { selector: 'input[name="location"]', type: 'text', required: false, autocomplete: null, label: 'Country/City' },
    { selector: 'textarea[name="notes"]', type: null, required: false, autocomplete: null, label: 'Notes' },
  ];

  for (const field of fields) {
    const control = form.locator(field.selector);
    assert.equal(await control.count(), 1, `${label} must expose one ${field.label} field`);
    if (field.type !== null) assert.equal(await control.getAttribute('type'), field.type, `${label} ${field.label} field type mismatch`);
    if (field.required) assert.notEqual(await control.getAttribute('required'), null, `${label} ${field.label} must be required`);
    if (field.autocomplete !== null) assert.equal(await control.getAttribute('autocomplete'), field.autocomplete, `${label} ${field.label} autocomplete mismatch`);
    const id = (await control.getAttribute('id')) || '';
    assert.ok(id.length > 0, `${label} ${field.label} must expose id for label association`);
    assert.equal(await form.locator(`label[for="${id}"]`).count(), 1, `${label} ${field.label} must expose an associated label`);
    await assertLocalized(form.locator(`label[for="${id}"]`), locale, `${label} ${field.label} label`);
    await assertTouchTarget(control, `${label} ${field.label} field`);
  }

  const submit = form.locator('[data-rosa-quote-request-submit]');
  assert.equal(await submit.count(), 1, `${label} must expose exactly one quotation request submit control`);
  assert.equal(await submit.evaluate((node) => node.tagName), 'BUTTON', `${label} submit control must be a button`);
  assert.equal(await submit.getAttribute('type'), 'submit', `${label} submit button must use type=submit`);
  await assertLocalized(submit, locale, `${label} submit button`);
  await assertTouchTarget(submit, `${label} submit button`);
}

async function assertRenderedItems(surface, expected, label) {
  const lines = surface.locator('[data-rosa-quote-request-item]');
  assert.equal(await lines.count(), expected.length, `${label} must render every current quote basket line`);

  for (const item of expected) {
    const line = surface.locator(`[data-rosa-quote-request-item][data-sku="${item.sku}"]`);
    assert.equal(await line.count(), 1, `${label} must render exactly one line for SKU ${item.sku}`);
    assert.equal(await line.getAttribute('data-product-id'), String(item.productId), `${label} ${item.sku} must preserve productId`);
    assert.equal(await line.getAttribute('data-variation-id'), String(item.variationId), `${label} ${item.sku} must preserve variationId`);
    assert.equal(await line.getAttribute('data-sku'), item.sku, `${label} ${item.sku} must preserve SKU identity`);

    const title = ((await line.locator('[data-rosa-quote-request-item-title]').textContent()) || '').trim();
    assert.ok(title.length > 0, `${label} ${item.sku} must render a product title`);
    const skuText = ((await line.locator('[data-rosa-quote-request-item-sku]').textContent()) || '').trim();
    assert.ok(skuText.includes(item.sku), `${label} ${item.sku} must visibly render exact SKU`);
    assert.ok(((await line.locator('[data-rosa-quote-request-item-configuration]').textContent()) || '').trim().length > 0, `${label} ${item.sku} must render configuration detail`);

    const quantity = line.locator('input[data-rosa-quote-request-quantity]');
    assert.equal(await quantity.count(), 1, `${label} ${item.sku} must expose quantity mutation`);
    assert.equal(await quantity.getAttribute('type'), 'number', `${label} ${item.sku} quantity must use type=number`);
    assert.ok(Number(await quantity.getAttribute('min')) >= 1, `${label} ${item.sku} quantity must enforce minimum 1`);
    assert.equal(Number(await quantity.inputValue()), item.quantity, `${label} ${item.sku} quantity must match basket state`);
    await assertTouchTarget(quantity, `${label} ${item.sku} quantity`);

    const remove = line.locator('[data-rosa-quote-request-remove]');
    assert.equal(await remove.count(), 1, `${label} ${item.sku} must expose one remove control`);
    assert.equal(await remove.evaluate((node) => node.tagName), 'BUTTON', `${label} ${item.sku} remove control must be a button`);
    assert.equal(await remove.getAttribute('type'), 'button', `${label} ${item.sku} remove control must use type=button`);
    await assertTouchTarget(remove, `${label} ${item.sku} remove control`);
  }
}

function assertNoPricingKeys(value, path = 'state') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoPricingKeys(entry, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    assert.ok(!/(?:price|subtotal|amount|currency|tax|shipping|cart|checkout|order)/i.test(key), `${path}.${key} must not introduce ecommerce/pricing state`);
    assertNoPricingKeys(nested, `${path}.${key}`);
  }
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
  const seeded = await seedTwoConfigurations(page);

  let surface = await loadQuotePage(page, '/quote-request/', 'Quote Request EN');
  assert.equal(await page.locator('html').getAttribute('dir'), 'ltr', 'Quote Request EN must remain LTR');
  assert.equal(await surface.locator(forbiddenCommerceUi).count(), 0, 'Quote Request EN must not expose Woo Cart/Checkout UI');
  assert.equal(await surface.locator(forbiddenPricingUi).count(), 0, 'Quote Request EN must not expose pricing UI');
  await assertLocalized(surface.locator('[data-rosa-quote-request-title]'), 'en', 'Quote Request EN title');
  await assertRenderedItems(surface, seeded, 'Quote Request EN');
  await assertForm(surface, 'en', 'Quote Request EN');

  const firstSku = seeded[0].sku;
  const secondSku = seeded[1].sku;
  const firstLine = surface.locator(`[data-rosa-quote-request-item][data-sku="${firstSku}"]`);
  const firstQuantity = firstLine.locator('input[data-rosa-quote-request-quantity]');
  await firstQuantity.fill('5');
  await firstQuantity.blur();
  await page.waitForFunction((sku) => window.RosaQuoteBasket?.getState().items.find((entry) => entry.sku === sku)?.quantity === 5, firstSku);
  assert.equal(Number(await firstQuantity.inputValue()), 5, 'Quote Request EN quantity mutation must remain rendered in-page');

  const secondLine = surface.locator(`[data-rosa-quote-request-item][data-sku="${secondSku}"]`);
  await secondLine.locator('[data-rosa-quote-request-remove]').click();
  await page.waitForFunction((sku) => !window.RosaQuoteBasket?.getState().items.some((entry) => entry.sku === sku), secondSku);
  assert.equal(await surface.locator('[data-rosa-quote-request-item]').count(), 1, 'Quote Request EN removal must update page immediately without navigation');

  let state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 1, 'Quote Request EN must keep one basket line after removal');
  assert.equal(state.items[0].sku, firstSku, 'Quote Request EN must preserve remaining SKU');
  assert.equal(state.items[0].quantity, 5, 'Quote Request EN must preserve mutated quantity');
  assertNoPricingKeys(state);

  const pair = page.locator('.rosa-preview-language');
  assert.equal(await pair.count(), 1, 'Quote Request EN must expose one language pair control');
  const pairHref = await pair.getAttribute('href');
  assert.ok(pairHref, 'Quote Request EN language pair must expose href');
  assert.equal(new URL(pairHref, page.url()).pathname, '/ar/quote-request/', 'Quote Request EN language pair must target /ar/quote-request/');

  surface = await loadQuotePage(page, '/ar/quote-request/', 'Quote Request AR');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Quote Request AR must use RTL');
  await assertLocalized(surface.locator('[data-rosa-quote-request-title]'), 'ar', 'Quote Request AR title');
  assert.equal(await surface.locator('[data-rosa-quote-request-item]').count(), 1, 'Quote Request AR must preserve current basket lines across locale navigation');
  assert.equal(await surface.locator(`[data-rosa-quote-request-item][data-sku="${firstSku}"]`).count(), 1, 'Quote Request AR must preserve exact remaining SKU');
  await assertForm(surface, 'ar', 'Quote Request AR');
  assert.equal(await surface.locator(forbiddenCommerceUi).count(), 0, 'Quote Request AR must not expose Woo Cart/Checkout UI');
  assert.equal(await surface.locator(forbiddenPricingUi).count(), 0, 'Quote Request AR must not expose pricing UI');

  await page.evaluate(() => window.RosaQuoteBasket.clear());
  await page.waitForFunction(() => window.RosaQuoteBasket?.getState().items.length === 0);
  const emptyAr = surface.locator('[data-rosa-quote-request-empty]');
  assert.equal(await emptyAr.count(), 1, 'Quote Request AR must expose one empty state');
  await emptyAr.waitFor({ state: 'visible', timeout: 5_000 });
  await assertLocalized(emptyAr, 'ar', 'Quote Request AR empty state');
  assert.equal(await surface.locator('[data-rosa-quote-request-item]').count(), 0, 'Quote Request AR empty state must replace selected item lines');
  const emptyArCatalog = emptyAr.locator('a[data-rosa-quote-request-catalog-link]');
  assert.equal(await emptyArCatalog.count(), 1, 'Quote Request AR empty state must expose catalogue CTA');
  assert.equal(new URL((await emptyArCatalog.getAttribute('href')) || '', page.url()).pathname, '/ar/shop/', 'Quote Request AR empty CTA must target Arabic catalogue');

  surface = await loadQuotePage(page, '/quote-request/', 'Quote Request EN empty');
  const emptyEn = surface.locator('[data-rosa-quote-request-empty]');
  assert.equal(await emptyEn.count(), 1, 'Quote Request EN must expose one empty state');
  await emptyEn.waitFor({ state: 'visible', timeout: 5_000 });
  await assertLocalized(emptyEn, 'en', 'Quote Request EN empty state');
  const emptyEnCatalog = emptyEn.locator('a[data-rosa-quote-request-catalog-link]');
  assert.equal(await emptyEnCatalog.count(), 1, 'Quote Request EN empty state must expose catalogue CTA');
  assert.equal(new URL((await emptyEnCatalog.getAttribute('href')) || '', page.url()).pathname, '/shop/', 'Quote Request EN empty CTA must target catalogue');

  await page.setViewportSize({ width: 390, height: 844 });
  surface = await loadQuotePage(page, '/quote-request/', 'Quote Request EN mobile');
  await assertTouchTarget(surface.locator('input[name="name"]'), 'Quote Request EN mobile Name');
  await assertTouchTarget(surface.locator('input[name="email"]'), 'Quote Request EN mobile Email');
  await assertTouchTarget(surface.locator('[data-rosa-quote-request-submit]'), 'Quote Request EN mobile submit');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `Quote Request EN mobile must not create horizontal overflow; got ${overflow}px`);

  assert.deepEqual(forbiddenRequests, [], 'quotation request page must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'quotation request page contract must not emit browser errors');

  process.stdout.write('PASS: EN/AR quotation request pages review and mutate persistent Woo-backed quote lines, expose accessible inquiry fields and localized empty states, and remain independent of Woo Cart/Checkout/Orders and pricing state\n');
} finally {
  await context.close();
  await browser.close();
}
