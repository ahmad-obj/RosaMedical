"use client";

import { useMemo, useState, type ReactElement } from "react";
import type { FamilyCardModel } from "@/features/public-catalogue";
import type { PublicLocale } from "@/features/localization/locales";
import { filterProducts } from "../products-discovery.logic";
import type {
  ProductsDiscoveryItem,
  ProductsDiscoveryState,
  ProductsSort,
  ProductsView
} from "../products-discovery.types";
import { ProductsFilterPanel } from "./products-filter-panel";
import { ProductsResultCard } from "./products-result-card";
import { ProductsResultsToolbar } from "./products-results-toolbar";

export function ProductsDiscoveryWorkspace({
  products,
  families,
  locale
}: {
  products: readonly ProductsDiscoveryItem[];
  families: readonly FamilyCardModel[];
  locale: PublicLocale;
}): ReactElement {
  const ar = locale === "ar";
  const [state, setState] = useState<ProductsDiscoveryState>({
    query: "",
    family: "all",
    sort: "recommended",
    view: "grid"
  });
  const result = useMemo(() => filterProducts(products, state), [products, state]);

  const setSort = (sort: ProductsSort) => setState((current) => ({ ...current, sort }));
  const setView = (view: ProductsView) => setState((current) => ({ ...current, view }));

  return (
    <div className="products-discovery-workspace" data-products-view={state.view}>
      <form className="products-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="products-search-input" className="sr-only">
          {ar ? "ابحث باسم المنتج أو الرمز أو المقاس أو الخيار" : "Search products by name, code, size or option"}
        </label>
        <input
          id="products-search-input"
          type="search"
          value={state.query}
          placeholder={ar ? "ابحث في المنتجات" : "Search products"}
          autoComplete="off"
          onChange={(event) => setState((current) => ({ ...current, query: event.currentTarget.value }))}
        />
        <button type="submit">{ar ? "بحث" : "Search"}</button>
      </form>

      <div className="products-discovery-layout">
        <aside className="products-filter-sidebar" aria-label={ar ? "تصفية المنتجات" : "Product filters"}>
          <ProductsFilterPanel
            family={state.family}
            families={families}
            locale={locale}
            onFamilyChange={(family) => setState((current) => ({ ...current, family }))}
          />
        </aside>

        <details className="products-filter-disclosure">
          <summary>{ar ? "تصفية المنتجات" : "Filter products"}</summary>
          <ProductsFilterPanel
            family={state.family}
            families={families}
            locale={locale}
            onFamilyChange={(family) => setState((current) => ({ ...current, family }))}
          />
        </details>

        <div className="products-results-region">
          <ProductsResultsToolbar
            total={result.total}
            sort={state.sort}
            view={state.view}
            locale={locale}
            onSortChange={setSort}
            onViewChange={setView}
          />

          {result.total > 0 ? (
            <ul className={`products-results products-results--${state.view}`} data-products-results>
              {result.products.map((product) => (
                <li key={product.id}>
                  <ProductsResultCard product={product} view={state.view} locale={locale} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="products-empty-result" role="status">
              <h3>{ar ? "لا توجد منتجات مطابقة." : "No matching products."}</h3>
              <p>{ar ? "جرّب اسمًا أو رمزًا آخر، أو اعرض كل الفئات." : "Try another name or code, or return to all product families."}</p>
              <button
                type="button"
                onClick={() => setState({ query: "", family: "all", sort: "recommended", view: state.view })}
              >
                {ar ? "مسح البحث والتصفية" : "Clear search and filters"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
