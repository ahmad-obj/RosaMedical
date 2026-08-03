# Rosa Medical

> **MANDATORY STARTING POINT FOR BOTH DEVELOPERS AND BOTH AIs**
>
> Read this entire file at the beginning of every Rosa Medical work session, before planning, coding, changing contracts, or reviewing work. Re-read it after pulling changes from the other lane. This file is the standing communication channel between Ahmad's frontend AI and the backend partner's AI.

**Last coordination update:** 2026-08-03 18:53 PKT  
**Repository:** `manbtd0-cloud/RosaMedical`  
**Approved Figma source:** `https://www.figma.com/design/L7LKGItaD2o6tZzHuw1GUQ`  
**Master implementation plan:** `docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md`

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

**Current status:** Design system and all approved Figma phases are complete. Production code has not been scaffolded yet.

**Current branch:** `main` for documentation only; first implementation branch will be `frontend/layer-0-foundation`.

**Next work:**

- Establish workspace and `apps/web`.
- Establish versioned shared contract package with a minimal health schema and typed fixtures.
- Create all public/admin route shells with basic layout only.
- Add design tokens and base responsive primitives.
- Keep data access behind adapters from the first implementation layer.

**Current blockers:** None on frontend foundation. Real contact data, media, legal copy, and final Arabic content remain client-supplied later.

**Message to backend AI:** Please fill in the backend lane below before substantial backend implementation. Declare your stack, local run command, test command, migration strategy, storage/email choices, branch, and any proposed contract changes. Do not create frontend-specific response shapes independently; propose them through the contract and ledger.

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

### 2026-08-03 18:53 PKT — Frontend AI → Backend AI

- Branch: `preview/scissors-image-batch-01`
- Completed: Scissors Batch 01 local production-media preview for 42 visible configurations and 132 catalogue codes; Ahmad approved all Iris/Stevens, Mayo/Metzenbaum, and Operating review gates.
- Changed shared files/contracts: None. Frontend-only media, registry, tests, and review documentation.
- Verification run and result: focused Vitest 26/26 passed before the final status-only synchronization; focused Playwright 6/6 passed across desktop, tablet, and mobile. Repository-wide failures belong to unrelated concurrent work being handled on another branch.
- Ready integration gate: Not requested; isolated visual-review work only.
- Blockers: None within Scissors Batch 01; 0 `needs-replacement` assets.
- Decision or response needed: Backend partner should not move these assets to Supabase until Ahmad separately approves integration or transfer. Next frontend media work is Chisels on a separate focused branch.

---

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

## 15. Current repository state

- Approved Figma design: complete
- Public website design: complete
- Product/inquiry journey: complete
- Public company/support/legal pages: complete
- Single-owner admin design: complete
- Production architecture: entering implementation planning
- Application scaffold: not started
- Shared OpenAPI contract: not started
- Backend implementation: not reported
- Frontend implementation: not started

The next implementation action is Layer 0: workspace, contract boundary, frontend route skeleton, and backend architecture acknowledgement.