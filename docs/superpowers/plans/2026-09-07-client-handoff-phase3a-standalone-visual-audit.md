# Rosa Medical Phase 3A Standalone Visual Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce an exact standalone screenshot matrix and a severity-ordered, ownership-aware Phase 3 defect queue before any visual production correction is made.

**Architecture:** Phase 3 is evidence-first. A dedicated handoff capture harness reuses the existing Playwright capture helper to generate 50 standalone full-page screenshots: five public surfaces × two locales × five approved handoff viewports. The screenshots are reviewed without overlays or pixel-diff acceptance, and every visible defect is classified by severity, scope, ownership layer, and the smallest focused regression test needed for its later RED → GREEN correction.

**Tech Stack:** WordPress, Elementor Free, WooCommerce, Bash, Node.js 24, Playwright, existing Rosa child-theme CSS/template architecture.

**Spec:** `docs/superpowers/specs/2026-09-07-client-handoff-finalization-design.md` §6 and §9

## Global Constraints

- Working branch: `wordpress/client-content-controls`.
- Phase 3 starts from verified green commit `70d631207eced5c6e6144846e86afc9a8f7bf189` or a fast-forward descendant.
- Elementor Free owns Home/About/Contact EN+AR body content and body media.
- WooCommerce owns products, categories/families, SKUs, configurations, descriptions, product media, and publish state.
- Rosa settings own shared business/contact and CTA values.
- The child theme/plugin own the protected shell, responsive behavior, RTL, shared interactions, and Woo presentation.
- No production/Hostinger mutation is authorized.
- Review only standalone full-page screenshots; do not use comparison overlays or pixel-diff acceptance.
- Review Home, About, Contact, Shop, and Product Detail in EN/AR at exactly `1440x900`, `1024x768`, `768x1024`, `431x932`, and `390x844`.
- Fix priority is: composition/blunders → whitespace/transitions → responsive/RTL → component consistency → typography → fine rhythm/alignment.
- Do not broadly redesign accepted page structures without a concrete standalone defect.
- Do not add a new dependency stack or complex animation system.
- Every later production correction must follow focused RED → minimal fix → GREEN → neighboring regressions.
- A repeated defect belongs to shared shell/style ownership; an isolated defect belongs to the narrowest page owner.

---

## File map

**Create**
- `wordpress/scripts/tests/client-handoff-standalone-capture.test.sh` — source contract for the exact Phase 3 handoff matrix and standalone-only capture behavior.
- `wordpress/scripts/client-handoff-standalone-capture.sh` — runtime capture harness producing the 50 approved screenshots and a manifest.
- `docs/superpowers/reports/2026-09-07-phase3-standalone-visual-audit.md` — evidence-backed visual audit and correction queue.

**Reuse without modification unless its own contract fails**
- `wordpress/scripts/client-preview-capture.mjs` — Playwright full-page screenshot helper.
- `wordpress/scripts/tests/client-handoff-health-flow.test.mjs` — functional route/flow protection.
- `wordpress/scripts/tests/client-preview-accessibility.test.mjs` — accessibility/interaction/RTL/console protection.
- `wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs` — safe rendered-media protection.

**Potential production owners for the later Phase 3B plan; do not edit in Phase 3A**
- Shared: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`, `assets/css/live-visual-recovery.css`, `assets/css/client-preview-rtl.css`.
- About: `assets/css/about-live-visual-recovery.css` and About Elementor partials only when the audit proves a content/structure defect.
- Shop: `assets/css/shop-live-visual-recovery.css` and `template-parts/client-preview/shop-page.php` only when the audit proves a Shop-specific defect.
- Product Detail: `assets/css/product-detail-live-visual-recovery.css` and Woo product-detail renderer/template only when the audit proves a Product-specific defect.
- Home/Contact: existing shared/page partials only when the audit identifies a concrete defect; do not create parallel page systems.

---

### Task 1: Define the exact standalone capture contract

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-standalone-capture.test.sh`
- Target later: `wordpress/scripts/client-handoff-standalone-capture.sh`

**Interfaces:**
- Consumes: repository paths and the approved route/viewport matrix from the finalization spec.
- Produces: a static contract that fails unless the runtime script contains all ten routes, all five exact viewports, Product Detail EN/AR, a 50-capture completion gate, and no overlay/diff workflow.

- [ ] **Step 1: Write the failing source contract**

Create the test with this behavior:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SCRIPT="$ROOT/wordpress/scripts/client-handoff-standalone-capture.sh"
fail(){ printf 'FAIL: Phase 3 standalone capture contract: %s\n' "$1" >&2; exit 1; }

[[ -f "$SCRIPT" ]] || fail 'capture script is missing'

for token in \
  'en-home|' 'en-about|' 'en-contact|' 'en-shop|' 'en-product|' \
  'ar-home|' 'ar-about|' 'ar-contact|' 'ar-shop|' 'ar-product|'; do
  grep -Fq "$token" "$SCRIPT" || fail "missing route token $token"
done

for viewport in '1440,900' '1024,768' '768,1024' '431,932' '390,844'; do
  grep -Fq "\"$viewport\"" "$SCRIPT" || fail "missing handoff viewport $viewport"
done

grep -Fq '/product/rosa-foundation-stevens-scissors-regular/' "$SCRIPT" \
  || fail 'English Product Detail route is missing'
grep -Fq '/ar/product/rosa-foundation-stevens-scissors-regular/' "$SCRIPT" \
  || fail 'Arabic Product Detail route is missing'
grep -Fq 'expected=50' "$SCRIPT" || fail 'capture script must enforce exactly 50 screenshots'
grep -Fq 'manifest.tsv' "$SCRIPT" || fail 'capture script must emit a review manifest'

if grep -Eqi 'pixel.?diff|overlay|compare.?image|reference.?image' "$SCRIPT"; then
  fail 'standalone capture script must not implement overlay/pixel-diff acceptance'
fi

printf 'PASS: Phase 3 standalone capture contract covers 10 bilingual routes x 5 handoff viewports\n'
```

- [ ] **Step 2: Run the test and observe RED**

Run:

```bash
bash wordpress/scripts/tests/client-handoff-standalone-capture.test.sh
```

Expected: FAIL with `capture script is missing`.

- [ ] **Step 3: Commit the RED contract**

```bash
git add wordpress/scripts/tests/client-handoff-standalone-capture.test.sh
git commit -m "test(wordpress): define standalone handoff capture matrix"
```

---

### Task 2: Implement the 50-screenshot standalone capture harness

**Files:**
- Create: `wordpress/scripts/client-handoff-standalone-capture.sh`
- Test: `wordpress/scripts/tests/client-handoff-standalone-capture.test.sh`

**Interfaces:**
- Consumes: `wordpress/scripts/client-preview-capture.mjs`, local Docker/WP-CLI runtime, the verified bilingual routes.
- Produces: PNG files under `wordpress/.client-preview-artifacts/handoff-phase3/` plus `manifest.tsv` with `locale`, `surface`, `route`, `viewport`, and `file` columns.

- [ ] **Step 1: Implement the minimal capture script**

Use the established compose/WP-CLI wrapper and this exact route/viewport model:

```bash
ARTIFACT_DIR="$ROOT_DIR/wordpress/.client-preview-artifacts/handoff-phase3"
CAPTURE_HELPER="$SCRIPT_DIR/client-preview-capture.mjs"
base_url="$(wp option get home)"
base_url="${base_url%/}"

pages=(
  "en-home|$base_url/"
  "en-about|$base_url/about/"
  "en-contact|$base_url/contact/"
  "en-shop|$base_url/shop/"
  "en-product|$base_url/product/rosa-foundation-stevens-scissors-regular/"
  "ar-home|$base_url/ar/"
  "ar-about|$base_url/ar/about/"
  "ar-contact|$base_url/ar/contact/"
  "ar-shop|$base_url/ar/shop/"
  "ar-product|$base_url/ar/product/rosa-foundation-stevens-scissors-regular/"
)

viewports=("1440,900" "1024,768" "768,1024" "431,932" "390,844")
expected=50
```

The script must:

```bash
rm -rf "$ARTIFACT_DIR"
mkdir -p "$ARTIFACT_DIR"
printf 'locale\tsurface\troute\tviewport\tfile\n' > "$ARTIFACT_DIR/manifest.tsv"

count=0
for entry in "${pages[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  locale="${name%%-*}"
  surface="${name#*-}"
  route="${url#${base_url}}"
  for viewport in "${viewports[@]}"; do
    width="${viewport%%,*}"
    height="${viewport##*,}"
    dimensions="${width}x${height}"
    file="$ARTIFACT_DIR/${name}-${dimensions}.png"
    node "$CAPTURE_HELPER" "$url" "$file" "$width" "$height"
    [[ -s "$file" ]] || fail "capture was not created: $file"
    printf '%s\t%s\t%s\t%s\t%s\n' "$locale" "$surface" "$route" "$dimensions" "$file" >> "$ARTIFACT_DIR/manifest.tsv"
    count=$((count + 1))
  done
done

[[ "$count" -eq "$expected" ]] || fail "expected $expected captures, created $count"
[[ "$(($(wc -l < "$ARTIFACT_DIR/manifest.tsv") - 1))" -eq "$expected" ]] \
  || fail 'manifest row count does not match screenshot count'
printf 'PASS: %d standalone Phase 3 screenshots captured in %s\n' "$count" "$ARTIFACT_DIR"
```

Do not call any image comparison, reference screenshot, or overlay utility.

- [ ] **Step 2: Run shell syntax and the source contract**

```bash
bash -n wordpress/scripts/client-handoff-standalone-capture.sh
bash wordpress/scripts/tests/client-handoff-standalone-capture.test.sh
```

Expected: both PASS/no syntax errors.

- [ ] **Step 3: Commit the harness**

```bash
git add \
  wordpress/scripts/client-handoff-standalone-capture.sh \
  wordpress/scripts/tests/client-handoff-standalone-capture.test.sh
git commit -m "test(wordpress): add standalone Phase 3 capture harness"
```

---

### Task 3: Generate and verify the complete review evidence set

**Files:**
- Runtime artifacts only: `wordpress/.client-preview-artifacts/handoff-phase3/*.png`
- Runtime manifest: `wordpress/.client-preview-artifacts/handoff-phase3/manifest.tsv`

**Interfaces:**
- Consumes: healthy local runtime at `http://localhost:8088/` and Task 2 harness.
- Produces: 50 standalone full-page screenshots suitable for visual inspection, with one manifest row per screenshot.

- [ ] **Step 1: Reconfirm the pre-polish health/media gates before capture**

```bash
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
```

Expected: all three PASS.

- [ ] **Step 2: Run the standalone capture**

```bash
bash wordpress/scripts/client-handoff-standalone-capture.sh
```

Expected final line:

```text
PASS: 50 standalone Phase 3 screenshots captured in .../wordpress/.client-preview-artifacts/handoff-phase3
```

- [ ] **Step 3: Verify artifact completeness independently**

```bash
find wordpress/.client-preview-artifacts/handoff-phase3 -maxdepth 1 -type f -name '*.png' | wc -l
wc -l wordpress/.client-preview-artifacts/handoff-phase3/manifest.tsv
```

Expected:
- PNG count: `50`
- manifest line count: `51` including header.

- [ ] **Step 4: Make the evidence reviewable**

If the executing agent cannot directly inspect the local runtime artifacts, package them without committing binaries:

```bash
cd wordpress/.client-preview-artifacts
zip -qr handoff-phase3-screenshots.zip handoff-phase3
```

The ZIP is review evidence only and remains outside Git history.

---

### Task 4: Perform the standalone visual audit and create the Phase 3 correction queue

**Files:**
- Create: `docs/superpowers/reports/2026-09-07-phase3-standalone-visual-audit.md`

**Interfaces:**
- Consumes: all 50 screenshots and `manifest.tsv` from Task 3.
- Produces: a complete PASS/defect judgment for every matrix cell and an ordered list of concrete defects that can be converted into an exact Phase 3B TDD plan.

- [ ] **Step 1: Review every screenshot independently**

For each screenshot judge only the rendered template itself. Do not compare against historical/live screenshots. Review in this order:

1. composition/blunders;
2. whitespace and section transitions;
3. responsive stacking and RTL symmetry;
4. cards/controls/media blocks/section widths;
5. typography hierarchy, line length, heading/body spacing;
6. padding, rhythm, dividers, radius/shadow restraint, alignment.

A route/viewport cell is marked `PASS` only when no visible defect remains at the above levels.

- [ ] **Step 2: Write the audit report with this exact structure**

```markdown
# Phase 3 Standalone Visual Audit

**Branch:** `wordpress/client-content-controls`
**Capture baseline:** `<actual commit used for capture>`
**Evidence directory:** `wordpress/.client-preview-artifacts/handoff-phase3/`
**Method:** standalone full-page review only; no overlays or pixel-diff acceptance

## Matrix

| Locale | Surface | 1440x900 | 1024x768 | 768x1024 | 431x932 | 390x844 |
| --- | --- | --- | --- | --- | --- | --- |
| EN | Home | PASS or defect IDs | ... | ... | ... | ... |
| EN | About | ... | ... | ... | ... | ... |
| EN | Contact | ... | ... | ... | ... | ... |
| EN | Shop | ... | ... | ... | ... | ... |
| EN | Product Detail | ... | ... | ... | ... | ... |
| AR | Home | ... | ... | ... | ... | ... |
| AR | About | ... | ... | ... | ... | ... |
| AR | Contact | ... | ... | ... | ... | ... |
| AR | Shop | ... | ... | ... | ... | ... |
| AR | Product Detail | ... | ... | ... | ... | ... |

## Defects

For every defect record:
- **ID:** `P3-001`, `P3-002`, ...
- **Priority:** 1–6 using §6.2 fix order
- **Observed on:** exact screenshot filenames
- **Visible symptom:** concrete visual behavior, not a proposed fix
- **Scope:** shared / Home / About / Contact / Shop / Product Detail
- **Directionality:** EN-only / AR-only / both
- **Responsive range:** exact affected viewport(s)
- **Owner:** shared CSS / RTL CSS / page CSS / Elementor partial / Woo renderer
- **Likely source files:** exact repository paths supported by source inspection
- **Focused RED contract:** exact behavior a new/existing automated test must assert before production code changes

## Correction order

List defect IDs sorted first by priority, then shared-before-page-scoped when the same root cause repeats.

## Protected accepted structures

Record accepted structures that the audit did not identify as defective and therefore must not be reopened in Phase 3B.
```

Do not write speculative fixes in the `Visible symptom` field. Root-cause analysis happens before each production change in Phase 3B.

- [ ] **Step 3: Check audit completeness**

The report must account for all 50 screenshots. Every matrix cell must contain either `PASS` or at least one `P3-###` defect ID; no cell may be omitted.

Every defect must point to at least one exact screenshot filename and one ownership layer.

- [ ] **Step 4: Commit the audit report**

```bash
git add docs/superpowers/reports/2026-09-07-phase3-standalone-visual-audit.md
git commit -m "docs(wordpress): record Phase 3 standalone visual audit"
```

---

## Phase 3A completion gate

Phase 3A is complete only when:

```bash
bash wordpress/scripts/tests/client-handoff-standalone-capture.test.sh
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
```

are GREEN, exactly 50 standalone screenshots exist, and the audit report accounts for every matrix cell.

No visual production CSS/template mutation belongs in Phase 3A.

After the report is committed, write a separate `Phase 3B — Standalone Polish Corrections` implementation plan from the concrete `P3-###` defects. Each Phase 3B task must contain one root-cause investigation, one observed RED contract, one minimal production correction, one GREEN run, neighboring regressions, and recapture of only the affected route/viewport evidence before proceeding to the next defect.
