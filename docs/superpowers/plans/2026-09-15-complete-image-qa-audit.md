# Rosa Medical Complete Image QA — Evidence Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a complete source-backed and runtime-backed image inventory for the current Rosa Medical WordPress site, visually audit every public image-bearing surface at the approved responsive widths, and commit an exact defect/replacement queue that can be converted into a non-speculative correction plan.

**Architecture:** This is the evidence phase of the approved complete image-QA design. It reuses the existing WordPress media inventory for settings/Elementor/Woo/repository ownership, adds one dedicated Playwright runtime collector for rendered images/CSS backgrounds and screenshots, then performs a standalone professional visual review across 12 bilingual public routes × 5 viewports. No production CSS/template/media mutation belongs in this phase; exact corrections are planned only after concrete `IMG-###` evidence exists.

**Tech Stack:** WordPress, Elementor Free, WooCommerce, Rosa child theme, PHP, Bash, Node.js 24, Playwright, Docker Compose/WP-CLI.

**Spec:** `docs/superpowers/specs/2026-09-15-complete-image-qa-and-correction-design.md`

## Global Constraints

- Working branch: `wordpress/curated-grey-imagery-2026-09-14`.
- Execute from the commit containing this plan or a clean fast-forward descendant.
- This phase is read-only with respect to public rendering/data: do not change theme CSS, templates, Elementor data, Woo product data, Media Library attachments, or production state.
- No Hostinger, Cloudflare, DNS, production database, production uploads, merge, rebase, reset, or force-push work is authorized.
- Preserve approved `client-v5` heroes, catalogue-derived product media, WooCommerce ownership, Elementor ownership, EN/AR behavior, RTL behavior, and quotation-only product flow.
- Known unsafe historical stock must remain rejected.
- Review at exactly `1440x900`, `1024x768`, `768x1024`, `431x932`, and `390x844`.
- Runtime review covers Home, About, Contact, Shop, Quote Request, and representative Product Detail in both EN and AR: 12 route states × 5 viewports = 60 evidence cells.
- Source ownership review covers all WordPress media settings, all Elementor media references, every published Woo product/gallery/variation image, product-category thumbnails, Media Library attachments, and hard-coded repository image references through the existing inventory script.
- Runtime screenshots/JSON/TSV remain evidence artifacts under `wordpress/.client-preview-artifacts/` and are not committed.
- A route/viewport may be marked PASS only after both technical image state and visual composition have been inspected.
- Exact correction code must not be guessed in this phase. Corrections receive a separate implementation plan from the committed `IMG-###` queue.

---

## File map

**Create**
- `wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs` — static/runtime contract for the 12-route × 5-viewport evidence harness and required image metadata.
- `wordpress/scripts/image-qa-runtime-audit.mjs` — Playwright collector for rendered `img`/`picture`/CSS-background evidence plus full-page screenshots and a manifest.
- `docs/superpowers/reports/2026-09-15-complete-image-qa-audit.md` — professional audit, route matrix, image-slot findings, exact defect queue, and replacement specifications.

**Reuse without modification in this phase**
- `wordpress/scripts/client-handoff-media-inventory.sh` — source ownership inventory across settings, Elementor, Woo, attachments, and repository references.
- `wordpress/scripts/client-preview-capture.mjs` — existing capture conventions/reference only.
- `wordpress/scripts/tests/image-qa-professional-audit-contract.test.php` — current image safety/performance contract.
- `wordpress/scripts/tests/home-visual-restoration-contract.test.php` — current hero/catalogue responsive contract.
- `wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs` — runtime placeholder/safe-media guard.
- `wordpress/scripts/tests/client-preview-accessibility.test.mjs` — global responsive/RTL/accessibility/console protection.
- `wordpress/scripts/live-visual-audit.mjs` — prior visual-audit patterns/reference only; do not turn historical pixel-diff acceptance into the decision standard.

**Potential Phase B owners; do not edit in this plan**
- `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-comprehensive.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-confidence.php`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/home-visual-restoration.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/about-live-visual-recovery.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-live-visual-recovery.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductWidgets.php`

---

### Task 1: Define the complete runtime image-audit contract

**Files:**
- Create: `wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs`
- Target later: `wordpress/scripts/image-qa-runtime-audit.mjs`

**Interfaces:**
- Consumes: the approved route matrix, responsive widths, and runtime evidence requirements from the spec.
- Produces: a source contract that fails unless the runtime collector contains all 12 route states, all 5 viewports, rendered-image metadata, CSS-background metadata, screenshot output, and a 60-cell completion gate.

- [ ] **Step 1: Create the failing contract**

Create `wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs`:

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const script = path.join(root, 'scripts/image-qa-runtime-audit.mjs');

assert.ok(fs.existsSync(script), 'image QA runtime audit script must exist');
const source = fs.readFileSync(script, 'utf8');

for (const route of [
  "'en-home', '/'",
  "'en-about', '/about/'",
  "'en-contact', '/contact/'",
  "'en-shop', '/shop/'",
  "'en-quote', '/quote-request/'",
  "'en-product', '/product/rosa-foundation-stevens-scissors-regular/'",
  "'ar-home', '/ar/'",
  "'ar-about', '/ar/about/'",
  "'ar-contact', '/ar/contact/'",
  "'ar-shop', '/ar/shop/'",
  "'ar-quote', '/ar/quote-request/'",
  "'ar-product', '/ar/product/rosa-foundation-stevens-scissors-regular/'",
]) {
  assert.ok(source.includes(route), `missing route contract: ${route}`);
}

for (const viewport of [
  '{ width: 1440, height: 900 }',
  '{ width: 1024, height: 768 }',
  '{ width: 768, height: 1024 }',
  '{ width: 431, height: 932 }',
  '{ width: 390, height: 844 }',
]) {
  assert.ok(source.includes(viewport), `missing viewport contract: ${viewport}`);
}

for (const token of [
  'document.images',
  'backgroundImage',
  'currentSrc',
  'naturalWidth',
  'naturalHeight',
  'objectFit',
  'objectPosition',
  'loading',
  'decoding',
  'fetchPriority',
  'srcset',
  'sizes',
  'getBoundingClientRect',
  'visibleBrokenImages',
  'screenshot',
  'manifest.json',
  'expectedCells = 60',
]) {
  assert.ok(source.includes(token), `missing runtime image evidence token: ${token}`);
}

console.log('PASS: complete runtime image-audit source contract is present');
```

- [ ] **Step 2: Run the test and observe RED**

Run:

```bash
node wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs
```

Expected: FAIL with `image QA runtime audit script must exist`.

- [ ] **Step 3: Commit the RED contract**

```bash
git add wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs
git commit -m "test(wordpress): define complete runtime image audit"
```

---

### Task 2: Implement the 60-cell runtime image collector

**Files:**
- Create: `wordpress/scripts/image-qa-runtime-audit.mjs`
- Test: `wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs`

**Interfaces:**
- Consumes: `--base` URL (default `http://localhost:8088/`) and optional `--out` directory.
- Produces: one full-page PNG and one JSON image inventory per route/viewport plus `manifest.json` containing exactly 60 records.

- [ ] **Step 1: Add the exact routes, viewports, and CLI setup**

Start the collector with:

```js
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const ROUTES = [
  ['en-home', '/'],
  ['en-about', '/about/'],
  ['en-contact', '/contact/'],
  ['en-shop', '/shop/'],
  ['en-quote', '/quote-request/'],
  ['en-product', '/product/rosa-foundation-stevens-scissors-regular/'],
  ['ar-home', '/ar/'],
  ['ar-about', '/ar/about/'],
  ['ar-contact', '/ar/contact/'],
  ['ar-shop', '/ar/shop/'],
  ['ar-quote', '/ar/quote-request/'],
  ['ar-product', '/ar/product/rosa-foundation-stevens-scissors-regular/'],
];

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

const expectedCells = 60;

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const base = new URL(arg('--base', 'http://localhost:8088/'));
const outDir = path.resolve(arg('--out', 'wordpress/.client-preview-artifacts/image-qa-2026-09-15'));
fs.mkdirSync(outDir, { recursive: true });
```

- [ ] **Step 2: Add deterministic media settling**

Use a collector-local helper so the audit does not depend on hidden behavior in another script:

```js
async function settleMedia(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const step = Math.max(240, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    window.scrollTo(0, 0);
    await Promise.all(Array.from(document.images).map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }));
  });
  await page.waitForTimeout(120);
}
```

- [ ] **Step 3: Collect rendered `img` and CSS-background evidence**

The page evaluation must return the technical information needed for visual/root-cause review:

```js
async function collectImageEvidence(page) {
  return page.evaluate(() => {
    const rect = (element) => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };

    const context = (element) => {
      const owner = element.closest(
        '[data-media-slot],[data-home-section],[data-preview-product-gallery],' +
        '[data-preview-product-summary],[data-preview-shop-grid],section,main,header,footer'
      );
      return {
        tag: owner?.tagName?.toLowerCase() || '',
        id: owner?.id || '',
        className: typeof owner?.className === 'string' ? owner.className : '',
        mediaSlot: owner?.getAttribute?.('data-media-slot') || '',
        homeSection: owner?.getAttribute?.('data-home-section') || '',
      };
    };

    const images = Array.from(document.images).map((image, index) => {
      const style = getComputedStyle(image);
      const box = image.getBoundingClientRect();
      const visible = box.width > 0 && box.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden';
      return {
        kind: 'img',
        index,
        src: image.getAttribute('src') || '',
        currentSrc: image.currentSrc || '',
        srcset: image.getAttribute('srcset') || '',
        sizes: image.getAttribute('sizes') || '',
        alt: image.getAttribute('alt') || '',
        role: image.getAttribute('role') || '',
        loading: image.loading || '',
        decoding: image.decoding || '',
        fetchPriority: image.fetchPriority || image.getAttribute('fetchpriority') || '',
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        complete: image.complete,
        visible,
        rendered: rect(image),
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
        aspectRatio: style.aspectRatio,
        context: context(image),
      };
    });

    const backgrounds = [];
    for (const element of document.querySelectorAll('body *')) {
      const style = getComputedStyle(element);
      if (!style.backgroundImage || style.backgroundImage === 'none') continue;
      const box = element.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0 || style.display === 'none' || style.visibility === 'hidden') continue;
      backgrounds.push({
        kind: 'background',
        backgroundImage: style.backgroundImage,
        backgroundPosition: style.backgroundPosition,
        backgroundSize: style.backgroundSize,
        backgroundRepeat: style.backgroundRepeat,
        rendered: rect(element),
        context: context(element),
      });
    }

    const visibleBrokenImages = images
      .filter((image) => image.visible && (!image.complete || image.naturalWidth === 0))
      .map((image) => image.currentSrc || image.src);

    return {
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      title: document.title,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      images,
      backgrounds,
      visibleBrokenImages,
    };
  });
}
```

- [ ] **Step 4: Add request/console evidence, screenshots, and the 60-cell manifest**

For every route/viewport:

```js
const browser = await chromium.launch({ headless: true });
const records = [];

try {
  for (const [key, routePath] of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('requestfailed', (request) => failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText || 'request failed',
      }));

      const url = new URL(routePath, base).href;
      const response = await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
      if (!response?.ok()) throw new Error(`${key} returned ${response?.status() ?? 'no response'} from ${url}`);

      await settleMedia(page);
      const evidence = await collectImageEvidence(page);
      const label = `${key}-${viewport.width}x${viewport.height}`;
      const screenshot = path.join(outDir, `${label}.png`);
      const inventory = path.join(outDir, `${label}.json`);
      await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
      fs.writeFileSync(inventory, JSON.stringify({
        key, routePath, url, viewport, consoleErrors, pageErrors, failedRequests, ...evidence,
      }, null, 2));

      records.push({
        key, routePath, url, viewport,
        screenshot,
        inventory,
        imageCount: evidence.images.length,
        backgroundCount: evidence.backgrounds.length,
        visibleBrokenImages: evidence.visibleBrokenImages,
        horizontalOverflow: evidence.scrollWidth > evidence.clientWidth + 1,
        consoleErrors,
        pageErrors,
        failedRequests,
      });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (records.length !== expectedCells) {
  throw new Error(`expected ${expectedCells} route/viewport cells, received ${records.length}`);
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  base: String(base),
  expectedCells,
  records,
}, null, 2));

console.log(`PASS: image QA runtime audit captured ${records.length} cells; manifest.json written to ${outDir}`);
```

- [ ] **Step 5: Run syntax/source contract GREEN**

```bash
node --check wordpress/scripts/image-qa-runtime-audit.mjs
node wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs
```

Expected: syntax check succeeds and the contract prints PASS.

- [ ] **Step 6: Commit the evidence harness**

```bash
git add   wordpress/scripts/image-qa-runtime-audit.mjs   wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs
git commit -m "test(wordpress): add complete image QA evidence harness"
```

---

### Task 3: Generate the complete source and runtime evidence set

**Files:**
- Runtime only: `wordpress/.client-preview-artifacts/image-qa-2026-09-15/*`
- Runtime only: `wordpress/.client-preview-artifacts/image-qa-2026-09-15/source-media-inventory.tsv`

**Interfaces:**
- Consumes: healthy local WordPress runtime, Task 2 collector, existing media inventory script.
- Produces: the complete read-only evidence package for professional review.

- [ ] **Step 1: Confirm the working tree and local runtime**

```bash
git branch --show-current
git status --short
git rev-parse HEAD
docker compose -f wordpress/dev/compose.yaml ps
```

Required:
- branch is `wordpress/curated-grey-imagery-2026-09-14`;
- no unrelated working-tree modifications;
- WordPress and database containers are healthy/running.

- [ ] **Step 2: Run the existing image safety/regression baseline before capture**

```bash
php wordpress/scripts/tests/image-qa-professional-audit-contract.test.php
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

All four must be GREEN before audit evidence is treated as trustworthy. A failure is recorded as a pre-existing blocker and debugged before visual review; do not hide it inside the audit report.

- [ ] **Step 3: Generate the full source-ownership inventory**

```bash
OUT=wordpress/.client-preview-artifacts/image-qa-2026-09-15
mkdir -p "$OUT"
bash wordpress/scripts/client-handoff-media-inventory.sh > "$OUT/source-media-inventory.tsv"
test -s "$OUT/source-media-inventory.tsv"
grep -F '# SUMMARY mode=read-only' "$OUT/source-media-inventory.tsv"
```

This inventory is authoritative evidence for:
- Rosa media settings;
- Elementor `_elementor_data` media;
- every published Woo product featured/gallery image;
- variation images;
- product-category thumbnails;
- Media Library attachment/source metadata;
- repository hard-coded image references.

- [ ] **Step 4: Capture all 60 runtime cells**

```bash
node wordpress/scripts/image-qa-runtime-audit.mjs   --base http://localhost:8088/   --out wordpress/.client-preview-artifacts/image-qa-2026-09-15
```

Expected final line starts with:

```text
PASS: image QA runtime audit captured 60 cells
```

- [ ] **Step 5: Verify evidence completeness independently**

```bash
OUT=wordpress/.client-preview-artifacts/image-qa-2026-09-15
test "$(find "$OUT" -maxdepth 1 -type f -name '*.png' | wc -l)" -eq 60
test "$(find "$OUT" -maxdepth 1 -type f -name '*.json' ! -name 'manifest.json' | wc -l)" -eq 60
node -e "const m=require('./$OUT/manifest.json'); if(m.records.length!==60) process.exit(1); console.log('manifest records:',m.records.length)"
```

Expected:
- 60 PNGs;
- 60 per-cell JSON inventories;
- 60 manifest records.

- [ ] **Step 6: Fail fast on objective technical problems**

Run:

```bash
node - <<'NODE'
const fs = require('fs');
const p = 'wordpress/.client-preview-artifacts/image-qa-2026-09-15/manifest.json';
const m = JSON.parse(fs.readFileSync(p, 'utf8'));
for (const r of m.records) {
  if (r.visibleBrokenImages.length) console.log('BROKEN', r.key, r.viewport, r.visibleBrokenImages);
  if (r.horizontalOverflow) console.log('OVERFLOW', r.key, r.viewport);
  for (const f of r.failedRequests) {
    if (/\.(avif|webp|png|jpe?g|svg)(?:[?#]|$)/i.test(f.url)) console.log('FAILED_IMAGE_REQUEST', r.key, r.viewport, f.url, f.error);
  }
}
NODE
```

Any emitted line becomes an explicit `IMG-###` candidate in Task 4. Do not correct it yet.

---

### Task 4: Perform the professional visual/content/composition audit

**Files:**
- Create: `docs/superpowers/reports/2026-09-15-complete-image-qa-audit.md`

**Interfaces:**
- Consumes: all 60 full-page screenshots, 60 runtime JSON inventories, `manifest.json`, and `source-media-inventory.tsv`.
- Produces: complete route matrix, slot-level visual judgment, exact `IMG-###` queue, protected accepted decisions, and direct replacement specifications where the underlying asset is unsuitable.

- [ ] **Step 1: Review all 60 route/viewport cells**

For every cell inspect, in this order:

1. broken/missing/wrong imagery;
2. semantic relevance to nearby heading/body/CTA;
3. focal subject and crop;
4. text/image competition;
5. product/instrument prominence;
6. object-fit/object-position/background-position;
7. aspect ratio/container geometry;
8. responsive crop and mobile meaning;
9. repeated/filler imagery;
10. cross-site photographic consistency;
11. visible sharpness/compression;
12. layout shift/overflow clues;
13. obvious image-delivery waste.

Do not compare to historical screenshots as a fidelity target. Judge the current site against the approved Rosa design direction and the exact content surrounding each image.

- [ ] **Step 2: Cross-check every prominent runtime image against ownership/source evidence**

For each major image reported in runtime JSON:
- locate its current source/attachment/fallback in `source-media-inventory.tsv`;
- determine whether it is client-selected, Elementor-owned, Woo-owned, catalogue-derived, approved theme fallback, or hard-coded asset;
- verify that known unsafe historical sources are not being rendered;
- note accidental asset reuse separately from deliberate reuse.

Do not classify an image as safe merely because it is local.

- [ ] **Step 3: Write the audit report using this exact section structure**

The report must contain:

```markdown
# Complete Image QA Audit

## Evidence
Record branch, commit, artifact directory, 60-cell matrix, and source inventory path.

## Route Matrix
A table with rows for:
EN Home, About, Contact, Shop, Quote Request, Product Detail,
AR Home, About, Contact, Shop, Quote Request, Product Detail
and columns for 1440x900, 1024x768, 768x1024, 431x932, 390x844.
Every cell is either PASS or one/more IMG-### IDs.

## Defects
For every IMG-### record:
- Priority: 1–8 using the approved severity model
- Category: technical / crop / responsive / relevance / hierarchy / consistency / performance
- Observed on: exact screenshot filenames
- Runtime source: currentSrc/background URL and media slot/section
- Ownership: settings / Elementor / Woo / child-theme fallback / CSS / repository asset
- Message context: adjacent heading/section purpose
- Visible problem: concrete symptom
- Root-cause evidence: technical/source evidence already proven
- Correction boundary: narrowest owner allowed to change
- Focused RED contract: exact assertion the Phase B task must establish
- Recapture cells: exact route/viewports required after correction

## Replacements Recommended
Only assets whose source composition/content is unsuitable.
For each:
- current slot/source
- why CSS/crop cannot solve it
- subject
- scene/context
- orientation/aspect ratio
- focal point
- negative-space requirement
- lighting/color treatment
- realism/style
- desktop crop requirement
- mobile crop requirement
- forbidden/misleading content

## Intentional Accepted Decisions
Record important image placements/reuse/crops that were reviewed and should be protected from opportunistic redesign.

## Protected Structures
List surfaces/layouts that passed and must not be reopened in Phase B.

## Correction Order
List IMG-### IDs in severity order, shared-root-cause before page-specific when appropriate.
```

- [ ] **Step 4: Enforce report completeness**

Before committing, check:
- all 60 matrix cells are accounted for;
- every defect names at least one exact screenshot;
- every defect names an ownership layer;
- every defect has a focused RED contract;
- every recommended replacement contains all eleven specification fields;
- every repeated image is either explicitly accepted or defected;
- no unresolved placeholder markers, deferred-review phrases, or speculative correction appears.

Run:

```bash
REPORT=docs/superpowers/reports/2026-09-15-complete-image-qa-audit.md
test -s "$REPORT"
! grep -En '\b(TBD|TODO|FIXME|XXX)\b|review later' "$REPORT"
```

- [ ] **Step 5: Commit the evidence-backed audit**

```bash
git add docs/superpowers/reports/2026-09-15-complete-image-qa-audit.md
git commit -m "docs(wordpress): record complete image QA audit"
```

---

### Task 5: Close the evidence phase without speculative production changes

**Files:**
- No production changes.
- Re-run the evidence/test files from Tasks 1–4.

**Interfaces:**
- Consumes: committed audit report and green baseline contracts.
- Produces: a stable handoff into a separate exact correction plan.

- [ ] **Step 1: Re-run the audit harness contract**

```bash
node wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Re-run the image safety baseline**

```bash
php wordpress/scripts/tests/image-qa-professional-audit-contract.test.php
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Expected: all GREEN.

- [ ] **Step 3: Confirm no production rendering/data files were changed during the evidence phase**

```bash
git diff --name-only "$(git merge-base HEAD origin/wordpress/curated-grey-imagery-2026-09-14)"..HEAD
```

The evidence phase may add only:
- the runtime audit test;
- the runtime audit collector;
- the audit report;
- the already approved spec/plan documents.

If a theme/plugin/seed/media binary appears because of this phase, stop and revert only that unauthorized evidence-phase mutation before completion.

- [ ] **Step 4: Create the Phase B correction plan from the committed `IMG-###` queue**

After this plan is complete, invoke `superpowers:writing-plans` again and create:

`docs/superpowers/plans/2026-09-15-complete-image-qa-corrections.md`

That plan must contain one independently reviewable RED → minimal fix → GREEN → neighboring regressions → selective recapture task for each root-cause group in `Correction Order`. It must use the exact file ownership, RED assertion, and recapture cells already proven by the audit report; it must not invent additional image replacements or redesign accepted surfaces.

---

## Completion gate

The evidence phase is complete only when all of the following are true:

```bash
node wordpress/scripts/tests/image-qa-runtime-audit-contract.test.mjs
php wordpress/scripts/tests/image-qa-professional-audit-contract.test.php
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

are GREEN, `manifest.json` contains exactly 60 records, the source media inventory exists, every route-matrix cell is adjudicated, and the committed report contains a severity-ordered exact `IMG-###` correction queue or explicitly states that no correction is warranted.

Do not begin production correction work until the evidence report exists. This prevents another broad image pass from changing already-correct media based on assumptions rather than rendered evidence.
