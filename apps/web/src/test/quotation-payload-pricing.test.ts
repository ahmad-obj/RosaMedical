import { describe, expect, it } from "vitest";
import { createQuotationHashCandidates } from "@/features/catalogue-migration/legacy-inquiry-hash";
import {
  createPrePricingQuotationHash,
  createQuotationHash,
  normalizeQuotationPayload
} from "@/features/inquiry/quotation-payload";

function rawItem(unitPriceSar: unknown = "0.01") {
  return {
    id: "product-1",
    familySlug: "scissors",
    slug: "iris-test",
    name: "Iris Scissors",
    code: "04-0901",
    configurationId: "variant-1",
    lineId: "client-line",
    sku: "04-0901-14",
    size: "14 cm",
    variant: "Straight",
    quantity: 2,
    notes: "Packing note",
    unitPriceSar,
    currency: "SAR"
  };
}

function rawPayload(unitPriceSar: unknown = "0.01") {
  return {
    name: "Test Buyer",
    company: "Test Company",
    email: "buyer@example.test",
    phone: "+123456789",
    country: "Test Country",
    notes: "General note",
    items: [rawItem(unitPriceSar)]
  };
}

describe("pricing-aware quotation payload", () => {
  it("preserves configuration identity and normalizes the browser display snapshot", () => {
    const result = normalizeQuotationPayload(rawPayload("120.5"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.items[0]).toMatchObject({
      id: "product-1",
      configurationId: "variant-1",
      lineId: "product-1:variant-1",
      sku: "04-0901-14",
      unitPriceSar: "120.50",
      currency: "SAR"
    });
  });

  it("degrades malformed browser money to null without rejecting the quotation", () => {
    const result = normalizeQuotationPayload(rawPayload("invalid"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.items[0]?.unitPriceSar).toBeNull();
  });

  it("does not include browser price in the current duplicate hash", () => {
    const first = normalizeQuotationPayload(rawPayload("0.01"));
    const second = normalizeQuotationPayload(rawPayload("9999.99"));
    if (!first.ok || !second.ok) throw new Error("Fixture normalization failed");

    expect(createQuotationHash(first.value)).toBe(createQuotationHash(second.value));
  });

  it("keeps a reproducible pre-pricing route hash for historical duplicate lookup", () => {
    const result = normalizeQuotationPayload(rawPayload());
    if (!result.ok) throw new Error("Fixture normalization failed");
    const previous = createPrePricingQuotationHash(result.value);
    expect(previous).toMatch(/^[a-f0-9]{64}$/);
    expect(previous).not.toBe(createQuotationHash(result.value));
    expect(createQuotationHashCandidates(result.value)).toContain(previous);
  });
});
