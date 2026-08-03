# Catalogue Media All-Families Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transfer the five approved catalogue-media batches onto a latest-main integration branch without importing stale preview history or overwriting newer application behavior.

**Architecture:** The branch is based on current `main`. Additive media modules, batch registries, generators, tests, review records, and binary assets are copied from `preview/punches-image-batch-01`; shared current-main files are patched in place to consume optional media fields. Verification explicitly protects current-main inquiry, backend, security, environment, and admin boundaries.

**Tech Stack:** Next.js 16, React, TypeScript, Vitest, Playwright, Python/Pillow catalogue preparation scripts, local AVIF/WebP assets.

## Global Constraints

- Work only on `integration/catalogue-media-all-families`.
- Preserve current `main` as the source of truth for inquiry, Supabase, authentication, middleware/proxy, security, environment, backend, OpenAPI, and admin behavior.
- Do not merge or cherry-pick the full preview branch.
- Do not modify `services/api/**`, `packages/contracts/openapi/**`, environment secrets, or deployment configuration.
- Keep all media local under `apps/web/public/media/catalogue-preview/<family>/`.
- Preserve exact catalogue codes, sizes, route slugs, review states, and provenance from approved completion records.
- Do not merge to `main`, deploy, or transfer media to Supabase without a later explicit approval.

---

### Task 1: Establish integration contracts

**Files:**
- Create: `docs/superpowers/specs/2026-08-04-catalogue-media-integration-design.md`
- Create: `docs/superpowers/plans/2026-08-04-catalogue-media-all-families-integration.md`
- Test: branch comparison against `main`

**Interfaces:**
- Consumes: current-main commit and approved cumulative preview branch.
- Produces: an isolated latest-main integration branch and explicit transfer boundary.

- [x] **Step 1: Create the integration branch from current `main`**

```bash
git switch main
git pull
git switch -c integration/catalogue-media-all-families
```

- [x] **Step 2: Record the design and plan**

The design must list expected family totals `22 / 42 / 15 / 20 / 14`, overall total `113`, exclusions, and verification gates.

- [ ] **Step 3: Confirm branch contains no preview history merge**

Run:

```bash
git merge-base --is-ancestor preview/punches-image-batch-01 HEAD
```

Expected: non-zero exit because the preview head is not merged into the integration branch.

---

### Task 2: Transfer additive approved media modules and records

**Files:**
- Create: `apps/web/src/features/catalogue-media/**`
- Create: `apps/web/src/features/catalogue-registry/products/*-batch-01.ts`
- Create: `apps/web/scripts/catalogue_media_normalize.py`
- Create: `apps/web/scripts/prepare_*_batch1.py`
- Create: `apps/web/scripts/prepare_scissors_wave2.py`
- Create: `apps/web/scripts/prepare_scissors_wave3.py`
- Create: `apps/web/scripts/requirements-catalogue-media.txt`
- Create: `apps/web/src/styles/scissors-image-preview.css`
- Create: `docs/review/catalogue-media/**`
- Create: approved catalogue-media completion records and batch-specific focused tests.

**Interfaces:**
- Consumes: exact files from `preview/punches-image-batch-01`.
- Produces: self-contained media manifests, approved status wrappers, exact batch inventories, generators, and provenance records.

- [ ] **Step 1: Copy only the additive approved files from the preview branch**

```bash
git checkout preview/punches-image-batch-01 -- \
  apps/web/src/features/catalogue-media \
  apps/web/src/features/catalogue-registry/products/scissors-batch-01.ts \
  apps/web/src/features/catalogue-registry/products/chisels-batch-01.ts \
  apps/web/src/features/catalogue-registry/products/cutters-batch-01.ts \
  apps/web/src/features/catalogue-registry/products/knives-batch-01.ts \
  apps/web/src/features/catalogue-registry/products/punches-batch-01.ts \
  apps/web/scripts/catalogue_media_normalize.py \
  apps/web/scripts/prepare_chisels_batch1.py \
  apps/web/scripts/prepare_cutters_batch1.py \
  apps/web/scripts/prepare_knives_batch1.py \
  apps/web/scripts/prepare_punches_batch1.py \
  apps/web/scripts/prepare_scissors_wave2.py \
  apps/web/scripts/prepare_scissors_wave3.py \
  apps/web/scripts/requirements-catalogue-media.txt \
  apps/web/src/styles/scissors-image-preview.css \
  docs/review/catalogue-media \
  docs/superpowers/completions/2026-08-02-scissors-batch-01-production-media.md \
  docs/superpowers/completions/2026-08-03-chisels-batch-01-production-media.md \
  docs/superpowers/completions/2026-08-04-knives-batch-01-completion.md \
  docs/superpowers/completions/2026-08-04-punches-batch-01-completion.md
```

- [ ] **Step 2: Copy the focused inventory, media, approval, and browser specifications**

```bash
git checkout preview/punches-image-batch-01 -- \
  apps/web/src/test/scissors-batch-01-inventory.test.ts \
  apps/web/src/test/scissors-batch-01-media.test.ts \
  apps/web/src/test/scissors-image-preview.test.ts \
  apps/web/src/test/chisels-batch-01-inventory.test.ts \
  apps/web/src/test/chisels-batch-01-media.test.ts \
  apps/web/src/test/chisels-batch-01-approval.test.ts \
  apps/web/src/test/chisels-image-preview.test.ts \
  apps/web/src/test/cutters-batch-01-inventory.test.ts \
  apps/web/src/test/cutters-batch-01-media.test.ts \
  apps/web/src/test/cutters-batch-01-approval.test.ts \
  apps/web/src/test/cutters-image-preview.test.ts \
  apps/web/src/test/knives-batch-01-inventory.test.ts \
  apps/web/src/test/knives-batch-01-media.test.ts \
  apps/web/src/test/knives-batch-01-approval.test.ts \
  apps/web/src/test/knives-image-preview.test.ts \
  apps/web/src/test/punches-batch-01-inventory.test.ts \
  apps/web/src/test/punches-batch-01-media.test.ts \
  apps/web/src/test/punches-batch-01-approval.test.ts \
  apps/web/src/test/punches-image-preview.test.ts \
  apps/web/tests/e2e/scissors-image-batch-01.spec.ts \
  apps/web/tests/e2e/chisels-image-batch-01.spec.ts \
  apps/web/tests/e2e/cutters-image-batch-01.spec.ts \
  apps/web/tests/e2e/knives-image-batch-01.spec.ts \
  apps/web/tests/e2e/punches-image-batch-01.spec.ts
```

- [ ] **Step 3: Commit additive source integration**

```bash
git add apps/web/src/features/catalogue-media apps/web/src/features/catalogue-registry/products/*-batch-01.ts apps/web/scripts apps/web/src/styles/scissors-image-preview.css apps/web/src/test/*batch-01* apps/web/src/test/*image-preview* apps/web/tests/e2e/*image-batch-01* docs/review/catalogue-media docs/superpowers/completions
git commit -m "feat: stage approved catalogue media modules"
```

---

### Task 3: Patch current-main registry and rendering files

**Files:**
- Modify: `apps/web/src/features/catalogue-registry/types.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/scissors.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/chisels.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/cutters.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/knives.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/punches.ts`
- Modify: `apps/web/src/features/public-catalogue/product-media-placeholder.tsx`
- Modify: `apps/web/src/features/family-listing/family-product-card.tsx`
- Modify: `apps/web/src/features/product-detail/product-gallery.tsx`
- Modify: `apps/web/src/app/globals.css`
- Test: `apps/web/src/test/catalogue-registry.test.ts`
- Test: `apps/web/src/test/f3b-page-composition.test.tsx`

**Interfaces:**
- Consumes: optional media fields and approved batch exports.
- Produces: 113 current-main products with local images for 103 approved Batch 01 configurations and placeholders for preserved records.

- [ ] **Step 1: Add optional exact-code and local-media fields to `CatalogueProductRecord`**

```ts
catalogueCodes?: readonly { code: string; size: string }[];
mediaAssetId?: string;
mediaPath?: string;
mediaFallbackPath?: string;
mediaSourceUrl?: string;
mediaReviewNote?: string;
mediaIndex?: number;
```

- [ ] **Step 2: Compose each family registry from batch products plus preserved current-main records**

Expected totals:

```ts
knives: 22
scissors: 42
punches: 15
chisels: 20
cutters: 14
```

- [ ] **Step 3: Render local media without changing placeholder fallback behavior**

`ProductMediaPlaceholder` must use `<picture>` with AVIF source and WebP fallback when `src` is provided; otherwise it must render the existing placeholder markup.

- [ ] **Step 4: Pass optional media fields through cards and product gallery**

Keep current-main navigation, inquiry actions, semantics, and layout unchanged.

- [ ] **Step 5: Import the image containment stylesheet**

Append:

```css
@import "../styles/scissors-image-preview.css";
```

- [ ] **Step 6: Update registry and page-composition expectations without deleting newer current-main tests**

Require overall total `113` and family totals `22 / 42 / 15 / 20 / 14`.

- [ ] **Step 7: Run focused registry tests**

```bash
pnpm --filter @rosa/web test -- src/test/catalogue-registry.test.ts src/test/f3b-page-composition.test.tsx
```

Expected: all selected tests pass.

---

### Task 4: Transfer approved binary assets

**Files:**
- Create: `apps/web/public/media/catalogue-preview/scissors/**`
- Create: `apps/web/public/media/catalogue-preview/chisels/**`
- Create: `apps/web/public/media/catalogue-preview/cutters/**`
- Create: `apps/web/public/media/catalogue-preview/knives/**`
- Create: `apps/web/public/media/catalogue-preview/punches/**`

**Interfaces:**
- Consumes: approved AVIF/WebP derivatives on `preview/punches-image-batch-01`.
- Produces: all local runtime paths referenced by the integrated manifests.

- [ ] **Step 1: Copy the exact approved binary directory**

```bash
git checkout preview/punches-image-batch-01 -- apps/web/public/media/catalogue-preview
```

- [ ] **Step 2: Verify expected derivative counts**

```bash
find apps/web/public/media/catalogue-preview -type f -name '*.avif' | wc -l
find apps/web/public/media/catalogue-preview -type f -name '*.webp' | wc -l
```

Expected: `103` AVIF and `103` WebP.

- [ ] **Step 3: Commit assets**

```bash
git add apps/web/public/media/catalogue-preview
git commit -m "assets: integrate approved catalogue media"
```

---

### Task 5: Reconcile current-main tests and verify the integration

**Files:**
- Modify only current-main tests whose expected catalogue totals changed.
- Create: `docs/superpowers/completions/2026-08-04-catalogue-media-all-families-integration.md`
- Modify: `README.md` by appending one current coordination entry after verification.

**Interfaces:**
- Consumes: completed code and binaries.
- Produces: fresh evidence that the latest-main application remains intact with the approved media system.

- [ ] **Step 1: Run all focused catalogue tests**

```bash
pnpm --filter @rosa/web test -- \
  src/test/scissors-batch-01-inventory.test.ts \
  src/test/scissors-batch-01-media.test.ts \
  src/test/scissors-image-preview.test.ts \
  src/test/chisels-batch-01-inventory.test.ts \
  src/test/chisels-batch-01-media.test.ts \
  src/test/chisels-batch-01-approval.test.ts \
  src/test/chisels-image-preview.test.ts \
  src/test/cutters-batch-01-inventory.test.ts \
  src/test/cutters-batch-01-media.test.ts \
  src/test/cutters-batch-01-approval.test.ts \
  src/test/cutters-image-preview.test.ts \
  src/test/knives-batch-01-inventory.test.ts \
  src/test/knives-batch-01-media.test.ts \
  src/test/knives-batch-01-approval.test.ts \
  src/test/knives-image-preview.test.ts \
  src/test/punches-batch-01-inventory.test.ts \
  src/test/punches-batch-01-media.test.ts \
  src/test/punches-batch-01-approval.test.ts \
  src/test/punches-image-preview.test.ts \
  src/test/catalogue-registry.test.ts \
  src/test/f3b-page-composition.test.tsx
```

- [ ] **Step 2: Run the complete current-main frontend verification**

```bash
pnpm lint
pnpm typecheck
pnpm --filter @rosa/web test
pnpm --filter @rosa/web build
```

- [ ] **Step 3: Run all five media E2E specifications**

```bash
pnpm --filter @rosa/web test:e2e -- \
  tests/e2e/scissors-image-batch-01.spec.ts \
  tests/e2e/chisels-image-batch-01.spec.ts \
  tests/e2e/cutters-image-batch-01.spec.ts \
  tests/e2e/knives-image-batch-01.spec.ts \
  tests/e2e/punches-image-batch-01.spec.ts
```

- [ ] **Step 4: Audit the final diff**

```bash
git diff --name-status main...HEAD
```

The diff must contain no changes under `services/api/**`, `packages/contracts/openapi/**`, environment files, middleware/proxy files, or unrelated inquiry/authentication implementation.

- [ ] **Step 5: Record completion evidence and append the README coordination entry**

The completion record must state exact test counts, build result, affected files, exclusions, and remaining merge/Supabase/deployment gates.

- [ ] **Step 6: Keep the branch isolated pending separate PR approval**

Do not create or merge a PR until Ahmad reviews the fresh integration verification evidence.