import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

export async function settlePageMedia(page, { scrollDelayMs = 75 } = {}) {
  await page.evaluate(async (delay) => {
    const pause = () => new Promise((resolve) => setTimeout(resolve, delay));
    const viewportStep = Math.max(1, window.innerHeight - 96);
    let position = 0;

    while (position < document.documentElement.scrollHeight) {
      window.scrollTo(0, position);
      await pause();
      position += viewportStep;
    }

    window.scrollTo(0, document.documentElement.scrollHeight);
    await pause();
  }, scrollDelayMs);

  await page.waitForFunction(
    () => Array.from(document.images).every((image) => image.complete),
    undefined,
    { timeout: 15000 },
  );
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => undefined)));
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  const failedImages = await page.locator('img').evaluateAll((images) => images
    .filter((image) => {
      const bounds = image.getBoundingClientRect();
      const isRendered = typeof image.checkVisibility === 'function'
        ? image.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        : getComputedStyle(image).visibility !== 'hidden';
      return image.naturalWidth === 0 && isRendered && bounds.width > 0 && bounds.height > 0;
    })
    .map((image) => image.currentSrc || image.src || image.alt || '(unknown image)'));
  if (failedImages.length > 0) {
    throw new Error(`Images failed to load: ${failedImages.join(', ')}`);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.scrollY === 0);
}

async function capture(url, output, width, height) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: 'load' });
    await settlePageMedia(page);
    await page.screenshot({ path: output, fullPage: true });
  } finally {
    await browser.close();
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (invokedPath === import.meta.url) {
  const [url, output, rawWidth, rawHeight] = process.argv.slice(2);
  const width = Number.parseInt(rawWidth, 10);
  const height = Number.parseInt(rawHeight, 10);
  if (!url || !output || !Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error('Usage: client-preview-capture.mjs URL OUTPUT WIDTH HEIGHT');
  }
  await capture(url, output, width, height);
}
