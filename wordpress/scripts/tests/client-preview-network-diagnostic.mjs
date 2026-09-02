import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = new URL(process.argv[2] || 'http://localhost:8088/');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

const consoleErrors = [];
const failedRequests = [];

page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const location = message.location();
  consoleErrors.push({
    text: message.text(),
    url: location?.url || '',
    line: location?.lineNumber ?? null,
    column: location?.columnNumber ?? null,
  });
});

page.on('pageerror', (error) => {
  consoleErrors.push({ text: error.message, url: '', line: null, column: null });
});

page.on('requestfailed', (request) => {
  failedRequests.push({
    url: request.url(),
    resourceType: request.resourceType(),
    method: request.method(),
    errorText: request.failure()?.errorText || 'unknown failure',
  });
});

try {
  await page.goto(new URL('/', baseUrl).href, { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 20 });

  process.stdout.write('=== FAILED REQUESTS ===\n');
  if (failedRequests.length === 0) process.stdout.write('(none)\n');
  for (const item of failedRequests) {
    process.stdout.write(`${item.method} ${item.resourceType} ${item.url} :: ${item.errorText}\n`);
  }

  process.stdout.write('\n=== CONSOLE/PAGE ERRORS ===\n');
  if (consoleErrors.length === 0) process.stdout.write('(none)\n');
  for (const item of consoleErrors) {
    const location = item.url ? ` @ ${item.url}:${item.line ?? ''}:${item.column ?? ''}` : '';
    process.stdout.write(`${item.text}${location}\n`);
  }

  process.stdout.write('\n=== EXTERNAL RESOURCE REQUESTS ===\n');
  const external = await page.evaluate(() => {
    const origin = location.origin;
    return performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => {
        try { return new URL(url).origin !== origin; } catch { return false; }
      });
  });
  if (external.length === 0) process.stdout.write('(none)\n');
  for (const url of external) process.stdout.write(`${url}\n`);
} finally {
  await page.close();
  await browser.close();
}
