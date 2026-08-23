import { describe, expect, it } from "vitest";
import { getLocalizedPublicHeroSlides } from "@/features/public-hero/public-hero.data";
import { getPublicHeroMobilePresentation } from "@/features/public-hero/public-hero-mobile";

describe("public hero mobile media", () => {
  it("uses the valid desktop artwork in a composed portrait presentation for the third gloved-hands slide", () => {
    const slides = getLocalizedPublicHeroSlides("home", "en");
    const slide = slides.find((item) => item.id === "surgical-instrument-selection");

    expect(slide).toBeDefined();
    const presentation = getPublicHeroMobilePresentation(slide!);
    expect(presentation.kind).toBe("composed");
    expect(presentation.src).toBe(slide?.media.desktopSrc);
    expect(presentation.src).not.toContain("hero-03-mobile.webp");
  });

  it("keeps ordinary mobile slides on their dedicated cover sources", () => {
    const slides = getLocalizedPublicHeroSlides("home", "en");
    const ordinary = slides.filter((item) => item.id !== "surgical-instrument-selection");

    expect(ordinary.every((slide) => {
      const presentation = getPublicHeroMobilePresentation(slide);
      return presentation.kind === "cover" && presentation.src === slide.media.mobileSrc;
    })).toBe(true);
  });
});
