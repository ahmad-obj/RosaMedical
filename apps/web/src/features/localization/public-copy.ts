import { selectFamilyCards } from "@/features/public-catalogue";

export const FAMILY_NAMES_AR = {
  knives: "المشارط والسكاكين الجراحية",
  scissors: "المقصات الجراحية",
  punches: "أدوات الثقب",
  chisels: "الأزاميل الجراحية",
  cutters: "أدوات القطع"
} as const;

const families = selectFamilyCards().map((family) => ({
  ...family,
  name: FAMILY_NAMES_AR[family.slug],
  description: `استعرض مجموعة ${FAMILY_NAMES_AR[family.slug]} حسب الرمز والمقاس والخيار.`
}));

export const HOME_PAGE_MODEL_AR = {
  familyIntro: {
    eyebrow: "عائلات الأدوات",
    title: "استكشف مجموعة أدوات روزا.",
    copy: "خمس عائلات مركزة من الأدوات مقدمة بوضوح لاستعراض المنتجات."
  },
  families,
  procurement: {
    eyebrow: "دعم المشتريات",
    title: "دعم واضح من الكتالوج إلى الاستفسار.",
    copy: "معلومات مباشرة عن المنتجات ومسار عملي من الاستعراض إلى طلب منظم.",
    detailEyebrow: "معلومات منتجات منظمة",
    detailTitle: "دعم مصمم لطريقة عمل المشترين.",
    detailCopy: "استعرض حسب العائلة، وتحقق من رموز المنتجات وخياراتها، ثم اجمع التفاصيل الصحيحة في استفسار واحد منظم.",
    steps: ["ابحث حسب العائلة", "تحقق من الرموز والخيارات", "أنشئ استفسارًا واضحًا"]
  },
  productsIntro: {
    eyebrow: "أدوات مختارة",
    title: "نظرة مركزة على المجموعة.",
    copy: "افتح أي منتج لمراجعة الرموز والمقاسات والخيارات المتاحة."
  },
  catalogue: {
    eyebrow: "الكتالوجات",
    title: "الكتالوجات التقنية.",
    copy: "استعرض كتالوجات عائلات الأدوات الخمس إلى جانب مجموعة المنتجات.",
    items: families.map((family, index) => ({
      number: String(index + 1).padStart(2, "0"),
      slug: family.slug,
      name: family.name,
      media: family.media,
      href: "/catalogues" as const
    }))
  },
  quotation: {
    eyebrow: "طلب عرض سعر",
    title: "جهّز استفسارك عن الأدوات.",
    copy: "أنشئ قائمة منتجات منظمة وأرسل طلبًا واضحًا إلى روزا ميديكال.",
    primary: { label: "اطلب عرض سعر", href: "/request-quotation" as const }
  }
} as const;

export const SHELL_COPY = {
  en: {
    products: "Products", catalogues: "Catalogues", about: "About", contact: "Contact",
    search: "Search", inquiry: "Inquiry", quote: "Request a quote",
    productFamilies: "Product families", company: "Company", support: "Support"
  },
  ar: {
    products: "المنتجات", catalogues: "الكتالوجات", about: "من نحن", contact: "اتصل بنا",
    search: "بحث", inquiry: "الاستفسار", quote: "اطلب عرض سعر",
    productFamilies: "عائلات المنتجات", company: "الشركة", support: "الدعم"
  }
} as const;
