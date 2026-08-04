import { expect, test, type Locator, type Page } from "@playwright/test";

async function expectImageLoaded(frame: Locator): Promise<void> {
  const image = frame.locator("img");
  await expect(image).toHaveCount(1);
  await expect
    .poll(() =>
      image.evaluate(
        (element) =>
          element instanceof HTMLImageElement
          && element.complete
          && element.naturalWidth > 0
          && element.naturalHeight > 0
      )
    )
    .toBe(true);
}

async function expectNoHorizontalOverflow(page: Page) {
  const details = await page.evaluate(() => {
    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const describe = (element: Element) => {
      const htmlElement = element as HTMLElement;
      const id = htmlElement.id ? `#${htmlElement.id}` : "";
      const classes = [...htmlElement.classList].slice(0, 3).map((name) => `.${name}`).join("");
      const dataMotion = htmlElement.dataset.motion ? `[data-motion=${htmlElement.dataset.motion}]` : "";
      const mediaSlot = htmlElement.dataset.mediaSlot ? `[data-media-slot=${htmlElement.dataset.mediaSlot}]` : "";
      return `${htmlElement.tagName.toLowerCase()}${id}${classes}${dataMotion}${mediaSlot}`;
    };

    const offenders = [...document.body.querySelectorAll<HTMLElement>("*")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: describe(element),
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          overflow: Math.round(Math.max(rect.right - viewportWidth, -rect.left, 0) * 10) / 10
        };
      })
      .filter((item) => item.left < -0.5 || item.right > viewportWidth + 0.5)
      .sort((a, b) => b.overflow - a.overflow)
      .slice(0, 12);

    return {
      clientWidth: viewportWidth,
      scrollWidth: root.scrollWidth,
      offenders
    };
  });

  expect(details.scrollWidth, JSON.stringify(details, null, 2)).toBeLessThanOrEqual(details.clientWidth);
}

test("About, procurement and catalogue stories remain complete and media-ready", async ({ page }) => {
  const aboutResponse = await page.goto("/about");
  expect(aboutResponse?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "A clearer way to source medical instruments.", level: 1 })
  ).toBeVisible();

  const aboutHero = page.locator("[data-media-slot='about-hero']");
  await expect(aboutHero).toHaveAttribute("data-media-state", "ready");
  await expectImageLoaded(aboutHero);

  const aboutProcurement = page.locator("[data-media-slot='about-procurement']");
  await aboutProcurement.scrollIntoViewIfNeeded();
  await expect(aboutProcurement).toHaveAttribute("data-media-state", "ready");
  await expectImageLoaded(aboutProcurement);

  await expect(page.getByRole("heading", { name: "How surgical scissors became more specialised.", level: 2 })).toBeVisible();
  await expect(page.locator("[data-scissors-evolution-stage]")).toHaveCount(5);
  await expect(page.locator("[data-media-slot='about-scissors-evolution']")).toHaveAttribute("data-media-state", "placeholder");
  await expect(page.locator("[data-supported-buyer]")).toHaveCount(4);
  await expectNoHorizontalOverflow(page);

  const procurementResponse = await page.goto("/procurement-support");
  expect(procurementResponse?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Prepare a clearer instrument request.", level: 1 })
  ).toBeVisible();
  await expect(page.locator("[data-editorial-kind='procurement-step']")).toHaveCount(6);
  await expect(page.locator("[data-information-item]")).toHaveCount(6);
  await expect(page.locator("[data-media-slot='procurement-support-hero']")).toHaveAttribute(
    "data-media-state",
    "placeholder"
  );
  await expectNoHorizontalOverflow(page);

  const cataloguesResponse = await page.goto("/catalogues");
  expect(cataloguesResponse?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", {
      name: "Document-led browsing, connected to the product experience.",
      level: 1
    })
  ).toBeVisible();
  await expect(page.locator("[data-catalogue-document]")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "PDF not available online" })).toHaveCount(5);
  await expect(page.locator("[data-motion='tilt']")).toHaveCount(5);
  await expectNoHorizontalOverflow(page);
});

test("contact and legal utilities stay usable, explicit and calm", async ({ page }) => {
  const contactResponse = await page.goto("/contact");
  expect(contactResponse?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Send a general business message.", level: 1 })
  ).toBeVisible();
  await expect(page.getByRole("form", { name: "General contact form preview" })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeEditable();
  await expect(page.getByLabel("Email")).toBeEditable();
  await expect(page.getByRole("button", { name: "Send Message" })).toBeEnabled();
  await expect(page.locator("[data-media-slot='contact-location']")).toHaveAttribute(
    "data-media-state",
    "placeholder"
  );
  await expect(page.getByText("Awaiting client confirmation").first()).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const privacyResponse = await page.goto("/privacy");
  expect(privacyResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Privacy Policy", level: 1 })).toBeVisible();
  await expect(page.locator("[data-legal-section]")).toHaveCount(9);
  await expect(page.getByText("Last updated: awaiting client and legal approval")).toBeVisible();
  await page.locator("[data-legal-section='policy-updates']").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-legal-section='policy-updates']")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const termsResponse = await page.goto("/terms");
  expect(termsResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Terms of Website Use", level: 1 })).toBeVisible();
  await expect(page.locator("[data-legal-section]")).toHaveCount(11);
  await page.locator("[data-legal-section='contact']").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-legal-section='contact']")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Not launch-ready legal advice." })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
