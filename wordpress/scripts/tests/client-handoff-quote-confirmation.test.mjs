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
  assert.ok(response?.ok(), `${label} returned HTTP ${response?.status() ?? 'no response'}`);
}

async function seedSelections(page, quantities = [2, 1]) {
  await load(page, `/product/${productSlug}/`, 'Product EN confirmation seed');
  assert.equal(await page.evaluate(() => typeof window.RosaQuoteBasket?.clear), 'function', 'Product seed must expose RosaQuoteBasket');
  await page.evaluate(() => window.RosaQuoteBasket.clear());

  const rows = page.locator('.rosa-product-detail__configuration[data-variation-id]');
  assert.ok(await rows.count() >= quantities.length, 'Batch 12 contract requires representative published configurations');

  const selected = [];
  for (let index = 0; index < quantities.length; index += 1) {
    const row = rows.nth(index);
    const add = row.locator('[data-rosa-add-to-quote]');
    const quantity = row.locator('input[data-rosa-quote-quantity]');
    const productId = Number(await add.getAttribute('data-product-id'));
    const variationId = Number(await add.getAttribute('data-variation-id'));
    const sku = ((await add.getAttribute('data-sku')) || '').trim();
    assert.ok(productId > 0 && variationId > 0 && sku, `seed configuration ${index + 1} must expose canonical identity`);

    await quantity.fill(String(quantities[index]));
    await add.click();
    selected.push({ productId, variationId, sku, quantity: quantities[index] });
  }

  await page.waitForFunction((expected) => window.RosaQuoteBasket?.getState().items.length === expected, quantities.length);
  return selected;
}

async function quoteSurface(page, path, label) {
  await load(page, path, label);
  const surface = page.locator('[data-rosa-quote-request-page]');
  assert.equal(await surface.count(), 1, `${label} must expose quotation request page`);
  return surface;
}

async function assertConfirmationShell(surface, locale, label) {
  const confirmation = surface.locator('[data-rosa-quote-confirmation]');
  assert.equal(await confirmation.count(), 1, `${label} must expose exactly one post-handoff confirmation region`);
  assert.equal(await confirmation.getAttribute('role'), 'status', `${label} confirmation must use role=status`);
  assert.equal(await confirmation.getAttribute('aria-live'), 'polite', `${label} confirmation must use aria-live=polite`);
  assert.equal(await confirmation.isVisible(), false, `${label} confirmation must begin hidden before a successful handoff`);

  const text = ((await confirmation.textContent()) || '').trim();
  assert.ok(text.length > 0, `${label} confirmation must contain localized copy even while hidden`);
  if (locale === 'ar') {
    assert.match(text, /[\u0600-\u06ff]/, `${label} confirmation copy must be Arabic`);
  } else {
    assert.match(text, /quote|request|email|whatsapp|received|submitted|prepared|opened|sent/i, `${label} confirmation copy must describe quotation handoff`);
  }

  return confirmation;
}

async function fillInquiry(form, suffix = 'EN') {
  await form.locator('input[name="name"]').fill(`Confirmation Test ${suffix}`);
  await form.locator('input[name="email"]').fill(`confirmation.${suffix.toLowerCase()}@example.com`);
  await form.locator('input[name="phone"]').fill('+966555000222');
  await form.locator('input[name="institution"]').fill('Rosa Confirmation Hospital');
  await form.locator('input[name="location"]').fill('Riyadh, Saudi Arabia');
  await form.locator('textarea[name="notes"]').fill('Batch 12 confirmation-state verification.');
}

async function submitAndRead(page, form, endpoint) {
  const responsePromise = page.waitForResponse(
    (response) => response.url() === endpoint.href && response.request().method() === 'POST',
    { timeout: 15_000 },
  );
  await form.locator('[data-rosa-quote-request-submit]').click();
  const response = await responsePromise;
  const result = await response.json().catch(() => null);
  return { response, result };
}

async function clickWhatsappWithoutLeaving(page, link) {
  await link.evaluate((node) => {
    node.addEventListener('click', (event) => event.preventDefault(), { once: true });
    node.click();
  });
  await page.waitForTimeout(50);
}

async function assertClearedState(page, surface, confirmation, expectedChannel, locale, label) {
  await page.waitForFunction(() => window.RosaQuoteBasket?.getState().items.length === 0);

  const stored = await page.evaluate(() => window.RosaQuoteBasket.getState());
  assert.deepEqual(stored.items, [], `${label} must persist an empty quotation basket after successful handoff`);

  await confirmation.waitFor({ state: 'visible', timeout: 5_000 });
  assert.equal(await confirmation.getAttribute('data-rosa-quote-confirmation-channel'), expectedChannel, `${label} must expose truthful confirmation channel`);

  const confirmationText = ((await confirmation.textContent()) || '').trim();
  if (locale === 'ar') {
    assert.match(confirmationText, /[\u0600-\u06ff]/, `${label} visible confirmation must remain Arabic`);
  } else {
    assert.match(confirmationText, /quote|request|email|whatsapp/i, `${label} visible confirmation must remain localized English`);
  }

  if (expectedChannel === 'email') {
    assert.match(confirmationText, /email|بريد|البريد/i, `${label} email confirmation must identify email handoff`);
    if (locale === 'en') assert.match(confirmationText, /sent|submitted|received/i, `${label} email confirmation must describe successful email handoff`);
  } else {
    assert.match(confirmationText, /whatsapp|واتساب/i, `${label} WhatsApp confirmation must identify WhatsApp handoff`);
    assert.doesNotMatch(confirmationText, /(?:whatsapp\s+(?:was\s+)?sent|whatsapp\s+(?:was\s+)?received|تم\s+استلام\s+رسالة\s+واتساب)/i, `${label} must not falsely claim WhatsApp receipt or delivery`);
  }

  assert.equal(await surface.locator('[data-rosa-quote-request-item]').count(), 0, `${label} review page must remove all line items after basket clear`);
  const empty = surface.locator('[data-rosa-quote-request-empty]');
  assert.equal(await empty.count(), 1, `${label} must retain one empty-state surface`);
  await empty.waitFor({ state: 'visible', timeout: 5_000 });

  const headerCount = page.locator('[data-rosa-quote-count]');
  assert.equal(await headerCount.count(), 1, `${label} must expose one shared quote badge`);
  assert.equal(((await headerCount.textContent()) || '').trim(), '0', `${label} shared quote badge must reset to 0`);

  const triggerCount = page.locator('[data-rosa-quote-review-count]');
  assert.equal(await triggerCount.count(), 1, `${label} must expose one floating review count`);
  assert.equal(((await triggerCount.textContent()) || '').trim(), '0', `${label} floating review count must reset to 0`);

  const trigger = page.locator('[data-rosa-quote-review-trigger]');
  await trigger.click();
  const drawer = page.locator('[data-rosa-quote-drawer]');
  await drawer.waitFor({ state: 'visible', timeout: 5_000 });
  assert.equal(await drawer.locator('[data-rosa-quote-drawer-item]').count(), 0, `${label} drawer must contain no quote lines after clear`);
  const drawerEmpty = drawer.locator('[data-rosa-quote-drawer-empty]');
  await drawerEmpty.waitFor({ state: 'visible', timeout: 5_000 });
  await drawer.locator('[data-rosa-quote-drawer-close]').click();
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
  await seedSelections(page, [2, 1]);
  let surface = await quoteSurface(page, '/quote-request/', 'Quote Confirmation EN');
  assert.equal(await surface.locator(forbiddenCommerceUi).count(), 0, 'Quote Confirmation EN must not expose Woo commerce UI');
  assert.equal(await surface.locator(forbiddenPricingUi).count(), 0, 'Quote Confirmation EN must not expose pricing UI');

  let confirmation = await assertConfirmationShell(surface, 'en', 'Quote Confirmation EN');
  let form = surface.locator('form[data-rosa-quote-request-form]');
  const endpoint = new URL(((await form.getAttribute('data-rosa-quote-submit-endpoint')) || '').trim(), page.url());
  assert.equal(endpoint.origin, baseUrl.origin, 'Quote Confirmation EN endpoint must remain same-origin');
  await fillInquiry(form, 'EN');

  const honeypot = form.locator('input[name="website"]');
  await honeypot.fill('https://bot.example/');
  let attempt = await submitAndRead(page, form, endpoint);
  assert.ok(attempt.response.status() >= 400 && attempt.response.status() < 500, `rejected handoff must return HTTP 4xx; got ${attempt.response.status()}`);
  assert.equal(await page.evaluate(() => window.RosaQuoteBasket.getState().items.length), 2, 'rejected handoff must never clear quotation basket');
  assert.equal(await confirmation.isVisible(), false, 'rejected handoff must not expose success confirmation');
  await honeypot.fill('');

  attempt = await submitAndRead(page, form, endpoint);
  assert.ok(attempt.response.ok(), `valid quotation handoff must return HTTP 2xx; got ${attempt.response.status()}`);
  assert.equal(attempt.result?.accepted, true, 'valid quotation handoff must report accepted=true');
  assert.equal(typeof attempt.result?.email?.sent, 'boolean', 'valid quotation handoff must expose truthful email.sent');
  assert.equal(attempt.result?.whatsapp?.prepared, true, 'valid quotation handoff must prepare WhatsApp continuation');

  const whatsapp = surface.locator('[data-rosa-quote-whatsapp-link]');
  await whatsapp.waitFor({ state: 'visible', timeout: 5_000 });

  if (attempt.result.email.sent === true) {
    await assertClearedState(page, surface, confirmation, 'email', 'en', 'Quote Confirmation EN email success');
  } else {
    assert.equal(await page.evaluate(() => window.RosaQuoteBasket.getState().items.length), 2, 'email failure with WhatsApp merely prepared must preserve basket until the user activates WhatsApp handoff');
    assert.equal(await confirmation.isVisible(), false, 'prepared-only WhatsApp must not expose completed confirmation before activation');
    await clickWhatsappWithoutLeaving(page, whatsapp);
    await assertClearedState(page, surface, confirmation, 'whatsapp', 'en', 'Quote Confirmation EN WhatsApp activation');
  }

  await seedSelections(page, [1]);
  surface = await quoteSurface(page, '/ar/quote-request/', 'Quote Confirmation AR');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Quote Confirmation AR must remain RTL');
  confirmation = await assertConfirmationShell(surface, 'ar', 'Quote Confirmation AR');
  form = surface.locator('form[data-rosa-quote-request-form]');
  const arEndpoint = new URL(((await form.getAttribute('data-rosa-quote-submit-endpoint')) || '').trim(), page.url());
  await fillInquiry(form, 'AR');

  attempt = await submitAndRead(page, form, arEndpoint);
  assert.ok(attempt.response.ok(), `valid Arabic quotation handoff must return HTTP 2xx; got ${attempt.response.status()}`);
  assert.equal(attempt.result?.accepted, true, 'valid Arabic quotation handoff must report accepted=true');
  const arWhatsapp = surface.locator('[data-rosa-quote-whatsapp-link]');
  await arWhatsapp.waitFor({ state: 'visible', timeout: 5_000 });

  if (attempt.result.email.sent === true) {
    await assertClearedState(page, surface, confirmation, 'email', 'ar', 'Quote Confirmation AR email success');
  } else {
    assert.equal(await page.evaluate(() => window.RosaQuoteBasket.getState().items.length), 1, 'Arabic prepared-only WhatsApp must preserve basket before activation');
    await clickWhatsappWithoutLeaving(page, arWhatsapp);
    await assertClearedState(page, surface, confirmation, 'whatsapp', 'ar', 'Quote Confirmation AR WhatsApp activation');
  }

  assert.deepEqual(forbiddenRequests, [], 'quotation confirmation flow must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'quotation confirmation contract must not emit browser errors');

  process.stdout.write('PASS: EN/AR quotation confirmation clears persistent quote state only after a truthful successful email handoff or user-activated WhatsApp continuation, resets shared counts and review surfaces, preserves failed submissions, and remains independent of Woo Cart/Checkout/Orders and pricing state\n');
} finally {
  await context.close();
  await browser.close();
}
