import { expect, test } from "@playwright/test";

const sections = [
  "home-hero",
  "family-discovery",
  "procurement-support",
  "featured-instruments",
  "catalogue-access"
] as const;

test("homepage keeps its cinematic hierarchy and media geometry", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);

  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Products" })).toBeVisible();

  for (const section of sections) {
    await expect(page.locator(`[data-section='${section}']`)).toHaveCount(1);
  }
  await expect(page.locator("[data-section='quotation-cta']")).toHaveCount(0);

  await expect(page.locator("[data-home-choreography='carousel']")).toHaveCount(1);
  await expect(page.locator(".home-hero-carousel__dot")).toHaveCount(4);
  await expect(page.locator(".home-hero-carousel__dot[aria-current='true']")).toHaveCount(1);

  const heroMedia = page.locator("[data-media-slot='homepage-hero-active']");
  await expect(heroMedia).toBeVisible();
  const heroImage = heroMedia.locator("img");
  await expect(heroImage).toBeVisible();
  expect(await heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

  await expect(page.locator("[data-motion='stagger']")).toHaveCount(3);
  expect(await page.locator("[data-motion='stagger-item']").count()).toBeGreaterThanOrEqual(11);
  expect(await page.locator("[data-motion='tilt']").count()).toBeGreaterThanOrEqual(1);
  await expect(page.locator("[data-motion='spotlight']")).toHaveCount(0);
  await expect(page.locator("[data-home-family-gallery] [data-family-panel]")).toHaveCount(5);
  await expect(page.locator("[data-media-slot^='homepage-catalogue-']")).toHaveCount(5);

  await page.locator("[data-section='catalogue-access']").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Technical catalogues." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Knives catalogue" })).toBeVisible();

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});

test("mobile hero keeps its carousel composition inside the viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile composition runs on the mobile project.");

  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);

  await expect(page.locator(".home-hero__title")).toBeVisible();
  await expect(page.locator("[data-media-slot='homepage-hero-active']")).toBeVisible();
  await expect(page.locator(".home-hero-carousel__dot")).toHaveCount(4);

  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(viewport.scrollWidth, JSON.stringify(viewport)).toBeLessThanOrEqual(viewport.clientWidth);
});
