import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(path: string): string {
  const fullPath = resolve(process.cwd(), path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

describe("Product Detail quotation cart redesign", () => {
  it("keeps one backward-compatible inquiry store with optional media metadata", () => {
    const store = source("src/features/inquiry/inquiry-store.ts");
    expect(store).toContain("mediaPath?: string");
    expect(store).toContain("mediaFallbackPath?: string");
    expect(store).toContain("imageLabel?: string");
    expect(store).toContain("isOptionalString");
    expect(store).toContain('rosa-medical-inquiry-v1');
  });

  it("carries product media into the existing inquiry item", () => {
    const page = source("src/features/product-detail/product-detail-page.tsx");
    expect(page).toContain("product.mediaPath");
    expect(page).toContain("product.mediaFallbackPath");
    expect(page).toContain("product.mediaLabel");
    expect(page).toContain("quantity: 1");
  });

  it("shows price on request and one canonical quantity/note/add control", () => {
    const summary = source("src/features/product-detail/product-procurement-summary.tsx");
    const controls = source("src/features/product-detail/product-inquiry-controls.tsx");
    const mobile = source("src/features/product-detail/mobile-inquiry-bar.tsx");

    expect(summary).toContain("ProductPriceState");
    expect(summary).not.toMatch(/\b(?:20|25|200|300)\s*SAR\b/);
    expect(controls).toContain('id="product-inquiry-controls"');
    expect(controls).toContain("{ ...item, quantity, notes }");
    expect(mobile).not.toContain("AddToInquiryButton");
    expect(mobile).toContain('href="#product-inquiry-controls"');
  });

  it("renders inquiry product media with primary fallback and placeholder states", () => {
    const media = source("src/features/inquiry/inquiry-line-media.tsx");
    const basket = source("src/features/inquiry/inquiry-basket-content.tsx");

    expect(media).toContain("mediaFallbackPath");
    expect(media).toContain("onError");
    expect(media).toContain("inquiry-line-media__placeholder");
    expect(basket).toContain("InquiryLineMedia");
    expect(basket).toContain("Request quotation");
    expect(basket).not.toContain("Checkout");
    expect(basket).not.toContain("Payment");
  });

  it("loads focused quotation-cart styling", () => {
    const globals = source("src/app/globals.css");
    expect(globals).toContain('@import "../styles/client-inquiry-cart.css";');
  });
});
