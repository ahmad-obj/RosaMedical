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

  it("extends the four Comprehensive Plans supporting images to the wide page boundary and keeps a complete lead WebP", () => {
    const redesign = source("src/styles/home-client-redesign.css");
    const polish = source("src/styles/client-review-final-polish.css");
    const plasticSurgeryPath = resolve(process.cwd(), "public/media/editorial/home-specialties/plastic-surgery.webp");

    expect(redesign).toMatch(/\.home-comprehensive__lead[\s\S]*?max-width:\s*70rem/);
    expect(polish).toMatch(/\.home-comprehensive__specialties\s*\{[\s\S]*?width:\s*100%[\s\S]*?max-width:\s*80rem/);
    expect(existsSync(plasticSurgeryPath)).toBe(true);

    const image = readFileSync(plasticSurgeryPath);
    expect(image.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(image.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(image.readUInt32LE(4) + 8).toBe(image.length);
  });

  it("keeps Business Growth at 55 percent copy and 45 percent media on desktop without changing mobile", () => {
    const globals = source("src/app/globals.css");
    const polishPath = resolve(process.cwd(), "src/styles/client-review-final-polish.css");

    expect(globals).toContain('@import "../styles/client-review-final-polish.css";');
    expect(existsSync(polishPath)).toBe(true);

    const polish = readFileSync(polishPath, "utf8");
    expect(polish).toMatch(/@media \(min-width: 50rem\)[\s\S]*\[data-section="about-client-growth"\] \.about-client-story__grid[\s\S]*grid-template-columns:\s*minmax\(0,\s*11fr\)\s*minmax\(0,\s*9fr\)/);
    expect(polish).not.toMatch(/@media \(max-width: 49\.99rem\)[\s\S]*about-client-growth/);
  });

  it("uses the shared Contact us footer ribbon for every main public page", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    const home = source("src/features/homepage/homepage.tsx");
    const about = source("src/features/about/about-page.tsx");
    const homeCss = source("src/styles/home-client-redesign.css");

    expect(shell).toContain("<PublicContactStrip />");
    expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
    expect(home).not.toContain("HomeSocialStrip");
    expect(about).not.toContain("AboutSocialStrip");
    expect(homeCss).not.toContain("body:has(.public-page--home) .public-contact-strip { display: none; }");
    expect(homeCss).not.toContain("body:has(.public-page--home) .site-footer__brand .button { display: none; }");
  });
});
