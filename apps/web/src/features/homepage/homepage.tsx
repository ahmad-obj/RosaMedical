import type { ReactElement } from "react";
import { createHomePageModel } from "./homepage.data";
import type { PublicLocale } from "@/features/localization";
import { HomeHeroCarousel } from "./sections/home-hero-carousel";
import { FamilyDiscovery } from "./sections/family-discovery";
import { QuotationCta } from "./sections/quotation-cta";
import {
  ClientSuccessAssurance,
  ComprehensivePlans,
  HomeContactBand,
  SecuringConfidence
} from "./sections/client-home-sections";

export function Homepage({ locale = "en" }: { locale?: PublicLocale }): ReactElement {
  const model = createHomePageModel(locale);

  return (
    <div className="public-page public-page--home">
      <HomeHeroCarousel locale={locale} />
      <FamilyDiscovery intro={model.familyIntro} families={model.families} locale={locale} />
      <ComprehensivePlans model={model.comprehensive} />
      <SecuringConfidence model={model.confidence} />
      <HomeContactBand model={model.contactBand} />
      <ClientSuccessAssurance model={model.assurance} />
      <QuotationCta model={model.quotation} />
    </div>
  );
}
