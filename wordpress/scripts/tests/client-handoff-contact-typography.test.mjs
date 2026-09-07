import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });

const routes = ['/contact/', '/ar/contact/'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

async function load(path, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${path} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));
  return page;
}

function numericWeight(value) {
  if (value === 'normal') return 400;
  if (value === 'bold') return 700;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fontWeight(locator, pseudo = null) {
  return locator.evaluate((element, pseudoElement) => {
    const value = getComputedStyle(element, pseudoElement || null).fontWeight;
    if (value === 'normal') return 400;
    if (value === 'bold') return 700;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }, pseudo);
}

async function assertStrong(locator, minimum, label, path, viewport) {
  assert.equal(await locator.count(), 1, `${path} ${viewport.width}x${viewport.height} ${label} must exist exactly once`);
  const weight = numericWeight(String(await fontWeight(locator)));
  assert.ok(
    weight >= minimum,
    `${path} ${viewport.width}x${viewport.height} ${label} must use strong typography (>= ${minimum}); received ${weight}`,
  );
}

async function assertRegularControl(control, label, path, viewport) {
  const controlWeight = numericWeight(String(await fontWeight(control)));
  assert.ok(
    controlWeight <= 500,
    `${path} ${viewport.width}x${viewport.height} ${label} entered text must stay regular (<= 500); received ${controlWeight}`,
  );

  const placeholderWeight = numericWeight(String(await fontWeight(control, '::placeholder')));
  assert.ok(
    placeholderWeight <= 500,
    `${path} ${viewport.width}x${viewport.height} ${label} placeholder must stay regular (<= 500); received ${placeholderWeight}`,
  );
}

async function assertContactTypography(page, path, viewport) {
  const conversationHeading = page.locator('.rosa-preview-contact__conversation-card > h2');
  const messageHeading = page.locator('.rosa-preview-contact__message-card > h2');
  await assertStrong(conversationHeading, 700, 'conversation heading', path, viewport);
  await assertStrong(messageHeading, 700, 'message-form heading', path, viewport);

  const labels = page.locator('.rosa-preview-contact__message-card .rosa-preview-contact-form > label');
  assert.equal(
    await labels.count(),
    5,
    `${path} ${viewport.width}x${viewport.height} Contact form must preserve its five field captions`,
  );

  for (let index = 0; index < 5; index += 1) {
    const label = labels.nth(index);
    const labelWeight = numericWeight(String(await fontWeight(label)));
    assert.ok(
      labelWeight >= 700,
      `${path} ${viewport.width}x${viewport.height} field caption ${index + 1} must be bold (>= 700); received ${labelWeight}`,
    );

    const control = label.locator('input, textarea');
    assert.equal(
      await control.count(),
      1,
      `${path} ${viewport.width}x${viewport.height} field caption ${index + 1} must retain exactly one form control`,
    );
    await assertRegularControl(control, `field ${index + 1}`, path, viewport);
  }

  const channelNumbers = await page.locator('.rosa-preview-contact__channel-number').allTextContents();
  assert.deepEqual(
    channelNumbers.map((value) => value.trim()),
    ['01', '02', '03'],
    `${path} ${viewport.width}x${viewport.height} Contact must preserve the approved 01/02/03 information channels`,
  );

  const documentSize = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(
    documentSize.scroll <= documentSize.client + 1,
    `${path} ${viewport.width}x${viewport.height} overflows horizontally: ${documentSize.scroll} > ${documentSize.client}`,
  );
}

try {
  for (const viewport of viewports) {
    for (const path of routes) {
      const page = await load(path, viewport);
      await assertContactTypography(page, path, viewport);
      await page.close();
    }
  }

  process.stdout.write('PASS: Contact EN/AR typography preserves bold headings and field captions with regular form values/placeholders across all handoff viewports\n');
} finally {
  await browser.close();
}
