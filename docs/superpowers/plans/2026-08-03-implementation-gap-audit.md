# Rosa Medical Implementation-Gap Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a repository-wide, code-only evidence audit that classifies every approved Rosa Medical journey, frontend layer, integration gate, product-rule conflict, and runtime-verification limitation, then recommends one exact next implementation batch.

**Architecture:** The audit is documentation-only. It traces approved user journeys across public UI, admin UI, Next.js handlers/actions, Supabase boundaries, OpenAPI contracts, migrations, tests, and deployment configuration, while preserving current application behavior. Findings are recorded in one append-only evidence report and summarized in the root coordination README.

**Tech Stack:** Git; Node.js 24; pnpm 11.4.0; Next.js App Router; React; strict TypeScript; Supabase client/server boundaries; OpenAPI 3.1; Vitest; React Testing Library; Playwright; Markdown.

## Global Constraints

- Begin from the latest `main`; record the exact application commit audited.
- Treat latest `main` as authoritative for backend implementation, security, Supabase, environment, middleware, API routes, persistence, packages, and deployment mechanics.
- Treat the owner’s latest explicit decisions and accepted product rules as higher priority than conflicting implementation behavior.
- Perform a code-only audit: do not request credentials, connect to live Supabase, fabricate an owner session, or claim external services have been verified.
- Mark runtime-dependent capabilities **implemented, runtime-unverified** unless static evidence supports a weaker classification.
- Do not change application code, contracts, schemas, migrations, security rules, environment configuration, deployment configuration, or product behavior.
- Do not delete obsolete or conflicting paths during this plan; identify and sequence them only.
- Cite exact repository paths and exact tests for every material conclusion.
- Keep public product inquiries and general contact messages separate in the assessment.
- Enforce the quotation-led product model: no public prices, payments, checkout, inventory, shipping, discounts, ratings, or orders.
- Preserve the single protected owner model and Draft → Review → Public Preview → Explicit Publish workflow as governing requirements.
- Re-check latest `main` before finalizing the report.
- Avoid unnecessary GitHub Actions runs; use local read-only inspection and existing tests first.

---

## File Structure

**Create**

- `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md` — complete evidence report, including baseline, architecture, conflicts, journey matrix, F0–F9, G0–G7, test truth table, roadmap, and next batch.

**Modify**

- `README.md` — append one dated coordination entry and update the coordination timestamp only after the audit is complete.

**Read without modifying**

- `README.md`
- `docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`
- `docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md`
- `docs/superpowers/completions/2026-08-02-main-frontend-f3ed-sync.md`
- `docs/superpowers/completions/2026-08-02-rosa-medical-consolidated-frontend-verification.md`
- `docs/superpowers/completions/2026-08-02-frontend-backend-selective-integration.md`
- `packages/contracts/openapi/rosa-medical.v1.yaml`
- `packages/contracts/src/generated/schema.ts`
- `packages/contracts/src/fixtures/**`
- `apps/web/src/app/**`
- `apps/web/src/components/**`
- `apps/web/src/features/**`
- `apps/web/src/lib/**`
- `apps/web/src/mocks/**`
- `apps/web/src/test/**`
- `apps/web/tests/e2e/**`
- `services/api/**`
- Supabase migrations, policies, seeds, and deployment files returned by `git ls-files`
- Root and web package manifests, Next/OpenNext/Cloudflare configuration, middleware/proxy files, and environment examples

---

### Task 1: Freeze the audited baseline and create the isolated audit branch

**Files:**
- Read: `README.md`
- Read: `docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`
- Create later: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: `origin/main`, approved design commit `1bc29af2f35396ecc552a0994c51cdf057bc3f9c`, this plan commit
- Produces: immutable `AUDITED_APPLICATION_BASE`, execution branch `audit/implementation-gap-2026-08-03`, clean isolated worktree

- [ ] **Step 1: Fetch all current refs and verify the checkout is clean**

```bash
git fetch origin --prune
git status --short
```

Expected: `git status --short` prints nothing. Stop and preserve uncommitted work if it does not.

- [ ] **Step 2: Record the latest application baseline**

```bash
AUDITED_APPLICATION_BASE="$(git rev-parse origin/main)"
printf '%s\n' "$AUDITED_APPLICATION_BASE"
git show -s --format='%H%n%ci%n%s' "$AUDITED_APPLICATION_BASE"
```

Expected: one exact `main` SHA, commit timestamp, and subject. At plan-writing time the known main checkpoint is `8ad8098e9999fbdd2ee65edeaa8410928922b8e8`, but execution must use the freshly fetched value.

- [ ] **Step 3: Verify the approved specification and plan are based on current main application history**

```bash
git switch docs/implementation-gap-audit-spec
git pull --ff-only origin docs/implementation-gap-audit-spec
git merge-base --is-ancestor "$AUDITED_APPLICATION_BASE" HEAD
```

Expected: exit code `0`. If it fails, rebase only the documentation branch onto `origin/main`, resolve documentation conflicts without touching application files, and rerun the command.

- [ ] **Step 4: Create an isolated audit worktree**

```bash
git branch audit/implementation-gap-2026-08-03 HEAD
git worktree add ../RosaMedical-audit audit/implementation-gap-2026-08-03
cd ../RosaMedical-audit
git status --short
git rev-parse HEAD
```

Expected: clean status; `HEAD` includes the approved specification and implementation plan while the recorded `AUDITED_APPLICATION_BASE` remains the application baseline.

- [ ] **Step 5: Save the baseline in the shell for later checks**

```bash
printf '%s\n' "$AUDITED_APPLICATION_BASE" > /tmp/rosa-audited-main-sha
cat /tmp/rosa-audited-main-sha
```

Expected: exact SHA from Step 2.

---

### Task 2: Build the report skeleton and governing-source register

**Files:**
- Create: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: `README.md`
- Read: `docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`
- Read: `docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md`
- Read: completion records under `docs/superpowers/completions/`
- Read: `packages/contracts/openapi/rosa-medical.v1.yaml`

**Interfaces:**
- Consumes: recorded application baseline, source-of-truth hierarchy, locked product decisions, F0–F9 and G0–G7 definitions
- Produces: report headings, baseline statement, limitation statement, source register, status/severity legend

- [ ] **Step 1: Read the complete governing sources before inspecting implementation**

```bash
cat README.md
cat docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md
cat docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md
cat docs/superpowers/completions/2026-08-02-main-frontend-f3ed-sync.md
cat docs/superpowers/completions/2026-08-02-rosa-medical-consolidated-frontend-verification.md
cat docs/superpowers/completions/2026-08-02-frontend-backend-selective-integration.md
cat packages/contracts/openapi/rosa-medical.v1.yaml
```

Expected: all files resolve. If a named historical record is absent on the latest branch, record that absence in the source register instead of substituting a different document silently.

- [ ] **Step 2: Generate a read-only repository inventory for audit use**

```bash
git ls-files > /tmp/rosa-all-files.txt
grep -E '^(apps/web|packages/contracts|services/api|supabase|migrations|\.github|docs/runbooks|wrangler|open-next|next\.config)' /tmp/rosa-all-files.txt > /tmp/rosa-audit-surface.txt
wc -l /tmp/rosa-all-files.txt /tmp/rosa-audit-surface.txt
cat /tmp/rosa-audit-surface.txt
```

Expected: a complete tracked-file list and a narrower audit-surface list. These files remain temporary and uncommitted.

- [ ] **Step 3: Create the exact report structure**

Create `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md` with these headings in this order:

```markdown
# Rosa Medical Implementation-Gap Audit

## 1. Executive summary
## 2. Audited baseline and limitations
## 3. Governing-source register
## 4. Current architecture map
## 5. Product-rule conflict register
## 6. Business-journey evidence matrix
### 6.1 Public discovery and product browsing
### 6.2 Product inquiry and quotation request
### 6.3 General contact submission
### 6.4 Owner login, session, recovery, and logout
### 6.5 Product and family management
### 6.6 Catalogues and media management
### 6.7 Website content and contact-detail management
### 6.8 Draft, review, public preview, publish, revisions, and rollback
### 6.9 Search
### 6.10 Arabic and RTL readiness
### 6.11 Accessibility, performance, resilience, and deployment readiness
## 7. F0–F9 frontend-layer assessment
## 8. G0–G7 integration-gate assessment
## 9. Security and authorization observations
## 10. Contract and data-flow mismatches
## 11. Test-evidence truth table
## 12. Obsolete or duplicate paths
## 13. Prioritized corrective roadmap
## 14. Recommended next implementation batch
## 15. Recheck against latest main
```

Under Section 2, record:

```markdown
- Audited application baseline: `<AUDITED_APPLICATION_BASE>`
- Audit execution branch: `audit/implementation-gap-2026-08-03`
- Method: code-only repository audit
- External runtime verification: not performed
- Protected owner browser verification: not performed
```

- [ ] **Step 4: Add the fixed classification legends**

Under Section 2, include the seven statuses exactly:

```markdown
1. Verified implemented
2. Implemented, runtime-unverified
3. Partially implemented
4. Static or placeholder only
5. Missing
6. Product-rule conflict
7. Obsolete or duplicate path
```

Include severities exactly: `P0`, `P1`, `P2`, `P3`, `P4`, using the definitions from the approved specification.

- [ ] **Step 5: Verify the report skeleton is complete**

```bash
for heading in \
  'Executive summary' \
  'Audited baseline and limitations' \
  'Governing-source register' \
  'Current architecture map' \
  'Product-rule conflict register' \
  'Business-journey evidence matrix' \
  'F0–F9 frontend-layer assessment' \
  'G0–G7 integration-gate assessment' \
  'Security and authorization observations' \
  'Contract and data-flow mismatches' \
  'Test-evidence truth table' \
  'Obsolete or duplicate paths' \
  'Prioritized corrective roadmap' \
  'Recommended next implementation batch' \
  'Recheck against latest main'; do
  grep -F "$heading" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
```

Expected: exit code `0`.

- [ ] **Step 6: Commit the audit foundation**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish implementation gap audit baseline"
```

---

### Task 3: Map architecture, contracts, persistence boundaries, and known product conflicts

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: `apps/web/src/app/**`
- Read: `apps/web/src/lib/**`
- Read: `packages/contracts/**`
- Read: `services/api/**`
- Read: migration, policy, seed, middleware/proxy, environment, and deployment files from `/tmp/rosa-audit-surface.txt`

**Interfaces:**
- Consumes: tracked-file inventory and governing rules
- Produces: architecture map, contract/persistence boundary map, product-rule conflict register with exact paths and smallest safe correction

- [ ] **Step 1: Map route, server, Supabase, and contract entry points**

```bash
git ls-files apps/web/src/app | sort > /tmp/rosa-app-routes.txt
git ls-files apps/web/src/lib | sort > /tmp/rosa-lib-files.txt
git ls-files packages/contracts | sort > /tmp/rosa-contract-files.txt
git ls-files services/api | sort > /tmp/rosa-service-files.txt
cat /tmp/rosa-app-routes.txt
cat /tmp/rosa-lib-files.txt
cat /tmp/rosa-contract-files.txt
cat /tmp/rosa-service-files.txt
```

Expected: exact tracked paths. Record absences explicitly; do not infer a separate backend service exists merely because the planned directory exists.

- [ ] **Step 2: Locate all persistence and authorization boundaries**

```bash
rg -n --hidden --glob '!node_modules/**' \
  'createClient\(|supabase\.|auth\.|requireAdmin|middleware|proxy|cookies\(|from\("|from\('\''' \
  apps/web packages/contracts services/api . \
  > /tmp/rosa-persistence-auth-hits.txt || true
cat /tmp/rosa-persistence-auth-hits.txt
```

Expected: all current Supabase reads/writes, auth checks, guards, and middleware/proxy entry points.

- [ ] **Step 3: Locate product-model conflict vocabulary**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  '\b(checkout|cart|order|orders|payment|payments|price|prices|inventory|stock|shipping|discount|rating|ratings|customer login|sign up|register)\b' \
  apps/web packages/contracts services/api README.md docs \
  > /tmp/rosa-product-conflict-hits.txt || true
cat /tmp/rosa-product-conflict-hits.txt
```

Expected: exact hits including the current `/checkout` path and any order/cart terminology. Distinguish historical documentation from active application behavior.

- [ ] **Step 4: Trace each active conflict to user-visible behavior and data flow**

For every active hit, inspect the complete referenced file and its callers. At minimum inspect the product-detail action and any current checkout handler, including the known boundary around `apps/web/src/app/api/checkout/route.ts` when present.

Record one row per conflict:

```markdown
| Severity | Accepted rule | Active paths | Current behavior | Useful behavior to preserve | Smallest safe correction | Verification required |
```

Use `P0` only for direct product/security blockers; do not inflate severity for historical naming alone.

- [ ] **Step 5: Document the architecture map**

Section 4 must name:

- public route composition;
- protected admin composition;
- server components/actions/route handlers;
- browser/server Supabase clients;
- auth/session refresh and admin guard;
- contract source and generated types;
- database/migration boundary actually present;
- storage and email boundaries actually present;
- deployment path actually configured;
- any planned-but-absent `services/api/**` boundary.

Every bullet must cite repository paths. Mark architectural conclusions as inference where the code does not prove runtime behavior.

- [ ] **Step 6: Verify no application files changed**

```bash
git status --short
```

Expected: only `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md` is modified.

- [ ] **Step 7: Commit architecture and conflict findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: map Rosa architecture and product conflicts"
```

---

### Task 4: Audit all public business journeys

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: public routes under `apps/web/src/app/**`
- Read: public feature code under `apps/web/src/features/**`
- Read: public handlers/actions under `apps/web/src/app/api/**` and feature folders
- Read: relevant contract operations and tests

**Interfaces:**
- Consumes: architecture map, contract operations, public route inventory
- Produces: evidence rows for product browsing, quotation/inquiry, general contact, search, and public content journeys

- [ ] **Step 1: Build the public journey file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'products|families|catalogues|inquiry|quotation|checkout|contact|search|procurement|privacy|terms' \
  apps/web/src/app apps/web/src/features apps/web/src/components apps/web/src/lib packages/contracts apps/web/tests \
  | sort -u > /tmp/rosa-public-journey-files.txt
cat /tmp/rosa-public-journey-files.txt
```

Expected: exact public components, handlers, adapters, tests, and contract files.

- [ ] **Step 2: Trace public discovery and product browsing**

Inspect homepage → products → family → product detail, including:

- route entry points and navigation;
- source of family/product data;
- published-only filtering or lack thereof;
- catalogue/specification rendering;
- loading, empty, not-found, and error behavior;
- responsive action differences;
- tests that prove only static rendering versus data behavior.

Record one primary status and exact evidence for Section 6.1.

- [ ] **Step 3: Trace product inquiry and quotation request**

Inspect product action → selection state → form → validation → handler/action → persistence write → success/failure state → owner-visible result.

Explicitly answer:

```markdown
- Is anonymous quotation submission supported or is authentication required?
- Are submitted product items preserved as immutable snapshots?
- Is idempotency tied to the actual submitted selection?
- Is the flow named and presented as inquiry/quotation rather than checkout/order?
- Can the owner view the submitted record through an admin path?
```

Any missing link makes the journey partial or conflicted; do not average the pieces into “complete.”

- [ ] **Step 4: Trace general contact submission separately**

Inspect contact form → client validation → `/api/contact` or equivalent → spam handling → persistence → success/failure states → admin message view.

Record product inquiry and general contact as separate rows even if they share components or Supabase infrastructure.

- [ ] **Step 5: Trace search and public content routes**

Inspect search input, query parsing, indexed fields/data source, result states, and links. Inspect About, Procurement Support, Contact, Catalogues, Privacy, and Terms for fixture/live/placeholder status and unsupported claims.

- [ ] **Step 6: Add public journey evidence rows**

Use this table shape for each journey:

```markdown
| Capability | Primary status | Direct code evidence | Contract evidence | Test evidence | Runtime evidence unavailable | Product conflict | Smallest correction | Priority |
```

Do not cite a build or lint pass as proof of persistence, authorization, email, or publishing behavior.

- [ ] **Step 7: Verify all public journeys have one primary status**

```bash
for section in \
  '6.1 Public discovery and product browsing' \
  '6.2 Product inquiry and quotation request' \
  '6.3 General contact submission' \
  '6.9 Search'; do
  grep -F "$section" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
```

Expected: exit code `0`; each section includes `Primary status:` or a table row with a status.

- [ ] **Step 8: Commit public journey findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit public Rosa business journeys"
```

---

### Task 5: Audit owner authentication and all admin management journeys

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: admin routes under `apps/web/src/app/admin/**`
- Read: admin features under `apps/web/src/features/**`
- Read: auth guards, middleware/proxy, server actions, route handlers, and Supabase queries
- Read: admin tests under `apps/web/src/test/**` and `apps/web/tests/e2e/**`

**Interfaces:**
- Consumes: auth/persistence map and admin route inventory
- Produces: evidence rows for owner auth, product/family CRUD, catalogues/media, inquiries/messages, content/contact details, publishing/revisions/rollback, and security observations

- [ ] **Step 1: Build the admin journey file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'admin|login|logout|recovery|session|product|family|catalogue|media|inquir|message|content|contact|publish|revision|rollback|preview' \
  apps/web/src/app/admin apps/web/src/features apps/web/src/lib apps/web/src/test apps/web/tests \
  | sort -u > /tmp/rosa-admin-journey-files.txt
cat /tmp/rosa-admin-journey-files.txt
```

Expected: exact admin surfaces and tests.

- [ ] **Step 2: Trace owner login, session, recovery, logout, and route protection**

Answer with exact evidence:

```markdown
- What proves an unauthenticated request is redirected?
- What proves the authenticated user is the single approved owner rather than any Supabase user?
- Where are session refresh, expiry, logout, and recovery handled?
- Which claims are implementation-only because no real owner session is available?
```

Classify missing owner allowlisting or equivalent authorization as `P0` only if current code permits any authenticated user to reach owner operations.

- [ ] **Step 3: Trace products and families management**

Inspect list → create/edit → validation → save → delete/archive → preview → public visibility. Identify exact database fields, EN/AR fields, protected design boundaries, and whether publication state is separate from edit state.

- [ ] **Step 4: Trace catalogues and media management**

Inspect upload/select/replace/delete behavior, storage bucket usage, file validation, usage mapping, alt text, PDF safety headers, and frontend result states. Mark storage behavior runtime-unverified.

- [ ] **Step 5: Trace inquiries and general messages administration**

Confirm whether the two record types remain separate, which statuses exist, whether internal notes or appointment behavior are present, and whether any current status model conflicts with accepted requirements.

- [ ] **Step 6: Trace content, contact details, publishing, revisions, and rollback**

For each workflow, identify:

- editable fields;
- draft storage;
- review warnings;
- public preview isolation;
- explicit publication action;
- transaction boundary;
- revision creation;
- rollback-as-new-revision behavior;
- public cache invalidation;
- failure behavior preserving prior published output.

Absence of one of these steps prevents G6 from being accepted.

- [ ] **Step 7: Add security and authorization observations**

Section 9 must separately assess:

- authentication versus owner authorization;
- middleware/proxy coverage;
- server-side enforcement versus UI hiding;
- mutation authorization;
- CSRF/session-cookie assumptions visible in code;
- rate limiting and abuse controls;
- upload and remote-fetch risk;
- secret/environment handling;
- runtime proof explicitly unavailable.

Do not convert a static concern into a vulnerability claim unless the code path supports that conclusion.

- [ ] **Step 8: Verify all admin journeys have primary statuses**

```bash
for section in \
  '6.4 Owner login, session, recovery, and logout' \
  '6.5 Product and family management' \
  '6.6 Catalogues and media management' \
  '6.7 Website content and contact-detail management' \
  '6.8 Draft, review, public preview, publish, revisions, and rollback'; do
  grep -F "$section" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
```

Expected: exit code `0`; each contains one primary status and evidence.

- [ ] **Step 9: Commit admin and security findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit Rosa admin and authorization journeys"
```

---

### Task 6: Reconcile contracts, data models, migrations, Arabic readiness, and duplicate paths

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: `packages/contracts/openapi/rosa-medical.v1.yaml`
- Read: `packages/contracts/src/generated/schema.ts`
- Read: `packages/contracts/src/fixtures/**`
- Read: API clients/adapters/handlers under `apps/web/src/lib/**`, `apps/web/src/app/api/**`, and `services/api/**`
- Read: migrations, policies, and seeds

**Interfaces:**
- Consumes: journey findings and shared contract source
- Produces: contract mismatch register, data-flow mismatch register, Arabic readiness assessment, duplicate/obsolete path register

- [ ] **Step 1: Enumerate OpenAPI operations and application handlers**

```bash
rg -n '^\s{2,}(get|post|put|patch|delete):|operationId:' packages/contracts/openapi/rosa-medical.v1.yaml > /tmp/rosa-openapi-ops.txt
rg -n 'export async function (GET|POST|PUT|PATCH|DELETE)|"use server"|createClient\(' apps/web/src services/api > /tmp/rosa-handler-action-map.txt || true
cat /tmp/rosa-openapi-ops.txt
cat /tmp/rosa-handler-action-map.txt
```

Expected: operation list and implementation entry points.

- [ ] **Step 2: Compare contract shapes with active frontend/backend shapes**

For each approved journey, record:

```markdown
| Operation/capability | OpenAPI source | Generated type use | Active handler/action | Active payload/response | Mismatch | Shared change required |
```

A Next.js route or direct Supabase action not represented in OpenAPI must be named explicitly; do not assume direct integration is contract-compliant.

- [ ] **Step 3: Map migrations, policies, constraints, and seeds**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  'create table|alter table|create policy|row level security|unique|foreign key|storage|bucket|seed' \
  supabase services apps packages . \
  > /tmp/rosa-schema-policy-hits.txt || true
cat /tmp/rosa-schema-policy-hits.txt
```

Expected: exact schema/policy evidence or an explicit absence. Assess whether inquiry snapshots, revisions, publishing states, owner authorization, and EN/AR fields are structurally represented.

- [ ] **Step 4: Assess Arabic and RTL readiness**

Trace:

- paired English/Arabic fields in contract and persistence types;
- locale selection/routing;
- `dir="rtl"` or equivalent layout handling;
- Arabic typography;
- mixed-direction product codes, email, telephone, and numbers;
- admin completeness indicators;
- Arabic-specific tests and screenshots.

Assign one primary status to Section 6.10 and do not treat paired fields alone as an implemented RTL experience.

- [ ] **Step 5: Identify obsolete and duplicate paths**

Compare fixtures, mocks, direct Supabase calls, API routes, server actions, old static components, and historical route names. Add rows only when two paths serve the same current responsibility or a superseded path can mislead future work.

Use:

```markdown
| Path(s) | Why duplicate/obsolete | Current consumer | Risk | Keep/adapt/remove recommendation | Dependency |
```

- [ ] **Step 6: Verify contract source remains unchanged**

```bash
git diff -- packages/contracts/openapi/rosa-medical.v1.yaml packages/contracts/src/generated/schema.ts
```

Expected: no output.

- [ ] **Step 7: Commit contract and data findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: reconcile Rosa contracts data and duplicate paths"
```

---

### Task 7: Establish the test truth table and recompute F0–F9 and G0–G7

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: root and package manifests
- Read: all unit, component, static, contract, integration, browser, accessibility, and build test configuration/files

**Interfaces:**
- Consumes: journey conclusions, current test suite, prior verified synchronization run
- Produces: exact test-evidence truth table, F0–F9 assessment, G0–G7 assessment, code-only verification record

- [ ] **Step 1: Inventory test commands and test files**

```bash
cat package.json
cat apps/web/package.json
cat packages/contracts/package.json
git ls-files | grep -E '(^|/)(test|tests|__tests__)/|\.(test|spec)\.' | sort > /tmp/rosa-test-files.txt
cat /tmp/rosa-test-files.txt
```

Expected: exact scripts and test files.

- [ ] **Step 2: Map each test to the claim it directly proves**

Section 11 must use:

```markdown
| Test file/command | Directly proves | Does not prove | Current evidence result |
```

Examples of prohibited overclaiming:

- route smoke does not prove persistence;
- static admin rendering does not prove owner authorization;
- typecheck does not prove database constraints;
- public Playwright does not prove protected admin behavior;
- mocked success does not prove email/storage delivery.

- [ ] **Step 3: Run the frozen code-only verification gate**

```bash
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm contracts:generate
git diff --exit-code -- packages/contracts/src/generated/schema.ts
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected:

- Node major `24`;
- pnpm `11.4.0`;
- frozen install succeeds;
- generated contract output does not drift;
- lint, typecheck, tests, and build pass.

If the environment cannot satisfy Node/pnpm/network requirements, record the exact command and error. Do not replace fresh failure evidence with the historical successful run.

- [ ] **Step 4: Run only credential-free public browser evidence when supported**

Use the repository’s existing public Playwright command/config. Do not run or bypass protected admin authentication. Record exact projects, pass/fail/skip counts, and whether responses are fixture/mock/live.

Expected: either fresh credential-free evidence or an exact environment blocker. Protected admin browser behavior remains runtime-unverified.

- [ ] **Step 5: Assess F0–F9 individually**

For each layer record:

```markdown
| Layer | Intended result | Evidence | Primary assessment | Blocking gaps |
```

Use only these assessments: `Verified implemented`, `Implemented, runtime-unverified`, `Partially implemented`, `Static or placeholder only`, `Missing`, `Product-rule conflict`, `Obsolete or duplicate path`.

- [ ] **Step 6: Assess G0–G7 individually**

For each gate record:

```markdown
| Gate | Frontend evidence | Backend evidence | Contract/test evidence | Code-only conclusion | Runtime proof still required |
```

No gate requiring live Supabase/auth/storage/email/deployment may be marked fully accepted during this audit.

- [ ] **Step 7: Verify matrix completeness**

```bash
for layer in F0 F1 F2 F3 F4 F5 F6 F7 F8 F9; do
  grep -E "\|[[:space:]]*$layer([[:space:]]|—|-)" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
for gate in G0 G1 G2 G3 G4 G5 G6 G7; do
  grep -E "\|[[:space:]]*$gate([[:space:]]|—|-)" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
```

Expected: exit code `0`.

- [ ] **Step 8: Commit verification and gate conclusions**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish Rosa test truth and gate status"
```

---

### Task 8: Rank corrective work and select the next implementation batch

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: all findings, severities, dependencies, product conflicts, gate conclusions
- Produces: ordered P0–P4 roadmap and one exact next implementation batch with scope, dependencies, exclusions, and verification

- [ ] **Step 1: Normalize every material finding**

Use one row per finding:

```markdown
| ID | Severity | Journey/gate | Finding | Exact paths | Smallest safe correction | Dependencies | Verification |
```

IDs must be stable and sequential: `AUD-P0-01`, `AUD-P1-01`, `AUD-P2-01`, and so on.

- [ ] **Step 2: Order findings by dependency, not file location**

Apply this order:

1. product/security blockers;
2. shared contract/data blockers;
3. core public quotation blockers;
4. owner publishing blockers;
5. remaining public/admin systems;
6. Arabic/RTL;
7. hardening and cleanup.

Do not bundle unrelated refactors into a corrective batch.

- [ ] **Step 3: Select one next implementation batch**

Section 14 must state exactly one recommendation containing:

```markdown
- Batch name
- User-visible outcome
- Included findings
- Exact implementation boundaries
- Shared contract/schema decisions required
- Explicit exclusions
- Verification gate
- Why this precedes the next batch
```

The public procurement slice remains a hypothesis. Choose a narrower P0 correction first if product or owner-authorization conflicts block safe implementation.

- [ ] **Step 4: Write the executive summary last**

The executive summary must include:

- overall implementation state;
- highest-severity verified findings;
- strongest completed areas;
- major runtime-unverified areas;
- recomputed gate summary;
- exact next batch.

Do not add conclusions not supported in later sections.

- [ ] **Step 5: Run report consistency checks**

```bash
rg -n 'TBD|TODO|implement later|fill in|probably|appears complete without evidence' docs/superpowers/audits/2026-08-03-implementation-gap-audit.md && exit 1 || true
rg -n 'Verified implemented|Implemented, runtime-unverified|Partially implemented|Static or placeholder only|Missing|Product-rule conflict|Obsolete or duplicate path' docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
rg -n 'AUD-P[0-4]-[0-9]{2}' docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
```

Expected: no placeholder language; classifications and finding IDs are present.

- [ ] **Step 6: Commit the corrective roadmap**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: prioritize Rosa corrective implementation roadmap"
```

---

### Task 9: Recheck latest main, update coordination, and finalize the audit branch

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: completed audit, fresh `origin/main`, exact final finding IDs and next batch
- Produces: final stale-base check, append-only coordination entry, documentation-only diff, reviewable pull request

- [ ] **Step 1: Re-fetch and compare latest main with the audited baseline**

```bash
git fetch origin --prune
ORIGINAL_AUDITED_BASE="$(cat /tmp/rosa-audited-main-sha)"
LATEST_MAIN="$(git rev-parse origin/main)"
printf 'audited=%s\nlatest=%s\n' "$ORIGINAL_AUDITED_BASE" "$LATEST_MAIN"
```

Expected: either identical SHAs or a clearly detected change.

- [ ] **Step 2: Handle a changed main without hiding it**

If the SHAs differ:

```bash
git diff --name-status "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
git log --oneline "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
```

Reinspect every changed path that intersects the audit. Update affected findings and Section 15. Do not finalize against stale evidence. If changes are extensive enough to invalidate the report, stop and restart from the new baseline rather than patching conclusions casually.

- [ ] **Step 3: Append the coordination entry**

Update only the top coordination timestamp and append a dated entry under **Messages between AIs** using this exact structure:

```markdown
### 2026-08-03 — Frontend AI → Backend AI

- Branch: `audit/implementation-gap-2026-08-03`
- Audited application commit: `<exact SHA>`
- Scope: repository-wide code-only implementation-gap audit; no live Supabase, owner-session, email, storage, or deployment verification
- Top P0/P1 findings: `<finding IDs and one-line descriptions>`
- Recomputed gates: `<G0–G7 concise status summary>`
- Recommended next batch: `<exact batch name>`
- Shared decisions or response needed: `<contract/schema/ownership decisions, or None>`
```

Do not rewrite historical lane entries or old decision records.

- [ ] **Step 4: Verify the final diff is documentation-only**

```bash
git status --short
git diff --name-only "$(git merge-base HEAD origin/main)"..HEAD
```

Expected changed paths only:

```text
README.md
docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md
docs/superpowers/plans/2026-08-03-implementation-gap-audit.md
docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
```

No application, contract, migration, environment, security, or deployment file may be changed.

- [ ] **Step 5: Validate every acceptance criterion**

Check manually and record in the report:

```markdown
- [x] Every approved public and admin journey has one primary status.
- [x] Every F0–F9 layer has an evidence-based assessment.
- [x] Every G0–G7 gate has an evidence-based conclusion.
- [x] Every product conflict names exact paths and a smallest safe correction.
- [x] Runtime-dependent claims are marked unverified.
- [x] Tests are cited only for what they directly establish.
- [x] Duplicate and obsolete paths are identified without deletion.
- [x] No application behavior or shared interface changed.
- [x] One exact next implementation batch is selected.
- [x] Latest main was rechecked before finalization.
```

- [ ] **Step 6: Commit final coordination**

```bash
git add README.md docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: finalize Rosa implementation gap audit"
```

- [ ] **Step 7: Review the complete branch before pushing**

```bash
git log --oneline --decorate origin/main..HEAD
git diff --stat origin/main..HEAD
git diff --check origin/main..HEAD
```

Expected: meaningful documentation commits, documentation-only statistics, and no whitespace errors.

- [ ] **Step 8: Push and open a documentation-only pull request**

```bash
git push -u origin audit/implementation-gap-2026-08-03
```

PR title:

```text
Audit integrated Rosa implementation gaps
```

PR body must state the audited application SHA, code-only limitations, top findings, recomputed gate summary, recommended next batch, and confirmation that no application behavior changed.
