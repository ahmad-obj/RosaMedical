import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const OUT_DIR = path.resolve(__dirname, '../.client-preview-artifacts/screenshots');

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // 1. Desktop English Shop
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:8088/shop/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'en-shop-amazon-1440x900.png'), fullPage: false });
    console.log('Captured en-shop-amazon-1440x900.png');
    await page.close();
  }

  // 2. Mobile English Shop
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:8088/shop/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'en-shop-amazon-390x844.png'), fullPage: false });
    console.log('Captured en-shop-amazon-390x844.png');
    await page.close();
  }

  // 3. Desktop Arabic Shop
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:8088/ar/shop/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'ar-shop-amazon-1440x900.png'), fullPage: false });
    console.log('Captured ar-shop-amazon-1440x900.png');
    await page.close();
  }

  // 4. Mobile Arabic Shop
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:8088/ar/shop/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'ar-shop-amazon-390x844.png'), fullPage: false });
    console.log('Captured ar-shop-amazon-390x844.png');
    await page.close();
  }

  // 5. Search Autocomplete Dropdown
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:8088/shop/', { waitUntil: 'networkidle' });
    const searchInput = page.locator('#rosa-live-shop-search');
    await searchInput.fill('handle');
    await page.waitForSelector('.rosa-search-autocomplete:not([hidden])', { timeout: 5000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'search-autocomplete-dropdown.png'), fullPage: false });
    console.log('Captured search-autocomplete-dropdown.png');
    await page.close();
  }

  // 6. Single Product Detail View (Zero placeholder thumbnails)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:8088/product/long-handle/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'single-product-gallery-single-image.png'), fullPage: false });
    console.log('Captured single-product-gallery-single-image.png');
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
