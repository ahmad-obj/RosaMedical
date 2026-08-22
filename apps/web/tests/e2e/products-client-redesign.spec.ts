import { expect, test } from "@playwright/test";

test.describe("client Products discovery redesign", () => {
  test("search, family filter, sort and view controls operate on the full result set", async ({ page }) => {
    await page.goto("/products");

    const cards = page.locator("[data-product-result]");
    expect(await cards.count()).toBeGreaterThan(0);

    const firstCode = (await cards.first().locator(".products-result-card__code").innerText()).trim();
    expect(firstCode.length).toBeGreaterThan(0);

    await page.locator("#products-search-input").fill(firstCode);
    await expect(cards.first()).toContainText(firstCode);
    expect(await cards.count()).toBeGreaterThan(0);

    await page.locator("#products-search-input").fill("");
    await page.locator('.products-filter-sidebar input[name="products-family"][value="scissors"]').check();
    expect(await cards.count()).toBeGreaterThan(0);
    const families = await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-family")));
    expect(new Set(families)).toEqual(new Set(["scissors"]));

    await page.locator('.products-filter-sidebar input[name="products-family"][value="all"]').check();
    await page.locator(".products-sort-control select").selectOption("name-asc");
    const names = await cards.locator(".products-result-card__title").allInnerTexts();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));

    await page.getByRole("button", { name: "List view" }).click();
    await expect(page.locator(".products-discovery-workspace")).toHaveAttribute("data-products-view", "list");
    await page.getByRole("button", { name: "Grid view" }).click();
    await expect(page.locator(".products-discovery-workspace")).toHaveAttribute("data-products-view", "grid");
  });

  test("mobile exposes compact filters without horizontal page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/products");

    await expect(page.locator(".products-filter-sidebar")).toBeHidden();
    await expect(page.locator(".products-filter-disclosure")).toBeVisible();

    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  });
});
