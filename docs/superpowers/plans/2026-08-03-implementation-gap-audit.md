# Rosa Medical Implementation-Gap Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a repository-wide, code-only evidence audit that classifies every approved Rosa Medical journey, frontend layer, integration gate, product-rule conflict, and runtime-verification limitation, then recommends one exact next implementation batch.

**Architecture:** Documentation-only audit. Trace approved journeys through public UI, admin UI, Next.js handlers/actions, Supabase boundaries, OpenAPI contracts, migrations, tests, and deployment configuration. Record findings in one audit report and summarize them in the coordination README without changing application behavior.

**Tech Stack:** Git; Node.js 24; pnpm 11.4.0; Next.js App Router; React; strict TypeScript; Supabase; OpenAPI 3.1; Vitest; React Testing Library; Playwright; Markdown.

## Global Constraints

- Start from the latest `main` and record the exact application SHA.
- Latest `main` remains authoritative for backend, security, Supabase, environment, middleware, API routes, persistence, packages, and deployment mechanics.
- Latest owner decisions and accepted product rules outrank conflicting implementation.
- No credentials, live Supabase, fake owner session, real email/storage, DNS, or deployment verification.
- Runtime-dependent capabilities are **implemented, runtime-unverified** unless static evidence supports a weaker status.
- Do not modify application code, contracts, schemas, migrations, security, environment, deployment, or product behavior.
- Cite exact paths and exact tests for every material conclusion.
- Keep product inquiries and general contact messages separate.
- Enforce quotation-led behavior: no public prices, payments, checkout, inventory, shipping, discounts, ratings, or orders.
- Preserve one protected owner and Draft → Review → Public Preview → Explicit Publish.
- Re-fetch and compare latest `main` before finalizing.

---

## Files

**Create**
- `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Modify**
- `README.md`

**Read only**
- `README.md`
- `docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md`
- `docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md`
- completion records under `docs/superpowers/completions/`
- `packages/contracts/openapi/rosa-medical.v1.yaml`
- `packages/contracts/src/generated/schema.ts`
- `packages/contracts/src/fixtures/**`
- `apps/web/**`
- `services/api/**`
- all tracked migration, policy, seed, middleware/proxy, environment, Cloudflare, OpenNext, and deployment files

---

### Task 1: Freeze the audited baseline

**Interfaces:**
- Consumes: `origin/main`, approved spec, this plan
- Produces: exact audited SHA and branch `audit/implementation-gap-2026-08-03`

- [ ] **Fetch and verify clean state**

```bash
git fetch origin --prune
git status --short
```

Expected: no output.

- [ ] **Record latest main**

```bash
AUDITED_APPLICATION_BASE="$(git rev-parse origin/main)"
printf '%s\n' "$AUDITED_APPLICATION_BASE"
git show -s --format='%H%n%ci%n%s' "$AUDITED_APPLICATION_BASE"
printf '%s\n' "$AUDITED_APPLICATION_BASE" > /tmp/rosa-audited-main-sha
```

Known checkpoint while planning: `8ad8098e9999fbdd2ee65edeaa8410928922b8e8`. Execution uses the freshly fetched SHA.

- [ ] **Ensure the documentation branch contains current main history**

```bash
git switch docs/implementation-gap-audit-spec
git pull --ff-only origin docs/implementation-gap-audit-spec
git merge-base --is-ancestor "$AUDITED_APPLICATION_BASE" HEAD
```

Expected: exit code `0`. Rebase documentation only if needed.

- [ ] **Create isolated execution branch/worktree**

```bash
git branch audit/implementation-gap-2026-08-03 HEAD
git worktree add ../RosaMedical-audit audit/implementation-gap-2026-08-03
cd ../RosaMedical-audit
git status --short
```

Expected: clean status.

---

### Task 2: Create the report skeleton and source register

**Files:**
- Create: `docs/superpowers/audits/2026-08-03-implementation-gap-audit.md`

**Interfaces:**
- Consumes: audited SHA, source hierarchy, status/severity models
- Produces: complete report structure

- [ ] **Read all governing sources**

```bash
cat README.md
cat docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md
cat docs/superpowers/plans/2026-07-31-rosa-medical-master-implementation.md
cat docs/superpowers/completions/2026-08-02-main-frontend-f3ed-sync.md
cat docs/superpowers/completions/2026-08-02-rosa-medical-consolidated-frontend-verification.md
cat docs/superpowers/completions/2026-08-02-frontend-backend-selective-integration.md
cat packages/contracts/openapi/rosa-medical.v1.yaml
```

Record missing historical files as absent; do not substitute silently.

- [ ] **Generate tracked-file inventory**

```bash
git ls-files > /tmp/rosa-all-files.txt
grep -E '^(apps/web|packages/contracts|services/api|supabase|migrations|\.github|docs/runbooks|wrangler|open-next|next\.config)' \
  /tmp/rosa-all-files.txt > /tmp/rosa-audit-surface.txt || true
cat /tmp/rosa-audit-surface.txt
```

- [ ] **Create report with actual baseline**

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

- [ ] **Verify headings and commit**

```bash
for heading in \
  'Executive summary' 'Audited baseline and limitations' 'Governing-source register' \
  'Current architecture map' 'Product-rule conflict register' 'Business-journey evidence matrix' \
  'F0–F9 frontend-layer assessment' 'G0–G7 integration-gate assessment' \
  'Security and authorization observations' 'Contract and data-flow mismatches' \
  'Test-evidence truth table' 'Obsolete or duplicate paths' 'Prioritized corrective roadmap' \
  'Recommended next implementation batch' 'Recheck against latest main' 'Acceptance checklist'; do
  grep -F "$heading" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish implementation gap audit baseline"
```

---

### Task 3: Map architecture, persistence, authorization, and product conflicts

**Files:**
- Modify: audit report
- Read: application, contract, service, migration, policy, seed, middleware/proxy, environment, deployment paths

**Interfaces:**
- Consumes: inventory and governing rules
- Produces: architecture map and conflict register

- [ ] **Map implementation boundaries**

```bash
git ls-files apps/web/src/app | sort > /tmp/rosa-app-routes.txt
git ls-files apps/web/src/lib | sort > /tmp/rosa-lib-files.txt
git ls-files packages/contracts | sort > /tmp/rosa-contract-files.txt
git ls-files services/api | sort > /tmp/rosa-service-files.txt
cat /tmp/rosa-app-routes.txt /tmp/rosa-lib-files.txt /tmp/rosa-contract-files.txt /tmp/rosa-service-files.txt
```

- [ ] **Locate persistence/auth boundaries**

```bash
rg -n --hidden --glob '!node_modules/**' \
  -e 'createClient\(' -e 'supabase\.' -e 'auth\.' -e 'requireAdmin' \
  -e 'middleware' -e 'proxy' -e 'cookies\(' -e '\.from\(' \
  apps/web packages/contracts services/api . \
  > /tmp/rosa-persistence-auth-hits.txt || true
cat /tmp/rosa-persistence-auth-hits.txt
```

- [ ] **Locate active product-conflict vocabulary**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  '\b(checkout|cart|order|orders|payment|payments|price|prices|inventory|stock|shipping|discount|rating|ratings|customer login|sign up|register)\b' \
  apps/web packages/contracts services/api README.md docs \
  > /tmp/rosa-product-conflict-hits.txt || true
cat /tmp/rosa-product-conflict-hits.txt
```

- [ ] **Document architecture and conflicts**

Architecture must cite exact paths for routes, server actions/handlers, Supabase clients, session refresh, owner guard, contract source/generated types, migrations/policies/seeds, storage/email, deployment, and absent planned boundaries.

Conflict table:

```markdown
| Finding ID | Severity | Accepted rule | Active paths | Current behavior | Useful behavior to preserve | Smallest safe correction | Verification required |
```

Use stable IDs such as `AUD-P0-01`, `AUD-P1-01`.

- [ ] **Verify docs-only and commit**

```bash
git status --short
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: map Rosa architecture and product conflicts"
```

---

### Task 4: Audit all public journeys

**Files:**
- Modify: audit report
- Read: public routes, features, components, handlers, contracts, tests

**Interfaces:**
- Produces: statuses for discovery/products, quotation, contact, search, public content

- [ ] **Build public file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'products|families|catalogues|inquiry|quotation|checkout|contact|search|procurement|privacy|terms' \
  apps/web/src/app apps/web/src/features apps/web/src/components apps/web/src/lib packages/contracts apps/web/tests \
  | sort -u > /tmp/rosa-public-journey-files.txt
cat /tmp/rosa-public-journey-files.txt
```

- [ ] **Trace product browsing**

Trace homepage → products → family → product detail. Record navigation, data source, published filtering, catalogue/specification rendering, loading/empty/not-found/error states, responsive action differences, and exact tests. Assign one status to Section 6.1.

- [ ] **Trace quotation/inquiry**

Trace product action → selection → form → validation → handler/action → persistence → result → owner-visible record. Answer anonymous support, immutable snapshots, idempotency, terminology, and admin visibility. Assign one status to Section 6.2.

- [ ] **Trace contact and search separately**

Contact: form → validation → spam behavior → persistence → result → admin message view. Search: query parsing → data/indexed fields → no-result/error → links. Assign statuses to Sections 6.3 and 6.9.

- [ ] **Use common evidence table and commit**

```markdown
| Capability | Primary status | Direct code evidence | Contract evidence | Test evidence | Runtime proof unavailable | Product conflict | Smallest correction | Priority |
```

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit public Rosa business journeys"
```

---

### Task 5: Audit authentication and admin journeys

**Files:**
- Modify: audit report
- Read: admin routes/features, guards, actions, handlers, Supabase queries, tests

**Interfaces:**
- Produces: statuses for auth, CRUD, catalogues/media, inquiries/messages, content/contact, publishing/revisions/rollback, security

- [ ] **Build admin file set**

```bash
rg -l -i --hidden --glob '!node_modules/**' \
  'admin|login|logout|recovery|session|product|family|catalogue|media|inquir|message|content|contact|publish|revision|rollback|preview' \
  apps/web/src/app/admin apps/web/src/features apps/web/src/lib apps/web/src/test apps/web/tests \
  | sort -u > /tmp/rosa-admin-journey-files.txt
cat /tmp/rosa-admin-journey-files.txt
```

- [ ] **Trace authentication/authorization**

Document unauthenticated redirect, single-owner proof versus any authenticated user, refresh/expiry/logout/recovery, server-side mutation enforcement, and runtime-unverified claims. Mark P0 only when code supports owner-boundary failure.

- [ ] **Trace admin systems**

Trace products/families; catalogues/media; inquiries/messages; content/contact details; publishing/revisions/rollback. For publishing, locate drafts, review, isolated preview, explicit publish, transactions, revision creation, rollback-as-new-revision, invalidation, and failed-publish preservation.

- [ ] **Complete security observations**

Assess auth versus authorization, middleware/proxy, server enforcement versus UI hiding, cookie/session and CSRF assumptions, rate limiting, abuse controls, uploads/remote fetch, secrets/environment, and unavailable runtime proof.

- [ ] **Commit**

```bash
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: audit Rosa admin and authorization journeys"
```

---

### Task 6: Reconcile contracts, schemas, Arabic readiness, duplicates

**Files:**
- Modify: audit report
- Read: OpenAPI, generated schema, fixtures, handlers/actions/adapters, migrations/policies/seeds

**Interfaces:**
- Produces: contract mismatch table, schema/policy findings, Arabic/RTL status, duplicate/obsolete register

- [ ] **Enumerate contract operations and implementation entry points**

```bash
rg -n '^\s{2,}(get|post|put|patch|delete):|operationId:' \
  packages/contracts/openapi/rosa-medical.v1.yaml > /tmp/rosa-openapi-ops.txt
rg -n 'export async function (GET|POST|PUT|PATCH|DELETE)|"use server"|createClient\(' \
  apps/web/src services/api > /tmp/rosa-handler-action-map.txt || true
cat /tmp/rosa-openapi-ops.txt /tmp/rosa-handler-action-map.txt
```

- [ ] **Compare contract and active shapes**

```markdown
| Operation or capability | OpenAPI source | Generated type use | Active handler/action | Active payload/response | Mismatch | Shared change required |
```

- [ ] **Map schema/policy evidence**

```bash
rg -n -i --hidden --glob '!node_modules/**' \
  'create table|alter table|create policy|row level security|unique|foreign key|storage|bucket|seed' \
  supabase services apps packages . \
  > /tmp/rosa-schema-policy-hits.txt || true
cat /tmp/rosa-schema-policy-hits.txt
```

Assess inquiry snapshots, revisions, publishing state, owner authorization, and EN/AR fields.

- [ ] **Assess Arabic/RTL and duplicates**

Trace paired fields, locale routing, RTL handling, typography, mixed-direction values, completeness indicators, Arabic tests. Record duplicate/obsolete paths using:

```markdown
| Path or paths | Why duplicate/obsolete | Current consumer | Risk | Keep/adapt/remove recommendation | Dependency |
```

- [ ] **Verify contracts unchanged and commit**

```bash
git diff -- packages/contracts/openapi/rosa-medical.v1.yaml packages/contracts/src/generated/schema.ts
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: reconcile Rosa contracts data and duplicate paths"
```

Expected: no contract diff.

---

### Task 7: Build test truth and recompute F0–F9/G0–G7

**Files:**
- Modify: audit report
- Read: manifests, test config/files, verification records

**Interfaces:**
- Produces: test truth table, F0–F9 matrix, G0–G7 matrix, fresh verification record

- [ ] **Inventory tests and scripts**

```bash
cat package.json
cat apps/web/package.json
cat packages/contracts/package.json
git ls-files | grep -E '(^|/)(test|tests|__tests__)/|\.(test|spec)\.' | sort > /tmp/rosa-test-files.txt
cat /tmp/rosa-test-files.txt
```

- [ ] **Build test truth table**

```markdown
| Test file or command | Directly proves | Does not prove | Evidence result |
```

Explicitly prevent overclaims: route smoke ≠ persistence; static admin ≠ owner authorization; typecheck ≠ DB constraints; public Playwright ≠ protected admin; mocked success ≠ email/storage.

- [ ] **Run frozen code-only gate**

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

Expected: Node 24, pnpm 11.4.0, no drift, passing gates. Record exact blockers when execution is unavailable.

- [ ] **Run existing credential-free public browser matrix when supported**

Read the exact command from `apps/web/package.json` and prior F3A–F3D completion record. Run only public desktop/tablet/mobile tests; record command, projects, counts, and fixture/mock/live mode. Do not bypass admin auth.

- [ ] **Complete F0–F9 and G0–G7 tables**

```markdown
| Layer | Intended result | Evidence | Primary assessment | Blocking gaps |
```

```markdown
| Gate | Frontend evidence | Backend evidence | Contract/test evidence | Code-only conclusion | Runtime proof still required |
```

Every F0–F9 and G0–G7 entry receives one conclusion. No live-dependent gate is fully accepted.

- [ ] **Verify completeness and commit**

```bash
for layer in F0 F1 F2 F3 F4 F5 F6 F7 F8 F9; do
  grep -E "\|[[:space:]]*$layer([[:space:]]|—|-)" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
for gate in G0 G1 G2 G3 G4 G5 G6 G7; do
  grep -E "\|[[:space:]]*$gate([[:space:]]|—|-)" docs/superpowers/audits/2026-08-03-implementation-gap-audit.md >/dev/null || exit 1
done
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: establish Rosa test truth and gate status"
```

---

### Task 8: Rank findings and select the next batch

**Files:**
- Modify: audit report

**Interfaces:**
- Produces: ordered roadmap, one exact next batch, executive summary

- [ ] **Normalize findings**

```markdown
| Finding ID | Severity | Journey/gate | Finding | Exact paths | Smallest safe correction | Dependencies | Verification |
```

- [ ] **Order by dependency**

1. product/security blockers;
2. shared contract/data blockers;
3. core quotation blockers;
4. owner publishing blockers;
5. remaining systems;
6. Arabic/RTL;
7. hardening/cleanup.

- [ ] **Select exactly one next batch**

Section 14 states actual batch name, user-visible outcome, included IDs, exact boundaries, shared decisions, exclusions, verification gate, and why it comes first. The public procurement slice remains a hypothesis; a narrower P0 correction wins if required.

- [ ] **Write executive summary and check completeness**

```bash
if rg -n 'TBD|TODO|implement later|fill in details|AUDITED_APPLICATION_BASE_GOES_HERE' \
  docs/superpowers/audits/2026-08-03-implementation-gap-audit.md; then
  exit 1
fi
rg -n 'AUD-P[0-4]-[0-9]{2}' docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git add docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: prioritize Rosa corrective implementation roadmap"
```

---

### Task 9: Recheck main, coordinate, and finalize

**Files:**
- Modify: `README.md`
- Modify: audit report

**Interfaces:**
- Produces: stale-base check, README entry, documentation-only branch, PR

- [ ] **Re-fetch and compare main**

```bash
git fetch origin --prune
ORIGINAL_AUDITED_BASE="$(cat /tmp/rosa-audited-main-sha)"
LATEST_MAIN="$(git rev-parse origin/main)"
printf 'audited=%s\nlatest=%s\n' "$ORIGINAL_AUDITED_BASE" "$LATEST_MAIN"
```

When different:

```bash
git diff --name-status "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
git log --oneline "$ORIGINAL_AUDITED_BASE".."$LATEST_MAIN"
```

Reinspect intersecting paths; restart on the new baseline if changes invalidate broad conclusions.

- [ ] **Complete recheck and acceptance sections**

Section 15 records both SHAs, changed paths, and reinspection. Section 16 confirms every journey, F0–F9, G0–G7, exact conflict paths/corrections, runtime limits, test truth, duplicates, docs-only scope, one next batch, and latest-main recheck.

- [ ] **Append README coordination entry**

Update only the top timestamp and append one dated message containing actual audited SHA, code-only limitation, actual P0/P1 IDs, concise G0–G7 conclusions, exact next batch, and actual shared decisions/partner response required or `None`.

- [ ] **Verify documentation-only diff**

```bash
git status --short
git diff --name-only "$(git merge-base HEAD origin/main)"..HEAD
git diff --check origin/main..HEAD
```

Expected changed paths only:

```text
README.md
docs/superpowers/specs/2026-08-03-implementation-gap-audit-design.md
docs/superpowers/plans/2026-08-03-implementation-gap-audit.md
docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
```

- [ ] **Run final report/README unfinished-marker check**

```bash
if rg -n 'TBD|TODO|implement later|fill in details|AUDITED_APPLICATION_BASE_GOES_HERE' \
  README.md docs/superpowers/audits/2026-08-03-implementation-gap-audit.md; then
  exit 1
fi
```

- [ ] **Commit, review, push**

```bash
git add README.md docs/superpowers/audits/2026-08-03-implementation-gap-audit.md
git commit -m "docs: finalize Rosa implementation gap audit"
git log --oneline --decorate origin/main..HEAD
git diff --stat origin/main..HEAD
git diff --check origin/main..HEAD
git push -u origin audit/implementation-gap-2026-08-03
```

PR title: `Audit integrated Rosa implementation gaps`

PR body states the exact audited SHA, code-only limitations, actual top findings, recomputed gate conclusions, exact next batch, and confirmation that no application behavior changed.
