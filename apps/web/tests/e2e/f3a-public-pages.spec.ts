import { expect, test } from "@playwright/test";

for (const route of ["/", "/products"] as const) {
  test(`${route} has stable F3A semantics and no horizontal overflow`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText(/in stock|rating|checkout|payment|shipping/i);
    if (route === "/products") {
      await expect(page.locator("body")).toContainText("Price on request");
      await expect(page.locator("body")).not.toContainText(/\b(?:20|25|200|300)\s*SAR\b/i);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  });

  test(`${route} exposes visible keyboard focus`, async ({ page }) => {
    await page.goto(route);
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  });
}

test("homepage exposes all five family links", async ({ page }) => {
  await page.goto("/");
  for (const slug of ["knives", "scissors", "punches", "chisels", "cutters"]) {
    await expect(page.locator(`main a[href="/products/${slug}"]`).first()).toBeVisible();
  }
});

test("products exposes a functional search and inquiry-safe product discovery workspace", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("search")).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /search products by name, code, size or option/i })).toBeVisible();
  await expect(page.locator("[data-products-results]")).toBeVisible();
  await expect(page.getByText("All products", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Price on request").first()).toBeVisible();
});
