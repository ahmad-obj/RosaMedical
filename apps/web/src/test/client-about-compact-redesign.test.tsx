import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AboutPage } from "@/features/about";
import { createAboutPageModel } from "@/features/about/about.data";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("client About compact redesign", () => {
  it("defines complete English and Arabic page models", () => {
    const en = createAboutPageModel("en");
    const ar = createAboutPageModel("ar");

    expect(en.hero.eyebrow).toBe("Medical Device Supplier");
    expect(en.introduction.title).toBe("About Rosa");
    expect(en.stories.map((item) => item.id)).toEqual(["workflow", "growth", "experience"]);
    expect(en.stories.map((item) => item.mediaSide)).toEqual(["left", "right", "left"]);
    expect(en.compliance.items.map((item) => item.id)).toEqual([
      "regulations", "legal-system", "standards", "law", "rules", "requirements"
    ]);
    expect(en.documents.map((item) => item.label)).toEqual(["ISO", "MDMA", "MDEL", "AR", "WAREHOUSE"]);
    expect(en.quotation.primary.href).toBe("/request-quotation");
    expect(ar.stories).toHaveLength(3);
    expect(ar.compliance.items).toHaveLength(6);
    expect(ar.documents).toHaveLength(5);
  });

  it("does not add unsupported company claims", () => {
    const text = JSON.stringify(createAboutPageModel("en"));
    expect(text).not.toMatch(/\b(18|19|20)\d{2}\b/);
    expect(text).not.toMatch(/founded|since \d{4}|factory|manufacturer|years of experience|ISO-certified|SFDA-certified/i);
  });

  it("renders the approved compact section hierarchy and stable media slots", () => {
    const html = renderToStaticMarkup(<AboutPage locale="en" />);
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);

    const order = [
      "about-client-hero",
      "about-client-introduction",
      "about-client-workflow",
      "about-client-growth",
      "about-client-experience",
      "about-client-contact",
      "about-client-compliance",
      "about-client-documents",
      "about-client-quotation"
    ];
    let cursor = -1;
    for (const section of order) {
      const next = html.indexOf(`data-section="${section}"`);
      expect(next).toBeGreaterThan(cursor);
      cursor = next;
    }

    expect(html).not.toContain('data-section="about-client-social"');
    expect((html.match(/data-about-story=/g) ?? [])).toHaveLength(3);
    expect((html.match(/data-about-compliance-item=/g) ?? [])).toHaveLength(6);
    expect((html.match(/data-about-document=/g) ?? [])).toHaveLength(5);
    expect((html.match(/data-media-slot="about-client-/g) ?? [])).toHaveLength(9);
    expect(html).toContain('data-motion="text-reveal"');
    expect(html).toContain('data-motion="stagger"');
    expect((html.match(/data-motion="reveal"/g) ?? []).length).toBeGreaterThanOrEqual(7);
  });

  it("keeps real routes, contact actions and removes the retired About composition", () => {
    const html = renderToStaticMarkup(<AboutPage locale="en" />);
    expect(html).toContain('href="/products"');
    expect(html).toContain('href="/request-quotation"');
    expect(html).toMatch(/https:\/\/wa\.me\//);
    expect(html).toMatch(/mailto:/);
    expect(html).not.toContain('data-company-profile="true"');
    expect(html).not.toContain("data-supported-buyer=");
    expect(html).not.toContain("data-family-index-row=");
    expect(html).not.toContain('href="/procurement-support"');
    expect(html).not.toMatch(/youtube/i);
    expect(html).not.toMatch(/certificate number|approval number|licensed by|certified by/i);
  });

  it("locks compact responsive About geometry while leaving the shared shell footer ribbon visible", () => {
    const css = source("src/styles/about-client-redesign.css");
    const globals = source("src/app/globals.css");
    const shell = source("src/components/layout/public-shell.tsx");
    expect(globals).toContain('@import "../styles/about-client-redesign.css";');
    expect(css).toContain(".about-client-hero");
    expect(css).toMatch(/@media \(min-width: 50rem\)/);
    expect(css).toMatch(/grid-template-columns:\s*minmax\(0,\s*2fr\)\s*minmax\(0,\s*3fr\)/);
    expect(css).toMatch(/\.about-client-compliance__grid[\s\S]*repeat\(6,/);
    expect(css).toMatch(/@media \(max-width: 63\.99rem\)[\s\S]*\.about-client-compliance__grid[\s\S]*repeat\(3,/);
    expect(css).toMatch(/@media \(max-width: 63\.99rem\)[\s\S]*\.about-client-documents__grid[\s\S]*repeat\(3,/);
    expect(css).toMatch(/@media \(max-width: 40rem\)[\s\S]*repeat\(2,/);
    expect(css).toMatch(/@media \(max-width: 40rem\)[\s\S]*scroll-snap-type:\s*inline mandatory/);
    expect(css).not.toContain('.page-main:has([data-section="about-client-hero"]) + .public-contact-strip');
    expect(shell.indexOf('<main className="page-main"')).toBeGreaterThanOrEqual(0);
    expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf('<main className="page-main"'));
    expect(css).not.toContain("text-align: justify");
  });

  it("uses restrained transform-only polish with reduced-motion fallback", () => {
    const css = source("src/styles/about-client-interactions.css");
    expect(css).toContain("@keyframes about-client-hero-settle");
    expect(css).toContain("@keyframes about-client-compliance-connector-enter");
    expect(css).toMatch(/\.about-client-compliance__connector[\s\S]*animation:\s*about-client-compliance-connector-enter/);
    expect(css).toMatch(/\.about-client-story__media img[\s\S]*transition:\s*transform 420ms cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)/);
    expect(css).toMatch(/\.about-client-story__media:hover img[\s\S]*transform:\s*scale\(1\.14\)/);
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*\.about-client-compliance__connector[\s\S]*animation:\s*none/);
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*\.about-client-story__media img[\s\S]*transition:\s*none/);
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*\.about-client-story__media:hover img[\s\S]*transform:\s*none/);
    expect(css).toMatch(/translateY\(-4px\)/);
    expect(css).toContain("scale(1.02)");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).not.toMatch(/rotate\(/);
    expect(css).not.toMatch(/will-change:\s*(transform|opacity)/);
  });
});
