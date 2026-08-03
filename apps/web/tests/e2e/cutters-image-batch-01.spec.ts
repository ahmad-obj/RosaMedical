import { expect, test } from "@playwright/test";

const LOCAL_CUTTERS_AVIF =
  /^\/media\/catalogue-preview\/cutters\/[a-z0-9-]+\.avif$/;
const LOCAL_CUTTERS_WEBP =
  /^\/media\/catalogue-preview\/cutters\/[a-z0-9-]+\.webp$/;

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

test.describe("Cutters Batch 01 production media", () => {
  test.setTimeout(120_000);

  test("renders 13 local Batch 01 images alongside the preserved SC-01T record", async ({
    page
  }) => {
    const response = await page.goto("/products/cutters");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Cutters");

    const cards = page.locator("[data-product-card]");
    const pictures = cards.locator("picture");
    const avifSources = pictures.locator('source[type="image/avif"]');
    const images = pictures.locator("img");

    await expect(cards).toHaveCount(14);
    await expect(pictures).toHaveCount(13);
    await expect(avifSources).toHaveCount(13);
    await expect(images).toHaveCount(13);

    for (let index = 0; index < 13; index += 1) {
      const sourcePath = await avifSources.nth(index).getAttribute("srcset");
      const fallbackPath = await images.nth(index).getAttribute("src");

      expect(sourcePath).toMatch(LOCAL_CUTTERS_AVIF);
      expect(fallbackPath).toMatch(LOCAL_CUTTERS_WEBP);
      await expectImageLoaded(images.nth(index));
    }

    await expect(page.getByText("SC-01T", { exact: true }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("renders the preserved Liston route with local media and exact catalogue data", async ({
    page
  }) => {
    const response = await page.goto("/products/cutters/liston");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("h1")).toHaveText("Liston");
    await expect(page.getByText("36-5101", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("14.0 cm", { exact: false }).first()).toBeVisible();

    const primaryPicture = page.locator(".product-gallery__primary picture");
    const primarySource = primaryPicture.locator('source[type="image/avif"]');
    const primaryImage = primaryPicture.locator("img");

    await expect(primaryPicture).toHaveCount(1);
    await expect(primarySource).toHaveAttribute(
      "srcset",
      "/media/catalogue-preview/cutters/cutters-liston-straight.avif"
    );
    await expect(primaryImage).toHaveAttribute(
      "src",
      "/media/catalogue-preview/cutters/cutters-liston-straight.webp"
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
