import { expect, test } from "@playwright/test";

const LOCAL_SCISSORS_AVIF =
  /^\/media\/catalogue-preview\/scissors\/[a-z0-9-]+\.avif$/;
const LOCAL_SCISSORS_WEBP =
  /^\/media\/catalogue-preview\/scissors\/[a-z0-9-]+\.webp$/;

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

test.describe("Scissors Batch 01 production media", () => {
  test.setTimeout(120_000);

  test("renders all 42 local product images on the Scissors family route", async ({
    page
  }) => {
    const response = await page.goto("/products/scissors");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Scissors");

    const cards = page.locator("[data-product-card]");
    const pictures = cards.locator("picture");
    const avifSources = pictures.locator('source[type="image/avif"]');
    const images = pictures.locator("img");

    await expect(cards).toHaveCount(42);
    await expect(pictures).toHaveCount(42);
    await expect(avifSources).toHaveCount(42);
    await expect(images).toHaveCount(42);

    for (let index = 0; index < 42; index += 1) {
      const sourcePath = await avifSources.nth(index).getAttribute("srcset");
      const fallbackPath = await images.nth(index).getAttribute("src");

      expect(sourcePath).toMatch(LOCAL_SCISSORS_AVIF);
      expect(fallbackPath).toMatch(LOCAL_SCISSORS_WEBP);
      await expectImageLoaded(images.nth(index));
    }

    await expectNoHorizontalOverflow(page);
  });

  test("renders the preserved Mayo route with its local primary image and catalogue data", async ({
    page
  }) => {
    const response = await page.goto("/products/scissors/mayo-scissors");
    expect(response?.ok()).toBe(true);

    await expect(page.locator("h1")).toHaveText("Mayo Scissors");
    await expect(page.getByText("04-0401", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("14.5 cm", { exact: false }).first()).toBeVisible();

    const primaryPicture = page.locator(".product-gallery__primary picture");
    const primarySource = primaryPicture.locator('source[type="image/avif"]');
    const primaryImage = primaryPicture.locator("img");

    await expect(primaryPicture).toHaveCount(1);
    await expect(primarySource).toHaveAttribute(
      "srcset",
      "/media/catalogue-preview/scissors/scissors-mayo-regular-straight.avif"
    );
    await expect(primaryImage).toHaveAttribute(
      "src",
      "/media/catalogue-preview/scissors/scissors-mayo-regular-straight.webp"
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
