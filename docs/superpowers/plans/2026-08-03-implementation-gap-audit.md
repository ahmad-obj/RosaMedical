# Rosa Medical Implementation-Gap Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a repository-wide, code-only evidence audit that classifies every approved Rosa Medical journey, frontend layer, integration gate, product-rule conflict, and runtime-verification limitation, then recommends one exact next implementation batch.

**Architecture:** The audit is documentation-only. It traces approved user journeys across public UI, admin UI, Next.js handlers/actions, Supabase boundaries, OpenAPI contracts, migrations, tests, and deployment configuration while preserving current application behavior. Findings live in one evidence report and are summarized in the root coordination README.

**Tech Stack:** Git; Node.js 24; pnpm 11.4.0; Next.js App Router; React; strict TypeScript; Supabase; OpenAPI 3.1; Vitest; React Testing Library; Playwright; Markdown.

## Global Constraints

- Start from the latest `main` and record the exact application commit audited.
- Latest `main` remains authoritative for backend implementation, security, Supabase, environment, middleware, API routes, persistence, package configuration, and deployment mechanics.
- The owner’s latest explicit decisions and accepted product rules outrank conflicting implementation behavior.
- The audit is code-only: no credentials, live Supabase, fabricated owner session, real email, real storage, DNS, or deployment verification.
- Runtime-dependent capabilities are **implemented, runtime-unverified** unless static evidence supports a weaker status.
- Do not modify application code, contracts, schemas, migrations, security rules, environment configuration, deployment configuration, or product behavior.
- Do not delete obsolete or conflicting paths during this audit.
- Cite exact repository paths and exact tests for every material conclusion.
- Keep public product inquiries and general contact messages separate.
- Enforce the quotation-led model: no public prices, payments, checkout, inventory, shipping, discounts, ratings, or orders.
- Preserve one protected owner and Draft → Review → Public Preview → Explicit Publish as governing requirements.
- Re-fetch and compare latest `main` before finalizing.
- Avoid unnecessary GitHub Actions runs.

---

## File Structure

**Create**

- `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md` — complete audit report.

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
- Consumes: `origin/main`, approved audit specification, this implementation plan
- Produces: exact audited application SHA, execution branch `audit/implementation-gap-2026-08-03`, isolated worktree

- [ ] **Step 1: Fetch current refs and verify a clean checkout**

```bash
git fetch origin --prune
git status --short
```

Expected: no output from `git status --short`. Stop and preserve uncommitted work if output exists.

- [ ] **Step 2: Record the latest main commit**

```bash
AUDITED_APPLICATION_BASE="$(git rev-parse origin/main)"
printf '%s\n' "$AUDITED_APPLICATION_BASE"
git show -s --format='%H%n%ci%n%s' "$AUDITED_APPLICATION_BASE"
printf '%s\n' "$AUDITED_APPLICATION_BASE" > /tmp/rosa-audited-main-sha
```

Expected: one exact SHA, timestamp, and subject. The known main checkpoint while this plan was written was `8ad8098e9999fbdd2ee65edeaa8410928922b8e8`, but execution uses the freshly fetched SHA.

- [ ] **Step 3: Ensure the documentation branch includes current main history**

```bash
git switch docs/implementation-gap-audit-spec
git pull --ff-only origin docs/implementation-gap-audit-spec
git merge-base --is-ancestor "$AUDITED_APPLICATION_BASE" HEAD
```

Expected: exit code `0`. If it fails, rebase only the documentation branch onto `origin/main`, resolve documentation conflicts without changing application files, then rerun the command.

- [ ] **Step 4: Create the execution worktree**

```bash
git branch audit/implementation-gap-2026-08-03 HEAD
git worktree add ../RosaMedical-audit audit/implementation-gap-2026-08-03
cd ../RosaMedical-audit
git status --short
git rev-parse HEAD
```

Expected: clean status and a branch containing the approved specification and plan.

---

### Task 2: Build the report skeleton and source register

**Files:**
- Create: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: governing sources listed in File Structure

**Interfaces:**
- Consumes: audited SHA, source hierarchy, status model, severity model
- Produces: complete report structure, baseline statement, limitations, source register

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

Expected: each tracked file resolves. Record any missing historical file as absent; do not silently substitute another source.

- [ ] **Step 2: Generate the tracked-file inventory**

```bash
git ls-files > /tmp/rosa-all-files.txt
grep -E '^(apps/web|packages/contracts|services/api|supabase|migrations|\.github|docs/runbooks|wrangler|open-next|next\.config)' \
  /tmp/rosa-all-files.txt > /tmp/rosa-audit-surface.txt || true
wc -l /tmp/rosa-all-files.txt /tmp/rosa-audit-surface.txt
cat /tmp/rosa-audit-surface.txt
```

Expected: a full tracked-file list and a narrower audit-surface list.

- [ ] **Step 3: Create the report with the exact required sections and actual baseline SHA**

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

Expected: the report contains the actual SHA, not a template marker.

- [ ] **Step 4: Verify all required headings**

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

- [ ] **Step 5: Commit the report foundation**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish implementation gap audit baseline"
```

---

### Task 3: Map architecture, persistence, authorization, and product conflicts

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: `apps/web/src/app/**`
- Read: `apps/web/src/lib/**`
- Read: `packages/contracts/**`
- Read: `services/api/**`
- Read: tracked migration, policy, seed, middleware/proxy, environment, and deployment files

**Interfaces:**
- Consumes: repository inventory, governing rules
- Produces: architecture map, persistence/auth map, product-rule conflict register

- [ ] **Step 1: Map route, server, Supabase, and contract paths**

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

Expected: exact tracked paths. Empty service output is evidence of an absent separate service, not proof of hidden implementation.

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

- [ ] **Step 3: Locate active product-model conflict vocabulary**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  '\b(checkout|cart|order|orders|payment|payments|price|prices|inventory|stock|shipping|discount|rating|ratings|customer login|sign up|register)\b' \
  apps/web packages/contracts services/api README.md docs \
  > /tmp/rosa-product-conflict-hits.txt || true
cat /tmp/rosa-product-conflict-hits.txt
```

Expected: exact hits, including current checkout/order/cart terminology where present. Separate historical documentation from active user-facing behavior.

- [ ] **Step 4: Trace every active conflict**

For each active conflict, inspect the whole file and callers. Record one row with:

```markdown
| Finding ID | Severity | Accepted rule | Active paths | Current behavior | Useful behavior to preserve | Smallest safe correction | Verification required |
```

Assign finding IDs sequentially, beginning with `AUD-P0-01` for the first P0, `AUD-P1-01` for the first P1, and so on.

- [ ] **Step 5: Complete the architecture map**

Section 4 must name exact paths for:

- public route composition;
- protected admin composition;
- server components, server actions, and route handlers;
- browser/server Supabase clients;
- session refresh and admin guard;
- OpenAPI source and generated types;
- migrations, policies, and seeds actually present;
- storage and email boundaries actually present;
- Cloudflare/OpenNext/Next deployment path;
- planned-but-absent boundaries.

Label structural deductions as inference.

- [ ] **Step 6: Verify documentation-only changes**

```bash
git status --short
```

Expected: only the audit report is modified.

- [ ] **Step 7: Commit architecture and conflict findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: map Rosa architecture and product conflicts"
```

---

### Task 4: Audit all public business journeys

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: public routes, features, components, handlers, contract operations, and tests

**Interfaces:**
- Consumes: public route inventory, architecture map, contract operations
- Produces: primary status and evidence for discovery, products, quotation/inquiry, contact, search, and public content

- [ ] **Step 1: Build the public-journey file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'products|families|catalogues|inquiry|quotation|checkout|contact|search|procurement|privacy|terms' \
  apps/web/src/app apps/web/src/features apps/web/src/components apps/web/src/lib packages/contracts apps/web/tests \
  | sort -u > /tmp/rosa-public-journey-files.txt
cat /tmp/rosa-public-journey-files.txt
```

Expected: exact public components, handlers, adapters, tests, and contract files.

- [ ] **Step 2: Trace homepage → products → family → product detail**

Record exact evidence for:

- navigation entry points;
- family/product data source;
- published-only filtering;
- catalogue/specification rendering;
- loading, empty, not-found, and error states;
- responsive inquiry action differences;
- tests proving rendering versus real data behavior.

Assign one primary status to Section 6.1.

- [ ] **Step 3: Trace the complete quotation journey**

Trace product action → selection state → quotation form → validation → handler/action → persistence write → success/failure state → owner-visible record.

Answer explicitly:

- whether anonymous submission is supported;
- whether product items are preserved as immutable snapshots;
- whether idempotency represents the submitted selection;
- whether public terminology is inquiry/quotation rather than checkout/order;
- whether an admin route can view the stored result.

Assign one primary status to Section 6.2.

- [ ] **Step 4: Trace general contact separately**

Trace contact form → validation → handler → spam behavior → persistence → success/failure → admin message view. Assign one primary status to Section 6.3.

- [ ] **Step 5: Trace search and public content**

Inspect search query parsing, data source/indexed fields, no-result/error states, and result links. Inspect Catalogues, About, Procurement Support, Contact, Privacy, and Terms for fixture/live/placeholder status and unsupported claims. Assign one primary status to Section 6.9 and include public-content findings in the journey matrix.

- [ ] **Step 6: Use one evidence table shape consistently**

```markdown
| Capability | Primary status | Direct code evidence | Contract evidence | Test evidence | Runtime proof unavailable | Product conflict | Smallest correction | Priority |
```

Do not use build, lint, or typecheck as proof of persistence, authorization, email, storage, or publishing.

- [ ] **Step 7: Commit public journey findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit public Rosa business journeys"
```

---

### Task 5: Audit owner authentication and admin management journeys

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: admin routes, admin feature code, guards, actions, handlers, Supabase queries, and tests

**Interfaces:**
- Consumes: authorization map, admin route inventory
- Produces: primary statuses for auth, CRUD, catalogues/media, inquiries/messages, content/contact details, publishing/revisions/rollback, plus security findings

- [ ] **Step 1: Build the admin-journey file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'admin|login|logout|recovery|session|product|family|catalogue|media|inquir|message|content|contact|publish|revision|rollback|preview' \
  apps/web/src/app/admin apps/web/src/features apps/web/src/lib apps/web/src/test apps/web/tests \
  | sort -u > /tmp/rosa-admin-journey-files.txt
cat /tmp/rosa-admin-journey-files.txt
```

Expected: exact admin surfaces and tests.

- [ ] **Step 2: Trace login, session, recovery, logout, and owner authorization**

Record exact evidence answering:

- what redirects unauthenticated access;
- whether the guard proves the user is the single owner or merely any Supabase user;
- where refresh, expiry, logout, and recovery are handled;
- which claims remain runtime-unverified.

Treat any-authenticated-user access to owner operations as P0 only when the code supports that conclusion.

- [ ] **Step 3: Trace product and family management**

Trace list → create/edit → validation → save → archive/delete → preview → public visibility. Record EN/AR fields, publication state, and protected design boundaries.

- [ ] **Step 4: Trace catalogues and media**

Inspect upload/select/replace/delete, storage buckets, file validation, usage mapping, alt text, PDF handling, and result states. Mark external storage behavior runtime-unverified.

- [ ] **Step 5: Trace inquiries and messages administration**

Confirm separation of product inquiries and general messages, statuses, internal notes, appointment behavior, and any conflicts with accepted requirements.

- [ ] **Step 6: Trace content, contact details, publishing, revisions, and rollback**

For each workflow, locate:

- controlled editable fields;
- draft state;
- review warnings;
- preview isolation;
- explicit publish action;
- transaction boundary;
- revision creation;
- rollback-as-new-revision;
- public invalidation;
- failed publish preserving old public state.

Missing steps prevent G6 from being accepted.

- [ ] **Step 7: Complete security observations**

Section 9 must separately assess:

- authentication versus owner authorization;
- middleware/proxy coverage;
- server enforcement versus UI hiding;
- mutation authorization;
- cookie/session and CSRF assumptions visible in code;
- rate limiting and abuse controls;
- upload and remote-fetch risk;
- secret/environment handling;
- unavailable runtime proof.

Do not label a concern a vulnerability unless the code path supports it.

- [ ] **Step 8: Commit admin and security findings**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit Rosa admin and authorization journeys"
```

---

### Task 6: Reconcile contracts, schemas, Arabic readiness, and duplicate paths

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: `packages/contracts/openapi/rosa-medical.v1.yaml`
- Read: generated schema, fixtures, active handlers/actions/adapters, migrations, policies, and seeds

**Interfaces:**
- Consumes: journey findings and shared contract source
- Produces: contract mismatch table, schema/policy assessment, Arabic/RTL assessment, duplicate/obsolete path register

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

Use:

```markdown
| Operation/capability | OpenAPI source | Generated type use | Active handler/action | Active payload/response | Mismatch | Shared change required |
```

Name direct Supabase or Next handlers missing from OpenAPI. Do not assume they are contract-compliant.

- [ ] **Step 3: Map migrations, policies, constraints, storage, and seeds**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  'create table|alter table|create policy|row level security|unique|foreign key|storage|bucket|seed' \
  supabase services apps packages . \
  > /tmp/rosa-schema-policy-hits.txt || true
cat /tmp/rosa-schema-policy-hits.txt
```

Expected: exact schema/policy evidence or explicit absence. Assess inquiry snapshots, revisions, publishing state, owner authorization, and paired EN/AR fields.

- [ ] **Step 4: Assess Arabic and RTL readiness**

Trace paired EN/AR fields, locale routing, RTL direction handling, Arabic typography, mixed-direction values, admin completeness indicators, and Arabic-specific tests. Assign one primary status to Section 6.10. Paired fields alone do not prove an RTL experience.

- [ ] **Step 5: Record duplicate and obsolete paths**

Compare fixtures, mocks, direct Supabase calls, API routes, server actions, old static components, and historical routes. Use:

```markdown
| Path or paths | Why duplicate or obsolete | Current consumer | Risk | Keep, adapt, or remove recommendation | Dependency |
```

- [ ] **Step 6: Verify the contract source and generated schema remain unchanged**

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

### Task 7: Build the test truth table and recompute F0–F9 and G0–G7

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`
- Read: package manifests, test configuration, test files, and prior verification records

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

- [ ] **Step 2: Map every material test to its direct claim**

Use:

```markdown
| Test file or command | Directly proves | Does not prove | Evidence result |
```

Explicitly prevent these overclaims:

- route smoke does not prove persistence;
- static admin rendering does not prove owner authorization;
- typecheck does not prove database constraints;
- public Playwright does not prove protected admin behavior;
- mocked success does not prove email or storage delivery.

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

Expected: Node major 24, pnpm 11.4.0, frozen install success, no generated drift, and passing lint/typecheck/tests/build. Record the exact error and command when the environment blocks execution; do not replace fresh failure evidence with an old success claim.

- [ ] **Step 4: Run credential-free public browser evidence only when supported**

Use the repository’s existing public Playwright command and configuration. Record project names, pass/fail/skip counts, and whether the data source is fixture, mock, or live. Do not bypass protected admin authentication.

- [ ] **Step 5: Assess F0–F9**

Use:

```markdown
| Layer | Intended result | Evidence | Primary assessment | Blocking gaps |
```

Every layer from F0 through F9 receives exactly one primary assessment from the seven-status model.

- [ ] **Step 6: Assess G0–G7**

Use:

```markdown
| Gate | Frontend evidence | Backend evidence | Contract or test evidence | Code-only conclusion | Runtime proof still required |
```

No gate requiring live Supabase, auth, storage, email, or deployment is fully accepted.

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

- [ ] **Step 8: Commit test and gate conclusions**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish Rosa test truth and gate status"
```

---

### Task 8: Rank findings and select one next implementation batch

**Files:**
- Modify: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: all findings, severities, dependencies, product conflicts, and gate conclusions
- Produces: ordered roadmap, exact next batch, final executive summary

- [ ] **Step 1: Normalize all material findings**

Use:

```markdown
| Finding ID | Severity | Journey or gate | Finding | Exact paths | Smallest safe correction | Dependencies | Verification |
```

Finding IDs remain stable and sequential by severity.

- [ ] **Step 2: Order findings by dependency**

Use this order:

1. product/security blockers;
2. shared contract/data blockers;
3. core public quotation blockers;
4. owner publishing blockers;
5. remaining public/admin systems;
6. Arabic/RTL;
7. hardening and cleanup.

Do not group unrelated refactors into one batch.

- [ ] **Step 3: Select exactly one next batch**

Section 14 must include all of these named fields with actual findings and paths from the report:

```markdown
- Batch name
- User-visible outcome
- Included finding IDs
- Exact implementation boundaries
- Shared contract or schema decisions required
- Explicit exclusions
- Verification gate
- Reason this batch precedes the following work
```

The public procurement vertical slice remains a hypothesis. Select a narrower P0 correction first when product or owner-authorization conflicts block safe implementation.

- [ ] **Step 4: Write the executive summary from completed evidence**

Include overall state, highest-severity findings, strongest completed areas, major runtime-unverified areas, recomputed gates, and exact next batch. Every statement must be supported later in the report.

- [ ] **Step 5: Run report consistency checks**

```bash
if rg -n 'TBD|TODO|implement later|fill in details|<[^>]+>' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md; then
  exit 1
fi
rg -n 'Verified implemented|Implemented, runtime-unverified|Partially implemented|Static or placeholder only|Missing|Product-rule conflict|Obsolete or duplicate path' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
rg -n 'AUD-P[0-4]-[0-9]{2}' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
```

Expected: no placeholders; classifications and finding IDs are present.

- [ ] **Step 6: Commit the roadmap**

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
- Produces: stale-base check, append-only coordination entry, documentation-only branch, reviewable PR

- [ ] **Step 1: Re-fetch and compare main**

```bash
git fetch origin --prune
ORIGINAL_AUDITED_BASE="$(cat /tmp/rosa-audited-main-sha)"
LATEST_MAIN="$(git rev-parse origin/main)"
printf 'audited=%s\nlatest=%s\n' "$ORIGINAL_AUDITED_BASE" "$LATEST_MAIN"
```

Expected: either identical SHAs or a detected change.

- [ ] **Step 2: Reconcile changed main before finalization**

When the SHAs differ:

```bash
git diff --name-status "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
git log --oneline "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
```

Reinspect every changed path intersecting the audit and update affected findings. Restart the audit from the new baseline when changes invalidate broad conclusions.

- [ ] **Step 3: Complete Section 15 and Section 16**

Section 15 records both SHAs, changed paths, and the reinspection result. Section 16 contains checked acceptance items for:

- every approved journey has one primary status;
- F0–F9 complete;
- G0–G7 complete;
- product conflicts cite exact paths and smallest corrections;
- runtime claims marked unverified;
- tests cited only for direct behavior;
- duplicate paths identified without deletion;
- no application or shared-interface change;
- exactly one next batch selected;
- latest main rechecked.

- [ ] **Step 4: Append one README coordination entry**

Update only the top coordination timestamp and append a dated entry under **Messages between AIs** containing actual values already finalized in the report:

- branch `audit/implementation-gap-2026-08-03`;
- exact audited application SHA;
- code-only limitation;
- actual P0/P1 finding IDs and one-line descriptions;
- concise G0–G7 conclusions;
- exact recommended batch name;
- actual shared decisions or partner response required, or `None`.

Do not rewrite historical entries or decision records.

- [ ] **Step 5: Verify the final diff is documentation-only**

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

- [ ] **Step 6: Check for placeholders and accidental application changes**

```bash
if rg -n 'TBD|TODO|implement later|fill in details|<[^>]+>' \
  README.md \
  docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md \
  docs/superpowers/plans/2026-08-03-implementation-gap-audit.md \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md; then
  exit 1
fi
git diff --check origin/main..HEAD
```

Expected: no placeholders and no whitespace errors.

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

The PR body must state the exact audited application SHA, code-only limitations, actual top findings, recomputed gate conclusions, exact next batch, and confirmation that no application behavior changed.
