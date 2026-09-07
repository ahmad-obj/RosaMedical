# Client Handoff Phase 2 Media Provenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inventory every delivered visual asset, disposition it as KEEP / REMOVE-PLACEHOLDER / REVIEW from repository/runtime evidence, and ensure every unsafe or unknown-provenance delivered image is replaced by the existing neutral Rosa media-slot system without breaking Elementor/Woo ownership or Phase 1 health.

**Architecture:** Phase 2 is evidence-first. A read-only WP-CLI/repository inventory produces one normalized media report spanning Elementor, `rosa_preview_media`, Woo product/category media, attachments, and hardcoded local/background references. Sanitization then clears only attachment references classified REMOVE-PLACEHOLDER (and unresolved REVIEW items, because unknown provenance is not treated as licensed) while preserving approved Rosa/catalogue media and client-edited non-media content. The existing `media-slot.php` remains the only placeholder renderer.

**Tech Stack:** WordPress/WooCommerce, Elementor Free, PHP, Bash, WP-CLI, Playwright, child-theme CSS.

**Spec:** `docs/superpowers/specs/2026-09-07-client-handoff-finalization-design.md` section 5.

## Global Constraints

- Elementor Free owns editable Home/About/Contact EN+AR body content and body media.
- WooCommerce owns products, categories/families, SKUs, configurations, descriptions, product media, and publish state.
- Rosa settings own shared business/contact and CTA values.
- The child theme/plugin own the protected shell, responsive behavior, RTL, shared interactions, and Woo presentation.
- No production/Hostinger mutation is authorized.
- Unknown provenance is not treated as licensed by assumption.
- Catalogue-confirmed Woo instrument imagery must not be removed merely because it is an image.
- Routine seeds must not overwrite client-edited Elementor documents.
- Reuse `template-parts/client-preview/media-slot.php`; do not introduce a parallel placeholder/image subsystem.

---

## File Map

- Create: `wordpress/scripts/client-handoff-media-inventory.sh` — read-only runtime/repository media inventory; emits normalized TSV plus human-readable summary.
- Create: `wordpress/scripts/tests/client-handoff-media-inventory.test.sh` — source/shape contract for the inventory tool and a local runtime smoke assertion.
- Create during execution after the inventory run: `docs/superpowers/reports/2026-09-07-media-provenance-audit.md` — authoritative disposition table and evidence.
- Create only if the audit finds REMOVE-PLACEHOLDER/REVIEW references: `wordpress/scripts/client-handoff-media-sanitize.sh` — targeted local sanitization using exact attachment IDs/source paths from the report; no broad resets.
- Create only if sanitizer is needed: `wordpress/scripts/tests/client-handoff-media-sanitize.test.sh` — RED/GREEN mutation contract proving only classified references are cleared.
- Modify only if placeholder behavior itself fails the contract: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php`.
- Modify only if stable placeholder geometry/visual neutrality is insufficient: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`.
- Modify only if an unsafe asset is still injected by routine seed logic: `wordpress/scripts/client-preview-seed.sh` and/or `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`.

---

### Task 1: Build the Read-Only Media Inventory

**Files:**
- Create: `wordpress/scripts/client-handoff-media-inventory.sh`
- Test: `wordpress/scripts/tests/client-handoff-media-inventory.test.sh`

**Interfaces:**
- Consumes: local Docker WordPress runtime, WP-CLI, Git working tree.
- Produces: tab-separated records with columns `owner`, `surface`, `slot`, `attachment_id`, `source_path`, `file_url`, `parent_id`, `notes` and summary sections for hardcoded repository references.

- [ ] **Step 1: Write the failing inventory contract**

The test must require the inventory script to cover all six evidence sources from the spec and remain read-only. It must assert presence of collectors for:

```text
rosa_preview_media
_elementor_data
_product_image_gallery
_thumbnail_id
product_cat
_rosa_preview_source_path
```

It must also reject mutating WP-CLI verbs inside the inventory script:

```text
post update
post delete
post meta update
option update
media import
term update
```

- [ ] **Step 2: Run the contract and observe RED**

```bash
bash wordpress/scripts/tests/client-handoff-media-inventory.test.sh
```

Expected: FAIL because `client-handoff-media-inventory.sh` does not exist yet.

- [ ] **Step 3: Implement the inventory script**

The script must:

1. resolve the existing Docker compose/WP-CLI wrapper exactly as the other WordPress scripts do;
2. print `ROSA_MEDIA_INVENTORY_V1` as the first line;
3. read `rosa_preview_media` and resolve each non-zero attachment ID;
4. inspect `_elementor_data` for Home/About/Contact EN+AR and recursively emit every media object containing an attachment `id` or URL;
5. inspect Woo published products for featured/gallery IDs and `product_cat` terms for `_thumbnail_id`;
6. list delivered WordPress attachments with `_wp_attached_file`, `_rosa_preview_source_path`, parent post, MIME type, and URL;
7. run repository grep for image/background references in the active child theme/plugin and seed scripts;
8. never write options, post meta, attachments, Elementor JSON, Woo data, or files outside its report output.

- [ ] **Step 4: Run source contract GREEN and runtime inventory**

```bash
bash wordpress/scripts/tests/client-handoff-media-inventory.test.sh
bash wordpress/scripts/client-handoff-media-inventory.sh | tee /tmp/rosa-media-inventory.tsv
```

Expected: source contract PASS; inventory exits 0 and contains records for settings, Elementor, Woo, attachments, and repository references.

- [ ] **Step 5: Commit**

```bash
git add wordpress/scripts/client-handoff-media-inventory.sh \
        wordpress/scripts/tests/client-handoff-media-inventory.test.sh
git commit -m "test(wordpress): inventory client handoff media provenance"
```

---

### Task 2: Produce the Authoritative Provenance Disposition Report

**Files:**
- Create: `docs/superpowers/reports/2026-09-07-media-provenance-audit.md`

**Interfaces:**
- Consumes: `/tmp/rosa-media-inventory.tsv`, repository source/history, catalogue evidence already accepted for Woo product media.
- Produces: one row per delivered asset/reference with disposition `KEEP`, `REMOVE-PLACEHOLDER`, or `REVIEW`, plus evidence.

- [ ] **Step 1: Normalize duplicate references by attachment/source**

Treat one attachment used in multiple slots as one asset with multiple consumers; list every consumer so sanitization cannot miss a surface.

- [ ] **Step 2: Apply the classification rule exactly**

```text
KEEP
  client-supplied Rosa brand/media with explicit repository/runtime evidence
  OR catalogue-confirmed Woo product media
  OR an asset explicitly approved in existing project evidence

REMOVE-PLACEHOLDER
  stock/reference/demo/temporary imagery
  OR seeded editorial imagery with no ownership/license evidence

REVIEW
  provenance cannot be established from available evidence
```

No asset may be promoted from REVIEW to KEEP by filename, appearance, local hosting, or absence of an external URL alone.

- [ ] **Step 3: Resolve REVIEW before sanitization**

For this handoff gate, unresolved REVIEW is treated conservatively as REMOVE-PLACEHOLDER unless concrete client/catalogue provenance evidence is found. Record the evidence or the conservative removal decision in the report.

- [ ] **Step 4: Record exact sanitization targets**

For every REMOVE-PLACEHOLDER asset record:

```text
attachment ID
_rosa_preview_source_path (when present)
all rosa_preview_media keys
all Elementor page/widget/control consumers
all Woo product/category consumers
all hardcoded source references
```

- [ ] **Step 5: Commit the report**

```bash
git add docs/superpowers/reports/2026-09-07-media-provenance-audit.md
git commit -m "docs(wordpress): classify client handoff media provenance"
```

---

### Task 3: Sanitize Only Classified Unsafe/Unknown Media Under TDD

**Files:**
- Create when needed: `wordpress/scripts/client-handoff-media-sanitize.sh`
- Test: `wordpress/scripts/tests/client-handoff-media-sanitize.test.sh`
- Modify if required by exact consumers: `wordpress/scripts/client-preview-seed.sh`
- Modify if required by exact consumers: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`

**Interfaces:**
- Consumes: exact REMOVE-PLACEHOLDER targets from the committed provenance report.
- Produces: zero delivered references to those target attachments while preserving all KEEP media and all non-media content.

- [ ] **Step 1: Write RED mutation contract from the report**

The test snapshots before-state for:

```text
Elementor _elementor_data hashes for six editable pages
rosa_preview_media
Woo product IDs/SKUs/product media IDs
Woo category thumbnail IDs
classified unsafe attachment references
```

It must fail while any classified unsafe attachment remains referenced by a delivered page/option/Woo surface.

- [ ] **Step 2: Observe RED**

```bash
bash wordpress/scripts/tests/client-handoff-media-sanitize.test.sh
```

Expected: FAIL naming at least one exact attachment/source classified REMOVE-PLACEHOLDER.

- [ ] **Step 3: Implement the narrow sanitizer**

The sanitizer must clear only exact attachment IDs/source paths named in the provenance report:

- `rosa_preview_media`: set only affected keys to `0`;
- Elementor: recursively replace only matching media-control attachment IDs with an empty media value while preserving widget IDs, text settings, structure, and all unrelated controls;
- Woo: do not touch catalogue-confirmed KEEP media; if the report identifies a non-catalogue unsafe Woo category/product image, clear only that exact image reference;
- attachments themselves do not need destructive deletion for Phase 2; delivered references are the gate;
- routine seed logic must stop re-introducing any classified unsafe asset.

- [ ] **Step 4: GREEN the targeted contract**

```bash
bash wordpress/scripts/tests/client-handoff-media-sanitize.test.sh
```

Expected: PASS with zero delivered unsafe/reference attachment consumers and unchanged KEEP/Woo catalogue evidence.

- [ ] **Step 5: Commit**

```bash
git add wordpress/scripts/client-handoff-media-sanitize.sh \
        wordpress/scripts/tests/client-handoff-media-sanitize.test.sh \
        wordpress/scripts/client-preview-seed.sh \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php
git commit -m "fix(wordpress): sanitize unprovenanced handoff media"
```

Only stage files actually changed.

---

### Task 4: Harden the Existing Neutral Placeholder Contract

**Files:**
- Test: `wordpress/scripts/tests/client-handoff-media-sanitize.test.sh`
- Modify only if needed: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php`
- Modify only if needed: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`

**Interfaces:**
- Consumes: empty media controls after Task 3.
- Produces: stable, neutral, network-independent placeholders with correct accessible semantics.

- [ ] **Step 1: Extend RED contract for rendered placeholder behavior**

For at least Home, About, Shop, and Product Detail, assert a cleared slot renders:

```text
[data-media-slot]
no <img> with broken/remote source
no third-party branding/reference text
non-zero rendered width/height
no horizontal overflow
```

Meaningful content slots must expose an accessible label; decorative slots must not create redundant spoken image content.

- [ ] **Step 2: Observe RED only if current `media-slot.php` fails a requirement**

```bash
bash wordpress/scripts/tests/client-handoff-media-sanitize.test.sh
```

If already GREEN, make no production change.

- [ ] **Step 3: Apply the minimum placeholder change if RED**

Retain the existing `.rosa-preview-media-slot` renderer and neutral CSS. Do not add photography, external SVGs, icon libraries, or a second placeholder component. Add only the minimum semantic/geometry adjustment required by the failing assertion.

- [ ] **Step 4: Re-run GREEN**

```bash
bash wordpress/scripts/tests/client-handoff-media-sanitize.test.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
```

- [ ] **Step 5: Commit only if production placeholder code changed**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css \
        wordpress/scripts/tests/client-handoff-media-sanitize.test.sh
git commit -m "fix(wordpress): harden neutral media placeholders"
```

---

### Task 5: Phase 2 Regression Gate

**Files:**
- Update: `docs/superpowers/reports/2026-09-07-media-provenance-audit.md` with final verification section.

- [ ] **Step 1: Re-run the inventory after sanitization**

```bash
bash wordpress/scripts/client-handoff-media-inventory.sh | tee /tmp/rosa-media-inventory-final.tsv
```

Expected: no delivered REMOVE-PLACEHOLDER/REVIEW attachment consumer remains.

- [ ] **Step 2: Run Phase 1 and ownership regressions**

```bash
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
```

Expected: all PASS. Woo fixture SKUs/media ownership remain intact; Elementor non-media edits and topology remain intact.

- [ ] **Step 3: Verify no forbidden source strings remain in active delivery paths**

```bash
git grep -niE 'preview\.themeforest|fullkit\.moxcreative|unsplash|pexels|pixabay|freepik|shutterstock|istock|stock[_ -]?photo' -- \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/wp-content/plugins/rosa-medical-core \
  wordpress/scripts
```

Expected: no unsafe delivered-media references. Any test fixture mention must be explicitly documented as non-delivery test data.

- [ ] **Step 4: Record Phase 2 final disposition**

The report must state counts for KEEP / REMOVE-PLACEHOLDER / REVIEW, with final REVIEW count equal to `0` for client handoff acceptance.

- [ ] **Step 5: Commit final evidence**

```bash
git add docs/superpowers/reports/2026-09-07-media-provenance-audit.md
git commit -m "docs(wordpress): record Phase 2 media sanitization gate"
```

## Phase 2 Exit Criteria

Phase 2 is complete only when:

- every delivered image/reference is inventoried and explicitly dispositioned;
- final REVIEW count is zero;
- all REMOVE-PLACEHOLDER assets are no longer referenced by delivered pages/settings/Woo surfaces;
- legitimate Rosa/catalogue media remains intact;
- empty slots render through the existing neutral `media-slot.php` abstraction with stable geometry and no external dependency;
- Elementor editability and Woo ownership remain green;
- Phase 1 health-flow/accessibility remain green;
- no production/Hostinger mutation occurred.
