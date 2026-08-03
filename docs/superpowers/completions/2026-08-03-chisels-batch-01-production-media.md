# Chisels Batch 01 Production Media Completion

**Reviewed:** 2026-08-03 21:16 PKT  
**Branch:** `preview/chisels-image-batch-01`  
**Reviewed implementation head:** `455ef3d3316fb5235f0af0edf6ca8918eab6b0af`  
**Integration state:** isolated review branch; not merged, deployed, uploaded to Supabase, or opened as a pull request.

## Approved scope

Ahmad approved all 16 Chisels Batch 01 assets.

No asset is marked `needs-replacement`. Approval accepts the match-grade and sourcing limitations recorded in the review ledger. The Stille Osteotomes Curved asset remains explicitly graded `acceptable-similar`; approval does not restate it as an exact curved full-body photograph.

## Inventory and media totals

- Visible Batch 01 configurations: 16
- Preserved later-page Chisels records: 4
- Public Chisels records after integration: 20
- Exact Batch 01 catalogue codes: 95
- Runtime derivatives: 32
  - AVIF: 16
  - WebP: 16
- Match grades:
  - `strong-match`: 15
  - `acceptable-similar`: 1
- Rights modes:
  - `preferred-safe`: 16
- Backgrounds:
  - `transparent`: 16
- Review statuses:
  - `approved`: 16
  - `candidate`: 0 in the exported reviewed manifest
  - `needs-replacement`: 0

## Public implementation

- The 16 Batch 01 configurations resolve through one typed inventory and reviewed media manifest.
- All four existing later-page Chisels records remain preserved: Codman, Lambotte, Mini Lambotte, and Farabeuf.
- Size-only variants remain grouped beneath the same visible configuration while preserving each exact catalogue code.
- Public runtime media is local under `/media/catalogue-preview/chisels/`; no third-party runtime hotlinks are used.
- Listing and detail routes render AVIF-first `<picture>` elements with local WebP fallbacks.
- `/products/chisels` renders 20 records total, of which 16 use approved local Batch 01 media.
- `/products/chisels/osteotomes-13-5cm` preserves exact code `36-6301` and size `13.5 cm · 4 mm`.
- Instrument media uses proportional contain scaling and the documented upper-right working-end orientation.

## Verification evidence supplied by Ahmad

### Focused Vitest

The focused Chisels and directly affected catalogue suites produced 27 passing tests:

- `src/test/chisels-batch-01-inventory.test.ts` — 5 passed
- `src/test/chisels-batch-01-media.test.ts` — 3 passed
- `src/test/chisels-image-preview.test.ts` — 4 passed
- `src/test/catalogue-registry.test.ts` — 7 passed
- `src/test/f3b-page-composition.test.tsx` — 8 passed after narrowing a stale commerce-language regex that incorrectly matched `rating` inside `Operating`

The final approval regression gate also passed:

```powershell
pnpm --filter @rosa/web test -- src/test/chisels-batch-01-approval.test.ts
```

Result: 1 test passed.

### Focused Playwright

```powershell
pnpm --filter @rosa/web test:e2e -- tests/e2e/chisels-image-batch-01.spec.ts
```

Result: 6 tests passed across desktop, tablet, and mobile in 23.7 seconds.

The browser run proved:

- 20 Chisels cards total;
- 16 local AVIF sources and 16 local WebP fallbacks;
- successful nonzero image decoding;
- four legacy Chisels records preserved;
- representative detail route, code, and size data;
- contain scaling on the primary image;
- no horizontal overflow at all three viewports.

### Repository-wide checks

This media lane did not rerun or claim the complete repository suite, lint, typecheck, or build. Unrelated concurrent work remains owned by other focused branches, following Ahmad's explicit branch-isolation instruction.

## Boundary verification

This catalogue-media work remains within:

- `apps/web/**`
- `docs/**`
- the required root `README.md` coordination entry

No `services/api/**` or `packages/contracts/**` file was changed for this batch. No Supabase schema, authentication, persistence, OpenAPI operation, storage upload, deployment, or backend implementation was added.

## Review ledger

- `docs/review/catalogue-media/chisels-batch-01-sources.md`

The ledger preserves the client-catalogue source, match grade, rights mode, geometry policy, Stille curved limitation, and final approved status.

## Next authorized catalogue

The approved production order continues with **Cutters** on a separate focused branch. Chisels remains isolated until Ahmad separately authorizes integration, merge, deployment, or Supabase transfer.
