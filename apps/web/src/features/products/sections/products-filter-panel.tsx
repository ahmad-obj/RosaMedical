import type { ReactElement } from "react";
import type { FamilyCardModel, FamilySlug } from "@/features/public-catalogue";
import type { PublicLocale } from "@/features/localization/locales";

export function ProductsFilterPanel({
  family,
  families,
  locale,
  onFamilyChange
}: {
  family: FamilySlug | "all";
  families: readonly FamilyCardModel[];
  locale: PublicLocale;
  onFamilyChange: (family: FamilySlug | "all") => void;
}): ReactElement {
  const ar = locale === "ar";

  return (
    <fieldset className="products-filter-panel">
      <legend>{ar ? "الفئة" : "Category"}</legend>
      <label className="products-filter-option">
        <input
          type="radio"
          name="products-family"
          value="all"
          checked={family === "all"}
          onChange={() => onFamilyChange("all")}
        />
        <span>{ar ? "كل المنتجات" : "All products"}</span>
      </label>
      {families.map((item) => (
        <label className="products-filter-option" key={item.slug}>
          <input
            type="radio"
            name="products-family"
            value={item.slug}
            checked={family === item.slug}
            onChange={() => onFamilyChange(item.slug)}
          />
          <span>{item.name}</span>
        </label>
      ))}
    </fieldset>
  );
}
