import type { ReactElement } from "react";
import type { PublicLocale } from "@/features/localization/locales";
import type { ProductsSort, ProductsView } from "../products-discovery.types";

export function ProductsResultsToolbar({
  total,
  sort,
  view,
  locale,
  onSortChange,
  onViewChange
}: {
  total: number;
  sort: ProductsSort;
  view: ProductsView;
  locale: PublicLocale;
  onSortChange: (sort: ProductsSort) => void;
  onViewChange: (view: ProductsView) => void;
}): ReactElement {
  const ar = locale === "ar";

  return (
    <div className="products-results-toolbar">
      <p className="products-results-toolbar__count" aria-live="polite">
        {ar ? `${total} منتج` : `${total} products`}
      </p>
      <div className="products-results-toolbar__actions">
        <label className="products-sort-control">
          <span>{ar ? "الترتيب" : "Sort"}</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.currentTarget.value as ProductsSort)}
          >
            <option value="recommended">{ar ? "موصى به" : "Recommended"}</option>
            <option value="name-asc">{ar ? "الاسم أ–ي" : "Name A–Z"}</option>
          </select>
        </label>
        <div className="products-view-toggle" role="group" aria-label={ar ? "طريقة عرض المنتجات" : "Product view"}>
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
          >
            <span aria-hidden="true">▦</span>
            <span className="sr-only">{ar ? "عرض شبكي" : "Grid view"}</span>
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <span aria-hidden="true">☰</span>
            <span className="sr-only">{ar ? "عرض قائمة" : "List view"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
