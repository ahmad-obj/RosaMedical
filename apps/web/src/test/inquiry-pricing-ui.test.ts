import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Inquiry priced basket UI", () => {
  it("keys mutations and rendered rows by lineId", () => {
    const basket = source("src/features/inquiry/inquiry-basket-content.tsx");
    expect(basket).toContain("item.lineId");
    expect(basket).toContain("updateInquiryItem(item.lineId");
    expect(basket).toContain("handleRemove(item.lineId");
    expect(basket).not.toContain("updateInquiryItem(item.id");
  });

  it("renders unit price, line subtotal and mixed basket summary semantics", () => {
    const basket = source("src/features/inquiry/inquiry-basket-content.tsx");
    expect(basket).toContain("inquiryLineSubtotal");
    expect(basket).toContain("summarizeInquiryPricing");
    expect(basket).toContain("formatSar");
    expect(basket).toContain("Priced items subtotal");
    expect(basket).toContain("Complete quotation total");
    expect(basket).toContain("Price on request");
  });
});
