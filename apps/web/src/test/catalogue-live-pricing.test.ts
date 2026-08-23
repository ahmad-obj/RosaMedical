import { describe, expect, it } from "vitest";
import type { CatalogueMetadataManifestEntry } from "@/features/catalogue-migration/catalogue-metadata-manifest";
import { mapLiveCatalogue } from "@/features/catalogue-live/map-live-product";
import type { LiveCatalogueSnapshot } from "@/features/catalogue-live/catalogue-live.types";

const manifest: CatalogueMetadataManifestEntry = {
  familySlug: "scissors",
  publicSlug: "pricing-test",
  dbSlug: "scissors-pricing-test",
  expectedCode: "04-0901",
  expectedName: "Pricing Test",
  expectedCatalogueCodes: [
    { code: "04-0901", size: "14 cm" },
    { code: "04-0902", size: "16 cm" }
  ],
  metadata: {
    sizes: ["14 cm", "16 cm"],
    variants: ["Regular"],
    directions: ["Straight", "Curved"],
    primaryOption: null,
    cataloguePage: "1",
    mediaLabel: "Pricing Test"
  }
};

const snapshot: LiveCatalogueSnapshot = {
  products: [{
    id: "p1",
    category_id: "c1",
    item_code: "04-0901",
    name_en: "Pricing Test",
    description_en: null,
    is_active: true,
    slug: "scissors-pricing-test",
    created_at: "2026-08-23T00:00:00Z",
    price: "120.00"
  }],
  categories: [{
    id: "c1",
    slug: "scissors",
    name_en: "Scissors",
    is_active: true,
    deleted_at: null
  }],
  variants: [
    {
      id: "v1",
      product_id: "p1",
      sku: "04-0901",
      size: "14 cm",
      variant_type: "Straight",
      price_override: null,
      created_at: "2026-08-23T00:00:01Z"
    },
    {
      id: "v2",
      product_id: "p1",
      sku: "04-0902",
      size: "16 cm",
      variant_type: "Curved",
      price_override: "145.50",
      created_at: "2026-08-23T00:00:02Z"
    }
  ],
  images: [{ product_id: "p1", image_path: "/pricing.webp", sort_order: 0 }]
};

describe("live catalogue pricing projection", () => {
  it("preserves base price and real variant pricing identity", () => {
    const [product] = mapLiveCatalogue(snapshot, [manifest]);

    expect(product?.basePriceSar).toBe("120.00");
    expect(product?.configurations).toEqual([
      {
        id: "v1",
        sku: "04-0901",
        size: "14 cm",
        variantType: "Straight",
        priceOverrideSar: null
      },
      {
        id: "v2",
        sku: "04-0902",
        size: "16 cm",
        variantType: "Curved",
        priceOverrideSar: "145.50"
      }
    ]);
  });
});
