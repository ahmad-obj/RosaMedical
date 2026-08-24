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

const products: readonly AuthoritativePricingProduct[] = [{
  id: "product-1", routeKey: "scissors/iris-test", name: "Iris Scissors", code: "04-0901", priceSar: "120.00", isActive: true
}];

const variants: readonly AuthoritativePricingVariant[] = [
  { id: "variant-1", productId: "product-1", sku: "04-0901-14", size: "14 cm", variantType: "Straight", priceOverrideSar: null },
  { id: "variant-2", productId: "product-1", sku: "04-0901-16", size: "16 cm", variantType: "Curved", priceOverrideSar: "145.50" }
];

describe("server-authoritative quotation pricing", () => {
  it("ignores forged browser price and identity text for a real variant", () => {
    expect(resolveAuthoritativeQuoteLines([item()], products, variants)[0]).toEqual({
      sortOrder: 0, productId: "product-1", productVariantId: "variant-1", productName: "Iris Scissors",
      productCode: "04-0901", sku: "04-0901-14", size: "14 cm", variantType: "Straight", quantity: 2,
      unitPriceSar: "120.00", lineSubtotalSar: "240.00", notes: "Sterile packing"
    });
  });

  it("uses the variant override when present", () => {
    expect(resolveAuthoritativeQuoteLines([item({ configurationId: "variant-2", lineId: "product-1:variant-2", quantity: 3 })], products, variants)[0])
      .toMatchObject({ productVariantId: "variant-2", unitPriceSar: "145.50", lineSubtotalSar: "436.50" });
  });

  it("allows product-only pricing only when the product has no real variants", () => {
    const productOnly = item({ configurationId: "product:legacy-id", lineId: "legacy-id:product:legacy-id", id: "legacy-id" });
    expect(resolveAuthoritativeQuoteLines([productOnly], products, [])[0]).toMatchObject({
      productId: "product-1", productVariantId: null, unitPriceSar: "120.00"
    });
    expect(() => resolveAuthoritativeQuoteLines([productOnly], products, variants)).toThrow(/configuration/i);
  });

  it("resolves a legacy non-UUID product id by the trusted public route", () => {
    const legacy = item({ id: "legacy-static-id", configurationId: "variant-1", lineId: "legacy-static-id:variant-1" });
    expect(resolveAuthoritativeQuoteLines([legacy], products, variants)[0]?.productId).toBe("product-1");
  });

  it("preserves Price on request when authoritative pricing is null", () => {
    const productOnly = item({ id: "legacy-id", configurationId: "product:legacy-id", lineId: "legacy-id:product:legacy-id" });
    expect(resolveAuthoritativeQuoteLines([productOnly], [{ ...products[0]!, priceSar: null }], [])[0])
      .toMatchObject({ unitPriceSar: null, lineSubtotalSar: null });
  });

  it("rejects unavailable products and wrong variant ownership", () => {
    expect(() => resolveAuthoritativeQuoteLines([item()], [{ ...products[0]!, isActive: false }], variants)).toThrow(/unavailable/i);
    expect(() => resolveAuthoritativeQuoteLines([item()], [], variants)).toThrow(/unavailable/i);
    expect(() => resolveAuthoritativeQuoteLines([item()], products, [{ ...variants[0]!, productId: "different-product" }])).toThrow(/configuration/i);
  });

  it("serializes only authoritative line values for the database RPC", () => {
    const rpc = quotationLinesForRpc(resolveAuthoritativeQuoteLines([item()], products, variants));
    expect(rpc[0]).toMatchObject({ productId: "product-1", productVariantId: "variant-1", productName: "Iris Scissors", unitPriceSar: "120.00" });
    expect(rpc[0]).not.toHaveProperty("sortOrder");
  });

  it("builds compatibility message from authoritative identity and pricing", () => {
    const message = formatAuthoritativeQuotationMessage(
      { company: "Test Company", country: "Test Country", notes: "General note" },
      resolveAuthoritativeQuoteLines([item()], products, variants)
    );
    expect(message).toContain("Iris Scissors");
    expect(message).toContain("04-0901-14");
    expect(message).toContain("Unit price: SAR 120.00");
    expect(message).not.toContain("FORGED-CODE");
    expect(message).not.toContain("0.01");
  });
});
