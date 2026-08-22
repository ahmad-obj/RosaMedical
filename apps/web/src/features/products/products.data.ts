import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import { selectFamilyCards, selectProductPreviews } from "@/features/public-catalogue";
import type { PublicLocale } from "@/features/localization/locales";
import type { Route } from "next";
import { FAMILY_NAMES_AR } from "@/features/localization/public-copy";
import type { FamilyCardModel } from "@/features/public-catalogue";
import type { ProductsDiscoveryItem } from "./products-discovery.types";

const families = selectFamilyCards();
const familiesAr = families.map((family) => ({
  ...family,
  name: FAMILY_NAMES_AR[family.slug]
}));

const PRODUCTS_PAGE_COPY = {
  en: {
    discovery: {
      searchLabel: "Search products by name, code, size or option"
    },
    familyIntro: {
      eyebrow: "Medical devices",
      title: "Find the right instrument."
    },
    productsIntro: {
      eyebrow: "Product catalogue",
      title: "Medical Devices",
      copy: "Search the complete Rosa catalogue, narrow by instrument family and open the exact product before adding it to your quotation inquiry."
    },
    catalogue: {
      eyebrow: "Technical catalogues",
      title: "Product Categories",
      copy: "Open a family catalogue for document-led review."
    },
    procurement: {
      eyebrow: "Request a quotation",
      title: "Prepare your instruments inquiry",
      copy: "Build a structured product list and send one clear request to Rosa Medical.",
      primary: { label: "Request a Quote", href: "/request-quotation" as const }
    }
  },
  ar: {
    discovery: {
      searchLabel: "ابحث باسم المنتج أو الرمز أو المقاس أو الخيار"
    },
    familyIntro: {
      eyebrow: "الأدوات الطبية",
      title: "اعثر على الأداة المناسبة."
    },
    productsIntro: {
      eyebrow: "كتالوج المنتجات",
      title: "الأجهزة والأدوات الطبية",
      copy: "ابحث في كتالوج روزا الكامل وحدد عائلة الأدوات ثم افتح المنتج المطلوب قبل إضافته إلى استفسار عرض السعر."
    },
    catalogue: {
      eyebrow: "الكتالوجات التقنية",
      title: "فئات المنتجات",
      copy: "افتح كتالوج العائلة للمراجعة المباشرة عبر الوثيقة."
    },
    procurement: {
      eyebrow: "طلب عرض سعر",
      title: "جهّز استفسار الأدوات",
      copy: "أنشئ قائمة منتجات منظمة وأرسل طلبًا واضحًا واحدًا إلى روزا ميديكال.",
      primary: { label: "اطلب عرض سعر", href: "/request-quotation" as const }
    }
  }
} as const;

function uniqueSearchTerms(values: readonly (string | undefined)[]): readonly string[] {
  const result: string[] = [];
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized && !result.includes(normalized)) result.push(normalized);
  }
  return result;
}

export function createProductsDiscoveryItems(
  products: readonly CatalogueProductRecord[],
  locale: PublicLocale
): readonly ProductsDiscoveryItem[] {
  const ar = locale === "ar";
  const previews = selectProductPreviews(products);

  return previews.map((preview, index): ProductsDiscoveryItem => {
    const sourceProduct = products[index];
    if (!sourceProduct) {
      throw new Error(`Products discovery source mismatch at index ${index}.`);
    }

    const familyName = ar ? FAMILY_NAMES_AR[preview.familySlug] : preview.familyName;
    const localizedName = ar && sourceProduct.nameAr?.trim()
      ? sourceProduct.nameAr.trim()
      : preview.name;

    return {
      ...preview,
      name: localizedName,
      familyName,
      searchTerms: uniqueSearchTerms([
        localizedName,
        preview.name,
        preview.code,
        familyName,
        ...sourceProduct.sizes,
        ...sourceProduct.variants,
        ...sourceProduct.directions,
        ...(sourceProduct.catalogueCodes ?? []).flatMap((entry) => [entry.code, entry.size])
      ])
    };
  });
}

export function createProductsPageModel(
  products: readonly CatalogueProductRecord[],
  locale: PublicLocale = "en"
): ProductsPageModel {
  const ar = locale === "ar";
  const copy = PRODUCTS_PAGE_COPY[locale];
  const localizedFamilies = ar ? familiesAr : families;
  const discoveryProducts = createProductsDiscoveryItems(products, locale);

  return {
    discovery: copy.discovery,
    familyIntro: copy.familyIntro,
    families: localizedFamilies,
    productsIntro: copy.productsIntro,
    products: discoveryProducts,
    catalogue: {
      ...copy.catalogue,
      items: localizedFamilies.map((family, index) => ({
        number: String(index + 1).padStart(2, "0"),
        name: family.name,
        href: "/catalogues" as const
      }))
    },
    procurement: copy.procurement
  };
}

export interface ProductsDiscoveryModel {
  searchLabel: string;
}
export interface ProductsFamilyIntroModel { eyebrow: string; title: string }
export interface ProductsIntroModel { eyebrow: string; title: string; copy: string }
export interface ProductsCatalogueModel { eyebrow: string; title: string; copy: string; items: readonly { number: string; name: string; href: Route<string> }[] }
export interface ProductsProcurementModel { eyebrow: string; title: string; copy: string; primary: { label: string; href: Route<string> } }

export interface ProductsPageModel {
  discovery: ProductsDiscoveryModel;
  familyIntro: ProductsFamilyIntroModel;
  families: readonly FamilyCardModel[];
  productsIntro: ProductsIntroModel;
  products: readonly ProductsDiscoveryItem[];
  catalogue: ProductsCatalogueModel;
  procurement: ProductsProcurementModel;
}
