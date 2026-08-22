import type { ReactElement } from "react";
import type { PublicLocale } from "@/features/localization/locales";

export function ProductPriceState({ locale }: { locale: PublicLocale }): ReactElement {
  const ar = locale === "ar";

  return (
    <div className="product-price-state" aria-label={ar ? "السعر" : "Price"}>
      <span>{ar ? "السعر" : "Price"}</span>
      <strong>{ar ? "عند الطلب" : "On request"}</strong>
    </div>
  );
}
