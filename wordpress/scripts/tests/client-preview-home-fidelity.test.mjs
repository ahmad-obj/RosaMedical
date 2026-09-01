import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });

const expectedSections = ['hero', 'who', 'featured', 'feature', 'latest', 'promos', 'why', 'proof', 'evidence'];
const expectedMediaSlots = [
  'home-hero-01',
  'home-who-01',
  'home-feature-01',
  'home-promo-01',
  'home-promo-02',
  'home-promo-03',
  'home-promo-04',
  'home-why-01',
  'home-evidence-01',
  'prefooter-person-01',
];

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

async function columnCount(locator) {
  const boxes = await locator.evaluateAll((elements) => elements.map((element) => {
    const bounds = element.getBoundingClientRect();
    return { x: Math.round(bounds.x), y: Math.round(bounds.y) };
  }));
  assert.ok(boxes.length > 0, 'expected at least one grid item');
  const firstRowY = Math.min(...boxes.map(({ y }) => y));
  return boxes.filter(({ y }) => Math.abs(y - firstRowY) <= 2).length;
}

async function loadHome(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const forbidden = [];
  page.on('request', (request) => {
    if (/preview\.themeforest\.net|fullkit\.moxcreative\.com|elements?kit|skyboot/i.test(request.url())) forbidden.push(request.url());
  });
  await page.goto(baseUrl.href, { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  assert.deepEqual(forbidden, [], `${width}px Home requested target/proprietary resources`);
  return page;
}

async function assertSharedHome(page, width) {
  assert.equal(await page.locator('main').count(), 1, `${width}px Home must have exactly one main landmark`);
  assert.match((await page.locator('.rosa-preview-brand').innerText()).trim(), /ROSA/i, `${width}px header must visibly name Rosa`);
  assert.deepEqual(
    await page.locator('[data-home-section]').evaluateAll((elements) => elements.map((element) => element.dataset.homeSection)),
    expectedSections,
    `${width}px Home section topology differs from the measured target`,
  );
  for (const slot of expectedMediaSlots) {
    assert.equal(await page.locator(`[data-media-slot="${slot}"]`).count(), 1, `${width}px Home media slot ${slot} must occur exactly once`);
  }
  assert.equal(await page.locator('[data-preview-contact-cta]').count(), 1, `${width}px Home must render one pre-footer CTA`);
  const viewport = await page.evaluate(() => document.documentElement.clientWidth);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(scrollWidth <= viewport + 1, `${width}px Home overflows horizontally: ${scrollWidth} > ${viewport}`);
  const visibleBrokenImages = await page.locator('img').evaluateAll((images) => images.filter((image) => {
    const bounds = image.getBoundingClientRect();
    return bounds.width > 0 && bounds.height > 0 && image.checkVisibility() && (!image.complete || image.naturalWidth === 0);
  }).map((image) => image.currentSrc || image.src));
  assert.deepEqual(visibleBrokenImages, [], `${width}px Home contains visibly broken images`);
}

async function assertNoVerticalCollisions(page, width) {
  const boxes = await page.locator('[data-home-section],.rosa-preview-prefooter,[data-rosa-preview-footer]').evaluateAll((elements) => elements.map((element) => {
    const bounds = element.getBoundingClientRect();
    return { top: bounds.top + scrollY, bottom: bounds.bottom + scrollY };
  }));
  for (let index = 1; index < boxes.length; index += 1) assert.ok(boxes[index].top >= boxes[index - 1].bottom - 1, `${width}px vertical sections overlap at index ${index}`);
}

try {
  {
    const page = await loadHome(1440, 900);
    await assertSharedHome(page, 1440);
    near((await box(page, '.rosa-preview-announcement')).height, 42, 46, '1440 announcement height');
    near((await box(page, '.rosa-preview-header')).height, 74, 78, '1440 main header height');
    const announcement = await box(page, '.rosa-preview-announcement');
    const header = await box(page, '.rosa-preview-header');
    near(announcement.height + header.height, 118, 122, '1440 total header height');
    near((await box(page, '.rosa-preview-header__inner')).width, 1276, 1284, '1440 content rail width');
    near((await box(page, '[data-home-section="hero"]')).height, 660, 700, '1440 hero height');
    near((await box(page, '.rosa-preview-hero__copy')).width, 680, 740, '1440 hero copy width');
    assert.equal(await columnCount(page.locator('.rosa-preview-products--featured .rosa-preview-product')), 4, '1440 featured grid must have four columns');
    assert.equal(await columnCount(page.locator('.rosa-preview-products--latest .rosa-preview-product')), 5, '1440 latest grid must have five columns');
    const promoColumns = await page.locator('.rosa-preview-promos__grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').map(Number.parseFloat));
    assert.equal(promoColumns.length, 2, '1440 promo mosaic must have two primary columns');
    near(promoColumns[0] / (promoColumns[0] + promoColumns[1]), 0.28, 0.32, '1440 promo primary column ratio');
    assert.equal(await page.locator('.rosa-preview-evidence__cards > *').count(), 3, '1440 evidence band must have three cards');
    near((await box(page, '.rosa-preview-prefooter')).height, 155, 180, '1440 pre-footer height');
    assert.equal(await columnCount(page.locator('.rosa-preview-footer__grid > .rosa-preview-footer__column')), 4, '1440 footer must have four columns');
    await page.close();
  }

  {
    const page = await loadHome(1024, 768);
    await assertSharedHome(page, 1024);
    assert.equal(await page.locator('.rosa-preview-nav').isVisible(), false, '1024 desktop navigation must be hidden');
    assert.equal(await page.locator('[data-rosa-preview-menu-trigger]').isVisible(), true, '1024 menu trigger must be visible');
    for (const action of await page.locator('.rosa-preview-header__actions a').all()) near((await action.boundingBox()).height, 44, 46, '1024 header action height');
    near((await box(page, '.rosa-preview-announcement')).height + (await box(page, '.rosa-preview-header')).height, 101, 109, '1024 total header height');
    assert.equal(await columnCount(page.locator('.rosa-preview-products--latest .rosa-preview-product')), 4, '1024 latest grid must have four columns');
    const promoColumns = await page.locator('.rosa-preview-promos__grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').map(Number.parseFloat));
    assert.equal(promoColumns.length, 2, '1024 promo mosaic must retain two columns');
    near(promoColumns[0] / (promoColumns[0] + promoColumns[1]), 0.28, 0.32, '1024 promo primary column ratio');
    assert.equal(await page.locator('.rosa-preview-prefooter__media').isVisible(), true, '1024 pre-footer media must remain visible');
    assert.equal(await columnCount(page.locator('.rosa-preview-footer__grid > .rosa-preview-footer__column')), 1, '1024 footer must retain the target brand row');
    await page.close();
  }

  {
    const page = await loadHome(768, 1024);
    await assertSharedHome(page, 768);
    assert.equal(await page.locator('[data-rosa-preview-menu-trigger]').isVisible(), true, '768 menu trigger must be visible');
    assert.equal(await columnCount(page.locator('.rosa-preview-products--latest .rosa-preview-product')), 4, '768 latest grid must have four columns');
    assert.equal(await columnCount(page.locator('.rosa-preview-featured__layout > *')), 1, '768 featured products and benefits must stack');
    assert.equal(await page.locator('.rosa-preview-prefooter__media').isVisible(), true, '768 pre-footer media must remain visible');
    assert.equal(await columnCount(page.locator('.rosa-preview-footer__grid > .rosa-preview-footer__column')), 1, '768 footer must retain the target brand row');
    await page.close();
  }

  for (const width of [431, 639, 767]) {
    const page = await loadHome(width, 932);
    await assertSharedHome(page, width);
    await assertNoVerticalCollisions(page, width);
    await page.close();
  }

  {
    const page = await loadHome(390, 844);
    await assertSharedHome(page, 390);
    near((await box(page, '[data-home-section="hero"]')).height, 430, 490, '390 hero height');
    assert.equal(await columnCount(page.locator('.rosa-preview-products--latest .rosa-preview-product')), 2, '390 latest grid must have two columns');
    assert.equal(await columnCount(page.locator('.rosa-preview-promos__tile')), 1, '390 promo tiles must stack');
    assert.equal(await columnCount(page.locator('.rosa-preview-footer__grid > .rosa-preview-footer__column')), 1, '390 footer columns must stack');
    const headerBottom = await page.locator('.rosa-preview-header').evaluate((element) => element.getBoundingClientRect().bottom);
    await page.locator('[data-rosa-preview-menu-trigger]').click();
    const drawer = await box(page, '[data-rosa-preview-menu-drawer]', '390 open menu');
    near(drawer.x, 0, 1, '390 open menu inline start');
    near(drawer.width, 389, 391, '390 open menu width');
    near(drawer.y, headerBottom - 1, headerBottom + 2, '390 open menu top');
    near(drawer.height, 195, 220, '390 open menu height');
    assert.equal(await page.locator('[data-rosa-preview-menu-drawer] nav a').count(), 5, '390 open menu must retain the target five-row density');
    await page.close();
  }

  process.stdout.write('PASS: client preview Homepage matches measured MedicaShop geometry contracts\n');
} finally {
  await browser.close();
}
