import { expect, test } from "@playwright/test";

const LOCAL_CHISELS_AVIF =
  /^\/media\/catalogue-preview\/chisels\/[a-z0-9-]+\.avif$/;
const LOCAL_CHISELS_WEBP =
  /^\/media\/catalogue-preview\/chisels\/[a-z0-9-]+\.webp$/;

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

test.describe("Chisels Batch 01 production media", () => {
  test.setTimeout(120_000);

  test("renders 16 local Batch 01 images alongside four preserved Chisels records", async ({
    page
  }) => {
    const response = await page.goto("/products/chisels");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Chisels");

    const cards = page.locator("[data-product-card]");
    const pictures = cards.locator("picture");
    const avifSources = pictures.locator('source[type="image/avif"]');
    const images = pictures.locator("img");

    await expect(cards).toHaveCount(20);
    await expect(pictures).toHaveCount(16);
    await expect(avifSources).toHaveCount(16);
    await expect(images).toHaveCount(16);

    for (let index = 0; index < 16; index += 1) {
      const sourcePath = await avifSources.nth(index).getAttribute("srcset");
      const fallbackPath = await images.nth(index).getAttribute("src");

      expect(sourcePath).toMatch(LOCAL_CHISELS_AVIF);
      expect(fallbackPath).toMatch(LOCAL_CHISELS_WEBP);
      await expectImageLoaded(images.nth(index));
    }

    await expectNoHorizontalOverflow(page);
  });

  test("renders the first Batch 01 detail route with local media and exact catalogue data", async ({
    page
  }) => {
    const response = await page.goto("/products/chisels/osteotomes-13-5cm");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("h1")).toHaveText("Osteotomes");
    await expect(page.getByText("36-6301", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("13.5 cm · 4 mm", { exact: false }).first()).toBeVisible();

    const primaryPicture = page.locator(".product-gallery__primary picture");
    const primarySource = primaryPicture.locator('source[type="image/avif"]');
    const primaryImage = primaryPicture.locator("img");

    await expect(primaryPicture).toHaveCount(1);
    await expect(primarySource).toHaveAttribute(
      "srcset",
      "/media/catalogue-preview/chisels/chisels-osteotomes-13-5cm.avif"
    );
    await expect(primaryImage).toHaveAttribute(
      "src",
      "/media/catalogue-preview/chisels/chisels-osteotomes-13-5cm.webp"
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
