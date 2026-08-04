import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AboutPage } from "@/features/about";
import { CataloguesPage } from "@/features/catalogues";
import { ContactPage } from "@/features/contact-preview";
import {
  LegalPage,
  PRIVACY_DOCUMENT,
  TERMS_DOCUMENT
} from "@/features/legal-pages";
import { ProcurementSupportPage } from "@/features/procurement-support";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("F7 public story and utility polish", () => {
  it("frames About cinematically without inventing company history", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Useful structure at every step.");
    expect(html).toContain("Built around professional buying needs.");
    expect(html).toContain('href="/procurement-support"');
    expect(html).toContain('href="/request-quotation"');
    expect(html).toContain('data-media-slot="about-hero"');
    expect(html).toContain('data-media-slot="about-procurement"');
    expect((html.match(/data-media-state="ready"/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('data-media-slot="about-scissors-evolution"');
    expect(html).toContain('data-media-state="placeholder"');
    expect(html).toContain('data-motion="text-reveal"');
    expect(html).toContain('data-motion="stagger"');
    expect((html.match(/data-supported-buyer=/g) ?? []).length).toBe(4);
    expect(html).not.toMatch(/founded|since \d{4}|factory|manufacturer|certified|years of experience/i);
  });

  it("sequences procurement guidance while preserving every approved route", () => {
    const html = renderToStaticMarkup(<ProcurementSupportPage />);

    expect((html.match(/data-editorial-kind="procurement-step"/g) ?? []).length).toBe(6);
    expect((html.match(/data-editorial-kind="requirement-type"/g) ?? []).length).toBe(4);
    expect((html.match(/data-information-item=/g) ?? []).length).toBe(6);
    expect(html).toContain('data-media-slot="procurement-support-hero"');
    expect(html).toContain('data-motion="text-reveal"');
    expect((html.match(/data-motion="stagger"/g) ?? []).length).toBeGreaterThanOrEqual(1);
    for (const href of ["/products", "/inquiry", "/contact", "/request-quotation"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).not.toMatch(/guaranteed|in stock|ships within|delivery date/i);
  });

  it("lifts catalogue documents without exposing unavailable PDFs", () => {
    const html = renderToStaticMarkup(<CataloguesPage />);

    expect((html.match(/data-catalogue-document=/g) ?? []).length).toBe(5);
    expect((html.match(/data-motion="stagger-item"/g) ?? []).length).toBeGreaterThanOrEqual(5);
    expect(html).toContain('data-motion="stagger"');
    expect(html).toContain('data-motion="tilt"');
    expect(html).toContain("PDF not available online");
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/request-quotation"');
    expect(html).not.toContain('href=""');
    expect(html).not.toContain("[Month Year]");
  });

  it("polishes contact presentation without changing submission behavior or inventing details", () => {
    const html = renderToStaticMarkup(<ContactPage />);
    const form = source("src/features/contact-preview/contact-form-preview.tsx");

    expect(html).toContain("General contact form preview");
    expect(html).toContain('data-media-slot="contact-location"');
    expect((html.match(/data-motion="reveal"/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(html).toContain("Awaiting client confirmation");
    expect(html).toContain("Send Message");
    expect(form).toContain('fetch("/api/contact"');
    expect(form).toContain('method: "POST"');
    expect(form).toContain('form.reset()');
    expect(html).not.toMatch(/mailto:|tel:|wa\.me|contact@placeholder|\+966 XX/i);
  });

  it.each([
    [PRIVACY_DOCUMENT, 9],
    [TERMS_DOCUMENT, 11]
  ] as const)("keeps legal motion minimal and all review warnings visible", (document, count) => {
    const html = renderToStaticMarkup(<LegalPage document={document} />);

    expect((html.match(/data-legal-section=/g) ?? []).length).toBe(count);
    expect((html.match(/data-motion="reveal"/g) ?? []).length).toBeGreaterThanOrEqual(count + 1);
    expect(html).not.toContain('data-motion="tilt"');
    expect(html).not.toContain('data-motion="stagger"');
    expect(html).not.toContain('data-motion="text-reveal"');
    expect(html).toContain("awaiting client and legal approval");
    expect(html).toContain("qualified legal review");
    expect(html).not.toMatch(/Saudi law governs|retained for \d+ years|Google Analytics|Mailchimp/i);
  });
});
