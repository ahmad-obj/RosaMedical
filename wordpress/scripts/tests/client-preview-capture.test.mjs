import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let lazyImageRequested = false;

  await page.route('https://capture.test/lazy.svg', async (route) => {
    lazyImageRequested = true;
    await new Promise((resolve) => setTimeout(resolve, 100));
    await route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#005a70"/></svg>',
    });
  });

  await page.setContent(`
    <!doctype html>
    <html>
      <body style="margin:0">
        <div style="height:2600px">Above-fold spacer</div>
        <img loading="lazy" src="https://capture.test/lazy.svg" width="640" height="360" alt="Lazy test image">
      </body>
    </html>
  `);

  await settlePageMedia(page, { scrollDelayMs: 20 });

  assert.equal(lazyImageRequested, true, 'below-fold lazy image must be requested');
  assert.deepEqual(
    await page.locator('img').evaluate((image) => ({ complete: image.complete, width: image.naturalWidth })),
    { complete: true, width: 640 },
    'capture must wait for image decoding to complete',
  );
  assert.equal(await page.evaluate(() => window.scrollY), 0, 'capture must restore the page to the top');

  process.stdout.write('PASS: client preview capture settles below-fold media\n');
} finally {
  await browser.close();
}
