# Rosa Medical Live-Recovery Gap Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the evidence and implementation gaps left by the September 6 live-site recovery plan: formally verify/freeze Home, actually recover About EN/AR against the frozen `rosamedical.org` baseline, finish the shared-shell interaction sweep, complete the RTL/responsive matrix, run final acceptance, and finish the WordPress runbook without reopening already accepted Contact, Shop, or Product Detail work.

**Architecture:** Keep the approved September 6 architecture unchanged. The frozen browser audit at `artifacts/live-vs-local-audit-2026-09-06` remains primary visual authority; Elementor Free remains the authoring surface for Home/About/Contact EN+AR; WooCommerce remains product truth; Rosa settings remain shared-business truth; the child theme owns shell, responsive CSS, RTL, shared CTA, and Woo presentation. This plan is a gap-closure plan, not a redesign or a target refresh.

**Tech Stack:** WordPress/PHP 8+, Hello Elementor, Elementor Free, WooCommerce, Docker Compose, WP-CLI, Bash, vanilla CSS/JS, Playwright through `apps/web`.

**Spec:** `docs/superpowers/specs/2026-09-06-rosa-live-site-visual-recovery-design.md`

## Global Constraints

- Work only on `wordpress/client-content-controls`; do not merge or delete the branch during this plan.
- Primary visual authority is the frozen 2026-09-06 `rosamedical.org` browser audit.
- Fresh production is only a drift check. It never silently replaces the frozen baseline.
- If fresh production differs materially from the frozen baseline, classify `TARGET_DRIFT` and stop the affected surface pending explicit target-refresh approval.
- Do not redesign Rosa Medical.
- Preserve Elementor Free authoring for EN/AR Home, About and Contact.
- Preserve WooCommerce ownership of products, families/categories, media, SKUs, configurations, descriptions and publish state.
- Preserve centralized Rosa ownership of phone, email, EN/AR address, WhatsApp and shared Site/CTA values.
- Protected Woo/shared values must remain outside all six Elementor JSON documents.
- Keep `rosa_content_manager` / `rosa_manage_content` permission boundary intact.
- No Elementor Pro or proprietary MedicaShop runtime dependency.
- Contact remains presentation/mailto-oriented; do not add a server-side submission backend.
- Routine seeds must not overwrite edited Elementor documents.
- No Hostinger/production mutation is authorized.
- Required visual matrix: `1920x1080`, `1440x900`, `1280x800`, `1024x768`, `768x1024`, `431x932`, `390x844`, `360x800`.
- Manual freeze review remains mandatory at `1440x900`, `1024x768`, and `390x844`.
- The project-stage acceptance standard is professional and convincingly close to the frozen live reference; the strict 3% pixel threshold remains diagnostic evidence, not a requirement to chase pixel-perfect parity after explicit manual acceptance.
- Contact EN/AR is frozen under `docs/superpowers/reports/2026-09-06-contact-visual-acceptance.md` unless explicitly reopened.
- Shop EN/AR is frozen under `docs/superpowers/reports/2026-09-07-shop-visual-acceptance.md` unless explicitly reopened. Task 9 accessibility fixes may be regression-checked but must not trigger another Shop redesign.
- Representative Product Detail is frozen under `docs/superpowers/reports/2026-09-07-product-detail-visual-acceptance.md` unless explicitly reopened.

---

## File Map

### Evidence and reports

- Create: `docs/superpowers/reports/2026-09-07-live-recovery-progress-correction.md`
- Create if still absent: `docs/superpowers/reports/2026-09-06-live-visual-baseline-manifest.md`
- Create if still absent: `docs/superpowers/reports/2026-09-06-live-visual-recovery-scorecard.md`
- Create after acceptance: `docs/superpowers/reports/2026-09-07-home-visual-acceptance.md`
- Create after acceptance: `docs/superpowers/reports/2026-09-07-about-visual-acceptance.md`
- Update at final gate: `docs/superpowers/reports/2026-09-06-live-visual-recovery-scorecard.md`

### Home

- Test/read: `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- Modify only if frozen-live evidence requires: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php`
- Modify only if frozen-live evidence requires: Home template parts under `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/`
- Modify only if frozen-live evidence requires: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Modify only if frozen-live evidence requires: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`
- Prefer adding narrowly scoped recovery overrides to `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css` rather than destabilizing accepted historical styles.

### About

- Test/read: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- Create only if a topology defect is proven: `wordpress/scripts/tests/live-about-fidelity.test.mjs`
- Modify only as frozen evidence requires: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-stats.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-feature.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-why.php`
- Modify only as frozen evidence requires: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`
- Modify only if RTL-specific evidence requires: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`

### Shared shell and final matrix

- Test: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- Create if missing shell-only visual invariants need a focused contract: `wordpress/scripts/tests/live-shared-shell-fidelity.test.mjs`
- Modify globally only: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify globally only: `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- Modify globally only: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/cta-banner.php`
- Modify globally only: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Modify globally only: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`
- Modify globally only: `wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js`
- Read/use: `wordpress/scripts/live-visual-audit.mjs`
- Read/use: `wordpress/scripts/live-site-sync-check.mjs`

---

### Task 0: Repair the Evidence Ledger Before More Freeze Decisions

**Files:**
- Create: `docs/superpowers/reports/2026-09-07-live-recovery-progress-correction.md`
- Create if absent: `docs/superpowers/reports/2026-09-06-live-visual-baseline-manifest.md`
- Create if absent: `docs/superpowers/reports/2026-09-06-live-visual-recovery-scorecard.md`

**Interfaces:**
- Consumes: current branch history, accepted Contact/Shop/Product reports, ignored frozen audit directory.
- Produces: an authoritative progress ledger so later tasks cannot be marked frozen without evidence.

- [ ] **Step 1: Record the corrected status from repository evidence**

Create `2026-09-07-live-recovery-progress-correction.md` with these exact states:

```text
Tasks 1-2: complete
Task 0: baseline evidence exists, committed baseline-manifest report missing
Task 3: initial audit tooling/evidence exists, committed recovery-scorecard report missing
Task 4 Home: implemented before corrective recovery; formal frozen-live acceptance still open
Task 5 About: not recovered against frozen live baseline
Task 6 Contact: accepted/frozen
Task 7 Shop: accepted/frozen
Task 8 Product Detail: accepted/frozen
Task 9: started; accessibility suite awaiting post-timing-fix rerun; shell visual sweep open
Tasks 10-12: open
```

- [ ] **Step 2: Generate missing baseline-manifest report from the immutable local artifact**

Run:

```bash
BASE=artifacts/live-vs-local-audit-2026-09-06

test -f "$BASE/manifest.json"
test -d "$BASE/screenshots"

BASE_SHA=$(sha256sum "$BASE/manifest.json" | awk '{print $1}')
BASE_SHA="$BASE_SHA" node --input-type=module <<'JS' > docs/superpowers/reports/2026-09-06-live-visual-baseline-manifest.md
import fs from 'node:fs';
const file = 'artifacts/live-vs-local-audit-2026-09-06/manifest.json';
const m = JSON.parse(fs.readFileSync(file, 'utf8'));
const routes = (m.routes || []).map(r => r.key || r.name || r.path || String(r)).join(', ');
const viewports = (m.viewports || []).map(v => `${v.width}x${v.height}`).join(', ');
console.log('# Frozen live visual baseline manifest — 2026-09-06');
console.log('');
console.log(`- Artifact: \`${file}\``);
console.log(`- SHA-256: \`${process.env.BASE_SHA}\``);
console.log(`- Authority: frozen approved \`rosamedical.org\` browser audit`);
console.log(`- Generated at: \`${m.generatedAt || m.capturedAt || 'recorded in frozen manifest'}\``);
console.log(`- Reference: \`${m.referenceBase || m.liveBase || 'https://rosamedical.org/'}\``);
console.log(`- Routes: ${routes || 'Home/About/Contact/Shop EN+AR; see frozen manifest'}`);
console.log(`- Viewports: ${viewports || '1920x1080, 1440x900, 1280x800, 1024x768, 768x1024, 431x932, 390x844, 360x800'}`);
console.log('');
console.log('This artifact is immutable visual authority for the recovery plan. Fresh production checks may report drift but must never overwrite it.');
JS
```

- [ ] **Step 3: Reconstruct the missing initial scorecard from the frozen/current audit evidence**

If `artifacts/live-visual-recovery/00-initial/manifest.json` exists, generate the scorecard from it:

```bash
INITIAL=artifacts/live-visual-recovery/00-initial/manifest.json

test -f "$INITIAL"
node --input-type=module <<'JS' > docs/superpowers/reports/2026-09-06-live-visual-recovery-scorecard.md
import fs from 'node:fs';
const p = 'artifacts/live-visual-recovery/00-initial/manifest.json';
const m = JSON.parse(fs.readFileSync(p, 'utf8'));
console.log('# Live visual recovery scorecard — 2026-09-06');
console.log('');
console.log('| Route | Viewport | Changed pixels | Differences |');
console.log('|---|---:|---:|---|');
for (const r of m.records || []) {
  const pct = r.pixelComparison?.changedPixelRatio == null ? 'n/a' : `${(r.pixelComparison.changedPixelRatio * 100).toFixed(2)}%`;
  const differences = (r.differences || []).join('; ').replaceAll('|', '\\|') || 'none';
  console.log(`| ${r.route} | ${r.viewport} | ${pct} | ${differences} |`);
}
console.log('');
console.log('This scorecard records initial recovery evidence. Later page-specific acceptance reports override initial status for accepted surfaces without changing the frozen baseline.');
JS
```

If `00-initial/manifest.json` does not exist, do not fabricate it; record the absence in the progress-correction report and leave scorecard creation for Task 6 from the final matrix.

- [ ] **Step 4: Commit only documentation that could be generated from verified evidence**

```bash
git add docs/superpowers/reports/2026-09-07-live-recovery-progress-correction.md \
        docs/superpowers/reports/2026-09-06-live-visual-baseline-manifest.md \
        docs/superpowers/reports/2026-09-06-live-visual-recovery-scorecard.md 2>/dev/null || true

git diff --cached --check
git commit -m "docs(wordpress): correct live-recovery progress ledger"
```

---

### Task 1: Close the Home Gate Against the Correct Frozen Authority

**Files:**
- Read/test: `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- Modify only if evidence requires: Home widgets/partials/CSS listed above.
- Create after acceptance: `docs/superpowers/reports/2026-09-07-home-visual-acceptance.md`

**Interfaces:**
- Consumes: frozen baseline and the user's `20-home-recheck` audit.
- Produces: either a focused Home RED repair cycle or a documented Home freeze decision.

- [ ] **Step 1: Run the existing Home structural/browser contract**

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected: no browser/structural regression. A failure is a real Home blocker and must be debugged before visual acceptance.

- [ ] **Step 2: Run the frozen-live Home audit**

```bash
node wordpress/scripts/live-visual-audit.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --current http://localhost:8088/ \
  --only home \
  --out artifacts/live-visual-recovery/20-home-recheck
```

- [ ] **Step 3: Review the six required Home screenshots**

Review EN and AR at:

```text
1440x900
1024x768
390x844
```

The exact files are under:

```text
artifacts/live-visual-recovery/20-home-recheck/screenshots/home/en/<viewport>/side-by-side.png
artifacts/live-visual-recovery/20-home-recheck/screenshots/home/ar/<viewport>/side-by-side.png
```

- [ ] **Step 4A: If no CRITICAL/HIGH visual defect remains, freeze Home without unnecessary code changes**

Create `2026-09-07-home-visual-acceptance.md` recording:

```text
scope: / and /ar/
authority: frozen 2026-09-06 live audit
structural/browser test result
reviewed viewports: 1440x900, 1024x768, 390x844 EN+AR
strict pixel verifier status as diagnostic only
manual acceptance decision
Home frozen unless explicitly reopened
```

Commit:

```bash
git add docs/superpowers/reports/2026-09-07-home-visual-acceptance.md
git commit -m "docs(wordpress): record Home visual acceptance"
```

- [ ] **Step 4B: If a CRITICAL/HIGH defect is visible, create one focused RED before editing**

Do not rewrite the whole historical Home test. Add only an assertion that expresses the observed frozen-live mismatch, or use the existing audit output as the visual RED when the difference is purely geometry/style. Then make the smallest Home-scoped change, rerun Step 1 and Step 2, and repeat the six-screenshot review before freezing.

- [ ] **Step 5: Run the Home production drift checkpoint**

```bash
node wordpress/scripts/live-site-sync-check.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --live https://rosamedical.org/ \
  --only home \
  --out artifacts/live-visual-recovery/21-home-final-live-sync
```

If automated live access is blocked, classify the concrete transport failure as `LIVE_SYNC_UNAVAILABLE`; do not convert it into visual `TARGET_DRIFT` without comparable live evidence.

---

### Task 2: Recover About EN/AR for Real

**Files:**
- Test/read: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- Create only for a proven topology defect: `wordpress/scripts/tests/live-about-fidelity.test.mjs`
- Modify only as required: About widget/partial files listed in File Map.
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`
- Modify RTL only when frozen AR evidence requires it.
- Create after acceptance: `docs/superpowers/reports/2026-09-07-about-visual-acceptance.md`

**Interfaces:**
- Consumes: frozen About EN/AR baseline screenshots/metrics already recognized by `live-visual-audit.mjs` as `page-hero`, `about-who`, `about-stats`, `about-cards`, `feature-banner`, `why-us`, `family-strip`, prefooter and footer surfaces.
- Produces: recovered About with unchanged Elementor ownership and independent EN/AR editing.

- [ ] **Step 1: Prove authoring/topology baseline before visual changes**

```bash
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
```

If the About topology portion is GREEN, preserve its section order and do not create a redundant topology test. If it is RED, split the failing About behavior into `live-about-fidelity.test.mjs` before changing production code.

- [ ] **Step 2: Establish the visual RED using the frozen baseline**

```bash
node wordpress/scripts/live-visual-audit.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --current http://localhost:8088/ \
  --only about \
  --out artifacts/live-visual-recovery/22-about-red
```

Expected: current About is visually different enough that the side-by-side review exposes the unrecovered presentation.

- [ ] **Step 3: Extract exact frozen/current geometry for About keys**

```bash
node --input-type=module <<'JS'
import fs from 'node:fs';
const p='artifacts/live-visual-recovery/22-about-red/manifest.json';
const m=JSON.parse(fs.readFileSync(p,'utf8'));
for(const r of m.records.filter(r=>r.route.startsWith('about-'))){
  console.log(`\n${r.route} ${r.viewport}`);
  console.log((r.differences||[]).join('\n'));
  console.log(`ref=${r.frozenEvidence||''}`);
  console.log(`local=${r.currentEvidence||''}`);
  console.log(`pair=${r.sideBySide||''}`);
}
JS
```

Use this output and the EN/AR side-by-side images at 1440/1024/390 as the only authority for About tuning.

- [ ] **Step 4: Make the smallest About-scoped recovery pass**

Rules for the first pass:

```text
Do not change header/footer/CTA globally.
Do not change Contact/Shop/Product Detail CSS.
Do not move protected business or Woo data into Elementor.
Prefer selectors scoped to [data-preview-page-hero] on About and the existing About data attributes/classes.
Keep About content controls in AboutWidgets.php / ElementorSeedData.php only when content/topology evidence requires it.
Put geometry/typography/background recovery overrides in live-visual-recovery.css.
Use client-preview-rtl.css only for differences unique to AR/RTL.
```

- [ ] **Step 5: Run About regression and visual pass**

```bash
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/

node wordpress/scripts/live-visual-audit.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --current http://localhost:8088/ \
  --only about \
  --out artifacts/live-visual-recovery/23-about-pass-1
```

- [ ] **Step 6: Iterate only on visible CRITICAL/HIGH About defects**

For each additional pass, use a new immutable output directory:

```text
24-about-pass-2
25-about-pass-3
26-about-final
```

Do not tune solely to reduce the changed-pixel ratio after the page is professionally convincing and no CRITICAL/HIGH difference remains.

- [ ] **Step 7: Verify Elementor ownership did not regress**

Run:

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
```

Expected: EN/AR About edits persist independently and routine seeds preserve edited documents.

- [ ] **Step 8: Manually freeze About**

Review final EN+AR side-by-side screenshots at 1440/1024/390. Then create `2026-09-07-about-visual-acceptance.md` with the same acceptance semantics as Contact/Shop: frozen authority, exact accepted commit, local gates, reviewed viewports, strict-pixel status, manual decision, Elementor ownership preserved.

- [ ] **Step 9: Run the required post-About live sync**

```bash
node wordpress/scripts/live-site-sync-check.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --live https://rosamedical.org/ \
  --only about \
  --out artifacts/live-visual-recovery/27-about-final-live-sync
```

- [ ] **Step 10: Commit About as its own recovery unit**

```bash
git add wordpress/scripts/tests/live-about-fidelity.test.mjs \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php \
        wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-*.php \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css \
        docs/superpowers/reports/2026-09-07-about-visual-acceptance.md 2>/dev/null || true

git diff --cached --check
git commit -m "fix(wordpress): restore live Rosa About fidelity"
```

---

### Task 3: Finish Shared Shell and Interaction Sweep

**Files:**
- Test: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- Create only for visual shell gaps: `wordpress/scripts/tests/live-shared-shell-fidelity.test.mjs`
- Modify globally only: header/footer/CTA/client-preview CSS/RTL/JS files from File Map.

**Interfaces:**
- Consumes: all frozen page bodies, including newly frozen Home/About.
- Produces: one stable shared announcement/header/nav/drawer/prefooter/footer implementation across EN/AR.

- [ ] **Step 1: Rerun the accessibility/interaction suite after commit `b7a1589`**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Expected final line:

```text
PASS: client preview browser accessibility, interaction, RTL and console acceptance
```

Any new failure must be root-caused before editing. Distinguish stale test selectors/timing from actual production defects.

- [ ] **Step 2: Capture all marketing routes for shell review**

```bash
node wordpress/scripts/live-visual-audit.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --current http://localhost:8088/ \
  --out artifacts/live-visual-recovery/30-shared-shell
```

- [ ] **Step 3: Review only shared regions at 1440/1024/390**

Compare:

```text
announcement bar
header/logo/nav/actions
mobile/tablet menu trigger and drawer
shared prefooter quotation CTA
footer columns and bottom row
EN/AR RTL symmetry
```

Do not reopen accepted page-body differences during this task.

- [ ] **Step 4: Create a focused shell RED only if a shared defect is repeated across pages**

Create `live-shared-shell-fidelity.test.mjs` only for invariants not already covered by the accessibility suite, such as repeated header height, prefooter topology, or footer column count. Do not duplicate keyboard/focus/drawer tests already present in `client-preview-accessibility.test.mjs`.

- [ ] **Step 5: Apply the smallest global shell fix**

Only these files may change for the shell fix:

```text
header.php
footer.php
cta-banner.php
client-preview.css
client-preview-rtl.css
client-preview.js
```

- [ ] **Step 6: Verify shell and page-body regressions**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-shop-fidelity.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
```

- [ ] **Step 7: Commit shared shell independently**

```bash
git add wordpress/scripts/tests/client-preview-accessibility.test.mjs \
        wordpress/scripts/tests/live-shared-shell-fidelity.test.mjs \
        wordpress/wp-content/themes/rosa-medical-child/header.php \
        wordpress/wp-content/themes/rosa-medical-child/footer.php \
        wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/cta-banner.php \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css \
        wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js 2>/dev/null || true

git diff --cached --check
git commit -m "fix(wordpress): align shared shell with live Rosa"
```

---

### Task 4: Full RTL and Responsive Matrix Sweep

**Files:**
- Modify only where measured evidence requires: `client-preview-rtl.css`, `client-preview.css`, page-specific recovery CSS/partials.
- Test: existing page tests plus audit tool.

**Interfaces:**
- Consumes: frozen Home/About/Contact/Shop and representative Product Detail plus shared shell.
- Produces: responsive EN/AR acceptance across all required widths.

- [ ] **Step 1: Capture the full marketing matrix**

```bash
node wordpress/scripts/live-visual-audit.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --current http://localhost:8088/ \
  --out artifacts/live-visual-recovery/40-full-responsive
```

- [ ] **Step 2: Run Product Detail responsive contracts separately**

```bash
node wordpress/scripts/tests/live-product-detail-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
```

- [ ] **Step 3: Inspect every required width for overflow and breakpoint topology**

Required matrix:

```text
1920x1080
1440x900
1280x800
1024x768
768x1024
431x932
390x844
360x800
```

Repair only demonstrated defects. Keep fixes page-scoped unless the same defect occurs across multiple pages and belongs to the shared shell.

- [ ] **Step 4: Rerun the accessibility/reflow suite**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

- [ ] **Step 5: Rerun all page-specific recovery gates**

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-shop-fidelity.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/live-product-detail-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
```

- [ ] **Step 6: Commit only verified responsive/RTL changes**

```bash
git diff --check
git add wordpress/wp-content/themes/rosa-medical-child/assets/css \
        wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview \
        wordpress/scripts/tests

git diff --cached --check
git commit -m "fix(wordpress): complete live responsive and RTL parity"
```

---

### Task 5: Final Full Audit and Production Drift Check

**Files:**
- Update: `docs/superpowers/reports/2026-09-06-live-visual-recovery-scorecard.md`
- No production code unless this task exposes a concrete RED defect.

**Interfaces:**
- Consumes: final local branch and immutable frozen baseline.
- Produces: final local acceptance evidence and live-sync classification.

- [ ] **Step 1: Capture final local marketing audit**

```bash
node wordpress/scripts/live-visual-audit.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --current http://localhost:8088/ \
  --out artifacts/live-visual-recovery/50-final
```

- [ ] **Step 2: Run final fresh-production sync**

```bash
node wordpress/scripts/live-site-sync-check.mjs \
  --baseline artifacts/live-vs-local-audit-2026-09-06 \
  --live https://rosamedical.org/ \
  --out artifacts/live-visual-recovery/51-final-live-sync
```

Classify edge/headless failures explicitly. Do not call them visual drift without comparable fresh production evidence.

- [ ] **Step 3: Run the complete local regression gate**

```bash
bash wordpress/scripts/tests/live-visual-authority-contract.test.sh
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
bash wordpress/scripts/tests/client-preview-content-manager-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-shop-fidelity.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/live-product-detail-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
```

- [ ] **Step 4: Update the scorecard with final status**

For each surface record exactly one state:

```text
ACCEPTED/FROZEN
OPEN — concrete defect named
LIVE_SYNC_UNAVAILABLE — transport/tooling reason named
TARGET_DRIFT — fresh comparable evidence exists
```

No surface may be marked accepted from historical assumptions alone.

---

### Task 6: Historical Cleanup and Final Local Runbook

**Files:**
- Remove only files proven unused by source/runtime evidence.
- Update the WordPress local/staging runbook/documentation.
- Do not touch Hostinger or production.

**Interfaces:**
- Consumes: final GREEN regression suite and acceptance reports.
- Produces: a maintainable local/staging handoff with no stale visual-authority ambiguity.

- [ ] **Step 1: Identify superseded visual-authority tests/files**

Do not delete a historical file merely because its name mentions MedicaShop. Delete only when no runtime/test script imports or executes it and its visual-authority role is explicitly superseded by the frozen-live tooling.

- [ ] **Step 2: Update runbook with current ownership model**

The final runbook must state:

```text
Elementor Free owns Home/About/Contact EN+AR body content and body media.
WooCommerce owns products/categories/SKUs/variants/product media/descriptions/publish state.
Rosa settings own shared business values and CTA values.
Child theme owns header/footer/nav/CTA shell/responsive/RTL/Woo templates.
Frozen 2026-09-06 browser audit is visual authority for this recovery.
No production mutation is authorized by completion of the local plan.
```

- [ ] **Step 3: Run the normal runtime verifier**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

- [ ] **Step 4: Verify repository cleanliness without touching protected untracked files**

```bash
git status --short
git diff --check
git log --oneline -12
```

Never stash/reset/delete untracked local artifacts to manufacture a clean status.

- [ ] **Step 5: Commit cleanup/runbook only after verification**

```bash
git add docs wordpress/scripts wordpress/wp-content

git diff --cached --check
git commit -m "docs(wordpress): finalize live-recovery runbook"
```

Stop here. Do not deploy, upload, mutate production data, seed Hostinger, change DNS, or merge the branch without a separate explicit user instruction.

---

## Plan Self-Review

- Spec coverage: frozen authority, periodic live sync, Elementor/Woo/settings ownership, EN/AR/RTL, required viewports, manual freeze reviews, no production mutation, and all remaining Tasks 4-12 are covered.
- Accepted Contact/Shop/Product Detail work is explicitly protected from accidental reopening.
- Home is treated as verification-open rather than falsely complete.
- About has a real frozen-live RED→repair→manual-freeze cycle.
- Shared shell work resumes only after Home/About are closed.
- No Product Detail live-sync route is invented; its existing baseline coverage-gap classification remains valid.
- No placeholders or unbounded redesign tasks are present.
