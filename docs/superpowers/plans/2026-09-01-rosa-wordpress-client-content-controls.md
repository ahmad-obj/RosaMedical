# Rosa WordPress Client Content Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` where available or `superpowers:executing-plans` inline. Implement with TDD and verification checkpoints.

**Goal:** Add a polished bilingual Rosa Medical content-management layer to WordPress so Home, About, Contact, Shop and shared site copy/media can be edited without converting the site to Elementor and without changing the current public appearance by default.

**Architecture:** `rosa-medical-core` owns settings, sanitization, media selection and admin UI. `rosa-medical-child` remains the authoritative renderer. Existing DOM topology, classes, routes, WooCommerce behavior and responsive geometry stay code-owned; settings override only visible copy/media.

**Tech Stack:** WordPress 7.1, PHP 8.3+, WooCommerce, WordPress Settings API, Media Library, Bash/PHP contracts, Playwright fidelity tests.

## Global constraints

- Work from `wordpress/client-preview-medicashop-recreation` baseline `d0726eed34b4fc14267570853ade8b74df49ae9e` on isolated branch `wordpress/client-content-controls`.
- Zero visual drift is the primary acceptance criterion.
- Do not convert Home/About/Contact/Shop to Elementor documents.
- Do not change public section order, CSS classes, data attributes, grid counts, product limits, breakpoints or route targets.
- Existing Business Settings storage stays `rosa_business_settings`.
- Existing media storage stays `rosa_preview_media`.
- WooCommerce remains the product-data source of truth.
- English and Arabic settings are stored independently.
- Fixed repeated structures remain fixed: Home stats 3, featured benefits 3, promo tiles 4, Why cards 3, proof labels 6, workflow cards 3, About cards 3, primary nav items 5.
- No arbitrary HTML/WYSIWYG content in this phase.
- Missing settings always fall back to the exact current public strings.
- Seed scripts must not overwrite editor-created content options.

## Storage

- `rosa_site_content`
- `rosa_home_content`
- `rosa_about_content`
- `rosa_contact_content`
- `rosa_shop_content`
- existing `rosa_business_settings`
- existing `rosa_preview_media`

## Admin navigation

```text
Rosa Medical
├── Homepage
├── About
├── Contact
├── Shop
├── Site & CTA
└── Business
```

## Implementation tasks

1. Add `ContentSchema` with exact EN/AR coded defaults and semantic field groups.
2. Add `ContentSettings` with strict section/key whitelisting and fallback behavior.
3. Add top-level Rosa Medical admin pages with English/Arabic tabs and standard Settings API forms.
4. Reuse existing Business settings under the Rosa admin menu without changing storage.
5. Add native Media Library fields backed by the existing `rosa_preview_media` option and preserve legacy keys on save.
6. Add `rosa_preview_content()` theme helper and make nav/shared labels settings-backed while retaining exact fallbacks.
7. Convert Home hero, Who, Featured support, feature banner, Latest heading, promos, Why, proof and workflow copy section-by-section without markup changes.
8. Convert About visible copy without changing its section topology.
9. Convert Contact labels/copy while keeping phone/email/address centralized in Business settings.
10. Convert English/Arabic Shop interface copy without changing WooCommerce queries or product data.
11. Add zero-drift regression proving saved defaults produce the same public output as absent options.
12. Add mutation regression proving EN/AR edits render independently and survive reseeding.
13. Add new contracts to the complete `client-preview-runtime-verify.sh` suite.
14. Document ownership/editing boundaries and deployment rules.
15. Run syntax, source, runtime, RTL, accessibility, fidelity and migration checks before integration.

## Acceptance

- Nontechnical editors can update approved copy/media through WP Admin.
- Default public output remains the current approved design.
- Existing responsive geometry tests remain unchanged and green.
- Arabic retains `lang="ar" dir="rtl"`.
- WooCommerce remains authoritative for products.
- Business data remains centralized.
- Media saves preserve legacy entries.
- Seed does not reset client edits.
- No Elementor rewrite occurs.
