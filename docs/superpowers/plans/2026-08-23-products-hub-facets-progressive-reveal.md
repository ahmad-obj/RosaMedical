# Products Hub Facets + Progressive Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/products` the single robust discovery workspace with crash-free search, URL-backed contextual facets, deterministic ROSA-red controls, progressive result disclosure, family-route redirects and no Product Detail recommendations.

**Architecture:** Keep the entire public catalogue loaded once by `ProductsOverview`, enrich `ProductsDiscoveryItem` with normalized facet/search metadata, and keep filtering as pure memoizable selectors. UI state synchronizes with query parameters without server refetch on each interaction. Family URLs redirect into that same state model.

**Tech Stack:** React client state, Next navigation/search params, TypeScript, Vitest, Playwright, existing public catalogue/live projection.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- `/products` is the only family/product discovery UI.
- Product Detail routes remain canonical.
- Family, Size, Direction, Variant and Code group facets use only real catalogue data.
- Family is single-select; other facets are multi-select.
- OR within one facet, AND across facets/search.
- Large facet lists use controlled disclosure/search rather than dumping all values.
- Search/filter/sort changes reset visible batch count.
- No fake country/origin/brand/delivery filters.
- No Related Products section.

---

### Task 1: Expand discovery types into a real facet/state contract

**Files:**
- Modify: `apps/web/src/features/products/products-discovery.types.ts`
- Modify: `apps/web/src/features/products/products.data.ts`
- Test: create `apps/web/src/test/products-discovery-facets.test.ts`

**Interfaces:**
- Produces the following stable contract for later tasks:

```ts
export type ProductsFacetKey = "size" | "direction" | "variant" | "codeGroup";

export interface ProductsDiscoveryItem extends ProductPreviewModel {
  searchTerms: readonly string[];
  facetValues: {
    sizes: readonly string[];
    directions: readonly string[];
    variants: readonly string[];
    codeGroups: readonly string[];
  };
}

export interface ProductsDiscoveryState {
  query: string;
  family: FamilySlug | "all";
  sizes: readonly string[];
  directions: readonly string[];
  variants: readonly string[];
  codeGroups: readonly string[];
  sort: ProductsSort;
  view: ProductsView;
}
```

- [ ] **Step 1: Write failing data-model tests**

Use representative products and assert:

- all sizes preserved;
- all variants preserved;
- all directions preserved;
- code groups derived from real product/catalogue codes;
- search terms include non-first SKU/size values.

- [ ] **Step 2: Define `deriveCodeGroup(code: string): string | null`**

Put it in a focused helper file if `products.data.ts` would become overloaded:

`apps/web/src/features/products/products-facets.ts`

Rules:

- trim whitespace;
- recognize Rosa numeric-hyphen code families;
- return a stable group label/prefix;
- return null for malformed/blank values;
- never mutate actual code.

Unit-test representative codes before using it in model creation.

- [ ] **Step 3: Populate facet values in `createProductsDiscoveryItems`**

Use unique normalized values from the authoritative `CatalogueProductRecord` including catalogue codes.

- [ ] **Step 4: Run focused test**

```bash
pnpm --filter @rosa/web test -- src/test/products-discovery-facets.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/products apps/web/src/test/products-discovery-facets.test.ts
git commit -m "refactor(products): model contextual product facets"
```

---

### Task 2: Replace family-only filtering with pure faceted selectors

**Files:**
- Modify: `apps/web/src/features/products/products-discovery.logic.ts`
- Create if needed: `apps/web/src/features/products/products-facet-model.ts`
- Test: `apps/web/src/test/products-discovery-facets.test.ts`

**Interfaces:**
- Produces:

```ts
filterProducts(products, state): ProductsDiscoveryResult
buildFacetModel(products, state): ProductsFacetModel
compareProductSizes(a, b): number
```

Facet model shape:

```ts
interface ProductsFacetOption {
  value: string;
  count: number;
  selected: boolean;
  available: boolean;
}

interface ProductsFacetModel {
  sizes: readonly ProductsFacetOption[];
  directions: readonly ProductsFacetOption[];
  variants: readonly ProductsFacetOption[];
  codeGroups: readonly ProductsFacetOption[];
}
```

- [ ] **Step 1: Write failing selector matrix**

Tests must cover:

```text
family only
size only
direction only
variant only
code group only
query + family
family + size + direction
multiple sizes => OR
size + variant => AND
selected option with zero contextual count remains represented
Clear => original result count
```

- [ ] **Step 2: Implement one shared set-intersection matcher**

For a multi facet:

```ts
function matchesAny(productValues: readonly string[], selected: readonly string[]) {
  if (!selected.length) return true;
  const values = new Set(productValues.map(normalizeFacetValue));
  return selected.some((value) => values.has(normalizeFacetValue(value)));
}
```

Do not duplicate matching logic per facet.

- [ ] **Step 3: Implement contextual counts correctly**

When building one facet's available choices, apply all other active constraints but omit that facet's own selected values from the context calculation. This produces useful counts without circularly eliminating alternatives inside the same facet.

- [ ] **Step 4: Implement numeric-aware size sort**

Tests:

```text
1.0 mm < 1.5 mm < 2.0 mm < 4 mm
8.0 cm < 16.5 cm < 28.0 cm
```

Unknown labels fall back to locale string order.

- [ ] **Step 5: Run focused selectors**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/products/products-discovery.logic.ts apps/web/src/features/products/products-facet-model.ts apps/web/src/test/products-discovery-facets.test.ts
git commit -m "feat(products): add contextual faceted filtering"
```

---

### Task 3: Fix search crash and lock it with behavior tests

**Files:**
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Test: create/update component test `apps/web/src/test/products-discovery-workspace.test.tsx`
- Browser: `apps/web/tests/e2e/products-search-and-filters.spec.ts`

**Interfaces:**
- Consumes the expanded `ProductsDiscoveryState`.

- [ ] **Step 1: Write a test that actually types**

Mount/render the workspace and execute a user-like input change to `products-search-input`.

Browser test:

```ts
await page.goto("/products")
await page.getByRole("searchbox").fill("iris")
await expect(page.locator("text=Something went wrong")).toHaveCount(0)
await expect(page.locator("[data-products-results]")).toBeVisible()
```

- [ ] **Step 2: Verify current behavior fails or reproduces error**

- [ ] **Step 3: Capture event value synchronously**

Required form:

```tsx
onChange={(event) => {
  const query = event.currentTarget.value;
  setState((current) => ({ ...current, query }));
}}
```

- [ ] **Step 4: Test representative queries**

Browser/unit checks for name, exact item code, non-first SKU, size and direction.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/products/sections/products-discovery-workspace.tsx apps/web/src/test/products-discovery-workspace.test.tsx apps/web/tests/e2e/products-search-and-filters.spec.ts
git commit -m "fix(products): make catalogue search input stable"
```

---

### Task 4: Implement URL-backed discovery state

**Files:**
- Create: `apps/web/src/features/products/products-discovery-url.ts`
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Modify: `apps/web/src/features/products/products-overview.tsx` if initial search-param model is passed server-side
- Test: `apps/web/src/test/products-discovery-url.test.ts`
- Browser: `apps/web/tests/e2e/products-search-and-filters.spec.ts`

**Interfaces:**
- Produces:

```ts
parseProductsDiscoverySearchParams(params: URLSearchParams): Partial<ProductsDiscoveryState>
serializeProductsDiscoveryState(state: ProductsDiscoveryState): URLSearchParams
```

- [ ] **Step 1: Write round-trip tests**

Include all keys:

```text
q
family
size
direction
variant
codeGroup
sort
view
```

Invalid family/sort/view values are ignored.

- [ ] **Step 2: Pick and lock multi-value encoding**

Use repeated params for clarity:

```text
?size=14%20cm&size=16%20cm&direction=Straight
```

Serialize in deterministic order so URLs/tests remain stable.

- [ ] **Step 3: Hydrate workspace state from `useSearchParams()`**

Use `useRouter()` + `usePathname()` to replace the current query string without full page reload.

Do not refetch catalogue data on every facet click.

- [ ] **Step 4: Handle browser Back/Forward**

When `searchParams` changes externally, reconcile state from the URL without creating an infinite replace loop.

- [ ] **Step 5: Run URL unit/browser tests**

Refresh `/products?family=cutters&direction=Straight` and verify UI state/results.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/products/products-discovery-url.ts apps/web/src/features/products/sections/products-discovery-workspace.tsx apps/web/src/test/products-discovery-url.test.ts apps/web/tests/e2e/products-search-and-filters.spec.ts
git commit -m "feat(products): persist discovery filters in URL"
```

---

### Task 5: Build master-quality desktop/mobile filter UI

**Files:**
- Rewrite/expand: `apps/web/src/features/products/sections/products-filter-panel.tsx`
- Create: `apps/web/src/features/products/sections/products-filter-group.tsx`
- Modify: `apps/web/src/styles/products-client-redesign.css`
- Test: `apps/web/src/test/products-filter-panel.test.tsx`
- Browser: `apps/web/tests/e2e/products-search-and-filters.spec.ts`

**Interfaces:**
- Consumes: `ProductsFacetModel`, selected state, callbacks.
- Produces controlled filter UI only; no filtering logic duplicated in components.

- [ ] **Step 1: Write checked-state accessibility test**

Assert family uses radios and multi facets use checkboxes. For selected elements assert `checked === true` and visible custom marker class/data attribute is present.

- [ ] **Step 2: Create reusable filter group**

Props:

```ts
interface ProductsFilterGroupProps {
  id: string;
  label: string;
  options: readonly ProductsFacetOption[];
  selected: readonly string[];
  onToggle(value: string): void;
  initialLimit?: number;
  searchableThreshold?: number;
}
```

Long list behavior:

- render first N relevant/selected options;
- selected values always visible;
- Show more reveals rest;
- Show less collapses;
- when option count exceeds threshold, expose internal filter search.

- [ ] **Step 3: Implement deterministic custom radio/checkbox CSS**

Use visually styled control pseudo-elements while native input remains focusable/operable.

Required selected CSS includes ROSA red and a non-colour state marker.

- [ ] **Step 4: Add Clear filters**

Clear resets family + all multi facets + query, while preserving current `view` if desired by the locked UX. Sort resets to recommended unless test/spec explicitly preserves it; choose one and encode it consistently. Recommended: clear query/facets only, preserve view and sort.

- [ ] **Step 5: Desktop/mobile composition**

Desktop keeps sticky left sidebar.

Below desktop, use the existing `details`/disclosure or a lightweight accessible drawer; do not duplicate filter state. One `ProductsFilterPanel` instance per visible layout is acceptable only if controls remain synchronized from parent state.

- [ ] **Step 6: Run visual/interaction browser suite**

Verify red checked indicator at Chromium screenshot level if necessary.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/products/sections apps/web/src/styles/products-client-redesign.css apps/web/src/test/products-filter-panel.test.tsx apps/web/tests/e2e/products-search-and-filters.spec.ts
git commit -m "feat(products): build contextual filter sidebar"
```

---

### Task 6: Add progressive See More result disclosure

**Files:**
- Create: `apps/web/src/features/products/products-pagination.ts`
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Modify: `apps/web/src/styles/products-client-redesign.css`
- Test: `apps/web/src/test/products-pagination.test.ts`
- Browser: create `apps/web/tests/e2e/products-progressive-results.spec.ts`

**Interfaces:**
- Produces:

```ts
export const PRODUCTS_INITIAL_DESKTOP = 12;
export const PRODUCTS_INITIAL_COMPACT = 8;
export function nextVisibleCount(current: number, total: number, batch: number): number;
```

- [ ] **Step 1: Unit-test batch math**

Cases:

```text
12 of 40 -> 24
24 of 40 -> 36
36 of 40 -> 40
40 of 40 -> 40
```

- [ ] **Step 2: Define compact-vs-desktop policy without hydration mismatch**

Do not read `window.innerWidth` during server render. Recommended client approach:

- initial stable count uses 8 for hydration;
- media-query hook may expand to 12 on desktop after mount without reducing already visible cards;

or use one 12-item initial count across breakpoints if testing shows mobile length remains acceptable. The spec preference is 12 desktop / 8 compact; implement with a hydration-safe hook and test it.

- [ ] **Step 3: Reset visible count on discovery-result identity change**

A stable filter/query/sort signature should reset count. View change may preserve current count.

- [ ] **Step 4: Render only `result.products.slice(0, visibleCount)`**

Button copy:

```text
See more products
```

Optionally include remaining count in a subordinate span/aria label.

- [ ] **Step 5: Animate only newly appended cards**

Reuse existing Reveal/Stagger primitives or a CSS entry class. Do not remount/animate all previously visible cards on every click.

- [ ] **Step 6: Browser acceptance**

Assert initial list count, one-button increment, reset after filter, and button disappearance when complete.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/products apps/web/src/styles/products-client-redesign.css apps/web/src/test/products-pagination.test.ts apps/web/tests/e2e/products-progressive-results.spec.ts
git commit -m "feat(products): progressively reveal catalogue results"
```

---

### Task 7: Soft-retire family pages into filtered Products redirects

**Files:**
- Modify: `apps/web/src/app/(public)/[[...segments]]/page.tsx`
- Modify: `apps/web/src/features/public-routing/resolve-public-page.tsx`
- Modify: `apps/web/src/features/product-detail/product-breadcrumbs.tsx`
- Modify any remaining public family links discovered by repository search
- Modify: `apps/web/src/app/sitemap.ts`
- Test: `apps/web/src/test/public-routing.test.tsx` or create `family-route-retirement.test.ts`
- Browser: `apps/web/tests/e2e/family-route-redirects.spec.ts`

**Interfaces:**
- Produces family URL -> Products query redirect.

- [ ] **Step 1: Write routing tests first**

For each family and locale assert expected destination.

- [ ] **Step 2: Redirect in the catch-all route before rendering old family UI**

Use Next `redirect()` or `permanentRedirect()` only after deciding SEO behavior. Recommended: `permanentRedirect` if the owner intends permanent retirement; if rollout risk remains, use temporary `redirect` during verification and convert after client approval. Lock one choice before deployment. Given explicit retirement approval, recommended final = permanent redirect.

- [ ] **Step 3: Remove `FamilyListingPage` from active `resolvePublicPage` switch**

`resolvePublicPageKind` may retain a family kind solely so metadata/router can recognize the route before redirect, but no family page should render.

- [ ] **Step 4: Update breadcrumbs/internal links**

Family breadcrumb href:

```ts
/products?family=${family.slug}
```

Localized link infrastructure prepends `/ar` where appropriate.

- [ ] **Step 5: Update sitemap**

Do not advertise retired family landing URLs as canonical content pages. Product Detail URLs remain listed.

- [ ] **Step 6: Browser verify EN/AR redirect and selected filter**

- [ ] **Step 7: Commit**

```bash
git add 'apps/web/src/app/(public)/[[...segments]]/page.tsx' apps/web/src/features/public-routing apps/web/src/features/product-detail/product-breadcrumbs.tsx apps/web/src/app/sitemap.ts apps/web/src/test apps/web/tests/e2e/family-route-redirects.spec.ts
git commit -m "refactor(products): retire family pages into filtered hub"
```

---

### Task 8: Remove Related Products end-to-end

**Files:**
- Modify: `apps/web/src/features/product-detail/product-detail-page.tsx`
- Modify: `apps/web/src/features/product-detail/product-detail.data.ts`
- Modify: `apps/web/src/features/catalogue-live/catalogue-live.repository.ts` only if related-product context is no longer required by any consumer
- Delete only if unused after search: `apps/web/src/features/product-detail/related-product-grid.tsx`
- Test: `apps/web/src/test/product-detail-page.test.tsx`
- Browser: `apps/web/tests/e2e/product-detail-no-related.spec.ts`

**Interfaces:**
- Product Detail data no longer exposes `related`.

- [ ] **Step 1: Write failing render assertion**

```ts
expect(screen.queryByText(/Related products/i)).not.toBeInTheDocument()
expect(screen.queryByText(/More from/i)).not.toBeInTheDocument()
```

Current implementation should fail.

- [ ] **Step 2: Remove RelatedProductGrid section from page**

- [ ] **Step 3: Remove related calculation from `createProductDetailData`**

- [ ] **Step 4: Simplify catalogue context fetch if safe**

If Product Detail only needs one product after removal, introduce/favor a selector that returns that product rather than fetching related records solely for the old UI. Preserve existing live parity behavior.

- [ ] **Step 5: Delete component only after repository search proves no remaining imports**

- [ ] **Step 6: Run tests and commit**

```bash
git add apps/web/src/features/product-detail apps/web/src/features/catalogue-live apps/web/src/test/product-detail-page.test.tsx apps/web/tests/e2e/product-detail-no-related.spec.ts
git commit -m "refactor(product-detail): remove related product suggestions"
```

---

### Task 9: Gate B verification

- [ ] **Step 1: Run focused unit suite**

```bash
pnpm --filter @rosa/web test -- \
  src/test/products-discovery-facets.test.ts \
  src/test/products-discovery-workspace.test.tsx \
  src/test/products-discovery-url.test.ts \
  src/test/products-filter-panel.test.tsx \
  src/test/products-pagination.test.ts \
  src/test/product-detail-page.test.tsx
```

- [ ] **Step 2: Run focused Playwright**

```bash
pnpm --filter @rosa/web exec playwright test \
  tests/e2e/products-search-and-filters.spec.ts \
  tests/e2e/products-progressive-results.spec.ts \
  tests/e2e/family-route-redirects.spec.ts \
  tests/e2e/product-detail-no-related.spec.ts
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter @rosa/web typecheck
```

- [ ] **Step 4: Manual quality audit**

At 390/768/1024/1366/1920 verify:

- no giant permanent facet list;
- selected markers visibly red;
- sticky sidebar does not collide with header;
- mobile disclosure works;
- See More centered and polished;
- no horizontal overflow;
- no Related Products.
