import { expect, test } from "@playwright/test";

const LOCAL_PUNCHES_AVIF =
  /^\/media\/catalogue-preview\/punches\/[a-z0-9-]+\.avif$/;
const LOCAL_PUNCHES_WEBP =
  /^\/media\/catalogue-preview\/punches\/[a-z0-9-]+\.webp$/;

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
  ).toBe(false);
}

async function expectImageLoaded(
  image: import("@playwright/test").Locator
): Promise<void> {
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        image.evaluate(
          (element) =>
            element instanceof HTMLImageElement &&
            element.complete &&
            element.naturalWidth > 0 &&
            element.naturalHeight > 0
        ),
      { timeout: 10_000 }
    )
    .toBe(true);
}

test.describe("Punches Batch 01 production media", () => {
  test.setTimeout(120_000);

  test("renders 14 local Batch 01 images alongside the preserved Biopsy Punch", async ({
    page
  }) => {
    const response = await page.goto("/products/punches");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Punches");

    const cards = page.locator("[data-product-card]");
    const pictures = cards.locator("picture");
    const avifSources = pictures.locator('source[type="image/avif"]');
    const images = pictures.locator("img");

    await expect(cards).toHaveCount(15);
    await expect(pictures).toHaveCount(14);
    await expect(avifSources).toHaveCount(14);
    await expect(images).toHaveCount(14);

    for (let index = 0; index < 14; index += 1) {
      const sourcePath = await avifSources.nth(index).getAttribute("srcset");
      const fallbackPath = await images.nth(index).getAttribute("src");

      expect(sourcePath).toMatch(LOCAL_PUNCHES_AVIF);
      expect(fallbackPath).toMatch(LOCAL_PUNCHES_WEBP);
      await expectImageLoaded(images.nth(index));
    }

    await expect(
      page.getByText("Biopsy Punch", { exact: true }).first()
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("renders the established Yeoman route with local media and exact catalogue data", async ({
    page
  }) => {
    const response = await page.goto("/products/punches/yeoman");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("h1")).toHaveText("Yeoman Punch");
    await expect(page.getByText("21-1001", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("28.0 cm", { exact: false }).first()).toBeVisible();

    const primaryPicture = page.locator(".product-gallery__primary picture");
    const primarySource = primaryPicture.locator('source[type="image/avif"]');
    const primaryImage = primaryPicture.locator("img");

    await expect(primaryPicture).toHaveCount(1);
    await expect(primarySource).toHaveAttribute(
      "srcset",
      "/media/catalogue-preview/punches/punches-yeoman-21-10.avif"
    );
    await expect(primaryImage).toHaveAttribute(
      "src",
      "/media/catalogue-preview/punches/punches-yeoman-21-10.webp"
    );
    await expectImageLoaded(primaryImage);

    expect(
      await primaryImage.evaluate(
        (element) => getComputedStyle(element).objectFit
      )
    ).toBe("contain");

    await expectNoHorizontalOverflow(page);
  });
});
