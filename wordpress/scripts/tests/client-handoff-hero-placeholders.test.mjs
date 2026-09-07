import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');

const launchOptions = { headless: true };
if (process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1') {
  launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
}

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

const surfaces = [
  {
    label: 'Home EN',
    path: '/',
    heroSelector: '.rosa-preview-hero',
    fieldSelector: '[data-media-slot="home-hero-01"]',
    requirePlaceholderSlot: true,
    textSelectors: [
      '.rosa-preview-hero .rosa-preview-eyebrow',
      '.rosa-preview-hero h1',
      '.rosa-preview-hero__copy > p:not(.rosa-preview-eyebrow)',
    ],
  },
  {
    label: 'Home AR',
    path: '/ar/',
    heroSelector: '.rosa-preview-hero',
    fieldSelector: '[data-media-slot="home-hero-01"]',
    requirePlaceholderSlot: true,
    textSelectors: [
      '.rosa-preview-hero .rosa-preview-eyebrow',
      '.rosa-preview-hero h1',
      '.rosa-preview-hero__copy > p:not(.rosa-preview-eyebrow)',
    ],
  },
  {
    label: 'About EN',
    path: '/about/',
    heroSelector: '[data-preview-page-hero]',
    fieldSelector: '[data-preview-page-hero]',
    textSelectors: [
      '[data-preview-page-hero] .rosa-preview-eyebrow',
      '[data-preview-page-hero] h1',
      '[data-preview-page-hero] > .rosa-preview-rail > p:last-child',
    ],
    neutralSelectors: [
      '[data-media-slot="about_procurement"]',
      '[data-media-slot="about_hospitals"]',
    ],
  },
  {
    label: 'About AR',
    path: '/ar/about/',
    heroSelector: '[data-preview-page-hero]',
    fieldSelector: '[data-preview-page-hero]',
    textSelectors: [
      '[data-preview-page-hero] .rosa-preview-eyebrow',
      '[data-preview-page-hero] h1',
      '[data-preview-page-hero] > .rosa-preview-rail > p:last-child',
    ],
    neutralSelectors: [
      '[data-media-slot="about_procurement"]',
      '[data-media-slot="about_hospitals"]',
    ],
  },
  {
    label: 'Contact EN',
    path: '/contact/',
    heroSelector: '[data-preview-page-hero]',
    fieldSelector: '[data-preview-page-hero]',
    textSelectors: [
      '[data-preview-page-hero] .rosa-preview-eyebrow',
      '[data-preview-page-hero] h1',
      '[data-preview-page-hero] > .rosa-preview-rail > p:last-child',
    ],
  },
  {
    label: 'Contact AR',
    path: '/ar/contact/',
    heroSelector: '[data-preview-page-hero]',
    fieldSelector: '[data-preview-page-hero]',
    textSelectors: [
      '[data-preview-page-hero] .rosa-preview-eyebrow',
      '[data-preview-page-hero] h1',
      '[data-preview-page-hero] > .rosa-preview-rail > p:last-child',
    ],
  },
];

function parseColor(value) {
  const match = String(value).match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
  assert.ok(match, `unable to parse computed color: ${value}`);
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function channelLuminance(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(color) {
  return (0.2126 * channelLuminance(color.r))
    + (0.7152 * channelLuminance(color.g))
    + (0.0722 * channelLuminance(color.b));
}

function isRosaRed(color) {
  return color.a >= 0.95
    && color.r >= 180
    && color.r >= color.g + 100
    && color.r >= color.b + 80;
}

function assertNoPaintedOverlay(pseudo, label) {
  const color = parseColor(pseudo.backgroundColor);
  assert.equal(pseudo.backgroundImage, 'none', `${label} must not paint a gradient/image overlay; got ${pseudo.backgroundImage}`);
  assert.ok(color.a <= 0.01, `${label} must not paint a solid overlay; got ${pseudo.backgroundColor}`);
}

async function inspectSurface(browser, surface, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(surface.path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${surface.path} returned ${response?.status() ?? 'no response'}`);
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));

  await page.locator(surface.heroSelector).first().waitFor({ state: 'visible' });
  await page.locator(surface.fieldSelector).first().waitFor({ state: 'visible' });

  const state = await page.evaluate((spec) => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        right: box.right,
        bottom: box.bottom,
      };
    };
    const styleSnapshot = (element, pseudo = null) => {
      const style = getComputedStyle(element, pseudo);
      return {
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        color: style.color,
        display: style.display,
        visibility: style.visibility,
        opacity: Number.parseFloat(style.opacity || '1'),
      };
    };

    const hero = document.querySelector(spec.heroSelector);
    const field = document.querySelector(spec.fieldSelector);
    if (!hero || !field) return { missing: true };

    const text = spec.textSelectors.map((selector) => {
      const element = document.querySelector(selector);
      return element ? {
        selector,
        rect: rect(element),
        style: styleSnapshot(element),
        text: (element.textContent || '').trim(),
      } : { selector, missing: true };
    });

    const neutral = (spec.neutralSelectors || []).map((selector) => {
      const element = document.querySelector(selector);
      return element ? {
        selector,
        rect: rect(element),
        style: styleSnapshot(element),
      } : { selector, missing: true };
    });

    return {
      missing: false,
      heroRect: rect(hero),
      fieldRect: rect(field),
      fieldStyle: styleSnapshot(field),
      fieldBefore: styleSnapshot(field, '::before'),
      fieldAfter: styleSnapshot(field, '::after'),
      fieldImageCount: field.querySelectorAll('img').length,
      fieldText: (field.textContent || '').trim(),
      text,
      neutral,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    };
  }, surface);

  assert.equal(state.missing, false, `${surface.label} must expose its hero and hero-field selectors`);

  const context = `${surface.label} ${surface.path} ${viewport.width}x${viewport.height}`;
  const fieldColor = parseColor(state.fieldStyle.backgroundColor);
  assert.ok(
    isRosaRed(fieldColor),
    `${context} hero placeholder must use a solid Rosa-red background; got ${state.fieldStyle.backgroundColor}`,
  );
  assert.equal(
    state.fieldStyle.backgroundImage,
    'none',
    `${context} hero placeholder must not use a gradient or background image; got ${state.fieldStyle.backgroundImage}`,
  );
  assertNoPaintedOverlay(state.fieldBefore, `${context} ::before`);
  assertNoPaintedOverlay(state.fieldAfter, `${context} ::after`);

  if (surface.requirePlaceholderSlot) {
    assert.equal(state.fieldImageCount, 0, `${context} future-media hero slot must remain a placeholder until approved media exists`);
    assert.match(state.fieldText, /ROSA/i, `${context} future-media hero slot must retain the restrained ROSA fallback label`);
  }

  assert.ok(state.heroRect.height >= 180, `${context} hero geometry collapsed to ${state.heroRect.height.toFixed(1)}px tall`);
  assert.ok(
    Math.abs(state.heroRect.width - state.clientWidth) <= 1,
    `${context} hero must remain full-width; got ${state.heroRect.width.toFixed(1)}px for ${state.clientWidth}px client width`,
  );
  assert.ok(
    Math.abs(state.fieldRect.x - state.heroRect.x) <= 1
      && Math.abs(state.fieldRect.y - state.heroRect.y) <= 1
      && Math.abs(state.fieldRect.width - state.heroRect.width) <= 1
      && Math.abs(state.fieldRect.height - state.heroRect.height) <= 1,
    `${context} red field must preserve and cover the existing hero geometry`,
  );
  assert.ok(
    state.scrollWidth <= state.clientWidth + 1,
    `${context} overflows horizontally: ${state.scrollWidth} > ${state.clientWidth}`,
  );

  for (const item of state.text) {
    assert.equal(item.missing, undefined, `${context} missing hero foreground ${item.selector}`);
    assert.ok(item.text.length > 0, `${context} hero foreground ${item.selector} must contain text`);
    assert.ok(item.rect.width > 0 && item.rect.height > 0, `${context} hero foreground ${item.selector} must remain visible`);
    const foreground = parseColor(item.style.color);
    assert.ok(
      foreground.a >= 0.65 && luminance(foreground) >= 0.8,
      `${context} hero foreground ${item.selector} must remain light/readable; got ${item.style.color}`,
    );
  }

  for (const neutral of state.neutral) {
    assert.equal(neutral.missing, undefined, `${context} missing protected neutral non-hero slot ${neutral.selector}`);
    assert.ok(neutral.rect.width > 0 && neutral.rect.height > 0, `${context} protected neutral non-hero slot ${neutral.selector} must remain visible`);
    const neutralColor = parseColor(neutral.style.backgroundColor);
    assert.equal(
      isRosaRed(neutralColor),
      false,
      `${context} protected neutral non-hero slot ${neutral.selector} must not inherit the solid hero red`,
    );
    assert.notEqual(
      neutral.style.backgroundImage,
      'none',
      `${context} protected neutral non-hero slot ${neutral.selector} must retain its neutral placeholder treatment`,
    );
  }

  await page.close();
}

const browser = await chromium.launch(launchOptions);
try {
  for (const viewport of viewports) {
    for (const surface of surfaces) {
      await inspectSurface(browser, surface, viewport);
    }
  }

  process.stdout.write('PASS: Home/About/Contact EN/AR future-media hero placeholders render as solid Rosa-red fields with light foreground text and preserved responsive geometry while non-hero placeholders remain neutral\n');
} finally {
  await browser.close();
}
