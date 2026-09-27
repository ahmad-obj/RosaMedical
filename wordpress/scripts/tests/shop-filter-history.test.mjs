import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true, args: process.env.ROSA_PLAYWRIGHT_NO_SANDBOX === '1' ? ['--no-sandbox', '--disable-setuid-sandbox'] : [] });

const route = (path) => new URL(path, baseUrl).href;
const activeFamily = async (page) => page.locator('input[data-filter="family"]:checked').getAttribute('value');
const waitForShop = async (page) => page.locator('.rosa-shop-container').waitFor({ state: 'visible' });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(route('/shop/?family=scissors&profile=straight'), { waitUntil: 'domcontentloaded' });
  await waitForShop(page);

  assert.equal(await activeFamily(page), 'scissors', 'A direct valid shared filter URL must restore its family selection.');
  assert.equal(await page.locator('input[data-filter="profile"][value="straight"]').isChecked(), true, 'A direct valid shared filter URL must restore its profile selection.');
  assert.ok(await page.locator('[data-product-card-wrap]:not(.is-hidden)').count() > 0, 'A valid direct filter URL must retain visible results.');

  await page.locator('input[data-filter="family"][value="cutters"]').check();
  await page.waitForFunction(() => new URL(window.location.href).searchParams.get('family') === 'cutters');
  assert.equal(await activeFamily(page), 'cutters', 'Changing a family filter must update the visible selection.');

  await page.goBack({ waitUntil: 'domcontentloaded' });
  await waitForShop(page);
  assert.equal(await activeFamily(page), 'scissors', 'Browser Back must restore the prior family selection.');
  assert.equal(await page.locator('input[data-filter="profile"][value="straight"]').isChecked(), true, 'Browser Back must restore the prior profile selection.');

  await page.goForward({ waitUntil: 'domcontentloaded' });
  await waitForShop(page);
  assert.equal(await activeFamily(page), 'cutters', 'Browser Forward must restore the later family selection.');

  await page.goto(route('/shop/?family=invalid&profile=bogus'), { waitUntil: 'domcontentloaded' });
  await waitForShop(page);
  assert.equal(await activeFamily(page), 'all', 'Malformed filter URLs must safely fall back to All Families.');
  assert.equal(await page.locator('input[data-filter="profile"]:checked').count(), 0, 'Malformed filter URLs must not leave invalid profile controls selected.');
  await page.close();
  process.stdout.write('PASS: Shop filters restore direct URL state and browser history while rejecting invalid parameters\n');
} finally {
  await browser.close();
}
