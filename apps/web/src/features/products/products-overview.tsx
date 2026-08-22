import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { getPublicCatalogueProducts } from "@/features/catalogue-live";
import type { PublicLocale } from "@/features/localization";
import { PublicHeroCarousel } from "@/features/public-hero";
import { SectionHeading } from "@/features/public-catalogue";
import { createProductsPageModel } from "./products.data";
import { CatalogueSupport } from "./sections/catalogue-support";
import { ProductsDirectContactBand } from "./sections/products-direct-contact-band";
import { ProductsDiscoveryWorkspace } from "./sections/products-discovery-workspace";
import { ProductsProcurementCta } from "./sections/products-procurement-cta";

export async function ProductsOverview({ locale = "en" }: { locale?: PublicLocale }): Promise<ReactElement> {
  const products = await getPublicCatalogueProducts();
  const model = createProductsPageModel(products, locale);

  return (
    <div className="public-page public-page--products">
      <PublicHeroCarousel page="products" locale={locale} headingId="products-public-hero-title" />

      <Section tone="paper" className="products-discovery-section" data-section="products-discovery">
        <Container size="wide">
          <SectionHeading
            id="products-discovery-title"
            level={2}
            eyebrow={model.productsIntro.eyebrow}
            title={model.productsIntro.title}
            copy={model.productsIntro.copy}
          />
          <ProductsDiscoveryWorkspace
            products={model.products}
            families={model.families}
            locale={locale}
          />
        </Container>
      </Section>

      <ProductsDirectContactBand locale={locale} />
      <CatalogueSupport model={model.catalogue} />
      <ProductsProcurementCta model={model.procurement} />
    </div>
  );
}
