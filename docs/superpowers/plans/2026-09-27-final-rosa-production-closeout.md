# Rosa Medical Final Production Closeout

> Live execution checklist. An item is checked only with evidence recorded in its
> corresponding evidence section or linked commit/test/report.

**Objective:** Finalize the existing Rosa Medical WordPress site without changing
its approved MedicaShop-inspired structure or quotation-first business model.

**Authority baseline:** `feature/wordpress-dynamic-catalogue` at initial surveillance;
the authoritative commit and any checkpoint are recorded below after remote/runtime
inspection.

## Release Gates

- [ ] P0 — Establish authoritative branch, clean recovery checkpoint, and local runtime baseline.
- [ ] P0 — Product, configuration, image, quote, navigation, and locale journeys work in a real browser.
- [ ] P0 — Importer preserves client-owned fields and is runtime-idempotent.
- [ ] P0 — Family deletion honors leave-unassigned versus reassign mode.
- [ ] P0 — No known broken public assets, routes, quotation submission failures, console exceptions, or mobile overflow.
- [ ] P1 — Client-requested header, CTA, cards, product-card alignment, featured panel, spacing, and metrics refinements are verified.
- [ ] P1 — Amazon-style search/filter/discovery behavior works across desktop, mobile, URL history, EN, and AR.
- [ ] P1 — Admin workflows for business settings, families, products, media, and PDFs are safe and understandable.
- [ ] P1 — Full relevant automated test suite, browser matrix, image audit, accessibility pass, and deployment preflight have evidence.

## Surveillance and Baseline

- [x] Current branch, recent commits, remote branch inventory, and clean working tree inspected.
- [ ] Remote refs fetched and compared (initial fetch blocked by `.git/FETCH_HEAD` filesystem restriction; retry with approved escalation pending).
- [ ] Read WordPress/local/Hostinger runbooks, prior closeouts, current Amazon spec/plan, and image-audit materials.
- [ ] Map active child theme, Rosa Core, WooCommerce, Elementor, quote system, importer, canonical data, and test entrypoints.
- [ ] Establish Docker/runtime state and database/catalogue counts.
- [ ] Capture baseline screenshots at 1440, 1024, 768, 431, and 390 for key EN/AR routes.
- [ ] Record baseline console/network errors and existing defects.
- [ ] Create a clean recovery checkpoint before risky implementation.

## Discovered Issues

### P0

- [ ] None confirmed yet; investigate importer identity/idempotency, quote canonicalization, deletion semantics, runtime failures, and deployment preflight.

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
| Working tree | `git status --short --branch` showed no local modifications | Observed 2026-09-27 |
| Remote fetch | Initial sandbox attempt failed: `.git/FETCH_HEAD` read-only | Pending approved retry |
| Runtime | Compose path initially assumed incorrectly; locate exact local invocation from runbook | Pending |

## External Blockers

- [ ] None confirmed. Production deployment, DNS, and SMTP delivery must be marked separately if credentials/access are unavailable.

## Final Handoff

- [ ] Final report created in `docs/superpowers/reports/` with verified, implemented-but-not-externally-verified, and blocked findings separated.
- [ ] Final branch/commit, test outcomes, browser matrix, preflight, backup/rollback point, and remaining non-blocking limitations recorded.
