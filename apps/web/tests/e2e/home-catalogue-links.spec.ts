import { expect, test } from "@playwright/test";

const expected = {
  scissors: "/media/catalogues/pdf/rosa-scissors-catalogue.pdf",
  cutters: "/media/catalogues/pdf/rosa-cutters-catalogue.pdf",
  punches: "/media/catalogues/pdf/rosa-punches-catalogue.pdf",
  chisels: "/media/catalogues/pdf/rosa-chisels-catalogue.pdf",
  knives: "/media/catalogues/pdf/rosa-knives-catalogue.pdf"
} as const;

test("Home catalogue artwork opens the real technical PDF for every family", async ({ page }) => {
  await page.goto("/");

  for (const [family, pdf] of Object.entries(expected)) {
    const panel = page.locator(`[data-family-panel][data-family="${family}"]`);
    await expect(panel).toBeVisible();
    const link = panel.locator("a").first();
    await expect(link).toHaveAttribute("href", pdf);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});
