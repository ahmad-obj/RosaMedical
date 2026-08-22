import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("client review round 2026-08-22", () => {
  it("uses the five requested main navigation pages", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    const primaryBlock = shell.slice(
      shell.indexOf("const primaryLinks"),
      shell.indexOf("const utilityLinks")
    );

    expect(primaryBlock).toContain('["Home", "/"]');
    expect(primaryBlock).toContain('["About Us", "/about"]');
    expect(primaryBlock).toContain('["Products", "/products"]');
    expect(primaryBlock).toContain('["Inquiry", "/inquiry"]');
    expect(primaryBlock).toContain('["Contact Us", "/contact"]');
    expect(primaryBlock).not.toContain("/catalogues");
    expect(primaryBlock).not.toContain("/search");
  });

  it("does not render CTA buttons inside the homepage banner", () => {
    const hero = source("src/features/homepage/sections/home-hero-carousel.tsx");
    expect(hero).not.toContain("home-hero__actions");
    expect(hero).not.toContain("slide.ctas.map");
  });

  it("keeps Comprehensive Plans on one shared desktop width and includes the lead image asset", () => {
    const redesign = source("src/styles/home-client-redesign.css");
    expect(redesign).toMatch(/\.home-comprehensive__lead[\s\S]*?max-width:\s*70rem/);
    expect(redesign).toMatch(/\.home-comprehensive__specialties[\s\S]*?max-width:\s*70rem/);
    expect(
      existsSync(resolve(process.cwd(), "public/media/editorial/home-specialties/plastic-surgery.webp"))
    ).toBe(true);
  });

  it("uses the shared Contact us footer ribbon on Home and About", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    const home = source("src/features/homepage/homepage.tsx");
    const about = source("src/features/about/about-page.tsx");
    const homeCss = source("src/styles/home-client-redesign.css");

    expect(shell).toContain("<PublicContactStrip />");
    expect(home).not.toContain("HomeSocialStrip");
    expect(about).not.toContain("AboutSocialStrip");
    expect(homeCss).not.toContain("body:has(.public-page--home) .public-contact-strip { display: none; }");
    expect(homeCss).not.toContain("body:has(.public-page--home) .site-footer__brand .button { display: none; }");
  });
});
