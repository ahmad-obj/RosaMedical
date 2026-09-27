# Rosa Medical Final Production Closeout

> Live execution checklist. An item is checked only with evidence recorded in its
> corresponding evidence section or linked commit/test/report.

**Objective:** Finalize the existing Rosa Medical WordPress site without changing
its approved MedicaShop-inspired structure or quotation-first business model.

**Authority baseline:** `feature/wordpress-dynamic-catalogue`; initial implementation
commit `d38335c`, closeout checkpoint `140361e`, recovery tag
`checkpoint/rosa-finalization-baseline-2026-09-27` → `d38335c`.

## Release Gates

- [x] P0 — Establish authoritative branch, clean recovery checkpoint, and local runtime baseline.
- [ ] P0 — Product, configuration, image, quote, navigation, and locale journeys work in a real browser.
- [x] P0 — Importer preserves client-owned fields and is runtime-idempotent.
- [x] P0 — Family deletion honors leave-unassigned versus reassign mode.
- [ ] P0 — No known broken public assets, routes, quotation submission failures, console exceptions, or mobile overflow.
- [ ] P1 — Client-requested header, CTA, cards, product-card alignment, featured panel, spacing, and metrics refinements are verified.
- [ ] P1 — Amazon-style search/filter/discovery behavior works across desktop, mobile, URL history, EN, and AR.
- [ ] P1 — Admin workflows for business settings, families, products, media, and PDFs are safe and understandable.
- [ ] P1 — Full relevant automated test suite, browser matrix, image audit, accessibility pass, and deployment preflight have evidence.

## Surveillance and Baseline

- [x] Current branch, recent commits, remote branch inventory, and clean working tree inspected.
- [x] Remote refs fetched and compared; current branch contains the relevant Rosa WordPress ancestors.
- [x] Read WordPress/local/Hostinger runbooks, prior closeouts, current Amazon spec/plan, and image-audit materials.
- [x] Map active child theme, Rosa Core, WooCommerce, Elementor, quote system, importer, canonical data, and test entrypoints.
- [x] Establish Docker/runtime state and database/catalogue counts.
- [x] Capture representative baseline screenshots at desktop and 390px for EN/AR catalogue/header/product surfaces; complete the full final five-width matrix after final regressions.
- [ ] Record baseline console/network errors and existing defects.
- [x] Create a clean recovery checkpoint before risky implementation.

## Discovered Issues

### P0

- [x] Canonical data contained two false Iris mappings (`04-0901`, `04-0911`) caused by flattened PDF text, plus a global slug collision (`liston`) between a Knife and a Cutter. Removed the false Iris records, made the Knife slug `liston-knife`, and corrected the manifest to 111 logical products. The separately verified Stevens fixture retains the two real `04-09xx` configurations.
- [x] `18-0644` is an intentional source-backed duplicate public reference, not a duplicate product. Importer and quote/search surfaces now use `_rosa_primary_code` as the public authority while preserving Woo SKU uniqueness.
- [x] A prior local seed had attached four Liston Knife variations to the similarly named Liston Cutter. Added an explicit confirmation-gated repair that validates both canonical parents before moving only `18-0401`–`18-0404`; routine imports continue to refuse cross-parent moves.
- [x] Routine importer overwrote existing client-owned product name, description, publication state, visibility, family, and media. Reproduced in live WP-CLI; fixed with default create-missing/preserve-existing ownership behavior and runtime regression test.
- [x] Family deletion backend accepted a hidden reassignment target even when Leave Unassigned was selected. Reproduced in source/data flow; fixed with explicit mode validation and focused regression test.
- [x] Arabic Shop at 390px had a 574px document width: RTL selector specificity kept a desktop sidebar grid, and generic quote-card `align-self:start` made cards overflow their grid tracks. Fixed at the grid/card ownership layer; Playwright geometry now reports 390px document/body width and 169px card tracks.
- [x] The product-detail Elementor widgets displayed only Woo's globally unique SKU. This hid the supplier's intentionally duplicated `18-0644` public reference on one valid product. A shared catalogue-reference resolver now prefers `_rosa_primary_code`; the runtime duplicate-reference test covers both products.
- [x] Shop nested a second `<main>` inside the shared document landmark. The browser health flow reproduced this at 1440px; replaced the inner Shop landmark with a labelled results section.
- [x] Hello Elementor's late button reset made the Product Detail primary quote action transparent while retaining white text. Added a component-owned accent declaration and verified its computed red/white state at 390px.
- [x] The fixed quote-review trigger overlapped fields on the dedicated mobile Quote Request page, where the in-flow review already exists. It is now intentionally hidden only on that route; Shop and Product Detail retain the accessible drawer trigger.

### P1

- [ ] Verify all client visual annotations against actual render: utility ribbon, navigation type, language label, quote CTA, benefit cards, homepage rhythm, product-card CTA alignment, featured side panel, and metrics.
- [ ] Verify Amazon catalogue feature behavior rather than static contracts only.

### P2

- [ ] Audit global typography, contrast, icons, whitespace, RTL geometry, 200% zoom, reduced motion, and image quality/provenance.

### P3

- [ ] Remove only validated leftover QA/debug artifacts and stale copy; preserve intentional history/assets.

## Implementation and QA Workstreams

- [ ] Catalogue truth: counts by five families, SKU/reference uniqueness, product/variation grouping, PDFs, family visibility, and public mappings.
- [ ] Importer safety: stable parent identity, non-destructive defaults, explicit force mode if retained, two-run DB verification, and client-edit preservation.
- [ ] Public catalogue: filters, sorting, URL/history, search/autocomplete, grid/card state, quantity validation, variable-product truth, empty/error states, performance.
- [ ] Product detail: gallery, exact configurations/SKUs, related items, quote actions, mobile/RTL across all five families.
- [ ] Quote journey: add/update/remove/persist, tamper resistance, validation, canonical email and WhatsApp content, truthful success/error states.
- [ ] Public pages: Home, About, Contact, header/footer/navigation, all links, content truth, business-setting ownership.
- [ ] Admin: business controls, family CRUD/delete modes, product CRUD/media/configuration/publish state, permissions/nonces/error feedback.
- [ ] Quality: contrast, keyboard/focus/drawers, touch targets, heading/labels/alt text, reduced motion, responsive/RTL, image loading, runtime/network/404/SEO basics.
- [ ] Release: migration preflight/export/rollback documentation; production actions only with proven local state and available authority.

## Evidence Log

| Area | Evidence | Status |
| --- | --- | --- |
| Initial branch | `feature/wordpress-dynamic-catalogue`, `d38335c` | Observed 2026-09-27 |
| Working tree | Baseline was clean; implementation changes are tracked in this closeout worktree | Observed 2026-09-27 |
| Remote fetch | Fetched with approved escalation; current branch contains the relevant Rosa WordPress ancestors | Verified 2026-09-27 |
| Runtime | `wordpress/dev/compose.yaml`; WordPress 7.1, PHP 8.3.33, MariaDB 11.4, active Rosa child/Core/Elementor/WooCommerce | Observed 2026-09-27 |
| Import preservation RED | `catalogue-import-runtime-safety.test.php` failed: routine import overwrote client product name; full DB restored by trap | Reproduced 2026-09-27 |
| Import preservation GREEN | Same runtime test passed after ownership/parent lookup fix; full DB restored by trap | Verified 2026-09-27 |
| Family delete mode | `php wordpress/scripts/tests/catalogue-admin-ux.test.php` passed after explicit mode resolver | Verified 2026-09-27 |
| Canonical source correction | Rendered-catalogue correction report confirms `04-0901`/`04-0911` are Stevens, not Iris. Duplicate public code `18-0644` is explicitly documented source truth. Product slug uniqueness contract passes. | Verified 2026-09-27 |
| Fresh runtime idempotency | Isolated Docker stack: fresh seed → snapshot → second seed preserved exact family, canonical-parent, variation and attachment identities. Final clean state: 5 families, 111 canonical parents, 278 variations, 121 imported source attachments. | Verified 2026-09-27 |
| Duplicate public reference | Disposable runtime test proves two distinct published parents with public reference `18-0644` are both canonicalized for quotation. | Verified 2026-09-27 |
| Local legacy repair | Post-repair read-only audit: `canonical=111 expected=111 liston_children=4`; explicit repair moved only `18-0401`–`18-0404` after a fresh DB backup. | Verified 2026-09-27 |
| Card browser contract | Replaced stale navigation-only card assertion with: variable cards route to configuration selection; simple products can be quoted directly with quantity. Updated stale Shop-grid selectors in card/drawer regressions. Both browser contracts pass. | Verified 2026-09-27 |
| Product public reference | Core product-detail widgets now resolve `_rosa_primary_code` before Woo SKU, matching Shop, autocomplete and quote canonicalization. PHP lint and source contracts pass; the focused runtime duplicate-reference regression is queued for the final Docker pass. | Implemented 2026-09-27 |
| Mobile menu geometry | Keyboard reproduction measured a 110px header and drawer top at exactly 110px. The accessibility regression now waits for that settled layout before measuring; focused browser rerun pending execution evidence. | Implemented 2026-09-27 |
| Impeccable typography finding | Narrow value-level `overused-font: Open Sans` suppression recorded because the approved MedicaShop-derived Rosa baseline explicitly retains Open Sans body typography. The scoped manual detector returned no findings for edited header/catalogue UI files. | Triaged 2026-09-27 |
| Health-flow landmark | Browser health-flow RED reproduced two Shop main landmarks. After changing the nested Shop main to a labelled section, the rerun completed without an assertion. | Verified 2026-09-27 |
| Mobile quotation UI | Playwright computed Product Detail quote button as `rgb(224, 8, 21)` with white text and `disabled=false`. On `/quote-request/`, the redundant fixed trigger has `hidden=true`, `display=none`, and a zero rect. EN/AR quote confirmation, direct add, and drawer regressions pass. | Verified 2026-09-27 |
| Final image/browser evidence | Eight complete temporary manifests contain 80 captures (60 original matrix cells plus 20 changed Quote/Product recaptures): no visible broken images, horizontal overflow, console errors, page errors, or failed requests. Representative desktop/mobile EN/AR full-page captures were manually reviewed. | Verified 2026-09-27 |
| Family admin runtime | A marked self-cleaning WP-CLI fixture created a family/product pair for each mode. Leave mode deleted the family while leaving its product uncategorized; reassign mode moved its product to the selected target and removed the deleted term. The test passed and cleaned its fixtures. | Verified 2026-09-27 |

## External Blockers

- [ ] None confirmed. Production deployment, DNS, and SMTP delivery must be marked separately if credentials/access are unavailable.

## Final Handoff

- [ ] Final report created in `docs/superpowers/reports/` with verified, implemented-but-not-externally-verified, and blocked findings separated.
- [ ] Final branch/commit, test outcomes, browser matrix, preflight, backup/rollback point, and remaining non-blocking limitations recorded.
