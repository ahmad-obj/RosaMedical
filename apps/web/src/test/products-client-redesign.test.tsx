import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(path: string): string {
  const fullPath = resolve(process.cwd(), path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

describe("client Products discovery redesign", () => {
  it("maps the complete public catalogue instead of featured-only products", () => {
    const selectors = source("src/features/public-catalogue/selectors.ts");
    const page = source("src/features/products/products-overview.tsx");

    expect(selectors).toContain("selectProductPreviews");
    expect(page).toContain("getPublicCatalogueProducts");
    expect(page).not.toContain("getFeaturedCatalogueProducts");
  });

  it("indexes every supported catalogue configuration field for search", () => {
    const data = source("src/features/products/products.data.ts");
    const logic = source("src/features/products/products-discovery.logic.ts");
    const types = source("src/features/products/products-discovery.types.ts");

    expect(types).toContain("ProductsDiscoveryItem");
    expect(types).toContain("searchTerms");
    expect(data).toContain("sourceProduct.sizes");
    expect(data).toContain("sourceProduct.variants");
    expect(data).toContain("sourceProduct.directions");
    expect(data).toContain("sourceProduct.catalogueCodes");
    expect(logic).toContain("product.searchTerms");
  });

  it("exposes only real discovery controls", () => {
    const workspace = source("src/features/products/sections/products-discovery-workspace.tsx");
    const filters = source("src/features/products/sections/products-filter-panel.tsx");
    const toolbar = source("src/features/products/sections/products-results-toolbar.tsx");

    expect(workspace).toContain("filterProducts");
    expect(workspace).toContain('type="search"');
    expect(filters).toContain("All products");
    expect(toolbar).toContain("recommended");
    expect(toolbar).toContain("name-asc");
    expect(toolbar).toContain("aria-pressed");

    for (const fakeFilter of ["Country of origin", "Delivery Method", "Brand filter", "Price filter"]) {
      expect(`${workspace}\n${filters}\n${toolbar}`).not.toContain(fakeFilter);
    }
  });

  it("routes dense product cards to canonical details without fake ecommerce", () => {
    const card = source("src/features/products/sections/products-result-card.tsx");

    expect(card).toContain("productHref(product)");
    expect(card).toContain("ProductMediaPlaceholder");
    expect(card).toContain("Price on request");
    expect(card).toContain("View details");
    expect(card).not.toContain("Add to cart");
    expect(card).not.toContain("AddToInquiryButton");
    expect(card).not.toMatch(/\b(?:20|25|200|300)\s*SAR\b/);
  });

  it("composes Products in the client hierarchy before catalogue replacement", () => {
    const page = source("src/features/products/products-overview.tsx");

    expect(page).toContain("ProductsDiscoveryWorkspace");
    expect(page).toContain("ProductsDirectContactBand");
    expect(page).toContain("CatalogueSupport");
    expect(page).toContain("ProductsProcurementCta");
    expect(page.indexOf("ProductsDiscoveryWorkspace")).toBeLessThan(page.indexOf("ProductsDirectContactBand"));
    expect(page.indexOf("ProductsDirectContactBand")).toBeLessThan(page.indexOf("CatalogueSupport"));
  });

  it("loads the focused Products stylesheet", () => {
    const globals = source("src/app/globals.css");
    expect(globals).toContain('@import "../styles/products-client-redesign.css";');
  });
});
