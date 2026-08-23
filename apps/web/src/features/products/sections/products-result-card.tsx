import type { ReactElement } from "react";
import {
  ProductMediaPlaceholder,
  productHref
} from "@/features/public-catalogue";
import { LocaleLink } from "@/features/localization";
import type { PublicLocale } from "@/features/localization/locales";
import { formatProductPriceSummary } from "@/features/pricing";
import type { ProductsDiscoveryItem, ProductsView } from "../products-discovery.types";

export function ProductsResultCard({
  product,
  view,
  locale
}: {
  product: ProductsDiscoveryItem;
  view: ProductsView;
  locale: PublicLocale;
}): ReactElement {
  const ar = locale === "ar";
  const href = productHref(product);
  const priceLabel = formatProductPriceSummary(product.priceSummary, locale);

  return (
    <article
      className={`products-result-card products-result-card--${view}`}
      data-product-result={product.id}
      data-family={product.familySlug}
      data-price-state={product.priceSummary.kind}
    >
      <LocaleLink className="products-result-card__media" href={href}>
        <ProductMediaPlaceholder
          label={product.imageLabel}
          decorative
          aspect="landscape"
          src={product.mediaPath}
          fallbackSrc={product.mediaFallbackPath}
          spriteIndex={product.mediaIndex}
        />
      </LocaleLink>
      <div className="products-result-card__body">
        <p className="products-result-card__family">{product.familyName}</p>
        <h3 className="products-result-card__title">
          <LocaleLink href={href}>{product.name}</LocaleLink>
        </h3>
        <p className="products-result-card__code">
          <bdi dir="ltr">{product.code}</bdi>
        </p>
        {product.optionSummary.length > 0 ? (
          <p className="products-result-card__options">{product.optionSummary.join(" · ")}</p>
        ) : null}
        <p className="products-result-card__price">
          <span>{ar ? "السعر" : "Price"}</span>
          <strong>{priceLabel}</strong>
        </p>
        <LocaleLink className="products-result-card__details" href={href}>
          {ar ? "عرض التفاصيل" : "View details"}
          <span aria-hidden="true"> →</span>
        </LocaleLink>
      </div>
    </article>
  );
}
