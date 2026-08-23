import type { LocalizedPublicHeroSlide } from "./public-hero.types";

export type PublicHeroMobilePresentation =
  | { kind: "cover"; src: string }
  | { kind: "composed"; src: string };

export function getPublicHeroMobilePresentation(
  slide: LocalizedPublicHeroSlide
): PublicHeroMobilePresentation {
  if (slide.id === "surgical-instrument-selection") {
    return { kind: "composed", src: slide.media.desktopSrc };
  }

  return { kind: "cover", src: slide.media.mobileSrc };
}
