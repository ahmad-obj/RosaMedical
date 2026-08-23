import type { ReactElement } from "react";
import type { Route } from "next";
import type {
  CatalogueFamilyRecord,
  CatalogueProductRecord
} from "@/features/catalogue-registry";
import { LocaleLink } from "@/features/localization";
import type { PublicLocale } from "@/features/localization/locales";

export function ProductBreadcrumbs({
  family,
  product,
  locale = "en"
}: {
  family: CatalogueFamilyRecord;
  product: CatalogueProductRecord;
  locale?: PublicLocale;
}): ReactElement {
  const familyProductsHref = `/products?family=${encodeURIComponent(family.slug)}` as Route;

  return (
    <nav className="public-breadcrumbs" aria-label="Breadcrumb">
      <LocaleLink href="/products">{locale === "ar" ? "المنتجات" : "Products"}</LocaleLink>
      <span aria-hidden="true">/</span>
      <LocaleLink href={familyProductsHref}>{family.name}</LocaleLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{product.name}</span>
    </nav>
  );
}
