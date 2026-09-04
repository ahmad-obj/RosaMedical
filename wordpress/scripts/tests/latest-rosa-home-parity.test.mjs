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
const expectedFamilies = ['scissors', 'cutters', 'punches', 'chisels', 'knives'];
const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [431, 932], [390, 844], [360, 800]];

function near(value, minimum, maximum, label) {
  assert.ok(value >= minimum && value <= maximum, `${label}: expected ${minimum}–${maximum}px, received ${value}px`);
}

async function box(page, selector, label = selector) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible' });
  const result = await locator.boundingBox();
  assert.ok(result, `${label} has no rendered box`);
  return result;
}

async function firstRowCount(locator) {
  const boxes = await locator.evaluateAll((elements) => elements.map((element) => {
    const bounds = element.getBoundingClientRect();
    return { y: Math.round(bounds.y), width: Math.round(bounds.width) };
  }).filter(({ width }) => width > 0));
  assert.ok(boxes.length > 0, 'expected at least one rendered item');
  const firstY = Math.min(...boxes.map(({ y }) => y));
  return boxes.filter(({ y }) => Math.abs(y - firstY) <= 2).length;
}

async function loadHome(width, height, path = '/') {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  assert.deepEqual(pageErrors, [], `${width}px ${path} emitted page errors`);
  assert.deepEqual(consoleErrors, [], `${width}px ${path} emitted console errors`);
  return { context, page };
}

async function assertNoOverflow(page, width, label) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.ok(dimensions.scrollWidth <= dimensions.viewport + 1, `${width}px ${label} horizontally overflows: ${dimensions.scrollWidth} > ${dimensions.viewport}`);
}

async function assertNoSectionCollisions(page, width) {
  const boxes = await page.locator('.public-page--home [data-section]').evaluateAll((elements) => {
    const unique = [];
    const seen = new Set();
    for (const element of elements) {
      const section = element.dataset.section;
      if (!section || seen.has(section)) continue;
      seen.add(section);
      const rect = element.getBoundingClientRect();
      unique.push({ section, top: rect.top + scrollY, bottom: rect.bottom + scrollY, height: rect.height });
    }
    return unique;
  });
  assert.deepEqual(boxes.map(({ section }) => section), expectedSections, `${width}px section order changed while checking collisions`);
  for (let i = 1; i < boxes.length; i += 1) {
    assert.ok(boxes[i].top >= boxes[i - 1].bottom - 1, `${width}px ${boxes[i - 1].section} overlaps ${boxes[i].section}`);
  }
  for (const entry of boxes) assert.ok(entry.height > 1, `${width}px ${entry.section} collapsed to zero height`);
}

async function assertSharedHome(page, width, locale = 'en') {
  assert.equal(await page.locator('main').count(), 1, `${width}px Home must have exactly one main landmark`);
  assert.equal(await page.locator('.public-page--home').count(), 1, `${width}px latest Rosa Home root missing`);
  assert.deepEqual(
    await page.locator('.public-page--home [data-section]').evaluateAll((elements) => {
      const seen = new Set();
      return elements.map((element) => element.dataset.section).filter((section) => section && !seen.has(section) && seen.add(section));
    }),
    expectedSections,
    `${width}px latest Rosa Home topology mismatch`,
  );
  assert.equal(await page.locator('[data-latest-rosa-home-hero] [data-rosa-hero-slide]').count(), 4, `${width}px hero must expose four source slides`);
  assert.equal(await page.locator('[data-latest-rosa-home-hero] [data-rosa-hero-slide].is-active').count(), 1, `${width}px hero must have exactly one active slide`);
  assert.equal(await page.locator('[data-latest-rosa-home-hero] [data-rosa-hero-dot]').count(), 4, `${width}px hero must expose four controls`);
  assert.deepEqual(
    await page.locator('[data-home-family-gallery] [data-family-panel]').evaluateAll((elements) => elements.map((element) => element.dataset.family)),
    expectedFamilies,
    `${width}px family gallery order differs from latest Rosa`,
  );
  assert.equal(await page.locator('[data-home-family-gallery] img').count(), 5, `${width}px family gallery must render five catalogue covers`);
  assert.equal(await page.locator('.home-comprehensive__specialties > li').count(), 4, `${width}px comprehensive section must render four supporting specialties`);
  assert.equal(await page.locator('.home-assurance__grid > li').count(), 4, `${width}px assurance section must render four cards`);
  assert.equal(await page.locator('.home-contact-action--whatsapp').count(), 1, `${width}px WhatsApp action missing`);
  assert.equal(await page.locator('.home-contact-action--email').count(), 1, `${width}px email action missing`);
  assert.equal(await page.locator('[data-section="quotation-cta"] .button--primary').count(), 1, `${width}px quotation CTA missing`);

  const contactBackground = await page.locator('.home-contact-band__surface').evaluate((element) => getComputedStyle(element).backgroundColor);
  assert.ok(contactBackground === 'rgb(9, 9, 9)' || contactBackground === 'rgba(9, 9, 9, 1)', `${width}px direct-support band is not latest black surface: ${contactBackground}`);

  const visibleBrokenImages = await page.locator('.public-page--home img').evaluateAll((images) => images.filter((image) => {
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && image.checkVisibility() && (!image.complete || image.naturalWidth === 0);
  }).map((image) => image.currentSrc || image.src));
  assert.deepEqual(visibleBrokenImages, [], `${width}px latest Home contains visible broken images`);

  if (locale === 'ar') {
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl', `${width}px Arabic Home must be RTL`);
    assert.equal(await page.locator('html').getAttribute('lang'), 'ar', `${width}px Arabic Home language attribute changed`);
  }
  await assertNoOverflow(page, width, locale === 'ar' ? 'Arabic Home' : 'Home');
  await assertNoSectionCollisions(page, width);
}

try {
  for (const [width, height] of viewports) {
    const { context, page } = await loadHome(width, height);
    await assertSharedHome(page, width);
    const hero = await box(page, '[data-section="home-hero"]', `${width}px hero`);
    if (width > 640) near(hero.height, 375, 500, `${width}px latest desktop/tablet hero height`);
    else near(hero.height, 495, 565, `${width}px latest mobile hero height`);

    const familyColumns = await firstRowCount(page.locator('[data-home-family-gallery] [data-family-panel]'));
    const specialtyColumns = await firstRowCount(page.locator('.home-comprehensive__specialties > li'));
    const assuranceColumns = await firstRowCount(page.locator('.home-assurance__grid > li'));
    if (width > 640) {
      assert.equal(familyColumns, 5, `${width}px family covers must retain the source five-column row`);
      assert.equal(specialtyColumns, 4, `${width}px specialties must retain four columns`);
      assert.equal(assuranceColumns, 4, `${width}px assurance cards must retain four columns`);
      assert.equal(await firstRowCount(page.locator('.home-confidence__grid > *')), 2, `${width}px confidence section must be split`);
    } else {
      assert.ok(familyColumns >= 2 && familyColumns <= 3, `${width}px family rail must show roughly two covers at once`);
      assert.equal(specialtyColumns, 2, `${width}px specialties must use two mobile columns`);
      assert.equal(assuranceColumns, 2, `${width}px assurance cards must use two mobile columns`);
      assert.equal(await firstRowCount(page.locator('.home-confidence__grid > *')), 1, `${width}px confidence section must stack on mobile`);
      assert.equal(await page.locator('.home-family-gallery__mobile-controls').isVisible(), true, `${width}px family rail controls must be visible on mobile`);
    }
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto(baseUrl.href, { waitUntil: 'load' });
    const hero = page.locator('[data-latest-rosa-home-hero]');
    await hero.locator('[data-rosa-hero-dot][data-slide-index="1"]').click();
    assert.equal(await hero.getAttribute('data-active-slide'), 'clinical-instrument-context', 'hero dot did not activate slide 2');
    const activeDot = hero.locator('[data-rosa-hero-dot][aria-current="true"]');
    await activeDot.focus();
    await activeDot.press('ArrowRight');
    assert.equal(await hero.getAttribute('data-active-slide'), 'surgical-instrument-selection', 'hero ArrowRight did not advance to slide 3');
    await context.close();
  }

  for (const [width, height] of [[1280, 800], [390, 844]]) {
    const { context, page } = await loadHome(width, height, '/ar/');
    await assertSharedHome(page, width, 'ar');
    await context.close();
  }

  process.stdout.write('PASS: WordPress Homepage matches latest Rosa topology, responsive geometry, interactions and RTL contracts\n');
} finally {
  await browser.close();
}
