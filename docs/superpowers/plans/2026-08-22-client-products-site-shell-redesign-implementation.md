# Client Products + Shared Public Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public Products journey and standardize the five main public pages around one shared shell, reusable four-slide banner, quotation-cart flow, and direct catalogue open/download behavior without inventing ecommerce or unsupported product data.

**Architecture:** Keep the current public router, live catalogue repository, product-detail routes, inquiry store, quotation flow, localization, motion system, and Cloudflare/OpenNext deployment contract. Extract the current Home carousel into a reusable `public-hero` feature; make Products a complete-catalogue discovery workspace backed by `getPublicCatalogueProducts()`; refine Product Detail and Inquiry around the existing inquiry store; expose the five existing catalogue PDFs directly from Products. Each subsystem has its own TDD/review gate.

**Tech Stack:** Next.js 16.2.11, React 19.2, TypeScript 5.9, Motion 12, Supabase, Vitest 3.2, Playwright 1.57, OpenNext Cloudflare, Wrangler 4.118.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Primary navigation remains exactly Home, About Us, Products, Inquiry, Contact Us.
- The client JPG is hierarchy/layout direction, not permission to restore unsupported links, sample prices, or legacy navigation.
- The basket is a quotation/inquiry cart: no payment, tax, shipping checkout, order table, or ecommerce transaction.
- Do not invent prices. Current safe UI state is `Price on request` / Arabic equivalent until a verified price source exists.
- Do not invent country-of-origin, brand, delivery-method, stock, certification, or delivery claims.
- Supported social profiles remain Instagram, Facebook, LinkedIn, X only.
- Reuse the current four approved `client-v5` hero media sets and proven carousel behavior.
- Hero CTA buttons remain removed.
- Keep current live catalogue routing, Supabase reads, inquiry storage, quotation payload/persistence, localization, Arabic/RTL, and motion infrastructure.
- Every main page ends with the same shell-level red contact/social ribbon followed by the same black footer.
- No new runtime dependency unless separately approved.
- Preserve `.github/workflows/deploy.yml`, `apps/web/open-next.config.ts`, `apps/web/wrangler.jsonc`, package-manager contract, and static asset conventions.
- Review widths: 390, 768, 1024, 1366, 1920, 2560.
- Respect `prefers-reduced-motion` and prevent horizontal page overflow.

---

## Execution Setup

Before the first implementation edit:

```bash
git switch transfer/rose-medical-final-main-ready-2026-08-17
git branch checkpoint/pre-client-products-redesign-2026-08-22
```

The checkpoint is the immutable rollback/deployment-diff baseline.

## Plan Decomposition

Execute in this order:

1. `docs/superpowers/plans/2026-08-22-shared-public-shell-banner.md`
2. `docs/superpowers/plans/2026-08-22-products-discovery-workspace.md`
3. `docs/superpowers/plans/2026-08-22-product-detail-inquiry-cart.md`
4. `docs/superpowers/plans/2026-08-22-products-catalogue-access.md`
5. `docs/superpowers/plans/2026-08-22-public-redesign-integration-verification.md`

The first four plans create independently reviewable functionality. The fifth is the responsive/accessibility/build/deployment-preservation gate.

## Locked File Structure

### Shared public hero/shell

Create:

- `apps/web/src/features/public-hero/public-hero.types.ts`
- `apps/web/src/features/public-hero/public-hero.data.ts`
- `apps/web/src/features/public-hero/public-hero-carousel.tsx`
- `apps/web/src/features/public-hero/index.ts`
- `apps/web/src/styles/public-hero.css`
- `apps/web/src/test/public-hero-shared-shell.test.tsx`

Modify:

- `apps/web/src/features/homepage/homepage.tsx`
- `apps/web/src/features/about/about-page.tsx`
- `apps/web/src/features/products/products-overview.tsx`
- `apps/web/src/features/inquiry/inquiry-page.tsx`
- `apps/web/src/features/contact-preview/contact-page.tsx`
- `apps/web/src/components/layout/public-shell.tsx`
- `apps/web/src/styles/home-client-redesign.css`
- `apps/web/src/app/globals.css`

Home-only hero files may be deleted only after `git grep` proves there are no remaining production/test imports.

### Products discovery

Create:

- `apps/web/src/features/products/products-discovery.types.ts`
- `apps/web/src/features/products/products-discovery.logic.ts`
- `apps/web/src/features/products/sections/products-discovery-workspace.tsx`
- `apps/web/src/features/products/sections/products-filter-panel.tsx`
- `apps/web/src/features/products/sections/products-results-toolbar.tsx`
- `apps/web/src/features/products/sections/products-result-card.tsx`
- `apps/web/src/features/products/sections/products-direct-contact-band.tsx`
- `apps/web/src/styles/products-client-redesign.css`
- `apps/web/src/test/products-client-redesign.test.tsx`
- `apps/web/tests/e2e/products-client-redesign.spec.ts`

Modify:

- `apps/web/src/features/public-catalogue/selectors.ts`
- `apps/web/src/features/public-catalogue/index.ts`
- `apps/web/src/features/products/products-overview.tsx`
- `apps/web/src/features/products/products.data.ts`
- `apps/web/src/app/globals.css`

Retain rather than duplicate `getPublicCatalogueProducts()`, canonical product routes, and existing public media mapping.

### Product Detail / Inquiry

Create:

- `apps/web/src/features/product-detail/product-price-state.tsx`
- `apps/web/src/styles/client-inquiry-cart.css`
- `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`
- `apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts`

Modify:

- `apps/web/src/features/product-detail/product-procurement-summary.tsx`
- `apps/web/src/features/product-detail/product-inquiry-controls.tsx`
- `apps/web/src/features/product-detail/product-detail-page.tsx`
- `apps/web/src/features/product-detail/mobile-inquiry-bar.tsx`
- `apps/web/src/features/inquiry/add-to-inquiry-button.tsx`
- `apps/web/src/features/inquiry/inquiry-store.ts`
- `apps/web/src/features/inquiry/inquiry-page.tsx`
- `apps/web/src/features/inquiry-preview/empty-inquiry-page.tsx` only if the final empty-state composition requires a focused adjustment.
- `apps/web/src/app/globals.css`

Do not create a second inquiry/cart store. The existing store remains authoritative; optional media fields are backward-compatible display metadata only.

### Catalogue access

Create:

- `apps/web/src/features/products/sections/products-catalogue-cards.tsx`
- `apps/web/src/test/products-catalogue-access.test.tsx`
- `apps/web/tests/e2e/products-catalogue-access.spec.ts`

Modify:

- `apps/web/src/features/catalogues/index.ts` to export existing catalogue primitives cleanly if necessary.
- `apps/web/src/features/products/products-overview.tsx`
- `apps/web/src/styles/products-client-redesign.css`

Keep the five existing PDF paths in `apps/web/src/features/catalogues/catalogue-document-model.ts` unchanged.

### Final integration

Create:

- `apps/web/src/test/client-public-redesign-integration.test.tsx`
- `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`
- `docs/review/2026-08-22-client-products-redesign-verification.md`

Modify RTL/reduced-motion/shared responsive styles only when the integration matrix reproduces an actual defect.

## Review Gates

### Gate A — shared shell/banner

- all five main pages use one `PublicHeroCarousel` implementation;
- Home keeps the four existing media assets and approved Home copy;
- About/Products/Inquiry/Contact use page-specific copy profiles;
- no hero CTA buttons;
- primary header remains exactly five links;
- one shell-level red ribbon + one shell-level black footer.

### Gate B — Products discovery

- `/products` uses `getPublicCatalogueProducts()`;
- real search works across name/code/family/options;
- family filter works;
- only supported filters/sorts are shown;
- result cards link to canonical Product Detail;
- price state never shows invented numeric values;
- desktop sidebar and mobile compact filter behavior are covered.

### Gate C — Product Detail / inquiry cart

- Product Detail exposes quantity, note, price-on-request state, and Add to Inquiry;
- duplicate adds merge through the existing store;
- Inquiry clearly behaves as quotation basket, not checkout;
- quantity, notes, remove, clear, continue browsing, Request quotation work;
- focus management remains accessible.

### Gate D — catalogue access

- five category covers appear on Products;
- cover click opens the exact existing PDF;
- visible Download Catalogue action downloads the same PDF;
- no Downloads main page is added.

### Gate E — final integration/deployment

- 390/768/1024/1366/1920/2560 pass no-overflow checks;
- Arabic/RTL and reduced-motion focused tests pass;
- focused + full unit tests, lint, typecheck, Next build, and focused Playwright pass;
- `cd apps/web && npx opennextjs-cloudflare build` passes with the CI environment contract;
- deployment files have no unintended diff from `checkpoint/pre-client-products-redesign-2026-08-22`;
- after manual destination transfer, the `Deploy to Cloudflare Workers` workflow passes before production is declared healthy.

## Standard Verification Commands

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx

pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-public-redesign-integration.spec.ts

pnpm --filter @rosa/web lint
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web test
pnpm --filter @rosa/web build
```

Cloudflare bundle gate:

```bash
cd apps/web
npx opennextjs-cloudflare build
```

## Commit Strategy

Preferred sequence:

```text
refactor(web): define shared public hero profiles
refactor(web): extract shared public hero carousel
feat(web): apply shared banner to main public pages
feat(web): lock shared public shell consistency
refactor(web): expose complete product preview mapping
feat(web): add deterministic Products discovery logic
feat(web): build Products discovery controls
feat(web): add client-directed product result cards
feat(web): add Products direct contact band
feat(web): preserve inquiry product media metadata
feat(web): refine product detail inquiry controls
fix(web): unify mobile and desktop inquiry controls
feat(web): redesign inquiry as quotation cart
feat(web): add direct Products catalogue access
feat(web): place catalogue covers in Products journey
test(web): add client public redesign browser coverage
fix(web): close reproduced responsive and rtl redesign gaps
docs: record client products redesign verification
```

Do not mix unrelated admin/backend work into this sequence.

## Rollback Strategy

- checkpoint branch stays immutable;
- each subsystem remains in separate commits;
- if a subsystem fails acceptance, revert that subsystem rather than the entire transfer branch;
- do not modify deployment configuration merely to accommodate UI code;
- destination `main` receives a backup branch and a fresh `--force-with-lease` replacement only after all pre-transfer gates pass.
