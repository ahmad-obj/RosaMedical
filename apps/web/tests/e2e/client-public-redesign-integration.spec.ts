import { expect, test, type Page } from "@playwright/test";

const widths = [390, 768, 1024, 1366, 1920, 2560] as const;
const routes = ["/", "/about", "/products", "/inquiry", "/contact"] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

test.describe("client public redesign integration", () => {
  for (const width of widths) {
    for (const route of routes) {
      test(`${route} shares shell and banner at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width <= 768 ? 900 : 1000 });
        const response = await page.goto(route);
        expect(response?.ok()).toBe(true);

        await expect(page.locator(".site-header")).toBeVisible();
        await expect(page.locator("[data-public-hero-page]")).toHaveCount(1);
        await expect(page.locator(".public-hero-carousel__dot")).toHaveCount(4);
        await expect(page.locator(".public-contact-strip")).toHaveCount(1);
        await expect(page.locator(".site-footer")).toHaveCount(1);
        await expectNoHorizontalOverflow(page);
      });
    }
  }

  test("Products exposes the client discovery and catalogue hierarchy", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 1000 });
    await page.goto("/products");

    await expect(page.locator("#products-search-input")).toBeVisible();
    await expect(page.locator(".products-filter-sidebar")).toBeVisible();
    await expect(page.locator("[data-products-results]")).toBeVisible();
    await expect(page.locator(".products-direct-contact")).toBeVisible();
    await expect(page.locator("[data-products-catalogue]")).toHaveCount(5);
  });

  test("reduced motion stops hero autoplay while keeping manual navigation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const hero = page.locator("[data-public-hero-page=\"home\"]");
    const before = await hero.getAttribute("data-active-slide");
    await page.waitForTimeout(5200);
    await expect(hero).toHaveAttribute("data-active-slide", before ?? "");

    await page.locator(".public-hero-carousel__dot").nth(1).click();
    const after = await hero.getAttribute("data-active-slide");
    expect(after).not.toBe(before);
  });

  for (const route of ["/ar", "/ar/about", "/ar/products", "/ar/inquiry", "/ar/contact"] as const) {
    test(`${route} preserves RTL shell and no overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      const response = await page.goto(route);
      expect(response?.ok()).toBe(true);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.locator("[data-public-hero-page]")).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
    });
  }
});
