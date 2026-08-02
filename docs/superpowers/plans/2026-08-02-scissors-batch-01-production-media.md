# Scissors Batch 01 Production Media Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary external Scissors preview with 42 locally stored, source-tracked, production-reviewable media configurations covering Iris, Stevens, OP, Mayo, and Metzenbaum Scissors.

**Architecture:** Keep catalogue identity and grouped product configurations in a typed frontend inventory, keep source/provenance and local derivative paths in a separate media manifest, and join them by a stable `mediaAssetId`. Generate one product route per visible configuration while preserving every exact catalogue code and size beneath that route. The public UI reads only local AVIF/WebP derivatives; source URLs and review metadata remain available to tests and review documentation.

**Tech Stack:** Next.js 16.2.11, React 19.2, TypeScript 5.9, Vitest 3.2, Playwright 1.57, Python 3 with Pillow 12.2 for offline image normalization, pnpm 11.4, Node.js 24.

## Global Constraints

- Work from `preview/scissors-image-batch-01`; do not merge, deploy, or open a pull request without Ahmad's explicit instruction.
- Frontend changes stay under `apps/web/**`; documentation changes stay under `docs/**` and the shared README update section only.
- Do not modify `services/api/**`, OpenAPI operations, Supabase schema, authentication, persistence, or production storage configuration.
- The backend partner owns final Supabase Storage integration.
- The supplied Scissors catalogue is authoritative for identity, code, size, direction, point style, finish, and visible geometry.
- Verified mapping: Iris uses the `0800/0810/0802/0812` suffix series; Stevens uses the `0901/0911` suffix series.
- Batch 01 contains exactly 42 visible configurations and 132 exact catalogue codes.
- Visibly different finish, direction, and point-style combinations receive separate assets.
- Size-only variants share one asset within the same visible configuration.
- Approved runtime media paths must be local `/media/catalogue-preview/scissors/...` paths; no third-party runtime hotlinks are allowed.
- Every selected source requires a source page URL, match grade, rights mode, processing notes, orientation notes, reuse scope, and review status.
- Match grades are `exact`, `strong-match`, or `acceptable-similar`; rejected candidates never enter the manifest.
- Rights modes are `preferred-safe` or `supplier-fallback`; do not claim rights clearance unless the source explicitly supports it.
- Transparent output is preferred; `clean-white` is allowed only when preserving transparency would damage instrument edges or fine tips.
- Never stretch, reshape, regenerate, or otherwise alter instrument geometry.
- Preserve the existing `mayo-scissors` route used by inquiry previews.
- Avoid unnecessary GitHub Actions runs; verification is local unless explicitly requested.

---

## File Structure

### Create

- `apps/web/src/features/catalogue-media/types.ts` - media/provenance contracts.
- `apps/web/src/features/catalogue-media/validation.ts` - reusable manifest validation.
- `apps/web/src/features/catalogue-media/scissors-batch-01.ts` - 42 selected media records.
- `apps/web/src/features/catalogue-media/index.ts` - public exports for frontend code and tests.
- `apps/web/src/features/catalogue-registry/products/scissors-batch-01.ts` - exact grouped configuration inventory and code generation.
- `apps/web/scripts/catalogue_media_normalize.py` - deterministic crop, rotate, scale, pad, AVIF, and WebP derivative generation.
- `apps/web/scripts/requirements-catalogue-media.txt` - `Pillow==12.2.0`.
- `apps/web/src/test/scissors-batch-01-inventory.test.ts` - 42-configuration and 132-code contract tests.
- `apps/web/src/test/scissors-batch-01-media.test.ts` - source metadata, local files, and cross-boundary reuse tests.
- `apps/web/tests/e2e/scissors-image-batch-01.spec.ts` - desktop/mobile family and detail-page media checks.
- `docs/review/catalogue-media/scissors-batch-01-sources.md` - human-readable source and review ledger.
- `docs/superpowers/completions/2026-08-02-scissors-batch-01-production-media.md` - final evidence and unresolved-source record.
- `apps/web/public/media/catalogue-preview/scissors/*.avif` - 42 AVIF derivatives.
- `apps/web/public/media/catalogue-preview/scissors/*.webp` - 42 WebP fallbacks.

### Modify

- `apps/web/src/features/catalogue-registry/types.ts` - add grouped code entries and media fallback fields.
- `apps/web/src/features/catalogue-registry/products/scissors.ts` - replace temporary 15-record external preview with 42 grouped configurations joined to local media.
- `apps/web/src/features/public-catalogue/product-media-placeholder.tsx` - render AVIF with WebP fallback using `<picture>`.
- `apps/web/src/features/family-listing/family-product-card.tsx` - present grouped code/size counts without changing route behavior.
- `apps/web/src/features/product-detail/product-gallery.tsx` - display the selected local asset in the primary gallery and first thumbnail.
- `apps/web/src/styles/scissors-image-preview.css` - consistent canvas, padding, orientation, and mobile scaling.
- `apps/web/src/test/scissors-image-preview.test.ts` - replace obsolete external-hotlink expectations with the production-media contract.
- `README.md` - append one factual frontend coordination entry after all verification passes.

---

### Task 1: Build the exact 42-configuration Scissors inventory

**Files:**
- Create: `apps/web/src/features/catalogue-registry/products/scissors-batch-01.ts`
- Create: `apps/web/src/test/scissors-batch-01-inventory.test.ts`

**Interfaces:**
- Produces: `SCISSORS_BATCH_01_CONFIGURATIONS: readonly ScissorsConfiguration[]`
- Produces: `ScissorsConfiguration`, `ScissorsCodeOption`, `ScissorsFinish`, `ScissorsDirection`, and `ScissorsPointStyle`
- Consumed by: Tasks 2, 3, 5, 6, 7, and 9

- [ ] **Step 1: Write the failing inventory test**

```ts
import { describe, expect, it } from "vitest";
import { SCISSORS_BATCH_01_CONFIGURATIONS } from "@/features/catalogue-registry/products/scissors-batch-01";

describe("Scissors Batch 01 inventory", () => {
  it("contains the approved 42 visible configurations", () => {
    expect(SCISSORS_BATCH_01_CONFIGURATIONS).toHaveLength(42);

    const counts = Object.fromEntries(
      ["iris", "stevens", "operating", "mayo", "metzenbaum"].map((family) => [
        family,
        SCISSORS_BATCH_01_CONFIGURATIONS.filter((item) => item.familyKey === family).length
      ])
    );

    expect(counts).toEqual({
      iris: 6,
      stevens: 6,
      operating: 18,
      mayo: 6,
      metzenbaum: 6
    });
  });

  it("preserves all 132 exact catalogue codes without duplication", () => {
    const codes = SCISSORS_BATCH_01_CONFIGURATIONS.flatMap((item) =>
      item.codeOptions.map((option) => option.code)
    );

    expect(codes).toHaveLength(132);
    expect(new Set(codes).size).toBe(132);
  });

  it("uses the catalogue-confirmed Iris and Stevens mappings", () => {
    const irisCodes = SCISSORS_BATCH_01_CONFIGURATIONS
      .filter((item) => item.familyKey === "iris")
      .flatMap((item) => item.codeOptions.map((option) => option.code));
    const stevensCodes = SCISSORS_BATCH_01_CONFIGURATIONS
      .filter((item) => item.familyKey === "stevens")
      .flatMap((item) => item.codeOptions.map((option) => option.code));

    expect(irisCodes).toContain("04-0800");
    expect(irisCodes).toContain("06-0812");
    expect(irisCodes).not.toContain("04-0901");
    expect(stevensCodes).toContain("04-0901");
    expect(stevensCodes).toContain("06-0911");
    expect(stevensCodes).not.toContain("04-0800");
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run:

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-inventory.test.ts
```

Expected: FAIL because `scissors-batch-01.ts` does not exist.

- [ ] **Step 3: Create the inventory types and deterministic generators**

Use these exact contracts:

```ts
export type ScissorsFinish = "Regular" | "Super Cut" | "Tungsten Carbide";
export type ScissorsDirection = "Straight" | "Curved";
export type ScissorsPointStyle = "Sharp" | "Blunt" | "Sharp/Sharp" | "Sharp/Blunt" | "Blunt/Blunt";

export interface ScissorsCodeOption {
  code: string;
  size: string;
}

export interface ScissorsConfiguration {
  id: string;
  slug: string;
  familyKey: "iris" | "stevens" | "operating" | "mayo" | "metzenbaum";
  name: string;
  finish: ScissorsFinish;
  direction: ScissorsDirection;
  pointStyle: ScissorsPointStyle;
  cataloguePage: "1" | "2" | "3";
  codeOptions: readonly ScissorsCodeOption[];
  mediaAssetId: string;
}
```

Use this finish-to-prefix mapping:

```ts
const FINISHES = [
  { finish: "Regular", prefix: "04" },
  { finish: "Super Cut", prefix: "05" },
  { finish: "Tungsten Carbide", prefix: "06" }
] as const;
```

Use these exact suffix and size tables:

```ts
const IRIS = {
  Straight: [["0800", "9.5 cm"], ["0802", "11.5 cm"]],
  Curved: [["0810", "9.5 cm"], ["0812", "11.5 cm"]]
} as const;

const STEVENS = {
  Straight: [["0901", "10.5 cm"]],
  Curved: [["0911", "10.5 cm"]]
} as const;

const MAYO = {
  Straight: [["0401", "14.5 cm"], ["0402", "17 cm"], ["0403", "20 cm"], ["0404", "23 cm"]],
  Curved: [["0411", "14.5 cm"], ["0412", "17 cm"], ["0413", "20 cm"], ["0414", "23 cm"]]
} as const;

const METZENBAUM = {
  Straight: [["1901", "11 cm"], ["1902", "14 cm"], ["1909", "16 cm"], ["1903", "18 cm"], ["1904", "20 cm"], ["1905", "23 cm"]],
  Curved: [["1911", "11 cm"], ["1912", "14 cm"], ["1919", "16 cm"], ["1913", "18 cm"], ["1914", "20 cm"], ["1915", "23 cm"]]
} as const;

const OPERATING = {
  "Sharp/Sharp": {
    Straight: [["0121", "12 cm"], ["0101", "14 cm"], ["0102", "17 cm"]],
    Curved: [["0131", "12 cm"], ["0111", "14 cm"], ["0112", "17 cm"]]
  },
  "Sharp/Blunt": {
    Straight: [["0221", "12 cm"], ["0201", "14 cm"], ["0202", "17 cm"]],
    Curved: [["0231", "12 cm"], ["0211", "14 cm"], ["0212", "17 cm"]]
  },
  "Blunt/Blunt": {
    Straight: [["0321", "12 cm"], ["0301", "14 cm"], ["0302", "17 cm"]],
    Curved: [["0331", "12 cm"], ["0311", "14 cm"], ["0312", "17 cm"]]
  }
} as const;
```

Generate IDs, slugs, and media IDs with lowercase kebab-case components. Preserve the legacy Mayo route by assigning `mayo-scissors` to Regular/Straight; every other configuration receives an explicit finish and direction suffix.

- [ ] **Step 4: Run the inventory test**

Run:

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-inventory.test.ts
```

Expected: PASS, 42 configurations and 132 unique codes.

- [ ] **Step 5: Commit the verified inventory**

```bash
git add apps/web/src/features/catalogue-registry/products/scissors-batch-01.ts apps/web/src/test/scissors-batch-01-inventory.test.ts
git commit -m "feat: define complete scissors batch 01 inventory"
```

---

### Task 2: Add the media manifest contract and validator

**Files:**
- Create: `apps/web/src/features/catalogue-media/types.ts`
- Create: `apps/web/src/features/catalogue-media/validation.ts`
- Create: `apps/web/src/features/catalogue-media/index.ts`
- Create: `apps/web/src/test/scissors-batch-01-media.test.ts`

**Interfaces:**
- Produces: `CatalogueMediaAsset`
- Produces: `assertCatalogueMediaManifest(assets, expectedAssetIds)`
- Consumes: `ScissorsConfiguration.mediaAssetId` from Task 1

- [ ] **Step 1: Write validator tests using one valid and four invalid fixtures**

The tests must prove that validation rejects:

1. a remote runtime `avifPath`;
2. a missing WebP fallback;
3. an empty source page URL;
4. a duplicate media ID;
5. a missing expected asset ID.

Use `/media/catalogue-preview/scissors/scissors-iris-regular-straight.avif` and the matching `.webp` path as the valid fixture.

- [ ] **Step 2: Run the test and verify the missing module failure**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-media.test.ts
```

Expected: FAIL because the media contract and validator do not exist.

- [ ] **Step 3: Implement the exact media contract**

```ts
export type CatalogueMediaMatchGrade = "exact" | "strong-match" | "acceptable-similar";
export type CatalogueMediaRightsMode = "preferred-safe" | "supplier-fallback";
export type CatalogueMediaBackground = "transparent" | "clean-white";
export type CatalogueMediaReviewStatus = "candidate" | "approved" | "needs-replacement";

export interface CatalogueMediaAsset {
  id: string;
  familySlug: "scissors";
  configurationKey: string;
  avifPath: string;
  webpPath: string;
  sourcePageUrl: string;
  originalImageUrl?: string;
  matchGrade: CatalogueMediaMatchGrade;
  rightsMode: CatalogueMediaRightsMode;
  background: CatalogueMediaBackground;
  processingNotes: string;
  orientationNotes: string;
  reuseScope: string;
  reviewStatus: CatalogueMediaReviewStatus;
}
```

`assertCatalogueMediaManifest` must throw descriptive errors for duplicate IDs, missing expected IDs, remote runtime paths, missing source metadata, empty notes, unsupported extensions, and configuration keys that do not equal their media IDs.

- [ ] **Step 4: Run the validator tests**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-media.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the manifest foundation**

```bash
git add apps/web/src/features/catalogue-media apps/web/src/test/scissors-batch-01-media.test.ts
git commit -m "feat: add catalogue media manifest contract"
```

---

### Task 3: Convert the Scissors registry to grouped configurations

**Files:**
- Modify: `apps/web/src/features/catalogue-registry/types.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/scissors.ts`
- Modify: `apps/web/src/test/scissors-image-preview.test.ts`

**Interfaces:**
- Consumes: `SCISSORS_BATCH_01_CONFIGURATIONS`
- Produces: `SCISSOR_PRODUCTS: readonly CatalogueProductRecord[]`
- Preserves: `CatalogueProductRecord.code` as the primary/first code for compatibility
- Adds: `CatalogueProductRecord.catalogueCodes`, `mediaAssetId`, and `mediaFallbackPath`

- [ ] **Step 1: Replace the obsolete 15-record assertions with grouped-product assertions**

The revised test must assert:

```ts
expect(SCISSOR_PRODUCTS).toHaveLength(42);
expect(SCISSOR_PRODUCTS.flatMap((product) => product.catalogueCodes)).toHaveLength(132);
expect(SCISSOR_PRODUCTS.find((product) => product.slug === "mayo-scissors")?.code).toBe("04-0401");
expect(SCISSOR_PRODUCTS.every((product) => product.mediaAssetId.length > 0)).toBe(true);
```

Keep the middleware assertion unchanged:

```ts
expect(middlewareConfig.matcher).toEqual(["/admin/:path*"]);
```

- [ ] **Step 2: Run the revised test and verify it fails against the temporary preview data**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-image-preview.test.ts
```

Expected: FAIL because the registry still exposes 15 products and remote image URLs.

- [ ] **Step 3: Extend `CatalogueProductRecord` without changing shared API contracts**

Add:

```ts
export interface CatalogueProductCode {
  code: string;
  size: string;
}

// inside CatalogueProductRecord
catalogueCodes: readonly CatalogueProductCode[];
mediaAssetId: string;
mediaFallbackPath?: string;
```

Keep `code`, `sizes`, `variants`, `directions`, `mediaPath`, `mediaSourceUrl`, and `mediaReviewNote` so existing consumers remain compatible.

- [ ] **Step 4: Map each configuration into one product record**

For each configuration:

- `code` is the first `codeOptions` code;
- `catalogueCodes` is the complete code/size array;
- `sizes` is the deduplicated size list;
- `variants` contains finish and point style;
- `directions` contains the single direction;
- `primaryOption` is `finish · direction · pointStyle`;
- `mediaAssetId` is copied from the configuration;
- `mediaPath` and `mediaFallbackPath` remain unset until Task 8 joins the completed manifest;
- `mediaSourceUrl` and `mediaReviewNote` are not exposed as temporary runtime substitutes.

- [ ] **Step 5: Run the registry tests**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-inventory.test.ts src/test/scissors-image-preview.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit grouped product routing**

```bash
git add apps/web/src/features/catalogue-registry/types.ts apps/web/src/features/catalogue-registry/products/scissors.ts apps/web/src/test/scissors-image-preview.test.ts
git commit -m "feat: group scissors products by visible configuration"
```

---

### Task 4: Add deterministic offline media normalization

**Files:**
- Create: `apps/web/scripts/catalogue_media_normalize.py`
- Create: `apps/web/scripts/requirements-catalogue-media.txt`

**Interfaces:**
- Consumes: a downloaded PNG, JPEG, WebP, or AVIF source file
- Produces: one 1800 x 1800 AVIF and one 1800 x 1800 WebP derivative
- CLI: `python apps/web/scripts/catalogue_media_normalize.py INPUT --output-stem OUTPUT_STEM --rotation DEGREES --background transparent|white`

- [ ] **Step 1: Add the pinned offline dependency**

```text
Pillow==12.2.0
```

- [ ] **Step 2: Implement the normalizer**

The script must:

1. open the source with EXIF orientation applied;
2. convert to RGBA;
3. rotate only by the explicit `--rotation` value with `expand=True`;
4. trim fully transparent outer rows and columns;
5. preserve aspect ratio;
6. fit the complete instrument inside a 1440 x 1440 safe region;
7. center it on an 1800 x 1800 canvas;
8. use a transparent canvas only when the source already contains trustworthy alpha;
9. use pure white when `--background white` is selected;
10. save AVIF at quality 82 and WebP at quality 88;
11. refuse to overwrite unless `--force` is passed;
12. print source size, output size, rotation, and selected background.

The script must never use non-uniform scaling or generative editing.

- [ ] **Step 3: Run a synthetic smoke test**

Create a temporary 600 x 120 transparent image with a centered black rectangle, normalize it, and inspect both outputs:

```bash
python -m pip install -r apps/web/scripts/requirements-catalogue-media.txt
python - <<'PY'
from PIL import Image, ImageDraw
img = Image.new("RGBA", (600, 120), (0, 0, 0, 0))
ImageDraw.Draw(img).rectangle((50, 35, 550, 85), fill=(20, 20, 20, 255))
img.save("/tmp/rosa-media-smoke.png")
PY
python apps/web/scripts/catalogue_media_normalize.py /tmp/rosa-media-smoke.png --output-stem /tmp/rosa-media-smoke --rotation 0 --background transparent
python - <<'PY'
from PIL import Image
for path in ("/tmp/rosa-media-smoke.avif", "/tmp/rosa-media-smoke.webp"):
    image = Image.open(path)
    assert image.size == (1800, 1800), (path, image.size)
print("normalizer smoke test passed")
PY
```

Expected: both files are 1800 x 1800 and the rectangle is not distorted.

- [ ] **Step 4: Commit the offline tool**

```bash
git add apps/web/scripts/catalogue_media_normalize.py apps/web/scripts/requirements-catalogue-media.txt
git commit -m "tools: add catalogue media normalizer"
```

---

### Task 5: Source and process Iris and Stevens media

**Files:**
- Create/modify: `apps/web/src/features/catalogue-media/scissors-batch-01.ts`
- Create/modify: `docs/review/catalogue-media/scissors-batch-01-sources.md`
- Create: 12 AVIF files under `apps/web/public/media/catalogue-preview/scissors/`
- Create: 12 WebP files under `apps/web/public/media/catalogue-preview/scissors/`

**Interfaces:**
- Produces: 12 manifest records with `reviewStatus: "candidate"`
- Produces asset IDs matching the 12 Iris and Stevens configuration `mediaAssetId` values

- [ ] **Step 1: Add a failing test for the first 12 asset IDs**

Filter expected IDs by `familyKey === "iris" || familyKey === "stevens"` and assert that the manifest contains exactly those 12 IDs and that every derivative exists on disk.

- [ ] **Step 2: Search the exact target matrix**

Use these searches, separately for straight and curved forms:

- `Iris scissors regular straight 9.5 cm 11.5 cm`
- `Iris scissors regular curved 9.5 cm 11.5 cm`
- `Iris scissors super cut straight`
- `Iris scissors super cut curved`
- `tungsten carbide Iris scissors straight`
- `tungsten carbide Iris scissors curved`
- `Stevens scissors regular straight 10.5 cm`
- `Stevens scissors regular curved 10.5 cm`
- `Stevens scissors super cut straight`
- `Stevens scissors super cut curved`
- `tungsten carbide Stevens scissors straight`
- `tungsten carbide Stevens scissors curved`

Compare each candidate with catalogue page 1 before selection. Reject mislabeled Tenotomy/Iris swaps, wrong blade curvature, clipped tips, watermarks, and low-resolution thumbnails.

- [ ] **Step 3: Download accepted originals outside the web build**

Use:

```text
local-data/catalogue-sources/scissors-batch-01/iris/
local-data/catalogue-sources/scissors-batch-01/stevens/
```

`local-data/` is already ignored by the repository. Preserve the original file name and write a sidecar `.txt` containing the source page URL and retrieval date.

- [ ] **Step 4: Normalize each accepted source**

Output names must follow:

```text
scissors-iris-regular-straight.avif
scissors-iris-regular-straight.webp
scissors-iris-regular-curved.avif
...
scissors-stevens-tungsten-carbide-curved.webp
```

Use the smallest rotation that places the working end generally toward the upper-right. Preserve straight/curved identity and keep the full handle and tip inside the safe region.

- [ ] **Step 5: Add complete manifest and review-ledger entries**

Create an entry only after a source passes the acceptance gate. Do not use empty URLs, guessed rights claims, or dummy notes. Record the observed geometry match, source background, any retained white background, and exactly which sizes reuse the asset.

- [ ] **Step 6: Run the 12-asset tests**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-media.test.ts
```

Expected: PASS for the Iris and Stevens subset.

- [ ] **Step 7: Commit Wave 1**

```bash
git add apps/web/src/features/catalogue-media/scissors-batch-01.ts apps/web/public/media/catalogue-preview/scissors docs/review/catalogue-media/scissors-batch-01-sources.md apps/web/src/test/scissors-batch-01-media.test.ts
git commit -m "assets: add Iris and Stevens production candidates"
```

---

### Task 6: Source and process Mayo and Metzenbaum media

**Files:**
- Modify: `apps/web/src/features/catalogue-media/scissors-batch-01.ts`
- Modify: `docs/review/catalogue-media/scissors-batch-01-sources.md`
- Create: 12 additional AVIF files
- Create: 12 additional WebP files

**Interfaces:**
- Produces: 24 total manifest records after completion

- [ ] **Step 1: Extend the failing media test to require all Mayo and Metzenbaum IDs**

Expected family totals after the task:

```ts
expect(countByConfigurationFamily(manifest)).toEqual({
  iris: 6,
  stevens: 6,
  mayo: 6,
  metzenbaum: 6
});
```

- [ ] **Step 2: Search the 12 exact visible targets**

For each family, search Regular, Super Cut, and Tungsten Carbide in Straight and Curved forms. Include the largest catalogue size in searches when generic results are ambiguous:

- Mayo: `14.5 cm`, `17 cm`, `20 cm`, or `23 cm`
- Metzenbaum: `11 cm`, `14 cm`, `16 cm`, `18 cm`, `20 cm`, or `23 cm`

Reject fine-blade Metzenbaum images labeled as Mayo, heavy Mayo images labeled as Metzenbaum, wrong direction, watermarks, and partial instruments.

- [ ] **Step 3: Download originals into family-specific ignored directories**

```text
local-data/catalogue-sources/scissors-batch-01/mayo/
local-data/catalogue-sources/scissors-batch-01/metzenbaum/
```

- [ ] **Step 4: Normalize and create 24 derivatives**

Use exact configuration file names, one AVIF and one WebP per visible configuration.

- [ ] **Step 5: Add full source and manifest metadata**

Record all reused sizes and the visible evidence supporting the selected family, finish, and direction.

- [ ] **Step 6: Run the 24-asset subset tests**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-media.test.ts
```

Expected: PASS for 24 manifest records and 48 local derivative files.

- [ ] **Step 7: Commit Wave 2**

```bash
git add apps/web/src/features/catalogue-media/scissors-batch-01.ts apps/web/public/media/catalogue-preview/scissors docs/review/catalogue-media/scissors-batch-01-sources.md apps/web/src/test/scissors-batch-01-media.test.ts
git commit -m "assets: add Mayo and Metzenbaum production candidates"
```

---

### Task 7: Source and process all 18 OP Scissors configurations

**Files:**
- Modify: `apps/web/src/features/catalogue-media/scissors-batch-01.ts`
- Modify: `docs/review/catalogue-media/scissors-batch-01-sources.md`
- Create: 18 additional AVIF files
- Create: 18 additional WebP files

**Interfaces:**
- Produces: complete 42-record manifest and 84 local derivative files

- [ ] **Step 1: Extend the media test to require all 42 expected IDs**

The test must assert:

```ts
expect(SCISSORS_BATCH_01_MEDIA).toHaveLength(42);
expect(new Set(SCISSORS_BATCH_01_MEDIA.map((asset) => asset.id)).size).toBe(42);
```

- [ ] **Step 2: Search every OP combination explicitly**

For each finish (`regular`, `super cut`, `tungsten carbide`), search:

- operating scissors straight sharp sharp;
- operating scissors curved sharp sharp;
- operating scissors straight sharp blunt;
- operating scissors curved sharp blunt;
- operating scissors straight blunt blunt;
- operating scissors curved blunt blunt.

Include `12 cm`, `14 cm`, or `17 cm` when needed. Compare the tips at high zoom; a generic operating-scissors image cannot be reused across different point styles.

- [ ] **Step 3: Download accepted originals**

Use:

```text
local-data/catalogue-sources/scissors-batch-01/operating/
```

- [ ] **Step 4: Normalize all 18 images**

File names must include finish, direction, and point style, for example:

```text
scissors-operating-super-cut-curved-sharp-blunt.avif
scissors-operating-tungsten-carbide-straight-blunt-blunt.webp
```

- [ ] **Step 5: Record exact differences for acceptable-similar fallbacks**

When an exact source cannot be found, the manifest note must state the observed mismatch precisely, such as handle finish, blade length, or size, while confirming that family, direction, and point style still match. Do not use a fallback with the wrong point style.

- [ ] **Step 6: Run the complete media contract test**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-media.test.ts
```

Expected: PASS for 42 records, 42 AVIF files, 42 WebP files, complete source metadata, and no remote runtime path.

- [ ] **Step 7: Commit Wave 3**

```bash
git add apps/web/src/features/catalogue-media/scissors-batch-01.ts apps/web/public/media/catalogue-preview/scissors docs/review/catalogue-media/scissors-batch-01-sources.md apps/web/src/test/scissors-batch-01-media.test.ts
git commit -m "assets: complete OP scissors production candidates"
```

---

### Task 8: Join the complete manifest to the public Scissors UI

**Files:**
- Modify: `apps/web/src/features/catalogue-media/index.ts`
- Modify: `apps/web/src/features/catalogue-registry/products/scissors.ts`
- Modify: `apps/web/src/features/public-catalogue/product-media-placeholder.tsx`
- Modify: `apps/web/src/features/family-listing/family-product-card.tsx`
- Modify: `apps/web/src/features/product-detail/product-gallery.tsx`
- Modify: `apps/web/src/styles/scissors-image-preview.css`

**Interfaces:**
- Consumes: complete 42-record media manifest
- Produces: local AVIF/WebP rendering on `/products/scissors` and all 42 detail routes

- [ ] **Step 1: Add failing rendering assertions**

Update unit tests to require every product to have:

```ts
expect(product.mediaPath).toMatch(/^\/media\/catalogue-preview\/scissors\/.+\.avif$/);
expect(product.mediaFallbackPath).toMatch(/^\/media\/catalogue-preview\/scissors\/.+\.webp$/);
expect(product.mediaPath).not.toMatch(/^https?:\/\//);
```

- [ ] **Step 2: Join configuration and media records by ID**

Build a `Map` from media ID to asset. Throw immediately when a configuration has no media record. Populate:

- `mediaPath` from `asset.avifPath`;
- `mediaFallbackPath` from `asset.webpPath`;
- `mediaSourceUrl` from `asset.sourcePageUrl` for review metadata only;
- `mediaReviewNote` from grade, rights mode, background, and review status.

- [ ] **Step 3: Render AVIF with WebP fallback**

Replace the direct image branch with:

```tsx
<picture>
  <source srcSet={src} type="image/avif" />
  <img
    src={fallbackSrc ?? src}
    alt={decorative ? "" : label}
    loading="lazy"
    decoding="async"
  />
</picture>
```

Add `fallbackSrc?: string` to `ProductMediaPlaceholderProps` and pass it from cards and gallery.

- [ ] **Step 4: Present grouped catalogue information**

On family cards, retain the primary code and append:

```text
· 2 sizes
```

or:

```text
· 3 catalogue codes
```

when a configuration has multiple options. On detail pages, preserve the full code/size list in the existing product-information area without adding ecommerce behavior.

- [ ] **Step 5: Normalize visual presentation in CSS**

Ensure:

- white or transparent assets sit on the same neutral canvas;
- `<picture>` fills the existing placeholder box;
- `img` uses `object-fit: contain` and `object-position: center`;
- card and detail padding preserve full handles and tips;
- mobile minimum height remains 16rem;
- no image receives a CSS transform that changes direction or geometry.

- [ ] **Step 6: Run focused tests**

```bash
pnpm --filter @rosa/web test -- src/test/scissors-batch-01-inventory.test.ts src/test/scissors-batch-01-media.test.ts src/test/scissors-image-preview.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit UI integration**

```bash
git add apps/web/src/features/catalogue-media apps/web/src/features/catalogue-registry apps/web/src/features/public-catalogue/product-media-placeholder.tsx apps/web/src/features/family-listing/family-product-card.tsx apps/web/src/features/product-detail/product-gallery.tsx apps/web/src/styles/scissors-image-preview.css apps/web/src/test
git commit -m "feat: render local scissors production media"
```

---

### Task 9: Add full automated integrity checks

**Files:**
- Modify: `apps/web/src/test/scissors-batch-01-inventory.test.ts`
- Modify: `apps/web/src/test/scissors-batch-01-media.test.ts`
- Modify: `apps/web/src/test/scissors-image-preview.test.ts`

**Interfaces:**
- Verifies all outputs from Tasks 1 through 8

- [ ] **Step 1: Add code-to-configuration uniqueness checks**

Build a map from every catalogue code to its configuration ID and assert that no code maps more than once.

- [ ] **Step 2: Add file-system checks**

Resolve every runtime path beneath `apps/web/public` and assert:

- the file exists;
- the AVIF and WebP file sizes are greater than zero;
- the path remains under `media/catalogue-preview/scissors`;
- no path contains `Thorhi-tools`;
- no runtime path starts with `http://` or `https://`.

- [ ] **Step 3: Add reuse-boundary checks**

Assert that no media ID is shared by configurations with different finish, direction, or point style. Sharing across size options inside one configuration remains valid.

- [ ] **Step 4: Add metadata completeness checks**

For each media record, require non-empty source URL, processing notes, orientation notes, reuse scope, match grade, rights mode, background, and review status.

- [ ] **Step 5: Run the full Vitest suite**

```bash
pnpm --filter @rosa/web test
```

Expected: all tests pass.

- [ ] **Step 6: Commit the integrity gate**

```bash
git add apps/web/src/test
git commit -m "test: enforce scissors media integrity"
```

---

### Task 10: Add route-level desktop and mobile verification

**Files:**
- Create: `apps/web/tests/e2e/scissors-image-batch-01.spec.ts`

**Interfaces:**
- Verifies public routes against the running Next.js application

- [ ] **Step 1: Write the Playwright test**

The test must:

1. open `/products/scissors`;
2. assert 42 `[data-product-card]` elements;
3. assert every visible product image loads with `naturalWidth > 0`;
4. assert image `src` values are local;
5. open `/products/scissors/mayo-scissors`;
6. assert the primary image loads;
7. assert the page contains `04-0401` and `14.5 cm`;
8. repeat the family listing checks in the mobile project.

- [ ] **Step 2: Run the focused E2E test**

```bash
pnpm --filter @rosa/web test:e2e -- tests/e2e/scissors-image-batch-01.spec.ts
```

Expected: desktop, tablet, and mobile projects pass.

- [ ] **Step 3: Perform the three human review gates**

Review in this order:

1. Iris and Stevens;
2. Mayo and Metzenbaum;
3. OP Scissors.

For each gate, inspect family cards and detail pages at desktop and mobile widths. Record each result in `docs/review/catalogue-media/scissors-batch-01-sources.md` as `approved`, `needs-replacement`, or `accepted-fallback`.

- [ ] **Step 4: Synchronize manifest review status with the recorded decisions**

Set `reviewStatus: "approved"` only for approved or explicitly accepted-fallback assets. Keep any unresolved asset as `needs-replacement`; do not present the entire catalogue batch as complete while such a record remains.

- [ ] **Step 5: Re-run unit and E2E tests after status changes**

```bash
pnpm --filter @rosa/web test
pnpm --filter @rosa/web test:e2e -- tests/e2e/scissors-image-batch-01.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit reviewed media status**

```bash
git add apps/web/src/features/catalogue-media/scissors-batch-01.ts apps/web/tests/e2e/scissors-image-batch-01.spec.ts docs/review/catalogue-media/scissors-batch-01-sources.md
git commit -m "test: verify scissors media across public routes"
```

---

### Task 11: Run the complete frontend verification and record coordination evidence

**Files:**
- Create: `docs/superpowers/completions/2026-08-02-scissors-batch-01-production-media.md`
- Modify: `README.md`

**Interfaces:**
- Produces the final review evidence for the isolated preview branch

- [ ] **Step 1: Run all required frontend verification commands**

```bash
pnpm --filter @rosa/web lint
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web test
pnpm --filter @rosa/web build
pnpm --filter @rosa/web test:e2e -- tests/e2e/scissors-image-batch-01.spec.ts
```

Expected: all commands exit with status 0.

- [ ] **Step 2: Verify the branch boundary**

```bash
git diff --name-only integration/f3e-d-phase4-backend...HEAD
```

Confirm that implementation changes are limited to `apps/web/**`, `docs/**`, and the required `README.md` coordination entry. Confirm that `services/api/**` and `packages/contracts/**` are untouched.

- [ ] **Step 3: Write the completion record**

Record:

- branch and final commit;
- 42 configuration count;
- 132 exact code count;
- 84 derivative file count;
- count by match grade and rights mode;
- assets using clean-white fallback;
- unresolved `needs-replacement` records, if any;
- exact verification commands and results;
- confirmation that no Supabase or backend changes were made.

- [ ] **Step 4: Append one README coordination message**

Use this exact structure:

```md
### 2026-08-02 HH:MM PKT — Frontend AI → Backend AI

- Branch: `preview/scissors-image-batch-01`
- Completed: Scissors Batch 01 local production-media preview for 42 visible configurations and 132 catalogue codes.
- Changed shared files/contracts: None. Frontend-only media, registry, tests, and review documentation.
- Verification run and result: `<exact commands and pass totals>`
- Ready integration gate: Not requested; isolated visual-review work only.
- Blockers: `<none or exact needs-replacement asset IDs>`
- Decision or response needed: Backend partner should not move these assets to Supabase until Ahmad approves the review batch.
```

- [ ] **Step 5: Commit completion evidence**

```bash
git add README.md docs/superpowers/completions/2026-08-02-scissors-batch-01-production-media.md
git commit -m "docs: record scissors batch 01 verification"
```

- [ ] **Step 6: Stop at the review boundary**

Do not merge, deploy, open a pull request, upload to Supabase, or start Chisels until Ahmad explicitly authorizes the next action.
