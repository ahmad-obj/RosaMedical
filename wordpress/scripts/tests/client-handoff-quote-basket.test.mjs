import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const storageKey = 'rosa_quote_basket_v1';

const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') {
  launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}

const forbiddenCommerceRequest = /(?:[?&]wc-ajax=add_to_cart\b|\/wp-json\/wc\/store\/v1\/cart(?:\/|\?|$)|\/wp-json\/wc\/v3\/orders(?:\/|\?|$)|\/cart\/?(?:\?|#|$)|\/checkout\/?(?:\?|#|$))/i;
const forbiddenStateKey = /(?:^|_)(?:price|subtotal|amount|currency|tax|shipping|cart|checkout|order)(?:$|_)/i;

const itemA = { productId: 910001, variationId: 0, sku: 'ROSA-QB-A', quantity: 1 };
const itemB = { productId: 910001, variationId: 910002, sku: 'ROSA-QB-B', quantity: 1 };
const itemC = { productId: 920001, variationId: 0, sku: 'ROSA-QB-C', quantity: 2 };
const invalidItem = { productId: 930001, variationId: 930002, sku: 'ROSA-QB-INVALID', quantity: 1 };

const identityOf = ({ productId, variationId, sku }) => ({ productId, variationId, sku });

function assertStateShape(state, label) {
  assert.ok(state && typeof state === 'object' && !Array.isArray(state), `${label} state must be an object`);
  assert.equal(state.version, 1, `${label} state version must be 1`);
  assert.ok(Array.isArray(state.items), `${label} state items must be an array`);

  for (const item of state.items) {
    assert.ok(Number.isInteger(item.productId) && item.productId > 0, `${label} productId must be a positive integer`);
    assert.ok(Number.isInteger(item.variationId) && item.variationId >= 0, `${label} variationId must be a non-negative integer`);
    assert.equal(typeof item.sku, 'string', `${label} SKU must be a string`);
    assert.ok(item.sku.trim().length > 0, `${label} SKU must not be empty`);
    assert.ok(Number.isInteger(item.quantity) && item.quantity > 0, `${label} quantity must be a positive integer`);
  }
}

function assertNoCommerceState(value, path = 'state') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoCommerceState(entry, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;

  for (const [key, nested] of Object.entries(value)) {
    assert.ok(!forbiddenStateKey.test(key), `${path}.${key} must not store ecommerce/cart/pricing state`);
    assertNoCommerceState(nested, `${path}.${key}`);
  }
}

function itemBySku(state, sku) {
  return state.items.find((item) => item.sku === sku);
}

async function load(page, path, label) {
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${label} returned HTTP ${response?.status() ?? 'no response'}`);
}

const browser = await chromium.launch(launchOptions);
const context = await browser.newContext();
const page = await context.newPage();
const browserErrors = [];
const forbiddenRequests = [];

page.on('pageerror', (error) => browserErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') browserErrors.push(message.text());
});
page.on('request', (request) => {
  if (forbiddenCommerceRequest.test(request.url())) forbiddenRequests.push(request.url());
});

try {
  await load(page, '/', 'Home EN');

  const apiContract = await page.evaluate(() => {
    const api = window.RosaQuoteBasket;
    return {
      exists: Boolean(api && typeof api === 'object'),
      storageKey: api?.storageKey ?? null,
      version: api?.version ?? null,
      methods: ['getState', 'add', 'remove', 'setQuantity', 'clear', 'revalidate']
        .filter((method) => typeof api?.[method] === 'function'),
      scriptCount: Array.from(document.scripts)
        .filter((script) => /\/assets\/js\/quote-basket\.js(?:\?|$)/.test(script.src)).length,
    };
  });

  assert.equal(apiContract.exists, true, 'Home EN must expose shared window.RosaQuoteBasket quote-state API');
  assert.equal(apiContract.scriptCount, 1, 'Home EN must enqueue exactly one shared quote-basket.js asset');
  assert.equal(apiContract.storageKey, storageKey, `quote basket must use versioned storage key ${storageKey}`);
  assert.equal(apiContract.version, 1, 'quote basket API version must be 1');
  assert.deepEqual(
    apiContract.methods.sort(),
    ['add', 'clear', 'getState', 'remove', 'revalidate', 'setQuantity'].sort(),
    'quote basket API must expose the required state operations',
  );

  await page.evaluate(() => window.RosaQuoteBasket.clear());
  let state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assertStateShape(state, 'empty basket');
  assert.equal(state.items.length, 0, 'clear() must produce an empty quote basket');

  await page.evaluate((item) => window.RosaQuoteBasket.add(item), itemA);
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 1, 'adding one configuration must create one basket entry');
  assert.equal(itemBySku(state, itemA.sku)?.quantity, 1, 'first add must preserve requested quantity');

  await page.evaluate((item) => window.RosaQuoteBasket.add(item), { ...itemA, quantity: 2 });
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 1, 're-adding the same configuration must not create a duplicate entry');
  assert.equal(itemBySku(state, itemA.sku)?.quantity, 3, 're-adding the same configuration must increment quantity');

  await page.evaluate((items) => {
    for (const item of items) window.RosaQuoteBasket.add(item);
  }, [itemB, itemC]);
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assertStateShape(state, 'multi-item basket');
  assert.equal(state.items.length, 3, 'basket must support multiple products/configurations');
  assert.equal(itemBySku(state, itemB.sku)?.variationId, itemB.variationId, 'distinct variation/configuration identity must be preserved');
  assert.equal(itemBySku(state, itemC.sku)?.productId, itemC.productId, 'distinct product identity must be preserved');

  await page.evaluate(({ identity, quantity }) => {
    window.RosaQuoteBasket.setQuantity(identity, quantity);
  }, { identity: identityOf(itemB), quantity: 4 });
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(itemBySku(state, itemB.sku)?.quantity, 4, 'setQuantity() must update the selected configuration quantity');
  assert.equal(state.items.length, 3, 'setQuantity() must not duplicate basket entries');

  const rawStored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
  assert.ok(rawStored, `quote basket must persist state in ${storageKey}`);
  const storedState = JSON.parse(rawStored);
  assertStateShape(storedState, 'persisted basket');
  assertNoCommerceState(storedState);

  await load(page, '/ar/', 'Home AR');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Arabic persistence probe must land in RTL mode');
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 3, 'quote basket must persist across navigation and locale changes');
  assert.equal(itemBySku(state, itemB.sku)?.quantity, 4, 'quote quantity must persist across locale changes');

  await page.evaluate((identity) => window.RosaQuoteBasket.remove(identity), identityOf(itemA));
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 2, 'remove() must delete exactly one selected configuration');
  assert.equal(itemBySku(state, itemA.sku), undefined, 'removed configuration must no longer exist');

  await page.evaluate((item) => window.RosaQuoteBasket.add(item), invalidItem);
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 3, 'pre-revalidation basket must contain valid, unpublished and invalid selections');

  await page.evaluate((canonical) => window.RosaQuoteBasket.revalidate(canonical), [
    { ...identityOf(itemB), published: true },
    { ...identityOf(itemC), published: false },
  ]);
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.equal(state.items.length, 1, 'canonical revalidation must drop invalid and unpublished selections');
  assert.equal(itemBySku(state, itemB.sku)?.quantity, 4, 'canonical revalidation must preserve quantity for valid selections');
  assert.equal(itemBySku(state, itemC.sku), undefined, 'canonical revalidation must drop unpublished selections');
  assert.equal(itemBySku(state, invalidItem.sku), undefined, 'canonical revalidation must drop selections absent from canonical data');

  await page.evaluate(() => window.RosaQuoteBasket.clear());
  state = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assertStateShape(state, 'cleared basket');
  assert.equal(state.items.length, 0, 'clear() must remove every quotation selection');

  const clearedStored = JSON.parse(await page.evaluate((key) => localStorage.getItem(key), storageKey));
  assert.equal(clearedStored.version, 1, 'cleared persisted basket must retain schema version');
  assert.deepEqual(clearedStored.items, [], 'cleared persisted basket must retain an empty items array');
  assertNoCommerceState(clearedStored);

  assert.deepEqual(forbiddenRequests, [], 'quotation basket operations must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'quotation basket contract must not emit browser errors');

  process.stdout.write('PASS: versioned quotation-only basket supports multi-item configuration state, deduplication, quantity updates, removal, clearing, EN/AR persistence and canonical revalidation without Woo Cart/Checkout/Orders or pricing state\n');
} finally {
  await context.close();
  await browser.close();
}
