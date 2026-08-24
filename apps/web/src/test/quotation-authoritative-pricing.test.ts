import { describe, expect, it } from "vitest";
import type { InquiryItem } from "@/features/inquiry/inquiry-store";
import {
  formatAuthoritativeQuotationMessage,
  quotationLinesForRpc,
  resolveAuthoritativeQuoteLines,
  type AuthoritativePricingProduct,
  type AuthoritativePricingVariant
} from "@/features/inquiry/quotation-pricing-server";

const item = (patch: Partial<InquiryItem> = {}): InquiryItem => ({
  lineId: "product-1:variant-1",
  id: "product-1",
  familySlug: "scissors",
  slug: "iris-test",
  name: "Forged browser name",
  code: "FORGED-CODE",
  configurationId: "variant-1",
  sku: "FORGED-SKU",
  size: "Forged size",
  variant: "Forged type",
  quantity: 2,
  notes: "Sterile packing",
  unitPriceSar: "0.01",
  currency: "SAR",
  ...patch
});

const products: readonly AuthoritativePricingProduct[] = [
  {
    id: "product-1",
    name: "Iris Scissors",
    code: "04-0901",
    priceSar: "120.00",
    isActive: true
  }
];

const variants: readonly AuthoritativePricingVariant[] = [
  {
    id: "variant-1",
    productId: "product-1",
    sku: "04-0901-14",
    size: "14 cm",
    variantType: "Straight",
    priceOverrideSar: null
  },
  {
    id: "variant-2",
    productId: "product-1",
    sku: "04-0901-16",
    size: "16 cm",
    variantType: "Curved",
    priceOverrideSar: "145.50"
  }
];

describe("server-authoritative quotation pricing", () => {
  it("ignores forged browser price and identity text for a real variant", () => {
    expect(resolveAuthoritativeQuoteLines([item()], products, variants)).toEqual([
      {
        sortOrder: 0,
        productId: "product-1",
        productVariantId: "variant-1",
        productName: "Iris Scissors",
        productCode: "04-0901",
        sku: "04-0901-14",
        size: "14 cm",
        variantType: "Straight",
        quantity: 2,
        unitPriceSar: "120.00",
        lineSubtotalSar: "240.00",
        notes: "Sterile packing"
      }
    ]);
  });

  it("uses the variant override when present", () => {
    const [line] = resolveAuthoritativeQuoteLines([
      item({ lineId: "product-1:variant-2", configurationId: "variant-2", quantity: 3 })
    ], products, variants);

    expect(line).toMatchObject({
      productVariantId: "variant-2",
      unitPriceSar: "145.50",
      lineSubtotalSar: "436.50"
    });
  });

  it("supports a product-only configuration using the base price", () => {
    const [line] = resolveAuthoritativeQuoteLines([
      item({
        lineId: "product-1:product:product-1",
        configurationId: "product:product-1",
        quantity: 1
      })
    ], products, variants);

    expect(line).toMatchObject({
      productVariantId: null,
      sku: "04-0901",
      unitPriceSar: "120.00",
      lineSubtotalSar: "120.00"
    });
  });

  it("preserves Price on request when authoritative pricing is null", () => {
    const [line] = resolveAuthoritativeQuoteLines(
      [item({ configurationId: "product:product-1", lineId: "product-1:product:product-1" })],
      [{ ...products[0]!, priceSar: null }],
      []
    );
    expect(line).toMatchObject({ unitPriceSar: null, lineSubtotalSar: null });
  });

  it("rejects an inactive or missing product", () => {
    expect(() => resolveAuthoritativeQuoteLines([item()], [{ ...products[0]!, isActive: false }], variants))
      .toThrow(/unavailable/i);
    expect(() => resolveAuthoritativeQuoteLines([item()], [], variants))
      .toThrow(/unavailable/i);
  });

  it("rejects a variant that does not belong to the submitted product", () => {
    expect(() => resolveAuthoritativeQuoteLines(
      [item()],
      products,
      [{ ...variants[0]!, productId: "different-product" }]
    )).toThrow(/configuration/i);
  });

  it("serializes only authoritative line values for the database RPC", () => {
    const lines = resolveAuthoritativeQuoteLines([item()], products, variants);
    expect(quotationLinesForRpc(lines)).toEqual([
      {
        productId: "product-1",
        productVariantId: "variant-1",
        productName: "Iris Scissors",
        productCode: "04-0901",
        sku: "04-0901-14",
        size: "14 cm",
        variantType: "Straight",
        quantity: 2,
        unitPriceSar: "120.00",
        lineSubtotalSar: "240.00",
        notes: "Sterile packing"
      }
    ]);
  });

  it("builds compatibility message from authoritative identity and pricing", () => {
    const lines = resolveAuthoritativeQuoteLines([item()], products, variants);
    const message = formatAuthoritativeQuotationMessage(
      { company: "Test Company", country: "Test Country", notes: "General note" },
      lines
    );
    expect(message).toContain("Iris Scissors");
    expect(message).toContain("04-0901-14");
    expect(message).toContain("Unit price: SAR 120.00");
    expect(message).not.toContain("FORGED-CODE");
    expect(message).not.toContain("0.01");
  });
});
