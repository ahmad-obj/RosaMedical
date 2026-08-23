import { describe, expect, it } from "vitest";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import {
  effectiveConfigurationPrice,
  formatProductPriceSummary,
  summarizeProductPrice
} from "@/features/pricing";

const product = (patch: Partial<CatalogueProductRecord>): CatalogueProductRecord => ({
  id: "p1",
  familySlug: "scissors",
  slug: "test",
  name: "Test",
  code: "04-0001",
  sizes: [],
  variants: [],
  directions: [],
  catalogueReference: { family: "Scissors" },
  mediaLabel: "Test",
  ...patch
});

describe("product SAR price states", () => {
  it("uses a variant override before the base price", () => {
    expect(effectiveConfigurationPrice("120.00", null)).toBe("120.00");
    expect(effectiveConfigurationPrice("120.00", "145.50")).toBe("145.50");
    expect(effectiveConfigurationPrice(null, null)).toBeNull();
  });

  it("returns on-request when no configuration has a numeric price", () => {
    expect(summarizeProductPrice(product({ basePriceSar: null, configurations: [] }))).toEqual({ kind: "on-request" });
  });

  it("returns an exact price when every effective configuration is identical", () => {
    expect(summarizeProductPrice(product({
      basePriceSar: "120.00",
      configurations: [
        { id: "v1", sku: "A", size: "14 cm", variantType: "Straight", priceOverrideSar: null },
        { id: "v2", sku: "B", size: "16 cm", variantType: "Curved", priceOverrideSar: "120.00" }
      ]
    }))).toEqual({ kind: "exact", amount: "120.00" });
  });

  it("returns from pricing for ranges and marks partially unpriced options", () => {
    expect(summarizeProductPrice(product({
      basePriceSar: "120.00",
      configurations: [
        { id: "v1", sku: "A", size: "14 cm", variantType: "Straight", priceOverrideSar: "145.50" }
      ]
    }))).toEqual({ kind: "from", amount: "145.50", hasUnpricedOptions: false });

    expect(summarizeProductPrice(product({
      basePriceSar: null,
      configurations: [
        { id: "v1", sku: "A", size: "14 cm", variantType: "Straight", priceOverrideSar: "120.00" },
        { id: "v2", sku: "B", size: "16 cm", variantType: "Curved", priceOverrideSar: null }
      ]
    }))).toEqual({ kind: "from", amount: "120.00", hasUnpricedOptions: true });
  });

  it("formats public labels from the shared state machine", () => {
    expect(formatProductPriceSummary({ kind: "on-request" }, "en")).toBe("Price on request");
    expect(formatProductPriceSummary({ kind: "exact", amount: "120.00" }, "en")).toBe("SAR 120.00");
    expect(formatProductPriceSummary({ kind: "from", amount: "120.00", hasUnpricedOptions: false }, "en")).toBe("From SAR 120.00");
    expect(formatProductPriceSummary({ kind: "from", amount: "120.00", hasUnpricedOptions: true }, "en")).toBe("From SAR 120.00 · some options on request");
  });
});
