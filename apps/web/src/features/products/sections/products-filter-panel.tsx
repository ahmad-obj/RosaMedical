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

const COLLAPSED_OPTION_COUNT = 5;
const SEARCHABLE_OPTION_COUNT = 14;

function selectedFacetSummary(
  options: readonly ProductsFacetOption[],
  locale: PublicLocale
): string | null {
  const selected = options.filter((option) => option.selected);
  if (selected.length === 0) return null;

  const single = selected[0]?.value ?? "";
  if (selected.length === 1 && single.length <= 20) return single;

  return locale === "ar"
    ? `${selected.length} محدد`
    : `${selected.length} selected`;
}

function FacetGroup({
  title,
  searchLabel,
  options,
  facet,
  locale,
  expanded,
  onExpandedChange,
  onToggle
}: {
  title: string;
  searchLabel: string;
  options: readonly ProductsFacetOption[];
  facet: ProductsFacetKey;
  locale: PublicLocale;
  expanded: boolean;
  onExpandedChange: () => void;
  onToggle: (facet: ProductsFacetKey, value: string) => void;
}): ReactElement | null {
  const id = useId().replace(/:/g, "");
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? options.filter((option) => option.value.toLocaleLowerCase().includes(normalized))
      : options;
  }, [options, query]);

  if (options.length === 0) return null;

  const searchable = options.length >= SEARCHABLE_OPTION_COUNT;
  const selectedSummary = selectedFacetSummary(options, locale);
  const initialValues = new Set(filtered.slice(0, COLLAPSED_OPTION_COUNT).map((option) => option.value));
  const visible = showAll || query
    ? filtered
    : filtered.filter((option) => initialValues.has(option.value) || option.selected);
  const canToggleExpansion = !query && filtered.length > COLLAPSED_OPTION_COUNT;
  const triggerId = `products-filter-${facet}-${id}`;
  const panelId = `${triggerId}-panel`;

  return (
    <section
      className="products-filter-accordion"
      data-facet={facet}
      data-expanded={expanded ? "true" : "false"}
    >
      <button
        id={triggerId}
        className="products-filter-accordion__trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onExpandedChange}
      >
        <span className="products-filter-accordion__title">{title}</span>
        {selectedSummary ? (
          <span className="products-filter-accordion__summary">{selectedSummary}</span>
        ) : null}
        <span className="products-filter-accordion__chevron" aria-hidden="true" />
      </button>

      {expanded ? (
        <div
          id={panelId}
          className="products-filter-accordion__panel"
          role="group"
          aria-labelledby={triggerId}
        >
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
              onClick={() => setShowAll((value) => !value)}
              aria-expanded={showAll}
            >
              {showAll
                ? (locale === "ar" ? "عرض أقل" : "Show less")
                : (locale === "ar" ? `عرض الكل (${filtered.length})` : `Show all (${filtered.length})`)}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
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
  const [openFacet, setOpenFacet] = useState<ProductsFacetKey | null>(null);
  const hasFilters = state.family !== "all" || state.sizes.length > 0 || state.directions.length > 0 || state.variants.length > 0 || state.codeGroups.length > 0;

  const advancedFacets = [
    {
      facet: "sizes" as const,
      title: ar ? "المقاس" : "Size",
      searchLabel: ar ? "ابحث في المقاسات" : "Search sizes",
      options: facets.sizes
    },
    {
      facet: "directions" as const,
      title: ar ? "الاتجاه" : "Direction",
      searchLabel: ar ? "ابحث في الاتجاهات" : "Search directions",
      options: facets.directions
    },
    {
      facet: "variants" as const,
      title: ar ? "النوع" : "Variant",
      searchLabel: ar ? "ابحث في الأنواع" : "Search variants",
      options: facets.variants
    },
    {
      facet: "codeGroups" as const,
      title: ar ? "مجموعة الرموز" : "Code group",
      searchLabel: ar ? "ابحث في مجموعات الرموز" : "Search code groups",
      options: facets.codeGroups
    }
  ];

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

      <div className="products-filter-advanced">
        {advancedFacets.map((item) => (
          <FacetGroup
            key={item.facet}
            {...item}
            locale={locale}
            expanded={openFacet === item.facet}
            onExpandedChange={() => setOpenFacet((current) => current === item.facet ? null : item.facet)}
            onToggle={onFacetToggle}
          />
        ))}
      </div>
    </div>
  );
}
