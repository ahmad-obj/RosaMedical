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

function visibleLabelText(element) {
  const labels = element.labels ? Array.from(element.labels) : [];
  return labels.map((label) => (label.textContent || '').trim()).filter(Boolean).join(' ')
    || element.getAttribute('aria-label')
    || element.getAttribute('placeholder')
    || '';
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
    assert.equal(
      await banner.count(),
      1,
      `${context} must render exactly one shared newsletter signup banner`,
    );
    await banner.waitFor({ state: 'visible' });

    const form = banner.locator('form[data-rosa-newsletter-form]');
    assert.equal(await form.count(), 1, `${context} newsletter banner must expose one semantic form`);

    const name = form.locator('input[name="name"]');
    const email = form.locator('input[name="email"]');
    const submit = form.locator('button[type="submit"], input[type="submit"]');

    assert.equal(await name.count(), 1, `${context} newsletter must expose one Name control`);
    assert.equal(await email.count(), 1, `${context} newsletter must expose one Email control`);
    assert.equal(await submit.count(), 1, `${context} newsletter must expose one Sign Up submit control`);

    assert.equal((await name.getAttribute('type')) || 'text', 'text', `${context} Name control must be text input`);
    assert.equal(await email.getAttribute('type'), 'email', `${context} Email control must use type=email`);
    assert.notEqual(await name.getAttribute('required'), null, `${context} Name control must be required`);
    assert.notEqual(await email.getAttribute('required'), null, `${context} Email control must be required`);
    assert.equal(await email.getAttribute('autocomplete'), 'email', `${context} Email control must expose email autocomplete`);

    const semantics = await form.evaluate((element) => {
      const nameInput = element.querySelector('input[name="name"]');
      const emailInput = element.querySelector('input[name="email"]');
      const submitControl = element.querySelector('button[type="submit"], input[type="submit"]');
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

    if (viewport.width >= 1024) {
      const centers = [semantics.nameRect, semantics.emailRect, semantics.submitRect]
        .map((box) => box.y + (box.height / 2));
      assert.ok(
        Math.max(...centers) - Math.min(...centers) <= 8,
        `${context} desktop Name, Email and Sign Up controls must align as one row`,
      );
    }

    if (viewport.width <= 430) {
      assert.ok(
        semantics.nameRect.bottom <= semantics.emailRect.y + 1,
        `${context} mobile Name control must stack before Email`,
      );
      assert.ok(
        semantics.emailRect.bottom <= semantics.submitRect.y + 1,
        `${context} mobile Email control must stack before Sign Up`,
      );
    }

    assert.equal(
      await banner.locator('.rosa-preview-prefooter__actions').count(),
      0,
      `${context} must remove the old quote-prefooter action cluster`,
    );
    assert.equal(
      await banner.locator('a[href*="#inquiry"]').count(),
      0,
      `${context} newsletter banner must not retain old quotation links`,
    );

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

    assert.ok(
      placement.bannerBottom <= placement.footerTop + 2,
      `${context} newsletter banner must stay immediately before the shared footer`,
    );
    assert.ok(
      placement.scrollWidth <= placement.clientWidth + 1,
      `${context} newsletter banner causes horizontal overflow: ${placement.scrollWidth} > ${placement.clientWidth}`,
    );
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

  process.stdout.write('PASS: shared EN/AR newsletter banner exposes accessible Name, Email and Sign Up controls with responsive layout and no legacy quote-prefooter actions across primary routes\n');
} finally {
  await browser.close();
}
