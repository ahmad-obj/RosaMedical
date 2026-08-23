import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import {
  getAdminProductEditor,
  getAdminProductRows
} from "@/features/admin-products/admin-product-model";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const PRODUCT: CatalogueProductRecord = {
  id: "product-1",
  familySlug: "scissors",
  slug: "pricing-test",
  name: "Pricing Test",
  code: "04-0001",
  description: "Test product",
  sizes: ["14 cm", "16 cm"],
  variants: ["Regular", "Super Cut"],
  directions: ["Straight", "Curved"],
  catalogueReference: { family: "Scissors", page: "1" },
  mediaLabel: "Pricing Test",
  mediaPath: "/pricing-test.webp",
  isActive: true,
  basePriceSar: "120.00",
  configurations: [
    {
      id: "variant-1",
      sku: "04-0001",
      size: "14 cm",
      variantType: "Straight",
      priceOverrideSar: null
    },
    {
      id: "variant-2",
      sku: "04-0002",
      size: "16 cm",
      variantType: "Curved",
      priceOverrideSar: "145.50"
    }
  ]
};

describe("Admin product SAR pricing", () => {
  it("surfaces shared price status and pricing completeness on Admin rows", () => {
    const [row] = getAdminProductRows([PRODUCT]);
    expect(row?.priceSummary).toEqual({ kind: "from", amount: "120.00", hasUnpricedOptions: false });

    const editor = getAdminProductEditor(PRODUCT);
    expect(editor?.completeness.find((item) => item.key === "pricing")).toMatchObject({
      state: "Present"
    });
  });

  it("builds real variant pricing rows with inherited and overridden effective prices", () => {
    const editor = getAdminProductEditor(PRODUCT);
    expect(editor?.variantPricing).toEqual([
      {
        id: "variant-1",
        sku: "04-0001",
        size: "14 cm",
        variantType: "Straight",
        priceOverrideSar: null,
        effectivePriceSar: "120.00"
      },
      {
        id: "variant-2",
        sku: "04-0002",
        size: "16 cm",
        variantType: "Curved",
        priceOverrideSar: "145.50",
        effectivePriceSar: "145.50"
      }
    ]);
  });

  it("treats absent pricing as optional rather than blocking product completeness", () => {
    const editor = getAdminProductEditor({ ...PRODUCT, basePriceSar: null, configurations: [] });
    expect(editor?.completeness.find((item) => item.key === "pricing")).toMatchObject({
      state: "Not supplied"
    });
  });

  it("provides base price fields on create/edit and a protected one-row variant action", () => {
    const createForm = source("src/features/admin-products/admin-product-create-form.tsx");
    const editorPage = source("src/features/admin-products/admin-product-editor-page.tsx");
    const actions = source("src/features/admin-products/actions.ts");

    expect(createForm).toContain('name="price_sar"');
    expect(createForm).toContain("Base price — SAR");
    expect(editorPage).toContain('name="price_sar"');
    expect(editorPage).toContain("Variant pricing");
    expect(editorPage).toContain("AdminVariantPricing");
    expect(actions).toContain("saveVariantPriceOverride");
    expect(actions).toContain("price_override_sar");
    expect(actions).toContain("price_override");
  });
});
