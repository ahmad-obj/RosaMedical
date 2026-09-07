# Rosa Medical Client-Handoff Finalization Design

**Date:** 2026-09-07  
**Status:** Approved design direction; implementation planning pending review  
**Working branch:** `wordpress/client-content-controls`  
**Baseline at approval:** `526d8cee0862f0f3ff856868ef2becd0a12b0e76`

## 1. Objective

Finalize the WordPress/Elementor Rosa Medical implementation as a polished, client-ready template.

Historical/live pixel comparison is no longer the acceptance target. Existing frozen-live evidence remains useful historical regression evidence, but final acceptance is based on the template itself: functional health, complete bilingual flows, safe media, accessibility, responsive/RTL quality, visual polish, editability, and handoff readiness.

The deliverable must remain maintainable within the existing architecture:

- Elementor Free owns editable Home/About/Contact EN+AR body content and body media.
- WooCommerce owns products, categories/families, SKUs, configurations, descriptions, product media, and publish state.
- Rosa settings own shared business/contact and CTA values.
- The child theme/plugin own the protected shell, responsive behavior, RTL, shared interactions, and Woo presentation.
- No production/Hostinger mutation is authorized by this finalization pass.

## 2. Current verified starting state

At the approved starting point:

- Home geometry contract passes.
- About frozen-live geometry contract passes.
- About/Contact Elementor topology and RTL contracts pass.
- Contact EN/AR fidelity contract passes.
- Shop EN/AR fidelity contract passes.
- Stevens Scissors fixture/product verification passes.
- Product Detail fidelity/layout/visual contracts pass.
- The current known failing gate is the Shop search button touch target being below 44px in the accessibility suite.
- Repository grep shows no direct references to ThemeForest/MoxCreative or common stock-photo providers in the active theme/plugin code, but this is not sufficient proof of image provenance; rendered/local media still requires an explicit inventory.

## 3. Acceptance model

Final acceptance has four ordered gates:

1. **Health & flow** — every primary route and user flow works without dead ends, runtime errors, broken media, or inaccessible core controls.
2. **Media sanitization** — temporary/reference/unknown-provenance imagery is removed or replaced by neutral placeholders while legitimate Rosa/catalogue media remains intact.
3. **Standalone UI/UX polish** — pages are judged independently, without comparison overlays, and refined across desktop/tablet/mobile and RTL.
4. **Client handoff** — full regression gate, final screenshots, editing ownership documentation, and a concise delivery report.

A later gate must not hide failures in an earlier gate.

## 4. Phase 1 — Full health & flow audit

### 4.1 Route matrix

Audit these public surfaces:

**English**
- `/`
- `/about/`
- `/contact/`
- `/shop/`
- representative Product Detail (`/product/rosa-foundation-stevens-scissors-regular/`)

**Arabic**
- `/ar/`
- `/ar/about/`
- `/ar/contact/`
- `/ar/shop/`
- the supported Arabic Product Detail equivalent

The Arabic Product Detail route must be discovered and verified from the actual bilingual routing model. If no supported Arabic Product Detail route currently exists, that is a handoff blocker to resolve; it must not be silently waived or replaced with an invented URL.

### 4.2 Viewport matrix

Use standalone runtime checks at:

- `1440x900`
- `1024x768`
- `768x1024`
- `431x932`
- `390x844`

The existing wider 1920 checks may remain supplemental, but the five widths above are the handoff matrix.

### 4.3 Per-route health checks

At every route/viewport combination verify:

- successful navigation/render;
- exactly one coherent main content region and one shared shell;
- correct `lang` and `dir`;
- no horizontal overflow;
- no uncaught page errors;
- no console errors caused by Rosa code;
- no broken visible images;
- no forbidden demo/reference-origin requests;
- no clipped core controls or impossible interaction targets;
- core CTA/action controls are keyboard reachable and visibly focusable.

### 4.4 Link and flow contract

Add a focused client-handoff browser contract rather than overloading the accessibility suite.

The contract must exercise these flows:

- Home → Shop
- Home → Contact / quotation CTA
- About → Contact / quotation CTA
- Shop → product/family destination
- Product Detail → Contact/quotation
- Header navigation between Home/About/Shop/Contact
- EN → AR and AR → EN language switching
- mobile drawer navigation and close behavior
- footer navigation and business links

For all same-origin internal anchors discovered on the primary pages:

- normalize fragments/query strings appropriately;
- confirm the destination resolves successfully;
- reject dead internal paths, accidental demo paths, and `#` placeholders used as final navigation;
- validate `mailto:`, `tel:`, WhatsApp and map links syntactically without performing destructive/external actions.

Destination validity does not need to be redundantly crawled at all five viewports. Run the complete link crawl on representative desktop and mobile, while route/render health still runs across the full viewport matrix.

### 4.5 Phase 1 blocker policy

Any of the following blocks visual polish:

- broken primary route;
- missing Arabic Product Detail path where bilingual Product Detail is part of the deliverable;
- dead primary navigation/CTA;
- page/console runtime error;
- broken visible media;
- horizontal overflow;
- inaccessible core interaction;
- failing ownership/editability regression.

The known Shop search-button 44px failure is the first production defect to repair using a focused RED → minimal fix → GREEN cycle.

## 5. Phase 2 — Replace unsafe/temporary imagery with neutral placeholders

### 5.1 Provenance audit

Do not infer safety from URL grep alone. Inventory rendered media and its source across:

- Elementor widget media fields;
- `rosa_preview_media` / Rosa media settings;
- WooCommerce product/category media;
- seeded WordPress attachments;
- theme/plugin hardcoded local images/background URLs;
- current Media Library attachment metadata where available.

Classify every delivered visual asset as:

- **KEEP** — client-supplied Rosa asset, catalogue-confirmed product media, or otherwise clearly approved/provenanced;
- **REMOVE/PLACEHOLDER** — stock/reference/demo/temporary image;
- **REVIEW** — provenance cannot be established from repository/runtime evidence.

Unknown provenance is not treated as licensed by assumption.

### 5.2 Placeholder system

Reuse the existing `media-slot.php` abstraction rather than introducing a parallel image system.

When final media is absent, render a neutral, elegant placeholder with:

- stable aspect ratio/minimum geometry so layout does not collapse;
- restrained neutral medical-template styling;
- no fake photography or misleading product imagery;
- no third-party branding;
- no external network dependency;
- meaningful accessible labeling where the image itself communicates a content slot;
- empty/decorative alt behavior where appropriate.

Elementor-editable media slots must remain replaceable by the client without code changes.

Woo product media remains Woo-owned. Catalogue-confirmed instrument imagery must not be stripped simply because it is an image.

## 6. Phase 3 — Standalone visual & UI/UX polish

### 6.1 Review method

Generate standalone full-page screenshots only. No comparison overlays or pixel-diff acceptance.

Review Home, About, Contact, Shop, and Product Detail in EN/AR at the handoff viewport matrix.

### 6.2 Fix order

Prioritize in this order:

1. broken/ugly composition or obvious visual blunder;
2. uncomfortable whitespace, oversized empty bands, or abrupt section transitions;
3. responsive stacking and RTL asymmetry;
4. inconsistent cards, controls, media blocks, or section widths;
5. typography hierarchy, line length, and heading/body spacing;
6. card padding, section rhythm, dividers, radius/shadow restraint, and small alignment defects.

### 6.3 Design principles

The final template should feel:

- clean and medically professional;
- restrained rather than decorative;
- consistent across pages;
- legible and calm;
- strong in hierarchy and procurement-oriented actions;
- credible even when placeholders are shown.

Avoid:

- broad redesigns;
- new dependency stacks;
- complex animation systems;
- excessive CSS specificity or page-by-page shell duplication;
- layout changes made solely to satisfy old screenshot metrics.

### 6.4 Scope discipline

Use this rule:

- defect repeated across pages → shared shell/style fix;
- defect isolated to one page → page-scoped fix;
- Elementor content/structure problem → Elementor widget/partial or safe seed logic;
- Woo product/catalogue problem → Woo renderer/data path;
- media provenance problem → media-slot/attachment source, not layout hacks.

Prefer narrow, test-backed changes. Do not reopen accepted page structures without a visible standalone defect.

## 7. Phase 4 — Client handoff gate

Before delivery, run:

- complete health-flow/link contract;
- accessibility/interactions suite;
- Home/About/Contact/Shop structural/fidelity regressions as protective tests;
- Product Detail fixture/fidelity/layout/visual regressions;
- Elementor edit-persistence and zero-drift tests;
- Woo/settings ownership mutation tests;
- Rosa content-manager permission boundary;
- PHP syntax, shell syntax, and JavaScript syntax checks;
- final standalone screenshot matrix;
- final browser console/network sanity sweep.

Historical frozen-live strict comparison is not required for client-handoff acceptance unless explicitly requested again.

## 8. Handoff documentation

Produce one concise final handoff report/runbook that tells the client/team exactly where content is edited:

- **Pages → Elementor:** Home/About/Contact EN+AR body content and page media.
- **WooCommerce:** products, categories, SKUs, configurations, descriptions, product media.
- **Rosa Medical settings:** shared phone, email, EN/AR address, WhatsApp, site/CTA values.
- **Theme/plugin:** protected global shell, responsive/RTL behavior, Woo presentation, interactions.

The report must also record:

- final branch/commit;
- verification commands and outcomes;
- any intentional neutral placeholders remaining;
- any known non-blocking limitations;
- confirmation that production was not mutated during finalization.

## 9. Testing strategy

Use TDD for every production correction discovered during finalization:

1. identify one concrete defect;
2. add or use the smallest focused failing contract;
3. observe RED;
4. make the minimal production fix;
5. observe GREEN;
6. run neighboring regressions;
7. only then proceed to the next defect.

Do not weaken historical tests merely because historical pixel matching is no longer the final acceptance standard. Tests that protect valid topology, accessibility, ownership, editability, and responsive behavior remain useful regression guards.

## 10. Completion definition

The template is ready for client delivery only when:

- every primary EN/AR route is healthy at the handoff viewport matrix;
- the supported bilingual Product Detail flow is explicit and working;
- all primary navigation/CTA/internal links resolve without dead ends;
- no Rosa-caused runtime/console errors remain;
- no broken visible images remain;
- the accessibility suite is GREEN, including >=44px core touch targets;
- temporary/reference/unknown-provenance imagery has been removed or explicitly dispositioned;
- legitimate Rosa/catalogue media remains correctly owned and editable;
- standalone screenshots show no major visual blunders, awkward empty bands, overflow, or RTL breakage;
- fine spacing/card/typography polish is coherent across the site;
- Elementor/Woo/settings ownership and content-manager boundaries remain GREEN;
- final handoff documentation is committed;
- no production/Hostinger mutation has occurred without separate approval.
