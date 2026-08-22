# Products Discovery Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/products` into the client-directed search/filter/product-grid workspace backed by the complete public catalogue while exposing only real supported data.

**Architecture:** Server-render the complete catalogue through `getPublicCatalogueProducts()`. Reuse the shared `ProductPreviewModel` for display, then create a Products-only `ProductsDiscoveryItem` that adds a normalized search index containing every real size, variant, direction, catalogue code and code-size entry. A single client workspace owns query/family/sort/view state and performs no second fetch. Unsupported filters are omitted. Numeric prices are not invented.

**Tech Stack:** Next.js server/client components, React, TypeScript, existing catalogue-live/public-catalogue modules, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Use all active public products, not only featured fixture selections.
- Search all real product identity/configuration data available in `CatalogueProductRecord`: name, primary code, family, all sizes, all variants, all directions, all `catalogueCodes[].code`, and all `catalogueCodes[].size` values.
- Family/category filter is functional.
- Do not render fake Price/Country of origin/Brand/Delivery Method filters.
- No numeric price until a verified source exists; render `Price on request` / `السعر عند الطلب`.
- Default view is grid; list is the same records in alternate layout.
- Product card/View Details route to `/products/[family]/[product]`.
- Do not add directly from result cards because canonical size/variant inquiry action belongs on Product Detail.
- Desktop uses a persistent family sidebar; below desktop use native `<details>/<summary>` compact filters.
- No horizontal page overflow.
- Keep old `CatalogueSupport` temporarily through this subplan; the catalogue-access subplan replaces it with five open/download cards.

---

### Task 1: Add a complete product-preview mapper without duplicating existing mapping logic

**Files:**
- Modify: `apps/web/src/features/public-catalogue/selectors.ts`
- Modify: `apps/web/src/features/public-catalogue/index.ts`
- Create: `apps/web/src/test/products-client-redesign.test.tsx`

**Interface:**

```ts
export function selectProductPreviews(
  products: readonly CatalogueProductRecord[]
): readonly ProductPreviewModel[]
```

- [ ] **Step 1: Write RED selector tests**

Use two representative records and assert identity/media/display mapping, input order, and option-summary cleanup.

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
- repeated display option values are deduplicated;
- display summary stays compact rather than listing every configuration;
- media fields are carried only when present.

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
```

- [ ] **Step 3: Extract one shared record→preview mapper**

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

Refactor `selectFeaturedProducts` to use the same `toProductPreview` after fixture resolution.

- [ ] **Step 4: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
git add apps/web/src/features/public-catalogue apps/web/src/test/products-client-redesign.test.tsx
git commit -m "refactor(web): expose complete product preview mapping"
```

### Task 2: Define the Products-only discovery item and full search index

**Files:**
- Create: `apps/web/src/features/products/products-discovery.types.ts`
- Create: `apps/web/src/features/products/products-discovery.logic.ts`
- Modify: `apps/web/src/features/products/products.data.ts`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

**Interfaces:**

```ts
import type { FamilySlug, ProductPreviewModel } from "@/features/public-catalogue";

export interface ProductsDiscoveryItem extends ProductPreviewModel {
  searchTerms: readonly string[];
}

export type ProductsSort = "recommended" | "name-asc";
export type ProductsView = "grid" | "list";

export interface ProductsDiscoveryState {
  query: string;
  family: FamilySlug | "all";
  sort: ProductsSort;
  view: ProductsView;
}

export interface ProductsDiscoveryResult {
  products: readonly ProductsDiscoveryItem[];
  total: number;
}

export function createProductsDiscoveryItems(
  products: readonly CatalogueProductRecord[],
  locale: PublicLocale
): readonly ProductsDiscoveryItem[];

export function filterProducts(
  products: readonly ProductsDiscoveryItem[],
  state: ProductsDiscoveryState
): ProductsDiscoveryResult;
```

- [ ] **Step 1: Write RED indexing tests**

Build one record containing:

```ts
{
  name: "Mayo Scissors",
  code: "SC-BASE",
  sizes: ["14 cm", "17 cm"],
  variants: ["Straight", "Curved"],
  directions: [],
  catalogueCodes: [
    { code: "SC-140-S", size: "14 cm" },
    { code: "SC-170-C", size: "17 cm" }
  ]
}
```

Assert the resulting `searchTerms` includes normalized values for:

- Mayo Scissors;
- SC-BASE;
- family name;
- 14 cm;
- 17 cm;
- Straight;
- Curved;
- SC-140-S;
- SC-170-C.

Then assert filtering by `17 cm`, `Curved`, and `SC-170-C` each returns the product even though those values are not necessarily in the compact display summary.

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Implement unique normalized search terms in `products.data.ts`**

```ts
function uniqueSearchTerms(values: readonly (string | undefined)[]): readonly string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  );
}

export function createProductsDiscoveryItems(
  products: readonly CatalogueProductRecord[],
  locale: PublicLocale
): readonly ProductsDiscoveryItem[] {
  const ar = locale === "ar";
  const previews = selectProductPreviews(products);

  return previews.map((preview, index) => {
    const sourceProduct = products[index]!;
    const familyName = ar ? FAMILY_NAMES_AR[preview.familySlug] : preview.familyName;
    const localizedName = ar && sourceProduct.nameAr?.trim()
      ? sourceProduct.nameAr.trim()
      : preview.name;

    return {
      ...preview,
      name: localizedName,
      familyName,
      searchTerms: uniqueSearchTerms([
        localizedName,
        preview.name,
        preview.code,
        familyName,
        ...sourceProduct.sizes,
        ...sourceProduct.variants,
        ...sourceProduct.directions,
        ...(sourceProduct.catalogueCodes ?? []).flatMap((entry) => [entry.code, entry.size])
      ])
    };
  });
}
```

Preserve index alignment by calling `selectProductPreviews(products)` directly on the same input array and never re-sorting before this mapping.

- [ ] **Step 4: Implement filtering over the complete index**

```ts
function searchableText(product: ProductsDiscoveryItem): string {
  return product.searchTerms.join(" ").toLocaleLowerCase();
}

export function filterProducts(
  products: readonly ProductsDiscoveryItem[],
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

- [ ] **Step 5: Add pure filtering tests**

Cover blank/default order, family filtering, name/code matching, non-first size/variant/code matching, name sort immutability, and whitespace normalization.

- [ ] **Step 6: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
git add apps/web/src/features/products/products-discovery.types.ts apps/web/src/features/products/products-discovery.logic.ts apps/web/src/features/products/products.data.ts apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): index complete Products discovery data"
```

### Task 3: Feed `/products` from the full public catalogue

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/features/products/products.data.ts`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Add RED source contract**

```ts
const page = source("src/features/products/products-overview.tsx");
expect(page).toContain("getPublicCatalogueProducts");
expect(page).not.toContain("getFeaturedCatalogueProducts");
```

- [ ] **Step 2: Replace server fetch**

```ts
const products = await getPublicCatalogueProducts();
const model = createProductsPageModel(products, locale);
```

- [ ] **Step 3: Make the page model return discovery items**

Inside `createProductsPageModel`:

```ts
const discoveryProducts = createProductsDiscoveryItems(products, locale);
```

The returned model uses `products: discoveryProducts`.

- [ ] **Step 4: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
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
  products: readonly ProductsDiscoveryItem[];
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

- [ ] **Step 1: Write RED component contracts**

Require:

- one accessible text-search input;
- family options `all` + five real families;
- only `recommended` and `name-asc` sorts;
- grid/list buttons with `aria-pressed`;
- result count with `aria-live="polite"`;
- no fake Price/Country/Brand/Delivery filter labels.

- [ ] **Step 2: Implement one client state**

```ts
const [state, setState] = useState<ProductsDiscoveryState>({
  query: "",
  family: "all",
  sort: "recommended",
  view: "grid"
});
const result = useMemo(() => filterProducts(products, state), [products, state]);
```

Do not add URL synchronization in this phase.

- [ ] **Step 3: Desktop family sidebar**

Family is the only persistent filter. Use explicit accessible selected state.

- [ ] **Step 4: Mobile native disclosure**

```tsx
<details className="products-filter-disclosure">
  <summary>{locale === "ar" ? "تصفية المنتجات" : "Filter products"}</summary>
  <ProductsFilterPanel ... />
</details>
```

No drawer dependency.

- [ ] **Step 5: Results toolbar**

Render localized result count, sort `<select>`, and grid/list controls.

- [ ] **Step 6: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
git add apps/web/src/features/products/sections apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): build Products discovery controls"
```

### Task 5: Build one dense result card for grid/list views

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
  product: ProductsDiscoveryItem;
  view: ProductsView;
  locale: PublicLocale;
}): ReactElement
```

- [ ] **Step 1: Write RED card contract**

Require existing product media/placeholder behavior, family, name, primary code, compact option summary, localized Price on request, canonical `productHref(product)`, View Details, and no direct Add to Inquiry control.

- [ ] **Step 2: Implement one semantic card**

```tsx
<article className={`products-result-card products-result-card--${view}`}>
  <LocaleLink className="products-result-card__media" href={productHref(product)}>
    {/* reuse the same product-media primitive used by ProductPreviewCard */}
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

Do not expose `searchTerms` in UI.

- [ ] **Step 3: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
git add apps/web/src/features/products/sections apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add client-directed product result cards"
```

### Task 6: Add Products direct-contact band

**Files:**
- Create: `apps/web/src/features/products/sections/products-direct-contact-band.tsx`
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Add RED contract**

Require centralized `PUBLIC_CONTENT_VALUES`, localized `Get in Touch Now`, WhatsApp and email actions. Assert no duplicate hard-coded central email/phone values.

- [ ] **Step 2: Implement black conversion band**

Keep it inside Products middle content; it must not replace or hide the shell-level red contact strip.

- [ ] **Step 3: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
git add apps/web/src/features/products apps/web/src/test/products-client-redesign.test.tsx
git commit -m "feat(web): add Products direct contact band"
```

### Task 7: Compose Products without circular catalogue dependency

**Files:**
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Stop rendering: `apps/web/src/features/products/sections/products-hero.tsx` because the shared-banner subplan replaces it.
- Stop rendering: `apps/web/src/features/products/sections/discovery-toolbar-shell.tsx`
- Stop rendering: `apps/web/src/features/products/sections/family-index.tsx`
- Stop rendering: `apps/web/src/features/products/sections/product-preview-grid.tsx`
- Keep temporarily: `apps/web/src/features/products/sections/catalogue-support.tsx`
- Keep/reshape: `apps/web/src/features/products/sections/products-procurement-cta.tsx`
- Modify: `apps/web/src/test/products-client-redesign.test.tsx`

- [ ] **Step 1: Lock temporary composition order**

```text
PublicHeroCarousel(page="products")
ProductsDiscoveryWorkspace
ProductsDirectContactBand
CatalogueSupport
ProductsProcurementCta
```

The following catalogue-access subplan replaces `CatalogueSupport` with `ProductsCatalogueCards`.

- [ ] **Step 2: Remove old Products hero/discovery/family/featured-grid renders**

Never render both old and new discovery systems.

- [ ] **Step 3: Grep before deleting files**

```bash
git grep -n "ProductsHero\|DiscoveryToolbarShell\|FamilyIndex\|ProductPreviewGrid" -- apps/web/src
```

Delete only when no remaining production/test dependency exists.

- [ ] **Step 4: Run focused test and commit**

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

- [ ] **Step 2: Implement desktop geometry**

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

At mobile widths hide the persistent sidebar, show `<details>` filters, and use one readable result column.

- [ ] **Step 3: Add Playwright at 1366**

Assert:

- persistent family filter visible;
- search a stable non-first catalogue code/size from fixture-backed data and confirm the correct product remains;
- family filter narrows results;
- Name A–Z changes visible ordering;
- grid/list toggles update result layout;
- cards stay inside viewport;
- no horizontal overflow.

- [ ] **Step 4: Add Playwright at 390**

Assert desktop sidebar hidden, compact disclosure visible, View Details tappable, and no page overflow.

- [ ] **Step 5: Run and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web typecheck
git add apps/web/src/styles/products-client-redesign.css apps/web/src/app/globals.css apps/web/src/test/products-client-redesign.test.tsx apps/web/tests/e2e/products-client-redesign.spec.ts
git commit -m "feat(web): finish responsive Products discovery redesign"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web typecheck
```

The subsequent `2026-08-22-products-catalogue-access.md` subplan replaces temporary `CatalogueSupport` with the five client-directed catalogue open/download cards.