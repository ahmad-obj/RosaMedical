"use client";

import { useId, useMemo, useState, type ReactElement } from "react";
import type { FamilyCardModel, FamilySlug } from "@/features/public-catalogue";
import type { PublicLocale } from "@/features/localization/locales";
import type {
  ProductsDiscoveryState,
  ProductsFacetModel,
  ProductsFacetOption
} from "../products-discovery.types";
import type { ProductsFacetKey } from "../products-facets";

const COLLAPSED_OPTION_COUNT = 8;
const SEARCHABLE_OPTION_COUNT = 14;

function FacetGroup({
  title,
  searchLabel,
  options,
  facet,
  onToggle
}: {
  title: string;
  searchLabel: string;
  options: readonly ProductsFacetOption[];
  facet: ProductsFacetKey;
  onToggle: (facet: ProductsFacetKey, value: string) => void;
}): ReactElement | null {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? options.filter((option) => option.value.toLocaleLowerCase().includes(normalized))
      : options;
  }, [options, query]);

  if (options.length === 0) return null;

  const searchable = options.length >= SEARCHABLE_OPTION_COUNT;
  const visible = expanded || query
    ? filtered
    : filtered.slice(0, COLLAPSED_OPTION_COUNT);
  const canToggleExpansion = !query && filtered.length > COLLAPSED_OPTION_COUNT;

  return (
    <fieldset className="products-filter-group" data-facet={facet}>
      <legend>{title}</legend>
      {searchable ? (
        <label className="products-filter-search">
          <span className="sr-only">{searchLabel}</span>
          <input
            type="search"
            value={query}
            placeholder={searchLabel}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
      ) : null}

      <div className="products-filter-options">
        {visible.map((option) => (
          <label
            className="products-filter-option"
            data-selected={option.selected ? "true" : "false"}
            data-available={option.available ? "true" : "false"}
            key={option.value}
          >
            <input
              type="checkbox"
              checked={option.selected}
              disabled={!option.available && !option.selected}
              onChange={() => onToggle(facet, option.value)}
            />
            <span className="products-filter-control" aria-hidden="true" />
            <span className="products-filter-option__label">{option.value}</span>
            <span className="products-filter-option__count" aria-hidden="true">{option.count}</span>
          </label>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="products-filter-no-options">No matching options</p>
      ) : null}

      {canToggleExpansion ? (
        <button
          className="products-filter-expand"
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : `Show more (${filtered.length - COLLAPSED_OPTION_COUNT})`}
        </button>
      ) : null}
    </fieldset>
  );
}

export function ProductsFilterPanel({
  state,
  facets,
  families,
  locale,
  onFamilyChange,
  onFacetToggle,
  onClear
}: {
  state: ProductsDiscoveryState;
  facets: ProductsFacetModel;
  families: readonly FamilyCardModel[];
  locale: PublicLocale;
  onFamilyChange: (family: FamilySlug | "all") => void;
  onFacetToggle: (facet: ProductsFacetKey, value: string) => void;
  onClear: () => void;
}): ReactElement {
  const ar = locale === "ar";
  const radioName = `products-family-${useId().replace(/:/g, "")}`;
  const hasFilters = state.family !== "all" || state.sizes.length > 0 || state.directions.length > 0 || state.variants.length > 0 || state.codeGroups.length > 0;

  return (
    <div className="products-filter-panel">
      <div className="products-filter-panel__heading">
        <strong>{ar ? "تصفية المنتجات" : "Filter products"}</strong>
        {hasFilters ? (
          <button type="button" className="products-filter-clear" onClick={onClear}>
            {ar ? "مسح التصفية" : "Clear filters"}
          </button>
        ) : null}
      </div>

      <fieldset className="products-filter-group products-filter-group--family">
        <legend>{ar ? "الفئة" : "Product family"}</legend>
        <label className="products-filter-option" data-selected={state.family === "all" ? "true" : "false"}>
          <input
            type="radio"
            name={radioName}
            value="all"
            checked={state.family === "all"}
            onChange={() => onFamilyChange("all")}
          />
          <span className="products-filter-control" aria-hidden="true" />
          <span className="products-filter-option__label">{ar ? "كل المنتجات" : "All products"}</span>
        </label>
        {families.map((item) => (
          <label className="products-filter-option" data-selected={state.family === item.slug ? "true" : "false"} key={item.slug}>
            <input
              type="radio"
              name={radioName}
              value={item.slug}
              checked={state.family === item.slug}
              onChange={() => onFamilyChange(item.slug)}
            />
            <span className="products-filter-control" aria-hidden="true" />
            <span className="products-filter-option__label">{item.name}</span>
          </label>
        ))}
      </fieldset>

      <FacetGroup
        title={ar ? "المقاس" : "Size"}
        searchLabel={ar ? "ابحث في المقاسات" : "Search sizes"}
        options={facets.sizes}
        facet="sizes"
        onToggle={onFacetToggle}
      />
      <FacetGroup
        title={ar ? "الاتجاه" : "Direction"}
        searchLabel={ar ? "ابحث في الاتجاهات" : "Search directions"}
        options={facets.directions}
        facet="directions"
        onToggle={onFacetToggle}
      />
      <FacetGroup
        title={ar ? "النوع" : "Variant"}
        searchLabel={ar ? "ابحث في الأنواع" : "Search variants"}
        options={facets.variants}
        facet="variants"
        onToggle={onFacetToggle}
      />
      <FacetGroup
        title={ar ? "مجموعة الرموز" : "Code group"}
        searchLabel={ar ? "ابحث في مجموعات الرموز" : "Search code groups"}
        options={facets.codeGroups}
        facet="codeGroups"
        onToggle={onFacetToggle}
      />
    </div>
  );
}
