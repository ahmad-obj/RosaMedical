# Rosa Medical — Client Products + Shared Public Shell Redesign

Date: 2026-08-22
Branch: `transfer/rose-medical-final-main-ready-2026-08-17`
Status: design specification for client review round

## 1. Source of truth for this redesign

This design is based on:

- the client-supplied Products-page redesign JPG (`3. Products 1.jpg.jpeg`);
- the client voice-message transcript supplied on 2026-08-22;
- the already-approved five-page public navigation from the prior client-review round;
- the current transfer branch implementation, especially the existing public router, live catalogue projection, product detail flow, inquiry store, quotation flow, catalogue PDFs, shared public shell, and responsive/motion system.

The JPG is treated as a layout and hierarchy reference, not as a requirement to copy every old label, unsupported social link, sample price, or legacy navigation item literally.

## 2. Locked product model: quotation cart, not ecommerce checkout

The client said visitors should be able to open a product, view details, and add it to a cart. For Rosa Medical this will be implemented as a quotation/inquiry basket, not a payment checkout.

The existing inquiry system already provides the correct functional base:

- persistent client-side inquiry storage;
- add product;
- merge duplicate product selections;
- quantity updates;
- line notes;
- remove item;
- clear basket;
- inquiry count;
- quotation submission flow.

The public-facing wording may use familiar shopping language where useful (`Add to inquiry`, `Inquiry cart`, `View inquiry`), but there will be no payment, order capture, tax, shipping checkout, or fake ecommerce transaction.

## 3. Main public information architecture

Primary navigation remains exactly five main pages:

1. Home
2. About Us
3. Products
4. Inquiry
5. Contact Us

Routes:

- `/`
- `/about`
- `/products`
- `/inquiry`
- `/contact`

Arabic equivalents continue through the existing locale-aware routing.

Supporting routes remain available when required by the product journey, but they do not become primary header links:

- `/products/[family]`
- `/products/[family]/[product]`
- `/catalogues`
- `/request-quotation`
- `/search`
- `/privacy`
- `/terms`

No separate Downloads main page is introduced in this phase.

## 4. One identical site shell on every main page

The client's strongest structural instruction is that the website must stop feeling like separate page designs. Header and footer are shared and visually identical across Home, About Us, Products, Inquiry, and Contact Us.

### 4.1 Header

Use the existing shared `PublicShell` architecture rather than page-local headers.

Header contents:

- ROSA logo;
- Home;
- About Us;
- Products;
- Inquiry with live inquiry count when items exist;
- Contact Us;
- language control where currently supported.

Do not restore Catalogues or Search as primary header navigation merely because they appear in the JPG reference.

### 4.2 Shared four-slide banner system

The client's transcript explicitly allows the same four banners to continue at the top and says the names/copy can change.

Design decision:

- reuse the current approved four-slide cinematic banner media set;
- extract the carousel into a reusable public-page banner surface rather than leaving it Home-only;
- Home keeps its existing home-oriented copy;
- About, Products, Inquiry, and Contact receive page-specific copy configuration while reusing the same four banner media assets and interaction behavior;
- preserve autoplay, dots, swipe, keyboard accessibility, responsive focal points, and reduced-motion behavior;
- keep banner CTA buttons removed unless a future client instruction explicitly restores them.

This makes the five main pages feel like one coherent website without duplicating banner implementations.

### 4.3 Shared bottom composition

Every main page must end with one identical sequence:

1. optional page-specific final CTA/content;
2. shared red contact/social ribbon;
3. shared black global footer.

The red ribbon keeps the already-approved combined behavior:

- Follow Rosa/social links;
- centered `Contact us` treatment;
- centralized email and telephone.

This reconciles the client's redesign reference (red social ribbon) with the explicit prior request to keep the red Contact Us footer ribbon on every page.

Do not restore unsupported YouTube or invented social profiles from the JPG. Current supported social profiles remain Instagram, Facebook, LinkedIn, and X.

## 5. Products page — target hierarchy

The Products page becomes the primary product-discovery workspace. It should visually follow the client JPG while staying consistent with the modern Rosa system.

Desktop order:

1. shared four-slide public banner;
2. prominent product search bar;
3. `Medical Devices` / product-discovery heading area;
4. filter sidebar + product result controls + product grid;
5. direct WhatsApp / Email contact band;
6. `Product Categories` catalogue-cover row;
7. quotation CTA;
8. shared red contact/social ribbon;
9. shared black footer.

On tablet/mobile the same information order is preserved, with filters becoming a compact disclosure/drawer rather than consuming permanent sidebar width.

## 6. Search and discovery

### 6.1 Search

The large search field below the banner is a real product search entry point, not decoration.

It should search the existing catalogue by fields already supported by the application, including:

- product name;
- code / item code;
- family;
- size;
- variant.

Implementation should reuse or compose with the existing search/catalogue logic instead of creating a second unrelated search engine.

### 6.2 Filters

The client JPG shows:

- Category;
- Price;
- Country of origin;
- Brand;
- Delivery Method.

Only filters backed by real data may be functional.

For this phase:

- Category/family: functional because the catalogue already has family/category data.
- Search: functional.
- Price: only functional once a real price field exists.
- Country of origin: do not invent values; include only if current live data exposes trustworthy values.
- Brand: do not invent values; include only if current live data exposes trustworthy values.
- Delivery Method: do not invent values; include only if current live data exposes trustworthy values.

The UI must not present dead dropdowns that imply unsupported data. Unsupported filter concepts are omitted until their data contract exists.

### 6.3 Sort and view controls

Desktop results header includes:

- result count/status;
- sort control;
- grid/list toggle.

Initial safe sort options should use actual available fields, for example:

- recommended/default catalogue order;
- name A–Z;
- newest when a reliable created date is available.

Price sorting is only added when price data exists.

Grid is the primary/default display. List mode may be implemented if it can reuse the same product-card data contract cleanly; it must not block the core redesign.

## 7. Product cards

Each result card should be denser and more commerce-like than the current editorial preview cards, matching the client reference without becoming a generic marketplace clone.

Required card information when supported by real data:

- product image;
- small family label;
- product name;
- item/product code;
- size/variant summary where useful;
- price display when real price data exists;
- `View details` affordance.

Card click / View Details goes to the existing canonical route:

`/products/[family]/[product]`

Do not add directly to the inquiry basket from the Products grid in the first implementation unless doing so remains unambiguous about size/variant. The canonical add action belongs on Product Detail where the visitor can see the actual product information before adding.

## 8. Price requirement and current data gap

The client explicitly requests prices under products. The current transfer branch's live product model contains product identity, category, descriptions, variants, images, active state, slug, and timestamps, but does not expose a price field.

Therefore:

- no sample SAR amounts from the JPG may be copied into production;
- no random/static prices may be invented;
- the card/detail component architecture will include a price slot;
- numeric price is rendered only when a verified price source is available;
- until the real price contract is added, the safest customer-facing fallback is `Price on request` / equivalent Arabic copy, or omission if the client prefers no placeholder wording.

A later backend/admin price-field change must be separately coordinated because it changes the data contract beyond the current frontend-only redesign.

## 9. Product Detail → inquiry cart

The existing Product Detail route and inquiry store are retained as the canonical add-to-cart path.

The redesigned Product Detail summary should make the action more obvious:

- clear product identity and code;
- gallery/media;
- size/variant context;
- price or `Price on request` according to the real data contract;
- quantity selector;
- `Add to inquiry` / cart action;
- confirmation state after adding;
- `View inquiry` path;
- mobile sticky inquiry action retained/refined.

The existing inquiry store remains the underlying persistence mechanism. Do not introduce a second cart store.

## 10. Inquiry page

The Inquiry page is the cart-equivalent page.

It should clearly communicate that this is a quotation basket rather than a payment checkout.

Required behavior:

- selected product rows/cards;
- image where available;
- name/code/variant/size;
- quantity editing;
- notes;
- remove action;
- empty state with Products link;
- item count;
- clear list control with appropriate confirmation;
- prominent `Request quotation` progression.

Quotation submission continues through the existing `/request-quotation` flow and existing quotation payload/persistence architecture.

No payment fields are added.

## 11. Product Categories = catalogue access

The client's transcript is explicit that the category pictures should open the catalogues.

The five catalogue covers are:

- Scissors;
- Cutters;
- Punches;
- Chisels;
- Knives.

Design decision:

- retain the existing approved catalogue-cover artwork;
- display the five covers under `Product Categories` as shown in the reference hierarchy;
- clicking the cover opens the corresponding existing PDF catalogue in the browser;
- each card also exposes a visible `Download catalogue` control using the same existing PDF path;
- the product family route remains available elsewhere for browsing individual products;
- the catalogue cover itself is explicitly document-oriented, not a duplicate family-navigation card.

Existing PDF paths remain authoritative:

- `/media/catalogues/pdf/rosa-knives-catalogue.pdf`
- `/media/catalogues/pdf/rosa-scissors-catalogue.pdf`
- `/media/catalogues/pdf/rosa-punches-catalogue.pdf`
- `/media/catalogues/pdf/rosa-chisels-catalogue.pdf`
- `/media/catalogues/pdf/rosa-cutters-catalogue.pdf`

No separate Downloads page is needed for this phase because open + download can be completed directly from each catalogue card.

## 12. Direct contact band

The black WhatsApp/Email band visible in the JPG remains a useful conversion element on Products.

Use centralized Rosa contact data only.

Behavior:

- WhatsApp opens the existing configured WhatsApp destination;
- Email uses centralized email href;
- title remains concise, e.g. `Get in Touch Now`;
- no duplicated hard-coded contact values.

This is page content and is distinct from the global red footer ribbon.

## 13. About, Home, Inquiry, Contact middle content

The client's instruction is to standardize shell/pattern, not erase the approved middle-page work.

Therefore:

- Home retains its approved homepage content and client-feedback corrections;
- About retains the approved compact About narrative, images, compliance, documents placeholders, Business Growth geometry, and hover behavior;
- Inquiry is redesigned as the quotation cart workspace described above;
- Contact retains its core contact content, but receives the common banner/shell treatment;
- Products receives the largest middle-content redesign.

Do not replace approved About/Home content merely to imitate the Products JPG.

## 14. Responsive behavior

The redesign must be built for the existing responsive targets rather than one desktop screenshot.

Key targets:

- ~390px mobile;
- 768px tablet;
- 1024px laptop/tablet landscape;
- 1366px desktop/laptop;
- 1920px desktop;
- ~2560px wide desktop.

Rules:

- no horizontal page overflow;
- product filters collapse below desktop into a compact filter trigger/drawer/disclosure;
- product grid column count adapts without shrinking cards below readable/tappable sizes;
- catalogue covers become a horizontal snap rail or responsive grid on small screens;
- inquiry rows stack cleanly on mobile;
- shared banner uses existing desktop/mobile focal-point sources;
- shared header and footer remain identical in structure at every route and breakpoint;
- Arabic/RTL uses logical properties and existing locale infrastructure.

## 15. Motion and interaction

Reuse the existing motion system.

Allowed:

- current carousel transitions;
- restrained card image zoom on hover/focus;
- filter panel transition;
- button micro-interactions;
- existing Reveal/Stagger section entrances.

Avoid:

- scroll-jacking;
- continuous decorative animation in product grids;
- expensive per-card RAF loops;
- hover behavior that changes layout dimensions;
- motion that survives `prefers-reduced-motion`.

## 16. Accessibility

- real labels for search/filter controls;
- keyboard-operable carousel/filter/view controls;
- visible focus states;
- product images use useful alt text;
- decorative images are hidden from accessibility APIs when appropriate;
- colour alone does not communicate active filters/status;
- PDF open/download actions are distinguishable;
- inquiry quantity controls have accessible names;
- shared shell landmark hierarchy remains valid.

## 17. Data and backend boundaries

Frontend redesign may consume existing live data and existing inquiry/quotation functionality.

Do not silently introduce:

- payment infrastructure;
- new commerce/order tables;
- fake prices;
- fake stock quantities;
- fake country-of-origin values;
- fake delivery promises;
- unsupported certifications;
- new backend schema fields without an explicit coordinated implementation decision.

The price requirement is a known future data-contract extension unless a real existing source is identified during implementation planning.

## 18. Cloudflare/deployment constraints

The prepared transfer branch is intended to replace `roseMedicalFinal/main`, whose main branch triggers the existing Cloudflare/OpenNext deployment workflow.

This redesign must preserve:

- current package-manager/build contract;
- OpenNext configuration;
- Wrangler configuration;
- Cloudflare workflow paths/scripts;
- static asset paths needed by Cloudflare;
- existing public routing compatibility.

No deployment configuration change is required merely for this redesign.

## 19. Testing / acceptance gates

Implementation is not complete until fresh evidence covers at least:

### Shared shell
- Home, About, Products, Inquiry, Contact all render the same header structure;
- same red contact/social ribbon exactly once;
- same black footer exactly once;
- no page-local duplicate shell.

### Banner
- all five main pages render the reusable four-slide banner;
- correct per-page copy configuration;
- responsive focal points;
- keyboard/swipe/dots behavior;
- reduced motion.

### Products
- search returns/matches real catalogue products;
- family filter works;
- unsupported filters are not fake/dead controls;
- product cards link to canonical detail routes;
- product images load;
- price slot never fabricates numeric amounts;
- responsive grid has no overflow.

### Product Detail / inquiry
- Add to inquiry persists;
- duplicate add merges correctly;
- quantity is editable;
- inquiry count updates;
- remove/clear work;
- quotation progression retains the selected products.

### Catalogues
- all five catalogue cover links resolve to the correct existing PDFs;
- PDF opens correctly;
- download action targets the same correct file;
- no broken catalogue asset.

### Deployment
- lint;
- TypeScript;
- focused/unit tests;
- production Next build;
- OpenNext Cloudflare build where available;
- responsive Playwright coverage;
- post-push Cloudflare deployment status when the transfer is moved to the deployment repository.

## 20. Explicit non-goals

Not part of this phase:

- payment checkout;
- customer orders;
- payment gateway;
- shipping calculator;
- inventory reservation;
- separate Downloads main page;
- restoring Catalogues/Search to primary navigation;
- YouTube unless a verified Rosa profile is supplied;
- replacing the approved About/Home middle content wholesale;
- changing the five document/certificate placeholders without real source documents.

## 21. Final target experience

A visitor should experience Rosa Medical as one coherent procurement website:

1. consistent ROSA header;
2. consistent cinematic banner system;
3. page-specific middle content;
4. Products works like a compact professional catalogue marketplace;
5. product detail provides the canonical add-to-inquiry action;
6. Inquiry acts as the quotation cart;
7. catalogue artwork opens real family PDFs and supports direct download;
8. every main page ends with the same red contact/social ribbon and black footer;
9. no invented commercial, regulatory, pricing, stock, or delivery claims.
