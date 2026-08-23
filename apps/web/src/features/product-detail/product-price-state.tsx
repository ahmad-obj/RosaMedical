import type { ReactElement } from "react";
import type { PublicLocale } from "@/features/localization/locales";
import { formatSar, type SarAmount } from "@/features/pricing";

export function ProductPriceState({
  amount,
  locale
}: {
  amount: SarAmount | null;
  locale: PublicLocale;
}): ReactElement {
  const ar = locale === "ar";

  return (
    <div className="product-price-state" aria-label={ar ? "السعر" : "Price"} aria-live="polite">
      <span>{ar ? "السعر" : "Price"}</span>
      <strong>{amount ? formatSar(amount, locale) : ar ? "عند الطلب" : "Price on request"}</strong>
    </div>
  );
}
