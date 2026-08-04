import { describe, expect, it } from "vitest";
import { CATALOGUE_PRODUCTS } from "@/features/catalogue-registry";
import {
  getAdminProductEditor,
  getAdminProductRows,
  getDocumentedOptionSummary
} from "@/features/admin-products";

function firstCatalogueProduct() {
  const product = CATALOGUE_PRODUCTS[0];
  if (!product) {
    throw new Error("Expected at least one catalogue product");
  }
  return product;
}

describe("F3E-B product selectors", () => {
  it("derives exactly one row for every source product", () => {
    const rows = getAdminProductRows();
    expect(rows).toHaveLength(CATALOGUE_PRODUCTS.length);
    expect(rows.map((row) => row.id)).toEqual(
      CATALOGUE_PRODUCTS.map((product) => product.id)
    );
  });

  it("preserves source identity and uses real route helpers", () => {
    const source = firstCatalogueProduct();
    const row = getAdminProductRows().at(0);
    expect(row).toBeDefined();
    expect(row!).toMatchObject({
      id: source.id,
      name: source.name,
      code: source.code,
      familySlug: source.familySlug,
      mediaLabel: source.mediaLabel
    });
    expect(row!.publicHref).toBe(`/products/${source.familySlug}/${source.slug}`);
    expect(row!.adminHref).toBe(`/admin/products/${source.familySlug}/${source.slug}`);
  });

  it("resolves every known editor and rejects mismatched families", () => {
    for (const product of CATALOGUE_PRODUCTS) {
      expect(getAdminProductEditor(product.familySlug, product.slug)?.product.id).toBe(product.id);
    }
    const product = firstCatalogueProduct();
    expect(getAdminProductEditor("scissors", product.slug)).toBeUndefined();
  });

  it("deduplicates documented options and provides an explicit fallback", () => {
    const source = firstCatalogueProduct();
    expect(getDocumentedOptionSummary(source).length).toBeGreaterThan(0);
    expect(getDocumentedOptionSummary({
      id: source.id,
      familySlug: source.familySlug,
      slug: source.slug,
      name: source.name,
      code: source.code,
      sizes: [],
      variants: [],
      directions: [],
      catalogueReference: source.catalogueReference,
      mediaLabel: source.mediaLabel
    })).toEqual(["Not documented in source"]);
  });

  it("does not introduce unsupported workflow fields", () => {
    const serialized = JSON.stringify(getAdminProductRows());
    expect(serialized).not.toMatch(/published|draft|review|visible|featured|updatedAt|arabicComplete/i);
  });
});
