import { expect, test } from "@playwright/test";

async function gridMetrics(page: import("@playwright/test").Page) {
  return page.locator("[data-products-results]").evaluate((list) => {
    const items = Array.from(list.children) as HTMLElement[];
    if (items.length === 0) return { count: 0, columns: 1 };
    const firstTop = items[0]!.getBoundingClientRect().top;
    const columns = items.filter((item) => Math.abs(item.getBoundingClientRect().top - firstTop) < 1).length;
    return { count: items.length, columns: Math.max(1, columns) };
  });
}

test.describe("Products contextual filters and progressive reveal", () => {
  test("search remains interactive and never enters the page error boundary", async ({ page }) => {
    await page.goto("/products");
    const search = page.getByRole("searchbox", { name: /search products/i });
    await search.fill("iris");

    await expect(page.getByText("Something went wrong")).toHaveCount(0);
    await expect(search).toHaveValue("iris");
    await expect(page.locator("[data-products-results]")).toBeVisible();
  });

  test("keeps product family visible while advanced facets use one compact accordion", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/products");

    await expect(page.getByRole("radio", { name: /all products/i }).first()).toBeVisible();
    await expect(page.getByRole("radio", { name: /scissors/i }).first()).toBeVisible();

    const size = page.getByRole("button", { name: /^size/i }).first();
    const direction = page.getByRole("button", { name: /^direction/i }).first();
    const variant = page.getByRole("button", { name: /^variant/i }).first();

    await expect(size).toHaveAttribute("aria-expanded", "false");
    await expect(direction).toHaveAttribute("aria-expanded", "false");
    await expect(variant).toHaveAttribute("aria-expanded", "false");

    await size.click();
    await expect(size).toHaveAttribute("aria-expanded", "true");

    await direction.click();
    await expect(direction).toHaveAttribute("aria-expanded", "true");
    await expect(size).toHaveAttribute("aria-expanded", "false");

    const straight = page.getByRole("checkbox", { name: /^straight/i }).first();
    await straight.check();
    await expect(straight).toBeChecked();

    await variant.click();
    await expect(direction).toHaveAttribute("aria-expanded", "false");
    await expect(direction).toContainText("Straight");
    await expect(page).toHaveURL(/direction=Straight/);
  });

  test("never places See more after an artificially incomplete grid row", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/products");

    const more = page.getByRole("button", { name: /see more products/i });
    await expect(more).toBeVisible();

    await expect.poll(async () => {
      const { count, columns } = await gridMetrics(page);
      return count % columns;
    }).toBe(0);

    const before = await gridMetrics(page);
    await more.click();

    await expect.poll(async () => (await gridMetrics(page)).count).toBeGreaterThan(before.count);
    const after = await gridMetrics(page);
    expect(after.count % after.columns).toBe(0);
  });

  test("clear filters restores the unfiltered catalogue and a complete initial grid", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/products?family=scissors&direction=Straight");
    await expect(page.getByRole("radio", { name: /scissors/i }).first()).toBeChecked();
    await expect(page.getByRole("button", { name: /^direction/i }).first()).toContainText("Straight");

    await page.getByRole("button", { name: /clear filters/i }).first().click();
    await expect(page).not.toHaveURL(/family=/);
    await expect(page).not.toHaveURL(/direction=/);

    await expect.poll(async () => {
      const { count, columns } = await gridMetrics(page);
      return count % columns;
    }).toBe(0);
  });
});
