import type { Route } from "next";
import type { PublicLocale } from "@/features/localization/locales";

export type HeroCopySide = "left" | "right";
export type HeroTone = "dark" | "light";

export interface LocalizedHeroText {
  en: string;
  ar: string;
}

export interface HeroImage {
  desktopSrc: string;
  mobileSrc: string;
  alt: LocalizedHeroText;
  desktopFocalPoint: string;
  mobileFocalPoint: string;
}

export interface HomeHeroCta {
  label: LocalizedHeroText;
  href: Route<string>;
  variant?: "primary" | "secondary";
}

export interface HomeHeroSlide {
  id: string;
  image: HeroImage;
  copySide: HeroCopySide;
  tone: HeroTone;
  eyebrow: LocalizedHeroText;
  title: LocalizedHeroText;
  copy: LocalizedHeroText;
  ctas: readonly HomeHeroCta[];
}

export interface LocalizedHomeHeroSlide {
  id: string;
  image: Omit<HeroImage, "alt"> & { alt: string };
  copySide: HeroCopySide;
  tone: HeroTone;
  eyebrow: string;
  title: string;
  copy: string;
  ctas: readonly {
    label: string;
    href: Route<string>;
    variant?: "primary" | "secondary";
  }[];
}

export const HOME_HERO_SLIDES = [
  {
    id: "precision-instruments",
    image: {
      desktopSrc: "/media/editorial/home-hero/v1/home-hero-01-desktop.webp",
      mobileSrc: "/media/editorial/home-hero/v1/home-hero-01-mobile.webp",
      alt: {
        en: "Surgical instruments arranged on a sterile blue field",
        ar: "أدوات جراحية مرتبة على سطح أزرق معقم"
      },
      desktopFocalPoint: "61% 58%",
      mobileFocalPoint: "66% 54%"
    },
    copySide: "left",
    tone: "dark",
    eyebrow: { en: "Medical instruments supplier", ar: "مورّد أدوات طبية" },
    title: {
      en: "Precision instruments for professional procurement.",
      ar: "أدوات دقيقة للمشتريات المهنية."
    },
    copy: {
      en: "Explore Rosa instrument families, product codes and catalogue references through one clear catalogue experience.",
      ar: "استعرض عائلات أدوات روزا ورموز المنتجات ومراجع الكتالوج ضمن تجربة واضحة ومترابطة."
    },
    ctas: [
      { label: { en: "Explore Products", ar: "استعرض المنتجات" }, href: "/products" as const },
      { label: { en: "View Catalogues", ar: "عرض الكتالوجات" }, href: "/catalogues" as const, variant: "secondary" as const }
    ]
  },
  {
    id: "clinical-instrument-context",
    image: {
      desktopSrc: "/media/editorial/home-hero/v1/home-hero-02-desktop.webp",
      mobileSrc: "/media/editorial/home-hero/v1/home-hero-02-mobile.webp",
      alt: {
        en: "Surgical instruments hanging on a rack beside an operating field",
        ar: "أدوات جراحية معلقة على حامل بجوار حقل العمليات"
      },
      desktopFocalPoint: "68% 53%",
      mobileFocalPoint: "78% 52%"
    },
    copySide: "left",
    tone: "dark",
    eyebrow: { en: "Structured product discovery", ar: "استعراض منظم للمنتجات" },
    title: {
      en: "Find the instrument you need with less friction.",
      ar: "اعثر على الأداة التي تحتاجها بسهولة أكبر."
    },
    copy: {
      en: "Browse focused families and review codes, sizes and configurations without losing product context.",
      ar: "استعرض العائلات وراجع الرموز والمقاسات والخيارات مع الحفاظ على سياق كل منتج."
    },
    ctas: [
      { label: { en: "Browse Instruments", ar: "استعرض الأدوات" }, href: "/products" as const },
      { label: { en: "View Catalogues", ar: "عرض الكتالوجات" }, href: "/catalogues" as const, variant: "secondary" as const }
    ]
  },
  {
    id: "surgical-instrument-selection",
    image: {
      desktopSrc: "/media/editorial/home-hero/v1/home-hero-03-desktop.webp",
      mobileSrc: "/media/editorial/home-hero/v1/home-hero-03-mobile.webp",
      alt: {
        en: "Gloved surgical team passing a surgical instrument in an operating room",
        ar: "فريق جراحي مرتدٍ للقفازات يتبادل أداة جراحية داخل غرفة العمليات"
      },
      desktopFocalPoint: "54% 50%",
      mobileFocalPoint: "55% 50%"
    },
    copySide: "left",
    tone: "dark",
    eyebrow: { en: "Instrument selection", ar: "اختيار الأدوات" },
    title: {
      en: "Product information that stays clear.",
      ar: "معلومات منتجات تبقى واضحة."
    },
    copy: {
      en: "Move from family to product detail with the specifications that matter kept in view.",
      ar: "انتقل من عائلة الأداة إلى تفاصيل المنتج مع إبقاء المواصفات المهمة أمامك."
    },
    ctas: [
      { label: { en: "Explore Products", ar: "استعرض المنتجات" }, href: "/products" as const },
      { label: { en: "View Catalogues", ar: "عرض الكتالوجات" }, href: "/catalogues" as const, variant: "secondary" as const }
    ]
  },
  {
    id: "catalogue-to-quotation",
    image: {
      desktopSrc: "/media/editorial/home-hero/v1/home-hero-04-desktop.webp",
      mobileSrc: "/media/editorial/home-hero/v1/home-hero-04-mobile.webp",
      alt: {
        en: "Surgical instruments prepared on a blue sterile drape",
        ar: "أدوات جراحية مجهزة على غطاء أزرق معقم"
      },
      desktopFocalPoint: "48% 52%",
      mobileFocalPoint: "48% 52%"
    },
    copySide: "right",
    tone: "dark",
    eyebrow: { en: "Catalogue to inquiry", ar: "من الكتالوج إلى الاستفسار" },
    title: {
      en: "From catalogue reference to a structured inquiry.",
      ar: "من مرجع الكتالوج إلى استفسار منظم."
    },
    copy: {
      en: "Use product and catalogue details to prepare one organised request when you are ready.",
      ar: "استخدم تفاصيل المنتج والكتالوج لإعداد طلب واحد منظم عندما تكون جاهزًا."
    },
    ctas: [
      { label: { en: "View Catalogues", ar: "عرض الكتالوجات" }, href: "/catalogues" as const },
      { label: { en: "Explore Products", ar: "استعرض المنتجات" }, href: "/products" as const, variant: "secondary" as const }
    ]
  }
] as const satisfies readonly [HomeHeroSlide, HomeHeroSlide, HomeHeroSlide, HomeHeroSlide];

export function localizeHomeHeroSlide(
  slide: HomeHeroSlide,
  locale: PublicLocale
): LocalizedHomeHeroSlide {
  const key = locale === "ar" ? "ar" : "en";
  return {
    id: slide.id,
    image: {
      desktopSrc: slide.image.desktopSrc,
      mobileSrc: slide.image.mobileSrc,
      alt: slide.image.alt[key],
      desktopFocalPoint: slide.image.desktopFocalPoint,
      mobileFocalPoint: slide.image.mobileFocalPoint
    },
    copySide: slide.copySide,
    tone: slide.tone,
    eyebrow: slide.eyebrow[key],
    title: slide.title[key],
    copy: slide.copy[key],
    ctas: slide.ctas.map((cta) => ({
      label: cta.label[key],
      href: cta.href,
      ...(cta.variant ? { variant: cta.variant } : {})
    }))
  };
}
