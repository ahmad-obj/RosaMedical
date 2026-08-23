import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/products", "/inquiry", "/contact"] as const;
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 }
] as const;

for (const viewport of viewports) {
  test(`main page banners share Home geometry at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    const boxes: Array<{ route: string; width: number; height: number }> = [];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      const hero = page.locator(".public-hero-carousel").first();
      await expect(hero).toBeVisible();
      const box = await hero.boundingBox();
      expect(box).not.toBeNull();
      boxes.push({ route, width: box!.width, height: box!.height });
    }

    const home = boxes[0]!;
    for (const box of boxes.slice(1)) {
      expect(Math.abs(box.width - home.width), `${box.route} width`).toBeLessThanOrEqual(1);
      expect(Math.abs(box.height - home.height), `${box.route} height`).toBeLessThanOrEqual(1);
    }
  });
}
