# Knives Batch 01 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 18 catalogue-derived Knives configurations, 32 exact codes, 36 local derivatives, public catalogue integration, and responsive verification.

**Architecture:** Follow the established family-batch pattern: a typed inventory defines catalogue truth, a separate media manifest defines local assets and provenance, a preparation script generates deterministic derivatives, and the public registry joins products to media by stable asset ID. Existing later-page Knives products remain preserved.

**Tech Stack:** TypeScript, Vitest, Next.js, Playwright, Python 3, Pillow, pillow-avif-plugin.

## Global Constraints

- Work only on `preview/knives-image-batch-01`.
- Use client-supplied catalogue material only.
- Never fabricate geometry or direction variants.
- Keep 18 visible configurations and all 32 exact codes.
- Group only Liston, Fox Lupus Curettes, and Keyes Dermal Punches size-only variants.
- Create 18 AVIF and 18 WebP derivatives under the Knives media directory.
- Keep all new review statuses `candidate` until Ahmad approves the contact sheet.
- Preserve the four existing later-page Knives records.
- Do not touch unrelated admin/backend work.

---

### Task 1: Typed Knives inventory

**Files:**
- Create: `apps/web/src/features/catalogue-registry/products/knives-batch-01.ts`
- Create: `apps/web/src/test/knives-batch-01-inventory.test.ts`

**Produces:** `KNIVES_BATCH_01_CONFIGURATIONS`, containing 18 unique records and 32 unique code options.

- [ ] Write the failing inventory test for counts, exact codes, grouping, mappings, and uniqueness.
- [ ] Run the focused test and confirm it fails because the module is missing.
- [ ] Implement the 18 catalogue configurations.
- [ ] Run the focused test and confirm all inventory assertions pass.
- [ ] Commit the inventory and test.

### Task 2: Media type registration and manifest

**Files:**
- Modify: `apps/web/src/features/catalogue-media/types.ts`
- Modify: `apps/web/src/features/catalogue-media/validation.ts`
- Create: `apps/web/src/features/catalogue-media/knives-batch-01.ts`
- Modify: `apps/web/src/features/catalogue-media/index.ts`
- Create: `apps/web/src/test/knives-batch-01-media.test.ts`
- Create: `docs/review/catalogue-media/knives-batch-01-sources.md`

**Consumes:** 18 media IDs from Task 1.
**Produces:** `KNIVES_BATCH_01_MEDIA`, 18 candidate records with local AVIF/WebP paths and provenance.

- [ ] Write the failing media test for exact manifest coverage, local paths, file existence, and provenance.
- [ ] Register `knives` in the shared family type and validator.
- [ ] Implement the 18-record manifest and source ledger.
- [ ] Export the manifest from the catalogue-media index.
- [ ] Run the media test; file-existence assertions remain red until Task 3 generates derivatives.
- [ ] Commit the manifest, validator, test, and ledger.

### Task 3: Deterministic image preparation

**Files:**
- Create: `apps/web/scripts/prepare_knives_batch1.py`
- Local input: `apps/web/local-data/catalogue-pages/knives/page-02.png`
- Local input: `apps/web/local-data/catalogue-pages/knives/page-03.png`
- Local input: `apps/web/local-data/catalogue-pages/knives/page-04.png`
- Generated: `apps/web/public/media/catalogue-preview/knives/*.avif`
- Generated: `apps/web/public/media/catalogue-preview/knives/*.webp`

**Produces:** 36 deterministic runtime derivatives, a contact sheet, and a JSON report.

- [ ] Implement `--self-test`, `--repo-root`, and `--force` arguments.
- [ ] Encode exact source-page crop boxes for all 18 configurations.
- [ ] Remove white backgrounds, trim, rotate proportionally, and compose transparent 1800 × 1800 assets.
- [ ] Generate AVIF/WebP derivatives in parallel and create a labelled contact sheet.
- [ ] Run self-test and a full local generation.
- [ ] Run the focused media test and confirm all assertions pass.
- [ ] Commit the script; generated binaries are committed after Ahmad’s local generation.

### Task 4: Public catalogue join

**Files:**
- Modify: `apps/web/src/features/catalogue-registry/products/knives.ts`
- Modify: `apps/web/src/test/catalogue-registry.test.ts`
- Modify: `apps/web/src/test/f3b-page-composition.test.tsx`
- Create: `apps/web/src/test/knives-image-preview.test.ts`

**Produces:** 22 public Knives products, including 18 local Batch 01 records and four preserved existing records.

- [ ] Write the failing preview contract for 22 records and 18 local media joins.
- [ ] Map inventory records to public product records and manifest media.
- [ ] Preserve all four established products unchanged and append them after Batch 01.
- [ ] Update only directly affected total-count assertions.
- [ ] Run focused unit tests and commit the registry integration.

### Task 5: Responsive browser verification

**Files:**
- Create: `apps/web/tests/e2e/knives-image-batch-01.spec.ts`

**Produces:** Six checks across desktop, tablet, and mobile.

- [ ] Assert 22 Knives cards and 18 local `<picture>` sources.
- [ ] Confirm every Batch 01 image decodes with nonzero dimensions.
- [ ] Verify the first Batch 01 detail route, exact code, size, and local primary image.
- [ ] Assert `object-fit: contain` and no horizontal overflow.
- [ ] Run the focused Playwright spec and commit it.

### Task 6: Visual review and closeout

**Files:**
- Create after approval: `apps/web/src/test/knives-batch-01-approval.test.ts`
- Modify after approval: `apps/web/src/features/catalogue-media/knives-batch-01.ts`
- Modify after approval: `docs/review/catalogue-media/knives-batch-01-sources.md`
- Create after approval: `docs/superpowers/completions/2026-08-03-knives-batch-01-completion.md`
- Modify after approval: `README.md`

- [ ] Present the contact sheet to Ahmad.
- [ ] Record `approved` or specific replacement decisions without changing match grades.
- [ ] Add and run the focused approval regression test.
- [ ] Record completion evidence and README coordination.
