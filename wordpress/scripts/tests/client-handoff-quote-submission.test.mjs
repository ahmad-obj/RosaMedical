import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productSlug = 'rosa-foundation-stevens-scissors-regular';
const whatsappNumber = '966597204394';

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

async function seedSelections(page) {
  await load(page, `/product/${productSlug}/`, 'Product EN seed');
  assert.equal(await page.evaluate(() => typeof window.RosaQuoteBasket?.clear), 'function', 'Product seed must expose RosaQuoteBasket');
  await page.evaluate(() => window.RosaQuoteBasket.clear());

  const title = ((await page.locator('.rosa-product-detail__summary h1').textContent()) || '').trim();
  assert.ok(title.length > 0, 'Product seed must expose title');
  const rows = page.locator('.rosa-product-detail__configuration[data-variation-id]');
  assert.ok(await rows.count() >= 2, 'Batch 11 contract requires at least two representative configurations');

  const selected = [];
  for (const [index, quantityValue] of [[0, 2], [1, 1]]) {
    const row = rows.nth(index);
    const add = row.locator('[data-rosa-add-to-quote]');
    const quantity = row.locator('input[data-rosa-quote-quantity]');
    const productId = Number(await add.getAttribute('data-product-id'));
    const variationId = Number(await add.getAttribute('data-variation-id'));
    const sku = ((await add.getAttribute('data-sku')) || '').trim();
    assert.ok(productId > 0 && variationId > 0 && sku, `seed configuration ${index + 1} must expose canonical identity`);

    const configurationParts = await row.locator('dl > div').evaluateAll((entries) => entries.map((entry) => {
      const term = (entry.querySelector('dt')?.textContent || '').trim();
      const value = (entry.querySelector('dd')?.textContent || '').trim();
      return { term, value };
    }).filter((entry) => entry.value));

    await quantity.fill(String(quantityValue));
    await add.click();
    selected.push({ productId, variationId, sku, quantity: quantityValue, title, configurationParts });
  }

  await page.waitForFunction(() => window.RosaQuoteBasket?.getState().items.length === 2);
  return selected;
}

function assertNoCommerceKeys(value, path = 'payload') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoCommerceKeys(entry, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    assert.ok(!/(?:price|subtotal|amount|currency|tax|shipping|cart|checkout|order|payment)/i.test(key), `${path}.${key} must not introduce ecommerce/pricing state`);
    assertNoCommerceKeys(nested, `${path}.${key}`);
  }
}

function submissionPayload(nonce, selected, overrides = {}) {
  const base = {
    locale: 'en',
    nonce,
    customer: {
      name: 'Procurement Test User',
      email: 'procurement.test@example.com',
      phone: '+966555000111',
      institution: 'Rosa Test Hospital',
      location: 'Riyadh, Saudi Arabia',
      notes: 'Please confirm availability for the listed surgical instruments.',
    },
    items: selected.map(({ productId, variationId, sku, quantity }) => ({ productId, variationId, sku, quantity })),
    website: '',
  };
  return { ...base, ...overrides };
}

async function expectRejected(request, endpoint, payload, label) {
  const response = await request.post(endpoint, { data: payload });
  assert.ok(response.status() >= 400 && response.status() < 500, `${label} must fail with HTTP 4xx; got ${response.status()}`);
  const json = await response.json().catch(() => ({}));
  assert.notEqual(json?.accepted, true, `${label} must not report accepted=true`);
  return json;
}

function decodedWhatsappText(url) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, 'https:', 'WhatsApp handoff must use HTTPS');
  assert.equal(parsed.hostname, 'wa.me', 'WhatsApp handoff must use wa.me');
  assert.equal(parsed.pathname, `/${whatsappNumber}`, `WhatsApp handoff must target ${whatsappNumber}`);
  const text = parsed.searchParams.get('text') || '';
  assert.ok(text.length > 0, 'WhatsApp handoff must include preformatted text');
  return text;
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
  const selected = await seedSelections(page);
  await load(page, '/quote-request/', 'Quote Request EN submission');

  const surface = page.locator('[data-rosa-quote-request-page]');
  const form = surface.locator('form[data-rosa-quote-request-form]');
  assert.equal(await form.count(), 1, 'Quote Request EN must expose one inquiry form');
  assert.equal(await surface.locator(forbiddenCommerceUi).count(), 0, 'quotation submission surface must not expose Woo commerce UI');
  assert.equal(await surface.locator(forbiddenPricingUi).count(), 0, 'quotation submission surface must not expose pricing UI');

  const endpointAttr = ((await form.getAttribute('data-rosa-quote-submit-endpoint')) || '').trim();
  assert.ok(endpointAttr.length > 0, 'Quote Request EN form must expose protected quotation submission endpoint');
  const endpoint = new URL(endpointAttr, page.url());
  assert.equal(endpoint.origin, baseUrl.origin, 'quotation submission endpoint must remain same-origin');

  const nonceInput = form.locator('input[type="hidden"][name="rosa_quote_nonce"]');
  assert.equal(await nonceInput.count(), 1, 'Quote Request EN form must expose exactly one quotation nonce');
  const nonce = ((await nonceInput.inputValue()) || '').trim();
  assert.ok(nonce.length >= 8, 'quotation submission nonce must not be empty');

  const honeypot = form.locator('input[name="website"]');
  assert.equal(await honeypot.count(), 1, 'Quote Request EN form must expose one anti-bot honeypot field');
  assert.equal(await honeypot.getAttribute('autocomplete'), 'off', 'quotation honeypot must disable autocomplete');

  const status = surface.locator('[data-rosa-quote-submit-status]');
  assert.equal(await status.count(), 1, 'Quote Request EN must expose one accessible submission status region');
  assert.equal(await status.getAttribute('role'), 'status', 'quotation submission status must use role=status');
  assert.equal(await status.getAttribute('aria-live'), 'polite', 'quotation submission status must use aria-live=polite');

  const whatsappLink = surface.locator('[data-rosa-quote-whatsapp-link]');
  assert.equal(await whatsappLink.count(), 1, 'Quote Request EN must expose one WhatsApp handoff control');
  assert.equal(await whatsappLink.isVisible(), false, 'WhatsApp handoff must begin hidden until server prepares canonical text');

  const handlerSource = fs.readFileSync(new URL('../../wp-content/themes/rosa-medical-child/inc/quote-request.php', import.meta.url), 'utf8');
  assert.match(handlerSource, /\bwp_mail\s*\(/, 'quotation server handler must invoke WordPress wp_mail() for institutional email handoff');

  await form.locator('input[name="name"]').fill('Procurement Test User');
  await form.locator('input[name="email"]').fill('procurement.test@example.com');
  await form.locator('input[name="phone"]').fill('+966555000111');
  await form.locator('input[name="institution"]').fill('Rosa Test Hospital');
  await form.locator('input[name="location"]').fill('Riyadh, Saudi Arabia');
  await form.locator('textarea[name="notes"]').fill('Please confirm availability for the listed surgical instruments.');

  const outgoing = [];
  page.on('request', (request) => {
    if (request.url() === endpoint.href && request.method() === 'POST') outgoing.push(request);
  });

  const responsePromise = page.waitForResponse((response) => response.url() === endpoint.href && response.request().method() === 'POST', { timeout: 15_000 });
  await form.locator('[data-rosa-quote-request-submit]').click();
  const response = await responsePromise;
  assert.ok(response.status() >= 200 && response.status() < 300, `valid quotation handoff must return HTTP 2xx; got ${response.status()}`);
  const result = await response.json();

  assert.equal(outgoing.length, 1, 'quotation form must issue exactly one protected submission request');
  const posted = outgoing[0].postDataJSON();
  assert.equal(posted.nonce, nonce, 'quotation browser request must include server-issued nonce');
  assert.deepEqual(posted.items, selected.map(({ productId, variationId, sku, quantity }) => ({ productId, variationId, sku, quantity })), 'quotation browser request must submit identity and quantity only for selected lines');
  assertNoCommerceKeys(posted);

  assert.equal(result?.accepted, true, 'valid quotation handoff must report accepted=true');
  assert.equal(result?.email?.attempted, true, 'valid quotation handoff must report that institutional email was attempted');
  assert.equal(typeof result?.email?.sent, 'boolean', 'email.sent must truthfully expose wp_mail success/failure as boolean');
  assert.equal(result?.whatsapp?.prepared, true, 'valid quotation handoff must report WhatsApp message prepared');
  assert.equal(typeof result?.whatsapp?.url, 'string', 'valid quotation handoff must return WhatsApp deep link');
  assertNoCommerceKeys(result);

  const whatsappText = decodedWhatsappText(result.whatsapp.url);
  for (const expectedText of [
    'Procurement Test User',
    'procurement.test@example.com',
    '+966555000111',
    'Rosa Test Hospital',
    'Riyadh, Saudi Arabia',
    'Please confirm availability for the listed surgical instruments.',
  ]) {
    assert.ok(whatsappText.includes(expectedText), `WhatsApp message must include ${JSON.stringify(expectedText)}`);
  }
  for (const item of selected) {
    assert.ok(whatsappText.includes(item.title), `WhatsApp message must include canonical product title for ${item.sku}`);
    assert.ok(whatsappText.includes(item.sku), `WhatsApp message must include exact SKU ${item.sku}`);
    assert.match(whatsappText, new RegExp(`(?:Qty|Quantity|الكمية)[^\\n]*${item.quantity}|${item.quantity}[^\\n]*(?:Qty|Quantity|الكمية)`, 'i'), `WhatsApp message must include quantity ${item.quantity} for ${item.sku}`);
    const configurationValues = item.configurationParts.map((part) => part.value).filter((value) => value && value !== item.sku);
    if (configurationValues.length > 0) {
      assert.ok(configurationValues.some((value) => whatsappText.includes(value)), `WhatsApp message must include canonical configuration detail for ${item.sku}`);
    }
  }
  assert.doesNotMatch(whatsappText, /(?:price|subtotal|total price|currency|tax|shipping|checkout|cart|payment)/i, 'WhatsApp message must not introduce commerce/pricing language');

  await page.waitForFunction(() => !document.querySelector('[data-rosa-quote-whatsapp-link]')?.hasAttribute('hidden'));
  assert.equal(await whatsappLink.getAttribute('href'), result.whatsapp.url, 'UI WhatsApp handoff must use server-generated canonical deep link');
  assert.equal((await page.evaluate(() => window.RosaQuoteBasket.getState().items.length)), 2, 'successful handoff preparation must not auto-clear quote basket');

  const statusText = ((await status.textContent()) || '').trim();
  assert.ok(statusText.length > 0, 'valid quotation submission must expose user-visible status');
  if (result.email.sent) {
    assert.match(statusText, /email|sent/i, 'UI may report email sent only when wp_mail reports success');
  } else {
    assert.doesNotMatch(statusText, /email sent|successfully sent/i, 'UI must not claim email sent when wp_mail reports failure');
  }
  assert.match(`${statusText} ${(await whatsappLink.textContent()) || ''}`, /whatsapp|message|quote|request/i, 'UI must describe WhatsApp as a prepared handoff');

  const valid = submissionPayload(nonce, selected);
  await expectRejected(context.request, endpoint.href, { ...valid, nonce: `${nonce}-invalid` }, 'invalid nonce');
  await expectRejected(context.request, endpoint.href, { ...valid, customer: { ...valid.customer, name: '' } }, 'missing required name');
  await expectRejected(context.request, endpoint.href, { ...valid, customer: { ...valid.customer, email: 'not-an-email' } }, 'invalid email');
  await expectRejected(context.request, endpoint.href, { ...valid, items: [] }, 'empty quote basket');
  await expectRejected(context.request, endpoint.href, {
    ...valid,
    items: valid.items.map((item, index) => index === 0 ? { ...item, sku: `${item.sku}-tampered` } : item),
  }, 'tampered Woo identity');
  await expectRejected(context.request, endpoint.href, {
    ...valid,
    items: valid.items.map((item, index) => index === 0 ? { ...item, quantity: 10_000 } : item),
  }, 'excessive quantity');
  await expectRejected(context.request, endpoint.href, { ...valid, website: 'https://spam.example/' }, 'honeypot submission');

  await load(page, '/ar/quote-request/', 'Quote Request AR submission shell');
  const arSurface = page.locator('[data-rosa-quote-request-page]');
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', 'Arabic quotation handoff must remain RTL');
  const arStatus = arSurface.locator('[data-rosa-quote-submit-status]');
  const arWhatsapp = arSurface.locator('[data-rosa-quote-whatsapp-link]');
  assert.equal(await arStatus.count(), 1, 'Arabic quotation page must expose accessible submission status');
  assert.equal(await arStatus.getAttribute('aria-live'), 'polite', 'Arabic status must remain aria-live=polite');
  assert.equal(await arWhatsapp.count(), 1, 'Arabic quotation page must expose WhatsApp handoff control');
  const arAccessibleCopy = `${(await arWhatsapp.textContent()) || ''} ${(await arWhatsapp.getAttribute('aria-label')) || ''}`;
  assert.match(arAccessibleCopy, /[\u0600-\u06ff]/, 'Arabic WhatsApp handoff control must expose Arabic copy');

  assert.deepEqual(forbiddenRequests, [], 'quotation handoff must not call Woo Cart, Checkout or Orders endpoints');
  assert.deepEqual(browserErrors, [], 'quotation handoff contract must not emit browser errors');

  process.stdout.write('PASS: protected EN/AR quotation handoff validates canonical Woo-backed lines server-side, attempts institutional wp_mail delivery, prepares truthful WhatsApp deep links, rejects tampering/abuse, and remains independent of Woo Cart/Checkout/Orders and pricing state\n');
} finally {
  await context.close();
  await browser.close();
}
