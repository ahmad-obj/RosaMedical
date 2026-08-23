import { describe, expect, it } from "vitest";
import {
  inquiryLineSubtotal,
  summarizeInquiryPricing
} from "@/features/inquiry/inquiry-pricing";
import type { InquiryItem } from "@/features/inquiry/inquiry-store";

const item = (
  lineId: string,
  quantity: number,
  unitPriceSar: InquiryItem["unitPriceSar"]
): InquiryItem => ({
  lineId,
  id: `product-${lineId}`,
  familySlug: "scissors",
  slug: lineId,
  name: lineId,
  code: lineId,
  configurationId: `variant-${lineId}`,
  sku: lineId,
  size: "14 cm",
  variant: "Straight",
  quantity,
  notes: "",
  unitPriceSar,
  currency: "SAR"
});

describe("Inquiry SAR calculations", () => {
  it("calculates exact line subtotals without binary floating point drift", () => {
    expect(inquiryLineSubtotal(item("a", 3, "0.10"))).toBe("0.30");
    expect(inquiryLineSubtotal(item("b", 2, "125.50"))).toBe("251.00");
    expect(inquiryLineSubtotal(item("c", 2, null))).toBeNull();
  });

  it("returns a complete total when every line is priced", () => {
    expect(summarizeInquiryPricing([
      item("a", 2, "100.00"),
      item("b", 1, "25.50")
    ])).toEqual({
      pricedSubtotalSar: "225.50",
      unpricedLineCount: 0,
      unpricedQuantity: 0,
      totalSar: "225.50",
      allPriced: true,
      allUnpriced: false
    });
  });

  it("shows only a priced subtotal for mixed baskets", () => {
    expect(summarizeInquiryPricing([
      item("a", 2, "100.00"),
      item("b", 3, null)
    ])).toEqual({
      pricedSubtotalSar: "200.00",
      unpricedLineCount: 1,
      unpricedQuantity: 3,
      totalSar: null,
      allPriced: false,
      allUnpriced: false
    });
  });

  it("never represents an all-unpriced basket as a zero-price quotation", () => {
    expect(summarizeInquiryPricing([
      item("a", 2, null),
      item("b", 1, null)
    ])).toEqual({
      pricedSubtotalSar: null,
      unpricedLineCount: 2,
      unpricedQuantity: 3,
      totalSar: null,
      allPriced: false,
      allUnpriced: true
    });
  });
});
