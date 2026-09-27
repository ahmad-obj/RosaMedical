import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];

const browser = await chromium.launch(launchOptions);
try {
  for (const path of ['/', '/ar/']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${path} returned HTTP ${response?.status() ?? 'no response'}`);
    const panel = page.locator('.rosa-preview-benefits');
    const items = panel.locator('article');
    assert.equal(await items.count(), 3, `${path} benefit panel must retain three compact procurement-support items`);
    for (let index = 0; index < 3; index += 1) {
      const item = items.nth(index);
      assert.equal(await item.locator('.rosa-preview-benefit-icon svg[aria-hidden="true"]').count(), 1, `${path} benefit ${index + 1} must use the coherent SVG icon system`);
      assert.ok(((await item.locator('h3').textContent()) || '').trim().length > 0, `${path} benefit ${index + 1} must retain editable heading copy`);
      assert.ok(((await item.locator('p').textContent()) || '').trim().length > 0, `${path} benefit ${index + 1} must retain editable support copy`);
    }
    await page.close();
  }
  process.stdout.write('PASS: EN/AR featured-product benefit panel uses compact coherent procurement icons with editable text\n');
} finally {
  await browser.close();
}
