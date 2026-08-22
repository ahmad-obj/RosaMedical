# Products Discovery Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/products` into the client-directed search/filter/product-grid workspace backed by the complete public catalogue while exposing only real supported data.

**Architecture:** Server-render the complete catalogue through `getPublicCatalogueProducts()` and map it to client-safe `ProductPreviewModel` records. A single client workspace owns query/family/sort/view state in memory; it performs no second fetch. Product cards link to existing canonical detail routes. Unsupported filters are not rendered. Numeric prices are not invented; cards use localized `Price on request` until a real data contract exists.

**Tech Stack:** Next.js server/client components, React, TypeScript, existing catalogue-live/public-catalogue modules, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Use all active public products, not only featured fixture selections.
- Search real fields: name, code, family, size/variant summary.
- Family/category filter is functional.
- Do not render fake Price/Country of origin/Brand/Delivery Method filter dropdowns.
- No numeric price until a verified source exists; render `Price on request` / `السعر عند الطلب`.
- Default view is grid; list is an alternate presentation of the same records.
- Product card and View Details route to `/products/[family]/[product]`.
- Do not add directly from result cards because size/variant context belongs on Product Detail.
- Desktop uses persistent family filter sidebar; below desktop use native `<details>/<summary>` compact filters.
- No horizontal overflow.
- Keep the old `CatalogueSupport` section temporarily through this subplan; the subsequent catalogue-access subplan replaces it with the five open/download cards. This avoids a circular plan dependency.

---

### Task 1: Add a complete product preview selector

**Files:**
- Modify: `apps/web/src/features/public-catalogue/selectors.ts`
- Modify: `apps/web/src/features/public-catalogue/index.ts`
- Test: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**

```ts
export function selectProductPreviews(
  products: readonly CatalogueProductRecord[]
): readonly ProductPreviewModel[]
```

Localization remains outside this low-level mapper; `products.data.ts` localizes family labels after selection.

- [ ] **Step 1: Write the failing selector tests**

Use two representative `CatalogueProductRecord` values and assert:

```ts
const result = selectProductPreviews(products);
expect(result).toHaveLength(2);
expect(result[0]).toMatchObject({
  id: products[0]!.id,
  slug: products[0]!.slug,
  familySlug: products[0]!.familySlug,
  name: products[0]!.name,
  code: products[0]!.code
});
```

Also assert:

- blank option values are removed;
- repeated option values are deduplicated;
- `mediaPath`, `mediaFallbackPath`, and `mediaIndex` are carried only when present;
- input order is preserved.

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
```

Expected: FAIL because `selectProductPreviews` does not exist.

- [ ] **Step 3: Extract one internal record mapper**

```ts
function toProductPreview(product: CatalogueProductRecord): ProductPreviewModel {
  const optionSummary = uniqueNonEmpty([
    product.sizes[0],
    product.variants[0] ?? product.directions[0]
  ]);

  return {
    id: product.id,
    slug: product.slug,
    familySlug: product.familySlug,
    familyName: familyNameBySlug(product.familySlug),
    name: product.name,
    code: product.code,
    optionSummary,
    ...(product.description ? { description: product.description } : {}),
    imageLabel: product.mediaLabel,
    ...(product.mediaPath ? { mediaPath: product.mediaPath } : {}),
    ...(product.mediaFallbackPath ? { mediaFallbackPath: product.mediaFallbackPath } : {}),
    ...(typeof product.mediaIndex === "number" ? { mediaIndex: product.mediaIndex } : {})
  };
}

export function selectProductPreviews(
  products: readonly CatalogueProductRecord[]
): readonly ProductPreviewModel[] {
  return products.map(toProductPreview);
}
```

Refactor `selectFeaturedProducts` to resolve its fixture subset, then call `toProductPreview` for each resolved product so mapping logic exists once.

- [ ] **Step 4: Run GREEN**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/public-catalogue apps/web/src/test/products-client-redesign.test.tsx
git commit -m "refactor(web): expose complete product preview mapping"
```

### Task 2: Define deterministic search/filter/sort logic

**Files:**
- Create: `apps/web/src/features/products/products-discovery.types.ts`
- Create: `apps/web/src/features/products/products-discovery.logic.ts`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**

```ts
import type { FamilySlug, ProductPreviewModel } from "@/features/public-catalogue";

export type ProductsSort = "recommended" | "name-asc";
export type ProductsView = "grid" | "list";

export interface ProductsDiscoveryState {
  query: string;
  family: FamilySlug | "all";
  sort: ProductsSort;
  view: ProductsView;
}

export interface ProductsDiscoveryResult {
  products: readonly ProductPreviewModel[];
  total: number;
}

export function filterProducts(
  products: readonly ProductPreviewModel[],
  state: ProductsDiscoveryState
): ProductsDiscoveryResult;
```

- [ ] **Step 1: Write failing pure-function tests**

Cover:

1. blank query + `all` + `recommended` preserves input order;
2. query matches name case-insensitively;
3. query matches code;
4. query matches family name;
5. query matches `optionSummary`;
6. family filter matches exact slug;
7. `name-asc` sorts a copy and does not mutate input;
8. surrounding whitespace is ignored.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement filtering**

```ts
function searchableText(product: ProductPreviewModel): string {
  return [
    product.name,
    product.code,
    product.familyName,
    ...product.optionSummary
  ].join(" ").toLocaleLowerCase();
}

export function filterProducts(
  products: readonly ProductPreviewModel[],
  state: ProductsDiscoveryState
): ProductsDiscoveryResult {
  const query = state.query.trim().toLocaleLowerCase();
  let next = products.filter((product) =>
    (state.family === "all" || product.familySlug === state.family) &&
    (!query || searchableText(product).includes(query))
  );

  if (state.sort === "name-asc") {
    next = [...next].sort((a, b) => a.name.localeCompare(b.name));
  }

  return { products: next, total: next.length };
}
```

- [ ] **Step 4: Run GREEN**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/products/products-discovery.types.ts apps/web/src/features/products/products-discovery.logic.ts apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add deterministic Products discovery logic"
```

### Task 3: Feed `/products` from the full public catalogue

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/features/products/products.data.ts`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Add source contract**

```ts
it("uses the complete public catalogue", () => {
  const page = source("src/features/products/products-overview.tsx");
  expect(page).toContain("getPublicCatalogueProducts");
  expect(page).not.toContain("getFeaturedCatalogueProducts");
});
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Replace the server fetch**

```ts
const products = await getPublicCatalogueProducts();
const model = createProductsPageModel(products, locale);
```

- [ ] **Step 4: Replace featured selection in `createProductsPageModel`**

```ts
const previews = selectProductPreviews(products).map((product) =>
  ar ? { ...product, familyName: FAMILY_NAMES_AR[product.familySlug] } : product
);
```

Return `products: previews`.

- [ ] **Step 5: Run GREEN and commit**

```bash
git add apps/web/src/features/products apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): feed Products from full public catalogue"
```

### Task 4: Build discovery controls

**Files:**
- Create: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Create: `apps/web/src/features/products/sections/products-filter-panel.tsx`
- Create: `apps/web/src/features/products/sections/products-results-toolbar.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**

```tsx
export function ProductsDiscoveryWorkspace({
  products,
  families,
  locale
}: {
  products: readonly ProductPreviewModel[];
  families: readonly FamilyCardModel[];
  locale: PublicLocale;
}): ReactElement
```

```tsx
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
}): ReactElement
```

```tsx
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
}): ReactElement
```

- [ ] **Step 1: Write component contracts**

Require:

- one text search input with accessible label;
- family options `all` + five real families;
- only `recommended` and `name-asc` sort options;
- grid/list buttons with `aria-pressed`;
- result count with `aria-live="polite"`;
- no fake filter labels.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement one discovery state**

```ts
const [state, setState] = useState<ProductsDiscoveryState>({
  query: "",
  family: "all",
  sort: "recommended",
  view: "grid"
});
const result = useMemo(() => filterProducts(products, state), [products, state]);
```

Do not add URL-state synchronization in this phase.

- [ ] **Step 4: Implement desktop filter sidebar**

Render family controls only. Use button/radio/select semantics with visible labels and selected state.

- [ ] **Step 5: Implement mobile compact filter using native `<details>`**

```tsx
<details className="products-filter-disclosure">
  <summary>{locale === "ar" ? "تصفية المنتجات" : "Filter products"}</summary>
  <ProductsFilterPanel ... />
</details>
```

No modal/drawer package.

- [ ] **Step 6: Implement result toolbar**

Display localized count, sort `<select>`, and grid/list buttons.

- [ ] **Step 7: Run GREEN and commit**

```bash
git add apps/web/src/features/products/sections apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): build Products discovery controls"
```

### Task 5: Build the result card

**Files:**
- Create: `apps/web/src/features/products/sections/products-result-card.tsx`
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interface:**

```tsx
export function ProductsResultCard({
  product,
  view,
  locale
}: {
  product: ProductPreviewModel;
  view: ProductsView;
  locale: PublicLocale;
}): ReactElement
```

- [ ] **Step 1: Write card contract tests**

Require real media/placeholder behavior, family, name, code, option summary, `Price on request`, canonical `productHref(product)`, and visible View Details. Assert no add-to-inquiry control on the card.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement one semantic card for both views**

```tsx
<article className={`products-result-card products-result-card--${view}`}>
  <LocaleLink className="products-result-card__media" href={productHref(product)}>
    {/* use existing product media rendering primitive */}
  </LocaleLink>
  <div className="products-result-card__body">
    <p className="products-result-card__family">{product.familyName}</p>
    <h3><LocaleLink href={productHref(product)}>{product.name}</LocaleLink></h3>
    <p className="products-result-card__code"><bdi dir="ltr">{product.code}</bdi></p>
    {product.optionSummary.length ? <p>{product.optionSummary.join(" · ")}</p> : null}
    <p className="products-result-card__price">{locale === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
    <LocaleLink className="products-result-card__details" href={productHref(product)}>
      {locale === "ar" ? "عرض التفاصيل" : "View details"}
    </LocaleLink>
  </div>
</article>
```

Use the existing public catalogue product-media primitive already used by `ProductPreviewCard`; do not fork image fallback logic.

- [ ] **Step 4: Run GREEN and commit**

```bash
git add apps/web/src/features/products/sections apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add client-directed product result cards"
```

### Task 6: Add the black Products direct-contact band

**Files:**
- Create: `apps/web/src/features/products/sections/products-direct-contact-band.tsx`
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Add failing contract**

Require centralized `PUBLIC_CONTENT_VALUES`, localized `Get in Touch Now`, WhatsApp action, and email action. Assert the component does not hard-code duplicate contact strings already owned by the central registry.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement the band**

Keep this black band inside Products middle content. It must not replace or hide the shell-level red contact strip.

- [ ] **Step 4: Run GREEN and commit**

```bash
git add apps/web/src/features/products apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add Products direct contact band"
```

### Task 7: Compose the Products page without creating a catalogue-plan dependency

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Stop rendering: `apps/web/src/features/products/sections/discovery-toolbar-shell.tsx`
- Stop rendering: `apps/web/src/features/products/sections/family-index.tsx`
- Stop rendering: `apps/web/src/features/products/sections/product-preview-grid.tsx`
- Keep rendering temporarily: `apps/web/src/features/products/sections/catalogue-support.tsx`
- Keep/reshape: `apps/web/src/features/products/sections/products-procurement-cta.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Add order assertion**

At the end of this subplan the Products middle-content order is exactly:

```text
PublicHeroCarousel(page="products")
ProductsDiscoveryWorkspace
ProductsDirectContactBand
CatalogueSupport        // temporary, replaced by the next subplan
ProductsProcurementCta
```

- [ ] **Step 2: Replace the old discovery/family/featured grid renders**

Do not render both old and new discovery systems.

- [ ] **Step 3: Grep old sections before deleting anything**

```bash
git grep -n "DiscoveryToolbarShell\|FamilyIndex\|ProductPreviewGrid" -- apps/web/src
```

Delete a file only when there is no remaining import/test dependency. Leave `CatalogueSupport` intact until the catalogue-access subplan.

- [ ] **Step 4: Run focused tests and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
git add apps/web/src/features/products apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): compose client Products discovery page"
```

### Task 8: Add responsive Products styling and browser coverage

**Files:**
- Create: `apps/web/src/styles/products-client-redesign.css`
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`
- Create: `apps/web/tests/e2e/products-client-redesign.spec.ts`

- [ ] **Step 1: Add CSS contract**

Require desktop sidebar/result grid, adaptive result columns, list layout, mobile filter disclosure, transform-only image hover, reduced-motion override, and no persistent `will-change`.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement desktop geometry**

```css
.products-discovery-workspace__layout {
  display: grid;
  grid-template-columns: minmax(11rem, 14rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 3rem);
}

.products-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
  gap: clamp(1rem, 1.8vw, 1.5rem);
}
```

At mobile widths hide the persistent sidebar, show the `<details>` filter disclosure, and use one readable result column.

- [ ] **Step 4: Add Playwright tests at 1366 and 390**

At 1366 assert:

- persistent family filter visible;
- result cards remain within viewport;
- search for a known fixture-backed product narrows results;
- name sort changes visible ordering;
- grid/list toggle updates the result-region class/state;
- no horizontal overflow.

At 390 assert:

- desktop filter sidebar hidden;
- compact filter disclosure visible;
- View Details remains tappable;
- no horizontal overflow.

- [ ] **Step 5: Run**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web typecheck
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/styles/products-client-redesign.css apps/web/src/app/globals.css apps/web/src/test/products-client-redesign.test.tsx apps/web/tests/e2e/products-client-redesign.spec.ts
git commit -m "feat(web): finish responsive Products discovery redesign"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web typecheck
```

The subsequent `2026-08-22-products-catalogue-access.md` subplan then replaces temporary `CatalogueSupport` with the five client-directed catalogue open/download cards.
