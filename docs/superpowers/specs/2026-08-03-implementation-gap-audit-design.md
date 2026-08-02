# Rosa Medical Implementation-Gap Audit Design

**Date:** 2026-08-03  
**Status:** Approved design  
**Repository:** `manbtd0-cloud/RosaMedical`  
**Continuation base:** latest `main` at audit start

## 1. Purpose

Perform a repository-wide, code-only audit of the integrated Rosa Medical implementation before further feature development. The audit will determine what is genuinely implemented, what remains static or incomplete, what depends on untested Supabase runtime behavior, and what conflicts with accepted product decisions.

The audit will convert the current mixed frontend/backend state into one evidence-based corrective roadmap. It will not change application behavior.

## 2. Governing sources

The audit follows the repository source-of-truth hierarchy:

1. The owners' latest explicit decisions
2. Accepted decisions in `README.md`
3. Approved Figma designs for visual structure and behavior
4. `packages/contracts/openapi/rosa-medical.v1.yaml` for shared interfaces
5. Approved plans under `docs/superpowers/plans/`
6. Tests and current implementation
7. Older summaries, temporary notes, and assumptions

The audit must read the complete latest `README.md`, newest coordination entries, approved master plan, synchronization records, OpenAPI source, generated contract output, migrations, application code, tests, and deployment configuration before drawing conclusions.

## 3. Fixed audit decisions

- The audit is code-only. It will not request or use Supabase credentials.
- It will not fabricate an authenticated owner session.
- It will not claim real database, storage, email, authentication, or deployment behavior has been verified.
- Any capability requiring such proof will be marked **implemented, runtime-unverified** unless static evidence supports a weaker classification.
- Latest `main` remains authoritative for backend implementation, security, Supabase, environment, middleware, API routes, persistence, package configuration, and deployment mechanics.
- Latest explicit owner decisions and locked product rules outrank conflicting implementation behavior.
- Product-rule conflicts will be identified precisely and paired with the smallest safe corrective scope, but no corrective application code will be written during the audit.
- Existing useful backend work will not automatically be deleted because its current public presentation conflicts with product intent. The audit will determine whether it should be adapted, isolated, renamed, or removed.

## 4. Scope

### 4.1 Included

- Public routes, layouts, components, states, and navigation
- Admin routes, layouts, editors, states, and navigation
- Server components, server actions, route handlers, middleware, and proxy/session behavior
- Supabase browser/server clients, queries, mutations, storage boundaries, and authentication guards
- Product, family, catalogue, media, inquiry, message, contact, content, publishing, revision, and rollback paths
- OpenAPI operations, generated types, fixtures, adapters, and shared request/response shapes
- Database migrations, policies, constraints, and seeds available in the repository
- Unit, component, contract, static, integration, browser, accessibility, and build tests
- Environment validation, Cloudflare/OpenNext configuration, package/runtime assumptions, and deployment records
- F0-F9 frontend layers and G0-G7 integration gates
- Obsolete, duplicate, or misleading paths that create maintenance or product risk

### 4.2 Excluded

- Live Supabase or external-service execution
- Real owner authentication testing
- Real email, object-storage, DNS, or deployment verification
- Application-code changes
- Schema, contract, route, security, environment, or deployment changes
- Visual redesign or feature invention
- Replacement of client-supplied contact, legal, Arabic, or media content

## 5. Audit approach

Use a **journey and integration-gate evidence matrix** rather than a file-by-file scorecard.

The audit will trace each approved business journey from its visible entry point through validation, data access, persistence boundary, result state, administration path, and available tests. File-level evidence will be cited inside those journey assessments.

Primary journeys:

1. Public discovery and product browsing
2. Product inquiry and quotation request
3. General contact submission
4. Owner login, session, recovery, and logout
5. Product and family management
6. Catalogues and media management
7. Website content and contact-detail management
8. Draft, review, public preview, explicit publish, revisions, and rollback
9. Search
10. Arabic and RTL readiness
11. Accessibility, performance, resilience, and deployment readiness

This approach prevents isolated routes, buttons, types, or queries from being mistaken for complete workflows.

## 6. Status model

Every capability receives exactly one primary status:

1. **Verified implemented** — code exists and repository verification directly proves the claimed behavior.
2. **Implemented, runtime-unverified** — code appears complete, but real Supabase, authentication, storage, email, or deployment behavior has not been exercised.
3. **Partially implemented** — meaningful pieces exist, but the workflow is incomplete or disconnected.
4. **Static or placeholder only** — presentation or data shape exists without functional behavior.
5. **Missing** — no meaningful implementation evidence exists.
6. **Product-rule conflict** — behavior contradicts an accepted requirement.
7. **Obsolete or duplicate path** — a superseded path creates ambiguity, duplication, or maintenance risk.

A capability may include secondary findings, but one primary status must summarize its present state.

## 7. Evidence model

Each conclusion will distinguish:

- **Direct code evidence:** components, handlers, actions, queries, migrations, policies, middleware, configuration, or data adapters
- **Contract evidence:** accepted OpenAPI operations, examples, and generated type coverage
- **Automated-test evidence:** exact tests and the specific behavior they prove
- **Documentation claim:** coordination or completion statements that provide context but do not prove behavior alone
- **Inference:** a clearly labelled conclusion derived from code structure
- **Unavailable runtime evidence:** proof requiring credentials or external services

The following are insufficient by themselves to mark a feature complete:

- route presence;
- visible button or form presence;
- one Supabase query;
- type or schema presence;
- documentation claiming completion;
- lint, typecheck, or build success unrelated to the behavior;
- a test that covers only a static rendering state.

## 8. Severity model

- **P0 — Product or security blocker:** unsafe authorization, destructive risk, or a direct contradiction of the accepted product model
- **P1 — Core business-flow blocker:** prevents quotation submission, public product delivery, publishing, or an essential owner operation
- **P2 — Major incompleteness:** important catalogue, content, search, communication, or administration workflow remains incomplete
- **P3 — Quality gap:** accessibility, responsiveness, error handling, maintainability, performance, or resilience weakness
- **P4 — Cleanup:** obsolete paths, stale tests, misleading names, or documentation drift

Severity represents business and safety impact, not implementation effort.

## 9. Product-rule conflict policy

Accepted Rosa rules include:

- ROSA-only logo treatment
- Supplier and procurement-partner positioning
- Five primary families: Knives, Scissors, Punches, Chisels, and Cutters
- Quotation-led public experience
- No public prices, payments, checkout, inventory, shipping, discounts, ratings, or orders
- One protected owner account with no public registration or multi-admin roles in version one
- Product inquiries and general messages remain separate
- Draft → Review → Public Preview → Explicit Publish
- Revision history remains preserved and rollback creates a new revision
- Design-system controls remain protected from admin editing
- English first with paired English/Arabic data structures
- No unsupported manufacturing, certification, ownership, award, export, legal, or clinical claims

For each conflict, the audit will record:

1. Accepted rule
2. Exact affected paths and behavior
3. User-facing and architectural impact
4. Whether useful backend behavior can be preserved
5. Smallest safe correction
6. Dependencies and verification required

The audit will not silently treat current code as final when it conflicts with these rules.

## 10. Execution sequence

### Step 1 — Freeze the baseline

- Confirm the latest `main` commit.
- Create a focused audit branch from that commit.
- Record the exact audited commit and branch in the report.
- Re-check that no newer `main` commit appeared before finalizing findings.

### Step 2 — Read governing sources

- Read the complete latest `README.md`.
- Read the master implementation plan and synchronization/completion records.
- Read the OpenAPI source before inspecting shared interface use.
- Record approved routes, journeys, states, and integration expectations.

### Step 3 — Inventory implementation boundaries

Map public, admin, API, Supabase, contract, migration, test, and deployment files to the approved journeys. This inventory supports the audit but is not the final report structure.

### Step 4 — Trace complete journeys

For every journey:

- identify user entry points;
- trace validation and state transitions;
- trace adapters, handlers, queries, and persistence boundaries;
- inspect success, empty, validation, retryable-error, non-retryable-error, and authorization states where applicable;
- identify frontend-only and backend-only fragments;
- identify product-rule conflicts and duplicate paths;
- map exact tests to exact claims.

### Step 5 — Recompute F0-F9 and G0-G7

Assess actual evidence instead of copying stale progress labels. A gate may be:

- **Accepted by code evidence**
- **Implemented but runtime-unverified**
- **Partially ready**
- **Blocked**
- **Not started**

No integration gate requiring real external behavior may be marked fully accepted in this code-only audit.

### Step 6 — Rank and sequence gaps

- Apply P0-P4 severity.
- Identify dependencies and shared-interface implications.
- Recommend the smallest safe correction for each material finding.
- Group corrections into coherent implementation batches.
- Select one next batch that produces the highest-value complete vertical slice without broad unrelated refactoring.

### Step 7 — Coordinate findings

- Add the final audit report under `docs/superpowers/audits/`.
- Append a concise `README.md` coordination entry with audited commit, scope, major blockers, recomputed gate status, and the recommended next batch.
- Preserve historical plans and completion records.

## 11. Deliverables

### Design specification

`docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`

### Audit report

`docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

The report will contain:

1. Executive summary
2. Audited baseline and limitations
3. Current architecture map
4. Product-rule conflict register
5. Business-journey evidence matrix
6. F0-F9 frontend-layer assessment
7. G0-G7 integration-gate assessment
8. Security and authorization observations
9. Contract and data-flow mismatches
10. Test-evidence truth table
11. Obsolete or duplicate paths
12. Prioritized corrective roadmap
13. Exact next implementation-batch recommendation

### Coordination update

A concise append-only README entry containing:

- exact audited branch and commit;
- code-only limitation;
- top P0/P1 findings;
- recomputed gate summary;
- recommended next implementation batch;
- shared decisions or partner responses required.

## 12. Acceptance criteria

The audit is complete only when:

- Every approved public and admin journey has a primary status.
- Every F0-F9 layer has an evidence-based assessment.
- Every G0-G7 gate has an evidence-based conclusion.
- Every product-rule conflict names exact affected paths and the smallest safe correction.
- Runtime-dependent claims are explicitly marked unverified.
- Tests are cited only for the behavior they directly establish.
- Obsolete and duplicate paths are identified without deleting them.
- No application behavior, shared contract, schema, security rule, environment decision, or deployment configuration is changed.
- The report produces one clear next implementation batch with dependencies and verification requirements.
- The audit branch is rechecked against latest `main` before findings are finalized.

## 13. Expected next-phase direction

The audit is expected to determine whether the public procurement vertical slice should be the next implementation batch:

`Products → Family → Product detail → Inquiry selection → Quotation submission → Owner-visible inquiry`

This is a hypothesis, not a pre-decided audit result. P0 product or authorization conflicts may need a narrower correction batch first.
