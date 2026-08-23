import type { ReactElement } from "react";
import type {
  CatalogueFamilyRecord,
  CatalogueProductRecord
} from "@/features/catalogue-registry";
import type { PublicLocale } from "@/features/localization/locales";
import { LocaleLink } from "@/features/localization";
import { ProductConfigurationSelector } from "./product-configuration-selector";
import type { ProductConfigurationOption } from "./product-detail.data";

export function ProductProcurementSummary({
  family,
  product,
  catalogueReference,
  configurationOptions,
  locale = "en"
}: {
  family: CatalogueFamilyRecord;
  product: CatalogueProductRecord;
  catalogueReference: string;
  configurationOptions: readonly ProductConfigurationOption[];
  locale?: PublicLocale;
}): ReactElement {
  const ar = locale === "ar";
  const controlsNoteId = `product-controls-${product.id}`;

  return (
    <section className="product-procurement-summary" aria-labelledby="product-title">
      <p className="public-eyebrow">{family.name}</p>
      <h1 id="product-title">{product.name}</h1>
      <strong className="product-procurement-summary__code">{ar ? "رمز المنتج" : "Product code"} <bdi dir="ltr">{product.code}</bdi></strong>
      {product.description ? <p className="product-procurement-summary__description">{product.description}</p> : null}

      <ProductConfigurationSelector
        product={{
          id: product.id,
          familySlug: product.familySlug,
          slug: product.slug,
          name: product.name,
          code: product.code,
          ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
          ...(product.mediaFallbackPath ? { mediaFallbackPath: product.mediaFallbackPath } : {}),
          ...(product.mediaLabel ? { imageLabel: product.mediaLabel } : {})
        }}
        options={configurationOptions}
        locale={locale}
      />

      <p className="product-controls-note" id={controlsNoteId}>
        {ar ? "اختر التهيئة المطلوبة وأضفها إلى استفسار عرض السعر ثم راجع الكميات والملاحظات." : "Choose the exact configuration and add it to your quotation inquiry, then review quantities and notes."}
      </p>
      <LocaleLink className="product-catalogue-reference" href="/catalogues">
        {ar ? "مرجع الكتالوج" : "Catalogue reference"}: <bdi dir="ltr">{catalogueReference}</bdi> <span aria-hidden="true">→</span>
      </LocaleLink>
    </section>
  );
}
