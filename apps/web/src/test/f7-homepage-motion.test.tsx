import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Homepage } from "@/features/homepage/homepage";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("F7 homepage cinematic polish", () => {
  it("preserves the approved six-section homepage hierarchy", () => {
    const html = renderToStaticMarkup(<Homepage />);

    for (const section of [
      "home-hero",
      "family-discovery",
      "procurement-support",
      "featured-instruments",
      "catalogue-access",
      "quotation-cta"
    ]) {
      expect(html).toContain(`data-section=\"${section}\"`);
    }
    expect((html.match(/<h1/g) ?? [])).toHaveLength(1);
    expect(html).toContain("Explore Products");
    expect(html).toContain("Request a Quote");
  });

  it("uses one editorial hero choreography and the approved cinematic media", () => {
    const html = renderToStaticMarkup(<Homepage />);

    expect(html).toContain('data-home-choreography="hero"');
    expect(html).toContain('data-motion="text-reveal"');
    expect(html).toContain('data-media-slot="homepage-hero"');
    expect(html).toContain('data-media-state="ready"');
    expect(html).toContain('data-motion="magnetic"');
    expect(html).toContain("<img");
  });

  it("stages family, product, process and catalogue groups through shared motion", () => {
    const html = renderToStaticMarkup(<Homepage />);

    expect((html.match(/data-motion="stagger"/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect((html.match(/data-motion="stagger-item"/g) ?? []).length).toBeGreaterThanOrEqual(12);
    expect(html).toContain('data-motion="tilt"');
    expect(html).toContain('data-motion="spotlight"');
    expect(html).toContain('data-motion="progressive-blur"');
  });

  it("keeps every current family and product link intact", () => {
    const html = renderToStaticMarkup(<Homepage />);

    for (const path of [
      "/products/knives",
      "/products/scissors",
      "/products/punches",
      "/products/chisels",
      "/products/cutters",
      "/catalogues"
    ]) {
      expect(html).toContain(`href=\"${path}\"`);
    }
  });

  it("routes every release image through the shared manifest", () => {
    const files = [
      "src/features/homepage/sections/home-hero.tsx",
      "src/features/homepage/sections/procurement-support.tsx",
      "src/features/homepage/sections/catalogue-access.tsx"
    ].map(source).join("\n");

    expect(files).not.toMatch(/src=["']\/media\//i);
    expect(files).toContain("getCinematicMedia");
    expect(files).toContain("MediaFrame");
  });
});
