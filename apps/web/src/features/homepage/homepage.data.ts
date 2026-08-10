import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import {
  FAMILY_SLUGS,
  familyNameBySlug,
  selectFamilyCards,
  selectFeaturedProducts,
  type FamilySlug,
  type PublicMediaModel
} from "@/features/public-catalogue";
import { HOME_CATALOGUE_MEDIA_BY_SLUG } from "@/features/public-media";
import {
  FAMILY_NAMES_AR,
  HOME_PAGE_MODEL_AR
} from "@/features/localization/public-copy";
import type { PublicLocale } from "@/features/localization/locales";
import type { Route } from "next";

const families = selectFamilyCards();

export const HOME_PAGE_MODEL = {
  familyIntro: {
    eyebrow: "Instrument families",
    title: "Explore the ROSA instrument range.",
    copy: "Five focused instrument families presented clearly for product browsing."
  },
  families,
  procurement: {
    eyebrow: "Procurement support",
    title: "Clear support from catalogue to inquiry.",
    copy: "Straightforward product information and a practical path from browsing to a structured request.",
    detailEyebrow: "Structured product information",
    detailTitle: "Support built around the way buyers work.",
    detailCopy: "Browse by family, confirm product codes and variants, then carry the right details into one organised inquiry.",
    steps: ["Find by family", "Confirm codes and variants", "Build one clear inquiry"]
  },
  productsIntro: {
    eyebrow: "Selected instruments",
    title: "A focused view of the range.",
    copy: "Open any product for codes, sizes and available configurations."
  },
  catalogue: {
    eyebrow: "Catalogues",
    title: "Technical catalogues.",
    copy: "Browse the five instrument-family catalogues alongside the product range.",
    items: FAMILY_SLUGS.map((slug, index) => ({
      number: String(index + 1).padStart(2, "0"),
      slug,
      name: familyNameBySlug(slug),
      media: HOME_CATALOGUE_MEDIA_BY_SLUG[slug],
      href: "/catalogues" as const
    }))
  },
  quotation: {
    eyebrow: "Request a quotation",
    title: "Prepare your instrument inquiry.",
    copy: "Build a structured product list and send one clear request to Rosa Medical.",
    primary: { label: "Request a Quote", href: "/request-quotation" as const }
  }
} as const;

export function createHomePageModel(
  products: readonly CatalogueProductRecord[],
  locale: PublicLocale = "en"
) {
  const featured = selectFeaturedProducts(products);
  if (locale === "ar") {
    return {
      ...HOME_PAGE_MODEL_AR,
      products: featured.map((product) => ({
        ...product,
        familyName: FAMILY_NAMES_AR[product.familySlug]
      }))
    } as const;
  }

  return {
    ...HOME_PAGE_MODEL,
    products: featured
  } as const;
}

export interface HomeFamilyIntroModel { eyebrow: string; title: string; copy: string }
export interface HomeProcurementModel { eyebrow: string; title: string; copy: string; detailEyebrow: string; detailTitle: string; detailCopy: string; steps: readonly string[] }
export interface HomeProductsIntroModel { eyebrow: string; title: string; copy: string }
export interface HomeCatalogueModel { eyebrow: string; title: string; copy: string; items: readonly { number: string; slug: FamilySlug; name: string; media: PublicMediaModel; href: Route<string> }[] }
export interface HomeQuotationModel { eyebrow: string; title: string; copy: string; primary: { label: string; href: Route<string> } }
