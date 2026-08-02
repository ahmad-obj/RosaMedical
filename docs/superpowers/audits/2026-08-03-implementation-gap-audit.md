# Rosa Medical Implementation-Gap Audit

**Date:** 2026-08-03  
**Method:** Code-only repository audit  
**Audited application baseline:** `8ad8098e9999fbdd2ee65edeaa8410928922b8e8`  
**Audit execution branch:** `audit/implementation-gap-2026-08-03`  
**External runtime verification:** Not performed  
**Protected owner browser verification:** Not performed

## 1. Executive summary

Rosa Medical has a strong, verified static frontend foundation and several direct Supabase integrations, but it does not yet have one coherent production data and security architecture.

The current application has three overlapping implementation models:

1. Public product and editorial pages mostly read deterministic contract fixtures or the static frontend catalogue registry.
2. Several admin list and operational pages read or mutate Supabase directly.
3. A versioned OpenAPI 0.1 contract defines a different `/v1` public catalogue and inquiry interface that the active application does not implement.

This split explains the main implementation gap: the site looks substantially complete, but most approved end-to-end business journeys are either static, disconnected, runtime-unverified, or attached to an incompatible backend path.

The highest-risk findings are:

- **P0 owner authorization failure:** `requireAdmin()` accepts any authenticated Supabase user, not the single approved owner. Several sensitive API routes and server actions do not call any owner guard at all.
- **P0 server-side request forgery exposure:** the public contact handler fetches a URL supplied inside a visitor's message.
- **P0 product-model conflict:** the public product action routes to `/checkout`, the submission handler is `/api/checkout`, it requires a customer session, and its duplicate error calls the request an “order.” This conflicts with the accepted quotation-led model and no-public-registration rule.
- **P1 quotation-flow blocker:** no product selection reaches `/inquiry`; `/inquiry` is always empty, `/request-quotation` is always blocked, and `/checkout` resolves through the generic public catch-all rather than a purpose-built page.
- **P1 contract mismatch:** the active quote handler does not implement `POST /v1/public/inquiries`, does not accept contract inquiry items, does not require an `Idempotency-Key`, and does not persist immutable item snapshots.
- **P1 public/admin data split:** public products are fixture/registry-backed while admin lists read Supabase. A Supabase product change does not have a demonstrated path to the public catalogue.
- **P1 publishing absence:** Draft → Review → Public Preview → Explicit Publish, revision history, and rollback are intentionally represented only as static governance previews.

The repository verification from synchronization remains valuable: frozen install, contract generation/drift, lint, strict TypeScript, 207 unit/contract/static tests, production build, and 121 public Playwright cases passed. Those checks prove compilation, route composition, visual/static policies, and selected responsive behavior. They do not prove Supabase authorization, RLS, migrations, external services, API security, persistence, publishing, or protected owner behavior.

Because P0 security and product-boundary problems sit underneath every later feature, the next implementation batch should be **P0 Boundary Stabilization**, not broad CRUD or visual polish. The public procurement vertical slice should follow immediately after that boundary is secure and contract-aligned.

## 2. Audited baseline and limitations

### Status legend

1. **Verified implemented** — repository tests directly prove the stated behavior.
2. **Implemented, runtime-unverified** — code appears connected, but Supabase or an external runtime was not exercised.
3. **Partially implemented** — meaningful pieces exist but the journey is incomplete or disconnected.
4. **Static or placeholder only** — presentation or data shape exists without functional behavior.
5. **Missing** — no meaningful implementation evidence exists.
6. **Product-rule conflict** — behavior contradicts an accepted requirement.
7. **Obsolete or duplicate path** — a superseded or parallel path creates ambiguity.

### Severity legend

- **P0 — Product or security blocker**
- **P1 — Core business-flow blocker**
- **P2 — Major incompleteness**
- **P3 — Quality gap**
- **P4 — Cleanup**

### Audit limitations

- No Supabase credentials were requested or used.
- No authenticated owner session was fabricated.
- No real database, RLS, object storage, email, DNS, Cloudflare, or OpenNext runtime was exercised.
- Code that depends on those systems is not classified as runtime-verified.
- Repository history was used only as context. A commit message is not treated as proof when the corresponding reproducible migration, policy, seed, test, or runtime evidence is absent.
- Application code, schemas, contracts, environment configuration, security behavior, and deployment behavior were not changed.

## 3. Governing-source register

The audit applies the repository's accepted source hierarchy:

1. Owner's latest explicit decisions
2. Accepted decisions in `README.md`
3. Approved Figma visual intent
4. `packages/contracts/openapi/rosa-medical.v1.yaml`
5. Approved implementation plans
6. Tests and current implementation
7. Older records and assumptions

Primary sources reviewed:

- `README.md`
- `docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`
- `docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md`
- `docs/superpowers/plans/2026-08-02-main-frontend-f3ed-sync.md`
- `docs/superpowers/completions/2026-08-02-main-frontend-f3ed-sync.md`
- `docs/superpowers/completions/2026-08-02-rosa-medical-consolidated-frontend-verification.md`
- `docs/superpowers/completions/2026-08-02-frontend-backend-selective-integration.md`
- `packages/contracts/openapi/rosa-medical.v1.yaml`
- `packages/contracts/src/generated/schema.ts`
- `packages/contracts/src/fixtures/**`
- `apps/web/**`
- `services/api/README.md`
- root and web package/deployment configuration

The root README's G0–G7 table still says “Not started.” That table is stale relative to the current code and is recomputed in Section 8.

## 4. Current architecture map

### 4.1 Workspace and frontend

- Root workspace tooling is defined in `package.json` with Node `>=24 <25`, pnpm `11.4.0`, recursive lint/typecheck/test/build, and a combined `verify` command.
- `apps/web` is a Next.js 16 App Router application.
- Public routing is concentrated in `apps/web/src/app/(public)/[[...segments]]/page.tsx` and `apps/web/src/features/public-routing/resolve-public-page.tsx`.
- Admin routing is concentrated in `apps/web/src/app/admin/(workspace)/[...segments]/page.tsx` and the management/operations/governance route resolvers.
- The frontend contains mature F3 static compositions, preview states, responsive styles, and route inventories.

### 4.2 Public data

Public catalogue presentation is primarily static:

- `apps/web/src/features/public-catalogue/selectors.ts` reads `familyFixtures` and `productFixtures` from `@rosa/contracts/fixtures`.
- Detailed product pages resolve through `apps/web/src/features/catalogue-registry/**` and `product-detail.data.ts`.
- Public editorial values are kept in `apps/web/src/features/public-content-registry/**` and page-specific data files.

There is no demonstrated live public use of the Supabase `products`, `categories`, or `site_settings` records.

### 4.3 Supabase integration

Supabase is embedded directly inside the Next application:

- browser client: `apps/web/src/lib/supabase/client.ts`
- cookie-aware server client: `apps/web/src/lib/supabase/server.ts`
- session refresh: `apps/web/src/lib/supabase/middleware.ts`
- Next middleware entry: `apps/web/src/middleware.ts`
- authenticated-user guard: `apps/web/src/lib/supabase/auth-guard.ts`
- direct query helpers: `apps/web/src/lib/supabase/queries.ts`
- handwritten database record types: `apps/web/src/lib/supabase/types.ts`
- ad hoc route handlers under `apps/web/src/app/api/**`
- direct server actions in admin feature folders

This architecture may be valid, but it has not been reconciled with the planned separate `services/api` boundary or the accepted OpenAPI operations.

### 4.4 Shared contract

`packages/contracts/openapi/rosa-medical.v1.yaml` defines Contract 0.1:

- `GET /v1/health`
- `GET /v1/public/families`
- `GET /v1/public/products`
- `GET /v1/public/products/{slug}`
- `POST /v1/public/inquiries`

The inquiry contract requires:

- anonymous customer details;
- at least one structured item;
- product IDs, quantities, selected option IDs, and line notes;
- an `Idempotency-Key` header;
- immutable item snapshots in the response;
- the shared error envelope.

No active handler matching those `/v1` operations was found. The contract smoke test verifies the document's presence and operation IDs, not backend conformance.

### 4.5 Backend service boundary

`services/api/README.md` remains an unfilled declaration template. It contains no selected runtime, framework, migration command, seed command, auth strategy, storage provider, email provider, deployment target, or implementation.

The actual backend behavior currently resides in the Next application and an externally configured Supabase project.

### 4.6 Database reproducibility

Repository history includes a claim that Supabase was seeded and columns were added. No repository commit with “migration” or “RLS” evidence was found, and no reproducible migration, policy, or seed artifact was identified in the inspected implementation surface.

Therefore:

- table existence is runtime-unverified;
- RLS behavior is unavailable as code evidence;
- the sole-owner boundary cannot be delegated to an undocumented project configuration;
- another environment cannot be recreated from the repository alone.

### 4.7 Deployment

- `apps/web/open-next.config.ts` calls `defineCloudflareConfig()`.
- `@opennextjs/cloudflare` is declared as `latest` in `apps/web/package.json` rather than an exact or bounded version.
- The Next production build passed in synchronization verification.
- No production deployment, secret, DNS, observability, backup, or restore evidence is claimed by this audit.

## 5. Product-rule conflict register

| Finding ID | Severity | Accepted rule | Active paths | Current behavior | Useful behavior to preserve | Smallest safe correction | Verification required |
|---|---|---|---|---|---|---|---|
| AUD-P0-01 | P0 | One protected owner; no multi-admin model | `apps/web/src/lib/supabase/auth-guard.ts`, admin layout, admin APIs/actions | `requireAdmin()` accepts any authenticated user. Sensitive handlers/actions do not consistently call it. | Supabase session handling, login, logout, protected workspace layout | Introduce one server-only `requireOwner()` policy using a configured immutable owner identity; call it from every admin page mutation, admin API handler, and server action; back it with repository-owned RLS/policy evidence | Unit tests for owner/non-owner/anonymous; route/action tests; real owner E2E later |
| AUD-P0-02 | P0 | Public contact must be safe and bounded | `apps/web/src/app/api/contact/route.ts` | A visitor-controlled URL inside `message` is fetched server-side and its HTML is parsed | Honeypot, simple local spam checks, cached classification concept | Remove remote URL fetching from request processing. Use bounded text-only checks or a vetted asynchronous service with strict allowlisting, DNS/IP controls, size limits, timeouts, and no private-network access | Handler tests with private/link-local/redirect payloads; rate/size tests |
| AUD-P0-03 | P0 | Quotation-led; no public checkout, orders, or public customer login | `product-procurement-summary.tsx`, `/api/checkout`, public catch-all, F3B E2E | Desktop/tablet links “Add to inquiry” to `/checkout`; API requires an authenticated user and uses “order” terminology | Duplicate detection concept and `quote_requests` persistence | Retire checkout/cart/order terminology and route. Route selection to `/inquiry`; expose a public, anonymous, contract-aligned inquiry submission path | Public E2E from product to inquiry; anonymous submission; no checkout/order text or routes |
| AUD-P1-01 | P1 | Inquiry items preserve structured immutable snapshots | `/api/checkout`, `QuoteRequest`, OpenAPI inquiry schemas | Handler accepts only contact fields/message, stores no item collection, selected options, product code/name/family snapshot, or general/line-note separation | Existing quote-request queue and admin review UI | Implement `InquiryRequest` and snapshot persistence from the accepted contract; use a server-generated reference and status | Contract conformance, database snapshot assertion, mutation-after-submit test |
| AUD-P1-02 | P1 | Public website reflects explicitly published content | fixture selectors, catalogue registry, Supabase-backed admin list pages | Public products use fixtures/static registry while admin list pages read Supabase | Existing F3 public composition and current Supabase records | Establish one repository adapter and published read model used by public pages and admin preview; do not let drafts leak publicly | Adapter tests; published/hidden cases; public E2E against test backend |
| AUD-P1-03 | P1 | Draft → Review → Public Preview → Explicit Publish | admin editors, publishing page, revisions page | Editors and all governance actions are disabled/static; no queue, validation, transaction, revision, or rollback persistence | Approved governance UI and policy copy | Implement one product publishing vertical slice before broad content CRUD | Failed publish preserves prior public state; revision records; rollback-as-new-revision |
| AUD-P2-01 | P2 | No public prices, inventory, or commerce domain | `apps/web/src/lib/supabase/types.ts`, admin product list | Product types contain `price`, `price_override`, `stock_status`, and `sell_mode`; admin surfaces stock/sell mode as options | Existing product identifiers, bilingual text, category relation | Remove commerce fields from shared/public/admin version-one models or isolate them from Rosa's accepted domain with an explicit owner decision | Type/schema drift tests and prohibited-vocabulary policy test |
| AUD-P2-02 | P2 | Product inquiries and general messages remain separate | contact UI/API and quote API | Separation is clear in UI, but contact fields rendered by the form are not all sent by the client; quote path is incompatible | Existing separate tables and separate admin screens | Send and validate all intended contact fields; keep contact and inquiry contracts/routes distinct | Component-to-handler payload tests and separate persistence assertions |
| AUD-P2-03 | P2 | Exact approved routes should have meaningful behavior | public catch-all resolver | Unknown non-product routes render a generic placeholder. `/checkout` therefore appears as a placeholder instead of a strict 404 or approved flow | Catch-all route architecture | Resolve only approved public paths; use strict not-found for unknown paths; explicitly implement `/inquiry` flow | Route inventory and strict-not-found browser tests |

## 6. Business-journey evidence matrix

### 6.1 Public discovery and product browsing

**Primary status: Partially implemented**

| Capability | Evidence | Assessment |
|---|---|---|
| Public routes and responsive composition | public catch-all route, route inventory, F3A–F3D browser tests | Verified for selected fixture-backed states |
| Five product families | contract fixtures and catalogue registry | Verified as static source data |
| Family and product detail | family/product components and F3B tests | Verified static rendering and responsive containment |
| Live published records | no active contract endpoint or public Supabase adapter | Missing |
| Published-only filtering | no public persistence boundary | Missing |
| Loading/error behavior for live reads | static preview components only | Static or placeholder only |
| Admin-to-public consistency | admin lists use Supabase; public uses fixtures/registry | Disconnected |

The public catalogue is visually mature but not a live published catalogue.

### 6.2 Product inquiry and quotation request

**Primary status: Product-rule conflict**

Current path:

`Product detail → /checkout link on desktop/tablet → generic catch-all placeholder`

Mobile stops earlier because the sticky “Add to inquiry” button is disabled.

Other approved routes are also static:

- `/inquiry` always renders `EmptyInquiryPage`.
- `/request-quotation` always renders `QuotationBlockedPage`.

The active submission handler:

- is `/api/checkout`, not `/v1/public/inquiries`;
- requires a Supabase user;
- accepts no products/options/quantities;
- hashes only the free-text message;
- inserts no immutable item snapshots;
- uses “order” language.

No complete product-to-owner inquiry journey exists.

### 6.3 General contact submission

**Primary status: Implemented, runtime-unverified**

Connected code exists:

`ContactPage → ContactFormPreview → POST /api/contact → contact_messages → AdminMessagesPage`

Positive evidence:

- public form is interactive;
- general contact is visibly separated from product inquiry;
- loading, success, and error states exist;
- anonymous persistence is intended;
- spam messages are filtered from the admin list.

Gaps and risks:

- remote URL crawling is a P0 SSRF issue;
- `company`, `country`, and `subject` fields are rendered but omitted from the client request body;
- no request length limits, rate limiting, idempotency, shared error envelope, or repository-owned RLS proof was identified;
- API and database runtime remain unverified;
- existing tests render static markup and do not execute the handler.

### 6.4 Owner login, session, recovery, and logout

**Primary status: Partially implemented**

Implemented code:

- password login action;
- Supabase cookie-aware server client;
- session-refresh middleware;
- authenticated workspace redirect;
- logout action.

Missing or unsafe:

- no single-owner enforcement beyond “authenticated user exists”;
- recovery remains a disabled static preview;
- no repository-backed owner allowlist/claim/role policy;
- no verified expiry, rotation, revocation, recovery, or protected browser flow;
- sensitive API routes and actions are not consistently guarded.

G4 is blocked by AUD-P0-01.

### 6.5 Product and family management

**Primary status: Partially implemented**

- Product and family list pages read Supabase directly.
- Add buttons are disabled.
- Search/filter/pagination controls on product lists are preview controls rather than connected data operations.
- Product and family editors read the static catalogue registry, not the live list records.
- Save, review, preview, publish, archive, delete, media, and featured-product actions are disabled.
- Several “Open editor” links return to collection roots instead of opening row-specific records.

The list layer is runtime-unverified live read-only; CRUD and coherent record editing are absent.

### 6.6 Catalogues and media management

**Primary status: Static or placeholder only**

- Catalogue rows are generated from live categories, not catalogue/PDF records.
- Every PDF is “Awaiting publication.”
- Upload and replacement are disabled.
- Media cards are derived requirements from products/categories, not stored assets.
- No file metadata, validation, alt text persistence, usage mapping, upload, replacement history, object storage, or safe download path was found.

### 6.7 Website content and contact-detail management

**Primary status: Partially implemented**

- Website-content admin reads `site_settings` and overlays values on a static content-block model.
- It does not save values.
- Public pages still use static `PUBLIC_CONTENT_VALUES` and page data, so the live settings are not demonstrated as public content.
- Contact-details admin is entirely static and all workflow buttons are disabled.
- Protected design-system boundaries are correctly represented and should be preserved.

### 6.8 Draft, review, public preview, publish, revisions, and rollback

**Primary status: Static or placeholder only**

The approved workflow is accurately documented in UI and tests, but the current pages explicitly state:

- no publishing queue;
- no live validation engine;
- no preview build;
- no publish action;
- no revision history;
- no compare or restore behavior;
- no rollback persistence.

Tests deliberately verify the absence of live records and mark populated examples as preview-only.

### 6.9 Search

**Primary status: Static or placeholder only**

`SearchDefaultPage` renders a read-only search input and explicitly states that interactive search is unavailable. Search result/loading/error/no-result preview components exist, but no live query, index, URL-state integration, or relevance behavior is connected.

### 6.10 Arabic and RTL readiness

**Primary status: Partially implemented**

Positive evidence:

- OpenAPI localized text uses paired `en`/`ar` fields.
- Supabase handwritten types include bilingual names/descriptions/settings.
- Admin field previews include RTL examples and “Not supplied” states.

Missing:

- no public locale routing or language control;
- no Arabic content publication;
- no complete RTL public/admin journey;
- no Arabic font decision demonstrated in runtime;
- no locale-specific metadata or E2E acceptance.

### 6.11 Accessibility, performance, resilience, and deployment readiness

**Primary status: Partially implemented**

Verified repository qualities:

- semantic/static component tests;
- responsive public Playwright matrix;
- no-overflow checks on selected routes;
- strict typecheck, lint, build, and deterministic contract generation;
- focus/reduced-motion/design policies in the F3 frontend.

Unverified or missing:

- protected admin browser accessibility;
- API abuse/rate/size protection;
- CSP and security headers evidence;
- structured request IDs and logs;
- backup/restore;
- production monitoring and alerts;
- real Cloudflare deployment;
- pinned OpenNext adapter version;
- external service failure behavior.

## 7. F0–F9 frontend-layer assessment

| Layer | Evidence-based status | Conclusion |
|---|---|---|
| F0 — Workspace and route skeleton | Verified implemented | Workspace, route dispatch, inventories, typecheck, tests, and build exist |
| F1 — Layout foundations | Verified implemented | Public/admin shells, containers, responsive layouts, skip/main structure, and tests exist |
| F2 — Design foundations | Verified implemented | Tokens, components, feedback states, F3 policy/style tests, and visual system exist |
| F3 — Static page composition | Verified implemented | Approved public/admin compositions and preview states are extensive and tested |
| F4 — Mocked behavior and typed adapter | Missing/bypassed | No complete MSW mode or one mock/live repository boundary was identified; pages use fixtures, static registries, direct fetches, direct Supabase, and server actions |
| F5 — First live vertical slice | Blocked | Product-to-inquiry flow is disconnected and contract-incompatible |
| F6 — Full live integration | Partially implemented | Contact and selected admin reads/mutations are connected; most approved systems are not |
| F7 — Visual refinement | Partially implemented | Strong F3 polish exists, but final client media and several live-state refinements remain |
| F8 — Arabic and RTL | Partially implemented | Data shapes and preview states exist; public locale behavior does not |
| F9 — Production hardening | Partially implemented/blocked | Build and public checks pass, but P0 security, runtime, backup, observability, and deployment proof are absent |

## 8. G0–G7 integration-gate assessment

| Gate | Recomputed status | Evidence and blocker |
|---|---|---|
| G0 — Workspace and contract | Partially ready | Workspace and OpenAPI package are verified; backend architecture declaration and accepted implementation boundary are absent |
| G1 — Health and fixtures | Blocked | Fixtures exist, but no active `/v1/health`, no conforming backend harness, and no mock/live adapter |
| G2 — Public catalogue reads | Blocked | Public UI uses fixtures/static registry; no conforming live published endpoints or adapter |
| G3 — Public submissions | Blocked | Contact is connected but unsafe/runtime-unverified; inquiry path conflicts with contract and product rules |
| G4 — Owner authentication | Blocked — P0 | Authenticated-user check is not sole-owner authorization; recovery and protected runtime acceptance are missing |
| G5 — Admin content | Partially ready | Some live reads and operational mutations exist; CRUD, media, contact details, public coupling, and authorization are incomplete |
| G6 — Publishing and revisions | Not started operationally | Only static governance previews and policies exist |
| G7 — Arabic and production | Blocked | Partial data readiness and build checks exist; no locale acceptance, production security, backup, observability, or deployment proof |

No gate requiring real Supabase or external-service behavior is marked accepted in this code-only audit.

## 9. Security and authorization observations

### 9.1 Owner boundary

`requireAdmin()` returns any authenticated Supabase user. It does not validate:

- a configured owner user ID;
- a verified immutable owner email;
- an owner claim;
- an owner table;
- an allowlist;
- a role constrained to exactly one account.

The login action also accepts any valid Supabase credential. This conflicts directly with the one-owner requirement.

### 9.2 Unguarded sensitive operations

The following sensitive paths contain no explicit owner guard:

- `GET /api/inquiries`
- `POST /api/inquiries/update`
- `GET /api/messages`
- inquiry status server action
- message status/note server action

RLS may exist in the external Supabase project, but no repository evidence proves it. Security cannot depend on an undocumented runtime assumption.

### 9.3 Public contact URL fetching

`/api/contact` extracts the first word beginning with `http` and fetches it from the server. The handler does not demonstrate:

- DNS/IP validation;
- private/link-local/loopback blocking;
- redirect revalidation;
- content-length limits;
- content-type allowlisting;
- response streaming bounds.

This should be removed from the synchronous public request path.

### 9.4 Input and error handling

Ad hoc handlers generally lack:

- schema validation derived from the shared contract;
- normalized field errors;
- request IDs;
- bounded input lengths;
- rate limiting;
- consistent idempotency;
- explicit authorization errors;
- consistent database error handling.

### 9.5 Reproducible policy evidence

No repository-owned migration/RLS/seed path was identified. Runtime table updates mentioned in commit history are not reproducible or reviewable security evidence.

## 10. Contract and data-flow mismatches

| Area | Accepted contract/design | Active implementation | Impact |
|---|---|---|---|
| Public API base | `/v1` | ad hoc `/api/*` routes | Generated client and backend cannot be treated as one interface |
| Public families/products | published API reads | fixture/static registry | Admin/live data cannot reliably reach public pages |
| Inquiry endpoint | `POST /v1/public/inquiries` | `POST /api/checkout` | Operation path and semantics conflict |
| Inquiry auth | public quotation request | authenticated user required | Introduces prohibited public customer-account dependency |
| Inquiry payload | customer fields + structured items | name/email/phone/message only | Product requirements are lost |
| Inquiry idempotency | required header and content-safe reuse | hash of message scoped to user | Cannot safely detect equivalent structured requests |
| Inquiry snapshot | immutable product/options/quantity snapshot | no snapshot fields | Historical review is not trustworthy |
| Error format | shared `ErrorEnvelope` | `{ error: string }` | Client handling is inconsistent |
| Contact payload | rendered company/country/subject fields | client sends only core fields/honeypot | User-entered data is silently dropped |
| Product model | no public commerce domain | price/price override/stock/sell mode fields | Product model carries prohibited concepts |
| Content management | drafts and explicit publish | read-only site settings overlay | No controlled public change path |

## 11. Test-evidence truth table

| Evidence | What it proves | What it does not prove |
|---|---|---|
| Frozen pnpm 11.4.0 install | lockfile/manifests install reproducibly in the verification run | live services or deployment |
| Contract generation and drift | generated types match the OpenAPI source | any handler implements the contract |
| Contract smoke tests | OpenAPI version, paths, and operation IDs exist and are unique | response conformance, persistence, auth, or error behavior |
| ESLint and strict TypeScript | checked code satisfies configured static rules | business correctness or security |
| 207 unit/contract/static tests | tested components, policies, route models, and source assertions pass | real Supabase, RLS, email, storage, owner session, or transactions |
| `backend-integration-boundary.test.ts` | selected files exist and the workspace layout calls `requireAdmin()` | that `requireAdmin()` enforces one owner or that APIs/actions are protected |
| Contact component test | form markup and isolated preview states render | `/api/contact`, persistence, spam behavior, SSRF safety, or delivery |
| Publishing/revision tests | approved vocabulary exists and live queues/history are absent | publishing or rollback behavior |
| 121 public Playwright cases | selected public pages load at three breakpoints and meet asserted responsive behavior | protected admin, live data, inquiry submission, persistence, or authorization |
| F3B product-detail E2E | desktop/tablet link to `/checkout`; mobile button is disabled | a working inquiry journey; the test currently codifies the product conflict |
| Production Next build | application compiles for production | Cloudflare deployment or runtime compatibility with external services |

No test evidence was found for:

- sole-owner authorization;
- RLS policy behavior;
- inquiry/contact handler validation;
- immutable snapshots;
- idempotency conflict behavior;
- API route protection;
- SSRF prevention;
- publishing transactions;
- rollback;
- migration reproducibility;
- backup/restore;
- email delivery;
- object storage.

## 12. Obsolete or duplicate paths

| Path/pattern | Classification | Risk |
|---|---|---|
| static catalogue registry versus Supabase product/category lists | Duplicate data source | public and admin can disagree |
| OpenAPI `/v1` contract versus ad hoc `/api` handlers | Duplicate interface | typed contract provides false confidence |
| `/api/inquiries/update` versus inquiry server action | Duplicate mutation path | inconsistent authorization and validation |
| `/api/messages` plus message server action | Split read/write boundary | policy and error handling differ |
| static admin editors versus live admin collections | Duplicate record model | “Open editor” does not edit the selected live record |
| `ContactFormPreview` used as production form | Misleading active-preview name | tests and maintainers may mistake real behavior for isolated preview |
| numerous preview-state components beside active pages | Intentional but maintenance-sensitive | preview-only behavior can be confused with production behavior |
| `apps/web/tree_output.txt` | Tracked generated inventory | becomes stale and duplicates repository structure |
| `services/api` planned boundary versus embedded Next/Supabase backend | Architectural duplication | ownership and deployment responsibility remain ambiguous |
| generic public catch-all placeholder | Obsolete fallback behavior | invalid paths appear valid and hide missing routes |

Historical documentation should remain intact, but current coordination should explicitly identify which paths are active and which are preview or legacy structures.

## 13. Prioritized corrective roadmap

### Batch 1 — P0 Boundary Stabilization

Purpose: make the current architecture safe and consistent enough for further feature development.

1. Define and test one server-only sole-owner authorization policy.
2. Apply it to the admin workspace, all admin route handlers, and all admin server actions.
3. Add repository-owned migration/RLS/policy/seed evidence for the current Supabase model, without inventing multi-admin roles.
4. Remove visitor-controlled server-side URL fetching from the contact request path.
5. Add bounded validation, safe error envelopes, and rate/size controls to public submissions.
6. Retire or quarantine `/checkout`, cart/order terminology, and public-user authentication assumptions.
7. Add strict route tests so unsupported public paths return not-found rather than a generic placeholder.

### Batch 2 — Contract-Aligned Public Procurement Vertical Slice

`Products → Family → Product detail → Inquiry selection → Quotation submission → Owner-visible inquiry`

- select one public/live product read adapter;
- use generated Contract 0.1 types;
- support anonymous inquiry selection;
- persist immutable item snapshots;
- implement idempotency safely;
- show loading, validation, success, retryable failure, and non-retryable failure;
- display the submitted snapshot in the guarded owner queue.

### Batch 3 — Product Publishing Vertical Slice

`Owner login → Product draft → Validate → Public preview → Explicit publish → Public record → Revision history`

- connect one live editor;
- preserve the prior public state on failure;
- record immutable revisions;
- implement rollback as a new revision.

### Batch 4 — Remaining managed systems

- families and featured slots;
- catalogues and safe PDFs;
- media storage and usage mapping;
- general-message workflow hardening;
- website content and contact details;
- search;
- Arabic/RTL;
- production security, observability, backup, and deployment acceptance.

## 14. Recommended next implementation batch

### Recommendation: Batch 1 — P0 Boundary Stabilization

The previously expected public procurement slice should not begin on top of the current authorization and submission boundaries.

#### Exact scope

- Replace `requireAdmin()` semantics with a sole-owner server policy while preserving current Supabase session mechanics.
- Guard `GET /api/inquiries`, `POST /api/inquiries/update`, `GET /api/messages`, inquiry mutations, and message mutations.
- Add reproducible policies/migrations needed to support those checks.
- Remove contact-route remote URL crawling and add bounded request validation.
- Remove the active `/checkout` product action and all “order/cart/checkout” public terminology; use an explicitly unavailable `/inquiry` action until Batch 2 completes rather than presenting a false flow.
- Add security-focused unit/handler/static tests and protected-route test fixtures without bypassing production auth.

#### Out of scope

- broad product CRUD;
- full inquiry selection;
- publishing;
- visual redesign;
- Arabic;
- deployment.

#### Acceptance criteria

- Anonymous and authenticated non-owner callers cannot read or mutate admin data.
- The configured owner can reach every intended admin operation in a controlled test environment.
- Public contact cannot cause arbitrary outbound server requests.
- No active public route, component, handler, type, or test presents checkout/order/cart behavior.
- No application action implies that inquiry selection works before Batch 2.
- Repository-owned policy/migration evidence is sufficient to recreate the protected boundary.
- Lint, strict TypeScript, tests, build, and focused security tests pass.

## 15. Recheck against latest main

At audit start, latest `main` was:

`8ad8098e9999fbdd2ee65edeaa8410928922b8e8`

Before finalizing this branch, `main` must be checked again. If it advances, changed application files must be reviewed and the affected findings updated. Documentation-only commits on the audit branch do not alter the audited application baseline.

## 16. Acceptance checklist

- [x] Every approved public and admin journey has a primary status.
- [x] F0–F9 has an evidence-based assessment.
- [x] G0–G7 has an evidence-based assessment.
- [x] Product-rule conflicts name exact active paths and smallest corrections.
- [x] Runtime-dependent claims are marked unverified.
- [x] Tests are credited only for behavior they directly prove.
- [x] Obsolete and duplicate paths are identified without deletion.
- [x] No application behavior, contract, schema, security, environment, or deployment configuration was changed.
- [x] One exact next implementation batch is recommended.
- [ ] Latest `main` rechecked immediately before finalization.
