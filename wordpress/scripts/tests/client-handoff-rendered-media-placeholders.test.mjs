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
  { path: '/', requiredImageSelector: '.rosa-preview-hero picture img, [data-latest-rosa-home-hero] picture img' },
  { path: '/ar/', requiredImageSelector: '.rosa-preview-hero picture img, [data-latest-rosa-home-hero] picture img' },
  { path: '/about/', requiredImageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img' },
  { path: '/ar/about/', requiredImageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img' },
  { path: '/contact/', requiredImageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img' },
  { path: '/ar/contact/', requiredImageSelector: '[data-preview-page-hero] .rosa-preview-page-hero__media img' },
  { path: '/shop/' },
  { path: '/ar/shop/' },
  { path: '/product/rosa-foundation-stevens-scissors-regular/' },
  { path: '/ar/product/rosa-foundation-stevens-scissors-regular/' },
  { path: '/quote-request/' },
  { path: '/ar/quote-request/' },
];

const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

const browser = await chromium.launch(launchOptions);

async function inspectRoute(route, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('requestfailed', (request) => {
    failedRequests.push({
      url: request.url(),
      resourceType: request.resourceType(),
      error: request.failure()?.errorText || 'request failed',
    });
  });

  const response = await page.goto(new URL(route.path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${route.path} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));

  assert.deepEqual(pageErrors, [], `${route.path} raised page errors: ${pageErrors.join(' | ')}`);
  assert.deepEqual(
    consoleErrors,
    [],
    `${route.path} raised console errors: ${consoleErrors.join(' | ')}; failed requests: ${failedRequests.map((request) => `${request.resourceType} ${request.url} -> ${request.error}`).join(' | ')}`,
  );

  const state = await page.evaluate(({ requiredImageSelector }) => {
    const origin = window.location.origin;
    const unsafeBrandPattern = /(preview\\.themeforest|fullkit\\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|weberaise)/i;
    const unsafeFilenamePattern = /(home-hero-surgical-instruments|about-procurement|about-hospitals|about-international-buyers|procurement-support|plastic-surgery|orthopedics|maxillofacial|orthodontics|spine|securing-confidence)\\.(?:jpe?g|png|webp|gif|svg)/i;
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

      const bounds = image.getBoundingClientRect();
      const isRendered = typeof image.checkVisibility === 'function'
        ? image.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        : getComputedStyle(image).visibility !== 'hidden';

      if (isRendered
        && bounds.width > 0
        && bounds.height > 0
        && (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0)) {
        brokenImages.push(resolved);
      }

      if (unsafeBrandPattern.test(resolved) || unsafeFilenamePattern.test(resolved)) {
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
          if (unsafeBrandPattern.test(parsed.href) || unsafeFilenamePattern.test(parsed.href)) {
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
        };
      })
      .filter((slot) => slot.display !== 'none'
        && slot.visibility !== 'hidden'
        && slot.opacity > 0
        && slot.width > 0
        && slot.height > 0);

    let requiredImage = null;
    if (requiredImageSelector) {
      const image = document.querySelector(requiredImageSelector);
      if (image instanceof HTMLImageElement) {
        const rect = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        requiredImage = {
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          width: rect.width,
          height: rect.height,
          objectFit: style.objectFit,
          objectPosition: style.objectPosition,
          source: image.currentSrc || image.src,
        };
      }
    }

    return {
      remoteImages,
      brokenImages,
      unsafeImageRefs,
      remoteBackgrounds,
      unsafeBackgrounds,
      visibleSlots,
      requiredImage,
      overflow: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      },
      brandingText: (document.body.innerText || '').match(/preview\.themeforest|fullkit\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|weberaise/ig) || [],
    };
  }, { requiredImageSelector: route.requiredImageSelector || '' });

  assert.deepEqual(state.remoteImages, [], `${route.path} contains remote <img> sources: ${state.remoteImages.join(', ')}`);
  assert.deepEqual(state.brokenImages, [], `${route.path} contains broken images: ${state.brokenImages.join(', ')}`);
  assert.deepEqual(state.unsafeImageRefs, [], `${route.path} still renders classified/third-party image references: ${state.unsafeImageRefs.join(', ')}`);
  assert.deepEqual(state.remoteBackgrounds, [], `${route.path} contains remote CSS background images: ${state.remoteBackgrounds.join(', ')}`);
  assert.deepEqual(state.unsafeBackgrounds, [], `${route.path} still renders classified/third-party background media: ${state.unsafeBackgrounds.join(', ')}`);
  assert.deepEqual(state.brandingText, [], `${route.path} exposes third-party branding text: ${state.brandingText.join(', ')}`);
  assert.ok(state.overflow.scrollWidth <= state.overflow.clientWidth + 1,
    `${route.path} overflows horizontally at ${viewport.width}px: ${state.overflow.scrollWidth} > ${state.overflow.clientWidth}`);

  if (route.requiredImageSelector) {
    assert.ok(state.requiredImage, `${route.path} is missing required prominent image ${route.requiredImageSelector}`);
    assert.ok(state.requiredImage.complete
      && state.requiredImage.naturalWidth > 0
      && state.requiredImage.naturalHeight > 0,
    `${route.path} prominent image did not load: ${state.requiredImage.source}`);
    assert.ok(state.requiredImage.width > 0 && state.requiredImage.height > 0,
      `${route.path} prominent image has collapsed rendered geometry`);
    assert.equal(state.requiredImage.objectFit, 'cover',
      `${route.path} prominent image must use deliberate cover cropping; got ${state.requiredImage.objectFit}`);
  }

  for (const slot of state.visibleSlots) {
    /* Hero-carousel media uses data-media-slot for choreography but is not the
       shared role=img media-slot component. Only enforce wrapper semantics when
       the stable slot wrapper actually declares them. */
    if (slot.role !== '') {
      assert.equal(slot.role, 'img', `${route.path} media slot ${slot.slot} must expose image semantics`);
      assert.ok(slot.label.trim().length > 0, `${route.path} media slot ${slot.slot} must have a meaningful aria-label`);
    }
    assert.ok(slot.width >= 40 && slot.height >= 40,
      `${route.path} media slot ${slot.slot} must retain stable geometry; got ${slot.width.toFixed(1)}x${slot.height.toFixed(1)}`);
    assert.ok(slot.right >= -1 && slot.left <= viewport.width + 1,
      `${route.path} media slot ${slot.slot} must not sit wholly outside the viewport`);
    if (slot.role === 'img' && slot.innerImageCount > 0) {
      assert.ok(slot.innerImageAlts.every((alt) => alt === ''),
        `${route.path} wrapper-labelled media slot ${slot.slot} must keep child image alt text empty to avoid duplicate announcements`);
    }
  }

  await page.close();
}

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      await inspectRoute(route, viewport);
    }
  }

  process.stdout.write('PASS: rendered website imagery is local, loadable, responsive, overflow-safe and free of classified third-party media across bilingual routes\n');
} finally {
  await browser.close();
}
