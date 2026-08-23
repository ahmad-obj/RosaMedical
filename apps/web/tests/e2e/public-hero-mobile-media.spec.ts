import { expect, test } from "@playwright/test";

test("third hero slide renders its gloved-hands mobile composition", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const hero = page.locator(".public-hero-carousel");
  const thirdDot = hero.getByRole("button", { name: "Go to slide 3" });
  await thirdDot.click();

  await expect(hero).toHaveAttribute("data-active-slide", "surgical-instrument-selection");
  const composition = hero.locator("[data-mobile-hero-composition]");
  await expect(composition).toBeVisible();

  const foreground = composition.locator("img").last();
  await expect.poll(async () => foreground.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(foreground).toHaveAttribute("src", /hero-03-desktop\.webp/);
});
