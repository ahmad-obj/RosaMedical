# SAR Pricing — Live Catalogue, Admin + Public Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Supabase base-price and variant-override fields first-class, editable SAR data that flows safely into live catalogue records, Admin Product surfaces and public product/card price states without inventing values.

**Architecture:** Preserve Supabase as source of truth. Extend the live projection with product price plus real variant identity/override, normalize money into decimal strings at application boundaries, centralize SAR formatting/effective-price logic, then wire Admin create/edit and one-row-at-a-time variant override actions. Each variant override save is individually atomic at the database-row level; there is no ambiguous multi-row best-effort save.

**Tech Stack:** TypeScript strict mode, Supabase JS/PostgREST, React/Next.js server actions, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Currency is SAR only.
- `NULL` means Price on request.
- Zero is a valid numeric value, not a null sentinel.
- Negative values are rejected.
- UI accepts at most two decimal places.
- Effective configuration price = override ?? base ?? null.
- No production prices are seeded/fabricated during implementation.
- Public card summary distinguishes exact / From / partially unpriced / fully unpriced states.
- Admin pricing absence does not block product activation.
- Variant pricing edits save one real variant row at a time through `saveVariantPriceOverride`; no multi-row partial-write mode.

---

### Task 1: Create decimal-safe SAR primitives

**Files:**
- Create: `apps/web/src/features/pricing/sar-money.ts`
- Create: `apps/web/src/features/pricing/index.ts`
- Create: `apps/web/src/test/sar-money.test.ts`

**Interfaces:**

```ts
export type SarAmount = string;

export function normalizeSarAmount(value: unknown): SarAmount | null;
export function validateSarInput(value: string):
  | { ok: true; value: SarAmount | null }
  | { ok: false; error: string };
export function sarToHalalas(value: SarAmount): bigint;
export function halalasToSar(value: bigint): SarAmount;
export function multiplySar(value: SarAmount, quantity: number): SarAmount;
export function formatSar(value: SarAmount, locale: "en" | "ar"): string;
export function minSar(values: readonly SarAmount[]): SarAmount | null;
```

- [ ] **Step 1: Write failing validation/format tests**

Lock:

```text
"" -> null
"120" -> "120.00"
"120.5" -> "120.50"
"120.50" -> "120.50"
0 -> "0.00"
"0.00" -> "0.00"
"-1" -> invalid
"12.345" -> invalid
"abc" -> invalid
0.10 * 3 -> 0.30 exactly
```

- [ ] **Step 2: Implement normalization with decimal strings + BigInt halalas**

Do not sum binary floating-point values.

- [ ] **Step 3: Implement locale display formatter**

`Intl.NumberFormat` is display-only; arithmetic remains exact.

- [ ] **Step 4: Run and commit**

```bash
pnpm --filter @rosa/web test -- src/test/sar-money.test.ts
git add apps/web/src/features/pricing apps/web/src/test/sar-money.test.ts
git commit -m "feat(pricing): add exact SAR money primitives"
```

---

### Task 2: Extend live catalogue types with prices and real configurations

**Files:**
- Modify: `apps/web/src/features/catalogue-live/catalogue-live.types.ts`
- Modify: `apps/web/src/features/catalogue-registry/types.ts`
- Modify: `apps/web/src/features/catalogue-live/catalogue-live.repository.ts`
- Modify: `apps/web/src/features/catalogue-live/map-live-product.ts`
- Test: create `apps/web/src/test/catalogue-live-pricing.test.ts`
- Run existing catalogue parity/live tests after the focused test.

**Interfaces:**

```ts
export interface LiveProductRow {
  // existing fields
  price: number | string | null;
}

export interface LiveVariantRow {
  id: string;
  product_id: string;
  sku: string | null;
  size: string | null;
  variant_type: string | null;
  price_override: number | string | null;
  created_at: string;
}
```

```ts
export interface CatalogueProductConfiguration {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  priceOverrideSar: SarAmount | null;
}

export interface CatalogueProductRecord {
  // existing fields
  basePriceSar?: SarAmount | null;
  configurations?: readonly CatalogueProductConfiguration[];
}
```

`undefined` is reserved for old static fixture records that have never been through a live pricing projection; loaded live rows normalize missing DB price to `null`.

- [ ] **Step 1: Write failing mapper tests**

Fixture base price `120.00`; variant A override null; variant B `145.50`. Assert base amount, real variant IDs/SKUs/sizes/types and exact overrides survive mapping.

- [ ] **Step 2: Extend every live select**

Add product `price` and variant `id,price_override` to:

- `PUBLIC_PRODUCT_SELECT`;
- public snapshot reader;
- admin snapshot reader;
- projection row path.

- [ ] **Step 3: Map real variant rows into `configurations`**

Sort by existing `created_at` order and normalize prices through `normalizeSarAmount`.

Manifest product descriptive metadata remains intact; real configuration identity is additional live commercial data.

- [ ] **Step 4: Preserve live-only/draft behavior**

Admin-created records receive base/configuration pricing even without static manifest metadata.

- [ ] **Step 5: Run focused + existing catalogue tests and commit**

```bash
pnpm --filter @rosa/web test -- src/test/catalogue-live-pricing.test.ts
git add apps/web/src/features/catalogue-live apps/web/src/features/catalogue-registry apps/web/src/test/catalogue-live-pricing.test.ts
git commit -m "feat(catalogue): project live product pricing"
```

---

### Task 3: Define effective and summary price states

**Files:**
- Create: `apps/web/src/features/pricing/product-price.ts`
- Modify: `apps/web/src/features/pricing/index.ts`
- Test: `apps/web/src/test/product-price.test.ts`

**Interfaces:**

```ts
export function effectiveConfigurationPrice(
  basePriceSar: SarAmount | null | undefined,
  overrideSar: SarAmount | null | undefined
): SarAmount | null;

export type ProductPriceSummary =
  | { kind: "on-request" }
  | { kind: "exact"; amount: SarAmount }
  | { kind: "from"; amount: SarAmount; hasUnpricedOptions: boolean };

export function summarizeProductPrice(product: CatalogueProductRecord): ProductPriceSummary;
export function formatProductPriceSummary(summary: ProductPriceSummary, locale: PublicLocale): string;
```

- [ ] **Step 1: Write summary matrix**

Cover no price, inherited exact base, override range, mixed numeric/unpriced and `0.00` exact state.

- [ ] **Step 2: Implement shared summary logic**

No component reimplements this calculation.

- [ ] **Step 3: Lock localized display states**

English:

```text
Price on request
SAR 120.00
From SAR 120.00
From SAR 120.00 · some options on request
```

Arabic uses the same state machine and locale formatter.

- [ ] **Step 4: Test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/product-price.test.ts
git add apps/web/src/features/pricing apps/web/src/test/product-price.test.ts
git commit -m "feat(pricing): derive product price display states"
```

---

### Task 4: Wire price summaries into Products cards

**Files:**
- Modify: `apps/web/src/features/products/products-discovery.types.ts`
- Modify: `apps/web/src/features/products/products.data.ts`
- Modify: `apps/web/src/features/products/sections/products-result-card.tsx`
- Test: `apps/web/src/test/products-price-display.test.tsx`

**Interfaces:**
- `ProductsDiscoveryItem` gains `priceSummary: ProductPriceSummary`.

- [ ] **Step 1: Write exact/from/on-request card tests**

- [ ] **Step 2: Populate summary in `createProductsDiscoveryItems`**

Call `summarizeProductPrice(sourceProduct)`.

- [ ] **Step 3: Replace current hard-coded Price on request**

Render only `formatProductPriceSummary` output.

- [ ] **Step 4: Run and commit**

```bash
pnpm --filter @rosa/web test -- src/test/products-price-display.test.tsx
git add apps/web/src/features/products apps/web/src/test/products-price-display.test.tsx
git commit -m "feat(products): display live SAR price states"
```

---

### Task 5: Add Admin base price to create and edit flows

**Files:**
- Modify: `apps/web/src/features/admin-products/admin-product-create-form.tsx`
- Modify: `apps/web/src/features/admin-products/admin-product-editor-page.tsx`
- Modify: `apps/web/src/features/admin-products/actions.ts`
- Modify: `apps/web/src/features/admin-products/admin-product-model.ts`
- Test: create/update `apps/web/src/test/admin-product-pricing.test.tsx`

**Interfaces:**
- Form field is exactly `price_sar`.
- Add private helper in `actions.ts` or focused module:

```ts
function formOptionalSar(formData: FormData, key: "price_sar"): SarAmount | null
```

Invalid input throws one user-safe pricing validation error before database writes.

- [ ] **Step 1: Write create/editor field tests**

Label: `Base price — SAR`; hint: blank means Price on request; editor default reflects current base price.

- [ ] **Step 2: Write action validation tests**

Accept blank/zero/integer/1-2 decimals; reject negative/nonnumeric/>2 decimals.

- [ ] **Step 3: Add `price` to `createProduct` insert**

Blank -> null.

- [ ] **Step 4: Add `price` to `saveProduct` update**

After save clear catalogue cache and revalidate Home, Products, Search, current Product Detail and Admin product routes.

- [ ] **Step 5: Add formatted pricing preview to editor**

- [ ] **Step 6: Test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/admin-product-pricing.test.tsx
git add apps/web/src/features/admin-products apps/web/src/test/admin-product-pricing.test.tsx
git commit -m "feat(admin-products): manage base SAR price"
```

---

### Task 6: Add one-row-at-a-time Admin variant price overrides

**Files:**
- Create: `apps/web/src/features/admin-products/admin-variant-pricing.tsx`
- Modify: `apps/web/src/features/admin-products/admin-product-editor-page.tsx`
- Modify: `apps/web/src/features/admin-products/admin-product-model.ts`
- Modify: `apps/web/src/features/admin-products/actions.ts`
- Keep: `apps/web/src/features/admin-products/admin-product-options.tsx` for catalogue metadata display
- Test: `apps/web/src/test/admin-product-pricing.test.tsx`

**Interfaces:**

Admin model gains:

```ts
variantPricing: readonly {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  priceOverrideSar: SarAmount | null;
  effectivePriceSar: SarAmount | null;
}[];
```

Server action is locked to one row:

```ts
export async function saveVariantPriceOverride(formData: FormData): Promise<void>
```

Each row form submits:

```text
product_id
variant_id
family_slug
product_slug
price_override_sar
```

- [ ] **Step 1: Write model tests**

Verify base inheritance, override replacement and null->Price on request.

- [ ] **Step 2: Render one form per real variant row**

Columns:

```text
SKU | Size | Type/Direction | Price override (SAR) | Effective price | Save
```

Blank override explicitly means inherit base.

- [ ] **Step 3: Implement protected one-row action**

Exact sequence:

1. parse IDs/path values;
2. validate price before DB access;
3. `requireAdminUser()`;
4. query `product_variants` by `variant_id` and confirm `product_id` matches submitted product;
5. update only that variant's `price_override`;
6. clear catalogue cache;
7. revalidate public/admin paths.

A failure affects only that one row; no multi-row partial-write problem exists.

- [ ] **Step 4: Keep option metadata separate**

Do not make `AdminProductOptions` a general variant CRUD editor. This task edits price only.

- [ ] **Step 5: Test save/clear/ownership rejection and commit**

```bash
pnpm --filter @rosa/web test -- src/test/admin-product-pricing.test.tsx
git add apps/web/src/features/admin-products apps/web/src/test/admin-product-pricing.test.tsx
git commit -m "feat(admin-products): edit variant SAR overrides"
```

---

### Task 7: Add Admin list/completeness pricing states

**Files:**
- Modify: `apps/web/src/features/admin-products/admin-product-model.ts`
- Modify: `apps/web/src/features/admin-products/admin-products-collection.tsx`
- Modify: `apps/web/src/features/admin-products/admin-products-list-page.tsx`
- Test: `apps/web/src/test/admin-product-pricing.test.tsx`

**Interfaces:**
- `AdminProductRow` gains structured `priceSummary` or already-formatted `priceLabel`; prefer structured summary and format at render.
- `AdminProductCompletenessItem.key` gains `"pricing"`.

- [ ] **Step 1: Write row/completeness tests**

Numeric price present => pricing Present. No numeric effective price => Not supplied. Activation remains allowed in either case.

- [ ] **Step 2: Add compact list pricing state**

Use the same summary formatter as public cards.

- [ ] **Step 3: Test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/admin-product-pricing.test.tsx
git add apps/web/src/features/admin-products apps/web/src/test/admin-product-pricing.test.tsx
git commit -m "feat(admin-products): surface product pricing status"
```

---

### Task 8: Gate C verification

- [ ] **Step 1: Run focused unit tests**

```bash
pnpm --filter @rosa/web test -- \
  src/test/sar-money.test.ts \
  src/test/product-price.test.ts \
  src/test/catalogue-live-pricing.test.ts \
  src/test/products-price-display.test.tsx \
  src/test/admin-product-pricing.test.tsx
```

- [ ] **Step 2: Run existing catalogue/admin regression tests discovered for `catalogue-live` and `admin-products`**

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter @rosa/web typecheck
```

- [ ] **Step 4: Controlled Supabase acceptance**

On a designated test/draft product:

1. blank base -> null;
2. save valid base -> public projection reads it;
3. set one override -> effective override reads it;
4. clear override -> inherits base;
5. clear base -> Price on request.

Restore client-intended data state afterward.

- [ ] **Step 5: Gate boundary**

Do not call full pricing complete at Gate C. Product Detail selection, Inquiry totals and authoritative quote snapshots are Gate D.
