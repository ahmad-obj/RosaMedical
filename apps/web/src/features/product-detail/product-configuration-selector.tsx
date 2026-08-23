"use client";

import { useMemo, useState } from "react";
import { createInquiryLineId, type InquiryItem } from "@/features/inquiry";
import type { PublicLocale } from "@/features/localization/locales";
import type { ProductConfigurationOption } from "./product-detail.data";
import { ProductInquiryControls } from "./product-inquiry-controls";
import { ProductPriceState } from "./product-price-state";

interface ProductInquirySnapshot {
  id: string;
  familySlug: string;
  slug: string;
  name: string;
  code: string;
  mediaPath?: string;
  mediaFallbackPath?: string;
  imageLabel?: string;
}

function optionLabel(option: ProductConfigurationOption): string {
  return [option.sku, option.size, option.variantType]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" · ");
}

export function ProductConfigurationSelector({
  product,
  options,
  locale
}: {
  product: ProductInquirySnapshot;
  options: readonly ProductConfigurationOption[];
  locale: PublicLocale;
}) {
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "");
  const selected = useMemo(
    () => options.find((option) => option.id === selectedId) ?? options[0],
    [options, selectedId]
  );
  const ar = locale === "ar";

  if (!selected) return null;

  const item: InquiryItem = {
    lineId: createInquiryLineId(product.id, selected.id),
    id: product.id,
    familySlug: product.familySlug,
    slug: product.slug,
    name: product.name,
    code: product.code,
    configurationId: selected.id,
    sku: selected.sku || product.code,
    size: selected.size || (ar ? "كما هو مدرج" : "As listed"),
    variant: selected.variantType || (ar ? "كما هو مدرج" : "As listed"),
    quantity: 1,
    notes: "",
    unitPriceSar: selected.effectivePriceSar,
    currency: "SAR",
    ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
    ...(product.mediaFallbackPath ? { mediaFallbackPath: product.mediaFallbackPath } : {}),
    ...(product.imageLabel ? { imageLabel: product.imageLabel } : {})
  };

  return (
    <div className="product-configuration-selector">
      {options.length > 1 ? (
        <label className="product-configuration-selector__field" htmlFor={`product-configuration-${product.id}`}>
          <span>{ar ? "التهيئة / الرمز" : "Configuration / SKU"}</span>
          <select
            id={`product-configuration-${product.id}`}
            value={selected.id}
            onChange={(event) => setSelectedId(event.currentTarget.value)}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>{optionLabel(option)}</option>
            ))}
          </select>
        </label>
      ) : (
        <dl className="product-configuration-selector__static" aria-label={ar ? "تهيئة المنتج" : "Product configuration"}>
          <div><dt>{ar ? "الرمز" : "SKU"}</dt><dd><bdi dir="ltr">{selected.sku || product.code}</bdi></dd></div>
          {selected.size ? <div><dt>{ar ? "المقاس" : "Size"}</dt><dd>{selected.size}</dd></div> : null}
          {selected.variantType ? <div><dt>{ar ? "النوع" : "Type"}</dt><dd>{selected.variantType}</dd></div> : null}
        </dl>
      )}

      <ProductPriceState amount={selected.effectivePriceSar} locale={locale} />
      <ProductInquiryControls key={item.lineId} item={item} />
    </div>
  );
}
