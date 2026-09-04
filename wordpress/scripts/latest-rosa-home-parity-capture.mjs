import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const referenceBase = new URL(process.argv[2] || 'https://rosamedical.org/');
const localBase = new URL(process.argv[3] || 'http://localhost:8088/');
const outputDir = path.resolve(process.argv[4] || 'artifacts/latest-rosa-home-parity');
const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [431, 932], [390, 844], [360, 800]];
const locales = [
  { name: 'en', path: '/' },
  { name: 'ar', path: '/ar/' },
];

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function settle(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    for (const image of Array.from(document.images)) {
      if (!image.complete) {
        await new Promise((resolve) => {
          const done = () => resolve();
          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });
        });
      }
      try { await image.decode?.(); } catch (_) {}
    }
    window.scrollTo(0, 0);
  });
}

async function capture(base, sourceName, locale, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const url = new URL(locale.path, base);
  await page.goto(url.href, { waitUntil: 'load', timeout: 60_000 });
  await settle(page);

  const stem = `${locale.name}-${width}x${height}-${sourceName}`;
  await page.screenshot({
    path: path.join(outputDir, `${stem}-full.png`),
    fullPage: true,
    animations: 'disabled',
  });

  const hero = page.locator('[data-section="home-hero"], [data-public-hero-page="home"]').first();
  if (await hero.count()) {
    await hero.screenshot({
      path: path.join(outputDir, `${stem}-hero.png`),
      animations: 'disabled',
    });
  }

  await context.close();
}

try {
  for (const locale of locales) {
    for (const [width, height] of viewports) {
      await capture(referenceBase, 'reference', locale, width, height);
      await capture(localBase, 'wordpress', locale, width, height);
      process.stdout.write(`CAPTURED: ${locale.name} ${width}x${height}\n`);
    }
  }
  process.stdout.write(`PASS: latest Rosa Home full-page and hero reference/WordPress captures written to ${outputDir}\n`);
} finally {
  await browser.close();
}
