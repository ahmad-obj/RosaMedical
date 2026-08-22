# Client Products + Shared Public Shell Redesign — Verification Record

Date: 2026-08-22

Branch: `transfer/rose-medical-final-main-ready-2026-08-17`

Immutable pre-redesign checkpoint: `checkpoint/pre-client-products-redesign-2026-08-22`

Checkpoint SHA: `917cd445843bb2e90bea3a54e344cd6a35c5b69a`

## Implemented scope

The transfer branch now contains the approved client redesign architecture:

- shared four-slide `PublicHeroCarousel` on Home, About Us, Products, Inquiry and Contact Us;
- previous local hero roles removed from the five main page render paths;
- primary navigation remains Home, About Us, Products, Inquiry, Contact Us;
- one shell-level red `PublicContactStrip` followed by one black global footer;
- Products now uses `getPublicCatalogueProducts()` rather than the featured-only projection;
- Products search indexes real product name, primary code, family, all sizes, variants, directions and catalogue-code/code-size records;
- functional family filter, Recommended/Name A–Z sort, grid/list views and responsive compact filters;
- dense product cards link to canonical Product Detail and display `Price on request` instead of fabricated numeric pricing;
- Products direct WhatsApp/email contact band;
- five Products catalogue cards use the authoritative catalogue-document model, open the real PDF and expose a separate download action;
- Product Detail keeps one canonical quantity/note/Add to Inquiry control;
- mobile Product Detail sticky action targets the canonical controls instead of maintaining a second add state;
- existing inquiry localStorage/store remains authoritative and now carries optional display-only product media metadata backward-compatibly;
- Inquiry renders product media with primary → fallback → neutral-placeholder behavior and remains quotation-only;
- browser and static regression contracts were added for the shared shell, Products discovery, catalogue access and quotation cart.

## Deployment-preservation evidence

GitHub comparison:

- base: `checkpoint/pre-client-products-redesign-2026-08-22`
- head: `transfer/rose-medical-final-main-ready-2026-08-17`
- status: ahead
- ahead by: 51 commits at the comparison gate
- behind by: 0

The comparison contains public UI/source/test files only for this redesign. It does **not** contain changes to:

- `.github/workflows/deploy.yml`
- `apps/web/open-next.config.ts`
- `apps/web/wrangler.jsonc`
- package-manager/lockfile deployment contract

The existing deployment workflow is still:

```text
push to main
→ pnpm install --frozen-lockfile
→ apps/web: npx opennextjs-cloudflare build
→ apps/web: npx wrangler deploy
```

with the existing Supabase/Resend/Cloudflare secrets supplied by GitHub Actions.

## Tests/contracts added

Focused static/unit contracts:

- `apps/web/src/test/public-hero-shared-shell.test.tsx`
- `apps/web/src/test/products-client-redesign.test.tsx`
- `apps/web/src/test/client-inquiry-cart-redesign.test.tsx`
- `apps/web/src/test/products-catalogue-access.test.tsx`
- `apps/web/src/test/client-public-redesign-integration.test.tsx`

Browser contracts:

- `apps/web/tests/e2e/products-client-redesign.spec.ts`
- `apps/web/tests/e2e/client-inquiry-cart-redesign.spec.ts`
- `apps/web/tests/e2e/products-catalogue-access.spec.ts`
- `apps/web/tests/e2e/client-public-redesign-integration.spec.ts`

The integration browser matrix covers 390, 768, 1024, 1366, 1920 and 2560 widths across the five main public routes, plus focused RTL and reduced-motion cases.

## Runtime verification blocker

A fresh local Git connectivity check was attempted at the verification gate:

```bash
git ls-remote https://github.com/manbtd0-cloud/RosaMedical.git HEAD
```

Observed result:

```text
fatal: unable to access 'https://github.com/manbtd0-cloud/RosaMedical.git/': Could not resolve host: github.com
```

Therefore this runtime cannot create a runnable checkout and the following commands have **not** been executed successfully in this environment. No pass claim is made for them.

Required final commands in a network-capable checkout:

```bash
pnpm install --frozen-lockfile

pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/products-client-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/client-inquiry-cart-redesign.test.tsx
pnpm --filter @rosa/web test -- src/test/products-catalogue-access.test.tsx
pnpm --filter @rosa/web test -- src/test/client-public-redesign-integration.test.tsx

pnpm --filter @rosa/web test:e2e -- tests/e2e/products-client-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-inquiry-cart-redesign.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/products-catalogue-access.spec.ts
pnpm --filter @rosa/web test:e2e -- tests/e2e/client-public-redesign-integration.spec.ts

pnpm --filter @rosa/web lint
pnpm --filter @rosa/web typecheck
pnpm --filter @rosa/web test
pnpm --filter @rosa/web build

cd apps/web
npx opennextjs-cloudflare build
```

## Transfer gate

Do not represent the branch as runtime-verified until the commands above pass in a runnable checkout.

After those gates pass, transfer the prepared branch state into `Ahmad-Ali-Shah/roseMedicalFinal/main` using the existing backup + `--force-with-lease` procedure. The destination `main` push will trigger the existing Cloudflare deployment workflow; production should only be declared healthy after that workflow succeeds.
