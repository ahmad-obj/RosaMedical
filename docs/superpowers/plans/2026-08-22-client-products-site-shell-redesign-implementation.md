# Client Products + Shared Public Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public Products journey and standardize the five main public pages around one shared shell, reusable four-slide banner, quotation-cart flow, and direct catalogue open/download behavior without inventing ecommerce or unsupported product data.

**Architecture:** Keep the current public router, live catalogue repository, product-detail routes, inquiry store, quotation flow, localization, motion system, and Cloudflare/OpenNext deployment contract. Extract the existing Home hero into a reusable public banner surface; make Products a dedicated discovery workspace backed by `getPublicCatalogueProducts()`; refine Product Detail and Inquiry around the existing inquiry store; make catalogue cards open/download the existing PDFs directly. Each subsystem is implemented through a focused subplan with its own TDD and review gate.

**Tech Stack:** Next.js 16.2.11, React 19.2, TypeScript 5.9, Motion 12, Supabase SSR/client, Vitest 3.2, Playwright 1.57, OpenNext Cloudflare, Wrangler 4.118.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Primary public navigation remains exactly: Home, About Us, Products, Inquiry, Contact Us.
- Treat the client JPG as hierarchy/layout direction, not permission to restore unsupported links, sample prices, or legacy navigation.
- The product basket is a quotation/inquiry cart; no payment, tax, shipping checkout, order table, or ecommerce transaction.
- Do not invent prices. Until a real price data contract exists, use `Price on request` or omit price where the component context makes that clearer.
- Do not invent country-of-origin, brand, delivery-method, stock, certification, or delivery claims.
- Keep the current supported social profiles only: Instagram, Facebook, LinkedIn, X.
- Reuse the current four approved cinematic hero media assets and current carousel interaction model.
- Keep hero CTA buttons removed.
- Keep current live catalogue routing, Supabase reads, inquiry storage, quotation payload/persistence, localization, Arabic/RTL, and motion infrastructure.
- Every main page ends with the same shared red contact/social ribbon followed by the same black footer.
- No new runtime dependency unless separately approved.
- Preserve `open-next.config.ts`, `wrangler.jsonc`, Cloudflare workflow files, package-manager contract, and static asset conventions.
- Required responsive review widths: ~390, 768, 1024, 1366, 1920, ~2560.
- Respect `prefers-reduced-motion`.
- No horizontal page overflow.

---

## Plan Decomposition

This spec spans independently reviewable subsystems. Execute these plans in order:

1. `docs/superpowers/plans/2026-08-22-shared-public-shell-banner.md`
2. `docs/superpowers/plans/2026-08-22-products-discovery-workspace.md`
3. `docs/superpowers/plans/2026-08-22-product-detail-inquiry-cart.md`
4. `docs/superpowers/plans/2026-08-22-products-catalogue-access.md`
5. `docs/superpowers/plans/2026-08-22-public-redesign-integration-verification.md`

The first four plans produce independently reviewable functionality. The fifth is an integration, responsive, accessibility, and deployment-preservation gate.

## Locked File Structure

### Shared public hero/shell

Create:

- `apps/web/src/features/public-hero/public-hero.types.ts` — page-key and localized banner model types.
- `apps/web/src/features/public-hero/public-hero.data.ts` — four shared media records plus page-specific localized copy profiles.
- `apps/web/src/features/public-hero/public-hero-carousel.tsx` — reusable carousel behavior extracted from Home.
- `apps/web/src/features/public-hero/index.ts` — public exports.
- `apps/web/src/test/public-hero-shared-shell.test.tsx` — static/component contract for shared hero + shell.

Modify:

- `apps/web/src/features/homepage/homepage.tsx`
- `apps/web/src/features/about/about-page.tsx`
- `apps/web/src/features/products/products-overview.tsx`
- `apps/web/src/features/inquiry/inquiry-page.tsx`
- `apps/web/src/features/contact-preview/contact-page.tsx` or the actual current Contact entry component resolved from that feature.
- `apps/web/src/components/layout/public-shell.tsx`
- `apps/web/src/styles/home-client-redesign.css` only where old Home-only selectors must become shared.
- create `apps/web/src/styles/public-hero.css` for reusable hero-specific styling rather than growing Home CSS.
- `apps/web/src/app/globals.css`

Delete only after replacement and grep verification:

- Home-only hero files that become unused after extraction, if no test or import still depends on them.

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

- `apps/web/src/features/products/products-overview.tsx`
- `apps/web/src/features/products/products.data.ts`
- `apps/web/src/app/globals.css`

Retain rather than duplicate:

- `getPublicCatalogueProducts()` from `@/features/catalogue-live`.
- canonical `/products/[family]/[product]` routes.
- existing public media mapping.

### Product Detail / Inquiry

Create only if needed by focused responsibility:

- `apps/web/src/features/product-detail/product-price-state.tsx` — renders verified price or localized `Price on request` state without fabricating values.
- `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`
- `apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts`

Modify:

- `apps/web/src/features/product-detail/product-procurement-summary.tsx`
- `apps/web/src/features/product-detail/product-detail-page.tsx`
- `apps/web/src/features/product-detail/mobile-inquiry-bar.tsx`
- `apps/web/src/features/inquiry/add-to-inquiry-button.tsx`
- `apps/web/src/features/inquiry/inquiry-page.tsx`
- related inquiry/product-detail CSS files, preferring one new focused `client-inquiry-cart.css` import over scattered overrides.

Do not create a second store. Continue to use `inquiry-store.ts` and its existing `InquiryItem` contract unless a missing display-only field is proven necessary.

### Catalogue access

Create:

- `apps/web/src/features/products/sections/products-catalogue-cards.tsx`
- `apps/web/src/test/products-catalogue-access.test.tsx`
- `apps/web/tests/e2e/products-catalogue-access.spec.ts`

Modify:

- `apps/web/src/features/catalogues/catalogue-card.tsx` only if a shared open/download control can be reused cleanly.
- `apps/web/src/features/catalogues/catalogue-document-model.ts` only for helper exports; keep the five existing PDF paths unchanged.
- `apps/web/src/features/products/products-overview.tsx`
- `apps/web/src/features/products/products.data.ts`

### Final integration

Create:

- `apps/web/src/test/client-public-redesign-integration.test.tsx`
- `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`
- `docs/review/2026-08-22-client-products-redesign-verification.md`

Modify only if verification exposes an actual issue:

- shared shell styles
- responsive styles
- RTL styles
- reduced-motion styles

Do not alter deployment configuration in this plan unless a real build/deploy incompatibility is reproduced.

## Execution Order and Review Gates

### Gate A — shared shell/banner

Exit criteria:

- all five main pages use one shared four-slide banner component;
- Home retains its current four media assets and Home copy;
- other pages receive page-specific copy config;
- no banner CTA buttons;
- primary header still has exactly five links;
- shared red ribbon + black footer remain one shell-level composition.

Do not start Products discovery until Gate A is green.

### Gate B — Products discovery

Exit criteria:

- `/products` fetches the full public catalogue through `getPublicCatalogueProducts()`;
- large search is functional;
- family/category filter is functional;
- only real-data sort/filter options are exposed;
- product cards link to canonical details;
- price slot never shows invented numeric price;
- desktop/sidebar and mobile/filter-disclosure layouts are both covered.

### Gate C — Product Detail / inquiry cart

Exit criteria:

- Product Detail clearly exposes quantity + add-to-inquiry;
- duplicate adds continue to merge through the existing store;
- Inquiry is clearly a quotation basket, not checkout;
- quantity, notes, remove, clear, continue browsing, and request quotation work;
- keyboard/focus behavior remains intact.

### Gate D — catalogue access

Exit criteria:

- five category covers appear in the Products flow;
- cover click opens the corresponding real PDF;
- visible Download Catalogue control downloads the same PDF;
- no separate Downloads page is added.

### Gate E — final integration/deployment preservation

Exit criteria:

- five main routes share shell/banner/footer structure;
- responsive widths pass visual and overflow checks;
- Arabic/RTL and reduced-motion pass focused checks;
- unit tests, TypeScript, lint, Next build, and focused Playwright pass in a runnable environment;
- OpenNext/Cloudflare build command used by the repository succeeds before transfer to `roseMedicalFinal/main`;
- no deployment config drift.

## Standard Verification Commands

Run from repository root unless the local checkout structure dictates otherwise.

Focused Vitest:

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx
```

Focused Playwright:

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-public-redesign-integration.spec.ts
```

Project gates:

```bash
pnpm --filter @rosa/web lint
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web test
pnpm --filter @rosa/web build
```

Before transfer to the Cloudflare-linked repository, also run the exact OpenNext/Cloudflare build command used by the existing deployment workflow and record its output in the verification note.

## Commit Strategy

Keep commits reviewable and scoped. Preferred sequence:

```text
refactor(web): extract shared public hero carousel
feat(web): apply shared banner to main public pages
feat(web): rebuild Products discovery workspace
feat(web): refine product detail inquiry action
feat(web): redesign inquiry quotation cart
feat(web): add direct catalogue open and download cards
test(web): add client public redesign browser coverage
fix(web): close responsive and rtl redesign gaps
docs: record client products redesign verification
```

Do not combine unrelated admin/backend changes into these commits.

## Rollback Strategy

Because this branch is also the prepared transfer source for another repository:

- keep each subsystem in separate commits;
- never rewrite deployment configuration merely to make UI work;
- if a subsystem fails acceptance, revert that subsystem commit rather than reverting the entire transfer branch;
- preserve the pre-redesign branch SHA in the final verification document before transferring to `roseMedicalFinal/main`.
