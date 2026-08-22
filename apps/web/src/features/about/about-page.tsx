import type { ReactElement } from "react";
import type { PublicLocale } from "@/features/localization";
import { PublicHeroCarousel } from "@/features/public-hero";
import { createAboutPageModel } from "./about.data";
import { AboutCompliance } from "./sections/about-compliance";
import { AboutContactBand } from "./sections/about-contact-band";
import { AboutDocuments } from "./sections/about-documents";
import { AboutIntroduction } from "./sections/about-introduction";
import { AboutQuotationCta } from "./sections/about-quotation-cta";
import { AboutStorySection } from "./sections/about-story-section";

export function AboutPage({ locale = "en" }: { locale?: PublicLocale }): ReactElement {
  const model = createAboutPageModel(locale);

  return (
    <div className="public-page public-page--about">
      <PublicHeroCarousel page="about" locale={locale} headingId="about-public-hero-title" />
      <AboutIntroduction model={model.introduction} />
      {model.stories.map((story) => (
        <AboutStorySection key={story.id} model={story} />
      ))}
      <AboutContactBand model={model.contact} />
      <AboutCompliance model={model.compliance} />
      <AboutDocuments documents={model.documents} locale={locale} />
      <AboutQuotationCta model={model.quotation} />
    </div>
  );
}
