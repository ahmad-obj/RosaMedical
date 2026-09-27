import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];

const browser = await chromium.launch(launchOptions);

try {
  for (const [path, expectedDirection] of [['/shop/', 'ltr'], ['/ar/shop/', 'rtl']]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${path} returned HTTP ${response?.status() ?? 'no response'}`);
    assert.equal(await page.locator('html').getAttribute('dir'), expectedDirection, `${path} direction mismatch`);

    const toggle = page.locator('[data-rosa-filter-toggle]');
    const drawer = page.locator('[data-rosa-shop-sidebar]');
    const close = page.locator('[data-rosa-filter-close]');
    const backdrop = page.locator('.rosa-shop-sidebar-backdrop');
    assert.equal(await toggle.getAttribute('aria-controls'), await drawer.getAttribute('id'), `${path} filter trigger must identify its controlled drawer`);
    await toggle.click();
    await drawer.waitFor({ state: 'visible' });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `${path} opening filters must update aria-expanded`);
    assert.equal(await drawer.getAttribute('role'), 'dialog', `${path} mobile filters must expose dialog semantics`);
    assert.equal(await drawer.getAttribute('aria-modal'), 'true', `${path} mobile filters must announce modal interaction`);
    assert.equal(await close.evaluate((element) => document.activeElement === element), true, `${path} mobile filter close control must receive initial focus`);

    const box = await drawer.boundingBox();
    assert.ok(box && box.width >= 300 && box.height >= 800, `${path} mobile filter drawer must remain usable at 390px`);
    if (expectedDirection === 'rtl') assert.ok(box.x > 0, `${path} RTL filter drawer must originate from inline end`);
    else assert.ok(box.x <= 1, `${path} LTR filter drawer must originate from inline start`);

    const focusables = drawer.locator('button:not([disabled]),input:not([disabled]),a[href],select:not([disabled]),[tabindex]:not([tabindex="-1"])');
    const first = focusables.first();
    const last = focusables.last();
    await first.focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await last.evaluate((element) => document.activeElement === element), true, `${path} Shift+Tab must remain inside mobile filters`);
    await page.keyboard.press('Tab');
    assert.equal(await first.evaluate((element) => document.activeElement === element), true, `${path} Tab must remain inside mobile filters`);

    await page.keyboard.press('Escape');
    await drawer.waitFor({ state: 'hidden' });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `${path} Escape must close mobile filters`);
    assert.equal(await toggle.evaluate((element) => document.activeElement === element), true, `${path} Escape must restore focus to filter trigger`);

    await toggle.click();
    await backdrop.click({ position: { x: 380, y: 820 } });
    await drawer.waitFor({ state: 'hidden' });
    assert.equal(await toggle.evaluate((element) => document.activeElement === element), true, `${path} backdrop close must restore focus to filter trigger`);

    const overflow = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(overflow.scroll <= overflow.client + 1, `${path} mobile filter interaction must not create horizontal overflow`);
    await page.close();
  }
  process.stdout.write('PASS: EN/AR mobile catalogue filters provide semantic, focus-contained, RTL-aware modal interaction\n');
} finally {
  await browser.close();
}
