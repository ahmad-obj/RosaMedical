# Shared Public Shell + Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Home, About Us, Products, Inquiry, and Contact Us share one four-slide banner implementation, one five-link header, one red contact/social strip, and one black footer.

**Architecture:** Extract the existing `HomeHeroCarousel` behavior into `@/features/public-hero` without changing its proven autoplay/swipe/keyboard/reduced-motion logic. Keep the current four media assets as the shared slide media source, but supply page-specific localized copy through a `PublicHeroPageKey` profile. Keep the global header/contact strip/footer in `PublicShell`; page components render only their middle content plus the reusable banner.

**Tech Stack:** React 19, Next.js 16, TypeScript, Motion, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Main links: Home, About Us, Products, Inquiry, Contact Us.
- Four existing hero media assets remain authoritative.
- No hero CTA buttons.
- Header and footer are shell-level, never page-local duplicates.
- Red `PublicContactStrip` and black footer render exactly once after `<main>`.
- Arabic/RTL and reduced motion remain supported.
- No new dependency.

---

### Task 1: Define reusable public hero contracts and copy profiles

**Files:**
- Create: `apps/web/src/features/public-hero/public-hero.types.ts`
- Create: `apps/web/src/features/public-hero/public-hero.data.ts`
- Create: `apps/web/src/features/public-hero/index.ts`
- Test: `apps/web/src/test/public-hero-shared-shell.test.tsx`

**Interfaces:**
- Produces:
  - `type PublicHeroPageKey = "home" | "about" | "products" | "inquiry" | "contact"`
  - `interface PublicHeroSlide`
  - `interface LocalizedPublicHeroSlide`
  - `getLocalizedPublicHeroSlides(page: PublicHeroPageKey, locale: PublicLocale): readonly LocalizedPublicHeroSlide[]`

- [ ] **Step 1: Write the failing contract test**

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("shared public hero", () => {
  it("defines five page profiles and keeps the four approved client-v5 media records", () => {
    const data = source("src/features/public-hero/public-hero.data.ts");
    expect(data).toContain('"home"');
    expect(data).toContain('"about"');
    expect(data).toContain('"products"');
    expect(data).toContain('"inquiry"');
    expect(data).toContain('"contact"');
    for (let index = 1; index <= 4; index += 1) {
      expect(data).toContain(`hero-0${index}-desktop.webp`);
      expect(data).toContain(`hero-0${index}-desktop.avif`);
      expect(data).toContain(`hero-0${index}-mobile.webp`);
    }
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
```

Expected: FAIL because `src/features/public-hero/public-hero.data.ts` does not exist.

- [ ] **Step 3: Add the exact hero types**

```ts
import type { PublicLocale } from "@/features/localization/locales";

export type PublicHeroPageKey = "home" | "about" | "products" | "inquiry" | "contact";
export type PublicHeroCopySide = "left" | "right";
export type PublicHeroTone = "dark" | "light";

export interface LocalizedHeroText {
  en: string;
  ar: string;
}

export interface PublicHeroMedia {
  desktopSrc: string;
  desktopAvifSrc: string;
  mobileSrc: string;
  alt: LocalizedHeroText;
  desktopFocalPoint: string;
  mobileFocalPoint: string;
}

export interface PublicHeroSlide {
  id: string;
  media: PublicHeroMedia;
  copySide: PublicHeroCopySide;
  tone: PublicHeroTone;
  eyebrow: LocalizedHeroText;
  title: LocalizedHeroText;
  copy: LocalizedHeroText;
}

export interface LocalizedPublicHeroSlide {
  id: string;
  media: Omit<PublicHeroMedia, "alt"> & { alt: string };
  copySide: PublicHeroCopySide;
  tone: PublicHeroTone;
  eyebrow: string;
  title: string;
  copy: string;
}

export type PublicHeroLocalizer = (
  page: PublicHeroPageKey,
  locale: PublicLocale
) => readonly LocalizedPublicHeroSlide[];
```

- [ ] **Step 4: Move the four media records and define page-specific copy**

Use the current `client-v5` paths verbatim. Store media once and combine it with five copy profiles. Home copy should preserve the current approved Home strings. Products copy should describe catalogue discovery and quotation preparation. About copy should describe Rosa identity/procurement support. Inquiry copy should describe reviewing selected instruments. Contact copy should describe direct procurement/contact support. Each profile must contain exactly four localized copy records so media and copy remain index-aligned.

- [ ] **Step 5: Export the public hero API**

```ts
export * from "./public-hero.types";
export * from "./public-hero.data";
export * from "./public-hero-carousel";
```

- [ ] **Step 6: Run the focused test**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
```

Expected: PASS for the data contract assertions added so far.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/public-hero apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "refactor(web): define shared public hero profiles"
```

### Task 2: Extract Home carousel behavior into `PublicHeroCarousel`

**Files:**
- Create: `apps/web/src/features/public-hero/public-hero-carousel.tsx`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`
- Reference: `apps/web/src/features/homepage/sections/home-hero-carousel.tsx`
- Reference: `apps/web/src/features/homepage/hero-carousel-state.ts`

**Interfaces:**
- Consumes: `getLocalizedPublicHeroSlides(page, locale)`
- Produces:

```ts
export function PublicHeroCarousel({
  page,
  locale = "en",
  headingId
}: {
  page: PublicHeroPageKey;
  locale?: PublicLocale;
  headingId: string;
}): ReactElement
```

- [ ] **Step 1: Extend the test to require a reusable page prop and no CTA rendering**

```ts
it("uses one reusable carousel with page-specific copy and no hero CTA actions", () => {
  const carousel = source("src/features/public-hero/public-hero-carousel.tsx");
  expect(carousel).toContain("page: PublicHeroPageKey");
  expect(carousel).toContain("getLocalizedPublicHeroSlides(page, locale)");
  expect(carousel).not.toContain("slide.ctas");
  expect(carousel).not.toContain("home-hero__actions");
});
```

- [ ] **Step 2: Run RED**

Expected: FAIL because the new carousel file does not exist.

- [ ] **Step 3: Copy the proven carousel mechanics, changing only data/source naming**

Preserve:

- `DRAG_THRESHOLD_PX = 48`;
- visibility pause;
- focus pause;
- pointer swipe direction logic;
- `HERO_AUTOPLAY_MS` and state helpers;
- next-image preloading;
- dot roving tab index;
- reduced-motion behavior;
- responsive `<picture>` source order;
- Motion duration/easing values;
- desktop/mobile focal custom properties.

Rename Home-specific CSS/data hooks to shared hooks where necessary:

```tsx
<section
  className="public-hero public-hero-carousel"
  data-section={`${page}-hero`}
  data-public-hero-page={page}
  data-active-slide={slide.id}
  aria-roledescription="carousel"
  aria-labelledby={headingId}
>
```

Use `headingId` on the active slide `h1`.

- [ ] **Step 4: Run the focused unit test**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/public-hero/public-hero-carousel.tsx apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "refactor(web): extract shared public hero carousel"
```

### Task 3: Replace Home-only hero usage with the shared carousel

**Files:**
- Modify: `apps/web/src/features/homepage/homepage.tsx`
- Modify or delete after grep: `apps/web/src/features/homepage/sections/home-hero-carousel.tsx`
- Modify or delete after grep: `apps/web/src/features/homepage/home-hero-slides.ts`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`

- [ ] **Step 1: Add a test requiring Home to render the shared hero**

```ts
it("renders the shared public hero on Home", () => {
  const home = source("src/features/homepage/homepage.tsx");
  expect(home).toContain("PublicHeroCarousel");
  expect(home).toContain('page="home"');
});
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Replace the Home hero import/render**

```tsx
<PublicHeroCarousel page="home" locale={locale} headingId="home-title" />
```

Keep the rest of Home content unchanged.

- [ ] **Step 4: Grep before deleting old hero files**

```bash
git grep -n "HomeHeroCarousel\|HOME_HERO_SLIDES\|localizeHomeHeroSlide" -- apps/web/src
```

Delete old files only when the grep proves no remaining production/test dependency.

- [ ] **Step 5: Run focused test and existing Home hero tests**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/client-review-round-2026-08-22.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/homepage apps/web/src/features/public-hero apps/web/src/test
git commit -m "refactor(web): move Home onto shared public hero"
```

### Task 4: Add the shared banner to About, Products, Inquiry, and Contact

**Files:**
- Modify: `apps/web/src/features/about/about-page.tsx`
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/features/inquiry/inquiry-page.tsx`
- Modify: `apps/web/src/features/contact-preview/contact-page.tsx`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`

**Interfaces:**
- All pages consume `PublicHeroCarousel`.

- [ ] **Step 1: Add static page-composition assertions**

```ts
const pageCases = [
  ["src/features/about/about-page.tsx", 'page="about"'],
  ["src/features/products/products-overview.tsx", 'page="products"'],
  ["src/features/inquiry/inquiry-page.tsx", 'page="inquiry"'],
  ["src/features/contact-preview/contact-page.tsx", 'page="contact"']
] as const;

for (const [path, prop] of pageCases) {
  const page = source(path);
  expect(page).toContain("PublicHeroCarousel");
  expect(page).toContain(prop);
}
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Insert hero as the first page-level section**

Use stable heading IDs:

```tsx
<PublicHeroCarousel page="about" locale={locale} headingId="about-public-hero-title" />
<PublicHeroCarousel page="products" locale={locale} headingId="products-public-hero-title" />
<PublicHeroCarousel page="contact" locale={locale} headingId="contact-public-hero-title" />
```

For Inquiry, obtain locale from the existing pathname logic and pass it to the hero before populated/empty state content. Do not duplicate the shell or footer inside these pages.

- [ ] **Step 4: Run focused tests**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/about apps/web/src/features/products apps/web/src/features/inquiry apps/web/src/features/contact-preview apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "feat(web): apply shared banner to main public pages"
```

### Task 5: Move reusable hero styling out of Home CSS

**Files:**
- Create: `apps/web/src/styles/public-hero.css`
- Modify: `apps/web/src/styles/home-client-redesign.css`
- Modify: `apps/web/src/app/globals.css`
- Test: `apps/web/src/test/public-hero-shared-shell.test.tsx`

- [ ] **Step 1: Add a test asserting the new stylesheet is last enough to control the shared hero without Home-only body selectors**

```ts
it("loads a shared public hero stylesheet", () => {
  const globals = source("src/app/globals.css");
  expect(globals).toContain('@import "../styles/public-hero.css";');
});
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Move only carousel-generic selectors**

Move selectors such as media/picture/overlay/content/copy/dots/dot states and responsive focal handling into `public-hero.css`. Keep Home middle-section rules in `home-client-redesign.css`.

Shared CSS should continue to use transform/opacity for transitions and must include reduced-motion coverage.

- [ ] **Step 4: Run unit tests and inspect CSS grep**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
git grep -n "home-hero-carousel" -- apps/web/src/styles apps/web/src/features
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/styles apps/web/src/app/globals.css apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "refactor(web): share public hero styling"
```

### Task 6: Lock shell-level header/footer consistency

**Files:**
- Modify: `apps/web/src/components/layout/public-shell.tsx`
- Test: `apps/web/src/test/public-hero-shared-shell.test.tsx`
- E2E later: final integration plan

- [ ] **Step 1: Add shell assertions**

```ts
it("keeps the five-link header and one shell-level contact strip/footer", () => {
  const shell = source("src/components/layout/public-shell.tsx");
  for (const href of ["/", "/about", "/products", "/inquiry", "/contact"]) {
    expect(shell).toContain(`"${href}"`);
  }
  expect(shell.match(/<PublicContactStrip \/>/g)?.length).toBe(1);
  expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
  expect(shell.indexOf("<footer")).toBeGreaterThan(shell.indexOf("<PublicContactStrip />"));
});
```

- [ ] **Step 2: Run test**

If already green, preserve the implementation and add only the missing Inquiry count presentation if required by the spec.

- [ ] **Step 3: Add inquiry count without creating a second nav system**

Use the existing `InquiryCountLabel`/count infrastructure inside the Inquiry navigation label or a small client-safe wrapper. Desktop and mobile labels must derive from the same `primaryLinks` route list.

- [ ] **Step 4: Run focused unit tests**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/layout/public-shell.tsx apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "feat(web): lock shared public shell consistency"
```

## Subplan Exit Gate

Run:

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web typecheck
```

Then use Playwright in the final integration plan to verify all five routes render the same header, one four-slide banner, one red contact strip, and one black footer at desktop/mobile widths.
