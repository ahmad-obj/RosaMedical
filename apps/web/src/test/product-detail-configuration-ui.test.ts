import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Product Detail configuration UI", () => {
  it("uses one focused client selector to bind configuration, price and inquiry identity", () => {
    const selector = source("src/features/product-detail/product-configuration-selector.tsx");
    expect(selector).toContain("createInquiryLineId");
    expect(selector).toContain("effectivePriceSar");
    expect(selector).toContain("configurationId");
    expect(selector).toContain("unitPriceSar");
    expect(selector).toContain("ProductPriceState");
    expect(selector).toContain("ProductInquiryControls");
  });

  it("renders the selected amount through an aria-live price state", () => {
    const price = source("src/features/product-detail/product-price-state.tsx");
    expect(price).toContain("amount");
    expect(price).toContain('aria-live="polite"');
    expect(price).toContain("formatSar");
  });

  it("removes the stale server-created inquiry item from Product Detail", () => {
    const page = source("src/features/product-detail/product-detail-page.tsx");
    expect(page).not.toContain("const inquiryItem: InquiryItem");
    expect(page).toContain("configurationOptions={data.configurationOptions}");
  });
});
