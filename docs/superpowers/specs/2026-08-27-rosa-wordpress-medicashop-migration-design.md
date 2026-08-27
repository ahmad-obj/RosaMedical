# Rosa Medical — MedicaShop WordPress Migration Architecture

Date: 2026-08-27
Branch: `transfer/rose-medical-final-main-ready-2026-08-17`
Status: architecture approved in chat; written specification awaiting explicit review before implementation planning

## 1. Purpose

Rosa Medical is pivoting from a fully custom Next.js public website to a WordPress-based website using the selected MedicaShop Elementor Template Kit as a visual foundation.

This is not a downgrade to a stock template. The objective is to preserve the strongest functional and design decisions already validated in the custom Rosa implementation while moving content ownership and routine administration into WordPress so the client can safely maintain the website after handoff.

The finished system must satisfy two goals simultaneously:

1. look and behave like a purpose-built Rosa Medical surgical-instrument website rather than a generic pharmacy demo;
2. allow non-developer client staff to edit appropriate content, products, prices, imagery, catalogues, and translations without needing code changes.

The current custom Rosa site remains a product/design reference and data source during the migration. It is not discarded conceptually.

## 2. Locked foundation

The target stack is:

- WordPress;
- Hello Elementor parent theme;
- a minimal Rosa child theme;
- MedicaShop Elementor Template Kit;
- Elementor Pro;
- WooCommerce;
- WPML;
- WooCommerce Multilingual / WPML WooCommerce integration;
- ElementsKit Lite only where imported MedicaShop sections still require it;
- Skyboot Custom Icons only where imported sections still require it;
- a custom `rosa-medical-core` plugin containing Rosa-specific business behavior.

Do not place core Rosa business logic directly into Elementor pages, the MedicaShop kit, or the child theme.

## 3. Architectural principle

The system is split into three layers.

### 3.1 Presentation layer

Owned by Elementor + MedicaShop + the Rosa child theme.

Responsibilities:

- page composition;
- typography;
- Rosa colors;
- spacing;
- imagery;
- header/footer;
- responsive visual behavior;
- reusable Elementor page sections;
- presentation-level WooCommerce template overrides.

### 3.2 Commerce/catalogue data layer

Owned by WooCommerce.

Responsibilities:

- products;
- product families/categories;
- attributes;
- exact variations/configurations;
- SKUs;
- product/variation images;
- published/draft state;
- catalogue-facing structured product data.

### 3.3 Rosa business-logic layer

Owned by the custom `rosa-medical-core` plugin.

Responsibilities:

- contextual product filters;
- product discovery search;
- progressive result reveal;
- `See more` and `See all` behavior;
- Rosa base/variation price inheritance semantics;
- `Price on request` state;
- inquiry basket;
- structured quotation submission;
- quotation administration;
- catalogue PDF relationships;
- custom Elementor widgets/dynamic integrations;
- client-safe admin enhancements;
- migrations/import helpers for the existing Rosa catalogue.

This separation is mandatory. Changing or replacing the visual template later must not destroy Rosa product/filter/quotation functionality.

## 4. Gate 0 — MedicaShop compatibility spike

MedicaShop is an Elementor Template Kit originally released in the older Elementor Sections/Columns era and has not had a recent kit update. Its visual files therefore require a real compatibility check with the current WordPress/Elementor runtime.

Before production migration begins, create a disposable/staging installation with:

- current stable WordPress;
- current stable Hello Elementor;
- current stable Elementor;
- current stable Elementor Pro;
- current stable WooCommerce;
- current required ElementsKit Lite;
- current required Skyboot Custom Icons;
- the purchased MedicaShop ZIP.

Import the complete kit.

The Gate 0 spike must verify:

- homepage imports;
- About imports;
- Contact imports;
- Product Archive imports;
- Single Product imports;
- header/footer import;
- global styling imports;
- no fatal PHP errors;
- no broken Elementor widgets;
- no missing required addon widgets;
- no JavaScript console-breaking errors;
- desktop layout integrity;
- tablet layout integrity;
- mobile layout integrity;
- one representative Arabic RTL page;
- WooCommerce archive rendering;
- WooCommerce single-product rendering;
- current Elementor editor can safely reopen and save the imported templates.

### 4.1 Gate decision

If import is clean, proceed.

If import has limited legacy container/spacing defects, repair or convert only the affected templates and proceed after retesting.

If the kit is broadly incompatible with the current Elementor ecosystem, stop. Do not build the entire Rosa migration on a broken legacy kit. Select another approved template foundation while preserving this architecture.

This compatibility spike is the only major unresolved feasibility gate.

## 5. Dynamic/client-editable website requirement

The client explicitly wants a dynamic website they can update themselves.

This requirement is locked and must influence both implementation and permissions.

`Dynamic` for Rosa means that routine business content lives in WordPress/WooCommerce data and is rendered through shared templates. The client must not need a developer to make normal operational changes.

### 5.1 Client-editable content

Authorized client staff must be able to update, without code:

- homepage text;
- homepage imagery;
- company/About content;
- Contact information;
- phone/email/address;
- selected call-to-action copy;
- approved reusable page content blocks;
- product names;
- product descriptions;
- product images;
- product family/category assignment;
- Size values;
- Direction values;
- Variant/type values;
- exact product variations;
- SKU/code values;
- base SAR price;
- variation price override;
- publish/draft status;
- catalogue PDFs;
- English content;
- Arabic translations;
- selected SEO/meta content when the SEO layer is added.

### 5.2 Centrally managed dynamic templates

The client must NOT need to redesign each product page manually.

Single Product presentation is controlled by one shared Elementor Theme Builder template plus Rosa widgets/dynamic data.

When an authorized user changes a WooCommerce product's:

- title;
- image;
- description;
- SKU;
- attributes;
- variations;
- price;

those changes automatically flow into the public product page and catalogue components.

The same principle applies to shared archive/product cards and global site parts.

### 5.3 Safe editability model

Do not give everyday client users unrestricted Administrator access.

Create at least two operational roles:

#### Rosa Content Manager

May:

- edit approved pages/content;
- edit existing Elementor content where explicitly allowed;
- upload/manage media;
- edit products/product data as required;
- edit catalogue PDFs;
- manage translations within approved content scope.

Must not:

- install/delete plugins;
- change themes;
- edit PHP;
- change global system settings;
- alter checkout/inquiry code;
- change WordPress users beyond authorized scope;
- edit security/deployment configuration.

For Elementor-capable content staff, use Elementor's role controls to prefer `Edit Contents Only` where practical so users can change existing content without rearranging or adding arbitrary layout elements.

#### Rosa Administrator

Reserved for trusted technical/owner users who need broader WordPress configuration access.

### 5.4 What remains developer-controlled

These are deliberately protected from casual editing:

- product filtering algorithm;
- contextual count logic;
- URL filter semantics;
- pricing inheritance logic;
- inquiry basket behavior;
- quotation validation;
- database schema/custom plugin code;
- child-theme code;
- responsive CSS system;
- deployment/backup/security configuration.

The client gets control over business content and catalogue data, not unrestricted access to the application's internals.

## 6. Public information architecture

Primary public navigation remains:

1. Home
2. About Us / Company
3. Products
4. Inquiry / Request Quotation
5. Contact Us

English canonical routes should resolve to equivalent WordPress permalinks.

Arabic uses the multilingual routing configured through WPML.

Do not carry unnecessary MedicaShop demo pages into production unless a later business requirement explicitly needs them.

By default, remove or do not publish:

- pharmacy-specific pages;
- Team;
- Blog if unused;
- Login;
- My Account;
- consumer Checkout;
- Purchase Summary;
- retail sale/discount pages.

## 7. MedicaShop page mapping

### 7.1 Homepage

Reuse MedicaShop's overall section rhythm where useful, but transform the content model.

Map approximately:

- pharmacy hero -> Rosa surgical-instrument/company hero;
- company introduction -> Rosa introduction;
- Editor's Choice -> Instrument Families / Featured Instruments;
- shipping benefit -> Global Supply / Export capability;
- warranty benefit -> Quality Assurance;
- payment benefit -> Precision / Materials / Manufacturing Quality;
- Latest Products -> Featured / Latest Instruments;
- consumer promo cards -> Specialties / Catalogue PDFs;
- Why Choose Us -> Rosa manufacturing/value proposition;
- testimonials -> remove unless the client provides genuine testimonials;
- newsletter -> Inquiry / Contact CTA;
- pharmacy footer -> Rosa corporate footer.

Do not preserve retail-discount language simply because it exists in the kit.

### 7.2 About / Company

Transform the demo's company/store sections into:

- company introduction;
- experience/manufacturing statistics when client-confirmed;
- manufacturing capability;
- quality/materials/precision;
- served markets/global supply;
- certifications/standards only if client-provided and verifiable;
- final contact/inquiry CTA.

Remove pharmacy opening-hours and consumer-store concepts.

### 7.3 Products

MedicaShop's product archive is only a visual starting point.

The production Products page is a Rosa discovery workspace powered by WooCommerce catalogue data and the custom Rosa filter component.

### 7.4 Product Detail

MedicaShop Single Product provides the visual shell.

Replace retail purchase behavior with:

- product identity;
- description/specification;
- exact real configuration selector;
- SKU;
- Size;
- Direction;
- Variant/type;
- effective SAR price or `Price on request`;
- quantity;
- `Add to inquiry`;
- procurement context;
- final inquiry CTA.

Do not restore unrelated product recommendation rails unless explicitly requested later.

### 7.5 Contact

Keep the useful contact composition but replace demo data with Rosa-approved:

- address;
- telephone;
- WhatsApp if required;
- email;
- contact/inquiry form;
- map only if client wants it and exact public business location is confirmed.

## 8. Rosa visual conversion

MedicaShop's current visual identity is not authoritative.

Replace it with Rosa's final approved identity.

At minimum define global Elementor design tokens for:

- primary Rosa red;
- black/near-black;
- white;
- neutral surface colors;
- body text;
- muted text;
- borders;
- success/error/focus states;
- typography scale;
- content rails;
- spacing scale;
- button geometry;
- radius policy;
- motion duration/easing.

Use Elementor global colors/fonts where appropriate so client-safe global edits remain possible.

Do not make per-widget one-off colors the default styling strategy.

## 9. WooCommerce catalogue model

### 9.1 Product families

Use hierarchical WooCommerce Product Categories for:

- Knives;
- Scissors;
- Cutters;
- Chisels;
- Punches.

Other verified families may be added when actual catalogue data requires them.

### 9.2 Global attributes

Use reusable WooCommerce global attributes for at least:

- `pa_size`;
- `pa_direction`;
- `pa_variant`;
- `pa_code_group` when code group is editorially useful as a managed term.

Global attributes are preferred because they can be reused, centrally renamed, translated, filtered and attached to variable products.

### 9.3 Exact configurations

Use WooCommerce variable products for products with multiple real configurations.

Only create variations that actually exist in Rosa catalogue data.

Do not generate arbitrary Cartesian combinations merely because WooCommerce can generate all possible variations.

Each real variation can contain:

- WooCommerce variation ID;
- exact SKU/catalogue code;
- Size;
- Direction when variation-defining;
- Variant/type when variation-defining;
- image if configuration-specific;
- Rosa price override metadata.

### 9.4 Code group

Prefer deriving code group deterministically from the real SKU/code when that relationship is stable.

If client staff need to manually curate code groups independently of codes, persist it as a global taxonomy/attribute instead.

The implementation plan must choose one representation after auditing imported catalogue code patterns.

## 10. Product discovery and filters

The custom Next.js discovery behavior remains the UX reference.

Desktop target:

```text
FILTER PRODUCTS

Product family
○ All products
○ Knives
○ Scissors
○ Cutters
○ Chisels
○ Punches

Size                 2 selected  ▾
Direction             Straight  ▾
Variant                         ▾
Code group                      ▾
```

Required semantics:

- Family single-select;
- Size multi-select;
- Direction multi-select;
- Variant multi-select;
- Code Group multi-select;
- OR within one facet;
- AND across different facets;
- free-text query ANDs with active filters;
- contextual option counts;
- selected zero-count options remain removable;
- one advanced accordion open at a time;
- selected collapsed-state summary;
- internal facet search for genuinely large facets;
- bounded option height;
- Clear Filters;
- accessible native semantic inputs beneath custom visual controls;
- ROSA-red selected state;
- keyboard/focus states;
- RTL-safe layout;
- mobile outer filter disclosure/drawer;
- refresh/share-safe URL state.

The implementation may use WooCommerce Store API / collection-data endpoints or a Rosa REST endpoint, but the public UX above is authoritative.

## 11. Product search

Search must intentionally support more than title text.

Index/match at least:

- localized product name;
- English name;
- family;
- parent product code where applicable;
- variation SKU;
- Size;
- Direction;
- Variant/type;
- Code Group.

Search must remain case/whitespace tolerant.

If core WooCommerce search cannot provide the exact behavior cleanly, implement a dedicated read-only Rosa product-discovery REST endpoint rather than installing a large search suite by default.

## 12. Progressive catalogue reveal

Retain the approved result-disclosure behavior.

### 12.1 Initial results

Grid disclosure is based on complete visual rows rather than a single hard-coded item count.

The result set may be fully available internally while only the first polished batch is rendered/shown initially.

### 12.2 See More

Primary action:

`See more products`

It reveals the next complete rows without replacing existing cards or producing a partial artificial final row.

### 12.3 See All

Directly below See More, provide a visually quieter secondary action:

`See all N products`

It immediately reveals every remaining matching product.

Both controls disappear when all matching products are visible.

Search/filter changes reset result disclosure to the normal initial state.

## 13. Pricing architecture

Currency is SAR.

WooCommerce's normal variation pricing is useful but does not exactly represent Rosa's previously approved inheritance semantics.

Persist Rosa-specific pricing metadata:

- parent/base price: `_rosa_base_price`;
- variation override: `_rosa_price_override`.

Effective price:

```text
variation override ?? product base price ?? null
```

Rules:

- blank base + blank override -> `Price on request`;
- base price only -> inherited by configurations without override;
- variation override -> replaces base only for that configuration;
- zero is valid numeric price;
- negative values invalid;
- maximum two decimal places at input boundary;
- server-side validation mandatory;
- quotation total arithmetic must not depend on client-submitted display strings.

The admin should make the inheritance state obvious to client staff.

## 14. Inquiry / quotation architecture

Rosa remains quotation-led rather than online-payment-led.

Do not use the normal consumer Checkout as the primary public workflow.

Flow:

```text
Product
  -> select real configuration
  -> quantity
  -> Add to inquiry
  -> Inquiry basket
  -> contact/company details
  -> Request quotation
  -> server revalidates product/configuration/current price
  -> structured quotation record
  -> admin review
```

Each submitted line stores or references:

- product ID;
- variation ID;
- product name snapshot;
- SKU snapshot;
- configuration labels;
- quantity;
- authoritative unit-price snapshot or null;
- currency;
- line subtotal snapshot when numeric.

Quotation records also contain customer/company/contact/message fields.

Do not create fake WooCommerce Orders merely to store quotation requests unless later implementation research proves a compelling operational reason.

## 15. Catalogue PDFs

Use WordPress Media Library for catalogue PDFs.

Each product family can hold a relationship to its authoritative PDF through Rosa-managed taxonomy metadata.

Client staff must be able to replace a PDF from WordPress Admin without changing Elementor links one by one.

Public components use that relationship dynamically for:

- homepage family/catalogue cards;
- Products catalogue section;
- optional Product Detail catalogue reference.

Opening/downloading behavior must be consistent and accessible.

## 16. Elementor integration

Do not build the advanced Rosa product experience out of dozens of unrelated shortcodes/widgets.

`rosa-medical-core` should expose a small intentional Elementor integration surface, likely including:

- Rosa Product Discovery widget;
- Rosa Product Configuration/Pricing widget;
- Rosa Inquiry Summary/CTA widget where needed;
- Rosa Catalogue PDF/Family widget where dynamic data is required.

Use Elementor Dynamic Tags for ordinary product/page fields whenever existing Elementor/WooCommerce tags are sufficient.

Custom widgets are reserved for behavior Elementor cannot represent cleanly.

## 17. English / Arabic / RTL

Use one WordPress installation with WPML rather than maintaining separate English and Arabic sites.

Translate:

- pages;
- navigation;
- headers/footers;
- product names/descriptions;
- product categories;
- attribute labels/terms;
- custom Rosa UI strings;
- quotation/inquiry labels;
- relevant SEO metadata.

Technical identifiers such as SKU should remain stable across languages.

RTL acceptance includes:

- header/nav;
- breadcrumbs;
- hero;
- cards;
- filters;
- accordion chevrons;
- product-detail columns;
- attribute/configuration controls;
- inquiry basket;
- forms;
- tables;
- buttons/icons;
- mobile navigation;
- spacing that may otherwise be hard-coded left/right.

Avoid relying on experimental Elementor functionality for multilingual-critical templates until Arabic acceptance testing proves compatibility.

## 18. Client translation workflow

The client should not be expected to edit Arabic pages as completely independent duplicated designs.

Prefer WPML's translation workflow for normal translated content so page structure remains tied to the source design while translated strings/content can be maintained separately.

For Product data, translation should use WooCommerce/WPML multilingual product structures rather than manually duplicating unrelated product records.

## 19. Admin information architecture

The client's everyday dashboard should emphasize only operational tasks.

Recommended top-level working areas:

- Pages;
- Media;
- Products;
- Product Categories;
- Product Attributes;
- Catalogue PDFs / Rosa Catalogues;
- Quote Requests;
- Translations;
- Contact submissions if separate;
- optional dashboard summary.

Do not expose a large bespoke admin application if standard WordPress/WooCommerce administration already solves the task well.

Custom admin UI exists only where Rosa-specific concepts require it.

## 20. Data migration from current Rosa work

The existing catalogue extraction work remains valuable.

Create deterministic import/migration tooling rather than manually retyping hundreds of configurations.

Migration should map current authoritative data into:

- WooCommerce products;
- categories;
- global attributes;
- variation records;
- SKUs;
- images/media references;
- Rosa pricing metadata when populated;
- catalogue PDF relationships.

Imports must be idempotent or have an explicit safe rerun strategy during staging.

Never silently generate missing product metadata.

## 21. Performance policy

WordPress does not justify uncontrolled plugin accumulation.

Policy:

- install only plugins that solve a concrete requirement;
- prefer the custom Rosa plugin for tightly scoped Rosa logic;
- progressively remove imported MedicaShop dependencies when no live widget still uses them;
- optimize/correct product imagery;
- lazy-load where appropriate;
- avoid autoplay-heavy or unnecessary motion;
- minimize third-party tracking/scripts;
- cache public pages/endpoints appropriately without breaking dynamic inquiry/filter state;
- verify database queries on Products and Product Detail before launch.

## 22. Security and ownership

Production must follow standard WordPress security hygiene:

- unique admin accounts;
- least-privilege everyday client roles;
- strong authentication;
- no shared developer passwords in source control;
- plugin/theme updates performed through staging/backup discipline;
- WordPress salts/secrets outside git;
- server/API credentials outside public code;
- form/REST nonce and capability validation where applicable;
- server-side sanitization/validation;
- protected quotation administration;
- backups before system/plugin upgrades.

Do not give a content editor permissions merely because it is convenient during development.

## 23. Environments and deployment

Maintain at least:

1. local/development;
2. staging/client-review;
3. production.

The MedicaShop compatibility spike occurs on disposable or staging infrastructure, not by experimenting directly on the live client site.

Custom Rosa child-theme/plugin source should be version-controlled in Git.

Database/media deployment strategy must be documented separately from PHP/theme/plugin deployment because WordPress content does not live entirely in Git.

## 24. Backups and rollback

Before major imports, plugin upgrades, Elementor conversions, WPML migrations, or production releases:

- capture database backup;
- capture uploaded-media state where needed;
- retain previous versioned plugin/theme source;
- know the rollback procedure before changing production.

## 25. Testing strategy

### 25.1 Gate 0 compatibility

Test imported MedicaShop under current runtime before migration.

### 25.2 Automated custom-code testing

For `rosa-medical-core`, cover pure/domain behavior with automated PHP/JS tests where practical, especially:

- effective pricing;
- monetary validation;
- code-group derivation;
- filter boolean logic;
- contextual counts;
- URL state parsing;
- quotation payload validation;
- permissions/capabilities;
- migration/import mapping.

### 25.3 Browser acceptance

Verify at minimum:

- Home;
- About;
- Products;
- Product Detail;
- Inquiry;
- Contact;
- English;
- Arabic;
- desktop;
- tablet;
- mobile;
- product filters;
- search;
- See More;
- See All;
- Product configuration;
- Price on request;
- numeric price;
- inquiry quantities/totals;
- PDF links;
- client content editing workflow.

Responsive matrix should include at least representative widths around:

- 390 px;
- 430 px;
- 768 px;
- 1024 px;
- 1366 px;
- 1440 px;
- 1920 px;
- 2560 px.

### 25.4 Client-editability acceptance

This is a first-class test, not an afterthought.

Using a non-Administrator client role, verify the user can safely:

1. change homepage text;
2. replace a homepage image;
3. change phone/email/contact copy;
4. edit a product name/description;
5. replace product image;
6. change product attributes/variation data where authorized;
7. edit base SAR price;
8. edit variation override;
9. replace a family catalogue PDF;
10. update an Arabic translation;
11. publish/update those changes;
12. see them reflected publicly.

Then verify the same user cannot:

- install plugins;
- edit PHP/theme source;
- alter protected Rosa logic;
- change security/deployment configuration.

## 26. Feasibility findings

The architecture has been checked against current platform capabilities.

Confirmed supported paths include:

- Elementor role manager can restrict a role to content-only editing;
- Elementor supports dynamic tags/custom fields;
- Elementor Theme Builder supports shared dynamic WooCommerce Single Product templates;
- WooCommerce supports hierarchical product categories;
- WooCommerce supports reusable global attributes;
- WooCommerce supports real manually specified variations with per-variation SKU/price/image data;
- custom Elementor widgets can be registered by plugins;
- WooCommerce product attributes support filtering;
- WPML provides a structured translation workflow for pages/products;
- the remaining MedicaShop-specific uncertainty is current-runtime import quality and is explicitly isolated behind Gate 0.

Useful current documentation references:

- Elementor Role Manager: https://elementor.com/help/role-manager/
- Elementor Dynamic Tags: https://elementor.com/help/dynamic-tags-pro-2/
- Elementor WooCommerce Dynamic Tags: https://elementor.com/help/dynamic-woocommerce-tags/
- Elementor Single Product Template: https://elementor.com/help/single-product-site-part/
- WooCommerce taxonomies/attributes: https://woocommerce.com/document/managing-product-taxonomies/
- WooCommerce variable products: https://woocommerce.com/document/variable-product/
- WPML Advanced Translation Editor: https://wpml.org/documentation/translating-your-contents/advanced-translation-editor/

## 27. Non-goals for first WordPress release

Unless separately approved, do not add:

- online payment gateway;
- consumer checkout;
- shipping calculation;
- tax calculation;
- inventory reservation;
- customer accounts;
- wishlist;
- ratings/reviews;
- marketplace/vendor system;
- CRM;
- ERP integration;
- live chat stack;
- unnecessary blog system;
- speculative marketing automation.

Rosa remains a professional B2B catalogue + inquiry/quotation website.

## 28. Implementation sequencing constraints

The eventual implementation plan must begin with:

1. Gate 0 MedicaShop compatibility spike;
2. WordPress foundation + environments;
3. Rosa design-system conversion;
4. WooCommerce catalogue schema;
5. deterministic catalogue-data import;
6. Products discovery/filter subsystem;
7. Product Detail/configuration/pricing;
8. Inquiry/quotation subsystem;
9. Elementor page migration/customization;
10. English/Arabic/RTL;
11. client permissions/editability workflow;
12. performance/security hardening;
13. full acceptance and production launch.

Do not spend weeks polishing imported page visuals before proving the catalogue/data/RTL foundation works.

## 29. Definition of success

The WordPress migration is successful when:

- MedicaShop is no longer visibly a generic pharmacy template;
- Rosa branding is coherent across all pages;
- real surgical-instrument catalogue data is represented correctly;
- advanced product discovery matches the approved Rosa behavior;
- real configurations/SKUs are preserved;
- SAR / Price-on-request semantics are correct;
- quotation flow works without consumer checkout;
- English and Arabic/RTL are production quality;
- desktop/tablet/mobile layouts are polished;
- the client can safely maintain ordinary business content and catalogue data without a developer;
- protected business logic remains stable and version-controlled;
- the site remains maintainable even if the visual template is later replaced.
