# Rosa WordPress Elementor Authoring Design

Date: 2026-09-02
Status: Approved design, pending implementation plan
Branch: `wordpress/client-content-controls`

## Purpose

Finish the client-autonomy layer originally intended for the Rosa WordPress site: Home, About, Contact, and their Arabic equivalents become genuine Elementor Free documents that the client can edit visually, while structural, commerce, catalogue, responsive, RTL, and business-logic surfaces remain protected.

The phase must preserve the currently verified MedicaShop-faithful public design by default. The existing code-rendered pages remain the visual source of truth for migration and rollback until the Elementor cutover passes verification.

## Non-negotiable outcomes

1. These six pages are real Elementor documents and open with **Edit with Elementor**:
   - English Home
   - English About
   - English Contact
   - Arabic Home
   - Arabic About
   - Arabic Contact
2. Their initial rendered output remains equivalent to the currently verified design across existing responsive, accessibility, RTL, and Homepage geometry gates.
3. The client can edit ordinary page text, media, buttons, and marketing content in Elementor without touching PHP/CSS/theme/plugin files.
4. Home/About/Contact must not have two competing client-facing content editors after cutover.
5. Header, footer, Shop/archive structure, product-detail structure, product data, search/filter logic, quotation/inquiry logic, global responsive foundations, and global RTL foundations remain outside ordinary Elementor page authoring.
6. Elementor Pro is not required.

## Ownership model after cutover

### Elementor-owned

Elementor Free owns the authored content documents for Home, About, Contact, and their Arabic equivalents. The client may edit page-level text, images, buttons, normal section content, and add ordinary marketing content inside these documents.

The migrated core Rosa sections use Rosa-specific Elementor widgets. The client may also add normal Elementor Free content for new marketing material where appropriate; that additional content is intentionally less protected than the verified core sections.

### Rosa shared-settings-owned

The existing Rosa admin remains authoritative for global/shared values that should not be duplicated across six documents:

- `Site & CTA`
- `Business`
- phone
- email
- English address
- Arabic address
- WhatsApp
- intentionally shared/global CTA data
- `Shop` interface copy

When an Elementor section needs one of these shared values, its Rosa widget renders the current shared setting dynamically. Those values are not copied into Elementor controls as independent editable duplicates.

### WooCommerce-owned

WooCommerce remains authoritative for products, SKUs, categories/families, attributes, variations/configurations, product images, product descriptions, and later pricing data.

### Code-owned and protected

Theme/plugin code remains authoritative for header/footer architecture, navigation behavior, responsive foundations, RTL foundations, Shop/archive structure, product-detail structure, shared catalogue product-card behavior, search/filter/discovery logic, quotation/inquiry logic, validation/business rules, route structure, and security/capability boundaries.

## Chosen architecture

Use **Rosa-specific Elementor section widgets backed by the existing verified Rosa markup/styles**, not a wholesale reconstruction from unrestricted generic Elementor containers.

Each significant visual section becomes one reusable Elementor component with controls for the content/media that belongs to that section while retaining stable Rosa DOM classes and theme styling.

Representative widgets include:

- Rosa Home Hero
- Rosa Who We Are
- Rosa Stats
- Rosa Featured Benefits
- Rosa Feature Banner
- Rosa Promotions
- Rosa Why Rosa
- Rosa Proof/Trust
- Rosa Evidence/Workflow
- Rosa About Hero
- Rosa About Cards
- Rosa Contact Hero
- Rosa Contact Details
- Rosa Contact Inquiry Form
- Rosa Contact Map/Location

Widget boundaries should follow current page-section boundaries. Do not create one giant page widget or dozens of tiny single-field widgets.

## Theme-shell boundary

Elementor owns only the **page body content area** for the six target pages.

The Rosa child theme continues to render:

- `<html>` language/direction attributes
- announcement/header/navigation
- opening/closing main page shell
- footer
- shared scripts/styles
- language switch behavior

The Elementor page document is rendered inside that protected shell through normal WordPress page content (`the_content()` / Elementor's document renderer). Do not use Elementor Canvas or another template mode that removes the Rosa header/footer shell.

This boundary ensures the client receives real Elementor page authoring without transferring global navigation/footer/responsive/RTL ownership into Elementor.

## Why this architecture

A generic Elementor rebuild offers maximum freedom but creates unnecessary risk to measured widths, spacing, mobile behavior, semantics, and RTL. Keeping only the structured Rosa admin is safer but does not provide the agreed Elementor authoring autonomy. Rosa-specific section widgets provide real Elementor editing while retaining the verified implementation where design stability matters.

## Rendering and cutover model

### Before cutover

Current PHP templates remain the public renderer and the comparison source.

### During migration

For each target page:

1. Capture the existing rendered page at acceptance viewports.
2. Seed an Elementor document with the same section order/current content.
3. Verify the Elementor document through WordPress/Elementor preview before making it the public renderer.
4. Switch that page to the Elementor body renderer only after its migrated version passes the required gates.

### After cutover

Normal WordPress page content/Elementor documents render the body of Home/About/Contact and Arabic equivalents inside the Rosa theme shell. The legacy PHP renderer may remain temporarily as rollback/reference code, but it must not remain as a second client-facing editing path.

## Elementor integration boundary

The Rosa core plugin should own Elementor integration because it already owns client-editing/admin behavior. The child theme remains responsible for public styling and visual foundations.

The integration must:

- detect Elementor safely and fail gracefully when it is unavailable
- register a Rosa Elementor category
- register Rosa section widgets
- use WordPress/Elementor sanitization and escaping conventions
- avoid Elementor Pro APIs
- keep controls focused on content/media rather than arbitrary design-system overrides
- render consistently in Elementor editor preview and on the frontend

## Widget control policy

Rosa widgets may expose eyebrow/label text, headings, body copy, button labels, approved page-specific links, image/media selection, repeated card content where already present, and optional visibility only where the existing design already supports it.

Rosa widgets must not add unrestricted controls for site typography, global colors, arbitrary CSS, protected structural classes/IDs, global breakpoints, core grid dimensions, protected route destinations, WooCommerce query limits, search/filter behavior, or quotation behavior.

Elementor's standard Advanced controls may remain available unless a specific control demonstrably breaks a critical acceptance contract. If that occurs, implement the smallest practical guard; do not claim Elementor can be made completely unbreakable.

## English/Arabic strategy

English and Arabic remain separate paired WordPress pages using the existing Rosa locale/pair metadata. Each page gets its own Elementor document, avoiding a paid multilingual Elementor dependency.

Requirements:

- Arabic remains `lang="ar" dir="rtl"`.
- English remains `lang="en-US" dir="ltr"`.
- Existing language-switch pairing stays authoritative.
- Arabic migration uses Arabic content/defaults.
- RTL layout behavior remains theme-owned rather than manually recreated in every widget.

## Existing structured page settings

The already implemented Home/About/Contact options become migration inputs and rollback data rather than the final client-facing source after Elementor cutover.

Migration rules:

1. Existing stored Rosa page values seed the corresponding Elementor controls.
2. Otherwise use schema/legacy defaults.
3. Preserve the options during the migration period.
4. Do not create continuous two-way synchronization between Elementor and structured page settings.

After successful cutover, `Rosa Medical → Homepage`, `About`, and `Contact` become direct **Edit with Elementor** shortcuts for their English pages rather than content-setting forms. Arabic editing remains reachable from the paired page/language flow and standard Pages screen. This preserves a convenient Rosa admin entry point while eliminating the duplicate editor.

`Site & CTA`, `Business`, and `Shop` remain normal Rosa admin controls.

## Contact-page behavior

Making Contact an Elementor document must not transfer inquiry processing into arbitrary Elementor behavior. The Contact form section is an Elementor widget whose rendering/submission contract remains code-owned and server-validated. Do not introduce Elementor Pro Forms or an unrelated form plugin.

This phase preserves the current inquiry behavior; the future B2B quotation subsystem remains separate.

## Default visual fidelity

Elementor opening successfully is not sufficient acceptance. Untouched migrated documents must preserve the measured experience across existing gates, including Homepage geometry, responsive behavior, no horizontal overflow, accessibility/interaction behavior, mobile menu behavior, language switching, EN/AR directionality, and product/catalogue regressions outside these pages.

Byte-for-byte HTML identity is not required because Elementor changes document markup. Acceptance is equivalent visual geometry, semantics, interactions, accessibility, and content.

## Client authoring UX

The intended flow is:

1. Pages → target page, or Rosa Medical → Homepage/About/Contact shortcut.
2. Click/open **Edit with Elementor**.
3. Select a clearly named Rosa section.
4. Change text/image/content.
5. Update.
6. View the public page.

Rosa widget names and control groups must use client-readable labels corresponding to what is visible on the page.

## Data safety and rollback

The migration is non-destructive until acceptance completes.

- Existing page IDs, routes, pairing metadata, structured content options, and media mappings remain preserved during migration.
- WooCommerce data is untouched.
- The verified legacy renderer remains available in code until migrated pages pass acceptance.
- Seeding must not overwrite a page that the client has already edited in Elementor unless an explicit force/reset operation is invoked.

## Seeding and idempotency

A deterministic migration/seeding command should create the initial Elementor documents and store a migration marker/version per page.

It must distinguish:

- never migrated → seed
- migrated but untouched → verify/reseed only through explicit migration logic
- migrated and client-edited → preserve

Routine bootstrap/seed operations must never silently replace Elementor content.

## Testing strategy

### Source/unit contracts

Test Elementor-absent safety, widget/category registration, control schemas, structured-settings-to-Elementor mapping, EN/AR pairing preservation, migration marker/idempotency behavior, and no WooCommerce/product mutation.

### Runtime integration

With Elementor Free active, seed all six documents, verify WordPress recognizes them as Elementor documents, fetch every route successfully, confirm `lang`/`dir`, expected Rosa sections/content, and continued shared Site/CTA/Business rendering.

### Editor acceptance

Automate where practical and manually confirm at least once:

- edit an English Home heading in Elementor and update
- verify frontend change and restore it
- edit one Arabic value and verify persistence/RTL
- edit one image/media control
- verify protected shared structure remains intact

### Visual/browser acceptance

Reuse/adapt existing browser gates for accessibility/interaction/RTL, responsive overflow, Homepage measured geometry, reference/demo-origin boundaries, and console errors. Add migrated About/Contact visual contracts where current tests are only source-marker contracts and do not adequately protect geometry.

## Explicitly out of scope

This phase does not implement full catalogue migration, advanced catalogue filtering, SAR pricing, quote basket/B2B quotation workflow, translated WooCommerce catalogue data, final Rosa Content Manager restrictions, Hostinger deployment, Elementor Pro, or unrestricted editing of header/footer/Shop/product templates.

## Acceptance criteria

The phase is complete only when:

1. All six target pages are genuine Elementor Free documents.
2. English and Arabic page edits persist through Elementor.
3. Elementor media edits persist and render correctly.
4. Shared Business and Site/CTA data continue to work dynamically without duplicated Elementor copies.
5. Rosa Medical Homepage/About/Contact entries are Elementor shortcuts rather than competing content editors.
6. Shop and WooCommerce product behavior are unchanged.
7. Locale pairing and RTL behavior are unchanged.
8. Untouched migrated pages pass responsive, accessibility, RTL, console, and Homepage geometry gates.
9. Migration seeding is idempotent and does not overwrite post-migration edits.
10. The legacy renderer remains recoverable until cutover verification, then may be retired in a later cleanup step.

## Roadmap position after completion

After this phase, proceed to:

1. full verified Rosa catalogue migration
2. catalogue search/filter/discovery
3. pricing architecture
4. B2B inquiry/quotation system
5. Rosa Content Manager role hardening
6. full multilingual product/catalogue workflow
7. final production gates
8. Hostinger staging/production deployment
