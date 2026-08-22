import type { PublicLocale } from "@/features/localization/locales";
import type {
  LocalizedHeroText,
  LocalizedPublicHeroSlide,
  PublicHeroPageKey
} from "./public-hero.types";

interface PublicHeroMediaRecord {
  id: string;
  desktopSrc: string;
  desktopAvifSrc: string;
  mobileSrc: string;
  alt: LocalizedHeroText;
  desktopFocalPoint: string;
  mobileFocalPoint: string;
  copySide: "left" | "right";
  tone: "dark" | "light";
}

interface PublicHeroCopyRecord {
  eyebrow: LocalizedHeroText;
  title: LocalizedHeroText;
  copy: LocalizedHeroText;
}

const PUBLIC_HERO_MEDIA = [
  {
    id: "precision-instruments",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-01-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-01-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-01-mobile.webp",
    alt: {
      en: "Gloved hand selecting a surgical instrument from an arranged set",
      ar: "يد مرتدية قفازًا تختار أداة جراحية من مجموعة مرتبة"
    },
    desktopFocalPoint: "58% 50%",
    mobileFocalPoint: "50% 46%",
    copySide: "left",
    tone: "dark"
  },
  {
    id: "clinical-instrument-context",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-02-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-02-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-02-mobile.webp",
    alt: {
      en: "Gloved hand holding ring-handled surgical forceps beside other instruments",
      ar: "يد مرتدية قفازًا تمسك ملقطًا جراحيًا بحلقات بجوار أدوات أخرى"
    },
    desktopFocalPoint: "63% 49%",
    mobileFocalPoint: "50% 48%",
    copySide: "left",
    tone: "dark"
  },
  {
    id: "surgical-instrument-selection",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-03-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-03-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-03-mobile.webp",
    alt: {
      en: "Gloved hands examining a surgical scissors instrument",
      ar: "يدان مرتديتان قفازات تفحصان مقصًا جراحيًا"
    },
    desktopFocalPoint: "62% 50%",
    mobileFocalPoint: "54% 48%",
    copySide: "left",
    tone: "dark"
  },
  {
    id: "catalogue-to-quotation",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-04-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-04-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-04-mobile.webp",
    alt: {
      en: "Dark surgical instruments arranged on a textured sterile surface",
      ar: "أدوات جراحية داكنة مرتبة على سطح طبي منسوج"
    },
    desktopFocalPoint: "46% 50%",
    mobileFocalPoint: "50% 48%",
    copySide: "right",
    tone: "dark"
  }
] as const satisfies readonly [
  PublicHeroMediaRecord,
  PublicHeroMediaRecord,
  PublicHeroMediaRecord,
  PublicHeroMediaRecord
];

const PUBLIC_HERO_COPY = {
  home: [
    {
      eyebrow: { en: "Medical instruments supplier", ar: "مورّد أدوات طبية" },
      title: {
        en: "Precision instruments. Procurement made clear.",
        ar: "أدوات دقيقة. ومشتريات أكثر وضوحًا."
      },
      copy: {
        en: "A composed catalogue and quotation experience for hospitals, distributors and procurement teams.",
        ar: "تجربة منظمة لاستعراض الكتالوجات وطلب عروض الأسعار للمستشفيات والموزعين وفرق المشتريات."
      }
    },
    {
      eyebrow: { en: "Structured product discovery", ar: "استعراض منظم للمنتجات" },
      title: {
        en: "A clearer view of the instruments you need.",
        ar: "رؤية أوضح للأدوات التي تحتاجها."
      },
      copy: {
        en: "Browse focused instrument families, review product codes and variants, and carry the right details into your inquiry.",
        ar: "استعرض عائلات الأدوات المركزة، وراجع الرموز والخيارات، واحتفظ بالتفاصيل الصحيحة داخل استفسارك."
      }
    },
    {
      eyebrow: { en: "Instrument selection", ar: "اختيار الأدوات" },
      title: {
        en: "Clearer instrument selection, from the start.",
        ar: "اختيار أوضح للأدوات منذ البداية."
      },
      copy: {
        en: "Move from family browsing to product codes, configurations and quantities in one composed quotation path.",
        ar: "انتقل من استعراض العائلات إلى رموز المنتجات وخياراتها وكمياتها ضمن مسار واحد منظم لطلب عرض السعر."
      }
    },
    {
      eyebrow: { en: "Catalogue to quotation", ar: "من الكتالوج إلى عرض السعر" },
      title: {
        en: "From catalogue detail to one organised request.",
        ar: "حوّل تفاصيل الكتالوج إلى طلب واحد منظم."
      },
      copy: {
        en: "Identify the instrument family, review available configurations, and bring quantities together without losing product context.",
        ar: "حدد عائلة الأداة، وراجع الخيارات المتاحة، واجمع الكميات مع الحفاظ على سياق كل منتج."
      }
    }
  ],
  about: [
    {
      eyebrow: { en: "About Rosa", ar: "عن روزا" },
      title: {
        en: "Structured support for medical-instrument procurement.",
        ar: "دعم منظم لمشتريات الأدوات الطبية."
      },
      copy: {
        en: "Rosa connects organised product information, responsive follow-up and quotation support for professional buyers and trading partners.",
        ar: "تجمع روزا بين معلومات المنتجات المنظمة والمتابعة السريعة ودعم عروض الأسعار للمشترين المهنيين وشركاء التجارة."
      }
    },
    {
      eyebrow: { en: "How we work", ar: "كيف نعمل" },
      title: {
        en: "Clear information. Responsive follow-up.",
        ar: "معلومات واضحة. ومتابعة سريعة."
      },
      copy: {
        en: "Our workflow keeps product discovery, requirement details and quotation preparation connected from the first inquiry onward.",
        ar: "يربط أسلوب عملنا بين استعراض المنتجات وتفاصيل المتطلبات وإعداد عرض السعر منذ بداية الاستفسار."
      }
    },
    {
      eyebrow: { en: "Professional support", ar: "دعم مهني" },
      title: {
        en: "Built around buyers who need clarity and continuity.",
        ar: "مصمم للمشترين الذين يحتاجون إلى الوضوح والاستمرارية."
      },
      copy: {
        en: "A consistent catalogue and inquiry process helps professional buyers move through product information with less friction.",
        ar: "يساعد مسار الكتالوج والاستفسار المتسق المشترين المهنيين على مراجعة معلومات المنتجات بسهولة أكبر."
      }
    },
    {
      eyebrow: { en: "Catalogue to inquiry", ar: "من الكتالوج إلى الاستفسار" },
      title: {
        en: "Product context stays with the request.",
        ar: "تبقى تفاصيل المنتج مرتبطة بالطلب."
      },
      copy: {
        en: "Families, product codes, options and quantities remain connected as the requirement moves toward quotation.",
        ar: "تبقى العائلات ورموز المنتجات والخيارات والكميات مترابطة أثناء انتقال المتطلبات إلى مرحلة عرض السعر."
      }
    }
  ],
  products: [
    {
      eyebrow: { en: "Medical devices", ar: "الأدوات الطبية" },
      title: {
        en: "Find the instrument you need with less friction.",
        ar: "اعثر على الأداة المطلوبة بخطوات أوضح."
      },
      copy: {
        en: "Search the catalogue, narrow by instrument family and open the exact product details before adding an item to your inquiry.",
        ar: "ابحث في الكتالوج، وحدد عائلة الأدوات، وافتح تفاصيل المنتج قبل إضافته إلى استفسارك."
      }
    },
    {
      eyebrow: { en: "Product discovery", ar: "استعراض المنتجات" },
      title: {
        en: "Names, codes and options in one searchable view.",
        ar: "الأسماء والرموز والخيارات في عرض واحد قابل للبحث."
      },
      copy: {
        en: "Use product names, codes, families and listed options to narrow the catalogue without losing context.",
        ar: "استخدم أسماء المنتجات ورموزها وعائلاتها وخياراتها المدرجة لتضييق نتائج الكتالوج دون فقدان السياق."
      }
    },
    {
      eyebrow: { en: "Product details", ar: "تفاصيل المنتج" },
      title: {
        en: "Review the product before building your request.",
        ar: "راجع المنتج قبل إضافته إلى طلبك."
      },
      copy: {
        en: "Open the product page to review identification, available configuration details and the quotation inquiry action.",
        ar: "افتح صفحة المنتج لمراجعة بياناته وخياراته المدرجة وإضافته إلى استفسار عرض السعر."
      }
    },
    {
      eyebrow: { en: "Technical catalogues", ar: "الكتالوجات التقنية" },
      title: {
        en: "Open or download the family catalogue directly.",
        ar: "افتح كتالوج العائلة أو نزّله مباشرة."
      },
      copy: {
        en: "Each product category connects to its existing Rosa technical catalogue for document-led review.",
        ar: "ترتبط كل فئة منتجات بكتالوج روزا التقني الخاص بها للمراجعة المباشرة عبر الوثيقة."
      }
    }
  ],
  inquiry: [
    {
      eyebrow: { en: "Quotation inquiry", ar: "استفسار عرض السعر" },
      title: {
        en: "Build one clear instrument request.",
        ar: "أنشئ طلب أدوات واحدًا وواضحًا."
      },
      copy: {
        en: "Bring selected products together in one inquiry before sending the requirement to Rosa for quotation review.",
        ar: "اجمع المنتجات المحددة في استفسار واحد قبل إرسال المتطلبات إلى روزا لمراجعة عرض السعر."
      }
    },
    {
      eyebrow: { en: "Review selections", ar: "مراجعة الاختيارات" },
      title: {
        en: "Keep product identity and configuration visible.",
        ar: "احتفظ ببيانات المنتج وخياراته واضحة."
      },
      copy: {
        en: "Review each selected instrument, code, size and listed variant before you continue.",
        ar: "راجع كل أداة محددة ورمزها ومقاسها وخيارها المدرج قبل المتابعة."
      }
    },
    {
      eyebrow: { en: "Quantities and notes", ar: "الكميات والملاحظات" },
      title: {
        en: "Refine the requirement before quotation.",
        ar: "اضبط المتطلبات قبل طلب عرض السعر."
      },
      copy: {
        en: "Adjust quantities and add requirement notes while the selected product context remains attached.",
        ar: "عدّل الكميات وأضف ملاحظات المتطلبات مع بقاء تفاصيل المنتجات المحددة مرتبطة بالطلب."
      }
    },
    {
      eyebrow: { en: "Ready to send", ar: "جاهز للإرسال" },
      title: {
        en: "Move one organised inquiry into quotation review.",
        ar: "حوّل استفسارًا منظمًا إلى مراجعة عرض السعر."
      },
      copy: {
        en: "When the product list is ready, continue to the quotation request with the instrument details already assembled.",
        ar: "عند اكتمال قائمة المنتجات، انتقل إلى طلب عرض السعر مع تفاصيل الأدوات المجمعة مسبقًا."
      }
    }
  ],
  contact: [
    {
      eyebrow: { en: "Contact Rosa", ar: "اتصل بروزا" },
      title: {
        en: "Direct support for product and business enquiries.",
        ar: "دعم مباشر لاستفسارات المنتجات والأعمال."
      },
      copy: {
        en: "Reach Rosa for company, catalogue and procurement-support questions through one clear contact path.",
        ar: "تواصل مع روزا لأسئلة الشركة والكتالوج ودعم المشتريات عبر مسار تواصل واضح."
      }
    },
    {
      eyebrow: { en: "General enquiries", ar: "الاستفسارات العامة" },
      title: {
        en: "Send the context we need to respond clearly.",
        ar: "أرسل التفاصيل التي تساعدنا على الرد بوضوح."
      },
      copy: {
        en: "Use the contact form for general business questions while product quantities and configurations stay in the Inquiry flow.",
        ar: "استخدم نموذج التواصل للأسئلة العامة، مع إبقاء كميات المنتجات وخياراتها ضمن مسار الاستفسار."
      }
    },
    {
      eyebrow: { en: "Professional follow-up", ar: "متابعة مهنية" },
      title: {
        en: "Keep product questions and quotation requests organised.",
        ar: "حافظ على تنظيم أسئلة المنتجات وطلبات عروض الأسعار."
      },
      copy: {
        en: "Clear product references and requirement details help keep follow-up focused for professional buyers and trading partners.",
        ar: "تساعد مراجع المنتجات وتفاصيل المتطلبات الواضحة على إبقاء المتابعة مركزة للمشترين المهنيين وشركاء التجارة."
      }
    },
    {
      eyebrow: { en: "Quotation support", ar: "دعم عروض الأسعار" },
      title: {
        en: "Specific instruments belong in one structured inquiry.",
        ar: "الأدوات المحددة تنتمي إلى استفسار منظم واحد."
      },
      copy: {
        en: "For product codes, options and quantities, build an Inquiry so the complete requirement reaches Rosa together.",
        ar: "لرموز المنتجات وخياراتها وكمياتها، أنشئ استفسارًا حتى تصل المتطلبات كاملة إلى روزا معًا."
      }
    }
  ]
} as const satisfies Record<
  PublicHeroPageKey,
  readonly [PublicHeroCopyRecord, PublicHeroCopyRecord, PublicHeroCopyRecord, PublicHeroCopyRecord]
>;

export function getLocalizedPublicHeroSlides(
  page: PublicHeroPageKey,
  locale: PublicLocale = "en"
): readonly LocalizedPublicHeroSlide[] {
  const key = locale === "ar" ? "ar" : "en";
  const copy = PUBLIC_HERO_COPY[page];

  return PUBLIC_HERO_MEDIA.map((media, index) => {
    const text = copy[index] ?? copy[0];
    return {
      id: media.id,
      media: {
        desktopSrc: media.desktopSrc,
        desktopAvifSrc: media.desktopAvifSrc,
        mobileSrc: media.mobileSrc,
        alt: media.alt[key],
        desktopFocalPoint: media.desktopFocalPoint,
        mobileFocalPoint: media.mobileFocalPoint
      },
      copySide: media.copySide,
      tone: media.tone,
      eyebrow: text.eyebrow[key],
      title: text.title[key],
      copy: text.copy[key]
    };
  });
}
