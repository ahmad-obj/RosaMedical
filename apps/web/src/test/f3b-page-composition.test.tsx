import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FamilyListingPage } from "@/features/family-listing/family-listing-page";
import { ProductDetailPage } from "@/features/product-detail/product-detail-page";

const FAMILY_CASES = [
  ["knives", 22],
  ["scissors", 42],
  ["punches", 15],
  ["chisels", 20],
  ["cutters", 14]
] as const;

describe("F3B family composition", () => {
  it.each(FAMILY_CASES)(
    "renders the %s family with one h1 and %i products",
    (familySlug, expectedProducts) => {
      const html = renderToStaticMarkup(
        <FamilyListingPage familySlug={familySlug} />
      );
      expect((html.match(/<h1/g) || [])).toHaveLength(1);
      expect((html.match(/data-product-card=/g) || [])).toHaveLength(
        expectedProducts
      );
      expect(html).not.toContain("<form");
      expect(html).not.toMatch(/\b(?:in stock|checkout|rating|certified)\b/i);
    }
  );
});

describe("F3B product composition", () => {
  it("renders specifications and related products without false success", () => {
    const html = renderToStaticMarkup(
      <ProductDetailPage familySlug="knives" productSlug="number-3" />
    );
    expect((html.match(/<h1/g) || [])).toHaveLength(1);
    expect(html).toContain("18-0103");
    expect(html).toContain("<table");
    expect(html).toContain("More from Knives");
    expect(html).not.toContain("Added to your inquiry");
  });

  it("renders the established Yeoman route with Batch 01 catalogue data", () => {
    const html = renderToStaticMarkup(
      <ProductDetailPage familySlug="punches" productSlug="yeoman" />
    );
    expect((html.match(/<h1/g) || [])).toHaveLength(1);
    expect(html).toContain("21-1001");
    expect(html).toContain("28.0 cm");
    expect(html).toContain("More from Punches");
  });

  it("omits unsupported specification rows", () => {
    const html = renderToStaticMarkup(
      <ProductDetailPage familySlug="cutters" productSlug="cleveland" />
    );
    expect(html).not.toContain("Direction / shape</th><td></td>");
  });

  it("returns null for invalid combinations", () => {
    expect(
      ProductDetailPage({
        familySlug: "scissors",
        productSlug: "number-3"
      })
    ).toBeNull();
  });
});
