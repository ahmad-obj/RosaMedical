# Rosa Medical WordPress Exact Elementor Parity Master Design

**Date:** 2026-09-05  
**Status:** Approved design; implementation plan not yet written  
**Working branch:** `wordpress/client-content-controls`  
**Branch baseline when this design was approved:** `fad117aeee441bec7cda627f86e40da73a2ad8f5`  
**Pinned finished-template source:** `wordpress/client-preview-medicashop-recreation` at `d0726eed34b4fc14267570853ade8b74df49ae9e`  
**Architecture:** dedicated Rosa Elementor Free widgets that render the finished Rosa/MedicaShop-derived theme markup rather than rebuilding the design with generic Elementor layout controls.

## 1. Objective

Rosa Medical already has the approved public appearance. This project is not a redesign.

The goal is to convert the existing finished Rosa WordPress presentation into a genuinely client-editable WordPress system while preserving the finished appearance and behavior.

The final system must satisfy both sides of this equation:

1. **Public fidelity:** the rendered site remains visually indistinguishable from the approved finished Rosa/MedicaShop-derived implementation at matched content, locale, data and viewport.
2. **Authoring correctness:** ordinary approved content is editable through the correct WordPress surface without requiring code changes.

The implementation change should be invisible to a public reviewer.

## 2. Governing principle

Do not use Elementor to recreate the Rosa website.

Use Elementor as the editing interface for the Rosa website that already exists.

That means Elementor controls content/media for protected Rosa sections, while the child theme continues to render the established DOM/classes/CSS/responsive behavior.

## 3. Source-of-truth hierarchy

Use this order when evidence conflicts:

1. `wordpress/client-preview-medicashop-recreation` at `d0726eed34b4fc14267570853ade8b74df49ae9e`;
2. the finished branch's browser geometry/fidelity contracts;
3. its page templates, target template parts, `client-preview.css`, `client-preview-rtl.css`, `tokens.css`, and `client-preview.js`;
4. `https://rosamedical.org/` as external confirmation of the approved deployed appearance when directly observable;
5. current `wordpress/client-content-controls` for Elementor authoring, migration, settings and newer safety infrastructure only;
6. original MedicaShop public reference only as design-intent evidence where the Rosa finished implementation does not answer a question;
7. `apps/web/**` is not a visual authority for this conversion.

If the pinned finished branch and current production differ materially, do not silently choose one. Record the discrepancy and obtain explicit acceptance for the affected surface before changing the visual target.

## 4. Non-goals

This work does not:

- redesign Rosa Medical;
- create a new visual system;
- convert every site surface into Elementor;
- expose unrestricted Elementor layout controls that can destroy the approved geometry;
- move WooCommerce product truth into Elementor page JSON;
- require Elementor Pro;
- add a new contact-form backend;
- add public ecommerce/checkout behavior;
- fabricate unavailable MedicaShop Single Product fidelity;
- touch Hostinger/production without a separate explicit deployment approval;
- merge or delete `wordpress/client-content-controls` as part of the conversion.

## 5. Ownership model

### 5.1 Elementor Free owns

Elementor owns the body content of the six bilingual marketing pages:

- EN Home;
- AR Home;
- EN About;
- AR About;
- EN Contact;
- AR Contact.

Elementor controls may expose approved text, labels and section media.

Elementor should not expose arbitrary geometry, grid, breakpoint or low-level layout controls for protected Rosa sections unless a later requirement explicitly demands them.

### 5.2 Rosa child theme owns

The child theme remains authoritative for:

- announcement/header/footer shell;
- primary navigation and mobile navigation;
- locale and language-pair behavior;
- protected page shell around `the_content()`;
- target DOM/classes for Rosa sections;
- target CSS and responsive transformations;
- RTL presentation foundations;
- target JavaScript interactions;
- shared pre-footer CTA structure;
- WooCommerce archive/product presentation.

### 5.3 WooCommerce owns

WooCommerce remains the sole truth for:

- products;
- product families/categories;
- product media;
- SKUs/catalogue codes;
- attributes;
- real configurations/variations;
- descriptions;
- publish state;
- future pricing data.

Homepage Featured and Latest product areas query WooCommerce dynamically. Elementor may edit the surrounding section copy, but product records must not be serialized into Elementor documents.

### 5.4 Centralized Rosa settings own

Shared company/site values remain centralized outside individual Elementor documents, including:

- phone;
- email;
- address and Arabic address;
- WhatsApp where used;
- shared site/CTA values;
- other approved reusable business data.

Changing one centralized value must update every consuming surface without manually editing multiple pages.

## 6. Elementor rendering architecture

Use dedicated Rosa widgets.

The rendering path is:

```text
Elementor control values
        -> Rosa custom Elementor widget
        -> normalized content/media arguments
        -> existing Rosa target template part
        -> existing DOM/classes
        -> existing target CSS/RTL/JS
        -> public page
```

Do not rebuild finished sections with generic Elementor containers.

`AbstractRosaSectionWidget` remains the shared integration boundary. It resolves locale, separates media from content, and delegates rendering to target theme partials.

## 7. Homepage target and ownership

The Elementor Home body contains exactly nine dedicated target sections:

1. Hero;
2. Who We Are;
3. Featured Products + Procurement Support;
4. Feature Banner;
5. Latest Products;
6. Promotions;
7. Why Rosa;
8. Proof;
9. Evidence.

Outside the Elementor document:

10. shared pre-footer CTA;
11. footer.

### 7.1 Home section controls

**Hero:** eyebrow, heading, body, button label, hero media.  
**Who:** eyebrow, heading, body, button, approved statistics, section media.  
**Featured:** heading and procurement-support copy; product cards remain dynamic Woo data.  
**Feature Banner:** eyebrow, heading, body, button, media.  
**Latest:** heading only; actual products remain dynamic Woo data.  
**Promotions:** four fixed visual slots with editable approved title/body/media.  
**Why Rosa:** section copy, three cards, media.  
**Proof:** fixed-count approved labels.  
**Evidence:** section copy, three workflow cards, media.

The widget count and structural roles are fixed unless a later explicitly approved design change alters them.

## 8. About target and ownership

The About Elementor body is:

1. page hero;
2. Who We Are split;
3. statistics;
4. information cards;
5. feature banner;
6. Why Rosa;
7. family/proof strip.

Outside Elementor:

8. shared pre-footer CTA;
9. footer.

The current seven About widgets should be retained where their output matches the pinned finished branch. Repairs must be audit-driven rather than a gratuitous rewrite.

## 9. Contact target and ownership

The Contact Elementor body is:

1. page hero;
2. contact information + form presentation;
3. map/location section.

Outside Elementor:

4. shared pre-footer CTA;
5. footer.

Page copy/labels may be Elementor editable. Phone, email and address remain centralized business values. The existing presentation/mailto behavior remains; no submission backend is introduced in this conversion.

## 10. Shop architecture

Shop is not an Elementor-authored marketing page.

WooCommerce owns the data and the Rosa child theme owns the public layout.

The Shop work in this project is a **visual parity and regression** task, not an Elementor conversion task.

The finished Shop appearance must be preserved/restored while maintaining WooCommerce as the dynamic source of product data.

## 11. Product Detail architecture

Product Detail remains a shared dynamic product surface rather than one Elementor page per product.

A product edit in WooCommerce should update the shared public Product Detail renderer automatically.

Where the pinned Rosa implementation provides an approved Product Detail target, preserve it. Do not claim pixel fidelity to a MedicaShop Single Product reference that was never available as authoritative evidence.

## 12. Shared shell architecture

Header, footer, navigation and the shared pre-footer CTA are global code-owned surfaces.

They must be verified once as shared components and must not be independently restyled page-by-page.

A shell change that fixes one page but drifts another is not acceptable.

## 13. Visual parity standard

Passing structural tests is not enough.

For each protected public route, parity review must consider:

- section order/grouping;
- shell proportions;
- content rail width;
- X/Y placement;
- section width/height;
- margins/padding/gaps;
- typography size/weight/line-height;
- colors and surfaces;
- borders, radii and shadows;
- card geometry;
- product-grid density;
- promo geometry;
- media source, crop, aspect ratio and `object-fit` behavior;
- CTA placement;
- footer topology;
- desktop/tablet/mobile transformations;
- Arabic RTL logical spacing/order;
- clipping, overlap and horizontal overflow;
- broken/missing media;
- existing interaction behavior.

Automated geometry and browser assertions protect regressions; screenshot comparison/manual review is still required for final visual acceptance.

## 14. Required route matrix

### Marketing pages

- `/`
- `/ar/`
- `/about/`
- `/ar/about/`
- `/contact/`
- `/ar/contact/`

### Structured catalogue surfaces

- `/shop/`
- Arabic Shop counterpart when present in the current supported routing model;
- one representative product detail route;
- relevant representative product-family/category route when public and supported.

## 15. Required viewport matrix

At minimum use:

- 1440×900;
- 1280×800;
- 1024×768;
- 768×1024;
- 431×932;
- 390×844;
- 360×800.

Retain wider 1920/2560 coverage where existing verification already supports it.

Do not weaken historical geometry thresholds merely to make a regression pass.

## 16. Visual comparison tooling requirement

The current Home-only parity capture is insufficient for completion.

The conversion must gain deterministic reference/local capture coverage for the secondary pages listed above.

For each route/viewport pair, capture reference and local output under matched conditions and collect enough geometry metadata to diagnose differences rather than relying on subjective screenshots alone.

Each difference must be classified to its source before repair, for example:

- widget output;
- PHP partial;
- media mapping;
- CSS;
- Elementor wrapper interference;
- content/default mismatch;
- Woo renderer;
- RTL-specific behavior.

Avoid random CSS accumulation that merely hides the symptom.

## 17. Current execution boundary

At the branch baseline `fad117a...`, the immediate TDD boundary is the Arabic Home Who-section RTL spacing regression.

The next implementation plan must begin by:

1. reproducing the focused RED condition;
2. applying the smallest Home-specific RTL correction;
3. proving focused GREEN;
4. running the broader runtime verifier;
5. capturing Home reference/local parity again;
6. freezing Home unless new direct evidence proves another defect.

Do not skip the RED observation and do not widen this correction into unrelated cleanup.

## 18. Secondary-page parity sequence

After the Home RTL boundary is closed:

1. inspect and preserve any existing local untracked secondary-page investigations before writing competing files;
2. extend deterministic parity capture beyond Home;
3. audit EN/AR About against the pinned reference and production confirmation;
4. repair About by root cause;
5. audit EN/AR Contact;
6. repair Contact by root cause;
7. verify global shell parity across all pages;
8. audit Shop;
9. audit a representative Product Detail and relevant catalogue/category surface where applicable.

The local untracked files previously reported by the operator must be read before they are modified, deleted, staged or replaced. GitHub cannot be treated as proof of their current local contents.

## 19. Elementor authoring acceptance

After visual parity is green, prove that the conversion solves the actual client problem.

At minimum:

- change one EN Home text field in Elementor and verify frontend persistence;
- change one AR Home text field and verify independent RTL output;
- replace one Home media field and verify persistence;
- make a representative About edit and verify persistence;
- make a representative Contact edit and verify persistence;
- verify Featured/Latest product records still come from WooCommerce;
- verify shared Site/CTA and Business values remain dynamic and independent;
- restore disposable test edits after verification unless the user explicitly wants them retained.

## 20. WooCommerce acceptance

Using safe local fixture/test data, verify that a representative product edit is consumed by the expected dynamic public surfaces without copying data into Elementor.

The test should prove the ownership path rather than mutate the authoritative production catalogue.

## 21. Migration and edit-preservation safety

Routine seeds/migrations must never silently overwrite client-edited Elementor documents.

The system must distinguish at least:

- never migrated;
- generated/migrated and untouched;
- migrated but client-edited;
- older schema/topology;
- current schema/topology.

Automatic topology migration is allowed only when the document still matches a safe generated baseline or a surgical mapping can prove edit preservation.

Edited documents that cannot be migrated safely must return an explicit manual-review status.

`elementor-authoring-seed.sh --force` is not a normal operational path.

## 22. RTL acceptance

Arabic verification is structural, not merely `direction: rtl`.

Check:

- logical padding/margins;
- content alignment;
- card/grid order;
- navigation and language actions;
- form direction;
- LTR isolation for phone, email, SKU and technical identifiers;
- icon/arrow direction where applicable;
- mobile behavior;
- no overflow/collision.

## 23. Interaction acceptance

Preserve existing approved interactions without inventing new behavior.

Verify at least:

- mobile menu;
- language switching;
- buttons/links;
- product cards;
- quotation/contact routes;
- Shop search and other supported catalogue interactions;
- reduced-motion-safe behavior where motion exists.

## 24. WordPress editing UX

The final editing model should be understandable to a nontechnical Rosa content manager:

```text
Pages
├── Home -> Edit with Elementor
├── About -> Edit with Elementor
└── Contact -> Edit with Elementor

Rosa Medical
├── Site & CTA
└── Business

Products / WooCommerce
├── Products
├── Categories/Families
├── Attributes/Configurations
└── approved catalogue fields
```

Avoid exposing multiple competing editing paths for the same data where that would confuse the client.

## 25. Permissions boundary

A normal Rosa content manager should be able to perform approved page/content/catalogue/media changes without gaining casual access to theme/plugin code or system-level configuration.

Technical/administrator roles remain responsible for plugin/theme installation, code, migration infrastructure, security and deployment settings.

## 26. Regression and verification layers

Final local acceptance must combine:

### Structural contracts

- correct widget registration;
- exact page topology;
- no duplicated sections;
- correct routes/language pairing;
- correct dynamic ownership boundaries.

### Runtime contracts

- no PHP fatal/errors;
- no browser console/page errors;
- no broken required media;
- no forbidden/proprietary runtime requests;
- no Elementor Pro dependency.

### Geometry/responsive contracts

- established layout measurements;
- responsive transformations;
- RTL geometry;
- zero unintended horizontal overflow.

### Authoring contracts

- Elementor text persistence;
- Elementor media persistence;
- EN/AR independence;
- Woo data remains dynamic;
- centralized settings remain dynamic;
- routine seeds preserve edits.

### Visual acceptance

- deterministic side-by-side reference/local captures;
- human review of full-page output at required representative viewports.

No single category substitutes for the others.

## 27. Cleanup policy

Do not perform broad cleanup while a fidelity defect is under active RED/GREEN investigation.

After runtime and visual acceptance:

- identify genuinely dead superseded Home/runtime helpers and partials;
- confirm zero active references;
- preserve tests that intentionally mention legacy names as negative guards;
- remove only proven-dead runtime artifacts;
- rerun the full verification suite.

## 28. Deployment boundary

Hostinger/production remains outside the conversion implementation until separately approved.

After local completion, the future deployment sequence is:

1. prepare deployable WordPress state and migration runbook;
2. confirm backups and rollback path;
3. deploy to staging;
4. rerun visual, Elementor, Woo, bilingual and responsive acceptance in staging;
5. obtain separate production approval;
6. back up production filesystem/database;
7. deploy;
8. smoke-test key public and authoring routes;
9. retain rollback capability until acceptance.

A generic instruction to continue implementation is not authorization to touch production.

## 29. Completion definition

The conversion is complete only when all of the following are true:

1. Home matches the finished target.
2. About matches the finished target.
3. Contact matches the finished target.
4. Shop retains/restores the approved finished Rosa appearance while remaining Woo-owned.
5. Representative product/catalogue surfaces preserve their approved Rosa presentation and dynamic data ownership.
6. EN and AR both work correctly.
7. Required responsive matrices pass.
8. Home/About/Contact are genuinely editable through Elementor Free.
9. Product/catalogue truth is genuinely editable through WooCommerce/approved Rosa admin surfaces.
10. Shared business/site values remain centralized.
11. Elementor edits persist.
12. Routine migrations/seeds do not erase client edits.
13. WooCommerce records are not duplicated into Elementor.
14. No Elementor Pro dependency is introduced.
15. Superseded `apps/web/**` or `latest-rosa-home*` visual interpretation does not override the finished-template target.
16. Automated structural/runtime/geometry/authoring verification passes.
17. Side-by-side visual review passes.
18. Production remains untouched until a separate deployment approval.

## 30. Implementation-planning requirement

After this design is reviewed, create a separate implementation plan that converts this architecture into small RED→GREEN tasks with explicit:

- files to inspect/modify;
- local-untracked-work protection steps;
- test commands;
- expected RED reason;
- minimum GREEN change;
- broader verification after each task;
- visual capture checkpoints;
- commit boundaries;
- cleanup order;
- final local acceptance gate;
- staging/production stop boundary.

Do not implement directly from this design document without that task-level plan.