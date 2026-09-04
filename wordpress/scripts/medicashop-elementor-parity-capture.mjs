import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const referenceBase = new URL(process.argv[2] || 'https://rosamedical.org/');
const elementorBase = new URL(process.argv[3] || 'http://localhost:8088/');
const outputDir = path.resolve(process.argv[4] || 'artifacts/medicashop-elementor-parity');
const viewports = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [431, 932], [390, 844], [360, 800]];
const locales = [
  { name: 'en', path: '/' },
  { name: 'ar', path: '/ar/' },
];

await fs.mkdir(path.join(outputDir, 'reference'), { recursive: true });
await fs.mkdir(path.join(outputDir, 'local'), { recursive: true });
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

  const directory = sourceName === 'reference' ? 'reference' : 'local';
  const stem = `${locale.name}-${width}x${height}`;
  await page.screenshot({
    path: path.join(outputDir, directory, `${stem}-full.png`),
    fullPage: true,
    animations: 'disabled',
  });

  const hero = page.locator('[data-home-section="hero"]').first();
  if (await hero.count()) {
    await hero.screenshot({
      path: path.join(outputDir, directory, `${stem}-hero.png`),
      animations: 'disabled',
    });
  }

  const metrics = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  await fs.writeFile(
    path.join(outputDir, directory, `${stem}-metrics.json`),
    `${JSON.stringify({ url: url.href, ...metrics }, null, 2)}\n`,
    'utf8',
  );

  await context.close();
}

try {
  for (const locale of locales) {
    for (const [width, height] of viewports) {
      await capture(referenceBase, 'reference', locale, width, height);
      await capture(elementorBase, 'local', locale, width, height);
      process.stdout.write(`CAPTURED: ${locale.name} ${width}x${height}\n`);
    }
  }
  process.stdout.write(`PASS: finished-template reference/Elementor captures written to ${outputDir}\n`);
} finally {
  await browser.close();
}
