import { expect, test, type Locator } from "@playwright/test";

const sections = [
  "home-hero",
  "family-discovery",
  "procurement-support",
  "featured-instruments",
  "catalogue-access",
  "quotation-cta"
] as const;

async function expectImageLoaded(frame: Locator): Promise<void> {
  const image = frame.locator("img");
  await expect(image).toHaveCount(1);
  await expect
    .poll(() =>
      image.evaluate(
        (element) =>
          element instanceof HTMLImageElement
          && element.complete
          && element.naturalWidth > 0
          && element.naturalHeight > 0
      )
    )
    .toBe(true);
}

test("homepage keeps its cinematic hierarchy and media geometry", async ({ page }, testInfo) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);

  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Products" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Request a Quote" }).first()).toBeVisible();

  for (const section of sections) {
    await expect(page.locator(`[data-section='${section}']`)).toHaveCount(1);
  }

  const heroMedia = page.locator("[data-media-slot='homepage-hero']");
  await expect(heroMedia).toBeVisible();
  await expect(heroMedia).toHaveAttribute("data-media-state", "ready");
  await expectImageLoaded(heroMedia);
  const heroBox = await heroMedia.boundingBox();
  expect(heroBox).not.toBeNull();
  if (heroBox) {
    const minimumHeight = testInfo.project.name === "mobile" ? 300 : 420;
    expect(heroBox.height).toBeGreaterThanOrEqual(minimumHeight);
  }

  await expect(page.locator("[data-motion='stagger']")).toHaveCount(4);
  expect(await page.locator("[data-motion='stagger-item']").count()).toBeGreaterThanOrEqual(16);
  expect(await page.locator("[data-motion='tilt']").count()).toBeGreaterThanOrEqual(8);
  expect(await page.locator("[data-motion='spotlight']").count()).toBeGreaterThanOrEqual(2);

  const procurementMedia = page.locator("[data-media-slot='homepage-procurement']");
  await procurementMedia.scrollIntoViewIfNeeded();
  await expect(procurementMedia).toHaveAttribute("data-media-state", "ready");
  await expectImageLoaded(procurementMedia);

  const catalogueMedia = page.locator("[data-media-slot^='homepage-catalogue-']");
  await expect(catalogueMedia).toHaveCount(5);
  for (let index = 0; index < 5; index += 1) {
    const frame = catalogueMedia.nth(index);
    await frame.scrollIntoViewIfNeeded();
    await expect(frame).toHaveAttribute("data-media-state", "ready");
    await expectImageLoaded(frame);
  }

  await page.locator("[data-section='catalogue-access']").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Technical catalogues for structured browsing." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Knives catalogue" })).toBeVisible();

  await page.locator("[data-section='quotation-cta']").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Prepare your instrument inquiry." })).toBeVisible();

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});
