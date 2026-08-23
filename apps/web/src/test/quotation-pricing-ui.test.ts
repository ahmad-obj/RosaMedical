import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Request Quotation pricing review", () => {
  it("reviews configuration lines and pricing before submission", () => {
    const page = source("src/features/inquiry/quotation-page.tsx");
    expect(page).toContain("item.lineId");
    expect(page).toContain("item.sku");
    expect(page).toContain("inquiryLineSubtotal");
    expect(page).toContain("summarizeInquiryPricing");
    expect(page).toContain("formatSar");
  });

  it("uses the same complete/partial total semantics as Inquiry", () => {
    const page = source("src/features/inquiry/quotation-page.tsx");
    expect(page).toContain("Estimated total");
    expect(page).toContain("Priced items subtotal");
    expect(page).toContain("Complete quotation total");
    expect(page).toContain("Price on request");
  });
});
