import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });

const productSlug = 'rosa-foundation-stevens-scissors-regular';
const routes = [
  '/', '/ar/',
  '/about/', '/ar/about/',
  '/contact/', '/ar/contact/',
  '/shop/', '/ar/shop/',
  `/product/${productSlug}/`, `/ar/product/${productSlug}/`,
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
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

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function isRosaRed(color) {
  return color.a >= 0.95
    && color.r >= 140
    && color.r >= color.g + 55
    && color.r >= color.b + 40;
}

async function load(path, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${path} returned ${response?.status() ?? 'no response'}`);
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => {
    document.addEventListener('click', (event) => event.preventDefault(), true);
    window.scrollTo(0, 0);
  });
  return page;
}

async function markRedInteractives(page) {
  return page.evaluate(() => {
    const parse = (value) => {
      const match = String(value).match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: match[4] === undefined ? 1 : Number(match[4]),
      };
    };
    const isRed = (color) => color
      && color.a >= 0.95
      && color.r >= 140
      && color.r >= color.g + 55
      && color.r >= color.b + 40;

    let index = 0;
    for (const element of document.querySelectorAll('a, button, input[type="submit"], input[type="button"]')) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const text = (element.textContent || element.value || element.getAttribute('aria-label') || '').trim();
      const disabled = element.matches(':disabled,[aria-disabled="true"]');
      if (!text || disabled || rect.width < 24 || rect.height < 24 || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.1) {
        continue;
      }
      if (!isRed(parse(style.backgroundColor))) {
        continue;
      }
      element.setAttribute('data-rosa-contrast-probe', String(index));
      index += 1;
    }
    return index;
  });
}

function sampleIndices(count) {
  if (count <= 8) return Array.from({ length: count }, (_, index) => index);
  return [...new Set([0, 1, 2, 3, Math.floor(count / 2), count - 3, count - 2, count - 1])].sort((a, b) => a - b);
}

async function snapshot(locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
      text: (element.textContent || element.value || element.getAttribute('aria-label') || '').trim(),
    };
  });
}

function assertState(style, state, path, viewport, probeIndex) {
  const foreground = parseColor(style.color);
  const background = parseColor(style.backgroundColor);
  const ratio = contrastRatio(foreground, background);
  const foregroundLuminance = luminance(foreground);

  assert.ok(
    isRosaRed(background),
    `${path} ${viewport.width}x${viewport.height} red interactive ${probeIndex} (${style.text}) leaves the Rosa-red family in ${state}: ${style.backgroundColor}`,
  );
  assert.ok(
    foregroundLuminance >= 0.8,
    `${path} ${viewport.width}x${viewport.height} red interactive ${probeIndex} (${style.text}) text becomes too dark in ${state}; luminance ${foregroundLuminance.toFixed(3)} from ${style.color}`,
  );
  assert.ok(
    ratio >= 4.5,
    `${path} ${viewport.width}x${viewport.height} red interactive ${probeIndex} (${style.text}) contrast is ${ratio.toFixed(2)}:1 in ${state}; must be at least 4.5:1`,
  );
}

async function assertInteractiveStates(page, path, viewport) {
  const probeCount = await markRedInteractives(page);
  assert.ok(
    probeCount > 0,
    `${path} ${viewport.width}x${viewport.height} must expose at least one visible filled Rosa-red interactive control`,
  );

  for (const probeIndex of sampleIndices(probeCount)) {
    const target = page.locator(`[data-rosa-contrast-probe="${probeIndex}"]`);
    assert.equal(await target.count(), 1, `${path} ${viewport.width}x${viewport.height} contrast probe ${probeIndex} must resolve exactly once`);
    await target.scrollIntoViewIfNeeded();

    assertState(await snapshot(target), 'normal', path, viewport, probeIndex);

    await target.hover();
    assertState(await snapshot(target), 'hover', path, viewport, probeIndex);

    await page.mouse.down();
    try {
      assertState(await snapshot(target), 'active', path, viewport, probeIndex);
    } finally {
      await page.mouse.up();
    }

    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await target.focus();
    const focused = await snapshot(target);
    assertState(focused, 'focus-visible', path, viewport, probeIndex);
    assert.equal(
      await target.evaluate((element) => element.matches(':focus-visible')),
      true,
      `${path} ${viewport.width}x${viewport.height} red interactive ${probeIndex} must expose :focus-visible under keyboard modality`,
    );
    assert.notEqual(
      focused.outlineStyle,
      'none',
      `${path} ${viewport.width}x${viewport.height} red interactive ${probeIndex} must retain a visible keyboard focus outline`,
    );
    assert.ok(
      focused.outlineWidth > 0,
      `${path} ${viewport.width}x${viewport.height} red interactive ${probeIndex} focus outline width must be positive`,
    );
  }

  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(
    dimensions.scroll <= dimensions.client + 1,
    `${path} ${viewport.width}x${viewport.height} overflows horizontally: ${dimensions.scroll} > ${dimensions.client}`,
  );
}

try {
  for (const viewport of viewports) {
    for (const path of routes) {
      const page = await load(path, viewport);
      await assertInteractiveStates(page, path, viewport);
      await page.close();
    }
  }

  process.stdout.write('PASS: filled Rosa-red interactive controls preserve light text, >=4.5:1 contrast, visible focus and stable red states across EN/AR Home/About/Contact/Shop/Product Detail\n');
} finally {
  await browser.close();
}
