import type { ReactElement } from "react";
import { getFeaturedCatalogueProducts } from "@/features/catalogue-live";
import { createHomePageModel } from "./homepage.data";
import type { PublicLocale } from "@/features/localization";
import { HomeHeroCarousel } from "./sections/home-hero-carousel";
import { FamilyDiscovery } from "./sections/family-discovery";
import { ProcurementSupport } from "./sections/procurement-support";
import { FeaturedInstruments } from "./sections/featured-instruments";
import { CatalogueAccess } from "./sections/catalogue-access";

export async function Homepage({ locale = "en" }: { locale?: PublicLocale }): Promise<ReactElement> {
  const products = await getFeaturedCatalogueProducts();
  const model = createHomePageModel(products, locale);
  return (
    <div className="public-page public-page--home">
      <HomeHeroCarousel locale={locale} />
      <FamilyDiscovery intro={model.familyIntro} families={model.families} locale={locale} />
      <ProcurementSupport model={model.procurement} />
      <FeaturedInstruments intro={model.productsIntro} products={model.products} />
      <CatalogueAccess model={model.catalogue} locale={locale} />
    </div>
  );
}
