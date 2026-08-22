import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(path: string): string {
  const fullPath = resolve(process.cwd(), path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

describe("Products catalogue access", () => {
  it("uses authoritative catalogue documents with open and download actions", () => {
    const component = source("src/features/products/sections/products-catalogue-cards.tsx");
    expect(component).toContain("CATALOGUE_DOCUMENTS");
    expect(component).toContain("CatalogueCover");
    expect(component).toContain("document.pdfPath");
    expect(component).toContain('target="_blank"');
    expect(component).toContain("download=");
    expect(component).not.toContain("/downloads");
  });

  it("replaces the old Products catalogue support block in the client hierarchy", () => {
    const page = source("src/features/products/products-overview.tsx");
    expect(page).toContain("ProductsCatalogueCards");
    expect(page).not.toContain("<CatalogueSupport");
    expect(page.indexOf("ProductsCatalogueCards")).toBeGreaterThan(page.indexOf("ProductsDirectContactBand"));
    expect(page.indexOf("ProductsCatalogueCards")).toBeLessThan(page.indexOf("ProductsProcurementCta"));
  });

  it("locks desktop five-column, tablet three-column and mobile snap-rail geometry", () => {
    const css = source("src/styles/products-client-redesign.css");
    expect(css).toMatch(/\.products-catalogue-grid[\s\S]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
    expect(css).toMatch(/@media \(max-width: 63\.99rem\)[\s\S]*\.products-catalogue-grid[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
    expect(css).toMatch(/@media \(max-width: 40rem\)[\s\S]*grid-auto-flow:\s*column[\s\S]*scroll-snap-type:\s*x mandatory/);
  });
});
