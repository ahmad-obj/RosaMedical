# Rosa Medical — Free-First WordPress Custom Foundation Architecture

Date: 2026-08-27
Status: approved; authoritative replacement architecture
Supersedes: MedicaShop/Elementor Pro as required presentation dependencies in `2026-08-27-rosa-wordpress-medicashop-migration-design.md`

## 1. Decision

Rosa Medical will proceed without purchasing MedicaShop, Elementor Pro, or WPML as prerequisites.

The approved baseline is:

- WordPress;
- Hello Elementor parent theme;
- minimal Rosa child theme;
- Elementor Free for normal editable marketing/content pages;
- WooCommerce for structured catalogue/product data;
- custom `rosa-medical-core` plugin for Rosa-specific business behavior;
- WordPress Media Library for product/catalogue media;
- no paid template kit;
- no paid Elementor dependency;
- no paid multilingual dependency at foundation stage.

This is not a downgrade to a generic WordPress site. The existing custom Rosa implementation remains the functional, data, UX, responsive and visual reference. The WordPress migration reproduces the approved Rosa behavior in a cleaner, client-editable architecture.

## 2. Why this replaces MedicaShop

MedicaShop was selected as a visual shortcut, not as Rosa business architecture. Its purchase is unnecessary because:

- the public design must be heavily transformed away from pharmacy/retail styling anyway;
- Rosa's advanced Products discovery, pricing, configuration, inquiry and quotation systems were already custom responsibilities;
- the kit is old enough to require a compatibility spike before trusting it;
- some kit surfaces depend on Elementor Pro;
- the existing Rosa site already provides a stronger purpose-built visual/UX reference than a generic pharmacy kit.

Removing MedicaShop also removes the need for the old MedicaShop compatibility Gate 0.

## 3. Architecture boundaries

### 3.1 Editable presentation layer

Owned by Elementor Free + Rosa child theme.

Elementor Free is used for ordinary editorial pages where the client benefits from visual editing:

- Home;
- About / Company;
- Contact;
- approved reusable marketing/content sections.

The child theme owns:

- site shell;
- header/footer rendering;
- Rosa design tokens;
- responsive CSS contracts;
- WooCommerce template integration where appropriate;
- RTL-safe visual primitives;
- protected presentation structure that should not be casually restructured by content staff.

Elementor Free is not used as a substitute for Rosa business logic.

### 3.2 Catalogue/data layer

Owned by WooCommerce.

Responsibilities remain:

- products;
- product families/categories;
- real attributes;
- real variations/configurations;
- SKUs/catalogue codes;
- product and variation images;
- publish/draft state;
- WooCommerce-compatible price projections.

Only real catalogue configurations are imported. No arbitrary Size × Direction × Variant Cartesian products are generated.

### 3.3 Rosa business-logic layer

Owned by `rosa-medical-core`.

Responsibilities remain:

- deterministic catalogue import/migration;
- computed Code Group from authoritative SKU;
- advanced search and contextual filtering;
- shareable URL-backed filter state;
- complete-row progressive reveal;
- `See more` / `See all`;
- Rosa pricing inheritance and WooCommerce price synchronization;
- `Price on request`;
- configuration selection;
- inquiry basket;
- authoritative quotation validation;
- dedicated quotation persistence/admin;
- family catalogue-PDF relationships;
- centralized business/contact settings used across the site;
- client-safe admin enhancements;
- localized Rosa strings/data integrations where required.

Changing Elementor page layouts later must not destroy catalogue, pricing, filtering or quotation behavior.

## 4. Dynamic/client-editable model without Elementor Pro

The client requirement for a dynamic site remains first-class.

`Dynamic` means routine content and product data live in WordPress/WooCommerce, while shared rendering consumes that structured data automatically.

### 4.1 Client-editable marketing pages

Home, About and Contact use Elementor Free so authorized staff can change approved text/images and ordinary page content without code.

### 4.2 Centralized reusable business data

Repeated facts such as phone, email, address, WhatsApp, primary CTAs and other approved company information must not be duplicated manually across many Elementor widgets.

`rosa-medical-core` provides a small centralized Rosa settings surface. The child theme/plugin renders those values wherever needed.

Changing one approved contact value updates all dynamic surfaces that reference it.

### 4.3 Dynamic Products and Product Detail

Products archive, Product Detail, configuration/pricing and Inquiry are not manually duplicated Elementor pages.

They use shared Rosa-owned templates/components backed by WooCommerce data.

The client changes a product once in WooCommerce Admin and the corresponding public card/detail/configuration/inquiry surfaces update automatically.

This deliberately protects complex catalogue layouts from accidental visual-editor damage while keeping the product data editable.

### 4.4 Header/footer

Because Elementor Free does not provide Elementor Pro Theme Builder, Rosa header/footer are owned by the child theme rather than a paid visual builder.

Normal business values inside them come from centralized editable Rosa settings. Structural layout remains developer-controlled.

## 5. Free Foundation Gate — replacement for MedicaShop Gate 0

Before migrating the full catalogue, prove the free stack in a disposable local environment.

Use current stable:

- WordPress;
- Hello Elementor;
- Elementor Free;
- WooCommerce;
- Rosa child theme skeleton;
- `rosa-medical-core` skeleton.

No Hostinger access is involved.

The gate must prove:

1. WordPress boots cleanly;
2. Elementor Free can create/reopen/save representative Home/About/Contact content;
3. WooCommerce can create a representative variable Rosa product with only real configurations;
4. one shared Rosa Product Detail prototype can read product/variation/SKU data dynamically;
5. centralized Rosa contact data can render in at least two independent surfaces;
6. representative desktop/tablet/mobile layouts work;
7. representative Arabic/RTL shell rendering does not structurally break;
8. no fatal PHP errors;
9. no console-breaking JavaScript errors;
10. the environment can be reset safely.

Passing this gate proves that no purchased template or Elementor Pro dependency is required to begin the migration.

## 6. Public information architecture

Primary public structure remains:

1. Home
2. About Us / Company
3. Products
4. Inquiry / Request Quotation
5. Contact Us

Product Detail remains a supporting dynamic route.

Do not add consumer ecommerce surfaces such as Checkout, My Account, ratings, wishlist, shipping or payment unless separately approved later.

## 7. Rosa visual system

The final site follows Rosa's own medical/B2B identity rather than any template kit.

Use a centralized design system covering:

- Rosa red;
- black / near-black;
- white;
- restrained neutral surfaces;
- body and muted text;
- borders/focus/error/success states;
- typography scale;
- spacing/content rails;
- buttons;
- radius policy;
- motion/reduced-motion behavior.

The existing custom Next.js implementation is the primary visual/interaction reference. Port behavior and design intent, not React code line-for-line.

## 8. WooCommerce catalogue model

Retain the already approved model:

- product families as WooCommerce Product Categories;
- reusable Size, Direction and Variant/type attributes;
- exact real variations only;
- exact SKU/catalogue code as source of truth;
- Code Group computed from SKU using the established Rosa rule;
- product/variation images;
- family catalogue-PDF metadata;
- SAR pricing metadata and deterministic WooCommerce compatibility projections.

The existing catalogue extraction work and supplied Knives, Scissors, Cutters, Chisels and Punches catalogues remain migration evidence/data sources. Do not manually retype hundreds of configurations.

## 9. Products discovery

Preserve the approved custom Rosa behavior:

- Family single-select;
- Size multi-select;
- Direction multi-select;
- Variant multi-select;
- Code Group multi-select;
- OR within a facet;
- AND across facets;
- search AND active filters;
- contextual counts;
- selected zero-count values remain removable;
- URL-backed/shareable state;
- keyboard/focus accessibility;
- RTL-safe presentation;
- mobile filter disclosure;
- complete-row progressive reveal;
- `See more products` and `See all N products`.

If WooCommerce core APIs are insufficient, `rosa-medical-core` exposes a narrow read-only discovery endpoint rather than installing a large generic search/filter plugin.

## 10. Pricing

Retain the approved SAR model:

- `_rosa_base_price` as parent/base authoring field;
- `_rosa_price_override` as variation override;
- effective price = override ?? base ?? null;
- null = `Price on request`;
- zero is valid;
- negative invalid;
- maximum two decimal places at input boundary;
- server-side validation;
- deterministic synchronization into standard WooCommerce price projections where a numeric effective price exists;
- Rosa fields remain source of truth.

## 11. Inquiry / quotation

Retain the quotation-led architecture.

Do not use consumer Checkout or fake WooCommerce Orders as the quote store.

Flow:

Product/configuration -> quantity -> Add to Inquiry -> Inquiry Basket -> contact/company details -> server revalidation -> structured quote persistence -> Quote Requests admin.

`rosa-medical-core` owns dedicated quote/header and quote-line storage with versioned migrations and authoritative server-side price/configuration validation.

## 12. Catalogue PDFs

Store PDFs in WordPress Media Library and associate each family/category with one authoritative PDF relationship.

The Home catalogue area, Products catalogue area and optional Product Detail reference resolve the relationship dynamically.

## 13. Arabic / multilingual strategy

No paid multilingual plugin is required to begin foundation/catalogue work.

However Arabic remains a launch requirement and cannot be treated as cosmetic RTL only.

During the multilingual phase, run a focused compatibility/cost gate against Rosa's actual requirements:

- English + Arabic routing;
- page translation;
- product/category/attribute translation;
- custom Rosa UI strings;
- WooCommerce variation compatibility;
- client editability;
- search/filter localization;
- SEO metadata where applicable;
- RTL presentation.

The implementation must prefer a free/low-cost solution if it satisfies these requirements cleanly. If no free option meets the requirements without creating a fragile custom translation system, any paid multilingual purchase becomes a separate explicit user decision.

Until then:

- custom plugin/theme strings are translation-ready;
- CSS/layout is RTL-safe;
- technical identifiers such as SKU remain language-independent.

## 14. Client permissions

Maintain at least:

### Rosa Content Manager

Can perform approved content/catalogue work, including:

- edit Elementor Free pages;
- edit product data/configurations/prices within approved scope;
- manage relevant media/PDFs;
- update centralized Rosa business/contact settings;
- later manage approved translations.

Cannot casually:

- install/delete plugins;
- switch themes;
- edit PHP/theme/plugin code;
- change Rosa filter/pricing/quotation algorithms;
- change deployment/security/backups;
- manage unrelated system settings.

### Rosa Administrator

Reserved for trusted technical/owner administration.

## 15. Environments and Hostinger safety

Target workflow remains:

- local/development;
- staging/client review;
- production.

Hostinger remains explicitly out of scope until the user separately approves access.

Do not inspect, alter or publish any Hostinger site/domain/database as part of the free foundation work.

Before any eventual production/staging operation:

- identify the exact Rosa target;
- scope the operation;
- create/confirm backup and rollback path;
- obtain explicit approval for high-impact publication.

## 16. Migration sequence

The revised sequence is:

1. free WordPress foundation gate;
2. Rosa child theme + design-system shell;
3. `rosa-medical-core` foundation and centralized settings;
4. WooCommerce catalogue schema;
5. deterministic catalogue import;
6. Products discovery/filter subsystem;
7. Product Detail/configuration/pricing;
8. Inquiry/quotation subsystem;
9. Elementor Free Home/About/Contact migration;
10. Arabic/multilingual compatibility/cost gate and implementation;
11. client permissions/editability workflow;
12. performance/security hardening;
13. responsive/full acceptance;
14. separately approved staging/production launch.

Do not spend weeks polishing editorial pages before catalogue/data/business-system foundations are proven.

## 17. Acceptance criteria

The WordPress migration is acceptable only when:

- no MedicaShop purchase is required;
- no Elementor Pro purchase is required for the implemented architecture;
- Home/About/Contact remain safely client-editable;
- products/configurations/SKUs/prices/PDFs are client-editable through structured WordPress/WooCommerce admin;
- Product Detail is shared/dynamic rather than manually duplicated;
- advanced Rosa filtering/search behavior is preserved;
- Code Group remains derived from SKU;
- price inheritance and `Price on request` are authoritative;
- inquiry/quotations remain server-validated and structured;
- catalogue imports are deterministic/rerunnable;
- representative 390, 430, 768, 1024, 1366, 1440, 1920 and 2560px layouts are verified;
- RTL architecture is sound before Arabic launch work;
- non-admin client-editability tests pass;
- protected users cannot alter plugin/theme/business logic;
- Hostinger/production are untouched until separately authorized.

## 18. Explicitly superseded assumptions

The following earlier assumptions are no longer authoritative:

- MedicaShop is required;
- a purchased MedicaShop ZIP is required for Gate 0;
- Elementor Pro is required for the baseline architecture;
- ElementsKit/Skyboot are baseline dependencies;
- the first technical milestone is a MedicaShop compatibility import.

The business/data behavior defined in the earlier WordPress migration specification remains authoritative unless this document explicitly replaces it.
