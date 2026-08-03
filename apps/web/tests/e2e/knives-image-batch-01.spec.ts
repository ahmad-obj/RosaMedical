import { expect, test } from "@playwright/test";

const LOCAL_KNIVES_AVIF =
  /^\/media\/catalogue-preview\/knives\/[a-z0-9-]+\.avif$/;
const LOCAL_KNIVES_WEBP =
  /^\/media\/catalogue-preview\/knives\/[a-z0-9-]+\.webp$/;

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

test.describe("Knives Batch 01 production media", () => {
  test.setTimeout(120_000);

  test("renders 18 local Batch 01 images alongside four preserved Knives records", async ({
    page
  }) => {
    const response = await page.goto("/products/knives");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Knives");

    const cards = page.locator("[data-product-card]");
    const pictures = cards.locator("picture");
    const avifSources = pictures.locator('source[type="image/avif"]');
    const images = pictures.locator("img");

    await expect(cards).toHaveCount(22);
    await expect(pictures).toHaveCount(18);
    await expect(avifSources).toHaveCount(18);
    await expect(images).toHaveCount(18);

    for (let index = 0; index < 18; index += 1) {
      const sourcePath = await avifSources.nth(index).getAttribute("srcset");
      const fallbackPath = await images.nth(index).getAttribute("src");

      expect(sourcePath).toMatch(LOCAL_KNIVES_AVIF);
      expect(fallbackPath).toMatch(LOCAL_KNIVES_WEBP);
      await expectImageLoaded(images.nth(index));
    }

    await expect(
      page.getByText("Bard Parker Handle", { exact: true }).first()
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("renders the first Batch 01 detail route with local media and exact catalogue data", async ({
    page
  }) => {
    const response = await page.goto("/products/knives/number-3");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("h1")).toHaveText("Scalpel Handle No. 3");
    await expect(page.getByText("18-0103", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("12.0 cm", { exact: false }).first()).toBeVisible();

    const primaryPicture = page.locator(".product-gallery__primary picture");
    const primarySource = primaryPicture.locator('source[type="image/avif"]');
    const primaryImage = primaryPicture.locator("img");

    await expect(primaryPicture).toHaveCount(1);
    await expect(primarySource).toHaveAttribute(
      "srcset",
      "/media/catalogue-preview/knives/knives-number-3.avif"
    );
    await expect(primaryImage).toHaveAttribute(
      "src",
      "/media/catalogue-preview/knives/knives-number-3.webp"
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
