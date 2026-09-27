import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];

const browser = await chromium.launch(launchOptions);
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  for (const path of ['/contact/', '/ar/contact/', '/quote-request/', '/ar/quote-request/']) {
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${path} returned HTTP ${response?.status() ?? 'no response'}`);
    const trigger = page.locator('[data-rosa-quote-review-trigger]');
    assert.equal(await trigger.count(), 1, `${path} must retain one shared quote review trigger in DOM`);
    assert.equal(await trigger.getAttribute('hidden'), '', `${path} form-driven route must hide the fixed quote trigger`);
    assert.equal(await trigger.evaluate((element) => getComputedStyle(element).display), 'none', `${path} fixed quote trigger must not overlay its form`);
  }
  for (const path of ['/shop/', '/product/rosa-foundation-stevens-scissors-regular/']) {
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${path} returned HTTP ${response?.status() ?? 'no response'}`);
    const trigger = page.locator('[data-rosa-quote-review-trigger]');
    assert.equal(await trigger.isVisible(), true, `${path} catalogue route must retain the accessible quote review trigger`);
  }
  await page.close();
  process.stdout.write('PASS: fixed quote review trigger stays on catalogue routes and never overlays contact/quote forms\n');
} finally {
  await browser.close();
}
