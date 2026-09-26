# Rosa Medical

> **MANDATORY STARTING POINT FOR BOTH DEVELOPERS AND BOTH AIs**
>
> Read this entire file at the beginning of every Rosa Medical work session, before planning, coding, changing contracts, or reviewing work. Re-read it after pulling changes from the other lane. This file is the standing communication channel between Ahmad's frontend AI and the backend partner's AI.

**Last coordination update:** 2026-08-09 00:44 PKT
**Repository:** `manbtd0-cloud/RosaMedical`  
**Approved Figma source:** `https://www.figma.com/design/L7LKGItaD2o6tZzHuw1GUQ`  
**Master implementation plan:** `docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md`

---

## Current synchronized checkpoint — 2026-08-02

`main` is the authoritative integrated branch for backend, security, Supabase, authentication/session handling, environment and middleware decisions, API routes, live persistence, package/deployment configuration and Cloudflare/OpenNext behavior.

The later verified frontend work from `frontend/f3e-d-governance` has been synchronized into the main-derived branch `integration/main-frontend-f3ed-sync`.

- Original main before synchronization: `8ba83e42f796c44a34e8eed75e1643c1b808dcea`
- Immutable safety backup: `backup/main-before-frontend-f3ed-sync-2026-08-02`
- Shared integration checkpoint: `e31b6e90267c193c8571ad5800117a57f8732f29`
- Later frontend source: `caef8027975f235a115c1d931cbec455645aa209`
- Verified synchronized source: `2e3bb2f6008b87891973f8677a9fac5df3ee79ad`
- Verification run: `30759848449`
- Completion record: `docs/superpowers/completions/2026-08-02-main-frontend-f3ed-sync.md`

Fresh synchronized verification passed frozen pnpm installation, contract generation/drift, lint, strict TypeScript, 207 unit/contract/static tests, production build and 121 public desktop/tablet/mobile Playwright cases with 2 intentional skips and 0 failures.

Protected admin browser verification still requires a real configured Supabase owner session. Security was not bypassed and no fake owner session was introduced.

Future work starts from updated `main`. The older static-only frontend branch remains history and is no longer the continuation base.

---

## 1. Message to the backend partner's AI

Hello. I am the AI working with Ahmad on the frontend, product design, public website, and admin experience.

Our owners are a two-person development team:

- **Frontend lane:** Ahmad and Ahmad's AI
- **Backend lane:** Ahmad's partner and the partner's AI

Our owners have decided that this `README.md` is the shared, persistent communication channel between us. You must read it at the beginning of every session. Do not rely only on chat memory, assumptions, old branches, or verbal summaries.

When you finish meaningful backend work, discover a blocker, change an endpoint, alter a shared data model, or need a frontend decision, update your owned section in this file and append a dated entry to the communication log. Do not erase the frontend lane's messages or rewrite accepted shared decisions.

The frontend will be built in layers using typed mock data before live backend integration. You are free to choose the backend's internal framework and implementation details, but the public interface between frontend and backend is shared and contract-first. Changes to that interface must be communicated here and represented in the versioned OpenAPI contract.

---

## 2. Non-negotiable session protocol

Every AI working in this repository must perform these steps in order:

1. Pull or fetch the latest shared branch state.
2. Read this entire `README.md`.
3. Read the latest entries in **Messages between AIs**, **Shared decision ledger**, **Integration gates**, and both progress lanes.
4. Inspect the versioned API contract before changing shared request or response shapes.
5. Work only in the files owned by the current lane unless a shared change has been agreed.
6. Run the lane's required verification commands.
7. Update the relevant progress lane and append one concise dated communication entry.
8. State exact files, endpoints, migrations, tests, and blockers. Do not write vague updates such as “backend done” or “frontend mostly complete.”

No AI may silently change a shared interface and expect the other lane to discover it from failing code.

---

## 3. Source-of-truth hierarchy

When information conflicts, resolve it in this order:

1. The owners' latest explicit decision
2. Accepted decisions in this `README.md`
3. Approved Figma designs for visual structure and behavior
4. Versioned OpenAPI contract for frontend/backend interfaces
5. Approved implementation plans in `docs/superpowers/plans/`
6. Tests and current implementation
7. Old chat summaries, temporary notes, and assumptions

The Figma file controls visual intent. The OpenAPI contract controls network interfaces. Neither lane may reinterpret the other source casually.

---

## 4. Locked product and design decisions

These decisions are already approved:

- Public brand name and logo treatment: **ROSA** only; do not add “Medical” to the logo.
- Public positioning: medical instruments supplier and procurement partner.
- Primary product families: Knives, Scissors, Punches, Chisels, and Cutters.
- Public website is quotation-led, not ecommerce.
- No public prices, payments, checkout, inventory, shipping, discounts, ratings, or orders.
- One protected owner admin account; no public registration and no multi-admin roles in version one.
- Product inquiries and general contact messages are separate systems.
- Editable content follows Draft → Review → Public Preview → Explicit Publish.
- Published content retains revision history; rollback creates a new revision.
- Public logo, typography, colours, spacing, components, templates, and navigation remain protected from admin editing.
- English is implemented first, but data structures must include paired English and Arabic fields from the beginning.
- Do not publish unverified manufacturing, factory, certification, ownership, award, export, legal, or clinical claims.
- Placeholder contact details and media must remain clearly identifiable until replaced with verified client data.

---

## 5. Parallel implementation model

The team will not wait for the entire backend before building the frontend.

### Frontend lane

The frontend will progress in visible layers:

1. Repository and route skeleton
2. Design tokens and basic layout primitives
3. Public and admin page shells using neutral placeholders
4. Static Figma-matched sections
5. Typed fixtures and Mock Service Worker responses
6. Functional local interactions and form validation
7. Live API integration endpoint by endpoint
8. Arabic/RTL adaptation
9. Accessibility, performance, security, and deployment hardening

The earliest frontend layers must remain intentionally basic. First establish routes, hierarchy, grids, header/footer/admin shell, responsive behavior, and stable component boundaries. Decorative polish and advanced motion are added only after the structure is correct.

### Backend lane

The backend partner owns internal backend choices, database implementation, authentication implementation, storage, email delivery, and deployment details. The backend must satisfy the shared contract and product rules.

Recommended backend progression:

1. Declare backend stack, local run command, test command, and deployment target in the backend lane below.
2. Review and negotiate the shared OpenAPI contract.
3. Establish database schema and migrations.
4. Implement health and fixture-backed development endpoints.
5. Implement public read APIs.
6. Implement inquiry and message submission.
7. Implement single-owner authentication.
8. Implement admin content management.
9. Implement publishing, revisions, and rollback.
10. Implement media/catalogue storage, email delivery, security, backups, and production deployment.

The backend may use any sensible internal stack, but it must not make the frontend depend on backend framework internals.

---

## 6. Target repository boundaries

```text
RosaMedical/
├── README.md                         # Mandatory AI-to-AI coordination channel
├── apps/
│   └── web/                          # Frontend-owned Next.js application
├── services/
│   └── api/                          # Backend-owned implementation boundary
├── packages/
│   └── contracts/                    # Shared OpenAPI contract, generated types, fixtures
├── docs/
│   ├── superpowers/                  # Approved specs, plans, and completion records
│   ├── architecture/                 # Shared architecture and data-flow records
│   └── runbooks/                     # Local, staging, production, backup, recovery notes
└── .github/                          # Minimal CI only when useful; avoid wasteful Actions runs
```

### Ownership rules

- `apps/web/**`: frontend lane owns implementation.
- `services/api/**`: backend lane owns implementation.
- `packages/contracts/**`: shared ownership; breaking changes require agreement.
- `README.md`: shared, but each AI edits only its lane, shared ledger entries, and new messages.
- `docs/superpowers/**`: plans and records; do not rewrite approved history without recording why.
- Root tooling files: shared. Coordinate before changing Node, package-manager, workspace, formatting, or CI configuration.

---

## 7. Branch and integration rules

Use focused branches:

- Frontend: `frontend/<layer-or-feature>`
- Backend: `backend/<layer-or-feature>`
- Shared contracts: `contracts/<change>`
- Integration fixes: `integration/<gate>`

Rules:

- `main` is the integrated, reviewable branch.
- Do not develop unrelated frontend and backend changes directly on `main`.
- Pull the latest `main` before opening or updating a shared contract change.
- Keep commits meaningful. Do not create a commit for every trivial visual adjustment.
- Avoid unnecessary GitHub Actions runs. Prefer local lint, typecheck, unit, component, and end-to-end checks before pushing.
- A contract-breaking pull request must include migration notes and the corresponding frontend/backend impact.

---

## 8. Shared API contract rules

The shared boundary will use a versioned OpenAPI 3.1 document under `packages/contracts/openapi/`.

Contract rules:

- Backend behavior must match the accepted contract.
- Frontend types and mock handlers are generated or derived from the same contract.
- Use JSON for API payloads except file upload/download operations.
- IDs are opaque strings; UUIDs are recommended internally.
- Timestamps are ISO 8601 UTC strings.
- Public responses expose published content only.
- Admin responses require the protected owner session.
- Inquiry items preserve a submitted product snapshot even if the current product changes later.
- Errors use one shared envelope with a stable machine code, human-safe message, optional field errors, and request identifier.
- Pagination, filtering, sorting, and language behavior must be consistent across endpoints.
- Breaking changes require a new accepted ledger decision and contract version or migration path.

The frontend will use typed mock responses until each integration gate is accepted.

---

## 9. Integration gates

| Gate | Frontend evidence | Backend evidence | Status |
|---|---|---|---|
| G0 — Workspace and contract | Web scaffold runs; contract package generates types | Backend lane declares stack and can consume contract | Not started |
| G1 — Health and fixtures | Frontend API adapter switches between mock/live modes | `/health` and deterministic development fixtures work | Not started |
| G2 — Public catalogue reads | Product/family/catalogue pages render from typed API client | Published families, products, product detail and catalogues endpoints pass contract tests | Not started |
| G3 — Public submissions | Inquiry and contact forms pass validation and mock submission tests | Inquiry/message persistence and email notification work idempotently | Not started |
| G4 — Owner authentication | Admin login/session UI handles all states | Secure owner login, recovery, session and logout work | Not started |
| G5 — Admin content | Admin editors use typed live API | Product, family, catalogue, media, content and contact CRUD work | Not started |
| G6 — Publishing and revisions | Review, preview, publish and rollback UI works live | Draft/published revisions, validation and rollback are transactional | Not started |
| G7 — Arabic and production | RTL, accessibility and production frontend checks pass | Locale data, security, backups, observability and production deployment pass | Not started |

An integration gate is accepted only when both lanes add evidence and both owners agree it is ready.

---

## 10. Frontend lane — owned by Ahmad's AI

**Current status:** F0–F3E-D static frontend is synchronized into `main`. The first public quotation interaction slice is implemented and verified on PR `#15`; real Supabase acceptance remains pending.

**Current branch:** `frontend/public-quotation-slice`.

**Next work:**

- Verify one real `quote_requests` insert and exact-duplicate rejection against configured Supabase.
- Verify the protected owner can sign in and see the submitted immutable snapshot in `/admin/inquiries`.
- Add accepted production abuse protection and transactional inquiry notification without expanding into ecommerce.
- Continue remaining live catalogue/admin integration only through agreed boundaries.

**Current blockers:** Real Supabase environment/session acceptance, anonymous-submission abuse controls, transactional email delivery, and client-supplied contact, media, legal and Arabic data.

**Message to backend AI:** Review the new app-owned quotation boundary and runtime checklist in `docs/superpowers/completions/2026-08-03-public-quotation-slice.md`. No OpenAPI source, database migration or `services/api/**` file changed.

---

## 11. Backend lane — owned by the partner's AI

> Backend AI: update this section. Preserve the heading and fields so the frontend AI can reliably scan it.

**Current status:** Awaiting backend AI acknowledgement.

**Chosen backend stack:** Not yet declared.

**Local run command:** Not yet declared.

**Test command:** Not yet declared.

**Migration command and strategy:** Not yet declared.

**Database:** PostgreSQL is recommended; final backend choice must be recorded here.

**Authentication approach:** Must support one secure owner account, password recovery, session expiry, and logout. Final approach not yet declared.

**Object/file storage:** Not yet declared.

**Transactional email provider:** Not yet declared.

**Deployment target:** Not yet declared.

**Current branch:** Not yet declared.

**Completed endpoints/migrations:** None reported.

**Current blockers or questions for frontend:** None reported.

**Latest message to frontend AI:** Please acknowledge this protocol and record your architecture before implementation.

---

## 12. Shared decision ledger

Do not delete accepted decisions. Append superseding decisions with a reference to the earlier entry.

| ID | Date | Decision | Status | Owners affected |
|---|---|---|---|---|
| DEC-001 | 2026-07-31 | Two-person split: Ahmad owns frontend; partner owns backend. | Accepted by Ahmad; backend acknowledgement required | Both |
| DEC-002 | 2026-07-31 | `README.md` is the persistent AI-to-AI communication channel and must be read every session. | Accepted by Ahmad; backend acknowledgement required | Both |
| DEC-003 | 2026-07-31 | Frontend is implemented in progressive layers, beginning with bare route/layout foundations before polish. | Accepted | Frontend |
| DEC-004 | 2026-07-31 | Frontend uses typed fixtures and API mocks so backend and frontend can progress independently. | Accepted by Ahmad; backend acknowledgement required | Both |
| DEC-005 | 2026-07-31 | Shared interfaces are contract-first through versioned OpenAPI; backend internal technology remains backend-owned. | Accepted by Ahmad; backend acknowledgement required | Both |
| DEC-006 | 2026-07-31 | Integration occurs through explicit gates with evidence from both lanes. | Accepted by Ahmad; backend acknowledgement required | Both |

---

## 13. Messages between AIs

Append concise messages. Do not rewrite older messages.

### 2026-07-31 15:54 PKT — Frontend AI → Backend AI

The complete public website and single-owner admin system have been approved in Figma. We are beginning production implementation. Ahmad has instructed that we coordinate through this README. Read it before every work session and update your backend lane after meaningful changes.

The frontend will first create a minimal navigable layout and typed mock boundary so you can begin backend work immediately. Please declare your stack and review the shared contract before implementing product-specific endpoints. Backend internals are your responsibility; shared request/response behavior is ours jointly.

### 2026-08-02 22:56 PKT — Frontend AI → Backend AI

- Branch: `integration/main-frontend-f3ed-sync`
- Completed: Main-first synchronization of the seventeen later verified frontend commits with current backend/security/deployment behavior preserved.
- Changed shared files/contracts: Generated contract output was synchronized to the unchanged source; the pnpm lockfile was regenerated from unchanged manifests for pnpm 11.4.0; no OpenAPI source operation or `services/api/**` file changed.
- Verification run and result: Run `30759848449` passed frozen install, contract drift, lint, strict typecheck, 207 unit/contract/static tests, production build and 121 public Playwright cases; 2 intentional skips, 0 failures.
- Ready integration gate: This synchronization establishes updated `main` as the continuation baseline; protected admin browser acceptance still requires a configured real owner session.
- Blockers: Real Supabase owner-session browser verification; client-supplied contact, media, legal and Arabic data remain separate later work.
- Decision or response needed: Begin all subsequent work from updated `main` and preserve main-owned backend/security/environment decisions.

### 2026-08-03 17:59 PKT — Frontend AI → Backend AI

- Branch: `frontend/public-quotation-slice` / PR `#15`.
- Completed: Product detail → local inquiry review → live quotation form → controlled `quote_requests` insertion boundary → existing owner inquiry queue snapshot path.
- Changed shared files/contracts: Changes are under `apps/web/**`, `README.md` and `docs/superpowers/**`; no OpenAPI source change, database migration or `services/api/**` change. The internal route remains `/api/checkout`, but public behavior and language are quotation-led and contain no ecommerce functionality.
- Verification run and result: Run `30815597518` passed frozen install, lint, strict typecheck, 226 unit/contract tests, production build and the targeted desktop/mobile Playwright matrix with 21 passed, 1 intentional skip and 0 failures.
- Ready integration gate: G3 code path is ready for real Supabase insertion and owner-queue acceptance evidence; the gate is not accepted yet.
- Blockers: Real Supabase insert/duplicate proof, real protected-owner browser session, production abuse protection and transactional email notification.
- Decision or response needed: Validate the runtime checklist in `docs/superpowers/completions/2026-08-03-public-quotation-slice.md`; preserve `ROSA_OWNER_USER_ID` as authoritative when configured and do not commit the temporary password.

### 2026-08-05 02:00 PKT — Frontend AI → Backend AI

- Branch: `integration/main-premium-polish-reconciliation`
- Completed: Main-dominant reconciliation proving the complete `frontend/premium-visual-polish` F7 motion, transition, responsive-restraint and premium presentation system remains integrated. Git ancestry confirms `lived` is an old ancestor, premium is fully contained in `main`, and no historical runtime overwrite is required.
- Changed shared files/contracts: None. No `services/api/**`, OpenAPI source, generated contract semantics, authentication, quotation persistence, catalogue data/media, admin runtime or deployment configuration changed.
- Verification run and result: GitHub Actions run `30951717347` passed frozen pnpm 11.20.0 install and 881-entry lockfile policy, 6 reconciliation contracts, 44 static foundation contracts, ESLint, 75 Vitest files / 344 tests, strict TypeScript, production build, and 28 premium Playwright cases with 2 intentional skips and 0 failures.
- Ready integration gate: Frontend visual-preservation review on draft PR `#20`.
- Blockers: Existing temporary F3E admin browser diagnostics use stale static-preview expectations and remain a separate test-maintenance task; they are not caused by this reconciliation.
- Decision or response needed: None unless a future change proposes replacing current main-owned backend, security, catalogue or deployment behavior.

### 2026-08-09 00:44 PKT — Frontend AI → Backend AI

- Branch: `frontend/client-feedback-responsive-homepage-implementation`.
- Completed: Homepage-first responsive-density refinement, four-slide local hero carousel, desktop accordion/mobile swipe family discovery, shared public social links, and Arabic/RTL density refinement.
- Changed shared files/contracts: Public frontend presentation/shared shell only. No `services/api/**`, OpenAPI source, Supabase migration/data write, authentication/session, product-media relationship, quotation persistence, or protected admin behavior changed; bounded featured-product reads remain intact.
- Verification run and result: 101 web Vitest files / 491 tests passed with 2 intentional integration skips; contracts TypeScript + 3 tests passed; web TypeScript passed; changed-file ESLint is clean. Final public Playwright regression passed 28 tests with 35 project-inapplicable skips, and the 11-viewport matrix passed 11/11. Repository-wide ESLint remains at the pre-existing 3-error/6-warning admin-test baseline. Unmodified production build is blocked only by this sandbox's Google Fonts network access; font-fetch-isolated Next and OpenNext diagnostic builds both passed.
- Ready integration gate: Owner review of the homepage implementation branch. Site-wide density propagation is intentionally deferred to a separate phase.
- Blockers: Release environment must rerun the unmodified Next/OpenNext production build with normal Google Fonts access.
- Decision or response needed: None for backend contracts/data; preserve current backend/runtime behavior when this frontend branch is integrated.

### 2026-08-09 10:07 PDT — Frontend AI → Backend AI

- Branch: `frontend/client-feedback-responsive-homepage-pr`.
- Completed: Propagated the approved responsive-density system across every non-admin public route, including catalogue, product detail, editorial, form, utility, Arabic/RTL, reduced-motion and 200% text states.
- Changed shared files/contracts: Public CSS, Playwright acceptance coverage and completion documentation only; no `services/api/**`, OpenAPI, Supabase migration/data write, authentication, persistence or protected admin behavior changed.
- Verification run and result: 491 Vitest tests passed with 2 intentional integration skips; strict web TypeScript passed; focused Playwright passed 87 with 108 project-inapplicable skips; all 67 responsive captures were reviewed; production build passed after the sandbox network-interface restriction was removed. Repository-wide ESLint remains at the pre-existing 3-error/6-warning admin baseline.
- Ready integration gate: Owner review of the complete public responsive-density implementation at `1107638`; backend integration gates are unchanged.
- Blockers: None in the public responsive implementation. Existing real-environment Supabase and owner-session acceptance remain separate integration work.
- Decision or response needed: None; preserve current backend contracts, data and admin behavior during integration.

---

### 2026-09-16 20:37 PKT — Frontend AI → Backend AI

- Branch: `audit/complete-image-qa-2026-09-15` (local working tree).
- Completed: Audited 27 non-product image contexts across EN/AR public routes and five viewport widths, replaced six weak editorial sources with locally stored licensed photographs, corrected hero and banner crops, restored the official wide logo and the local-only red “Request a quote” header CTA.
- Changed shared files/contracts: WordPress child-theme image fallbacks, page templates, header CSS/PHP, one matching contract assertion, and the image decision report. No API, catalogue data, SKU images, quotation persistence or backend contract changed.
- Verification run and result: 60 browser route/viewport captures, focused PHP contracts and PHP lint; see `docs/superpowers/reports/2026-09-16-complete-image-visual-decision-audit.md` for visual decisions and source provenance.
- Ready integration gate: Owner visual review of the local WordPress site and report.
- Blockers: None for local review.
- Decision or response needed: None.

### 2026-09-16 20:54 PKT — Frontend AI → Backend AI

- Branch: `audit/complete-image-qa-2026-09-15` (local working tree).
- Completed: Owner-requested image refinement on Home and About, including two original theme-local About assets, complete frame coverage in Home/About slots, muted fourth hero, and a darker Find Product gradient.
- Changed shared files/contracts: WordPress child-theme media fallbacks, scoped CSS, About image description, and image audit report only; no backend, Woo product media or quotation persistence changes.
- Verification run and result: EN/AR section screenshots at 1440, 768 and 390 px confirmed the primary crops and gradient; focused PHP contracts, PHP lint and `git diff --check` pass. The last minor mobile focal/padding/Search-button refinements await a fresh browser capture.
- Ready integration gate: Browser recapture after tool access is restored, then owner visual review.
- Blockers: Automatic approval review rejected final browser recapture because the tool usage limit was reached.
- Decision or response needed: None for implementation; post-fix rendered verification remains pending.

### 2026-09-16 21:03 PKT — Frontend AI → Backend AI

- Branch: `audit/complete-image-qa-2026-09-15` (local working tree).
- Completed: Extended frame-cover correction to Home feature/support/evidence, About banners, Shop support and page heroes after the owner identified more mobile top/bottom gaps.
- Changed shared files/contracts: Scoped editorial CSS and image audit report only; no catalogue cover, SKU image or backend change.
- Verification run and result: Earlier mobile DOM evidence identified source-height/frame-height mismatches; focused PHP contracts and `git diff --check` pass. New rendered captures remain pending.
- Ready integration gate: EN/AR mobile browser recapture once tool access is restored.
- Blockers: Automatic approval review usage limit still prevents the browser verification action.
- Decision or response needed: None for the code change; final visual confirmation remains outstanding.

### 2026-09-16 21:19 PKT — Frontend AI → Backend AI

- Branch: `audit/complete-image-qa-2026-09-15` (local working tree).
- Completed: Rebuilt the Hostinger offline WordPress migration package from the running Docker document root and current database; the manifest records that current uncommitted theme changes are included.
- Changed shared files/contracts: Hostinger export manifest metadata and migration runbook. No Hostinger account, live website, DNS or database was changed.
- Verification run and result: Migration preflight `GO` with zero blockers, 28/28 attachments present, required plugins active, EN/AR route checks passed; archive and SQL checksums passed; archived theme CSS hash matches the working tree.
- Ready integration gate: Upload the `.tar.gz` site-root archive and standalone `.sql` via Hostinger **Upload Backup Files**, then verify the migrated site before changing DNS.
- Blockers: No packaging blocker. Prior image-pass final browser verification remains outstanding.
- Decision or response needed: Destination-domain and Hostinger account actions remain with the owner during upload.

## 14. Required update format

Use this format after meaningful work:

```md
### YYYY-MM-DD HH:MM timezone — <Frontend AI|Backend AI> → <other AI>

- Branch:
- Completed:
- Changed shared files/contracts:
- Verification run and result:
- Ready integration gate:
- Blockers:
- Decision or response needed:
```

Keep entries factual and short enough that both AIs can scan the complete history.

---

## 15. Historical repository state

The items below are the original pre-implementation record retained for history. They are superseded by the current synchronized checkpoint above.

- Approved Figma design: complete
- Public website design: complete
- Product/inquiry journey: complete
- Public company/support/legal pages: complete
- Single-owner admin design: complete
- Production architecture: entered implementation planning
- Application scaffold: originally not started
- Shared OpenAPI contract: originally not started
- Backend implementation: originally not reported
- Frontend implementation: originally not started

The current continuation baseline is updated `main`, not this historical status.
