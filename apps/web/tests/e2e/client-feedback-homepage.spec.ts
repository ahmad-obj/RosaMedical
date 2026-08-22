import { expect, test, type Page } from "@playwright/test";

async function nextSectionRatio(page: Page): Promise<number> {
  return page.evaluate(() => {
    const next = document.querySelector<HTMLElement>("[data-section='family-discovery']");
    if (!next) throw new Error("Family discovery missing");
    return next.getBoundingClientRect().top / innerHeight;
  });
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
}

test("1366x768 keeps the hero deliberately compact with immediate page continuation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  const ratio = await nextSectionRatio(page);
  expect(ratio).toBeGreaterThanOrEqual(0.55);
  expect(ratio).toBeLessThanOrEqual(0.72);
});

test("390x844 keeps message and image inside a compact integrated hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(page.locator(".home-hero__title")).toBeVisible();
  await expect(page.locator("[data-media-slot='homepage-hero-active'] img")).toBeVisible();
  await expect(page.locator("[data-section='home-hero'] a")).toHaveCount(0);
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

test("homepage family gallery keeps the approved five-family order and cover-only presentation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator("[data-family-panel]")).toHaveCount(5);
  expect(await gallery.locator("[data-family-panel]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-family")))).toEqual([
    "scissors", "cutters", "punches", "chisels", "knives"
  ]);
  await expect(page.locator("[data-section='family-discovery'] .public-section-heading__copy")).toHaveCount(0);
  await expect(gallery.locator(".home-family-gallery__title")).toHaveCount(0);
  await expect(gallery.locator(".home-family-gallery__image")).toHaveCount(5);
});

test("1024 fine-pointer layout keeps a dense equal-width row and zooms the focused cover", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  const panels = gallery.locator("[data-family-panel]");
  await expect(panels).toHaveCount(5);

  const widths = (await Promise.all((await panels.all()).map((panel) => panel.boundingBox()))).map((box) => box!.width);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);

  const chisels = gallery.locator("[data-family='chisels']");
  const image = chisels.locator(".home-family-gallery__image");
  const restingTransform = await image.evaluate((node) => getComputedStyle(node).transform);
  await chisels.getByRole("link").focus();
  await page.waitForTimeout(720);
  expect(await image.evaluate((node) => getComputedStyle(node).transform)).not.toBe(restingTransform);
});

test("tablet keeps all five catalogue covers in the compact one-row composition", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "tablet");
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  const panels = gallery.locator("[data-family-panel]");
  await expect(panels).toHaveCount(5);
  const widths = (await Promise.all((await panels.all()).map((panel) => panel.boundingBox()))).map((box) => box!.width);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);
  await expectNoHorizontalOverflow(page);
});

test("coarse pointer keeps every family accessible without a hover-only dependency", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  const gallery = page.locator("[data-home-family-gallery]");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator("[data-family-panel] a")).toHaveCount(5);
  await expectNoHorizontalOverflow(page);
});

test("homepage preserves the approved compact section sequence and media inventory", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const sections = [
    "home-hero",
    "family-discovery",
    "comprehensive-plans",
    "securing-confidence",
    "home-contact-band",
    "client-success-assurance",
    "quotation-cta"
  ];
  for (const section of sections) {
    await expect(page.locator(`[data-section='${section}']`)).toHaveCount(1);
  }
  await expect(page.locator("[data-section='home-social-strip']")).toHaveCount(0);
  await expect(page.locator(".public-contact-strip")).toBeVisible();
  await expect(page.locator("[data-home-family-gallery] [data-family-panel]")).toHaveCount(5);
  const clinicalImages = page.locator(".home-clinical-media img");
  await expect(clinicalImages).toHaveCount(6);
  expect(await clinicalImages.evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(page.locator("[data-section='catalogue-access']")).toHaveCount(0);
  await expect(page.locator("[data-section='procurement-support']")).toHaveCount(0);
  await expect(page.locator("[data-section='featured-instruments']")).toHaveCount(0);
});

test("Comprehensive Plans lead and specialty row share the same desktop width", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  const section = page.locator("[data-section='comprehensive-plans']");
  await section.scrollIntoViewIfNeeded();
  const lead = await section.locator(".home-comprehensive__lead").boundingBox();
  const specialties = await section.locator(".home-comprehensive__specialties").boundingBox();
  expect(lead).not.toBeNull();
  expect(specialties).not.toBeNull();
  expect(Math.abs(lead!.x - specialties!.x)).toBeLessThanOrEqual(2);
  expect(Math.abs((lead!.x + lead!.width) - (specialties!.x + specialties!.width))).toBeLessThanOrEqual(2);
});

test("1366x768 keeps redesigned homepage typography and spacing within compact density bounds", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.locator("[data-section='comprehensive-plans']").scrollIntoViewIfNeeded();

  const metrics = await page.evaluate(() => {
    const styleNumber = (selector: string, property: "fontSize" | "paddingTop") => {
      const node = document.querySelector<HTMLElement>(selector);
      if (!node) throw new Error(`Missing ${selector}`);
      return Number.parseFloat(getComputedStyle(node)[property]);
    };
    const hero = document.querySelector<HTMLElement>("[data-section='home-hero']");
    if (!hero) throw new Error("Missing homepage hero");
    return {
      heroHeight: hero.getBoundingClientRect().height,
      sectionTitle: styleNumber("[data-section='comprehensive-plans'] .home-compact-section-title", "fontSize"),
      sectionPadding: styleNumber("[data-section='comprehensive-plans']", "paddingTop"),
      assuranceTitle: styleNumber(".home-assurance-card h3", "fontSize")
    };
  });

  expect(metrics.heroHeight).toBeLessThanOrEqual(432);
  expect(metrics.sectionTitle).toBeLessThanOrEqual(34);
  expect(metrics.sectionPadding).toBeLessThanOrEqual(42);
  expect(metrics.assuranceTitle).toBeLessThanOrEqual(16);
});

test("shared footer Contact us ribbon renders the social links on homepage and Contact", async ({ page }) => {
  await page.goto("/");
  const homepageSocials = page.locator(".public-contact-strip [data-social-links] a");
  await expect(page.locator(".public-contact-strip")).toBeVisible();
  await expect(homepageSocials).toHaveCount(4);
  for (const link of await homepageSocials.all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }

  await page.goto("/contact");
  await expect(page.locator(".public-contact-strip")).toBeVisible();
  await expect(page.locator(".public-contact-strip [data-social-links] a")).toHaveCount(4);
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
  expect(computed.fontFamily).toContain("GE SS");
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

test("hero autoplay advances after pointer selection and pauses during keyboard focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "clinical-instrument-context");

  await hero.hover();
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "surgical-instrument-selection");

  await page.locator(".home-hero-carousel__dot").nth(3).click();
  await expect(hero).toHaveAttribute("data-active-slide", "catalogue-to-quotation");
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");

  await page.locator(".home-hero-carousel__dot").nth(1).focus();
  await page.waitForTimeout(5_200);
  await expect(hero).toHaveAttribute("data-active-slide", "precision-instruments");
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

test("hero exposes only carousel dots as interactive controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const hero = page.locator("[data-section='home-hero']");
  await expect(hero.locator("button:not(.home-hero-carousel__dot)")).toHaveCount(0);
  await expect(hero.locator("a")).toHaveCount(0);
  const dots = hero.locator(".home-hero-carousel__dot");
  await expect(dots).toHaveCount(4);
  for (const box of await dots.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()))) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  const family = page.locator("[data-home-family-gallery] [data-family-panel]").first().getByRole("link");
  await family.focus();
  expect(await family.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe("none");
});
