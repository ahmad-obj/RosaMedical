import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { HOME_HERO_SLIDES } from "@/features/homepage/home-hero-slides";
import { SOCIAL_LINKS } from "@/features/social-links";

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("client-feedback responsive homepage contract", () => {
  it("loads the dedicated density layer after owner refinement", () => {
    const globals = source("src/app/globals.css");
    expect(globals.indexOf('../styles/public-density.css')).toBeGreaterThan(
      globals.indexOf('../styles/f8-owner-refinement.css')
    );

    const density = source("src/styles/public-density.css");
    expect(density).toContain("--public-density-section-block");
    expect(density).toContain("--public-density-hero-title");
    expect(density).toContain("@media (max-height: 800px)");
    expect(density).not.toContain("transform: scale(0.");
  });

  it("defines exactly four bounded hero slides", () => {
    expect(HOME_HERO_SLIDES).toHaveLength(4);
    expect(new Set(HOME_HERO_SLIDES.map((slide) => slide.id)).size).toBe(4);
    expect(HOME_HERO_SLIDES.every((slide) => slide.ctas.length >= 1 && slide.ctas.length <= 2)).toBe(true);
    expect(HOME_HERO_SLIDES.every((slide) => slide.image.desktopSrc.startsWith("/media/"))).toBe(true);
    expect(HOME_HERO_SLIDES.every((slide) => slide.image.mobileSrc.startsWith("/media/"))).toBe(true);
  });

  it("ships final versioned hero derivatives and final slide IDs", () => {
    expect(HOME_HERO_SLIDES.every((slide) => !slide.id.startsWith("hero-development-"))).toBe(true);
    HOME_HERO_SLIDES.forEach((slide, index) => {
      const number = String(index + 1).padStart(2, "0");
      expect(slide.image.desktopSrc).toBe(`/media/editorial/home-hero/v1/home-hero-${number}-desktop.webp`);
      expect(slide.image.mobileSrc).toBe(`/media/editorial/home-hero/v1/home-hero-${number}-mobile.webp`);
      expect(existsSync(resolve(process.cwd(), `public${slide.image.desktopSrc}`))).toBe(true);
      expect(existsSync(resolve(process.cwd(), `public${slide.image.mobileSrc}`))).toBe(true);
    });

    const carouselSource = source("src/features/homepage/sections/home-hero-carousel.tsx");
    expect(carouselSource.match(/priority=\{activeIndex === 0\}/g)).toHaveLength(1);
  });

  it("keeps Noto Sans Arabic and adds dedicated Arabic density rules", () => {
    const layout = source("src/app/layout.tsx");
    const density = source("src/styles/public-density.css");
    expect(layout).toContain("Noto_Sans_Arabic");
    expect(density).toContain('html[dir="rtl"] .home-hero-carousel');
    expect(density).toContain("font-family: var(--font-arabic)");
  });

  it("centralizes the supplied social profiles and branded icon set", () => {
    expect(SOCIAL_LINKS.map((item) => item.platform)).toEqual(["instagram", "x", "facebook", "linkedin"]);
    expect(SOCIAL_LINKS).toHaveLength(4);
    expect(SOCIAL_LINKS.map((item) => item.href)).toEqual([
      "https://www.instagram.com/rosa_international/",
      "https://x.com/",
      "https://www.facebook.com/profile.php?id=61581294504389",
      "https://www.linkedin.com/in/rosa-int-l-trading-co-370a74398/"
    ]);
  });

  it("uses a dedicated five-family homepage gallery instead of FamilyCard collage", () => {
    const discovery = source("src/features/homepage/sections/family-discovery.tsx");
    const gallery = source("src/features/homepage/sections/home-family-gallery.tsx");
    expect(discovery).toContain("HomeFamilyGallery");
    expect(discovery).not.toContain("FamilyCard");
    expect(gallery).toContain("data-home-family-gallery");
    expect(gallery).not.toContain("Explore collection");
  });

  it("keeps the homepage quotation action singular instead of repeating it through hero and footer", () => {
    const homepage = source("src/features/homepage/homepage.tsx");
    const shell = source("src/components/layout/public-shell.tsx");
    const heroQuoteLabels = HOME_HERO_SLIDES.flatMap((slide) => slide.ctas)
      .filter((cta) => cta.label.en.toLowerCase().includes("quote"));

    expect(heroQuoteLabels).toHaveLength(0);
    expect(homepage).not.toContain("QuotationCta");
    expect(shell.match(/en="Request a quote"/g) ?? []).toHaveLength(1);
  });

  it("uses a restrained public sans hierarchy without removing the existing motion systems", () => {
    const refinement = source("src/styles/public-feedback-fixes.css");
    const carousel = source("src/features/homepage/sections/home-hero-carousel.tsx");
    const density = source("src/styles/public-density.css");
    const procurement = source("src/features/homepage/sections/procurement-support.tsx");

    expect(refinement).toContain("--font-public: var(--font-interface)");
    expect(refinement).toContain("font-family: var(--font-public)");
    expect(refinement).toContain('html[dir="rtl"]');
    expect(carousel).toContain("AnimatePresence");
    expect(carousel).toContain("MOTION_DURATION.hero");
    expect(density).toContain("transition: flex-grow var(--motion-section)");
    expect(procurement).toContain("Reveal");
    expect(procurement).toContain("Stagger");
    expect(procurement).not.toContain("ROSA_LOGO_MEDIA");
  });
});
