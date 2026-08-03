import { describe, expect, it } from "vitest";
import {
  CATALOGUE_FAMILIES,
  CATALOGUE_PRODUCTS,
  getFamilyListingModel,
  getProductDetailModel,
  getRelatedProducts,
  resolveCataloguePath
} from "@/features/catalogue-registry";
import type {
  CatalogueFamilyRecord,
  CatalogueProductRecord
} from "@/features/catalogue-registry/types";

const EXPECTED_PRODUCT_COUNTS = {
  knives: 22,
  scissors: 42,
  punches: 15,
  chisels: 20,
  cutters: 14
} as const;

describe("F3B catalogue registry", () => {
  it("accepts explicit catalogue records", () => {
    const family: CatalogueFamilyRecord = {
      slug: "knives",
      sequence: "01",
      name: "Knives",
      introduction: "Precision cutting instruments.",
      catalogueLabel: "Knives catalogue"
    };
    const product: CatalogueProductRecord = {
      id: "product_scalpel_handle_3",
      familySlug: "knives",
      slug: "scalpel-handle-no-3",
      name: "Scalpel Handle No. 3",
      code: "18-0644",
      sizes: ["14.5 cm"],
      variants: ["Standard"],
      directions: [],
      primaryOption: "14.5 cm",
      catalogueReference: { family: "Knives", page: "6" },
      mediaLabel: "Scalpel Handle No. 3 placeholder"
    };
    expect(family.slug).toBe(product.familySlug);
  });

  it("registers five families with the current source-backed product totals", () => {
    expect(CATALOGUE_FAMILIES).toHaveLength(5);
    for (const family of CATALOGUE_FAMILIES) {
      expect(
        CATALOGUE_PRODUCTS.filter(
          (product) => product.familySlug === family.slug
        ),
        family.slug
      ).toHaveLength(EXPECTED_PRODUCT_COUNTS[family.slug]);
    }
  });

  it("keeps IDs and family-local routes unique", () => {
    expect(new Set(CATALOGUE_PRODUCTS.map((product) => product.id)).size).toBe(
      CATALOGUE_PRODUCTS.length
    );
    expect(CATALOGUE_PRODUCTS).toHaveLength(113);
    const routes = CATALOGUE_PRODUCTS.map(
      (product) => `${product.familySlug}/${product.slug}`
    );
    expect(new Set(routes).size).toBe(routes.length);
    expect(CATALOGUE_PRODUCTS.every((product) => product.code.trim())).toBe(true);
  });

  it("resolves all five families", () => {
    for (const slug of [
      "knives",
      "scissors",
      "punches",
      "chisels",
      "cutters"
    ]) {
      expect(getFamilyListingModel(slug).kind).toBe("family");
    }
  });

  it("resolves products and rejects mismatches", () => {
    expect(getProductDetailModel("knives", "number-3").kind).toBe("product");
    expect(getProductDetailModel("punches", "yeoman").kind).toBe("product");
    expect(
      getProductDetailModel("knives", "scalpel-handle-no-3").kind
    ).toBe("product");
    expect(
      getProductDetailModel("scissors", "scalpel-handle-no-3").kind
    ).toBe("not-found");
    expect(getProductDetailModel("knives", "missing-product").kind).toBe(
      "not-found"
    );
  });

  it("rejects unsupported depths", () => {
    expect(resolveCataloguePath(["products", "knives"]).kind).toBe("family");
    expect(
      resolveCataloguePath(["products", "knives", "number-3"]).kind
    ).toBe("product");
    expect(
      resolveCataloguePath(["products", "knives", "number-3", "extra"]).kind
    ).toBe("not-found");
  });

  it("returns deterministic same-family related products", () => {
    const related = getRelatedProducts("product-knives-number-3", 3);
    expect(related).toHaveLength(3);
    expect(related.every((product) => product.familySlug === "knives")).toBe(
      true
    );
    expect(
      related.some((product) => product.id === "product-knives-number-3")
    ).toBe(false);
  });
});
