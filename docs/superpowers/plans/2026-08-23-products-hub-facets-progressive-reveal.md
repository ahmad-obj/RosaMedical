# Products Hub Facets + Progressive Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/products` the single robust discovery workspace with crash-free search, URL-backed contextual facets, deterministic ROSA-red controls, progressive result disclosure, permanent family-route redirects and no Product Detail recommendations.

**Architecture:** Keep the entire public catalogue loaded once by `ProductsOverview`, enrich `ProductsDiscoveryItem` with normalized facet/search metadata, and keep filtering as pure memoizable selectors. UI state synchronizes with query parameters without server refetch on each interaction. Family URLs permanently redirect into that same state model.

**Tech Stack:** React client state, Next navigation/search params, TypeScript, Vitest, Playwright, existing public catalogue/live projection.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- `/products` is the only family/product discovery UI.
- Product Detail routes remain canonical.
- Family, Size, Direction, Variant and Code group facets use only real catalogue data.
- Family is single-select; other facets are multi-select.
- OR within one facet, AND across facets/search.
- Long facet groups initially show 8 values and become internally searchable at 14+ available values.
- Search/filter/sort changes reset visible batch count.
- Clear filters resets query/family/multi-facets but preserves current sort and grid/list view.
- Mobile/tablet uses the existing accessible `<details>` disclosure pattern; no new drawer dependency.
- Initial result policy is 8 during hydration/compact layouts and 12 after a desktop media-query snapshot is available.
- No fake country/origin/brand/delivery filters.
- No Related Products section.

---

### Task 1: Expand discovery types into a real facet/state contract

**Files:**
- Modify: `apps/web/src/features/products/products-discovery.types.ts`
- Modify: `apps/web/src/features/products/products.data.ts`
- Create: `apps/web/src/features/products/products-facets.ts`
- Test: create `apps/web/src/test/products-discovery-facets.test.ts`

**Interfaces:**

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

Use representative products and assert all sizes, variants and directions are preserved; search includes non-first SKU/size values; code groups are derived from real product/catalogue codes.

- [ ] **Step 2: Implement the exact code-group rule**

`deriveCodeGroup(code: string): string | null` uses:

```ts
const match = code.trim().match(/^(\d{2})-(\d{2})\d{2}[A-Za-z]*$/);
return match ? `${match[1]}-${match[2]}xx` : null;
```

Examples locked by test:

```text
21-1001  -> 21-10xx
21-1199A -> 21-11xx
18-0103  -> 18-01xx
18-0103S -> 18-01xx
blank/malformed -> null
```

The grouping label is derived metadata only; actual product/SKU values remain unchanged.

- [ ] **Step 3: Populate facet values in `createProductsDiscoveryItems`**

Use unique trimmed values from `sizes`, `variants`, `directions`, primary code and every `catalogueCodes[].code`.

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
- Create: `apps/web/src/features/products/products-facet-model.ts`
- Test: `apps/web/src/test/products-discovery-facets.test.ts`

**Interfaces:**

```ts
filterProducts(products, state): ProductsDiscoveryResult
buildFacetModel(products, state): ProductsFacetModel
compareProductSizes(a, b): number
```

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

- [ ] **Step 1: Write the failing selector matrix**

Cover family, each individual facet, query + family, family + size + direction, multiple sizes (OR), size + variant (AND), selected zero-count option preservation and clear state.

- [ ] **Step 2: Implement one shared matcher**

```ts
function matchesAny(productValues: readonly string[], selected: readonly string[]) {
  if (!selected.length) return true;
  const values = new Set(productValues.map(normalizeFacetValue));
  return selected.some((value) => values.has(normalizeFacetValue(value)));
}
```

- [ ] **Step 3: Implement contextual counts**

While building one facet, apply query/family and all other facets but omit that facet's own selection constraint. Selected values remain present even at count zero.

- [ ] **Step 4: Implement numeric-aware size sorting**

Parse leading number + normalized unit; compare numeric value, then unit, then locale text. Lock:

```text
1.0 mm < 1.5 mm < 2.0 mm < 4 mm
8.0 cm < 16.5 cm < 28.0 cm
```

- [ ] **Step 5: Run focused selectors and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-discovery-facets.test.ts
git add apps/web/src/features/products apps/web/src/test/products-discovery-facets.test.ts
git commit -m "feat(products): add contextual faceted filtering"
```

---

### Task 3: Fix search crash and lock it with behavior tests

**Files:**
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Create/update: `apps/web/src/test/products-discovery-workspace.test.tsx`
- Browser: `apps/web/tests/e2e/products-search-and-filters.spec.ts`

- [ ] **Step 1: Write a test that actually types**

```ts
await page.goto("/products")
await page.getByRole("searchbox").fill("iris")
await expect(page.getByText("Something went wrong")).toHaveCount(0)
await expect(page.locator("[data-products-results]")).toBeVisible()
```

- [ ] **Step 2: Verify RED on current event handling**

- [ ] **Step 3: Capture the value synchronously**

```tsx
onChange={(event) => {
  const query = event.currentTarget.value;
  setState((current) => ({ ...current, query }));
}}
```

- [ ] **Step 4: Test name, exact code, non-primary SKU, size and direction searches**

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
- Test: `apps/web/src/test/products-discovery-url.test.ts`
- Browser: `apps/web/tests/e2e/products-search-and-filters.spec.ts`

**Interfaces:**

```ts
parseProductsDiscoverySearchParams(params: URLSearchParams): Partial<ProductsDiscoveryState>
serializeProductsDiscoveryState(state: ProductsDiscoveryState): URLSearchParams
```

- [ ] **Step 1: Write round-trip tests**

Keys are exactly `q`, `family`, repeated `size`, repeated `direction`, repeated `variant`, repeated `codeGroup`, `sort`, `view`. Invalid family/sort/view values are ignored.

- [ ] **Step 2: Lock repeated-param encoding**

Example:

```text
?size=14%20cm&size=16%20cm&direction=Straight
```

Serialize keys/values deterministically.

- [ ] **Step 3: Hydrate from `useSearchParams()` and synchronize with `router.replace()`**

Use `useRouter()` + `usePathname()`. No full navigation/refetch on checkbox clicks.

- [ ] **Step 4: Reconcile Back/Forward without replace loops**

- [ ] **Step 5: Verify refresh of `/products?family=cutters&direction=Straight`**

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/products/products-discovery-url.ts apps/web/src/features/products/sections/products-discovery-workspace.tsx apps/web/src/test/products-discovery-url.test.ts apps/web/tests/e2e/products-search-and-filters.spec.ts
git commit -m "feat(products): persist discovery filters in URL"
```

---

### Task 5: Build the desktop/mobile contextual filter UI

**Files:**
- Rewrite/expand: `apps/web/src/features/products/sections/products-filter-panel.tsx`
- Create: `apps/web/src/features/products/sections/products-filter-group.tsx`
- Modify: `apps/web/src/styles/products-client-redesign.css`
- Test: `apps/web/src/test/products-filter-panel.test.tsx`
- Browser: `apps/web/tests/e2e/products-search-and-filters.spec.ts`

**Interfaces:**

```ts
interface ProductsFilterGroupProps {
  id: string;
  label: string;
  options: readonly ProductsFacetOption[];
  selected: readonly string[];
  onToggle(value: string): void;
}
```

Constants are locked:

```ts
const FACET_INITIAL_VISIBLE = 8;
const FACET_SEARCH_THRESHOLD = 14;
```

- [ ] **Step 1: Write checked-state/accessibility tests**

Family uses radios; Size/Direction/Variant/Code group use checkboxes. Selected native inputs are checked and the custom visual marker renders.

- [ ] **Step 2: Implement long-list behavior**

- first 8 relevant options visible;
- selected values always visible;
- Show more reveals all;
- Show less returns to 8;
- 14+ available options enables a small within-facet text filter.

- [ ] **Step 3: Implement deterministic custom controls**

Native input remains focusable. Styled marker supplies ROSA-red selected border/fill/dot/check, white check mark, focus ring, disabled state and no layout shift.

- [ ] **Step 4: Lock Clear filters behavior**

Reset:

```ts
query = ""
family = "all"
sizes = []
directions = []
variants = []
codeGroups = []
```

Preserve existing `sort` and `view`.

- [ ] **Step 5: Lock responsive composition**

Desktop: sticky left sidebar.

Tablet/mobile: the existing `<details className="products-filter-disclosure">` pattern containing the same controlled panel model. Do not add a drawer library.

- [ ] **Step 6: Browser/screenshot verify red checked markers and keyboard operation**

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/products/sections apps/web/src/styles/products-client-redesign.css apps/web/src/test/products-filter-panel.test.tsx apps/web/tests/e2e/products-search-and-filters.spec.ts
git commit -m "feat(products): build contextual filter sidebar"
```

---

### Task 6: Add progressive See More result disclosure

**Files:**
- Create: `apps/web/src/features/products/products-pagination.ts`
- Create: `apps/web/src/features/products/use-products-batch-size.ts`
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Modify: `apps/web/src/styles/products-client-redesign.css`
- Test: `apps/web/src/test/products-pagination.test.ts`
- Browser: `apps/web/tests/e2e/products-progressive-results.spec.ts`

**Interfaces:**

```ts
export const PRODUCTS_INITIAL_DESKTOP = 12;
export const PRODUCTS_INITIAL_COMPACT = 8;
export function nextVisibleCount(current: number, total: number, batch: number): number;
export function useProductsBatchSize(): 8 | 12;
```

- [ ] **Step 1: Unit-test exact batch math**

```text
12/40 -> 24
24/40 -> 36
36/40 -> 40
40/40 -> 40
```

- [ ] **Step 2: Implement hydration-safe batch-size hook**

Use `useSyncExternalStore` around `window.matchMedia("(min-width: 64.001rem)")`.

- server snapshot returns compact batch `8`;
- client snapshot returns `12` when the media query matches, otherwise `8`;
- after hydration, a desktop may grow from 8 to 12 automatically;
- resize must never reduce a user's already revealed count; only a query/filter/sort reset returns to the current batch size.

- [ ] **Step 3: Reset on query/facet/sort signature changes**

View changes preserve visible count.

- [ ] **Step 4: Render `result.products.slice(0, visibleCount)`**

Use a centered `See more products` button. Include remaining count in `aria-label` and optional subordinate copy.

- [ ] **Step 5: Append one batch without scroll jump**

Animate only newly added cards; reduced-motion appears immediately.

- [ ] **Step 6: Browser acceptance and commit**

```bash
git add apps/web/src/features/products apps/web/src/styles/products-client-redesign.css apps/web/src/test/products-pagination.test.ts apps/web/tests/e2e/products-progressive-results.spec.ts
git commit -m "feat(products): progressively reveal catalogue results"
```

---

### Task 7: Permanently retire family pages into filtered Products redirects

**Files:**
- Modify: `apps/web/src/app/(public)/[[...segments]]/page.tsx`
- Modify: `apps/web/src/features/public-routing/resolve-public-page.tsx`
- Modify: `apps/web/src/features/product-detail/product-breadcrumbs.tsx`
- Modify remaining public family links found by repository search
- Modify: `apps/web/src/app/sitemap.ts`
- Test: create/update `apps/web/src/test/family-route-retirement.test.ts`
- Browser: `apps/web/tests/e2e/family-route-redirects.spec.ts`

- [ ] **Step 1: Write all ten redirect tests**

Five EN + five AR destinations.

- [ ] **Step 2: Use Next `permanentRedirect()` before family-page rendering**

Destinations are exactly:

```text
/products?family=<slug>
/ar/products?family=<slug>
```

- [ ] **Step 3: Remove `FamilyListingPage` from the active render switch/import**

The route kind may remain recognizable only to trigger the redirect/metadata path; it must not render the old family experience.

- [ ] **Step 4: Update breadcrumbs/internal links**

Family links point to filtered Products. Locale infrastructure preserves Arabic prefix.

- [ ] **Step 5: Remove retired family pages from sitemap canonical entries**

Product Detail URLs remain.

- [ ] **Step 6: Browser verify redirect + selected radio hydration**

- [ ] **Step 7: Commit**

```bash
git add 'apps/web/src/app/(public)/[[...segments]]/page.tsx' apps/web/src/features/public-routing apps/web/src/features/product-detail/product-breadcrumbs.tsx apps/web/src/app/sitemap.ts apps/web/src/test/family-route-retirement.test.ts apps/web/tests/e2e/family-route-redirects.spec.ts
git commit -m "refactor(products): retire family pages into filtered hub"
```

---

### Task 8: Remove Related Products end-to-end

**Files:**
- Modify: `apps/web/src/features/product-detail/product-detail-page.tsx`
- Modify: `apps/web/src/features/product-detail/product-detail.data.ts`
- Modify: `apps/web/src/features/catalogue-live/catalogue-live.repository.ts`
- Delete if repository search confirms no remaining import: `apps/web/src/features/product-detail/related-product-grid.tsx`
- Test: `apps/web/src/test/product-detail-page.test.tsx`
- Browser: `apps/web/tests/e2e/product-detail-no-related.spec.ts`

**Interfaces:**
- Add/produce `getProductCatalogueProduct(familySlug, productSlug): Promise<CatalogueProductRecord | null>` for the focused Product Detail lookup.
- Product Detail data no longer exposes `related`.

- [ ] **Step 1: Write failing render assertion**

No `Related products`, no `More from`, no related cards.

- [ ] **Step 2: Remove RelatedProductGrid section/import**

- [ ] **Step 3: Remove related calculation from `createProductDetailData`**

- [ ] **Step 4: Add focused catalogue lookup**

`getProductCatalogueProduct` may reuse the cached family projection but returns only the matching canonical product and does not build a related slice.

Update `ProductDetailPage` and catch-all existence check to consume the focused lookup where appropriate.

- [ ] **Step 5: Delete RelatedProductGrid only after repository search proves it is unused**

- [ ] **Step 6: Test and commit**

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
  src/test/family-route-retirement.test.ts \
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

At 390/768/1024/1366/1920 verify no giant permanent facet list, selected markers visibly red, sticky sidebar does not collide with header, mobile disclosure works, See More is centered/polished, URL state survives refresh, no horizontal overflow and no Related Products.
