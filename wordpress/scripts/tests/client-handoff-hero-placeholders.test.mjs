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
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

const surfaces = [
  {
    label: 'Home EN',
    path: '/',
    heroSelector: '.rosa-preview-hero, [data-latest-rosa-home-hero]',
    imageSelector: '.rosa-preview-hero .rosa-restored-hero__media img, [data-latest-rosa-home-hero] .public-hero-carousel__picture img',
    overlaySelector: '.rosa-preview-hero .rosa-restored-hero__overlay, [data-latest-rosa-home-hero] .public-hero-carousel__overlay',
    textSelectors: [
      '.rosa-preview-hero .rosa-preview-eyebrow, [data-latest-rosa-home-hero] .public-eyebrow',
      '.rosa-preview-hero h1, [data-latest-rosa-home-hero] h1',
      '.rosa-preview-hero__copy > p:not(.rosa-preview-eyebrow), [data-latest-rosa-home-hero] .public-hero-carousel__copy-text',
    ],
  },
  {
    label: 'Home AR',
    path: '/ar/',
    heroSelector: '.rosa-preview-hero, [data-latest-rosa-home-hero]',
    imageSelector: '.rosa-preview-hero .rosa-restored-hero__media img, [data-latest-rosa-home-hero] .public-hero-carousel__picture img',
    overlaySelector: '.rosa-preview-hero .rosa-restored-hero__overlay, [data-latest-rosa-home-hero] .public-hero-carousel__overlay',
    textSelectors: [
      '.rosa-preview-hero .rosa-preview-eyebrow, [data-latest-rosa-home-hero] .public-eyebrow',
      '.rosa-preview-hero h1, [data-latest-rosa-home-hero] h1',
      '.rosa-preview-hero__copy > p:not(.rosa-preview-eyebrow), [data-latest-rosa-home-hero] .public-hero-carousel__copy-text',
    ],
  },
  {
    label: 'About EN',
    path: '/about/',
    heroSelector: '[data-preview-page-hero]',
    imageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img',
    overlaySelector: '[data-preview-page-hero]',
    overlayPseudo: '::after',
    textSelectors: [
      '[data-preview-page-hero] .rosa-preview-eyebrow',
      '[data-preview-page-hero] h1',
      '[data-preview-page-hero] > .rosa-preview-rail > p:last-child',
    ],
  },
  {
    label: 'About AR',
    path: '/ar/about/',
    heroSelector: '[data-preview-page-hero]',
    imageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img',
    overlaySelector: '[data-preview-page-hero]',
    overlayPseudo: '::after',
    textSelectors: [
      '[data-preview-page-hero] .rosa-preview-eyebrow',
      '[data-preview-page-hero] h1',
      '[data-preview-page-hero] > .rosa-preview-rail > p:last-child',
    ],
  },
  {
    label: 'Contact EN',
    path: '/contact/',
    heroSelector: '[data-preview-page-hero]',
    imageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img',
    overlaySelector: '[data-preview-page-hero]',
    overlayPseudo: '::after',
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
    imageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img',
    overlaySelector: '[data-preview-page-hero]',
    overlayPseudo: '::after',
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

function assertNeutralOverlay(backgroundImage, context) {
  assert.notEqual(backgroundImage, 'none', `${context} must retain a readability scrim over photography`);
  assert.doesNotMatch(backgroundImage, /rgba?\(\s*(?:18[0-9]|19[0-9]|2[0-5][0-9])[, ]+\s*(?:0|[1-9]|1[0-9]|2[0-9])[, ]+\s*(?:0|[1-9]|1[0-9]|2[0-9])/i,
    `${context} must not contain a red photographic wash: ${backgroundImage}`);
}

async function inspectSurface(browser, surface, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(surface.path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${surface.path} returned ${response?.status() ?? 'no response'}`);
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));

  await page.locator(surface.heroSelector).first().waitFor({ state: 'visible' });
  await page.locator(surface.imageSelector).first().waitFor({ state: 'visible' });

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
        backgroundImage: style.backgroundImage,
        color: style.color,
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
      };
    };

    const hero = document.querySelector(spec.heroSelector);
    const image = document.querySelector(spec.imageSelector);
    const overlay = document.querySelector(spec.overlaySelector);
    if (!hero || !(image instanceof HTMLImageElement) || !overlay) return { missing: true };

    const text = spec.textSelectors.map((selector) => {
      const element = document.querySelector(selector);
      return element ? {
        selector,
        rect: rect(element),
        style: styleSnapshot(element),
        text: (element.textContent || '').trim(),
      } : { selector, missing: true };
    });

    return {
      missing: false,
      heroRect: rect(hero),
      imageRect: rect(image),
      imageStyle: styleSnapshot(image),
      imageComplete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      currentSrc: image.currentSrc || image.src,
      overlayStyle: styleSnapshot(overlay, spec.overlayPseudo || null),
      text,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    };
  }, surface);

  assert.equal(state.missing, false, `${surface.label} must expose its hero, image and readability overlay`);
  const context = `${surface.label} ${surface.path} ${viewport.width}x${viewport.height}`;

  assert.ok(state.imageComplete && state.naturalWidth > 0 && state.naturalHeight > 0,
    `${context} hero image failed to load: ${state.currentSrc}`);
  assert.equal(state.imageStyle.objectFit, 'cover',
    `${context} hero image must use deliberate cover cropping; got ${state.imageStyle.objectFit}`);
  assert.notEqual(state.imageStyle.objectPosition, '',
    `${context} hero image must expose an explicit focal position`);

  assert.ok(state.heroRect.height >= 180, `${context} hero geometry collapsed to ${state.heroRect.height.toFixed(1)}px tall`);
  assert.ok(Math.abs(state.heroRect.width - state.clientWidth) <= 1,
    `${context} hero must remain full-width; got ${state.heroRect.width.toFixed(1)}px for ${state.clientWidth}px client width`);
  assert.ok(state.imageRect.width >= state.heroRect.width - 2
      && state.imageRect.height >= state.heroRect.height - 2,
    `${context} hero image must fully cover hero geometry`);
  assert.ok(state.scrollWidth <= state.clientWidth + 1,
    `${context} overflows horizontally: ${state.scrollWidth} > ${state.clientWidth}`);

  assertNeutralOverlay(state.overlayStyle.backgroundImage, `${context} overlay`);

  for (const item of state.text) {
    assert.equal(item.missing, undefined, `${context} missing hero foreground ${item.selector}`);
    assert.ok(item.text.length > 0, `${context} hero foreground ${item.selector} must contain text`);
    assert.ok(item.rect.width > 0 && item.rect.height > 0,
      `${context} hero foreground ${item.selector} must remain visible`);
    const foreground = parseColor(item.style.color);
    assert.ok(foreground.a >= 0.65 && luminance(foreground) >= 0.72,
      `${context} hero foreground ${item.selector} must remain light/readable; got ${item.style.color}`);
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

  process.stdout.write('PASS: Home/About/Contact photographic heroes load, crop deliberately, retain neutral readability scrims, and remain overflow-safe across five responsive widths\n');
} finally {
  await browser.close();
}
