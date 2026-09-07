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

const unsafeBrandPattern = /(preview\.themeforest|fullkit\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|weberaise)/i;
const unsafeFilenamePattern = /(home-hero-surgical-instruments|about-procurement|about-hospitals|about-international-buyers|procurement-support|plastic-surgery|orthopedics|maxillofacial|orthodontics|spine|securing-confidence)\.(?:jpe?g|png|webp|gif|svg)/i;

const routes = [
  {
    path: '/',
    expectedNeutralSlots: [
      'home-hero-01',
      'home-specialty-plastic-surgery',
      'home-specialty-orthopedics',
      'home-specialty-maxillofacial',
      'home-specialty-orthodontics',
      'home-specialty-spine',
      'home-securing-confidence',
    ],
  },
  {
    path: '/ar/',
    expectedNeutralSlots: [
      'home-hero-01',
      'home-specialty-plastic-surgery',
      'home-specialty-orthopedics',
      'home-specialty-maxillofacial',
      'home-specialty-orthodontics',
      'home-specialty-spine',
      'home-securing-confidence',
    ],
  },
  { path: '/about/', expectedNeutralSlots: ['about_procurement', 'about_hospitals'] },
  { path: '/ar/about/', expectedNeutralSlots: ['about_procurement', 'about_hospitals'] },
  { path: '/shop/', requireAnyMediaSlot: true },
  { path: '/ar/shop/', requireAnyMediaSlot: true },
  { path: '/product/rosa-foundation-stevens-scissors-regular/', requireAnyMediaSlot: true },
  { path: '/ar/product/rosa-foundation-stevens-scissors-regular/', requireAnyMediaSlot: true },
];

const browser = await chromium.launch(launchOptions);

async function inspectRoute(route, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto(new URL(route.path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${route.path} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));

  assert.deepEqual(pageErrors, [], `${route.path} raised page errors: ${pageErrors.join(' | ')}`);
  assert.deepEqual(consoleErrors, [], `${route.path} raised console errors: ${consoleErrors.join(' | ')}`);

  const state = await page.evaluate(({ expectedNeutralSlots, requireAnyMediaSlot }) => {
    const origin = window.location.origin;
    const remoteImages = [];
    const brokenImages = [];
    const unsafeImageRefs = [];

    for (const image of document.images) {
      const raw = image.currentSrc || image.getAttribute('src') || '';
      if (!raw) continue;
      let resolved = raw;
      try {
        const parsed = new URL(raw, document.baseURI);
        resolved = parsed.href;
        if (!['data:', 'blob:'].includes(parsed.protocol) && parsed.origin !== origin) {
          remoteImages.push(resolved);
        }
      } catch {
        remoteImages.push(raw);
      }
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        brokenImages.push(resolved);
      }
      if (/(preview\.themeforest|fullkit\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|weberaise)/i.test(resolved)
          || /(home-hero-surgical-instruments|about-procurement|about-hospitals|about-international-buyers|procurement-support|plastic-surgery|orthopedics|maxillofacial|orthodontics|spine|securing-confidence)\.(?:jpe?g|png|webp|gif|svg)/i.test(resolved)) {
        unsafeImageRefs.push(resolved);
      }
    }

    const remoteBackgrounds = [];
    const unsafeBackgrounds = [];
    for (const element of document.querySelectorAll('body *')) {
      const background = getComputedStyle(element).backgroundImage;
      if (!background || background === 'none' || !background.includes('url(')) continue;
      for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        const raw = match[1];
        try {
          const parsed = new URL(raw, document.baseURI);
          if (!['data:', 'blob:'].includes(parsed.protocol) && parsed.origin !== origin) {
            remoteBackgrounds.push(parsed.href);
          }
          if (/(preview\.themeforest|fullkit\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|weberaise)/i.test(parsed.href)
              || /(home-hero-surgical-instruments|about-procurement|about-hospitals|about-international-buyers|procurement-support|plastic-surgery|orthopedics|maxillofacial|orthodontics|spine|securing-confidence)\.(?:jpe?g|png|webp|gif|svg)/i.test(parsed.href)) {
            unsafeBackgrounds.push(parsed.href);
          }
        } catch {
          remoteBackgrounds.push(raw);
        }
      }
    }

    const visibleSlots = [...document.querySelectorAll('[data-media-slot]')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          slot: element.getAttribute('data-media-slot') || '',
          role: element.getAttribute('role') || '',
          label: element.getAttribute('aria-label') || '',
          width: rect.width,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          display: style.display,
          visibility: style.visibility,
          opacity: Number.parseFloat(style.opacity || '1'),
          innerImageCount: element.querySelectorAll('img').length,
          innerImageAlts: [...element.querySelectorAll('img')].map((img) => img.getAttribute('alt') ?? ''),
          text: (element.textContent || '').trim(),
        };
      })
      .filter((slot) => slot.display !== 'none' && slot.visibility !== 'hidden' && slot.opacity > 0 && slot.width > 0 && slot.height > 0);

    const neutralSlots = {};
    for (const slotName of expectedNeutralSlots) {
      const element = document.querySelector(`[data-media-slot="${CSS.escape(slotName)}"]`);
      neutralSlots[slotName] = element ? {
        innerImageCount: element.querySelectorAll('img').length,
        text: (element.textContent || '').trim(),
      } : null;
    }

    return {
      remoteImages,
      brokenImages,
      unsafeImageRefs,
      remoteBackgrounds,
      unsafeBackgrounds,
      visibleSlots,
      neutralSlots,
      anyMediaSlotCount: document.querySelectorAll('[data-media-slot]').length,
      requireAnyMediaSlot,
      overflow: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      },
      brandingText: (document.body.innerText || '').match(/preview\.themeforest|fullkit\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|weberaise/ig) || [],
    };
  }, { expectedNeutralSlots: route.expectedNeutralSlots || [], requireAnyMediaSlot: Boolean(route.requireAnyMediaSlot) });

  assert.deepEqual(state.remoteImages, [], `${route.path} contains remote <img> sources: ${state.remoteImages.join(', ')}`);
  assert.deepEqual(state.brokenImages, [], `${route.path} contains broken images: ${state.brokenImages.join(', ')}`);
  assert.deepEqual(state.unsafeImageRefs, [], `${route.path} still renders classified/third-party image references: ${state.unsafeImageRefs.join(', ')}`);
  assert.deepEqual(state.remoteBackgrounds, [], `${route.path} contains remote CSS background images: ${state.remoteBackgrounds.join(', ')}`);
  assert.deepEqual(state.unsafeBackgrounds, [], `${route.path} still renders classified/third-party background media: ${state.unsafeBackgrounds.join(', ')}`);
  assert.deepEqual(state.brandingText, [], `${route.path} exposes third-party branding text: ${state.brandingText.join(', ')}`);
  assert.ok(state.overflow.scrollWidth <= state.overflow.clientWidth + 1,
    `${route.path} overflows horizontally at ${viewport.width}px: ${state.overflow.scrollWidth} > ${state.overflow.clientWidth}`);

  if (route.requireAnyMediaSlot) {
    assert.ok(state.anyMediaSlotCount > 0, `${route.path} must expose at least one neutral/client-replaceable [data-media-slot] surface`);
  }

  for (const [slotName, neutral] of Object.entries(state.neutralSlots)) {
    assert.ok(neutral, `${route.path} must render classified neutral media slot ${slotName}`);
    assert.equal(neutral.innerImageCount, 0, `${route.path} neutral slot ${slotName} must not render an attachment image`);
    assert.match(neutral.text, /ROSA/i, `${route.path} neutral slot ${slotName} must expose the restrained Rosa fallback`);
  }

  for (const slot of state.visibleSlots) {
    assert.equal(slot.role, 'img', `${route.path} media slot ${slot.slot} must expose image semantics`);
    assert.ok(slot.label.trim().length > 0, `${route.path} media slot ${slot.slot} must have a meaningful aria-label`);
    assert.ok(slot.width >= 40 && slot.height >= 40,
      `${route.path} media slot ${slot.slot} must retain stable geometry; got ${slot.width.toFixed(1)}x${slot.height.toFixed(1)}`);
    assert.ok(slot.right >= -1 && slot.left <= viewport.width + 1,
      `${route.path} media slot ${slot.slot} must not sit wholly outside the viewport`);
    if (slot.innerImageCount > 0) {
      assert.ok(slot.innerImageAlts.every((alt) => alt === ''),
        `${route.path} wrapper-labelled media slot ${slot.slot} must keep child image alt text empty to avoid duplicate announcements`);
    }
  }

  await page.close();
}

try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    for (const route of routes) {
      await inspectRoute(route, viewport);
    }
  }

  process.stdout.write('PASS: rendered handoff media uses local, accessible, stable neutral Rosa placeholders across bilingual routes\n');
} finally {
  await browser.close();
}
