# Rosa Medical Non-Product Imagery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Source, document, process and preview premium non-product imagery for every confirmed Rosa Medical website media slot without touching product-image ownership, backend behavior, typography or the concurrent button-animation lane.

**Architecture:** Use one isolated preview branch with a small typed editorial-media registry and one reusable image component. Free-commercial-use web photography supplies hero, procurement and craftsmanship scenes; Rosa-owned catalogue PDFs supply catalogue visuals; each retained candidate is backed by a source/licence manifest and deterministic web derivatives. Existing layouts remain intact and receive only focal-position, crop, overlay and contrast adjustments.

**Tech Stack:** Next.js 16.2.11, React 19.2, TypeScript 5.9, CSS, Next `Image`, Vitest, Playwright, Node.js 24, pnpm, Sharp, Python/Pillow only for PDF-derived review compositions when required.

## Global Constraints

- Work only on `preview/non-product-imagery-01`; `main` remains authoritative.
- Do not merge into `main` or open a production PR without explicit user approval.
- Do not modify individual product photography, product variants, dimensions, catalogue product mappings or product-media agent assets.
- Do not modify button components, button CSS, motion primitives or the active cinematic-button agent's files.
- Do not modify `services/api/**`, Supabase, OpenAPI, authentication, admin behavior or quotation logic.
- Preserve the approved five-family order exactly: Knives, Scissors, Punches, Chisels, Cutters.
- Preserve public positioning: quotation-led, no prices, checkout, ordering, ratings or unsupported claims.
- Use free-commercial-use imagery for the distributable pool; restricted imagery may appear only in a clearly separated reference-only log.
- No paid-stock dependencies.
- No graphic surgery, blood, clinical procedures, visible third-party brands, fake factories, certification claims, embedded conflicting text, malformed instruments or obvious AI artifacts.
- Homepage hero must support left-side copy and right-side subject emphasis, preferably from a source at least 2400 px wide.
- Major section sources should preferably be at least 1800 px on the long edge.
- Layout changes are limited to professional `object-fit`, `object-position`, crop, overlay, contrast and responsive focal tuning.
- Retain source/licence evidence for every deliverable candidate.
- Final ZIP contains only assets that may be redistributed, optimized derivatives, manifest data and crop guidance.

---

## File Structure

### New source and documentation files

- `docs/image-sourcing/non-product-slot-inventory.md` — audited route/component/geometry inventory and ownership boundaries.
- `docs/image-sourcing/source-and-licence-manifest.md` — human-readable source, creator, licence, dimensions and attribution evidence.
- `docs/image-sourcing/source-and-licence-manifest.json` — machine-checkable manifest used by tests and packaging.
- `docs/image-sourcing/candidate-review-sheet.md` — primary/fallback comparison, focal point and crop recommendations for each slot.
- `docs/image-sourcing/rejection-log.md` — rejected candidates and reasons.
- `docs/image-sourcing/review/desktop/` — full-page desktop preview captures.
- `docs/image-sourcing/review/mobile/` — representative mobile preview captures.
- `apps/web/src/features/editorial-media/editorial-media.types.ts` — slot IDs and media metadata contracts.
- `apps/web/src/features/editorial-media/editorial-media.registry.ts` — approved preview mapping from slot IDs to optimized local assets.
- `apps/web/src/features/editorial-media/editorial-image.tsx` — reusable image renderer with desktop/mobile focal positions and optional overlay.
- `apps/web/src/features/editorial-media/index.ts` — public exports.
- `apps/web/src/features/editorial-media/editorial-media.test.tsx` — registry completeness, local-path, alt/decorative and duplicate-source tests.
- `apps/web/scripts/prepare-editorial-media.mjs` — deterministic Sharp derivative generation and dimension report.
- `apps/web/scripts/validate-editorial-manifest.mjs` — source/licence and file-presence validation.
- `apps/web/scripts/package-editorial-handoff.mjs` — approved-only ZIP staging and package manifest creation.
- `apps/web/public/media/editorial/hero/` — hero derivatives.
- `apps/web/public/media/editorial/families/` — category-tile derivatives.
- `apps/web/public/media/editorial/procurement/` — procurement/editorial derivatives.
- `apps/web/public/media/editorial/catalogues/` — catalogue cover/spread derivatives.
- `apps/web/public/media/editorial/about/` — About hero and procurement-preview derivatives.
- `apps/web/public/media/editorial/craftsmanship/` — approved craftsmanship detail derivatives.

### Existing files expected to change

- `apps/web/src/features/homepage/sections/home-hero.tsx` — replace decorative rod placeholder with H-01 editorial media.
- `apps/web/src/features/homepage/sections/procurement-support.tsx` — replace four-bar placeholder with H-07 media.
- `apps/web/src/features/homepage/sections/catalogue-access.tsx` — add H-08 through H-12 imagery to catalogue cards.
- `apps/web/src/features/public-catalogue/family-card.tsx` — replace family placeholder with H-02 through H-06 registry media without changing product cards.
- `apps/web/src/features/catalogues/catalogue-cover.tsx` — replace synthetic cover with C-01 through C-05 document imagery.
- `apps/web/src/features/about/about-page.tsx` — replace A-01 and A-02 placeholders.
- `apps/web/src/features/procurement-support/procurement-support-page.tsx` — replace P-01 placeholder.
- `apps/web/src/styles/public-pages.css` — homepage image framing, overlays and responsive focal handling.
- `apps/web/src/styles/f3c-pages.css` — catalogue-page document image framing.
- `apps/web/src/styles/f3d-pages.css` — About and Procurement Support image framing.
- Existing page/component tests that assert placeholder labels or placeholder elements — update only assertions directly affected by approved editorial-media replacement.

### Files explicitly outside this plan

- Product-detail and product-preview image components beyond the family-card use.
- Button components and button animation styles.
- `services/api/**`.
- `packages/contracts/**`.
- Supabase migrations, API routes and admin pages.

---

### Task 1: Freeze Baseline and Audit Every Non-Product Slot

**Files:**
- Create: `docs/image-sourcing/non-product-slot-inventory.md`
- Create: `docs/image-sourcing/rejection-log.md`
- Inspect only: homepage, catalogue, About and Procurement Support components and their CSS.

**Interfaces:**
- Consumes: approved design spec at `docs/superpowers/specs/2026-08-03-non-product-imagery-design.md`.
- Produces: authoritative slot table with IDs `H-01`–`H-12`, `C-01`–`C-05`, `A-01`, `A-02`, optional `A-03+`, `P-01` and only confirmed `P-02+` slots.

- [ ] **Step 1: Record the branch baseline and concurrent-lane fence**

Run:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git diff --name-only main...HEAD
```

Expected: branch is `preview/non-product-imagery-01`; only approved spec/plan documentation differs from `main` before execution edits.

- [ ] **Step 2: Enumerate actual components and placeholder ownership**

Inspect:

```bash
sed -n '1,240p' apps/web/src/features/homepage/sections/home-hero.tsx
sed -n '1,260p' apps/web/src/features/homepage/sections/family-discovery.tsx
sed -n '1,260p' apps/web/src/features/homepage/sections/procurement-support.tsx
sed -n '1,260p' apps/web/src/features/homepage/sections/catalogue-access.tsx
sed -n '1,260p' apps/web/src/features/public-catalogue/family-card.tsx
sed -n '1,220p' apps/web/src/features/public-catalogue/product-media-placeholder.tsx
sed -n '1,280p' apps/web/src/features/catalogues/catalogue-card.tsx
sed -n '1,220p' apps/web/src/features/catalogues/catalogue-cover.tsx
sed -n '1,340p' apps/web/src/features/about/about-page.tsx
sed -n '1,340p' apps/web/src/features/procurement-support/procurement-support-page.tsx
```

Expected: every planned slot maps to a real placeholder or established media surface; optional slots without a component are excluded rather than invented.

- [ ] **Step 3: Record desktop and mobile geometry**

Extract the relevant selectors:

```bash
rg -n "home-hero__visual|family-card|procurement-editorial__visual|catalogue-card" apps/web/src/styles/public-pages.css
rg -n "catalogue-document-cover|catalogue-document-card" apps/web/src/styles/f3c-pages.css
rg -n "f3d-hero__media|f3d-feature-panel__media|about-procurement-preview" apps/web/src/styles/f3d-pages.css
```

For every slot, write route, component path, rendered aspect behavior, text-safe area, desktop focal zone, mobile focal zone and whether the image is decorative or meaningful.

- [ ] **Step 4: Write the initial rejection categories**

Populate `rejection-log.md` with these fixed categories:

```markdown
- Rights unclear or redistribution prohibited
- Paid-only source
- Visible third-party branding
- Unsupported factory/certification/clinical implication
- Graphic clinical context
- Generic hospital or clipboard stock aesthetic
- Distorted or implausible instrument geometry
- Embedded text conflicts with UI
- Insufficient resolution for intended crop
- Weak desktop/mobile crop tolerance
- Visually inconsistent with selected Rosa set
- Product-specific image owned by the separate product-media lane
```

- [ ] **Step 5: Verify no code changed**

Run:

```bash
git diff --name-only
```

Expected: only slot-inventory and rejection-log documentation are new.

- [ ] **Step 6: Commit the audit**

```bash
git add docs/image-sourcing/non-product-slot-inventory.md docs/image-sourcing/rejection-log.md
git commit -m "docs: inventory non-product imagery slots"
```

---

### Task 2: Build and Document the Candidate Pool

**Files:**
- Create: `docs/image-sourcing/source-and-licence-manifest.md`
- Create: `docs/image-sourcing/source-and-licence-manifest.json`
- Create: `docs/image-sourcing/candidate-review-sheet.md`
- Modify: `docs/image-sourcing/rejection-log.md`

**Interfaces:**
- Consumes: slot IDs and crop constraints from Task 1.
- Produces: at least one primary and one fallback candidate for every confirmed slot, plus source/licence evidence.

- [ ] **Step 1: Define the machine-readable manifest shape**

Create `source-and-licence-manifest.json` with this top-level form:

```json
{
  "version": 1,
  "generatedAt": "2026-08-03",
  "candidates": []
}
```

Each candidate object must use this exact shape:

```json
{
  "id": "H-01-primary",
  "slotId": "H-01",
  "status": "primary",
  "distribution": "redistributable",
  "sourcePageUrl": "https://example.invalid/source-page",
  "directAssetUrl": "https://example.invalid/original.jpg",
  "creator": "Creator name",
  "sourceOrganization": "Source site",
  "licenceName": "Licence name",
  "licenceUrl": "https://example.invalid/licence",
  "attributionRequired": false,
  "attributionText": null,
  "originalWidth": 3000,
  "originalHeight": 2000,
  "orientation": "landscape",
  "focalPoint": "right-center",
  "desktopCrop": "16:9, protect left 44% for copy",
  "mobileCrop": "4:5, retain upper-right instrument cluster",
  "objectPositionDesktop": "72% 50%",
  "objectPositionMobile": "68% 35%",
  "overlay": "left-to-right black gradient, 0.78 to 0.12",
  "confidence": "high",
  "risks": [],
  "localSourcePath": null,
  "webAvifPath": null,
  "webWebpPath": null
}
```

Allowed enum values:

```text
status: primary | fallback | reserve | rejected
distribution: redistributable | reference-only
orientation: landscape | portrait | square
confidence: high | medium | low
```

- [ ] **Step 2: Search the hero and major editorial slots first**

Use current web search and official source pages. Prioritize permissive stock libraries and public-domain/permissive institutional sources. For each candidate, open the original source page and licence page; do not infer rights from search thumbnails.

Search groups:

```text
H-01: dark surgical instruments macro negative space, right-weighted
H-07: surgical instrument selection documentation quality review neutral packaging
A-01: surgical instrument craftsmanship macro polishing joint edge steel
A-02: catalogue review medical instruments documentation organized desk
P-01: procurement selection instruments catalogue notes structured requirement
```

Collect at least four plausible candidates per group before selecting primary/fallback.

- [ ] **Step 3: Search the five family-tile slots as one coherent set**

Search for representative category imagery, not exact product claims:

```text
H-02 Knives: surgical scalpel arrangement technical document
H-03 Scissors: surgical scissors macro finger rings arrangement
H-04 Punches: surgical punch instrument macro or catalogue document
H-05 Chisels: surgical chisel steel tips arrangement
H-06 Cutters: surgical wire cutter jaw macro arrangement
```

Reject a candidate set when color temperature, lighting or background style makes the five tiles feel unrelated.

- [ ] **Step 4: Build catalogue candidates from Rosa-owned PDFs**

Use the supplied source PDFs for Knives, Scissors, Punches, Chisels and Cutters. Record the source as user/client-provided Rosa catalogue material and note that the catalogue-derived images are internal brand assets rather than third-party stock.

Create two intended treatments per family:

```text
H-08..H-12: richer homepage editorial cover/spread treatment
C-01..C-05: clean dedicated-catalogue cover/spread treatment
```

- [ ] **Step 5: Complete the human-readable review sheet**

For each slot include:

```markdown
## H-01 — Homepage hero

### Primary: H-01-primary
- Thumbnail/contact sheet reference:
- Why it fits:
- Source and licence:
- Dimensions:
- Focal point:
- Desktop crop:
- Mobile crop:
- Overlay:
- Risks:

### Fallback: H-01-fallback
- Same fields

### Decision
- Selected for preview: primary
- Reason:
```

- [ ] **Step 6: Record every rejected serious candidate**

Append source URL and one or more fixed rejection categories to `rejection-log.md`. Do not retain unexplained rejections.

- [ ] **Step 7: Validate candidate completeness manually**

Run:

```bash
node - <<'NODE'
const manifest = require('./docs/image-sourcing/source-and-licence-manifest.json');
const required = [
  'H-01','H-02','H-03','H-04','H-05','H-06','H-07',
  'H-08','H-09','H-10','H-11','H-12',
  'C-01','C-02','C-03','C-04','C-05',
  'A-01','A-02','P-01'
];
for (const slot of required) {
  const kept = manifest.candidates.filter((candidate) =>
    candidate.slotId === slot && ['primary', 'fallback'].includes(candidate.status)
  );
  if (kept.length !== 2) throw new Error(`${slot}: expected primary + fallback, received ${kept.length}`);
}
console.log(`validated ${required.length} required slots`);
NODE
```

Expected: `validated 20 required slots`.

- [ ] **Step 8: Commit the sourcing shortlist**

```bash
git add docs/image-sourcing
git commit -m "docs: shortlist editorial imagery candidates"
```

---

### Task 3: Add Deterministic Manifest and Asset Validation

**Files:**
- Create: `apps/web/scripts/validate-editorial-manifest.mjs`
- Create: `apps/web/src/features/editorial-media/editorial-media.types.ts`
- Create: `apps/web/src/features/editorial-media/editorial-media.test.tsx`
- Modify: `apps/web/package.json` only if adding script aliases does not collide with another agent.

**Interfaces:**
- Consumes: `docs/image-sourcing/source-and-licence-manifest.json`.
- Produces: command `node apps/web/scripts/validate-editorial-manifest.mjs` and TypeScript slot union `EditorialMediaSlotId`.

- [ ] **Step 1: Write the failing registry-contract test**

Create `editorial-media.test.tsx` with the initial contract:

```ts
import { describe, expect, it } from "vitest";
import { REQUIRED_EDITORIAL_MEDIA_SLOT_IDS } from "./editorial-media.types";

describe("editorial media slot contract", () => {
  it("keeps the approved required slot order", () => {
    expect(REQUIRED_EDITORIAL_MEDIA_SLOT_IDS).toEqual([
      "H-01", "H-02", "H-03", "H-04", "H-05", "H-06", "H-07",
      "H-08", "H-09", "H-10", "H-11", "H-12",
      "C-01", "C-02", "C-03", "C-04", "C-05",
      "A-01", "A-02", "P-01"
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run:

```bash
pnpm --filter @rosa/web exec vitest run src/features/editorial-media/editorial-media.test.tsx
```

Expected: FAIL because `editorial-media.types.ts` does not exist.

- [ ] **Step 3: Implement the slot types**

Create `editorial-media.types.ts`:

```ts
export const REQUIRED_EDITORIAL_MEDIA_SLOT_IDS = [
  "H-01", "H-02", "H-03", "H-04", "H-05", "H-06", "H-07",
  "H-08", "H-09", "H-10", "H-11", "H-12",
  "C-01", "C-02", "C-03", "C-04", "C-05",
  "A-01", "A-02", "P-01"
] as const;

export type EditorialMediaSlotId = typeof REQUIRED_EDITORIAL_MEDIA_SLOT_IDS[number];
export type EditorialMediaStatus = "primary" | "fallback";
export type EditorialMediaOverlay = "none" | "hero-left" | "soft-dark" | "soft-light";

export interface EditorialMediaAsset {
  slotId: EditorialMediaSlotId;
  src: string;
  fallbackSrc: string;
  alt: string;
  decorative: boolean;
  width: number;
  height: number;
  objectPositionDesktop: string;
  objectPositionMobile: string;
  overlay: EditorialMediaOverlay;
}
```

- [ ] **Step 4: Implement manifest validation**

`validate-editorial-manifest.mjs` must fail when:

- a required slot lacks exactly one primary and one fallback;
- a redistributable candidate lacks source page, licence URL, dimensions or creator/source organization;
- a reference-only candidate contains a production `webAvifPath` or `webWebpPath`;
- duplicate candidate IDs exist;
- local paths escape approved directories;
- a production path points outside `/media/editorial/`.

The script prints one line per error and exits with status 1; otherwise it prints the candidate and slot totals and exits 0.

- [ ] **Step 5: Run tests and validation**

```bash
pnpm --filter @rosa/web exec vitest run src/features/editorial-media/editorial-media.test.tsx
node apps/web/scripts/validate-editorial-manifest.mjs
```

Expected: both PASS.

- [ ] **Step 6: Commit the contract**

```bash
git add apps/web/scripts/validate-editorial-manifest.mjs apps/web/src/features/editorial-media/editorial-media.types.ts apps/web/src/features/editorial-media/editorial-media.test.tsx apps/web/package.json
git commit -m "test: define editorial media manifest contract"
```

---

### Task 4: Download Approved Sources and Generate Web Derivatives

**Files:**
- Create: `apps/web/scripts/prepare-editorial-media.mjs`
- Create: optimized media under `apps/web/public/media/editorial/**`.
- Modify: `docs/image-sourcing/source-and-licence-manifest.json` with local and derivative paths.
- Create: `docs/image-sourcing/asset-dimensions.json`.

**Interfaces:**
- Consumes: redistributable primary/fallback source records from Task 2.
- Produces: deterministic AVIF/WebP derivatives and dimensions report.

- [ ] **Step 1: Stage source files outside production directories**

Use a temporary ignored workspace such as:

```text
/tmp/rosa-editorial-sources/<candidate-id>.<ext>
```

Download only from the recorded source/direct asset URL when the source permits it. Catalogue source pages may be rendered from the supplied PDFs rather than downloaded from the web.

- [ ] **Step 2: Verify source bytes and dimensions**

Run a script that reads every staged file through Sharp and compares actual dimensions against the manifest. Any mismatch larger than metadata rotation normalization must stop processing and be corrected in the manifest.

- [ ] **Step 3: Write derivative-generation tests as script assertions**

For each retained primary/fallback, the preparation script must assert:

```text
- source decodes successfully
- no requested crop exceeds source bounds
- output width is never greater than source width
- AVIF and WebP outputs both exist
- output dimensions match the slot preset
- output file is non-empty
- reference-only candidates are skipped
```

- [ ] **Step 4: Implement slot presets**

Use exact presets:

```js
const SLOT_PRESETS = {
  "H-01": { width: 2560, height: 1440, fit: "cover" },
  "H-02": { width: 1600, height: 1200, fit: "cover" },
  "H-03": { width: 1920, height: 1200, fit: "cover" },
  "H-04": { width: 1920, height: 1200, fit: "cover" },
  "H-05": { width: 1600, height: 1200, fit: "cover" },
  "H-06": { width: 2240, height: 1000, fit: "cover" },
  "H-07": { width: 1600, height: 1800, fit: "cover" },
  "H-08": { width: 1200, height: 1500, fit: "cover" },
  "H-09": { width: 1200, height: 1500, fit: "cover" },
  "H-10": { width: 1200, height: 1500, fit: "cover" },
  "H-11": { width: 1200, height: 1500, fit: "cover" },
  "H-12": { width: 1200, height: 1500, fit: "cover" },
  "C-01": { width: 1400, height: 1800, fit: "cover" },
  "C-02": { width: 1400, height: 1800, fit: "cover" },
  "C-03": { width: 1400, height: 1800, fit: "cover" },
  "C-04": { width: 1400, height: 1800, fit: "cover" },
  "C-05": { width: 1400, height: 1800, fit: "cover" },
  "A-01": { width: 1500, height: 1900, fit: "cover" },
  "A-02": { width: 1800, height: 1350, fit: "cover" },
  "P-01": { width: 1500, height: 1900, fit: "cover" }
};
```

When a source cannot truthfully support its preset without upscaling, keep a smaller output and record the exception in `candidate-review-sheet.md`; do not upscale.

- [ ] **Step 5: Generate AVIF and WebP outputs**

Use Sharp settings:

```js
await pipeline.avif({ quality: 70, effort: 6 }).toFile(avifPath);
await pipeline.webp({ quality: 82, effort: 6 }).toFile(webpPath);
```

Use stable filenames:

```text
<slot-id-lowercase>-primary.avif
<slot-id-lowercase>-primary.webp
<slot-id-lowercase>-fallback.avif
<slot-id-lowercase>-fallback.webp
```

- [ ] **Step 6: Run preparation and validation**

```bash
node apps/web/scripts/prepare-editorial-media.mjs
node apps/web/scripts/validate-editorial-manifest.mjs
```

Expected: all redistributable candidates processed; no reference-only output; dimensions report written.

- [ ] **Step 7: Commit the processed asset batch**

```bash
git add apps/web/scripts/prepare-editorial-media.mjs apps/web/public/media/editorial docs/image-sourcing/source-and-licence-manifest.json docs/image-sourcing/asset-dimensions.json
git commit -m "assets: prepare editorial imagery candidates"
```

---

### Task 5: Add the Typed Editorial Image Registry and Renderer

**Files:**
- Create: `apps/web/src/features/editorial-media/editorial-media.registry.ts`
- Create: `apps/web/src/features/editorial-media/editorial-image.tsx`
- Create: `apps/web/src/features/editorial-media/index.ts`
- Modify: `apps/web/src/features/editorial-media/editorial-media.test.tsx`

**Interfaces:**
- Consumes: `EditorialMediaAsset` from Task 3 and generated paths from Task 4.
- Produces: `EDITORIAL_MEDIA`, `getEditorialMedia(slotId)` and `<EditorialImage slotId ... />`.

- [ ] **Step 1: Write failing registry-completeness tests**

Add:

```ts
import { EDITORIAL_MEDIA, getEditorialMedia } from "./editorial-media.registry";

it("maps every required slot to a unique local primary and fallback", () => {
  const assets = REQUIRED_EDITORIAL_MEDIA_SLOT_IDS.map(getEditorialMedia);
  expect(assets).toHaveLength(REQUIRED_EDITORIAL_MEDIA_SLOT_IDS.length);
  expect(new Set(assets.map((asset) => asset.src)).size).toBe(assets.length);
  expect(new Set(assets.map((asset) => asset.fallbackSrc)).size).toBe(assets.length);
  for (const asset of assets) {
    expect(asset.src).toMatch(/^\/media\/editorial\/.+\.avif$/);
    expect(asset.fallbackSrc).toMatch(/^\/media\/editorial\/.+\.avif$/);
    expect(asset.width).toBeGreaterThan(0);
    expect(asset.height).toBeGreaterThan(0);
    expect(asset.objectPositionDesktop).toMatch(/%/);
    expect(asset.objectPositionMobile).toMatch(/%/);
  }
});

it("keeps decorative media alt text empty", () => {
  for (const asset of Object.values(EDITORIAL_MEDIA)) {
    if (asset.decorative) expect(asset.alt).toBe("");
    else expect(asset.alt.length).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 2: Run the test to verify failure**

```bash
pnpm --filter @rosa/web exec vitest run src/features/editorial-media/editorial-media.test.tsx
```

Expected: FAIL because registry module does not exist.

- [ ] **Step 3: Implement the registry**

Create one explicit object entry per slot. Do not generate entries by index because slot-to-family mapping must remain reviewable.

```ts
export const EDITORIAL_MEDIA = {
  "H-01": {
    slotId: "H-01",
    src: "/media/editorial/hero/h-01-primary.avif",
    fallbackSrc: "/media/editorial/hero/h-01-fallback.avif",
    alt: "",
    decorative: true,
    width: 2560,
    height: 1440,
    objectPositionDesktop: "72% 50%",
    objectPositionMobile: "68% 35%",
    overlay: "hero-left"
  }
} satisfies Record<EditorialMediaSlotId, EditorialMediaAsset>;

export function getEditorialMedia(slotId: EditorialMediaSlotId): EditorialMediaAsset {
  return EDITORIAL_MEDIA[slotId];
}
```

Repeat with the reviewed values for all required slots.

- [ ] **Step 4: Implement the renderer**

The component contract:

```ts
interface EditorialImageProps {
  slotId: EditorialMediaSlotId;
  className?: string;
  priority?: boolean;
  sizes: string;
}
```

Render a wrapper with CSS custom properties:

```tsx
<div
  className={`editorial-image editorial-image--${asset.overlay} ${className}`.trim()}
  style={{
    "--editorial-position-desktop": asset.objectPositionDesktop,
    "--editorial-position-mobile": asset.objectPositionMobile
  } as React.CSSProperties}
>
  <Image
    src={asset.src}
    alt={asset.alt}
    fill
    priority={priority}
    sizes={sizes}
    aria-hidden={asset.decorative || undefined}
  />
</div>
```

Use the AVIF primary in the preview registry. Keep fallback assets available for user switching and review; do not add client-side network fallback complexity.

- [ ] **Step 5: Add base editorial image CSS**

In the existing appropriate shared stylesheet, add only:

```css
.editorial-image {
  position: relative;
  overflow: hidden;
}

.editorial-image > img {
  object-fit: cover;
  object-position: var(--editorial-position-desktop, 50% 50%);
}

@media (max-width: 48rem) {
  .editorial-image > img {
    object-position: var(--editorial-position-mobile, 50% 50%);
  }
}
```

Overlay variants must use pseudo-elements and `pointer-events: none`.

- [ ] **Step 6: Run focused tests and typecheck**

```bash
pnpm --filter @rosa/web exec vitest run src/features/editorial-media/editorial-media.test.tsx
pnpm --filter @rosa/web typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit the media foundation**

```bash
git add apps/web/src/features/editorial-media apps/web/src/styles/public-pages.css
git commit -m "feat: add typed editorial media foundation"
```

---

### Task 6: Integrate Homepage Hero and Procurement Editorial Media

**Files:**
- Modify: `apps/web/src/features/homepage/sections/home-hero.tsx`
- Modify: `apps/web/src/features/homepage/sections/procurement-support.tsx`
- Modify: `apps/web/src/styles/public-pages.css`
- Modify/Create focused homepage tests that currently assert synthetic placeholder bars.

**Interfaces:**
- Consumes: `<EditorialImage>` from Task 5.
- Produces: H-01 and H-07 in actual homepage layout.

- [ ] **Step 1: Write failing component assertions**

Assert that rendered homepage markup contains:

```text
data-editorial-slot="H-01"
data-editorial-slot="H-07"
```

and no longer contains the synthetic `home-hero__visual::before/::after` representation or the four empty procurement spans.

- [ ] **Step 2: Run focused homepage tests to verify failure**

```bash
pnpm --filter @rosa/web exec vitest run src/features/homepage
```

Expected: new assertions FAIL.

- [ ] **Step 3: Replace H-01 markup**

Replace:

```tsx
<div className="home-hero__visual" aria-hidden="true" />
```

with:

```tsx
<EditorialImage
  slotId="H-01"
  className="home-hero__visual"
  priority
  sizes="(max-width: 768px) 100vw, 52vw"
/>
```

Add `data-editorial-slot={slotId}` inside `EditorialImage` for testing and review tooling.

- [ ] **Step 4: Replace H-07 markup**

Replace the four placeholder spans with:

```tsx
<EditorialImage
  slotId="H-07"
  className="procurement-editorial__visual"
  sizes="(max-width: 768px) 100vw, 44vw"
/>
```

- [ ] **Step 5: Tune framing without changing layout dimensions**

Remove only the synthetic rod/span drawing rules. Preserve current grid columns and minimum heights. Add restrained image-specific background/overlay rules. The hero overlay must protect left-side copy but preserve the right-side metallic subject.

- [ ] **Step 6: Run focused tests, typecheck and build**

```bash
pnpm --filter @rosa/web exec vitest run src/features/homepage
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web build
```

Expected: PASS.

- [ ] **Step 7: Commit homepage major imagery**

```bash
git add apps/web/src/features/homepage apps/web/src/styles/public-pages.css
git commit -m "feat: preview homepage editorial imagery"
```

---

### Task 7: Integrate the Five Family Category Images Without Touching Product Cards

**Files:**
- Modify: `apps/web/src/features/public-catalogue/family-card.tsx`
- Modify: `apps/web/src/styles/public-pages.css`
- Modify/Create: focused family-card tests.

**Interfaces:**
- Consumes: `family.slug`, locked family order and slots H-02 through H-06.
- Produces: explicit `FamilySlug -> EditorialMediaSlotId` mapping.

- [ ] **Step 1: Write the failing family-slot mapping test**

Test this exact mapping:

```ts
expect(FAMILY_EDITORIAL_SLOT).toEqual({
  knives: "H-02",
  scissors: "H-03",
  punches: "H-04",
  chisels: "H-05",
  cutters: "H-06"
});
```

- [ ] **Step 2: Run the focused test to verify failure**

```bash
pnpm --filter @rosa/web exec vitest run src/features/public-catalogue
```

Expected: FAIL because mapping is absent.

- [ ] **Step 3: Implement explicit category mapping**

Add:

```ts
const FAMILY_EDITORIAL_SLOT = {
  knives: "H-02",
  scissors: "H-03",
  punches: "H-04",
  chisels: "H-05",
  cutters: "H-06"
} as const satisfies Record<FamilySlug, EditorialMediaSlotId>;
```

Replace only the `ProductMediaPlaceholder` inside `FamilyCard` with `EditorialImage`. Do not change `ProductPreviewCard`, product-detail media or the shared placeholder component used by the product lane.

- [ ] **Step 4: Add text-protection overlays per existing light/dark tile rhythm**

Use one generic family-card overlay plus existing tile color classes. Do not add family-specific CSS beyond focal position values already stored in the registry.

- [ ] **Step 5: Verify family order, links and accessibility**

Run tests asserting:

```text
Knives -> H-02
Scissors -> H-03
Punches -> H-04
Chisels -> H-05
Cutters -> H-06
```

and that all existing family links remain unchanged.

- [ ] **Step 6: Run tests and typecheck**

```bash
pnpm --filter @rosa/web exec vitest run src/features/public-catalogue src/features/homepage
pnpm --filter @rosa/web typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit category imagery**

```bash
git add apps/web/src/features/public-catalogue/family-card.tsx apps/web/src/styles/public-pages.css apps/web/src/features/public-catalogue
git commit -m "feat: preview family category imagery"
```

---

### Task 8: Generate and Integrate Catalogue Imagery

**Files:**
- Create: catalogue-derived primary/fallback derivatives under `apps/web/public/media/editorial/catalogues/`.
- Modify: `apps/web/src/features/homepage/sections/catalogue-access.tsx`
- Modify: `apps/web/src/features/catalogues/catalogue-cover.tsx`
- Modify: `apps/web/src/styles/public-pages.css`
- Modify: `apps/web/src/styles/f3c-pages.css`
- Modify/Create: catalogue component tests.

**Interfaces:**
- Consumes: actual Rosa catalogue PDFs and slots H-08 through H-12, C-01 through C-05.
- Produces: richer homepage catalogue cards and cleaner dedicated-page catalogue covers.

- [ ] **Step 1: Render truthful source pages from each PDF**

For each family, render:

```text
- cover or strongest title page
- one representative interior spread where useful
```

Do not remove or fabricate document text. Any perspective treatment must remain a presentation of actual page content.

- [ ] **Step 2: Produce two coordinated treatments per family**

Homepage:

```text
H-08 Knives
H-09 Scissors
H-10 Punches
H-11 Chisels
H-12 Cutters
```

Dedicated page:

```text
C-01 Knives
C-02 Scissors
C-03 Punches
C-04 Chisels
C-05 Cutters
```

Homepage versions may use layered paper, subtle perspective and refined surfaces. Dedicated-page versions remain cleaner and more document-recognizable.

- [ ] **Step 3: Write failing catalogue slot tests**

Assert the homepage list maps sequence 01–05 to H-08–H-12 and `CatalogueCover` maps family slugs to C-01–C-05.

- [ ] **Step 4: Integrate homepage catalogue images**

Add a visual layer inside `.catalogue-card` without changing its link target, title, number or action copy. Ensure text remains legible and the first-card red treatment is not lost; use a controlled tint/overlay rather than deleting the established hierarchy.

- [ ] **Step 5: Integrate dedicated-page covers**

Replace the synthetic sequence/title/PDF cover drawing with `EditorialImage`, while retaining an accessible label derived from `document.coverLabel` and preserving card actions/status text.

- [ ] **Step 6: Run catalogue tests and typecheck**

```bash
pnpm --filter @rosa/web exec vitest run src/features/catalogues src/features/homepage
pnpm --filter @rosa/web typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit catalogue imagery**

```bash
git add apps/web/public/media/editorial/catalogues apps/web/src/features/catalogues apps/web/src/features/homepage/sections/catalogue-access.tsx apps/web/src/styles/public-pages.css apps/web/src/styles/f3c-pages.css
git commit -m "feat: preview catalogue editorial imagery"
```

---

### Task 9: Integrate About and Procurement Support Imagery

**Files:**
- Modify: `apps/web/src/features/about/about-page.tsx`
- Modify: `apps/web/src/features/procurement-support/procurement-support-page.tsx`
- Modify: `apps/web/src/styles/f3d-pages.css`
- Modify/Create: focused F3D page tests.

**Interfaces:**
- Consumes: A-01, A-02 and P-01 registry entries.
- Produces: craftsmanship-led About hero, organized About procurement preview and Procurement Support hero.

- [ ] **Step 1: Write failing slot assertions**

Assert:

```text
/about contains A-01 and A-02
/procurement-support contains P-01
```

and no longer exposes the old placeholder labels for those slots.

- [ ] **Step 2: Run focused tests to verify failure**

```bash
pnpm --filter @rosa/web exec vitest run src/features/about src/features/procurement-support
```

Expected: FAIL.

- [ ] **Step 3: Replace About hero placeholder**

Use:

```tsx
<EditorialImage
  slotId="A-01"
  className="f3d-hero__media"
  sizes="(max-width: 768px) 100vw, 38vw"
/>
```

Preserve portrait behavior and all copy.

- [ ] **Step 4: Replace About procurement preview placeholder**

Use A-02 and preserve the existing two-column feature-panel dimensions.

- [ ] **Step 5: Replace Procurement Support hero placeholder**

Use P-01 with the same portrait slot dimensions as the About hero.

- [ ] **Step 6: Tune only focal framing and restrained overlays**

Do not add a factory timeline or new image sections. Do not imply Rosa owns visible machinery or facilities.

- [ ] **Step 7: Run tests, typecheck and build**

```bash
pnpm --filter @rosa/web exec vitest run src/features/about src/features/procurement-support
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web build
```

Expected: PASS.

- [ ] **Step 8: Commit F3D imagery**

```bash
git add apps/web/src/features/about apps/web/src/features/procurement-support apps/web/src/styles/f3d-pages.css
git commit -m "feat: preview craftsmanship and procurement imagery"
```

---

### Task 10: Capture Desktop and Mobile Review Previews

**Files:**
- Create: `docs/image-sourcing/review/desktop/*.png`
- Create: `docs/image-sourcing/review/mobile/*.png`
- Modify: `docs/image-sourcing/candidate-review-sheet.md`

**Interfaces:**
- Consumes: fully integrated primary preview registry.
- Produces: reviewable full-page captures and crop findings.

- [ ] **Step 1: Start the application locally**

```bash
pnpm --filter @rosa/web dev
```

Expected: local Next application available without modifying production environment variables.

- [ ] **Step 2: Capture required desktop routes at 1440 px width**

Capture:

```text
/
/catalogues
/about
/procurement-support
```

Use full-page screenshots and store them under `docs/image-sourcing/review/desktop/`.

- [ ] **Step 3: Capture representative mobile routes at 390 px width**

Capture the same routes under `docs/image-sourcing/review/mobile/`.

- [ ] **Step 4: Review each crop against explicit checks**

For every image answer yes/no:

```text
- Subject remains recognizable
- Adjacent copy remains legible
- No important instrument part is accidentally cut
- No third-party brand enters crop
- No text embedded in source conflicts with UI
- Lighting and color remain consistent with neighboring sections
- Mobile crop remains intentional rather than accidental
- Image does not appear to claim exact product identity
```

- [ ] **Step 5: Apply one restrained correction pass**

Adjust registry focal positions or overlay classes only. Do not resize sections or refactor unrelated layout.

- [ ] **Step 6: Re-run screenshots after corrections**

Replace prior captures so review folders always show the current branch state.

- [ ] **Step 7: Run accessibility and public-route regression tests**

```bash
pnpm --filter @rosa/web lint
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web test
pnpm --filter @rosa/web build
pnpm --filter @rosa/web exec playwright test --grep "homepage|catalogues|about|procurement"
```

Expected: no new failures; intentional environment-dependent skips remain documented rather than hidden.

- [ ] **Step 8: Commit the review package**

```bash
git add docs/image-sourcing/review docs/image-sourcing/candidate-review-sheet.md apps/web/src/features/editorial-media/editorial-media.registry.ts apps/web/src/styles
git commit -m "docs: add editorial imagery review previews"
```

---

### Task 11: Present Primary and Fallback Review Without Merging

**Files:**
- Modify: `docs/image-sourcing/candidate-review-sheet.md`
- Optional temporary preview switch: `apps/web/src/features/editorial-media/editorial-media.registry.ts`

**Interfaces:**
- Consumes: primary integrated screenshots and all fallback assets.
- Produces: user decisions `approved`, `replace-with-fallback`, `resourc​​e`, or `reject` per slot.

- [ ] **Step 1: Produce a concise review index**

For each slot, link or embed:

```text
- primary source thumbnail
- fallback source thumbnail
- primary in-layout crop
- source and licence summary
- recommendation and risk note
```

- [ ] **Step 2: Present review in logical batches**

Batch order:

```text
1. Homepage hero + procurement
2. Five family tiles
3. Homepage and dedicated catalogue imagery
4. About and Procurement Support imagery
5. Full-page desktop/mobile consistency pass
```

- [ ] **Step 3: Record decisions immediately**

Update the decision field in `candidate-review-sheet.md` and the selected status in the JSON manifest. Do not rely on chat-only decisions.

- [ ] **Step 4: Apply approved fallback switches**

Change only the affected registry `src`, dimensions/focal positions and review captures.

- [ ] **Step 5: Re-run focused validation after every decision batch**

```bash
node apps/web/scripts/validate-editorial-manifest.mjs
pnpm --filter @rosa/web exec vitest run src/features/editorial-media
pnpm --filter @rosa/web typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit approved decisions**

```bash
git add docs/image-sourcing apps/web/src/features/editorial-media apps/web/public/media/editorial
git commit -m "assets: apply approved editorial imagery selections"
```

---

### Task 12: Prepare the Approved Handoff ZIP

**Files:**
- Create: `apps/web/scripts/package-editorial-handoff.mjs`
- Create locally: `dist/rosa-medical-non-product-imagery-approved.zip`
- Create: `docs/image-sourcing/handoff-manifest.json`
- Modify: `README.md` with a short isolated-branch coordination note only after selections are approved.

**Interfaces:**
- Consumes: approved selection state and redistributable candidates only.
- Produces: final ZIP for the main integration agent and a branch coordination record.

- [ ] **Step 1: Write packaging assertions**

The packager must fail when:

```text
- any selected candidate is reference-only
- any selected candidate lacks a licence/source record
- any expected derivative is missing
- rejected or reserve assets are staged
- a path escapes the staging directory
- duplicate output filenames exist
```

- [ ] **Step 2: Define ZIP contents**

Exact package structure:

```text
rosa-medical-non-product-imagery/
  originals/                 # only when redistribution permits
  optimized/avif/
  optimized/webp/
  previews/desktop/
  previews/mobile/
  documentation/source-and-licence-manifest.md
  documentation/source-and-licence-manifest.json
  documentation/candidate-review-sheet.md
  documentation/non-product-slot-inventory.md
  documentation/crop-guidance.md
  handoff-manifest.json
```

- [ ] **Step 3: Generate crop guidance**

For every approved slot include final desktop/mobile object position, overlay class, rendered context and intended component path.

- [ ] **Step 4: Run full verification before packaging**

```bash
node apps/web/scripts/validate-editorial-manifest.mjs
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected: PASS, or any pre-existing unrelated failure is documented with evidence and not falsely claimed as passing.

- [ ] **Step 5: Build and inspect the ZIP**

```bash
node apps/web/scripts/package-editorial-handoff.mjs
unzip -l dist/rosa-medical-non-product-imagery-approved.zip
```

Expected: only approved redistributable assets and required documentation appear.

- [ ] **Step 6: Update the root coordination record**

Add a concise README note stating:

```text
- branch name
- approved imagery scope
- latest commit SHA
- verification performed
- ZIP filename
- explicit instruction not to overwrite product-image or button-animation lanes
- no merge has occurred
```

- [ ] **Step 7: Commit the finalized handoff metadata**

```bash
git add apps/web/scripts/package-editorial-handoff.mjs docs/image-sourcing README.md
git commit -m "docs: finalize editorial imagery handoff"
```

- [ ] **Step 8: Verify branch isolation**

```bash
git diff --name-only main...HEAD
git log --oneline --decorate main..HEAD
```

Expected: changes are limited to the approved non-product imagery lane, its tests, scripts and documentation.

---

## Plan Self-Review

### Spec coverage

- Homepage hero: Tasks 2, 4, 6 and 10.
- Five family/category tiles: Tasks 2, 4, 7 and 10.
- Homepage catalogue presentation: Tasks 2, 4, 8 and 10.
- Dedicated catalogue presentation: Tasks 2, 4, 8 and 10.
- Homepage procurement visual: Tasks 2, 4, 6 and 10.
- About craftsmanship hero and procurement preview: Tasks 2, 4, 9 and 10.
- Procurement Support hero: Tasks 2, 4, 9 and 10.
- Primary/fallback, source, licence, dimensions and crops: Tasks 2, 3 and 11.
- Restrained layout-only presentation changes: Tasks 5 through 10.
- Desktop/mobile preview: Task 10.
- Approval gate before final handoff: Task 11.
- Redistributable final ZIP: Task 12.
- Product-image and button-animation lane protection: Global Constraints, Tasks 1, 7 and 12.

### Placeholder scan

The plan contains no `TBD`, `TODO`, unspecified implementation step or deferred requirement. Optional `A-03+` and `P-02+` slots are explicitly excluded unless Task 1 confirms a current component already expects them.

### Type consistency

- `EditorialMediaSlotId`, `EditorialMediaAsset`, `REQUIRED_EDITORIAL_MEDIA_SLOT_IDS`, `EDITORIAL_MEDIA`, `getEditorialMedia` and `EditorialImage` are defined once and used consistently.
- Slot IDs and family mapping remain fixed across sourcing, processing, registry and tests.
- Manifest primary/fallback states remain separate from the registry-selected preview source.
