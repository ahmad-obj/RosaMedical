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
const forbiddenCommerceUi = '.single_add_to_cart_button, .add_to_cart_button, [name="add-to-cart"], a[href*="/cart/"], a[href*="/checkout/"]';

const shellRoutes = [
  { label: 'Home EN', path: '/', locale: 'en' },
  { label: 'About EN', path: '/about/', locale: 'en' },
  { label: 'Contact EN', path: '/contact/', locale: 'en' },
  { label: 'Shop EN', path: '/shop/', locale: 'en' },
  { label: 'Home AR', path: '/ar/', locale: 'ar' },
  { label: 'About AR', path: '/ar/about/', locale: 'ar' },
  { label: 'Contact AR', path: '/ar/contact/', locale: 'ar' },
  { label: 'Shop AR', path: '/ar/shop/', locale: 'ar' },
];

async function load(page, path, label) {
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${label} returned HTTP ${response?.status() ?? 'no response'}`);
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function assertTouchTarget(locator, label) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} must be visible`);
  assert.ok(box.width >= 44 && box.height >= 44, `${label} must keep a 44px minimum touch target; got ${box.width}x${box.height}`);
}

async function reviewCount(page, label) {
  const count = page.locator('[data-rosa-quote-review-trigger] [data-rosa-quote-review-count]');
  assert.equal(await count.count(), 1, `${label} review trigger must expose exactly one live count`);
  const text = ((await count.textContent()) || '').trim();
  const match = text.match(/\d+/);
  assert.ok(match, `${label} review count must expose a number; got ${JSON.stringify(text)}`);
  return Number(match[0]);
}

async function assertLocalized(locator, locale, label) {
  const text = `${((await locator.textContent()) || '').trim()} ${((await locator.getAttribute('aria-label')) || '').trim()}`.trim();
  assert.ok(text.length > 0, `${label} must expose accessible localized copy`);
  if (locale === 'ar') {
    assert.match(text, /[\u0600-\u06ff]/, `${label} must expose Arabic copy`);
  } else {
    assert.match(text, /quote|request|review|remove|close|selected|empty/i, `${label} must expose English quotation copy`);
  }
}

async function assertSharedShell(page, route) {
  const trigger = page.locator('[data-rosa-quote-review-trigger]');
  assert.equal(await trigger.count(), 1, `${route.label} must expose exactly one persistent quotation review trigger`);
  assert.equal(await trigger.evaluate((node) => node.tagName), 'BUTTON', `${route.label} review trigger must be a button`);
  assert.equal(await trigger.getAttribute('type'), 'button', `${route.label} review trigger must use type=button`);
  await assertTouchTarget(trigger, `${route.label} review trigger`);
  await assertLocalized(trigger, route.locale, `${route.label} review trigger`);

  const controlsId = (await trigger.getAttribute('aria-controls')) || '';
  assert.ok(controlsId.length > 0, `${route.label} review trigger must expose aria-controls`);
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false', `${route.label} review trigger must begin collapsed`);

  const drawer = page.locator('[data-rosa-quote-drawer]');
  assert.equal(await drawer.count(), 1, `${route.label} must expose exactly one quotation review drawer`);
  assert.equal(await drawer.getAttribute('id'), controlsId, `${route.label} trigger aria-controls must target the drawer`);
  assert.equal(await drawer.getAttribute('role'), 'dialog', `${route.label} drawer must expose role=dialog`);
  assert.equal(await drawer.getAttribute('aria-modal'), 'true', `${route.label} drawer must expose aria-modal=true`);
  assert.ok((await drawer.getAttribute('aria-label')) || (await drawer.getAttribute('aria-labelledby')), `${route.label} drawer must have an accessible name`);
  assert.equal(await drawer.isVisible(), false, `${route.label} drawer must begin closed`);
  assert.equal(await drawer.locator(forbiddenCommerceUi).count(), 0, `${route.label} drawer must not expose Woo Cart/Checkout UI`);
  assert.ok(await reviewCount(page, route.label) >= 0, `${route.label} review count must be non-negative`);
}

async function openDrawer(page, label) {
  const trigger = page.locator('[data-rosa-quote-review-trigger]');
  const drawer = page.locator('[data-rosa-quote-drawer]');
  const beforeUrl = page.url();
  await trigger.click();
  await drawer.waitFor({ state: 'visible', timeout: 5_000 });
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true', `${label} trigger must expose aria-expanded=true while open`);
  assert.equal(page.url(), beforeUrl, `${label} review trigger must open without navigation`);
  return drawer;
}

async function addFirstShopSelection(page, quantityValue) {
  const card = page.locator('.rosa-preview-shop-grid .rosa-preview-product:not(.rosa-preview-product--family)').first();
  assert.equal(await card.count(), 1, 'Shop must expose a real Woo product card for review testing');
  const title = ((await card.locator('h3').textContent()) || '').trim();
  const button = card.locator('[data-rosa-add-to-quote]');
  const quantity = card.locator('input[data-rosa-quote-quantity]');
  const selector = card.locator('[data-rosa-quote-configuration]');
  assert.equal(await button.count(), 1, 'Shop selection must expose Add to Quote');
  assert.equal(await quantity.count(), 1, 'Shop selection must expose quantity');

  let sku = ((await button.getAttribute('data-sku')) || '').trim();
  let configuration = '';
  if (await selector.count()) {
    const selected = selector.locator('option:checked');
    sku = ((await selected.getAttribute('data-sku')) || '').trim();
    configuration = ((await selected.textContent()) || '').trim();
  }
  assert.ok(title.length > 0, 'Shop selected item must expose product title');
  assert.ok(sku.length > 0, 'Shop selected item must expose exact SKU');

  await quantity.fill(String(quantityValue));
  await button.click();
  await page.waitForFunction(({ sku: expectedSku, quantity: expectedQuantity }) => {
    const item = window.RosaQuoteBasket?.getState().items.find((entry) => entry.sku === expectedSku);
    return item?.quantity === expectedQuantity;
  }, { sku, quantity: quantityValue });

  return { title, sku, configuration, quantity: quantityValue };
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
  await load(page, '/', 'Home EN');
  assert.equal(await page.evaluate(() => typeof window.RosaQuoteBasket?.clear), 'function', 'Home EN must load RosaQuoteBasket');
  await page.evaluate(() => window.RosaQuoteBasket.clear());

  for (const route of shellRoutes) {
    await load(page, route.path, route.label);
    if (route.locale === 'ar') assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', `${route.label} must remain RTL`);
    await assertSharedShell(page, route);
  }

  await load(page, '/', 'Home EN keyboard');
  const homeTrigger = page.locator('[data-rosa-quote-review-trigger]');
  const homeDrawer = page.locator('[data-rosa-quote-drawer]');
  await homeTrigger.focus();
  await homeTrigger.press('Enter');
  await homeDrawer.waitFor({ state: 'visible', timeout: 5_000 });
  assert.equal(await page.evaluate(() => {
    const drawer = document.querySelector('[data-rosa-quote-drawer]');
    return Boolean(drawer && drawer.contains(document.activeElement));
  }), true, 'opening the drawer with keyboard must move focus into it');
  const homeClose = homeDrawer.locator('[data-rosa-quote-drawer-close]');
  assert.equal(await homeClose.count(), 1, 'Home EN drawer must expose exactly one close button');
  await assertTouchTarget(homeClose, 'Home EN drawer close button');
  await page.keyboard.press('Escape');
  await homeDrawer.waitFor({ state: 'hidden', timeout: 5_000 });
  assert.equal(await homeTrigger.getAttribute('aria-expanded'), 'false', 'Escape must collapse the drawer');
  assert.equal(await homeTrigger.evaluate((node) => node === document.activeElement), true, 'Escape must return focus to the review trigger');

  await load(page, '/shop/', 'Shop EN review');
  await page.evaluate(() => window.RosaQuoteBasket.clear());
  const shopSelection = await addFirstShopSelection(page, 2);
  assert.equal(await reviewCount(page, 'Shop EN after add'), 2, 'Shop review trigger count must update after Add to Quote');

  let drawer = await openDrawer(page, 'Shop EN');
  const drawerTitle = drawer.locator('[data-rosa-quote-drawer-title]');
  assert.equal(await drawerTitle.count(), 1, 'Shop EN drawer must expose one review title');
  await assertLocalized(drawerTitle, 'en', 'Shop EN drawer title');

  const items = drawer.locator('[data-rosa-quote-drawer-item]');
  assert.equal(await items.count(), 1, 'Shop EN drawer must render one selected quote line');
  const line = items.first();
  assert.equal(await line.getAttribute('data-sku'), shopSelection.sku, 'Shop EN drawer line must preserve exact SKU identity');
  assert.equal(((await line.locator('[data-rosa-quote-item-title]').textContent()) || '').trim(), shopSelection.title, 'Shop EN drawer must render selected product title');
  assert.match(((await line.locator('[data-rosa-quote-item-sku]').textContent()) || '').trim(), new RegExp(shopSelection.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'Shop EN drawer must render exact SKU');
  assert.ok(((await line.locator('[data-rosa-quote-item-configuration]').textContent()) || '').trim().length > 0, 'Shop EN drawer must render configuration detail');

  const drawerQuantity = line.locator('input[data-rosa-quote-drawer-quantity]');
  assert.equal(await drawerQuantity.count(), 1, 'Shop EN drawer line must expose quantity mutation control');
  assert.equal(await drawerQuantity.getAttribute('type'), 'number', 'Shop EN drawer quantity must use type=number');
  assert.ok(Number(await drawerQuantity.getAttribute('min')) >= 1, 'Shop EN drawer quantity must enforce minimum 1');
  assert.equal(Number(await drawerQuantity.inputValue()), 2, 'Shop EN drawer must initialize selected quantity');
  await assertTouchTarget(drawerQuantity, 'Shop EN drawer quantity');
  await drawerQuantity.fill('4');
  await drawerQuantity.blur();
  await page.waitForFunction((sku) => window.RosaQuoteBasket?.getState().items.find((entry) => entry.sku === sku)?.quantity === 4, shopSelection.sku);
  assert.equal(await reviewCount(page, 'Shop EN after quantity mutation'), 4, 'drawer quantity mutation must update live review count');

  const remove = line.locator('[data-rosa-quote-remove]');
  assert.equal(await remove.count(), 1, 'Shop EN drawer line must expose one remove control');
  assert.equal(await remove.evaluate((node) => node.tagName), 'BUTTON', 'Shop EN remove control must be a button');
  await assertLocalized(remove, 'en', 'Shop EN remove control');
  await assertTouchTarget(remove, 'Shop EN remove control');
  await remove.click();
  await page.waitForFunction(() => window.RosaQuoteBasket?.getState().items.length === 0);
  assert.equal(await items.count(), 0, 'removing a line must update the open drawer immediately');
  assert.equal(await reviewCount(page, 'Shop EN after remove'), 0, 'removing a line must update live count to zero');
  const emptyState = drawer.locator('[data-rosa-quote-drawer-empty]');
  assert.equal(await emptyState.count(), 1, 'Shop EN drawer must expose one empty state');
  await emptyState.waitFor({ state: 'visible', timeout: 5_000 });
  await assertLocalized(emptyState, 'en', 'Shop EN empty state');

  const continuation = drawer.locator('[data-rosa-quote-review-continue]');
  if (await continuation.count()) {
    assert.equal(await continuation.count(), 1, 'Shop EN drawer may expose at most one quotation-request continuation');
    const href = await continuation.getAttribute('href');
    assert.ok(href, 'Shop EN continuation must expose href');
    assert.equal(new URL(href, page.url()).pathname, '/quote-request/', 'Shop EN continuation must target /quote-request/');
  }
  await page.locator('[data-rosa-quote-drawer-close]').click();
  await drawer.waitFor({ state: 'hidden', timeout: 5_000 });

  await load(page, `/product/${productSlug}/`, 'Product EN review');
  await page.evaluate(() => window.RosaQuoteBasket.clear());
  const productTitle = ((await page.locator('.rosa-product-detail__summary h1').textContent()) || '').trim();
  const configurations = page.locator('.rosa-product-detail__configuration[data-variation-id]');
  assert.ok(await configurations.count() >= 2, 'Product EN drawer contract requires at least two representative configurations');
  const expectedSelections = [];
  for (const [index, quantityValue] of [[0, 2], [1, 1]]) {
    const row = configurations.nth(index);
    const add = row.locator('[data-rosa-add-to-quote]');
    const quantity = row.locator('input[data-rosa-quote-quantity]');
    const sku = ((await add.getAttribute('data-sku')) || '').trim();
    assert.ok(sku.length > 0, `Product EN configuration ${index + 1} must expose exact SKU`);
    await quantity.fill(String(quantityValue));
    await add.click();
    expectedSelections.push({ sku, quantity: quantityValue });
  }
  await page.waitForFunction(() => window.RosaQuoteBasket?.getState().items.length === 2);
  assert.equal(await reviewCount(page, 'Product EN multi-item review'), 3, 'Product EN review count must total quantities across configurations');

  drawer = await openDrawer(page, 'Product EN');
  const productLines = drawer.locator('[data-rosa-quote-drawer-item]');
  assert.equal(await productLines.count(), 2, 'Product EN drawer must render both selected configurations');
  for (const expected of expectedSelections) {
    const matching = productLines.filter({ hasText: expected.sku });
    assert.equal(await matching.count(), 1, `Product EN drawer must render exactly one line for ${expected.sku}`);
    assert.equal(((await matching.locator('[data-rosa-quote-item-title]').textContent()) || '').trim(), productTitle, `Product EN ${expected.sku} line must render product title`);
    assert.ok(((await matching.locator('[data-rosa-quote-item-configuration]').textContent()) || '').trim().length > 0, `Product EN ${expected.sku} line must render configuration detail`);
  }
  const state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assertNoPricingKeys(state);
  assert.equal(await drawer.locator(forbiddenCommerceUi).count(), 0, 'Product EN drawer must remain free of Woo Cart/Checkout UI');

  const languageHref = await page.locator('.rosa-preview-language').getAttribute('href');
  assert.ok(languageHref, 'Product EN must expose Arabic pairing');
  const arabicProduct = new URL(languageHref, page.url());
  await load(page, `${arabicProduct.pathname}${arabicProduct.search}`, 'Product AR review');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Product AR review must remain RTL');
  assert.equal(await reviewCount(page, 'Product AR review'), 3, 'Product AR review trigger must preserve basket quantity across locale navigation');
  drawer = await openDrawer(page, 'Product AR');
  await assertLocalized(drawer.locator('[data-rosa-quote-drawer-title]'), 'ar', 'Product AR drawer title');
  await assertLocalized(drawer.locator('[data-rosa-quote-remove]').first(), 'ar', 'Product AR remove control');
  const arContinuation = drawer.locator('[data-rosa-quote-review-continue]');
  if (await arContinuation.count()) {
    const href = await arContinuation.getAttribute('href');
    assert.ok(href, 'Product AR continuation must expose href');
    assert.equal(new URL(href, page.url()).pathname, '/ar/quote-request/', 'Product AR continuation must target /ar/quote-request/');
  }
  await page.locator('[data-rosa-quote-drawer-close]').click();
  await drawer.waitFor({ state: 'hidden', timeout: 5_000 });

  await page.setViewportSize({ width: 390, height: 844 });
  await load(page, '/shop/', 'Shop EN mobile review');
  const mobileTrigger = page.locator('[data-rosa-quote-review-trigger]');
  await assertTouchTarget(mobileTrigger, 'Shop EN mobile review trigger');
  drawer = await openDrawer(page, 'Shop EN mobile');
  const drawerBox = await drawer.boundingBox();
  assert.ok(drawerBox, 'Shop EN mobile review drawer must be visible');
  assert.ok(drawerBox.width <= 390.5, `Shop EN mobile drawer must fit viewport width; got ${drawerBox.width}`);
  assert.ok(drawerBox.x >= -0.5, `Shop EN mobile drawer must stay inside viewport; got x=${drawerBox.x}`);
  await assertTouchTarget(drawer.locator('[data-rosa-quote-drawer-close]'), 'Shop EN mobile drawer close button');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `Shop EN mobile review surface must not create horizontal overflow; got ${overflow}px`);

  assert.deepEqual(forbiddenRequests, [], 'quotation review interactions must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'quotation review drawer contract must not emit browser errors');

  process.stdout.write('PASS: persistent EN/AR quotation review trigger and accessible drawer review selected Woo-backed lines with title, SKU, configuration, quantity mutation and removal without Woo Cart/Checkout/Orders or pricing state\n');
} finally {
  await context.close();
  await browser.close();
}
