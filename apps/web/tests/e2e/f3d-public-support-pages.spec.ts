import { expect, test } from "@playwright/test";

const routes = [
  "/about",
  "/procurement-support",
  "/contact",
  "/search",
  "/privacy",
  "/terms"
] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
] as const;

for (const viewport of viewports) {
  for (const route of routes) {
    test(`${route} is safe at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(route);

      expect(response?.ok()).toBe(true);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);

      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect(page.locator("footer")).toBeVisible();
    });
  }
}

test("contact exposes the connected form and search stays in discovery state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/contact");
  await expect(page.getByRole("button", { name: "Send Message" })).toBeEnabled();
  await expect(page.locator('form[aria-label="General contact form preview"]')).toHaveCount(1);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);

  await page.goto("/search");
  await expect(page.locator("[data-search-family-shortcut]")).toHaveCount(5);
  await expect(page.locator("[data-search-result]")).toHaveCount(0);
});
