import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });

const routes = ['/', '/ar/'];
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

async function visibleBox(locator, label) {
  const value = await locator.boundingBox();
  assert.ok(value, `${label} must have a visible layout box`);
  return value;
}

async function assertCompactLinkStack(column, expectedCount, label, path, viewport) {
  const links = column.locator(':scope > a');
  assert.equal(
    await links.count(),
    expectedCount,
    `${path} ${viewport.width}x${viewport.height} ${label} must keep exactly ${expectedCount} direct links`,
  );

  const heading = column.locator(':scope > h2');
  const headingBox = await visibleBox(heading, `${label} heading`);
  const firstBox = await visibleBox(links.nth(0), `${label} first link`);
  const headingGap = firstBox.y - (headingBox.y + headingBox.height);

  assert.ok(
    headingGap >= -1 && headingGap <= 12,
    `${path} ${viewport.width}x${viewport.height} ${label} heading-to-first-link gap is ${headingGap.toFixed(1)}px; tightened handoff rhythm must stay within 12px`,
  );

  for (let index = 0; index < expectedCount; index += 1) {
    const box = await visibleBox(links.nth(index), `${label} link ${index + 1}`);
    if (viewport.width >= 768) {
      assert.ok(
        box.height >= 28 && box.height <= 36,
        `${path} ${viewport.width}x${viewport.height} ${label} link ${index + 1} is ${box.height.toFixed(1)}px tall; desktop/tablet footer links must use compact 28–36px visible rhythm`,
      );
    } else {
      assert.ok(
        box.height >= 44,
        `${path} ${viewport.width}x${viewport.height} ${label} link ${index + 1} must preserve a 44px mobile touch target`,
      );
    }
  }

  for (let index = 1; index < expectedCount; index += 1) {
    const previous = await visibleBox(links.nth(index - 1), `${label} link ${index}`);
    const current = await visibleBox(links.nth(index), `${label} link ${index + 1}`);
    const gap = current.y - (previous.y + previous.height);

    assert.ok(
      gap >= -1 && gap <= 3,
      `${path} ${viewport.width}x${viewport.height} ${label} link gap ${index}→${index + 1} is ${gap.toFixed(1)}px; tightened handoff rhythm must stay within 3px`,
    );
  }
}

async function assertFooter(page, path, viewport) {
  const footer = page.locator('.rosa-preview-footer');
  await visibleBox(footer, 'Rosa footer');

  const columns = footer.locator('.rosa-preview-footer__grid > .rosa-preview-footer__column');
  assert.equal(
    await columns.count(),
    4,
    `${path} ${viewport.width}x${viewport.height} footer must preserve its four content columns`,
  );

  const company = columns.nth(1);
  const support = columns.nth(2);
  const contact = columns.nth(3);

  await assertCompactLinkStack(company, 3, 'Company', path, viewport);
  await assertCompactLinkStack(support, 5, 'Support', path, viewport);

  assert.ok(
    (await contact.locator(':scope > p').first().innerText()).trim().length > 0,
    `${path} ${viewport.width}x${viewport.height} footer must preserve the business address`,
  );
  assert.equal(
    await contact.locator(':scope > a[href^="tel:"]').count(),
    1,
    `${path} ${viewport.width}x${viewport.height} footer must preserve the phone link`,
  );
  assert.equal(
    await contact.locator(':scope > a[href^="mailto:"]').count(),
    1,
    `${path} ${viewport.width}x${viewport.height} footer must preserve the contact email link`,
  );

  const allDirectLinks = footer.locator('.rosa-preview-footer__column > a');
  for (let index = 0; index < await allDirectLinks.count(); index += 1) {
    const box = await visibleBox(allDirectLinks.nth(index), `footer direct link ${index + 1}`);
    if (viewport.width >= 768) {
      assert.ok(
        box.height >= 28 && box.height <= 36,
        `${path} ${viewport.width}x${viewport.height} footer direct link ${index + 1} is ${box.height.toFixed(1)}px tall; all desktop/tablet footer links must share compact rhythm`,
      );
    } else {
      assert.ok(
        box.height >= 44,
        `${path} ${viewport.width}x${viewport.height} footer direct link ${index + 1} must preserve a 44px mobile touch target`,
      );
    }
  }

  const contactLinks = contact.locator(':scope > a');
  if (await contactLinks.count() >= 2) {
    const first = await visibleBox(contactLinks.nth(0), 'contact first link');
    const second = await visibleBox(contactLinks.nth(1), 'contact second link');
    const gap = second.y - (first.y + first.height);
    assert.ok(
      gap >= -1 && gap <= 3,
      `${path} ${viewport.width}x${viewport.height} contact link gap is ${gap.toFixed(1)}px; contact links must use the same tight rhythm`,
    );
  }

  assert.equal(
    await footer.locator('.rosa-preview-button').count(),
    0,
    `${path} ${viewport.width}x${viewport.height} footer must not expose the retired Request a quote button`,
  );

  const bottom = footer.locator('.rosa-preview-footer__bottom');
  await visibleBox(bottom, 'footer bottom row');
  assert.equal(
    await bottom.locator(':scope > span').count(),
    2,
    `${path} ${viewport.width}x${viewport.height} footer must preserve copyright and location`,
  );
  assert.match(
    (await bottom.locator(':scope > span').nth(0).innerText()).trim(),
    /ROSA Medical/,
    `${path} ${viewport.width}x${viewport.height} footer copyright must preserve ROSA Medical branding`,
  );
  assert.ok(
    (await bottom.locator(':scope > span').nth(1).innerText()).trim().length > 0,
    `${path} ${viewport.width}x${viewport.height} footer location must remain populated`,
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
      await assertFooter(page, path, viewport);
      await page.close();
    }
  }

  process.stdout.write('PASS: footer EN/AR handoff rhythm is visually tight on desktop/tablet, preserves mobile touch targets and business/navigation content, and exposes no footer quote CTA\n');
} finally {
  await browser.close();
}
