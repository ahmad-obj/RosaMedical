# Catalogue Media All-Families Integration Design

Date: 2026-08-04 PKT
Branch: `integration/catalogue-media-all-families`
Base: latest `main`
Source branch: `preview/punches-image-batch-01`

## Goal

Integrate the approved production-media work for Scissors, Chisels, Cutters, Knives, and Punches into the current `main` codebase without merging the stale preview branch history or overwriting newer quotation, backend, security, environment, and admin work.

## Integration method

The integration branch starts from current `main`. Files are transferred by responsibility:

1. Copy additive catalogue assets, manifests, batch registries, generation scripts, focused tests, review ledgers, and completion records from the approved cumulative preview branch.
2. Patch current-main shared files in place instead of replacing them wholesale.
3. Preserve current-main inquiry, Supabase, authentication, proxy/middleware, environment, admin, API, and OpenAPI behavior.
4. Do not merge the preview branch, cherry-pick its full history, or copy its `README.md`, middleware, environment files, or unrelated test snapshots.

## Approved media scope

- Scissors: 42 approved configurations, 132 exact catalogue codes, 84 runtime derivatives.
- Chisels: 16 approved configurations, 95 exact catalogue codes, 32 runtime derivatives, plus four preserved existing records.
- Cutters: 13 approved configurations, 22 exact catalogue codes, 26 runtime derivatives, plus one preserved existing record.
- Knives: 18 approved configurations, 32 exact catalogue codes, 36 runtime derivatives, plus four preserved existing records.
- Punches: 14 approved configurations, 32 exact catalogue codes, 28 runtime derivatives, plus one preserved existing record.

Expected public totals after integration:

- Knives: 22
- Scissors: 42
- Punches: 15
- Chisels: 20
- Cutters: 14
- Overall catalogue: 113 products

## Shared type and rendering changes

`CatalogueProductRecord` gains optional local-media and exact-code fields:

- `catalogueCodes?: readonly { code: string; size: string }[]`
- `mediaAssetId?: string`
- `mediaPath?: string`
- `mediaFallbackPath?: string`
- `mediaSourceUrl?: string`
- `mediaReviewNote?: string`
- `mediaIndex?: number`

The public product media component renders a local AVIF/WebP pair when provided and keeps the existing placeholder fallback otherwise. Family cards and product galleries pass only these optional fields and preserve current-main links, inquiry behavior, and layout.

## Registry behavior

Each family registry composes source-backed Batch 01 products with the current-main preserved records. Existing route slugs are preserved where the approved batch intentionally upgrades an existing product. Batch products expose exact grouped catalogue codes, sizes, source provenance, and approved review notes.

No prices, stock, checkout, certifications, ratings, clinical claims, or new backend operations are introduced.

## Exclusions

- No merge to `main` in this phase.
- No deployment.
- No Supabase media transfer.
- No OpenAPI or `services/api/**` changes.
- No middleware/proxy/security changes.
- No replacement of current-main inquiry or owner-session behavior.
- No catalogue Batch 02 work.

## Verification gates

The integration branch must pass:

1. catalogue-media manifest and approval tests for all five families;
2. catalogue registry and page-composition tests with 113 total products;
3. current-main inquiry and admin tests affected by catalogue totals;
4. all five family media Playwright specifications across configured desktop, tablet, and mobile projects;
5. frontend lint, strict typecheck, complete web test suite, and production build;
6. a final branch diff confirming no backend, OpenAPI, middleware/proxy, environment, or unrelated current-main file was overwritten.

A pull request into `main` is created only after fresh verification evidence and Ahmad's separate approval.