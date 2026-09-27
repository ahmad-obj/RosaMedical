import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true, args: process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1' ? ['--no-sandbox', '--disable-setuid-sandbox'] : [] });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('**/wp-json/rosa/v1/search?*', async (route) => {
    const query = new URL(route.request().url()).searchParams.get('q');
    if (query === 'ab') {
      await new Promise((resolve) => setTimeout(resolve, 450));
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ name: 'stale result', sku: 'OLD', family: 'Old', url: '/product/old/' }]) });
      return;
    }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify([{
      name: '<img src=x onerror=window.__rosaXss=1>Fresh instrument',
      sku: 'NEW',
      family: '<b>Family</b>',
      thumbnail: '',
      url: 'https://example.invalid/not-a-rosa-product',
    }]) });
  });
  await page.goto(new URL('/shop/', baseUrl).href, { waitUntil: 'domcontentloaded' });
  const input = page.locator('#rosa-live-shop-search');
  await input.fill('ab');
  await page.waitForTimeout(300);
  await input.fill('abc');
  const dropdown = page.locator('.rosa-search-autocomplete');
  await dropdown.waitFor({ state: 'visible' });
  await page.waitForTimeout(550);

  assert.match((await dropdown.textContent()) || '', /Fresh instrument/, 'Latest autocomplete response must render.');
  assert.doesNotMatch((await dropdown.textContent()) || '', /stale result/, 'A stale autocomplete response must not overwrite the newest query.');
  assert.equal(await page.evaluate(() => window.__rosaXss), undefined, 'Autocomplete API text must not execute as HTML.');
  assert.equal(await dropdown.locator('img[onerror]').count(), 0, 'Autocomplete API text must not create injected elements.');
  assert.equal(await dropdown.locator('.rosa-search-autocomplete__item').getAttribute('href'), '#', 'Autocomplete must reject off-origin product destinations.');
  await page.close();
  process.stdout.write('PASS: autocomplete ignores stale responses and safely renders untrusted API text/URLs\n');
} finally {
  await browser.close();
}
