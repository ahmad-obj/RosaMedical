import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EmptyInquiryPage,
  INQUIRY_PREVIEW_LINES,
  PopulatedInquiryPreview,
  getInquiryPreviewTotals
} from "@/features/inquiry-preview";

describe("F3C inquiry previews", () => {
  it("resolves the three approved source-backed preview products", () => {
    expect(INQUIRY_PREVIEW_LINES.map((line) => line.product.code)).toEqual([
      "18-0644",
      "04-0401",
      "18-1202"
    ]);
  });

  it("derives totals from line quantities", () => {
    expect(getInquiryPreviewTotals()).toEqual({
      uniqueProducts: 3,
      totalQuantity: 8
    });
  });

  it("renders read-only populated controls without active mutation", () => {
    const html = renderToStaticMarkup(<PopulatedInquiryPreview />);

    expect((html.match(/data-inquiry-line=/g) ?? [])).toHaveLength(3);
    expect(html).toContain("disabled");
    expect(html).toContain("readonly");
    expect(html).toContain("data-preview-only");
    expect(html).not.toContain("onSubmit");
  });

  it("renders the truthful empty public composition", () => {
    const html = renderToStaticMarkup(<EmptyInquiryPage />);

    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Your inquiry list is empty.");
    expect(html).toContain('href="/products"');
    expect(html).toContain('href="/catalogues"');
    expect(html).not.toContain("18-0644");
  });
});
