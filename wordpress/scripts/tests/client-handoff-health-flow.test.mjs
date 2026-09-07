import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const productPath = '/product/rosa-foundation-stevens-scissors-regular/';
const forbiddenRequest = /preview\.themeforest\.net|fullkit\.moxcreative\.com|elementor[ -]?pro|elements-kit|skyboot/i;

const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

const marketingRoutes = [
  ['English Home', '/', 'en-US', 'ltr'],
  ['English About', '/about/', 'en-US', 'ltr'],
  ['English Contact', '/contact/', 'en-US', 'ltr'],
  ['English Shop', '/shop/', 'en-US', 'ltr'],
  ['Arabic Home', '/ar/', 'ar', 'rtl'],
  ['Arabic About', '/ar/about/', 'ar', 'rtl'],
  ['Arabic Contact', '/ar/contact/', 'ar', 'rtl'],
  ['Arabic Shop', '/ar/shop/', 'ar', 'rtl'],
];

const absolute = (path) => new URL(path, baseUrl).href;
const normalizedPath = (href) => {
  const url = new URL(href, baseUrl);
  return `${url.pathname}${url.search}${url.hash}`;
};

async function openHealthyPage(browser, { label, path, lang, dir, viewport }) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const errors = [];
  const forbidden = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (forbiddenRequest.test(request.url())) forbidden.push(request.url());
  });

  const response = await page.goto(absolute(path), { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response, `${label} produced no navigation response`);
  assert.ok(response.status() < 400, `${label} returned HTTP ${response.status()}: ${path}`);

  await settlePageMedia(page, { scrollDelayMs: 10 });

  assert.equal(await page.locator('main').count(), 1, `${label} must render exactly one main region`);
  assert.equal(await page.locator('body[data-rosa-preview-shell]').count(), 1, `${label} shared shell marker missing`);
  assert.equal(await page.locator('[data-rosa-preview-footer]').count(), 1, `${label} must render exactly one shared footer`);
  assert.equal(await page.locator('html').getAttribute('lang'), lang, `${label} lang mismatch`);
  assert.equal(await page.locator('html').getAttribute('dir'), dir, `${label} dir mismatch`);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(
    dimensions.scrollWidth <= dimensions.clientWidth + 1,
    `${label} horizontally overflows: ${dimensions.scrollWidth} > ${dimensions.clientWidth}`,
  );

  assert.deepEqual(errors, [], `${label} emitted browser errors`);
  assert.deepEqual(forbidden, [], `${label} requested a forbidden reference/demo dependency`);

  return page;
}

function assertMailto(href, label) {
  const mailbox = href.slice('mailto:'.length).split('?')[0].trim();
  assert.match(mailbox, /^[^@\s]+@[^@\s]+\.[^@\s]+$/, `${label} has invalid mailto href: ${href}`);
}

function assertTel(href, label) {
  const number = href.slice('tel:'.length).trim();
  assert.match(number, /^\+?[0-9][0-9()+\-\s]*$/, `${label} has invalid tel href: ${href}`);
}

function classifyHref(rawHref, sourcePath) {
  const href = rawHref.trim();
  assert.notEqual(href, '', `${sourcePath} contains an empty href`);
  assert.notEqual(href, '#', `${sourcePath} contains a bare # navigation dead end`);
  assert.ok(!/^javascript:/i.test(href), `${sourcePath} contains javascript: navigation`);

  if (/^mailto:/i.test(href)) {
    assertMailto(href, sourcePath);
    return { kind: 'external', href };
  }
  if (/^tel:/i.test(href)) {
    assertTel(href, sourcePath);
    return { kind: 'external', href };
  }

  const resolved = new URL(href, absolute(sourcePath));
  assert.ok(!forbiddenRequest.test(resolved.href), `${sourcePath} links to forbidden reference/demo URL: ${resolved.href}`);

  if (resolved.origin !== baseUrl.origin) {
    assert.ok(['http:', 'https:'].includes(resolved.protocol), `${sourcePath} uses unsupported external protocol: ${resolved.protocol}`);
    if (resolved.hostname === 'wa.me') {
      const recipient = resolved.pathname.replace(/\D/g, '');
      assert.ok(recipient.length >= 7, `${sourcePath} has invalid WhatsApp recipient: ${resolved.href}`);
    }
    return { kind: 'external', href: resolved.href };
  }

  return { kind: 'internal', url: resolved };
}

async function validateInternalLinks(browser, records) {
  const destinations = new Map();
  const fragments = new Map();

  for (const { sourcePath, href } of records) {
    const classification = classifyHref(href, sourcePath);
    if (classification.kind !== 'internal') continue;

    const target = classification.url;
    const requestUrl = new URL(target.href);
    requestUrl.hash = '';
    destinations.set(requestUrl.href, sourcePath);

    if (target.hash) {
      const id = decodeURIComponent(target.hash.slice(1));
      fragments.set(`${requestUrl.href}#${id}`, { requestUrl: requestUrl.href, id, sourcePath });
    }
  }

  const context = await browser.newContext();
  try {
    for (const [url, sourcePath] of destinations) {
      const response = await context.request.get(url, { maxRedirects: 5, timeout: 30_000 });
      assert.ok(response.status() < 400, `${sourcePath} links to dead internal destination ${url} (HTTP ${response.status()})`);
    }
  } finally {
    await context.close();
  }

  for (const { requestUrl, id, sourcePath } of fragments.values()) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      const response = await page.goto(requestUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      assert.ok(response && response.status() < 400, `${sourcePath} fragment destination failed: ${requestUrl}`);
      const targetCount = await page.locator('[id]').evaluateAll(
        (elements, targetId) => elements.filter((element) => element.id === targetId).length,
        id,
      );
      assert.equal(targetCount, 1, `${sourcePath} links to missing fragment #${id} on ${requestUrl}`);
    } finally {
      await page.close();
    }
  }
}

async function collectLinks(browser, routes, viewport) {
  const records = [];
  for (const [label, path, lang, dir] of routes) {
    const page = await openHealthyPage(browser, { label, path, lang, dir, viewport });
    try {
      const hrefs = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean));
      for (const href of hrefs) records.push({ sourcePath: path, href });
    } finally {
      await page.close();
    }
  }
  return records;
}

async function assertHeaderRoutes(page, locale) {
  const expected = locale === 'ar'
    ? ['/ar/', '/ar/about/', '/ar/shop/', '/ar/contact/', '/ar/contact/#inquiry']
    : ['/', '/about/', '/shop/', '/contact/', '/contact/#inquiry'];
  const hrefs = await page.locator('.rosa-preview-nav a').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
  const paths = hrefs.map(normalizedPath);
  for (const path of expected) assert.ok(paths.includes(path), `header navigation missing ${path}`);
}

async function assertSharedCta(page, expectedPath, label) {
  const hrefs = await page.locator('.rosa-preview-prefooter a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
  assert.ok(hrefs.length > 0, `${label} shared quotation CTA is missing`);
  for (const href of hrefs) {
    assert.equal(normalizedPath(href), expectedPath, `${label} shared CTA must resolve to ${expectedPath}`);
  }
}

async function assertCoreFlows(browser) {
  const desktop = { width: 1440, height: 900 };

  const home = await openHealthyPage(browser, { label: 'English Home flow', path: '/', lang: 'en-US', dir: 'ltr', viewport: desktop });
  try {
    await assertHeaderRoutes(home, 'en');
    await assertSharedCta(home, '/contact/#inquiry', 'English Home');
    const languageHref = await home.locator('.rosa-preview-language').getAttribute('href');
    assert.ok(languageHref, 'English Home language switch is missing');
    assert.equal(normalizedPath(languageHref), '/ar/', 'English Home language switch must target Arabic Home');
  } finally {
    await home.close();
  }

  const about = await openHealthyPage(browser, { label: 'English About flow', path: '/about/', lang: 'en-US', dir: 'ltr', viewport: desktop });
  try {
    await assertSharedCta(about, '/contact/#inquiry', 'English About');
  } finally {
    await about.close();
  }

  const arHome = await openHealthyPage(browser, { label: 'Arabic Home flow', path: '/ar/', lang: 'ar', dir: 'rtl', viewport: desktop });
  try {
    await assertHeaderRoutes(arHome, 'ar');
    await assertSharedCta(arHome, '/ar/contact/#inquiry', 'Arabic Home');
    const languageHref = await arHome.locator('.rosa-preview-language').getAttribute('href');
    assert.ok(languageHref, 'Arabic Home language switch is missing');
    assert.equal(normalizedPath(languageHref), '/', 'Arabic Home language switch must target English Home');
  } finally {
    await arHome.close();
  }

  const shop = await openHealthyPage(browser, { label: 'English Shop flow', path: '/shop/', lang: 'en-US', dir: 'ltr', viewport: desktop });
  try {
    const realProductAction = shop.locator('.rosa-preview-product:not(.rosa-preview-product--family) .rosa-preview-product__action').first();
    await realProductAction.waitFor({ state: 'visible' });
    const productHref = await realProductAction.getAttribute('href');
    assert.ok(productHref, 'English Shop does not expose a real Woo product destination');
    const response = await shop.request.get(new URL(productHref, shop.url()).href, { maxRedirects: 5 });
    assert.ok(response.status() < 400, `Shop product destination returned HTTP ${response.status()}`);
  } finally {
    await shop.close();
  }

  const product = await openHealthyPage(browser, { label: 'English Product flow', path: productPath, lang: 'en-US', dir: 'ltr', viewport: desktop });
  try {
    const quoteHref = await product.locator('.rosa-product-detail__summary .rosa-preview-button--accent').getAttribute('href');
    assert.ok(quoteHref, 'Product Detail quotation CTA is missing');
    assert.equal(normalizedPath(quoteHref), '/contact/#inquiry', 'Product Detail quotation CTA must target Contact #inquiry');
  } finally {
    await product.close();
  }

  const mobile = await openHealthyPage(browser, {
    label: 'English Home mobile flow',
    path: '/',
    lang: 'en-US',
    dir: 'ltr',
    viewport: { width: 390, height: 844 },
  });
  try {
    await mobile.locator('[data-rosa-preview-menu-trigger]').click();
    const drawer = mobile.locator('[data-rosa-preview-menu-drawer]');
    await drawer.waitFor({ state: 'visible' });
    const shopLink = drawer.locator('a[href]').filter({ hasText: /Shop|Products/i }).first();
    await shopLink.waitFor({ state: 'visible' });
    await Promise.all([
      mobile.waitForURL((url) => url.pathname === '/shop/', { timeout: 30_000 }),
      shopLink.click(),
    ]);
  } finally {
    await mobile.close();
  }
}

async function discoverArabicProductPath(browser) {
  const page = await openHealthyPage(browser, {
    label: 'English Product language pairing',
    path: productPath,
    lang: 'en-US',
    dir: 'ltr',
    viewport: { width: 1440, height: 900 },
  });

  try {
    const href = await page.locator('.rosa-preview-language').getAttribute('href');
    assert.ok(href, 'representative Product Detail has no language switch');
    const pair = new URL(href, page.url());
    assert.equal(pair.origin, baseUrl.origin, 'representative Product Detail language switch must stay on the Rosa site');
    assert.notEqual(pair.pathname, '/ar/', 'representative Product Detail has no supported Arabic counterpart');

    const pairedPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    try {
      const response = await pairedPage.goto(pair.href, { waitUntil: 'load', timeout: 60_000 });
      assert.ok(response && response.status() < 400, `Arabic Product Detail counterpart returned HTTP ${response?.status() ?? 'no response'}`);
      await settlePageMedia(pairedPage, { scrollDelayMs: 10 });
      assert.equal(await pairedPage.locator('.rosa-product-detail').count(), 1, 'representative Product Detail language switch does not land on an Arabic Product Detail');
      assert.equal(await pairedPage.locator('html').getAttribute('lang'), 'ar', 'Arabic Product Detail counterpart lang mismatch');
      assert.equal(await pairedPage.locator('html').getAttribute('dir'), 'rtl', 'Arabic Product Detail counterpart dir mismatch');
      const returnHref = await pairedPage.locator('.rosa-preview-language').getAttribute('href');
      assert.ok(returnHref, 'Arabic Product Detail counterpart has no English language switch');
      assert.equal(new URL(returnHref, pairedPage.url()).pathname, productPath, 'Arabic Product Detail language switch does not return to English Product Detail');
    } finally {
      await pairedPage.close();
    }

    return `${pair.pathname}${pair.search}`;
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });
try {
  const baseHealthRoutes = [
    ...marketingRoutes,
    ['English Product Detail', productPath, 'en-US', 'ltr'],
  ];

  for (const viewport of viewports) {
    for (const [label, path, lang, dir] of baseHealthRoutes) {
      const page = await openHealthyPage(browser, {
        label: `${label} ${viewport.width}x${viewport.height}`,
        path,
        lang,
        dir,
        viewport,
      });
      await page.close();
    }
  }

  await assertCoreFlows(browser);

  for (const viewport of [viewports[0], viewports[4]]) {
    const links = await collectLinks(browser, baseHealthRoutes, viewport);
    await validateInternalLinks(browser, links);
  }

  const arabicProductPath = await discoverArabicProductPath(browser);
  for (const viewport of viewports) {
    const page = await openHealthyPage(browser, {
      label: `Arabic Product Detail ${viewport.width}x${viewport.height}`,
      path: arabicProductPath,
      lang: 'ar',
      dir: 'rtl',
      viewport,
    });
    await page.close();
  }

  for (const viewport of [viewports[0], viewports[4]]) {
    const links = await collectLinks(browser, [['Arabic Product Detail', arabicProductPath, 'ar', 'rtl']], viewport);
    await validateInternalLinks(browser, links);
  }

  process.stdout.write('PASS: client handoff primary routes, bilingual flows, internal links and runtime health\n');
} finally {
  await browser.close();
}
