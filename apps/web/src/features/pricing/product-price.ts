import type { CatalogueProductRecord } from "@/features/catalogue-registry";
import type { PublicLocale } from "@/features/localization/locales";
import { formatSar, minSar, type SarAmount } from "./sar-money";

export function effectiveConfigurationPrice(
  basePriceSar: SarAmount | null | undefined,
  overrideSar: SarAmount | null | undefined
): SarAmount | null {
  return overrideSar ?? basePriceSar ?? null;
}

export type ProductPriceSummary =
  | { kind: "on-request" }
  | { kind: "exact"; amount: SarAmount }
  | { kind: "from"; amount: SarAmount; hasUnpricedOptions: boolean };

export function summarizeProductPrice(product: CatalogueProductRecord): ProductPriceSummary {
  const configurations = product.configurations ?? [];

  if (configurations.length === 0) {
    return product.basePriceSar == null
      ? { kind: "on-request" }
      : { kind: "exact", amount: product.basePriceSar };
  }

  const effective = configurations.map((configuration) =>
    effectiveConfigurationPrice(product.basePriceSar, configuration.priceOverrideSar)
  );
  const priced = effective.filter((amount): amount is SarAmount => amount !== null);
  const minimum = minSar(priced);
  if (minimum === null) return { kind: "on-request" };

  const hasUnpricedOptions = effective.some((amount) => amount === null);
  const allPricedEqual = priced.every((amount) => amount === priced[0]);

  if (!hasUnpricedOptions && allPricedEqual) {
    return { kind: "exact", amount: minimum };
  }

  return { kind: "from", amount: minimum, hasUnpricedOptions };
}

export function formatProductPriceSummary(
  summary: ProductPriceSummary,
  locale: PublicLocale
): string {
  const ar = locale === "ar";
  if (summary.kind === "on-request") {
    return ar ? "السعر عند الطلب" : "Price on request";
  }

  const formatted = formatSar(summary.amount, ar ? "ar" : "en");
  if (summary.kind === "exact") return formatted;

  if (ar) {
    return summary.hasUnpricedOptions
      ? `ابتداءً من ${formatted} · بعض الخيارات عند الطلب`
      : `ابتداءً من ${formatted}`;
  }

  return summary.hasUnpricedOptions
    ? `From ${formatted} · some options on request`
    : `From ${formatted}`;
}
