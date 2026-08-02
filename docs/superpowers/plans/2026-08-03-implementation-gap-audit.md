# Rosa Medical Implementation-Gap Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a repository-wide, code-only evidence audit that classifies every approved Rosa Medical journey, frontend layer, integration gate, product-rule conflict, and runtime-verification limitation, then recommends one exact next implementation batch.

**Architecture:** This is a documentation-only audit. It traces approved journeys across public UI, admin UI, Next.js handlers/actions, Supabase boundaries, OpenAPI contracts, migrations, tests, and deployment configuration while preserving current behavior. Findings are written to one audit report and summarized in the root coordination README.

**Tech Stack:** Git; Node.js 24; pnpm 11.4.0; Next.js App Router; React; strict TypeScript; Supabase; OpenAPI 3.1; Vitest; React Testing Library; Playwright; Markdown.

## Global Constraints

- Start from the latest `main` and record the exact application commit audited.
- Latest `main` remains authoritative for backend implementation, security, Supabase, environment, middleware, API routes, persistence, package configuration, and deployment mechanics.
- The owner’s latest explicit decisions and accepted product rules outrank conflicting implementation behavior.
- The audit is code-only: no credentials, live Supabase, fabricated owner session, real email, real storage, DNS, or deployment verification.
- Runtime-dependent capabilities are **implemented, runtime-unverified** unless static evidence supports a weaker status.
- Do not modify application code, contracts, schemas, migrations, security rules, environment configuration, deployment configuration, or product behavior.
- Do not delete obsolete or conflicting paths during the audit.
- Cite exact repository paths and exact tests for every material conclusion.
- Keep public product inquiries and general contact messages separate.
- Enforce the quotation-led product model: no public prices, payments, checkout, inventory, shipping, discounts, ratings, or orders.
- Preserve one protected owner and Draft → Review → Public Preview → Explicit Publish as governing requirements.
- Re-fetch and compare latest `main` before finalizing.
- Avoid unnecessary GitHub Actions runs.

---

## File Structure

**Create**

- `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md` — complete evidence report.

**Modify**

- `README.md` — update the coordination timestamp and append one dated audit entry after findings are final.

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
- all tracked migration, policy, seed, middleware/proxy, environment, Cloudflare, OpenNext, and deployment files discovered during inventory

---

### Task 1: Freeze the application baseline and create an isolated audit branch

**Files:**
- Read: `README.md`
- Read: `docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`
- Read: `docs/superpowers/plans/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: `origin/main`, approved audit specification, this plan
- Produces: exact audited application SHA, branch `audit/implementation-gap-2026-08-03`, isolated worktree

- [ ] **Step 1: Fetch current refs and verify a clean checkout**

```bash
git fetch origin --prune
git status --short
```

Expected: no output from `git status --short`.

- [ ] **Step 2: Record latest main**

```bash
AUDITED_APPLICATION_BASE="$(git rev-parse origin/main)"
printf '%s\n' "$AUDITED_APPLICATION_BASE"
git show -s --format='%H%n%ci%n%s' "$AUDITED_APPLICATION_BASE"
printf '%s\n' "$AUDITED_APPLICATION_BASE" > /tmp/rosa-audited-main-sha
```

Expected: one exact SHA, timestamp, and subject. The known checkpoint while planning was `8ad8098e9999fbdd2ee65edeaa8410928922b8e8`; execution uses the freshly fetched value.

- [ ] **Step 3: Ensure the documentation branch includes current main history**

```bash
git switch docs/implementation-gap-audit-spec
git pull --ff-only origin docs/implementation-gap-audit-spec
git merge-base --is-ancestor "$AUDITED_APPLICATION_BASE" HEAD
```

Expected: exit code `0`. If it fails, rebase only the documentation branch onto `origin/main` and resolve documentation conflicts without touching application files.

- [ ] **Step 4: Create the audit worktree**

```bash
git branch audit/implementation-gap-2026-08-03 HEAD
git worktree add ../RosaMedical-audit audit/implementation-gap-2026-08-03
cd ../RosaMedical-audit
git status --short
git rev-parse HEAD
```

Expected: clean status and a branch containing the approved specification and plan.

---

### Task 2: Create the report skeleton and source register

**Files:**
- Create: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: all governing sources listed above

**Interfaces:**
- Consumes: audited SHA, source hierarchy, status model, severity model
- Produces: full report structure, baseline statement, limitations, source register

- [ ] **Step 1: Read the complete governing sources**

```bash
cat README.md
cat docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md
cat docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md
cat docs/superpowers/completions/2026-08-02-main-frontend-f3ed-sync.md
cat docs/superpowers/completions/2026-08-02-rosa-medical-consolidated-frontend-verification.md
cat docs/superpowers/completions/2026-08-02-frontend-backend-selective-integration.md
cat packages/contracts/openapi/rosa-medical.v1.yaml
```

Expected: each tracked file resolves. Record any missing historical file as absent.

- [ ] **Step 2: Generate the tracked-file inventory**

```bash
git ls-files > /tmp/rosa-all-files.txt
grep -E '^(apps/web|packages/contracts|services/api|supabase|migrations|\.github|docs/runbooks|wrangler|open-next|next\.config)' \
  /tmp/rosa-all-files.txt > /tmp/rosa-audit-surface.txt || true
wc -l /tmp/rosa-all-files.txt /tmp/rosa-audit-surface.txt
cat /tmp/rosa-audit-surface.txt
```

Expected: full tracked-file list and narrowed audit surface.

- [ ] **Step 3: Create the report using the actual baseline SHA**

```bash
BASE="$(cat /tmp/rosa-audited-main-sha)"
mkdir -p docs/superpowers/audits
cat > docs/superpowers/audits/2026-08-03-implementation-gap-audit.md <<EOF
# Rosa Medical Implementation-Gap Audit

## 1. Executive summary

## 2. Audited baseline and limitations

- Audited application baseline: \`$BASE\`
- Audit execution branch: \`audit/implementation-gap-2026-08-03\`
- Method: code-only repository audit
- External runtime verification: not performed
- Protected owner browser verification: not performed

### Status legend

1. Verified implemented
2. Implemented, runtime-unverified
3. Partially implemented
4. Static or placeholder only
5. Missing
6. Product-rule conflict
7. Obsolete or duplicate path

### Severity legend

- P0 — Product or security blocker
- P1 — Core business-flow blocker
- P2 — Major incompleteness
- P3 — Quality gap
- P4 — Cleanup

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

## 16. Acceptance checklist
EOF
```

Expected: actual SHA appears in Section 2.

- [ ] **Step 4: Verify headings**

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
  'Recheck against latest main' \
  'Acceptance checklist'; do
  grep -F "$heading" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
```

Expected: exit code `0`.

- [ ] **Step 5: Commit the foundation**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish implementation gap audit baseline"
```

---

### Task 3: Map architecture, persistence, authorization, and product conflicts

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: application, contract, service, migration, policy, seed, middleware/proxy, environment, and deployment paths

**Interfaces:**
- Consumes: repository inventory and governing rules
- Produces: architecture map, persistence/auth map, product-rule conflict register

- [ ] **Step 1: Map tracked implementation boundaries**

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

Expected: exact tracked paths. Empty service output is evidence of an absent separate service.

- [ ] **Step 2: Locate persistence and authorization boundaries**

```bash
rg -n --hidden --glob '!node_modules/**' \
  -e 'createClient\(' \
  -e 'supabase\.' \
  -e 'auth\.' \
  -e 'requireAdmin' \
  -e 'middleware' \
  -e 'proxy' \
  -e 'cookies\(' \
  -e '\.from\(' \
  apps/web packages/contracts services/api . \
  > /tmp/rosa-persistence-auth-hits.txt || true
cat /tmp/rosa-persistence-auth-hits.txt
```

Expected: all visible Supabase reads/writes, auth checks, guards, middleware, and proxy/session files.

- [ ] **Step 3: Locate active product-conflict vocabulary**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  '\b(checkout|cart|order|orders|payment|payments|price|prices|inventory|stock|shipping|discount|rating|ratings|customer login|sign up|register)\b' \
  apps/web packages/contracts services/api README.md docs \
  > /tmp/rosa-product-conflict-hits.txt || true
cat /tmp/rosa-product-conflict-hits.txt
```

Expected: exact hits, including current checkout/order/cart terminology where present.

- [ ] **Step 4: Record each active conflict**

Use one row per active conflict:

```markdown
| Finding ID | Severity | Accepted rule | Active paths | Current behavior | Useful behavior to preserve | Smallest safe correction | Verification required |
```

Assign stable IDs sequentially by severity, beginning with `AUD-P0-01`, `AUD-P1-01`, and so on.

- [ ] **Step 5: Complete the architecture map**

Section 4 must cite exact paths for public routes, protected admin routes, server components/actions/handlers, browser/server Supabase clients, session refresh, owner guard, OpenAPI source/generated types, migrations/policies/seeds, storage/email boundaries, deployment configuration, and planned-but-absent boundaries. Label deductions as inference.

- [ ] **Step 6: Verify documentation-only changes**

```bash
git status --short
```

Expected: only the audit report is modified.

- [ ] **Step 7: Commit findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: map Rosa architecture and product conflicts"
```

---

### Task 4: Audit all public journeys

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: public routes, features, components, handlers, contract operations, and tests

**Interfaces:**
- Consumes: route inventory, architecture map, contract operations
- Produces: primary status and evidence for product browsing, quotation/inquiry, contact, search, and public content

- [ ] **Step 1: Build the public file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'products|families|catalogues|inquiry|quotation|checkout|contact|search|procurement|privacy|terms' \
  apps/web/src/app apps/web/src/features apps/web/src/components apps/web/src/lib packages/contracts apps/web/tests \
  | sort -u > /tmp/rosa-public-journey-files.txt
cat /tmp/rosa-public-journey-files.txt
```

Expected: exact public components, handlers, adapters, tests, and contract files.

- [ ] **Step 2: Trace homepage → products → family → product detail**

Record navigation, data source, published-only filtering, catalogue/specification rendering, loading/empty/not-found/error states, responsive action differences, and tests. Assign one primary status to Section 6.1.

- [ ] **Step 3: Trace the complete quotation journey**

Trace product action → selection state → form → validation → handler/action → persistence → success/failure → owner-visible record. Answer whether anonymous submission works, whether items are immutable snapshots, whether idempotency represents the submitted selection, whether public terminology is inquiry/quotation, and whether the owner can view the result. Assign one primary status to Section 6.2.

- [ ] **Step 4: Trace general contact separately**

Trace form → validation → handler → spam behavior → persistence → success/failure → admin message view. Assign one primary status to Section 6.3.

- [ ] **Step 5: Trace search and public content**

Inspect search query parsing, indexed/data fields, no-result/error states, and links. Inspect Catalogues, About, Procurement Support, Contact, Privacy, and Terms for fixture/live/placeholder status and unsupported claims. Assign one primary status to Section 6.9.

- [ ] **Step 6: Use the common journey matrix**

```markdown
| Capability | Primary status | Direct code evidence | Contract evidence | Test evidence | Runtime proof unavailable | Product conflict | Smallest correction | Priority |
```

- [ ] **Step 7: Commit public findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit public Rosa business journeys"
```

---

### Task 5: Audit authentication and admin journeys

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: admin routes, admin feature code, guards, actions, handlers, Supabase queries, and tests

**Interfaces:**
- Consumes: authorization map and admin inventory
- Produces: statuses for auth, CRUD, catalogues/media, inquiries/messages, content/contact details, publishing/revisions/rollback, and security findings

- [ ] **Step 1: Build the admin file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'admin|login|logout|recovery|session|product|family|catalogue|media|inquir|message|content|contact|publish|revision|rollback|preview' \
  apps/web/src/app/admin apps/web/src/features apps/web/src/lib apps/web/src/test apps/web/tests \
  | sort -u > /tmp/rosa-admin-journey-files.txt
cat /tmp/rosa-admin-journey-files.txt
```

Expected: exact admin surfaces and tests.

- [ ] **Step 2: Trace owner login, session, recovery, logout, and authorization**

Record what redirects unauthenticated access, whether the guard proves the single owner or merely any Supabase user, where refresh/expiry/logout/recovery are handled, and which claims remain runtime-unverified. Classify any-authenticated-user access to owner operations as P0 only when code supports it.

- [ ] **Step 3: Trace products and families management**

Trace list → create/edit → validation → save → archive/delete → preview → public visibility. Record EN/AR fields, publication state, and protected design boundaries.

- [ ] **Step 4: Trace catalogues and media**

Inspect upload/select/replace/delete, storage buckets, file validation, usage mapping, alt text, PDF handling, and result states. Mark external storage runtime-unverified.

- [ ] **Step 5: Trace inquiries and messages administration**

Confirm product inquiries and general messages remain separate. Record statuses, internal notes, appointment behavior, and conflicts.

- [ ] **Step 6: Trace content, contact details, publishing, revisions, and rollback**

Locate controlled fields, drafts, review warnings, preview isolation, explicit publish, transaction boundaries, revision creation, rollback-as-new-revision, public invalidation, and failed-publish preservation. Missing steps prevent G6 acceptance.

- [ ] **Step 7: Complete security observations**

Assess authentication versus authorization, middleware/proxy coverage, server enforcement versus UI hiding, mutation authorization, cookie/session and CSRF assumptions, rate limiting, abuse controls, upload/remote-fetch risk, secrets/environment handling, and unavailable runtime proof. Do not label a concern a vulnerability without code support.

- [ ] **Step 8: Commit admin findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit Rosa admin and authorization journeys"
```

---

### Task 6: Reconcile contracts, schemas, Arabic readiness, and duplicate paths

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: OpenAPI source, generated schema, fixtures, handlers/actions/adapters, migrations, policies, and seeds

**Interfaces:**
- Consumes: journey findings and contract source
- Produces: contract mismatch table, schema/policy assessment, Arabic/RTL assessment, duplicate/obsolete register

- [ ] **Step 1: Enumerate OpenAPI operations and implementation entry points**

```bash
rg -n '^\s{2,}(get|post|put|patch|delete):|operationId:' \
  packages/contracts/openapi/rosa-medical.v1.yaml > /tmp/rosa-openapi-ops.txt
rg -n 'export async function (GET|POST|PUT|PATCH|DELETE)|"use server"|createClient\(' \
  apps/web/src services/api > /tmp/rosa-handler-action-map.txt || true
cat /tmp/rosa-openapi-ops.txt
cat /tmp/rosa-handler-action-map.txt
```

Expected: exact contract operations and implementation entry points.

- [ ] **Step 2: Compare contract and active shapes**

```markdown
| Operation or capability | OpenAPI source | Generated type use | Active handler or action | Active payload or response | Mismatch | Shared change required |
```

Name direct Supabase or Next handlers missing from OpenAPI.

- [ ] **Step 3: Map migrations, policies, constraints, storage, and seeds**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  'create table|alter table|create policy|row level security|unique|foreign key|storage|bucket|seed' \
  supabase services apps packages . \
  > /tmp/rosa-schema-policy-hits.txt || true
cat /tmp/rosa-schema-policy-hits.txt
```

Assess inquiry snapshots, revisions, publishing state, owner authorization, and EN/AR fields.

- [ ] **Step 4: Assess Arabic and RTL readiness**

Trace paired fields, locale routing, RTL handling, Arabic typography, mixed-direction values, admin completeness indicators, and Arabic tests. Assign one primary status to Section 6.10.

- [ ] **Step 5: Record duplicate and obsolete paths**

```markdown
| Path or paths | Why duplicate or obsolete | Current consumer | Risk | Keep, adapt, or remove recommendation | Dependency |
```

Compare mocks, fixtures, direct Supabase calls, API routes, server actions, old static components, and historical route names.

- [ ] **Step 6: Verify contract files remain unchanged**

```bash
git diff -- packages/contracts/openapi/rosa-medical.v1.yaml packages/contracts/src/generated/schema.ts
```

Expected: no output.

- [ ] **Step 7: Commit contract/data findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: reconcile Rosa contracts data and duplicate paths"
```

---

### Task 7: Build the test truth table and recompute F0–F9 and G0–G7

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: package manifests, test configuration, test files, prior verification records

**Interfaces:**
- Consumes: journey conclusions and test suite
- Produces: test truth table, F0–F9 matrix, G0–G7 matrix, fresh code-only verification record

- [ ] **Step 1: Inventory commands and tests**

```bash
cat package.json
cat apps/web/package.json
cat packages/contracts/package.json
git ls-files | grep -E '(^|/)(test|tests|__tests__)/|\.(test|spec)\.' | sort > /tmp/rosa-test-files.txt
cat /tmp/rosa-test-files.txt
```

Expected: exact scripts and test files.

- [ ] **Step 2: Build the test truth table**

```markdown
| Test file or command | Directly proves | Does not prove | Evidence result |
```

Explicitly note that route smoke does not prove persistence, static admin rendering does not prove owner authorization, typecheck does not prove database constraints, public Playwright does not prove protected admin behavior, and mocked success does not prove email/storage delivery.

- [ ] **Step 3: Run the frozen code-only gate**

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

Expected: Node major 24, pnpm 11.4.0, frozen install success, no generated drift, and passing lint/typecheck/tests/build. Record exact environment blockers instead of replacing them with historical success.

- [ ] **Step 4: Run credential-free public browser evidence when supported**

Read the exact Playwright script from `apps/web/package.json` and the prior public-matrix completion record, then run only the existing F3A–F3D public desktop/tablet/mobile matrix. Record command, projects, pass/fail/skip counts, and fixture/mock/live mode. Do not run or bypass protected admin authentication.

- [ ] **Step 5: Assess F0–F9**

```markdown
| Layer | Intended result | Evidence | Primary assessment | Blocking gaps |
```

Every layer F0 through F9 receives one primary status.

- [ ] **Step 6: Assess G0–G7**

```markdown
| Gate | Frontend evidence | Backend evidence | Contract or test evidence | Code-only conclusion | Runtime proof still required |
```

No gate requiring live Supabase/auth/storage/email/deployment is fully accepted.

- [ ] **Step 7: Verify matrix completeness**

```bash
for layer in F0 F1 F2 F3 F4 F5 F6 F7 F8 F9; do
  grep -E "\|[[:space:]]*$layer([[:space:]]|—|-)" \
    docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
for gate in G0 G1 G2 G3 G4 G5 G6 G7; do
  grep -E "\|[[:space:]]*$gate([[:space:]]|—|-)" \
    docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
```

Expected: exit code `0`.

- [ ] **Step 8: Commit test/gate findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish Rosa test truth and gate status"
```

---

### Task 8: Rank findings and select one next implementation batch

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: findings, severities, dependencies, conflicts, gate conclusions
- Produces: ordered roadmap, exact next batch, executive summary

- [ ] **Step 1: Normalize material findings**

```markdown
| Finding ID | Severity | Journey or gate | Finding | Exact paths | Smallest safe correction | Dependencies | Verification |
```

Keep IDs stable and sequential by severity.

- [ ] **Step 2: Order work by dependency**

1. product/security blockers;
2. shared contract/data blockers;
3. core public quotation blockers;
4. owner publishing blockers;
5. remaining public/admin systems;
6. Arabic/RTL;
7. hardening and cleanup.

- [ ] **Step 3: Select exactly one next batch**

Section 14 must state actual values for:

- batch name;
- user-visible outcome;
- included finding IDs;
- exact implementation boundaries;
- shared contract/schema decisions required;
- explicit exclusions;
- verification gate;
- why this batch comes first.

The public procurement slice remains a hypothesis. Select a narrower P0 correction first if needed.

- [ ] **Step 4: Write the executive summary from completed evidence**

Include overall state, highest-severity findings, strongest completed areas, major runtime-unverified areas, recomputed gates, and exact next batch.

- [ ] **Step 5: Check report completeness**

```bash
if rg -n 'TBD|TODO|implement later|fill in details|AUDITED_APPLICATION_BASE_GOES_HERE' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md; then
  exit 1
fi
rg -n 'Verified implemented|Implemented, runtime-unverified|Partially implemented|Static or placeholder only|Missing|Product-rule conflict|Obsolete or duplicate path' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
rg -n 'AUD-P[0-4]-[0-9]{2}' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
```

Expected: no unfinished markers; classifications and finding IDs are present.

- [ ] **Step 6: Commit roadmap**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: prioritize Rosa corrective implementation roadmap"
```

---

### Task 9: Recheck main, update coordination, and finalize

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: completed report and fresh `origin/main`
- Produces: stale-base check, append-only coordination entry, documentation-only branch, PR

- [ ] **Step 1: Re-fetch and compare main**

```bash
git fetch origin --prune
ORIGINAL_AUDITED_BASE="$(cat /tmp/rosa-audited-main-sha)"
LATEST_MAIN="$(git rev-parse origin/main)"
printf 'audited=%s\nlatest=%s\n' "$ORIGINAL_AUDITED_BASE" "$LATEST_MAIN"
```

Expected: identical SHAs or a detected change.

- [ ] **Step 2: Reconcile changed main**

```bash
git diff --name-status "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
git log --oneline "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
```

Reinspect every changed path intersecting the audit. Restart from the new baseline if changes invalidate broad conclusions.

- [ ] **Step 3: Complete Sections 15 and 16**

Section 15 records both SHAs, changed paths, and reinspection result. Section 16 checks that every journey has one status, F0–F9 and G0–G7 are complete, conflicts cite exact paths and smallest corrections, runtime claims are marked, tests are not overclaimed, duplicates are identified without deletion, no application/shared interface changed, one next batch is selected, and latest main was rechecked.

- [ ] **Step 4: Append one README coordination entry**

Update only the top timestamp and append a dated entry under **Messages between AIs** containing actual report values:

- branch `audit/implementation-gap-2026-08-03`;
- exact audited SHA;
- code-only limitation;
- actual P0/P1 finding IDs and summaries;
- concise G0–G7 conclusions;
- exact recommended batch;
- actual shared decisions/partner response required, or `None`.

Do not rewrite historical entries.

- [ ] **Step 5: Verify documentation-only diff**

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

- [ ] **Step 6: Run final document checks**

```bash
if rg -n 'TBD|TODO|implement later|fill in details|AUDITED_APPLICATION_BASE_GOES_HERE' \
  README.md \
  docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md \
  docs/superpowers/plans/2026-08-03-implementation-gap-audit.md \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md; then
  exit 1
fi
git diff --check origin/main..HEAD
```

Expected: no unfinished markers and no whitespace errors.

- [ ] **Step 7: Commit final coordination**

```bash
git add README.md docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: finalize Rosa implementation gap audit"
```

- [ ] **Step 8: Review, push, and open the PR**

```bash
git log --oneline --decorate origin/main..HEAD
git diff --stat origin/main..HEAD
git diff --check origin/main..HEAD
git push -u origin audit/implementation-gap-2026-08-03
```

PR title:

```text
Audit integrated Rosa implementation gaps
```

The PR body states the exact audited SHA, code-only limitations, actual top findings, recomputed gate conclusions, exact next batch, and confirmation that no application behavior changed.
