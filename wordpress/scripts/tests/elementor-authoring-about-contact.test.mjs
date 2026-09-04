import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });
const route = (path) => new URL(path, baseUrl).href;

async function load(path, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const forbidden = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => {
    if (/preview\.themeforest\.net|fullkit\.moxcreative\.com|elementor[ -]?pro|elements?kit|skyboot/i.test(request.url())) forbidden.push(request.url());
  });
  await page.goto(route(path), { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  assert.deepEqual(errors, [], `${path} emitted browser errors`);
  assert.deepEqual(forbidden, [], `${path} requested forbidden/proprietary resources`);
  return page;
}

async function noOverflow(page, label) {
  const size = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(size.scroll <= size.client + 1, `${label} overflows horizontally: ${size.scroll} > ${size.client}`);
}

async function columnCount(locator) {
  const boxes = await locator.evaluateAll((elements) => elements.filter((element) => element.checkVisibility()).map((element) => {
    const bounds = element.getBoundingClientRect();
    return { x: Math.round(bounds.x), y: Math.round(bounds.y) };
  }));
  assert.ok(boxes.length > 0, 'expected at least one visible grid item');
  const firstRowY = Math.min(...boxes.map(({ y }) => y));
  return boxes.filter(({ y }) => Math.abs(y - firstRowY) <= 2).length;
}

async function assertAuthoringShell(page, path, lang, dir) {
  assert.equal(await page.locator('main').count(), 1, `${path} must keep exactly one Rosa main landmark`);
  assert.equal(await page.locator('.rosa-elementor-authoring').count(), 1, `${path} must render one Elementor authoring body wrapper`);
  assert.equal(await page.locator('.rosa-elementor-root').count(), 1, `${path} must render one deterministic Rosa Elementor root`);
  assert.equal(await page.locator('[data-preview-contact-cta]').count(), 1, `${path} must preserve exactly one shared pre-footer CTA wrapper`);
  assert.equal(await page.locator('html').getAttribute('lang'), lang, `${path} lang mismatch`);
  assert.equal(await page.locator('html').getAttribute('dir'), dir, `${path} dir mismatch`);
  await noOverflow(page, path);

  const wrapper = await page.locator('.rosa-elementor-authoring').boundingBox();
  const root = await page.locator('.rosa-elementor-root').boundingBox();
  assert.ok(wrapper && root, `${path} authoring/root geometry missing`);
  assert.ok(Math.abs(wrapper.x - root.x) <= 1, `${path} Elementor root introduced inline offset`);
  assert.ok(Math.abs(wrapper.width - root.width) <= 1, `${path} Elementor root changed content width`);
  const rootStyle = await page.locator('.rosa-elementor-root').evaluate((element) => {
    const style = getComputedStyle(element);
    return { paddingTop: style.paddingTop, paddingRight: style.paddingRight, paddingBottom: style.paddingBottom, paddingLeft: style.paddingLeft, gap: style.gap };
  });
  assert.deepEqual(
    [rootStyle.paddingTop, rootStyle.paddingRight, rootStyle.paddingBottom, rootStyle.paddingLeft],
    ['0px', '0px', '0px', '0px'],
    `${path} Elementor root introduced padding`,
  );
  assert.match(rootStyle.gap, /^(0px|normal)$/, `${path} Elementor root introduced a section gap: ${rootStyle.gap}`);
}

async function assertAbout(page, path, desktop, viewportWidth) {
  const selectors = [
    '[data-preview-page-hero]',
    '[data-preview-who-we-are]',
    '[data-preview-stats]',
    '[data-preview-about-cards]',
    '[data-preview-feature-banner]',
    '[data-preview-why-us]',
    '[data-preview-family-strip]',
    '[data-preview-proof-role]',
  ];
  for (const selector of selectors) assert.equal(await page.locator(selector).count(), 1, `${path} missing/duplicated About section ${selector}`);
  assert.equal(await columnCount(page.locator('.rosa-preview-about-cards__grid > article')), desktop ? 3 : 1, `${path} About cards column count mismatch`);
  assert.equal(await page.locator('[data-preview-stats] .rosa-preview-stats__grid > div').count(), 3, `${path} About statistics count changed`);

  if (path === '/ar/about/' && desktop) {
    const expectedInlineEnd = viewportWidth <= 1024 ? '42px' : '74px';
    const copyPadding = await page.locator('[data-preview-who-we-are] .rosa-preview-split__grid > div:last-child').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        paddingInlineStart: style.paddingInlineStart,
        paddingInlineEnd: style.paddingInlineEnd,
      };
    });
    assert.equal(copyPadding.paddingInlineStart, '0px', `${path} Who copy must not pad the inline start in RTL`);
    assert.equal(copyPadding.paddingInlineEnd, expectedInlineEnd, `${path} Who copy must preserve finished-template logical inline-end padding`);
  }
}

async function assertContact(page, path, desktop) {
  for (const selector of ['[data-preview-page-hero]', '[data-preview-contact-layout]', '[data-preview-map-role]']) {
    assert.equal(await page.locator(selector).count(), 1, `${path} missing/duplicated Contact section ${selector}`);
  }
  assert.equal(await columnCount(page.locator('.rosa-preview-contact__grid > *')), desktop ? 2 : 1, `${path} Contact primary column count mismatch`);
  assert.equal(await columnCount(page.locator('.rosa-preview-contact-form > label')), desktop ? 2 : 1, `${path} Contact form first-row column count mismatch`);
  assert.equal(await page.locator('.rosa-preview-contact-form').getAttribute('action'), null, `${path} must not introduce a form submission backend`);
  assert.equal(await page.locator('.rosa-preview-contact-form .rosa-preview-button[href^="mailto:"]').count(), 1, `${path} must preserve the mailto contact action`);
}

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    const desktop = viewport.width > 768;
    for (const [path, type, lang, dir] of [
      ['/about/', 'about', 'en-US', 'ltr'],
      ['/contact/', 'contact', 'en-US', 'ltr'],
      ['/ar/about/', 'about', 'ar', 'rtl'],
      ['/ar/contact/', 'contact', 'ar', 'rtl'],
    ]) {
      const page = await load(path, viewport);
      await assertAuthoringShell(page, path, lang, dir);
      if (type === 'about') await assertAbout(page, path, desktop, viewport.width);
      else await assertContact(page, path, desktop);
      await page.close();
    }
  }

  process.stdout.write('PASS: Elementor About/Contact finished-template topology, responsive geometry and RTL contracts\n');
} finally {
  await browser.close();
}
