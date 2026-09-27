import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];

const browser = await chromium.launch(launchOptions);
try {
  for (const [path, quotePath, contactPath] of [
    ['/', '/quote-request/', '/contact/'],
    ['/about/', '/quote-request/', '/contact/'],
    ['/contact/', '/quote-request/', '/contact/'],
    ['/ar/', '/ar/quote-request/', '/ar/contact/'],
    ['/ar/about/', '/ar/quote-request/', '/ar/contact/'],
    ['/ar/contact/', '/ar/quote-request/', '/ar/contact/'],
  ]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${path} returned HTTP ${response?.status() ?? 'no response'}`);
    const banner = page.locator('[data-rosa-cta-banner]');
    assert.equal(await banner.count(), 1, `${path} must expose one shared procurement CTA banner`);
    assert.ok(((await banner.locator('h2').textContent()) || '').trim().length > 0, `${path} CTA must expose centrally-owned heading text`);
    assert.equal(await banner.locator('form[data-rosa-newsletter-provider="pending"]').count(), 0, `${path} must not expose an unconfigured newsletter form`);
    const actions = banner.locator('a');
    assert.equal(await actions.count(), 2, `${path} CTA must offer quote and contact actions`);
    assert.equal(new URL(await actions.nth(0).getAttribute('href'), page.url()).pathname, quotePath, `${path} primary CTA must route to the locale quote request`);
    assert.equal(new URL(await actions.nth(1).getAttribute('href'), page.url()).pathname, contactPath, `${path} secondary CTA must route to locale contact`);
    for (const action of [actions.nth(0), actions.nth(1)]) {
      const box = await action.boundingBox();
      assert.ok(box && box.width >= 44 && box.height >= 44, `${path} CTA action must remain touch-safe`);
    }
    const overflow = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(overflow.scroll <= overflow.client + 1, `${path} CTA must not create mobile horizontal overflow`);
    await page.close();
  }
  process.stdout.write('PASS: shared EN/AR procurement CTA is central-setting-ready, routes to quote/contact, and replaces the unconfigured newsletter form\n');
} finally {
  await browser.close();
}
