import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const route = (path) => new URL(path, baseUrl).href;
const browser = await chromium.launch({ headless: true });

async function load(page, path) {
  await page.goto(route(path), { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 20 });
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(dimensions.scroll <= dimensions.client + 1, `${label} has horizontal overflow: ${dimensions.scroll} > ${dimensions.client}`);
}

async function assertTarget(page, selector, label) {
  const target = page.locator(selector).first();
  await target.waitFor({ state: 'visible' });
  const box = await target.boundingBox();
  assert.ok(box && box.height >= 44, `${label} target height is below 44px`);
}

async function assertFocusVisible(page, selector, label) {
  const target = page.locator(selector).first();
  await page.keyboard.press('Tab');
  await target.focus();
  const outline = await target.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  assert.notEqual(outline.style, 'none', `${label} has no visible focus outline`);
  assert.ok(outline.width > 0, `${label} focus outline has zero width`);
}

try {
  const surfaces = [
    ['English Home desktop', '/', { width: 1366, height: 768 }, 'en-US', 'ltr'],
    ['English Shop mobile', '/shop/', { width: 390, height: 844 }, 'en-US', 'ltr'],
    ['Arabic Home desktop', '/ar/', { width: 1366, height: 768 }, 'ar', 'rtl'],
    ['Arabic Contact mobile', '/ar/contact/', { width: 390, height: 844 }, 'ar', 'rtl'],
  ];

  for (const [label, path, viewport, lang, dir] of surfaces) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    const forbidden = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', (request) => {
      if (/preview\.themeforest\.net|fullkit\.moxcreative\.com|elementor[ -]?pro|elements-kit|skyboot/i.test(request.url())) {
        forbidden.push(request.url());
      }
    });
    await load(page, path);
    assert.equal(await page.locator('html').getAttribute('lang'), lang, `${label} lang mismatch`);
    assert.equal(await page.locator('html').getAttribute('dir'), dir, `${label} dir mismatch`);
    await assertNoHorizontalOverflow(page, label);
    assert.deepEqual(errors, [], `${label} emitted browser errors`);
    assert.deepEqual(forbidden, [], `${label} requested a forbidden reference/dependency origin`);
    await page.close();
  }

  for (const width of [390, 430]) {
    for (const path of ['/', '/about/', '/contact/', '/shop/', '/ar/', '/ar/about/', '/ar/contact/', '/ar/shop/']) {
      const page = await browser.newPage({ viewport: { width, height: 932 } });
      await load(page, path);
      await assertNoHorizontalOverflow(page, `${path} at ${width}px`);
      await page.close();
    }
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await load(page, '/');
  const trigger = page.locator('[data-rosa-preview-menu-trigger]');
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  let keyboardReachedTrigger = false;
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press('Tab');
    if (await trigger.evaluate((element) => document.activeElement === element)) {
      keyboardReachedTrigger = true;
      break;
    }
  }
  assert.equal(keyboardReachedTrigger, true, 'mobile Menu trigger is not keyboard reachable');
  await page.keyboard.press('Enter');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true', 'drawer aria-expanded did not become true');
  const drawer = page.locator('[data-rosa-preview-menu-drawer]');
  const overlay = page.locator('[data-rosa-preview-menu-overlay]');
  const closeButton = page.locator('[data-rosa-preview-menu-close]');
  await drawer.waitFor({ state: 'visible' });
  const openDrawerBox = await drawer.boundingBox();
  const mobileHeaderBottom = await page.locator('.rosa-preview-header').evaluate((element) => element.getBoundingClientRect().bottom);
  assert.ok(openDrawerBox && openDrawerBox.x <= 1 && openDrawerBox.width >= 389, 'mobile dropdown is not full viewport width');
  assert.ok(Math.abs(openDrawerBox.y - mobileHeaderBottom) <= 2, 'mobile dropdown does not begin immediately below the header');
  assert.equal(await closeButton.evaluate((element) => document.activeElement === element), true, 'drawer did not receive initial focus');
  for (const selector of ['.rosa-preview-announcement', '.rosa-preview-header__inner', '.rosa-site-main', '[data-rosa-preview-footer]']) {
    assert.equal(await page.locator(selector).evaluate((element) => element.inert), true, `${selector} was not inert while drawer was open`);
  }
  const focusables = drawer.locator('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])');
  const first = focusables.first();
  const last = focusables.last();
  await first.focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await last.evaluate((element) => document.activeElement === element), true, 'Shift+Tab did not wrap to final drawer control');
  await page.keyboard.press('Tab');
  assert.equal(await first.evaluate((element) => document.activeElement === element), true, 'Tab did not wrap to first drawer control');
  await page.keyboard.press('Escape');
  await drawer.waitFor({ state: 'hidden' });
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false', 'Escape did not reset aria-expanded');
  assert.equal(await trigger.evaluate((element) => document.activeElement === element), true, 'Escape did not restore focus to trigger');
  assert.equal(await page.locator('html').evaluate((element) => element.classList.contains('rosa-preview-menu-open')), false, 'Escape did not remove scroll lock');

  await trigger.click();
  const reopenedDrawerBox = await drawer.boundingBox();
  assert.ok(reopenedDrawerBox, 'reopened drawer has no box');
  await overlay.click({ position: { x: 5, y: reopenedDrawerBox.height + 5 } });
  await drawer.waitFor({ state: 'hidden' });
  assert.equal(await trigger.evaluate((element) => document.activeElement === element), true, 'overlay close did not restore focus');
  await trigger.click();
  await closeButton.click();
  await drawer.waitFor({ state: 'hidden' });
  assert.equal(await trigger.evaluate((element) => document.activeElement === element), true, 'Close button did not restore focus');
  await trigger.click();
  await drawer.locator('a[href]').first().evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), { once: true }));
  await drawer.locator('a[href]').first().click();
  await drawer.waitFor({ state: 'hidden' });
  assert.equal(await trigger.evaluate((element) => document.activeElement === element), false, 'navigation-link close forced focus restoration');

  await assertTarget(page, '[data-rosa-preview-menu-trigger]', 'Menu trigger');
  await assertFocusVisible(page, '[data-rosa-preview-menu-trigger]', 'Menu trigger');
  await load(page, '/shop/');
  for (const [selector, label] of [
    ['.rosa-preview-product__media', 'product media'],
    ['.rosa-preview-product__action', 'product action'],
    ['.rosa-preview-shop-search input', 'Shop search input'],
    ['.rosa-preview-shop-search button', 'Shop search button'],
    ['.rosa-preview-footer a', 'footer link'],
  ]) {
    await assertTarget(page, selector, label);
    await assertFocusVisible(page, selector, label);
  }
  await load(page, '/contact/');
  for (const [selector, label] of [
    ['.rosa-preview-contact-form input', 'Contact input'],
    ['.rosa-preview-contact-form .rosa-preview-button', 'Contact action'],
  ]) {
    await assertTarget(page, selector, label);
    await assertFocusVisible(page, selector, label);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page, '/');
  const motion = await page.locator('[data-rosa-preview-menu-drawer]').evaluate((element) => {
    const style = getComputedStyle(element);
    return `${style.animationDuration},${style.transitionDuration}`;
  });
  assert.match(motion, /^(0s,0s|0s,0\.01ms)$/, `reduced-motion drawer still animates: ${motion}`);

  await page.addStyleTag({ content: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-block-end:2em!important}' });
  await assertNoHorizontalOverflow(page, 'English Home with text-spacing override');
  await page.close();

  const zoomPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const path of ['/', '/contact/', '/shop/', '/ar/', '/ar/contact/', '/ar/shop/']) {
    await load(zoomPage, path);
    await assertNoHorizontalOverflow(zoomPage, `${path} at 200%-zoom-equivalent reflow width`);
  }
  await zoomPage.close();

  const desktop = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await load(desktop, '/');
  for (const [selector, label] of [
    ['.rosa-preview-nav a', 'primary navigation'],
    ['.rosa-preview-header__actions .rosa-preview-language', 'language switch'],
    ['.rosa-preview-header__actions .rosa-preview-button', 'Inquiry action'],
  ]) await assertFocusVisible(desktop, selector, label);
  await desktop.locator('.rosa-preview-header__actions .rosa-preview-language').click();
  await desktop.waitForURL(/\/ar\/?$/);
  assert.equal(await desktop.locator('html').getAttribute('dir'), 'rtl', 'English-to-Arabic language switch pairing failed');
  const arDrawerPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await load(arDrawerPage, '/ar/');
  await arDrawerPage.locator('[data-rosa-preview-menu-trigger]').click();
  const arDrawerBox = await arDrawerPage.locator('[data-rosa-preview-menu-drawer]').boundingBox();
  assert.ok(arDrawerBox && arDrawerBox.x <= 1, 'Arabic drawer did not originate from inline-end (left in RTL)');
  const enDrawerPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await load(enDrawerPage, '/');
  await enDrawerPage.locator('[data-rosa-preview-menu-trigger]').click();
  const enDrawerBox = await enDrawerPage.locator('[data-rosa-preview-menu-drawer]').boundingBox();
  assert.ok(enDrawerBox && enDrawerBox.x + enDrawerBox.width >= 389, 'English drawer did not originate from inline-end (right in LTR)');
  await Promise.all([desktop.close(), arDrawerPage.close(), enDrawerPage.close()]);

  process.stdout.write('PASS: client preview browser accessibility, interaction, RTL and console acceptance\n');
} finally {
  await browser.close();
}
