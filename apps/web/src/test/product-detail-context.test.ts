import { describe, expect, it } from "vitest";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import { selectProductCatalogueContext } from "@/features/catalogue-live/catalogue-live.repository";

const product = (id: string, slug: string): CatalogueProductRecord => ({
  id,
  familySlug: "scissors",
  slug,
  name: slug,
  code: id,
  sizes: [],
  variants: [],
  directions: [],
  catalogueReference: { family: "Scissors" },
  mediaLabel: slug
});

describe("Product Detail catalogue context", () => {
  it("returns only the requested product now that recommendations are retired", () => {
    const products = [
      product("1", "requested"),
      product("2", "other-a"),
      product("3", "other-b")
    ];
    expect(selectProductCatalogueContext(products, "requested").map((item) => item.slug)).toEqual(["requested"]);
  });

  it("returns an empty context for an unknown route", () => {
    expect(selectProductCatalogueContext([product("1", "requested")], "missing")).toEqual([]);
  });
});
