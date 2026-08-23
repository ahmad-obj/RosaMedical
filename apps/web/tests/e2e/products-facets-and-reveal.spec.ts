import { expect, test } from "@playwright/test";

test.describe("Products contextual filters and progressive reveal", () => {
  test("search remains interactive and never enters the page error boundary", async ({ page }) => {
    await page.goto("/products");
    const search = page.getByRole("searchbox", { name: /search products/i });
    await search.fill("iris");

    await expect(page.getByText("Something went wrong")).toHaveCount(0);
    await expect(search).toHaveValue("iris");
    await expect(page.locator("[data-products-results]")).toBeVisible();
  });

  test("family and facet controls expose deterministic checked state", async ({ page }) => {
    await page.goto("/products");

    const scissors = page.getByRole("radio", { name: /scissors/i }).first();
    await scissors.check();
    await expect(scissors).toBeChecked();
    await expect(scissors.locator("xpath=..")).toHaveAttribute("data-selected", "true");

    const straight = page.getByRole("checkbox", { name: /^straight/i }).first();
    await straight.check();
    await expect(straight).toBeChecked();
    await expect(straight.locator("xpath=..")).toHaveAttribute("data-selected", "true");
    await expect(page).toHaveURL(/family=scissors/);
    await expect(page).toHaveURL(/direction=Straight/);
  });

  test("starts with a bounded result batch and expands only when requested", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/products");

    const cards = page.locator("[data-products-results] > li");
    await expect(cards).toHaveCount(12);

    const more = page.getByRole("button", { name: /see more products/i });
    await expect(more).toBeVisible();
    await more.click();
    await expect(cards).toHaveCount(24);
  });

  test("clear filters restores the unfiltered catalogue and resets reveal", async ({ page }) => {
    await page.goto("/products?family=scissors&direction=Straight");
    await expect(page.getByRole("radio", { name: /scissors/i }).first()).toBeChecked();

    await page.getByRole("button", { name: /clear filters/i }).first().click();
    await expect(page).not.toHaveURL(/family=/);
    await expect(page).not.toHaveURL(/direction=/);
    await expect(page.locator("[data-products-results] > li")).toHaveCount(12);
  });
});
