import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "phone-390", width: 390, height: 844 },
  { name: "phone-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "wide-2560", width: 2560, height: 1440 }
] as const;

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);
}

async function gridColumnCount(page: Page, selector: string): Promise<number> {
  return page.locator(selector).evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns.trim();
    return columns ? columns.split(/\s+/).length : 0;
  });
}

for (const viewport of viewports) {
  test(`About client redesign composes at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto("/about");
    expect(response?.ok()).toBe(true);
    await expect(page.locator("[data-section='about-client-hero']")).toBeVisible();
    await expect(page.locator("[data-about-story]")).toHaveCount(3);
    await expect(page.locator("[data-about-compliance-item]")).toHaveCount(6);
    await expect(page.locator("[data-about-document]")).toHaveCount(5);
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
  });
}

test("1024px keeps desktop compliance and document geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/about");
  expect(await gridColumnCount(page, ".about-client-compliance__grid")).toBe(6);
  expect(await gridColumnCount(page, ".about-client-documents__grid")).toBe(5);
  await expect(page.locator(".about-client-compliance__connector")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("1023px uses upper-tablet compliance and document geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 768 });
  await page.goto("/about");
  expect(await gridColumnCount(page, ".about-client-compliance__grid")).toBe(3);
  expect(await gridColumnCount(page, ".about-client-documents__grid")).toBe(3);
  await expect(page.locator(".about-client-compliance__connector")).toBeHidden();
  await expectNoHorizontalOverflow(page);
});

test("About keeps its internal contact band and the same shared footer ribbon as other public pages", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("[data-section='about-client-contact']")).toBeVisible();
  await expect(page.locator("[data-section='about-client-social']")).toHaveCount(0);
  await expect(page.locator(".public-contact-strip")).toBeVisible();
  await expect(page.locator(".public-contact-strip")).toContainText("Contact us");

  await page.goto("/products");
  await expect(page.locator(".public-contact-strip")).toBeVisible();
  await expect(page.locator(".public-contact-strip")).toContainText("Contact us");
});

test("mobile documents use a contained snap rail", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const rail = page.locator(".about-client-documents__grid");
  await expect(rail).toHaveCSS("display", "flex");
  await expect(rail).toHaveCSS("overflow-x", "auto");
  const snap = await rail.evaluate((element) => getComputedStyle(element).scrollSnapType);
  expect(snap).toMatch(/(x|inline).*mandatory/);
  await expectNoHorizontalOverflow(page);
});

test("Arabic About keeps complete RTL structure", async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  const response = await page.goto("/ar/about");
  expect(response?.ok()).toBe(true);
  await expect(page.locator(".public-locale-boundary")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("[data-about-story]")).toHaveCount(3);
  await expect(page.locator("[data-about-compliance-item]")).toHaveCount(6);
  await expect(page.locator("[data-about-document]")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "الامتثال" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("reduced motion leaves the complete About page visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await expect(page.locator("[data-section='about-client-hero']")).toBeVisible();
  await expect(page.locator("[data-about-story]")).toHaveCount(3);
  await expect(page.locator("[data-about-document]")).toHaveCount(5);
  await expect(page.locator(".about-client-hero__media")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".about-client-compliance__connector")).toHaveCSS("animation-name", "none");
});
