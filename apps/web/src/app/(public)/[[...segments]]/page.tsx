import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getFamilyListingModel, getProductDetailModel } from "@/features/catalogue-registry";
import { getProductCatalogueContext } from "@/features/catalogue-live";
import {
  resolvePublicPage,
  resolvePublicPageKind
} from "@/features/public-routing/resolve-public-page";
import { FAMILY_NAMES_AR, parseLocaleSegments } from "@/features/localization";

const routeTitles: Record<string, string> = {
  "": "Homepage",
  products: "Products overview",
  catalogues: "Technical catalogues",
  about: "About Rosa",
  "procurement-support": "Procurement support",
  contact: "Contact Rosa",
  search: "Search the catalogue",
  inquiry: "Instrument inquiry",
  "request-quotation": "Request a quotation",
  privacy: "Privacy Policy",
  terms: "Terms"
};

const routeDescriptions: Record<string, string> = {
  "": "Browse Rosa Medical instrument families, products, catalogues, and quotation support.",
  products: "Browse medical instruments by family, product code, size, and listed variant.",
  catalogues: "Review Rosa Medical technical catalogues by instrument family.",
  about: "Learn how Rosa Medical supports structured medical-instrument procurement.",
  "procurement-support": "Prepare a clear instrument requirement and quotation request.",
  contact: "Contact Rosa Medical for catalogue, company, and procurement support.",
  search: "Search the Rosa Medical catalogue by product name, code, family, size, or variant.",
  inquiry: "Review selected instruments, quantities, and requirement notes.",
  "request-quotation": "Submit a structured medical-instrument quotation request.",
  privacy: "How Rosa Medical handles website contact and quotation information.",
  terms: "Terms governing the Rosa Medical catalogue and quotation-request website."
};

const routeTitlesAr: Record<string, string> = {
  "": "روزا ميديكال",
  products: "المنتجات",
  catalogues: "الكتالوجات التقنية",
  about: "من نحن",
  "procurement-support": "دعم المشتريات",
  contact: "اتصل بنا",
  search: "بحث المنتجات",
  inquiry: "الاستفسار",
  "request-quotation": "طلب عرض سعر",
  privacy: "سياسة الخصوصية",
  terms: "شروط الاستخدام"
};

const routeDescriptionsAr: Record<string, string> = {
  "": "استعرض عائلات الأدوات الطبية ومنتجات روزا ميديكال وكتالوجاتها وخدمات طلب عروض الأسعار.",
  products: "استعرض الأدوات الطبية حسب العائلة ورمز المنتج والمقاس والخيار المدرج.",
  catalogues: "راجع كتالوجات روزا ميديكال التقنية حسب عائلة الأدوات.",
  about: "تعرف على كيفية دعم روزا ميديكال لمشتريات الأدوات الطبية المنظمة.",
  "procurement-support": "جهز متطلبات الأدوات وطلب عرض السعر بوضوح.",
  contact: "تواصل مع روزا ميديكال للحصول على دعم الكتالوجات والشركة والمشتريات.",
  search: "ابحث في كتالوج روزا ميديكال بالاسم أو الرمز أو العائلة أو المقاس أو الخيار.",
  inquiry: "راجع الأدوات المحددة والكميات وملاحظات المتطلبات.",
  "request-quotation": "أرسل طلب عرض سعر منظمًا للأدوات الطبية.",
  privacy: "كيفية تعامل روزا ميديكال مع بيانات التواصل وطلبات عروض الأسعار.",
  terms: "الشروط المنظمة لاستخدام كتالوج روزا ميديكال وموقع طلب عروض الأسعار."
};

export async function generateMetadata({ params }: { params: Promise<{ segments?: string[] }> }): Promise<Metadata> {
  const { segments: rawSegments = [] } = await params;
  const { locale, segments } = parseLocaleSegments(rawSegments);
  const key = segments.join("/");
  const kind = resolvePublicPageKind(key);
  if (kind === "not-found") notFound();
  let title = routeTitles[key] ?? "Rosa Medical";
  let description = routeDescriptions[key] ?? "Rosa Medical product catalogue and quotation support.";

  if (kind === "family") {
    const model = getFamilyListingModel(segments[1] ?? "");
    if (model.kind === "family") {
      title = `${model.family.name} instruments`;
      description = model.family.introduction;
    }
  } else if (kind === "product") {
    const model = getProductDetailModel(segments[1] ?? "", segments[2] ?? "");
    if (model.kind === "product") {
      title = `${model.product.name} · ${model.product.code}`;
      description = model.product.description ?? `${model.product.name} product details, code, sizes, and listed options.`;
    }
  }

  if (locale === "ar") {
    title = routeTitlesAr[key] ?? title;
    description = routeDescriptionsAr[key] ?? "كتالوج روزا ميديكال ودعم طلب عروض الأسعار.";

    if (kind === "family") {
      const slug = segments[1] ?? "";
      if (slug in FAMILY_NAMES_AR) {
        const familyName = FAMILY_NAMES_AR[slug as keyof typeof FAMILY_NAMES_AR];
        title = familyName;
        description = `استعرض ${familyName} حسب الرمز والمقاس والخيار المدرج.`;
      }
    } else if (kind === "product") {
      const model = getProductDetailModel(segments[1] ?? "", segments[2] ?? "");
      if (model.kind === "product") {
        title = `${model.product.name} · ${model.product.code}`;
        description = `راجع تفاصيل ${model.product.name} ورمزه ومقاساته وخياراته المدرجة.`;
      }
    }
  }

  const plainPath = key ? `/${key}` : "/";
  const canonical = locale === "ar" ? (plainPath === "/" ? "/ar" : `/ar${plainPath}`) : plainPath;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: plainPath, ar: plainPath === "/" ? "/ar" : `/ar${plainPath}` }
    },
    openGraph: { title, description, url: canonical, locale: locale === "ar" ? "ar_SA" : "en_US" }
  };
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { segments: rawSegments = [] } = await params;
  const { locale, segments } = parseLocaleSegments(rawSegments);
  const queryValue = (await searchParams).q;
  const searchQuery = Array.isArray(queryValue) ? queryValue[0] ?? "" : queryValue ?? "";
  const key = segments.join("/");
  const path = `/${key}`;
  const title = routeTitles[key] ?? (segments.at(-1)?.replaceAll("-", " ") || "Homepage");

  const kind = resolvePublicPageKind(key);
  if (kind === "not-found") notFound();
  if (kind === "family") {
    const familySlug = segments[1] ?? "";
    const localePrefix = locale === "ar" ? "/ar" : "";
    permanentRedirect(`${localePrefix}/products?family=${encodeURIComponent(familySlug)}`);
  }
  if (kind === "product") {
    const products = await getProductCatalogueContext(
      segments[1] ?? "",
      segments[2] ?? ""
    );
    if (!products.length) notFound();
  }
  const page = resolvePublicPage({ key, path, title, searchQuery, locale });
  if (!page) notFound();
  return <div className="public-locale-boundary" data-locale={locale} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>{page}</div>;
}
