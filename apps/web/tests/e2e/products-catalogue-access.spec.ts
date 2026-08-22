import { expect, test } from "@playwright/test";

const expected = {
  knives: "/media/catalogues/pdf/rosa-knives-catalogue.pdf",
  scissors: "/media/catalogues/pdf/rosa-scissors-catalogue.pdf",
  punches: "/media/catalogues/pdf/rosa-punches-catalogue.pdf",
  chisels: "/media/catalogues/pdf/rosa-chisels-catalogue.pdf",
  cutters: "/media/catalogues/pdf/rosa-cutters-catalogue.pdf"
} as const;

test.describe("Products catalogue access", () => {
  test("all five catalogue covers open and download the authoritative PDFs", async ({ page }) => {
    await page.goto("/products");

    for (const [family, path] of Object.entries(expected)) {
      const card = page.locator(`[data-products-catalogue="${family}"]`);
      await expect(card).toHaveCount(1);

      const openLink = card.locator(".products-catalogue-card__cover-link");
      const downloadLink = card.locator(".products-catalogue-card__download");
      await expect(openLink).toHaveAttribute("href", path);
      await expect(openLink).toHaveAttribute("target", "_blank");
      await expect(downloadLink).toHaveAttribute("href", path);
      await expect(downloadLink).toHaveAttribute("download", `rosa-${family}-catalogue.pdf`);

      const response = await page.request.get(path);
      expect(response.ok()).toBe(true);
      const bytes = await response.body();
      expect(bytes.subarray(0, 4).toString("ascii")).toBe("%PDF");
    }
  });

  test("catalogue layout is five-column desktop, three-column tablet and mobile snap rail", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/products");
    const grid = page.locator(".products-catalogue-grid");
    const desktopColumns = await grid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").filter(Boolean).length);
    expect(desktopColumns).toBe(5);

    await page.setViewportSize({ width: 768, height: 900 });
    const tabletColumns = await grid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").filter(Boolean).length);
    expect(tabletColumns).toBe(3);

    await page.setViewportSize({ width: 390, height: 900 });
    const mobile = await grid.evaluate((node) => ({
      overflowX: getComputedStyle(node).overflowX,
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth
    }));
    expect(["auto", "scroll"]).toContain(mobile.overflowX);
    expect(mobile.scrollWidth).toBeGreaterThan(mobile.clientWidth);
  });
});
