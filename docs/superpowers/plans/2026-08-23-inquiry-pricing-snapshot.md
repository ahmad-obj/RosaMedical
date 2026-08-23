# Product Configuration + Inquiry Pricing Snapshot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Product Detail configuration-aware, carry trustworthy SAR price states through the existing inquiry cart, re-resolve prices on the server, persist immutable structured quotation line snapshots transactionally, and expose those lines in Admin Inquiry review.

**Architecture:** Product Detail selects one real Supabase variant/configuration record. The existing inquiry localStorage stores a display snapshot but is never authoritative for money. `/api/checkout` resolves product/configuration IDs against Supabase, calculates exact SAR values with shared money helpers, then calls one transaction-capable database RPC that creates `quote_requests` plus `quote_request_items` atomically. Admin inquiry reads child rows and falls back to the historical message for old requests.

**Tech Stack:** React, Next.js Route Handlers, TypeScript, Supabase/PostgreSQL, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Existing inquiry store remains the only browser cart store.
- Same product with different configurations is different inquiry lines.
- Server never trusts client money.
- SAR arithmetic is exact via shared pricing helpers.
- Mixed priced/unpriced inquiries never show a misleading complete total.
- Historical inquiries without structured child rows remain readable.
- Quote parent + line snapshots must commit atomically.
- Anonymous browser clients do not gain direct table access to quote line rows.

---

### Task 1: Replace static Product Detail options with real configuration state

**Files:**
- Modify: `apps/web/src/features/product-detail/product-detail.data.ts`
- Modify: `apps/web/src/features/product-detail/product-procurement-summary.tsx`
- Create: `apps/web/src/features/product-detail/product-configuration-selector.tsx`
- Modify: `apps/web/src/features/product-detail/product-detail-page.tsx`
- Modify: `apps/web/src/features/product-detail/product-price-state.tsx`
- Test: create `apps/web/src/test/product-detail-configuration.test.tsx`
- Browser: create `apps/web/tests/e2e/product-detail-pricing.spec.ts`

**Interfaces:**
- Consumes `CatalogueProductRecord.configurations` from Gate C.
- Produces a controlled selected configuration and an inquiry-item builder.

Recommended UI-facing configuration:

```ts
interface ProductConfigurationOption {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  effectivePriceSar: SarAmount | null;
}
```

- [ ] **Step 1: Write failing data tests**

For product configurations A/B assert Product Detail data keeps both and derives exact effective price via base/override helper.

- [ ] **Step 2: Stop using `sizes[0]` / `variants[0]` as canonical selected configuration**

Keep specification tables descriptive, but selection/add-to-inquiry must use one real configuration row.

- [ ] **Step 3: Build selector component**

If one configuration:

- render static SKU/size/type context;
- no pointless select.

If multiple:

- use accessible `<select>` or equivalent native-semantic control;
- label each option with useful configuration identity, e.g. `18-0402 · 16.0 cm` plus type if present;
- selected price updates immediately.

If no real configuration rows exist:

- fall back to product-level identity and base price;
- create a stable product-only configuration key for inquiry identity.

- [ ] **Step 4: Make Product Procurement Summary a client boundary only where necessary**

Do not convert the whole Product Detail page to client rendering. Isolate configuration state to a focused client component that receives serializable product/configuration data from the server component.

- [ ] **Step 5: Update ProductPriceState**

Props:

```ts
{ amount: SarAmount | null; locale: PublicLocale }
```

Render exact SAR or Price on request, with `aria-live="polite"` on configuration-driven updates.

- [ ] **Step 6: Browser test configuration switching**

Select a configuration with override and assert displayed price changes; select unpriced configuration and assert Price on request.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/product-detail apps/web/src/test/product-detail-configuration.test.tsx apps/web/tests/e2e/product-detail-pricing.spec.ts
git commit -m "feat(product-detail): select real priced configurations"
```

---

### Task 2: Version the inquiry item model for configuration/price snapshots

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-store.ts`
- Modify: Product Detail inquiry-control builder/component files
- Test: `apps/web/src/test/inquiry-store.test.ts` and/or create `inquiry-pricing-store.test.ts`

**Interfaces:**

Extend `InquiryItem`:

```ts
export interface InquiryItem {
  id: string;                  // product id
  familySlug: string;
  slug: string;
  name: string;
  code: string;
  configurationId: string;     // real variant id or stable "product:<id>" fallback
  sku: string;
  size: string;
  variant: string;
  quantity: number;
  notes: string;
  unitPriceSar: SarAmount | null;
  currency: "SAR";
  mediaPath?: string;
  mediaFallbackPath?: string;
  imageLabel?: string;
}
```

- [ ] **Step 1: Write backward-compatibility tests**

Existing `rosa-medical-inquiry-v1` localStorage records without new pricing fields must not crash the page.

Migration strategy:

- old item gets `configurationId = "product:" + id`;
- `sku = code`;
- `unitPriceSar = null`;
- `currency = "SAR"`.

Do not drop an old customer's saved inquiry merely because the schema evolved.

- [ ] **Step 2: Change duplicate identity**

Replace current same-line logic (`familySlug + slug`) with:

```ts
product id + configurationId
```

or an equivalent stable combination.

- [ ] **Step 3: Update Product Detail add action**

Build the item from the currently selected configuration, not a server-rendered first-option snapshot.

- [ ] **Step 4: Keep update/remove APIs stable**

`updateInquiryItem` may need a stable line key rather than product ID because one product can now appear twice. Recommended: add derived `lineId = productId + ":" + configurationId` and use it for update/remove. If adding `lineId`, migrate old storage deterministically.

- [ ] **Step 5: Run store tests and commit**

```bash
git add apps/web/src/features/inquiry apps/web/src/features/product-detail apps/web/src/test/inquiry-pricing-store.test.ts
git commit -m "feat(inquiry): snapshot selected product configuration"
```

---

### Task 3: Add exact line/basket price calculations to Inquiry and Quotation UI

**Files:**
- Create: `apps/web/src/features/inquiry/inquiry-pricing.ts`
- Modify: `apps/web/src/features/inquiry/inquiry-content.tsx` or current Inquiry cart content component
- Modify: `apps/web/src/features/inquiry/quotation-page.tsx`
- Modify: `apps/web/src/styles/client-inquiry-cart.css`
- Test: create `apps/web/src/test/inquiry-pricing.test.ts`
- Test: create/update Inquiry component tests
- Browser: create `apps/web/tests/e2e/inquiry-pricing.spec.ts`

**Interfaces:**

```ts
export interface InquiryPricingSummary {
  pricedSubtotalSar: SarAmount | null;
  unpricedLineCount: number;
  totalSar: SarAmount | null;
  allPriced: boolean;
  allUnpriced: boolean;
}

export function inquiryLineSubtotal(item: InquiryItem): SarAmount | null;
export function summarizeInquiryPricing(items: readonly InquiryItem[]): InquiryPricingSummary;
```

- [ ] **Step 1: Write calculation matrix**

Cases:

- one priced line;
- quantity multiplication;
- two priced lines;
- mixed priced + null;
- all null;
- exact `0.10 * 3` behavior.

- [ ] **Step 2: Add line pricing to Inquiry**

Each row shows:

```text
Unit price
Quantity
Line subtotal
```

Unpriced row shows Price on request.

- [ ] **Step 3: Add basket summary**

All priced:

```text
Estimated total   SAR X.XX
```

Mixed:

```text
Priced items subtotal   SAR X.XX
N items/lines            Price on request
Complete quotation total Pending
```

All unpriced:

```text
All selected items require quotation pricing
```

- [ ] **Step 4: Quantity changes recalculate immediately**

Browser test modifies quantity and checks line + basket display.

- [ ] **Step 5: Mirror summary on Request Quotation**

`quotation-page.tsx` currently shows total quantity only. Add the same centralized pricing summary; do not reimplement arithmetic.

- [ ] **Step 6: Run tests and commit**

```bash
git add apps/web/src/features/inquiry apps/web/src/styles/client-inquiry-cart.css apps/web/src/test/inquiry-pricing.test.ts apps/web/tests/e2e/inquiry-pricing.spec.ts
git commit -m "feat(inquiry): calculate SAR quotation basket totals"
```

---

### Task 4: Add versioned structured quotation-line migration

**Files:**
- Create: `supabase/migrations/202608230001_quote_request_items.sql`
- Create/update migration documentation: `docs/architecture/2026-08-23-quotation-pricing-schema.md`
- Update generated/manual types later: `apps/web/src/lib/supabase/types.ts`
- Test: SQL acceptance through Supabase project/branch and application API tests

**Interfaces:**
- Produces table `public.quote_request_items`.
- Produces RPC `public.create_quote_request_with_items(...)` returning quote request UUID.

- [ ] **Step 1: Write migration SQL in source control before applying it**

Table contract:

```sql
create table public.quote_request_items (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  product_id uuid null references public.products(id) on delete set null,
  product_variant_id uuid null references public.product_variants(id) on delete set null,
  product_name text not null,
  product_code text not null,
  sku text null,
  size text null,
  variant_type text null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(14,2) null check (unit_price is null or unit_price >= 0),
  currency text not null default 'SAR' check (currency = 'SAR'),
  line_subtotal numeric(16,2) null check (line_subtotal is null or line_subtotal >= 0),
  notes text null,
  created_at timestamptz not null default now()
);

create index idx_quote_request_items_request_id
  on public.quote_request_items(quote_request_id);
```

- [ ] **Step 2: Add duplicate-race protection for current cart hash**

Current production has a small set of non-null cart hashes and no duplicate hash values. Add:

```sql
create unique index uq_quote_requests_cart_hash
  on public.quote_requests(cart_hash)
  where cart_hash is not null;
```

Before applying, run a preflight query that rejects migration if duplicate non-null hashes exist.

The application keeps legacy hash-candidate lookup for historical compatibility, but the current generated hash also gets database race protection.

- [ ] **Step 3: Add atomic RPC**

Create a `SECURITY INVOKER` function conceptually:

```sql
public.create_quote_request_with_items(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_cart_hash text,
  p_items jsonb
) returns uuid
```

Inside one PostgreSQL transaction/function invocation:

1. insert `quote_requests`;
2. capture ID;
3. insert every JSON item into `quote_request_items`;
4. return request ID.

Validate item JSON inside the function sufficiently to protect constraints and line ownership assumptions already established by app-side authoritative resolution.

Grant execute only to the role used by the server-side Supabase admin/service client; revoke public/anon/authenticated execute unless explicitly required.

- [ ] **Step 4: Enable appropriate RLS/access**

If RLS is enabled on sibling operational tables, match that posture. Anonymous browser users must not be able to select/insert child snapshots directly.

- [ ] **Step 5: Apply migration using Supabase migration tooling**

Do not paste one-off undocumented SQL into production and lose migration history.

If a development database branch is available, apply/test there first. If not, use the approved production migration path with explicit preflight and rollback/forward-fix notes.

- [ ] **Step 6: Run post-migration checks**

Check:

- table/constraints/index/function exist;
- duplicate index succeeds;
- anon cannot read/write line rows;
- service/admin path can execute RPC;
- security advisor;
- performance advisor for missing FK/index warnings.

- [ ] **Step 7: Commit migration/docs**

```bash
git add supabase/migrations/202608230001_quote_request_items.sql docs/architecture/2026-08-23-quotation-pricing-schema.md
git commit -m "feat(db): add transactional quotation line snapshots"
```

---

### Task 5: Re-resolve authoritative price on `/api/checkout`

**Files:**
- Modify: `apps/web/src/features/inquiry/quotation-payload.ts`
- Create: `apps/web/src/features/inquiry/quotation-pricing-server.ts`
- Modify: `apps/web/src/app/api/checkout/route.ts`
- Modify: `apps/web/src/lib/supabase/types.ts`
- Test: create `apps/web/src/test/quotation-authoritative-pricing.test.ts`
- Test: existing checkout route tests

**Interfaces:**

Normalized request items accept identity/configuration but client price is ignored for persistence.

Server result:

```ts
interface AuthoritativeQuoteLine {
  productId: string;
  productVariantId: string | null;
  productName: string;
  productCode: string;
  sku: string;
  size: string;
  variantType: string;
  quantity: number;
  unitPriceSar: SarAmount | null;
  lineSubtotalSar: SarAmount | null;
  notes: string;
}
```

- [ ] **Step 1: Write tampering test before implementation**

Submit item with client `unitPriceSar: "0.01"` while mocked Supabase says base/override is `120.00`.

Expected persisted/RPC line uses `120.00`, never `0.01`.

- [ ] **Step 2: Resolve identity in one batched read where practical**

Avoid N+1 queries for up to 50 lines.

Load requested products and variants by IDs, then verify:

- every product exists/active as appropriate for quotation;
- each variant belongs to its submitted product;
- item code/name snapshot comes from authoritative live row;
- effective price derives from DB base/override.

If a product becomes inactive between cart add and submit, choose safe behavior: reject with a user-safe `selected product is no longer available` message rather than quoting stale data silently.

- [ ] **Step 3: Preserve human-readable message**

Build `formatQuotationMessage` from normalized customer data plus authoritative lines, including price state where useful. The message is compatibility/readability, not source of truth.

- [ ] **Step 4: Call RPC instead of direct parent insert**

`/api/checkout` performs duplicate candidate check, then `rpc("create_quote_request_with_items", ...)`.

Handle unique cart hash conflict as 409 duplicate request.

- [ ] **Step 5: Include authoritative lines in quotation hash policy carefully**

The duplicate hash should remain based on customer-selected identity/configuration/quantity/notes, not volatile current prices, so a price edit does not allow an otherwise identical accidental double submission. Preserve legacy hash candidates during migration window.

- [ ] **Step 6: Run API tests**

Cases:

```text
priced product
variant override
unpriced product
mixed basket
forged client amount
variant does not belong to product
missing/inactive product
duplicate cart hash
RPC/database failure
```

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/inquiry/quotation-payload.ts apps/web/src/features/inquiry/quotation-pricing-server.ts apps/web/src/app/api/checkout/route.ts apps/web/src/lib/supabase/types.ts apps/web/src/test/quotation-authoritative-pricing.test.ts
git commit -m "feat(quotation): persist authoritative priced line snapshots"
```

---

### Task 6: Read structured lines in Admin inquiries with legacy fallback

**Files:**
- Modify: `apps/web/src/app/api/inquiries/route.ts`
- Modify: `apps/web/src/features/admin-inquiries/admin-inquiries-page.tsx`
- Create: `apps/web/src/features/admin-inquiries/admin-inquiry-pricing.tsx`
- Modify: `apps/web/src/lib/supabase/types.ts`
- Modify: admin inquiry CSS file identified during implementation
- Test: create/update `apps/web/src/test/admin-inquiry-pricing.test.tsx`
- Browser: protected admin acceptance where session is available

**Interfaces:**

Add type:

```ts
export interface QuoteRequestItem {
  id: string;
  quote_request_id: string;
  product_id: string | null;
  product_variant_id: string | null;
  product_name: string;
  product_code: string;
  sku: string | null;
  size: string | null;
  variant_type: string | null;
  quantity: number;
  unit_price: number | string | null;
  currency: "SAR";
  line_subtotal: number | string | null;
  notes: string | null;
  created_at: string;
}

export interface QuoteRequestWithItems extends QuoteRequest {
  items: readonly QuoteRequestItem[];
}
```

- [ ] **Step 1: Write route/model test**

Admin API response must return items sorted deterministically by creation/id.

- [ ] **Step 2: Extend protected query**

Fetch quote requests plus child lines using Supabase relation select or two batched queries. Do not expose this relation in public API routes.

- [ ] **Step 3: Build structured line UI**

For new records render:

```text
Product / code / SKU
Configuration
Quantity
Unit price
Line subtotal
Notes
```

Then summary with exact/mixed semantics.

- [ ] **Step 4: Legacy fallback**

If `items.length === 0`, render existing `record.message` exactly as the operational fallback. Do not show an empty pricing table.

- [ ] **Step 5: Preserve status/private-note/delete functions**

Pricing review must not regress existing admin workflow controls.

- [ ] **Step 6: Test and commit**

```bash
git add apps/web/src/app/api/inquiries/route.ts apps/web/src/features/admin-inquiries apps/web/src/lib/supabase/types.ts apps/web/src/test/admin-inquiry-pricing.test.tsx
git commit -m "feat(admin-inquiries): review structured quotation pricing"
```

---

### Task 7: Gate D end-to-end verification

- [ ] **Step 1: Run focused unit/API tests**

```bash
pnpm --filter @rosa/web test -- \
  src/test/product-detail-configuration.test.tsx \
  src/test/inquiry-pricing-store.test.ts \
  src/test/inquiry-pricing.test.ts \
  src/test/quotation-authoritative-pricing.test.ts \
  src/test/admin-inquiry-pricing.test.tsx
```

- [ ] **Step 2: Run Product Detail/Inquiry Playwright**

```bash
pnpm --filter @rosa/web exec playwright test \
  tests/e2e/product-detail-pricing.spec.ts \
  tests/e2e/inquiry-pricing.spec.ts
```

- [ ] **Step 3: Real Supabase acceptance with controlled test data**

Create/use a draft/test product configuration:

- base price 100.00;
- override 125.00;
- one unpriced configuration if needed for mixed case.

Submit quotation and query database to assert:

```text
quote_requests row created
quote_request_items rows count matches cart
unit prices equal DB source
override selected line = 125.00
subtotals exact
client forged amount absent
```

- [ ] **Step 4: Verify duplicate submission behavior**

Same exact request returns existing 409 behavior and does not create orphan child rows.

- [ ] **Step 5: Verify Admin rendering**

Protected owner sees structured rows/totals and an older message-only inquiry still renders.

- [ ] **Step 6: Run Supabase advisors**

Record security/performance findings. Any new critical security issue blocks completion.

- [ ] **Step 7: Typecheck**

```bash
pnpm --filter @rosa/web typecheck
```
