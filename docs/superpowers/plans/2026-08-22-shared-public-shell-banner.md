# Shared Public Shell + Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Home, About Us, Products, Inquiry, and Contact Us share one four-slide banner implementation, one five-link header, one red contact/social strip, and one black footer.

**Architecture:** Extract the proven Home carousel mechanics into `@/features/public-hero`. Keep the four current `client-v5` media sets exactly once and pair them with five page-specific localized copy profiles. `PublicShell` remains the only owner of header, red contact/social strip, and black footer; main page components own only their reusable banner plus middle content.

**Tech Stack:** React 19.2, Next.js 16.2.11, TypeScript 5.9, Motion 12, Vitest 3.2, Playwright 1.57.

**Spec:** `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`

## Global Constraints

- Primary links remain exactly Home, About Us, Products, Inquiry, Contact Us.
- Four existing `client-v5` hero media sets remain authoritative.
- No hero CTA buttons.
- Header/footer/contact strip are shell-level; pages must not duplicate them.
- `PublicContactStrip` renders exactly once after `<main>` and before `.site-footer`.
- Existing autoplay, swipe, keyboard, focus-pause, visibility-pause, preload, responsive focal point, and reduced-motion behavior are preserved.
- No new dependency.
- Arabic/RTL remains supported.

---

## Exact shared media matrix

Store these four media records once in `public-hero.data.ts` and reuse them for all five page profiles.

```ts
const PUBLIC_HERO_MEDIA = [
  {
    id: "precision-instruments",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-01-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-01-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-01-mobile.webp",
    alt: {
      en: "Gloved hand selecting a surgical instrument from an arranged set",
      ar: "يد مرتدية قفازًا تختار أداة جراحية من مجموعة مرتبة"
    },
    desktopFocalPoint: "58% 50%",
    mobileFocalPoint: "50% 46%",
    copySide: "left",
    tone: "dark"
  },
  {
    id: "clinical-instrument-context",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-02-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-02-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-02-mobile.webp",
    alt: {
      en: "Gloved hand holding ring-handled surgical forceps beside other instruments",
      ar: "يد مرتدية قفازًا تمسك ملقطًا جراحيًا بحلقات بجوار أدوات أخرى"
    },
    desktopFocalPoint: "63% 49%",
    mobileFocalPoint: "50% 48%",
    copySide: "left",
    tone: "dark"
  },
  {
    id: "surgical-instrument-selection",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-03-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-03-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-03-mobile.webp",
    alt: {
      en: "Gloved hands examining a surgical scissors instrument",
      ar: "يدان مرتديتان قفازات تفحصان مقصًا جراحيًا"
    },
    desktopFocalPoint: "62% 50%",
    mobileFocalPoint: "54% 48%",
    copySide: "left",
    tone: "dark"
  },
  {
    id: "catalogue-to-quotation",
    desktopSrc: "/media/editorial/home-hero/client-v5/hero-04-desktop.webp",
    desktopAvifSrc: "/media/editorial/home-hero/client-v5/hero-04-desktop.avif",
    mobileSrc: "/media/editorial/home-hero/client-v5/hero-04-mobile.webp",
    alt: {
      en: "Dark surgical instruments arranged on a textured sterile surface",
      ar: "أدوات جراحية داكنة مرتبة على سطح طبي منسوج"
    },
    desktopFocalPoint: "46% 50%",
    mobileFocalPoint: "50% 48%",
    copySide: "right",
    tone: "dark"
  }
] as const;
```

## Exact copy matrix

Each profile has exactly four copy records, index-aligned with `PUBLIC_HERO_MEDIA`.

### Home

Preserve the current approved Home copy exactly:

```ts
home: [
  {
    eyebrow: { en: "Medical instruments supplier", ar: "مورّد أدوات طبية" },
    title: { en: "Precision instruments. Procurement made clear.", ar: "أدوات دقيقة. ومشتريات أكثر وضوحًا." },
    copy: {
      en: "A composed catalogue and quotation experience for hospitals, distributors and procurement teams.",
      ar: "تجربة منظمة لاستعراض الكتالوجات وطلب عروض الأسعار للمستشفيات والموزعين وفرق المشتريات."
    }
  },
  {
    eyebrow: { en: "Structured product discovery", ar: "استعراض منظم للمنتجات" },
    title: { en: "A clearer view of the instruments you need.", ar: "رؤية أوضح للأدوات التي تحتاجها." },
    copy: {
      en: "Browse focused instrument families, review product codes and variants, and carry the right details into your inquiry.",
      ar: "استعرض عائلات الأدوات المركزة، وراجع الرموز والخيارات، واحتفظ بالتفاصيل الصحيحة داخل استفسارك."
    }
  },
  {
    eyebrow: { en: "Instrument selection", ar: "اختيار الأدوات" },
    title: { en: "Clearer instrument selection, from the start.", ar: "اختيار أوضح للأدوات منذ البداية." },
    copy: {
      en: "Move from family browsing to product codes, configurations and quantities in one composed quotation path.",
      ar: "انتقل من استعراض العائلات إلى رموز المنتجات وخياراتها وكمياتها ضمن مسار واحد منظم لطلب عرض السعر."
    }
  },
  {
    eyebrow: { en: "Catalogue to quotation", ar: "من الكتالوج إلى عرض السعر" },
    title: { en: "From catalogue detail to one organised request.", ar: "حوّل تفاصيل الكتالوج إلى طلب واحد منظم." },
    copy: {
      en: "Identify the instrument family, review available configurations, and bring quantities together without losing product context.",
      ar: "حدد عائلة الأداة، وراجع الخيارات المتاحة، واجمع الكميات مع الحفاظ على سياق كل منتج."
    }
  }
]
```

### About Us

```ts
about: [
  {
    eyebrow: { en: "About Rosa", ar: "عن روزا" },
    title: { en: "Structured support for medical-instrument procurement.", ar: "دعم منظم لمشتريات الأدوات الطبية." },
    copy: {
      en: "Rosa connects organised product information, responsive follow-up and quotation support for professional buyers and trading partners.",
      ar: "تجمع روزا بين معلومات المنتجات المنظمة والمتابعة السريعة ودعم عروض الأسعار للمشترين المهنيين وشركاء التجارة."
    }
  },
  {
    eyebrow: { en: "How we work", ar: "كيف نعمل" },
    title: { en: "Clear information. Responsive follow-up.", ar: "معلومات واضحة. ومتابعة سريعة." },
    copy: {
      en: "Our workflow keeps product discovery, requirement details and quotation preparation connected from the first inquiry onward.",
      ar: "يربط أسلوب عملنا بين استعراض المنتجات وتفاصيل المتطلبات وإعداد عرض السعر منذ بداية الاستفسار."
    }
  },
  {
    eyebrow: { en: "Professional support", ar: "دعم مهني" },
    title: { en: "Built around buyers who need clarity and continuity.", ar: "مصمم للمشترين الذين يحتاجون إلى الوضوح والاستمرارية." },
    copy: {
      en: "A consistent catalogue and inquiry process helps professional buyers move through product information with less friction.",
      ar: "يساعد مسار الكتالوج والاستفسار المتسق المشترين المهنيين على مراجعة معلومات المنتجات بسهولة أكبر."
    }
  },
  {
    eyebrow: { en: "Catalogue to inquiry", ar: "من الكتالوج إلى الاستفسار" },
    title: { en: "Product context stays with the request.", ar: "تبقى تفاصيل المنتج مرتبطة بالطلب." },
    copy: {
      en: "Families, product codes, options and quantities remain connected as the requirement moves toward quotation.",
      ar: "تبقى العائلات ورموز المنتجات والخيارات والكميات مترابطة أثناء انتقال المتطلبات إلى مرحلة عرض السعر."
    }
  }
]
```

### Products

```ts
products: [
  {
    eyebrow: { en: "Medical devices", ar: "الأدوات الطبية" },
    title: { en: "Find the instrument you need with less friction.", ar: "اعثر على الأداة المطلوبة بخطوات أوضح." },
    copy: {
      en: "Search the catalogue, narrow by instrument family and open the exact product details before adding an item to your inquiry.",
      ar: "ابحث في الكتالوج، وحدد عائلة الأدوات، وافتح تفاصيل المنتج قبل إضافته إلى استفسارك."
    }
  },
  {
    eyebrow: { en: "Product discovery", ar: "استعراض المنتجات" },
    title: { en: "Names, codes and options in one searchable view.", ar: "الأسماء والرموز والخيارات في عرض واحد قابل للبحث." },
    copy: {
      en: "Use product names, codes, families and listed options to narrow the catalogue without losing context.",
      ar: "استخدم أسماء المنتجات ورموزها وعائلاتها وخياراتها المدرجة لتضييق نتائج الكتالوج دون فقدان السياق."
    }
  },
  {
    eyebrow: { en: "Product details", ar: "تفاصيل المنتج" },
    title: { en: "Review the product before building your request.", ar: "راجع المنتج قبل إضافته إلى طلبك." },
    copy: {
      en: "Open the product page to review identification, available configuration details and the quotation inquiry action.",
      ar: "افتح صفحة المنتج لمراجعة بياناته وخياراته المدرجة وإضافته إلى استفسار عرض السعر."
    }
  },
  {
    eyebrow: { en: "Technical catalogues", ar: "الكتالوجات التقنية" },
    title: { en: "Open or download the family catalogue directly.", ar: "افتح كتالوج العائلة أو نزّله مباشرة." },
    copy: {
      en: "Each product category connects to its existing Rosa technical catalogue for document-led review.",
      ar: "ترتبط كل فئة منتجات بكتالوج روزا التقني الخاص بها للمراجعة المباشرة عبر الوثيقة."
    }
  }
]
```

### Inquiry

```ts
inquiry: [
  {
    eyebrow: { en: "Quotation inquiry", ar: "استفسار عرض السعر" },
    title: { en: "Build one clear instrument request.", ar: "أنشئ طلب أدوات واحدًا وواضحًا." },
    copy: {
      en: "Bring selected products together in one inquiry before sending the requirement to Rosa for quotation review.",
      ar: "اجمع المنتجات المحددة في استفسار واحد قبل إرسال المتطلبات إلى روزا لمراجعة عرض السعر."
    }
  },
  {
    eyebrow: { en: "Review selections", ar: "مراجعة الاختيارات" },
    title: { en: "Keep product identity and configuration visible.", ar: "احتفظ ببيانات المنتج وخياراته واضحة." },
    copy: {
      en: "Review each selected instrument, code, size and listed variant before you continue.",
      ar: "راجع كل أداة محددة ورمزها ومقاسها وخيارها المدرج قبل المتابعة."
    }
  },
  {
    eyebrow: { en: "Quantities and notes", ar: "الكميات والملاحظات" },
    title: { en: "Refine the requirement before submission.", ar: "اضبط المتطلبات قبل الإرسال." },
    copy: {
      en: "Adjust quantities and add line notes so the quotation request carries the information you intend to send.",
      ar: "عدّل الكميات وأضف ملاحظات البنود حتى يتضمن طلب عرض السعر المعلومات التي تريد إرسالها."
    }
  },
  {
    eyebrow: { en: "Request a quotation", ar: "طلب عرض سعر" },
    title: { en: "Move from selected products to one organised request.", ar: "انتقل من المنتجات المحددة إلى طلب واحد منظم." },
    copy: {
      en: "When the inquiry list is ready, continue to the existing quotation form to submit the requirement.",
      ar: "عندما تكتمل قائمة الاستفسار، انتقل إلى نموذج عرض السعر الحالي لإرسال المتطلبات."
    }
  }
]
```

### Contact Us

```ts
contact: [
  {
    eyebrow: { en: "Contact Rosa", ar: "تواصل مع روزا" },
    title: { en: "Talk directly about your instrument requirements.", ar: "تواصل مباشرة بشأن متطلبات الأدوات." },
    copy: {
      en: "Use Rosa's central contact channels for product, catalogue and quotation support.",
      ar: "استخدم قنوات التواصل المركزية لدى روزا لدعم المنتجات والكتالوجات وعروض الأسعار."
    }
  },
  {
    eyebrow: { en: "Product support", ar: "دعم المنتجات" },
    title: { en: "Need help identifying the right product route?", ar: "هل تحتاج مساعدة في تحديد مسار المنتج المناسب؟" },
    copy: {
      en: "Share the instrument family, product code or requirement details you already have and continue the discussion from there.",
      ar: "شارك عائلة الأداة أو رمز المنتج أو تفاصيل المتطلبات المتوفرة لديك لمتابعة التواصل منها."
    }
  },
  {
    eyebrow: { en: "Catalogue support", ar: "دعم الكتالوج" },
    title: { en: "Connect the document reference to your inquiry.", ar: "اربط مرجع الكتالوج باستفسارك." },
    copy: {
      en: "If you are working from a Rosa catalogue, include the relevant family or product reference in your message.",
      ar: "إذا كنت تعمل من كتالوج روزا، أضف عائلة الأداة أو مرجع المنتج ذي الصلة إلى رسالتك."
    }
  },
  {
    eyebrow: { en: "Quotation support", ar: "دعم عرض السعر" },
    title: { en: "Continue with a clear requirement.", ar: "تابع بمتطلبات واضحة." },
    copy: {
      en: "For structured multi-product requirements, build an inquiry first or contact Rosa directly for support.",
      ar: "للمتطلبات المنظمة التي تشمل عدة منتجات، أنشئ استفسارًا أولًا أو تواصل مع روزا مباشرة للدعم."
    }
  }
]
```

---

### Task 1: Define reusable public hero contracts and data

**Files:**
- Create: `apps/web/src/features/public-hero/public-hero.types.ts`
- Create: `apps/web/src/features/public-hero/public-hero.data.ts`
- Create: `apps/web/src/features/public-hero/index.ts`
- Test: `apps/web/src/test/public-hero-shared-shell.test.tsx`

**Interfaces:**

```ts
export type PublicHeroPageKey = "home" | "about" | "products" | "inquiry" | "contact";
export type PublicHeroCopySide = "left" | "right";
export type PublicHeroTone = "dark" | "light";

export interface LocalizedHeroText { en: string; ar: string }

export interface PublicHeroMedia {
  id: string;
  desktopSrc: string;
  desktopAvifSrc: string;
  mobileSrc: string;
  alt: LocalizedHeroText;
  desktopFocalPoint: string;
  mobileFocalPoint: string;
  copySide: PublicHeroCopySide;
  tone: PublicHeroTone;
}

export interface PublicHeroCopy {
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

export function getLocalizedPublicHeroSlides(
  page: PublicHeroPageKey,
  locale: PublicLocale
): readonly LocalizedPublicHeroSlide[];
```

- [ ] **Step 1: Write RED contract**

```ts
it("defines five four-slide profiles with the approved media paths", () => {
  const data = source("src/features/public-hero/public-hero.data.ts");
  for (const page of ["home", "about", "products", "inquiry", "contact"]) {
    expect(data).toContain(`${page}: [`);
  }
  for (let index = 1; index <= 4; index += 1) {
    expect(data).toContain(`hero-0${index}-desktop.webp`);
    expect(data).toContain(`hero-0${index}-desktop.avif`);
    expect(data).toContain(`hero-0${index}-mobile.webp`);
  }
  expect(data).not.toContain("ctas:");
});
```

- [ ] **Step 2: Run RED**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
```

Expected: FAIL because `public-hero.data.ts` does not exist.

- [ ] **Step 3: Implement the exact media and copy matrices above**

`getLocalizedPublicHeroSlides()` maps the four media records to the four copy records for the selected page and localizes `alt`, `eyebrow`, `title`, and `copy` by `locale === "ar" ? "ar" : "en"`. Throw at module initialization if any profile length differs from the media length.

- [ ] **Step 4: Export the feature API**

```ts
export * from "./public-hero.types";
export * from "./public-hero.data";
export * from "./public-hero-carousel";
```

- [ ] **Step 5: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
git add apps/web/src/features/public-hero apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "refactor(web): define shared public hero profiles"
```

### Task 2: Extract the proven carousel into `PublicHeroCarousel`

**Files:**
- Create: `apps/web/src/features/public-hero/public-hero-carousel.tsx`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`
- Reference: `apps/web/src/features/homepage/sections/home-hero-carousel.tsx`
- Reference: `apps/web/src/features/homepage/hero-carousel-state.ts`

**Interface:**

```tsx
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

- [ ] **Step 1: Add RED assertions**

```ts
const carousel = source("src/features/public-hero/public-hero-carousel.tsx");
expect(carousel).toContain("page: PublicHeroPageKey");
expect(carousel).toContain("getLocalizedPublicHeroSlides(page, locale)");
expect(carousel).not.toContain("slide.ctas");
expect(carousel).not.toContain("hero__actions");
```

- [ ] **Step 2: Run RED**

- [ ] **Step 3: Copy the existing carousel mechanics with only naming/data changes**

Preserve exactly:

- `DRAG_THRESHOLD_PX = 48`;
- `HERO_AUTOPLAY_MS`, `nextHeroSlideIndex`, `previousHeroSlideIndex`, `shouldHeroAutoplay`;
- document visibility pause;
- focus pause;
- pointer swipe threshold/direction;
- next image preload + `decode()` fallback;
- roving dot tab index and ArrowLeft/ArrowRight keyboard behavior;
- reduced-motion autoplay suppression;
- responsive `<picture>` order: mobile WebP → desktop AVIF → desktop WebP;
- Motion duration/easing values;
- focal-point CSS variables.

Shared root:

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

The active slide `h1` uses `id={headingId}`.

- [ ] **Step 4: Run GREEN and commit**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
git add apps/web/src/features/public-hero/public-hero-carousel.tsx apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "refactor(web): extract shared public hero carousel"
```

### Task 3: Move Home onto the shared carousel

**Files:**
- Modify: `apps/web/src/features/homepage/homepage.tsx`
- Delete only after grep: `apps/web/src/features/homepage/sections/home-hero-carousel.tsx`
- Delete only after grep: `apps/web/src/features/homepage/home-hero-slides.ts`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`

- [ ] **Step 1: Add RED assertion**

```ts
const home = source("src/features/homepage/homepage.tsx");
expect(home).toContain("PublicHeroCarousel");
expect(home).toContain('page="home"');
```

- [ ] **Step 2: Replace render**

```tsx
<PublicHeroCarousel page="home" locale={locale} headingId="home-title" />
```

Keep all middle Home content unchanged.

- [ ] **Step 3: Prove old files are unused before deleting**

```bash
git grep -n "HomeHeroCarousel\|HOME_HERO_SLIDES\|localizeHomeHeroSlide" -- apps/web/src
```

Delete only if grep returns no remaining dependency outside the files being removed.

- [ ] **Step 4: Run tests and commit**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web test -- src/test/client-review-round-2026-08-22.test.ts
git add apps/web/src/features/homepage apps/web/src/features/public-hero apps/web/src/test
git commit -m "refactor(web): move Home onto shared public hero"
```

### Task 4: Apply the shared banner to About, Products, Inquiry, Contact

**Files:**
- Modify: `apps/web/src/features/about/about-page.tsx`
- Modify: `apps/web/src/features/products/products-overview.tsx`
- Modify: `apps/web/src/features/inquiry/inquiry-page.tsx`
- Modify: `apps/web/src/features/contact-preview/contact-page.tsx`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`

- [ ] **Step 1: Add page contract**

```ts
const cases = [
  ["src/features/about/about-page.tsx", 'page="about"'],
  ["src/features/products/products-overview.tsx", 'page="products"'],
  ["src/features/inquiry/inquiry-page.tsx", 'page="inquiry"'],
  ["src/features/contact-preview/contact-page.tsx", 'page="contact"']
] as const;
for (const [path, prop] of cases) {
  const page = source(path);
  expect(page).toContain("PublicHeroCarousel");
  expect(page).toContain(prop);
}
```

- [ ] **Step 2: Insert as first page-level section**

```tsx
<PublicHeroCarousel page="about" locale={locale} headingId="about-public-hero-title" />
<PublicHeroCarousel page="products" locale={locale} headingId="products-public-hero-title" />
<PublicHeroCarousel page="contact" locale={locale} headingId="contact-public-hero-title" />
```

Inquiry uses its existing pathname-derived locale and:

```tsx
<PublicHeroCarousel
  page="inquiry"
  locale={ar ? "ar" : "en"}
  headingId="inquiry-public-hero-title"
/>
```

Do not add page-local header/footer/contact strips.

- [ ] **Step 3: Run focused test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
git add apps/web/src/features/about apps/web/src/features/products apps/web/src/features/inquiry apps/web/src/features/contact-preview apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "feat(web): apply shared banner to main public pages"
```

### Task 5: Extract shared hero styling

**Files:**
- Create: `apps/web/src/styles/public-hero.css`
- Modify: `apps/web/src/styles/home-client-redesign.css`
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`

- [ ] **Step 1: Add RED stylesheet assertion**

```ts
const globals = source("src/app/globals.css");
expect(globals).toContain('@import "../styles/public-hero.css";');
```

- [ ] **Step 2: Move only carousel-generic rules**

Move media/picture/overlay/content/copy/dots/dot-state/focal/responsive/reduced-motion rules to `public-hero.css`. Keep Home middle-section rules in `home-client-redesign.css`.

The shared hero image fills its frame with `object-fit: cover`; animation uses transform/opacity only. Reduced-motion removes entry transforms and leaves content immediately readable.

- [ ] **Step 3: Grep for stale Home-only carousel selectors**

```bash
git grep -n "home-hero-carousel" -- apps/web/src/styles apps/web/src/features
```

Any remaining occurrence must be either intentionally transitional or removed before this task exits.

- [ ] **Step 4: Run test and commit**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
git add apps/web/src/styles apps/web/src/app/globals.css apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "refactor(web): share public hero styling"
```

### Task 6: Lock shell-level header/footer behavior

**Files:**
- Modify only if necessary: `apps/web/src/components/layout/public-shell.tsx`
- Modify: `apps/web/src/test/public-hero-shared-shell.test.tsx`

- [ ] **Step 1: Add shell contract**

```ts
const shell = source("src/components/layout/public-shell.tsx");
const primary = shell.slice(shell.indexOf("const primaryLinks"), shell.indexOf("const utilityLinks"));
for (const href of ["/", "/about", "/products", "/inquiry", "/contact"]) {
  expect(primary).toContain(`"${href}"`);
}
expect(primary).not.toContain("/catalogues");
expect(primary).not.toContain("/search");
expect(shell.match(/<PublicContactStrip \/>/g)?.length).toBe(1);
expect(shell.indexOf("<PublicContactStrip />")).toBeGreaterThan(shell.indexOf("</main>"));
expect(shell.indexOf("<footer")).toBeGreaterThan(shell.indexOf("<PublicContactStrip />"));
```

- [ ] **Step 2: Preserve existing implementation when already green**

Do not rewrite `PublicShell` simply because this plan mentions it. Only add an Inquiry count presentation if a focused client requirement/review demands it; current five-link route structure and shell-level footer ordering are already correct.

- [ ] **Step 3: Run focused test**

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
```

- [ ] **Step 4: Commit only if production shell changed**

```bash
git add apps/web/src/components/layout/public-shell.tsx apps/web/src/test/public-hero-shared-shell.test.tsx
git commit -m "feat(web): lock shared public shell consistency"
```

## Subplan Exit Gate

```bash
pnpm --filter @rosa/web test -- src/test/public-hero-shared-shell.test.tsx
pnpm --filter @rosa/web typecheck
```

Browser verification of the five-route shared hero/shell matrix happens in `2026-08-22-public-redesign-integration-verification.md`.