# SAR Pricing — Live Catalogue, Admin + Public Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Supabase base-price and variant-override fields first-class, editable SAR data that flows safely into live catalogue records, Admin Product surfaces and public product/card price states without inventing values.

**Architecture:** Preserve Supabase as source of truth. Extend the live projection with product price plus real variant identity/override, normalize money into decimal strings at application boundaries, centralize SAR formatting/effective-price logic in a small pricing module, then wire Admin create/edit/override operations and public card/detail consumers. No new pricing database column is required in this gate because `products.price` and `product_variants.price_override` already exist.

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
- Public card summary must distinguish exact / From / partially unpriced / fully unpriced states.
- Admin pricing absence does not block product activation.

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
export function validateSarInput(value: string): { ok: true; value: SarAmount | null } | { ok: false; error: string };
export function sarToHalalas(value: SarAmount): bigint;
export function halalasToSar(value: bigint): SarAmount;
export function multiplySar(value: SarAmount, quantity: number): SarAmount;
export function formatSar(value: SarAmount, locale: "en" | "ar"): string;
export function minSar(values: readonly SarAmount[]): SarAmount | null;
```

- [ ] **Step 1: Write failing validation/format tests**

Required cases:

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
```

Arithmetic:

```text
120.50 * 3 = 361.50
0.10 * 3 = 0.30 exactly
```

This exact `0.10` test prevents binary-float accumulation.

- [ ] **Step 2: Implement normalization using decimal strings / BigInt halalas**

Do not sum JS floating-point numbers.

Input normalization may accept a finite number from Supabase but immediately convert to a two-decimal string.

- [ ] **Step 3: Implement locale formatter**

Use `Intl.NumberFormat` only for display after exact amount is normalized. Do not use formatted strings for arithmetic.

- [ ] **Step 4: Run test**

```bash
pnpm --filter @rosa/web test -- src/test/sar-money.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/pricing apps/web/src/test/sar-money.test.ts
git commit -m "feat(pricing): add exact SAR money primitives"
```

---

### Task 2: Extend catalogue/live types with price and real configurations

**Files:**
- Modify: `apps/web/src/features/catalogue-live/catalogue-live.types.ts`
- Modify: `apps/web/src/features/catalogue-registry/types.ts`
- Modify: `apps/web/src/features/catalogue-live/catalogue-live.repository.ts`
- Modify: `apps/web/src/features/catalogue-live/map-live-product.ts`
- Test: create/update `apps/web/src/test/catalogue-live-pricing.test.ts`
- Test: relevant existing catalogue parity tests

**Interfaces:**

Extend live rows:

```ts
export interface LiveProductRow {
  // existing
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

Add registry configuration:

```ts
export interface CatalogueProductConfiguration {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  priceOverrideSar: SarAmount | null;
}

export interface CatalogueProductRecord {
  // existing
  basePriceSar?: SarAmount | null;
  configurations?: readonly CatalogueProductConfiguration[];
}
```

Prefer explicit `null` for loaded live no-price state; optional remains necessary for static legacy fixtures only if changing every fixture is unnecessarily broad.

- [ ] **Step 1: Write failing mapper tests**

Snapshot fixture should include:

```ts
product.price = "120.00"
variant A price_override = null
variant B price_override = "145.50"
```

Assert mapped record keeps:

- base `120.00`;
- variant IDs;
- SKU/size/type;
- A override null;
- B override `145.50`.

- [ ] **Step 2: Extend every public/admin Supabase select**

Add `price` to products selections and `id,price_override` to variant selections, including `PUBLIC_PRODUCT_SELECT`, `supabaseCatalogueReader`, `adminCatalogueReader` and any projection-row path.

Do not update only one reader; public/admin must agree.

- [ ] **Step 3: Map live variants into configurations**

Use actual snapshot variants, sorted by `created_at`, and normalize monetary values through `normalizeSarAmount`.

Manifest products still retain verified catalogue metadata for descriptive sizes/variants, but price selection later consumes real `configurations`.

- [ ] **Step 4: Preserve live-only product behavior**

New admin-created products also receive base price/configurations without requiring a static manifest.

- [ ] **Step 5: Run live catalogue + parity tests**

```bash
pnpm --filter @rosa/web test -- src/test/catalogue-live-pricing.test.ts
```

Then run the existing `catalogue-live`/migration tests identified by test search.

- [ ] **Step 6: Commit**

```bash
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

Cases:

1. no base, no configurations/overrides -> on-request;
2. base 120, all configs inherit -> exact 120;
3. base 120, one override 145 -> from 120, no unpriced options;
4. no base, overrides 120 and 145 -> from 120, `hasUnpricedOptions` true if another config has null;
5. one config override 120 and no base -> exact 120 only when all selectable configs resolve to 120;
6. 0.00 remains exact zero, not on-request.

- [ ] **Step 2: Implement pure summary logic**

Use exact normalized amounts; de-duplicate by decimal string.

- [ ] **Step 3: Localize display**

English compact states:

```text
Price on request
SAR 120.00
From SAR 120.00
From SAR 120.00 · some options on request
```

Arabic equivalent goes through the same formatter/copy table.

- [ ] **Step 4: Run tests and commit**

```bash
git add apps/web/src/features/pricing apps/web/src/test/product-price.test.ts
git commit -m "feat(pricing): derive product price display states"
```

---

### Task 4: Wire pricing into Products result cards

**Files:**
- Modify: `apps/web/src/features/products/products-discovery.types.ts`
- Modify: `apps/web/src/features/products/products.data.ts`
- Modify: `apps/web/src/features/products/sections/products-result-card.tsx`
- Test: `apps/web/src/test/products-price-display.test.tsx`

**Interfaces:**
- `ProductsDiscoveryItem` gains `priceSummary: ProductPriceSummary`.

- [ ] **Step 1: Write failing card tests**

Render cards for exact/from/on-request states and assert correct localized copy.

- [ ] **Step 2: Populate summary in `createProductsDiscoveryItems`**

Call shared `summarizeProductPrice`; do not recreate price logic inside the card.

- [ ] **Step 3: Replace hard-coded `Price on request`**

`ProductsResultCard` displays `formatProductPriceSummary(product.priceSummary, locale)`.

- [ ] **Step 4: Run test and commit**

```bash
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
- Modify: `apps/web/src/lib/supabase/types.ts` only if current types need nullable/string precision adjustment
- Test: create/update `apps/web/src/test/admin-product-pricing.test.tsx`
- Test: action tests if current repository has admin action mocks

**Interfaces:**
- Form field name: `price_sar`.
- Helper: `formOptionalSar(formData, "price_sar")` returning exact decimal string/null or throwing user-safe validation error.

- [ ] **Step 1: Write form rendering tests**

Create form and editor must expose:

```text
Base price — SAR
Blank means Price on request
```

Editor default value reflects current base price.

- [ ] **Step 2: Write action validation tests**

Accept blank, 0, integer and two-decimal values. Reject negative, nonnumeric and >2 decimals.

- [ ] **Step 3: Add optional price to `createProduct` insert**

```ts
price: parsedPrice
```

No price -> null.

- [ ] **Step 4: Add price to `saveProduct` update**

Also revalidate:

```text
/
/products
/search
/products/<family>/<product>
/admin/products
/admin/products/<family>/<product>
```

Clear catalogue projection cache.

- [ ] **Step 5: Add pricing preview in Admin editor**

Show formatted current base price or Price on request next to field/help text.

- [ ] **Step 6: Run tests and commit**

```bash
git add apps/web/src/features/admin-products apps/web/src/test/admin-product-pricing.test.tsx
git commit -m "feat(admin-products): manage base SAR price"
```

---

### Task 6: Add Admin per-variant price overrides

**Files:**
- Create: `apps/web/src/features/admin-products/admin-variant-pricing.tsx`
- Modify: `apps/web/src/features/admin-products/admin-product-editor-page.tsx`
- Modify: `apps/web/src/features/admin-products/admin-product-model.ts`
- Modify: `apps/web/src/features/admin-products/actions.ts`
- Modify/retain: `apps/web/src/features/admin-products/admin-product-options.tsx`
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

Server action:

```ts
export async function saveVariantPrices(formData: FormData): Promise<void>
```

Form fields use variant ID keys, e.g. `variant_price_<uuid>` or a JSON payload generated server-safely. Prefer explicit hidden `variant_id` rows only if each row is its own form; avoid trusting arbitrary product IDs from the client without ownership validation.

- [ ] **Step 1: Write model tests**

Assert base inheritance and override replacement.

- [ ] **Step 2: Render pricing table**

Columns:

```text
SKU | Size | Type/Direction | Price override (SAR) | Effective price
```

- [ ] **Step 3: Implement protected save action**

Requirements:

1. `requireAdminUser()`;
2. load product/variant relationship or filter updates by known product ID;
3. validate every amount;
4. update only submitted variants belonging to that product;
5. clear cache/revalidate public/admin paths.

If batch atomicity cannot be guaranteed by simple sequential updates, use an RPC/transactional SQL function only if already supported; otherwise perform validation for all rows before writing so a validation failure cannot cause partial updates.

- [ ] **Step 4: Keep documented options separate from pricing**

Do not turn the existing catalogue-metadata option editor into a general variant CRUD feature. Pricing table edits price only.

- [ ] **Step 5: Run tests and commit**

```bash
git add apps/web/src/features/admin-products apps/web/src/test/admin-product-pricing.test.tsx
git commit -m "feat(admin-products): edit variant SAR overrides"
```

---

### Task 7: Add Admin list/completeness pricing states

**Files:**
- Modify: `apps/web/src/features/admin-products/admin-product-model.ts`
- Modify: `apps/web/src/features/admin-products/admin-products-collection.tsx`
- Modify: `apps/web/src/features/admin-products/admin-products-list-page.tsx` if row presentation lives there
- Modify: `apps/web/src/features/admin-products/admin-product-completeness.tsx` only if key rendering requires it
- Test: `apps/web/src/test/admin-product-pricing.test.tsx`

**Interfaces:**
- `AdminProductRow` gains `priceLabel: string` or structured `priceSummary`.
- `AdminProductCompletenessItem.key` gains `"pricing"`.

- [ ] **Step 1: Write row/completeness tests**

Price absence is a valid `Price on request` business state, but completeness should report whether numeric pricing is configured.

Recommended completeness state:

```text
Present          => at least one numeric effective price exists
Not supplied     => no numeric price configured
```

It must not block activation.

- [ ] **Step 2: Add compact pricing column/badge to Admin product collection**

Use the shared formatter/summary logic.

- [ ] **Step 3: Run tests and commit**

```bash
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

- [ ] **Step 2: Run existing catalogue/admin regression groups**

Use test file discovery to run all current tests referencing `catalogue-live`, `admin-products`, `map-live-product` and product pages.

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter @rosa/web typecheck
```

- [ ] **Step 4: Supabase non-destructive acceptance**

Using a designated test/draft product, verify:

1. blank base price -> null;
2. save valid base price -> public projection reads it;
3. set one variant override -> effective override reads it;
4. clear override -> inherits base;
5. clear base -> Price on request.

Restore the test product to the client's intended data state after acceptance.

- [ ] **Step 5: Do not claim pricing complete yet**

Gate C proves source/admin/public price projection only. Inquiry/server snapshot work belongs to Gate D.
