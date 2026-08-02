import { expect, test } from "@playwright/test";

const families = ["knives", "scissors", "punches", "chisels", "cutters"] as const;

for (const family of families) {
  test(`${family} family page is stable and honest`, async ({ page }) => {
    const response = await page.goto(`/products/${family}`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-product-card]")).toHaveCount(4);
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByRole("link", { name: new RegExp(`Browse ${family} catalogue`, "i") })).toBeVisible();
    await expect(page.locator('main a[href="/contact"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  });
}

test("product detail exposes catalogue-backed specifications and its responsive inquiry action", async ({ page }, testInfo) => {
  const response = await page.goto("/products/knives/scalpel-handle-no-3");
  expect(response?.ok()).toBe(true);
  await expect(page.locator("h1")).toHaveText("Scalpel Handle No. 3");
  await expect(page.locator("table")).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".mobile-inquiry-bar").getByRole("button", { name: "Add to inquiry" })).toBeDisabled();
  } else {
    await expect(page.getByRole("link", { name: "Add to inquiry" })).toHaveAttribute("href", "/checkout");
  }

  await expect(page.getByRole("link", { name: /catalogue reference/i })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("second-family detail route uses the same template", async ({ page }) => {
  const response = await page.goto("/products/scissors/mayo-scissors");
  expect(response?.ok()).toBe(true);
  await expect(page.locator("h1")).toHaveText("Mayo Scissors");
  await expect(page.getByRole("cell", { name: "04-0402", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "More from Scissors." })).toBeVisible();
});

test("family product mismatch returns 404", async ({ page }) => {
  expect((await page.goto("/products/scissors/scalpel-handle-no-3"))?.status()).toBe(404);
});

test("unsupported catalogue depth returns 404", async ({ page }) => {
  expect((await page.goto("/products/knives/scalpel-handle-no-3/extra"))?.status()).toBe(404);
});

test("mobile sticky action leaves the footer reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only sticky action check");
  await page.goto("/products/knives/scalpel-handle-no-3");
  const sticky = page.locator(".mobile-inquiry-bar");
  await expect(sticky).toBeVisible();
  const lastFooterLink = page.locator(".site-footer a").last();
  await lastFooterLink.scrollIntoViewIfNeeded();
  const stickyBox = await sticky.boundingBox();
  const linkBox = await lastFooterLink.boundingBox();
  expect(stickyBox).not.toBeNull();
  expect(linkBox).not.toBeNull();
  if (stickyBox && linkBox) expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(stickyBox.y);
});