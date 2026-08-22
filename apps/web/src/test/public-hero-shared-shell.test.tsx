import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function source(path: string): string {
  const fullPath = resolve(process.cwd(), path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

describe("shared public hero and shell", () => {
  it("defines one reusable four-slide public hero for all five main pages", () => {
    const data = source("src/features/public-hero/public-hero.data.ts");
    const carousel = source("src/features/public-hero/public-hero-carousel.tsx");

    for (const page of ["home", "about", "products", "inquiry", "contact"]) {
      expect(data).toContain(`${page}: [`);
    }

    for (let index = 1; index <= 4; index += 1) {
      expect(data).toContain(`hero-0${index}-desktop.webp`);
      expect(data).toContain(`hero-0${index}-desktop.avif`);
      expect(data).toContain(`hero-0${index}-mobile.webp`);
    }

    expect(carousel).toContain("getLocalizedPublicHeroSlides(page, locale)");
    expect(carousel).toContain("page: PublicHeroPageKey");
    expect(carousel).not.toContain("slide.ctas");
    expect(carousel).not.toContain("hero__actions");
  });

  it("replaces local hero roles on the five main public pages", () => {
    const home = source("src/features/homepage/homepage.tsx");
    const about = source("src/features/about/about-page.tsx");
    const products = source("src/features/products/products-overview.tsx");
    const inquiry = source("src/features/inquiry/inquiry-page.tsx");
    const contact = source("src/features/contact-preview/contact-page.tsx");

    expect(home).toContain('page="home"');
    expect(home).not.toContain("HomeHeroCarousel");

    expect(about).toContain('page="about"');
    expect(about).not.toContain("<AboutCompactHero");

    expect(products).toContain('page="products"');
    expect(products).not.toContain("<ProductsHero");

    expect(inquiry).toContain('page="inquiry"');
    expect(contact).toContain('page="contact"');
    expect(contact).not.toContain('className="contact-hero"');
  });

  it("keeps exactly one shared contact strip followed by the global footer", () => {
    const shell = source("src/components/layout/public-shell.tsx");
    const primary = shell.slice(
      shell.indexOf("const primaryLinks"),
      shell.indexOf("const utilityLinks")
    );

    for (const href of ["/", "/about", "/products", "/inquiry", "/contact"]) {
      expect(primary).toContain(`"${href}"`);
    }

    expect(primary).not.toContain("/catalogues");
    expect(primary).not.toContain("/search");
    expect(shell.match(/<PublicContactStrip \/>/g)?.length).toBe(1);
    expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
    expect(shell.indexOf("<footer")).toBeGreaterThan(shell.indexOf("<PublicContactStrip />"));
  });

  it("loads shared hero styling", () => {
    const globals = source("src/app/globals.css");
    expect(globals).toContain('@import "../styles/public-hero.css";');
  });
});
