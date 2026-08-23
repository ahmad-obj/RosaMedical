import { describe, expect, it } from "vitest";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import { createProductDetailData } from "@/features/product-detail/product-detail.data";

const product = (patch: Partial<CatalogueProductRecord> = {}): CatalogueProductRecord => ({
  id: "product-1",
  familySlug: "scissors",
  slug: "iris-test",
  name: "Iris Test",
  code: "04-0001",
  sizes: ["14 cm", "16 cm"],
  variants: ["Regular"],
  directions: ["Straight", "Curved"],
  catalogueReference: { family: "Scissors", page: "1" },
  mediaLabel: "Iris Test",
  basePriceSar: "100.00",
  configurations: [
    {
      id: "variant-a",
      sku: "04-0001",
      size: "14 cm",
      variantType: "Straight",
      priceOverrideSar: null
    },
    {
      id: "variant-b",
      sku: "04-0002",
      size: "16 cm",
      variantType: "Curved",
      priceOverrideSar: "125.00"
    }
  ],
  ...patch
});

describe("Product Detail configuration data", () => {
  it("exposes every real variant as an exact selectable priced configuration", () => {
    const data = createProductDetailData("scissors", "iris-test", [product()]);
    expect(data?.configurationOptions).toEqual([
      {
        id: "variant-a",
        sku: "04-0001",
        size: "14 cm",
        variantType: "Straight",
        effectivePriceSar: "100.00"
      },
      {
        id: "variant-b",
        sku: "04-0002",
        size: "16 cm",
        variantType: "Curved",
        effectivePriceSar: "125.00"
      }
    ]);
  });

  it("creates one deterministic product-level option when no real variants exist", () => {
    const data = createProductDetailData("scissors", "iris-test", [
      product({ configurations: [], primaryOption: "As listed", basePriceSar: "90.00" })
    ]);

    expect(data?.configurationOptions).toEqual([
      {
        id: "product:product-1",
        sku: "04-0001",
        size: "As listed",
        variantType: "",
        effectivePriceSar: "90.00"
      }
    ]);
  });
});
