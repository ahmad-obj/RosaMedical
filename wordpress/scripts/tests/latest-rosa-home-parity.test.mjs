import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });

const expectedSections = [
  'home-hero',
  'family-discovery',
  'comprehensive-plans',
  'securing-confidence',
  'home-contact-band',
  'client-success-assurance',
  'quotation-cta',
];

async function loadHome(pathname = '/', viewport = { width: 1440, height: 900 }) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const url = new URL(pathname, baseUrl);
  await page.goto(url.href, { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  return page;
}

async function assertTopology(page) {
  assert.equal(await page.locator('.public-page--home').count(), 1, 'Home must render exactly one latest Rosa root');
  assert.deepEqual(
    await page.locator('.public-page--home [data-section]').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('data-section')),
    ),
    expectedSections,
    'latest Rosa Home section order mismatch',
  );
  assert.equal(await page.locator('.public-hero-carousel__slide').count(), 4, 'Home hero must render four slides');
  assert.equal(await page.locator('.public-hero-carousel__dot').count(), 4, 'Home hero must render four dots');
  assert.deepEqual(
    await page.locator('[data-home-family-gallery] [data-family]').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('data-family')),
    ),
    ['scissors', 'cutters', 'punches', 'chisels', 'knives'],
    'Home family order must match latest Rosa source',
  );
}

try {
  const page = await loadHome('/');
  await assertTopology(page);

  const activeBefore = await page.locator('.public-hero-carousel').getAttribute('data-active-slide');
  const secondDot = page.locator('.public-hero-carousel__dot').nth(1);
  await secondDot.click();
  assert.equal(await secondDot.getAttribute('aria-current'), 'true', 'clicked hero dot must become current');
  const activeAfter = await page.locator('.public-hero-carousel').getAttribute('data-active-slide');
  assert.notEqual(activeAfter, activeBefore, 'hero active slide must change after dot click');

  await page.close();
  console.log('PASS: latest Rosa Homepage topology and basic interactions');
} finally {
  await browser.close();
}
