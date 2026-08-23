import { describe, expect, it } from "vitest";
import { createProductsDiscoveryItems } from "@/features/products/products.data";
import { formatProductPriceSummary } from "@/features/pricing";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";

const makeProduct = (patch: Partial<CatalogueProductRecord>): CatalogueProductRecord => ({
  id: "p1",
  familySlug: "scissors",
  slug: "iris",
  name: "Iris Scissors",
  code: "04-0901",
  sizes: ["14 cm"],
  variants: ["Regular"],
  directions: ["Straight"],
  catalogueReference: { family: "Scissors" },
  mediaLabel: "Iris Scissors",
  ...patch
});

describe("Products price display model", () => {
  it("carries the shared exact price summary into discovery cards", () => {
    const [item] = createProductsDiscoveryItems([
      makeProduct({ basePriceSar: "120.00", configurations: [] })
    ], "en");

    expect(item?.priceSummary).toEqual({ kind: "exact", amount: "120.00" });
    expect(item && formatProductPriceSummary(item.priceSummary, "en")).toBe("SAR 120.00");
  });

  it("carries from and on-request states without fabricating amounts", () => {
    const [fromItem, requestItem] = createProductsDiscoveryItems([
      makeProduct({
        id: "p1",
        basePriceSar: "120.00",
        configurations: [
          { id: "v1", sku: "04-0901", size: "14 cm", variantType: "Straight", priceOverrideSar: null },
          { id: "v2", sku: "04-0902", size: "16 cm", variantType: "Curved", priceOverrideSar: "145.00" }
        ]
      }),
      makeProduct({ id: "p2", slug: "mayo", code: "04-1001", basePriceSar: null, configurations: [] })
    ], "en");

    expect(fromItem?.priceSummary).toEqual({ kind: "from", amount: "120.00", hasUnpricedOptions: false });
    expect(requestItem?.priceSummary).toEqual({ kind: "on-request" });
  });
});
