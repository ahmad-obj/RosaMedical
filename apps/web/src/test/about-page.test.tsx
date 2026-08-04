import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { AboutPage } from "@/features/about";

function renderedText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#xA0;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

it("renders the approved About structure without unsupported claims", () => {
  const html = renderToStaticMarkup(<AboutPage />);
  const text = renderedText(html);

  expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((html.match(/data-editorial-kind="buyer-expectation"/g) ?? [])).toHaveLength(5);
  expect((html.match(/data-scissors-evolution-stage=/g) ?? [])).toHaveLength(5);
  expect((html.match(/data-supported-buyer=/g) ?? [])).toHaveLength(4);
  expect((html.match(/data-family-index-row=/g) ?? [])).toHaveLength(5);
  expect(html).toContain("How surgical scissors became more specialised.");
  expect(html).toContain("Foundational form");
  expect(html).toContain("Contemporary catalogue selection");
  expect(html).toContain('data-media-slot="about-scissors-evolution"');
  expect(html).toContain('href="/procurement-support"');
  expect(html).toContain('href="/products"');
  expect(html).toContain('href="/request-quotation"');
  expect(text).not.toMatch(/\b(18|19|20)\d{2}\b/);
  expect(text).not.toMatch(/founded|since|factory|manufacturer|certified|years of experience/i);
});
