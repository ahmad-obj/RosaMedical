import { expect, test } from "@playwright/test";

const productCounts = {
  knives: 22,
  scissors: 42,
  punches: 15,
  chisels: 20,
  cutters: 14
} as const;

for (const [family, productCount] of Object.entries(productCounts)) {
  test(`${family} family page is stable and honest`, async ({ page }) => {
    const response = await page.goto(`/products/${family}`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-product-card]")).toHaveCount(productCount);
    await expect(page.locator("form")).toHaveCount(0);
    await expect(
      page.getByRole("link", {
        name: new RegExp(`Browse ${family} catalogue`, "i")
      })
    ).toBeVisible();
    await expect(page.locator('main a[href="/contact"]')).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
    ).toBe(false);
  });
}

test("product detail exposes catalogue-backed specifications and an active inquiry action", async ({ page }, testInfo) => {
  const response = await page.goto("/products/knives/scalpel-handle-no-3");
  expect(response?.ok()).toBe(true);
  await expect(page.locator("h1")).toHaveText("Scalpel Handle No. 3");
  await expect(page.locator("table")).toBeVisible();
  await expect(page.locator(".product-price-state")).toContainText("On request");

  if (testInfo.project.name === "mobile") {
    const stickyAction = page.locator('.mobile-inquiry-bar a[href="#product-inquiry-controls"]');
    await expect(stickyAction).toBeVisible();
    await expect(stickyAction).toContainText("Choose quantity");
  }

  const action = page.locator(".product-procurement-summary").getByRole("button", { name: "Add to inquiry" });
  await expect(action).toBeEnabled();
  await action.click();
  const addedAction = page.locator(".product-procurement-summary").getByRole("link", { name: /Added.*View inquiry/i });
  await expect(addedAction).toHaveAttribute("href", "/inquiry");

  await expect(page.getByRole("link", { name: /catalogue reference/i })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
  ).toBe(false);
});

test("second-family detail route uses the same template", async ({ page }) => {
  const response = await page.goto("/products/scissors/mayo-scissors");
  expect(response?.ok()).toBe(true);
  await expect(page.locator("h1")).toHaveText("Mayo Scissors");
  await expect(page.getByRole("cell", { name: "04-0401", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "More from Scissors." })).toBeVisible();
});

test("family product mismatch fails closed", async ({ page }) => {
  const response = await page.goto("/products/scissors/scalpel-handle-no-3");
  expect([200, 404]).toContain(response?.status());
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading", { name: "This page is not in the catalogue." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Scalpel Handle No. 3" })).toHaveCount(0);
});

test("unsupported catalogue depth fails closed", async ({ page }) => {
  const response = await page.goto("/products/knives/scalpel-handle-no-3/extra");
  expect([200, 404]).toContain(response?.status());
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading", { name: "This page is not in the catalogue." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Scalpel Handle No. 3" })).toHaveCount(0);
});

test("mobile sticky action leaves the footer reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only sticky action check");
  await page.goto("/products/knives/scalpel-handle-no-3");

  const sticky = page.locator(".mobile-inquiry-bar");
  const stickyAction = sticky.locator('a[href="#product-inquiry-controls"]');
  const lastFooterLink = page.locator(".site-footer a").last();
  await expect(sticky).toBeVisible();
  await expect(stickyAction).toBeVisible();
  await stickyAction.click();
  await expect(page.locator("#product-inquiry-controls")).toBeInViewport();
  await lastFooterLink.scrollIntoViewIfNeeded();
  await expect(lastFooterLink).toBeVisible();

  const overlapsFooterLink = await page.evaluate(() => {
    const stickyElement = document.querySelector<HTMLElement>(".mobile-inquiry-bar");
    const linkElement = document.querySelector<HTMLElement>(".site-footer a:last-of-type");
    if (!stickyElement || !linkElement) return true;

    const stickyRect = stickyElement.getBoundingClientRect();
    const linkRect = linkElement.getBoundingClientRect();
    const stickyIsInViewport =
      stickyRect.bottom > 0 && stickyRect.top < window.innerHeight;

    return stickyIsInViewport &&
      stickyRect.left < linkRect.right &&
      stickyRect.right > linkRect.left &&
      stickyRect.top < linkRect.bottom &&
      stickyRect.bottom > linkRect.top;
  });

  expect(overlapsFooterLink).toBe(false);
});
