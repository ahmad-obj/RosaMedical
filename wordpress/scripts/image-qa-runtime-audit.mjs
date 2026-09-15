import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const ROUTES = [
  ['en-home', '/'],
  ['en-about', '/about/'],
  ['en-contact', '/contact/'],
  ['en-shop', '/shop/'],
  ['en-quote', '/quote-request/'],
  ['en-product', '/product/rosa-foundation-stevens-scissors-regular/'],
  ['ar-home', '/ar/'],
  ['ar-about', '/ar/about/'],
  ['ar-contact', '/ar/contact/'],
  ['ar-shop', '/ar/shop/'],
  ['ar-quote', '/ar/quote-request/'],
  ['ar-product', '/ar/product/rosa-foundation-stevens-scissors-regular/'],
];

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

const expectedCells = 60;

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const base = new URL(arg('--base', 'http://localhost:8088/'));
const outDir = path.resolve(arg('--out', 'wordpress/.client-preview-artifacts/image-qa-2026-09-15'));
fs.mkdirSync(outDir, { recursive: true });

async function settleMedia(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const step = Math.max(240, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    window.scrollTo(0, 0);
    await Promise.all(Array.from(document.images).map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }));
  });
  await page.waitForTimeout(120);
}

async function collectImageEvidence(page) {
  return page.evaluate(() => {
    const rect = (element) => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };

    const context = (element) => {
      const owner = element.closest(
        '[data-media-slot],[data-home-section],[data-preview-product-gallery],' +
        '[data-preview-product-summary],[data-preview-shop-grid],section,main,header,footer'
      );
      return {
        tag: owner?.tagName?.toLowerCase() || '',
        id: owner?.id || '',
        className: typeof owner?.className === 'string' ? owner.className : '',
        mediaSlot: owner?.getAttribute?.('data-media-slot') || '',
        homeSection: owner?.getAttribute?.('data-home-section') || '',
      };
    };

    const images = Array.from(document.images).map((image, index) => {
      const style = getComputedStyle(image);
      const box = image.getBoundingClientRect();
      const visible = box.width > 0 && box.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden';
      const picture = image.closest('picture');
      return {
        kind: 'img',
        index,
        src: image.getAttribute('src') || '',
        currentSrc: image.currentSrc || '',
        srcset: image.getAttribute('srcset') || '',
        sizes: image.getAttribute('sizes') || '',
        pictureSources: picture ? Array.from(picture.querySelectorAll('source')).map((source) => ({
          srcset: source.getAttribute('srcset') || '',
          sizes: source.getAttribute('sizes') || '',
          media: source.getAttribute('media') || '',
          type: source.getAttribute('type') || '',
        })) : [],
        alt: image.getAttribute('alt') || '',
        role: image.getAttribute('role') || '',
        loading: image.loading || '',
        decoding: image.decoding || '',
        fetchPriority: image.fetchPriority || image.getAttribute('fetchpriority') || '',
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        complete: image.complete,
        visible,
        rendered: rect(image),
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
        aspectRatio: style.aspectRatio,
        context: context(image),
      };
    });

    const backgrounds = [];
    for (const element of document.querySelectorAll('body *')) {
      const style = getComputedStyle(element);
      if (!style.backgroundImage || style.backgroundImage === 'none' || !style.backgroundImage.includes('url(')) continue;
      const box = element.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0 || style.display === 'none' || style.visibility === 'hidden') continue;
      backgrounds.push({
        kind: 'background',
        backgroundImage: style.backgroundImage,
        backgroundPosition: style.backgroundPosition,
        backgroundSize: style.backgroundSize,
        backgroundRepeat: style.backgroundRepeat,
        rendered: rect(element),
        context: context(element),
      });
    }

    const visibleBrokenImages = images
      .filter((image) => image.visible && (!image.complete || image.naturalWidth === 0))
      .map((image) => image.currentSrc || image.src);

    return {
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      title: document.title,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      images,
      backgrounds,
      visibleBrokenImages,
    };
  });
}

const browser = await chromium.launch({ headless: true });
const records = [];

try {
  for (const [key, routePath] of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('requestfailed', (request) => failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText || 'request failed',
      }));

      try {
        const url = new URL(routePath, base).href;
        const response = await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
        if (!response?.ok()) throw new Error(`${key} returned ${response?.status() ?? 'no response'} from ${url}`);

        await settleMedia(page);
        const evidence = await collectImageEvidence(page);
        const label = `${key}-${viewport.width}x${viewport.height}`;
        const screenshot = path.join(outDir, `${label}.png`);
        const inventory = path.join(outDir, `${label}.json`);
        await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
        fs.writeFileSync(inventory, JSON.stringify({
          key, routePath, url, viewport, consoleErrors, pageErrors, failedRequests, ...evidence,
        }, null, 2));

        records.push({
          key, routePath, url, viewport,
          screenshot,
          inventory,
          imageCount: evidence.images.length,
          backgroundCount: evidence.backgrounds.length,
          visibleBrokenImages: evidence.visibleBrokenImages,
          horizontalOverflow: evidence.scrollWidth > evidence.clientWidth + 1,
          consoleErrors,
          pageErrors,
          failedRequests,
        });
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

if (records.length !== expectedCells) {
  throw new Error(`expected ${expectedCells} route/viewport cells, received ${records.length}`);
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  base: String(base),
  expectedCells,
  records,
}, null, 2));

console.log(`PASS: image QA runtime audit captured ${records.length} cells; manifest.json written to ${outDir}`);
