"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement
} from "react";
import type { FamilyCardModel } from "@/features/public-catalogue";
import type { PublicLocale } from "@/features/localization/locales";
import { buildFacetModel } from "../products-facet-model";
import { filterProducts } from "../products-discovery.logic";
import {
  DEFAULT_PRODUCTS_DISCOVERY_STATE,
  discoveryStateFromSearchParams,
  discoveryStateToSearchParams
} from "../products-discovery-state";
import {
  alignProductsVisibleCount,
  initialProductsVisibleCount,
  nextProductsVisibleCount
} from "../products-result-reveal";
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

const DEFAULT_GRID_COLUMNS = 4;

function measuredGridColumns(list: HTMLUListElement): number {
  const items = Array.from(list.children) as HTMLElement[];
  if (items.length === 0) return DEFAULT_GRID_COLUMNS;

  const firstTop = items[0]!.getBoundingClientRect().top;
  let columns = 0;
  for (const item of items) {
    if (Math.abs(item.getBoundingClientRect().top - firstTop) >= 1) break;
    columns += 1;
  }
  return Math.max(1, columns);
}

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
  const [gridColumns, setGridColumns] = useState(DEFAULT_GRID_COLUMNS);
  const gridColumnsRef = useRef(DEFAULT_GRID_COLUMNS);
  const hasMeasuredGridRef = useRef(false);
  const resultsRef = useRef<HTMLUListElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(() =>
    initialProductsVisibleCount(DEFAULT_GRID_COLUMNS, "grid")
  );
  const result = useMemo(() => filterProducts(products, state), [products, state]);
  const facets = useMemo(() => buildFacetModel(products, state), [products, state]);
  const visibleProducts = result.products.slice(0, visibleCount);
  const remaining = Math.max(0, result.total - visibleProducts.length);
  const nextVisibleTarget = nextProductsVisibleCount(
    visibleProducts.length,
    result.total,
    gridColumns,
    state.view
  );
  const nextBatchCount = Math.max(0, nextVisibleTarget - visibleProducts.length);

  useEffect(() => {
    const readLocationState = () => {
      const next = discoveryStateFromSearchParams(new URLSearchParams(window.location.search));
      setState(next);
    };

    readLocationState();
    setHasHydratedUrl(true);
    window.addEventListener("popstate", readLocationState);
    return () => window.removeEventListener("popstate", readLocationState);
  }, []);

  useEffect(() => {
    gridColumnsRef.current = gridColumns;
  }, [gridColumns]);

  useEffect(() => {
    if (!hasHydratedUrl) return;
    const params = discoveryStateToSearchParams(state);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [hasHydratedUrl, state]);

  useEffect(() => {
    setVisibleCount(initialProductsVisibleCount(gridColumnsRef.current, state.view));
  }, [
    state.query,
    state.family,
    state.sizes,
    state.directions,
    state.variants,
    state.codeGroups,
    state.view
  ]);

  useEffect(() => {
    setVisibleCount((current) => {
      const minimum = initialProductsVisibleCount(gridColumns, state.view);
      return alignProductsVisibleCount(
        Math.max(current, minimum),
        result.total,
        gridColumns,
        state.view
      );
    });
  }, [gridColumns, result.total, state.view]);

  useLayoutEffect(() => {
    if (state.view !== "grid") return;
    const list = resultsRef.current;
    if (!list) return;

    const measure = () => {
      const columns = measuredGridColumns(list);
      const firstMeasurement = !hasMeasuredGridRef.current;
      hasMeasuredGridRef.current = true;
      gridColumnsRef.current = columns;
      setGridColumns((current) => current === columns ? current : columns);

      if (firstMeasurement) {
        setVisibleCount(initialProductsVisibleCount(columns, "grid"));
      }
    };

    measure();
    window.addEventListener("resize", measure);

    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(measure);
    observer?.observe(list);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [state.view, visibleProducts.length]);

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
              <ul
                ref={resultsRef}
                className={`products-results products-results--${state.view}`}
                data-products-results
                data-products-columns={state.view === "grid" ? gridColumns : 1}
              >
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
                    onClick={() => setVisibleCount(nextVisibleTarget)}
                  >
                    <span>{ar ? "عرض المزيد من المنتجات" : "See more products"}</span>
                    <small>
                      {ar
                        ? `${nextBatchCount} إضافية · ${remaining} متبقي`
                        : `${nextBatchCount} more · ${remaining} remaining`}
                    </small>
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
