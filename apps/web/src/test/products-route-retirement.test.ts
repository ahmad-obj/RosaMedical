import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("retired family discovery routes and Product Detail cleanup", () => {
  it("permanently redirects family pages into the unified Products hub", () => {
    const page = source("src/app/(public)/[[...segments]]/page.tsx");
    expect(page).toContain("permanentRedirect");
    expect(page).toContain("/products?family=");
  });

  it("does not render or calculate Related Products on Product Detail", () => {
    const page = source("src/features/product-detail/product-detail-page.tsx");
    const data = source("src/features/product-detail/product-detail.data.ts");

    expect(page).not.toContain("RelatedProductGrid");
    expect(data).not.toContain("getRelatedProductsFromCatalogue");
    expect(data).not.toContain("related,");
  });
});
