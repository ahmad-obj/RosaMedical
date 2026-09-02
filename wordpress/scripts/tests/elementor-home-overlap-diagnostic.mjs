import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = process.argv[2] || 'http://localhost:8088/';
const browser = await chromium.launch({ headless: true });

try {
  for (const width of [430, 431, 432]) {
    const page = await browser.newPage({ viewport: { width, height: 932 } });
    await page.goto(baseUrl, { waitUntil: 'load' });
    await settlePageMedia(page, { scrollDelayMs: 10 });

    const rows = await page.locator('[data-home-section]').evaluateAll((sections) => sections.map((section) => {
      const box = section.getBoundingClientRect();
      const widget = section.closest('.elementor-widget');
      const widgetContainer = section.closest('.elementor-widget-container');
      const root = section.closest('.rosa-elementor-root');
      const widgetBox = widget?.getBoundingClientRect();
      const containerBox = widgetContainer?.getBoundingClientRect();
      const widgetStyle = widget ? getComputedStyle(widget) : null;
      const sectionStyle = getComputedStyle(section);
      return {
        section: section.getAttribute('data-home-section'),
        sectionTop: Math.round(box.top + scrollY),
        sectionBottom: Math.round(box.bottom + scrollY),
        sectionHeight: Math.round(box.height),
        sectionCssHeight: sectionStyle.height,
        sectionOverflow: sectionStyle.overflow,
        widgetTop: widgetBox ? Math.round(widgetBox.top + scrollY) : null,
        widgetBottom: widgetBox ? Math.round(widgetBox.bottom + scrollY) : null,
        widgetHeight: widgetBox ? Math.round(widgetBox.height) : null,
        widgetDisplay: widgetStyle?.display ?? null,
        widgetPosition: widgetStyle?.position ?? null,
        widgetFlexShrink: widgetStyle?.flexShrink ?? null,
        widgetContainerHeight: containerBox ? Math.round(containerBox.height) : null,
        rootDisplay: root ? getComputedStyle(root).display : null,
        rootFlexDirection: root ? getComputedStyle(root).flexDirection : null,
      };
    }));

    console.log(`\n=== ${width}px ===`);
    console.table(rows);
    await page.close();
  }
} finally {
  await browser.close();
}
