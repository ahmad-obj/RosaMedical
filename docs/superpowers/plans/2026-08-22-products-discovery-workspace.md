# Products Discovery Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/products` into the client-directed search/filter/product-grid workspace backed by the complete public catalogue while exposing only real supported data.

**Architecture:** Server-render the complete public catalogue through `getPublicCatalogueProducts()` and convert records into a stable client-safe discovery model. A focused client workspace owns query/category/sort/view state in memory and never performs a second product fetch. Product cards link to the existing canonical detail route; unsupported filters are omitted; price renders as localized `Price on request` until a verified numeric contract exists.

**Tech Stack:** Next.js server/client components, React, TypeScript, Vitest, Playwright, existing catalogue-live/public-catalogue modules.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Use all active public products, not only fixtures selected as featured.
- Search real fields: name, code, family, sizes, variants/directions.
- Category/family filter is functional.
- Do not show fake Price/Country of origin/Brand/Delivery Method controls.
- No numeric price unless a verified field exists; current fallback is `Price on request`.
- Default display is grid.
- Product click/View Details goes to `/products/[family]/[product]`.
- No direct add-to-inquiry from the grid when size/variant ambiguity exists.
- Desktop gets filter sidebar; smaller layouts use a disclosure/drawer-like compact filter control without a dependency.
- No horizontal overflow.

---

### Task 1: Add an all-products preview selector

**Files:**
- Modify: `apps/web/src/features/public-catalogue/selectors.ts`
- Modify: `apps/web/src/features/public-catalogue/index.ts`
- Test: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**
- Consumes: `readonly CatalogueProductRecord[]`
- Produces:

```ts
export function selectProductPreviews(
  products: readonly CatalogueProductRecord[],
  locale?: PublicLocale
): readonly ProductPreviewModel[]
```

If importing `PublicLocale` into this shared selector would create an undesirable localization dependency, instead produce English family names here and localize the family label in the Products page model. Do not duplicate route/product normalization logic.

- [ ] **Step 1: Write failing selector tests**

Test with two catalogue records from different families and assert:

```ts
expect(selectProductPreviews(products)).toHaveLength(2);
expect(result[0]).toMatchObject({
  id: products[0].id,
  slug: products[0].slug,
  familySlug: products[0].familySlug,
  name: products[0].name,
  code: products[0].code
});
```

Also assert `optionSummary` deduplicates blank/repeated values and media fields are carried through only when present.

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
```

Expected: FAIL because `selectProductPreviews` does not exist.

- [ ] **Step 3: Extract the common record→preview mapping used by `selectFeaturedProducts`**

Add one internal mapper:

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
```

Then:

```ts
export function selectProductPreviews(
  products: readonly CatalogueProductRecord[]
): readonly ProductPreviewModel[] {
  return products.map(toProductPreview);
}
```

Refactor `selectFeaturedProducts` to call the same mapper after resolving fixture selections.

- [ ] **Step 4: Run GREEN**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/public-catalogue apps/web/src/test/products-client-redesign.test.tsx
git commit -m "refactor(web): expose complete product preview mapping"
```

### Task 2: Define deterministic discovery state and filtering logic

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

1. blank query + all family returns input order for `recommended`;
2. query matches product name case-insensitively;
3. query matches code;
4. query matches family name;
5. query matches `optionSummary` size/variant values;
6. family filter narrows to exact slug;
7. name sort uses locale-stable `localeCompare` and does not mutate the original array;
8. whitespace query is normalized.

Example:

```ts
const state: ProductsDiscoveryState = {
  query: "mayo",
  family: "all",
  sort: "recommended",
  view: "grid"
};
expect(filterProducts(products, state).products.map((item) => item.name)).toEqual(["Mayo Scissors"]);
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement normalization and filtering**

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
git add apps/web/src/features/products/products-discovery.* apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add deterministic Products discovery logic"
```

### Task 3: Change `/products` to use the complete public catalogue

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/features/products/products.data.ts`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**
- Consume: `getPublicCatalogueProducts()`
- Consume: `selectProductPreviews(products)`
- Produce a Products page model containing localized family list and all preview products.

- [ ] **Step 1: Add static contract assertions**

```ts
it("uses the full public catalogue instead of the featured projection", () => {
  const page = source("src/features/products/products-overview.tsx");
  expect(page).toContain("getPublicCatalogueProducts");
  expect(page).not.toContain("getFeaturedCatalogueProducts");
});
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Replace the fetch**

```ts
const products = await getPublicCatalogueProducts();
const model = createProductsPageModel(products, locale);
```

Update `createProductsPageModel` to call `selectProductPreviews(products)` rather than `selectFeaturedProducts(products)`.

Preserve Arabic family naming using `FAMILY_NAMES_AR` without altering product routes/codes.

- [ ] **Step 4: Run GREEN**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/products apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): feed Products from full public catalogue"
```

### Task 4: Build the client discovery workspace

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

- [ ] **Step 1: Write a component contract test**

Require the workspace to expose:

- one search input with an accessible label;
- `all` plus five family options;
- sort values `recommended` and `name-asc`;
- grid/list view buttons;
- result count with `aria-live="polite"`;
- no `Price`, `Country of origin`, `Brand`, or `Delivery Method` filter labels.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement one state object**

```ts
const [state, setState] = useState<ProductsDiscoveryState>({
  query: "",
  family: "all",
  sort: "recommended",
  view: "grid"
});
const result = useMemo(() => filterProducts(products, state), [products, state]);
```

Do not sync filters to URL in this phase; that is unnecessary complexity unless an existing requirement demands shareable filter URLs.

- [ ] **Step 4: Implement desktop filter panel**

`ProductsFilterPanel` receives `family`, `families`, and `onFamilyChange`. Render radio/select semantics with explicit labels. Family is the only sidebar filter in this phase.

- [ ] **Step 5: Implement compact mobile filter disclosure**

Use native `<details>`/`<summary>` or an existing disclosure primitive if present. Do not add a modal/drawer dependency.

- [ ] **Step 6: Implement results toolbar**

The toolbar renders:

```text
{N} products
Sort: Recommended | Name A–Z
[Grid] [List]
```

Both view buttons must expose `aria-pressed`.

- [ ] **Step 7: Run GREEN**

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/features/products/sections apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): build Products discovery controls"
```

### Task 5: Build dense client-directed product cards

**Files:**
- Create: `apps/web/src/features/products/sections/products-result-card.tsx`
- Modify: `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**

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

Require:

- product image/placeholder using existing public media behavior;
- family label;
- product name;
- code;
- option summary when present;
- localized `Price on request`;
- canonical `productHref(product)`;
- visible `View details` label;
- no `Add to cart`/`Add to inquiry` button on the grid card.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement semantic card**

Recommended shape:

```tsx
<article className={`products-result-card products-result-card--${view}`}>
  <LocaleLink className="products-result-card__media" href={productHref(product)}>
    {/* existing image/placeholder rendering */}
  </LocaleLink>
  <div className="products-result-card__body">
    <p className="products-result-card__family">{product.familyName}</p>
    <h3><LocaleLink href={productHref(product)}>{product.name}</LocaleLink></h3>
    <p className="products-result-card__code"><bdi dir="ltr">{product.code}</bdi></p>
    {product.optionSummary.length > 0 ? <p>{product.optionSummary.join(" · ")}</p> : null}
    <p className="products-result-card__price">{locale === "ar" ? "السعر عند الطلب" : "Price on request"}</p>
    <LocaleLink className="products-result-card__details" href={productHref(product)}>
      {locale === "ar" ? "عرض التفاصيل" : "View details"}
    </LocaleLink>
  </div>
</article>
```

- [ ] **Step 4: Use the same data for grid/list modes**

Only CSS/layout differs by `view`; do not create a second card implementation.

- [ ] **Step 5: Run GREEN**

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/products/sections apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add client-directed product result cards"
```

### Task 6: Add the Products direct-contact band

**Files:**
- Create: `apps/web/src/features/products/sections/products-direct-contact-band.tsx`
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**
- Read centralized email/phone/WhatsApp values; do not hard-code duplicates.

- [ ] **Step 1: Test that the component imports centralized public content values**

```ts
expect(component).toContain("PUBLIC_CONTENT_VALUES");
expect(component).toContain("Get in Touch Now");
```

Also assert no literal `info@rosamedical.org` or phone number is duplicated in this component if the central registry already owns those strings.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement black conversion band**

Include WhatsApp and Email actions plus localized heading. Keep it visually separate from the global red contact strip.

- [ ] **Step 4: Run GREEN and commit**

```bash
git add apps/web/src/features/products apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add Products direct contact band"
```

### Task 7: Compose the Products page in client hierarchy order

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Remove from render path, but do not delete until grep proves unused:
  - `sections/discovery-toolbar-shell.tsx`
  - `sections/family-index.tsx`
  - `sections/product-preview-grid.tsx`
  - `sections/catalogue-support.tsx`
- Keep or reshape: `sections/products-procurement-cta.tsx`
- Test: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Add source-order assertions**

The rendered component should order:

```text
PublicHeroCarousel
ProductsDiscoveryWorkspace
ProductsDirectContactBand
ProductsCatalogueCards   // introduced by the catalogue subplan
ProductsProcurementCta
```

During this subplan, use a temporary typed import boundary for `ProductsCatalogueCards` only after the catalogue subplan exists; otherwise complete Tasks 1–6 first and perform this final composition after catalogue Task 2.

- [ ] **Step 2: Remove the old editorial sequence from the production render**

Do not render both old and new grids.

- [ ] **Step 3: Grep before deleting dead sections**

```bash
git grep -n "DiscoveryToolbarShell\|FamilyIndex\|ProductPreviewGrid\|CatalogueSupport" -- apps/web/src
```

Delete only production-dead files whose tests are also migrated.

- [ ] **Step 4: Run focused unit tests**

### Task 8: Add responsive Products styling

**Files:**
- Create: `apps/web/src/styles/products-client-redesign.css`
- Modify: `apps/web/src/app/globals.css`
- Test: `apps/web/src/test/products-client-redesign.test.tsx`
- E2E: `apps/web/tests/e2e/products-client-redesign.spec.ts`

- [ ] **Step 1: Add CSS contract assertions**

Require:

- wide Products content container;
- desktop two-column discovery layout with sidebar + results;
- adaptive grid using `repeat(... minmax(...))`;
- list-mode rule;
- mobile breakpoint hiding desktop sidebar and exposing compact filter control;
- no persistent `will-change`;
- image hover uses transform only and reduced-motion disables it.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement responsive CSS**

Desktop target:

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

At smaller breakpoints, collapse to one column and use the compact filter disclosure.

- [ ] **Step 4: Add Playwright behavior checks**

At 1366px:

- filter sidebar visible;
- at least 3 product columns when enough products exist;
- first/last grid cards remain inside viewport;
- no horizontal overflow.

At 390px:

- desktop sidebar hidden;
- compact filter control visible;
- product cards readable and single/compact-column;
- `View details` remains tappable.

Test search by typing a known visible product name/code from fixture-backed fallback and verify result count narrows.

- [ ] **Step 5: Run focused browser test**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
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

Do not claim the client price requirement is fully data-backed until a real price field/source is separately approved and implemented.
