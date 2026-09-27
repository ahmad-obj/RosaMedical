import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];

const browser = await chromium.launch(launchOptions);

try {
  for (const [path, width] of [
    ['/', 1440], ['/', 1024], ['/', 768], ['/', 431], ['/', 390],
    ['/ar/', 1440], ['/ar/', 390],
  ]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${path} at ${width}px returned HTTP ${response?.status() ?? 'no response'}`);
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    const rhythm = await page.locator('[data-home-section="latest"]').evaluate((section) => {
      const products = section.querySelector('.rosa-preview-products--latest');
      if (!(products instanceof HTMLElement)) return null;
      const sectionBounds = section.getBoundingClientRect();
      const productBounds = products.getBoundingClientRect();
      return { bottomSpace: Math.round(sectionBounds.bottom - productBounds.bottom), sectionHeight: Math.round(sectionBounds.height) };
    });
    assert.ok(rhythm, `${path} at ${width}px must retain the Latest Products grid`);
    assert.ok(rhythm.bottomSpace <= 128, `${path} at ${width}px leaves ${rhythm.bottomSpace}px of dead space below Latest Products (maximum 128px)`);
    await page.close();
  }
  process.stdout.write('PASS: Latest Products ends with deliberate section rhythm rather than a fixed-height dead zone\n');
} finally {
  await browser.close();
}
