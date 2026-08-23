# Product Configuration + Inquiry Pricing Snapshot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Product Detail configuration-aware, carry trustworthy SAR price states through the existing inquiry cart, re-resolve prices on the server, persist immutable structured quotation line snapshots transactionally, and expose those lines in Admin Inquiry review.

**Architecture:** Product Detail selects one real Supabase variant/configuration record. The existing inquiry localStorage stores a display snapshot but is never authoritative for money. Every cart line has a deterministic `lineId = productId + ":" + configurationId`. `/api/checkout` resolves product/configuration IDs against Supabase, calculates exact SAR values with shared money helpers, then calls one PostgreSQL RPC that creates `quote_requests` plus ordered `quote_request_items` atomically. Admin inquiry reads child rows by `sort_order` and falls back to the historical message for old requests.

**Tech Stack:** React, Next.js Route Handlers, TypeScript, Supabase/PostgreSQL, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Existing inquiry store remains the only browser cart store.
- Same product with different configurations is different inquiry lines.
- `lineId` is deterministic and is the key used for update/remove/merge behavior.
- Real variant configuration ID is used when present; product-only fallback ID is exactly `product:<productId>`.
- Server never trusts client money.
- SAR arithmetic is exact via shared pricing helpers.
- Mixed priced/unpriced inquiries never show a misleading complete total.
- Historical inquiries without structured child rows remain readable.
- Quote parent + ordered line snapshots commit atomically.
- Anonymous browser clients do not gain direct table/RPC access to quote line persistence.

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

```ts
interface ProductConfigurationOption {
  id: string;
  sku: string;
  size: string;
  variantType: string;
  effectivePriceSar: SarAmount | null;
}
```

- [ ] **Step 1: Write failing Product Detail data tests**

A product with base `100.00`, configuration A override null and B override `125.00` must expose two exact selectable configurations with effective prices 100/125.

- [ ] **Step 2: Remove first-array-item configuration behavior**

`sizes[0]`, `variants[0]` and `directions[0]` may remain descriptive table defaults but must not determine the selected cart configuration.

- [ ] **Step 3: Build focused client selector**

If there is one real configuration: show static SKU/size/type context without an unnecessary dropdown.

If multiple: render an accessible selector whose option label includes SKU + size + type when present.

If no real configuration: expose exactly one synthetic option:

```ts
{
  id: `product:${product.id}`,
  sku: product.code,
  size: product.primaryOption ?? "",
  variantType: "",
  effectivePriceSar: product.basePriceSar ?? null
}
```

- [ ] **Step 4: Keep server/client boundary narrow**

Product Detail page remains a server component. Only the procurement/configuration block becomes client state.

- [ ] **Step 5: Update ProductPriceState contract**

```ts
ProductPriceState({ amount, locale }: { amount: SarAmount | null; locale: PublicLocale })
```

Price updates use `aria-live="polite"`.

- [ ] **Step 6: Browser test switching and displayed price**

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/product-detail apps/web/src/test/product-detail-configuration.test.tsx apps/web/tests/e2e/product-detail-pricing.spec.ts
git commit -m "feat(product-detail): select real priced configurations"
```

---

### Task 2: Version the inquiry line model with deterministic configuration identity

**Files:**
- Modify: `apps/web/src/features/inquiry/inquiry-store.ts`
- Modify: Product Detail inquiry controls/builder files
- Test: create/update `apps/web/src/test/inquiry-pricing-store.test.ts`

**Interfaces:**

```ts
export interface InquiryItem {
  lineId: string;
  id: string;                  // product id
  familySlug: string;
  slug: string;
  name: string;
  code: string;
  configurationId: string;
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

export function createInquiryLineId(productId: string, configurationId: string): string {
  return `${productId}:${configurationId}`;
}
```

For synthetic product-only configuration, because `configurationId` already contains `product:<id>`, the resulting lineId is still deterministic and opaque; callers never parse it.

- [ ] **Step 1: Write old-storage migration tests**

An existing V1 record without new fields is normalized to:

```text
configurationId = product:<id>
lineId = createInquiryLineId(id, configurationId)
sku = code
unitPriceSar = null
currency = SAR
```

Do not discard saved inquiry data.

- [ ] **Step 2: Make `lineId` the merge/update/remove key**

- `addInquiryItem`: merge only same `lineId`;
- `updateInquiryItem(lineId, patch)`;
- `removeInquiryItem(lineId)`.

Different configurations of the same product remain separate.

- [ ] **Step 3: Build added item from current selected configuration**

No stale server-rendered first-option item object.

- [ ] **Step 4: Validate snapshot pricing fields during localStorage read**

`unitPriceSar` accepts normalized string/null only; malformed money degrades to null rather than crashing the cart.

- [ ] **Step 5: Run store tests and commit**

```bash
pnpm --filter @rosa/web test -- src/test/inquiry-pricing-store.test.ts
git add apps/web/src/features/inquiry apps/web/src/features/product-detail apps/web/src/test/inquiry-pricing-store.test.ts
git commit -m "feat(inquiry): snapshot selected product configuration"
```

---

### Task 3: Add exact line/basket calculations to Inquiry and Request Quotation

**Files:**
- Create: `apps/web/src/features/inquiry/inquiry-pricing.ts`
- Modify: current Inquiry cart content component under `apps/web/src/features/inquiry/`
- Modify: `apps/web/src/features/inquiry/quotation-page.tsx`
- Modify: `apps/web/src/styles/client-inquiry-cart.css`
- Test: create `apps/web/src/test/inquiry-pricing.test.ts`
- Browser: create `apps/web/tests/e2e/inquiry-pricing.spec.ts`

**Interfaces:**

```ts
export interface InquiryPricingSummary {
  pricedSubtotalSar: SarAmount | null;
  unpricedLineCount: number;
  unpricedQuantity: number;
  totalSar: SarAmount | null;
  allPriced: boolean;
  allUnpriced: boolean;
}

export function inquiryLineSubtotal(item: InquiryItem): SarAmount | null;
export function summarizeInquiryPricing(items: readonly InquiryItem[]): InquiryPricingSummary;
```

- [ ] **Step 1: Write calculation matrix**

Cover one line, quantity multiplication, multiple priced lines, mixed lines, all null and exact `0.10 * 3` behavior.

- [ ] **Step 2: Add unit price + line subtotal to Inquiry rows**

Unpriced line says Price on request.

- [ ] **Step 3: Add exact basket summary semantics**

All priced:

```text
Estimated total — SAR X.XX
```

Mixed:

```text
Priced items subtotal — SAR X.XX
N unpriced line(s) / Q unit(s) — Price on request
Complete quotation total — Pending
```

All unpriced: no zero amount; show that all selected items require quotation pricing.

- [ ] **Step 4: Quantity edits recalculate immediately**

- [ ] **Step 5: Reuse the same summary on Request Quotation**

Remove quantity-only summary as the sole commercial summary; retain total quantity as secondary information if useful.

- [ ] **Step 6: Test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/inquiry-pricing.test.ts
git add apps/web/src/features/inquiry apps/web/src/styles/client-inquiry-cart.css apps/web/src/test/inquiry-pricing.test.ts apps/web/tests/e2e/inquiry-pricing.spec.ts
git commit -m "feat(inquiry): calculate SAR quotation basket totals"
```

---

### Task 4: Add versioned structured quotation-line migration and atomic RPC

**Files:**
- Create: `supabase/migrations/202608230001_quote_request_items.sql`
- Create: `docs/architecture/2026-08-23-quotation-pricing-schema.md`
- Update later: `apps/web/src/lib/supabase/types.ts`

**Interfaces:**
- Table: `public.quote_request_items`.
- RPC: `public.create_quote_request_with_items(...) returns uuid`.

- [ ] **Step 1: Write the migration file before applying it**

Exact table shape:

```sql
create table public.quote_request_items (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  sort_order integer not null check (sort_order >= 0),
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
  created_at timestamptz not null default now(),
  unique (quote_request_id, sort_order)
);

create index idx_quote_request_items_request_id
  on public.quote_request_items(quote_request_id);
```

- [ ] **Step 2: Add current-hash duplicate race protection**

Preflight must assert no duplicate non-null cart hashes. Then:

```sql
create unique index uq_quote_requests_cart_hash
  on public.quote_requests(cart_hash)
  where cart_hash is not null;
```

- [ ] **Step 3: Add atomic `SECURITY INVOKER` RPC**

Signature:

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

Implementation uses `jsonb_array_elements(p_items) with ordinality`, storing `ordinality - 1` as `sort_order`. In one function invocation/transaction:

1. insert `quote_requests` (`user_id=null`, `status='New'`, `product_id=null` for multi-line request);
2. capture request UUID;
3. insert every item with stable order;
4. return request UUID.

- [ ] **Step 4: Lock grants/RLS**

Revoke execute from `public`, `anon`, `authenticated`; grant only to server service role used by `createAdminClient`. Child table gets no direct anonymous read/write policy.

- [ ] **Step 5: Apply through Supabase migration tooling**

No undocumented dashboard-only DDL.

- [ ] **Step 6: Post-migration checks**

Verify constraints/index/RPC/grants, then run security and performance advisors.

- [ ] **Step 7: Commit migration/docs**

```bash
git add supabase/migrations/202608230001_quote_request_items.sql docs/architecture/2026-08-23-quotation-pricing-schema.md
git commit -m "feat(db): add transactional quotation line snapshots"
```

---

### Task 5: Resolve authoritative prices and submit through the RPC

**Files:**
- Modify: `apps/web/src/features/inquiry/quotation-payload.ts`
- Create: `apps/web/src/features/inquiry/quotation-pricing-server.ts`
- Modify: `apps/web/src/app/api/checkout/route.ts`
- Modify: `apps/web/src/lib/supabase/types.ts`
- Test: create `apps/web/src/test/quotation-authoritative-pricing.test.ts`

**Interfaces:**

```ts
interface AuthoritativeQuoteLine {
  sortOrder: number;
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

- [ ] **Step 1: Write forged-price test**

Client sends `unitPriceSar="0.01"`; mocked DB says 120.00. RPC payload must contain 120.00.

- [ ] **Step 2: Batch-load requested product/variant identities**

Avoid N+1 reads. Verify variant belongs to submitted product. Reject missing/inactive product safely.

- [ ] **Step 3: Resolve server price**

Use DB base + DB override only. Client price is ignored except it may remain in browser display before submission.

- [ ] **Step 4: Build readable compatibility message from authoritative lines**

- [ ] **Step 5: Call `create_quote_request_with_items` RPC**

Translate unique `cart_hash` violation to existing 409 duplicate response.

- [ ] **Step 6: Preserve duplicate hash semantics**

Hash identity/configuration/quantity/notes/customer envelope, not price, so a price change does not make an accidental duplicate look unique. Keep legacy hash candidate check for historical rows.

- [ ] **Step 7: Test matrix**

Priced, override, unpriced, mixed, forged price, wrong variant ownership, inactive/missing product, duplicate, RPC failure.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/features/inquiry/quotation-payload.ts apps/web/src/features/inquiry/quotation-pricing-server.ts apps/web/src/app/api/checkout/route.ts apps/web/src/lib/supabase/types.ts apps/web/src/test/quotation-authoritative-pricing.test.ts
git commit -m "feat(quotation): persist authoritative priced line snapshots"
```

---

### Task 6: Read structured ordered lines in Admin inquiries with legacy fallback

**Files:**
- Modify: `apps/web/src/app/api/inquiries/route.ts`
- Modify: `apps/web/src/features/admin-inquiries/admin-inquiries-page.tsx`
- Create: `apps/web/src/features/admin-inquiries/admin-inquiry-pricing.tsx`
- Modify: `apps/web/src/lib/supabase/types.ts`
- Modify: existing Admin operations CSS file used by inquiry cards
- Test: create `apps/web/src/test/admin-inquiry-pricing.test.tsx`

**Interfaces:**

```ts
export interface QuoteRequestItem {
  id: string;
  quote_request_id: string;
  sort_order: number;
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

- [ ] **Step 1: Write API/model test**

Items are sorted by `sort_order ASC`.

- [ ] **Step 2: Extend protected inquiry read**

Fetch child lines with quote requests or in one batched secondary query; no public exposure.

- [ ] **Step 3: Render structured commercial breakdown**

Product/code/SKU, configuration, quantity, unit price, line subtotal, notes and exact/mixed summary.

- [ ] **Step 4: Keep legacy fallback**

Zero child rows -> render existing `record.message` and no empty pricing table.

- [ ] **Step 5: Preserve status/private-note/delete workflow**

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

- [ ] **Step 3: Real Supabase controlled acceptance**

Use designated test/draft configuration with base 100.00, override 125.00 and an unpriced scenario. Submit and query parent/children. Assert order, exact authoritative prices/subtotals and absence of forged client values.

- [ ] **Step 4: Verify duplicate behavior**

One parent + one ordered child set only; no orphan rows.

- [ ] **Step 5: Verify Admin structured + legacy records**

- [ ] **Step 6: Run Supabase security/performance advisors**

- [ ] **Step 7: Typecheck**

```bash
pnpm --filter @rosa/web typecheck
```
