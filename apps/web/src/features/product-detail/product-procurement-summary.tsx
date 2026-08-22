import type { ReactElement } from "react";
import type {
  CatalogueFamilyRecord,
  CatalogueProductRecord
} from "@/features/catalogue-registry";
import type { InquiryItem } from "@/features/inquiry";
import { StaticOptionField } from "./static-option-field";
import { ProductInquiryControls } from "./product-inquiry-controls";
import { ProductPriceState } from "./product-price-state";
import type { PublicLocale } from "@/features/localization/locales";
import { LocaleLink } from "@/features/localization";

export function ProductProcurementSummary({
  family,
  product,
  sizeValue,
  variantValue,
  catalogueReference,
  inquiryItem,
  locale = "en"
}: {
  family: CatalogueFamilyRecord;
  product: CatalogueProductRecord;
  sizeValue: string;
  variantValue: string;
  catalogueReference: string;
  inquiryItem: InquiryItem;
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

      <div className="product-procurement-summary__options">
        <StaticOptionField label={ar ? "المقاس" : "Size"} value={sizeValue} />
        <StaticOptionField label={ar ? "الخيار" : "Variant"} value={variantValue} />
      </div>

      <ProductPriceState locale={locale} />
      <ProductInquiryControls item={inquiryItem} />

      <p className="product-controls-note" id={controlsNoteId}>
        {ar ? "أضف هذه الأداة إلى استفسار عرض السعر ثم راجع الكميات والملاحظات." : "Add this instrument to your quotation inquiry, then review quantities and notes."}
      </p>
      <LocaleLink className="product-catalogue-reference" href="/catalogues">
        {ar ? "مرجع الكتالوج" : "Catalogue reference"}: <bdi dir="ltr">{catalogueReference}</bdi> <span aria-hidden="true">→</span>
      </LocaleLink>
    </section>
  );
}
