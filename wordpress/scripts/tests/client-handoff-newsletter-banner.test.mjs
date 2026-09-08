import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productSlug = 'rosa-foundation-stevens-scissors-regular';

const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') {
  launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

const routes = [
  { label: 'Home EN', path: '/', locale: 'en', lang: 'en-US', dir: 'ltr' },
  { label: 'About EN', path: '/about/', locale: 'en', lang: 'en-US', dir: 'ltr' },
  { label: 'Contact EN', path: '/contact/', locale: 'en', lang: 'en-US', dir: 'ltr' },
  { label: 'Shop EN', path: '/shop/', locale: 'en', lang: 'en-US', dir: 'ltr' },
  { label: 'Product EN', path: `/product/${productSlug}/`, locale: 'en', lang: 'en-US', dir: 'ltr' },
  { label: 'Home AR', path: '/ar/', locale: 'ar', lang: 'ar', dir: 'rtl' },
  { label: 'About AR', path: '/ar/about/', locale: 'ar', lang: 'ar', dir: 'rtl' },
  { label: 'Contact AR', path: '/ar/contact/', locale: 'ar', lang: 'ar', dir: 'rtl' },
  { label: 'Shop AR', path: '/ar/shop/', locale: 'ar', lang: 'ar', dir: 'rtl' },
  { label: 'Product AR', path: `/ar/product/${productSlug}/`, locale: 'ar', lang: 'ar', dir: 'rtl' },
];

function rgbChannels(value) {
  const match = String(value).match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/i);
  return match ? match.slice(1, 4).map(Number) : [];
}

async function assertNewsletter(browser, route, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const context = `${route.label} ${route.path} ${viewport.width}x${viewport.height}`;

  try {
    const response = await page.goto(new URL(route.path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
    assert.ok(response?.ok(), `${context} returned HTTP ${response?.status() ?? 'no response'}`);
    await settlePageMedia(page, { scrollDelayMs: 10 });

    assert.equal(await page.locator('html').getAttribute('lang'), route.lang, `${context} lang mismatch`);
    assert.equal(await page.locator('html').getAttribute('dir'), route.dir, `${context} dir mismatch`);

    const banner = page.locator('[data-rosa-newsletter-banner]');
    assert.equal(await banner.count(), 1, `${context} must render exactly one shared newsletter signup banner`);
    await banner.waitFor({ state: 'visible' });

    const form = banner.locator('form[data-rosa-newsletter-form]');
    assert.equal(await form.count(), 1, `${context} newsletter banner must expose one semantic form`);

    const name = form.locator('input[name="name"]');
    const email = form.locator('input[name="email"]');
    const submit = form.locator('button[type="submit"], input[type="submit"]');
    const media = banner.locator('.rosa-preview-newsletter__media');
    const content = banner.locator('.rosa-preview-newsletter__content');

    assert.equal(await name.count(), 1, `${context} newsletter must expose one Name control`);
    assert.equal(await email.count(), 1, `${context} newsletter must expose one Email control`);
    assert.equal(await submit.count(), 1, `${context} newsletter must expose one Sign Up submit control`);
    assert.equal(await media.count(), 1, `${context} newsletter must expose one dedicated media placeholder`);
    assert.equal(await banner.locator('.rosa-preview-newsletter__eyebrow').count(), 0, `${context} reference-style newsletter must not retain the old eyebrow row`);

    assert.equal((await name.getAttribute('type')) || 'text', 'text', `${context} Name control must be text input`);
    assert.equal(await email.getAttribute('type'), 'email', `${context} Email control must use type=email`);
    assert.notEqual(await name.getAttribute('required'), null, `${context} Name control must be required`);
    assert.notEqual(await email.getAttribute('required'), null, `${context} Email control must be required`);
    assert.equal(await email.getAttribute('autocomplete'), 'email', `${context} Email control must expose email autocomplete`);

    const semantics = await form.evaluate((element) => {
      const nameInput = element.querySelector('input[name="name"]');
      const emailInput = element.querySelector('input[name="email"]');
      const submitControl = element.querySelector('button[type="submit"], input[type="submit"]');
      const visibleLabelText = (control) => {
        const labels = control.labels ? Array.from(control.labels) : [];
        return labels.map((label) => (label.textContent || '').trim()).filter(Boolean).join(' ')
          || control.getAttribute('aria-label')
          || control.getAttribute('placeholder')
          || '';
      };
      const rect = (node) => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
      };
      return {
        nameLabel: visibleLabelText(nameInput),
        emailLabel: visibleLabelText(emailInput),
        submitText: submitControl.tagName === 'INPUT'
          ? (submitControl.getAttribute('value') || '').trim()
          : (submitControl.textContent || '').trim(),
        nameRect: rect(nameInput),
        emailRect: rect(emailInput),
        submitRect: rect(submitControl),
      };
    });

    assert.ok(semantics.nameLabel.length > 0, `${context} Name control must have an accessible label`);
    assert.ok(semantics.emailLabel.length > 0, `${context} Email control must have an accessible label`);
    assert.ok(semantics.submitText.length > 0, `${context} Sign Up control must expose visible text`);

    if (route.locale === 'en') {
      assert.match(semantics.nameLabel, /name/i, `${context} English Name control label mismatch`);
      assert.match(semantics.emailLabel, /email/i, `${context} English Email control label mismatch`);
      assert.match(semantics.submitText, /sign\s*up|subscribe/i, `${context} English signup action mismatch`);
    } else {
      assert.match(semantics.nameLabel, /[\u0600-\u06ff]/, `${context} Arabic Name control must expose Arabic copy`);
      assert.match(semantics.emailLabel, /[\u0600-\u06ff]/, `${context} Arabic Email control must expose Arabic copy`);
      assert.match(semantics.submitText, /[\u0600-\u06ff]/, `${context} Arabic signup action must expose Arabic copy`);
    }

    for (const [label, box] of [
      ['Name', semantics.nameRect],
      ['Email', semantics.emailRect],
      ['Sign Up', semantics.submitRect],
    ]) {
      assert.ok(box.width >= 44 && box.height >= 44, `${context} ${label} control must keep a 44px minimum target`);
    }

    const visual = await page.evaluate(() => {
      const bannerNode = document.querySelector('[data-rosa-newsletter-banner]');
      const contentNode = bannerNode.querySelector('.rosa-preview-newsletter__content');
      const formNode = bannerNode.querySelector('.rosa-preview-newsletter__form');
      const mediaNode = bannerNode.querySelector('.rosa-preview-newsletter__media');
      const submitNode = formNode.querySelector('button[type="submit"], input[type="submit"]');
      const rect = (node) => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
      };
      return {
        bannerBackground: getComputedStyle(bannerNode).backgroundColor,
        submitBackground: getComputedStyle(submitNode).backgroundColor,
        submitColor: getComputedStyle(submitNode).color,
        contentRect: rect(contentNode),
        formRect: rect(formNode),
        mediaRect: rect(mediaNode),
      };
    });

    const bannerRgb = rgbChannels(visual.bannerBackground);
    assert.equal(bannerRgb.length, 3, `${context} newsletter background must resolve to RGB`);
    assert.ok(bannerRgb.every((channel) => channel >= 235), `${context} newsletter must use a light neutral Rosa-adapted background; got ${visual.bannerBackground}`);
    assert.match(visual.submitBackground, /rgb\(224, 8, 21\)|rgb\(185, 10, 20\)/, `${context} Sign Up button must use Rosa red; got ${visual.submitBackground}`);
    assert.match(visual.submitColor, /rgb\(255, 255, 255\)/, `${context} Sign Up button text must remain white`);

    const mediaBox = await media.boundingBox();
    assert.ok(mediaBox && mediaBox.width >= 90 && mediaBox.height >= 90, `${context} media placeholder must remain visibly present`);

    if (viewport.width >= 1024) {
      const inputCenters = [semantics.nameRect, semantics.emailRect].map((box) => box.y + (box.height / 2));
      assert.ok(Math.max(...inputCenters) - Math.min(...inputCenters) <= 8, `${context} desktop Name and Email controls must share the first form row`);
      assert.ok(semantics.submitRect.y >= Math.max(semantics.nameRect.bottom, semantics.emailRect.bottom) + 6, `${context} desktop Sign Up control must occupy a second row below Name and Email`);
      const fieldSpan = Math.max(semantics.nameRect.right, semantics.emailRect.right) - Math.min(semantics.nameRect.x, semantics.emailRect.x);
      assert.ok(semantics.submitRect.width >= fieldSpan - 4, `${context} desktop Sign Up control must span the full two-field form width`);

      if (route.dir === 'ltr') {
        assert.ok(visual.contentRect.right <= visual.formRect.x + 2, `${context} desktop text block must sit before the form`);
        assert.ok(visual.formRect.right <= visual.mediaRect.x + 2, `${context} desktop media must sit to the right of the form`);
      } else {
        assert.ok(visual.mediaRect.right <= visual.formRect.x + 2, `${context} RTL desktop media must mirror to the left of the form`);
        assert.ok(visual.formRect.right <= visual.contentRect.x + 2, `${context} RTL desktop text block must mirror after the form`);
      }
    }

    if (viewport.width <= 430) {
      assert.ok(semantics.nameRect.bottom <= semantics.emailRect.y + 1, `${context} mobile Name control must stack before Email`);
      assert.ok(semantics.emailRect.bottom <= semantics.submitRect.y + 1, `${context} mobile Email control must stack before Sign Up`);
      assert.ok(mediaBox.y >= semantics.submitRect.bottom - 1, `${context} mobile media placeholder must stack beneath the signup form`);
    }

    assert.equal(await banner.locator('.rosa-preview-prefooter__actions').count(), 0, `${context} must remove the old quote-prefooter action cluster`);
    assert.equal(await banner.locator('a[href*="#inquiry"]').count(), 0, `${context} newsletter banner must not retain old quotation links`);

    const placement = await page.evaluate(() => {
      const bannerNode = document.querySelector('[data-rosa-newsletter-banner]');
      const footerNode = document.querySelector('[data-rosa-preview-footer]');
      const bannerBox = bannerNode.getBoundingClientRect();
      const footerBox = footerNode.getBoundingClientRect();
      return {
        bannerBottom: bannerBox.bottom + window.scrollY,
        footerTop: footerBox.top + window.scrollY,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    assert.ok(placement.bannerBottom <= placement.footerTop + 2, `${context} newsletter banner must stay immediately before the shared footer`);
    assert.ok(placement.scrollWidth <= placement.clientWidth + 1, `${context} newsletter banner causes horizontal overflow: ${placement.scrollWidth} > ${placement.clientWidth}`);
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch(launchOptions);
try {
  for (const viewport of viewports) {
    for (const route of routes) {
      await assertNewsletter(browser, route, viewport);
    }
  }

  process.stdout.write('PASS: shared EN/AR newsletter banner matches the reference-style text, two-field form, full-width Rosa CTA and media layout with responsive stacking across primary routes\n');
} finally {
  await browser.close();
}
