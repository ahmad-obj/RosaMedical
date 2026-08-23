# Client Review Integration + Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the complete 2026-08-23 client-review implementation is functionally correct, visually responsive, price-safe, accessible, migration-safe and Cloudflare-ready before the prepared transfer branch is allowed to replace the deployment repository main branch.

**Architecture:** Verification is layered: focused regressions per subsystem, cross-route browser acceptance, real Supabase pricing/quotation acceptance, full repository build/test gates, then deployment-config diff and final handoff record. Evidence is fresh; old green runs are not reused as proof of new code.

**Tech Stack:** Vitest, Playwright Chromium, Next.js build, TypeScript, ESLint, Supabase, OpenNext Cloudflare, Wrangler, git.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Do not claim a check passed unless its command/result was observed after the final relevant commit.
- A visual manual review does not replace automated behavior tests.
- Static/source assertions do not replace browser tests for search, filters, media decode, URL navigation or responsive geometry.
- Real Supabase acceptance is required for Admin pricing and server-authoritative quotation snapshots.
- Do not deploy directly during verification.
- Do not alter Cloudflare config merely to make a failing app build pass.

---

### Task 1: Add one client-review regression manifest

**Files:**
- Create: `apps/web/src/test/client-review-round-2026-08-23.test.ts`
- Keep/update: `apps/web/src/test/client-review-round-2026-08-22.test.ts`

**Interfaces:**
- Produces a fast static contract covering architecture that should never drift silently.

- [ ] **Step 1: Add source-level assertions only for appropriate invariants**

Good static assertions:

- Products has no `RelatedProductGrid` render/import;
- Homepage gallery consumes `CATALOGUE_DOCUMENTS` and not `familyHref`;
- live Supabase projection selects `price` and variant `price_override`;
- Admin editor contains pricing section/form field;
- Inquiry item type contains configuration/pricing snapshot fields;
- shared hero geometry lives in public hero CSS, not Home-only sizing;
- Comprehensive lead/support rows share 80rem final rail;
- family routing path contains filtered Products redirect behavior;
- quote line migration file exists.

Do not assert browser behavior from source strings.

- [ ] **Step 2: Run static regression**

```bash
pnpm --filter @rosa/web test -- src/test/client-review-round-2026-08-23.test.ts
```

Expected: PASS.

- [ ] **Step 3: Commit if this test was not already committed with feature gates**

---

### Task 2: Cross-route hero and shared shell matrix

**Files:**
- Add/extend: `apps/web/tests/e2e/public-hero-geometry.spec.ts`
- Add/extend: `apps/web/tests/e2e/client-footer-consistency.spec.ts`
- Add: `apps/web/tests/e2e/client-review-responsive-matrix.spec.ts`

- [ ] **Step 1: Define route matrix**

```ts
const routes = ["/", "/about", "/products", "/inquiry", "/contact"];
const viewports = [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 }
];
```

- [ ] **Step 2: For each route/viewport assert**

- page response okay;
- no app error boundary;
- one public hero;
- hero geometry matches Home at same viewport;
- one red `.public-contact-strip`;
- one black `.site-footer`;
- no horizontal document overflow;
- primary heading hierarchy valid;
- footer follows contact strip.

- [ ] **Step 3: Run English matrix**

```bash
pnpm --filter @rosa/web exec playwright test tests/e2e/client-review-responsive-matrix.spec.ts
```

- [ ] **Step 4: Run Arabic spot matrix**

At minimum 390, 1024, 1920 for `/ar`, `/ar/products`, `/ar/inquiry`:

- `dir=rtl`;
- filter/sidebar layout usable;
- no overflow;
- localized price states render;
- family redirect preserves `/ar/products`.

---

### Task 3: Products discovery exhaustive browser acceptance

**Files:**
- Extend: `apps/web/tests/e2e/products-search-and-filters.spec.ts`
- Extend: `apps/web/tests/e2e/products-progressive-results.spec.ts`
- Extend: `apps/web/tests/e2e/family-route-redirects.spec.ts`

- [ ] **Step 1: Search checks**

Type and validate at least:

- product name;
- exact product code;
- non-primary SKU;
- size;
- direction/shape;
- variant/type.

At no point may the global error screen appear.

- [ ] **Step 2: Filter checks**

Test every facet alone and combined.

Required combination matrix:

```text
family
size
direction
variant
code group
family + size
family + direction
size + variant
multiple sizes
family + size + direction + code group
```

- [ ] **Step 3: Visual selected-state checks**

For family radio and one checkbox:

- native `checked` true;
- custom selected marker visible;
- computed selected colour resolves to ROSA red or selected class is screenshot-verified;
- keyboard Space/Arrow operation remains functional.

- [ ] **Step 4: URL checks**

- filter updates URL;
- reload reproduces result state;
- Back restores previous filter state;
- Forward reapplies it;
- invalid query value does not crash.

- [ ] **Step 5: Progressive result checks**

- initial cap respected;
- See More appears only when needed;
- one click adds exactly a batch;
- filter resets count;
- final click removes button;
- existing results do not disappear/reorder unexpectedly.

---

### Task 4: Catalogue navigation and Product Detail simplification acceptance

**Files:**
- Extend/create: `apps/web/tests/e2e/home-catalogue-links.spec.ts`
- Extend/create: `apps/web/tests/e2e/product-detail-no-related.spec.ts`
- Extend/create: `apps/web/tests/e2e/product-detail-pricing.spec.ts`

- [ ] **Step 1: Verify all ten catalogue actions**

Home: five cover-open links.

Products: five cover-open links + five download links.

For every family, path must equal authoritative `CATALOGUE_DOCUMENTS.pdfPath`.

- [ ] **Step 2: Verify family URL retirement**

EN + AR all five family URLs redirect and hydrate selected family filter.

- [ ] **Step 3: Verify Product Detail no recommendations**

No `Related products`, no `More from`, no related cards.

- [ ] **Step 4: Verify configuration/price behavior**

On a controlled priced test product:

- select base-inherited configuration;
- select override configuration;
- price changes correctly;
- add both configurations and confirm separate Inquiry lines.

---

### Task 5: Homepage clinical visual acceptance

**Files:**
- Extend: `apps/web/tests/e2e/home-comprehensive-alignment.spec.ts`

- [ ] **Step 1: Verify asset integrity**

Plastic Surgery image browser-decodes with non-zero dimensions.

- [ ] **Step 2: Verify rail geometry**

At 1024, 1366, 1920 and 2560:

- lead container width <= 80rem and equals supporting row width within tolerance;
- left/right content bounds align;
- no oversized empty margin causing the lead image to visually start inward;
- image aspect ratio remains preserved.

- [ ] **Step 3: Capture screenshots for human review**

Store Playwright snapshots only if repository snapshot policy supports them; otherwise attach/record screenshot paths in verification notes rather than committing noisy binaries unnecessarily.

---

### Task 6: Real Supabase pricing/admin acceptance

**Files:**
- Verification record only unless defects are found.

- [ ] **Step 1: Record pre-test product state**

Choose a designated draft/test product and record:

- product ID;
- original base price;
- variant IDs/original overrides.

Do not mutate a live client's intended pricing without restore plan.

- [ ] **Step 2: Base-price operations**

Verify through Admin UI when authenticated:

```text
blank -> Price on request
100 -> SAR 100.00
100.5 -> SAR 100.50
clear -> Price on request
```

Reject:

```text
-1
12.345
abc
```

- [ ] **Step 3: Variant override operations**

Set base 100.00 and one override 125.00.

Verify public Product Detail/card summary reflects expected exact/From state after cache invalidation/revalidation.

- [ ] **Step 4: Restore intended test data after acceptance**

Unless test data itself is meant to remain as seeded QA content.

---

### Task 7: Real quotation authoritative-pricing acceptance

- [ ] **Step 1: Submit a controlled all-priced basket**

Verify UI totals and DB rows.

- [ ] **Step 2: Submit mixed priced/unpriced basket**

Verify priced subtotal + pending total semantics.

- [ ] **Step 3: Tampering test through request fixture/API test**

Forge a client unit price different from Supabase. Stored child line must use Supabase price.

- [ ] **Step 4: Database assertions**

For returned reference:

```sql
select * from quote_requests where id = '<id>';
select * from quote_request_items where quote_request_id = '<id>' order by created_at, id;
```

Confirm:

- child count;
- product/configuration identity;
- unit price;
- line subtotal;
- SAR currency;
- null prices preserved;
- no orphan rows.

- [ ] **Step 5: Duplicate submission**

Exact duplicate should return conflict behavior and preserve one parent/line set.

- [ ] **Step 6: Admin Inquiry acceptance**

Owner sees structured priced lines and totals. Existing legacy inquiry with no child rows still shows message.

---

### Task 8: Database security/performance verification

- [ ] **Step 1: Query migration objects**

Verify table, FKs, checks, index, unique cart-hash index and RPC exist exactly once.

- [ ] **Step 2: Verify direct anonymous access is not introduced**

Use Supabase policy/grant inspection or a public client attempt; anon must not read/write quote line snapshots directly.

- [ ] **Step 3: Run Supabase security advisor**

Critical/high findings introduced by this migration block completion.

- [ ] **Step 4: Run performance advisor**

Review missing index/FK suggestions. `quote_request_id` must be indexed.

- [ ] **Step 5: Record advisor output/URLs in completion note**

---

### Task 9: Full repository verification

- [ ] **Step 1: Frozen install when environment changed or clean machine is used**

```bash
pnpm install --frozen-lockfile
```

- [ ] **Step 2: Official combined verification**

```bash
pnpm verify
```

Expected: lint + typecheck + unit/static tests + production Next build PASS.

- [ ] **Step 3: Full browser suite**

```bash
pnpm test:e2e
```

Expected: all required cases PASS; intentional skips individually documented.

- [ ] **Step 4: Exact Cloudflare build**

```bash
cd apps/web
npx opennextjs-cloudflare build
```

Expected: PASS.

Do not run `wrangler deploy` during this verification phase.

---

### Task 10: Deployment-preservation diff

**Files to compare to checkpoint:**

```text
.github/workflows/deploy.yml
apps/web/open-next.config.ts
apps/web/wrangler.jsonc
package.json
pnpm-lock.yaml
```

- [ ] **Step 1: Compare checkpoint to final branch**

```bash
git diff checkpoint/pre-products-pricing-polish-2026-08-23..HEAD -- \
  .github/workflows/deploy.yml \
  apps/web/open-next.config.ts \
  apps/web/wrangler.jsonc \
  package.json \
  pnpm-lock.yaml
```

Expected: no unintended changes. New source files/migration do not require a new runtime dependency.

- [ ] **Step 2: Compare database migration against documented schema**

Ensure migration file in git matches what was actually applied.

---

### Task 11: Final verification record and transfer decision

**Files:**
- Create: `docs/review/2026-08-23-products-pricing-client-review-verification.md`

- [ ] **Step 1: Record exact branch tip and checkpoint**

- [ ] **Step 2: Record every command + result**

Include test counts, skips and failures if any.

- [ ] **Step 3: Record Supabase migration**

Include project ref, migration filename, schema objects and advisor state without exposing secrets.

- [ ] **Step 4: Record visual matrix**

Include route/viewport coverage and any screenshot artifact paths.

- [ ] **Step 5: Record outstanding blockers**

If any required check cannot be run, explicitly state `NOT VERIFIED`; do not infer success.

- [ ] **Step 6: Only after all required gates are green, prepare destination-main transfer commands**

Re-fetch `Ahmad-Ali-Shah/roseMedicalFinal/main` and re-audit if it has moved since the previous audited target SHA. Never reuse an old force-with-lease baseline without fresh confirmation.
