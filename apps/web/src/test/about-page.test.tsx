import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { AboutPage } from "@/features/about";

it("renders the client-faithful About structure under the shared public hero without unsupported claims", () => {
  const html = renderToStaticMarkup(<AboutPage locale="en" />);
  const visibleText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
  expect(html).toContain('data-public-hero-page="about"');
  expect((html.match(/data-about-story=/g) ?? [])).toHaveLength(3);
  expect((html.match(/data-about-compliance-item=/g) ?? [])).toHaveLength(6);
  expect((html.match(/data-about-document=/g) ?? [])).toHaveLength(5);
  expect((html.match(/data-media-slot="about-client-/g) ?? [])).toHaveLength(8);

  expect(html).toContain("Structured support for medical-instrument procurement.");
  expect(html).toContain("About Rosa");
  expect(html).toContain("Our Workflow");
  expect(html).toContain("Business Growth");
  expect(html).toContain("Experience Sharing");
  expect(html).toContain("COMPLIANCE");
  for (const label of ["ISO", "MDMA", "MDEL", "AR", "WAREHOUSE"]) {
    expect(html).toContain(`>${label}<`);
  }

  expect(html).toContain('href="/request-quotation"');
  expect(html).toMatch(/https:\/\/wa\.me\//);
  expect(html).toContain('href="mailto:info@rosamedical.org"');
  expect(html).not.toContain('data-section="about-client-hero"');
  expect(html).not.toContain('data-company-profile="true"');
  expect(html).not.toContain("data-supported-buyer=");
  expect(html).not.toContain("data-family-index-row=");
  expect(html).not.toContain('href="/procurement-support"');
  expect(html).not.toMatch(/youtube/i);
  expect(visibleText).not.toMatch(/\b(18|19|20)\d{2}\b/);
  expect(visibleText).not.toMatch(/founded|since \d{4}|factory|manufacturer|certified|years of experience/i);
});
