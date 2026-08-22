import { expect, test } from "@playwright/test";

test.describe("Product Detail quotation cart", () => {
  test("selected quantity and note travel into the existing inquiry basket", async ({ page }) => {
    await page.goto("/products");
    await page.evaluate(() => localStorage.removeItem("rosa-medical-inquiry-v1"));

    const detailHref = await page.locator(".products-result-card__details").first().getAttribute("href");
    expect(detailHref).toBeTruthy();
    await page.goto(detailHref!);

    const productName = (await page.locator("#product-title").innerText()).trim();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(page.getByRole("status", { name: "Selected quantity" }).or(page.locator('output[aria-label="Selected quantity"]'))).toHaveText("2");
    await page.locator("#product-inquiry-note").fill("Sterile packing requested");
    await page.getByRole("button", { name: "Add to inquiry" }).click();
    await expect(page.getByRole("link", { name: "Added · View inquiry" })).toBeVisible();
    await page.getByRole("link", { name: "Added · View inquiry" }).click();

    await expect(page.locator('[data-public-hero-page="inquiry"]')).toBeVisible();
    const line = page.locator("[data-inquiry-line]").filter({ hasText: productName });
    await expect(line).toHaveCount(1);
    await expect(line.locator(".inquiry-preview-quantity output")).toHaveText("2");
    await expect(line.locator(".inquiry-preview-note input")).toHaveValue("Sterile packing requested");
    await expect(page.getByRole("link", { name: "Request quotation" })).toBeVisible();
  });

  test("mobile sticky action targets canonical controls instead of adding directly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/products");
    await page.evaluate(() => localStorage.removeItem("rosa-medical-inquiry-v1"));

    const detailHref = await page.locator(".products-result-card__details").first().getAttribute("href");
    expect(detailHref).toBeTruthy();
    await page.goto(detailHref!);

    const sticky = page.locator('.mobile-inquiry-bar a[href="#product-inquiry-controls"]');
    await expect(sticky).toBeVisible();
    await sticky.click();
    await expect(page.locator("#product-inquiry-controls")).toBeInViewport();

    const stored = await page.evaluate(() => localStorage.getItem("rosa-medical-inquiry-v1"));
    expect(stored).toBeNull();
  });
});
