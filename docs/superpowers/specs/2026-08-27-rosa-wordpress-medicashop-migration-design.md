# Rosa Medical — MedicaShop WordPress Migration Architecture

Date: 2026-08-27
Branch: `transfer/rose-medical-final-main-ready-2026-08-17`
Status: design specification ready for explicit user review before implementation planning

## 1. Purpose

Rosa Medical is pivoting from a fully custom Next.js public site to a WordPress-based implementation using the selected MedicaShop Elementor Template Kit as a visual foundation.

This is not a stock-template deployment. The WordPress version must preserve the strongest functional and design decisions already established in the custom Rosa implementation while making normal business content and catalogue maintenance safe for non-developer client staff.

The finished system has two equal goals:

1. present Rosa as a purpose-built surgical-instrument manufacturer/supplier rather than a generic pharmacy shop;
2. allow authorized client staff to update routine content, products, prices, images, catalogue PDFs and translations without code changes.

The current custom Rosa site remains the functional/design reference and data source during migration.

## 2. Locked foundation

Target stack:

- WordPress;
- Hello Elementor parent theme;
- minimal Rosa child theme;
- MedicaShop Elementor Template Kit;
- Elementor Pro;
- WooCommerce;
- WPML;
- WooCommerce Multilingual / WPML WooCommerce integration;
- ElementsKit Lite only where imported MedicaShop sections still require it;
- Skyboot Custom Icons only where imported sections still require it;
- custom `rosa-medical-core` plugin for Rosa-specific business functionality.

Do not place core Rosa logic directly inside Elementor pages, imported MedicaShop templates, or the child theme.

## 3. Architecture boundaries

### 3.1 Presentation layer

Owned by Elementor + MedicaShop + Rosa child theme.

Responsibilities:

- page composition;
- Rosa colors and typography;
- spacing/layout;
- imagery;
- header/footer;
- responsive visual behavior;
- reusable Elementor sections;
- presentation-level WooCommerce template overrides.

### 3.2 Catalogue/data layer

Owned by WooCommerce.

Responsibilities:

- products;
- product categories/families;
- global attributes;
- real variations/configurations;
- SKUs;
- product and variation images;
- draft/published state;
- standard WooCommerce price projections required for compatibility.

### 3.3 Rosa business-logic layer

Owned by `rosa-medical-core`.

Responsibilities:

- contextual product filters;
- product search;
- progressive result reveal;
- `See more` / `See all`;
- Rosa price inheritance semantics;
- `Price on request`;
- quotation/inquiry basket;
- quotation persistence/admin;
- catalogue PDF relationships;
- Elementor widgets/dynamic integrations;
- client-safe admin enhancements;
- catalogue import/migration tooling.

Changing the visual template later must not destroy product/filter/pricing/quotation behavior.

## 4. Gate 0 — MedicaShop compatibility spike

MedicaShop is an older Elementor Template Kit and must be tested against the current runtime before production migration work begins.

Create a disposable/local or isolated staging WordPress installation with:

- current stable WordPress;
- current stable Hello Elementor;
- current stable Elementor;
- current stable Elementor Pro;
- current stable WooCommerce;
- current required ElementsKit Lite;
- current required Skyboot Custom Icons;
- purchased MedicaShop ZIP.

Import the complete kit and verify:

- Home imports;
- About imports;
- Contact imports;
- Product Archive imports;
- Single Product imports;
- header/footer import;
- global styles import;
- current Elementor editor can reopen/save the templates;
- no fatal PHP errors;
- no broken required widgets;
- no console-breaking JavaScript errors;
- desktop/tablet/mobile integrity;
- representative Arabic RTL page;
- WooCommerce archive rendering;
- WooCommerce single-product rendering.

Gate decision:

- clean import -> proceed;
- limited legacy layout/container problems -> repair, retest, proceed;
- broad incompatibility -> stop and choose another template foundation without changing the architecture below.

No production site is touched during Gate 0.

## 5. Dynamic/client-editable website requirement

The client explicitly wants a dynamic website they can change themselves.

For Rosa, `dynamic` means normal business content is stored as WordPress/WooCommerce data and rendered through shared templates. Routine changes must not require a developer.

### 5.1 Client-editable content

Authorized staff must be able to update without code:

- Home text and approved images;
- About/Company content;
- contact details;
- selected CTA copy;
- approved reusable content blocks;
- product names/descriptions;
- product images;
- family/category assignment;
- Size;
- Direction;
- Variant/type;
- real product variations;
- SKU/catalogue code;
- base SAR price;
- variation price override;
- draft/published state;
- family catalogue PDFs;
- English content;
- Arabic translations;
- selected SEO/meta content when added.

### 5.2 Shared dynamic templates

The client must not manually redesign each Product Detail page.

Single Product presentation is one shared Elementor Theme Builder template plus Rosa dynamic widgets/data.

Changing a WooCommerce product's title, image, description, attributes, variations, SKU or approved price fields automatically changes the public catalogue/product presentation.

Archive cards, family cards, catalogue links, header/footer and other repeated structures should follow the same centralized-template principle.

### 5.3 Safe editability roles

Create at least two operational roles.

#### Rosa Content Manager

May:

- edit approved pages/content;
- use Elementor on approved content surfaces;
- upload/manage relevant media;
- edit product/catalogue data within assigned permissions;
- replace catalogue PDFs;
- manage approved translations.

Must not:

- install/delete plugins;
- change themes;
- edit PHP/plugin/theme source;
- change global system/security/deployment configuration;
- alter quotation/filter/pricing code;
- manage users beyond approved scope.

For Elementor-capable client staff, prefer Elementor's `Edit Contents Only` restriction where practical so they can change content without arbitrarily restructuring layouts.

#### Rosa Administrator

Reserved for trusted owner/technical administration.

### 5.4 Developer-controlled behavior

Protect from ordinary editing:

- filter boolean logic;
- contextual counts;
- URL filter semantics;
- code-group derivation;
- pricing inheritance/synchronization;
- inquiry basket logic;
- quotation validation/persistence;
- plugin/database schema;
- child-theme code;
- responsive CSS contracts;
- deployment/backups/security.

## 6. Public information architecture

Primary navigation:

1. Home
2. About Us / Company
3. Products
4. Inquiry / Request Quotation
5. Contact Us

Arabic is the same information architecture through WPML language routing.

Do not carry unnecessary MedicaShop demo pages into production by default. Remove or leave unpublished:

- pharmacy-specific pages;
- Team;
- Blog unless later required;
- Login;
- My Account;
- consumer Checkout;
- Purchase Summary;
- retail sale/discount pages.

## 7. MedicaShop page mapping

### 7.1 Home

Use useful section rhythm but replace pharmacy/retail meaning:

- pharmacy hero -> Rosa surgical-instrument/company hero;
- company intro -> Rosa intro;
- Editor's Choice -> Instrument Families / Featured Instruments;
- shipping benefit -> Global Supply / Export capability;
- warranty benefit -> Quality Assurance;
- payment benefit -> Precision / Materials / Manufacturing Quality;
- Latest Products -> Featured / Latest Instruments;
- promo cards -> Specialties / Catalogue PDFs;
- Why Choose Us -> Rosa manufacturing/value proposition;
- testimonials -> remove unless genuine client-approved testimonials exist;
- newsletter -> Inquiry/Contact CTA;
- pharmacy footer -> Rosa corporate footer.

### 7.2 About / Company

Use the visual composition for:

- company introduction;
- verified experience/manufacturing statistics;
- manufacturing capability;
- quality/materials/precision;
- markets/global supply;
- client-provided certifications/standards;
- final inquiry/contact CTA.

Remove pharmacy opening-hours and retail-store concepts.

### 7.3 Products

MedicaShop Product Archive is only a visual starting point.

The production Products page is the Rosa discovery workspace powered by WooCommerce data and `rosa-medical-core`.

### 7.4 Product Detail

Use the MedicaShop Single Product shell where useful, replacing consumer purchase UX with:

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

Do not restore unrelated recommendation rails unless later approved.

### 7.5 Contact

Retain useful composition but use Rosa-approved:

- address;
- telephone;
- WhatsApp if required;
- email;
- contact/inquiry form;
- map only if client wants it and exact public location is confirmed.

## 8. Rosa visual conversion

MedicaShop's green pharmacy identity is not authoritative.

Define Elementor global design tokens for:

- Rosa red;
- black/near-black;
- white;
- neutral surfaces;
- body text;
- muted text;
- borders;
- success/error/focus states;
- typography scale;
- content rails;
- spacing scale;
- buttons;
- radius policy;
- motion duration/easing.

Use global Elementor colors/fonts instead of per-widget one-off styling where practical.

The finished site must not look like a recolored pharmacy demo.

## 9. WooCommerce catalogue model

### 9.1 Families

Use hierarchical WooCommerce Product Categories for at least:

- Knives;
- Scissors;
- Cutters;
- Chisels;
- Punches.

Add other verified families only when catalogue data requires them.

### 9.2 Global attributes

Use reusable global attributes for:

- `pa_size`;
- `pa_direction`;
- `pa_variant`.

Global attributes are preferred because they are centrally managed, reusable, translatable and filterable.

### 9.3 Exact configurations

Use WooCommerce variable products for products with multiple real configurations.

Create only combinations that actually exist in the Rosa catalogue. Do not generate arbitrary Cartesian combinations.

Each real variation can contain:

- WooCommerce variation ID;
- exact SKU/catalogue code;
- Size;
- Direction where variation-defining;
- Variant/type where variation-defining;
- configuration-specific image where needed;
- Rosa variation price override metadata.

### 9.4 Code Group — locked representation

Do **not** maintain Code Group as a second manually edited taxonomy when it can be derived from the authoritative SKU.

Code Group is a computed/filter projection from the exact catalogue SKU/code using the already established Rosa grouping rule. The raw SKU remains authoritative and is never mutated.

Benefits:

- no duplicated client data entry;
- no risk that SKU and Code Group drift apart;
- imported catalogue data remains deterministic;
- filters can still expose Code Group normally.

If future catalogue evidence proves some families require non-derivable editorial grouping, that would be a separately approved schema change.

## 10. Product discovery and filters

Public target:

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

Required behavior:

- Family single-select;
- Size multi-select;
- Direction multi-select;
- Variant multi-select;
- Code Group multi-select;
- OR within one facet;
- AND across facets;
- search ANDs with active facets;
- contextual counts;
- selected zero-count options remain removable;
- one advanced accordion open at a time;
- selected collapsed summary;
- within-facet search for genuinely large lists;
- bounded internal option height;
- Clear Filters;
- native semantic inputs beneath Rosa visuals;
- Rosa-red selected state;
- keyboard/focus support;
- RTL-safe layout;
- mobile outer filter disclosure/drawer;
- share/refresh-safe URL state.

Implementation may use WooCommerce APIs internally or a dedicated Rosa read endpoint. Public behavior is authoritative.

## 11. Product search

Search must intentionally match:

- localized product name;
- English product name;
- family;
- parent product code where applicable;
- variation SKU;
- Size;
- Direction;
- Variant/type;
- derived Code Group.

Search must be case- and whitespace-tolerant.

If core WooCommerce search does not provide this cleanly, implement a read-only Rosa discovery endpoint instead of installing a large search suite by default.

## 12. Progressive result reveal

The approved catalogue behavior remains:

- initial grid disclosure uses complete visual rows;
- `See more products` reveals the next complete rows;
- it never intentionally leaves an artificial partial row before the control;
- genuine final results may naturally end in a partial row;
- directly below it, a quieter `See all N products` reveals all remaining matches;
- both controls disappear when all matches are visible;
- search/filter changes reset to the normal initial disclosure state;
- reduced-motion users receive non-animated reveal behavior.

## 13. Pricing architecture

Currency: SAR.

### 13.1 Rosa authoring model

Rosa-specific pricing fields are the client/admin authoring source:

- parent/base price: `_rosa_base_price`;
- variation override: `_rosa_price_override`.

Effective price:

```text
variation override ?? product base price ?? null
```

Rules:

- blank base + blank override -> `Price on request`;
- base only -> inherited by un-overridden configurations;
- variation override -> replaces base for that configuration;
- zero is a valid numeric price;
- negative invalid;
- at most two decimal places at input boundary;
- server-side validation mandatory.

### 13.2 WooCommerce compatibility synchronization

WooCommerce and third-party product widgets expect standard WooCommerce price fields.

Therefore `rosa-medical-core` must synchronize the computed Rosa effective price projection into the relevant standard WooCommerce price metadata whenever Rosa pricing changes.

Rules:

- Rosa authoring fields remain the source of truth for inheritance semantics;
- WooCommerce standard fields are compatibility/read projections;
- synchronization occurs on approved product/variation saves and import/migration operations;
- synchronization must be deterministic and testable;
- never create a fake numeric WooCommerce price for `Price on request`;
- public Rosa components must still resolve pricing using Rosa semantics rather than trusting arbitrary client-submitted values.

This preserves compatibility with WooCommerce/Elementor while keeping the approved Rosa business rule.

## 14. Inquiry / quotation architecture

Rosa remains quotation-led rather than online-payment-led.

Do not use consumer Checkout or fake WooCommerce Orders as the primary quote store.

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
  -> structured quotation
  -> admin review
```

### 14.1 Persistence — locked direction

`rosa-medical-core` will own dedicated structured quote storage rather than overloading WooCommerce Orders.

Use dedicated Rosa quote/header and quote-line persistence, preferably custom database tables created/versioned by the plugin unless implementation research reveals a WordPress-native storage option with equal integrity and queryability.

Required quote fields include:

- customer/contact/company/message data;
- submission timestamps/status;
- line product ID;
- variation ID;
- product-name snapshot;
- SKU snapshot;
- configuration snapshot;
- quantity;
- authoritative unit-price snapshot or null;
- currency;
- numeric line subtotal snapshot when applicable.

Server revalidates product, variation and current Rosa effective price before persistence. Quotation arithmetic never trusts client display strings.

Admin exposes a dedicated `Quote Requests` workflow.

## 15. Catalogue PDFs

Store catalogue PDFs in WordPress Media Library.

Associate each family/category with its authoritative PDF through Rosa-managed taxonomy metadata.

Client staff can replace a family PDF once in WordPress Admin; Home/Products/Product Detail components resolve that relationship dynamically rather than containing duplicated hard-coded URLs.

## 16. Elementor integration

Keep the custom Elementor surface small and intentional.

Likely custom components:

- Rosa Product Discovery;
- Rosa Product Configuration/Pricing;
- Rosa Inquiry Summary/CTA where required;
- Rosa Catalogue/Family PDF component where dynamic data requires it.

Use ordinary Elementor/WooCommerce dynamic tags for simple fields where sufficient.

Do not build the catalogue experience out of dozens of unrelated third-party widgets/shortcodes.

## 17. English / Arabic / RTL

Use one WordPress installation with WPML.

Translate:

- pages;
- navigation;
- headers/footers;
- product names/descriptions;
- categories;
- attribute labels/terms;
- Rosa UI strings;
- quotation/inquiry strings;
- relevant SEO metadata.

Technical identifiers such as SKU remain stable between languages.

RTL acceptance explicitly covers:

- header/nav;
- breadcrumbs;
- hero;
- cards;
- filter accordions;
- chevrons/icons;
- Product Detail columns;
- configuration controls;
- inquiry basket;
- forms/tables;
- buttons;
- mobile navigation;
- logical spacing/alignment.

Do not rely on experimental multilingual-critical Elementor features until Arabic acceptance proves them safe.

## 18. Client translation workflow

Do not maintain Arabic as a completely unrelated duplicate site.

Use WPML's translation workflow so content can be translated while shared design/template structure remains centrally controlled.

Product categories/attributes/products use WooCommerce/WPML multilingual structures rather than manually duplicated independent records.

## 19. Client admin information architecture

Everyday client dashboard should emphasize only operational tasks:

- Pages;
- Media;
- Products;
- Product Categories;
- Product Attributes;
- Rosa Catalogues / PDFs;
- Quote Requests;
- Translations;
- Contact submissions if separate;
- optional concise dashboard summary.

Use native WordPress/WooCommerce administration wherever it already solves the task. Add bespoke admin UI only for Rosa-specific concepts.

## 20. Data migration from current Rosa work

Do not manually retype hundreds of configurations.

Create deterministic import/migration tooling from the existing verified Rosa catalogue data into:

- WooCommerce products;
- categories;
- global attributes;
- exact variations;
- SKUs;
- product/variation media;
- Rosa pricing metadata when populated;
- catalogue PDF relationships.

The importer must be idempotent or have an explicit safe-rerun strategy during staging.

Never fabricate missing metadata.

## 21. Performance policy

WordPress does not justify uncontrolled plugin accumulation.

Rules:

- install only plugins with a concrete requirement;
- prefer `rosa-medical-core` for tightly scoped Rosa logic;
- progressively remove ElementsKit/Skyboot if no production widget still requires them;
- optimize product images;
- lazy-load where appropriate;
- avoid unnecessary autoplay/motion;
- minimize third-party scripts;
- cache public content/endpoints without breaking inquiry/filter state;
- audit Products/Product Detail database/query behavior before launch.

## 22. Security and ownership

Production requirements:

- unique admin accounts;
- least-privilege everyday roles;
- strong authentication;
- secrets outside git;
- nonce/capability validation on relevant forms/REST actions;
- server-side sanitization/validation;
- protected quotation administration;
- backup-before-upgrade discipline;
- plugin/theme upgrades validated on staging before production.

Do not grant Administrator merely for convenience.

## 23. Hosting, environments and deployment

### 23.1 Runtime change from the current custom site

The existing custom deployment architecture is not the WordPress production runtime.

WordPress requires a PHP + MySQL/MariaDB capable hosting origin with HTTPS. Current WordPress guidance recommends a modern PHP/database stack.

The existing Cloudflare Workers deployment for the custom Next.js app must therefore not be treated as if it can simply host WordPress itself.

Cloudflare may still be used later for DNS/CDN/proxy concerns if appropriate, but WordPress itself needs a compatible WordPress/PHP origin.

### 23.2 Environments

Maintain at least:

1. local/development;
2. staging/client-review;
3. production.

Gate 0 occurs in isolated local/staging infrastructure.

Custom child-theme/plugin source stays version-controlled in Git.

Database/media content deployment is documented separately from source-code deployment because WordPress content does not live entirely in git.

### 23.3 Hostinger viability

Hostinger Managed WordPress is a viable candidate because current Hostinger tooling provides WordPress management, WP-CLI, backups and staging on eligible plans.

However, this specification does **not** authorize access or changes to the user's Hostinger account.

### 23.4 Hostinger safety boundary — mandatory

The hosting account may contain unrelated/sensitive sites and data.

Therefore:

- do not access Hostinger merely to inspect possibilities during planning;
- before any Hostinger connector/browser action, obtain the user's explicit permission for that specific access step;
- identify the exact Rosa website/domain/installation before changing anything;
- never create/delete/publish/restore/migrate another site's staging environment;
- never modify account-level DNS, domains, databases, files or backups unrelated to Rosa;
- prefer read-only inspection first when access is approved;
- before any destructive or publishing action, state exactly what will change and obtain explicit approval;
- create/confirm a recoverable backup before significant Rosa production changes.

Hostinger's staging Publish operation can replace the live site's files and database with the staging copy. Therefore **never publish staging automatically**. A staging-to-production publish requires fresh backup verification plus explicit user approval for the exact Rosa target.

## 24. Backups and rollback

Before major imports, plugin upgrades, Elementor conversions, WPML migrations, staging publication or production releases:

- capture/confirm database backup;
- capture/confirm required media/files state;
- retain previous versioned child-theme/plugin source;
- document rollback before applying the change.

Production launch must have a clear restore path.

## 25. Testing strategy

### 25.1 Gate 0

Validate imported MedicaShop under current runtime before committing to migration.

### 25.2 Automated custom-code testing

Test `rosa-medical-core` domain behavior where practical, especially:

- effective pricing;
- WooCommerce price synchronization;
- monetary validation;
- code-group derivation;
- filter boolean logic;
- contextual counts;
- URL-state parsing;
- quotation validation/persistence;
- capabilities/permissions;
- catalogue import mapping/idempotency.

### 25.3 Browser acceptance

Verify:

- Home;
- About;
- Products;
- Product Detail;
- Inquiry;
- Contact;
- English;
- Arabic;
- desktop/tablet/mobile;
- filters;
- search;
- See More;
- See All;
- configuration selection;
- Price on request;
- numeric price;
- inquiry quantities/totals;
- PDF links;
- client editing workflow.

Representative widths include approximately:

- 390;
- 430;
- 768;
- 1024;
- 1366;
- 1440;
- 1920;
- 2560 px.

### 25.4 Client-editability acceptance

Using a non-Administrator client role, verify the user can safely:

1. edit homepage text;
2. replace an approved homepage image;
3. change contact copy;
4. edit product name/description;
5. replace product image;
6. edit authorized attributes/variation data;
7. edit base SAR price;
8. edit variation override;
9. replace a family catalogue PDF;
10. update an Arabic translation;
11. publish/update those changes;
12. see changes reflected dynamically in public shared templates.

Then verify that role cannot:

- install plugins;
- edit source code;
- alter protected Rosa logic;
- change security/deployment configuration.

## 26. Feasibility findings

The planned architecture has supported implementation paths:

- Elementor Role Manager supports content-only editing restrictions;
- Elementor supports shared/dynamic product templates and plugin-registered widgets;
- WooCommerce supports hierarchical product categories;
- WooCommerce global attributes are centrally managed and reusable;
- WooCommerce variable products support manually created real variations, including variation-specific data such as prices/images;
- custom WordPress plugins can own metadata, REST behavior, capabilities and custom tables;
- WooCommerce/WordPress data can be migrated programmatically rather than retyped;
- WPML supports structured multilingual WordPress/WooCommerce workflows;
- Hostinger Managed WordPress can provide a suitable staging/backup/runtime environment when the user's actual plan/site is explicitly approved for access;
- the only major unresolved foundation risk is MedicaShop's current-runtime import quality, isolated behind Gate 0.

Current reference documentation:

- WordPress requirements: https://wordpress.org/about/requirements/
- Elementor Role Manager: https://elementor.com/help/role-manager/
- Elementor Single Product/template documentation: https://elementor.com/help/single-product-site-part/
- WooCommerce product taxonomies/attributes: https://woocommerce.com/document/managing-product-taxonomies/
- WooCommerce variable products: https://woocommerce.com/document/variable-product/
- WPML translation workflow: https://wpml.org/documentation/translating-your-contents/advanced-translation-editor/
- Hostinger staging: https://www.hostinger.com/support/5720286-how-to-create-a-wordpress-staging-environment-in-hostinger/
- Hostinger managed WordPress: https://www.hostinger.com/support/8034228-what-is-managed-wordpress-in-hostinger/

## 27. Non-goals for first WordPress release

Unless separately approved, do not add:

- payment gateway;
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
- live-chat stack;
- unnecessary blog system;
- speculative marketing automation.

Rosa remains a professional B2B catalogue + inquiry/quotation website.

## 28. Implementation sequence constraints

The eventual implementation plan must proceed in this order:

1. Gate 0 MedicaShop compatibility spike;
2. WordPress local/staging foundation;
3. Rosa design-system conversion;
4. WooCommerce catalogue schema;
5. deterministic catalogue-data importer;
6. Products discovery/filter/search subsystem;
7. Product Detail/configuration/pricing + Woo compatibility synchronization;
8. Inquiry/quotation subsystem and custom persistence;
9. Elementor page migration/customization;
10. English/Arabic/RTL;
11. client roles/editability workflow;
12. performance/security hardening;
13. production-hosting preparation with explicit Hostinger access approval if Hostinger is selected;
14. full acceptance, backup and approved production launch.

Do not spend weeks polishing imported MedicaShop visuals before proving Gate 0, catalogue data, pricing and RTL foundations.

## 29. Definition of success

The migration is successful when:

- MedicaShop no longer looks like a generic pharmacy template;
- Rosa branding is coherent;
- verified surgical-instrument data is represented correctly;
- advanced product discovery matches approved Rosa behavior;
- exact configurations/SKUs are preserved;
- SAR / Price-on-request semantics work correctly;
- WooCommerce compatibility price projections do not compromise Rosa pricing semantics;
- structured quotation flow works without consumer checkout;
- English and Arabic/RTL are production quality;
- desktop/tablet/mobile are polished;
- the client can safely edit ordinary business/catalogue content without a developer;
- protected logic stays version-controlled and stable;
- production hosting has backup/rollback discipline;
- no unrelated Hostinger site/account resource is touched during development or deployment;
- the system remains maintainable even if the visual template is later replaced.
