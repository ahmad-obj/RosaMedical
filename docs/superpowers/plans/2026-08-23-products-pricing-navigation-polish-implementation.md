# Products, Pricing, Navigation + Public Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved 2026-08-23 Rosa client-review pass: one authoritative Products hub with reliable contextual filtering and progressive disclosure, real SAR pricing administered through `/admin`, configuration-aware Product Detail and inquiry totals, server-authoritative quotation price snapshots, exact shared-hero parity, catalogue-PDF navigation, no Related Products, and corrected Homepage alignment.

**Architecture:** Keep the existing Next.js + Supabase quotation architecture and extend it rather than introducing ecommerce infrastructure. Split the execution into independent gates: public visual/routing corrections, Products discovery, live pricing projection/admin, Product Detail/configuration, inquiry/quotation persistence, then integrated verification. The existing inquiry store remains the only client cart store; Supabase remains authoritative for commercial values.

**Tech Stack:** Next.js 16, React, TypeScript strict mode, Motion React, Vitest, Playwright, Supabase/PostgreSQL, OpenNext Cloudflare, Wrangler, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`

## Global Constraints

- Public primary navigation remains exactly Home / About Us / Products / Inquiry / Contact Us.
- Public purchasing remains quotation-led; no payment checkout, order placement, shipping, tax, discount, inventory reservation or payment gateway.
- Currency for this implementation is `SAR` only.
- Missing numeric price is represented by database/application `NULL`, never `0`.
- Effective price is `variant.price_override ?? product.price ?? null`.
- `/products` is the only family/product discovery hub; family landing URLs soft-retire into filtered Products redirects.
- Product Detail routes remain canonical.
- Related Products is removed and not replaced.
- Homepage catalogue covers open the real family PDF documents.
- Existing inquiry localStorage remains the only client cart persistence mechanism.
- Client-provided price values are never trusted by `/api/checkout`; server resolves authoritative Supabase pricing at submission.
- Historical `quote_requests.message` remains readable; new structured quote-line snapshots supplement it.
- Existing Arabic/RTL routing and logical-property styling must remain intact.
- Existing Cloudflare/OpenNext/Wrangler deployment contract must not drift.
- No fabricated product, pricing, regulatory, origin, delivery or stock data.
- Every behavior task follows TDD: failing focused test -> smallest implementation -> focused pass -> review/commit.
- Do not claim full completion until `pnpm verify`, `pnpm test:e2e`, and `npx opennextjs-cloudflare build` have fresh passing evidence.

---

## Execution map

This master plan delegates detailed implementation to five focused plans:

1. `docs/superpowers/plans/2026-08-23-public-hero-home-catalogue-alignment.md`
2. `docs/superpowers/plans/2026-08-23-products-hub-facets-progressive-reveal.md`
3. `docs/superpowers/plans/2026-08-23-sar-pricing-admin-public.md`
4. `docs/superpowers/plans/2026-08-23-inquiry-pricing-snapshot.md`
5. `docs/superpowers/plans/2026-08-23-client-review-integration-verification.md`

Execution order is mandatory because later gates consume earlier interfaces:

```text
Checkpoint / coordination
        ↓
Gate A — Shared hero + mobile hero media + Homepage geometry/PDF links
        ↓
Gate B — Products hub routes + search + facets + See More + remove Related Products
        ↓
Gate C — Live SAR pricing model + Admin pricing + public price projection
        ↓
Gate D — Configuration-aware Product Detail + Inquiry pricing + server snapshots + Admin inquiries
        ↓
Gate E — full responsive/accessibility/Cloudflare verification
```

---

### Task 0: Create safety checkpoint and update coordination decision

**Files:**
- Modify: `README.md`
- Create: immutable Git branch `checkpoint/pre-products-pricing-polish-2026-08-23`
- Test: existing README/coordination source tests if present

**Interfaces:**
- Consumes: current transfer branch tip.
- Produces: immutable rollback point and an explicit decision that supersedes the older no-public-price rule.

- [ ] **Step 1: Create checkpoint before production changes**

```bash
git fetch origin
git switch transfer/rose-medical-final-main-ready-2026-08-17
git pull --ff-only origin transfer/rose-medical-final-main-ready-2026-08-17
git branch checkpoint/pre-products-pricing-polish-2026-08-23
```

Expected: checkpoint points to exactly the pre-implementation transfer tip.

- [ ] **Step 2: Append, do not erase, the superseding README decision**

Add a new Shared decision ledger row equivalent to:

```md
| DEC-007 | 2026-08-23 | Supersedes the earlier no-public-price rule: Rosa may publish verified SAR product prices. Product base price is optional; a variant price override replaces the base for that variant; missing price remains “Price on request”. The site remains quotation-led with no payment checkout. | Accepted by Ahmad/client review | Both |
```

Also append a concise Frontend AI -> Backend AI/shared-lane message describing:

- existing `products.price` and `product_variants.price_override` are now being consumed;
- a structured quotation-line migration is planned;
- no payment/order behavior is being introduced.

- [ ] **Step 3: Run coordination regression test**

Run the narrow README/static governance test used by the repository if available; otherwise run:

```bash
pnpm --filter @rosa/web test -- src/test/client-review-round-2026-08-22.test.ts
```

Expected: PASS after any stale no-price assertion is updated to the superseding rule.

- [ ] **Step 4: Commit**

```bash
git add README.md apps/web/src/test
git commit -m "docs: record approved SAR pricing decision"
```

---

### Task 1: Execute Gate A — public hero/media/Home corrections

**Files:**
- Follow exact file list in `2026-08-23-public-hero-home-catalogue-alignment.md`.

**Interfaces:**
- Produces: one canonical shared hero geometry, valid third mobile hero asset, Home PDF links, and one 80rem Comprehensive Plans visual rail.

- [ ] **Step 1: Execute every TDD task in the Gate A subplan**

Do not proceed until the focused hero/media/home tests pass.

- [ ] **Step 2: Visual checkpoint**

Capture Home/About/Products/Inquiry/Contact at 390, 768, 1366 and 1920 widths and compare hero DOM bounding boxes.

Acceptance:

```text
same viewport => same hero width and height on all five main pages
```

- [ ] **Step 3: Commit Gate A as a coherent checkpoint**

Use meaningful commits from the subplan; do not squash unrelated later work into Gate A.

---

### Task 2: Execute Gate B — authoritative Products discovery hub

**Files:**
- Follow exact file list in `2026-08-23-products-hub-facets-progressive-reveal.md`.

**Interfaces:**
- Consumes: stable shared hero and Home catalogue-document mapping.
- Produces: URL-backed `ProductsDiscoveryState`, pure faceted selectors, contextual facet model, deterministic visible checked states, progressive result batches and soft family-route redirects.

- [ ] **Step 1: Fix search crash under a failing browser/component test**

The test must type into `#products-search-input`; a source-string test is insufficient.

- [ ] **Step 2: Implement pure facets before UI composition**

Required selector behavior:

```ts
filterProducts(products, state)
buildFacetModel(products, state)
parseProductsDiscoverySearchParams(searchParams)
serializeProductsDiscoveryState(state)
```

- [ ] **Step 3: Implement custom radio/checkbox presentation and contextual sidebar**

- [ ] **Step 4: Implement URL synchronization and Back/Forward restoration**

- [ ] **Step 5: Implement progressive See More batches**

- [ ] **Step 6: Soft-retire family routes and remove Related Products**

- [ ] **Step 7: Run focused unit + Playwright Gate B suite and commit**

---

### Task 3: Execute Gate C — SAR pricing projection and Admin management

**Files:**
- Follow exact file list in `2026-08-23-sar-pricing-admin-public.md`.

**Interfaces:**
- Consumes: real Supabase `products.price` and `product_variants.price_override`.
- Produces: price-aware live catalogue records, decimal-safe money helpers, public price summaries, editable Admin base price and per-variant override UI.

- [ ] **Step 1: Extend live types/projections under failing mapping tests**

Public catalogue records must expose price without losing variant identity.

- [ ] **Step 2: Add shared SAR formatting/effective-price helpers**

Money arithmetic uses decimal strings/minor-unit conversion; do not rely on binary floating-point accumulation.

- [ ] **Step 3: Add Admin base price create/edit/clear behavior**

- [ ] **Step 4: Add Admin variant override table/edit behavior**

- [ ] **Step 5: Add public card price summary states**

- [ ] **Step 6: Run focused mapping/admin/public tests and commit**

Do not populate fake production prices during implementation.

---

### Task 4: Execute Gate D — Product Detail configuration + Inquiry/server pricing

**Files:**
- Follow exact file list in `2026-08-23-inquiry-pricing-snapshot.md`.

**Interfaces:**
- Consumes: price-aware product/configuration records from Gate C.
- Produces: real Product Detail configuration selection, configuration-specific inquiry lines, client totals, server-authoritative quotation pricing, structured snapshots, admin priced inquiry review.

- [ ] **Step 1: Replace static first-option Product Detail with real configuration selection**

- [ ] **Step 2: Update inquiry-line identity to product + configuration**

- [ ] **Step 3: Add client line/subtotal/partial-total presentation**

- [ ] **Step 4: Add and apply the versioned quote-line migration**

Schema changes require security review and must be recorded.

- [ ] **Step 5: Re-resolve all prices server-side during `/api/checkout`**

A test must submit a forged client price and assert stored server price wins.

- [ ] **Step 6: Fetch/render structured lines in `/admin/inquiries` with legacy fallback**

- [ ] **Step 7: Run focused unit/API/admin/browser tests and commit**

---

### Task 5: Execute Gate E — integrated acceptance and deployment preservation

**Files:**
- Follow `2026-08-23-client-review-integration-verification.md`.
- Update: `docs/review/2026-08-22-client-products-redesign-verification.md` or create a dated 2026-08-23 successor rather than falsifying older evidence.

**Interfaces:**
- Consumes: Gates A-D.
- Produces: fresh evidence suitable for transfer/deployment decision.

- [ ] **Step 1: Run all focused regressions**

- [ ] **Step 2: Run full repository verification**

```bash
cd ~/Projects/RosaMedical
pnpm verify
```

Expected: lint, strict TypeScript, unit/static tests and Next production build all PASS.

- [ ] **Step 3: Run complete Playwright suite**

```bash
pnpm test:e2e
```

Expected: PASS except explicitly documented intentional skips.

- [ ] **Step 4: Run exact Cloudflare build**

```bash
cd apps/web
npx opennextjs-cloudflare build
```

Expected: successful OpenNext Cloudflare build.

- [ ] **Step 5: Run Supabase acceptance checks**

Verify:

- base price save/read;
- variant override save/read;
- mixed priced/unpriced quote submission;
- structured quote rows;
- admin visibility;
- RLS/security advisor.

- [ ] **Step 6: Compare deployment-critical files to checkpoint**

Ensure no unintended drift in:

```text
.github/workflows/deploy.yml
apps/web/open-next.config.ts
apps/web/wrangler.jsonc
package.json
pnpm-lock.yaml
```

Any intentional package/lock change must be explained; none is expected for this architecture.

- [ ] **Step 7: Write final completion/verification record**

Include exact commit, commands, counts, screenshots/viewport matrix, Supabase migration name, advisor result, failures/skips and remaining blockers.

---

## Final acceptance checklist

The branch is ready for transfer only when all of the following are demonstrably true:

- [ ] Home/About/Products/Inquiry/Contact hero bounding boxes match at the same viewport.
- [ ] Third mobile hero WebP is structurally valid and browser-decodes.
- [ ] Products search accepts typing without error boundary.
- [ ] Family radio selected marker is visibly ROSA red.
- [ ] Size/Direction/Variant/Code-group filters work alone and in combination.
- [ ] URL filter state survives refresh and Back/Forward.
- [ ] See More limits initial page length and appends controlled batches.
- [ ] Five old family URLs redirect to filtered `/products` in EN and AR.
- [ ] Home catalogue covers open the correct PDFs.
- [ ] Product Detail contains no Related Products section.
- [ ] Plastic Surgery lead rail aligns with the 80rem supporting visual rail.
- [ ] Admin can create/edit/clear a base SAR price.
- [ ] Admin can create/edit/clear variant price overrides.
- [ ] Product cards show exact / From / Price on request states correctly.
- [ ] Product Detail price follows the selected real configuration.
- [ ] Same product with different configurations creates separate inquiry lines.
- [ ] Inquiry totals use correct partial-total semantics.
- [ ] `/api/checkout` ignores forged client prices and resolves Supabase price.
- [ ] Structured quotation-line snapshots persist authoritative unit/subtotal values.
- [ ] Admin Inquiry renders structured commercial lines and legacy message-only records.
- [ ] Arabic/RTL remains functional.
- [ ] `pnpm verify` passes fresh.
- [ ] `pnpm test:e2e` passes fresh.
- [ ] `npx opennextjs-cloudflare build` passes fresh.
- [ ] No deployment configuration regression.

## Rollback

If any gate becomes unsafe:

```bash
git switch transfer/rose-medical-final-main-ready-2026-08-17
git reset --hard checkpoint/pre-products-pricing-polish-2026-08-23
```

Do not use rollback after production data/schema migration without separately reverting/forward-fixing the database schema. Database rollback must respect existing quotation rows and must never drop captured commercial history blindly.
