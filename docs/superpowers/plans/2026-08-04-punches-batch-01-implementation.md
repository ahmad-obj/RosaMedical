# Punches Batch 01 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 14 source-backed Punches configurations from printed catalogue pages 1-3, preserve 32 exact codes, generate 28 local media derivatives, and expose 15 public Punches products including the preserved Biopsy Punch.

**Architecture:** Follow the established catalogue inventory -> media manifest -> deterministic generator -> registry join -> unit tests -> Playwright review flow already used by Scissors, Chisels, Cutters, and Knives. Existing Yeoman routes are upgraded in place; only true length- or opening-size variants are grouped.

**Tech Stack:** TypeScript, Vitest, Next.js, Playwright, Python 3, Pillow AVIF/WebP encoding.

## Global Constraints

- Branch: `preview/punches-image-batch-01`.
- Source: client-supplied `Punches Catalog(1).pdf`, printed pages 1-3 only.
- Batch scope: 14 visible configurations, 32 exact codes, 28 derivatives.
- Public Punches total after integration: 15 products.
- Do not modify `services/api/**`, OpenAPI operations, Supabase, deployment, or live persistence.
- Do not stage `apps/web/next-env.d.ts` or generated `apps/web/local-data/**` review artifacts.
- Use exact catalogue geometry; no generative editing, redrawing, non-uniform scaling, or fabricated working ends.
- Review status remains `candidate` until Ahmad approves the generated contact sheet.

---

### Task 1: Encode the exact Punches inventory

**Files:**
- Create: `apps/web/src/features/catalogue-registry/products/punches-batch-01.ts`
- Create: `apps/web/src/test/punches-batch-01-inventory.test.ts`

**Interfaces:**
- Produces: `PUNCHES_BATCH_01_CONFIGURATIONS`, an immutable array of 14 records with `id`, `slug`, `name`, `variant`, `cataloguePage`, `codeOptions`, and `mediaAssetId`.

- [ ] **Step 1: Write the failing inventory test**

Assert exactly 14 configurations, page distribution 4/4/6, exactly 32 unique catalogue codes, unique IDs/slugs/media IDs, and exact grouped mappings for representative Yeoman, Turrel, and Citelly records.

- [ ] **Step 2: Run the inventory test and confirm RED**

Run:

```bash
pnpm --filter @rosa/web test -- src/test/punches-batch-01-inventory.test.ts
```

Expected: failure because `punches-batch-01.ts` does not yet exist.

- [ ] **Step 3: Implement the minimal inventory module**

Encode these groups exactly:

- `21-1001`-`21-1003`
- `21-1101`-`21-1103`
- `21-1201`-`21-1203`
- `21-1301`-`21-1303`
- `21-1401`-`21-1403`
- `21-1501`-`21-1503`
- `21-1601`-`21-1603`
- `21-1701`-`21-1703`
- `38-2401`
- `38-2410`
- `38-2402`
- `038-2420`
- `38-2501`-`38-2503`
- `38-2510`

Use conservative code-group names for catalogue entries without distinct printed morphology names.

- [ ] **Step 4: Run the inventory test and confirm GREEN**

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/catalogue-registry/products/punches-batch-01.ts apps/web/src/test/punches-batch-01-inventory.test.ts
git commit -m "feat(web): add Punches Batch 01 inventory"
```

---

### Task 2: Add the Punches media contract and provenance ledger

**Files:**
- Create: `apps/web/src/features/catalogue-media/punches-batch-01.ts`
- Create: `apps/web/src/test/punches-batch-01-media.test.ts`
- Create: `docs/review/catalogue-media/punches-batch-01-sources.md`
- Modify: `apps/web/src/features/catalogue-media/index.ts`
- Modify: `apps/web/src/features/catalogue-media/types.ts`
- Modify: `apps/web/src/features/catalogue-media/validation.ts`

**Interfaces:**
- Produces: `PUNCHES_BATCH_01_MEDIA`, 14 candidate media records with local AVIF/WebP paths under `/media/catalogue-preview/punches/`.

- [ ] **Step 1: Write the failing media test**

Require 14 manifest records, 28 unique runtime paths, `familySlug: "punches"`, preferred-safe rights, transparent background, candidate status, non-empty provenance notes, and local non-empty files when generated.

- [ ] **Step 2: Run the media test and confirm RED**

Expected: failure because Punches media records and family registration do not exist.

- [ ] **Step 3: Register Punches in the shared media types and validator**

Add `punches` to `CatalogueMediaFamilySlug` and `SUPPORTED_FAMILIES` only; do not change unrelated validation behavior.

- [ ] **Step 4: Implement the 14-record manifest and ledger**

Use source anchors `#client-catalogue-page-1`, `#client-catalogue-page-2`, and `#client-catalogue-page-3`. Record exact code scope and explicitly state that code-group names are conservative where the catalogue does not provide distinct names.

- [ ] **Step 5: Export the manifest and run the test**

The test may still fail only on missing generated derivatives. That is the correct intermediate state.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/catalogue-media apps/web/src/test/punches-batch-01-media.test.ts docs/review/catalogue-media/punches-batch-01-sources.md
git commit -m "feat(web): define Punches Batch 01 media contract"
```

---

### Task 3: Build the deterministic image generator and review package

**Files:**
- Create: `apps/web/scripts/prepare_punches_batch1.py`
- Generate locally: `apps/web/local-data/catalogue-pages/punches/page-02.png`
- Generate locally: `apps/web/local-data/catalogue-pages/punches/page-03.png`
- Generate locally: `apps/web/local-data/catalogue-pages/punches/page-04.png`
- Generate locally: `apps/web/public/media/catalogue-preview/punches/*.avif`
- Generate locally: `apps/web/public/media/catalogue-preview/punches/*.webp`

**Interfaces:**
- Produces: CLI flags `--self-test`, `--repo-root`, `--force`, and `--workers` matching prior generators.

- [ ] **Step 1: Add an offline self-test**

Require 14 unique crop specifications, a non-empty transparent 1800 x 1800 result, and deterministic output naming.

- [ ] **Step 2: Run self-test and confirm failure before implementation**

```bash
python apps/web/scripts/prepare_punches_batch1.py --self-test
```

- [ ] **Step 3: Implement source extraction rules**

- Page 1: retain the common full Yeoman body and exact associated jaw detail for each `21-10xx` through `21-13xx` group.
- Page 2: retain the common turnable body and exact associated jaw detail for each `21-14xx` through `21-17xx` group.
- Page 3: isolate each complete named instrument presentation, grouping only the three Citelly opening sizes.

- [ ] **Step 4: Generate 14 AVIF and 14 WebP derivatives**

```bash
python apps/web/scripts/prepare_punches_batch1.py --repo-root .
```

Expected output:

```text
Generated 14 Punches Batch 01 configurations
Derivatives: 28 files
```

- [ ] **Step 5: Generate a 4-column contact sheet and JSON report**

Write to `apps/web/local-data/catalogue-review/punches-batch-01/`.

- [ ] **Step 6: Re-run the media test and confirm GREEN**

Expected: 3 tests pass.

- [ ] **Step 7: Commit only code and runtime binaries**

```bash
git add apps/web/scripts/prepare_punches_batch1.py apps/web/public/media/catalogue-preview/punches
git commit -m "assets: add Punches Batch 01 production candidates"
```

---

### Task 4: Join Punches media into the public registry

**Files:**
- Modify: `apps/web/src/features/catalogue-registry/products/punches.ts`
- Create: `apps/web/src/test/punches-image-preview.test.ts`
- Modify: `apps/web/src/test/catalogue-registry.test.ts`
- Modify: `apps/web/src/test/f3b-page-composition.test.tsx`

**Interfaces:**
- Produces: `PUNCHES_BATCH_01_PRODUCTS` and final `PUNCH_PRODUCTS` containing 14 Batch 01 products plus one preserved Biopsy Punch.

- [ ] **Step 1: Write the failing preview tests**

Require:

- 15 total Punches products
- 14 products with local media
- 32 Batch 01 catalogue-code records
- one preserved `biopsy-punch` record without Batch 01 media
- preserved `yeoman`, `yeoman-perforated`, and `yeoman-rectangular` routes
- 28 unique local runtime paths

- [ ] **Step 2: Update catalogue-wide expected totals and confirm RED**

Increase the Punches family count from 4 to 15 and the overall catalogue total by 11.

- [ ] **Step 3: Implement the minimal registry join**

Map configurations to media records, reuse the three established route slugs for the first three groups, add the remaining 11 Batch 01 routes, and append only the unrelated Biopsy Punch placeholder.

- [ ] **Step 4: Run focused registry tests and confirm GREEN**

```bash
pnpm --filter @rosa/web test -- src/test/punches-image-preview.test.ts src/test/catalogue-registry.test.ts src/test/f3b-page-composition.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/catalogue-registry/products/punches.ts apps/web/src/test/punches-image-preview.test.ts apps/web/src/test/catalogue-registry.test.ts apps/web/src/test/f3b-page-composition.test.tsx
git commit -m "feat(web): integrate Punches Batch 01 catalogue media"
```

---

### Task 5: Verify responsive public rendering

**Files:**
- Create: `apps/web/tests/e2e/punches-image-batch-01.spec.ts`

**Interfaces:**
- Verifies: family route `/products/punches` and detail route `/products/punches/yeoman`.

- [ ] **Step 1: Write the failing Playwright tests**

Across desktop, tablet, and mobile, assert 15 cards, 14 local pictures, 14 AVIF sources, 14 loaded WebP fallbacks, visible preserved Biopsy Punch, exact `21-1001` and `28.0 cm` detail data, `object-fit: contain`, and no horizontal overflow.

- [ ] **Step 2: Run and verify RED**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/punches-image-batch-01.spec.ts
```

- [ ] **Step 3: Make only the smallest necessary production adjustment**

Expected adjustment is none if the registry and shared gallery behavior are correct. Do not change unrelated UI.

- [ ] **Step 4: Run and verify GREEN**

Expected: 6 Playwright tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/web/tests/e2e/punches-image-batch-01.spec.ts
git commit -m "test(web): cover Punches Batch 01 media"
```

---

### Task 6: Visual review and approval closeout

**Files:**
- Create after approval: `apps/web/src/test/punches-batch-01-approval.test.ts`
- Create after approval: `apps/web/src/features/catalogue-media/punches-batch-01-approved.ts`
- Modify after approval: `apps/web/src/features/catalogue-media/index.ts`
- Modify after approval: `docs/review/catalogue-media/punches-batch-01-sources.md`
- Create after approval: `docs/superpowers/completions/2026-08-04-punches-batch-01-completion.md`
- Modify after approval: `README.md`

- [ ] **Step 1: Ahmad reviews the contact sheet**

No candidate changes status before this explicit gate.

- [ ] **Step 2: Write and run the approval test in RED state**

Require 14 approved, 0 candidates, and 0 replacements.

- [ ] **Step 3: Add the approved wrapper and export it as the runtime manifest**

Preserve match grades and provenance; change only `reviewStatus`.

- [ ] **Step 4: Run the approval test and focused affected suites**

Record exact test counts supplied by the local run.

- [ ] **Step 5: Write completion and README coordination records**

State that merge, deployment, Supabase transfer, and backend persistence remain unauthorized.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/test/punches-batch-01-approval.test.ts apps/web/src/features/catalogue-media docs/review/catalogue-media/punches-batch-01-sources.md docs/superpowers/completions/2026-08-04-punches-batch-01-completion.md README.md
git commit -m "feat(web): record Punches Batch 01 approval"
```
