import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');

function near(value, expected, tolerance, label) {
  assert.ok(
    Math.abs(value - expected) <= tolerance,
    `${label}: expected ${expected}±${tolerance}px, received ${value}px`,
  );
}

async function load(browser, pathname, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(new URL(pathname, baseUrl).href, { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  assert.deepEqual(errors, [], `${pathname} emitted browser errors`);
  return page;
}

async function height(page, selector, label = selector) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible' });
  const box = await locator.boundingBox();
  assert.ok(box, `${label} has no rendered box`);
  return box.height;
}

async function combinedHeight(page, startSelector, endSelector, label) {
  const start = await page.locator(startSelector).first().boundingBox();
  const end = await page.locator(endSelector).first().boundingBox();
  assert.ok(start && end, `${label} geometry missing`);
  return (end.y + end.height) - start.y;
}

async function horizontalColumnCount(locator) {
  const boxes = await locator.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, width: rect.width, height: rect.height };
  }).filter(({ width, height }) => width > 0 && height > 0));
  assert.ok(boxes.length > 0, 'expected at least one visible item');

  const columns = [];
  for (const { x } of boxes.sort((a, b) => a.x - b.x)) {
    if (!columns.some((existing) => Math.abs(existing - x) <= 2)) columns.push(x);
  }
  return columns.length;
}

async function documentHeight(page) {
  return page.evaluate(() => document.documentElement.scrollHeight);
}

async function noOverflow(page, label) {
  const size = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(size.scroll <= size.client + 1, `${label} horizontally overflows: ${size.scroll} > ${size.client}`);
}

async function assertWhySplit(page, path, expectedColumns, viewportLabel) {
  assert.equal(
    await page.locator('[data-preview-why-us] .rosa-preview-about-why__layout').count(),
    1,
    `${path} Why Rosa must expose the frozen-live split composition at ${viewportLabel}`,
  );
  assert.equal(
    await horizontalColumnCount(page.locator('[data-preview-why-us] .rosa-preview-about-why__layout > *')),
    expectedColumns,
    `${path} Why Rosa split column count mismatch at ${viewportLabel}`,
  );
}

async function assertDesktop(page, path) {
  near(await documentHeight(page), 4607, 20, `${path} frozen-live full-page height at 1440`);
  near(await height(page, '[data-preview-page-hero]'), 335, 15, `${path} About hero height at 1440`);
  near(
    await combinedHeight(page, '[data-preview-who-we-are]', '[data-preview-stats]', `${path} Who + stats band`),
    744,
    24,
    `${path} Who + stats visual band at 1440`,
  );
  near(await height(page, '[data-preview-about-cards]'), 642, 24, `${path} information-card band at 1440`);
  near(await height(page, '[data-preview-feature-banner]'), 546, 16, `${path} feature band at 1440`);
  near(await height(page, '[data-preview-why-us]'), 767, 24, `${path} Why Rosa band at 1440`);
  await assertWhySplit(page, path, 2, '1440');
  near(await height(page, '[data-preview-family-strip]'), 856, 28, `${path} evidence + proof surface at 1440`);
  await noOverflow(page, `${path} 1440`);
}

async function assertTablet(page, path) {
  near(await documentHeight(page), 4562, 24, `${path} frozen-live full-page height at 1024`);
  near(await height(page, '[data-preview-page-hero]'), 241, 16, `${path} About hero height at 1024`);
  await noOverflow(page, `${path} 1024`);
}

async function assertWideMobile(page, path) {
  near(await documentHeight(page), 5888, 24, `${path} frozen-live full-page height at 431`);
  await noOverflow(page, `${path} 431`);
}

async function assertMobile(page, path) {
  near(await documentHeight(page), 6007, 24, `${path} frozen-live full-page height at 390`);
  near(await height(page, '[data-preview-page-hero]'), 241, 16, `${path} About hero height at 390`);
  near(
    await combinedHeight(page, '[data-preview-who-we-are]', '[data-preview-stats]', `${path} Who + stats band`),
    754,
    28,
    `${path} Who + stats visual band at 390`,
  );
  near(await height(page, '[data-preview-about-cards]'), 1591, 36, `${path} information-card band at 390`);
  near(await height(page, '[data-preview-feature-banner]'), 375, 18, `${path} feature band at 390`);
  near(await height(page, '[data-preview-why-us]'), 998, 28, `${path} Why Rosa band at 390`);
  await assertWhySplit(page, path, 1, '390');
  near(await height(page, '[data-preview-family-strip]'), 646, 28, `${path} evidence + proof surface at 390`);
  await noOverflow(page, `${path} 390`);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const path of ['/about/', '/ar/about/']) {
    const desktop = await load(browser, path, { width: 1440, height: 900 });
    await assertDesktop(desktop, path);
    await desktop.close();

    const tablet = await load(browser, path, { width: 1024, height: 768 });
    await assertTablet(tablet, path);
    await tablet.close();

    const wideMobile = await load(browser, path, { width: 431, height: 932 });
    await assertWideMobile(wideMobile, path);
    await wideMobile.close();

    const mobile = await load(browser, path, { width: 390, height: 844 });
    await assertMobile(mobile, path);
    await mobile.close();
  }

  process.stdout.write('PASS: About matches frozen-live desktop/tablet/mobile composition geometry\n');
} finally {
  await browser.close();
}
