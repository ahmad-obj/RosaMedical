import { expect, test } from "@playwright/test";

const mainPublicRoutes = ["/", "/about", "/products", "/inquiry", "/contact"] as const;

for (const route of mainPublicRoutes) {
  test(`${route} ends with the shared red Contact us ribbon and global footer`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBe(true);

    const strip = page.locator(".public-contact-strip");
    await expect(strip).toHaveCount(1);
    await expect(strip).toBeVisible();
    await expect(strip).toContainText("Contact us");
    await expect(strip).toContainText("Follow Rosa");
    await expect(strip).toHaveCSS("background-color", "rgb(224, 8, 21)");

    const order = await page.evaluate(() => {
      const stripNode = document.querySelector(".public-contact-strip");
      const footerNode = document.querySelector(".site-footer");
      if (!stripNode || !footerNode) return null;
      return Boolean(stripNode.compareDocumentPosition(footerNode) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order).toBe(true);
  });
}
