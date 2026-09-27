import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];

const routes = [
  ['/', 'en-US', 'ltr', '/quote-request/', '/contact/'],
  ['/about/', 'en-US', 'ltr', '/quote-request/', '/contact/'],
  ['/contact/', 'en-US', 'ltr', '/quote-request/', '/contact/'],
  ['/shop/', 'en-US', 'ltr', '/quote-request/', '/contact/'],
  ['/product/rosa-foundation-stevens-scissors-regular/', 'en-US', 'ltr', '/quote-request/', '/contact/'],
  ['/ar/', 'ar', 'rtl', '/ar/quote-request/', '/ar/contact/'],
  ['/ar/about/', 'ar', 'rtl', '/ar/quote-request/', '/ar/contact/'],
  ['/ar/contact/', 'ar', 'rtl', '/ar/quote-request/', '/ar/contact/'],
  ['/ar/shop/', 'ar', 'rtl', '/ar/quote-request/', '/ar/contact/'],
  ['/ar/product/rosa-foundation-stevens-scissors-regular/', 'ar', 'rtl', '/ar/quote-request/', '/ar/contact/'],
];

const browser = await chromium.launch(launchOptions);
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    for (const [path, lang, dir, quotePath, contactPath] of routes) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const label = `${path} ${viewport.width}px`;
      const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
      assert.ok(response?.ok(), `${label} returned HTTP ${response?.status() ?? 'no response'}`);
      await settlePageMedia(page, { scrollDelayMs: 8 });
      assert.equal(await page.locator('html').getAttribute('lang'), lang, `${label} lang mismatch`);
      assert.equal(await page.locator('html').getAttribute('dir'), dir, `${label} direction mismatch`);

      const banner = page.locator('[data-rosa-cta-banner]');
      assert.equal(await banner.count(), 1, `${label} must render one shared procurement CTA`);
      assert.equal(await banner.locator('form[data-rosa-newsletter-provider="pending"]').count(), 0, `${label} must not render an unconfigured newsletter form`);
      assert.ok(((await banner.locator('h2').textContent()) || '').trim().length > 0, `${label} CTA heading must be populated`);
      assert.ok(((await banner.locator('p').textContent()) || '').trim().length > 0, `${label} CTA supporting copy must be populated`);

      const actions = banner.locator('.rosa-preview-cta-actions > a');
      assert.equal(await actions.count(), 2, `${label} CTA must offer exactly quote and contact actions`);
      assert.equal(new URL(await actions.nth(0).getAttribute('href'), page.url()).pathname, quotePath, `${label} primary action must use locale quote route`);
      assert.equal(new URL(await actions.nth(1).getAttribute('href'), page.url()).pathname, contactPath, `${label} secondary action must use locale contact route`);
      assert.equal(await actions.nth(0).locator('svg[aria-hidden="true"]').count(), 1, `${label} primary CTA must use the shared SVG icon language`);
      assert.equal(await actions.nth(1).locator('svg[aria-hidden="true"]').count(), 1, `${label} secondary CTA must use the shared SVG icon language`);
      for (const action of [actions.nth(0), actions.nth(1)]) {
        const box = await action.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44, `${label} CTA actions must remain touch-safe`);
      }

      const visual = await banner.evaluate((node) => {
        const primary = node.querySelector('.rosa-preview-cta-actions__primary');
        const footer = document.querySelector('[data-rosa-preview-footer]');
        const bannerBox = node.getBoundingClientRect();
        const footerBox = footer?.getBoundingClientRect();
        return {
          background: getComputedStyle(node).backgroundColor,
          primaryBackground: primary ? getComputedStyle(primary).backgroundColor : '',
          primaryColor: primary ? getComputedStyle(primary).color : '',
          footerGap: footerBox ? Math.round(footerBox.top - bannerBox.bottom) : null,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        };
      });
      assert.match(visual.primaryBackground, /rgb\(224, 8, 21\)|rgb\(185, 10, 20\)/, `${label} primary CTA must remain Rosa red`);
      assert.match(visual.primaryColor, /rgb\(255, 255, 255\)/, `${label} primary CTA text must remain white`);
      assert.ok(visual.footerGap !== null && visual.footerGap >= -2 && visual.footerGap <= 2, `${label} CTA must directly precede the footer`);
      assert.ok(visual.scrollWidth <= visual.clientWidth + 1, `${label} CTA causes horizontal overflow: ${visual.scrollWidth} > ${visual.clientWidth}`);
      await page.close();
    }
  }
  process.stdout.write('PASS: shared EN/AR procurement CTA replaces the unconfigured newsletter form with accessible quote/contact actions across primary routes and viewports\n');
} finally {
  await browser.close();
}
