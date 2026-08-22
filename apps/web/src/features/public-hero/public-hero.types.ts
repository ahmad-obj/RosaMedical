import type { PublicLocale } from "@/features/localization/locales";

export type PublicHeroPageKey = "home" | "about" | "products" | "inquiry" | "contact";
export type PublicHeroCopySide = "left" | "right";
export type PublicHeroTone = "dark" | "light";

export interface LocalizedHeroText {
  en: string;
  ar: string;
}

export interface PublicHeroMedia {
  desktopSrc: string;
  desktopAvifSrc: string;
  mobileSrc: string;
  alt: LocalizedHeroText;
  desktopFocalPoint: string;
  mobileFocalPoint: string;
}

export interface PublicHeroSlide {
  id: string;
  media: PublicHeroMedia;
  copySide: PublicHeroCopySide;
  tone: PublicHeroTone;
  eyebrow: LocalizedHeroText;
  title: LocalizedHeroText;
  copy: LocalizedHeroText;
}

export interface LocalizedPublicHeroSlide {
  id: string;
  media: Omit<PublicHeroMedia, "alt"> & { alt: string };
  copySide: PublicHeroCopySide;
  tone: PublicHeroTone;
  eyebrow: string;
  title: string;
  copy: string;
}

export type PublicHeroLocalizer = (
  page: PublicHeroPageKey,
  locale: PublicLocale
) => readonly LocalizedPublicHeroSlide[];
