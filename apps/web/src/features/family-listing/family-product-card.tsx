import Link from "next/link";
import type { ReactElement } from "react";
import type {
  CatalogueFamilyRecord,
  CatalogueProductRecord
} from "@/features/catalogue-registry";
import {
  ProductMediaPlaceholder,
  productHref
} from "@/features/public-catalogue";

export function FamilyProductCard({
  family,
  product
}: {
  family: CatalogueFamilyRecord;
  product: CatalogueProductRecord;
}): ReactElement {
  return (
    <article className="family-product-card" data-product-card={product.id}>
      <ProductMediaPlaceholder
        label={product.mediaLabel}
        decorative
        src={product.mediaPath}
      />
      <div className="family-product-card__body">
        <p className="public-eyebrow">{family.name}</p>
        <h2>{product.name}</h2>
        <p className="family-product-card__meta">
          {product.code}{product.primaryOption ? ` · ${product.primaryOption}` : ""}
        </p>
        <div className="family-product-card__actions">
          <Link href={productHref(product)}>View details <span aria-hidden="true">→</span></Link>
          <span className="disabled-text-action" aria-disabled="true">
            Add to inquiry — available next phase
          </span>
        </div>
      </div>
    </article>
  );
}
