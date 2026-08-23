import { describe, expect, it } from "vitest";
import { buildFacetModel } from "@/features/products/products-facet-model";
import { deriveCodeGroup } from "@/features/products/products-facets";
import { filterProducts } from "@/features/products/products-discovery.logic";
import type { ProductsDiscoveryItem, ProductsDiscoveryState } from "@/features/products/products-discovery.types";

const product = (
  id: string,
  familySlug: ProductsDiscoveryItem["familySlug"],
  values: ProductsDiscoveryItem["facetValues"],
  searchTerms: readonly string[]
): ProductsDiscoveryItem => ({
  id,
  slug: id,
  familySlug,
  familyName: familySlug,
  name: id,
  code: searchTerms[0] ?? id,
  optionSummary: [],
  imageLabel: id,
  searchTerms,
  facetValues: values
});

const PRODUCTS: readonly ProductsDiscoveryItem[] = [
  product("iris-straight", "scissors", {
    sizes: ["14.0 cm", "16.0 cm"],
    directions: ["Straight"],
    variants: ["Regular"],
    codeGroups: ["04-09xx"]
  }, ["04-0901", "iris", "14.0 cm", "16.0 cm", "straight", "regular"]),
  product("iris-curved", "scissors", {
    sizes: ["14.0 cm"],
    directions: ["Curved"],
    variants: ["Super Cut"],
    codeGroups: ["05-09xx"]
  }, ["05-0911", "iris", "14.0 cm", "curved", "super cut"]),
  product("biopsy-punch", "punches", {
    sizes: ["1.5 mm", "2.0 mm"],
    directions: ["Straight"],
    variants: ["Spoon-shaped", "Biopsy, straight"],
    codeGroups: ["21-11xx"]
  }, ["21-1101", "biopsy", "1.5 mm", "2.0 mm", "straight", "spoon-shaped"])
];

const state = (patch: Partial<ProductsDiscoveryState> = {}): ProductsDiscoveryState => ({
  query: "",
  family: "all",
  sizes: [],
  directions: [],
  variants: [],
  codeGroups: [],
  sort: "recommended",
  view: "grid",
  ...patch
});

describe("Products discovery facets", () => {
  it("derives stable Rosa code groups without changing source codes", () => {
    expect(deriveCodeGroup("21-1001")).toBe("21-10xx");
    expect(deriveCodeGroup("21-1199A")).toBe("21-11xx");
    expect(deriveCodeGroup("18-0103")).toBe("18-01xx");
    expect(deriveCodeGroup("18-0103S")).toBe("18-01xx");
    expect(deriveCodeGroup("bad-code")).toBeNull();
    expect(deriveCodeGroup(" ")).toBeNull();
  });

  it("uses OR inside one facet and AND across different facets", () => {
    expect(filterProducts(PRODUCTS, state({ sizes: ["14.0 cm", "1.5 mm"] })).total).toBe(3);
    expect(filterProducts(PRODUCTS, state({ family: "scissors", sizes: ["14.0 cm"], directions: ["Straight"] })).products.map((item) => item.id)).toEqual(["iris-straight"]);
    expect(filterProducts(PRODUCTS, state({ variants: ["Spoon-shaped"], codeGroups: ["21-11xx"] })).products.map((item) => item.id)).toEqual(["biopsy-punch"]);
  });

  it("combines full search with facets", () => {
    expect(filterProducts(PRODUCTS, state({ query: "16.0 cm" })).products.map((item) => item.id)).toEqual(["iris-straight"]);
    expect(filterProducts(PRODUCTS, state({ query: "iris", directions: ["Curved"] })).products.map((item) => item.id)).toEqual(["iris-curved"]);
  });

  it("builds contextual facet counts from all other active constraints", () => {
    const model = buildFacetModel(PRODUCTS, state({ family: "scissors" }));

    expect(model.sizes.find((item) => item.value === "14.0 cm")?.count).toBe(2);
    expect(model.sizes.find((item) => item.value === "16.0 cm")?.count).toBe(1);
    expect(model.sizes.some((item) => item.value === "1.5 mm")).toBe(false);
    expect(model.directions.find((item) => item.value === "Straight")?.count).toBe(1);
    expect(model.directions.find((item) => item.value === "Curved")?.count).toBe(1);
  });

  it("keeps a selected zero-count value represented for recovery", () => {
    const model = buildFacetModel(PRODUCTS, state({ family: "scissors", codeGroups: ["21-11xx"] }));
    const selected = model.codeGroups.find((item) => item.value === "21-11xx");

    expect(selected).toMatchObject({ selected: true, count: 0, available: false });
  });
});
