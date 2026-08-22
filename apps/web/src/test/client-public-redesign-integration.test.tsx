import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(path: string): string {
  const fullPath = resolve(process.cwd(), path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

describe("client public redesign integration", () => {
  it("keeps exactly five primary navigation routes and one shell footer stack", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    const primaryStart = shell.indexOf("const primaryLinks");
    const utilityStart = shell.indexOf("const utilityLinks");
    const primary = shell.slice(primaryStart, utilityStart > primaryStart ? utilityStart : undefined);

    for (const href of ["/", "/about", "/products", "/inquiry", "/contact"]) {
      expect(primary).toContain(`"${href}"`);
    }
    expect(primary).not.toContain("/catalogues");
    expect(primary).not.toContain("/search");
    expect(shell.match(/<PublicContactStrip \/>/g)?.length).toBe(1);
    expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
    expect(shell.indexOf("<footer")).toBeGreaterThan(shell.indexOf("<PublicContactStrip />"));
  });

  it("uses one shared banner role on each main page with no legacy page hero rendered", () => {
    const cases = [
      ["src/features/homepage/homepage.tsx", 'page="home"', "HomeHeroCarousel"],
      ["src/features/about/about-page.tsx", 'page="about"', "<AboutCompactHero"],
      ["src/features/products/products-overview.tsx", 'page="products"', "<ProductsHero"],
      ["src/features/inquiry/inquiry-page.tsx", 'page="inquiry"', "<ProductsHero"],
      ["src/features/contact-preview/contact-page.tsx", 'page="contact"', "contact-hero"]
    ] as const;

    for (const [path, pageProp, legacy] of cases) {
      const page = source(path);
      expect(page).toContain("PublicHeroCarousel");
      expect(page).toContain(pageProp);
      expect(page).not.toContain(legacy);
    }
  });

  it("keeps hero CTAs removed and one visible h1 owned by the active carousel slide", () => {
    const carousel = source("src/features/public-hero/public-hero-carousel.tsx");
    const emptyInquiry = source("src/features/inquiry-preview/empty-inquiry-page.tsx");
    const basket = source("src/features/inquiry/inquiry-basket-content.tsx");

    expect(carousel).not.toContain("slide.ctas");
    expect(carousel).not.toContain("hero__actions");
    expect(carousel).toContain("<h1");
    expect(emptyInquiry).not.toContain("<h1");
    expect(basket).not.toContain("<h1");
  });

  it("keeps the redesigned Products journey quotation-only and catalogue-backed", () => {
    const products = source("src/features/products/products-overview.tsx");
    const card = source("src/features/products/sections/products-result-card.tsx");
    const catalogues = source("src/features/products/sections/products-catalogue-cards.tsx");

    expect(products).toContain("getPublicCatalogueProducts");
    expect(products).toContain("ProductsDiscoveryWorkspace");
    expect(products).toContain("ProductsDirectContactBand");
    expect(products).toContain("ProductsCatalogueCards");
    expect(card).toContain("Price on request");
    expect(card).not.toMatch(/\b(?:20|25|200|300)\s*SAR\b/);
    expect(catalogues).toContain("CATALOGUE_DOCUMENTS");
    expect(catalogues).toContain("download=");
  });

  it("keeps Inquiry as a quotation basket without payment semantics", () => {
    const basket = source("src/features/inquiry/inquiry-basket-content.tsx");
    const store = source("src/features/inquiry/inquiry-store.ts");

    expect(basket).toContain("Request quotation");
    expect(basket).toContain("InquiryLineMedia");
    expect(store).toContain("rosa-medical-inquiry-v1");
    for (const unsupported of ["Checkout", "Payment", "Credit card", "Shipping"]) {
      expect(basket).not.toContain(unsupported);
    }
  });

  it("preserves the Cloudflare/OpenNext deployment files outside redesign scope", () => {
    const workflow = source("../../.github/workflows/deploy.yml");
    const openNext = source("open-next.config.ts");
    const wrangler = source("wrangler.jsonc");

    expect(workflow).toContain("opennextjs-cloudflare build");
    expect(workflow).toContain("wrangler deploy");
    expect(openNext.length).toBeGreaterThan(0);
    expect(wrangler.length).toBeGreaterThan(0);
  });
});
