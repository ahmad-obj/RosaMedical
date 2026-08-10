import { expect, test, type Page } from "@playwright/test";

async function nextSectionRatio(page: Page): Promise<number> {
  return page.evaluate(() => {
    const next = document.querySelector<HTMLElement>("[data-section='family-discovery']");
    if (!next) throw new Error("Family discovery missing");
    return next.getBoundingClientRect().top / innerHeight;
  });
}

test("1366x768 exposes roughly 8-15 percent continuation after the hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  const ratio = await nextSectionRatio(page);
  expect(ratio).toBeGreaterThanOrEqual(0.84);
  expect(ratio).toBeLessThanOrEqual(0.92);
});

test("390x844 keeps message CTA and image inside a compact integrated hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(page.locator(".home-hero__title")).toBeVisible();
  await expect(page.locator("[data-media-slot='homepage-hero-active']")).toBeVisible();
  const hero = await page.locator("[data-section='home-hero']").boundingBox();
  expect(hero).not.toBeNull();
  expect(hero!.height).toBeLessThan(760);
});

test("hero dot click selects the requested slide", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(page.locator("[data-section='home-hero']")).toHaveAttribute("data-active-slide", "precision-instruments");
  await page.locator(".home-hero-carousel__dot").nth(1).click();
  await expect(page.locator("[data-section='home-hero']")).toHaveAttribute("data-active-slide", "clinical-instrument-context");
});


test("homepage family gallery keeps the approved five-family order and image-name-only content", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator("[data-family-panel]")).toHaveCount(5);
  expect(await gallery.locator("[data-family-panel]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-family")))).toEqual([
    "knives", "scissors", "punches", "chisels", "cutters"
  ]);
  await expect(page.locator("[data-section='family-discovery'] .public-section-heading__copy")).toHaveCount(0);
  await expect(gallery.getByText("Explore collection")).toHaveCount(0);
});

test("1024 fine-pointer layout uses accordion and focus expands Chisels", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  expect(await gallery.evaluate((node) => getComputedStyle(node).overflowX)).toBe("hidden");
  const panels = gallery.locator("[data-family-panel]");
  const firstBefore = await panels.nth(0).boundingBox();
  const secondBefore = await panels.nth(1).boundingBox();
  expect(firstBefore!.width).toBeGreaterThan(secondBefore!.width);
  await panels.filter({ has: page.getByRole("heading", { name: "Chisels" }) }).getByRole("link").focus();
  await page.waitForTimeout(650);
  const chisel = await gallery.locator("[data-family='chisels']").boundingBox();
  const inactive = await gallery.locator("[data-family='scissors']").boundingBox();
  expect(chisel!.width).toBeGreaterThan(inactive!.width);
});

test("tablet gallery is a native swipe rail with a next-card sliver", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "tablet");
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  const galleryBox = await gallery.boundingBox();
  const first = await gallery.locator("[data-family-panel]").first().boundingBox();
  const second = await gallery.locator("[data-family-panel]").nth(1).boundingBox();
  expect(await gallery.evaluate((node) => getComputedStyle(node).overflowX)).toBe("auto");
  expect(first!.width / galleryBox!.width).toBeGreaterThanOrEqual(0.82);
  expect(first!.width / galleryBox!.width).toBeLessThanOrEqual(0.86);
  expect(second!.x).toBeLessThan(galleryBox!.x + galleryBox!.width);
});

test("coarse pointer keeps the family rail even at wide width", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  expect(await gallery.evaluate((node) => getComputedStyle(node).overflowX)).toBe("auto");
});


test("homepage preserves the refined five-section story and five catalogue media cards", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const sections = [
    "home-hero",
    "family-discovery",
    "procurement-support",
    "featured-instruments",
    "catalogue-access"
  ];
  for (const section of sections) {
    await expect(page.locator(`[data-section='${section}']`)).toHaveCount(1);
  }
  await expect(page.locator("[data-section='quotation-cta']")).toHaveCount(0);
  await expect(page.locator("[data-section='catalogue-access'] [data-media-slot^='homepage-catalogue-']")).toHaveCount(5);
});

test("1366x768 keeps the remaining homepage sections within compact density bounds", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.locator("[data-section='procurement-support']").scrollIntoViewIfNeeded();

  const metrics = await page.evaluate(() => {
    const css = (selector: string) => {
      const node = document.querySelector<HTMLElement>(selector);
      if (!node) throw new Error(`Missing ${selector}`);
      const style = getComputedStyle(node);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        paddingTop: Number.parseFloat(style.paddingTop),
        minHeight: Number.parseFloat(style.minHeight),
        height: node.getBoundingClientRect().height
      };
    };
    return {
      sectionTitle: css("[data-section='procurement-support'] .public-section-heading__title"),
      procurementDetails: css(".home-procurement-refined__details"),
      productBody: css(".product-preview-card__body"),
      catalogueCard: css(".catalogue-card")
    };
  });

  expect(metrics.sectionTitle.fontSize).toBeLessThanOrEqual(44);
  expect(metrics.procurementDetails.height).toBeLessThanOrEqual(360);
  expect(metrics.productBody.minHeight).toBeLessThanOrEqual(168);
  expect(metrics.catalogueCard.minHeight).toBeLessThanOrEqual(224);
});

test("shared social links render safely above the footer and in the dedicated Contact section", async ({ page }) => {
  await page.goto("/");
  const strip = page.locator(".public-contact-strip");
  const stripSocials = strip.locator("[data-social-links] a");
  await expect(stripSocials).toHaveCount(4);
  await expect(strip.locator("xpath=following-sibling::footer[1]")).toHaveCount(1);
  for (const link of await stripSocials.all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }

  await page.goto("/contact");
  await expect(page.locator(".contact-social-section [data-social-links] a")).toHaveCount(4);
  await expect(page.locator("body")).not.toContainText("@rosamedicalexample");
});

test("Arabic homepage keeps RTL typography and the same physical hero composition", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop" && testInfo.project.name !== "mobile");
  await page.goto("/");
  const englishHero = page.locator(".home-hero-carousel__slide");
  const englishSide = await englishHero.getAttribute("data-copy-side");
  const englishSlide = await page.locator("[data-section='home-hero']").getAttribute("data-active-slide");

  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("[data-section='home-hero']")).toHaveAttribute("data-active-slide", englishSlide!);
  await expect(page.locator(".home-hero-carousel__slide")).toHaveAttribute("data-copy-side", englishSide!);

  const computed = await page.locator(".public-page--home").evaluate((node) => ({
    fontFamily: getComputedStyle(node).fontFamily,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  expect(computed.fontFamily).toContain("Noto Sans Arabic");
  expect(computed.overflow).toBe(false);
  await expect(page.locator("[data-home-family-gallery]")).toBeVisible();
  await expect(page.locator(".public-contact-strip [data-social-links] a")).toHaveCount(4);
});

test("hero dot keyboard navigation wraps and keeps roving focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const dots = page.locator(".home-hero-carousel__dot");
  await dots.first().focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("[data-section='home-hero']")).toHaveAttribute("data-active-slide", "catalogue-to-quotation");
  await expect(dots.nth(3)).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("[data-section='home-hero']")).toHaveAttribute("data-active-slide", "precision-instruments");
  await expect(dots.first()).toBeFocused();
});

test("hero autoplay advances consistently under an idle pointer and pauses during focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "clinical-instrument-context");

  await hero.hover();
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "surgical-instrument-selection");

  await page.locator(".home-hero-carousel__dot").nth(1).focus();
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "surgical-instrument-selection");
});

test("reduced motion disables hero autoplay", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");
});

test("mobile horizontal swipe advances exactly one slide", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await hero.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 7, isPrimary: true, button: 0, clientX: 310, clientY: 320 });
  await hero.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 7, isPrimary: true, button: 0, clientX: 220, clientY: 326 });
  await expect(hero).toHaveAttribute("data-active-slide", "clinical-instrument-context");
});

test("mostly vertical mobile gesture does not change hero slide", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await hero.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 8, isPrimary: true, button: 0, clientX: 300, clientY: 240 });
  await hero.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 8, isPrimary: true, button: 0, clientX: 240, clientY: 400 });
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");
});

test("hero exposes dots only with 44px targets and visible keyboard focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await expect(hero.locator("button:not(.home-hero-carousel__dot)")).toHaveCount(0);
  const dots = hero.locator(".home-hero-carousel__dot");
  await expect(dots).toHaveCount(4);
  for (const box of await dots.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()))) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  const cta = hero.getByRole("link", { name: "Explore Products" });
  await cta.focus();
  expect(await cta.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe("none");
  const family = page.locator("[data-home-family-gallery] [data-family-panel]").first().getByRole("link");
  await family.focus();
  expect(await family.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe("none");
});
