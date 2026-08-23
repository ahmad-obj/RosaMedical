import { describe, expect, it } from "vitest";
import { getLocalizedPublicHeroSlides } from "@/features/public-hero/public-hero.data";

describe("public hero mobile media", () => {
  it("uses a composed portrait presentation for the third gloved-hands slide", () => {
    const slides = getLocalizedPublicHeroSlides("home", "en");
    const slide = slides.find((item) => item.id === "surgical-instrument-selection");

    expect(slide).toBeDefined();
    expect(slide?.media.mobilePresentation).toBe("composed");
    expect(slide?.media.mobileSrc).toBe(slide?.media.desktopSrc);
    expect(slide?.media.mobileSrc).not.toContain("hero-03-mobile.webp");
  });

  it("keeps ordinary mobile slides on the cover presentation", () => {
    const slides = getLocalizedPublicHeroSlides("home", "en");
    const ordinary = slides.filter((item) => item.id !== "surgical-instrument-selection");

    expect(ordinary.every((slide) => slide.media.mobilePresentation === "cover")).toBe(true);
  });
});
