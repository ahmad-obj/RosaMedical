"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import type { FamilyCardModel } from "@/features/public-catalogue";
import type { PublicLocale } from "@/features/localization/locales";
import { buildFacetModel } from "../products-facet-model";
import { filterProducts } from "../products-discovery.logic";
import {
  DEFAULT_PRODUCTS_DISCOVERY_STATE,
  discoveryStateFromSearchParams,
  discoveryStateToSearchParams,
  initialProductsVisibleCount,
  nextProductsVisibleCount
} from "../products-discovery-state";
import type {
  ProductsDiscoveryItem,
  ProductsDiscoveryState,
  ProductsSort,
  ProductsView
} from "../products-discovery.types";
import type { ProductsFacetKey } from "../products-facets";
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
  const [state, setState] = useState<ProductsDiscoveryState>(DEFAULT_PRODUCTS_DISCOVERY_STATE);
  const [hasHydratedUrl, setHasHydratedUrl] = useState(false);
  const [batchSize, setBatchSize] = useState(12);
  const [visibleCount, setVisibleCount] = useState(12);
  const result = useMemo(() => filterProducts(products, state), [products, state]);
  const facets = useMemo(() => buildFacetModel(products, state), [products, state]);
  const visibleProducts = result.products.slice(0, visibleCount);
  const remaining = Math.max(0, result.total - visibleProducts.length);

  useEffect(() => {
    const readLocationState = () => {
      const next = discoveryStateFromSearchParams(new URLSearchParams(window.location.search));
      setState(next);
    };
    const compact = window.matchMedia("(max-width: 63.99rem)").matches;
    const initialCount = initialProductsVisibleCount(compact);

    setBatchSize(initialCount);
    setVisibleCount(initialCount);
    readLocationState();
    setHasHydratedUrl(true);
    window.addEventListener("popstate", readLocationState);
    return () => window.removeEventListener("popstate", readLocationState);
  }, []);

  useEffect(() => {
    if (!hasHydratedUrl) return;
    const params = discoveryStateToSearchParams(state);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [hasHydratedUrl, state]);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [
    batchSize,
    state.query,
    state.family,
    state.sizes,
    state.directions,
    state.variants,
    state.codeGroups,
    state.sort,
    state.view
  ]);

  const setSort = (sort: ProductsSort) => setState((current) => ({ ...current, sort }));
  const setView = (view: ProductsView) => setState((current) => ({ ...current, view }));

  const toggleFacet = (facet: ProductsFacetKey, value: string) => {
    setState((current) => {
      const selected = current[facet];
      const exists = selected.some((item) => item.toLocaleLowerCase() === value.toLocaleLowerCase());
      return {
        ...current,
        [facet]: exists
          ? selected.filter((item) => item.toLocaleLowerCase() !== value.toLocaleLowerCase())
          : [...selected, value]
      };
    });
  };

  const clearFilters = () => {
    setState((current) => ({
      ...current,
      family: "all",
      sizes: [],
      directions: [],
      variants: [],
      codeGroups: []
    }));
  };

  const clearSearchAndFilters = () => {
    setState((current) => ({
      ...DEFAULT_PRODUCTS_DISCOVERY_STATE,
      sort: current.sort,
      view: current.view
    }));
  };

  const filterPanelProps = {
    state,
    facets,
    families,
    locale,
    onFamilyChange: (family: ProductsDiscoveryState["family"]) => setState((current) => ({ ...current, family })),
    onFacetToggle: toggleFacet,
    onClear: clearFilters
  } as const;

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
          onChange={(event) => {
            const query = event.currentTarget.value;
            setState((current) => ({ ...current, query }));
          }}
        />
        <button type="submit">{ar ? "بحث" : "Search"}</button>
      </form>

      <div className="products-discovery-layout">
        <aside className="products-filter-sidebar" aria-label={ar ? "تصفية المنتجات" : "Product filters"}>
          <ProductsFilterPanel {...filterPanelProps} />
        </aside>

        <details className="products-filter-disclosure">
          <summary>{ar ? "تصفية المنتجات" : "Filter products"}</summary>
          <ProductsFilterPanel {...filterPanelProps} />
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
            <>
              <ul className={`products-results products-results--${state.view}`} data-products-results>
                {visibleProducts.map((product) => (
                  <li key={product.id}>
                    <ProductsResultCard product={product} view={state.view} locale={locale} />
                  </li>
                ))}
              </ul>

              {remaining > 0 ? (
                <div className="products-results-more">
                  <button
                    type="button"
                    className="products-results-more__button"
                    onClick={() => setVisibleCount((current) => nextProductsVisibleCount(current, result.total, batchSize))}
                  >
                    <span>{ar ? "عرض المزيد من المنتجات" : "See more products"}</span>
                    <small>{ar ? `${remaining} متبقي` : `${remaining} remaining`}</small>
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="products-empty-result" role="status">
              <h3>{ar ? "لا توجد منتجات مطابقة." : "No matching products."}</h3>
              <p>{ar ? "جرّب اسمًا أو رمزًا آخر، أو امسح التصفية الحالية." : "Try another name or code, or clear the current filters."}</p>
              <button type="button" onClick={clearSearchAndFilters}>
                {ar ? "مسح البحث والتصفية" : "Clear search and filters"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
